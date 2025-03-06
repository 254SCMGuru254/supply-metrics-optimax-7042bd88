# Backend Integration Guide

This document provides technical details on how the Python optimization models integrate with the Supabase backend in Supply Metrics Optimax.

## Architecture Overview

```
  +------------------+       +-----------------+       +------------------+
  |                  |       |                 |       |                  |
  | React Frontend   | <---> | Supabase        | <---> | Python           |
  | (TypeScript/UI)  |       | (Postgres/Auth) |       | (Optimization)   |
  |                  |       |                 |       |                  |
  +------------------+       +-----------------+       +------------------+
```

## Supabase Integration

The platform uses Supabase for:
1. User authentication and management
2. Database storage for all supply chain data
3. Serverless functions to trigger optimization jobs
4. Real-time updates when optimization results are available

## Database Schema

The core database tables include:

| Table Name             | Description                                   |
|------------------------|-----------------------------------------------|
| supply_chain_networks  | Stores network topology and metadata          |
| disruption_scenarios   | Stores disruption simulation scenarios        |
| airport_nodes          | Stores airport transportation nodes           |
| supplier_profiles      | Stores supplier details and risk profiles     |
| resilience_metrics     | Stores calculated network resilience metrics  |
| optimization_results   | Stores results from optimization runs         |
| user_profiles          | Stores user-specific settings and quotas      |

## SupabaseConnector

The `SupabaseConnector` class in `backend/supabase_connector.py` serves as the bridge between our Python optimization models and the Supabase database. It provides methods to:

1. Fetch data from Supabase
2. Run optimization models with the fetched data
3. Store optimization results back in Supabase

### Initialization

```python
from backend.supabase_connector import SupabaseConnector

# Initialize with environment variables
connector = SupabaseConnector()

# Or initialize with explicit credentials
connector = SupabaseConnector(
    supabase_url="https://your-project-id.supabase.co",
    supabase_key="your-service-key"
)
```

### Key Methods

#### Fetching Data

```python
# Get a supply chain network
network = connector.get_network("network-uuid")

# Get all networks for a user
networks = connector.get_network_list("user-uuid")

# Get airport nodes
airports = connector.get_airport_nodes("user-uuid")

# Get disruption scenarios
scenarios = connector.get_disruption_scenarios("user-uuid")
```

#### Running Optimizations

```python
# Run facility location optimization
facility_results = connector.optimize_facilities(
    network_data=network,
    parameters={
        "type": "multi_period",
        "periods": 12,
        "demand_growth_rate": 0.05
    }
)

# Run routing optimization
routing_results = connector.optimize_routing(
    network_data=network,
    parameters={
        "type": "time_windows",
        "vehicle_capacity": 10,
        "num_vehicles": 5
    }
)
```

#### Storing Results

```python
# Store optimization results
connector.store_optimization_result({
    "network_id": "network-uuid",
    "optimization_type": "facility_location",
    "parameters": {"type": "basic"},
    "results": {"selected_facilities": ["facility1", "facility2"]},
    "execution_time": 2.5,
    "user_id": "user-uuid"
})

# Calculate and store resilience metrics
metrics = connector.calculate_and_store_resilience_metrics(
    network_id="network-uuid",
    user_id="user-uuid"
)
```

## Optimization Models

### Facility Location Optimizer

The `FacilityLocationOptimizer` uses PuLP to solve facility location problems:

```python
from backend.models import FacilityLocationOptimizer

# Initialize the optimizer
optimizer = FacilityLocationOptimizer(
    demand_points=demand_data,
    facility_candidates=facility_data
)

# Run basic optimization
results = optimizer.optimize_facility_location()

# Run multi-period optimization
results = optimizer.optimize_facility_location_multi_period(
    periods=12,
    demand_growth_rate=0.05
)

# Run green facility optimization
results = optimizer.optimize_green_facility_location(
    carbon_limit=1000
)
```

### Routing Optimizer

The `RoutingOptimizer` uses PuLP to solve various routing problems:

```python
from backend.models import RoutingOptimizer

# Initialize the optimizer
optimizer = RoutingOptimizer(
    nodes=nodes_data,
    routes=routes_data
)

# Run basic routing optimization
results = optimizer.optimize_routes()

# Run real-time routing optimization
results = optimizer.optimize_routes_real_time(
    time_window=60,
    traffic_factor=0.2
)

# Run multi-modal route optimization
results = optimizer.optimize_multi_modal_routes(
    mode_preferences={
        "road": 0.6,
        "rail": 0.3,
        "air": 0.1
    }
)

# Run vehicle routing with time windows
results = optimizer.optimize_vehicle_routing_time_windows(
    vehicle_capacity=10,
    num_vehicles=5
)
```

## Environment Setup

To set up the Python environment for backend integration:

1. Install Python 3.8+
2. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set environment variables for Supabase connection:
   ```bash
   export SUPABASE_URL=your_supabase_url
   export SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

## Error Handling

The connector includes error handling for common issues:

- Network connectivity problems
- Authentication failures
- Data format issues
- Optimization solver failures

Errors are logged with descriptive messages to aid debugging.

## Security Considerations

- The connector uses Supabase service keys which have admin access
- Never expose these keys in client-side code
- Consider using Row Level Security in Supabase for data isolation
- Validate all data before passing it to optimization solvers
- Implement rate limiting for resource-intensive operations

## Performance Optimization

For large-scale optimizations:

1. Consider running heavy computations in background workers
2. Implement caching of frequently accessed data
3. Use batch operations when storing multiple results
4. Set reasonable timeouts for optimization solvers
5. Monitor memory usage for large network optimizations

## Extending the Backend

To add new optimization models:

1. Create a new model class in `backend/models/`
2. Implement the necessary optimization methods
3. Add connector methods to bridge with Supabase
4. Update the API to expose the new functionality
5. Add appropriate database tables if needed
