
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  AtSign, 
  Github, 
  Twitter, 
  Linkedin 
} from 'lucide-react';

export const ProfessionalFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Supply Metrics Optimax</h3>
            <p className="text-gray-300 text-sm mb-4">
              Advanced supply chain optimization platform for modern enterprises.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/route-optimization/new" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Route Optimization
                </Link>
              </li>
              <li>
                <Link to="/inventory-management/new" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Inventory Management
                </Link>
              </li>
              <li>
                <Link to="/network-optimization/new" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Network Optimization
                </Link>
              </li>
              <li>
                <Link to="/simulation/new" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Simulation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <Smartphone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <AtSign className="h-4 w-4 mr-2" />
                support@optimax.com
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Supply Metrics Optimax. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
