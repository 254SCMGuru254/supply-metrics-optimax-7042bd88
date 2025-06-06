
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calculator, FileText, Truck, Box, BarChart3, Building, Upload } from "lucide-react";
import { SupplyChainReportGenerator } from "./SupplyChainReportGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SupplyChainDesignAssistant = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Supply Chain Design Assistant. I can help you design and optimize your supply chain. What specific aspect would you like help with today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to conversation
    const userMessage = {
      role: "user",
      content: message
    };
    
    setConversation(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response (in production this would call an actual AI service)
    setTimeout(() => {
      // Use predefined responses based on keywords for demo purposes
      let response = "I understand your question about supply chain design. Could you provide more specific details about your supply chain needs so I can give you a more tailored response?";
      
      const lowerCaseMessage = message.toLowerCase();
      
      if (lowerCaseMessage.includes("inventory") || lowerCaseMessage.includes("stock")) {
        response = "For inventory optimization, I recommend analyzing your demand patterns and using EOQ (Economic Order Quantity) models. Would you like me to help you calculate optimal inventory levels based on your demand data and carrying costs?";
      } 
      else if (lowerCaseMessage.includes("route") || lowerCaseMessage.includes("transport") || lowerCaseMessage.includes("delivery")) {
        response = "Route optimization can significantly reduce transportation costs and delivery times. Consider factors like vehicle capacity, delivery windows, and multi-stop routing. Would you like to explore different transportation modes or specific route optimization algorithms?";
      }
      else if (lowerCaseMessage.includes("warehouse") || lowerCaseMessage.includes("location") || lowerCaseMessage.includes("facility")) {
        response = "For warehouse location optimization, we should consider the center of gravity method or network optimization models that account for demand density, transportation costs, and service level requirements. Would you like me to analyze potential facility locations based on your customer distribution?";
      }
      else if (lowerCaseMessage.includes("report") || lowerCaseMessage.includes("analysis")) {
        response = "I can help you generate a comprehensive supply chain analysis report. This would include inventory status, transportation efficiency, facility utilization, and cost breakdowns. You can customize the report in the Reports tab of this assistant.";
      }
      else if (lowerCaseMessage.includes("cost") || lowerCaseMessage.includes("expense")) {
        response = "Cost optimization in supply chains requires a holistic approach. We should analyze transportation costs, inventory holding costs, facility operation costs, and order processing costs. Would you like to identify specific cost-saving opportunities in your supply chain network?";
      }
      
      const assistantMessage = {
        role: "assistant",
        content: response
      };
      
      setConversation(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat">AI Chat Assistant</TabsTrigger>
          <TabsTrigger value="report">Supply Chain Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">Supply Chain Design Chat</h2>
                </div>
                
                <div className="border rounded-md h-[400px] mb-4 overflow-y-auto p-4 bg-muted/30">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${msg.role === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'}`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <div
                        className={`text-xs mt-1 text-muted-foreground ${
                          msg.role === 'user' ? 'text-right' : ''
                        }`}
                      >
                        {msg.role === 'user' ? 'You' : 'Supply Chain AI'}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-1 p-2 w-16 rounded-full bg-muted">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask about supply chain design, optimization strategies, or inventory management..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="resize-none"
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !message.trim()}>Send</Button>
                </div>
              </Card>
            </div>
            
            <div>
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Design Assistant Features</h2>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Route Optimization</h3>
                      <p className="text-xs text-muted-foreground">
                        Design optimal delivery routes and transportation strategies
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Box className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Inventory Planning</h3>
                      <p className="text-xs text-muted-foreground">
                        Optimize stock levels and replenishment strategies
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Network Design</h3>
                      <p className="text-xs text-muted-foreground">
                        Optimize facility locations and distribution network
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Cost Analysis</h3>
                      <p className="text-xs text-muted-foreground">
                        Analyze and optimize total supply chain costs
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Custom Reports</h3>
                      <p className="text-xs text-muted-foreground">
                        Generate detailed supply chain analysis reports
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium text-sm mb-2">Upload Your Data</h3>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Supply Chain Data
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload your supply chain data for personalized analysis and recommendations
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="report" className="mt-6">
          <SupplyChainReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplyChainDesignAssistant;
