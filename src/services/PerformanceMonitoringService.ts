
export interface PerformanceMetrics {
  optimizationTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  algorithmsCompared: number;
  convergenceRate: number;
  solutionQuality: number;
}

export interface PerformanceBenchmark {
  timestamp: Date;
  operationType: string;
  metrics: PerformanceMetrics;
  inputSize: {
    nodes: number;
    vehicles: number;
    constraints: number;
  };
}

export class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private benchmarks: PerformanceBenchmark[] = [];
  private activeTimers: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  startPerformanceTimer(operationId: string): void {
    this.activeTimers.set(operationId, performance.now());
  }

  endPerformanceTimer(operationId: string): number {
    const startTime = this.activeTimers.get(operationId);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.activeTimers.delete(operationId);
    return duration;
  }

  recordOptimizationBenchmark(
    operationType: string,
    metrics: Partial<PerformanceMetrics>,
    inputSize: { nodes: number; vehicles: number; constraints: number }
  ): void {
    const benchmark: PerformanceBenchmark = {
      timestamp: new Date(),
      operationType,
      metrics: {
        optimizationTime: metrics.optimizationTime || 0,
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: 0, // Browser limitation
        networkLatency: metrics.networkLatency || 0,
        algorithmsCompared: metrics.algorithmsCompared || 1,
        convergenceRate: metrics.convergenceRate || 0,
        solutionQuality: metrics.solutionQuality || 0
      },
      inputSize
    };

    this.benchmarks.push(benchmark);
    this.analyzePerfromancePattern(benchmark);
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private analyzePerfromancePattern(newBenchmark: PerformanceBenchmark): void {
    const recentBenchmarks = this.benchmarks
      .filter(b => b.operationType === newBenchmark.operationType)
      .slice(-10);

    if (recentBenchmarks.length >= 3) {
      const avgTime = recentBenchmarks.reduce((sum, b) => sum + b.metrics.optimizationTime, 0) / recentBenchmarks.length;
      
      if (newBenchmark.metrics.optimizationTime > avgTime * 1.5) {
        console.warn(`Performance degradation detected for ${newBenchmark.operationType}:`, {
          currentTime: newBenchmark.metrics.optimizationTime,
          averageTime: avgTime,
          inputSize: newBenchmark.inputSize
        });
      }
    }
  }

  getPerformanceReport(): {
    totalOptimizations: number;
    averageTime: number;
    memoryTrend: number[];
    performanceByComplexity: Record<string, number>;
    recommendations: string[];
  } {
    const optimizations = this.benchmarks.length;
    const avgTime = optimizations > 0 
      ? this.benchmarks.reduce((sum, b) => sum + b.metrics.optimizationTime, 0) / optimizations 
      : 0;

    const memoryTrend = this.benchmarks.slice(-10).map(b => b.metrics.memoryUsage);
    
    const performanceByComplexity = this.calculateComplexityPerformance();
    const recommendations = this.generatePerformanceRecommendations();

    return {
      totalOptimizations: optimizations,
      averageTime: avgTime,
      memoryTrend,
      performanceByComplexity,
      recommendations
    };
  }

  private calculateComplexityPerformance(): Record<string, number> {
    const complexityBuckets: Record<string, number[]> = {};

    this.benchmarks.forEach(benchmark => {
      const complexity = this.categorizeComplexity(benchmark.inputSize);
      if (!complexityBuckets[complexity]) {
        complexityBuckets[complexity] = [];
      }
      complexityBuckets[complexity].push(benchmark.metrics.optimizationTime);
    });

    const result: Record<string, number> = {};
    Object.entries(complexityBuckets).forEach(([complexity, times]) => {
      result[complexity] = times.reduce((sum, time) => sum + time, 0) / times.length;
    });

    return result;
  }

  private categorizeComplexity(inputSize: { nodes: number; vehicles: number; constraints: number }): string {
    const total = inputSize.nodes + inputSize.vehicles + inputSize.constraints;
    
    if (total <= 10) return 'Simple';
    if (total <= 50) return 'Medium';
    if (total <= 100) return 'Complex';
    return 'Very Complex';
  }

  private generatePerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const recent = this.benchmarks.slice(-5);

    if (recent.length === 0) return recommendations;

    const avgMemory = recent.reduce((sum, b) => sum + b.metrics.memoryUsage, 0) / recent.length;
    const avgTime = recent.reduce((sum, b) => sum + b.metrics.optimizationTime, 0) / recent.length;

    if (avgMemory > 100) { // MB
      recommendations.push('High memory usage detected. Consider optimizing data structures or reducing problem size.');
    }

    if (avgTime > 30000) { // 30 seconds
      recommendations.push('Long optimization times detected. Consider using faster algorithms or breaking down the problem.');
    }

    const memoryTrend = recent.map(b => b.metrics.memoryUsage);
    if (memoryTrend.length >= 3) {
      const isIncreasing = memoryTrend.every((mem, i) => i === 0 || mem >= memoryTrend[i - 1]);
      if (isIncreasing) {
        recommendations.push('Memory usage is consistently increasing. Check for memory leaks.');
      }
    }

    return recommendations;
  }

  clearBenchmarks(): void {
    this.benchmarks = [];
  }

  exportPerformanceData(): string {
    return JSON.stringify(this.benchmarks, null, 2);
  }
}
