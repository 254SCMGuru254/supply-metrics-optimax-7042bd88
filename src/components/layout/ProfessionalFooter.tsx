
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

export const ProfessionalFooter = () => {
  return (
    <footer className="bg-muted/50 border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Supply Metrics Optimax</h3>
            <p className="text-sm text-muted-foreground">
              Advanced supply chain optimization platform for enterprise solutions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/center-of-gravity" className="text-muted-foreground hover:text-foreground">Center of Gravity</Link></li>
              <li><Link to="/route-optimization" className="text-muted-foreground hover:text-foreground">Route Optimization</Link></li>
              <li><Link to="/inventory-management" className="text-muted-foreground hover:text-foreground">Inventory Management</Link></li>
              <li><Link to="/network-design" className="text-muted-foreground hover:text-foreground">Network Design</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/documentation" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-foreground">Support</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@supplymetricsoptimax.com</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Supply Metrics Optimax. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
