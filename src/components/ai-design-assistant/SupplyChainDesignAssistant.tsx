import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import SupplyChainReportGenerator from "./SupplyChainReportGenerator";
import { Send, Bot, User, Loader2, ChevronRight, Package, Truck, Building2, Download } from "lucide-react";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type NetworkNode = {
  id: string;
  type: 'supplier' | 'manufacturer' | 'warehouse' | 'distributor' | 'retailer';
  name: string;
  location?: string;
  capacity?: number;
  costs?: Record<string, number>;
};

type NetworkEdge = {
  id: string;
  source: string;
  target: string;
  cost: number;
  time: number;
  distance: number;
  mode: 'truck' | 'rail' | 'air' | 'sea';
};

export const SupplyChainDesignAssistant = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: 'assistant',
      content: "Hello, I'm your Supply Chain Design Assistant. I can help you design, analyze and optimize your supply chain structure. What aspects of your supply chain would you like to work on today?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [network, setNetwork] = useState<{nodes: NetworkNode[], edges: NetworkEdge[]}>({
    nodes: [],
    edges: []
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput
    };
    
    setMessages(prev => [...prev, newMessage]);
    setUserInput("");
    setLoading(true);
    
    try {
      // Simulate AI response (in a real app, this would call an API)
      setTimeout(() => {
        respondToMessage(userInput);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };
  
  const respondToMessage = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Check input for supply chain context and provide relevant response
    let response = "";
    if (lowerInput.includes("design") || lowerInput.includes("structure")) {
      response = "To design an effective supply chain structure, we should consider your key suppliers, manufacturing locations, distribution centers, and customer locations. Would you like to start building a visual model of your network?";
      
      // Add sample nodes when mentioning design
      if (network.nodes.length === 0) {
        setNetwork({
          nodes: [
            { id: "s1", type: "supplier", name: "Raw Materials Supplier" },
            { id: "m1", type: "manufacturer", name: "Main Production Plant" },
            { id: "w1", type: "warehouse", name: "Central Warehouse" },
            { id: "r1", type: "retailer", name: "Retail Store 1" }
          ],
          edges: [
            { id: "e1", source: "s1", target: "m1", cost: 150, time: 2, distance: 500, mode: "truck" },
            { id: "e2", source: "m1", target: "w1", cost: 100, time: 1, distance: 300, mode: "truck" },
            { id: "e3", source: "w1", target: "r1", cost: 75, time: 1, distance: 200, mode: "truck" }
          ]
        });
      }
    } else if (lowerInput.includes("optimi") || lowerInput.includes("cost")) {
      response = "For supply chain optimization, we can model key factors like transportation costs, inventory policies, and facility locations. Based on industry benchmarks, optimizing your network could reduce overall logistics costs by 10-15%. Would you like to focus on cost optimization, service level improvement, or both?";
    } else if (lowerInput.includes("report") || lowerInput.includes("analysis")) {
      response = "I can generate a comprehensive supply chain analysis report for you. The report will include network visualization, cost breakdown, improvement opportunities, and recommended next steps. To get started, switch to the 'Report' tab.";
    } else if (lowerInput.includes("inventory") || lowerInput.includes("stock")) {
      response = "For inventory optimization, we should analyze your demand patterns, lead times, and service level targets. Using models like EOQ (Economic Order Quantity) and safety stock calculations, we can determine optimal inventory levels. Would you like to focus on specific product categories for inventory analysis?";
    } else if (lowerInput.includes("transport") || lowerInput.includes("route") || lowerInput.includes("logistics")) {
      response = "Transportation optimization can significantly impact your supply chain costs and service levels. By analyzing routes, modes of transport, and shipment consolidation opportunities, we can identify potential savings. Would you like to model different transportation scenarios?";
    } else {
      response = "Thank you for your input. To help you design an optimal supply chain, I can assist with network design, inventory policies, transportation optimization, facility location analysis, and supply chain simulation. What specific aspect would you like to explore first?";
    }
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const exportNetworkData = () => {
    const dataStr = JSON.stringify(network, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileName = `supply_chain_network_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileName);
    linkElement.click();
    
    toast({
      title: "Export Successful",
      description: "Network data has been exported as JSON",
    });
  };
  
  // Get node icon by type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'supplier':
        return <Package className="h-4 w-4" />;
      case 'manufacturer':
        return <Building2 className="h-4 w-4" />;
      case 'warehouse':
        return <Package className="h-4 w-4" />;
      case 'distributor':
      case 'retailer':
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
        <TabsTrigger value="network">Network Visualization</TabsTrigger>
        <TabsTrigger value="report">Generate Report</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="space-y-4">
        <Card className="p-4 h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}>
                <div className={`flex max-w-[80%] ${msg.role === 'assistant' ? 'items-start' : 'items-end'}`}>
                  {msg.role === 'assistant' && (
                    <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg p-3 ${
                    msg.role === 'assistant' 
                      ? 'bg-muted text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="bg-background border h-8 w-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex items-center mt-auto">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about supply chain design, optimization, or analysis..."
              className="flex-1"
              disabled={loading}
            />
            <Button 
              onClick={handleSendMessage}
              className="ml-2"
              disabled={loading || !userInput.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">Suggested Topics</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setUserInput("How do I design an optimal distribution network?")}>
              Distribution Network Design <ChevronRight className="h-3 w-3 ml-1" />
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setUserInput("What's the optimal inventory policy for my products?")}>
              Inventory Policies <ChevronRight className="h-3 w-3 ml-1" />
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setUserInput("How can I optimize transportation costs?")}>
              Transportation Optimization <ChevronRight className="h-3 w-3 ml-1" />
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setUserInput("Can you help me with supplier selection?")}>
              Supplier Selection <ChevronRight className="h-3 w-3 ml-1" />
            </Badge>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="network">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Supply Chain Network</h2>
            <Button variant="outline" size="sm" onClick={exportNetworkData}>
              <Download className="h-4 w-4 mr-2" />
              Export Network
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-2">Network Nodes</h3>
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                {network.nodes.length > 0 ? (
                  <ul className="space-y-2">
                    {network.nodes.map(node => (
                      <li key={node.id} className="flex items-center p-2 border rounded-md">
                        <div className="p-1 bg-primary/10 rounded-md mr-2">
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <p className="font-medium">{node.name}</p>
                          <p className="text-xs text-muted-foreground">{node.type}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No nodes in the network yet. Start a conversation to build your network.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Network Connections</h3>
              <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                {network.edges.length > 0 ? (
                  <ul className="space-y-2">
                    {network.edges.map(edge => {
                      const sourceNode = network.nodes.find(n => n.id === edge.source);
                      const targetNode = network.nodes.find(n => n.id === edge.target);
                      
                      return (
                        <li key={edge.id} className="p-2 border rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">
                              {sourceNode?.name} → {targetNode?.name}
                            </span>
                            <Badge variant="outline">{edge.mode}</Badge>
                          </div>
                          <div className="grid grid-cols-3 text-xs text-muted-foreground">
                            <span>Cost: ${edge.cost}</span>
                            <span>Time: {edge.time} days</span>
                            <span>Distance: {edge.distance} km</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No connections in the network yet. Start a conversation to build your network.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Textarea 
              placeholder="Network visualization will be displayed here in a more complete implementation..."
              value="// A complete implementation would render an interactive network graph here
// using libraries like vis.js, react-force-graph, or d3.js"
              disabled
              rows={6}
              className="font-mono text-xs"
            />
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="report">
        <SupplyChainReportGenerator />
      </TabsContent>
    </Tabs>
  );
};

export default SupplyChainDesignAssistant;
