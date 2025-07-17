import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  MessageSquare,
  Clipboard
} from 'lucide-react';

const ChatAssistant = () => {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">AI Chat Assistant</h2>
        <p className="text-gray-700 dark:text-gray-200">
          Get instant help with your supply chain optimization questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with AI
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Ask questions about optimization strategies and best practices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Send className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Real-time assistance available</span>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Clipboard className="mr-2 h-5 w-5" />
              Knowledge Base
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Access our comprehensive documentation and guides.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Browse through detailed explanations and examples.
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">Browse Knowledge Base</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatAssistant;
