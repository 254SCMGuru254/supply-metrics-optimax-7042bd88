"""
Facility Location Optimization Module

This module implements various facility location optimization algorithms
for supply chain network design, including:
- Multi-period facility location
- Capacitated facility location
- Green facility location with environmental constraints

References:
- Melo et al. (2009). "A dynamic multi-commodity capacitated facility location problem with service level constraints"
"""

import numpy as np
import pulp as pl
from typing import Dict, List, Tuple, Any


class FacilityLocationOptimizer:
    """
    A class implementing various facility location optimization algorithms
    for optimal supply chain network design.
    """
    
    def __init__(self, facilities: Dict[str, Dict], demand_points: Dict[str, Dict]):
        """
        Initialize the facility location optimizer.
        
        Args:
            facilities: Dictionary of facilities with their properties
                Format: {facility_id: {"location": (lat, lon), "capacity": float, "fixed_cost": float}}
            demand_points: Dictionary of demand points with their properties
                Format: {demand_point_id: {"location": (lat, lon), "demand_mean": float}}
        """
        self.facilities = facilities
        self.demand_points = demand_points
        
    def _calculate_distance(self, loc1: Tuple[float, float], loc2: Tuple[float, float]) -> float:
        """
        Calculate the Euclidean distance between two locations.
        
        Args:
            loc1: Coordinates of the first location (latitude, longitude)
            loc2: Coordinates of the second location (latitude, longitude)
            
        Returns:
            Euclidean distance between the two locations
        """
        return np.sqrt((loc1[0] - loc2[0])**2 + (loc1[1] - loc2[1])**2)
        
    def optimize_facility_location_multi_period(self, periods: int = 12, 
                                               demand_growth_rate: float = 0.05) -> Dict[str, Any]:
        """
        Multi-period facility location optimization following Melo et al. (2009)
        Considers demand evolution and capacity expansion over time.
        
        Args:
            periods: Number of time periods to optimize for
            demand_growth_rate: Annual growth rate of demand
            
        Returns:
            Dictionary containing optimization results:
            {
                "facility_decisions": {period: {facility_id: is_open}},
                "capacity_expansions": {period: {facility_id: expansion_amount}},
                "flows": {period: {(facility_id, demand_point_id): flow_amount}}
            }
        
        Raises:
            ValueError: If no demand points are available for optimization
        """
        if not self.demand_points:
            raise ValueError("No demand points for optimization")

        # Create time-dependent demand scenarios
        period_demands = {}
        for t in range(periods):
            period_demands[t] = {
                d_id: {
                    "mean": d["demand_mean"] * (1 + demand_growth_rate)**t,
                    "location": d["location"]
                }
                for d_id, d in self.demand_points.items()
            }

        # Create optimization model
        model = pl.LpProblem("MultiPeriodFacilityLocation", pl.LpMinimize)

        # Decision variables
        facility_open = {}
        for f in self.facilities:
            for t in range(periods):
                facility_open[(f, t)] = pl.LpVariable(f"facility_open_{f}_{t}", cat=pl.LpBinary)
        
        capacity_expansion = {}
        for f in self.facilities:
            for t in range(periods):
                capacity_expansion[(f, t)] = pl.LpVariable(f"capacity_expansion_{f}_{t}", lowBound=0)
        
        flow = {}
        for f in self.facilities:
            for d in self.demand_points:
                for t in range(periods):
                    flow[(f, d, t)] = pl.LpVariable(f"flow_{f}_{d}_{t}", lowBound=0)
        
        # Objective: Minimize total cost across all periods
        objective = pl.lpSum(
            [self.facilities[f]["fixed_cost"] * facility_open[(f, t)] +
             1000 * capacity_expansion[(f, t)] +  # Expansion cost
             pl.lpSum(
                 [flow[(f, d, t)] * self._calculate_distance(
                     self.facilities[f]["location"],
                     self.demand_points[d]["location"]
                 ) for d in self.demand_points]
             )
             for f in self.facilities for t in range(periods)]
        )
        model += objective
        
        # Capacity constraints with expansions
        for f in self.facilities:
            for t in range(periods):
                model += (
                    pl.lpSum([flow[(f, d, t)] for d in self.demand_points]) <=
                    self.facilities[f]["capacity"] * facility_open[(f, t)] +
                    pl.lpSum([capacity_expansion[(f, tau)] for tau in range(t+1)]),
                    f"capacity_constraint_{f}_{t}"
                )
                
        # Demand satisfaction constraints
        for d in self.demand_points:
            for t in range(periods):
                model += (
                    pl.lpSum([flow[(f, d, t)] for f in self.facilities]) >= 
                    period_demands[t][d]["mean"],
                    f"demand_constraint_{d}_{t}"
                )

        # Solve model
        import time
        start_time = time.time()
        model.solve(pl.PULP_CBC_CMD(timeLimit=300, msg=False))
        solve_time = time.time() - start_time

        # Extract results
        multi_period_results = {
            "facility_decisions": {},
            "capacity_expansions": {},
            "flows": {}
        }
        
        if model.status == pl.LpStatus.OPTIMAL:
            for t in range(periods):
                multi_period_results["facility_decisions"][t] = {
                    f: pl.value(facility_open[(f, t)]) > 0.5 for f in self.facilities
                }
                multi_period_results["capacity_expansions"][t] = {
                    f: pl.value(capacity_expansion[(f, t)]) for f in self.facilities
                }
                
                # Store flows
                multi_period_results["flows"][t] = {
                    (f, d): pl.value(flow[(f, d, t)]) 
                    for f in self.facilities for d in self.demand_points
                    if pl.value(flow[(f, d, t)]) > 0.001  # Only store non-zero flows
                }
                
            multi_period_results["total_cost"] = pl.value(model.objective)
            multi_period_results["solve_time"] = solve_time
            multi_period_results["status"] = "optimal"
        else:
            multi_period_results["status"] = "infeasible or unbounded"

        return multi_period_results
        
    def optimize_green_facility_location(self, carbon_limit: float = 1000.0,
                                        carbon_price: float = 20.0) -> Dict[str, Any]:
        """
        Green facility location optimization with environmental constraints.
        
        Args:
            carbon_limit: Maximum allowable carbon emissions
            carbon_price: Price per unit of carbon emissions
            
        Returns:
            Dictionary containing optimization results
        """
        # Create optimization model
        model = pl.LpProblem("GreenFacilityLocation", pl.LpMinimize)
        
        # Decision variables
        facility_open = {}
        for f in self.facilities:
            facility_open[f] = pl.LpVariable(f"facility_open_{f}", cat=pl.LpBinary)
        
        flow = {}
        for f in self.facilities:
            for d in self.demand_points:
                flow[(f, d)] = pl.LpVariable(f"flow_{f}_{d}", lowBound=0)
        
        # Carbon emissions variable
        carbon_emissions = pl.LpVariable("TotalCarbonEmissions", lowBound=0)
        
        # Objective: Minimize total cost including carbon price
        objective = (
            pl.lpSum(
                [self.facilities[f]["fixed_cost"] * facility_open[f] +
                 pl.lpSum(
                     [flow[(f, d)] * self._calculate_distance(
                         self.facilities[f]["location"],
                         self.demand_points[d]["location"]
                     ) for d in self.demand_points]
                 )
                 for f in self.facilities]
            ) + carbon_price * carbon_emissions
        )
        model += objective
        
        # Define carbon emissions constraint
        # Assuming emissions are proportional to distance traveled
        emission_expr = pl.lpSum(
            [flow[(f, d)] * self._calculate_distance(
                self.facilities[f]["location"],
                self.demand_points[d]["location"]
            ) * 0.1  # Emission factor: 0.1 kg CO2 per km-ton
             for f in self.facilities for d in self.demand_points]
        )
        
        # Constrain total emissions
        model += carbon_emissions == emission_expr, "carbon_emissions_definition"
        model += carbon_emissions <= carbon_limit, "carbon_limit"
        
        # Capacity constraints
        for f in self.facilities:
            model += (
                pl.lpSum([flow[(f, d)] for d in self.demand_points]) <= 
                self.facilities[f]["capacity"] * facility_open[f],
                f"capacity_constraint_{f}"
            )
            
        # Demand satisfaction constraints
        for d in self.demand_points:
            model += (
                pl.lpSum([flow[(f, d)] for f in self.facilities]) >= 
                self.demand_points[d]["demand_mean"],
                f"demand_constraint_{d}"
            )
            
        # Solve model
        import time
        start_time = time.time()
        model.solve(pl.PULP_CBC_CMD(timeLimit=300, msg=False))
        solve_time = time.time() - start_time
        
        # Extract results
        green_results = {
            "facility_decisions": {},
            "flows": {},
            "carbon_emissions": None
        }
        
        if model.status == pl.LpStatus.OPTIMAL:
            green_results["facility_decisions"] = {
                f: pl.value(facility_open[f]) > 0.5 for f in self.facilities
            }
            green_results["flows"] = {
                (f, d): pl.value(flow[(f, d)])
                for f in self.facilities for d in self.demand_points
                if pl.value(flow[(f, d)]) > 0.001  # Only store non-zero flows
            }
            green_results["carbon_emissions"] = pl.value(carbon_emissions)
            green_results["total_cost"] = pl.value(model.objective)
            green_results["solve_time"] = solve_time
            green_results["status"] = "optimal"
        else:
            green_results["status"] = "infeasible or unbounded"
            
        return green_results
