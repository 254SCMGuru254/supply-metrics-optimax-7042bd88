import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package2, TrendingUp, Users, Percent, Clock, CalendarDays, Check, AlertCircle, Loader2 } from "lucide-react";
import { MarketTrafficChart, MarketRevenueChart } from "./InformalMarketCharts";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketMonitoring } from "./MarketMonitoring";

interface MarketData {
  id: string;
  name: string;
  location: string;
  type: string;
  traders: number;
  dailyFootfall: number;
  monthlyRevenue: number;
  peakHours: string;
}

interface IntegrationStatus {
  marketId: string;
  distributionCenter: string;
  coverage: number;
  lastSync: string;
  status: 'active' | 'pending' | 'error';
}

export const InformalMarketManager = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [markets] = useState<MarketData[]>([
    {
      id: "gk1",
      name: "Gikomba Market",
      location: "Nairobi",
      type: "General Goods",
      traders: 65000,
      dailyFootfall: 45000,
      monthlyRevenue: 850000000,
      peakHours: "5:00 - 10:00"
    },
    {
      id: "wk1",
      name: "Wakulima Market",
      location: "Nairobi",
      type: "Fresh Produce",
      traders: 12000,
      dailyFootfall: 25000,
      monthlyRevenue: 420000000,
      peakHours: "4:00 - 9:00"
    },
    {
      id: "km1",
      name: "Kongowea Market",
      location: "Mombasa",
      type: "Mixed",
      traders: 15000,
      dailyFootfall: 30000,
      monthlyRevenue: 380000000,
      peakHours: "6:00 - 11:00"
    }
  ]);

  const [integrationStatus] = useState<IntegrationStatus[]>([
    {
      marketId: "gk1",
      distributionCenter: "Nairobi Central",
      coverage: 85,
      lastSync: "2025-04-15T08:30:00",
      status: 'active'
    },
    {
      marketId: "wk1",
      distributionCenter: "Nairobi West",
      coverage: 92,
      lastSync: "2025-04-15T08:45:00",
      status: 'active'
    },
    {
      marketId: "km1",
      distributionCenter: "Mombasa Port",
      coverage: 78,
      lastSync: "2025-04-15T08:15:00",
      status: 'pending'
    }
  ]);

  const getStatusIcon = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informal Market Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="integration">Supply Chain Integration</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Users className="h-8 w-8 text-primary mb-2" />
                      <div className="text-2xl font-bold">92,000+</div>
                      <p className="text-sm text-muted-foreground">Active Traders</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Package2 className="h-8 w-8 text-primary mb-2" />
                      <div className="text-2xl font-bold">35+</div>
                      <p className="text-sm text-muted-foreground">Major Markets</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-8 w-8 text-primary mb-2" />
                      <div className="text-2xl font-bold">1.65B</div>
                      <p className="text-sm text-muted-foreground">Monthly Revenue (KES)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Percent className="h-8 w-8 text-primary mb-2" />
                      <div className="text-2xl font-bold">65%</div>
                      <p className="text-sm text-muted-foreground">Market Share</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <MarketMonitoring />

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Market Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Traders</TableHead>
                      <TableHead className="text-right">Daily Footfall</TableHead>
                      <TableHead className="text-right">Monthly Revenue (KES)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {markets.map((market) => (
                      <TableRow key={market.id}>
                        <TableCell className="font-medium">{market.name}</TableCell>
                        <TableCell>{market.location}</TableCell>
                        <TableCell>{market.type}</TableCell>
                        <TableCell className="text-right">{market.traders.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{market.dailyFootfall.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{market.monthlyRevenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MarketTrafficChart />
                <MarketRevenueChart />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                      <p>Peak traffic hours show consistent patterns across urban markets</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                      <p>Early morning (5-8 AM) generates 40% of daily revenue</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                      <p>Major markets maintain steady revenue growth despite seasonal variations</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                      <p>Weekend markets show 25-30% higher footfall than weekdays</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integration">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-green-100 rounded-full mb-2">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-sm text-muted-foreground">Average Integration</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-blue-100 rounded-full mb-2">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold">15 min</div>
                      <p className="text-sm text-muted-foreground">Sync Frequency</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-purple-100 rounded-full mb-2">
                        <Package2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold">3/3</div>
                      <p className="text-sm text-muted-foreground">Markets Connected</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Distribution Center</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select center" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nairobi-central">Nairobi Central</SelectItem>
                            <SelectItem value="nairobi-west">Nairobi West</SelectItem>
                            <SelectItem value="mombasa-port">Mombasa Port</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Market</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select market" />
                          </SelectTrigger>
                          <SelectContent>
                            {markets.map(market => (
                              <SelectItem key={market.id} value={market.id}>
                                {market.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button>Update Connection</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrationStatus.map((status) => {
                      const market = markets.find(m => m.id === status.marketId);
                      return (
                        <div key={status.marketId} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status.status)}
                              <span className="font-medium">{market?.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Last sync: {new Date(status.lastSync).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Coverage</span>
                              <span>{status.coverage}%</span>
                            </div>
                            <Progress value={status.coverage} className="h-2" />
                            <div className="text-sm text-muted-foreground">
                              Connected to: {status.distributionCenter}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Distribution Optimization</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Establish micro-fulfillment centers near high-traffic markets</li>
                        <li>• Implement real-time inventory tracking systems</li>
                        <li>• Optimize delivery schedules based on peak hours</li>
                        <li>• Set up consolidated collection points</li>
                      </ul>
                    </div>
                    <div className="rounded-md border p-4">
                      <h3 className="font-semibold mb-2">Infrastructure Improvements</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Upgrade storage facilities with cold chain capabilities</li>
                        <li>• Improve access roads and loading areas</li>
                        <li>• Install digital payment infrastructure</li>
                        <li>• Enhance waste management systems</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};