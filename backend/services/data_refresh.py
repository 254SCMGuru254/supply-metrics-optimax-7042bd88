"""
Data Refresh Service

This module handles periodic updates of datasets used by the supply chain
optimization platform, including OSM data and publicly available datasets.
"""

import os
import time
import threading
import json
import urllib.request
import zipfile
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Any, Callable
import logging

class DataRefreshService:
    """
    Service for refreshing datasets used by the supply chain optimization platform.
    Uses only freely available public datasets and avoids API rate limits.
    """
    
    # OpenStreetMap Kenya extract URL (from Geofabrik free downloads)
    OSM_KENYA_URL = "https://download.geofabrik.de/africa/kenya-latest.osm.pbf"
    
    # OurAirports data (public domain)
    AIRPORTS_URL = "https://ourairports.com/data/airports.csv"
    
    # NOAA GSOD weather data (public domain)
    WEATHER_BASE_URL = "https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/"
    
    def __init__(self, data_dir: str = "data"):
        """
        Initialize the data refresh service.
        
        Args:
            data_dir: Directory to store downloaded datasets
        """
        self.data_dir = data_dir
        self.refresh_interval = 7 * 86400  # 7 days (in seconds)
        self.last_refresh = {}
        self.refresh_thread = None
        self.running = False
        self.logger = logging.getLogger(__name__)
        
        # Create data directories
        self._create_data_dirs()
        
    def _create_data_dirs(self):
        """Create necessary data directories."""
        # Main data directory
        Path(self.data_dir).mkdir(parents=True, exist_ok=True)
        
        # Sub-directories for different data types
        Path(os.path.join(self.data_dir, "osm")).mkdir(exist_ok=True)
        Path(os.path.join(self.data_dir, "airports")).mkdir(exist_ok=True)
        Path(os.path.join(self.data_dir, "weather")).mkdir(exist_ok=True)
        
    def start_refresh_thread(self):
        """Start the automatic refresh thread."""
        if self.refresh_thread is None or not self.refresh_thread.is_alive():
            self.running = True
            self.refresh_thread = threading.Thread(target=self._refresh_loop)
            self.refresh_thread.daemon = True
            self.refresh_thread.start()
            
    def stop_refresh_thread(self):
        """Stop the automatic refresh thread."""
        self.running = False
        if self.refresh_thread is not None:
            self.refresh_thread.join(timeout=1.0)
            
    def _refresh_loop(self):
        """Main refresh loop that runs in a separate thread."""
        while self.running:
            try:
                # Check if any datasets need refreshing
                self.refresh_all_datasets()
            except Exception as e:
                self.logger.error(f"Error in refresh loop: {e}")
                
            # Sleep for an hour before checking again
            for _ in range(3600):  # Check for stop signal every second
                if not self.running:
                    break
                time.sleep(1)
                
    def refresh_all_datasets(self):
        """Refresh all datasets if needed."""
        # OSM data
        self.refresh_osm_data()
        
        # Airports data
        self.refresh_airports_data()
        
        # Weather data (most recent year)
        current_year = time.localtime().tm_year
        self.refresh_weather_data(current_year)
        
    def refresh_osm_data(self):
        """
        Refresh OpenStreetMap data for Kenya.
        """
        dataset_key = "osm_kenya"
        osm_dir = os.path.join(self.data_dir, "osm")
        target_file = os.path.join(osm_dir, "kenya-latest.osm.pbf")
        
        # Check if refresh needed
        if self._needs_refresh(dataset_key, target_file):
            try:
                self.logger.info("Refreshing OSM Kenya data...")
                
                # Download the file
                urllib.request.urlretrieve(self.OSM_KENYA_URL, target_file)
                
                # Update refresh timestamp
                self._update_refresh_time(dataset_key)
                
                self.logger.info("OSM Kenya data refreshed successfully")
                return True
            except Exception as e:
                self.logger.error(f"Error refreshing OSM Kenya data: {e}")
                return False
        return False
        
    def refresh_airports_data(self):
        """
        Refresh airports data.
        """
        dataset_key = "airports"
        airports_dir = os.path.join(self.data_dir, "airports")
        target_file = os.path.join(airports_dir, "airports.csv")
        
        # Check if refresh needed
        if self._needs_refresh(dataset_key, target_file):
            try:
                self.logger.info("Refreshing airports data...")
                
                # Download the file
                urllib.request.urlretrieve(self.AIRPORTS_URL, target_file)
                
                # Process to extract just Kenya airports
                self._extract_kenya_airports(target_file)
                
                # Update refresh timestamp
                self._update_refresh_time(dataset_key)
                
                self.logger.info("Airports data refreshed successfully")
                return True
            except Exception as e:
                self.logger.error(f"Error refreshing airports data: {e}")
                return False
        return False
        
    def _extract_kenya_airports(self, airports_file: str):
        """
        Extract Kenya airports from the global airports file.
        
        Args:
            airports_file: Path to the global airports CSV file
        """
        import csv
        
        kenya_airports = []
        
        # Read the global file
        with open(airports_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row.get('iso_country') == 'KE':  # Kenya
                    kenya_airports.append(row)
        
        # Write Kenya-specific file
        kenya_file = os.path.join(os.path.dirname(airports_file), "kenya_airports.csv")
        if kenya_airports:
            with open(kenya_file, 'w', encoding='utf-8', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=kenya_airports[0].keys())
                writer.writeheader()
                writer.writerows(kenya_airports)
                
            # Also save as JSON for easier use
            kenya_json = os.path.join(os.path.dirname(airports_file), "kenya_airports.json")
            with open(kenya_json, 'w', encoding='utf-8') as f:
                json.dump(kenya_airports, f, indent=2)
                
    def refresh_weather_data(self, year: int):
        """
        Refresh weather data for a specific year.
        
        Args:
            year: Year to download data for
        """
        dataset_key = f"weather_{year}"
        weather_dir = os.path.join(self.data_dir, "weather")
        target_dir = os.path.join(weather_dir, str(year))
        
        # Create year directory if it doesn't exist
        Path(target_dir).mkdir(exist_ok=True)
        
        # Check if refresh needed (using directory modification time)
        if self._needs_refresh(dataset_key):
            try:
                self.logger.info(f"Refreshing weather data for {year}...")
                
                # NOAA GSOD data URL for the year
                year_url = f"{self.WEATHER_BASE_URL}/{year}"
                
                # For free data, we'll just download Kenya station data
                # This requires knowing station IDs, which we can get from a stations list
                # For simplicity, we'll use a few known Kenya weather stations
                kenya_stations = ["637400-99999", "637230-99999", "636860-99999"]  # Example IDs
                
                for station in kenya_stations:
                    station_file = f"{station}.csv"
                    station_url = f"{year_url}/{station_file}"
                    target_file = os.path.join(target_dir, station_file)
                    
                    try:
                        # Download the station data
                        urllib.request.urlretrieve(station_url, target_file)
                        self.logger.info(f"Downloaded weather data for station {station}")
                    except Exception as e:
                        self.logger.warning(f"Could not download station {station}: {e}")
                
                # Update refresh timestamp
                self._update_refresh_time(dataset_key)
                
                self.logger.info(f"Weather data for {year} refreshed successfully")
                return True
            except Exception as e:
                self.logger.error(f"Error refreshing weather data for {year}: {e}")
                return False
        return False
        
    def _needs_refresh(self, dataset_key: str, file_path: Optional[str] = None) -> bool:
        """
        Check if a dataset needs refreshing.
        
        Args:
            dataset_key: Key identifying the dataset
            file_path: Optional file path to check existence
            
        Returns:
            True if refresh is needed, False otherwise
        """
        # If file doesn't exist, definitely need refresh
        if file_path and not os.path.exists(file_path):
            return True
            
        # Check last refresh time
        last_time = self.last_refresh.get(dataset_key, 0)
        time_since_refresh = time.time() - last_time
        
        # Need refresh if interval has passed
        return time_since_refresh >= self.refresh_interval
        
    def _update_refresh_time(self, dataset_key: str):
        """
        Update the last refresh time for a dataset.
        
        Args:
            dataset_key: Key identifying the dataset
        """
        self.last_refresh[dataset_key] = time.time()
        
        # Save refresh times to file
        refresh_file = os.path.join(self.data_dir, "refresh_times.json")
        with open(refresh_file, 'w') as f:
            json.dump(self.last_refresh, f)
            
    def load_refresh_times(self):
        """Load saved refresh times from file."""
        refresh_file = os.path.join(self.data_dir, "refresh_times.json")
        if os.path.exists(refresh_file):
            try:
                with open(refresh_file, 'r') as f:
                    self.last_refresh = json.load(f)
            except Exception as e:
                self.logger.error(f"Error loading refresh times: {e}")
                
    def get_dataset_path(self, dataset_type: str, specific_id: Optional[str] = None) -> str:
        """
        Get the path to a specific dataset.
        
        Args:
            dataset_type: Type of dataset ('osm', 'airports', 'weather')
            specific_id: Specific identifier (e.g., year for weather)
            
        Returns:
            Path to the dataset
        """
        base_path = os.path.join(self.data_dir, dataset_type)
        
        if dataset_type == 'osm':
            return os.path.join(base_path, "kenya-latest.osm.pbf")
        elif dataset_type == 'airports':
            return os.path.join(base_path, "kenya_airports.json")
        elif dataset_type == 'weather' and specific_id:
            # specific_id should be year for weather
            return os.path.join(base_path, specific_id)
        else:
            return base_path
