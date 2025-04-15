import { KenyaSupplyChainMap } from "@/components/kenya/KenyaSupplyChainMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Truck,
  Ship,
  Building2,
  MapPin,
  ShoppingCart,
  Warehouse,
  DollarSign,
  AlertCircle,
  Clock,
  CalendarDays
} from "lucide-react";
import { Market } from "@/components/icons/market";
import { Link } from "react-router-dom";
import { InformalMarketManager } from "@/components/kenya/informal-markets/InformalMarketManager";

const KenyaSupplyChain = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kenya Supply Chain Network</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your logistics across Kenya's transportation network
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Button>Run Optimization</Button>
        </div>
      </div>

      <div className="mb-8">
        <KenyaSupplyChainMap />
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="informal-markets">Informal Markets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex flex-col items-center text-center">
              <Truck className="h-10 w-10 text-primary mb-2" />
              <h3 className="text-lg font-semibold">Major Transport Corridors</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Access to 5 international transport corridors linking Kenya to 
                6 neighboring countries
              </p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <Ship className="h-10 w-10 text-primary mb-2" />
              <h3 className="text-lg font-semibold">Port of Mombasa</h3>
              <p className="text-sm text-muted-foreground mt-1">
                East Africa's largest port handling over 30 million tons of cargo annually
              </p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <Building2 className="h-10 w-10 text-primary mb-2" />
              <h3 className="text-lg font-semibold">Distribution Network</h3>
              <p className="text-sm text-muted-foreground mt-1">
                8 major distribution centers strategically located across Kenya
              </p>
            </Card>
            
            <Card className="p-4 flex flex-col items-center text-center">
              <MapPin className="h-10 w-10 text-primary mb-2" />
              <h3 className="text-lg font-semibold">Last-Mile Delivery</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Innovative solutions including motorcycle delivery in urban centers
              </p>
            </Card>
          </div>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Kenya Supply Chain Overview</h2>
            <p className="mb-4">
              Kenya serves as East Africa's logistics gateway, featuring a diverse transportation
              network that includes road, rail, air, and sea options. The country's strategic
              geographic position makes it a vital hub for regional trade, connecting the landlocked
              countries of Uganda, Rwanda, South Sudan, and parts of Ethiopia to global markets.
            </p>
            <p>
              With the development of the Standard Gauge Railway (SGR) and ongoing improvements to
              the Northern Corridor, Kenya continues to enhance its logistics capabilities. The
              country's logistics sector contributes approximately 10.8% to GDP and employs over
              1.5 million Kenyans directly and indirectly.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Road Network
              </h3>
              <p className="text-sm mt-2">
                Kenya's road network spans approximately 161,000 km, with about 17,000 km paved.
                Key highways include:
              </p>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>A104: Mombasa - Nairobi - Malaba (Uganda border)</li>
                <li>A109: Mombasa - Nairobi (part of Northern Corridor)</li>
                <li>A2: Nairobi - Moyale (Ethiopia border)</li>
                <li>A3: Nairobi - Kisumu - Busia (Uganda border)</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Ship className="h-5 w-5 text-primary" />
                Rail Infrastructure
              </h3>
              <p className="text-sm mt-2">
                Kenya's rail infrastructure includes:
              </p>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Standard Gauge Railway (SGR): 472 km connecting Mombasa to Naivasha</li>
                <li>Meter Gauge Railway: 1,918 km legacy network</li>
                <li>SGR cargo capacity: 22 million tons annually</li>
                <li>Average transit time Mombasa-Nairobi: 8 hours</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Port & Airport Facilities
              </h3>
              <p className="text-sm mt-2">
                Major facilities include:
              </p>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Port of Mombasa: 34 berths, 1.4M TEU capacity</li>
                <li>Lamu Port: 3 operational berths (of planned 32)</li>
                <li>JKIA: 25 million passenger capacity, 1 million ton cargo capacity</li>
                <li>Eldoret International: Major cargo handling for northern Kenya</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Infrastructure Investment Projects</h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Project</th>
                    <th className="text-left pb-2">Investment (USD)</th>
                    <th className="text-left pb-2">Status</th>
                    <th className="text-left pb-2">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">LAPSSET Corridor</td>
                    <td className="py-2">$24.5 billion</td>
                    <td className="py-2">In progress</td>
                    <td className="py-2">Connect Kenya with South Sudan and Ethiopia</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Nairobi Expressway</td>
                    <td className="py-2">$668 million</td>
                    <td className="py-2">Completed</td>
                    <td className="py-2">Reduced transit time through Nairobi by 70%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Konza Technopolis</td>
                    <td className="py-2">$14.5 billion</td>
                    <td className="py-2">In progress</td>
                    <td className="py-2">Smart city with integrated logistics hub</td>
                  </tr>
                  <tr>
                    <td className="py-2">Mombasa Port Development</td>
                    <td className="py-2">$896 million</td>
                    <td className="py-2">In progress</td>
                    <td className="py-2">Increase port capacity to 2.5M TEUs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="logistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-primary" />
                Warehousing & Storage
              </h3>
              <p className="text-sm mt-2">
                Kenya's warehousing sector is rapidly developing:
              </p>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>5.5 million sq ft of modern warehouse space</li>
                <li>Major facilities in Nairobi (Tatu City, Northlands)</li>
                <li>Cold chain capacity expanding at 12% annually</li>
                <li>Average warehouse lease rates: KES 450-650/sq m/month</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Distribution Channels
              </h3>
              <p className="text-sm mt-2">
                Kenya's distribution landscape:
              </p>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>65% of retail through informal sector (dukas)</li>
                <li>Major distribution hubs: Nairobi, Mombasa, Kisumu</li>
                <li>Growing e-commerce requiring last-mile solutions</li>
                <li>Motorcycle (boda boda) deliveries dominant in urban areas</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Transport Statistics
              </h3>
              <p className="text-sm mt-2">
                Key logistics metrics:
              </p>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>80% of freight moved by road transport</li>
                <li>SGR carrying over 5.4 million tons annually</li>
                <li>Average truck transit time Mombasa-Nairobi: 12 hours</li>
                <li>Container dwell time at Mombasa port: 3.9 days (improved)</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Major Logistics Service Providers</h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Company</th>
                    <th className="text-left pb-2">Services</th>
                    <th className="text-left pb-2">Coverage</th>
                    <th className="text-left pb-2">Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Siginon Group</td>
                    <td className="py-2">Transport, Warehousing, Clearing</td>
                    <td className="py-2">East Africa</td>
                    <td className="py-2">Integrated logistics solutions</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Multiple Hauliers</td>
                    <td className="py-2">Road transport, Heavy haulage</td>
                    <td className="py-2">East & Central Africa</td>
                    <td className="py-2">Project cargo, Bulk transportation</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Bollore Logistics</td>
                    <td className="py-2">Multimodal transport, Warehousing</td>
                    <td className="py-2">Global</td>
                    <td className="py-2">International freight forwarding</td>
                  </tr>
                  <tr>
                    <td className="py-2">Mitchell Cotts</td>
                    <td className="py-2">Freight, Warehousing, Distribution</td>
                    <td className="py-2">East Africa</td>
                    <td className="py-2">Cold chain logistics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="regulations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold">Import/Export Regulations</h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Kenya Revenue Authority (KRA) oversees customs</li>
                <li>iCMS (Integrated Customs Management System) for documentation</li>
                <li>Pre-Export Verification of Conformity (PVoC) required</li>
                <li>Single Window System for trade facilitation</li>
                <li>Certificate of Origin required for EAC trade</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold">Transport Regulations</h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Axle load limit: 56 tons gross vehicle weight</li>
                <li>Electronic cargo tracking required for transit goods</li>
                <li>NTSA regulates commercial transport licensing</li>
                <li>EAC harmonized vehicle standards</li>
                <li>Digital driver licensing system implementation</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold">Warehousing & Distribution</h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Warehousing licensing through county governments</li>
                <li>Special Economic Zones offer tax incentives</li>
                <li>Kenya Bureau of Standards approves storage facilities</li>
                <li>Food storage regulated by Food & Drug Authority</li>
                <li>Hazardous materials require special permits</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold">Regulatory Bodies</h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Kenya Maritime Authority: Maritime regulation</li>
                <li>Kenya Ports Authority: Port management</li>
                <li>Kenya Railways Corporation: Rail transportation</li>
                <li>Kenya Civil Aviation Authority: Air cargo</li>
                <li>KENTRADE: Trade facilitation</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Recent Regulatory Changes</h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Regulation</th>
                    <th className="text-left pb-2">Effective Date</th>
                    <th className="text-left pb-2">Impact on Supply Chain</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">EAC Single Customs Territory</td>
                    <td className="py-2">July 2021</td>
                    <td className="py-2">One-stop border clearance, reduced transit times by 60%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Digital Service Tax (DST)</td>
                    <td className="py-2">January 2021</td>
                    <td className="py-2">1.5% tax on digital services affecting e-commerce logistics</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">AfCFTA Implementation</td>
                    <td className="py-2">January 2021</td>
                    <td className="py-2">Reduced tariffs for intra-Africa trade, expanded market access</td>
                  </tr>
                  <tr>
                    <td className="py-2">Electronic Cargo Tracking System</td>
                    <td className="py-2">March 2022</td>
                    <td className="py-2">Mandatory for transit cargo, improved security, reduced pilferages</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Transport Costs (in KES)
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Road freight (per ton/km): KES 8-15</li>
                <li>SGR container (Mombasa-Nairobi): KES 50,000-80,000</li>
                <li>Last-mile delivery (per km): KES 30-50</li>
                <li>Air freight (per kg): KES 350-600</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-primary" />
                Warehousing Costs
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Grade A warehouse (per sqm/month): KES 600-850</li>
                <li>Grade B warehouse (per sqm/month): KES 400-550</li>
                <li>Cold storage (per sqm/month): KES 900-1,500</li>
                <li>Handling costs (per pallet): KES 150-300</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Ship className="h-5 w-5 text-primary" />
                Port & Customs Costs
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Port handling (20ft container): KES 16,500-25,000</li>
                <li>Customs clearance fee: KES 15,000-30,000</li>
                <li>Document processing: KES 5,000-12,000</li>
                <li>Import declaration fee: 3.5% of CIF value</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Other Logistics Costs
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Insurance: 0.5-1.5% of cargo value</li>
                <li>Inventory carrying cost: 18-25% of inventory value</li>
                <li>Railway Development Levy: 2% of import value</li>
                <li>Digital tracking (per container): KES 2,500-5,000</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Cost Comparison by Route (40ft Container)</h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Route</th>
                    <th className="text-left pb-2">Road Transport (KES)</th>
                    <th className="text-left pb-2">Rail Transport (KES)</th>
                    <th className="text-left pb-2">Transit Time (Days)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Mombasa - Nairobi</td>
                    <td className="py-2">120,000 - 150,000</td>
                    <td className="py-2">80,000 - 100,000</td>
                    <td className="py-2">1 - 2</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Nairobi - Kampala</td>
                    <td className="py-2">250,000 - 350,000</td>
                    <td className="py-2">N/A</td>
                    <td className="py-2">2 - 3</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Mombasa - Kigali</td>
                    <td className="py-2">600,000 - 800,000</td>
                    <td className="py-2">N/A</td>
                    <td className="py-2">7 - 10</td>
                  </tr>
                  <tr>
                    <td className="py-2">Nairobi - Kisumu</td>
                    <td className="py-2">100,000 - 130,000</td>
                    <td className="py-2">N/A</td>
                    <td className="py-2">1 - 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Infrastructure Challenges
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Road congestion in major urban centers</li>
                <li>Limited last-mile road connectivity</li>
                <li>Incomplete railway network integration</li>
                <li>Port congestion during peak seasons</li>
                <li>Limited specialized storage facilities</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Operational Challenges
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>High logistics costs (up to 40% of product value)</li>
                <li>Inefficient border management procedures</li>
                <li>Security concerns for high-value cargo</li>
                <li>Fragmented distribution networks</li>
                <li>Limited technology adoption in rural areas</li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Regulatory Challenges
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Complex customs documentation requirements</li>
                <li>Multiple roadblocks and inspections</li>
                <li>Inconsistent application of regional standards</li>
                <li>Frequently changing import/export regulations</li>
                <li>Delays in implementation of EAC Customs Union</li>
              </ul>
            </Card>
          </div>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Mitigation Strategies</h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Challenge</th>
                    <th className="text-left pb-2">Solution Approach</th>
                    <th className="text-left pb-2">Expected Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">High transport costs</td>
                    <td className="py-2">Modal shift to rail, transport consolidation, route optimization</td>
                    <td className="py-2">15-25% cost reduction</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Last-mile connectivity</td>
                    <td className="py-2">Hybrid distribution models, pickup points, mobile warehouses</td>
                    <td className="py-2">Improved rural access, reduced lead times</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Documentation complexities</td>
                    <td className="py-2">Digital document processing, pre-clearance, AEO certification</td>
                    <td className="py-2">50-70% reduction in processing time</td>
                  </tr>
                  <tr>
                    <td className="py-2">Security concerns</td>
                    <td className="py-2">Electronic cargo tracking, convoy systems, insurance packages</td>
                    <td className="py-2">Reduced theft incidents, lower insurance premiums</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="informal-markets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Market className="h-5 w-5 text-primary" />
                Market Statistics
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>65% of retail through informal markets</li>
                <li>Over 2.5 million informal traders</li>
                <li>Annual informal trade value: KES 3.1 trillion</li>
                <li>Average daily market traffic: 15,000 people</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Peak Trading Hours
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Early Morning: 5:00 - 8:00</li>
                <li>Mid-Morning: 9:00 - 11:00</li>
                <li>Late Afternoon: 15:00 - 17:00</li>
                <li>Evening Markets: 18:00 - 21:00</li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Market Days
              </h3>
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                <li>Urban markets: Daily operations</li>
                <li>Rural markets: 2-3 days per week</li>
                <li>Seasonal variations during harvest</li>
                <li>Special weekend markets in suburbs</li>
              </ul>
            </Card>
          </div>

          <InformalMarketManager />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Key Kenya Logistics Metrics</h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span>Logistics Performance Index (LPI)</span>
              <span className="font-medium">2.81/5</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Average container dwell time at port</span>
              <span className="font-medium">3.9 days</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Road density</span>
              <span className="font-medium">27.6 km per 100 sq km</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Average truck turnaround time</span>
              <span className="font-medium">4.5 days</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Logistics cost as % of product value</span>
              <span className="font-medium">30-42%</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Border crossing time (average)</span>
              <span className="font-medium">6-12 hours</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Optimization Opportunities</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <div className="min-w-4 h-4 rounded-full bg-primary mt-1" />
              <div>
                <p className="font-medium">Modal Shift to Rail</p>
                <p className="text-sm text-muted-foreground">Potential 30-40% cost reduction for Mombasa-Nairobi corridor</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="min-w-4 h-4 rounded-full bg-primary mt-1" />
              <div>
                <p className="font-medium">Consolidation Centers</p>
                <p className="text-sm text-muted-foreground">Urban consolidation can reduce last-mile costs by 15-25%</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="min-w-4 h-4 rounded-full bg-primary mt-1" />
              <div>
                <p className="font-medium">Digital Documentation</p>
                <p className="text-sm text-muted-foreground">Reduce clearance times by up to 70% and administrative costs by 35%</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="min-w-4 h-4 rounded-full bg-primary mt-1" />
              <div>
                <p className="font-medium">Cold Chain Integration</p>
                <p className="text-sm text-muted-foreground">Reduce post-harvest losses from 40% to below 15%</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Link to="/chat-assistant">
            <Button>Ask Supply Chain Assistant</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KenyaSupplyChain;
