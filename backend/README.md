# Supply Chain Optimization Framework

## Overview

This is a comprehensive supply chain optimization framework specifically designed for the Kenyan market. The framework implements advanced mathematical optimization methods to solve various supply chain problems:

1. **Facility Location Optimization**: Determines optimal locations for distribution centers, warehouses, and retail points considering multiple time periods and capacity expansions.

2. **Routing Optimization**: Optimizes transportation routes in real-time, considering traffic conditions and modal choices (road, rail, air, sea).

3. **Inventory Optimization**: Implements multi-echelon inventory optimization with service level constraints and risk pooling effects.

## Architecture

The codebase follows a modular architecture with clear separation of concerns:

```
backend/
├── models/               # Core optimization models
│   ├── facility_location.py  # Facility location optimization
│   ├── routing.py        # Routing optimization
│   ├── inventory.py      # Inventory optimization
│   └── network_optimizer.py  # Main network optimizer integrating all models
├── tests/                # Unit tests
│   ├── test_facility_location.py
│   ├── test_routing.py
│   └── test_inventory.py
├── data/                 # Data storage
└── utils/                # Utility functions
```

## Key Models

### 1. Facility Location Optimization

Implements state-of-the-art facility location models:
- Multi-period optimization following Melo et al. (2009)
- Green facility location with environmental constraints
- Capacitated facility location

### 2. Routing Optimization

Implements advanced routing algorithms:
- Real-time routing with dynamic travel times based on Toth & Vigo (2014)
- Multi-modal route planning
- Time window constraints

### 3. Inventory Optimization

Implements inventory optimization models:
- Multi-echelon inventory optimization following Graves & Willems (2008)
- Safety stock determination
- Reorder point calculation
- Service level constraints

## Kenya-Specific Implementation

The framework includes a Kenya-specific implementation with:

- Predefined locations for major distribution centers, warehouses, and retail points across Kenya
- Transportation routes including road and rail (SGR) options
- Default demand parameters calibrated for the Kenyan market

## Usage

### Basic Usage

```python
from backend.models.network_optimizer import SupplyChainNetworkOptimizer

# Create a new optimizer
optimizer = SupplyChainNetworkOptimizer()

# Add facilities, demand points, routes, and inventory parameters
optimizer.add_facility("Nairobi_DC", (-1.2921, 36.8219), 1000, 5000, 3)
optimizer.add_demand_point("Nairobi_D1", (-1.3098, 36.8537), 300, 60)
optimizer.add_route("R1", "Nairobi_DC", "Nakuru_WH", 160, 3.0, "road")
optimizer.add_inventory_params("Nairobi_DC", 10, 7, 800, 160, 2.0, 20.0)

# Run optimization models
facility_results = optimizer.optimize_facility_location_multi_period()
routing_results = optimizer.optimize_routes_real_time()
inventory_results = optimizer.optimize_multi_echelon_inventory()

# Visualize the network
map_visualization = optimizer.visualize_network(map_type="folium")
map_visualization.save("network_map.html")

# Export the model
optimizer.export_to_json("supply_chain_model.json")
```

### Using the Kenya Model

```python
from backend.kenya_model import create_kenya_supply_chain_model

# Create preconfigured Kenya model
kenya_sc = create_kenya_supply_chain_model()

# Run optimization
results = kenya_sc.optimize_facility_location_multi_period()

# Visualize the Kenya network
kenya_sc.visualize_network().save("kenya_network.html")
```

## Testing

Run the unit tests to verify correct functionality:

```
cd supply-metrics-optimax
python -m unittest discover backend/tests
```

## Dependencies

- NumPy
- NetworkX
- Matplotlib
- Folium
- PuLP
- Gurobi (for advanced optimization)
- Pandas
- SciPy

## References

1. Melo, M. T., Nickel, S., & Saldanha-Da-Gama, F. (2009). "A dynamic multi-commodity capacitated facility location problem with service level constraints"
2. Toth, P., & Vigo, D. (2014). "Vehicle Routing: Problems, Methods, and Applications"
3. Graves, S. C., & Willems, S. P. (2008). "Optimizing Strategic Safety Stock Placement in Supply Chains"
