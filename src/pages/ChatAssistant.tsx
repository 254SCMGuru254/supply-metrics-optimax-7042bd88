
import { SupplyChainChatbot } from "@/components/chatbot/SupplyChainChatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquareQuote, BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const ChatAssistant = () => {
  const sampleQuestions = [
    "What are the main logistics corridors in Kenya?",
    "How does the Standard Gauge Railway impact supply chains?",
    "What are common challenges in Kenyan last-mile delivery?",
    "How do seasonal weather patterns affect Kenyan supply chains?",
    "What is the role of Mombasa port in East African logistics?",
    "How can I optimize distribution routes in Nairobi?"
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kenya Supply Chain Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Get instant answers to your supply chain questions in a Kenyan context
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SupplyChainChatbot />
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MessageSquareQuote className="h-5 w-5" />
              Sample Questions
            </h3>
            <div className="mt-4 space-y-2">
              {sampleQuestions.map((question, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => {
                    // This would be connected to the chatbot in a real implementation
                    // For now just log to console
                    console.log("Sample question selected:", question);
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Assistant Capabilities
            </h3>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>Answer questions about Kenyan logistics</li>
              <li>Provide information on supply chain optimization</li>
              <li>Explain Kenyan transportation networks</li>
              <li>Share best practices for Kenyan distribution</li>
              <li>Give context on local business regulations</li>
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Data Sources
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This assistant uses natural language processing to provide information from 
              trusted sources including Kenya Ports Authority, Kenya National Bureau of 
              Statistics, and academic research on East African logistics.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
