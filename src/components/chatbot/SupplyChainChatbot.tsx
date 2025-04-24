
import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

// Define types for messages
type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export const SupplyChainChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your Kenyan Supply Chain Assistant. How can I help you optimize your logistics operations today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const questionAnsweringRef = useRef<any>(null);

  // Load the model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading question-answering model...");
        // Dynamically import to avoid build errors
        if (typeof window !== 'undefined') {
          import('@huggingface/transformers').then(({ pipeline }) => {
            // Use a small question-answering model suitable for browser
            pipeline(
              "question-answering",
              "distilbert-base-cased-distilled-squad",
              { revision: "v1" }
            ).then(model => {
              questionAnsweringRef.current = model;
              console.log("Model loaded successfully");
              setModelLoaded(true);
            });
          }).catch(err => {
            console.error("Error importing transformers:", err);
          });
        }
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Common supply chain knowledge about Kenya
  const kenyaSupplyChainContext = `
    Kenya is a key logistics hub in East Africa with major transport corridors including the Northern Corridor.
    The Port of Mombasa is Kenya's primary maritime gateway handling over 30 million tons annually.
    Kenya's key distribution centers are located in Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret.
    Kenya has developed the Standard Gauge Railway (SGR) connecting Mombasa to Nairobi and Naivasha.
    Common logistics challenges in Kenya include infrastructure gaps, traffic congestion, and security concerns.
    Kenya's major agricultural exports include tea, coffee, flowers, and fresh produce requiring specialized cold chains.
    The Kenya Revenue Authority handles customs clearance through the Integrated Customs Management System.
    Key trade corridors connect Kenya to Uganda, Rwanda, South Sudan, Ethiopia, and Tanzania.
    KES (Kenyan Shilling) is the currency used for local transactions, with an average exchange rate of approximately 100 KES to 1 USD.
    Last-mile delivery in Kenya often relies on motorcycles (boda bodas) in urban areas.
    Kenya's digital payment platform M-Pesa has revolutionized financial transactions in the supply chain.
  `;

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      let responseContent = "";

      // Use the loaded model to answer the question
      if (modelLoaded && questionAnsweringRef.current) {
        const result = await questionAnsweringRef.current({
          question: input,
          context: kenyaSupplyChainContext,
        });
        
        // Format the response
        if (result.score > 0.1) {
          responseContent = result.answer;
        } else {
          responseContent = "I don't have enough information about that specific aspect of Kenyan supply chains. Can I help with something else?";
        }
      } else {
        responseContent = "I'm still loading my knowledge about Kenyan supply chains. Please try again in a moment.";
      }

      // Add assistant's response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Common supply chain knowledge about Kenya
  const kenyaSupplyChainContext = `
    Kenya is a key logistics hub in East Africa with major transport corridors including the Northern Corridor.
    The Port of Mombasa is Kenya's primary maritime gateway handling over 30 million tons annually.
    Kenya's key distribution centers are located in Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret.
    Kenya has developed the Standard Gauge Railway (SGR) connecting Mombasa to Nairobi and Naivasha.
    Common logistics challenges in Kenya include infrastructure gaps, traffic congestion, and security concerns.
    Kenya's major agricultural exports include tea, coffee, flowers, and fresh produce requiring specialized cold chains.
    The Kenya Revenue Authority handles customs clearance through the Integrated Customs Management System.
    Key trade corridors connect Kenya to Uganda, Rwanda, South Sudan, Ethiopia, and Tanzania.
    KES (Kenyan Shilling) is the currency used for local transactions, with an average exchange rate of approximately 100 KES to 1 USD.
    Last-mile delivery in Kenya often relies on motorcycles (boda bodas) in urban areas.
    Kenya's digital payment platform M-Pesa has revolutionized financial transactions in the supply chain.
  `;

  return (
    <Card className="flex flex-col h-[600px] w-full">
      <div className="p-4 bg-primary/10 border-b">
        <h2 className="text-xl font-semibold">Kenya Supply Chain Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Ask questions about Kenyan logistics, optimization, and supply chain management
        </p>
      </div>

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
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
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
            placeholder="Ask about Kenyan supply chains, logistics, or optimization..."
            className="min-h-[60px] flex-1"
            disabled={isProcessing || !modelLoaded}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing || !modelLoaded}
            className="h-full"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {!modelLoaded && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center">
            <Loader2 className="h-3 w-3 animate-spin mr-2" />
            Loading Kenyan supply chain knowledge...
          </p>
        )}
      </div>
    </Card>
  );
};
