
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
  timeWindow?: [number, number]; // [earliest, latest] in minutes from start time
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

// Helper function to safely extract lat and lng values from LatLngExpression
function getLatLng(point: LatLngExpression): { lat: number, lng: number } {
  if (Array.isArray(point)) {
    return { lat: point[0], lng: point[1] };
  } else if (typeof point === 'object' && 'lat' in point && 'lng' in point) {
    return { lat: point.lat, lng: point.lng };
  }
  throw new Error('Invalid LatLngExpression format');
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(point1: LatLngExpression, point2: LatLngExpression): number {
  const { lat: lat1, lng: lng1 } = getLatLng(point1);
  const { lat: lat2, lng: lng2 } = getLatLng(point2);
  
  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  // Haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance; // in kilometers
}

// Calculate fuel consumption based on distance and vehicle type
export function calculateFuelConsumption(distance: number, vehicle: Vehicle): number {
  // Simplified model: fuel consumption in liters
  // In a real-world application, this would be more complex and account for:
  // - Vehicle weight
  // - Load weight
  // - Road conditions
  // - Speed
  // - Weather conditions
  
  // Assume an average consumption of 0.1L/km per ton of capacity
  const baseFuelConsumption = 10; // liters per 100km
  const capacityFactor = vehicle.capacity / 10; // Adjust based on vehicle capacity in tons
  
  return (distance * (baseFuelConsumption + capacityFactor)) / 100;
}

// Calculate CO2 emissions based on fuel consumption
export function calculateEmissions(fuelConsumption: number): number {
  // Average diesel CO2 emission is about 2.68kg per liter
  const emissionsFactor = 2.68;
  return fuelConsumption * emissionsFactor;
}

// Calculate the total cost of a route including fixed and variable costs
export function calculateRouteCost(
  distance: number, 
  duration: number, 
  vehicle: Vehicle
): number {
  const distanceCost = distance * vehicle.costPerKm;
  const hourlyOperatingCost = 15; // Assumed hourly operating cost in currency units
  const durationCost = (duration / 60) * hourlyOperatingCost; // duration in minutes
  
  return vehicle.fixedCost + distanceCost + durationCost;
}

// Check if a route complies with tonnage restrictions in certain zones
export function checkTonnageCompliance(
  route: RouteStop[], 
  vehicle: Vehicle, 
  constraints: RouteConstraint
): boolean {
  if (!constraints.tonnageRestriction || constraints.tonnageRestriction.length === 0) {
    return true;
  }
  
  // For each tonnage restriction zone
  for (const zone of constraints.tonnageRestriction) {
    // Check if any stop in the route is within this zone
    for (const stop of route) {
      if (isPointInPolygon(stop.location, zone.zonePolygon) && vehicle.tonnageLimit > zone.maxTonnage) {
        return false;
      }
    }
  }
  
  return true;
}

// Check if a point is inside a polygon using the ray casting algorithm
function isPointInPolygon(point: LatLngExpression, polygon: LatLngExpression[]): boolean {
  const { lat, lng } = getLatLng(point);
  
  let inside = false;
  let j = polygon.length - 1;
  
  for (let i = 0; i < polygon.length; i++) {
    const p1 = getLatLng(polygon[i]);
    const p2 = getLatLng(polygon[j]);
    
    const xi = p1.lat;
    const yi = p1.lng;
    const xj = p2.lat;
    const yj = p2.lng;
    
    const intersect = ((yi > lng) !== (yj > lng)) &&
        (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
        
    if (intersect) inside = !inside;
    j = i;
  }
  
  return inside;
}

// Calculate estimated travel time between two points based on vehicle speed
export function calculateTravelTime(
  distance: number, 
  vehicle: Vehicle
): number {
  // Time in minutes = (distance in km / speed in km/h) * 60
  return (distance / vehicle.speed) * 60;
}

// Simple nearest neighbor route construction heuristic
export function constructRouteNearestNeighbor(
  depot: RouteStop,
  stops: RouteStop[],
  vehicle: Vehicle,
  constraints: RouteConstraint
): RouteResult | null {
  let remainingStops = [...stops];
  let currentStop = depot;
  let route: RouteStop[] = [depot];
  let totalDistance = 0;
  let totalDuration = 0;
  let totalLoad = 0;
  
  while (remainingStops.length > 0) {
    // Find nearest neighbor to current stop
    let nearest: RouteStop | null = null;
    let nearestDistance = Infinity;
    
    for (const stop of remainingStops) {
      const distance = calculateDistance(currentStop.location, stop.location);
      if (distance < nearestDistance) {
        // Check if adding this stop would violate constraints
        const newTotalLoad = totalLoad + stop.demand;
        if (newTotalLoad > vehicle.capacity) {
          continue; // Skip this stop if it exceeds vehicle capacity
        }
        
        const travelTime = calculateTravelTime(distance, vehicle);
        const newTotalDistance = totalDistance + distance;
        const newTotalDuration = totalDuration + travelTime + stop.serviceTime;
        
        if (constraints.maxDistance && newTotalDistance > constraints.maxDistance) {
          continue; // Skip if exceeds max distance
        }
        
        if (constraints.maxDuration && newTotalDuration > constraints.maxDuration) {
          continue; // Skip if exceeds max duration
        }
        
        nearest = stop;
        nearestDistance = distance;
      }
    }
    
    if (!nearest) {
      // Cannot add any more stops due to constraints
      break;
    }
    
    // Add nearest stop to route
    route.push(nearest);
    totalDistance += nearestDistance;
    totalDuration += calculateTravelTime(nearestDistance, vehicle) + nearest.serviceTime;
    totalLoad += nearest.demand;
    currentStop = nearest;
    
    // Remove from remaining stops
    remainingStops = remainingStops.filter(stop => stop.id !== nearest!.id);
  }
  
  // Add return to depot
  const returnDistance = calculateDistance(currentStop.location, depot.location);
  totalDistance += returnDistance;
  totalDuration += calculateTravelTime(returnDistance, vehicle);
  
  // Calculate route costs and emissions
  const fuelConsumption = calculateFuelConsumption(totalDistance, vehicle);
  const emissions = calculateEmissions(fuelConsumption);
  const cost = calculateRouteCost(totalDistance, totalDuration, vehicle);
  
  if (route.length <= 1) {
    // Only depot in route, no stops served
    return null;
  }
  
  return {
    vehicleId: vehicle.id,
    stops: route,
    distance: totalDistance,
    duration: totalDuration,
    cost,
    fuelConsumption,
    emissions,
    load: totalLoad
  };
}

// Run multi-vehicle route optimization
export function optimizeRoutes(
  depot: RouteStop,
  stops: RouteStop[],
  vehicles: Vehicle[],
  constraints: RouteConstraint
): RouteOptimizationResult {
  const routes: RouteResult[] = [];
  let unservedStops = [...stops];
  let totalDistance = 0;
  let totalDuration = 0;
  let totalCost = 0;
  let totalEmissions = 0;
  
  // Sort vehicles by capacity (descending)
  const sortedVehicles = [...vehicles].sort((a, b) => b.capacity - a.capacity);
  
  // Try to create route for each vehicle
  for (const vehicle of sortedVehicles) {
    if (unservedStops.length === 0) break;
    
    const routeResult = constructRouteNearestNeighbor(depot, unservedStops, vehicle, constraints);
    
    if (routeResult) {
      routes.push(routeResult);
      totalDistance += routeResult.distance;
      totalDuration += routeResult.duration;
      totalCost += routeResult.cost;
      totalEmissions += routeResult.emissions;
      
      // Remove served stops
      const servedStopIds = new Set(routeResult.stops.map(stop => stop.id));
      unservedStops = unservedStops.filter(stop => !servedStopIds.has(stop.id));
    }
  }
  
  return {
    routes,
    totalDistance,
    totalDuration,
    totalCost,
    totalEmissions,
    unservedStops
  };
}
