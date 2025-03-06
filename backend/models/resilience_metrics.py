"""
Supply Chain Resilience Metrics Module

This module provides metrics and calculations to evaluate the resilience
of supply chain networks under various disruption scenarios.
"""

import numpy as np
import networkx as nx
from typing import Dict, List, Tuple, Any, Optional
import time

class ResilienceCalculator:
    """
    Calculates various resilience metrics for supply chain networks.
    """
    
    def __init__(self, network_optimizer):
        """
        Initialize the resilience calculator.
        
        Args:
            network_optimizer: SupplyChainNetworkOptimizer instance
        """
        self.optimizer = network_optimizer
        self.baseline_metrics = {}
        self.baseline_calculated = False
        
    def calculate_baseline_metrics(self):
        """
        Calculate baseline metrics for the undisrupted network.
        These will be used as reference for comparing disrupted states.
        """
        # Get the network graph
        network = self.optimizer.network_graph
        
        # Calculate key network metrics
        metrics = {}
        
        # Connectivity metrics
        metrics["avg_degree"] = np.mean([d for n, d in network.degree()])
        
        try:
            metrics["avg_shortest_path"] = nx.average_shortest_path_length(network)
        except nx.NetworkXError:
            # Graph may not be connected
            metrics["avg_shortest_path"] = float('inf')
            
        # Calculate total capacity
        total_capacity = sum(data.get('capacity', 0) for _, data in network.nodes(data=True))
        metrics["total_capacity"] = total_capacity
        
        # Calculate total throughput (assuming all demand is met)
        demand_sum = sum(d.get('demand_mean', 0) for d in self.optimizer.demand_points.values())
        metrics["total_demand"] = demand_sum
        
        # Calculate inventory metrics
        if hasattr(self.optimizer, 'inventory_params'):
            total_safety_stock = 0
            for facility_id, params in self.optimizer.inventory_params.items():
                if 'demand_std' in params and 'lead_time' in params:
                    # Simple safety stock calculation
                    safety_stock = params['demand_std'] * np.sqrt(params['lead_time']) * 1.64  # ~95% service level
                    total_safety_stock += safety_stock
                    
            metrics["total_safety_stock"] = total_safety_stock
            
        # Store baseline metrics
        self.baseline_metrics = metrics
        self.baseline_calculated = True
        
        return metrics
        
    def calculate_disruption_impact(self, disrupted_network: nx.DiGraph) -> Dict:
        """
        Calculate the impact of a disruption by comparing metrics
        to the baseline.
        
        Args:
            disrupted_network: Disrupted network graph
            
        Returns:
            Dictionary of impact metrics
        """
        # Ensure baseline is calculated
        if not self.baseline_calculated:
            self.calculate_baseline_metrics()
            
        # Calculate metrics for disrupted network
        metrics = {}
        
        # Connectivity metrics
        metrics["avg_degree"] = np.mean([d for n, d in disrupted_network.degree()])
        
        try:
            metrics["avg_shortest_path"] = nx.average_shortest_path_length(disrupted_network)
        except nx.NetworkXError:
            # Graph may not be connected
            metrics["avg_shortest_path"] = float('inf')
            
        # Calculate total capacity
        total_capacity = sum(data.get('capacity', 0) for _, data in disrupted_network.nodes(data=True))
        metrics["total_capacity"] = total_capacity
        
        # Calculate impact percentages
        impact = {}
        
        for key in metrics:
            if key in self.baseline_metrics:
                baseline = self.baseline_metrics[key]
                current = metrics[key]
                
                if baseline != 0 and baseline != float('inf'):
                    if key == "avg_shortest_path" and current == float('inf'):
                        # Network became disconnected
                        impact[f"{key}_change"] = 1.0  # 100% impact
                    else:
                        # Regular metrics (lower values typically better)
                        change = (current - baseline) / baseline
                        impact[f"{key}_change"] = change
                else:
                    impact[f"{key}_change"] = 0
        
        # Special case for capacity
        if "total_capacity" in metrics and "total_capacity" in self.baseline_metrics:
            capacity_loss = max(0, self.baseline_metrics["total_capacity"] - metrics["total_capacity"])
            impact["capacity_loss"] = capacity_loss
            impact["capacity_loss_percent"] = capacity_loss / self.baseline_metrics["total_capacity"] if self.baseline_metrics["total_capacity"] > 0 else 1.0
        
        # Calculate time to recovery (theoretical)
        impact["estimated_ttr_days"] = self.estimate_time_to_recovery(disrupted_network, impact.get("capacity_loss_percent", 0))
        
        # Calculate resilience score (0-1, higher is better)
        resilience_score = self.calculate_resilience_score(impact)
        impact["resilience_score"] = resilience_score
        
        return impact
    
    def estimate_time_to_recovery(self, disrupted_network: nx.DiGraph, capacity_loss_percent: float) -> float:
        """
        Estimate the time to recovery for the disrupted network.
        
        Args:
            disrupted_network: Disrupted network graph
            capacity_loss_percent: Percentage of capacity lost
            
        Returns:
            Estimated days to recovery
        """
        # Simple model: more severe disruptions take longer to recover from
        # This could be made more sophisticated with real-world recovery data
        if capacity_loss_percent < 0.1:
            return 7  # 1 week for minor disruptions
        elif capacity_loss_percent < 0.3:
            return 30  # 1 month for moderate disruptions
        elif capacity_loss_percent < 0.5:
            return 90  # 3 months for major disruptions
        else:
            return 180  # 6 months for severe disruptions
    
    def calculate_resilience_score(self, impact: Dict) -> float:
        """
        Calculate an overall resilience score from impact metrics.
        
        Args:
            impact: Dictionary of impact metrics
            
        Returns:
            Resilience score (0-1, higher is better)
        """
        # Weights for different factors
        weights = {
            "capacity_loss_percent": 0.4,
            "avg_shortest_path_change": 0.3,
            "avg_degree_change": 0.2,
            "estimated_ttr_days": 0.1
        }
        
        # Normalize and combine factors
        score = 1.0
        
        if "capacity_loss_percent" in impact:
            score -= weights["capacity_loss_percent"] * impact["capacity_loss_percent"]
            
        if "avg_shortest_path_change" in impact:
            # Cap path length change at 1.0 (100% increase)
            path_impact = min(1.0, abs(impact["avg_shortest_path_change"]))
            score -= weights["avg_shortest_path_change"] * path_impact
            
        if "avg_degree_change" in impact:
            # For degree, negative change is bad (lost connections)
            degree_impact = abs(min(0, impact["avg_degree_change"]))
            score -= weights["avg_degree_change"] * degree_impact
            
        if "estimated_ttr_days" in impact:
            # Normalize TTR: 180 days -> 1.0 impact, 0 days -> 0.0 impact
            ttr_impact = min(1.0, impact["estimated_ttr_days"] / 180.0)
            score -= weights["estimated_ttr_days"] * ttr_impact
        
        # Ensure score is in 0-1 range
        return max(0.0, min(1.0, score))
    
    def analyze_critical_paths(self, disruption_threshold: float = 0.3) -> List[Dict]:
        """
        Identify critical paths in the supply chain that would
        significantly impact resilience if disrupted.
        
        Args:
            disruption_threshold: Threshold for considering a path critical
            
        Returns:
            List of critical paths with impact metrics
        """
        network = self.optimizer.network_graph
        critical_paths = []
        
        # Ensure baseline is calculated
        if not self.baseline_calculated:
            self.calculate_baseline_metrics()
        
        # Find all paths between key nodes (e.g., between facilities and demand points)
        # Limit to paths with at most 3 hops for computational efficiency
        key_paths = []
        
        for source in self.optimizer.facilities:
            for target in self.optimizer.demand_points:
                try:
                    # Find shortest path
                    path = nx.shortest_path(network, source, target)
                    if len(path) <= 4:  # Source, at most 2 intermediate nodes, target
                        key_paths.append(path)
                except nx.NetworkXNoPath:
                    continue
        
        # Analyze each path
        for path in key_paths:
            # Create a modified network with this path disrupted
            disrupted_network = network.copy()
            
            # Remove edges in the path
            for i in range(len(path) - 1):
                if disrupted_network.has_edge(path[i], path[i + 1]):
                    disrupted_network.remove_edge(path[i], path[i + 1])
            
            # Calculate impact
            impact = self.calculate_disruption_impact(disrupted_network)
            
            # If impact is significant, consider it a critical path
            if impact.get("resilience_score", 1.0) <= (1.0 - disruption_threshold):
                critical_paths.append({
                    "path": path,
                    "path_description": " → ".join(path),
                    "impact": impact,
                    "criticality": 1.0 - impact.get("resilience_score", 0)
                })
        
        # Sort by criticality (most critical first)
        critical_paths.sort(key=lambda x: x["criticality"], reverse=True)
        
        return critical_paths
    
    def generate_resilience_report(self, disruption_scenario=None) -> Dict:
        """
        Generate a comprehensive resilience report for the supply chain.
        
        Args:
            disruption_scenario: Optional disruption scenario to analyze
            
        Returns:
            Detailed resilience report
        """
        # Ensure baseline is calculated
        if not self.baseline_calculated:
            self.calculate_baseline_metrics()
        
        report = {
            "baseline_metrics": self.baseline_metrics,
            "timestamp": time.time(),
            "overall_resilience_score": None,
            "critical_paths": None,
            "disruption_impact": None,
            "recommendations": []
        }
        
        # Identify critical paths
        critical_paths = self.analyze_critical_paths()
        report["critical_paths"] = critical_paths[:5]  # Top 5 most critical
        
        # If a disruption scenario is provided, calculate its impact
        if disruption_scenario is not None:
            from models.disruption import DisruptionSimulator
            simulator = DisruptionSimulator(self.optimizer.network_graph)
            disrupted_network = simulator.apply_disruption_to_network(disruption_scenario)
            impact = self.calculate_disruption_impact(disrupted_network)
            report["disruption_impact"] = impact
            report["overall_resilience_score"] = impact.get("resilience_score", None)
        else:
            # Calculate overall resilience score as average of critical path scores
            if critical_paths:
                avg_criticality = np.mean([p["criticality"] for p in critical_paths[:5]])
                report["overall_resilience_score"] = 1.0 - avg_criticality
            else:
                report["overall_resilience_score"] = 1.0  # No critical paths found
        
        # Generate recommendations
        if report["overall_resilience_score"] is not None:
            if report["overall_resilience_score"] < 0.5:
                report["recommendations"].append({
                    "priority": "high",
                    "description": "Network resilience is low. Consider adding redundant routes and facilities."
                })
            
            if critical_paths:
                for path in critical_paths[:3]:
                    report["recommendations"].append({
                        "priority": "medium",
                        "description": f"Add alternative routes for critical path: {path['path_description']}"
                    })
        
        return report
