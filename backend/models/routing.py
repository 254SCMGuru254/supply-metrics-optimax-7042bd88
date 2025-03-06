"""
Route optimization module using completely free, open-source libraries (OR-Tools)
Provides optimized delivery routes for supply chain applications
No API keys or paid services required - 100% free and open-source
"""
import math
import time
import logging
import numpy as np
from typing import List, Tuple, Dict, Any, Optional

# Google OR-Tools for Vehicle Routing
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("route_optimizer")

class RouteOptimizer:
    """
    Optimizes delivery routes using Google OR-Tools
    Implements the Vehicle Routing Problem (VRP) solver
    100% free and open-source implementation
    """
    
    def __init__(self):
        """Initialize the route optimizer"""
        logger.info("Initializing Route Optimizer using OR-Tools")
    
    def _calculate_distance_matrix(self, locations: List[Tuple[str, str, Tuple[float, float]]]) -> np.ndarray:
        """
        Calculate distance matrix between all locations using haversine formula
        
        Args:
            locations: List of location tuples (id, name, (lat, lon))
            
        Returns:
            numpy array with distances between all points
        """
        num_locations = len(locations)
        distance_matrix = np.zeros((num_locations, num_locations))
        
        for i in range(num_locations):
            for j in range(num_locations):
                if i == j:
                    distance_matrix[i][j] = 0
                else:
                    # Calculate haversine distance (great-circle distance)
                    lat1, lon1 = locations[i][2]
                    lat2, lon2 = locations[j][2]
                    
                    # Convert degrees to radians
                    lat1, lon1 = math.radians(lat1), math.radians(lon1)
                    lat2, lon2 = math.radians(lat2), math.radians(lon2)
                    
                    # Haversine formula
                    dlat = lat2 - lat1
                    dlon = lon2 - lon1
                    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
                    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
                    
                    # Earth radius in kilometers (use 3959 for miles)
                    earth_radius = 6371
                    distance = earth_radius * c
                    
                    # Store distance in meters for OR-Tools
                    distance_matrix[i][j] = int(distance * 1000)
        
        return distance_matrix
    
    def _find_origin_index(self, locations: List[Tuple[str, str, Tuple[float, float]]], origin_id: str) -> int:
        """Find the index of the origin location in the locations list"""
        for i, (loc_id, _, _) in enumerate(locations):
            if loc_id == origin_id:
                return i
        
        # If origin not found, use first location as default
        logger.warning(f"Origin ID {origin_id} not found in locations. Using first location as origin.")
        return 0
    
    def optimize(self, locations: List[Tuple[str, str, Tuple[float, float]]], 
                origin_id: str,
                num_vehicles: int = 1,
                max_distance: Optional[float] = None,
                return_to_depot: bool = True) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Optimize routes for multiple vehicles
        
        Args:
            locations: List of location tuples (id, name, (lat, lon))
            origin_id: ID of the starting location (depot)
            num_vehicles: Number of vehicles available
            max_distance: Maximum distance per vehicle in kilometers (optional)
            return_to_depot: Whether vehicles should return to origin
            
        Returns:
            tuple (routes, stats) containing:
                routes: List of route dictionaries with waypoints for each vehicle
                stats: Statistics about the solution (distances, times, etc.)
        """
        start_time = time.time()
        
        # Calculate distance matrix between all points
        distance_matrix = self._calculate_distance_matrix(locations)
        
        # Find depot index
        depot_idx = self._find_origin_index(locations, origin_id)
        
        # Create routing model
        manager = pywrapcp.RoutingIndexManager(
            len(locations),  # num locations
            num_vehicles,    # num vehicles
            depot_idx        # depot/start index
        )
        routing = pywrapcp.RoutingModel(manager)
        
        # Define distance callback
        def distance_callback(from_idx, to_idx):
            from_node = manager.IndexToNode(from_idx)
            to_node = manager.IndexToNode(to_idx)
            return distance_matrix[from_node][to_node]
        
        # Register transit callback
        transit_callback_idx = routing.RegisterTransitCallback(distance_callback)
        
        # Set arc cost (distance)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_idx)
        
        # Add distance dimension
        dimension_name = 'Distance'
        routing.AddDimension(
            transit_callback_idx,
            0,     # no slack (waiting time)
            int(max_distance * 1000) if max_distance else 3000000,  # max distance constraint in meters (3000 km default)
            return_to_depot,  # start cumul to zero
            dimension_name
        )
        distance_dimension = routing.GetDimensionOrDie(dimension_name)
        
        # For each vehicle, set distance cost coefficient
        for vehicle_id in range(num_vehicles):
            distance_dimension.SetSpanCostCoefficientForVehicle(100, vehicle_id)
        
        # Set search parameters
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        
        # Use guided local search for better solutions
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        
        # Set time limit (15 seconds)
        search_parameters.time_limit.seconds = 15
        
        # Solve the problem
        logger.info(f"Solving VRP with {len(locations)} locations and {num_vehicles} vehicles")
        solution = routing.SolveWithParameters(search_parameters)
        
        # Extract solution if found
        if solution:
            # Initialize result containers
            routes = []
            total_distance = 0
            max_route_distance = 0
            
            # Process each vehicle route
            for vehicle_id in range(num_vehicles):
                route = []
                route_distance = 0
                index = routing.Start(vehicle_id)
                
                while not routing.IsEnd(index):
                    node_idx = manager.IndexToNode(index)
                    loc_id, loc_name, loc_coords = locations[node_idx]
                    
                    # Add location to route
                    route.append({
                        "id": loc_id,
                        "name": loc_name,
                        "coords": {
                            "lat": loc_coords[0],
                            "lng": loc_coords[1]
                        },
                        "stop_number": len(route)
                    })
                    
                    # Move to next location
                    previous_index = index
                    index = solution.Value(routing.NextVar(index))
                    
                    # Update distance
                    route_distance += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
                
                # Convert distance to kilometers
                route_distance_km = route_distance / 1000
                
                # Add vehicle route if it has stops
                if len(route) > 0:
                    routes.append({
                        "vehicle_id": vehicle_id,
                        "waypoints": route,
                        "distance_km": route_distance_km
                    })
                    
                    # Update statistics
                    total_distance += route_distance_km
                    max_route_distance = max(max_route_distance, route_distance_km)
            
            # Create stats dictionary
            stats = {
                "total_distance": total_distance,
                "max_route_distance": max_route_distance,
                "num_vehicles_used": len(routes),
                "computation_time_ms": int((time.time() - start_time) * 1000)
            }
            
            return routes, stats
        else:
            raise ValueError("No solution found for the routing problem")
    
    def create_route_visualization_data(self, routes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Create GeoJSON data for route visualization on maps
        
        Args:
            routes: Optimized routes from the optimize() method
            
        Returns:
            Dictionary with GeoJSON features for routes and waypoints
        """
        route_features = []
        waypoint_features = []
        
        # Create a distinct color for each route
        colors = [
            "#3388ff", "#ff3388", "#88ff33", "#8833ff",
            "#ff8833", "#33ff88", "#ff3333", "#33ff33",
            "#3333ff", "#ffff33", "#ff33ff", "#33ffff"
        ]
        
        for i, route in enumerate(routes):
            route_color = colors[i % len(colors)]
            waypoints = route["waypoints"]
            
            # Skip empty routes
            if len(waypoints) < 2:
                continue
            
            # Create linestring for route
            coordinates = [[point["coords"]["lng"], point["coords"]["lat"]] for point in waypoints]
            
            # Add route as LineString
            route_features.append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                },
                "properties": {
                    "vehicle_id": route["vehicle_id"],
                    "distance_km": route["distance_km"],
                    "color": route_color
                }
            })
            
            # Add waypoints as Points
            for j, point in enumerate(waypoints):
                is_first = j == 0
                is_last = j == len(waypoints) - 1
                
                waypoint_features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [point["coords"]["lng"], point["coords"]["lat"]]
                    },
                    "properties": {
                        "id": point["id"],
                        "name": point["name"],
                        "stop_number": point["stop_number"],
                        "is_depot": is_first,
                        "is_last": is_last,
                        "vehicle_id": route["vehicle_id"],
                        "color": route_color
                    }
                })
        
        return {
            "route_geojson": {
                "type": "FeatureCollection",
                "features": route_features
            },
            "waypoint_geojson": {
                "type": "FeatureCollection",
                "features": waypoint_features
            }
        }


# Example usage
if __name__ == "__main__":
    # Sample Kenya locations
    sample_locations = [
        ("nairobi", "Nairobi CBD", (-1.2921, 36.8219)),
        ("thika", "Thika Town", (-1.0396, 37.0900)),
        ("machakos", "Machakos Town", (-1.5176, 37.2636)),
        ("kitengela", "Kitengela", (-1.4778, 36.9592)),
        ("athi_river", "Athi River", (-1.4561, 36.9765)),
        ("juja", "Juja", (-1.1036, 37.0144))
    ]
    
    optimizer = RouteOptimizer()
    
    try:
        # Optimize routes with 2 vehicles
        routes, stats = optimizer.optimize(
            locations=sample_locations,
            origin_id="nairobi",
            num_vehicles=2,
            return_to_depot=True
        )
        
        # Print results
        print(f"Total distance: {stats['total_distance']:.2f} km")
        print(f"Max route distance: {stats['max_route_distance']:.2f} km")
        print(f"Number of vehicles used: {stats['num_vehicles_used']}")
        
        for i, route in enumerate(routes):
            print(f"\nRoute for vehicle {i+1}:")
            for stop in route["waypoints"]:
                print(f"  Stop {stop['stop_number']}: {stop['name']}")
            print(f"  Distance: {route['distance_km']:.2f} km")
        
    except Exception as e:
        print(f"Error: {str(e)}")
