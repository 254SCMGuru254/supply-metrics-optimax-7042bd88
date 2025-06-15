
import { supabase } from '@/integrations/supabase/client';

export interface OptimizationProgress {
  id: string;
  projectId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  stage: string;
  startTime: Date;
  estimatedCompletion?: Date;
  currentMetrics?: {
    nodesProcessed: number;
    totalNodes: number;
    routesEvaluated: number;
    bestCostFound: number;
    convergenceRate: number;
  };
}

export class OptimizationMonitoringService {
  private static instance: OptimizationMonitoringService;
  private progressCallbacks: Map<string, (progress: OptimizationProgress) => void> = new Map();
  private activeOptimizations: Map<string, OptimizationProgress> = new Map();

  static getInstance(): OptimizationMonitoringService {
    if (!OptimizationMonitoringService.instance) {
      OptimizationMonitoringService.instance = new OptimizationMonitoringService();
    }
    return OptimizationMonitoringService.instance;
  }

  startOptimization(id: string, projectId: string): void {
    const progress: OptimizationProgress = {
      id,
      projectId,
      status: 'queued',
      progress: 0,
      stage: 'Initializing optimization engine',
      startTime: new Date()
    };

    this.activeOptimizations.set(id, progress);
    this.notifyProgress(id, progress);
  }

  updateProgress(
    id: string, 
    updates: Partial<OptimizationProgress>
  ): void {
    const current = this.activeOptimizations.get(id);
    if (!current) return;

    const updated = { ...current, ...updates };
    
    // Calculate estimated completion time
    if (updated.progress > 0 && updated.status === 'running') {
      const elapsed = Date.now() - current.startTime.getTime();
      const estimatedTotal = (elapsed / updated.progress) * 100;
      updated.estimatedCompletion = new Date(current.startTime.getTime() + estimatedTotal);
    }

    this.activeOptimizations.set(id, updated);
    this.notifyProgress(id, updated);
  }

  subscribeToProgress(id: string, callback: (progress: OptimizationProgress) => void): void {
    this.progressCallbacks.set(id, callback);
  }

  unsubscribeFromProgress(id: string): void {
    this.progressCallbacks.delete(id);
  }

  private notifyProgress(id: string, progress: OptimizationProgress): void {
    const callback = this.progressCallbacks.get(id);
    if (callback) {
      callback(progress);
    }
  }

  completeOptimization(id: string, success: boolean, finalMetrics?: any): void {
    const current = this.activeOptimizations.get(id);
    if (!current) return;

    const completed: OptimizationProgress = {
      ...current,
      status: success ? 'completed' : 'failed',
      progress: 100,
      stage: success ? 'Optimization completed successfully' : 'Optimization failed',
      currentMetrics: finalMetrics
    };

    this.activeOptimizations.set(id, completed);
    this.notifyProgress(id, completed);

    // Store results in database for historical tracking
    this.storeOptimizationResult(completed);
  }

  cancelOptimization(id: string): void {
    const current = this.activeOptimizations.get(id);
    if (!current) return;

    const cancelled = {
      ...current,
      status: 'cancelled' as const,
      stage: 'Optimization cancelled by user'
    };

    this.activeOptimizations.set(id, cancelled);
    this.notifyProgress(id, cancelled);
  }

  private async storeOptimizationResult(progress: OptimizationProgress): Promise<void> {
    try {
      await supabase.from('optimization_history').insert({
        optimization_id: progress.id,
        project_id: progress.projectId,
        status: progress.status,
        start_time: progress.startTime.toISOString(),
        completion_time: new Date().toISOString(),
        final_metrics: progress.currentMetrics,
        stage: progress.stage
      });
    } catch (error) {
      console.error('Failed to store optimization result:', error);
    }
  }

  getActiveOptimizations(): OptimizationProgress[] {
    return Array.from(this.activeOptimizations.values())
      .filter(opt => opt.status === 'running' || opt.status === 'queued');
  }

  getOptimizationStatus(id: string): OptimizationProgress | null {
    return this.activeOptimizations.get(id) || null;
  }
}
