"""
Unit tests for inventory optimization module
"""

import unittest
import numpy as np
from scipy.stats import norm
from backend.models.inventory import InventoryOptimizer


class TestInventoryOptimizer(unittest.TestCase):
    """Test cases for InventoryOptimizer class"""
    
    def setUp(self):
        """Set up test fixtures"""
        # Sample test data
        self.facilities = {
            "F1": {"location": (0, 0), "capacity": 100, "echelon": 1},
            "F2": {"location": (10, 0), "capacity": 150, "echelon": 2},
            "F3": {"location": (0, 10), "capacity": 120, "echelon": 3},
        }
        
        self.inventory_params = {
            "F1": {
                "lead_time": 2.0,
                "review_period": 1.0,
                "demand_mean": 50,
                "demand_std": 10,
                "holding_cost": 1.0,
                "stockout_cost": 10.0
            },
            "F2": {
                "lead_time": 5.0,
                "review_period": 2.0,
                "demand_mean": 80,
                "demand_std": 16,
                "holding_cost": 0.8,
                "stockout_cost": 8.0
            },
            "F3": {
                "lead_time": 10.0,
                "review_period": 3.0,
                "demand_mean": 120,
                "demand_std": 24,
                "holding_cost": 0.6,
                "stockout_cost": 6.0
            },
        }
        
        self.optimizer = InventoryOptimizer(self.facilities, self.inventory_params)
    
    def test_safety_stock_calculation(self):
        """Test safety stock calculation"""
        # Test for a facility with known parameters
        facility_id = "F1"
        service_level = 0.95
        
        # Calculate expected safety stock
        params = self.inventory_params[facility_id]
        lead_time = params.get("lead_time", 0)
        review_period = params.get("review_period", 0)
        demand_std = params.get("demand_std", 0)
        
        # Expected formula: z * σ * sqrt(L + R)
        z = norm.ppf(service_level)
        expected_ss = z * demand_std * np.sqrt(lead_time + review_period)
        
        # Get calculated safety stock
        calculated_ss = self.optimizer.calculate_safety_stock(facility_id, service_level)
        
        # Check if they match
        self.assertAlmostEqual(calculated_ss, expected_ss, places=2)
    
    def test_reorder_point_calculation(self):
        """Test reorder point calculation"""
        # Test for a facility with known parameters
        facility_id = "F1"
        service_level = 0.95
        
        # Calculate expected reorder point
        params = self.inventory_params[facility_id]
        lead_time = params.get("lead_time", 0)
        demand_mean = params.get("demand_mean", 0)
        
        # Get safety stock
        safety_stock = self.optimizer.calculate_safety_stock(facility_id, service_level)
        
        # Expected formula: μ * L + SS
        expected_rop = demand_mean * lead_time + safety_stock
        
        # Get calculated reorder point
        calculated_rop = self.optimizer.calculate_reorder_point(facility_id, service_level)
        
        # Check if they match
        self.assertAlmostEqual(calculated_rop, expected_rop, places=2)
    
    def test_multi_echelon_inventory_optimization(self):
        """Test multi-echelon inventory optimization"""
        # Run optimization
        result = self.optimizer.optimize_multi_echelon_inventory(service_level_target=0.95)
        
        # Check that we have results for each facility
        for facility_id in self.inventory_params:
            self.assertIn(facility_id, result)
            self.assertIn("safety_stock", result[facility_id])
            self.assertIn("service_level", result[facility_id])
            self.assertIn("echelon", result[facility_id])
            
            # Check that service levels are at least the target level
            if result[facility_id]["service_level"] is not None:
                self.assertGreaterEqual(result[facility_id]["service_level"], 0.95)
            
            # Higher echelon should benefit from risk pooling with lower safety stock relative to demand
            if facility_id == "F3":  # Highest echelon
                if result["F3"]["safety_stock"] is not None and result["F1"]["safety_stock"] is not None:
                    # Check safety stock ratio vs demand ratio
                    ss_ratio = result["F3"]["safety_stock"] / result["F1"]["safety_stock"]
                    demand_ratio = self.inventory_params["F3"]["demand_mean"] / self.inventory_params["F1"]["demand_mean"]
                    
                    # With risk pooling, SS should grow slower than demand
                    self.assertLessEqual(ss_ratio, demand_ratio)
    
    def test_pooled_variance_calculation(self):
        """Test pooled variance calculation with risk pooling effects"""
        # Test for different echelon levels
        variance_echelon1 = self.optimizer._calculate_pooled_variance("F1", 1)
        variance_echelon3 = self.optimizer._calculate_pooled_variance("F3", 3)
        
        # Base variance for echelon 1
        expected_variance_echelon1 = self.inventory_params["F1"]["demand_std"]**2
        
        # Check that echelon 1 variance matches its own variance (no pooling)
        self.assertAlmostEqual(variance_echelon1, expected_variance_echelon1, places=2)
        
        # Echelon 3 should have higher variance due to aggregation
        self.assertGreater(variance_echelon3, variance_echelon1)


if __name__ == "__main__":
    unittest.main()
