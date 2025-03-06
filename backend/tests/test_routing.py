"""
Unit tests for routing optimization module
"""

import unittest
import numpy as np
import time
from backend.models.routing import RoutingOptimizer


class TestRoutingOptimizer(unittest.TestCase):
    """Test cases for RoutingOptimizer class"""
    
    def setUp(self):
        """Set up test fixtures"""
        # Sample test data
        self.routes = {
            "R1": {
                "origin": "A", 
                "destination": "B", 
                "transit_time": 2.0, 
                "distance": 100, 
                "mode": "road"
            },
            "R2": {
                "origin": "B", 
                "destination": "C", 
                "transit_time": 3.0, 
                "distance": 150, 
                "mode": "road"
            },
            "R3": {
                "origin": "A", 
                "destination": "C", 
                "transit_time": 4.0, 
                "distance": 200, 
                "mode": "rail"
            },
            "R4": {
                "origin": "C", 
                "destination": "D", 
                "transit_time": 1.5, 
                "distance": 75, 
                "mode": "road"
            },
        }
        
        self.optimizer = RoutingOptimizer(self.routes)
    
    def test_real_time_optimization_timing(self):
        """Test that real-time optimization completes within expected time"""
        start_time = time.time()
        
        result = self.optimizer.optimize_routes_real_time(
            time_window=10,
            traffic_factor=0.2
        )
        
        # Check execution time - should be reasonable for real-time
        self.assertLess(result["execution_time"], 5.0)
        
        # Check that the results contain expected keys
        self.assertIn("optimized_routes", result)
        self.assertIn("dynamic_times", result)
    
    def test_dynamic_time_variation(self):
        """Test that dynamic times are varied based on traffic factor"""
        # Run with zero traffic factor (no variation)
        result_no_traffic = self.optimizer.optimize_routes_real_time(
            time_window=10,
            traffic_factor=0.0
        )
        
        # Verify that with zero traffic factor, dynamic times match base times
        for route_id, route in self.routes.items():
            self.assertAlmostEqual(
                result_no_traffic["dynamic_times"][route_id], 
                route["transit_time"], 
                places=6
            )
        
        # Run with high traffic factor
        result_high_traffic = self.optimizer.optimize_routes_real_time(
            time_window=10,
            traffic_factor=0.5
        )
        
        # Verify that dynamic times differ from base times with high traffic factor
        different_times = False
        for route_id in self.routes:
            if abs(result_high_traffic["dynamic_times"][route_id] - self.routes[route_id]["transit_time"]) > 0.01:
                different_times = True
                break
                
        self.assertTrue(different_times, "Dynamic times should vary with high traffic factor")
    
    def test_multi_modal_route_planning(self):
        """Test multi-modal route planning optimization"""
        # Test route planning from A to D
        result = self.optimizer.optimize_multi_modal_routes(
            origin="A",
            destination="D",
            max_cost=None,
            max_time=None,
            carbon_weight=0.0
        )
        
        # Check result structure
        self.assertIn("selected_routes", result)
        self.assertIn("total_time", result)
        self.assertIn("total_distance", result)
        
        # Check that origin/destination constraints are satisfied
        if result["status"] == "optimal":
            # Verify connectivity - selected routes should form a path from A to D
            # Check if we have a route from A
            has_origin_route = False
            has_destination_route = False
            
            for route_id in result["selected_routes"]:
                route = self.routes[route_id]
                if route["origin"] == "A":
                    has_origin_route = True
                if route["destination"] == "D":
                    has_destination_route = True
                
            self.assertTrue(has_origin_route, "Should have a route starting from origin A")
            self.assertTrue(has_destination_route, "Should have a route ending at destination D")


if __name__ == "__main__":
    unittest.main()
