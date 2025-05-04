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
from scipy.stats import norm
from typing import Dict, List, Optional


class InventoryOptimizer:
    """
    A class implementing various inventory optimization algorithms
    for supply chain management.
    """
    
    def __init__(self, facilities: Dict = None, inventory_params: Dict = None):
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
        self.facilities = facilities or {}
        self.inventory_params = inventory_params or {}
        self.current_metrics = None

    def optimize(self) -> Dict:
        """
        Optimize inventory levels using multi-echelon inventory optimization
        Returns estimated improvements in key metrics
        """
        # Calculate current metrics first
        self.current_metrics = self._calculate_current_metrics()

        # Run multi-echelon optimization
        optimized_levels = self._optimize_multi_echelon()
        optimized_metrics = self._calculate_optimized_metrics(optimized_levels)
        
        # Calculate and return improvements
        return self._calculate_improvements(optimized_metrics)

    def _calculate_current_metrics(self) -> Dict:
        """Calculate current inventory metrics"""
        total_inventory = 0
        total_holding_cost = 0
        stockouts = 0
        demand_events = 0
        
        for facility_id, params in self.inventory_params.items():
            # Get facility inventory value
            inventory_value = self.facilities[facility_id].get('inventory_value', 0)
            total_inventory += inventory_value
            
            # Calculate holding costs
            holding_cost = params.get('holding_cost', 0) * inventory_value
            total_holding_cost += holding_cost
            
            # Count stockouts if available
            if 'stockout_history' in params:
                stockouts += sum(1 for x in params['stockout_history'] if x)
                demand_events += len(params['stockout_history'])
        
        return {
            "total_inventory": total_inventory,
            "total_holding_cost": total_holding_cost,
            "holding_cost_percent": (total_holding_cost / total_inventory * 100) if total_inventory > 0 else 0,
            "stockout_rate": (stockouts / demand_events) if demand_events > 0 else 0,
            "working_capital": total_inventory
        }

    def _optimize_multi_echelon(self) -> Dict[str, float]:
        """Optimize inventory levels across all facilities"""
        optimized_levels = {}
        
        for facility_id, params in self.inventory_params.items():
            # Calculate optimal safety stock using newsvendor formula
            demand_mean = params.get('demand_mean', 0)
            demand_std = params.get('demand_std', 0)
            lead_time = params.get('lead_time', 0)
            
            # Target service level (can be customized per facility)
            service_level = 0.95
            z_score = norm.ppf(service_level)
            
            # Calculate optimal safety stock
            safety_stock = z_score * demand_std * np.sqrt(lead_time)
            
            # Calculate optimal base stock level
            base_stock = demand_mean * lead_time + safety_stock
            
            optimized_levels[facility_id] = {
                "safety_stock": safety_stock,
                "base_stock": base_stock
            }
            
        return optimized_levels

    def _calculate_optimized_metrics(self, optimized_levels: Dict) -> Dict:
        """Calculate expected metrics after optimization"""
        total_inventory = 0
        total_holding_cost = 0
        expected_stockouts = 0
        total_demand_events = 0
        
        for facility_id, levels in optimized_levels.items():
            params = self.inventory_params[facility_id]
            
            # Calculate expected inventory value
            inventory_value = levels['base_stock'] * params.get('unit_cost', 1)
            total_inventory += inventory_value
            
            # Calculate expected holding costs
            holding_cost = params.get('holding_cost', 0) * inventory_value
            total_holding_cost += holding_cost
            
            # Calculate expected stockouts
            demand_mean = params.get('demand_mean', 0)
            demand_std = params.get('demand_std', 0)
            service_level = 0.95  # Same as optimization target
            
            # Expected stockouts calculation using normal distribution properties
            expected_stockouts += (1 - service_level) * demand_mean
            total_demand_events += demand_mean
            
        return {
            "total_inventory": total_inventory,
            "total_holding_cost": total_holding_cost,
            "holding_cost_percent": (total_holding_cost / total_inventory * 100) if total_inventory > 0 else 0,
            "stockout_rate": (expected_stockouts / total_demand_events) if total_demand_events > 0 else 0,
            "working_capital": total_inventory
        }

    def _calculate_improvements(self, optimized_metrics: Dict) -> Dict:
        """Calculate improvements compared to current metrics"""
        improvements = {
            "estimated_inventory_holding_cost": optimized_metrics["holding_cost_percent"],
            "estimated_stockout_rate": optimized_metrics["stockout_rate"],
            "estimated_working_capital_requirement": optimized_metrics["working_capital"] / 1_000_000  # Convert to millions
        }
        return improvements
