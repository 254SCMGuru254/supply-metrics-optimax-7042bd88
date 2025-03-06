"""
Routing Optimization Module

This module implements various routing optimization algorithms
for supply chain logistics, including:
- Real-time routing with dynamic travel times
- Multi-modal route planning
- Vehicle routing with time windows

References:
- Toth & Vigo (2014). "Vehicle Routing: Problems, Methods, and Applications"
"""

import numpy as np
import pulp as pl
import time
from typing import Dict, List, Tuple, Any, Optional


class RoutingOptimizer:
    """
    A class implementing various routing optimization algorithms
    for supply chain logistics.
    """
    
    def __init__(self, routes: Dict[str, Dict], vehicles: Optional[Dict[str, Dict]] = None):
        """
        Initialize the routing optimizer.
        
        Args:
            routes: Dictionary of routes with their properties
                Format: {route_id: {"origin": str, "destination": str, "transit_time": float, "distance": float, "mode": str}}
            vehicles: Optional dictionary of vehicles with their properties
                Format: {vehicle_id: {"capacity": float, "cost_per_km": float, "max_duration": float}}
        """
        self.routes = routes
        self.vehicles = vehicles or {}
        
    def optimize_routes_real_time(self, time_window: float = 60, 
                                 traffic_factor: float = 0.2) -> Dict[str, Any]:
        """
        Real-time routing optimization based on Toth & Vigo (2014)
        Considers dynamic travel times and real-time updates.
        
        Args:
            time_window: Maximum allowable total travel time
            traffic_factor: Factor representing traffic variability (0-1)
            
        Returns:
            Dictionary containing optimization results:
            {
                "optimized_routes": {route_id: is_selected},
                "dynamic_times": {route_id: travel_time},
                "execution_time": float
            }
        """
        # Track route execution times
        start_time = time.time()
        
        # Initialize dynamic travel times with random variations
        dynamic_times = {}
        for route_id, route in self.routes.items():
            base_time = route["transit_time"]
            variation = np.random.normal(0, traffic_factor * base_time)
            dynamic_times[route_id] = max(0.1, base_time + variation)

        # Create real-time optimization model
        model = pl.LpProblem("RealTimeRouting", pl.LpMinimize)

        # Decision variables for route selection
        route_use = {}
        for r in self.routes.keys():
            route_use[r] = pl.LpVariable(f"route_use_{r}", cat=pl.LpBinary)

        # Objective: Minimize total travel time with real-time updates
        model += pl.lpSum([route_use[r] * dynamic_times[r] for r in self.routes])
        
        # Time window constraints
        model += pl.lpSum([route_use[r] * dynamic_times[r] for r in self.routes]) <= time_window
        
        # Additional constraints like route connectivity if needed
        # For instance, ensuring that if a route from A to B is selected,
        # then there's a route from B to somewhere else
        
        # If origin-destination pairs exist in routes data
        origins = set(route["origin"] for route in self.routes.values() if "origin" in route)
        destinations = set(route["destination"] for route in self.routes.values() if "destination" in route)
        
        # For network flow conservation, if we have origin-destination pairs
        for node in origins.intersection(destinations):
            # Flow conservation: incoming = outgoing for transit nodes
            incoming_routes = [r for r in self.routes if self.routes[r].get("destination") == node]
            outgoing_routes = [r for r in self.routes if self.routes[r].get("origin") == node]
            
            if incoming_routes and outgoing_routes:
                model += (
                    pl.lpSum([route_use[r] for r in incoming_routes]) == 
                    pl.lpSum([route_use[r] for r in outgoing_routes])
                )

        # Solve with time limit for real-time response
        model.solve(pl.PULP_CBC_CMD(timeLimit=10, msg=False))  # 10 second limit for real-time response

        execution_time = time.time() - start_time
        
        # Extract results
        result = {
            "optimized_routes": {r: pl.value(route_use[r]) > 0.5 for r in self.routes},
            "dynamic_times": dynamic_times,
            "execution_time": execution_time
        }
        
        if model.status == pl.LpStatus.OPTIMAL:
            result["total_travel_time"] = pl.value(model.objective)
            result["status"] = "optimal"
        else:
            result["status"] = "infeasible or time limit reached"
            
        return result
        
    def optimize_multi_modal_routes(self, origin: str, destination: str, 
                                   max_cost: Optional[float] = None, 
                                   max_time: Optional[float] = None,
                                   carbon_weight: float = 0.0) -> Dict[str, Any]:
        """
        Multi-modal route planning with cost, time, and environmental considerations.
        
        Args:
            origin: Origin node ID
            destination: Destination node ID
            max_cost: Maximum allowable cost
            max_time: Maximum allowable time
            carbon_weight: Weight given to carbon emissions in the objective (0-1)
            
        Returns:
            Dictionary containing optimization results
        """
        # Filter applicable routes
        applicable_routes = {}
        for route_id, route in self.routes.items():
            if "origin" in route and "destination" in route:
                applicable_routes[route_id] = route
                
        if not applicable_routes:
            raise ValueError("No routes with origin-destination information available")
        
        # Create nodes from origins and destinations
        all_nodes = set()
        for route in applicable_routes.values():
            all_nodes.add(route["origin"])
            all_nodes.add(route["destination"])
            
        if origin not in all_nodes:
            raise ValueError(f"Origin {origin} not found in available nodes")
            
        if destination not in all_nodes:
            raise ValueError(f"Destination {destination} not found in available nodes")
        
        # Create optimization model
        model = pl.LpProblem("MultiModalRouting", pl.LpMinimize)
        
        # Decision variables: 1 if route is used, 0 otherwise
        use_route = {}
        for r in applicable_routes.keys():
            use_route[r] = pl.LpVariable(f"use_route_{r}", cat=pl.LpBinary)
        
        # Flow variables: amount of flow through each node
        node_flow = {}
        for node in all_nodes:
            node_flow[node] = pl.LpVariable(f"node_flow_{node}")
        
        # Objective: minimize weighted combination of time, cost, and emissions
        time_obj = pl.lpSum([use_route[r] * applicable_routes[r]["transit_time"] 
                          for r in applicable_routes])
        
        cost_obj = pl.lpSum([use_route[r] * applicable_routes[r].get("cost", 0) 
                          for r in applicable_routes])
        
        carbon_obj = pl.lpSum([use_route[r] * applicable_routes[r].get("carbon_emissions", 
                                                                 applicable_routes[r]["distance"] * 0.1)  # Default emission factor
                            for r in applicable_routes])
        
        # Combined objective with weights
        model += time_obj + (1.0 - carbon_weight) * cost_obj + carbon_weight * carbon_obj
        
        # Flow conservation constraints
        for node in all_nodes:
            outgoing = [r for r in applicable_routes if applicable_routes[r]["origin"] == node]
            incoming = [r for r in applicable_routes if applicable_routes[r]["destination"] == node]
            
            # Set node flow value
            if node == origin:
                model += node_flow[node] == 1  # Source node supplies 1 unit
            elif node == destination:
                model += node_flow[node] == -1  # Sink node demands 1 unit
            else:
                model += node_flow[node] == 0  # Transit nodes conserve flow
                
            # Flow conservation: flow leaving = flow entering + node supply/demand
            model += (
                pl.lpSum([use_route[r] for r in outgoing]) - 
                pl.lpSum([use_route[r] for r in incoming]) == 
                node_flow[node]
            )
        
        # Optional constraints on cost and time
        if max_cost is not None:
            model += cost_obj <= max_cost
            
        if max_time is not None:
            model += time_obj <= max_time
            
        # Solve the model
        model.solve(pl.PULP_CBC_CMD(timeLimit=60, msg=False))
        
        # Extract results
        result = {
            "selected_routes": {},
            "modes_used": set(),
            "total_time": None,
            "total_cost": None,
            "carbon_emissions": None
        }
        
        if model.status == pl.LpStatus.OPTIMAL:
            result["selected_routes"] = {
                r: pl.value(use_route[r]) > 0.5 for r in applicable_routes
            }
            
            # Calculate metrics for selected routes
            selected = [r for r in applicable_routes if result["selected_routes"][r]]
            
            result["modes_used"] = {applicable_routes[r].get("mode") for r in selected}
            result["total_time"] = sum(applicable_routes[r]["transit_time"] for r in selected)
            result["total_cost"] = sum(applicable_routes[r].get("cost", 0) for r in selected)
            result["carbon_emissions"] = sum(
                applicable_routes[r].get("carbon_emissions", applicable_routes[r]["distance"] * 0.1)
                for r in selected
            )
            result["status"] = "optimal"
        else:
            result["status"] = "infeasible or unbounded"
            
        return result
        
    def optimize_vehicle_routing_time_windows(self, 
                                             origins: Dict[str, Dict],
                                             destinations: Dict[str, Dict],
                                             available_vehicles: List[str]) -> Dict[str, Any]:
        """
        Optimize vehicle routing with time windows.
        
        Args:
            origins: Dictionary of origin points {id: {"location": tuple, "earliest_departure": float}}
            destinations: Dictionary of destination points {id: {"location": tuple, "time_window": (start, end)}}
            available_vehicles: List of available vehicle IDs from self.vehicles
            
        Returns:
            Dictionary with optimized vehicle routes
        """
        # Validate inputs
        if not self.vehicles or not available_vehicles:
            raise ValueError("No vehicles available for routing")
            
        if not origins or not destinations:
            raise ValueError("Origins and destinations must be provided")
            
        # Create model
        model = pl.LpProblem("VehicleRoutingTimeWindows", pl.LpMinimize)
        
        # Decision variables: 1 if vehicle v travels from i to j, 0 otherwise
        use_arc = {}
        
        # Combine origins and destinations into single set of nodes
        all_nodes = list(origins.keys()) + list(destinations.keys())
        
        # Create combinations of vehicles and arcs
        for v in available_vehicles:
            for i in all_nodes:
                for j in all_nodes:
                    if i != j:  # Can't travel to same node
                        use_arc[(v, i, j)] = pl.LpVariable(f"use_arc_{v}_{i}_{j}", cat=pl.LpBinary)
        
        # Arrival time variables (continuous)
        arrival_time = {}
        for v in available_vehicles:
            for j in all_nodes:
                arrival_time[(v, j)] = pl.LpVariable(f"arrival_time_{v}_{j}", lowBound=0)
        
        # Calculate travel times between all nodes
        travel_times = {}
        for i in all_nodes:
            for j in all_nodes:
                if i != j:
                    # Get node locations
                    loc_i = origins.get(i, destinations.get(i))["location"]
                    loc_j = origins.get(j, destinations.get(j))["location"]
                    
                    # Calculate Euclidean distance
                    dist = np.sqrt((loc_i[0] - loc_j[0])**2 + (loc_i[1] - loc_j[1])**2)
                    
                    # Assume constant speed of 50 km/h
                    travel_times[(i, j)] = dist / 50.0
        
        # Objective: minimize total travel time
        model += pl.lpSum([
            use_arc[(v, i, j)] * travel_times[(i, j)]
            for v in available_vehicles
            for i in all_nodes
            for j in all_nodes
            if i != j and (i, j) in travel_times
        ])
        
        # Constraints
        
        # 1. Each destination must be visited exactly once
        for j in destinations:
            model += pl.lpSum([
                use_arc[(v, i, j)]
                for v in available_vehicles
                for i in all_nodes
                if i != j and (i, j) in travel_times
            ]) == 1
        
        # 2. Each vehicle must leave each node it enters
        for v in available_vehicles:
            for k in all_nodes:
                model += (
                    pl.lpSum([use_arc[(v, i, k)] for i in all_nodes if i != k and (i, k) in travel_times]) ==
                    pl.lpSum([use_arc[(v, k, j)] for j in all_nodes if j != k and (k, j) in travel_times])
                )
        
        # 3. Time window constraints for destinations
        big_M = 10000  # Big-M value for time window constraints
        
        for v in available_vehicles:
            for i in all_nodes:
                for j in destinations:
                    if i != j and (i, j) in travel_times:
                        # If arc is used, arrival time at j must consider travel time from i
                        model += (
                            arrival_time[(v, i)] + travel_times[(i, j)] - 
                            big_M * (1 - use_arc[(v, i, j)]) <= arrival_time[(v, j)]
                        )
            
            # 4. Time window constraints for each destination
            for j in destinations:
                time_window = destinations[j]["time_window"]
                model += arrival_time[(v, j)] >= time_window[0]
                model += arrival_time[(v, j)] <= time_window[1]
        
        # 5. Vehicle capacity constraints
        for v in available_vehicles:
            # Sum of demand for all destinations served by this vehicle
            total_load = pl.lpSum([
                destinations[j].get("demand", 1) * pl.lpSum([
                    use_arc[(v, i, j)] for i in all_nodes if i != j and (i, j) in travel_times
                ])
                for j in destinations
            ])
            
            # Must not exceed vehicle capacity
            model += total_load <= self.vehicles[v]["capacity"]
        
        # Solve the model
        model.solve(pl.PULP_CBC_CMD(timeLimit=120, msg=False))
        
        # Extract results
        results = {
            "vehicle_routes": {},
            "arrival_times": {},
            "status": "infeasible"
        }
        
        if model.status == pl.LpStatus.OPTIMAL:
            for v in available_vehicles:
                # Extract route for each vehicle
                route = []
                current = list(origins.keys())[0]  # Start at first origin
                
                while True:
                    next_nodes = [j for j in all_nodes if j != current and 
                                pl.value(use_arc.get((v, current, j), 0)) > 0.5]
                    
                    if not next_nodes:
                        break
                        
                    next_node = next_nodes[0]
                    route.append((current, next_node))
                    current = next_node
                    
                    # Break if back to origin or no next node
                    if current in origins:
                        break
                
                # Only include non-empty routes
                if route:
                    results["vehicle_routes"][v] = route
                    
                    # Record arrival times
                    results["arrival_times"][v] = {
                        j: pl.value(arrival_time[(v, j)])
                        for j in destinations
                        if pl.value(pl.lpSum([use_arc.get((v, i, j), 0) for i in all_nodes if i != j])) > 0.5
                    }
            
            results["total_cost"] = pl.value(model.objective)
            results["status"] = "optimal"
            
        return results
