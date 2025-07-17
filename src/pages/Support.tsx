import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  BookOpen,
  ExternalLink,
  Video
} from 'lucide-react';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Support Center</h2>
        <p className="text-muted-foreground">
          Get help with your supply chain optimization needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Help Center
            </CardTitle>
            <CardDescription>Browse our knowledge base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Find answers to frequently asked questions and troubleshooting guides.
            </p>
            <Button className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Articles
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Live Chat
            </CardTitle>
            <CardDescription>Chat with our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get instant help from our support representatives during business hours.
            </p>
            <Button className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Email Support
            </CardTitle>
            <CardDescription>Send us a detailed message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For complex issues or detailed inquiries, send us an email and we'll respond within 24 hours.
            </p>
            <Button className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Phone Support
            </CardTitle>
            <CardDescription>Call our support hotline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Speak directly with our technical support team for urgent issues.
            </p>
            <Button className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Watch step-by-step guides</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Learn how to use our platform with comprehensive video tutorials.
            </p>
            <Button className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Watch Videos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ExternalLink className="mr-2 h-5 w-5" />
              Community Forum
            </CardTitle>
            <CardDescription>Connect with other users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Join our community to share experiences and get peer support.
            </p>
            <Button className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Forum
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
