
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  send, 
  map-pin,
  clock,
  shield
} from 'lucide-react';

export const ProfessionalFooter = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Supply Metrics Optimax</h3>
            <p className="text-muted-foreground text-sm">
              Advanced supply chain optimization platform for East Africa, 
              providing cutting-edge analytics and AI-driven solutions.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Social
              </Button>
              <Button size="sm" variant="outline">
                Connect
              </Button>
              <Button size="sm" variant="outline">
                Follow
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/dashboard" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="/analytics" className="hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="/documentation" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="/support" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/route-optimization" className="hover:text-primary transition-colors">Route Optimization</a></li>
              <li><a href="/network-design" className="hover:text-primary transition-colors">Network Design</a></li>
              <li><a href="/inventory-management" className="hover:text-primary transition-colors">Inventory Management</a></li>
              <li><a href="/cost-modeling" className="hover:text-primary transition-colors">Cost Modeling</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <send className="h-4 w-4" />
                <span>info@optimax.co.ke</span>
              </div>
              <div className="flex items-center space-x-2">
                <send className="h-4 w-4" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <map-pin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <shield className="h-4 w-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-1">
                <clock className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Supply Metrics Optimax. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
