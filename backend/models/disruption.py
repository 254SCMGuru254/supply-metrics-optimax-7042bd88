"""
Supply Chain Disruption Simulation Module

This module provides capabilities to simulate various supply chain disruptions
including natural disasters, pandemics, and geopolitical events.
"""

import numpy as np
import networkx as nx
from typing import Dict, List, Tuple, Any, Optional
import json
import random
import time

class DisruptionSimulator:
    """
    Simulates various types of supply chain disruptions and their impacts
    on network performance.
    """
    
    DISRUPTION_TYPES = {
        "pandemic": {
            "duration_range": (90, 365),  # Days
            "severity_range": (0.3, 0.9),  # Impact factor
            "geographical_spread": 0.8,    # How widely it affects areas
        },
        "natural_disaster": {
            "duration_range": (1, 60),
            "severity_range": (0.5, 1.0),
            "geographical_spread": 0.3,
        },
        "political_instability": {
            "duration_range": (30, 180),
            "severity_range": (0.2, 0.7),
            "geographical_spread": 0.5,
        },
        "infrastructure_failure": {
            "duration_range": (1, 30),
            "severity_range": (0.4, 0.9),
            "geographical_spread": 0.2,
        }
    }
    
    def __init__(self, network_graph: nx.DiGraph):
        """
        Initialize the disruption simulator.
        
        Args:
            network_graph: NetworkX graph representing the supply chain
        """
        self.network_graph = network_graph
        self.current_disruptions = {}
        self.disruption_history = []
        
    def generate_disruption_scenario(self, 
                                    disruption_type: str,
                                    epicenter: Optional[Tuple[float, float]] = None,
                                    custom_params: Optional[Dict] = None) -> Dict:
        """
        Generate a disruption scenario of the specified type.
        
        Args:
            disruption_type: Type of disruption ("pandemic", "natural_disaster", etc.)
            epicenter: (lat, lon) for the center of the disruption
            custom_params: Override default parameters for this disruption
            
        Returns:
            Dictionary with disruption scenario details
        """
        if disruption_type not in self.DISRUPTION_TYPES:
            raise ValueError(f"Unknown disruption type: {disruption_type}")
            
        # Get base parameters for this disruption type
        params = self.DISRUPTION_TYPES[disruption_type].copy()
        
        # Override with custom parameters if provided
        if custom_params:
            for key, value in custom_params.items():
                if key in params:
                    params[key] = value
        
        # Generate random values within parameter ranges
        duration = random.randint(*params["duration_range"])
        severity = random.uniform(*params["severity_range"])
        
        # If no epicenter provided, choose a random node
        if not epicenter and len(self.network_graph.nodes) > 0:
            node_id = random.choice(list(self.network_graph.nodes))
            node_data = self.network_graph.nodes[node_id]
            if 'pos' in node_data:
                epicenter = node_data['pos']
            else:
                # Default to Kenya center if no position data
                epicenter = (0.0236, 37.9062)  # Kenya center
        
        # Generate scenario ID
        scenario_id = f"{disruption_type}_{int(time.time())}_{random.randint(1000, 9999)}"
        
        # Create scenario
        scenario = {
            "id": scenario_id,
            "type": disruption_type,
            "epicenter": epicenter,
            "duration": duration,
            "severity": severity,
            "geographical_spread": params["geographical_spread"],
            "start_time": time.time(),
            "end_time": time.time() + duration * 86400,  # Convert days to seconds
            "affected_nodes": [],
            "affected_edges": []
        }
        
        # Store in current disruptions
        self.current_disruptions[scenario_id] = scenario
        
        return scenario
        
    def apply_disruption_to_network(self, disruption_scenario: Dict) -> nx.DiGraph:
        """
        Apply a disruption scenario to the network, modifying node and edge attributes.
        
        Args:
            disruption_scenario: Disruption scenario details
            
        Returns:
            Modified network graph with disruption effects
        """
        # Create a copy of the network to modify
        modified_network = self.network_graph.copy()
        
        # Extract scenario parameters
        epicenter = disruption_scenario["epicenter"]
        severity = disruption_scenario["severity"]
        geo_spread = disruption_scenario["geographical_spread"]
        
        affected_nodes = []
        affected_edges = []
        
        # Calculate impact on each node based on distance from epicenter
        for node_id, node_data in modified_network.nodes(data=True):
            # Skip nodes without position data
            if 'pos' not in node_data:
                continue
                
            # Calculate distance from epicenter
            node_pos = node_data['pos']
            distance = np.sqrt((node_pos[0] - epicenter[0])**2 + 
                              (node_pos[1] - epicenter[1])**2)
            
            # Calculate impact factor (decreases with distance)
            distance_factor = max(0, 1 - distance / (geo_spread * 5))
            impact = severity * distance_factor
            
            # Apply impact if significant
            if impact > 0.05:
                # Reduce capacity
                if 'capacity' in node_data:
                    modified_network.nodes[node_id]['original_capacity'] = node_data['capacity']
                    modified_network.nodes[node_id]['capacity'] = max(0, node_data['capacity'] * (1 - impact))
                
                # Increase costs
                if 'fixed_cost' in node_data:
                    modified_network.nodes[node_id]['original_fixed_cost'] = node_data['fixed_cost']
                    modified_network.nodes[node_id]['fixed_cost'] = node_data['fixed_cost'] * (1 + impact * 0.5)
                
                # Mark as affected
                modified_network.nodes[node_id]['disruption_impact'] = impact
                affected_nodes.append((node_id, impact))
        
        # Calculate impact on each edge
        for u, v, edge_data in modified_network.edges(data=True):
            # Calculate average impact on connected nodes
            u_impact = modified_network.nodes[u].get('disruption_impact', 0)
            v_impact = modified_network.nodes[v].get('disruption_impact', 0)
            edge_impact = max(u_impact, v_impact) * 1.2  # Edges are more affected than nodes
            
            # Apply impact if significant
            if edge_impact > 0.05:
                # Increase transit time
                if 'transit_time' in edge_data:
                    modified_network.edges[u, v]['original_transit_time'] = edge_data['transit_time']
                    modified_network.edges[u, v]['transit_time'] = edge_data['transit_time'] * (1 + edge_impact)
                
                # Reduce capacity
                if 'capacity' in edge_data:
                    modified_network.edges[u, v]['original_capacity'] = edge_data['capacity']
                    modified_network.edges[u, v]['capacity'] = max(0, edge_data['capacity'] * (1 - edge_impact))
                
                # Mark as affected
                modified_network.edges[u, v]['disruption_impact'] = edge_impact
                affected_edges.append(((u, v), edge_impact))
        
        # Update scenario with affected elements
        disruption_scenario["affected_nodes"] = affected_nodes
        disruption_scenario["affected_edges"] = affected_edges
        
        return modified_network
    
    def monte_carlo_simulation(self, 
                              num_scenarios: int = 100,
                              time_period: int = 365,
                              disruption_probability: float = 0.01) -> List[Dict]:
        """
        Run Monte Carlo simulation of random disruptions over a time period.
        
        Args:
            num_scenarios: Number of random scenarios to generate
            time_period: Number of days to simulate
            disruption_probability: Daily probability of a new disruption
            
        Returns:
            List of disruption scenarios generated
        """
        all_scenarios = []
        
        for _ in range(num_scenarios):
            # Reset simulation state
            current_day = 0
            active_disruptions = []
            scenario_history = []
            
            # Simulate each day
            while current_day < time_period:
                # Check if new disruption occurs
                if random.random() < disruption_probability:
                    # Choose a random disruption type
                    disruption_type = random.choice(list(self.DISRUPTION_TYPES.keys()))
                    
                    # Generate the disruption
                    new_disruption = self.generate_disruption_scenario(disruption_type)
                    active_disruptions.append(new_disruption)
                    scenario_history.append(new_disruption)
                
                # Update day counter
                current_day += 1
                
                # Remove expired disruptions
                active_disruptions = [d for d in active_disruptions 
                                     if d["start_time"] + d["duration"] * 86400 > current_day * 86400]
            
            all_scenarios.append({
                "scenario_id": f"montecarlo_{int(time.time())}_{_}",
                "disruptions": scenario_history,
                "metrics": self._calculate_scenario_metrics(scenario_history)
            })
            
        return all_scenarios
    
    def _calculate_scenario_metrics(self, disruptions: List[Dict]) -> Dict:
        """
        Calculate metrics for a disruption scenario.
        
        Args:
            disruptions: List of disruption events
            
        Returns:
            Dictionary of scenario metrics
        """
        return {
            "total_disruptions": len(disruptions),
            "avg_severity": np.mean([d["severity"] for d in disruptions]) if disruptions else 0,
            "max_severity": max([d["severity"] for d in disruptions]) if disruptions else 0,
            "total_duration": sum([d["duration"] for d in disruptions]),
            "disruption_types": {d_type: sum(1 for d in disruptions if d["type"] == d_type)
                               for d_type in self.DISRUPTION_TYPES}
        }
    
    def evaluate_network_resilience(self, 
                                  original_network: nx.DiGraph,
                                  disruption_scenario: Dict) -> Dict:
        """
        Evaluate the resilience of a network to a disruption.
        
        Args:
            original_network: Original network graph
            disruption_scenario: Disruption scenario to evaluate
            
        Returns:
            Dictionary of resilience metrics
        """
        # Apply the disruption to get the affected network
        disrupted_network = self.apply_disruption_to_network(disruption_scenario)
        
        # Calculate network connectivity metrics
        original_connectivity = nx.average_node_connectivity(original_network)
        try:
            disrupted_connectivity = nx.average_node_connectivity(disrupted_network)
            connectivity_reduction = 1 - (disrupted_connectivity / original_connectivity)
        except:
            connectivity_reduction = 1.0  # Assume complete failure if calculation fails
        
        # Calculate path length changes
        path_length_increases = []
        for source in list(original_network.nodes())[:10]:  # Limit to first 10 nodes for efficiency
            for target in list(original_network.nodes())[:10]:
                if source != target:
                    try:
                        original_path_length = nx.shortest_path_length(original_network, source, target)
                        disrupted_path_length = nx.shortest_path_length(disrupted_network, source, target)
                        increase = (disrupted_path_length - original_path_length) / original_path_length
                        path_length_increases.append(increase)
                    except:
                        # Path doesn't exist in one of the networks
                        pass
        
        avg_path_increase = np.mean(path_length_increases) if path_length_increases else float('inf')
        
        # Calculate capacity reduction
        capacity_reductions = []
        for node in disrupted_network.nodes():
            original = original_network.nodes[node].get('capacity', 0)
            disrupted = disrupted_network.nodes[node].get('capacity', 0)
            if original > 0:
                reduction = (original - disrupted) / original
                capacity_reductions.append(reduction)
        
        avg_capacity_reduction = np.mean(capacity_reductions) if capacity_reductions else 0
        
        return {
            "connectivity_reduction": connectivity_reduction,
            "avg_path_length_increase": avg_path_increase,
            "avg_capacity_reduction": avg_capacity_reduction,
            "resilience_score": 1 - (connectivity_reduction * 0.4 + 
                                   min(1, avg_path_increase) * 0.3 + 
                                   avg_capacity_reduction * 0.3)
        }
