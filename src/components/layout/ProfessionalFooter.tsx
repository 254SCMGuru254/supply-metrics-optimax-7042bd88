
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin 
} from 'lucide-react';

export const ProfessionalFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Supply Metrics Optimax
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Advanced supply chain optimization platform leveraging AI and mathematical modeling for enterprise-grade solutions.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Solutions</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Network Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Inventory Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Route Planning</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cost Modeling</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Analytics</a></li>
            </ul>
          </div>

          {/* Industries */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Industries</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Manufacturing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Retail & E-commerce</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Agriculture</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Healthcare</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Logistics</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Contact</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>support@supplymetricsoptmax.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+254 700 000 000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 Supply Metrics Optimax. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
