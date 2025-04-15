
import { LatLngExpression } from 'leaflet';

// Helper function to safely extract lat and lng values from LatLngExpression
export function getLatLng(point: LatLngExpression): { lat: number, lng: number } {
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
