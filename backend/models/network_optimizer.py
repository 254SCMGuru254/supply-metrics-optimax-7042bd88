"""
Supply Chain Network Optimizer Base Class

This module implements the main supply chain network optimizer that integrates
facility location, routing, and inventory optimization components.
"""

import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import folium
import json
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime

# Import optimization components
from .facility_location import FacilityLocationOptimizer
from .routing import RoutingOptimizer
from .inventory import InventoryOptimizer


class SupplyChainNetworkOptimizer:
    """
    Main class for supply chain network optimization that integrates
    facility location, routing, and inventory optimization components.
    """
    
    def __init__(self):
        """Initialize the supply chain network optimizer."""
        # Network components
        self.facilities = {}
        self.demand_points = {}
        self.routes = {}
        self.inventory_params = {}
        
        # Graph representation
        self.network_graph = nx.DiGraph()
        
        # Component optimizers
        self.facility_optimizer = None
        self.routing_optimizer = None
        self.inventory_optimizer = None
        
        # Baseline metrics
        self.baseline_metrics = None
        
    async def get_current_state(self) -> Dict:
        """Get current state of the supply chain network"""
        state = {
            "routes": self._get_route_states(),
            "facilities": self._get_facility_states(),
            "daily_throughput": self._calculate_throughput(),
            "bottlenecks": self._identify_bottlenecks(),
            "resource_utilization": self._calculate_resource_utilization(),
            "cost_per_unit": self._calculate_cost_per_unit(),
            "stockout_rate": self._calculate_stockout_rate()
        }
        return state

    async def optimize_all(self, network_state: Dict) -> Dict:
        """Run all optimization models and return estimated improvements"""
        results = {}
        
        # Initialize optimizers if not already done
        self._initialize_optimizers()
        
        # Run route optimization
        route_results = self.routing_optimizer.optimize()
        results["route-optimization"] = {
            "estimated_average_transit_time": route_results["estimated_transit_time"],
            "estimated_transportation_cost": route_results["estimated_cost_per_unit"],
            "estimated_vehicle_utilization": route_results["estimated_utilization"]
        }
        
        # Run inventory optimization
        inv_results = self.inventory_optimizer.optimize()
        results["inventory-management"] = {
            "estimated_inventory_holding_cost": inv_results["holding_cost_percent"],
            "estimated_stockout_rate": inv_results["stockout_rate"],
            "estimated_working_capital_requirement": inv_results["working_capital"]
        }
        
        # Run network flow optimization
        network_results = self._optimize_network_flow()
        results["network-optimization"] = {
            "estimated_network_throughput": network_results["throughput"],
            "estimated_bottleneck_count": network_results["bottlenecks"],
            "estimated_resource_utilization": network_results["utilization"]
        }
        
        return results

    def _get_route_states(self) -> List[Dict]:
        """Get current state of all routes"""
        states = []
        for route_id, route in self.routes.items():
            states.append({
                "id": route_id,
                "distance": route.get("distance", 0),
                "time": route.get("transit_time", 0),
                "capacity": route.get("capacity", 0),
                "load": route.get("current_load", 0)
            })
        return states

    def _get_facility_states(self) -> List[Dict]:
        """Get current state of all facilities"""
        states = []
        for facility_id, facility in self.facilities.items():
            states.append({
                "id": facility_id,
                "inventory_value": facility.get("inventory_value", 0),
                "holding_cost": facility.get("holding_cost", 0),
                "capacity": facility.get("capacity", 0),
                "utilization": facility.get("utilization", 0)
            })
        return states

    def _calculate_throughput(self) -> float:
        """Calculate current daily network throughput"""
        # Sum of all flow through network edges
        total_flow = sum(edge["flow"] for _, _, edge in self.network_graph.edges(data=True))
        return total_flow

    def _identify_bottlenecks(self) -> List[str]:
        """Identify network bottlenecks based on capacity utilization"""
        bottlenecks = []
        for node, data in self.network_graph.nodes(data=True):
            if data.get("utilization", 0) > 0.9:  # 90% utilization threshold
                bottlenecks.append(node)
        return bottlenecks

    def _calculate_resource_utilization(self) -> float:
        """Calculate average resource utilization across network"""
        utilizations = [data.get("utilization", 0) 
                       for _, data in self.network_graph.nodes(data=True)]
        return np.mean(utilizations) if utilizations else 0

    def _calculate_cost_per_unit(self) -> float:
        """Calculate current transportation cost per unit"""
        total_cost = sum(edge.get("cost", 0) for _, _, edge in self.network_graph.edges(data=True))
        total_volume = sum(edge.get("flow", 0) for _, _, edge in self.network_graph.edges(data=True))
        return total_cost / total_volume if total_volume > 0 else 0

    def _calculate_stockout_rate(self) -> float:
        """Calculate current stockout rate"""
        total_demand = 0
        unfulfilled_demand = 0
        
        for node, data in self.network_graph.nodes(data=True):
            if "demand" in data:
                total_demand += data["demand"]
                unfulfilled_demand += max(0, data["demand"] - data.get("fulfilled", 0))
                
        return unfulfilled_demand / total_demand if total_demand > 0 else 0

    def _optimize_network_flow(self) -> Dict:
        """Optimize network flow to maximize throughput and minimize bottlenecks"""
        # Implementation of network flow optimization using minimum cost flow
        flow = nx.max_flow_min_cost(self.network_graph, "source", "sink")
        
        # Calculate metrics for optimized network
        optimized_throughput = sum(flow.values())
        
        # Count potential bottlenecks in optimized network
        bottleneck_count = sum(1 for f in flow.values() if f > 0.9)
        
        # Calculate resource utilization in optimized network
        utilization = np.mean([f for f in flow.values() if f > 0])
        
        return {
            "throughput": optimized_throughput,
            "bottlenecks": bottleneck_count,
            "utilization": utilization
        }
        
    def add_facility(self, facility_id: str, location: Tuple[float, float], 
                    capacity: float, fixed_cost: float, echelon: int = 1) -> None:
        """
        Add a facility to the network.
        
        Args:
            facility_id: Unique identifier for the facility
            location: (latitude, longitude) coordinates
            capacity: Capacity of the facility
            fixed_cost: Fixed cost of operating the facility
            echelon: Supply chain echelon level (1=retailers, 2=distributors, 3=warehouses, etc.)
        """
        self.facilities[facility_id] = {
            "location": location,
            "capacity": capacity,
            "fixed_cost": fixed_cost,
            "echelon": echelon
        }
        
        # Add to graph
        self.network_graph.add_node(
            facility_id, 
            type='facility',
            location=location,
            capacity=capacity,
            fixed_cost=fixed_cost,
            echelon=echelon
        )
        
    def add_demand_point(self, demand_id: str, location: Tuple[float, float], 
                        demand_mean: float, demand_std: Optional[float] = None) -> None:
        """
        Add a demand point to the network.
        
        Args:
            demand_id: Unique identifier for the demand point
            location: (latitude, longitude) coordinates
            demand_mean: Mean demand quantity
            demand_std: Standard deviation of demand (optional)
        """
        self.demand_points[demand_id] = {
            "location": location,
            "demand_mean": demand_mean,
            "demand_std": demand_std if demand_std is not None else 0.2 * demand_mean
        }
        
        # Add to graph
        self.network_graph.add_node(
            demand_id, 
            type='demand',
            location=location,
            demand_mean=demand_mean,
            demand_std=self.demand_points[demand_id]["demand_std"]
        )
        
    def add_route(self, route_id: str, origin: str, destination: str, 
                 distance: float, transit_time: float, mode: str = 'road', 
                 cost: Optional[float] = None) -> None:
        """
        Add a transportation route to the network.
        
        Args:
            route_id: Unique identifier for the route
            origin: Origin node ID
            destination: Destination node ID
            distance: Distance in kilometers
            transit_time: Transit time in hours
            mode: Transportation mode (road, rail, air, sea)
            cost: Transportation cost (optional)
        """
        self.routes[route_id] = {
            "origin": origin,
            "destination": destination,
            "distance": distance,
            "transit_time": transit_time,
            "mode": mode,
            "cost": cost if cost is not None else distance * 1.5  # Default cost calculation
        }
        
        # Add to graph
        self.network_graph.add_edge(
            origin, 
            destination, 
            route_id=route_id,
            distance=distance,
            transit_time=transit_time,
            mode=mode,
            cost=self.routes[route_id]["cost"]
        )
        
    def add_inventory_params(self, facility_id: str, lead_time: float, review_period: float,
                            demand_mean: Optional[float] = None, demand_std: Optional[float] = None,
                            holding_cost: float = 1.0, stockout_cost: float = 10.0) -> None:
        """
        Add inventory parameters for a facility.
        
        Args:
            facility_id: Facility ID to add inventory parameters for
            lead_time: Lead time in days
            review_period: Review period in days
            demand_mean: Mean demand (optional, can be derived from demand points)
            demand_std: Standard deviation of demand (optional)
            holding_cost: Holding cost per unit per time period
            stockout_cost: Stockout cost per unit
        """
        if facility_id not in self.facilities:
            raise ValueError(f"Facility {facility_id} not found in network")
            
        # If demand mean not provided, calculate from connected demand points
        if demand_mean is None:
            connected_demands = [
                d["demand_mean"] for d_id, d in self.demand_points.items()
                if self.network_graph.has_edge(facility_id, d_id)
            ]
            demand_mean = sum(connected_demands) if connected_demands else 0
            
        # If demand std not provided, use coefficient of variation
        if demand_std is None:
            demand_std = 0.2 * demand_mean
            
        self.inventory_params[facility_id] = {
            "lead_time": lead_time,
            "review_period": review_period,
            "demand_mean": demand_mean,
            "demand_std": demand_std,
            "holding_cost": holding_cost,
            "stockout_cost": stockout_cost
        }
        
        # Update graph node attributes
        self.network_graph.nodes[facility_id].update({
            "lead_time": lead_time,
            "review_period": review_period,
            "demand_mean": demand_mean,
            "demand_std": demand_std,
            "holding_cost": holding_cost,
            "stockout_cost": stockout_cost
        })
        
    def _initialize_optimizers(self) -> None:
        """Initialize component optimizers with current network data."""
        self.facility_optimizer = FacilityLocationOptimizer(
            self.facilities, 
            self.demand_points
        )
        
        self.routing_optimizer = RoutingOptimizer(
            self.routes
        )
        
        self.inventory_optimizer = InventoryOptimizer(
            self.facilities,
            self.inventory_params
        )
        
    def optimize_facility_location_multi_period(self, periods: int = 12, 
                                               demand_growth_rate: float = 0.05) -> Dict[str, Any]:
        """
        Run multi-period facility location optimization.
        
        Args:
            periods: Number of time periods
            demand_growth_rate: Annual growth rate of demand
            
        Returns:
            Optimization results
        """
        self._initialize_optimizers()
        return self.facility_optimizer.optimize_facility_location_multi_period(
            periods=periods,
            demand_growth_rate=demand_growth_rate
        )
        
    def optimize_routes_real_time(self, time_window: float = 60, 
                                 traffic_factor: float = 0.2) -> Dict[str, Any]:
        """
        Run real-time routing optimization.
        
        Args:
            time_window: Maximum allowable total travel time
            traffic_factor: Factor representing traffic variability (0-1)
            
        Returns:
            Optimization results
        """
        self._initialize_optimizers()
        return self.routing_optimizer.optimize_routes_real_time(
            time_window=time_window,
            traffic_factor=traffic_factor
        )
        
    def optimize_multi_echelon_inventory(self, service_level_target: float = 0.95) -> Dict[str, Any]:
        """
        Run multi-echelon inventory optimization.
        
        Args:
            service_level_target: Target service level (0-1)
            
        Returns:
            Optimization results
        """
        self._initialize_optimizers()
        return self.inventory_optimizer.optimize_multi_echelon_inventory(
            service_level_target=service_level_target
        )
        
    def visualize_network(self, as_is: bool = True, to_be: bool = False, 
                         map_type: str = 'folium') -> Any:
        """
        Visualize the supply chain network.
        
        Args:
            as_is: Whether to show current network
            to_be: Whether to show optimized network
            map_type: Type of visualization ('folium' for geographic, 'graph' for network)
            
        Returns:
            Visualization object
        """
        if map_type == 'folium':
            # Create map centered at average location
            all_locations = [f["location"] for f in self.facilities.values()]
            all_locations.extend([d["location"] for d in self.demand_points.values()])
            
            avg_lat = sum(loc[0] for loc in all_locations) / len(all_locations)
            avg_lon = sum(loc[1] for loc in all_locations) / len(all_locations)
            
            m = folium.Map(location=[avg_lat, avg_lon], zoom_start=6)
            
            # Add facilities
            for f_id, facility in self.facilities.items():
                color = 'red' if facility.get("echelon", 1) == 1 else 'blue'
                popup = f"Facility: {f_id}<br>Capacity: {facility['capacity']}"
                
                folium.Marker(
                    location=facility["location"],
                    popup=popup,
                    icon=folium.Icon(color=color)
                ).add_to(m)
                
            # Add demand points
            for d_id, demand in self.demand_points.items():
                popup = f"Demand: {d_id}<br>Mean: {demand['demand_mean']}"
                
                folium.Marker(
                    location=demand["location"],
                    popup=popup,
                    icon=folium.Icon(color='green')
                ).add_to(m)
                
            # Add routes
            for route_id, route in self.routes.items():
                if "origin" in route and "destination" in route:
                    origin = self.network_graph.nodes[route["origin"]].get("location")
                    dest = self.network_graph.nodes[route["destination"]].get("location")
                    
                    if origin and dest:
                        # Color based on mode
                        color = {
                            'road': 'blue',
                            'rail': 'red',
                            'air': 'purple',
                            'sea': 'green'
                        }.get(route["mode"], 'gray')
                        
                        folium.PolyLine(
                            locations=[origin, dest],
                            color=color,
                            weight=2,
                            popup=f"Route: {route_id}<br>Mode: {route['mode']}<br>Time: {route['transit_time']} hrs"
                        ).add_to(m)
            
            return m
            
        elif map_type == 'graph':
            # Create network graph visualization
            plt.figure(figsize=(12, 8))
            
            # Node positions based on geographic coordinates
            pos = {
                node_id: (data.get("location", (0, 0))[1], data.get("location", (0, 0))[0])  # (lon, lat)
                for node_id, data in self.network_graph.nodes(data=True)
                if "location" in data
            }
            
            # Node colors by type
            node_colors = []
            for node in self.network_graph.nodes():
                if node in self.facilities:
                    echelon = self.facilities[node].get("echelon", 1)
                    if echelon == 1:
                        node_colors.append('red')
                    elif echelon == 2:
                        node_colors.append('blue')
                    else:
                        node_colors.append('purple')
                elif node in self.demand_points:
                    node_colors.append('green')
                else:
                    node_colors.append('gray')
            
            # Edge colors by mode
            edge_colors = []
            for _, _, data in self.network_graph.edges(data=True):
                mode = data.get("mode", "road")
                if mode == "road":
                    edge_colors.append('blue')
                elif mode == "rail":
                    edge_colors.append('red')
                elif mode == "air":
                    edge_colors.append('purple')
                elif mode == "sea":
                    edge_colors.append('green')
                else:
                    edge_colors.append('gray')
            
            # Draw network
            nx.draw(
                self.network_graph,
                pos=pos,
                with_labels=True,
                node_color=node_colors,
                edge_color=edge_colors,
                font_size=8,
                node_size=300
            )
            
            plt.title("Supply Chain Network")
            return plt
        
        else:
            raise ValueError(f"Unknown map type: {map_type}")
        
    def export_to_json(self, filename: str) -> None:
        """
        Export network model to JSON.
        
        Args:
            filename: Output JSON filename
        """
        export_data = {
            "facilities": self.facilities,
            "demand_points": self.demand_points,
            "routes": self.routes,
            "inventory_params": self.inventory_params,
        }
        
        # Convert tuples to lists for JSON serialization
        for f_id, facility in export_data["facilities"].items():
            if "location" in facility and isinstance(facility["location"], tuple):
                export_data["facilities"][f_id]["location"] = list(facility["location"])
                
        for d_id, demand in export_data["demand_points"].items():
            if "location" in demand and isinstance(demand["location"], tuple):
                export_data["demand_points"][d_id]["location"] = list(demand["location"])
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
            
    @classmethod
    def from_json(cls, filename: str) -> 'SupplyChainNetworkOptimizer':
        """
        Create network optimizer from JSON file.
        
        Args:
            filename: Input JSON filename
            
        Returns:
            SupplyChainNetworkOptimizer instance
        """
        with open(filename, 'r') as f:
            data = json.load(f)
            
        optimizer = cls()
        
        # Convert list locations back to tuples
        for f_id, facility in data["facilities"].items():
            if "location" in facility and isinstance(facility["location"], list):
                facility["location"] = tuple(facility["location"])
            optimizer.facilities[f_id] = facility
            
        for d_id, demand in data["demand_points"].items():
            if "location" in demand and isinstance(demand["location"], list):
                demand["location"] = tuple(demand["location"])
            optimizer.demand_points[d_id] = demand
            
        optimizer.routes = data.get("routes", {})
        optimizer.inventory_params = data.get("inventory_params", {})
        
        # Rebuild graph
        for f_id, facility in optimizer.facilities.items():
            optimizer.network_graph.add_node(
                f_id, 
                type='facility',
                **facility
            )
            
        for d_id, demand in optimizer.demand_points.items():
            optimizer.network_graph.add_node(
                d_id, 
                type='demand',
                **demand
            )
            
        for r_id, route in optimizer.routes.items():
            if "origin" in route and "destination" in route:
                optimizer.network_graph.add_edge(
                    route["origin"],
                    route["destination"],
                    route_id=r_id,
                    **{k: v for k, v in route.items() if k not in ["origin", "destination"]}
                )
                
        return optimizer
