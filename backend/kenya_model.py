"""
Kenya Supply Chain Model Implementation

This module implements a supply chain model specific to Kenya's logistics network.
It leverages the modular optimization components to create a comprehensive model.
"""

import numpy as np
import pandas as pd
import time
from models.network_optimizer import SupplyChainNetworkOptimizer


def create_kenya_supply_chain_model() -> SupplyChainNetworkOptimizer:
    """
    Create a supply chain network model for Kenya.
    
    Returns:
        Configured SupplyChainNetworkOptimizer instance
    """
    # Initialize network optimizer
    kenya_sc = SupplyChainNetworkOptimizer()
    
    # Add facilities (distribution centers)
    # Format: add_facility(id, (lat, lon), capacity, fixed_cost, echelon)
    
    # Major distribution centers (echelon 3)
    kenya_sc.add_facility("Nairobi_DC", (-1.2921, 36.8219), 1000, 5000, 3)
    kenya_sc.add_facility("Mombasa_DC", (-4.0435, 39.6682), 800, 4500, 3)
    
    # Regional warehouses (echelon 2)
    kenya_sc.add_facility("Nakuru_WH", (-0.3031, 36.0800), 500, 2500, 2)
    kenya_sc.add_facility("Kisumu_WH", (-0.1022, 34.7617), 400, 2000, 2)
    kenya_sc.add_facility("Eldoret_WH", (0.5143, 35.2698), 350, 1800, 2)
    
    # Local retail centers (echelon 1)
    kenya_sc.add_facility("Nairobi_Retail1", (-1.2864, 36.8172), 200, 1000, 1)
    kenya_sc.add_facility("Mombasa_Retail1", (-4.0476, 39.6626), 150, 900, 1)
    kenya_sc.add_facility("Kisumu_Retail1", (-0.1040, 34.7550), 100, 800, 1)
    kenya_sc.add_facility("Nakuru_Retail1", (-0.2903, 36.0663), 100, 800, 1)
    kenya_sc.add_facility("Eldoret_Retail1", (0.5203, 35.2695), 80, 700, 1)
    
    # Add demand points (major cities and towns)
    # Format: add_demand_point(id, (lat, lon), demand_mean, [demand_std])
    kenya_sc.add_demand_point("Nairobi_D1", (-1.3098, 36.8537), 300, 60)
    kenya_sc.add_demand_point("Nairobi_D2", (-1.2359, 36.8889), 250, 50)
    kenya_sc.add_demand_point("Mombasa_D1", (-4.0311, 39.6842), 200, 40)
    kenya_sc.add_demand_point("Kisumu_D1", (-0.0917, 34.7680), 150, 30)
    kenya_sc.add_demand_point("Nakuru_D1", (-0.2762, 36.0677), 120, 24)
    kenya_sc.add_demand_point("Eldoret_D1", (0.5102, 35.2850), 100, 20)
    kenya_sc.add_demand_point("Thika_D1", (-1.0386, 37.0834), 90, 18)
    kenya_sc.add_demand_point("Malindi_D1", (-3.2138, 40.1191), 80, 16)
    
    # Add transportation routes between facilities (DC to warehouse, warehouse to retail)
    # Format: add_route(id, origin, destination, distance, transit_time, mode, [cost])
    
    # DC to warehouses
    kenya_sc.add_route("R1", "Nairobi_DC", "Nakuru_WH", 160, 3.0, "road")
    kenya_sc.add_route("R2", "Nairobi_DC", "Kisumu_WH", 340, 6.0, "road")
    kenya_sc.add_route("R3", "Mombasa_DC", "Nairobi_DC", 480, 8.0, "rail")
    kenya_sc.add_route("R4", "Nairobi_DC", "Eldoret_WH", 320, 5.5, "road")
    
    # Warehouses to retail centers
    kenya_sc.add_route("R5", "Nakuru_WH", "Nakuru_Retail1", 15, 0.5, "road")
    kenya_sc.add_route("R6", "Kisumu_WH", "Kisumu_Retail1", 10, 0.4, "road")
    kenya_sc.add_route("R7", "Eldoret_WH", "Eldoret_Retail1", 12, 0.5, "road")
    kenya_sc.add_route("R8", "Nairobi_DC", "Nairobi_Retail1", 15, 0.7, "road")
    kenya_sc.add_route("R9", "Mombasa_DC", "Mombasa_Retail1", 12, 0.5, "road")
    
    # Retail centers to demand points
    kenya_sc.add_route("R10", "Nairobi_Retail1", "Nairobi_D1", 10, 0.6, "road")
    kenya_sc.add_route("R11", "Nairobi_Retail1", "Nairobi_D2", 15, 0.7, "road")
    kenya_sc.add_route("R12", "Mombasa_Retail1", "Mombasa_D1", 8, 0.4, "road")
    kenya_sc.add_route("R13", "Kisumu_Retail1", "Kisumu_D1", 5, 0.3, "road")
    kenya_sc.add_route("R14", "Nakuru_Retail1", "Nakuru_D1", 6, 0.3, "road")
    kenya_sc.add_route("R15", "Eldoret_Retail1", "Eldoret_D1", 7, 0.4, "road")
    kenya_sc.add_route("R16", "Nairobi_Retail1", "Thika_D1", 40, 1.2, "road")
    kenya_sc.add_route("R17", "Mombasa_Retail1", "Malindi_D1", 120, 2.4, "road")
    
    # Add inventory parameters
    # Format: add_inventory_params(id, lead_time, review_period, demand_mean, demand_std, holding_cost, stockout_cost)
    
    # Distribution centers
    kenya_sc.add_inventory_params("Nairobi_DC", 10, 7, 800, 160, 2.0, 20.0)
    kenya_sc.add_inventory_params("Mombasa_DC", 12, 7, 600, 120, 2.0, 20.0)
    
    # Regional warehouses
    kenya_sc.add_inventory_params("Nakuru_WH", 5, 5, 400, 80, 2.5, 25.0)
    kenya_sc.add_inventory_params("Kisumu_WH", 7, 5, 300, 60, 2.5, 25.0)
    kenya_sc.add_inventory_params("Eldoret_WH", 8, 5, 250, 50, 2.5, 25.0)
    
    # Retail centers
    kenya_sc.add_inventory_params("Nairobi_Retail1", 3, 3, 300, 60, 3.0, 30.0)
    kenya_sc.add_inventory_params("Mombasa_Retail1", 3, 3, 200, 40, 3.0, 30.0)
    kenya_sc.add_inventory_params("Kisumu_Retail1", 2, 3, 150, 30, 3.0, 30.0)
    kenya_sc.add_inventory_params("Nakuru_Retail1", 2, 3, 120, 24, 3.0, 30.0)
    kenya_sc.add_inventory_params("Eldoret_Retail1", 2, 3, 100, 20, 3.0, 30.0)
    
    return kenya_sc


def main():
    """
    Main function to run the Kenya supply chain optimization model.
    """
    print("Creating Kenya Supply Chain Model...")
    kenya_sc = create_kenya_supply_chain_model()
    
    # 1. Multi-period facility location optimization
    print("\nRunning multi-period facility location optimization...")
    multi_period_results = kenya_sc.optimize_facility_location_multi_period(
        periods=12,
        demand_growth_rate=0.05
    )
    print(f"Facility location optimization complete. Status: {multi_period_results.get('status', 'unknown')}")
    
    # 2. Real-time routing optimization
    print("\nRunning real-time routing optimization...")
    routing_results = kenya_sc.optimize_routes_real_time(
        time_window=60,
        traffic_factor=0.2
    )
    print(f"Routing optimization execution time: {routing_results.get('execution_time', 0):.2f} seconds")
    
    # 3. Multi-echelon inventory optimization
    print("\nRunning multi-echelon inventory optimization...")
    inventory_results = kenya_sc.optimize_multi_echelon_inventory(
        service_level_target=0.95
    )
    print(f"Inventory optimization complete. Facilities optimized: {len(inventory_results)}")
    
    # 4. Visualize network
    print("\nGenerating network visualization...")
    # Save the visualization (will be saved as HTML file for folium)
    folium_map = kenya_sc.visualize_network(as_is=True, to_be=False, map_type="folium")
    folium_map.save("kenya_network_map.html")
    print("Network visualization saved as 'kenya_network_map.html'")
    
    # 5. Export model to JSON
    print("\nExporting model to JSON...")
    kenya_sc.export_to_json("kenya_supply_chain_model.json")
    print("Model exported as 'kenya_supply_chain_model.json'")
    
    print("\nOptimization process complete!")


if __name__ == "__main__":
    main()
