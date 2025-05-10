
"""
Inventory optimization module
"""
import numpy as np
from scipy.stats import norm
import gurobi as gb

def optimize_multi_echelon_inventory(optimizer, service_level_target=0.95):
    """
    Multi-echelon inventory optimization following Graves & Willems (2008)
    Enhanced service level constraints and risk pooling
    
    Args:
        optimizer: SupplyChainNetworkOptimizer instance
        service_level_target: Target service level (0-1)
        
    Returns:
        Dictionary containing inventory optimization results by facility
    """
    inventory_results = {}
    
    # Group facilities by echelon
    echelons = {}
    for facility_id, facility in optimizer.facilities.items():
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
                safety_stock[f] * optimizer.inventory_params[f]["holding_cost"] +
                (1 - service_level[f]) * optimizer.inventory_params[f]["stockout_cost"]
                for f in facilities if f in optimizer.inventory_params
            )
        )

        # Service level constraints with risk pooling
        for f in facilities:
            if f in optimizer.inventory_params:
                # Calculate demand variability with risk pooling
                pooled_variance = optimizer._calculate_pooled_variance(f, echelon_level)
                
                model.addConstr(
                    service_level[f] >= service_level_target
                )
                
                model.addConstr(
                    safety_stock[f] >= 
                    norm.ppf(service_level[f]) * np.sqrt(pooled_variance)
                )

        # Solve echelon optimization
        model.optimize()

        # Store results
        for f in facilities:
            if f in optimizer.inventory_params:
                inventory_results[f] = {
                    "safety_stock": safety_stock[f].x if model.status == gb.GRB.OPTIMAL else None,
                    "service_level": service_level[f].x if model.status == gb.GRB.OPTIMAL else None,
                    "echelon": echelon_level
                }

    return inventory_results
