
import { RouteStop, Vehicle, RouteConstraint, RouteResult } from '../types';
import { calculateDistance } from './distance-utils';
import { calculateTravelTime } from './constraint-utils';
import { calculateFuelConsumption, calculateEmissions, calculateRouteCost } from './cost-utils';

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
    let nearest: RouteStop | null = null;
    let nearestDistance = Infinity;
    
    for (const stop of remainingStops) {
      const distance = calculateDistance(currentStop.location, stop.location);
      if (distance < nearestDistance) {
        const newTotalLoad = totalLoad + stop.demand;
        if (newTotalLoad > vehicle.capacity) continue;
        
        const travelTime = calculateTravelTime(distance, vehicle);
        const newTotalDistance = totalDistance + distance;
        const newTotalDuration = totalDuration + travelTime + stop.serviceTime;
        
        if (constraints.maxDistance && newTotalDistance > constraints.maxDistance) continue;
        if (constraints.maxDuration && newTotalDuration > constraints.maxDuration) continue;
        
        nearest = stop;
        nearestDistance = distance;
      }
    }
    
    if (!nearest) break;
    
    route.push(nearest);
    totalDistance += nearestDistance;
    totalDuration += calculateTravelTime(nearestDistance, vehicle) + nearest.serviceTime;
    totalLoad += nearest.demand;
    currentStop = nearest;
    
    remainingStops = remainingStops.filter(stop => stop.id !== nearest!.id);
  }
  
  const returnDistance = calculateDistance(currentStop.location, depot.location);
  totalDistance += returnDistance;
  totalDuration += calculateTravelTime(returnDistance, vehicle);
  
  if (route.length <= 1) return null;
  
  const fuelConsumption = calculateFuelConsumption(totalDistance, vehicle);
  const emissions = calculateEmissions(fuelConsumption);
  const cost = calculateRouteCost(totalDistance, totalDuration, vehicle);
  
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
