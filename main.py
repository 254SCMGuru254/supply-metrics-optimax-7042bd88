import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from pulp import *
import folium
from sklearn.cluster import KMeans
from scipy.stats import poisson, norm
import gurobi as gb  # For advanced optimization
from sklearn.preprocessing import StandardScaler
import time

class SupplyChainNetworkOptimizer:
    # ...existing code...

    def optimize_facility_location_multi_period(self, periods=12, demand_growth_rate=0.05):
        """
        Multi-period facility location optimization following Melo et al. (2009)
        Considers demand evolution and capacity expansion over time
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
        model = gb.Model("MultiPeriodFacilityLocation")

        # Decision variables
        facility_open = model.addVars(self.facilities.keys(), periods, vtype=gb.GRB.BINARY)
        capacity_expansion = model.addVars(self.facilities.keys(), periods, lb=0)
        flow = model.addVars(
            [(f, d, t) for f in self.facilities for d in self.demand_points for t in range(periods)],
            lb=0
        )

        # Objective: Minimize total cost across all periods
        model.setObjective(
            gb.quicksum(
                self.facilities[f]["fixed_cost"] * facility_open[f, t] +
                1000 * capacity_expansion[f, t] +  # Expansion cost
                gb.quicksum(
                    flow[f, d, t] * self._calculate_distance(
                        self.facilities[f]["location"],
                        self.demand_points[d]["location"]
                    ) for d in self.demand_points
                )
                for f in self.facilities for t in range(periods)
            )
        )

        # Capacity constraints with expansions
        for f in self.facilities:
            for t in range(periods):
                model.addConstr(
                    gb.quicksum(flow[f, d, t] for d in self.demand_points) <=
                    self.facilities[f]["capacity"] * facility_open[f, t] +
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
                    f: facility_open[f, t].x > 0.5 for f in self.facilities
                }
                multi_period_results["capacity_expansions"][t] = {
                    f: capacity_expansion[f, t].x for f in self.facilities
                }

        return multi_period_results

    def optimize_routes_real_time(self, time_window=60, traffic_factor=0.2):
        """
        Real-time routing optimization based on Toth & Vigo (2014)
        Considers dynamic travel times and real-time updates
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
        model = gb.Model("RealTimeRouting")

        # Decision variables for route selection
        route_use = model.addVars(self.routes.keys(), vtype=gb.GRB.BINARY)

        # Objective: Minimize total travel time with real-time updates
        model.setObjective(
            gb.quicksum(
                route_use[r] * dynamic_times[r] for r in self.routes
            )
        )

        # Time window constraints
        model.addConstr(
            gb.quicksum(
                route_use[r] * dynamic_times[r] for r in self.routes
            ) <= time_window
        )

        # Solve with time limit
        model.setParam('TimeLimit', 10)  # 10 second limit for real-time response
        model.optimize()

        execution_time = time.time() - start_time

        return {
            "optimized_routes": {r: route_use[r].x > 0.5 for r in self.routes},
            "dynamic_times": dynamic_times,
            "execution_time": execution_time
        }

    def optimize_multi_echelon_inventory(self, service_level_target=0.95):
        """
        Multi-echelon inventory optimization following Graves & Willems (2008)
        Enhanced service level constraints and risk pooling
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
                    
                    model.addConstr(
                        safety_stock[f] >= 
                        norm.ppf(service_level[f]) * np.sqrt(pooled_variance)
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

    def _calculate_pooled_variance(self, facility_id, echelon_level):
        """Helper method for calculating pooled demand variance with risk pooling effects"""
        # ...existing code...

# Example usage for Kenya specific implementation
def create_kenya_supply_chain_model():
    # ...existing create_kenya_supply_chain_model function code...
    return kenya_sc

def main():
    # Create Kenya-specific supply chain model
    kenya_sc = create_kenya_supply_chain_model()
    
    # Implement components
    # 1. Multi-echelon configuration
    kenya_sc.implement_multi_echelon_configuration()
    
    # 2. Multi-modal transport integration
    kenya_sc.implement_multi_modal_integration()
    
    # 3. Safety stock calculation
    safety_stocks = {
        facility_id: kenya_sc.calculate_safety_stock(facility_id)
        for facility_id in kenya_sc.inventory_params
    }
    print("Safety Stocks:", safety_stocks)
    
    # 4. Reorder point determination
    reorder_points = {
        facility_id: kenya_sc.calculate_reorder_point(facility_id)
        for facility_id in kenya_sc.inventory_params
    }
    print("Reorder Points:", reorder_points)
    
    # 5. Capacity utilization
    capacity_utilization = kenya_sc.optimize_capacity_utilization()
    print("Capacity Utilization:", capacity_utilization)
    
    # 6. Lead time optimization
    lead_times = kenya_sc.optimize_lead_times()
    print("Optimized Lead Times:", lead_times)
    
    # 7. Risk management - disruption analysis
    disruption_analysis = kenya_sc.perform_disruption_analysis(num_scenarios=5)
    print("Disruption Analysis:", disruption_analysis)
    
    # 8. Risk management - resilience metrics
    resilience_metrics = kenya_sc.calculate_resilience_metrics()
    print("Resilience Metrics:", resilience_metrics)
    
    # 9. Scenario Planning
    scenarios = [
        {
            "name": "Baseline",
            "description": "Current network configuration",
            "changes": []
        },
        {
            "name": "Expansion",
            "description": "Add 2 new facilities and increase demand by 20%",
            "changes": [
                {"type": "add_facility", "count": 2},
                {"type": "demand_change", "percentage": 0.2}
            ]
        },
        {
            "name": "SGR Focus", 
            "description": "Maximize rail transport usage",
            "changes": [
                {"type": "mode_shift", "from": "road", "to": "rail", "percentage": 0.7}
            ]
        }
    ]

    scenario_results = kenya_sc.run_scenario_planning(scenarios)
    comparison = kenya_sc.compare_scenarios(scenario_results)
    print("\nScenario Comparison:", comparison)

    # 10. Visualization
    kenya_sc.visualize_network(as_is=True, to_be=False, map_type="folium")
    kenya_sc.visualize_network(as_is=True, to_be=False, map_type="graph")

    # Network statistics
    network_stats = kenya_sc.generate_network_statistics()
    print("\nNetwork Statistics:", network_stats)

    # 11. Export results
    kenya_sc.export_to_json("kenya_supply_chain.json")

    # Add new multi-period facility optimization
    multi_period_results = kenya_sc.optimize_facility_location_multi_period(
        periods=12,
        demand_growth_rate=0.05
    )
    print("\nMulti-Period Facility Results:", multi_period_results)
    
    # Add real-time routing optimization
    realtime_routes = kenya_sc.optimize_routes_real_time(
        time_window=60,
        traffic_factor=0.2
    )
    print("\nReal-time Routing Results:", realtime_routes)
    
    # Add enhanced multi-echelon inventory optimization
    inventory_results = kenya_sc.optimize_multi_echelon_inventory(
        service_level_target=0.95
    )
    print("\nMulti-echelon Inventory Results:", inventory_results)

if __name__ == "__main__":
    main()
