
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  help-circle,
  mail,
  phone,
  message-circle,
  book,
  external-link,
  video
} from 'lucide-react';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Support Center</h2>
        <p className="text-muted-foreground">
          Get help and support for your supply chain optimization needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <help-circle className="mr-2 h-5 w-5" />
              Help Center
            </CardTitle>
            <CardDescription>Browse our knowledge base and FAQs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Find answers to common questions and browse our comprehensive help articles.
            </p>
            <Button className="w-full">
              <book className="mr-2 h-4 w-4" />
              Browse Help Articles
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <message-circle className="mr-2 h-5 w-5" />
              Live Chat
            </CardTitle>
            <CardDescription>Chat with our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get instant help from our support specialists through live chat.
            </p>
            <Button className="w-full">
              <message-circle className="mr-2 h-4 w-4" />
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <mail className="mr-2 h-5 w-5" />
              Email Support
            </CardTitle>
            <CardDescription>Send us a detailed message</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Submit a support ticket and we'll get back to you within 24 hours.
            </p>
            <Button className="w-full">
              <mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <phone className="mr-2 h-5 w-5" />
              Phone Support
            </CardTitle>
            <CardDescription>Call our support hotline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Speak directly with our technical support team for urgent issues.
            </p>
            <Button className="w-full">
              <phone className="mr-2 h-4 w-4" />
              Call Support
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <video className="mr-2 h-5 w-5" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Watch step-by-step guides</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Learn how to use our platform with comprehensive video tutorials.
            </p>
            <Button className="w-full">
              <video className="mr-2 h-4 w-4" />
              Watch Tutorials
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <external-link className="mr-2 h-5 w-5" />
              Community Forum
            </CardTitle>
            <CardDescription>Connect with other users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Join our community forum to share experiences and get peer support.
            </p>
            <Button className="w-full">
              <external-link className="mr-2 h-4 w-4" />
              Visit Forum
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
