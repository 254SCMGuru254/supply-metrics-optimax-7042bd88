
import { Vehicle } from '../types';

// Calculate fuel consumption based on distance and vehicle type
export function calculateFuelConsumption(distance: number, vehicle: Vehicle): number {
  const baseFuelConsumption = 10; // liters per 100km
  const capacityFactor = vehicle.capacity / 10; // Adjust based on vehicle capacity in tons
  
  return (distance * (baseFuelConsumption + capacityFactor)) / 100;
}

// Calculate CO2 emissions based on fuel consumption
export function calculateEmissions(fuelConsumption: number): number {
  const emissionsFactor = 2.68; // Average diesel CO2 emission is about 2.68kg per liter
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
