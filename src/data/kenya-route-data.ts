
import { KenyaLocation } from "@/components/kenya/types/kenyaTypes";

// Enhanced Kenya locations with route restrictions and traffic information
export interface KenyaRouteLocation extends KenyaLocation {
  restrictions?: {
    weightLimit?: number;
    heightLimit?: number;
    widthLimit?: number;
    environmentalZone?: boolean;
    permitRequired?: boolean;
    weightLimitDescription?: string;
  };
  trafficFactor?: number; // 1.0 = no traffic, 2.0 = heavy traffic
  tollCost?: number; // Cost in USD
  checkpointWaitTime?: number; // Wait time in minutes
}

export const kenyaLocationsWithRestrictions: KenyaRouteLocation[] = [
  {
    id: "nairobi_dc",
    name: "Nairobi Distribution Center",
    type: "distribution",
    latitude: -1.2921,
    longitude: 36.8219,
    region: "Nairobi",
    capacity: 1000,
    description: "Main distribution hub in Nairobi",
    trafficFactor: 1.8, // Heavy urban traffic
    tollCost: 0
  },
  {
    id: "mombasa_port",
    name: "Mombasa Port",
    type: "port",
    latitude: -4.0435,
    longitude: 39.6682,
    region: "Coast",
    capacity: 800,
    description: "Kenya's main seaport",
    trafficFactor: 1.2,
    tollCost: 0
  },
  {
    id: "kisumu_dc",
    name: "Kisumu Distribution Center",
    type: "distribution",
    latitude: -0.1022,
    longitude: 34.7617,
    region: "Western",
    capacity: 400,
    description: "Western Kenya distribution hub",
    trafficFactor: 1.3,
    tollCost: 0
  },
  {
    id: "nakuru_dc",
    name: "Nakuru Distribution Center",
    type: "distribution",
    latitude: -0.3031,
    longitude: 36.0800,
    region: "Rift Valley",
    capacity: 500,
    description: "Central Kenya distribution point",
    trafficFactor: 1.1,
    tollCost: 0
  },
  {
    id: "eldoret_dc",
    name: "Eldoret Warehouse",
    type: "warehouse",
    latitude: 0.5143,
    longitude: 35.2698,
    region: "Rift Valley",
    capacity: 350,
    description: "North Rift distribution warehouse",
    trafficFactor: 1.0,
    tollCost: 0
  },
  {
    id: "voi_dc",
    name: "Voi Distribution Point",
    type: "warehouse",
    latitude: -3.3945,
    longitude: 38.5553,
    region: "Coast",
    capacity: 200,
    description: "Coastal region sub-hub",
    trafficFactor: 1.0,
    tollCost: 0
  },
  {
    id: "jkia",
    name: "JKIA Air Cargo",
    type: "airport",
    latitude: -1.3236,
    longitude: 36.9279,
    region: "Nairobi",
    capacity: 300,
    description: "Jomo Kenyatta International Airport cargo terminal",
    trafficFactor: 1.5,
    tollCost: 0
  },
  {
    id: "namanga_border",
    name: "Namanga Border",
    type: "border",
    latitude: -2.5546,
    longitude: 36.7867,
    region: "Rift Valley",
    description: "Kenya-Tanzania border crossing",
    trafficFactor: 1.0,
    tollCost: 5,
    checkpointWaitTime: 120
  },
  {
    id: "busia_border",
    name: "Busia Border",
    type: "border",
    latitude: 0.4626,
    longitude: 34.0811,
    region: "Western",
    description: "Kenya-Uganda border crossing",
    trafficFactor: 1.1,
    tollCost: 5,
    checkpointWaitTime: 150
  },
  {
    id: "malaba_border",
    name: "Malaba Border",
    type: "border",
    latitude: 0.6350,
    longitude: 34.2566,
    region: "Western",
    description: "Kenya-Uganda border crossing (alternative)",
    trafficFactor: 1.2,
    tollCost: 5,
    checkpointWaitTime: 180
  },
  {
    id: "nairobi_sgr",
    name: "Nairobi SGR Terminal",
    type: "railhub",
    latitude: -1.3170,
    longitude: 36.9253,
    region: "Nairobi",
    capacity: 600,
    description: "Nairobi Standard Gauge Railway terminal",
    trafficFactor: 1.2,
    tollCost: 0
  },
  {
    id: "mombasa_sgr",
    name: "Mombasa SGR Terminal",
    type: "railhub",
    latitude: -4.0507,
    longitude: 39.6441,
    region: "Coast",
    capacity: 600,
    description: "Mombasa Standard Gauge Railway terminal",
    trafficFactor: 1.0,
    tollCost: 0
  },
  {
    id: "naivasha_dry_port",
    name: "Naivasha Dry Port",
    type: "warehouse",
    latitude: -0.7135,
    longitude: 36.4312,
    region: "Rift Valley",
    capacity: 450,
    description: "Inland container depot",
    trafficFactor: 1.0,
    tollCost: 0
  },
  {
    id: "isiolo",
    name: "Isiolo Hub",
    type: "warehouse",
    latitude: 0.3536,
    longitude: 37.5785,
    region: "Eastern",
    capacity: 200,
    description: "Northern corridor distribution point",
    trafficFactor: 1.0,
    tollCost: 0
  },
  {
    id: "garissa",
    name: "Garissa Distribution",
    type: "warehouse",
    latitude: -0.4522,
    longitude: 39.6461,
    region: "North Eastern",
    capacity: 150,
    description: "Northeastern distribution point",
    trafficFactor: 1.0,
    tollCost: 0,
    restrictions: {
      weightLimit: 25,
      weightLimitDescription: "Weak bridges limit heavy transport"
    }
  },
  {
    id: "marsabit",
    name: "Marsabit Distribution",
    type: "warehouse",
    latitude: 2.3359,
    longitude: 37.9784,
    region: "Northern",
    capacity: 100,
    description: "Northern Kenya distribution point",
    trafficFactor: 1.0,
    tollCost: 0,
    restrictions: {
      weightLimit: 20,
      weightLimitDescription: "Road condition limits on heavy transport"
    }
  },
  {
    id: "lodwar",
    name: "Lodwar Distribution",
    type: "warehouse",
    latitude: 3.1187,
    longitude: 35.5973,
    region: "Northern",
    capacity: 80,
    description: "Northwestern distribution point",
    trafficFactor: 1.0,
    tollCost: 0,
    restrictions: {
      weightLimit: 15,
      weightLimitDescription: "Limited road infrastructure"
    }
  },
  {
    id: "kitale",
    name: "Kitale Distribution",
    type: "warehouse",
    latitude: 1.0202,
    longitude: 35.0023,
    region: "Western",
    capacity: 180,
    description: "Agricultural products collection center",
    trafficFactor: 1.0,
    tollCost: 0,
  },
  {
    id: "narok",
    name: "Narok Distribution",
    type: "warehouse",
    latitude: -1.0854,
    longitude: 35.8694,
    region: "Rift Valley",
    capacity: 150,
    description: "Southern Rift distribution center",
    trafficFactor: 1.0,
    tollCost: 0,
  },
  {
    id: "machakos",
    name: "Machakos Distribution",
    type: "warehouse",
    latitude: -1.5177,
    longitude: 37.2614,
    region: "Eastern",
    capacity: 200,
    description: "Eastern region distribution hub",
    trafficFactor: 1.1,
    tollCost: 0,
  },
  {
    id: "thika_industrial",
    name: "Thika Industrial Zone",
    type: "distribution",
    latitude: -1.0383,
    longitude: 37.0834,
    region: "Central",
    capacity: 300,
    description: "Industrial zone distribution center",
    trafficFactor: 1.4,
    tollCost: 0,
  },
  {
    id: "athi_river_epz",
    name: "Athi River EPZ",
    type: "warehouse",
    latitude: -1.4569,
    longitude: 36.9778,
    region: "Nairobi",
    capacity: 250,
    description: "Export Processing Zone warehouse",
    trafficFactor: 1.2,
    tollCost: 0,
  }
];

// Kenya route restrictions by corridor
export const kenyaRouteRestrictions = [
  {
    id: "nairobi_mombasa",
    name: "Nairobi-Mombasa Highway",
    weightLimit: 48, // tons
    heightLimit: 4.5, // meters
    widthLimit: 2.5, // meters
    tollRates: [
      { vehicleType: "Light", rate: 10 },
      { vehicleType: "Medium", rate: 20 },
      { vehicleType: "Heavy", rate: 30 }
    ]
  },
  {
    id: "nairobi_nakuru",
    name: "Nairobi-Nakuru Highway",
    weightLimit: 48, // tons
    heightLimit: 4.5, // meters
    widthLimit: 2.5, // meters
    environmentalZone: false,
    tollRates: [
      { vehicleType: "Light", rate: 5 },
      { vehicleType: "Medium", rate: 15 },
      { vehicleType: "Heavy", rate: 25 }
    ]
  },
  {
    id: "northern_corridor",
    name: "Northern Corridor",
    weightLimit: 48, // tons
    heightLimit: 4.5, // meters
    widthLimit: 2.5, // meters
    environmentalZone: false
  },
  {
    id: "lodwar_marsabit",
    name: "Lodwar-Marsabit Road",
    weightLimit: 25, // tons
    heightLimit: 4.2, // meters
    widthLimit: 2.5, // meters
    environmentalZone: true,
    restrictions: "Limited infrastructure, seasonal access issues"
  }
];

// Kenya available transport modes
export const kenyaTransportModes = [
  {
    id: "road",
    name: "Road Transport",
    costPerKm: 0.12,
    speedKmH: 60,
    availableNationwide: true,
    restrictions: "Weight and dimension limits apply"
  },
  {
    id: "rail",
    name: "SGR Rail",
    costPerKm: 0.08,
    speedKmH: 80,
    availableRoutes: ["mombasa_sgr-nairobi_sgr", "nairobi_sgr-naivasha_dry_port"],
    restrictions: "Fixed schedule, limited routes"
  },
  {
    id: "air",
    name: "Air Freight",
    costPerKm: 0.60,
    speedKmH: 700,
    availableRoutes: ["jkia-mombasa_port", "jkia-kisumu_dc", "jkia-eldoret_dc"],
    restrictions: "Weight limits, high cost, limited routes"
  }
];

// Kenya traffic conditions by region
export const kenyaTrafficConditions = [
  {
    region: "Nairobi",
    trafficFactor: 1.8,
    peakHours: ["6:00-9:00", "17:00-20:00"],
    description: "Severe traffic congestion during peak hours"
  },
  {
    region: "Mombasa",
    trafficFactor: 1.3,
    peakHours: ["7:00-9:00", "17:00-19:00"],
    description: "Moderate traffic on island and main approaches"
  },
  {
    region: "Kisumu",
    trafficFactor: 1.2,
    peakHours: ["7:00-8:30", "17:00-18:30"],
    description: "Moderate traffic in central business district"
  },
  {
    region: "Nakuru",
    trafficFactor: 1.2,
    peakHours: ["7:00-8:30", "17:00-18:30"],
    description: "Congestion on major through routes"
  }
];
