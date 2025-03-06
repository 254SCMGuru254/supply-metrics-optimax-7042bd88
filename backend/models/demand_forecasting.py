"""
Demand Forecasting Model for Supply Metrics Optimax

This module provides free, open-source ML-based demand forecasting capabilities
using Facebook Prophet and scikit-learn. It supports time series forecasting,
seasonal decomposition, and multi-variate prediction.
"""

import pandas as pd
import numpy as np
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from statsmodels.tsa.seasonal import seasonal_decompose
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from typing import Dict, List, Tuple, Union, Optional
import joblib
import os
import logging

class DemandForecaster:
    """
    Time series-based demand forecasting for supply chain nodes
    using multiple algorithms, including Facebook Prophet and RandomForest.
    """
    def __init__(self, 
                 model_dir: str = 'models',
                 use_external_features: bool = False):
        """
        Initialize the forecaster

        Args:
            model_dir: Directory to save/load models
            use_external_features: Whether to include external features (weather, events, etc.)
        """
        self.model_dir = model_dir
        self.use_external_features = use_external_features
        self.prophet_model = None
        self.rf_model = None
        self.scaler = None
        
        # Create model directory if it doesn't exist
        os.makedirs(model_dir, exist_ok=True)
        
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger('DemandForecaster')
    
    def preprocess_data(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Preprocess time series data for forecasting
        
        Args:
            data: DataFrame with 'ds' (date) and 'y' (demand) columns
            
        Returns:
            Preprocessed DataFrame
        """
        # Convert to Prophet format if needed
        if 'date' in data.columns and 'ds' not in data.columns:
            data = data.rename(columns={'date': 'ds'})
        
        if 'demand' in data.columns and 'y' not in data.columns:
            data = data.rename(columns={'demand': 'y'})
            
        # Ensure datetime format
        data['ds'] = pd.to_datetime(data['ds'])
        
        # Handle missing values with forward fill (assumes time ordered data)
        data['y'] = data['y'].fillna(method='ffill')
        
        # Handle remaining NaN with zeros
        data['y'] = data['y'].fillna(0)
        
        return data
    
    def fit_prophet(self, data: pd.DataFrame, 
                   seasonality_mode: str = 'multiplicative',
                   add_country_holidays: bool = True) -> None:
        """
        Fit Facebook Prophet model to historical demand data
        
        Args:
            data: DataFrame with 'ds' (date) and 'y' (demand) columns
            seasonality_mode: Additive or multiplicative seasonality
            add_country_holidays: Whether to add Kenya holidays
        """
        data = self.preprocess_data(data)
        
        # Create and fit the model
        self.prophet_model = Prophet(
            seasonality_mode=seasonality_mode,
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False
        )
        
        # Add Kenyan holidays
        if add_country_holidays:
            self.prophet_model.add_country_holidays(country_name='KE')
        
        # If we have additional regressors
        if self.use_external_features:
            for col in data.columns:
                if col not in ['ds', 'y'] and data[col].dtype in [np.float64, np.int64]:
                    self.prophet_model.add_regressor(col)
        
        self.prophet_model.fit(data)
        
        # Save the model
        model_path = os.path.join(self.model_dir, 'prophet_model.pkl')
        with open(model_path, 'wb') as f:
            joblib.dump(self.prophet_model, f)
            
        self.logger.info(f"Prophet model trained and saved to {model_path}")
    
    def forecast_prophet(self, periods: int = 30, 
                        freq: str = 'D',
                        return_components: bool = False) -> pd.DataFrame:
        """
        Generate forecasts using the trained Prophet model
        
        Args:
            periods: Number of periods to forecast
            freq: Frequency of the forecast (D=daily, W=weekly, M=monthly)
            return_components: Whether to return seasonal components
            
        Returns:
            DataFrame with forecasts
        """
        if self.prophet_model is None:
            self.logger.error("Prophet model not trained. Call fit_prophet first.")
            raise ValueError("Prophet model not trained. Call fit_prophet first.")
            
        # Create future dataframe
        future = self.prophet_model.make_future_dataframe(
            periods=periods, 
            freq=freq
        )
        
        # Make predictions
        forecast = self.prophet_model.predict(future)
        
        if return_components:
            return forecast
        else:
            return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    
    def fit_random_forest(self, data: pd.DataFrame, 
                         target_col: str = 'y',
                         test_size: float = 0.2) -> Dict:
        """
        Fit a Random Forest regression model to demand data
        with additional features beyond time series
        
        Args:
            data: DataFrame with features and target
            target_col: Column name for the target variable
            test_size: Proportion of data to use for testing
            
        Returns:
            Dictionary with model performance metrics
        """
        # Prepare features and target
        X = data.drop(columns=[target_col])
        y = data[target_col]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # Create pipeline with preprocessing and model
        self.rf_model = Pipeline([
            ('scaler', StandardScaler()),
            ('regressor', RandomForestRegressor(
                n_estimators=100, 
                max_depth=None,
                min_samples_split=2,
                random_state=42
            ))
        ])
        
        # Train the model
        self.rf_model.fit(X_train, y_train)
        
        # Evaluate performance
        train_score = self.rf_model.score(X_train, y_train)
        test_score = self.rf_model.score(X_test, y_test)
        
        # Save the model
        model_path = os.path.join(self.model_dir, 'rf_model.pkl')
        joblib.dump(self.rf_model, model_path)
        
        self.logger.info(f"Random Forest model trained and saved to {model_path}")
        self.logger.info(f"Train R² score: {train_score:.4f}, Test R² score: {test_score:.4f}")
        
        return {
            'train_r2': train_score,
            'test_r2': test_score,
            'feature_importance': dict(zip(
                X.columns, 
                self.rf_model.named_steps['regressor'].feature_importances_
            ))
        }
    
    def predict_random_forest(self, features: pd.DataFrame) -> np.ndarray:
        """
        Generate predictions using the trained Random Forest model
        
        Args:
            features: DataFrame with feature values
            
        Returns:
            Array of predictions
        """
        if self.rf_model is None:
            self.logger.error("Random Forest model not trained. Call fit_random_forest first.")
            raise ValueError("Random Forest model not trained. Call fit_random_forest first.")
            
        return self.rf_model.predict(features)
    
    def decompose_seasonality(self, data: pd.DataFrame, 
                             value_col: str = 'y',
                             date_col: str = 'ds',
                             period: int = 365) -> Dict:
        """
        Decompose time series into trend, seasonal, and residual components
        
        Args:
            data: DataFrame with time series data
            value_col: Column name with values
            date_col: Column name with dates
            period: Number of periods for seasonal decomposition
            
        Returns:
            Dictionary with decomposed components
        """
        # Ensure the data is indexed by date
        ts_data = data.copy()
        ts_data[date_col] = pd.to_datetime(ts_data[date_col])
        ts_data = ts_data.set_index(date_col)
        
        # Decompose the time series
        decomposition = seasonal_decompose(
            ts_data[value_col], 
            model='multiplicative', 
            period=period
        )
        
        # Convert components to dictionaries
        trend = decomposition.trend.dropna().to_dict()
        seasonal = decomposition.seasonal.dropna().to_dict()
        residual = decomposition.resid.dropna().to_dict()
        
        return {
            'trend': trend,
            'seasonal': seasonal,
            'residual': residual
        }
    
    def evaluate_prophet_model(self, data: pd.DataFrame, 
                              initial_period: str = '365 days',
                              horizon: str = '90 days') -> Dict:
        """
        Evaluate Prophet model using cross-validation
        
        Args:
            data: Historical data for validation
            initial_period: Initial training period
            horizon: Forecast horizon
            
        Returns:
            Dictionary with performance metrics
        """
        if self.prophet_model is None:
            self.logger.error("Prophet model not trained. Call fit_prophet first.")
            raise ValueError("Prophet model not trained. Call fit_prophet first.")
            
        # Run cross-validation
        cv_results = cross_validation(
            model=self.prophet_model,
            initial=initial_period,
            period='30 days',
            horizon=horizon,
            parallel='processes'
        )
        
        # Calculate performance metrics
        metrics = performance_metrics(cv_results)
        
        return {
            'mse': metrics['mse'].mean(),
            'rmse': metrics['rmse'].mean(),
            'mae': metrics['mae'].mean(),
            'mape': metrics['mape'].mean(),
            'coverage': metrics['coverage'].mean(),
            'detailed_metrics': metrics
        }
    
    def load_model(self, model_type: str = 'prophet') -> None:
        """
        Load a saved forecasting model
        
        Args:
            model_type: Type of model to load ('prophet' or 'random_forest')
        """
        if model_type == 'prophet':
            model_path = os.path.join(self.model_dir, 'prophet_model.pkl')
            with open(model_path, 'rb') as f:
                self.prophet_model = joblib.load(f)
            self.logger.info(f"Prophet model loaded from {model_path}")
        
        elif model_type == 'random_forest':
            model_path = os.path.join(self.model_dir, 'rf_model.pkl')
            self.rf_model = joblib.load(model_path)
            self.logger.info(f"Random Forest model loaded from {model_path}")
        
        else:
            self.logger.error(f"Unknown model type: {model_type}")
            raise ValueError(f"Unknown model type: {model_type}")
    
    def generate_sample_data(self, 
                            start_date: str = '2022-01-01',
                            end_date: str = '2023-12-31',
                            base_demand: float = 100.0,
                            trend: float = 0.001,
                            seasonality: Dict[str, float] = None,
                            noise_level: float = 0.1) -> pd.DataFrame:
        """
        Generate sample demand data for testing
        
        Args:
            start_date: Start date for the data
            end_date: End date for the data
            base_demand: Base demand value
            trend: Daily trend factor
            seasonality: Seasonality effects by day of week/month
            noise_level: Level of random noise to add
            
        Returns:
            DataFrame with synthetic demand data
        """
        # Create date range
        date_range = pd.date_range(start=start_date, end=end_date)
        
        # Default weekly seasonality if none provided
        if seasonality is None:
            seasonality = {
                'Monday': 1.0,
                'Tuesday': 1.1,
                'Wednesday': 1.2,
                'Thursday': 1.1,
                'Friday': 1.3,
                'Saturday': 1.5,
                'Sunday': 0.8
            }
        
        # Generate demand values
        demands = []
        
        for i, date in enumerate(date_range):
            # Base demand with trend
            demand = base_demand * (1 + trend * i)
            
            # Add weekly seasonality
            weekday = date.strftime('%A')
            if weekday in seasonality:
                demand *= seasonality[weekday]
            
            # Add monthly seasonality (higher in December, lower in January)
            month = date.month
            if month == 12:  # December
                demand *= 1.5
            elif month == 1:  # January
                demand *= 0.8
            
            # Add noise
            noise = np.random.normal(0, noise_level * demand)
            demand += noise
            
            demands.append(max(0, demand))  # Ensure non-negative
        
        # Create DataFrame
        data = pd.DataFrame({
            'ds': date_range,
            'y': demands
        })
        
        return data

# Example usage
if __name__ == "__main__":
    # Create forecaster
    forecaster = DemandForecaster()
    
    # Generate sample data
    data = forecaster.generate_sample_data()
    
    # Fit model
    forecaster.fit_prophet(data)
    
    # Generate forecast
    forecast = forecaster.forecast_prophet(periods=90)
    
    print(forecast.head())
