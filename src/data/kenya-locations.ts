// Kenya's major cities, distribution centers, markets, and transportation hubs
// All coordinates are in latitude/longitude format

export interface KenyaLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'market' | 'distribution' | 'airport' | 'farm_collection' | 'port' | 'border';
  region: string;
  description?: string;
  capacity?: number;
}

// Major Cities
export const kenyaCities: KenyaLocation[] = [
  { id: 'nairobi', name: 'Nairobi', latitude: -1.2921, longitude: 36.8219, type: 'city', region: 'Nairobi', description: 'Capital city and major economic hub' },
  { id: 'mombasa', name: 'Mombasa', latitude: -4.0435, longitude: 39.6682, type: 'city', region: 'Coast', description: 'Major port city' },
  { id: 'kisumu', name: 'Kisumu', latitude: -0.1022, longitude: 34.7617, type: 'city', region: 'Nyanza', description: 'Major city on Lake Victoria' },
  { id: 'nakuru', name: 'Nakuru', latitude: -0.3031, longitude: 36.0800, type: 'city', region: 'Rift Valley', description: 'Fourth-largest urban center' },
  { id: 'eldoret', name: 'Eldoret', latitude: 0.5143, longitude: 35.2698, type: 'city', region: 'Rift Valley', description: 'Major agricultural hub' },
  { id: 'kisii', name: 'Kisii', latitude: -0.6698, longitude: 34.7675, type: 'city', region: 'Nyanza', description: 'Agricultural trade center' },
  { id: 'nyeri', name: 'Nyeri', latitude: -0.4246, longitude: 36.9517, type: 'city', region: 'Central', description: 'Gateway to Mount Kenya' },
  { id: 'machakos', name: 'Machakos', latitude: -1.5176, longitude: 37.2636, type: 'city', region: 'Eastern', description: 'Historical town and commercial center' },
  { id: 'garissa', name: 'Garissa', latitude: -0.4530, longitude: 39.6458, type: 'city', region: 'North Eastern', description: 'Regional capital in northeastern Kenya' },
  { id: 'kakamega', name: 'Kakamega', latitude: 0.2827, longitude: 34.7519, type: 'city', region: 'Western', description: 'Major urban center in western Kenya' },
  { id: 'kitale', name: 'Kitale', latitude: 1.0167, longitude: 35.0024, type: 'city', region: 'Rift Valley', description: 'Agricultural town in Trans-Nzoia' },
  { id: 'kericho', name: 'Kericho', latitude: -0.3677, longitude: 35.2831, type: 'city', region: 'Rift Valley', description: 'Center of Kenya\'s tea industry' },
  { id: 'makueni', name: 'Makueni', latitude: -1.8044, longitude: 37.6225, type: 'city', region: 'Eastern', description: 'County headquarters in Eastern Kenya' }
];

// Major Markets
export const kenyaMarkets: KenyaLocation[] = [
  { id: 'wakulima', name: 'Wakulima Market', latitude: -1.2863, longitude: 36.8304, type: 'market', region: 'Nairobi', description: 'Largest fresh produce market in Nairobi' },
  { id: 'kongowea', name: 'Kongowea Market', latitude: -4.0383, longitude: 39.6736, type: 'market', region: 'Mombasa', description: 'Largest wholesale market in Mombasa' },
  { id: 'kibuye', name: 'Kibuye Market', latitude: -0.1106, longitude: 34.7488, type: 'market', region: 'Kisumu', description: 'Major market in Kisumu' },
  { id: 'karatina', name: 'Karatina Market', latitude: -0.4799, longitude: 37.1252, type: 'market', region: 'Central', description: 'One of the largest open-air markets in East Africa' },
  { id: 'gikomba', name: 'Gikomba Market', latitude: -1.2845, longitude: 36.8445, type: 'market', region: 'Nairobi', description: 'Largest second-hand clothes market in East Africa' },
  { id: 'eldoret_market', name: 'Eldoret Municipal Market', latitude: 0.5120, longitude: 35.2748, type: 'market', region: 'Rift Valley', description: 'Main produce market in Eldoret' },
  { id: 'nakuru_market', name: 'Nakuru Wholesale Market', latitude: -0.2869, longitude: 36.0667, type: 'market', region: 'Rift Valley', description: 'Large wholesale market in Nakuru' },
  { id: 'kitale_market', name: 'Kitale Municipal Market', latitude: 1.0154, longitude: 35.0075, type: 'market', region: 'Rift Valley', description: 'Agricultural produce market in Kitale' },
  { id: 'kisii_market', name: 'Kisii Municipal Market', latitude: -0.6732, longitude: 34.7707, type: 'market', region: 'Nyanza', description: 'Main market in Kisii town' },
  { id: 'makueni_market', name: 'Makueni Market', latitude: -1.8025, longitude: 37.6246, type: 'market', region: 'Eastern', description: 'Local produce market' }
];

// Distribution Centers
export const kenyaDistributionCenters: KenyaLocation[] = [
  { id: 'nairobi_dc', name: 'Nairobi Distribution Center', latitude: -1.3236, longitude: 36.8919, type: 'distribution', region: 'Nairobi', description: 'Main distribution hub for central Kenya', capacity: 5000 },
  { id: 'mombasa_dc', name: 'Mombasa Distribution Center', latitude: -4.0435, longitude: 39.6682, type: 'distribution', region: 'Coast', description: 'Port-adjacent distribution center', capacity: 4500 },
  { id: 'kisumu_dc', name: 'Kisumu Distribution Center', latitude: -0.0917, longitude: 34.7680, type: 'distribution', region: 'Nyanza', description: 'Western Kenya distribution hub', capacity: 3000 },
  { id: 'nakuru_dc', name: 'Nakuru Distribution Center', latitude: -0.3031, longitude: 36.0800, type: 'distribution', region: 'Rift Valley', description: 'Central distribution point for Rift Valley', capacity: 2500 },
  { id: 'eldoret_dc', name: 'Eldoret Distribution Center', latitude: 0.5143, longitude: 35.2698, type: 'distribution', region: 'Rift Valley', description: 'North Rift distribution hub', capacity: 2000 },
  { id: 'thika_dc', name: 'Thika Distribution Center', latitude: -1.0396, longitude: 37.0900, type: 'distribution', region: 'Central', description: 'Industrial area distribution center', capacity: 2200 },
  { id: 'machakos_dc', name: 'Machakos Distribution Center', latitude: -1.5176, longitude: 37.2636, type: 'distribution', region: 'Eastern', description: 'Eastern region distribution point', capacity: 1800 },
  { id: 'voi_dc', name: 'Voi Distribution Center', latitude: -3.3945, longitude: 38.5665, type: 'distribution', region: 'Coast', description: 'Connecting distribution center between Mombasa and Nairobi', capacity: 1500 }
];

// Airports
export const kenyaAirports: KenyaLocation[] = [
  { id: 'jkia', name: 'Jomo Kenyatta International Airport', latitude: -1.3192, longitude: 36.9277, type: 'airport', region: 'Nairobi', description: 'Kenya\'s largest international airport' },
  { id: 'moi_airport', name: 'Moi International Airport', latitude: -4.0343, longitude: 39.5942, type: 'airport', region: 'Mombasa', description: 'Second-largest international airport' },
  { id: 'kisumu_airport', name: 'Kisumu International Airport', latitude: -0.0862, longitude: 34.7295, type: 'airport', region: 'Nyanza', description: 'Western Kenya\'s international airport' },
  { id: 'eldoret_airport', name: 'Eldoret International Airport', latitude: 0.4047, longitude: 35.2390, type: 'airport', region: 'Rift Valley', description: 'North Rift\'s cargo airport' },
  { id: 'malindi_airport', name: 'Malindi Airport', latitude: -3.2293, longitude: 40.1019, type: 'airport', region: 'Coast', description: 'Coastal tourism airport' },
  { id: 'wilson_airport', name: 'Wilson Airport', latitude: -1.3272, longitude: 36.8147, type: 'airport', region: 'Nairobi', description: 'Kenya\'s main domestic airport' }
];

// Farm Collection Centers
export const kenyaFarmCollectionCenters: KenyaLocation[] = [
  { id: 'kcc_eldoret', name: 'KCC Eldoret', latitude: 0.5183, longitude: 35.2692, type: 'farm_collection', region: 'Rift Valley', description: 'Dairy collection center', capacity: 1200 },
  { id: 'ktda_kericho', name: 'KTDA Kericho', latitude: -0.3677, longitude: 35.2831, type: 'farm_collection', region: 'Rift Valley', description: 'Tea collection center', capacity: 900 },
  { id: 'ncpb_kitale', name: 'NCPB Kitale', latitude: 1.0167, longitude: 35.0024, type: 'farm_collection', region: 'Rift Valley', description: 'Grain collection center', capacity: 2000 },
  { id: 'coffee_nyeri', name: 'Coffee Research Center', latitude: -0.4169, longitude: 36.9499, type: 'farm_collection', region: 'Central', description: 'Coffee collection center', capacity: 800 },
  { id: 'horticultural_thika', name: 'Horticultural Center Thika', latitude: -1.0322, longitude: 37.0799, type: 'farm_collection', region: 'Central', description: 'Fruits and vegetables collection', capacity: 750 },
  { id: 'fish_kisumu', name: 'Fish Collection Kisumu', latitude: -0.0917, longitude: 34.7580, type: 'farm_collection', region: 'Nyanza', description: 'Fish collection center', capacity: 500 },
  { id: 'makueni_fruits', name: 'Makueni Fruit Processing Plant', latitude: -1.8001, longitude: 37.6250, type: 'farm_collection', region: 'Eastern', description: 'Mango and fruit collection center', capacity: 600 }
];

// Ports and Border Points
export const kenyaPorts: KenyaLocation[] = [
  { id: 'mombasa_port', name: 'Port of Mombasa', latitude: -4.0435, longitude: 39.6682, type: 'port', region: 'Coast', description: 'Kenya\'s main seaport', capacity: 10000 },
  { id: 'lamu_port', name: 'Lamu Port', latitude: -2.2696, longitude: 40.9018, type: 'port', region: 'Coast', description: 'New deep water port', capacity: 4000 },
  { id: 'busia_border', name: 'Busia Border', latitude: 0.4606, longitude: 34.0905, type: 'border', region: 'Western', description: 'Kenya-Uganda border crossing', capacity: 1500 },
  { id: 'malaba_border', name: 'Malaba Border', latitude: 0.6401, longitude: 34.2630, type: 'border', region: 'Western', description: 'Main Kenya-Uganda border crossing', capacity: 2000 },
  { id: 'namanga_border', name: 'Namanga Border', latitude: -2.5465, longitude: 36.7913, type: 'border', region: 'Rift Valley', description: 'Kenya-Tanzania border crossing', capacity: 1200 },
  { id: 'lunga_lunga', name: 'Lunga Lunga Border', latitude: -4.5536, longitude: 39.1255, type: 'border', region: 'Coast', description: 'Coastal Kenya-Tanzania border', capacity: 800 },
  { id: 'moyale_border', name: 'Moyale Border', latitude: 3.5200, longitude: 39.0544, type: 'border', region: 'Northern', description: 'Kenya-Ethiopia border crossing', capacity: 700 }
];

// Combine all location types for easy access
export const allKenyaLocations: KenyaLocation[] = [
  ...kenyaCities,
  ...kenyaMarkets,
  ...kenyaDistributionCenters,
  ...kenyaAirports,
  ...kenyaFarmCollectionCenters,
  ...kenyaPorts
];

// Get locations by region
export const getLocationsByRegion = (region: string): KenyaLocation[] => {
  return allKenyaLocations.filter(location => location.region === region);
};

// Get locations by type
export const getLocationsByType = (type: KenyaLocation['type']): KenyaLocation[] => {
  return allKenyaLocations.filter(location => location.type === type);
};

// Get closest locations to a point
export const getClosestLocations = (
  latitude: number, 
  longitude: number, 
  count: number = 5
): KenyaLocation[] => {
  return allKenyaLocations
    .map(location => ({
      ...location,
      distance: calculateDistance(latitude, longitude, location.latitude, location.longitude)
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, count);
};

// Helper function to calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
