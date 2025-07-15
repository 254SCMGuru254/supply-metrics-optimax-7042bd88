import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  MessageCircle as MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send, 
  FileText, 
  Video, 
  Users 
} from 'lucide-react';

const faqs = [
  {
    question: "How do I optimize my supply chain network?",
    answer: "You can use our Network Optimization tool to model your supply chain and identify cost-saving opportunities.",
  },
  {
    question: "What is the Center of Gravity method?",
    answer: "The Center of Gravity method helps you determine the optimal location for a new facility based on weighted distances.",
  },
  {
    question: "How can I reduce inventory costs?",
    answer: "Our Inventory Management tool provides insights into your inventory levels and helps you optimize your ordering policies.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer email, phone, and chat support. We also have a comprehensive documentation library.",
  },
];

const Support = () => {
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto py-12 px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Need Assistance? We're Here to Help!
          </h1>
          <p className="text-muted-foreground text-lg">
            Contact our support team or browse our FAQs for quick answers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Support Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Your Name</Label>
                    <Input type="text" id="name" placeholder="John Doe" className="bg-background text-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input type="email" id="email" placeholder="john.doe@example.com" className="bg-background text-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-foreground">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-background text-foreground"
                    />
                  </div>
                  <Button disabled={isSubmitted} className="w-full">
                    {isSubmitted ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5" />
                  Team Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Support Agent 1" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Jane Doe</h3>
                  <p className="text-xs text-muted-foreground">
                    Support Agent <Badge className="ml-2">Online</Badge>
                  </p>
                </div>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Support Agent 2" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium text-foreground">John Smith</h3>
                  <p className="text-xs text-muted-foreground">
                    Support Agent <Badge variant="outline">Offline</Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ and Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="text-foreground">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>support@supplymetricsoptimax.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+254 700 000 000</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Fri, 9am-5pm (EAT)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
