
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Truck, Leaf, Factory, Ship, Plane } from 'lucide-react';

interface KenyaIndustryData {
  name: string;
  type: string;
  region: string;
  volume: number;
  seasonality: string;
  exportValue: number;
  challenges: string[];
  opportunities: string[];
}

const kenyaIndustries: KenyaIndustryData[] = [
  {
    name: "Tea Industry",
    type: "agriculture",
    region: "Central Kenya",
    volume: 594500000, // kg per year
    seasonality: "Two peak seasons (Mar-May, Oct-Dec)",
    exportValue: 181690000000, // KES
    challenges: ["Weather dependency", "Price volatility", "Quality consistency", "Smallholder coordination"],
    opportunities: ["Premium market access", "Value addition", "Direct trade", "Organic certification"]
  },
  {
    name: "Coffee Industry", 
    type: "agriculture",
    region: "Central & Eastern Kenya",
    volume: 43000000, // kg per year
    seasonality: "Two harvests (Apr-Jun, Oct-Dec)",
    exportValue: 25000000000, // KES
    challenges: ["Cooperative inefficiencies", "Auction system delays", "Climate change", "Aging trees"],
    opportunities: ["Specialty coffee markets", "Direct trade relationships", "Processing improvements", "Brand development"]
  },
  {
    name: "Floriculture",
    type: "agriculture", 
    region: "Naivasha, Nakuru",
    volume: 180000000, // stems per year
    seasonality: "Peak demand Feb, May, Dec",
    exportValue: 67000000000, // KES
    challenges: ["Cold chain management", "Air freight costs", "Quality preservation", "Time sensitivity"],
    opportunities: ["New market development", "Technology adoption", "Sustainability certification", "Year-round production"]
  },
  {
    name: "Manufacturing",
    type: "industrial",
    region: "Nairobi, Mombasa",
    volume: 2400000000, // USD output
    seasonality: "Steady year-round",
    exportValue: 120000000000, // KES
    challenges: ["Raw material imports", "Power costs", "Port congestion", "Skills gap"],
    opportunities: ["Regional market access", "Value addition", "Technology transfer", "Export processing zones"]
  }
];

const kenyaLogisticsChallenges = [
  {
    challenge: "Port of Mombasa Congestion",
    impact: "High",
    description: "Container dwell time averages 7-10 days",
    solutions: ["Digital cargo tracking", "Off-peak scheduling", "Alternative routes via Lamu"]
  },
  {
    challenge: "Road Infrastructure",
    impact: "Medium", 
    description: "Rural road connectivity limits market access",
    solutions: ["Investment in rural roads", "Multi-modal transport", "Warehouse consolidation"]
  },
  {
    challenge: "Cold Chain Gaps",
    impact: "High",
    description: "Limited cold storage and transport capacity",
    solutions: ["Cold storage investments", "Refrigerated transport", "Solar-powered cooling"]
  }
];

export const EnhancedKenyaFeatures = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("tea");
  const [selectedRegion, setSelectedRegion] = useState<string>("central");

  const currentIndustry = kenyaIndustries.find(ind => 
    ind.name.toLowerCase().includes(selectedIndustry)
  ) || kenyaIndustries[0];

  const getOptimizationRecommendations = (industry: KenyaIndustryData) => {
    const recommendations = [];
    
    if (industry.type === "agriculture") {
      recommendations.push("Implement collection center optimization for smallholder coordination");
      recommendations.push("Seasonal inventory planning to handle demand fluctuations");
      recommendations.push("Cold chain network design for quality preservation");
    }
    
    if (industry.name.includes("Tea")) {
      recommendations.push("Factory-to-port route optimization for bulk transport");
      recommendations.push("Auction timing optimization based on global market conditions");
    }
    
    if (industry.name.includes("Floriculture")) {
      recommendations.push("Air freight scheduling optimization for peak seasons");
      recommendations.push("Time-sensitive delivery network design");
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Kenya Industry Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Select Industry</label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tea">Tea Industry</SelectItem>
                  <SelectItem value="coffee">Coffee Industry</SelectItem>
                  <SelectItem value="floriculture">Floriculture</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Focus Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central Kenya</SelectItem>
                  <SelectItem value="coastal">Coastal Region</SelectItem>
                  <SelectItem value="western">Western Kenya</SelectItem>
                  <SelectItem value="northern">Northern Kenya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
              <TabsTrigger value="logistics">Logistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Annual Volume</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    {(currentIndustry.volume / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentIndustry.name.includes("Tea") || currentIndustry.name.includes("Coffee") ? "kg/year" : 
                     currentIndustry.name.includes("Floriculture") ? "stems/year" : "USD value"}
                  </p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Factory className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Export Value</h4>
                  </div>
                  <p className="text-2xl font-bold">
                    KES {(currentIndustry.exportValue / 1000000000).toFixed(1)}B
                  </p>
                  <p className="text-sm text-muted-foreground">Annual exports</p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{currentIndustry.type}</Badge>
                  </div>
                  <p className="text-sm">{currentIndustry.seasonality}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Primary region: {currentIndustry.region}
                  </p>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="challenges" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 text-red-700">Industry Challenges</h4>
                  <ul className="space-y-2">
                    {currentIndustry.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3 text-green-700">Opportunities</h4>
                  <ul className="space-y-2">
                    {currentIndustry.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="optimization" className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Supply Chain Optimization Recommendations</h4>
                <div className="space-y-3">
                  {getOptimizationRecommendations(currentIndustry).map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Potential Impact</h5>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Cost Reduction</p>
                      <p className="text-green-700">15-25%</p>
                    </div>
                    <div>
                      <p className="font-medium">Efficiency Gain</p>
                      <p className="text-green-700">20-30%</p>
                    </div>
                    <div>
                      <p className="font-medium">Service Improvement</p>
                      <p className="text-green-700">95%+ reliability</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="logistics" className="space-y-4">
              <div className="space-y-4">
                {kenyaLogisticsChallenges.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{item.challenge}</h4>
                      <Badge variant={item.impact === "High" ? "destructive" : "secondary"}>
                        {item.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <div>
                      <p className="text-sm font-medium mb-2">Recommended Solutions:</p>
                      <ul className="space-y-1">
                        {item.solutions.map((solution, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-center gap-2 mb-3">
                  <Ship className="h-5 w-5 text-blue-600" />
                  <Plane className="h-5 w-5 text-green-600" />
                  <Truck className="h-5 w-5 text-orange-600" />
                  <h4 className="font-medium">Multi-Modal Transport Optimization</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Optimize transport mode selection based on cargo type, urgency, and cost considerations
                </p>
                <Button variant="outline" size="sm">
                  Configure Transport Mix
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
