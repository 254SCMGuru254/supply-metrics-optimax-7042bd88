
"""
Supply Chain Analysis Module
Provides detailed reporting and analysis capabilities
"""
import numpy as np
import pandas as pd
import time
from typing import Dict, List, Any, Optional
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime

class SupplyChainAnalyzer:
    """
    Supply Chain Analysis class for generating comprehensive reports
    and performing detailed analysis of supply chain performance
    """
    def __init__(self, optimizer):
        """
        Initialize analyzer with optimizer instance
        
        Args:
            optimizer: SupplyChainNetworkOptimizer instance containing network data
        """
        self.optimizer = optimizer
        self.analysis_timestamp = datetime.now()
        self.report_data = {}
    
    def generate_comprehensive_report(self, industry_type="general") -> Dict[str, Any]:
        """
        Generate a comprehensive supply chain analysis report
        
        Args:
            industry_type: The type of industry for benchmark comparisons
            
        Returns:
            Dictionary containing all report sections and metrics
        """
        start_time = time.time()
        
        # Generate each report section
        network_analysis = self._analyze_network_structure()
        cost_analysis = self._analyze_costs(industry_type)
        performance_analysis = self._analyze_performance_metrics()
        risk_analysis = self._analyze_risk_exposure()
        optimization_opportunities = self._identify_optimization_opportunities()
        
        # Compile complete report
        report = {
            "report_id": f"SCR-{int(time.time())}",
            "timestamp": self.analysis_timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "industry_type": industry_type,
            "network_analysis": network_analysis,
            "cost_analysis": cost_analysis,
            "performance_analysis": performance_analysis,
            "risk_analysis": risk_analysis,
            "optimization_opportunities": optimization_opportunities,
            "execution_time": time.time() - start_time
        }
        
        self.report_data = report
        return report
    
    def _analyze_network_structure(self) -> Dict[str, Any]:
        """
        Analyze the structure of the supply chain network
        
        Returns:
            Dictionary containing network structure metrics
        """
        # Count nodes by type
        node_types = {}
        for node_id, node in self.optimizer.facilities.items():
            node_type = node.get("type", "unknown")
            if node_type not in node_types:
                node_types[node_type] = 0
            node_types[node_type] += 1
        
        # Analyze route distribution
        route_modes = {}
        route_distances = []
        route_times = []
        
        for route_id, route in self.optimizer.routes.items():
            mode = route.get("mode", "truck")
            if mode not in route_modes:
                route_modes[mode] = 0
            route_modes[mode] += 1
            
            if "distance" in route:
                route_distances.append(route["distance"])
            if "transit_time" in route:
                route_times.append(route["transit_time"])
        
        # Calculate centrality if we have enough data
        centrality = {}
        if hasattr(self.optimizer, "network") and self.optimizer.network:
            # This would calculate node centrality metrics
            # For now, use placeholder values
            centrality = {
                "highest_degree_node": max(node_types.items(), key=lambda x: x[1])[0] if node_types else "Unknown"
            }
        
        return {
            "total_nodes": len(self.optimizer.facilities),
            "total_routes": len(self.optimizer.routes),
            "node_types": node_types,
            "route_modes": route_modes,
            "avg_distance": np.mean(route_distances) if route_distances else 0,
            "avg_transit_time": np.mean(route_times) if route_times else 0,
            "max_distance": max(route_distances) if route_distances else 0,
            "connectivity": len(self.optimizer.routes) / max(1, len(self.optimizer.facilities)),
            "centrality_metrics": centrality
        }
    
    def _analyze_costs(self, industry_type) -> Dict[str, Any]:
        """
        Analyze supply chain cost structure
        
        Args:
            industry_type: Type of industry for benchmark comparisons
            
        Returns:
            Dictionary containing cost analysis metrics
        """
        # Industry benchmarks (percentages)
        industry_benchmarks = {
            "agriculture": {
                "transportation": {"avg": 28, "best": 22},
                "inventory": {"avg": 18, "best": 14},
                "operations": {"avg": 25, "best": 18}
            },
            "manufacturing": {
                "transportation": {"avg": 22, "best": 17},
                "inventory": {"avg": 25, "best": 18},
                "operations": {"avg": 35, "best": 27}
            },
            "retail": {
                "transportation": {"avg": 18, "best": 14},
                "inventory": {"avg": 32, "best": 24},
                "operations": {"avg": 20, "best": 15}
            },
            "general": {
                "transportation": {"avg": 23, "best": 18},
                "inventory": {"avg": 25, "best": 20},
                "operations": {"avg": 27, "best": 22}
            }
        }
        
        # Get benchmark for selected industry (default to general if not found)
        benchmark = industry_benchmarks.get(industry_type, industry_benchmarks["general"])
        
        # Calculate costs from available data
        transportation_cost = sum(
            route.get("cost", 0) for route in self.optimizer.routes.values()
        )
        
        # Estimate inventory costs based on available data
        inventory_cost = 0
        for facility_id, facility in self.optimizer.facilities.items():
            if hasattr(self.optimizer, 'inventory_params') and facility_id in self.optimizer.inventory_params:
                inventory_params = self.optimizer.inventory_params[facility_id]
                capacity = facility.get("capacity", 0)
                holding_cost = inventory_params.get("holding_cost", 0)
                # Simple estimate based on 50% capacity utilization
                inventory_cost += capacity * 0.5 * holding_cost
        
        # Estimate operations costs
        operations_cost = sum(
            facility.get("fixed_cost", 0) for facility in self.optimizer.facilities.values()
        )
        
        # Calculate total cost
        total_cost = transportation_cost + inventory_cost + operations_cost
        
        # Calculate cost percentages
        if total_cost > 0:
            transportation_pct = (transportation_cost / total_cost) * 100
            inventory_pct = (inventory_cost / total_cost) * 100
            operations_pct = (operations_cost / total_cost) * 100
        else:
            # Assign reasonable defaults if total cost is zero
            transportation_pct = benchmark["transportation"]["avg"]
            inventory_pct = benchmark["inventory"]["avg"]
            operations_pct = benchmark["operations"]["avg"]
        
        # Compare to benchmarks
        transportation_gap = transportation_pct - benchmark["transportation"]["best"]
        inventory_gap = inventory_pct - benchmark["inventory"]["best"]
        operations_gap = operations_pct - benchmark["operations"]["best"]
        
        return {
            "total_cost": total_cost,
            "cost_breakdown": {
                "transportation": {
                    "cost": transportation_cost,
                    "percentage": transportation_pct,
                    "benchmark_avg": benchmark["transportation"]["avg"],
                    "benchmark_best": benchmark["transportation"]["best"],
                    "gap_to_best": transportation_gap
                },
                "inventory": {
                    "cost": inventory_cost,
                    "percentage": inventory_pct,
                    "benchmark_avg": benchmark["inventory"]["avg"],
                    "benchmark_best": benchmark["inventory"]["best"],
                    "gap_to_best": inventory_gap
                },
                "operations": {
                    "cost": operations_cost,
                    "percentage": operations_pct,
                    "benchmark_avg": benchmark["operations"]["avg"],
                    "benchmark_best": benchmark["operations"]["best"],
                    "gap_to_best": operations_gap
                }
            },
            "cost_saving_opportunities": {
                "transportation": transportation_cost * (max(0, transportation_gap) / 100) * 0.5,
                "inventory": inventory_cost * (max(0, inventory_gap) / 100) * 0.7,
                "operations": operations_cost * (max(0, operations_gap) / 100) * 0.3
            }
        }
    
    def _analyze_performance_metrics(self) -> Dict[str, Any]:
        """
        Analyze key performance indicators
        
        Returns:
            Dictionary containing performance metrics
        """
        # Simulate performance metrics (in a real app, these would come from data)
        performance = {
            "order_fulfillment_rate": 85 + np.random.random() * 10,
            "on_time_delivery": 80 + np.random.random() * 15,
            "inventory_accuracy": 90 + np.random.random() * 8,
            "forecast_accuracy": 70 + np.random.random() * 20,
            "lead_time": 2 + np.random.random() * 5
        }
        
        # Calculate performance gaps to target
        performance_targets = {
            "order_fulfillment_rate": 98,
            "on_time_delivery": 95,
            "inventory_accuracy": 99,
            "forecast_accuracy": 85,
            "lead_time": 2
        }
        
        performance_gaps = {}
        for metric, value in performance.items():
            target = performance_targets.get(metric, value * 1.1)
            if metric == "lead_time":
                # For lead time, lower is better
                performance_gaps[metric] = value - target
            else:
                # For other metrics, higher is better
                performance_gaps[metric] = target - value
        
        return {
            "metrics": performance,
            "targets": performance_targets,
            "gaps": performance_gaps,
            "improvement_potential": {
                metric: gap for metric, gap in performance_gaps.items() if gap > 0
            }
        }
    
    def _analyze_risk_exposure(self) -> Dict[str, Any]:
        """
        Analyze supply chain risk exposure
        
        Returns:
            Dictionary containing risk analysis
        """
        # Number of suppliers per component (diversity)
        supplier_diversity = {}
        
        # Geographic concentration risk
        locations = []
        for facility in self.optimizer.facilities.values():
            if "location" in facility:
                locations.append(facility["location"])
        
        geographic_concentration = len(set(locations)) / max(1, len(locations))
        
        # Single points of failure
        single_route_nodes = set()
        route_counts = {}
        
        for route_id, route in self.optimizer.routes.items():
            nodes = route.get("nodes", [])
            for node in nodes:
                if node not in route_counts:
                    route_counts[node] = 0
                route_counts[node] += 1
        
        for node, count in route_counts.items():
            if count == 1:
                single_route_nodes.add(node)
        
        # Risk scores (simplified)
        risk_scores = {
            "supplier_concentration": 0.8 - min(0.8, len(supplier_diversity) / 10),
            "geographic_concentration": 1 - geographic_concentration,
            "single_point_failure": len(single_route_nodes) / max(1, len(self.optimizer.facilities)) * 0.5
        }
        
        risk_scores["total"] = sum(risk_scores.values()) / len(risk_scores)
        
        # Risk mitigation strategies
        risk_mitigations = []
        
        if risk_scores["supplier_concentration"] > 0.5:
            risk_mitigations.append("Diversify supplier base to reduce concentration risk")
        if risk_scores["geographic_concentration"] > 0.6:
            risk_mitigations.append("Establish operations in additional geographic regions")
        if risk_scores["single_point_failure"] > 0.3:
            risk_mitigations.append("Create redundant routes for critical supply paths")
        
        return {
            "risk_scores": risk_scores,
            "single_points_failure": len(single_route_nodes),
            "geographic_concentration": geographic_concentration,
            "risk_mitigations": risk_mitigations
        }
    
    def _identify_optimization_opportunities(self) -> Dict[str, Any]:
        """
        Identify optimization opportunities in the supply chain
        
        Returns:
            Dictionary containing optimization opportunities
        """
        # Transportation optimization potential
        transport_opt_potential = {}
        for route_id, route in self.optimizer.routes.items():
            if "transit_time" in route and "distance" in route:
                # Calculate potential time savings from optimized routing
                transport_opt_potential[route_id] = {
                    "current_time": route["transit_time"],
                    "potential_time": route["transit_time"] * 0.85,  # Assume 15% improvement potential
                    "savings": route["transit_time"] * 0.15
                }
        
        # Inventory optimization potential
        inventory_opt_potential = {}
        if hasattr(self.optimizer, 'inventory_params'):
            for facility_id, facility in self.optimizer.facilities.items():
                if facility_id in self.optimizer.inventory_params:
                    # Calculate potential inventory reduction
                    capacity = facility.get("capacity", 0)
                    inventory_opt_potential[facility_id] = {
                        "current_inventory": capacity * 0.5,  # Assume 50% utilization
                        "potential_inventory": capacity * 0.35,  # Assume 30% reduction potential
                        "savings": capacity * 0.15
                    }
        
        # Network optimization potential
        network_opt_potential = {
            "facility_consolidation": max(0, len(self.optimizer.facilities) - 5) * 0.2,
            "route_optimization": len(self.optimizer.routes) * 0.3
        }
        
        # Recommendations
        recommendations = []
        
        if sum(opt["savings"] for opt in transport_opt_potential.values()) > 10:
            recommendations.append({
                "category": "transportation",
                "description": "Implement real-time route optimization",
                "impact": "Reduce transit times by 10-15%",
                "difficulty": "medium"
            })
            
        if sum(opt["savings"] for opt in inventory_opt_potential.values()) > 100:
            recommendations.append({
                "category": "inventory",
                "description": "Deploy multi-echelon inventory optimization",
                "impact": "Reduce inventory levels by 15-20% while maintaining service",
                "difficulty": "high"
            })
            
        if network_opt_potential["facility_consolidation"] > 0.5:
            recommendations.append({
                "category": "network",
                "description": "Consolidate facilities to optimize fixed costs",
                "impact": "Reduce fixed costs by 10-15%",
                "difficulty": "high"
            })
            
        return {
            "transportation_optimization": {
                "total_potential_savings": sum(opt["savings"] for opt in transport_opt_potential.values()),
                "details": transport_opt_potential
            },
            "inventory_optimization": {
                "total_potential_savings": sum(opt["savings"] for opt in inventory_opt_potential.values()),
                "details": inventory_opt_potential
            },
            "network_optimization": network_opt_potential,
            "recommendations": recommendations
        }
    
    def generate_network_visualization(self, format="png"):
        """
        Generate network visualization
        
        Args:
            format: Output format ('png' or 'svg')
            
        Returns:
            Base64 encoded visualization image
        """
        # Create a network visualization
        plt.figure(figsize=(10, 8))
        
        # Plot nodes
        node_x = []
        node_y = []
        node_types = []
        
        for node_id, node in self.optimizer.facilities.items():
            if "location" in node:
                lat, lng = node["location"]
                node_x.append(lng)
                node_y.append(lat)
                node_types.append(node.get("type", "unknown"))
        
        # Plot routes
        for route_id, route in self.optimizer.routes.items():
            nodes = route.get("nodes", [])
            if len(nodes) >= 2:
                # Get coordinates for start and end nodes
                start_node = self.optimizer.facilities.get(nodes[0], {})
                end_node = self.optimizer.facilities.get(nodes[1], {})
                
                if "location" in start_node and "location" in end_node:
                    start_lat, start_lng = start_node["location"]
                    end_lat, end_lng = end_node["location"]
                    
                    plt.plot([start_lng, end_lng], [start_lat, end_lat], 'b-', alpha=0.6)
        
        # Plot nodes with different colors by type
        node_type_colors = {
            "supplier": "green",
            "manufacturing": "red",
            "distribution": "blue",
            "warehouse": "orange",
            "retail": "purple",
            "unknown": "gray"
        }
        
        for i, type_name in enumerate(node_types):
            color = node_type_colors.get(type_name, "gray")
            plt.scatter(node_x[i], node_y[i], c=color, s=100, alpha=0.8)
        
        # Add legend
        from matplotlib.lines import Line2D
        legend_elements = [
            Line2D([0], [0], marker='o', color='w', markerfacecolor=color, markersize=10, label=node_type)
            for node_type, color in node_type_colors.items() if node_type in node_types
        ]
        plt.legend(handles=legend_elements)
        
        # Set labels and title
        plt.title("Supply Chain Network Visualization")
        plt.xlabel("Longitude")
        plt.ylabel("Latitude")
        
        # Convert plot to base64
        buf = io.BytesIO()
        plt.savefig(buf, format=format)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()
        
        return f"data:image/{format};base64,{img_base64}"
    
    def export_to_pdf(self, filename="supply_chain_report.pdf"):
        """
        Export report to PDF format
        
        Args:
            filename: Name of output file
        """
        # This would be implemented with a PDF generation library
        # Since this requires additional dependencies, we'll just provide a skeleton
        
        pass
    
    def export_to_excel(self, filename="supply_chain_analysis.xlsx"):
        """
        Export report data to Excel format
        
        Args:
            filename: Name of output file
        """
        if not self.report_data:
            raise ValueError("No report data available. Run generate_comprehensive_report first.")
        
        # Create a Pandas Excel writer using the specified filename
        writer = pd.ExcelWriter(filename, engine='xlsxwriter')
        
        # Convert relevant sections to DataFrames and write to Excel
        
        # Network Analysis
        network_df = pd.DataFrame({
            'Metric': ['Total Nodes', 'Total Routes', 'Avg Distance', 'Avg Transit Time'],
            'Value': [
                self.report_data['network_analysis']['total_nodes'],
                self.report_data['network_analysis']['total_routes'],
                self.report_data['network_analysis']['avg_distance'],
                self.report_data['network_analysis']['avg_transit_time']
            ]
        })
        network_df.to_excel(writer, sheet_name='Network Analysis', index=False)
        
        # Cost Analysis
        cost_breakdown = self.report_data['cost_analysis']['cost_breakdown']
        cost_df = pd.DataFrame({
            'Cost Category': ['Transportation', 'Inventory', 'Operations', 'Total'],
            'Cost': [
                cost_breakdown['transportation']['cost'],
                cost_breakdown['inventory']['cost'],
                cost_breakdown['operations']['cost'],
                self.report_data['cost_analysis']['total_cost']
            ],
            'Percentage': [
                cost_breakdown['transportation']['percentage'],
                cost_breakdown['inventory']['percentage'],
                cost_breakdown['operations']['percentage'],
                100.0
            ],
            'Industry Benchmark': [
                cost_breakdown['transportation']['benchmark_avg'],
                cost_breakdown['inventory']['benchmark_avg'],
                cost_breakdown['operations']['benchmark_avg'],
                '-'
            ],
            'Gap to Best': [
                cost_breakdown['transportation']['gap_to_best'],
                cost_breakdown['inventory']['gap_to_best'],
                cost_breakdown['operations']['gap_to_best'],
                '-'
            ]
        })
        cost_df.to_excel(writer, sheet_name='Cost Analysis', index=False)
        
        # Performance Metrics
        metrics = self.report_data['performance_analysis']['metrics']
        targets = self.report_data['performance_analysis']['targets']
        gaps = self.report_data['performance_analysis']['gaps']
        
        perf_df = pd.DataFrame({
            'Metric': list(metrics.keys()),
            'Current Value': list(metrics.values()),
            'Target': [targets[m] for m in metrics.keys()],
            'Gap': [gaps[m] for m in metrics.keys()]
        })
        perf_df.to_excel(writer, sheet_name='Performance Metrics', index=False)
        
        # Risk Analysis
        risk_scores = self.report_data['risk_analysis']['risk_scores']
        risk_df = pd.DataFrame({
            'Risk Category': list(risk_scores.keys()),
            'Score': list(risk_scores.values())
        })
        risk_df.to_excel(writer, sheet_name='Risk Analysis', index=False)
        
        # Optimization Opportunities
        opt_df = pd.DataFrame({
            'Category': [
                'Transportation Optimization',
                'Inventory Optimization',
                'Network Optimization - Facility',
                'Network Optimization - Route'
            ],
            'Potential Savings': [
                self.report_data['optimization_opportunities']['transportation_optimization']['total_potential_savings'],
                self.report_data['optimization_opportunities']['inventory_optimization']['total_potential_savings'],
                self.report_data['optimization_opportunities']['network_optimization']['facility_consolidation'],
                self.report_data['optimization_opportunities']['network_optimization']['route_optimization']
            ]
        })
        opt_df.to_excel(writer, sheet_name='Optimization Potential', index=False)
        
        # Close the Pandas Excel writer and save the Excel file
        writer.close()
        
        return filename
