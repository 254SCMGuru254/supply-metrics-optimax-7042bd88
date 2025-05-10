"""
Main entry point for Supply Chain Network Optimizer
"""
import time
from optimizer.core import SupplyChainNetworkOptimizer
from optimizer.facility import optimize_facility_location_multi_period
from optimizer.routing import optimize_routes_real_time
from optimizer.inventory import optimize_multi_echelon_inventory

def create_kenya_supply_chain_model():
    # Define nodes (cities/towns) with their locations and demand
    nodes_data = {
        "Nairobi": {"location": (-1.2921, 36.8219), "demand_mean": 1000, "type": "demand", "fixed_cost": 50000, "capacity": 5000},
        "Mombasa": {"location": (-4.0435, 39.6682), "demand_mean": 750, "type": "demand", "fixed_cost": 40000, "capacity": 4000},
        "Kisumu": {"location": (-0.0917, 34.7679), "demand_mean": 500, "type": "demand", "fixed_cost": 35000, "capacity": 3500},
        "Nakuru": {"location": (-0.2747, 36.0798), "demand_mean": 400, "type": "demand", "fixed_cost": 30000, "capacity": 3000},
        "Eldoret": {"location": (0.5157, 35.0800), "demand_mean": 300, "type": "demand", "fixed_cost": 25000, "capacity": 2500},
        "Kitale": {"location": (1.0248, 35.0041), "demand_mean": 200, "type": "demand", "fixed_cost": 20000, "capacity": 2000},
        "Garissa": {"location": (-0.4536, 39.6413), "demand_mean": 150, "type": "demand", "fixed_cost": 15000, "capacity": 1500},
        "Kakamega": {"location": (0.2865, 34.7535), "demand_mean": 250, "type": "demand", "fixed_cost": 22000, "capacity": 2200},
        "Thika": {"location": (-1.0397, 37.0903), "demand_mean": 350, "type": "demand", "fixed_cost": 28000, "capacity": 2800},
        "Lodwar": {"location": (3.1143, 35.6003), "demand_mean": 100, "type": "demand", "fixed_cost": 10000, "capacity": 1000},
        "Wajir": {"location": (1.7472, 40.0667), "demand_mean": 80, "type": "demand", "fixed_cost": 8000, "capacity": 800},
        "Marsabit": {"location": (2.3263, 37.9879), "demand_mean": 70, "type": "demand", "fixed_cost": 7000, "capacity": 700},
        "Isiolo": {"location": (0.3556, 37.5833), "demand_mean": 90, "type": "demand", "fixed_cost": 9000, "capacity": 900},
        "Voi": {"location": (-3.3967, 38.5633), "demand_mean": 120, "type": "demand", "fixed_cost": 12000, "capacity": 1200},
        "Machakos": {"location": (-1.5000, 37.2667), "demand_mean": 220, "type": "demand", "fixed_cost": 21000, "capacity": 2100},
    }

    # Define potential routes between nodes with distances and transit times
    routes_data = {
        "Nairobi-Mombasa": {"nodes": ["Nairobi", "Mombasa"], "distance": 485, "transit_time": 8, "mode": "truck"},
        "Nairobi-Kisumu": {"nodes": ["Nairobi", "Kisumu"], "distance": 320, "transit_time": 6, "mode": "truck"},
        "Mombasa-Kisumu": {"nodes": ["Mombasa", "Kisumu"], "distance": 805, "transit_time": 14, "mode": "truck"},
        "Nairobi-Nakuru": {"nodes": ["Nairobi", "Nakuru"], "distance": 160, "transit_time": 3, "mode": "truck"},
        "Nakuru-Eldoret": {"nodes": ["Nakuru", "Eldoret"], "distance": 150, "transit_time": 3, "mode": "truck"},
        "Eldoret-Kitale": {"nodes": ["Eldoret", "Kitale"], "distance": 100, "transit_time": 2, "mode": "truck"},
        "Kisumu-Kakamega": {"nodes": ["Kisumu", "Kakamega"], "distance": 50, "transit_time": 1, "mode": "truck"},
        "Nairobi-Thika": {"nodes": ["Nairobi", "Thika"], "distance": 45, "transit_time": 1, "mode": "truck"},
        "Nairobi-Garissa": {"nodes": ["Nairobi", "Garissa"], "distance": 450, "transit_time": 7, "mode": "truck"},
        "Nairobi-Lodwar": {"nodes": ["Nairobi", "Lodwar"], "distance": 750, "transit_time": 12, "mode": "truck"},
        "Garissa-Wajir": {"nodes": ["Garissa", "Wajir"], "distance": 240, "transit_time": 4, "mode": "truck"},
        "Lodwar-Marsabit": {"nodes": ["Lodwar", "Marsabit"], "distance": 420, "transit_time": 7, "mode": "truck"},
        "Nairobi-Isiolo": {"nodes": ["Nairobi", "Isiolo"], "distance": 280, "transit_time": 5, "mode": "truck"},
        "Mombasa-Voi": {"nodes": ["Mombasa", "Voi"], "distance": 330, "transit_time": 6, "mode": "truck"},
         # SGR routes
        "Mombasa-Nairobi-Rail": {"nodes": ["Mombasa", "Nairobi"], "distance": 485, "transit_time": 4, "mode": "rail"},
        "Nairobi-Mombasa-Rail": {"nodes": ["Nairobi", "Mombasa"], "distance": 485, "transit_time": 4, "mode": "rail"},
        # Intermodal routes
        "Mombasa-Nairobi-Rail-Truck": {"nodes": ["Mombasa", "Nairobi"], "distance": 485, "transit_time": 5, "mode": "multimodal"},
        "Nairobi-Mombasa-Rail-Truck": {"nodes": ["Nairobi", "Mombasa"], "distance": 485, "transit_time": 5, "mode": "multimodal"},
        # Air routes
        "Nairobi-Kisumu-Air": {"nodes": ["Nairobi", "Kisumu"], "distance": 260, "transit_time": 1, "mode": "air"},
        "Kisumu-Nairobi-Air": {"nodes": ["Kisumu", "Nairobi"], "distance": 260, "transit_time": 1, "mode": "air"},
        # Shipping routes (Coastal)
        "Mombasa-Lamu-Ship": {"nodes": ["Mombasa", "Lamu"], "distance": 350, "transit_time": 12, "mode": "ship"},
    }

    # Define inventory parameters for each node
    inventory_params = {
        "Nairobi": {"holding_cost": 5, "stockout_cost": 500},
        "Mombasa": {"holding_cost": 4, "stockout_cost": 450},
        "Kisumu": {"holding_cost": 3, "stockout_cost": 400},
        "Nakuru": {"holding_cost": 2.5, "stockout_cost": 350},
        "Eldoret": {"holding_cost": 2, "stockout_cost": 300},
        "Kitale": {"holding_cost": 1.5, "stockout_cost": 250},
        "Garissa": {"holding_cost": 1, "stockout_cost": 200},
        "Kakamega": {"holding_cost": 1.2, "stockout_cost": 220},
        "Thika": {"holding_cost": 2.2, "stockout_cost": 320},
    }

    # Create the supply chain optimizer instance
    kenya_sc = SupplyChainNetworkOptimizer(nodes_data, routes_data, inventory_params)

    # Add facility details (fixed costs, capacities)
    kenya_sc.add_facility("Nairobi", fixed_cost=50000, capacity=5000)
    kenya_sc.add_facility("Mombasa", fixed_cost=40000, capacity=4000)
    kenya_sc.add_facility("Kisumu", fixed_cost=35000, capacity=3500)
    kenya_sc.add_facility("Nakuru", fixed_cost=30000, capacity=3000)
    kenya_sc.add_facility("Eldoret", fixed_cost=25000, capacity=2500)
    kenya_sc.add_facility("Kitale", fixed_cost=20000, capacity=2000)
    kenya_sc.add_facility("Garissa", fixed_cost=15000, capacity=1500)
    kenya_sc.add_facility("Kakamega", fixed_cost=22000, capacity=2200)
    kenya_sc.add_facility("Thika", fixed_cost=28000, capacity=2800)
    kenya_sc.add_facility("Lodwar", fixed_cost=10000, capacity=1000)
    kenya_sc.add_facility("Wajir", fixed_cost=8000, capacity=800)
    kenya_sc.add_facility("Marsabit", fixed_cost=7000, capacity=700)
    kenya_sc.add_facility("Isiolo", fixed_cost=9000, capacity=900)
    kenya_sc.add_facility("Voi", fixed_cost=12000, capacity=1200)
    kenya_sc.add_facility("Machakos", fixed_cost=21000, capacity=2100)

    # Set echelon levels for inventory optimization
    kenya_sc.set_facility_echelon("Nairobi", 1)
    kenya_sc.set_facility_echelon("Mombasa", 2)
    kenya_sc.set_facility_echelon("Kisumu", 2)
    kenya_sc.set_facility_echelon("Nakuru", 3)
    kenya_sc.set_facility_echelon("Eldoret", 3)
    kenya_sc.set_facility_echelon("Kitale", 3)
    kenya_sc.set_facility_echelon("Garissa", 3)
    kenya_sc.set_facility_echelon("Kakamega", 3)
    kenya_sc.set_facility_echelon("Thika", 3)
    kenya_sc.set_facility_echelon("Lodwar", 3)
    kenya_sc.set_facility_echelon("Wajir", 3)
    kenya_sc.set_facility_echelon("Marsabit", 3)
    kenya_sc.set_facility_echelon("Isiolo", 3)
    kenya_sc.set_facility_echelon("Voi", 3)
    kenya_sc.set_facility_echelon("Machakos", 3)

    # Example demand point
    kenya_sc.add_demand_point("Garissa", demand_mean=150, location=(-0.4536, 39.6413))
    kenya_sc.add_demand_point("Wajir", demand_mean=80, location=(1.7472, 40.0667))
    kenya_sc.add_demand_point("Marsabit", demand_mean=70, location=(2.3263, 37.9879))
    kenya_sc.add_demand_point("Isiolo", demand_mean=90, location=(0.3556, 37.5833))
    kenya_sc.add_demand_point("Voi", demand_mean=120, location=(-3.3967, 38.5633))
    kenya_sc.add_demand_point("Machakos", demand_mean=220, location=(-1.5000, 37.2667))

    # Add routes
    kenya_sc.add_route("Nairobi-Mombasa", ["Nairobi", "Mombasa"], distance=485, transit_time=8, mode="truck")
    kenya_sc.add_route("Nairobi-Kisumu", ["Nairobi", "Kisumu"], distance=320, transit_time=6, mode="truck")
    kenya_sc.add_route("Mombasa-Kisumu", ["Mombasa", "Kisumu"], distance=805, transit_time=14, mode="truck")
    kenya_sc.add_route("Nairobi-Nakuru", ["Nairobi", "Nakuru"], distance=160, transit_time=3, mode="truck")
    kenya_sc.add_route("Nakuru-Eldoret", ["Nakuru", "Eldoret"], distance=150, transit_time=3, mode="truck")
    kenya_sc.add_route("Eldoret-Kitale", ["Eldoret", "Kitale"], distance=100, transit_time=2, mode="truck")
    kenya_sc.add_route("Kisumu-Kakamega", ["Kisumu", "Kakamega"], distance=50, transit_time=1, mode="truck")
    kenya_sc.add_route("Nairobi-Thika", ["Nairobi", "Thika"], distance=45, "transit_time": 1, mode="truck")
    kenya_sc.add_route("Nairobi-Garissa", ["Nairobi", "Garissa"], distance=450, transit_time=7, mode="truck")
    kenya_sc.add_route("Nairobi-Lodwar", ["Nairobi", "Lodwar"], distance=750, transit_time=12, mode="truck")
    kenya_sc.add_route("Garissa-Wajir", ["Garissa", "Wajir"], distance=240, transit_time=4, mode="truck")
    kenya_sc.add_route("Lodwar-Marsabit", ["Lodwar", "Marsabit"], distance=420, transit_time=7, mode="truck")
    kenya_sc.add_route("Nairobi-Isiolo", ["Nairobi", "Isiolo"], distance=280, transit_time=5, mode="truck")
    kenya_sc.add_route("Mombasa-Voi", ["Mombasa", "Voi"], distance=330, transit_time=6, mode="truck")
    # SGR routes
    kenya_sc.add_route("Mombasa-Nairobi-Rail", ["Mombasa", "Nairobi"], distance=485, transit_time=4, mode="rail")
    kenya_sc.add_route("Nairobi-Mombasa-Rail", ["Nairobi", "Mombasa"], distance=485, transit_time=4, mode="rail")
    # Intermodal routes
    kenya_sc.add_route("Mombasa-Nairobi-Rail-Truck", ["Mombasa", "Nairobi"], distance=485, transit_time=5, mode="multimodal")
    kenya_sc.add_route("Nairobi-Mombasa-Rail-Truck", ["Nairobi", "Mombasa"], distance=485, transit_time=5, mode="multimodal")
    # Air routes
    kenya_sc.add_route("Nairobi-Kisumu-Air", ["Nairobi", "Kisumu"], distance=260, transit_time=1, mode="air")
    kenya_sc.add_route("Kisumu-Nairobi-Air", ["Kisumu", "Nairobi"], distance=260, transit_time=1, mode="air")
    # Shipping routes (Coastal)
    kenya_sc.add_route("Mombasa-Lamu-Ship", ["Mombasa", "Lamu"], distance=350, transit_time=12, mode="ship")
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

    # Add multi-period facility optimization using the new modular structure
    multi_period_results = optimize_facility_location_multi_period(kenya_sc, periods=12, demand_growth_rate=0.05)
    print("\nMulti-Period Facility Results:", multi_period_results)
    
    # Add real-time routing optimization using the new modular structure
    realtime_routes = optimize_routes_real_time(kenya_sc, time_window=60, traffic_factor=0.2)
    print("\nReal-time Routing Results:", realtime_routes)
    
    # Add enhanced multi-echelon inventory optimization using the new modular structure
    inventory_results = optimize_multi_echelon_inventory(kenya_sc, service_level_target=0.95)
    print("\nMulti-echelon Inventory Results:", inventory_results)

if __name__ == "__main__":
    main()
