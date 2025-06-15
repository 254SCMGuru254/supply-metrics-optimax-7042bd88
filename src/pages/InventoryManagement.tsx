import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingUp, DollarSign, BarChart3, Bolt } from "lucide-react";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import { useToast } from "@/hooks/use-toast";

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleOptimizationComplete = () => {
    toast({
      title: "Optimization Complete",
      description: "Your inventory optimization has been completed successfully.",
    });
  };

  const metrics = [
    {
      title: "Total Inventory Value",
      value: "$2.4M",
      change: "+12%",
      icon: Package,
      trend: "up"
    },
    {
      title: "Turnover Rate",
      value: "8.2x",
      change: "+15%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Stockout Risk",
      value: "3.2%",
      change: "-8%",
      icon: AlertTriangle,
      trend: "down"
    },
    {
      title: "Carrying Cost",
      value: "$180K",
      change: "-22%",
      icon: DollarSign,
      trend: "down"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" ref={contentRef}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory Optimization</h1>
          <p className="text-muted-foreground">
            Optimize inventory levels, reduce costs, and improve service levels using advanced algorithms.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportPdfButton
            exportId="inventory-optimization-content"
            fileName="inventory-optimization-analysis"
          />
          <Button onClick={handleOptimizationComplete}>
            <Bolt className="h-4 w-4 mr-2" />
            Run Optimization
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <Badge variant={metric.trend === 'up' ? 'default' : 'secondary'}>
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div id="inventory-optimization-content">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eoq">EOQ</TabsTrigger>
            <TabsTrigger value="safety-stock">Safety Stock</TabsTrigger>
            <TabsTrigger value="abc-analysis">ABC Analysis</TabsTrigger>
            <TabsTrigger value="multi-echelon">Multi-Echelon</TabsTrigger>
            <TabsTrigger value="cold-chain">Cold Chain</TabsTrigger>
            <TabsTrigger value="retail">Retail Chain</TabsTrigger>
            <TabsTrigger value="horticultural">Horticultural</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Inventory Optimization Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InventoryOptimizationContent />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eoq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Economic Order Quantity (EOQ) Calculator</CardTitle>
                <div className="flex justify-end">
                  <ExportPdfButton
                    exportId="eoq-calculator"
                    fileName="eoq-analysis"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div id="eoq-calculator">
                  <EOQCalculator />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="safety-stock" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Safety Stock Calculator</CardTitle>
                <div className="flex justify-end">
                  <ExportPdfButton
                    exportId="safety-stock-calculator"
                    fileName="safety-stock-analysis"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div id="safety-stock-calculator">
                  <SafetyStockCalculator />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abc-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ABC Analysis</CardTitle>
                <div className="flex justify-end">
                  <ExportPdfButton
                    exportId="abc-analysis"
                    fileName="abc-analysis-report"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div id="abc-analysis">
                  <ABCAnalysis />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="multi-echelon" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Echelon Inventory Optimization</CardTitle>
                <div className="flex justify-end">
                  <ExportPdfButton
                    exportId="multi-echelon-optimization"
                    fileName="multi-echelon-analysis"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div id="multi-echelon-optimization">
                  <MultiEchelonVisualization />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cold-chain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cold Chain Optimization</CardTitle>
                <div className="flex justify-end">
                  <ExportPdfButton
                    exportId="cold-chain-optimization"
                    fileName="cold-chain-analysis"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div id="cold-chain-optimization">
                  <ColdChainOptimizer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retail" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Retail Supply Chain Optimization</CardTitle>
                <div className="flex justify-end">
                  <ExportPdfButton
                    exportId="retail-optimization"
                    fileName="retail-supply-chain-analysis"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div id="retail-optimization">
                  <RetailSupplyChainOptimizer />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="horticultural" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horticultural EOQ Calculator</CardTitle>
                <div className="flex justify-end">
                  <ExportPdfButton
                    exportId="horticultural-eoq"
                    fileName="horticultural-eoq-analysis"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div id="horticultural-eoq">
                  <HorticulturalEOQCalculator />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InventoryManagement;
