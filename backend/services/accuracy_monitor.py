from typing import Dict, List, Optional
from datetime import datetime, timedelta
import numpy as np
from .metrics_storage import MetricsStorage
import logging
import json
import os
from pathlib import Path

class AccuracyMonitor:
    def __init__(self, storage: MetricsStorage):
        self.storage = storage
        self.logger = logging.getLogger(__name__)
        self.thresholds = {
            "critical": 70,  # Alert if accuracy drops below 70%
            "warning": 85,   # Warning if accuracy drops below 85%
        }
        self.alerts_dir = "data/alerts"
        Path(self.alerts_dir).mkdir(parents=True, exist_ok=True)

    def check_accuracy(self, lookback_days: int = 30) -> Dict:
        """
        Check accuracy of all models over the specified lookback period
        Returns alerts for any metrics falling below thresholds
        """
        start_date = datetime.now() - timedelta(days=lookback_days)
        alerts = []

        # Check each model's accuracy
        models = ["route-optimization", "inventory-management", "network-optimization"]
        for model in models:
            accuracy = self.storage.calculate_accuracy(
                model,
                start_date=start_date
            )
            
            for metric, value in accuracy.items():
                alert_level = self._check_threshold(value)
                if alert_level:
                    alerts.append({
                        "timestamp": datetime.now().isoformat(),
                        "model": model,
                        "metric": metric,
                        "accuracy": value,
                        "level": alert_level,
                        "message": f"{model}: {metric} accuracy at {value:.1f}% ({alert_level})"
                    })

        # Save alerts
        if alerts:
            self._save_alerts(alerts)
            
        return {
            "alerts": alerts,
            "summary": self._generate_summary(alerts)
        }

    def analyze_trends(self, lookback_days: int = 90) -> Dict:
        """Analyze accuracy trends to identify systematic issues"""
        start_date = datetime.now() - timedelta(days=lookback_days)
        trends = {}
        
        models = ["route-optimization", "inventory-management", "network-optimization"]
        for model in models:
            history = self.storage.get_metrics_history(
                model,
                metric_type="actual",
                start_date=start_date
            )
            
            if history:
                trends[model] = self._analyze_model_trend(history)
                
        return trends

    def generate_report(self) -> Dict:
        """Generate comprehensive accuracy report"""
        current_accuracy = self.check_accuracy(lookback_days=30)
        trends = self.analyze_trends(lookback_days=90)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "current_status": current_accuracy,
            "trends": trends,
            "recommendations": self._generate_recommendations(current_accuracy, trends)
        }

    def _check_threshold(self, accuracy: float) -> Optional[str]:
        """Check if accuracy crosses any alert thresholds"""
        if accuracy < self.thresholds["critical"]:
            return "critical"
        elif accuracy < self.thresholds["warning"]:
            return "warning"
        return None

    def _save_alerts(self, alerts: List[Dict]) -> None:
        """Save alerts to file"""
        filename = f"alerts_{datetime.now().strftime('%Y%m%d')}.json"
        filepath = Path(self.alerts_dir) / filename
        
        existing_alerts = []
        if filepath.exists():
            with open(filepath, 'r') as f:
                existing_alerts = json.load(f)
                
        all_alerts = existing_alerts + alerts
        
        with open(filepath, 'w') as f:
            json.dump(all_alerts, f, indent=2)

    def _generate_summary(self, alerts: List[Dict]) -> Dict:
        """Generate summary of alert status"""
        critical = len([a for a in alerts if a["level"] == "critical"])
        warnings = len([a for a in alerts if a["level"] == "warning"])
        
        return {
            "total_alerts": len(alerts),
            "critical_alerts": critical,
            "warnings": warnings,
            "status": "critical" if critical > 0 else "warning" if warnings > 0 else "healthy"
        }

    def _analyze_model_trend(self, history: List[Dict]) -> Dict:
        """Analyze accuracy trend for a model"""
        accuracies = [h.get("accuracy", 0) for h in history]
        if not accuracies:
            return {}
            
        # Calculate trend statistics
        trend = {
            "mean": float(np.mean(accuracies)),
            "std": float(np.std(accuracies)),
            "min": float(np.min(accuracies)),
            "max": float(np.max(accuracies))
        }
        
        # Detect trend direction using linear regression
        x = np.arange(len(accuracies))
        z = np.polyfit(x, accuracies, 1)
        trend["slope"] = float(z[0])
        trend["direction"] = "improving" if z[0] > 0.01 else "declining" if z[0] < -0.01 else "stable"
        
        return trend

    def _generate_recommendations(self, current: Dict, trends: Dict) -> List[Dict]:
        """Generate recommendations based on accuracy analysis"""
        recommendations = []
        
        # Check for critical alerts
        if current["summary"]["critical_alerts"] > 0:
            recommendations.append({
                "priority": "high",
                "action": "Immediate model retraining required",
                "details": "Critical accuracy drops detected in one or more models"
            })
            
        # Check trends
        for model, trend in trends.items():
            if trend.get("direction") == "declining":
                recommendations.append({
                    "priority": "medium",
                    "action": f"Investigate {model} accuracy decline",
                    "details": f"Accuracy trending down over past 90 days"
                })
                
            if trend.get("std", 0) > 10:
                recommendations.append({
                    "priority": "medium",
                    "action": f"Review {model} stability",
                    "details": "High variance in accuracy suggests inconsistent performance"
                })
                
        return recommendations