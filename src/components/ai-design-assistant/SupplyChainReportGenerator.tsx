
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Node, Route } from "@/components/map/MapTypes";
import { FileDown, Download, ChevronDown, ChevronUp, FilePdf, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface SupplyChainReportGeneratorProps {
  industry: string;
  networkNodes: Node[];
  networkRoutes: Route[];
}

// Cost benchmarks by industry (simplified for demo)
const COST_BENCHMARKS = {
  agriculture: {
    transportation: { average: 28, best: 22 },
    inventory: { average: 18, best: 14 },
    operations: { average: 25, best: 18 }
  },
  manufacturing: {
    transportation: { average: 22, best: 17 },
    inventory: { average: 25, best: 18 },
    operations: { average: 35, best: 27 }
  },
  retail: {
    transportation: { average: 18, best: 14 },
    inventory: { average: 32, best: 24 },
    operations: { average: 20, best: 15 }
  },
  pharmaceuticals: {
    transportation: { average: 16, best: 12 },
    inventory: { average: 38, best: 30 },
    operations: { average: 40, best: 32 }
  },
  technology: {
    transportation: { average: 15, best: 11 },
    inventory: { average: 35, best: 28 },
    operations: { average: 32, best: 25 }
  }
};

export const SupplyChainReportGenerator: React.FC<SupplyChainReportGeneratorProps> = ({ 
  industry, 
  networkNodes, 
  networkRoutes 
}) => {
  const [activeReportTab, setActiveReportTab] = useState<string>("overview");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    performance: true,
    costs: true,
    recommendations: true
  });
  const { toast } = useToast();
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Get report date in standard format
  const getReportDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate route metrics
  const calculateRouteMetrics = () => {
    if (!networkRoutes.length) return { totalDistance: 0, totalTime: 0, totalCost: 0 };
    
    const totalDistance = networkRoutes.reduce((sum, route) => sum + (route.distance || 0), 0);
    const totalTime = networkRoutes.reduce((sum, route) => sum + (route.transitTime || 0), 0);
    const totalCost = networkRoutes.reduce((sum, route) => sum + (route.cost || 0), 0);
    
    return { totalDistance, totalTime, totalCost };
  };
  
  // Get cost breakdown based on industry
  const getCostBreakdown = () => {
    const benchmark = COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS] || COST_BENCHMARKS.manufacturing;
    
    // Simulate some variation around the benchmark
    const variation = (min: number, max: number) => min + Math.random() * (max - min);
    
    return {
      transportation: variation(benchmark.transportation.best, benchmark.transportation.average),
      inventory: variation(benchmark.inventory.best, benchmark.inventory.average),
      operations: variation(benchmark.operations.best, benchmark.operations.average)
    };
  };
  
  // Generate random performance metrics
  const getPerformanceMetrics = () => {
    // Generate values that make sense for each industry
    const metrics = {
      orderFulfillment: 85 + Math.random() * 10,
      onTimeDelivery: 80 + Math.random() * 15,
      inventoryAccuracy: 90 + Math.random() * 8,
      forecastAccuracy: 70 + Math.random() * 20,
      leadTime: 2 + Math.random() * 5
    };
    
    return metrics;
  };
  
  // Export report as PDF
  const exportReport = async () => {
    toast({
      title: "Preparing PDF Report",
      description: "Please wait while we generate your report..."
    });
    
    try {
      const reportElement = document.getElementById('supply-chain-report');
      if (!reportElement) return;
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // If report is longer than one page
      if (imgHeight > pdf.internal.pageSize.getHeight()) {
        let heightLeft = imgHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      pdf.save(`supply-chain-report-${industry}-${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: "Report Downloaded",
        description: "Your supply chain analysis report has been downloaded successfully."
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "There was a problem generating your report. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Generate recommendations based on industry and metrics
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Generic recommendations
    recommendations.push("Implement real-time tracking systems to improve visibility");
    recommendations.push("Adopt machine learning for demand forecasting");
    
    // Industry-specific recommendations
    if (industry === "agriculture") {
      recommendations.push("Deploy IoT sensors for cold chain monitoring");
      recommendations.push("Implement blockchain for farm-to-table traceability");
      recommendations.push("Establish direct relationships with retailers to reduce intermediaries");
    } else if (industry === "manufacturing") {
      recommendations.push("Implement just-in-time inventory management");
      recommendations.push("Develop vendor-managed inventory programs with key suppliers");
      recommendations.push("Standardize components across product lines");
    } else if (industry === "retail") {
      recommendations.push("Deploy omni-channel fulfillment capabilities");
      recommendations.push("Implement cross-docking at distribution centers");
      recommendations.push("Develop ship-from-store capabilities for e-commerce orders");
    } else if (industry === "pharmaceuticals") {
      recommendations.push("Implement serialization and track-and-trace throughout the supply chain");
      recommendations.push("Deploy temperature monitoring for cold chain compliance");
      recommendations.push("Establish secondary supplier relationships for critical ingredients");
    } else if (industry === "technology") {
      recommendations.push("Diversify supplier base for key components");
      recommendations.push("Implement postponement strategy to delay final assembly");
      recommendations.push("Deploy advanced analytics for component obsolescence management");
    }
    
    return recommendations;
  };
  
  // Calculate metrics
  const routeMetrics = calculateRouteMetrics();
  const costBreakdown = getCostBreakdown();
  const performanceMetrics = getPerformanceMetrics();
  const recommendations = generateRecommendations();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Supply Chain Analysis Report</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis and recommendations for your {industry} supply chain
          </p>
        </div>
        <Button onClick={exportReport} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
      
      <Tabs value={activeReportTab} onValueChange={setActiveReportTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="network">Network Analysis</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <div id="supply-chain-report" className="bg-white p-6 rounded-md border mt-4">
          {/* Report Header */}
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold">Supply Chain Analysis Report</h2>
              <p className="text-muted-foreground">Industry: {industry.charAt(0).toUpperCase() + industry.slice(1)}</p>
              <p className="text-muted-foreground">Generated: {getReportDate()}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Supply Chain Optimization</p>
              <p className="text-sm text-muted-foreground">Report #SC{Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Executive Summary */}
              <section>
                <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
                <p>
                  This report provides a comprehensive analysis of the {industry} supply chain, 
                  including performance metrics, cost analysis, and improvement recommendations.
                  The analysis is based on {networkNodes.length} facilities and {networkRoutes.length} transportation routes.
                </p>
                <p className="mt-2">
                  Key findings indicate that the current supply chain structure has an order fulfillment rate of {performanceMetrics.orderFulfillment.toFixed(1)}% 
                  with a lead time averaging {performanceMetrics.leadTime.toFixed(1)} days. Primary opportunities for improvement 
                  include transportation optimization, inventory positioning, and demand forecasting accuracy.
                </p>
              </section>
              
              {/* Performance Metrics */}
              <section>
                <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('performance')}>
                  <h3 className="text-lg font-semibold">Performance Metrics</h3>
                  {expandedSections.performance ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </div>
                
                {expandedSections.performance && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground">Order Fulfillment Rate</p>
                      <p className="text-2xl font-semibold">{performanceMetrics.orderFulfillment.toFixed(1)}%</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                      <p className="text-2xl font-semibold">{performanceMetrics.onTimeDelivery.toFixed(1)}%</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground">Inventory Accuracy</p>
                      <p className="text-2xl font-semibold">{performanceMetrics.inventoryAccuracy.toFixed(1)}%</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground">Forecast Accuracy</p>
                      <p className="text-2xl font-semibold">{performanceMetrics.forecastAccuracy.toFixed(1)}%</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground">Average Lead Time</p>
                      <p className="text-2xl font-semibold">{performanceMetrics.leadTime.toFixed(1)} days</p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm text-muted-foreground">Total Routes</p>
                      <p className="text-2xl font-semibold">{networkRoutes.length}</p>
                    </Card>
                  </div>
                )}
              </section>
              
              {/* Cost Analysis */}
              <section>
                <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('costs')}>
                  <h3 className="text-lg font-semibold">Cost Analysis</h3>
                  {expandedSections.costs ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </div>
                
                {expandedSections.costs && (
                  <div>
                    <p className="mb-2">Supply chain costs are broken down into three main categories:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Transportation</p>
                        <p className="text-2xl font-semibold">{costBreakdown.transportation.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Industry avg: {COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.transportation.average || 25}%
                        </p>
                      </Card>
                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Inventory</p>
                        <p className="text-2xl font-semibold">{costBreakdown.inventory.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Industry avg: {COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.inventory.average || 25}%
                        </p>
                      </Card>
                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground">Operations</p>
                        <p className="text-2xl font-semibold">{costBreakdown.operations.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Industry avg: {COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.operations.average || 25}%
                        </p>
                      </Card>
                    </div>
                    
                    {routeMetrics.totalCost > 0 && (
                      <Card className="p-4 mt-2">
                        <p className="font-medium">Total Transportation Cost: ${routeMetrics.totalCost.toLocaleString()}</p>
                      </Card>
                    )}
                  </div>
                )}
              </section>
              
              {/* Recommendations */}
              <section>
                <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleSection('recommendations')}>
                  <h3 className="text-lg font-semibold">Key Recommendations</h3>
                  {expandedSections.recommendations ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </div>
                
                {expandedSections.recommendations && (
                  <div>
                    <ul className="space-y-2 list-disc pl-5">
                      {recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="network">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">Network Structure</h3>
                <p>
                  The current supply chain network consists of {networkNodes.length} nodes and {networkRoutes.length} transportation routes.
                  The network is structured to support the {industry} industry's specific requirements.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Transportation Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Distance</p>
                    <p className="text-2xl font-semibold">
                      {routeMetrics.totalDistance.toLocaleString()} km
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Transit Time</p>
                    <p className="text-2xl font-semibold">
                      {routeMetrics.totalTime.toLocaleString()} hours
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Average Time per Route</p>
                    <p className="text-2xl font-semibold">
                      {(networkRoutes.length ? routeMetrics.totalTime / networkRoutes.length : 0).toFixed(1)} hours
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Routes</p>
                    <p className="text-2xl font-semibold">{networkRoutes.length}</p>
                  </Card>
                </div>
                
                {networkRoutes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Key Routes</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left">From</th>
                            <th className="px-4 py-2 text-left">To</th>
                            <th className="px-4 py-2 text-left">Mode</th>
                            <th className="px-4 py-2 text-left">Volume</th>
                            <th className="px-4 py-2 text-left">Time (hrs)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {networkRoutes.slice(0, 5).map((route, idx) => {
                            const fromNode = networkNodes.find(n => n.id === route.from);
                            const toNode = networkNodes.find(n => n.id === route.to);
                            
                            return (
                              <tr key={idx} className="border-b">
                                <td className="px-4 py-2">{fromNode?.name || "Unknown"}</td>
                                <td className="px-4 py-2">{toNode?.name || "Unknown"}</td>
                                <td className="px-4 py-2">{route.type || "truck"}</td>
                                <td className="px-4 py-2">{route.volume || "N/A"}</td>
                                <td className="px-4 py-2">{route.transitTime || "N/A"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {networkRoutes.length > 5 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing 5 of {networkRoutes.length} routes...
                      </p>
                    )}
                  </div>
                )}
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Network Optimization Opportunities</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Consolidate shipments to improve vehicle utilization</li>
                  <li>Implement milk-runs for nearby locations</li>
                  <li>Evaluate alternative transportation modes for long-distance routes</li>
                  <li>Optimize facility locations based on center of gravity analysis</li>
                  <li>Consider regional cross-docking operations</li>
                </ul>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="cost">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">Cost Structure</h3>
                <p>
                  Supply chain costs in the {industry} industry are typically divided into transportation, inventory holding, and operations.
                  The analysis below provides a breakdown of your supply chain costs compared to industry benchmarks.
                </p>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Cost Breakdown</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Transportation</p>
                    <p className="text-2xl font-semibold">{costBreakdown.transportation.toFixed(1)}%</p>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Your Cost:</span>
                        <span>{costBreakdown.transportation.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry Avg:</span>
                        <span>{COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.transportation.average || 25}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best-in-Class:</span>
                        <span>{COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.transportation.best || 20}%</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Inventory</p>
                    <p className="text-2xl font-semibold">{costBreakdown.inventory.toFixed(1)}%</p>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Your Cost:</span>
                        <span>{costBreakdown.inventory.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry Avg:</span>
                        <span>{COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.inventory.average || 25}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best-in-Class:</span>
                        <span>{COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.inventory.best || 20}%</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Operations</p>
                    <p className="text-2xl font-semibold">{costBreakdown.operations.toFixed(1)}%</p>
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Your Cost:</span>
                        <span>{costBreakdown.operations.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry Avg:</span>
                        <span>{COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.operations.average || 25}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best-in-Class:</span>
                        <span>{COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.operations.best || 20}%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Cost Saving Opportunities</h3>
                
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium">Transportation Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Implementing advanced route optimization can reduce transportation costs by 10-15%.
                      This would result in an estimated annual saving of $
                      {Math.floor((routeMetrics.totalCost || 10000) * 0.12).toLocaleString()}.
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium">Inventory Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Multi-echelon inventory optimization can reduce inventory holding costs by 15-20%
                      while maintaining or improving service levels. This represents a potential annual saving of $
                      {Math.floor((costBreakdown.inventory / 100 * (routeMetrics.totalCost || 20000)) * 0.18).toLocaleString()}.
                    </p>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium">Network Redesign</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Optimizing facility locations can reduce overall supply chain costs by 5-8%.
                      For your operation, this could translate to annual savings of $
                      {Math.floor((routeMetrics.totalCost || 30000) * 0.06).toLocaleString()}.
                    </p>
                  </Card>
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Long-term Cost Structure</h3>
                <p>
                  Implementing the recommended optimization strategies could reshape your cost structure as follows:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Transportation</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold">{Math.max(costBreakdown.transportation * 0.85, COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.transportation.best).toFixed(1)}%</p>
                      <p className="text-sm text-green-600">-{(costBreakdown.transportation * 0.15).toFixed(1)}%</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Inventory</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold">{Math.max(costBreakdown.inventory * 0.8, COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.inventory.best).toFixed(1)}%</p>
                      <p className="text-sm text-green-600">-{(costBreakdown.inventory * 0.2).toFixed(1)}%</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Operations</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold">{Math.max(costBreakdown.operations * 0.9, COST_BENCHMARKS[industry as keyof typeof COST_BENCHMARKS]?.operations.best).toFixed(1)}%</p>
                      <p className="text-sm text-green-600">-{(costBreakdown.operations * 0.1).toFixed(1)}%</p>
                    </div>
                  </Card>
                </div>
              </section>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">Strategic Recommendations</h3>
                <p className="mb-3">
                  Based on our analysis of your {industry} supply chain, we recommend the following strategic initiatives:
                </p>
                
                <div className="space-y-4">
                  {recommendations.slice(0, 3).map((rec, idx) => (
                    <Card className="p-4" key={idx}>
                      <h4 className="font-medium">Strategic Initiative {idx + 1}</h4>
                      <p className="text-sm mt-1">{rec}</p>
                    </Card>
                  ))}
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Operational Improvements</h3>
                
                <div className="space-y-4 mb-4">
                  {recommendations.slice(3).map((rec, idx) => (
                    <Card className="p-4" key={idx}>
                      <h4 className="font-medium">Operational Improvement {idx + 1}</h4>
                      <p className="text-sm mt-1">{rec}</p>
                    </Card>
                  ))}
                </div>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Implementation Roadmap</h3>
                
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium">Phase 1: Quick Wins (0-3 months)</h4>
                    <ul className="space-y-1 list-disc pl-5 mt-2 text-sm">
                      <li>Optimize existing transportation routes</li>
                      <li>Review and adjust safety stock levels</li>
                      <li>Implement basic performance metrics</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium">Phase 2: Process Improvements (3-6 months)</h4>
                    <ul className="space-y-1 list-disc pl-5 mt-2 text-sm">
                      <li>Implement advanced transportation optimization</li>
                      <li>Deploy inventory optimization models</li>
                      <li>Improve demand forecasting accuracy</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium">Phase 3: Strategic Transformation (6-12 months)</h4>
                    <ul className="space-y-1 list-disc pl-5 mt-2 text-sm">
                      <li>Network redesign and facility location optimization</li>
                      <li>Supplier integration and collaboration programs</li>
                      <li>Advanced analytics and AI-driven optimization</li>
                    </ul>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium">Expected ROI</h4>
                    <p className="text-sm mt-1">
                      Implementing these recommendations is expected to yield a 15-20% reduction in total supply chain costs,
                      with an ROI period of 10-14 months and long-term competitive advantages in {industry} supply chain operations.
                    </p>
                  </Card>
                </div>
              </section>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
