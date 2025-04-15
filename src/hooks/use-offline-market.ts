import { useState, useEffect } from 'react';
import { OfflineSync } from '@/utils/offlineSync';
import localforage from 'localforage';

interface MarketData {
  id: string;
  name: string;
  type: 'informal' | 'formal';
  location: {
    lat: number;
    lng: number;
  };
  operatingHours: {
    start: number;
    end: number;
  };
  marketDays: number[];
  averageTraffic: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function useOfflineMarket() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'error'>('synced');
  
  const offlineSync = new OfflineSync();

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setIsLoading(true);
      
      // Try to get data from cache first
      const cachedData = await offlineSync.getCachedData('markets');
      if (cachedData) {
        setMarkets(cachedData.data);
      }

      // If online, fetch fresh data
      if (navigator.onLine) {
        const response = await fetch('/api/markets');
        if (response.ok) {
          const freshData = await response.json();
          setMarkets(freshData);
          await offlineSync.cacheData('markets', freshData);
        }
      }
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMarketData = async (marketData: Omit<MarketData, 'id'>) => {
    const newMarket: MarketData = {
      ...marketData,
      id: crypto.randomUUID()
    };

    // Validate market data
    const validation = validateMarketData(newMarket);
    if (!validation.isValid) {
      throw new Error(`Invalid market data: ${validation.errors.join(', ')}`);
    }

    // Add to local state
    setMarkets(prev => [...prev, newMarket]);

    // Queue for sync
    setSyncStatus('pending');
    try {
      await offlineSync.queueChange({
        action: 'create',
        entityType: 'location',
        data: newMarket
      });
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      throw error;
    }
  };

  const updateMarketData = async (id: string, updates: Partial<MarketData>) => {
    const marketIndex = markets.findIndex(m => m.id === id);
    if (marketIndex === -1) {
      throw new Error('Market not found');
    }

    const updatedMarket = {
      ...markets[marketIndex],
      ...updates
    };

    // Validate updates
    const validation = validateMarketData(updatedMarket);
    if (!validation.isValid) {
      throw new Error(`Invalid market data: ${validation.errors.join(', ')}`);
    }

    // Update local state
    const newMarkets = [...markets];
    newMarkets[marketIndex] = updatedMarket;
    setMarkets(newMarkets);

    // Queue for sync
    setSyncStatus('pending');
    try {
      await offlineSync.queueChange({
        action: 'update',
        entityType: 'location',
        data: updatedMarket
      });
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      throw error;
    }
  };

  const validateMarketData = (market: MarketData): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!market.name) errors.push('Market name is required');
    if (!market.location) errors.push('Market location is required');
    if (!market.marketDays || market.marketDays.length === 0) {
      errors.push('At least one market day must be specified');
    }

    // Operating hours validation
    if (market.operatingHours) {
      if (market.operatingHours.start < 0 || market.operatingHours.start > 24) {
        errors.push('Invalid operating start hour');
      }
      if (market.operatingHours.end < 0 || market.operatingHours.end > 24) {
        errors.push('Invalid operating end hour');
      }
      if (market.operatingHours.start >= market.operatingHours.end) {
        errors.push('Operating end time must be after start time');
      }
    }

    // Location bounds check (Kenya)
    if (market.location.lat < -4.8 || market.location.lat > 4.62) {
      errors.push('Location latitude outside Kenya bounds');
    }
    if (market.location.lng < 33.9 || market.location.lng > 41.9) {
      errors.push('Location longitude outside Kenya bounds');
    }

    // Warnings for potential issues
    if (market.marketDays.length > 4) {
      warnings.push('Unusual number of market days (>4)');
    }
    if (market.averageTraffic > 10000) {
      warnings.push('Unusually high average traffic');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  return {
    markets,
    isLoading,
    syncStatus,
    addMarketData,
    updateMarketData,
    validateMarketData,
    refreshData: loadMarketData
  };
}