# Supply Metrics Optimax

A comprehensive supply chain optimization platform tailored for the Kenyan logistics ecosystem.

## Overview

Supply Metrics Optimax is a data-driven SaaS platform that helps businesses optimize their supply chain operations. The platform integrates advanced mathematical optimization techniques with real-world logistics constraints to deliver actionable insights and recommendations.

## Key Features

- **Facility Location Optimization**: Determine optimal facility locations based on demand, costs, and constraints
- **Route Planning and Optimization**: Calculate efficient routes considering various transport modes and constraints
- **Demand Forecasting**: Predict future demand patterns using time-series analysis
- **Supply Chain Chatbot**: AI-powered assistant for supply chain inquiries using 100% free NLP models
- **Data Auto-Deletion**: Automatic removal of inactive user data after 1 hour (free tier)
- **Disruption Simulation**: Model and analyze the impact of supply chain disruptions
- **Airport Integration**: Incorporate air transportation nodes into your supply chain network
- **Supplier Diversity Analysis**: Optimize supplier selection for resilience and cost-effectiveness
- **Resilience Metrics**: Measure and track the resilience of your supply chain network

## 100% Free and Open-Source

Supply Metrics Optimax is committed to providing completely free and open-source supply chain optimization tools:

- **No Commercial Dependencies**: All optimization algorithms use free, open-source libraries
- **Serverless Deployment**: Lightweight API design for minimal hosting costs
- **Free NLP Implementation**: Local chatbot using NLTK without external API dependencies
- **Data Auto-Deletion**: Automatically cleans up user data to reduce storage costs
- **Containerized Deployment**: Easy deployment with Docker and Docker Compose

## Technology Stack

### Frontend
- React + TypeScript
- Vite for build tooling
- shadcn/ui component library
- Tailwind CSS for styling
- Recharts for data visualization
- Leaflet for interactive maps

### Backend
- Python 3.8+ with FastAPI
- Google OR-Tools for routing optimization
- PuLP for facility location optimization
- NetworkX for graph algorithms
- NLTK for natural language processing
- Docker & Docker Compose for deployment

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- Docker (for containerized deployment)

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
VITE_API_URL=http://localhost:8000
```

5. Start the development server
```sh
npm run dev
```

### Using Docker (Recommended)

For the easiest setup, use Docker Compose:

```sh
# Build and start all services
docker-compose up -d

# Access the application at http://localhost:3000
# API is available at http://localhost:8000
```

## Project Structure

```
supply-metrics-optimax/
├── backend/               # Python backend application
│   ├── api/               # FastAPI endpoints
│   │   └── main.py        # Main API definition
│   ├── models/            # Mathematical optimization algorithms
│   │   ├── facility_location.py
│   │   ├── routing.py
│   │   ├── demand_forecasting.py
│   │   └── chatbot.py     # NLP chatbot implementation
│   └── services/          # Backend services
│       └── data_cleaner.py # Data auto-deletion service
├── src/                   # Frontend React application
│   ├── components/        # UI components
│   ├── lib/               # Utility functions and types
│   ├── pages/             # Main application pages
│   └── ...
├── docker/                # Docker configuration files
│   └── Dockerfile.frontend # Frontend container definition
├── Dockerfile             # Backend container definition
├── docker-compose.yml     # Multi-container deployment
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
Finds optimal delivery routes using the Vehicle Routing Problem (VRP) solver from OR-Tools:

- Multi-vehicle route planning
- Haversine distance calculation for accurate Kenyan routing
- Capacity constraints support
- Time window constraints

### Disruption Simulation
Models and analyzes the impact of supply chain disruptions.

### Airport Integration
Incorporates air transportation nodes into your supply chain network.

### Supplier Diversity Analysis
Optimizes supplier selection for resilience and cost-effectiveness.

### Resilience Metrics
Measures and tracks the resilience of your supply chain network.

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
