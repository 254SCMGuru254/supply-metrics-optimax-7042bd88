
import { LatLngExpression } from 'leaflet';

export interface Vehicle {
  id: string;
  name: string;
  capacity: number;
  costPerKm: number;
  fixedCost: number;
  speed: number;
  emissions: number;
  maxDistance: number;
  tonnageLimit: number;
}

export interface RouteStop {
  id: string;
  name: string;
  location: LatLngExpression;
  demand: number;
  serviceTime: number;
  timeWindow?: [number, number];
}

export interface RouteConstraint {
  maxDistance?: number;
  maxDuration?: number;
  maxStops?: number;
  requiredStops?: string[];
  avoidZones?: LatLngExpression[][];
  tonnageRestriction?: {
    zonePolygon: LatLngExpression[];
    maxTonnage: number;
  }[];
  emissionZones?: {
    zonePolygon: LatLngExpression[];
    maxEmissions: number;
  }[];
}

export interface RouteResult {
  vehicleId: string;
  stops: RouteStop[];
  distance: number;
  duration: number;
  cost: number;
  fuelConsumption: number;
  emissions: number;
  load: number;
}

export interface RouteOptimizationResult {
  routes: RouteResult[];
  totalDistance: number;
  totalDuration: number;
  totalCost: number;
  totalEmissions: number;
  unservedStops: RouteStop[];
}
