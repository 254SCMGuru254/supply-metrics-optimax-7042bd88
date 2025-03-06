"""
Kenya Airport Network Integration Module

This module extends the Kenya supply chain model with airport nodes and
air transportation routes using pre-cached data.
"""

import numpy as np
import networkx as nx
from typing import Dict, List, Tuple, Any, Optional
import json
import os
from math import radians, cos, sin, asin, sqrt

class KenyaAirportIntegrator:
    """
    Integrates Kenyan airports into the supply chain network model.
    """
    
    # Kenya airports data (pre-cached)
    KENYA_AIRPORTS = {
        "JKIA": {
            "name": "Jomo Kenyatta International Airport",
            "iata": "NBO",
            "location": (-1.3198, 36.9249),
            "capacity": 500,
            "fixed_cost": 10000,
            "echelon": 3
        },
        "MBA": {
            "name": "Moi International Airport",
            "iata": "MBA",
            "location": (-4.0352, 39.5944),
            "capacity": 300,
            "fixed_cost": 8000,
            "echelon": 3
        },
        "KIS": {
            "name": "Kisumu International Airport",
            "iata": "KIS",
            "location": (-0.0862, 34.7295),
            "capacity": 200,
            "fixed_cost": 5000,
            "echelon": 3
        },
        "EDL": {
            "name": "Eldoret International Airport",
            "iata": "EDL",
            "location": (0.4047, 35.2390),
            "capacity": 200,
            "fixed_cost": 5000,
            "echelon": 3
        },
        "WIL": {
            "name": "Wilson Airport",
            "iata": "WIL",
            "location": (-1.3217, 36.8158),
            "capacity": 100,
            "fixed_cost": 3000,
            "echelon": 2
        }
    }
    
    # Pre-cached air routes
    AIR_ROUTES = [
        ("JKIA", "MBA", 500, 1.0, "air"),
        ("JKIA", "KIS", 350, 0.7, "air"),
        ("JKIA", "EDL", 330, 0.65, "air"),
        ("MBA", "KIS", 580, 1.2, "air"),
        ("JKIA", "WIL", 20, 0.1, "air"),
        ("WIL", "KIS", 360, 0.75, "air"),
        ("WIL", "EDL", 350, 0.7, "air")
    ]
    
    def __init__(self, network_optimizer):
        """
        Initialize the airport integrator.
        
        Args:
            network_optimizer: SupplyChainNetworkOptimizer instance
        """
        self.optimizer = network_optimizer
        
    def integrate_airports(self):
        """
        Add all Kenya airports to the supply chain network.
        """
        # Add each airport as a facility
        for airport_id, airport_data in self.KENYA_AIRPORTS.items():
            facility_id = f"{airport_id}_Airport"
            self.optimizer.add_facility(
                facility_id,
                airport_data["location"],
                airport_data["capacity"],
                airport_data["fixed_cost"],
                airport_data["echelon"]
            )
            
            # Add airport-specific inventory parameters
            # Airports typically have shorter lead times but higher holding costs
            self.optimizer.add_inventory_params(
                facility_id,
                lead_time=1,  # Fast restocking
                review_period=1,  # Daily review
                demand_mean=airport_data["capacity"] * 0.5,  # 50% of capacity as average demand
                demand_std=airport_data["capacity"] * 0.2,   # 20% of capacity as standard deviation
                holding_cost=4.0,  # Higher holding cost at airports
                stockout_cost=40.0  # Very high stockout cost
            )
            
            print(f"Added airport: {facility_id}")
        
        # Add air routes between airports
        for i, (origin, destination, distance, transit_time, mode) in enumerate(self.AIR_ROUTES):
            route_id = f"Air{i+1}"
            origin_id = f"{origin}_Airport"
            destination_id = f"{destination}_Airport"
            
            self.optimizer.add_route(
                route_id,
                origin_id,
                destination_id,
                distance,
                transit_time,
                mode
            )
            
            print(f"Added air route: {route_id} from {origin_id} to {destination_id}")
        
        return self.optimizer
    
    def haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate the great circle distance between two points 
        on the earth (specified in decimal degrees)
        
        Args:
            lat1, lon1: Coordinates of point 1
            lat2, lon2: Coordinates of point 2
            
        Returns:
            Distance in kilometers
        """
        # Convert decimal degrees to radians
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        
        # Haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Radius of earth in kilometers
        return c * r
        
    def connect_airports_to_facilities(self, max_distance_km: float = 50):
        """
        Create road connections between airports and nearby facilities.
        
        Args:
            max_distance_km: Maximum road distance to create connections
        """
        # Get all airports and non-airport facilities
        airports = [f"{airport_id}_Airport" for airport_id in self.KENYA_AIRPORTS]
        facilities = [f for f in self.optimizer.facilities if f not in airports]
        
        # Find nearby facilities for each airport
        connections_created = 0
        for airport_id in airports:
            airport_lat, airport_lon = self.optimizer.facilities[airport_id]["location"]
            
            for facility_id in facilities:
                facility_lat, facility_lon = self.optimizer.facilities[facility_id]["location"]
                
                # Calculate distance
                distance = self.haversine(airport_lat, airport_lon, facility_lat, facility_lon)
                
                # If within range, create a connection
                if distance <= max_distance_km:
                    # Estimate transit time (assuming 50 km/h average speed)
                    transit_time = distance / 50  # Time in hours
                    
                    # Create bidirectional connections
                    route_id1 = f"AirportConn_{airport_id}_to_{facility_id}"
                    route_id2 = f"AirportConn_{facility_id}_to_{airport_id}"
                    
                    self.optimizer.add_route(route_id1, airport_id, facility_id, distance, transit_time, "road")
                    self.optimizer.add_route(route_id2, facility_id, airport_id, distance, transit_time, "road")
                    
                    connections_created += 2
                    print(f"Connected {airport_id} to {facility_id} ({distance:.1f} km)")
        
        print(f"Created {connections_created} airport-facility connections")
        return connections_created
        
    def optimize_air_routes(self, demand_threshold: float = 50):
        """
        Optimize which air routes should be used based on demand patterns.
        
        Args:
            demand_threshold: Minimum demand to justify an air route
            
        Returns:
            List of recommended air routes
        """
        # Get all demand points
        demand_points = self.optimizer.demand_points
        
        # Calculate total demand for each region
        region_demand = {}
        for d_id, d_data in demand_points.items():
            lat, lon = d_data["location"]
            
            # Find closest airport
            closest_airport = None
            min_distance = float('inf')
            
            for airport_id, airport_data in self.KENYA_AIRPORTS.items():
                airport_lat, airport_lon = airport_data["location"]
                distance = self.haversine(lat, lon, airport_lat, airport_lon)
                
                if distance < min_distance:
                    min_distance = distance
                    closest_airport = airport_id
            
            # Add demand to closest airport's region
            if closest_airport not in region_demand:
                region_demand[closest_airport] = 0
            
            region_demand[closest_airport] += d_data["demand_mean"]
        
        # Determine which air routes to use based on demand
        recommended_routes = []
        for origin, destination, distance, transit_time, mode in self.AIR_ROUTES:
            origin_demand = region_demand.get(origin, 0)
            destination_demand = region_demand.get(destination, 0)
            
            # If either origin or destination has enough demand
            if origin_demand >= demand_threshold or destination_demand >= demand_threshold:
                recommended_routes.append({
                    "origin": origin,
                    "destination": destination,
                    "origin_demand": origin_demand,
                    "destination_demand": destination_demand,
                    "total_demand": origin_demand + destination_demand,
                    "distance": distance,
                    "transit_time": transit_time
                })
        
        # Sort by total demand
        recommended_routes.sort(key=lambda x: x["total_demand"], reverse=True)
        
        return recommended_routes
