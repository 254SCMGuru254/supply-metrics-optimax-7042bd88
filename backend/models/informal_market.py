"""
Enhanced Informal Market Dynamics Model for Kenyan Supply Chains

This module implements sophisticated algorithms to handle informal market dynamics
common in Kenya, with improved calculations and validations.
"""

from typing import Dict, List, Tuple, Optional
import numpy as np
from datetime import datetime, timedelta
from scipy.stats import norm
from .model_validator import ModelValidator

class InformalMarketDynamics:
    def __init__(self):
        self.market_days = {
            'gikomba': [0, 3],  # Monday and Thursday
            'kongowea': [1, 4],  # Tuesday and Friday
            'kibuye': [2, 5],   # Wednesday and Saturday
            'karatina': [3, 6],  # Thursday and Sunday
            'wakulima': [1, 3, 5],  # Tuesday, Thursday, Saturday
            'machakos': [2, 5],  # Wednesday and Saturday
            'kitale': [0, 4]    # Monday and Friday
        }
        
        self.peak_hours = {
            'early_morning': (5, 8),   # Early morning trade
            'mid_morning': (8, 12),    # Main trading period
            'afternoon': (12, 16),     # Steady trade
            'evening': (16, 19)        # Evening rush
        }
        
        self.seasonal_factors = {
            # Months indexed 1-12
            'agricultural': {
                'peak': [3, 4, 5, 10, 11, 12],  # Harvest seasons
                'low': [1, 2, 7, 8, 9]          # Planting/growing seasons
            },
            'urban': {
                'peak': [1, 5, 8, 12],          # Urban consumption peaks
                'low': [2, 3, 6, 7, 9, 10, 11]  # Normal consumption
            }
        }
        
        self.validator = ModelValidator()

    def get_demand_multiplier(self, market: str, datetime: datetime, 
                            market_type: str = 'agricultural') -> float:
        """
        Calculate comprehensive demand multiplier based on multiple factors.
        
        Args:
            market: Market name
            datetime: Current datetime
            market_type: Type of market ('agricultural' or 'urban')
            
        Returns:
            float: Calculated demand multiplier
        """
        # Base multiplier
        multiplier = 1.0
        
        # Market day effect (stronger effect for agricultural markets)
        base_market_day_boost = 2.5 if market_type == 'agricultural' else 1.8
        if self.is_market_day(market, datetime):
            multiplier *= base_market_day_boost
        
        # Time of day effect
        hour = datetime.hour
        for period, (start, end) in self.peak_hours.items():
            if start <= hour < end:
                if period == 'mid_morning':
                    multiplier *= 2.0  # Peak trading hours
                elif period == 'early_morning':
                    multiplier *= 1.5  # Early trade bonus
                elif period == 'afternoon':
                    multiplier *= 1.3  # Steady trade
                elif period == 'evening':
                    multiplier *= 1.6  # Evening rush
                break
        
        # Seasonal effect
        month = datetime.month
        seasonal_patterns = self.seasonal_factors[market_type]
        if month in seasonal_patterns['peak']:
            multiplier *= 1.5
        elif month in seasonal_patterns['low']:
            multiplier *= 0.7
        
        # Weather effect (simplified)
        if self.is_rainy_season(datetime):
            rain_impact = 0.7 if market_type == 'agricultural' else 0.8
            multiplier *= rain_impact
        
        # Weekend effect for urban markets
        if market_type == 'urban' and datetime.weekday() >= 5:
            multiplier *= 1.3
        
        return multiplier

    def calculate_flexible_pricing(self, base_price: float, 
                                 demand_multiplier: float,
                                 competition_factor: float,
                                 perishable: bool = False,
                                 storage_cost: float = 0.0) -> float:
        """
        Calculate dynamic pricing with enhanced factors.
        
        Args:
            base_price: Base price of the item
            demand_multiplier: Current demand multiplier
            competition_factor: Local competition intensity (0-1)
            perishable: Whether the item is perishable
            storage_cost: Daily storage cost per unit
            
        Returns:
            float: Calculated price
        """
        # Validate inputs
        if base_price <= 0:
            raise ValueError("Base price must be positive")
        if not 0 <= competition_factor <= 1:
            raise ValueError("Competition factor must be between 0 and 1")
        
        # Start with base price adjusted for demand
        price = base_price * demand_multiplier
        
        # Apply competition factor with diminishing returns
        competition_impact = 1 - (competition_factor ** 0.7) * 0.3
        price *= competition_impact
        
        # Time-based discounting for perishables
        hour = datetime.now().hour
        if perishable:
            if hour >= 17:  # Late day discount
                discount = self._calculate_perishable_discount(hour)
                price *= (1 - discount)
        
        # Add storage cost if applicable
        if storage_cost > 0:
            price += storage_cost
        
        # Ensure price doesn't fall below minimum viable price
        min_viable_price = base_price * 0.7
        price = max(price, min_viable_price)
        
        return round(price, 2)

    def _calculate_perishable_discount(self, hour: int) -> float:
        """Calculate progressive discount for perishable items."""
        if hour >= 19:
            return 0.5  # 50% discount in last hour
        elif hour >= 18:
            return 0.3  # 30% discount
        elif hour >= 17:
            return 0.2  # 20% discount
        return 0.0

    def optimize_mobile_vendor_routing(self, 
                                     vendor_location: Tuple[float, float],
                                     markets: List[Dict],
                                     max_distance: float = 50.0,
                                     time_window: Tuple[int, int] = (6, 19)) -> List[Dict]:
        """
        Optimize routes for mobile vendors with enhanced constraints.
        
        Args:
            vendor_location: Starting point (lat, lon)
            markets: List of potential markets
            max_distance: Maximum travel distance in km
            time_window: Operating hours window
            
        Returns:
            List of optimized routes with timing
        """
        routes = []
        current_pos = vendor_location
        current_time = time_window[0]
        total_distance = 0.0
        
        # Sort markets by potential profit per km
        sorted_markets = sorted(
            markets,
            key=lambda x: self._calculate_market_priority(x, current_time)
        )
        
        for market in sorted_markets:
            market_pos = (market['latitude'], market['longitude'])
            distance = self._calculate_distance(current_pos, market_pos)
            
            # Check constraints
            if (total_distance + distance <= max_distance and
                self._can_reach_market(current_time, distance, market)):
                    
                # Calculate optimal visit duration
                visit_duration = self._calculate_optimal_visit_duration(
                    market, current_time)
                
                # Calculate expected profit
                profit = self._estimate_market_profit(
                    market, current_time, visit_duration)
                
                route = {
                    'market': market['name'],
                    'arrival_time': current_time,
                    'duration': visit_duration,
                    'distance': distance,
                    'expected_profit': profit,
                    'route': self._get_route_waypoints(current_pos, market_pos)
                }
                
                routes.append(route)
                current_pos = market_pos
                current_time += visit_duration
                total_distance += distance
        
        return routes

    def _calculate_distance(self, point1: Tuple[float, float], 
                          point2: Tuple[float, float]) -> float:
        """Calculate distance between two points using Haversine formula."""
        lat1, lon1 = point1
        lat2, lon2 = point2
        
        R = 6371  # Earth's radius in km
        
        dlat = np.radians(lat2 - lat1)
        dlon = np.radians(lon2 - lon1)
        
        a = (np.sin(dlat/2) * np.sin(dlat/2) +
             np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) *
             np.sin(dlon/2) * np.sin(dlon/2))
        
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1-a))
        
        return R * c

    def _calculate_market_priority(self, market: Dict, 
                                 current_time: int) -> float:
        """Calculate market priority score with demand and timing factors."""
        base_score = market.get('potential_revenue', 0)
        
        # Adjust for market day
        if self.is_market_day(market['name'], datetime.now()):
            base_score *= 2
        
        # Time-based adjustment
        time_factor = self._get_time_factor(current_time)
        base_score *= time_factor
        
        return base_score

    def _get_time_factor(self, hour: int) -> float:
        """Get time-based adjustment factor for market priority."""
        if 6 <= hour < 9:  # Early morning bonus
            return 1.5
        elif 9 <= hour < 12:  # Peak hours
            return 2.0
        elif 12 <= hour < 15:  # Afternoon
            return 1.2
        elif 15 <= hour < 17:  # Late afternoon
            return 1.0
        else:  # Evening/night
            return 0.7

    def _can_reach_market(self, current_time: int, 
                         distance: float,
                         market: Dict) -> bool:
        """Check if market can be reached within constraints."""
        travel_time = distance / 30  # Assume 30 km/h average speed
        arrival_time = current_time + travel_time
        
        return (arrival_time <= market.get('closing_time', 18) and
                arrival_time >= market.get('opening_time', 6))

    def _calculate_optimal_visit_duration(self, market: Dict,
                                       arrival_time: int) -> float:
        """Calculate optimal duration to spend at each market."""
        base_duration = 2.0  # Base 2 hours
        
        # Adjust for market size
        size_factor = market.get('size_factor', 1.0)
        duration = base_duration * size_factor
        
        # Adjust for time of day
        if 8 <= arrival_time <= 12:
            duration *= 1.3  # Peak hours need more time
        
        # Cap maximum duration
        return min(duration, 4.0)  # Max 4 hours per market

    def _estimate_market_profit(self, market: Dict,
                              arrival_time: int,
                              duration: float) -> float:
        """Estimate potential profit for market visit."""
        base_profit = market.get('average_daily_profit', 1000)
        
        # Time-based adjustment
        time_factor = self._get_time_factor(arrival_time)
        
        # Duration impact
        duration_factor = min(duration / 2.0, 1.5)  # Diminishing returns
        
        return base_profit * time_factor * duration_factor

    def _get_route_waypoints(self, start: Tuple[float, float],
                           end: Tuple[float, float]) -> List[Tuple[float, float]]:
        """Generate route waypoints considering Kenya's road network."""
        # Simplified for now - direct route
        # TODO: Implement actual road network routing
        return [start, end]

    def is_rainy_season(self, date: datetime) -> bool:
        """Check if date falls in Kenya's rainy seasons."""
        month = date.month
        return (3 <= month <= 5) or (10 <= month <= 12)

    def is_market_day(self, market_name: str, date: datetime) -> bool:
        """Check if today is a market day for given market."""
        today = date.weekday()
        return today in self.market_days.get(market_name.lower(), [])