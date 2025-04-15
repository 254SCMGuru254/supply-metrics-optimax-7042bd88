/**
 * Data compression utilities for offline and low-bandwidth scenarios
 */

import pako from 'pako';

export class DataCompression {
  /**
   * Compress data for storage or transmission
   */
  static compress(data: any): Uint8Array {
    const jsonString = JSON.stringify(data);
    return pako.deflate(jsonString);
  }

  /**
   * Decompress stored/received data
   */
  static decompress(compressedData: Uint8Array): any {
    const decompressed = pako.inflate(compressedData);
    const jsonString = new TextDecoder().decode(decompressed);
    return JSON.parse(jsonString);
  }

  /**
   * Compress market data specifically for rural areas with low bandwidth
   * Optimizes for essential fields only
   */
  static compressMarketData(marketData: any): Uint8Array {
    // Extract only essential fields for offline operation
    const essentialData = {
      id: marketData.id,
      name: marketData.name,
      loc: [marketData.location.lat, marketData.location.lng], // Compress location format
      hrs: [marketData.operatingHours.start, marketData.operatingHours.end], // Compress hours format
      days: marketData.marketDays,
      type: marketData.type === 'informal' ? 'i' : 'f', // Use single character for type
      // Only include averageTraffic if it exists
      ...(marketData.averageTraffic && { t: marketData.averageTraffic })
    };
    
    return this.compress(essentialData);
  }

  /**
   * Decompress market data and restore full format
   */
  static decompressMarketData(compressedData: Uint8Array): any {
    const data = this.decompress(compressedData);
    
    // Restore full format
    return {
      id: data.id,
      name: data.name,
      location: {
        lat: data.loc[0],
        lng: data.loc[1]
      },
      operatingHours: {
        start: data.hrs[0],
        end: data.hrs[1]
      },
      marketDays: data.days,
      type: data.type === 'i' ? 'informal' : 'formal',
      averageTraffic: data.t || 0
    };
  }

  /**
   * Calculate compression ratio for monitoring
   */
  static getCompressionRatio(original: any, compressed: Uint8Array): number {
    const originalSize = new TextEncoder().encode(JSON.stringify(original)).length;
    return compressed.length / originalSize;
  }

  /**
   * Decide whether to use compression based on data size and network conditions
   */
  static shouldCompress(dataSize: number, networkType?: string): boolean {
    // Don't compress small data
    if (dataSize < 1024) return false; // Less than 1KB
    
    // Always compress for slow networks
    if (networkType === '2g' || networkType === 'slow-2g') return true;
    
    // Compress larger data on 3G
    if (networkType === '3g' && dataSize > 10 * 1024) return true; // > 10KB
    
    // Compress very large data on any connection
    if (dataSize > 100 * 1024) return true; // > 100KB
    
    return false;
  }

  /**
   * Get network connection type if available
   */
  static getNetworkType(): string | undefined {
    if ('connection' in navigator) {
      // @ts-ignore: Connection API might not be fully typed
      return navigator.connection?.effectiveType;
    }
    return undefined;
  }
}