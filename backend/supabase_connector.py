"""
Supabase connector for the Supply Metrics Optimax platform.
This module provides integration between the Python optimization models
and the Supabase backend database.
"""

import os
import json
import requests
from typing import Dict, List, Any, Optional, Union
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SupabaseConnector:
    """
    Connector class to interface between Python optimization models and Supabase.
    
    This class provides methods to:
    - Authenticate with Supabase
    - Fetch supply chain network data
    - Store optimization results
    - Calculate and update resilience metrics
    """
    
    def __init__(self, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        """
        Initialize the Supabase connector.
        
        Args:
            supabase_url: Supabase project URL (defaults to SUPABASE_URL env var)
            supabase_key: Supabase service key (defaults to SUPABASE_SERVICE_KEY env var)
        """
        self.supabase_url = supabase_url or os.getenv("SUPABASE_URL")
        self.supabase_key = supabase_key or os.getenv("SUPABASE_SERVICE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError(
                "Supabase URL and key must be provided either as arguments or environment variables."
            )
        
        # Ensure URL ends with /
        if not self.supabase_url.endswith("/"):
            self.supabase_url += "/"
            
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        }
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """
        Make a request to the Supabase REST API.
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint path
            data: Optional JSON data to send
            
        Returns:
            API response as dictionary
        """
        url = f"{self.supabase_url}rest/v1/{endpoint}"
        
        if method == "GET":
            response = requests.get(url, headers=self.headers)
        elif method == "POST":
            response = requests.post(url, headers=self.headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=self.headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=self.headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        
        if response.status_code == 204:  # No content
            return {}
            
        return response.json()
    
    def get_network(self, network_id: str) -> Dict:
        """
        Fetch a supply chain network by ID.
        
        Args:
            network_id: UUID of the network
            
        Returns:
            Network data including nodes and edges
        """
        return self._make_request(
            "GET", 
            f"supply_chain_networks?id=eq.{network_id}&select=*"
        )[0]
    
    def get_network_list(self, user_id: str) -> List[Dict]:
        """
        Fetch all networks for a specific user.
        
        Args:
            user_id: UUID of the user
            
        Returns:
            List of network data
        """
        return self._make_request(
            "GET", 
            f"supply_chain_networks?user_id=eq.{user_id}&select=*"
        )
    
    def create_network(self, network_data: Dict) -> Dict:
        """
        Create a new supply chain network.
        
        Args:
            network_data: Network data including nodes and edges
            
        Returns:
            Created network data with ID
        """
        return self._make_request(
            "POST", 
            "supply_chain_networks", 
            network_data
        )
    
    def update_network(self, network_id: str, network_data: Dict) -> Dict:
        """
        Update an existing supply chain network.
        
        Args:
            network_id: UUID of the network
            network_data: Updated network data
            
        Returns:
            Updated network data
        """
        return self._make_request(
            "PUT", 
            f"supply_chain_networks?id=eq.{network_id}", 
            network_data
        )
    
    def store_optimization_result(self, result_data: Dict) -> Dict:
        """
        Store optimization results in the database.
        
        Args:
            result_data: Optimization result data including:
                - network_id: UUID of the network
                - optimization_type: Type of optimization performed
                - parameters: Parameters used for optimization
                - results: Results of the optimization
                - execution_time: Time taken to execute the optimization
                - user_id: UUID of the user
                
        Returns:
            Created optimization result with ID
        """
        return self._make_request(
            "POST", 
            "optimization_results", 
            result_data
        )
    
    def get_optimization_results(self, network_id: str) -> List[Dict]:
        """
        Fetch optimization results for a specific network.
        
        Args:
            network_id: UUID of the network
            
        Returns:
            List of optimization results
        """
        return self._make_request(
            "GET", 
            f"optimization_results?network_id=eq.{network_id}&select=*"
        )
    
    def get_airport_nodes(self, user_id: str) -> List[Dict]:
        """
        Fetch all airport nodes for a specific user.
        
        Args:
            user_id: UUID of the user
            
        Returns:
            List of airport nodes
        """
        return self._make_request(
            "GET", 
            f"airport_nodes?user_id=eq.{user_id}&select=*"
        )
    
    def get_disruption_scenarios(self, user_id: str) -> List[Dict]:
        """
        Fetch all disruption scenarios for a specific user.
        
        Args:
            user_id: UUID of the user
            
        Returns:
            List of disruption scenarios
        """
        return self._make_request(
            "GET", 
            f"disruption_scenarios?user_id=eq.{user_id}&select=*"
        )
    
    def calculate_and_store_resilience_metrics(self, network_id: str, user_id: str) -> Dict:
        """
        Calculate and store resilience metrics for a network.
        
        Args:
            network_id: UUID of the network
            user_id: UUID of the user
            
        Returns:
            Calculated resilience metrics
        """
        # Get the network data
        network = self.get_network(network_id)
        
        # Calculate resilience metrics
        # This is a simplified example - in practice, this would use more complex algorithms
        nodes = network.get("nodes", {})
        edges = network.get("edges", {})
        
        # Calculate basic metrics
        node_count = len(nodes)
        edge_count = len(edges)
        
        # Simple network density as a connectivity score
        connectivity_score = 0
        if node_count > 1:
            max_edges = (node_count * (node_count - 1)) / 2
            connectivity_score = min(100, (edge_count / max_edges) * 100) if max_edges > 0 else 0
        
        # Simple redundancy score based on average node degree
        avg_degree = (2 * edge_count) / node_count if node_count > 0 else 0
        redundancy_score = min(100, (avg_degree / 4) * 100)  # Assuming 4 connections is ideal
        
        # Simplified recovery time estimate (days)
        recovery_time = 30 / (1 + (connectivity_score / 100))
        
        # Simplified adaptability score
        adaptability_score = (connectivity_score + redundancy_score) / 2
        
        # Simplified vulnerability index (lower is better)
        vulnerability_index = 100 - adaptability_score
        
        # Prepare metrics data
        metrics_data = {
            "network_id": network_id,
            "connectivity_score": connectivity_score,
            "recovery_time": recovery_time,
            "redundancy_score": redundancy_score,
            "adaptability_score": adaptability_score,
            "vulnerability_index": vulnerability_index,
            "metrics_data": {
                "node_count": node_count,
                "edge_count": edge_count,
                "avg_degree": avg_degree,
                "network_density": connectivity_score / 100,
            },
            "user_id": user_id
        }
        
        # Store metrics in database
        return self._make_request(
            "POST", 
            "resilience_metrics", 
            metrics_data
        )
    
    def generate_disruption_impact(self, network_id: str, disruption_id: str) -> Dict:
        """
        Generate the impact of a disruption on a network.
        
        Args:
            network_id: UUID of the network
            disruption_id: UUID of the disruption scenario
            
        Returns:
            Disruption impact data
        """
        # Get the network and disruption data
        network = self.get_network(network_id)
        
        # Get the disruption scenario
        disruption = self._make_request(
            "GET", 
            f"disruption_scenarios?id=eq.{disruption_id}&select=*"
        )[0]
        
        # Extract relevant data
        nodes = network.get("nodes", {})
        edges = network.get("edges", {})
        affected_nodes = disruption.get("affected_nodes", [])
        impact_level = disruption.get("impact_level", 50) / 100  # Convert to decimal
        
        # Calculate basic impact metrics
        # This is a simplified example - in practice, this would use more complex algorithms
        
        # Percentage of nodes affected
        nodes_affected_pct = len(affected_nodes) / len(nodes) if nodes else 0
        
        # Calculate delivery delay based on impact and affected nodes
        average_delay = nodes_affected_pct * impact_level * 14  # Max 14 days delay
        
        # Calculate cost impact (simplified)
        cost_impact = nodes_affected_pct * impact_level * 100  # Max $100K
        
        # Calculate service level impact
        baseline_service_level = 98  # Assuming 98% baseline service level
        service_level = baseline_service_level - (nodes_affected_pct * impact_level * 30)  # Max 30% reduction
        
        # Generate recovery actions (simplified)
        recovery_actions = [
            "Activate alternative suppliers for affected regions",
            "Implement expedited shipping for critical products",
            "Reallocate inventory from unaffected distribution centers",
            "Increase safety stock levels for high-risk items"
        ]
        
        # Generate network impact data for visualization
        network_impact = {
            "affected_nodes": affected_nodes,
            "impact_levels": {
                node_id: impact_level * disruption.get("duration", 30) / 30
                for node_id in affected_nodes
            },
            "alternative_routes": {}  # Would be calculated with routing algorithm
        }
        
        # Prepare impact results
        impact_results = {
            "average_delay": average_delay,
            "cost_impact": cost_impact,
            "service_level": service_level,
            "recovery_actions": recovery_actions,
            "network_impact": network_impact
        }
        
        return impact_results
    
    def optimize_facilities(self, network_data: Dict, parameters: Dict) -> Dict:
        """
        Run facility location optimization using the backend models.
        
        This is where we bridge the gap between the Supabase database
        and the Python optimization models.
        
        Args:
            network_data: Network data including nodes and edges
            parameters: Optimization parameters
            
        Returns:
            Optimization results
        """
        from backend.models import FacilityLocationOptimizer
        
        # Convert network data to the format expected by the optimizer
        # This is a simplified example and would be more complex in practice
        
        # Extract demand points from network nodes
        demand_points = {}
        for node_id, node in network_data.get("nodes", {}).items():
            if node.get("type") == "demand":
                demand_points[node_id] = {
                    "demand_mean": node.get("demand", 100),
                    "location": node.get("location", {"lat": 0, "lng": 0})
                }
        
        # Extract candidate facilities from network nodes
        facility_candidates = {}
        for node_id, node in network_data.get("nodes", {}).items():
            if node.get("type") == "facility_candidate":
                facility_candidates[node_id] = {
                    "capacity": node.get("capacity", 1000),
                    "fixed_cost": node.get("fixed_cost", 10000),
                    "location": node.get("location", {"lat": 0, "lng": 0})
                }
        
        # Create optimizer instance
        optimizer = FacilityLocationOptimizer(
            demand_points=demand_points,
            facility_candidates=facility_candidates
        )
        
        # Run appropriate optimization based on parameters
        optimization_type = parameters.get("type", "basic")
        
        if optimization_type == "multi_period":
            periods = parameters.get("periods", 12)
            demand_growth_rate = parameters.get("demand_growth_rate", 0.05)
            
            results = optimizer.optimize_facility_location_multi_period(
                periods=periods,
                demand_growth_rate=demand_growth_rate
            )
        elif optimization_type == "green":
            carbon_limit = parameters.get("carbon_limit", 1000)
            
            results = optimizer.optimize_green_facility_location(
                carbon_limit=carbon_limit
            )
        else:
            # Basic facility location optimization
            results = optimizer.optimize_facility_location()
        
        return results
    
    def optimize_routing(self, network_data: Dict, parameters: Dict) -> Dict:
        """
        Run routing optimization using the backend models.
        
        Args:
            network_data: Network data including nodes and edges
            parameters: Optimization parameters
            
        Returns:
            Optimization results
        """
        from backend.models import RoutingOptimizer
        
        # Convert network data to the format expected by the optimizer
        # This is a simplified example and would be more complex in practice
        
        # Extract nodes
        nodes = {}
        for node_id, node in network_data.get("nodes", {}).items():
            nodes[node_id] = {
                "location": node.get("location", {"lat": 0, "lng": 0}),
                "demand": node.get("demand", 0),
                "time_window": node.get("time_window", {"start": 0, "end": 24})
            }
        
        # Extract routes from edges
        routes = {}
        for edge_id, edge in network_data.get("edges", {}).items():
            routes[edge_id] = {
                "from_node": edge.get("from", ""),
                "to_node": edge.get("to", ""),
                "transit_time": edge.get("transit_time", 1),
                "distance": edge.get("distance", 10),
                "cost": edge.get("cost", 100)
            }
        
        # Create optimizer instance
        optimizer = RoutingOptimizer(
            nodes=nodes,
            routes=routes
        )
        
        # Run appropriate optimization based on parameters
        optimization_type = parameters.get("type", "basic")
        
        if optimization_type == "real_time":
            time_window = parameters.get("time_window", 60)
            traffic_factor = parameters.get("traffic_factor", 0.2)
            
            results = optimizer.optimize_routes_real_time(
                time_window=time_window,
                traffic_factor=traffic_factor
            )
        elif optimization_type == "multi_modal":
            mode_preferences = parameters.get("mode_preferences", {})
            
            results = optimizer.optimize_multi_modal_routes(
                mode_preferences=mode_preferences
            )
        elif optimization_type == "time_windows":
            vehicle_capacity = parameters.get("vehicle_capacity", 10)
            num_vehicles = parameters.get("num_vehicles", 5)
            
            results = optimizer.optimize_vehicle_routing_time_windows(
                vehicle_capacity=vehicle_capacity,
                num_vehicles=num_vehicles
            )
        else:
            # Basic routing optimization
            results = optimizer.optimize_routes()
        
        return results


# Example usage:
if __name__ == "__main__":
    # This would typically be loaded from environment variables
    connector = SupabaseConnector(
        supabase_url="https://your-project-id.supabase.co",
        supabase_key="your-service-key"
    )
    
    # Example: Get a network
    # network = connector.get_network("network-uuid")
    
    # Example: Store optimization results
    # result = connector.store_optimization_result({
    #     "network_id": "network-uuid",
    #     "optimization_type": "facility_location",
    #     "parameters": {"type": "basic"},
    #     "results": {"selected_facilities": ["facility1", "facility2"]},
    #     "execution_time": 2.5,
    #     "user_id": "user-uuid"
    # })
