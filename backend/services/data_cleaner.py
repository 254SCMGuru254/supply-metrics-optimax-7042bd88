"""
Data auto-deletion service for Supply Metrics Optimax
Automatically removes user data after 1 hour of inactivity
100% open-source implementation without third-party dependencies
"""
import os
import json
import time
import shutil
import threading
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("data_cleaner")

class DataCleaner:
    """Service that automatically removes user data after specified period of inactivity"""
    
    def __init__(self, data_dir: str = "user_data", 
                 expiry_hours: int = 1,
                 check_interval_minutes: int = 5):
        """
        Initialize the data cleaning service
        
        Args:
            data_dir: Directory where user data is stored
            expiry_hours: Hours after which inactive user data is deleted
            check_interval_minutes: How often to check for expired data
        """
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True, parents=True)
        
        self.expiry_time = timedelta(hours=expiry_hours)
        self.check_interval = timedelta(minutes=check_interval_minutes)
        self.user_access_times: Dict[str, datetime] = {}
        self.load_access_times()
        
        self.running = False
        self.cleaner_thread = None
    
    def load_access_times(self) -> None:
        """Load user access times from persistent storage"""
        access_file = self.data_dir / "access_times.json"
        if access_file.exists():
            try:
                with open(access_file, "r") as f:
                    time_data = json.load(f)
                    # Convert string times back to datetime objects
                    self.user_access_times = {
                        user_id: datetime.fromisoformat(time_str)
                        for user_id, time_str in time_data.items()
                    }
                logger.info(f"Loaded access times for {len(self.user_access_times)} users")
            except (json.JSONDecodeError, IOError) as e:
                logger.error(f"Error loading access times: {e}")
                self.user_access_times = {}
    
    def save_access_times(self) -> None:
        """Save user access times to persistent storage"""
        access_file = self.data_dir / "access_times.json"
        try:
            # Convert datetime objects to ISO format strings for JSON serialization
            time_data = {
                user_id: access_time.isoformat()
                for user_id, access_time in self.user_access_times.items()
            }
            with open(access_file, "w") as f:
                json.dump(time_data, f, indent=2)
            logger.debug("Saved user access times")
        except IOError as e:
            logger.error(f"Error saving access times: {e}")
    
    def record_user_activity(self, user_id: str) -> None:
        """Record that a user was active at the current time"""
        self.user_access_times[user_id] = datetime.now()
        self.save_access_times()
        
        # Ensure user directory exists
        user_dir = self.data_dir / user_id
        user_dir.mkdir(exist_ok=True, parents=True)
        logger.debug(f"Recorded activity for user {user_id}")
    
    def get_inactive_users(self) -> List[str]:
        """Get list of users who haven't been active within the expiry time"""
        current_time = datetime.now()
        inactive_users = []
        
        for user_id, last_access in self.user_access_times.items():
            if current_time - last_access > self.expiry_time:
                inactive_users.append(user_id)
                
        return inactive_users
    
    def cleanup_user_data(self, user_id: str) -> None:
        """Remove all data for a specific user"""
        user_dir = self.data_dir / user_id
        if user_dir.exists():
            try:
                shutil.rmtree(user_dir)
                logger.info(f"Removed data for inactive user {user_id}")
            except IOError as e:
                logger.error(f"Error removing data for user {user_id}: {e}")
        
        # Remove from access times
        if user_id in self.user_access_times:
            del self.user_access_times[user_id]
            self.save_access_times()
    
    def run_cleanup_cycle(self) -> None:
        """Run a single cleanup cycle to remove inactive user data"""
        logger.info("Running data cleanup cycle")
        inactive_users = self.get_inactive_users()
        
        for user_id in inactive_users:
            self.cleanup_user_data(user_id)
            
        logger.info(f"Cleanup cycle complete. Removed {len(inactive_users)} inactive users")
    
    def _cleaner_loop(self) -> None:
        """Internal method for the cleaner background thread"""
        logger.info("Data cleaner service started")
        while self.running:
            try:
                self.run_cleanup_cycle()
                # Sleep for the check interval
                time.sleep(self.check_interval.total_seconds())
            except Exception as e:
                logger.error(f"Error in cleaner loop: {e}")
                # Still sleep to avoid tight loop in case of recurring errors
                time.sleep(60)
    
    def start(self) -> None:
        """Start the background cleaner thread"""
        if self.running:
            logger.warning("Cleaner already running")
            return
            
        self.running = True
        self.cleaner_thread = threading.Thread(target=self._cleaner_loop, daemon=True)
        self.cleaner_thread.start()
        logger.info("Started data cleaner service")
    
    def stop(self) -> None:
        """Stop the background cleaner thread"""
        if not self.running:
            return
            
        self.running = False
        if self.cleaner_thread:
            self.cleaner_thread.join(timeout=5.0)
        logger.info("Stopped data cleaner service")
        
    def get_time_remaining(self, user_id: str) -> Optional[timedelta]:
        """Get the time remaining before a user's data expires"""
        if user_id not in self.user_access_times:
            return None
            
        last_access = self.user_access_times[user_id]
        current_time = datetime.now()
        time_elapsed = current_time - last_access
        
        if time_elapsed >= self.expiry_time:
            return timedelta(0)
            
        return self.expiry_time - time_elapsed

# Singleton instance for the application
data_cleaner = DataCleaner()

# Helper functions for API integration

def start_data_cleaner():
    """Start the data cleaner service from the application"""
    data_cleaner.start()

def stop_data_cleaner():
    """Stop the data cleaner service from the application"""
    data_cleaner.stop()

def record_activity(user_id: str):
    """Record user activity from API calls"""
    data_cleaner.record_user_activity(user_id)

def get_expiry_warning(user_id: str) -> dict:
    """Get a warning object for the API to display to the user"""
    time_remaining = data_cleaner.get_time_remaining(user_id)
    
    if not time_remaining:
        return {
            "show_warning": False,
            "message": "",
            "minutes_remaining": None
        }
        
    minutes_remaining = time_remaining.total_seconds() / 60
    
    # Only show warning when less than 15 minutes remaining
    if minutes_remaining < 15:
        return {
            "show_warning": True,
            "message": f"⚠️ Your data will be automatically deleted in {int(minutes_remaining)} minutes due to inactivity. This is a free service with limited storage.",
            "minutes_remaining": int(minutes_remaining)
        }
    
    return {
        "show_warning": False,
        "message": "",
        "minutes_remaining": int(minutes_remaining)
    }

if __name__ == "__main__":
    # Simple test when run directly
    cleaner = DataCleaner(expiry_hours=1, check_interval_minutes=1)
    cleaner.record_user_activity("test_user")
    cleaner.start()
    
    try:
        while True:
            warning = get_expiry_warning("test_user")
            if warning["show_warning"]:
                print(warning["message"])
            time.sleep(60)
    except KeyboardInterrupt:
        cleaner.stop()
        print("Stopped")
