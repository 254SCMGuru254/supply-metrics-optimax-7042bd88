from typing import Dict, List, Optional
import numpy as np
from datetime import datetime
from models.model_validator import ModelValidator
from models.resilience_metrics import ResilienceCalculator
from .metrics_storage import MetricsStorage

class MetricsService:
    def __init__(self):
        self.validator = ModelValidator()
        self.storage = MetricsStorage()

    def calculate_current_metrics(self, network_state: Dict) -> Dict:
        """Calculate and store current state metrics"""
        metrics = {
            "route-optimization": {
                "modelName": "route-optimization",
                "description": "Current routing performance metrics",
                "metrics": self._calculate_routing_metrics(network_state)
            },
            "inventory-management": {
                "modelName": "inventory-management", 
                "description": "Current inventory performance metrics",
                "metrics": self._calculate_inventory_metrics(network_state)
            },
            "network-optimization": {
                "modelName": "network-optimization",
                "description": "Current network performance metrics",
                "metrics": self._calculate_network_metrics(network_state)
            }
        }

        # Add money saved KPI for route-optimization and inventory-management
        # Money saved = (current cost - estimated cost) * some factor or direct difference
        # For current metrics, money saved is 0 (baseline)
        for model in metrics.values():
            if model["modelName"] in ["route-optimization", "inventory-management"]:
                model["metrics"].append({
                    "name": "Money Saved",
                    "description": "Estimated money saved if optimization is adopted",
                    "value": 0,
                    "unit": "USD",
                    "changeDirection": "neutral",
                    "changePercentage": None
                })

        # Store current metrics
        self.storage.store_current_metrics(metrics)
        return metrics

    def calculate_estimated_improvements(self, network_state: Dict, optimization_results: Dict) -> Dict:
        """Calculate and store estimated improvements"""
        current = self.calculate_current_metrics(network_state)
        estimated = {}
        
        for model_name, model_metrics in current.items():
            # Calculate money saved for route-optimization and inventory-management
            money_saved = 0
            if model_name == "route-optimization":
                current_cost = next((m["value"] for m in model_metrics["metrics"] if m["name"] == "Transportation Cost"), 0)
                estimated_cost = optimization_results.get(model_name, {}).get("estimated_transportation_cost", current_cost)
                # Assume total units transported from network_state for scaling
                total_units = network_state.get("total_units", 1)
                money_saved = max(0, (current_cost - estimated_cost) * total_units)
            elif model_name == "inventory-management":
                current_holding_cost = next((m["value"] for m in model_metrics["metrics"] if m["name"] == "Inventory Holding Cost"), 0)
                estimated_holding_cost = optimization_results.get(model_name, {}).get("estimated_inventory_holding_cost", current_holding_cost)
                total_inventory_value = network_state.get("total_inventory_value", 1)
                money_saved = max(0, (current_holding_cost - estimated_holding_cost) / 100 * total_inventory_value)
            
            # Append money saved metric to estimated metrics
            estimated_metrics_list = self._calculate_improvements(
                model_metrics["metrics"],
                optimization_results.get(model_name, {})
            )
            estimated_metrics_list.append({
                "name": "Money Saved",
                "description": "Estimated money saved if optimization is adopted",
                "value": round(money_saved, 2),
                "unit": "USD",
                "changeDirection": "increase" if money_saved > 0 else "neutral",
                "changePercentage": None
            })
            
            model_estimates = {
                "modelName": model_name,
                "description": f"Estimated improvements for {model_name}",
                "metrics": estimated_metrics_list
            }
            estimated[model_name] = model_estimates
            
            # Store estimated metrics
            self.storage.store_estimated_metrics(model_estimates, model_name)
            
        return estimated

    def record_actual_results(self, model_name: str, metrics: Dict) -> None:
        """Record and store actual implementation results"""
        self.storage.store_actual_metrics(metrics, model_name)

    def get_actual_results(self) -> Dict:
        """Get the most recent actual results for each model"""
        actual_results = {}
        
        for model_name in ["route-optimization", "inventory-management", "network-optimization"]:
            history = self.storage.get_metrics_history(model_name, "actual")
            if history:
                actual_results[model_name] = history[-1]  # Get most recent
                
        return actual_results

    def get_estimation_accuracy(self, model_name: Optional[str] = None) -> Dict:
        """Calculate accuracy of estimated vs actual improvements"""
        accuracies = {}
        
        models = [model_name] if model_name else ["route-optimization", "inventory-management", "network-optimization"]
        
        for model in models:
            accuracy = self.storage.calculate_accuracy(model)
            if accuracy:
                accuracies[model] = accuracy
                
        return accuracies

    def get_metrics_trend(self, model_name: str, metric_name: str,
                         start_date: Optional[datetime] = None,
                         end_date: Optional[datetime] = None) -> List[Dict]:
        """Get historical trend for a specific metric"""
        history = self.storage.get_metrics_history(
            model_name, 
            "actual",
            start_date,
            end_date
        )
        
        return [{
            'date': entry['date'],
            'value': entry.get('metrics', {}).get(metric_name)
        } for entry in history if metric_name in entry.get('metrics', {})]

    def _calculate_routing_metrics(self, network_state: Dict) -> List[Dict]:
        routes = network_state.get("routes", [])
        total_distance = sum(r.get("distance", 0) for r in routes)
        total_time = sum(r.get("time", 0) for r in routes)
        total_capacity = sum(r.get("capacity", 0) for r in routes)
        used_capacity = sum(r.get("load", 0) for r in routes)
        on_time_deliveries = sum(1 for r in routes if r.get("on_time", True))
        total_fuel_cost = sum(r.get("fuel_cost", 0) for r in routes)
        total_co2 = sum(r.get("co2_emissions", 0) for r in routes)
        
        return [
            {
                "name": "Average Transit Time",
                "description": "Time taken to transport goods between locations",
                "value": round(total_time / len(routes) if routes else 0, 1),
                "unit": "hours"
            },
            {
                "name": "Transportation Cost",
                "description": "Cost per unit for transportation across network",
                "value": round(network_state.get("cost_per_unit", 0), 2),
                "unit": "$/unit"
            },
            {
                "name": "Vehicle Utilization",
                "description": "Percentage of available vehicle capacity used",
                "value": round((used_capacity / total_capacity * 100) if total_capacity else 0, 1),
                "unit": "%"
            },
            {
                "name": "On-Time Delivery Rate",
                "description": "Percentage of deliveries completed on time",
                "value": round((on_time_deliveries / len(routes) * 100) if routes else 0, 1),
                "unit": "%"
            },
            {
                "name": "Fuel Efficiency",
                "description": "Average fuel cost per kilometer",
                "value": round((total_fuel_cost / total_distance) if total_distance > 0 else 0, 2),
                "unit": "$/km"
            },
            {
                "name": "CO2 Emissions",
                "description": "Total CO2 emissions from transportation",
                "value": round(total_co2 / 1000, 1),  # Convert to metric tons
                "unit": "tCO2"
            }
        ]

    def _calculate_inventory_metrics(self, network_state: Dict) -> List[Dict]:
        facilities = network_state.get("facilities", [])
        total_inventory = sum(f.get("inventory_value", 0) for f in facilities)
        total_holding_cost = sum(f.get("holding_cost", 0) for f in facilities)
        total_turnover = sum(f.get("annual_turnover", 0) for f in facilities)
        total_capacity = sum(f.get("capacity", 0) for f in facilities)
        expired_inventory = sum(f.get("expired_value", 0) for f in facilities)
        stockout_hours = sum(f.get("stockout_hours", 0) for f in facilities)
        total_hours = 8760  # Hours in a year
        
        return [
            {
                "name": "Inventory Holding Cost",
                "description": "Annual cost to hold inventory as % of inventory value",
                "value": round((total_holding_cost / total_inventory * 100) if total_inventory else 0, 1),
                "unit": "%"
            },
            {
                "name": "Stockout Rate",
                "description": "Percentage of demand that cannot be fulfilled immediately",
                "value": round(network_state.get("stockout_rate", 0) * 100, 1),
                "unit": "%"
            },
            {
                "name": "Working Capital Requirement",
                "description": "Capital tied up in inventory",
                "value": round(total_inventory / 1_000_000, 1),
                "unit": "M $"
            },
            {
                "name": "Inventory Turnover",
                "description": "Number of times inventory is sold/replaced in a year",
                "value": round(total_turnover / total_inventory if total_inventory else 0, 1),
                "unit": "turns/year"
            },
            {
                "name": "Warehouse Utilization",
                "description": "Percentage of warehouse capacity utilized",
                "value": round((total_inventory / total_capacity * 100) if total_capacity else 0, 1),
                "unit": "%"
            },
            {
                "name": "Inventory Accuracy",
                "description": "Accuracy of inventory records vs physical count",
                "value": round(network_state.get("inventory_accuracy", 0) * 100, 1),
                "unit": "%"
            },
            {
                "name": "Product Expiry Rate",
                "description": "Value of expired inventory as % of total",
                "value": round((expired_inventory / total_inventory * 100) if total_inventory else 0, 1),
                "unit": "%"
            },
            {
                "name": "Service Level",
                "description": "Percentage of time products are in stock",
                "value": round(((total_hours - stockout_hours) / total_hours * 100), 1),
                "unit": "%"
            }
        ]

    def _calculate_network_metrics(self, network_state: Dict) -> List[Dict]:
        nodes = network_state.get("nodes", [])
        total_nodes = len(nodes)
        connected_nodes = sum(1 for n in nodes if n.get("connected", True))
        total_flow = network_state.get("daily_throughput", 0)
        total_capacity = sum(n.get("capacity", 0) for n in nodes)
        delivery_points = [n for n in nodes if n.get("type") == "delivery"]
        on_time_deliveries = sum(1 for n in delivery_points if n.get("on_time", True))
        
        return [
            {
                "name": "Network Throughput",
                "description": "Volume of goods moving through network per day",
                "value": total_flow,
                "unit": "units"
            },
            {
                "name": "Bottleneck Count",
                "description": "Number of bottleneck points in network",
                "value": len(network_state.get("bottlenecks", [])),
                "unit": "points"
            },
            {
                "name": "Resource Utilization",
                "description": "Average capacity utilization across facilities",
                "value": round((total_flow / total_capacity * 100) if total_capacity else 0, 1),
                "unit": "%"
            },
            {
                "name": "Network Connectivity",
                "description": "Percentage of nodes with active connections",
                "value": round((connected_nodes / total_nodes * 100) if total_nodes else 0, 1),
                "unit": "%"
            },
            {
                "name": "Network Reliability",
                "description": "Percentage of successful deliveries",
                "value": round((on_time_deliveries / len(delivery_points) * 100) if delivery_points else 0, 1),
                "unit": "%"
            },
            {
                "name": "Network Flexibility",
                "description": "Alternative paths available for critical routes",
                "value": network_state.get("path_redundancy", 0),
                "unit": "paths/route"
            }
        ]

    def _calculate_improvements(self, current_metrics: List[Dict], 
                             optimization_results: Dict) -> List[Dict]:
        """Calculate estimated improvements for each metric"""
        improvements = []
        
        for metric in current_metrics:
            current_value = metric["value"]
            metric_name = metric["name"].lower().replace(" ", "_")
            
            # Get the estimated value from optimization results
            estimated_value = optimization_results.get(f"estimated_{metric_name}", current_value)
            
            # Calculate improvement percentage
            if isinstance(current_value, (int, float)) and current_value != 0:
                change_pct = ((estimated_value - current_value) / current_value) * 100
                direction = "increase" if change_pct > 0 else "decrease"
            else:
                change_pct = None
                direction = "neutral"
                
            improvements.append({
                "name": metric["name"],
                "description": metric["description"],
                "value": estimated_value,
                "unit": metric["unit"],
                "changeDirection": direction,
                "changePercentage": abs(round(change_pct, 1)) if change_pct is not None else None
            })
            
        return improvements