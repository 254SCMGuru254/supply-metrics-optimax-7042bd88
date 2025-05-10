
"""
Facility location optimization module
"""
import numpy as np
import time
import gurobi as gb

def optimize_facility_location_multi_period(optimizer, periods=12, demand_growth_rate=0.05):
    """
    Multi-period facility location optimization following Melo et al. (2009)
    Considers demand evolution and capacity expansion over time
    
    Args:
        optimizer: SupplyChainNetworkOptimizer instance
        periods: Number of time periods to consider
        demand_growth_rate: Rate at which demand grows each period
        
    Returns:
        Dictionary containing facility decisions and capacity expansions for each period
    """
    if not optimizer.demand_points:
        raise ValueError("No demand points for optimization")

    # Create time-dependent demand scenarios
    period_demands = {}
    for t in range(periods):
        period_demands[t] = {
            d_id: {
                "mean": d["demand_mean"] * (1 + demand_growth_rate)**t,
                "location": d["location"]
            }
            for d_id, d in optimizer.demand_points.items()
        }

    # Create optimization model
    model = gb.Model("MultiPeriodFacilityLocation")

    # Decision variables
    facility_open = model.addVars(optimizer.facilities.keys(), periods, vtype=gb.GRB.BINARY)
    capacity_expansion = model.addVars(optimizer.facilities.keys(), periods, lb=0)
    flow = model.addVars(
        [(f, d, t) for f in optimizer.facilities for d in optimizer.demand_points for t in range(periods)],
        lb=0
    )

    # Objective: Minimize total cost across all periods
    model.setObjective(
        gb.quicksum(
            optimizer.facilities[f]["fixed_cost"] * facility_open[f, t] +
            1000 * capacity_expansion[f, t] +  # Expansion cost
            gb.quicksum(
                flow[f, d, t] * optimizer._calculate_distance(
                    optimizer.facilities[f]["location"],
                    optimizer.demand_points[d]["location"]
                ) for d in optimizer.demand_points
            )
            for f in optimizer.facilities for t in range(periods)
        )
    )

    # Capacity constraints with expansions
    for f in optimizer.facilities:
        for t in range(periods):
            model.addConstr(
                gb.quicksum(flow[f, d, t] for d in optimizer.demand_points) <=
                optimizer.facilities[f]["capacity"] * facility_open[f, t] +
                gb.quicksum(capacity_expansion[f, tau] for tau in range(t+1))
            )

    # Solve model
    model.optimize()

    # Extract results
    multi_period_results = {
        "facility_decisions": {},
        "capacity_expansions": {},
        "flows": {}
    }
    
    if model.status == gb.GRB.OPTIMAL:
        for t in range(periods):
            multi_period_results["facility_decisions"][t] = {
                f: facility_open[f, t].x > 0.5 for f in optimizer.facilities
            }
            multi_period_results["capacity_expansions"][t] = {
                f: capacity_expansion[f, t].x for f in optimizer.facilities
            }

    return multi_period_results
