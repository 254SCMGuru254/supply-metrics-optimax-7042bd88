"""
Model Validation and Testing Utilities

This module implements comprehensive validation for supply chain optimization models,
ensuring they work correctly for real-world applications in Kenya.
"""

from typing import Dict, List, Any
import numpy as np
from scipy import stats
from datetime import datetime, timedelta

class ModelValidator:
    def __init__(self):
        self.validation_thresholds = {
            'demand_forecast_mape': 0.25,  # Maximum allowed MAPE for demand forecasts
            'route_optimization_gap': 0.10, # Maximum optimality gap for routing
            'inventory_service_level': 0.95, # Minimum service level
            'cost_accuracy': 0.15,  # Maximum deviation in cost estimates
        }

    def validate_demand_forecast(self, actual: List[float], 
                               predicted: List[float]) -> Dict[str, float]:
        """
        Validate demand forecasting accuracy using multiple metrics.
        """
        if len(actual) != len(predicted):
            raise ValueError("Actual and predicted arrays must be the same length")
            
        mape = np.mean(np.abs((np.array(actual) - np.array(predicted)) / np.array(actual))) * 100
        rmse = np.sqrt(np.mean((np.array(actual) - np.array(predicted)) ** 2))
        
        # Calculate forecast bias
        bias = np.mean(np.array(predicted) - np.array(actual))
        
        # Perform statistical tests
        correlation = stats.pearsonr(actual, predicted)[0]
        
        return {
            'mape': mape,
            'rmse': rmse,
            'bias': bias,
            'correlation': correlation,
            'passed': mape <= self.validation_thresholds['demand_forecast_mape']
        }

    def validate_route_optimization(self, solution: Dict) -> Dict[str, Any]:
        """
        Validate route optimization results for feasibility and optimality.
        """
        results = {
            'feasible': True,
            'issues': [],
            'metrics': {}
        }
        
        # Check capacity constraints
        if not self._check_capacity_constraints(solution):
            results['feasible'] = False
            results['issues'].append('Capacity constraints violated')
            
        # Check time windows
        if not self._check_time_windows(solution):
            results['feasible'] = False
            results['issues'].append('Time window constraints violated')
            
        # Calculate optimization metrics
        results['metrics'] = self._calculate_optimization_metrics(solution)
        
        # Check solution quality
        if results['metrics']['optimality_gap'] > self.validation_thresholds['route_optimization_gap']:
            results['issues'].append('Solution optimality gap too large')
            
        return results

    def validate_inventory_model(self, model_params: Dict, 
                               simulation_results: Dict) -> Dict[str, Any]:
        """
        Validate inventory optimization model results.
        """
        results = {
            'valid': True,
            'issues': [],
            'metrics': {}
        }
        
        # Calculate service level
        service_level = self._calculate_service_level(simulation_results)
        results['metrics']['service_level'] = service_level
        
        if service_level < self.validation_thresholds['inventory_service_level']:
            results['valid'] = False
            results['issues'].append('Service level below threshold')
            
        # Check inventory cost accuracy
        cost_accuracy = self._validate_cost_accuracy(model_params, simulation_results)
        results['metrics']['cost_accuracy'] = cost_accuracy
        
        if cost_accuracy > self.validation_thresholds['cost_accuracy']:
            results['issues'].append('Cost estimates deviate significantly from actual')
            
        # Validate safety stock levels
        safety_stock_validation = self._validate_safety_stock(model_params, simulation_results)
        results['metrics']['safety_stock_adequacy'] = safety_stock_validation
        
        return results

    def _check_capacity_constraints(self, solution: Dict) -> bool:
        """Check if solution respects all capacity constraints."""
        for route in solution.get('routes', []):
            total_load = sum(stop['demand'] for stop in route['stops'])
            if total_load > route['vehicle_capacity']:
                return False
        return True

    def _check_time_windows(self, solution: Dict) -> bool:
        """Validate time window constraints."""
        for route in solution.get('routes', []):
            current_time = route['start_time']
            for stop in route['stops']:
                arrival_time = current_time + timedelta(minutes=stop['travel_time'])
                if arrival_time > stop['time_window_end']:
                    return False
                current_time = max(arrival_time + stop['service_time'],
                                 stop['time_window_start'])
        return True

    def _calculate_service_level(self, simulation_results: Dict) -> float:
        """Calculate achieved service level from simulation results."""
        total_demand = sum(simulation_results['demand'])
        fulfilled_demand = sum(simulation_results['fulfilled_demand'])
        return fulfilled_demand / total_demand if total_demand > 0 else 0.0

    def _validate_cost_accuracy(self, model_params: Dict,
                              simulation_results: Dict) -> float:
        """Validate accuracy of cost estimations."""
        estimated_cost = model_params['estimated_total_cost']
        actual_cost = simulation_results['actual_total_cost']
        return abs(estimated_cost - actual_cost) / actual_cost

    def _validate_safety_stock(self, model_params: Dict,
                             simulation_results: Dict) -> float:
        """Validate if safety stock levels are adequate."""
        stockouts = len([x for x in simulation_results['inventory_levels'] 
                        if x <= model_params['safety_stock']])
        total_periods = len(simulation_results['inventory_levels'])
        return 1 - (stockouts / total_periods)