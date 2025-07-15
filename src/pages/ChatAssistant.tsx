import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  MessageSquare,
  ClipboardList
} from 'lucide-react';

const ChatAssistant = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">AI Chat Assistant</h2>
        <p className="text-muted-foreground">
          Get instant help with your supply chain optimization questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with AI
            </CardTitle>
            <CardDescription>Ask questions about optimization strategies and best practices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Send className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Real-time assistance available</span>
            </div>
            <Button>Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Knowledge Base
            </CardTitle>
            <CardDescription>Access our comprehensive documentation and guides.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Browse through detailed explanations and examples.
            </p>
            <Button>Browse Knowledge Base</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatAssistant;
