"""
Main FastAPI application for Supply Metrics Optimax
Implements lightweight, stateless API endpoints for supply chain optimization
100% open-source implementation with minimal dependencies
"""
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid
import os
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging
from pydantic import BaseModel

# Import our optimization modules
from ..models.routing import RouteOptimizer
from ..models.facility_location import FacilityLocationOptimizer
from ..models.demand_forecasting import DemandForecaster
from ..services.data_cleaner import record_activity, get_expiry_warning, start_data_cleaner
from backend.models.chatbot import get_chatbot_response

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("supply_api")

# Create FastAPI application
app = FastAPI(
    title="Supply Metrics Optimax API",
    description="Open source supply chain optimization API for Kenya",
    version="1.0.0"
)

# Add CORS middleware to allow cross-origin requests (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create instances of our optimization classes
# These will be lightweight until actually used
route_optimizer = RouteOptimizer()
facility_optimizer = FacilityLocationOptimizer()
demand_forecaster = DemandForecaster()

# ----- Request/Response Models -----

class UserSession(BaseModel):
    """User session data model"""
    user_id: str = Field(..., description="Unique identifier for the user")
    created_at: datetime = Field(default_factory=datetime.now)

class LocationPoint(BaseModel):
    """Geographic location model"""
    id: str = Field(..., description="Unique identifier for the location")
    name: str = Field(..., description="Name of the location")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    location_type: str = Field(default="node", description="Type of location (node, warehouse, etc.)")
    capacity: Optional[float] = Field(default=None, description="Capacity of the location if applicable")

class RouteOptimizationRequest(BaseModel):
    """Request model for route optimization"""
    locations: List[LocationPoint] = Field(..., description="List of locations to visit")
    origin_id: str = Field(..., description="ID of the starting location")
    vehicle_count: Optional[int] = Field(default=1, description="Number of vehicles available")
    max_distance: Optional[float] = Field(default=None, description="Maximum distance per vehicle")
    return_to_origin: bool = Field(default=True, description="Whether vehicles should return to origin")
    optimize_for: str = Field(default="distance", description="Optimization objective (distance, time, cost)")

class ForecastRequest(BaseModel):
    """Request model for demand forecasting"""
    product_id: str = Field(..., description="Product identifier")
    historical_data: List[Dict[str, Any]] = Field(..., description="Historical demand data")
    forecast_periods: int = Field(default=30, description="Number of periods to forecast")
    include_components: bool = Field(default=False, description="Whether to include forecast components")

class FacilityLocationRequest(BaseModel):
    """Request model for facility location optimization"""
    demand_points: List[LocationPoint] = Field(..., description="Points where demand exists")
    candidate_facilities: List[LocationPoint] = Field(..., description="Candidate facility locations")
    existing_facilities: List[LocationPoint] = Field(default=[], description="Existing facility locations")
    p: int = Field(..., description="Number of facilities to locate")
    weights: Optional[List[float]] = Field(default=None, description="Demand weights for each point")

# ----- Helper Functions -----

def get_user_id(request: Request, x_user_id: Optional[str] = Header(None)):
    """Extract or generate user ID from request"""
    if x_user_id:
        return x_user_id
    
    # Use client IP as fallback identifier
    client_host = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    
    # Create a deterministic ID based on client info
    # This avoids creating multiple IDs for the same user
    unique_id = f"{client_host}:{user_agent}"
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, unique_id))

def record_user_activity(user_id: str, background_tasks: BackgroundTasks):
    """Record user activity in the background"""
    background_tasks.add_task(record_activity, user_id)

# ----- API Routes -----

@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup"""
    # Start the data cleaner service
    start_data_cleaner()
    logger.info("Supply Metrics Optimax API started")

@app.get("/")
async def root():
    """API root endpoint with status information"""
    return {
        "status": "online",
        "service": "Supply Metrics Optimax API",
        "version": "1.0.0",
        "license": "Open Source"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers"""
    return {"status": "healthy"}

@app.post("/session")
async def create_session(background_tasks: BackgroundTasks, 
                         request: Request):
    """Create new user session"""
    user_id = get_user_id(request)
    record_user_activity(user_id, background_tasks)
    
    return UserSession(
        user_id=user_id,
        created_at=datetime.now()
    )

@app.get("/session/{user_id}/status")
async def session_status(user_id: str, 
                         background_tasks: BackgroundTasks,
                         request: Request):
    """Get session status including time remaining before data deletion"""
    # Record activity to reset timer
    record_user_activity(user_id, background_tasks)
    
    # Get expiry warning information
    warning = get_expiry_warning(user_id)
    
    return {
        "user_id": user_id,
        "active": True,
        "warning": warning
    }

@app.post("/optimize/route")
async def optimize_route(request_data: RouteOptimizationRequest,
                         background_tasks: BackgroundTasks,
                         request: Request):
    """Optimize delivery or collection routes"""
    user_id = get_user_id(request)
    record_user_activity(user_id, background_tasks)
    
    # Extract locations to visit
    locations = [(loc.id, loc.name, (loc.latitude, loc.longitude)) for loc in request_data.locations]
    
    try:
        # Find shortest path using OR-Tools (implementation in routing.py)
        start_time = time.time()
        routes, stats = route_optimizer.optimize(
            locations=locations,
            origin_id=request_data.origin_id,
            num_vehicles=request_data.vehicle_count,
            max_distance=request_data.max_distance,
            return_to_depot=request_data.return_to_origin
        )
        processing_time = time.time() - start_time
        
        return {
            "success": True,
            "routes": routes,
            "total_distance": stats["total_distance"],
            "max_route_distance": stats["max_route_distance"],
            "processing_time_seconds": processing_time,
            "warning": get_expiry_warning(user_id)
        }
    except Exception as e:
        logger.error(f"Route optimization error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Optimization error: {str(e)}")

@app.post("/optimize/facility")
async def optimize_facility_locations(request_data: FacilityLocationRequest,
                                      background_tasks: BackgroundTasks,
                                      request: Request):
    """Optimize facility locations to minimize distance to demand points"""
    user_id = get_user_id(request)
    record_user_activity(user_id, background_tasks)
    
    try:
        # Convert request data to required format
        demand_points = [(p.id, p.name, (p.latitude, p.longitude)) for p in request_data.demand_points]
        candidate_facilities = [(p.id, p.name, (p.latitude, p.longitude)) for p in request_data.candidate_facilities]
        existing_facilities = [(p.id, p.name, (p.latitude, p.longitude)) for p in request_data.existing_facilities]
        
        # Run p-median facility location model
        start_time = time.time()
        selected_facilities, assignments, metrics = facility_optimizer.optimize(
            demand_points=demand_points,
            candidate_facilities=candidate_facilities,
            existing_facilities=existing_facilities,
            p=request_data.p,
            weights=request_data.weights
        )
        processing_time = time.time() - start_time
        
        return {
            "success": True,
            "selected_facilities": selected_facilities,
            "assignments": assignments,
            "metrics": metrics,
            "processing_time_seconds": processing_time,
            "warning": get_expiry_warning(user_id)
        }
    except Exception as e:
        logger.error(f"Facility location optimization error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Optimization error: {str(e)}")

@app.post("/forecast/demand")
async def forecast_demand(request_data: ForecastRequest,
                          background_tasks: BackgroundTasks,
                          request: Request):
    """Generate demand forecasts using time series analysis"""
    user_id = get_user_id(request)
    record_user_activity(user_id, background_tasks)
    
    try:
        # Run demand forecasting
        start_time = time.time()
        forecast_result = demand_forecaster.forecast(
            historical_data=request_data.historical_data,
            periods=request_data.forecast_periods,
            include_components=request_data.include_components
        )
        processing_time = time.time() - start_time
        
        return {
            "success": True,
            "forecast": forecast_result["forecast"],
            "confidence_intervals": forecast_result.get("confidence_intervals"),
            "components": forecast_result.get("components") if request_data.include_components else None,
            "metrics": forecast_result.get("metrics"),
            "processing_time_seconds": processing_time,
            "warning": get_expiry_warning(user_id)
        }
    except Exception as e:
        logger.error(f"Demand forecasting error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")

@app.post("/api/chatbot", response_model=Dict[str, Any])
async def chat_with_bot(
    request: Request,
    chat_request: Dict = Body(...),
    user_id: str = Depends(get_user_id)
):
    """
    Process user message using the supply chain chatbot
    
    Args:
        chat_request: Dictionary with 'message' and optional 'context'
        user_id: User ID from session
        
    Returns:
        Chatbot response with text and context information
    """
    # Update user activity timestamp
    data_cleaner.update_user_activity(user_id)
    
    # Extract message and context
    message = chat_request.get("message", "")
    context = chat_request.get("context", None)
    
    # Get response from chatbot
    response = get_chatbot_response(message, context)
    
    # Log interaction (optional)
    logger.info(f"Chatbot interaction - user_id: {user_id}, intent: {response.get('intent')}")
    
    return response

# Run with: uvicorn backend.api.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
