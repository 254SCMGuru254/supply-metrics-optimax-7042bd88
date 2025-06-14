
import { supabase } from '@/integrations/supabase/client';

export interface OptimizationRequest {
  projectId: string;
  optimizationType: 'route' | 'facility' | 'inventory' | 'network' | 'cog' | 'simulation';
  parameters: Record<string, any>;
  constraints?: Record<string, any>;
  realTime?: boolean;
}

export interface OptimizationResponse {
  success: boolean;
  results: any;
  executionTime: number;
  costSavings?: number;
  recommendations?: string[];
  resultId?: string;
}

export class OptimizationService {
  private static instance: OptimizationService;
  private wsConnection: WebSocket | null = null;
  private listeners: Map<string, (data: any) => void> = new Map();

  static getInstance(): OptimizationService {
    if (!OptimizationService.instance) {
      OptimizationService.instance = new OptimizationService();
    }
    return OptimizationService.instance;
  }

  async optimize(request: OptimizationRequest): Promise<OptimizationResponse> {
    try {
      const startTime = Date.now();

      // Call the optimization engine
      const { data, error } = await supabase.functions.invoke('optimization-engine', {
        body: request
      });

      if (error) throw error;

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        results: data.results,
        executionTime,
        costSavings: data.results.costSavings,
        recommendations: this.generateRecommendations(data.results),
        resultId: data.resultId
      };

    } catch (error) {
      console.error('Optimization error:', error);
      return {
        success: false,
        results: null,
        executionTime: 0,
        recommendations: ['Optimization failed. Please check your data and try again.']
      };
    }
  }

  async optimizeRoute(projectId: string, parameters: any): Promise<OptimizationResponse> {
    return this.optimize({
      projectId,
      optimizationType: 'route',
      parameters: {
        algorithm: parameters.algorithm || 'nearest_neighbor',
        vehicleCapacity: parameters.vehicleCapacity || 1000,
        maxDistance: parameters.maxDistance || 500,
        timeWindows: parameters.timeWindows || false,
        costPerKm: parameters.costPerKm || 1,
        ...parameters
      }
    });
  }

  async optimizeFacilityLocation(projectId: string, parameters: any): Promise<OptimizationResponse> {
    return this.optimize({
      projectId,
      optimizationType: 'facility',
      parameters: {
        maxFacilities: parameters.maxFacilities || 5,
        fixedCosts: parameters.fixedCosts || true,
        capacityConstraints: parameters.capacityConstraints || false,
        serviceLevel: parameters.serviceLevel || 95,
        ...parameters
      }
    });
  }

  async optimizeInventory(projectId: string, parameters: any): Promise<OptimizationResponse> {
    return this.optimize({
      projectId,
      optimizationType: 'inventory',
      parameters: {
        serviceLevel: parameters.serviceLevel || 95,
        leadTime: parameters.leadTime || 7,
        holdingCostRate: parameters.holdingCostRate || 0.25,
        orderingCost: parameters.orderingCost || 100,
        demandVariability: parameters.demandVariability || 0.2,
        ...parameters
      }
    });
  }

  async optimizeNetwork(projectId: string, parameters: any): Promise<OptimizationResponse> {
    return this.optimize({
      projectId,
      optimizationType: 'network',
      parameters: {
        multiEchelon: parameters.multiEchelon || false,
        transportationModes: parameters.transportationModes || ['road'],
        sustainabilityWeights: parameters.sustainabilityWeights || 0.1,
        riskFactors: parameters.riskFactors || 0.05,
        ...parameters
      }
    });
  }

  connectRealTime(projectId: string, callback: (data: any) => void): void {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.close();
    }

    // Note: This would connect to a WebSocket endpoint for real-time updates
    // For now, we'll simulate with Supabase realtime
    const channel = supabase
      .channel(`optimization_${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'optimization_results',
        filter: `project_id=eq.${projectId}`
      }, callback)
      .subscribe();

    this.listeners.set(projectId, callback);
  }

  disconnectRealTime(projectId: string): void {
    if (this.listeners.has(projectId)) {
      this.listeners.delete(projectId);
    }
  }

  private generateRecommendations(results: any): string[] {
    const recommendations: string[] = [];

    if (results.costSavings > 20) {
      recommendations.push('Excellent optimization results! Consider implementing these changes immediately.');
    } else if (results.costSavings > 10) {
      recommendations.push('Good optimization potential. Review the proposed changes for implementation.');
    } else {
      recommendations.push('Limited optimization gains. Consider adjusting parameters or constraints.');
    }

    if (results.efficiency && results.efficiency < 80) {
      recommendations.push('Route efficiency is below optimal. Consider adding more stops or adjusting vehicle capacity.');
    }

    if (results.serviceLevel && results.serviceLevel < 95) {
      recommendations.push('Service level is below target. Consider increasing safety stock or reducing lead times.');
    }

    if (results.utilizationRate && results.utilizationRate < 85) {
      recommendations.push('Resource utilization is low. Consider consolidating facilities or routes.');
    }

    return recommendations;
  }

  async getOptimizationHistory(projectId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('optimization_results')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching optimization history:', error);
      return [];
    }

    return data || [];
  }

  async compareOptimizations(resultIds: string[]): Promise<any> {
    const { data, error } = await supabase
      .from('optimization_results')
      .select('*')
      .in('id', resultIds);

    if (error) {
      console.error('Error comparing optimizations:', error);
      return null;
    }

    return {
      results: data,
      comparison: this.analyzeComparison(data || [])
    };
  }

  private analyzeComparison(results: any[]): any {
    if (results.length < 2) return null;

    const metrics = results.map(r => ({
      id: r.id,
      cost: r.results.totalCost || 0,
      savings: r.cost_savings_percentage || 0,
      efficiency: r.results.efficiency || 0,
      created_at: r.created_at
    }));

    return {
      bestCost: metrics.reduce((min, current) => current.cost < min.cost ? current : min),
      bestSavings: metrics.reduce((max, current) => current.savings > max.savings ? current : max),
      bestEfficiency: metrics.reduce((max, current) => current.efficiency > max.efficiency ? current : max),
      trends: this.calculateTrends(metrics)
    };
  }

  private calculateTrends(metrics: any[]): any {
    const sorted = metrics.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    return {
      costTrend: this.calculateTrend(sorted.map(m => m.cost)),
      savingsTrend: this.calculateTrend(sorted.map(m => m.savings)),
      efficiencyTrend: this.calculateTrend(sorted.map(m => m.efficiency))
    };
  }

  private calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const recent = values.slice(-3);
    const earlier = values.slice(0, -3);
    
    if (recent.length === 0 || earlier.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, val) => sum + val, 0) / earlier.length;
    
    const change = (recentAvg - earlierAvg) / earlierAvg;
    
    if (Math.abs(change) < 0.05) return 'stable';
    return change > 0 ? 'improving' : 'declining';
  }
}

export const optimizationService = OptimizationService.getInstance();
