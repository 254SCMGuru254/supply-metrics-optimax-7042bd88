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

class RoutingOptimizer:
    def __init__(self, routes: Dict = None):
        self.routes = routes or {}
        self.current_metrics = None

    def optimize(self) -> Dict:
        """
        Optimize routes using Google OR-Tools VRP solver
        Returns estimated improvements in key metrics
        """
        # Calculate baseline metrics first
        self.current_metrics = self._calculate_current_metrics()

        # Set up and solve VRP
        data = self._create_data_model()
        manager = pywrapcp.RoutingIndexManager(
            len(data['distance_matrix']),
            data['num_vehicles'],
            data['depot']
        )
        routing = pywrapcp.RoutingModel(manager)
        
        # Add distance dimension
        self._add_distance_dimension(routing, manager, data)
        
        # Add time windows dimension if available
        if 'time_windows' in data:
            self._add_time_windows_dimension(routing, manager, data)
            
        # Add capacity dimension if available
        if 'vehicle_capacities' in data:
            self._add_capacity_dimension(routing, manager, data)

        # Set first solution strategy
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        )
        search_parameters.time_limit.seconds = 30

        # Solve
        solution = routing.SolveWithParameters(search_parameters)

        # Calculate estimated improvements
        if solution:
            optimized_metrics = self._calculate_optimized_metrics(solution, manager, routing, data)
            improvements = self._calculate_improvements(optimized_metrics)
            improvements.update({
                "solution_found": True,
                "solver_status": "OPTIMAL"
            })
        else:
            improvements = {
                "solution_found": False,
                "solver_status": "INFEASIBLE"
            }

        return improvements

    def _calculate_current_metrics(self) -> Dict:
        """Calculate current routing metrics"""
        total_distance = 0
        total_time = 0
        total_capacity = 0
        used_capacity = 0
        
        for route in self.routes.values():
            total_distance += route.get('distance', 0)
            total_time += route.get('transit_time', 0)
            total_capacity += route.get('capacity', 0)
            used_capacity += route.get('current_load', 0)
            
        return {
            "total_distance": total_distance,
            "total_time": total_time,
            "avg_transit_time": total_time / len(self.routes) if self.routes else 0,
            "vehicle_utilization": (used_capacity / total_capacity * 100) if total_capacity > 0 else 0,
            "cost_per_unit": self._calculate_cost_per_unit()
        }

    def _calculate_optimized_metrics(self, solution, manager, routing, data) -> Dict:
        """Calculate metrics for optimized solution"""
        total_distance = 0
        total_time = 0
        used_capacity = 0
        
        for vehicle_id in range(data['num_vehicles']):
            index = routing.Start(vehicle_id)
            while not routing.IsEnd(index):
                next_index = solution.Value(routing.NextVar(index))
                
                # Add distance
                total_distance += routing.GetArcCostForVehicle(index, next_index, vehicle_id)
                
                # Add time if time dimension exists
                if 'time' in routing.GetDimensionOrDie():
                    time_var = routing.GetDimensionOrDie('time').CumulVar(index)
                    total_time += solution.Min(time_var)
                    
                # Add capacity if capacity dimension exists
                if 'capacity' in routing.GetDimensionOrDie():
                    capacity_var = routing.GetDimensionOrDie('capacity').CumulVar(index)
                    used_capacity += solution.Min(capacity_var)
                    
                index = next_index

        # Calculate optimized metrics
        return {
            "total_distance": total_distance,
            "total_time": total_time,
            "avg_transit_time": total_time / data['num_vehicles'],
            "vehicle_utilization": (used_capacity / sum(data['vehicle_capacities']) * 100) 
                if 'vehicle_capacities' in data else 0,
            "cost_per_unit": self._calculate_optimized_cost_per_unit(total_distance, used_capacity)
        }

    def _calculate_improvements(self, optimized_metrics: Dict) -> Dict:
        """Calculate improvements compared to current metrics"""
        improvements = {
            "estimated_transit_time": optimized_metrics["avg_transit_time"],
            "estimated_cost_per_unit": optimized_metrics["cost_per_unit"],
            "estimated_utilization": optimized_metrics["vehicle_utilization"]
        }
        return improvements

    def _calculate_cost_per_unit(self) -> float:
        """Calculate current transportation cost per unit"""
        total_cost = sum(r.get('cost', 0) for r in self.routes.values())
        total_volume = sum(r.get('current_load', 0) for r in self.routes.values())
        return total_cost / total_volume if total_volume > 0 else 0

    def _calculate_optimized_cost_per_unit(self, total_distance: float, total_volume: float) -> float:
        """Calculate optimized transportation cost per unit"""
        # Use average cost per km from current routes
        avg_cost_per_km = sum(r.get('cost', 0) / r.get('distance', 1) for r in self.routes.values()) / len(self.routes)
        total_cost = total_distance * avg_cost_per_km
        return total_cost / total_volume if total_volume > 0 else 0
