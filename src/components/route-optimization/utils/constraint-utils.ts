
import { LatLngExpression } from 'leaflet';
import { RouteStop, Vehicle, RouteConstraint } from '../types';
import { getLatLng } from './distance-utils';

// Check if a point is inside a polygon using the ray casting algorithm
export function isPointInPolygon(point: LatLngExpression, polygon: LatLngExpression[]): boolean {
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

// Check if a route complies with tonnage restrictions in certain zones
export function checkTonnageCompliance(
  route: RouteStop[], 
  vehicle: Vehicle, 
  constraints: RouteConstraint
): boolean {
  if (!constraints.tonnageRestriction || constraints.tonnageRestriction.length === 0) {
    return true;
  }
  
  for (const zone of constraints.tonnageRestriction) {
    for (const stop of route) {
      if (isPointInPolygon(stop.location, zone.zonePolygon) && vehicle.tonnageLimit > zone.maxTonnage) {
        return false;
      }
    }
  }
  
  return true;
}

// Calculate estimated travel time between two points based on vehicle speed
export function calculateTravelTime(
  distance: number, 
  vehicle: Vehicle
): number {
  return (distance / vehicle.speed) * 60;
}
