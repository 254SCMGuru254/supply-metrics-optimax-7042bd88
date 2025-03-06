"""
Client Manager Service for Multi-Tenant SaaS Platform

This module manages client-specific data and ensures proper resource
allocation in a multi-tenant environment without requiring any paid services.
"""

import os
import time
import json
import uuid
import threading
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path

class ClientManager:
    """
    Manages client data and resources in multi-tenant environment.
    Implements rate limiting and resource allocation using file-based
    techniques that don't require external paid services.
    """
    
    # Service tiers with resource limits
    SERVICE_TIERS = {
        "basic": {
            "scenarios_per_day": 10,
            "optimization_time_limit": 60,  # seconds
            "max_nodes": 50,
            "cache_ttl": 86400  # 1 day
        },
        "standard": {
            "scenarios_per_day": 50,
            "optimization_time_limit": 300,  # 5 minutes
            "max_nodes": 200,
            "cache_ttl": 259200  # 3 days
        },
        "premium": {
            "scenarios_per_day": 200,
            "optimization_time_limit": 1800,  # 30 minutes
            "max_nodes": 1000,
            "cache_ttl": 604800  # 7 days
        }
    }
    
    def __init__(self, clients_dir: str = "clients"):
        """
        Initialize the client manager.
        
        Args:
            clients_dir: Directory to store client data
        """
        self.clients_dir = clients_dir
        self.clients = {}
        self.rate_limits = {}
        self.usage_metrics = {}
        self.locks = {}
        self.logger = logging.getLogger(__name__)
        
        # Create clients directory if it doesn't exist
        Path(clients_dir).mkdir(parents=True, exist_ok=True)
        
        # Load existing clients
        self._load_clients()
        
    def _load_clients(self):
        """Load existing client data from disk."""
        clients_file = os.path.join(self.clients_dir, "clients.json")
        if os.path.exists(clients_file):
            try:
                with open(clients_file, 'r') as f:
                    self.clients = json.load(f)
                self.logger.info(f"Loaded {len(self.clients)} clients")
            except Exception as e:
                self.logger.error(f"Error loading clients: {e}")
        
        # Load usage metrics
        for client_id in self.clients:
            self._load_client_usage(client_id)
            
    def _save_clients(self):
        """Save client data to disk."""
        clients_file = os.path.join(self.clients_dir, "clients.json")
        try:
            with open(clients_file, 'w') as f:
                json.dump(self.clients, f, indent=2)
        except Exception as e:
            self.logger.error(f"Error saving clients: {e}")
            
    def _load_client_usage(self, client_id: str):
        """
        Load usage metrics for a specific client.
        
        Args:
            client_id: Client identifier
        """
        usage_file = os.path.join(self.get_client_data_path(client_id), "usage.json")
        if os.path.exists(usage_file):
            try:
                with open(usage_file, 'r') as f:
                    self.usage_metrics[client_id] = json.load(f)
            except Exception as e:
                self.logger.error(f"Error loading usage for client {client_id}: {e}")
                self.usage_metrics[client_id] = {}
        else:
            self.usage_metrics[client_id] = {}
            
    def _save_client_usage(self, client_id: str):
        """
        Save usage metrics for a specific client.
        
        Args:
            client_id: Client identifier
        """
        if client_id not in self.usage_metrics:
            return
            
        client_dir = self.get_client_data_path(client_id)
        Path(client_dir).mkdir(parents=True, exist_ok=True)
        
        usage_file = os.path.join(client_dir, "usage.json")
        try:
            with open(usage_file, 'w') as f:
                json.dump(self.usage_metrics[client_id], f, indent=2)
        except Exception as e:
            self.logger.error(f"Error saving usage for client {client_id}: {e}")
        
    def register_client(self, client_id: str = None, tier: str = "basic") -> str:
        """
        Register a new client.
        
        Args:
            client_id: Optional client identifier (generated if None)
            tier: Service tier (basic, standard, premium)
            
        Returns:
            Client identifier
        """
        # Generate client ID if not provided
        if client_id is None:
            client_id = str(uuid.uuid4())
            
        # Validate tier
        if tier not in self.SERVICE_TIERS:
            tier = "basic"
            
        # Register client
        self.clients[client_id] = {
            "tier": tier,
            "registration_time": time.time(),
            "last_active": time.time()
        }
        
        # Initialize usage metrics
        self.usage_metrics[client_id] = {
            "scenarios_today": 0,
            "last_reset": time.time(),
            "optimizations": {},
            "resource_usage": {}
        }
        
        # Create client directory
        client_dir = self.get_client_data_path(client_id)
        Path(client_dir).mkdir(parents=True, exist_ok=True)
        
        # Save updates
        self._save_clients()
        self._save_client_usage(client_id)
        
        return client_id
        
    def check_rate_limit(self, client_id: str, resource_type: str) -> bool:
        """
        Check if a client has exceeded their rate limit.
        
        Args:
            client_id: Client identifier
            resource_type: Type of resource being accessed
            
        Returns:
            True if limit not exceeded, False if limit exceeded
        """
        if client_id not in self.clients:
            return False
            
        # Get client tier
        tier = self.clients[client_id]["tier"]
        limits = self.SERVICE_TIERS.get(tier, self.SERVICE_TIERS["basic"])
        
        # Check specific resource limits
        if resource_type == "scenarios":
            # Check if usage needs to be reset (daily)
            self._check_usage_reset(client_id)
            
            # Get current usage
            scenarios_today = self.usage_metrics[client_id].get("scenarios_today", 0)
            
            # Check against limit
            return scenarios_today < limits["scenarios_per_day"]
            
        elif resource_type == "optimization_time":
            # No specific check needed here - just informing about the limit
            return True
            
        elif resource_type == "nodes":
            # Check node count limit
            return True  # This would be checked at model creation time
            
        # Default: allow access
        return True
        
    def _check_usage_reset(self, client_id: str):
        """
        Check if usage metrics need to be reset (e.g., daily limits).
        
        Args:
            client_id: Client identifier
        """
        if client_id not in self.usage_metrics:
            return
            
        # Check if a day has passed since last reset
        last_reset = self.usage_metrics[client_id].get("last_reset", 0)
        day_seconds = 86400  # Seconds in a day
        
        if time.time() - last_reset >= day_seconds:
            # Reset daily counters
            self.usage_metrics[client_id]["scenarios_today"] = 0
            self.usage_metrics[client_id]["last_reset"] = time.time()
            self._save_client_usage(client_id)
        
    def record_usage(self, client_id: str, resource_type: str, 
                   amount: float = 1.0) -> None:
        """
        Record resource usage for a client.
        
        Args:
            client_id: Client identifier
            resource_type: Type of resource being used
            amount: Amount of resource used
        """
        if client_id not in self.clients or client_id not in self.usage_metrics:
            return
            
        # Update last active time
        self.clients[client_id]["last_active"] = time.time()
        
        # Record specific usage
        if resource_type == "scenarios":
            self.usage_metrics[client_id]["scenarios_today"] = \
                self.usage_metrics[client_id].get("scenarios_today", 0) + amount
                
        elif resource_type.startswith("optimization:"):
            # Record optimization time for specific type
            opt_type = resource_type.split(":", 1)[1]
            if "optimizations" not in self.usage_metrics[client_id]:
                self.usage_metrics[client_id]["optimizations"] = {}
                
            self.usage_metrics[client_id]["optimizations"][opt_type] = \
                self.usage_metrics[client_id]["optimizations"].get(opt_type, 0) + amount
                
        else:
            # Generic resource usage
            if "resource_usage" not in self.usage_metrics[client_id]:
                self.usage_metrics[client_id]["resource_usage"] = {}
                
            self.usage_metrics[client_id]["resource_usage"][resource_type] = \
                self.usage_metrics[client_id]["resource_usage"].get(resource_type, 0) + amount
        
        # Save usage metrics
        self._save_client_usage(client_id)
        self._save_clients()  # For last_active update
        
    def get_client_data_path(self, client_id: str) -> str:
        """
        Get the file system path for client-specific data.
        
        Args:
            client_id: Client identifier
            
        Returns:
            Path to client data directory
        """
        return os.path.join(self.clients_dir, client_id)
        
    def get_client_tier_limits(self, client_id: str) -> Dict:
        """
        Get resource limits for a client's service tier.
        
        Args:
            client_id: Client identifier
            
        Returns:
            Dictionary of resource limits
        """
        if client_id not in self.clients:
            return self.SERVICE_TIERS["basic"]
            
        tier = self.clients[client_id]["tier"]
        return self.SERVICE_TIERS.get(tier, self.SERVICE_TIERS["basic"])
        
    def get_usage_report(self, client_id: str) -> Dict:
        """
        Get usage report for a client.
        
        Args:
            client_id: Client identifier
            
        Returns:
            Dictionary with usage metrics
        """
        if client_id not in self.clients or client_id not in self.usage_metrics:
            return {}
            
        # Get limits
        limits = self.get_client_tier_limits(client_id)
        
        # Build report
        report = {
            "client_id": client_id,
            "tier": self.clients[client_id]["tier"],
            "limits": limits,
            "usage": {
                "scenarios": {
                    "today": self.usage_metrics[client_id].get("scenarios_today", 0),
                    "limit": limits["scenarios_per_day"],
                    "percent": (self.usage_metrics[client_id].get("scenarios_today", 0) / 
                              limits["scenarios_per_day"]) * 100
                },
                "optimizations": self.usage_metrics[client_id].get("optimizations", {}),
                "other_resources": self.usage_metrics[client_id].get("resource_usage", {})
            },
            "last_active": self.clients[client_id]["last_active"],
            "registration_time": self.clients[client_id]["registration_time"]
        }
        
        return report
        
    def cleanup_inactive_clients(self, inactive_days: int = 90) -> int:
        """
        Clean up data for inactive clients to free up storage.
        
        Args:
            inactive_days: Number of days of inactivity before cleanup
            
        Returns:
            Number of clients cleaned up
        """
        current_time = time.time()
        inactive_seconds = inactive_days * 86400
        cleanup_count = 0
        
        for client_id, client_data in list(self.clients.items()):
            last_active = client_data.get("last_active", 0)
            
            if current_time - last_active > inactive_seconds:
                # Client is inactive for too long, clean up
                
                # First archive their data (for potential recovery)
                client_dir = self.get_client_data_path(client_id)
                if os.path.exists(client_dir):
                    archive_dir = os.path.join(self.clients_dir, "archives")
                    Path(archive_dir).mkdir(exist_ok=True)
                    
                    try:
                        import shutil
                        shutil.make_archive(
                            os.path.join(archive_dir, f"{client_id}_{int(time.time())}"),
                            'zip',
                            client_dir
                        )
                        
                        # Remove client directory
                        shutil.rmtree(client_dir)
                    except Exception as e:
                        self.logger.error(f"Error archiving client {client_id}: {e}")
                        continue
                
                # Remove from in-memory data
                del self.clients[client_id]
                if client_id in self.usage_metrics:
                    del self.usage_metrics[client_id]
                if client_id in self.locks:
                    del self.locks[client_id]
                    
                cleanup_count += 1
                
        # Save updated clients list
        if cleanup_count > 0:
            self._save_clients()
            
        return cleanup_count
