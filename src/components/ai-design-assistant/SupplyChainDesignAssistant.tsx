
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ArrowDown, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { NetworkMap } from "@/components/NetworkMap";
import { Node, Route } from "@/components/map/MapTypes";
import { SupplyChainReportGenerator } from "./SupplyChainReportGenerator";

type MessageRole = "user" | "assistant" | "system";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Industry-specific design patterns
const DESIGN_PATTERNS = {
  agriculture: [
    "Farm-to-Table Direct Distribution",
    "Agricultural Cooperative Model",
    "Cold Chain for Fresh Produce",
    "Regional Distribution Hub"
  ],
  manufacturing: [
    "Just-in-Time Manufacturing",
    "Vendor-Managed Inventory",
    "Postponement Strategy",
    "Cellular Manufacturing"
  ],
  retail: [
    "Omnichannel Distribution",
    "Cross-Docking",
    "Ship-from-Store",
    "Drop-Shipping"
  ],
  pharmaceuticals: [
    "Temperature-Controlled Distribution",
    "Track & Trace Compliance",
    "Pharmacy Hub-and-Spoke",
    "Direct-to-Patient"
  ],
  technology: [
    "Configure-to-Order",
    "Direct-to-Consumer",
    "Reverse Logistics",
    "Regional Fulfillment Centers"
  ]
};

// KPIs for different industry types
const INDUSTRY_KPIS = {
  agriculture: [
    "Crop Yield Rate", "Storage Loss Percentage", "Transportation Freshness", "Farm-to-Market Time"
  ],
  manufacturing: [
    "Production Cycle Time", "Inventory Turnover Rate", "Capacity Utilization", "Defect Rate"
  ],
  retail: [
    "Out-of-Stock Percentage", "Inventory Accuracy", "Perfect Order Rate", "GMROI"
  ],
  pharmaceuticals: [
    "Temperature Excursion Rate", "Compliance Rate", "Serialization Accuracy", "Expiry Management"
  ],
  technology: [
    "Component Lead Time", "BOM Accuracy", "NPI Cycle Time", "Engineering Change Order Time"
  ]
};

export const SupplyChainDesignAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to the Supply Chain Design Assistant. How can I help you design or optimize your supply chain today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("agriculture");
  const [networkNodes, setNetworkNodes] = useState<Node[]>([]);
  const [networkRoutes, setNetworkRoutes] = useState<Route[]>([]);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [designPatterns, setDesignPatterns] = useState<string[]>(DESIGN_PATTERNS.agriculture);
  const [designKpis, setDesignKpis] = useState<string[]>(INDUSTRY_KPIS.agriculture);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Supply chain design state
  const [supplyChainTiers, setSupplyChainTiers] = useState<{
    suppliers: { name: string; type: string; location: string }[];
    manufacturing: { name: string; capacity: number; location: string }[];
    distribution: { name: string; capacity: number; location: string }[];
    retail: { name: string; demand: number; location: string }[];
  }>({
    suppliers: [],
    manufacturing: [],
    distribution: [],
    retail: []
  });

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update patterns when industry changes
  useEffect(() => {
    setDesignPatterns(DESIGN_PATTERNS[selectedIndustry as keyof typeof DESIGN_PATTERNS] || []);
    setDesignKpis(INDUSTRY_KPIS[selectedIndustry as keyof typeof INDUSTRY_KPIS] || []);
  }, [selectedIndustry]);

  // Send message to AI assistant
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      // Process the user message
      const assistantResponse = await processDesignRequest(input, selectedIndustry);
      
      // Update network visualization if relevant
      if (assistantResponse.nodes && assistantResponse.routes) {
        setNetworkNodes(assistantResponse.nodes);
        setNetworkRoutes(assistantResponse.routes);
      }
      
      // Update supply chain design if relevant
      if (assistantResponse.design) {
        setSupplyChainTiers(current => ({
          ...current,
          ...assistantResponse.design
        }));
      }

      // Add assistant's response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantResponse.message,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      
      toast({
        title: "Processing Error",
        description: "Sorry, I encountered an error processing your design request.",
        variant: "destructive"
      });
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your supply chain design request. Can you please try again with more specific details?",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process design request (simulate AI processing)
  const processDesignRequest = async (input: string, industry: string) => {
    // In a real application, this would call an AI service
    // For demo purposes, we'll do simple parsing and response generation
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const inputLower = input.toLowerCase();
    const response: {
      message: string;
      nodes?: Node[];
      routes?: Route[];
      design?: any;
    } = {
      message: ""
    };
    
    // Check for design-related keywords
    if (inputLower.includes("design") || inputLower.includes("create") || inputLower.includes("build")) {
      response.message = `Based on your request, I recommend designing a ${industry} supply chain with the following components:\n\n`;
      response.message += `1. **Suppliers**: Local producers with sustainable practices\n`;
      response.message += `2. **Manufacturing/Processing**: Regional facilities with flexible capacity\n`;
      response.message += `3. **Distribution**: Hub-and-spoke model with cross-docking capabilities\n`;
      response.message += `4. **Retail/Delivery**: Multiple channels including direct-to-consumer options\n\n`;
      response.message += `For your ${industry} supply chain, consider implementing these best practices:\n`;
      response.message += `- ${designPatterns[0]}\n- ${designPatterns[1]}\n`;
      response.message += `\nI've created a basic network visualization that you can view in the Network tab.`;
      
      // Generate sample network
      response.nodes = generateSampleNetwork(industry);
      response.routes = generateSampleRoutes(response.nodes);
      
      // Generate design components
      response.design = generateSupplyChainDesign(industry);
    }
    else if (inputLower.includes("optimize") || inputLower.includes("improve")) {
      response.message = `To optimize your ${industry} supply chain, I recommend focusing on these key metrics:\n\n`;
      response.message += `1. **${designKpis[0]}**: Aim for industry benchmark of +15%\n`;
      response.message += `2. **${designKpis[1]}**: Reduce by 20% through improved processes\n`;
      response.message += `3. **${designKpis[2]}**: Implement monitoring systems for real-time tracking\n\n`;
      response.message += `Consider implementing these optimization techniques:\n`;
      response.message += `- Route optimization using vehicle routing problem algorithms\n`;
      response.message += `- Inventory optimization using multi-echelon models\n`;
      response.message += `- Strategic facility location using center-of-gravity analysis\n\n`;
      response.message += `I've updated the network visualization with optimized routes in the Network tab.`;
      
      // Generate optimized network
      response.nodes = generateSampleNetwork(industry);
      response.routes = generateOptimizedRoutes(response.nodes);
    }
    else if (inputLower.includes("report") || inputLower.includes("analysis")) {
      response.message = `I've prepared a comprehensive analysis of a typical ${industry} supply chain:\n\n`;
      response.message += `**Supply Chain Performance Summary**\n`;
      response.message += `- Current order fulfillment rate: 92%\n`;
      response.message += `- Average lead time: 4.2 days\n`;
      response.message += `- Inventory turnover: 12.5 times per year\n`;
      response.message += `- Cost breakdown: 40% transportation, 35% inventory, 25% operations\n\n`;
      response.message += `**Improvement Opportunities**\n`;
      response.message += `1. Reduce lead time by 15% through process streamlining\n`;
      response.message += `2. Improve forecast accuracy by implementing advanced analytics\n`;
      response.message += `3. Optimize transportation routes to reduce costs by 10%\n\n`;
      response.message += `You can view the full report by switching to the Reports tab.`;
    }
    else {
      response.message = `Thank you for your question about ${industry} supply chains. To provide specific design recommendations, I need a bit more information:\n\n`;
      response.message += `1. What are your main supply chain objectives? (cost reduction, service level, sustainability)\n`;
      response.message += `2. What is the geographic scope of your operations? (local, regional, global)\n`;
      response.message += `3. What volumes are you handling? (units, tons, etc.)\n\n`;
      response.message += `You can also try asking me to:\n`;
      response.message += `- "Design an optimized supply chain for small-scale organic farming"\n`;
      response.message += `- "Optimize my manufacturing network for cost reduction"\n`;
      response.message += `- "Create a supply chain report for a retail business"\n`;
    }
    
    return response;
  };

  // Generate sample network nodes based on industry
  const generateSampleNetwork = (industry: string): Node[] => {
    const nodes: Node[] = [];
    
    // Location pairs for different industry types (simplified)
    const locationPairs = {
      agriculture: [
        { lat: -1.2921, lng: 36.8219, name: "Nairobi Distribution" },
        { lat: -4.0435, lng: 39.6682, name: "Mombasa Port" },
        { lat: -0.0917, lng: 34.7679, name: "Kisumu Processing" },
        { lat: -0.2747, lng: 36.0798, name: "Nakuru Farm Hub" },
        { lat: 0.5157, lng: 35.0800, name: "Eldoret Farm Hub" }
      ],
      manufacturing: [
        { lat: -1.2921, lng: 36.8219, name: "Nairobi Factory" },
        { lat: -4.0435, lng: 39.6682, name: "Mombasa Warehouse" },
        { lat: -0.0917, lng: 34.7679, name: "Kisumu Assembly" },
        { lat: -0.2747, lng: 36.0798, name: "Nakuru Distribution" },
        { lat: 0.5157, lng: 35.0800, name: "Eldoret Raw Materials" }
      ],
      retail: [
        { lat: -1.2921, lng: 36.8219, name: "Nairobi Retail Hub" },
        { lat: -4.0435, lng: 39.6682, name: "Mombasa Store" },
        { lat: -0.0917, lng: 34.7679, name: "Kisumu Store" },
        { lat: -0.2747, lng: 36.0798, name: "Nakuru Store" },
        { lat: 0.5157, lng: 35.0800, name: "Eldoret Distribution" }
      ]
    };
    
    const locations = locationPairs[industry as keyof typeof locationPairs] || locationPairs.agriculture;
    
    // Create nodes for each location
    locations.forEach((loc, index) => {
      const nodeTypes = ["supplier", "warehouse", "distribution", "retail", "manufacturing"];
      nodes.push({
        id: `node-${index}`,
        name: loc.name,
        type: nodeTypes[index % nodeTypes.length],
        latitude: loc.lat,
        longitude: loc.lng
      });
    });
    
    return nodes;
  };

  // Generate sample routes between nodes
  const generateSampleRoutes = (nodes: Node[]): Route[] => {
    const routes: Route[] = [];
    
    // Create routes connecting nodes
    for (let i = 0; i < nodes.length - 1; i++) {
      routes.push({
        id: `route-${i}`,
        from: nodes[i].id,
        to: nodes[i+1].id,
        volume: Math.floor(Math.random() * 50) + 50,
        transitTime: Math.floor(Math.random() * 12) + 4
      });
    }
    
    // Add return route to create a loop
    if (nodes.length > 2) {
      routes.push({
        id: `route-return`,
        from: nodes[nodes.length-1].id,
        to: nodes[0].id,
        volume: Math.floor(Math.random() * 50) + 50,
        transitTime: Math.floor(Math.random() * 12) + 4
      });
    }
    
    return routes;
  };

  // Generate optimized routes (simulating optimization)
  const generateOptimizedRoutes = (nodes: Node[]): Route[] => {
    const routes: Route[] = [];
    
    // Create optimized routes (in a real app, this would use actual optimization algorithms)
    for (let i = 0; i < nodes.length - 1; i++) {
      routes.push({
        id: `route-opt-${i}`,
        from: nodes[i].id,
        to: nodes[i+1].id,
        type: i % 2 === 0 ? "road" : "rail",
        volume: Math.floor(Math.random() * 50) + 50,
        transitTime: Math.floor(Math.random() * 8) + 2, // Optimized times are shorter
        cost: Math.floor(Math.random() * 500) + 300,
        isOptimized: true
      });
    }
    
    // Add optimized return route
    if (nodes.length > 2) {
      routes.push({
        id: `route-opt-return`,
        from: nodes[nodes.length-1].id,
        to: nodes[0].id,
        type: "road",
        volume: Math.floor(Math.random() * 50) + 50,
        transitTime: Math.floor(Math.random() * 8) + 2,
        cost: Math.floor(Math.random() * 500) + 300,
        isOptimized: true
      });
    }
    
    return routes;
  };

  // Generate supply chain design components
  const generateSupplyChainDesign = (industry: string) => {
    // In a real application, this would be more sophisticated
    const designComponents: any = {};
    
    if (industry === "agriculture") {
      designComponents.suppliers = [
        { name: "Local Farm Cooperative", type: "Produce", location: "Nakuru" },
        { name: "Organic Growers Association", type: "Organic Produce", location: "Eldoret" }
      ];
      designComponents.manufacturing = [
        { name: "Central Processing Facility", capacity: 1000, location: "Kisumu" }
      ];
    } else if (industry === "manufacturing") {
      designComponents.suppliers = [
        { name: "Raw Material Supplier", type: "Components", location: "Mombasa" },
        { name: "Electronic Components", type: "Electronics", location: "Nairobi" }
      ];
      designComponents.manufacturing = [
        { name: "Main Assembly Plant", capacity: 5000, location: "Nairobi" },
        { name: "Secondary Production", capacity: 2500, location: "Kisumu" }
      ];
    } else if (industry === "retail") {
      designComponents.suppliers = [
        { name: "Wholesale Distributor", type: "General Merchandise", location: "Mombasa" }
      ];
      designComponents.distribution = [
        { name: "Regional Distribution Center", capacity: 8000, location: "Nairobi" },
        { name: "Local Fulfillment Hub", capacity: 3000, location: "Eldoret" }
      ];
      designComponents.retail = [
        { name: "Flagship Store", demand: 1200, location: "Nairobi" },
        { name: "Mall Location", demand: 800, location: "Kisumu" },
        { name: "Downtown Store", demand: 600, location: "Mombasa" }
      ];
    }
    
    return designComponents;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Supply Chain Design Assistant</h2>
          <p className="text-muted-foreground">
            Get AI-powered design recommendations for your supply chain
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList>
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="network">Network Visualization</TabsTrigger>
          <TabsTrigger value="report">Reports & Analysis</TabsTrigger>
          <TabsTrigger value="design">Design Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col min-h-[500px]">
          <Card className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about supply chain design, optimization, or request analysis..."
                  className="min-h-[60px] flex-1"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isProcessing}
                  className="h-full"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="network" className="min-h-[500px]">
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Supply Chain Network Visualization</h3>
              <p className="text-sm text-muted-foreground">
                Visual representation of the supply chain network based on your design inputs
              </p>
            </div>
            <div className="h-[500px] border rounded-md overflow-hidden">
              <NetworkMap
                nodes={networkNodes}
                routes={networkRoutes}
                isOptimized={true}
              />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="report" className="min-h-[500px]">
          <SupplyChainReportGenerator 
            industry={selectedIndustry} 
            networkNodes={networkNodes}
            networkRoutes={networkRoutes}
          />
        </TabsContent>
        
        <TabsContent value="design" className="min-h-[500px]">
          <Card className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Supply Chain Design Components</h3>
              <p className="text-sm text-muted-foreground">
                Detailed breakdown of your supply chain design elements
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-2">Suppliers</h4>
                <div className="space-y-3">
                  {supplyChainTiers.suppliers && supplyChainTiers.suppliers.length > 0 ? (
                    supplyChainTiers.suppliers.map((supplier, idx) => (
                      <Card key={idx} className="p-3">
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">Type: {supplier.type}</div>
                        <div className="text-sm text-muted-foreground">Location: {supplier.location}</div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No suppliers defined</div>
                  )}
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-2">Manufacturing</h4>
                <div className="space-y-3">
                  {supplyChainTiers.manufacturing && supplyChainTiers.manufacturing.length > 0 ? (
                    supplyChainTiers.manufacturing.map((facility, idx) => (
                      <Card key={idx} className="p-3">
                        <div className="font-medium">{facility.name}</div>
                        <div className="text-sm text-muted-foreground">Capacity: {facility.capacity} units</div>
                        <div className="text-sm text-muted-foreground">Location: {facility.location}</div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No manufacturing facilities defined</div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium mb-2">Distribution</h4>
                <div className="space-y-3">
                  {supplyChainTiers.distribution && supplyChainTiers.distribution.length > 0 ? (
                    supplyChainTiers.distribution.map((center, idx) => (
                      <Card key={idx} className="p-3">
                        <div className="font-medium">{center.name}</div>
                        <div className="text-sm text-muted-foreground">Capacity: {center.capacity} units</div>
                        <div className="text-sm text-muted-foreground">Location: {center.location}</div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No distribution centers defined</div>
                  )}
                </div>
                
                <h4 className="text-md font-medium mt-6 mb-2">Retail/End Points</h4>
                <div className="space-y-3">
                  {supplyChainTiers.retail && supplyChainTiers.retail.length > 0 ? (
                    supplyChainTiers.retail.map((outlet, idx) => (
                      <Card key={idx} className="p-3">
                        <div className="font-medium">{outlet.name}</div>
                        <div className="text-sm text-muted-foreground">Demand: {outlet.demand} units</div>
                        <div className="text-sm text-muted-foreground">Location: {outlet.location}</div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No retail outlets defined</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-medium mb-2">Recommended Design Patterns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {designPatterns.map((pattern, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="font-medium">{pattern}</div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Key Performance Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {designKpis.map((kpi, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="font-medium">{kpi}</div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplyChainDesignAssistant;
