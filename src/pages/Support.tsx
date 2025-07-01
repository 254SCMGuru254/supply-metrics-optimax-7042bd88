
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, MessageCircle, BookOpen, Users } from "lucide-react";

const Support = () => {
  const supportCategories = [
    {
      title: "Documentation",
      description: "Comprehensive guides and API references",
      icon: BookOpen,
      link: "/documentation",
      badge: "Updated"
    },
    {
      title: "Community Forum",
      description: "Connect with other users and experts",
      icon: Users,
      link: "/documentation",
      badge: "Active"
    },
    {
      title: "Help Center",
      description: "FAQs and troubleshooting guides",
      icon: HelpCircle,
      link: "/documentation",
      badge: "24/7"
    },
    {
      title: "Live Chat",
      description: "Direct support for urgent issues",
      icon: MessageCircle,
      link: "/auth",
      badge: "Premium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get the support you need to maximize your supply chain optimization success
          </p>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {supportCategories.map((category) => (
            <Card key={category.title} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {category.badge}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <Link to={category.link}>
                  <Button variant="outline" className="w-full group-hover:bg-blue-50">
                    Access <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Get Personal Support</CardTitle>
              <p className="text-gray-600">
                Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" placeholder="Your company name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your issue or question in detail..."
                  rows={6}
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6">
                Send Message
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Popular Resources</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/documentation">
              <Button variant="outline">Getting Started Guide</Button>
            </Link>
            <Link to="/documentation">
              <Button variant="outline">API Documentation</Button>
            </Link>
            <Link to="/kenya-supply-chain">
              <Button variant="outline">Kenya Solutions</Button>
            </Link>
            <Link to="/business-value">
              <Button variant="outline">ROI Calculator</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
