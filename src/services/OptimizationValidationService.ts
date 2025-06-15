import type { Node, Route } from "@/components/map/MapTypes";
import { Vehicle } from "@/components/route-optimization/VehicleFleetConfig";

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  code: string;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export class OptimizationValidationService {
  private static instance: OptimizationValidationService;

  static getInstance(): OptimizationValidationService {
    if (!OptimizationValidationService.instance) {
      OptimizationValidationService.instance = new OptimizationValidationService();
    }
    return OptimizationValidationService.instance;
  }

  validateOptimizationInput(
    nodes: Node[],
    routes: Route[],
    vehicles: Vehicle[],
    constraints: any
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Validate nodes
    const nodeValidation = this.validateNodes(nodes);
    errors.push(...nodeValidation.errors);
    warnings.push(...nodeValidation.warnings);

    // Validate vehicles
    const vehicleValidation = this.validateVehicles(vehicles);
    errors.push(...vehicleValidation.errors);
    warnings.push(...vehicleValidation.warnings);

    // Validate routes
    const routeValidation = this.validateRoutes(routes, nodes);
    errors.push(...routeValidation.errors);
    warnings.push(...routeValidation.warnings);

    // Validate constraints
    const constraintValidation = this.validateConstraints(constraints);
    errors.push(...constraintValidation.errors);
    warnings.push(...constraintValidation.warnings);

    // Generate suggestions
    suggestions.push(...this.generateSuggestions(nodes, vehicles, constraints));

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private validateNodes(nodes: Node[]): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (nodes.length === 0) {
      errors.push({
        code: 'NO_NODES',
        message: 'At least one node is required for optimization',
        severity: 'error'
      });
      return { errors, warnings };
    }

    if (nodes.length < 3) {
      warnings.push({
        code: 'FEW_NODES',
        message: 'Optimization with less than 3 nodes may not be meaningful',
        impact: 'medium'
      });
    }

    // Check for depot/warehouse
    const depots = nodes.filter(n => n.type === 'warehouse' || n.type === 'distribution' || n.type === 'factory');
    if (depots.length === 0) {
      errors.push({
        code: 'NO_DEPOT',
        message: 'At least one warehouse, distribution center, or factory is required',
        severity: 'error'
      });
    }

    // Validate coordinates
    nodes.forEach((node, index) => {
      if (!this.isValidCoordinate(node.latitude, node.longitude)) {
        errors.push({
          code: 'INVALID_COORDINATES',
          message: `Node ${node.name} has invalid coordinates`,
          field: `nodes[${index}]`,
          severity: 'error'
        });
      }
    });

    // Check for duplicate nodes
    const coordinates = nodes.map(n => `${n.latitude},${n.longitude}`);
    const duplicates = coordinates.filter((coord, index) => coordinates.indexOf(coord) !== index);
    if (duplicates.length > 0) {
      warnings.push({
        code: 'DUPLICATE_LOCATIONS',
        message: 'Some nodes have identical coordinates',
        impact: 'low'
      });
    }

    return { errors, warnings };
  }

  private validateVehicles(vehicles: Vehicle[]): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (vehicles.length === 0) {
      errors.push({
        code: 'NO_VEHICLES',
        message: 'At least one vehicle is required for route optimization',
        severity: 'error'
      });
      return { errors, warnings };
    }

    vehicles.forEach((vehicle, index) => {
      if (vehicle.capacity <= 0) {
        errors.push({
          code: 'INVALID_CAPACITY',
          message: `Vehicle ${vehicle.name} has invalid capacity`,
          field: `vehicles[${index}].capacity`,
          severity: 'error'
        });
      }

      if (vehicle.costPerKm < 0) {
        errors.push({
          code: 'INVALID_COST',
          message: `Vehicle ${vehicle.name} has negative cost per km`,
          field: `vehicles[${index}].costPerKm`,
          severity: 'error'
        });
      }

      if (vehicle.fuelEfficiency && vehicle.fuelEfficiency <= 0) {
        warnings.push({
          code: 'POOR_FUEL_EFFICIENCY',
          message: `Vehicle ${vehicle.name} has poor fuel efficiency`,
          impact: 'medium'
        });
      }
    });

    return { errors, warnings };
  }

  private validateRoutes(routes: Route[], nodes: Node[]): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const nodeIds = new Set(nodes.map(n => n.id));

    routes.forEach((route, index) => {
      if (!nodeIds.has(route.from)) {
        errors.push({
          code: 'INVALID_ROUTE_FROM',
          message: `Route ${route.id} references non-existent 'from' node`,
          field: `routes[${index}].from`,
          severity: 'error'
        });
      }

      if (!nodeIds.has(route.to)) {
        errors.push({
          code: 'INVALID_ROUTE_TO',
          message: `Route ${route.id} references non-existent 'to' node`,
          field: `routes[${index}].to`,
          severity: 'error'
        });
      }

      if (route.cost < 0) {
        errors.push({
          code: 'NEGATIVE_COST',
          message: `Route ${route.id} has negative cost`,
          field: `routes[${index}].cost`,
          severity: 'error'
        });
      }

      if (route.transitTime < 0) {
        errors.push({
          code: 'NEGATIVE_TIME',
          message: `Route ${route.id} has negative transit time`,
          field: `routes[${index}].transitTime`,
          severity: 'error'
        });
      }
    });

    return { errors, warnings };
  }

  private validateConstraints(constraints: any): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (constraints.maxDistance && constraints.maxDistance <= 0) {
      errors.push({
        code: 'INVALID_MAX_DISTANCE',
        message: 'Maximum distance must be positive',
        field: 'constraints.maxDistance',
        severity: 'error'
      });
    }

    if (constraints.maxDuration && constraints.maxDuration <= 0) {
      errors.push({
        code: 'INVALID_MAX_DURATION',
        message: 'Maximum duration must be positive',
        field: 'constraints.maxDuration',
        severity: 'error'
      });
    }

    if (constraints.maxDistance && constraints.maxDistance < 50) {
      warnings.push({
        code: 'LOW_MAX_DISTANCE',
        message: 'Very low maximum distance may result in no feasible routes',
        impact: 'high'
      });
    }

    return { errors, warnings };
  }

  private generateSuggestions(nodes: Node[], vehicles: Vehicle[], constraints: any): string[] {
    const suggestions: string[] = [];

    // Node-based suggestions
    if (nodes.length > 50) {
      suggestions.push('Consider using hierarchical optimization for large networks (50+ nodes)');
    }

    // Vehicle-based suggestions
    if (vehicles.length === 1) {
      suggestions.push('Adding multiple vehicle types can improve optimization results');
    }

    const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacity, 0);
    const totalDemand = nodes.reduce((sum, n) => sum + (n.metadata?.demand || 0), 0);
    
    if (totalCapacity < totalDemand * 1.2) {
      suggestions.push('Vehicle capacity is close to total demand. Consider adding buffer capacity');
    }

    // Constraint-based suggestions
    if (!constraints.timeWindows) {
      suggestions.push('Enabling time windows can improve service quality');
    }

    if (!constraints.capacityConstraints) {
      suggestions.push('Enabling capacity constraints ensures realistic solutions');
    }

    return suggestions;
  }

  private isValidCoordinate(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  validateBusinessConstraints(
    totalCost: number,
    serviceLevel: number,
    businessRules: any
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    if (businessRules.maxBudget && totalCost > businessRules.maxBudget) {
      errors.push({
        code: 'BUDGET_EXCEEDED',
        message: `Total cost (${totalCost}) exceeds budget (${businessRules.maxBudget})`,
        severity: 'error'
      });
    }

    if (businessRules.minServiceLevel && serviceLevel < businessRules.minServiceLevel) {
      errors.push({
        code: 'SERVICE_LEVEL_TOO_LOW',
        message: `Service level (${serviceLevel}%) below minimum required (${businessRules.minServiceLevel}%)`,
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }
}
