# Supply Metrics Optimax

A comprehensive supply chain optimization platform tailored for the Kenyan logistics ecosystem.

## Overview

Supply Metrics Optimax is a data-driven SaaS platform that helps businesses optimize their supply chain operations. The platform integrates advanced mathematical optimization techniques with real-world logistics constraints to deliver actionable insights and recommendations.

## Key Features

- **Facility Location Optimization**: Determine optimal facility locations based on demand, costs, and constraints
- **Route Planning and Optimization**: Calculate efficient routes considering various transport modes and constraints
- **Disruption Simulation**: Model and analyze the impact of supply chain disruptions
- **Airport Integration**: Incorporate air transportation nodes into your supply chain network
- **Supplier Diversity Analysis**: Optimize supplier selection for resilience and cost-effectiveness
- **Resilience Metrics**: Measure and track the resilience of your supply chain network

## Technology Stack

### Frontend
- React + TypeScript
- Vite for build tooling
- shadcn/ui component library
- Tailwind CSS for styling
- Recharts for data visualization

### Backend
- Python optimization models using PuLP
- Supabase for database, authentication, and serverless functions

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- Supabase account

### Installation

1. Clone the repository
```sh
git clone https://github.com/254SCMGuru254/supply-metrics-optimax.git
cd supply-metrics-optimax
```

2. Install frontend dependencies
```sh
npm install
```

3. Install Python dependencies
```sh
pip install -r requirements.txt
```

4. Set up environment variables
```sh
# Create a .env file in the root directory
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For the Python backend
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

5. Start the development server
```sh
npm run dev
```

## Project Structure

```
supply-metrics-optimax/
├── backend/               # Python optimization models
│   ├── models/            # Mathematical optimization algorithms
│   │   ├── facility_location.py
│   │   ├── routing.py
│   │   └── ...
│   └── supabase_connector.py  # Connector between Python models and Supabase
├── src/                   # Frontend React application
│   ├── components/        # UI components
│   │   ├── auth/          # Authentication components
│   │   ├── disruption-simulation/
│   │   ├── airport-integration/
│   │   ├── resilience-metrics/
│   │   └── ...
│   ├── lib/               # Utility functions and types
│   ├── pages/             # Main application pages
│   └── ...
├── supabase/              # Supabase configuration
└── ...
```

## Optimization Models

### Facility Location Optimizer
Helps determine the optimal locations for facilities based on demand patterns, transportation costs, and facility costs.

Features:
- Basic facility location optimization
- Multi-period facility location with demand growth
- Green facility location with environmental constraints

### Routing Optimizer
Calculates optimal routes for product movement through the supply chain network.

Features:
- Real-time route optimization
- Multi-modal route planning
- Vehicle routing with time window constraints

## Supabase Integration

This platform uses Supabase for:
- User authentication and authorization
- Data storage for supply chain networks
- Serverless functions for computationally intensive operations
- Real-time synchronization of optimization results

## Deployment

The application can be deployed to any hosting platform that supports React applications. For the Python backend, consider deploying to a serverless platform or a containerized environment.

## Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

[MIT License](LICENSE)

## Contact

For inquiries, please contact [Your Contact Information]
