"""
Inventory Optimization Module

This module implements various inventory optimization algorithms
for supply chain management, including:
- Multi-echelon inventory optimization
- Safety stock calculation
- Reorder point determination

References:
- Graves & Willems (2008). "Optimizing Strategic Safety Stock Placement in Supply Chains"
"""

import numpy as np
import gurobi as gb
from scipy.stats import norm
from typing import Dict, List, Tuple, Any, Optional


class InventoryOptimizer:
    """
    A class implementing various inventory optimization algorithms
    for supply chain management.
    """
    
    def __init__(self, facilities: Dict[str, Dict], inventory_params: Dict[str, Dict]):
        """
        Initialize the inventory optimizer.
        
        Args:
            facilities: Dictionary of facilities with their properties
                Format: {facility_id: {"location": (lat, lon), "capacity": float, "echelon": int}}
            inventory_params: Dictionary of inventory parameters for each facility
                Format: {facility_id: {"lead_time": float, "review_period": float, 
                                     "demand_mean": float, "demand_std": float,
                                     "holding_cost": float, "stockout_cost": float}}
        """
        self.facilities = facilities
        self.inventory_params = inventory_params
        
    def _calculate_pooled_variance(self, facility_id: str, echelon_level: int) -> float:
        """
        Helper method for calculating pooled demand variance with risk pooling effects.
        
        Args:
            facility_id: ID of the facility
            echelon_level: Echelon level of the facility
            
        Returns:
            Pooled variance value
        """
        # Get base variance for this facility
        base_variance = self.inventory_params[facility_id].get("demand_std", 0) ** 2
        
        # Apply risk pooling effect based on echelon
        # Higher echelons benefit from more risk pooling
        if echelon_level > 1:
            # Connected downstream facilities - would come from network structure
            downstream_facilities = [f for f in self.facilities 
                                   if self.facilities[f].get("echelon", 0) < echelon_level]
            
            if downstream_facilities:
                # Calculate correlation factor (decreases with more downstream facilities)
                correlation_factor = 1.0 / (1 + 0.5 * len(downstream_facilities))
                
                # Aggregate variance from downstream (square root of sum of squares)
                downstream_variance = sum(
                    self.inventory_params[f].get("demand_std", 0) ** 2 
                    for f in downstream_facilities 
                    if f in self.inventory_params
                )
                
                # Apply correlation factor to reflect risk pooling
                pooled_variance = base_variance + correlation_factor * downstream_variance
            else:
                pooled_variance = base_variance
        else:
            pooled_variance = base_variance
            
        return pooled_variance
        
    def optimize_multi_echelon_inventory(self, service_level_target: float = 0.95) -> Dict[str, Any]:
        """
        Multi-echelon inventory optimization following Graves & Willems (2008)
        Enhanced service level constraints and risk pooling.
        
        Args:
            service_level_target: Target service level (0-1)
            
        Returns:
            Dictionary containing optimization results:
            {facility_id: {"safety_stock": float, "service_level": float, "echelon": int}}
        """
        inventory_results = {}
        
        # Group facilities by echelon
        echelons = {}
        for facility_id, facility in self.facilities.items():
            echelon = facility.get("echelon", 1)
            if echelon not in echelons:
                echelons[echelon] = []
            echelons[echelon].append(facility_id)

        # Optimize each echelon considering upstream/downstream impacts
        for echelon_level in sorted(echelons.keys()):
            facilities = echelons[echelon_level]
            
            # Create optimization model for this echelon
            model = gb.Model(f"Echelon_{echelon_level}_Inventory")

            # Decision variables
            safety_stock = model.addVars(facilities, lb=0)
            service_level = model.addVars(facilities, lb=service_level_target, ub=1)

            # Objective: Minimize inventory costs while meeting service levels
            model.setObjective(
                gb.quicksum(
                    safety_stock[f] * self.inventory_params[f]["holding_cost"] +
                    (1 - service_level[f]) * self.inventory_params[f]["stockout_cost"]
                    for f in facilities if f in self.inventory_params
                )
            )

            # Service level constraints with risk pooling
            for f in facilities:
                if f in self.inventory_params:
                    # Calculate demand variability with risk pooling
                    pooled_variance = self._calculate_pooled_variance(f, echelon_level)
                    
                    model.addConstr(
                        service_level[f] >= service_level_target
                    )
                    
                    # Safety stock constraint: SS = z * σ * √(LT + RP)
                    # where z is the service level factor, σ is std dev, LT is lead time, RP is review period
                    lead_time = self.inventory_params[f].get("lead_time", 0)
                    review_period = self.inventory_params[f].get("review_period", 0)
                    
                    # Create a piecewise approximation of the normal quantile function
                    service_levels = [0.5, 0.75, 0.8, 0.85, 0.9, 0.95, 0.98, 0.99]
                    z_values = [norm.ppf(sl) for sl in service_levels]
                    
                    # Add piecewise linear constraint
                    model.addGenConstrPWL(
                        service_level[f], 
                        safety_stock[f] / (np.sqrt(pooled_variance * (lead_time + review_period))),
                        service_levels, 
                        z_values
                    )

            # Solve echelon optimization
            model.optimize()

            # Store results
            for f in facilities:
                if f in self.inventory_params:
                    inventory_results[f] = {
                        "safety_stock": safety_stock[f].x if model.status == gb.GRB.OPTIMAL else None,
                        "service_level": service_level[f].x if model.status == gb.GRB.OPTIMAL else None,
                        "echelon": echelon_level
                    }

        return inventory_results
        
    def calculate_safety_stock(self, facility_id: str, service_level: float = 0.95) -> float:
        """
        Calculate safety stock for a single facility.
        
        Args:
            facility_id: ID of the facility
            service_level: Target service level (0-1)
            
        Returns:
            Safety stock quantity
            
        Raises:
            ValueError: If facility_id not found in inventory parameters
        """
        if facility_id not in self.inventory_params:
            raise ValueError(f"Facility {facility_id} not found in inventory parameters")
            
        params = self.inventory_params[facility_id]
        lead_time = params.get("lead_time", 0)
        review_period = params.get("review_period", 0)
        demand_std = params.get("demand_std", 0)
        
        # Service level factor (z-score)
        z = norm.ppf(service_level)
        
        # Calculate safety stock
        safety_stock = z * demand_std * np.sqrt(lead_time + review_period)
        
        return safety_stock
        
    def calculate_reorder_point(self, facility_id: str, service_level: float = 0.95) -> float:
        """
        Calculate reorder point for a single facility.
        
        Args:
            facility_id: ID of the facility
            service_level: Target service level (0-1)
            
        Returns:
            Reorder point quantity
            
        Raises:
            ValueError: If facility_id not found in inventory parameters
        """
        if facility_id not in self.inventory_params:
            raise ValueError(f"Facility {facility_id} not found in inventory parameters")
            
        params = self.inventory_params[facility_id]
        lead_time = params.get("lead_time", 0)
        demand_mean = params.get("demand_mean", 0)
        
        # Get safety stock
        safety_stock = self.calculate_safety_stock(facility_id, service_level)
        
        # Calculate reorder point = expected demand during lead time + safety stock
        reorder_point = demand_mean * lead_time + safety_stock
        
        return reorder_point
        
    def optimize_inventory_review_periods(self, 
                                         min_service_level: float = 0.9,
                                         max_holding_cost: Optional[float] = None) -> Dict[str, Any]:
        """
        Optimize inventory review periods across facilities.
        
        Args:
            min_service_level: Minimum allowable service level
            max_holding_cost: Maximum allowable total holding cost
            
        Returns:
            Dictionary containing optimization results
        """
        # Create optimization model
        model = gb.Model("ReviewPeriodOptimization")
        
        # Decision variables
        review_periods = model.addVars(self.inventory_params.keys(), lb=0.1, ub=30)  # Days
        safety_stocks = model.addVars(self.inventory_params.keys(), lb=0)
        service_levels = model.addVars(self.inventory_params.keys(), lb=min_service_level, ub=0.9999)
        
        # Objective: Minimize total inventory costs
        model.setObjective(
            gb.quicksum(
                safety_stocks[f] * self.inventory_params[f]["holding_cost"] +
                (1 - service_levels[f]) * self.inventory_params[f]["stockout_cost"]
                for f in self.inventory_params
            )
        )
        
        # Constraints
        for f in self.inventory_params:
            params = self.inventory_params[f]
            lead_time = params.get("lead_time", 0)
            demand_std = params.get("demand_std", 0)
            
            # Safety stock constraint based on review period
            # Create a piecewise approximation of service level to safety stock relationship
            service_level_points = [min_service_level, 0.925, 0.95, 0.975, 0.99, 0.995]
            z_values = [norm.ppf(sl) for sl in service_level_points]
            
            # For each service level point, we create a constraint
            for sl, z in zip(service_level_points, z_values):
                model.addConstr(
                    safety_stocks[f] >= 
                    z * demand_std * gb.sqrt(lead_time + review_periods[f]) * 
                    (service_levels[f] >= sl)
                )
        
        # Optional maximum holding cost constraint
        if max_holding_cost is not None:
            model.addConstr(
                gb.quicksum(
                    safety_stocks[f] * self.inventory_params[f]["holding_cost"]
                    for f in self.inventory_params
                ) <= max_holding_cost
            )
        
        # Solve model
        model.optimize()
        
        # Extract results
        result = {}
        if model.status == gb.GRB.OPTIMAL:
            for f in self.inventory_params:
                result[f] = {
                    "optimal_review_period": review_periods[f].x,
                    "safety_stock": safety_stocks[f].x,
                    "service_level": service_levels[f].x
                }
            result["status"] = "optimal"
            result["total_cost"] = model.objVal
        else:
            result["status"] = "infeasible or unbounded"
            
        return result
