"""
Scenario Caching Service

This module implements pre-computation and caching of common disruption
scenarios to improve response time for multi-tenant SaaS applications.
"""

import json
import hashlib
import time
import threading
from typing import Dict, List, Any, Optional
import pickle
import os
from pathlib import Path

class ScenarioCache:
    """
    Caches common disruption scenarios and optimization results.
    This implementation uses file-based caching to avoid dependencies
    on external services like Redis.
    """
    
    def __init__(self, cache_dir: str = "cache"):
        """
        Initialize the scenario cache.
        
        Args:
            cache_dir: Directory to store cached data
        """
        self.cache_dir = cache_dir
        self.cache_ttl = 86400  # 24 hours
        
        # Create cache directory if it doesn't exist
        Path(cache_dir).mkdir(parents=True, exist_ok=True)
        
    def cache_key(self, scenario_type: str, params: Dict) -> str:
        """
        Generate a cache key for a scenario.
        
        Args:
            scenario_type: Type of scenario
            params: Scenario parameters
            
        Returns:
            Cache key string
        """
        # Convert params to a stable string representation
        param_str = json.dumps(params, sort_keys=True)
        
        # Generate a hash
        key = hashlib.md5(f"{scenario_type}:{param_str}".encode()).hexdigest()
        
        return key
        
    def get_cached_scenario(self, scenario_type: str, 
                           params: Dict) -> Optional[Dict]:
        """
        Get a cached scenario if available.
        
        Args:
            scenario_type: Type of scenario
            params: Scenario parameters
            
        Returns:
            Cached scenario or None if not found
        """
        key = self.cache_key(scenario_type, params)
        cache_file = os.path.join(self.cache_dir, key + ".cache")
        
        # Check if cache file exists
        if not os.path.exists(cache_file):
            return None
            
        # Check if cache is expired
        if time.time() - os.path.getmtime(cache_file) > self.cache_ttl:
            # Cache expired, delete it
            os.remove(cache_file)
            return None
            
        # Load cached data
        try:
            with open(cache_file, 'rb') as f:
                cached_data = pickle.load(f)
                
            return cached_data
        except Exception as e:
            print(f"Error loading cache: {e}")
            return None
        
    def cache_scenario(self, scenario_type: str, params: Dict, 
                      result: Dict, ttl: Optional[int] = None) -> None:
        """
        Cache a scenario result.
        
        Args:
            scenario_type: Type of scenario
            params: Scenario parameters
            result: Scenario result to cache
            ttl: Time to live in seconds (None for default)
        """
        key = self.cache_key(scenario_type, params)
        cache_file = os.path.join(self.cache_dir, key + ".cache")
        
        # Store data in cache
        try:
            with open(cache_file, 'wb') as f:
                pickle.dump(result, f)
        except Exception as e:
            print(f"Error caching scenario: {e}")
        
    def clear_expired_cache(self) -> int:
        """
        Clear expired items from the cache.
        
        Returns:
            Number of items cleared
        """
        cleared = 0
        current_time = time.time()
        
        # Check all cache files
        for cache_file in os.listdir(self.cache_dir):
            if cache_file.endswith(".cache"):
                full_path = os.path.join(self.cache_dir, cache_file)
                
                # Check if expired
                if current_time - os.path.getmtime(full_path) > self.cache_ttl:
                    os.remove(full_path)
                    cleared += 1
                    
        return cleared
        
    def precompute_common_scenarios(self, 
                                  disruption_simulator,
                                  network_optimizer) -> None:
        """
        Precompute and cache common disruption scenarios.
        
        Args:
            disruption_simulator: DisruptionSimulator instance
            network_optimizer: SupplyChainNetworkOptimizer instance
        """
        # Define common scenarios to precompute
        scenarios = [
            {
                "type": "pandemic",
                "params": {"severity": 0.5}
            },
            {
                "type": "natural_disaster",
                "params": {"severity": 0.7, "epicenter": (-1.2921, 36.8219)}  # Nairobi
            },
            {
                "type": "natural_disaster",
                "params": {"severity": 0.7, "epicenter": (-4.0435, 39.6682)}  # Mombasa
            },
            {
                "type": "infrastructure_failure",
                "params": {"severity": 0.8}
            }
        ]
        
        # Precompute each scenario
        for scenario_def in scenarios:
            scenario_type = scenario_def["type"]
            params = scenario_def["params"]
            
            # Check if already cached
            if self.get_cached_scenario(scenario_type, params) is None:
                try:
                    # Generate the disruption scenario
                    disruption = disruption_simulator.generate_disruption_scenario(
                        scenario_type,
                        params.get("epicenter"),
                        params
                    )
                    
                    # Apply to network
                    disrupted_network = disruption_simulator.apply_disruption_to_network(disruption)
                    
                    # Calculate metrics using resilience calculator
                    from models.resilience_metrics import ResilienceCalculator
                    calculator = ResilienceCalculator(network_optimizer)
                    impact = calculator.calculate_disruption_impact(disrupted_network)
                    
                    # Combine results
                    result = {
                        "disruption": disruption,
                        "impact": impact,
                        "timestamp": time.time()
                    }
                    
                    # Cache the result
                    self.cache_scenario(scenario_type, params, result)
                    
                    print(f"Precomputed scenario: {scenario_type}")
                except Exception as e:
                    print(f"Error precomputing scenario {scenario_type}: {e}")
        
    def get_scenario_with_compute(self, 
                                scenario_type: str,
                                params: Dict,
                                disruption_simulator,
                                network_optimizer) -> Dict:
        """
        Get a scenario from cache or compute it if not cached.
        
        Args:
            scenario_type: Type of scenario
            params: Scenario parameters
            disruption_simulator: DisruptionSimulator instance
            network_optimizer: SupplyChainNetworkOptimizer instance
            
        Returns:
            Scenario results
        """
        # Try to get from cache first
        cached = self.get_cached_scenario(scenario_type, params)
        if cached is not None:
            return cached
            
        # Not in cache, compute it
        try:
            # Generate the disruption scenario
            disruption = disruption_simulator.generate_disruption_scenario(
                scenario_type,
                params.get("epicenter"),
                params
            )
            
            # Apply to network
            disrupted_network = disruption_simulator.apply_disruption_to_network(disruption)
            
            # Calculate metrics using resilience calculator
            from models.resilience_metrics import ResilienceCalculator
            calculator = ResilienceCalculator(network_optimizer)
            impact = calculator.calculate_disruption_impact(disrupted_network)
            
            # Combine results
            result = {
                "disruption": disruption,
                "impact": impact,
                "timestamp": time.time()
            }
            
            # Cache the result
            self.cache_scenario(scenario_type, params, result)
            
            return result
        except Exception as e:
            print(f"Error computing scenario {scenario_type}: {e}")
            return {
                "error": str(e),
                "timestamp": time.time()
            }
