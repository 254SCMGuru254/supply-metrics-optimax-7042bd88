"""
Supplier Diversification Module

This module implements supplier diversification strategies to enhance
supply chain resilience against disruptions.
"""

import numpy as np
import networkx as nx
from typing import Dict, List, Tuple, Any, Optional
import pulp as pl
from math import sqrt

class SupplierDiversityOptimizer:
    """
    Optimizes supplier diversity to enhance resilience against disruptions.
    """
    
    def __init__(self):
        """Initialize the supplier diversity optimizer."""
        self.suppliers = {}
        self.supplier_risks = {}
        self.materials = {}
        self.material_demands = {}
        
    def add_supplier(self, supplier_id: str, location: Tuple[float, float],
                   reliability_score: float, capacity: Dict[str, float],
                   lead_time: Dict[str, float], cost: Dict[str, float]):
        """
        Add a supplier to the diversification model.
        
        Args:
            supplier_id: Unique identifier for the supplier
            location: (latitude, longitude) coordinates
            reliability_score: 0-1 score of supplier reliability
            capacity: Dictionary of material_id -> capacity
            lead_time: Dictionary of material_id -> lead time in days
            cost: Dictionary of material_id -> unit cost
        """
        self.suppliers[supplier_id] = {
            "location": location,
            "reliability_score": reliability_score,
            "capacity": capacity,
            "lead_time": lead_time,
            "cost": cost
        }
        
        # Register materials this supplier can provide
        for material_id in capacity.keys():
            if material_id not in self.materials:
                self.materials[material_id] = []
            self.materials[material_id].append(supplier_id)
    
    def set_material_demand(self, material_id: str, demand: float):
        """
        Set the demand for a specific material.
        
        Args:
            material_id: Material identifier
            demand: Required quantity
        """
        self.material_demands[material_id] = demand
    
    def calculate_supplier_risk(self, supplier_id: str) -> float:
        """
        Calculate a risk score for a supplier based on various factors.
        
        Args:
            supplier_id: Supplier to evaluate
            
        Returns:
            Risk score (0-1, higher is riskier)
        """
        if supplier_id not in self.suppliers:
            raise ValueError(f"Unknown supplier: {supplier_id}")
        
        supplier = self.suppliers[supplier_id]
        
        # Base risk is inverse of reliability
        base_risk = 1 - supplier["reliability_score"]
        
        # Calculate average lead time (normalized to 0-1)
        if supplier["lead_time"]:
            avg_lead_time = sum(supplier["lead_time"].values()) / len(supplier["lead_time"])
            # Normalize assuming 30 days is max acceptable lead time
            lead_time_risk = min(1.0, avg_lead_time / 30.0)
        else:
            lead_time_risk = 0.5  # Default if no lead time data
        
        # Combine factors (could be weighted differently)
        risk_score = 0.6 * base_risk + 0.4 * lead_time_risk
        
        # Cache the calculated risk
        self.supplier_risks[supplier_id] = risk_score
        
        return risk_score
        
    def calculate_hhi_index(self, material_id: str) -> float:
        """
        Calculate Herfindahl-Hirschman Index for supplier concentration.
        Lower is better (less concentrated, more diverse).
        
        Args:
            material_id: Material to calculate HHI for
            
        Returns:
            HHI value (0-1 range, lower is better)
        """
        if material_id not in self.materials:
            raise ValueError(f"No suppliers for material: {material_id}")
        
        # Get all suppliers for this material
        suppliers = self.materials[material_id]
        
        # If only one supplier, HHI is 1 (maximum concentration)
        if len(suppliers) <= 1:
            return 1.0
        
        # Calculate market shares based on capacity
        total_capacity = sum(self.suppliers[s]["capacity"].get(material_id, 0) for s in suppliers)
        
        if total_capacity == 0:
            return 1.0  # If no capacity, assume maximum concentration
        
        market_shares = [
            self.suppliers[s]["capacity"].get(material_id, 0) / total_capacity 
            for s in suppliers
        ]
        
        # Calculate HHI (sum of squared market shares)
        hhi = sum(share * share for share in market_shares)
        
        return hhi
    
    def optimize_supplier_allocation(self, 
                                   material_id: str,
                                   demand: float = None,
                                   max_hhi: float = 0.25,
                                   max_suppliers: int = 5) -> Dict[str, float]:
        """
        Optimize the allocation of demand across suppliers to reduce risk
        while minimizing cost.
        
        Args:
            material_id: Material to optimize for
            demand: Total demand to be allocated (uses stored demand if None)
            max_hhi: Maximum acceptable HHI value
            max_suppliers: Maximum number of suppliers to use
            
        Returns:
            Dictionary of supplier_id -> allocation amount
        """
        if material_id not in self.materials:
            raise ValueError(f"No suppliers for material: {material_id}")
            
        # Use stored demand if not provided
        if demand is None:
            if material_id not in self.material_demands:
                raise ValueError(f"No demand specified for material: {material_id}")
            demand = self.material_demands[material_id]
        
        # Get suppliers for this material
        suppliers = self.materials[material_id]
        
        # Calculate risks if not already done
        for supplier_id in suppliers:
            if supplier_id not in self.supplier_risks:
                self.calculate_supplier_risk(supplier_id)
        
        # Create optimization model
        model = pl.LpProblem(f"Supplier_Allocation_{material_id}", pl.LpMinimize)
        
        # Decision variables: amount to order from each supplier
        orders = {s: pl.LpVariable(f"Order_{s}", 0, None) for s in suppliers}
        
        # Binary variables: whether to use a supplier
        use_supplier = {s: pl.LpVariable(f"Use_{s}", 0, 1, pl.LpBinary) for s in suppliers}
        
        # Objective: minimize total cost and risk
        total_cost = pl.lpSum([orders[s] * self.suppliers[s]["cost"].get(material_id, float('inf')) 
                            for s in suppliers])
        total_risk = pl.lpSum([orders[s] * self.supplier_risks[s] for s in suppliers])
        
        # Combined objective (normalize costs first)
        avg_cost = sum(self.suppliers[s]["cost"].get(material_id, 0) for s in suppliers) / len(suppliers)
        model += total_cost / (avg_cost * demand) * 0.7 + total_risk / demand * 0.3
        
        # Constraint: meet total demand
        model += pl.lpSum([orders[s] for s in suppliers]) == demand
        
        # Constraint: respect supplier capacities
        for s in suppliers:
            model += orders[s] <= self.suppliers[s]["capacity"].get(material_id, 0) * use_supplier[s]
        
        # Constraint: limit number of suppliers
        model += pl.lpSum([use_supplier[s] for s in suppliers]) <= max_suppliers
        
        # Constraint: HHI index (approximation using piecewise linear approach)
        # This is a complex constraint that's difficult to implement directly in LP
        # Instead, we use a minimum order size approach to encourage diversity
        min_order_percent = (1.0 - max_hhi) / max_suppliers
        for s in suppliers:
            model += orders[s] >= min_order_percent * demand * use_supplier[s]
            model += orders[s] <= demand * use_supplier[s]
        
        # Solve the model
        model.solve(pl.PULP_CBC_CMD(msg=False))
        
        # Extract solution
        allocation = {s: orders[s].value() for s in suppliers if orders[s].value() > 0.001}
        
        # Calculate actual HHI of solution
        total_allocated = sum(allocation.values())
        actual_hhi = sum((amount / total_allocated)**2 for amount in allocation.values())
        
        # Check if HHI constraint is actually satisfied
        actual_hhi_satisfied = actual_hhi <= max_hhi
        
        return {
            "allocation": allocation,
            "total_cost": sum(amount * self.suppliers[s]["cost"].get(material_id, 0) 
                            for s, amount in allocation.items()),
            "average_risk": sum(amount * self.supplier_risks[s] for s, amount in allocation.items()) / total_allocated,
            "hhi": actual_hhi,
            "hhi_satisfied": actual_hhi_satisfied,
            "num_suppliers": len(allocation)
        }
    
    def calculate_geographic_dispersion(self, supplier_ids: List[str]) -> float:
        """
        Calculate geographic dispersion of a set of suppliers.
        Higher values indicate greater dispersion (better).
        
        Args:
            supplier_ids: List of supplier IDs
            
        Returns:
            Dispersion score (0-1, higher is better)
        """
        if len(supplier_ids) <= 1:
            return 0.0  # No dispersion with 0 or 1 supplier
            
        # Get locations
        locations = [self.suppliers[s]["location"] for s in supplier_ids 
                   if s in self.suppliers]
        
        if len(locations) <= 1:
            return 0.0
            
        # Calculate centroid
        centroid_lat = sum(loc[0] for loc in locations) / len(locations)
        centroid_lon = sum(loc[1] for loc in locations) / len(locations)
        
        # Calculate average distance from centroid
        distances = [sqrt((loc[0] - centroid_lat)**2 + (loc[1] - centroid_lon)**2)
                   for loc in locations]
        avg_distance = sum(distances) / len(distances)
        
        # Normalize based on approximate max distance in Kenya (~1.0 in lat/lon space)
        dispersion_score = min(1.0, avg_distance / 1.0)
        
        return dispersion_score
    
    def generate_recommended_strategy(self, material_id: str) -> Dict:
        """
        Generate a complete diversification strategy for a material.
        
        Args:
            material_id: Material to create strategy for
            
        Returns:
            Strategy recommendations
        """
        if material_id not in self.materials:
            raise ValueError(f"No suppliers for material: {material_id}")
            
        # Get current HHI
        current_hhi = self.calculate_hhi_index(material_id)
        
        # Generate strategies with different max_hhi values
        strategies = []
        for max_hhi in [0.2, 0.25, 0.3, 0.4]:
            try:
                allocation = self.optimize_supplier_allocation(
                    material_id, 
                    max_hhi=max_hhi,
                    max_suppliers=5
                )
                
                # Calculate geographic dispersion
                geo_dispersion = self.calculate_geographic_dispersion(list(allocation["allocation"].keys()))
                
                # Add to strategies
                strategies.append({
                    "max_hhi": max_hhi,
                    "allocation": allocation,
                    "geo_dispersion": geo_dispersion,
                    # Calculate a combined score (lower is better)
                    "score": 0.4 * allocation["hhi"] + 
                           0.3 * allocation["average_risk"] + 
                           0.3 * (1 - geo_dispersion)
                })
            except:
                # Skip if optimization fails
                continue
        
        # Sort by score
        strategies.sort(key=lambda x: x["score"])
        
        # Return best strategy
        if strategies:
            return {
                "material_id": material_id,
                "current_hhi": current_hhi,
                "recommended_strategy": strategies[0],
                "alternative_strategies": strategies[1:],
            }
        else:
            return {
                "material_id": material_id,
                "current_hhi": current_hhi,
                "error": "Could not generate valid strategies"
            }
