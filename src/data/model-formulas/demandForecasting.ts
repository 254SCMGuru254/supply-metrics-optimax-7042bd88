import { SupplyChainModel } from '../modelFormulaRegistry';

const demandForecasting: SupplyChainModel = {
  id: "demand-forecasting",
  name: "Demand Forecasting",
  description: "Advanced demand forecasting and prediction models using statistical and ML approaches.",
  category: "Forecasting",
  formulas: [
    {
      id: "arima-forecasting",
      name: "ARIMA Demand Forecasting",
      description: "Autoregressive Integrated Moving Average model for time series demand prediction.",
      formula: "ARIMA(p,d,q): X_t = φ₁X_{t-1} + ... + φ_pX_{t-p} + θ₁ε_{t-1} + ... + θ_qε_{t-q} + ε_t",
      complexity: "High",
      accuracy: "90-95%",
      useCase: "Seasonal demand patterns with trend and historical data",
      backendFunction: "arimaForecasting",
      inputs: [
        { name: "historical_demand", label: "Historical Demand Data", type: "array" },
        { name: "p_value", label: "AR Order (p)", type: "number", defaultValue: 1 },
        { name: "d_value", label: "Differencing Order (d)", type: "number", defaultValue: 1 },
        { name: "q_value", label: "MA Order (q)", type: "number", defaultValue: 1 },
        { name: "forecast_periods", label: "Forecast Periods", type: "number", defaultValue: 12 }
      ],
      outputs: [
        { name: "forecast_values", label: "Forecasted Demand", unit: "units" },
        { name: "confidence_intervals", label: "Confidence Intervals", unit: "%" },
        { name: "mape", label: "Mean Absolute Percentage Error", unit: "%" }
      ]
    },
    {
      id: "exponential-smoothing",
      name: "Exponential Smoothing",
      description: "Weighted moving average with exponentially decreasing weights for demand forecasting.",
      formula: "S_t = αX_t + (1-α)S_{t-1}",
      complexity: "Medium",
      accuracy: "85-90%",
      useCase: "Short-term forecasting with minimal historical data",
      backendFunction: "exponentialSmoothing",
      inputs: [
        { name: "historical_demand", label: "Historical Demand", type: "array" },
        { name: "alpha", label: "Smoothing Parameter (α)", type: "number", defaultValue: 0.3 },
        { name: "forecast_periods", label: "Periods to Forecast", type: "number", defaultValue: 6 }
      ],
      outputs: [
        { name: "smoothed_values", label: "Smoothed Values", unit: "units" },
        { name: "forecast", label: "Forecast", unit: "units" },
        { name: "mae", label: "Mean Absolute Error", unit: "units" }
      ]
    },
    {
      id: "holt-winters",
      name: "Holt-Winters Seasonal",
      description: "Triple exponential smoothing for trend and seasonal patterns in demand.",
      formula: "L_t = α(X_t/S_{t-m}) + (1-α)(L_{t-1} + b_{t-1}), b_t = β(L_t - L_{t-1}) + (1-β)b_{t-1}",
      complexity: "High",
      accuracy: "92-96%",
      useCase: "Seasonal demand with trend components",
      backendFunction: "holtWinters",
      inputs: [
        { name: "historical_demand", label: "Historical Demand", type: "array" },
        { name: "alpha", label: "Level Smoothing (α)", type: "number", defaultValue: 0.3 },
        { name: "beta", label: "Trend Smoothing (β)", type: "number", defaultValue: 0.1 },
        { name: "gamma", label: "Seasonal Smoothing (γ)", type: "number", defaultValue: 0.2 },
        { name: "seasonal_periods", label: "Seasonal Periods", type: "number", defaultValue: 12 }
      ],
      outputs: [
        { name: "level", label: "Level Component", unit: "units" },
        { name: "trend", label: "Trend Component", unit: "units" },
        { name: "seasonal", label: "Seasonal Indices", unit: "index" },
        { name: "forecast", label: "Forecast Values", unit: "units" }
      ]
    },
    {
      id: "ml-demand-forecasting",
      name: "Machine Learning Demand Forecasting",
      description: "Advanced ML models (Random Forest, XGBoost) for demand prediction with external factors.",
      formula: "y = f(X) where f is learned from {(x_i, y_i)} using ensemble methods",
      complexity: "Very High",
      accuracy: "94-98%",
      useCase: "Complex demand patterns with multiple external factors",
      backendFunction: "mlDemandForecasting",
      inputs: [
        { name: "historical_demand", label: "Historical Demand", type: "array" },
        { name: "external_factors", label: "External Factors (weather, promotions, etc.)", type: "array" },
        { name: "model_type", label: "ML Model Type", type: "select", defaultValue: "random_forest" },
        { name: "train_test_split", label: "Train/Test Split", type: "number", defaultValue: 0.8 }
      ],
      outputs: [
        { name: "predictions", label: "ML Predictions", unit: "units" },
        { name: "feature_importance", label: "Feature Importance", unit: "score" },
        { name: "r_squared", label: "R-Squared Score", unit: "%" },
        { name: "rmse", label: "Root Mean Square Error", unit: "units" }
      ]
    }
  ]
};

export default demandForecasting;