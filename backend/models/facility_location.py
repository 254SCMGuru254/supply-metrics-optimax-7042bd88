"""
Facility Location Optimizer Module
100% free, open-source implementation for supply chain network design
Uses PuLP for optimization and NetworkX for network analysis
No commercial dependencies or API keys required
"""
import math
import time
import logging
import numpy as np
import networkx as nx
import pulp as pl
from typing import List, Tuple, Dict, Any, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("facility_location")

class FacilityLocationOptimizer:
    """
    Optimizes facility locations for supply chain networks
    Implements p-median, set-covering, and other facility location models
    100% free and open-source implementation
    """
    
    def __init__(self):
        """Initialize the facility location optimizer"""
        logger.info("Initializing Facility Location Optimizer")
        
    def _calculate_distance_matrix(self, 
                                   demand_points: List[Tuple[str, str, Tuple[float, float]]],
                                   facility_points: List[Tuple[str, str, Tuple[float, float]]]) -> np.ndarray:
        """
        Calculate distance matrix between demand points and potential facility locations
        
        Args:
            demand_points: List of tuples (id, name, (lat, lon)) for demand locations
            facility_points: List of tuples (id, name, (lat, lon)) for potential facility locations
            
        Returns:
            Distance matrix as numpy array with dimensions [demand_points, facility_points]
        """
        distance_matrix = np.zeros((len(demand_points), len(facility_points)))
        
        for i, demand_point in enumerate(demand_points):
            for j, facility_point in enumerate(facility_points):
                # Extract coordinates
                lat1, lon1 = demand_point[2]
                lat2, lon2 = facility_point[2]
                
                # Convert to radians
                lat1, lon1 = math.radians(lat1), math.radians(lon1)
                lat2, lon2 = math.radians(lat2), math.radians(lon2)
                
                # Haversine formula for distance calculation
                dlon = lon2 - lon1
                dlat = lat2 - lat1
                a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
                c = 2 * math.asin(math.sqrt(a))
                r = 6371  # Earth radius in kilometers
                
                # Store distance
                distance_matrix[i][j] = c * r
                
        return distance_matrix
    
    def optimize(self, 
                demand_points: List[Tuple[str, str, Tuple[float, float]]],
                candidate_facilities: List[Tuple[str, str, Tuple[float, float]]],
                existing_facilities: List[Tuple[str, str, Tuple[float, float]]] = None,
                p: int = 1,
                weights: Optional[List[float]] = None) -> Tuple[List[Dict], Dict, Dict]:
        """
        Solve the p-median facility location problem
        
        Args:
            demand_points: List of tuples (id, name, (lat, lon)) for demand locations
            candidate_facilities: List of tuples (id, name, (lat, lon)) for potential facility locations
            existing_facilities: List of tuples (id, name, (lat, lon)) for existing facilities (optional)
            p: Number of facilities to select
            weights: Optional weights for demand points
            
        Returns:
            Tuple containing (selected_facilities, assignments, metrics):
                - selected_facilities: List of selected facility dictionaries
                - assignments: Dictionary mapping demand point IDs to facility IDs
                - metrics: Dictionary with solution metrics
        """
        start_time = time.time()
        
        # Handle default arguments
        existing_facilities = existing_facilities or []
        if weights is None:
            weights = [1.0] * len(demand_points)
        
        # Calculate distance matrix
        distance_matrix = self._calculate_distance_matrix(demand_points, candidate_facilities)
        
        # Create optimization model
        model = pl.LpProblem("FacilityLocation", pl.LpMinimize)
        
        # Decision variables
        # x_j = 1 if we locate a facility at candidate site j, 0 otherwise
        x = {j: pl.LpVariable(f"x_{j}", cat=pl.LpBinary) 
             for j in range(len(candidate_facilities))}
        
        # y_ij = 1 if demand point i is served by facility j, 0 otherwise
        y = {(i, j): pl.LpVariable(f"y_{i}_{j}", cat=pl.LpBinary) 
             for i in range(len(demand_points)) 
             for j in range(len(candidate_facilities))}
        
        # Objective: Minimize weighted distance
        model += pl.lpSum([weights[i] * distance_matrix[i][j] * y[(i, j)]
                        for i in range(len(demand_points))
                        for j in range(len(candidate_facilities))])
        
        # Constraint 1: Each demand point must be assigned to exactly one facility
        for i in range(len(demand_points)):
            model += pl.lpSum([y[(i, j)] for j in range(len(candidate_facilities))]) == 1
        
        # Constraint 2: Demand point can only be assigned to an open facility
        for i in range(len(demand_points)):
            for j in range(len(candidate_facilities)):
                model += y[(i, j)] <= x[j]
        
        # Constraint 3: Open exactly p facilities
        model += pl.lpSum([x[j] for j in range(len(candidate_facilities))]) == p
        
        # Additional constraint if there are existing facilities
        # Force their corresponding x variables to be 1
        if existing_facilities:
            for j, existing in enumerate(candidate_facilities):
                if existing[0] in [ef[0] for ef in existing_facilities]:
                    model += x[j] == 1
        
        # Solve model
        logger.info(f"Solving p-median problem with p={p}, {len(demand_points)} demand points, {len(candidate_facilities)} candidates")
        model.solve(pl.PULP_CBC_CMD(timeLimit=30, msg=False))
        
        # Process results
        if model.status != pl.LpStatusOptimal:
            logger.warning(f"Solver did not reach optimal solution. Status: {pl.LpStatus[model.status]}")
        
        # Extract selected facilities
        selected_indices = [j for j in range(len(candidate_facilities)) if pl.value(x[j]) > 0.5]
        selected_facilities = [
            {
                "id": candidate_facilities[j][0],
                "name": candidate_facilities[j][1],
                "location": {
                    "lat": candidate_facilities[j][2][0],
                    "lng": candidate_facilities[j][2][1]
                },
                "is_existing": candidate_facilities[j][0] in [ef[0] for ef in existing_facilities]
            }
            for j in selected_indices
        ]
        
        # Extract assignments
        assignments = {}
        for i in range(len(demand_points)):
            demand_id = demand_points[i][0]
            for j in range(len(candidate_facilities)):
                if pl.value(y[(i, j)]) > 0.5:
                    facility_id = candidate_facilities[j][0]
                    assignments[demand_id] = {
                        "facility_id": facility_id,
                        "distance": distance_matrix[i][j]
                    }
                    break
        
        # Calculate solution metrics
        total_weighted_distance = pl.value(model.objective)
        avg_distance = sum(asmt["distance"] for asmt in assignments.values()) / len(assignments)
        max_distance = max(asmt["distance"] for asmt in assignments.values()) if assignments else 0
        
        # Create service area boundaries using convex hulls
        service_areas = {}
        
        for facility_idx in selected_indices:
            facility_id = candidate_facilities[facility_idx][0]
            served_points = []
            
            for i in range(len(demand_points)):
                if pl.value(y[(i, j)]) > 0.5:
                    served_points.append(demand_points[i][2])
            
            if len(served_points) >= 3:  # Need at least 3 points for a convex hull
                # Create a matrix of points for computing convex hull
                points = np.array(served_points)
                
                try:
                    from scipy.spatial import ConvexHull
                    hull = ConvexHull(points)
                    hull_points = [points[vertex].tolist() for vertex in hull.vertices]
                    
                    service_areas[facility_id] = hull_points
                except:
                    # Fallback if scipy not available
                    service_areas[facility_id] = served_points
            else:
                service_areas[facility_id] = served_points
        
        # Computation time
        computation_time = time.time() - start_time
        
        # Compile metrics
        metrics = {
            "total_weighted_distance": total_weighted_distance,
            "average_distance": avg_distance,
            "maximum_distance": max_distance,
            "solver_status": pl.LpStatus[model.status],
            "computation_time_seconds": computation_time,
            "objective_value": pl.value(model.objective),
            "service_areas": service_areas
        }
        
        return selected_facilities, assignments, metrics
    
    def create_coverage_map(self, 
                           demand_points: List[Tuple[str, str, Tuple[float, float]]],
                           selected_facilities: List[Dict],
                           assignments: Dict) -> Dict[str, Any]:
        """
        Create GeoJSON data for visualization of coverage areas
        
        Args:
            demand_points: List of demand point tuples
            selected_facilities: List of selected facility dictionaries
            assignments: Assignment dictionary
            
        Returns:
            Dictionary with GeoJSON features for visualization
        """
        # Create colors for different facilities
        colors = [
            "#3388ff", "#ff3388", "#88ff33", "#8833ff",
            "#ff8833", "#33ff88", "#ff3333", "#33ff33", 
            "#3333ff", "#ffff33", "#ff33ff", "#33ffff"
        ]
        
        # Create facility features
        facility_features = []
        for i, facility in enumerate(selected_facilities):
            color = colors[i % len(colors)]
            
            facility_features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [facility["location"]["lng"], facility["location"]["lat"]]
                },
                "properties": {
                    "id": facility["id"],
                    "name": facility["name"],
                    "is_facility": True,
                    "is_existing": facility.get("is_existing", False),
                    "color": color
                }
            })
        
        # Create demand point features
        demand_features = []
        for point in demand_points:
            point_id, point_name, (lat, lon) = point
            
            if point_id in assignments:
                facility_id = assignments[point_id]["facility_id"]
                distance = assignments[point_id]["distance"]
                
                # Find the corresponding facility color
                facility_idx = next((i for i, f in enumerate(selected_facilities) 
                                     if f["id"] == facility_id), 0)
                color = colors[facility_idx % len(colors)]
                
                demand_features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lon, lat]
                    },
                    "properties": {
                        "id": point_id,
                        "name": point_name,
                        "is_facility": False,
                        "assigned_to": facility_id,
                        "distance_km": distance,
                        "color": color
                    }
                })
        
        # Create assignment lines features
        assignment_features = []
        for point in demand_points:
            point_id, _, (lat1, lon1) = point
            
            if point_id in assignments:
                facility_id = assignments[point_id]["facility_id"]
                
                # Find facility coordinates
                facility = next((f for f in selected_facilities if f["id"] == facility_id), None)
                if facility:
                    lat2, lon2 = facility["location"]["lat"], facility["location"]["lng"]
                    
                    # Find facility color
                    facility_idx = next((i for i, f in enumerate(selected_facilities) 
                                         if f["id"] == facility_id), 0)
                    color = colors[facility_idx % len(colors)]
                    
                    assignment_features.append({
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [lon1, lat1],
                                [lon2, lat2]
                            ]
                        },
                        "properties": {
                            "demand_id": point_id,
                            "facility_id": facility_id,
                            "distance_km": assignments[point_id]["distance"],
                            "color": color
                        }
                    })
        
        return {
            "facilities_geojson": {
                "type": "FeatureCollection",
                "features": facility_features
            },
            "demand_geojson": {
                "type": "FeatureCollection",
                "features": demand_features
            },
            "assignments_geojson": {
                "type": "FeatureCollection",
                "features": assignment_features
            }
        }

# Example usage
if __name__ == "__main__":
    # Sample Kenya locations
    demand_points = [
        ("nairobi", "Nairobi CBD", (-1.2921, 36.8219)),
        ("thika", "Thika Town", (-1.0396, 37.0900)),
        ("machakos", "Machakos Town", (-1.5176, 37.2636)),
        ("kitengela", "Kitengela", (-1.4778, 36.9592)),
        ("athi_river", "Athi River", (-1.4561, 36.9765)),
        ("juja", "Juja", (-1.1036, 37.0144)),
        ("limuru", "Limuru", (-1.1118, 36.6428)),
        ("ruiru", "Ruiru", (-1.1463, 36.9695))
    ]
    
    candidate_facilities = [
        ("nrb_depot", "Nairobi Depot", (-1.3054, 36.8201)),
        ("thika_depot", "Thika Depot", (-1.0415, 37.0833)),
        ("athi_depot", "Athi River Depot", (-1.4500, 36.9700)),
        ("juja_depot", "Juja Depot", (-1.1000, 37.0100))
    ]
    
    optimizer = FacilityLocationOptimizer()
    
    try:
        # Optimize with 2 facilities
        selected, assignments, metrics = optimizer.optimize(
            demand_points=demand_points,
            candidate_facilities=candidate_facilities,
            p=2
        )
        
        # Print results
        print("Selected facilities:")
        for facility in selected:
            print(f"  {facility['name']} ({facility['id']})")
        
        print("\nAssignments:")
        for demand_id, assignment in assignments.items():
            facility_id = assignment["facility_id"]
            distance = assignment["distance"]
            demand_name = next((d[1] for d in demand_points if d[0] == demand_id), demand_id)
            facility_name = next((f[1] for f in candidate_facilities if f[0] == facility_id), facility_id)
            print(f"  {demand_name} -> {facility_name} ({distance:.2f} km)")
        
        print(f"\nAverage distance: {metrics['average_distance']:.2f} km")
        print(f"Maximum distance: {metrics['maximum_distance']:.2f} km")
    
    except Exception as e:
        print(f"Error: {str(e)}")
