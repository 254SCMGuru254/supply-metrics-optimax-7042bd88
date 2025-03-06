"""
Unit tests for facility location optimization module
"""

import unittest
import numpy as np
from backend.models.facility_location import FacilityLocationOptimizer


class TestFacilityLocationOptimizer(unittest.TestCase):
    """Test cases for FacilityLocationOptimizer class"""
    
    def setUp(self):
        """Set up test fixtures"""
        # Sample test data
        self.facilities = {
            "F1": {"location": (0, 0), "capacity": 100, "fixed_cost": 1000},
            "F2": {"location": (10, 0), "capacity": 150, "fixed_cost": 1200},
            "F3": {"location": (0, 10), "capacity": 120, "fixed_cost": 1100},
        }
        
        self.demand_points = {
            "D1": {"location": (2, 2), "demand_mean": 50},
            "D2": {"location": (8, 1), "demand_mean": 60},
            "D3": {"location": (1, 8), "demand_mean": 40},
        }
        
        self.optimizer = FacilityLocationOptimizer(self.facilities, self.demand_points)
    
    def test_distance_calculation(self):
        """Test distance calculation method"""
        # Test distance between two points
        loc1 = (0, 0)
        loc2 = (3, 4)
        expected_distance = 5.0  # 3-4-5 triangle
        
        calculated_distance = self.optimizer._calculate_distance(loc1, loc2)
        self.assertAlmostEqual(calculated_distance, expected_distance, places=6)
    
    def test_multi_period_optimization_raises_error_without_demand(self):
        """Test error handling for no demand points"""
        empty_optimizer = FacilityLocationOptimizer(self.facilities, {})
        
        with self.assertRaises(ValueError):
            empty_optimizer.optimize_facility_location_multi_period()
    
    def test_multi_period_optimization_returns_results(self):
        """Test that optimization returns expected structure of results"""
        # Mock optimization with minimal periods for faster tests
        result = self.optimizer.optimize_facility_location_multi_period(periods=2)
        
        # Check results structure
        self.assertIn("facility_decisions", result)
        self.assertIn("capacity_expansions", result)
        
        # Check that we have results for each period
        for period in range(2):
            self.assertIn(period, result["facility_decisions"])
            self.assertIn(period, result["capacity_expansions"])
            
        # Check that we have results for each facility
        for facility_id in self.facilities:
            self.assertIn(facility_id, result["facility_decisions"][0])
    
    def test_green_facility_location(self):
        """Test green facility location with carbon constraints"""
        result = self.optimizer.optimize_green_facility_location(
            carbon_limit=1000.0,
            carbon_price=20.0
        )
        
        # Check results structure
        self.assertIn("facility_decisions", result)
        self.assertIn("carbon_emissions", result)
        self.assertIn("status", result)
        
        # Verify carbon constraint
        self.assertLessEqual(result.get("carbon_emissions", float('inf')), 1000.0)


if __name__ == "__main__":
    unittest.main()
