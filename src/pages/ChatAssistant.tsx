
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  BotIcon as Bot, 
  User, 
  Zap, 
  BarChart3,
  Network,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'chart' | 'recommendation';
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Supply Chain AI Assistant. I can help you with optimization strategies, data analysis, and answering questions about supply chain management. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    let response = "";
    let type: 'text' | 'chart' | 'recommendation' = 'text';

    if (input.includes('optimization') || input.includes('optimize')) {
      response = "I can help you optimize your supply chain! Here are some key strategies:\n\n1. **Network Optimization**: Use the Center of Gravity model to find optimal facility locations\n2. **Inventory Management**: Implement ABC analysis for better inventory control\n3. **Route Optimization**: Use TSP and VRP algorithms to minimize transportation costs\n4. **Demand Forecasting**: Leverage machine learning for accurate demand prediction\n\nWhich area would you like to focus on?";
      type = 'recommendation';
    } else if (input.includes('cost') || input.includes('savings')) {
      response = "Cost optimization is crucial for supply chain efficiency. Based on industry benchmarks:\n\n• Transportation typically accounts for 35-50% of total logistics costs\n• Inventory holding costs usually represent 20-30% of inventory value annually\n• Warehouse operations can be optimized to reduce costs by 15-25%\n\nWould you like me to run a cost analysis for your specific case?";
      type = 'recommendation';
    } else if (input.includes('inventory') || input.includes('stock')) {
      response = "Inventory management is a critical component of supply chain optimization. Here's what I recommend:\n\n**ABC Analysis**: Categorize items based on value contribution\n**EOQ Model**: Calculate optimal order quantities\n**Safety Stock**: Maintain appropriate buffer levels\n**Reorder Points**: Set automatic replenishment triggers\n\nThe system can perform these calculations automatically. Would you like me to guide you through setting up inventory optimization?";
      type = 'recommendation';
    } else if (input.includes('route') || input.includes('delivery')) {
      response = "Route optimization can significantly reduce transportation costs and improve delivery times. Our system uses:\n\n🚚 **TSP (Traveling Salesman Problem)**: For single vehicle routing\n🚛 **VRP (Vehicle Routing Problem)**: For multi-vehicle optimization\n📍 **Real-time Traffic**: Integration with traffic data for dynamic routing\n⏱️ **Time Windows**: Delivery scheduling optimization\n\nWould you like to set up route optimization for your delivery network?";
      type = 'recommendation';
    } else if (input.includes('forecast') || input.includes('demand')) {
      response = "Demand forecasting is essential for supply chain planning. Our AI models include:\n\n📊 **Time Series Analysis**: ARIMA, Exponential Smoothing\n🧠 **Machine Learning**: Neural Networks, Random Forest\n📈 **Seasonal Patterns**: Automatic seasonality detection\n🔍 **External Factors**: Economic indicators, weather data\n\nThe system can achieve 85-95% accuracy depending on data quality. Would you like to set up demand forecasting for your products?";
      type = 'recommendation';
    } else if (input.includes('help') || input.includes('how')) {
      response = "I'm here to help with all aspects of supply chain optimization! Here's what I can assist you with:\n\n🔧 **Setup & Configuration**: Guide you through system setup\n📊 **Data Analysis**: Help interpret results and metrics\n🎯 **Optimization Strategies**: Recommend best practices\n📈 **Performance Monitoring**: Track KPIs and improvements\n🔍 **Troubleshooting**: Resolve issues and errors\n\nWhat specific area would you like help with?";
    } else {
      response = "I understand you're asking about supply chain optimization. Let me provide you with some relevant insights:\n\nOur platform offers comprehensive supply chain optimization tools including network design, inventory management, route optimization, and demand forecasting. Each module uses advanced algorithms and AI to deliver optimal solutions.\n\nFor more specific help, you could ask about:\n• Network optimization strategies\n• Inventory management techniques\n• Route and logistics optimization\n• Cost analysis and reduction\n• Demand forecasting methods\n\nWhat would you like to explore first?";
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'assistant',
      timestamp: new Date(),
      type
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: "Optimize Network", icon: Network, action: () => setInputValue("How can I optimize my supply chain network?") },
    { label: "Reduce Costs", icon: TrendingUp, action: () => setInputValue("What are the best ways to reduce supply chain costs?") },
    { label: "Inventory Analysis", icon: BarChart3, action: () => setInputValue("Help me with inventory optimization") },
    { label: "Route Planning", icon: Settings, action: () => setInputValue("How do I optimize delivery routes?") }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Supply Chain Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Get expert guidance on supply chain optimization strategies
          </p>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm h-[600px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Chat with Supply Chain Expert
              <Badge variant="secondary" className="ml-auto">
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'recommendation'
                        ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'assistant' && (
                        <Bot className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 text-white mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="text-xs"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about supply chain optimization..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={sendMessage} disabled={isTyping || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatAssistant;
