from typing import Dict, List, Optional
import json
from datetime import datetime
import os
from pathlib import Path

class MetricsStorage:
    """Service for persisting metrics data"""
    
    def __init__(self, storage_dir: str = "data/metrics"):
        self.storage_dir = storage_dir
        self._ensure_storage_exists()
        
    def _ensure_storage_exists(self):
        """Ensure storage directory exists"""
        Path(self.storage_dir).mkdir(parents=True, exist_ok=True)
        
    def store_current_metrics(self, metrics: Dict, timestamp: Optional[datetime] = None) -> None:
        """Store current state metrics"""
        if timestamp is None:
            timestamp = datetime.now()
            
        filename = f"current_metrics_{timestamp.strftime('%Y%m%d')}.json"
        self._save_metrics(filename, metrics)
        
    def store_estimated_metrics(self, metrics: Dict, model_name: str, 
                              timestamp: Optional[datetime] = None) -> None:
        """Store estimated improvement metrics"""
        if timestamp is None:
            timestamp = datetime.now()
            
        filename = f"estimated_{model_name}_{timestamp.strftime('%Y%m%d')}.json"
        self._save_metrics(filename, metrics)
        
    def store_actual_metrics(self, metrics: Dict, model_name: str,
                           timestamp: Optional[datetime] = None) -> None:
        """Store actual implementation results"""
        if timestamp is None:
            timestamp = datetime.now()
            
        filename = f"actual_{model_name}_{timestamp.strftime('%Y%m%d')}.json"
        self._save_metrics(filename, metrics)
        
    def get_metrics_history(self, model_name: Optional[str] = None, 
                          metric_type: str = "actual",
                          start_date: Optional[datetime] = None,
                          end_date: Optional[datetime] = None) -> List[Dict]:
        """Get historical metrics data with optional filtering"""
        metrics_history = []
        
        # Build filename pattern
        pattern = f"{metric_type}"
        if model_name:
            pattern += f"_{model_name}"
        pattern += "_*.json"
        
        # List all matching files
        for file_path in Path(self.storage_dir).glob(pattern):
            # Extract date from filename
            try:
                date_str = file_path.stem.split('_')[-1]
                file_date = datetime.strptime(date_str, '%Y%m%d')
                
                # Apply date filtering
                if start_date and file_date < start_date:
                    continue
                if end_date and file_date > end_date:
                    continue
                    
                # Load metrics
                metrics = self._load_metrics(file_path)
                metrics['date'] = file_date.isoformat()
                metrics_history.append(metrics)
                
            except (ValueError, IndexError):
                continue
                
        return sorted(metrics_history, key=lambda x: x['date'])
        
    def _save_metrics(self, filename: str, metrics: Dict) -> None:
        """Save metrics to JSON file"""
        file_path = Path(self.storage_dir) / filename
        with open(file_path, 'w') as f:
            json.dump(metrics, f, indent=2)
            
    def _load_metrics(self, file_path: Path) -> Dict:
        """Load metrics from JSON file"""
        with open(file_path, 'r') as f:
            return json.load(f)
            
    def calculate_accuracy(self, model_name: str,
                         start_date: Optional[datetime] = None,
                         end_date: Optional[datetime] = None) -> Dict:
        """Calculate accuracy of estimated vs actual improvements"""
        # Get estimated and actual metrics
        estimated = self.get_metrics_history(model_name, "estimated", start_date, end_date)
        actual = self.get_metrics_history(model_name, "actual", start_date, end_date)
        
        if not estimated or not actual:
            return {}
            
        # Calculate accuracy metrics
        accuracies = {}
        for est, act in zip(estimated, actual):
            for metric_name in est.keys():
                if metric_name != 'date' and isinstance(est[metric_name], (int, float)):
                    if metric_name not in accuracies:
                        accuracies[metric_name] = []
                        
                    est_val = est[metric_name]
                    act_val = act.get(metric_name)
                    
                    if act_val is not None and est_val != 0:
                        accuracy = 100 * (1 - abs(act_val - est_val) / abs(est_val))
                        accuracies[metric_name].append(accuracy)
                        
        # Calculate average accuracy per metric
        return {
            metric: sum(values) / len(values)
            for metric, values in accuracies.items()
            if values
        }