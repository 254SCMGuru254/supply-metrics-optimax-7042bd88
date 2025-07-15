
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  MessageSquare, 
  Activity, 
  User, 
  Lightbulb,
  Download,
  Clipboard,
  RefreshCcw
} from 'lucide-react';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 'initial-bot',
      sender: 'bot',
      text: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [apiKey, setApiKey] = useState('');
  const [codeBlocks, setCodeBlocks] = useState<{ id: string; content: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom on new messages
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      // Simulate delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));

      const botResponse = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `This is a simulated response for: "${input}".\n\nHere's a code snippet:\n\`\`\`javascript\nconsole.log("Hello, world!");\n\`\`\``,
      };

      setMessages(prevMessages => [...prevMessages, botResponse]);

      // Extract code blocks
      const newCodeBlocks = extractCodeBlocks(botResponse.text, botResponse.id);
      setCodeBlocks(prevCodeBlocks => [...prevCodeBlocks, ...newCodeBlocks]);
    } catch (error: any) {
      const errorResponse = {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        text: `Error: ${error.message}`,
      };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsThinking(false);
    }
  };

  const extractCodeBlocks = (text: string, messageId: string) => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
    let match;
    const blocks = [];
    let index = 0;

    while ((match = codeRegex.exec(text)) !== null) {
      const [fullMatch, language, content] = match;
      const id = `${messageId}-code-${index++}`;
      blocks.push({ id, content, language });
    }

    return blocks.map(block => ({
      id: block.id,
      content: block.content.trim(),
      language: block.language,
    }));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Code snippet copied to clipboard!",
    });
  };

  const handleRegenerateResponse = async () => {
    // Find the last user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(msg => msg.sender === 'user');

    if (!lastUserMessage) return;

    // Remove the last bot and user messages
    setMessages(prevMessages => {
      const lastUserIndex = prevMessages.findIndex(
        msg => msg.id === lastUserMessage.id
      );
      if (lastUserIndex === -1) return prevMessages;

      return prevMessages.slice(0, lastUserIndex);
    });

    // Re-send the user message
    setInput(lastUserMessage.text);
    await sendMessage();
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto py-6 px-4 space-y-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <MessageSquare className="h-5 w-5" />
              AI Chat Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="model-select" className="text-sm text-muted-foreground">
                  Model:
                </Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="text-sm bg-background">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="secondary">
                <Lightbulb className="h-3 w-3 mr-1.5" />
                Optimized for Supply Chain
              </Badge>
            </div>

            <ScrollArea ref={chatBoxRef} className="h-[400px] p-2 rounded-md">
              <div className="space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`rounded-lg p-3 w-fit max-w-[80%] ${message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                        }`}
                    >
                      {message.text.split('\n').map((line, index) => {
                        const codeBlock = codeBlocks.find(cb =>
                          message.text.includes(cb.content)
                        );

                        if (codeBlock) {
                          return (
                            <div key={index} className="relative">
                              <div className="flex items-center justify-between p-2 bg-gray-800 text-white rounded-md">
                                <span className="text-sm">Code Snippet</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopyCode(codeBlock.content)}
                                >
                                  <Clipboard className="h-4 w-4" />
                                  <span className="sr-only">Copy code</span>
                                </Button>
                              </div>
                              <pre className="bg-gray-900 text-green-300 p-4 rounded-md mt-2 overflow-x-auto">
                                <code className="text-sm">
                                  {codeBlock.content}
                                </code>
                              </pre>
                            </div>
                          );
                        } else {
                          return <p key={index}>{line}</p>;
                        }
                      })}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="rounded-lg p-3 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator />

            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="user avatar" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Input
                type="text"
                placeholder="Enter your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                className="bg-background"
              />
              <Button onClick={sendMessage} disabled={isThinking}>
                Send
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={handleRegenerateResponse}
                disabled={isThinking}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatAssistant;
