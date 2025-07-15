
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  MessageSquare,
  PhoneCall
} from 'lucide-react';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Support & Contact</h2>
        <p className="text-muted-foreground">
          Need assistance? Contact our support team or schedule a meeting with our experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Support Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>Get in touch with our support team for technical assistance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Send className="mr-2 h-4 w-4 text-muted-foreground" />
              <a href="mailto:support@chainalyze.io" className="text-sm text-blue-500 hover:underline">
                support@chainalyze.io
              </a>
            </div>
            <div className="flex items-center">
              <PhoneCall className="mr-2 h-4 w-4 text-muted-foreground" />
              <a href="tel:+254700123456" className="text-sm text-blue-500 hover:underline">
                +254 700 123456
              </a>
            </div>
            <Button>Contact Support</Button>
          </CardContent>
        </Card>

        {/* Schedule Meeting Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PhoneCall className="mr-2 h-5 w-5" />
              Schedule a Meeting
            </CardTitle>
            <CardDescription>Book a virtual meeting with our supply chain experts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Discuss your specific needs and challenges with our team.
            </p>
            <Button>Schedule Meeting</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What is Supply Chain Optimization?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Supply chain optimization involves streamlining processes, reducing costs, and improving efficiency across the entire supply chain, from sourcing raw materials to delivering finished products to customers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How can Chain.io help my business?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Chain.io provides tools and solutions to optimize your supply chain, including route optimization, network design, inventory management, and cost modeling. Our platform helps you make data-driven decisions to improve performance and reduce costs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What kind of support do you offer?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We offer technical support via email and phone, as well as virtual meetings with our supply chain experts. Our team is dedicated to helping you get the most out of our platform and achieve your business goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
