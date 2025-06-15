
export interface OptimizationError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: Record<string, any>;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private errorLog: OptimizationError[] = [];
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  handleOptimizationError(error: any, context?: Record<string, any>): OptimizationError {
    const optimizationError: OptimizationError = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      severity: this.getErrorSeverity(error),
      timestamp: new Date(),
      context
    };

    this.errorLog.push(optimizationError);
    this.logError(optimizationError);
    
    return optimizationError;
  }

  private getErrorCode(error: any): string {
    if (error?.code) return error.code;
    if (error?.response?.status) return `HTTP_${error.response.status}`;
    if (error?.name) return error.name;
    return 'UNKNOWN_ERROR';
  }

  private getErrorMessage(error: any): string {
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    if (typeof error === 'string') return error;
    return 'An unknown error occurred during optimization';
  }

  private getErrorSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    const code = this.getErrorCode(error);
    
    if (code.includes('TIMEOUT') || code.includes('CONNECTION')) return 'high';
    if (code.includes('VALIDATION') || code.includes('INPUT')) return 'medium';
    if (code.includes('HTTP_5')) return 'critical';
    if (code.includes('HTTP_4')) return 'medium';
    
    return 'low';
  }

  private logError(error: OptimizationError): void {
    const logLevel = error.severity === 'critical' ? 'error' : 
                    error.severity === 'high' ? 'warn' : 'info';
    
    console[logLevel](`[OptimizationError] ${error.code}: ${error.message}`, {
      timestamp: error.timestamp,
      context: error.context
    });
  }

  shouldRetry(operationId: string): boolean {
    const attempts = this.retryAttempts.get(operationId) || 0;
    return attempts < this.maxRetries;
  }

  incrementRetry(operationId: string): void {
    const attempts = this.retryAttempts.get(operationId) || 0;
    this.retryAttempts.set(operationId, attempts + 1);
  }

  clearRetries(operationId: string): void {
    this.retryAttempts.delete(operationId);
  }

  getErrorHistory(): OptimizationError[] {
    return [...this.errorLog].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getErrorSummary(): { total: number; bySeverity: Record<string, number> } {
    const bySeverity = this.errorLog.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errorLog.length,
      bySeverity
    };
  }
}
