
import localforage from 'localforage';
import { get } from 'idb-keyval';

// Configure offline storage
localforage.config({
  name: 'supply-metrics-optimax',
  storeName: 'offline_data'
});

interface SyncQueue {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'route' | 'inventory' | 'location' | 'data_collection' | 'market';
  data: any;
  timestamp: number;
}

export class OfflineSync {
  private syncQueue: SyncQueue[] = [];
  
  constructor() {
    this.initializeQueue();
    this.setupSyncListener();
  }

  private async initializeQueue() {
    // Load pending sync items from IndexedDB
    const savedQueue = await localforage.getItem<SyncQueue[]>('syncQueue');
    if (savedQueue) {
      this.syncQueue = savedQueue;
    }
  }

  private setupSyncListener() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.processSyncQueue());
    window.addEventListener('offline', () => {
      console.log('App is offline. Changes will be queued for sync.');
    });
  }

  async queueChange(change: Omit<SyncQueue, 'id' | 'timestamp'>) {
    const syncItem: SyncQueue = {
      ...change,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.syncQueue.push(syncItem);
    await this.saveQueue();

    if (navigator.onLine) {
      await this.processSyncQueue();
    }
  }

  private async processSyncQueue() {
    if (!navigator.onLine) return;

    const queue = [...this.syncQueue];
    for (const item of queue) {
      try {
        await this.syncItem(item);
        // Remove successfully synced item
        this.syncQueue = this.syncQueue.filter(i => i.id !== item.id);
        await this.saveQueue();
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
      }
    }
  }

  private async syncItem(item: SyncQueue) {
    const apiEndpoint = this.getEndpointForEntity(item.entityType);
    const response = await fetch(apiEndpoint, {
      method: this.getMethodForAction(item.action),
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item.data)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }

  private getEndpointForEntity(entityType: string): string {
    const baseUrl = '/api';
    switch (entityType) {
      case 'route':
        return `${baseUrl}/routes`;
      case 'inventory':
        return `${baseUrl}/inventory`;
      case 'location':
        return `${baseUrl}/locations`;
      case 'data_collection':
        return `${baseUrl}/data-collection`;
      case 'market':
        return `${baseUrl}/markets`;
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  private getMethodForAction(action: string): string {
    switch (action) {
      case 'create':
        return 'POST';
      case 'update':
        return 'PUT';
      case 'delete':
        return 'DELETE';
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async saveQueue() {
    await localforage.setItem('syncQueue', this.syncQueue);
  }

  // Cache management for offline data
  async cacheData(key: string, data: any) {
    await localforage.setItem(key, {
      data,
      timestamp: Date.now()
    });
  }

  async getCachedData(key: string) {
    return await localforage.getItem(key);
  }

  async clearCache() {
    await localforage.clear();
    this.syncQueue = [];
  }
}
