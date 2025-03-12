import { SupplyChainRoute } from "@/components/kenya/types/kenyaTypes";

export const kenyaSupplyChainRoutes: SupplyChainRoute[] = [
  {
    id: "route1",
    from: "mombasa_port",
    to: "nairobi_dc",
    type: "rail",
    volume: 1200,
    description: "Standard Gauge Railway (SGR) main freight route"
  },
  {
    id: "route2",
    from: "nairobi_dc",
    to: "kisumu_dc",
    type: "road",
    volume: 800,
    description: "Western Kenya distribution route"
  },
  {
    id: "route3",
    from: "nairobi_dc",
    to: "eldoret_dc",
    type: "road",
    volume: 650,
    description: "North Rift distribution route"
  },
  {
    id: "route4",
    from: "jkia",
    to: "nairobi_dc",
    type: "road",
    volume: 350,
    description: "Air cargo to distribution center route"
  },
  {
    id: "route5",
    from: "mombasa_port",
    to: "voi_dc",
    type: "road",
    volume: 450,
    description: "Coastal distribution route"
  },
  {
    id: "route6",
    from: "nairobi_dc",
    to: "nakuru_dc",
    type: "road",
    volume: 750,
    description: "Central Rift Valley distribution route"
  },
  {
    id: "route7",
    from: "nakuru_dc",
    to: "kisumu_dc",
    type: "road",
    volume: 500,
    description: "Inter-regional distribution route"
  },
  {
    id: "route8",
    from: "busia_border",
    to: "kisumu_dc",
    type: "road",
    volume: 350,
    description: "Uganda import route"
  },
  {
    id: "route9",
    from: "namanga_border",
    to: "nairobi_dc",
    type: "road",
    volume: 300,
    description: "Tanzania import route"
  },
  {
    id: "route10",
    from: "ktda_kericho",
    to: "mombasa_port",
    type: "road",
    volume: 250,
    description: "Tea export route"
  }
];
