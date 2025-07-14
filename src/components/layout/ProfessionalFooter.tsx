
import React from "react";
import { Link } from "react-router-dom";
import {
  Network,
  MapPin,
  Phone,
  Mail,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

export const ProfessionalFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Network className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Supply Metrics Optimax</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Advanced supply chain optimization platform powered by AI and mathematical modeling.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics Dashboard</Link></li>
              <li><Link to="/network-optimization" className="hover:text-white transition-colors">Network Optimization</Link></li>
              <li><Link to="/inventory-management" className="hover:text-white transition-colors">Inventory Management</Link></li>
              <li><Link to="/route-optimization" className="hover:text-white transition-colors">Route Optimization</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support Center</Link></li>
              <li><Link to="/kenya-supply-chain" className="hover:text-white transition-colors">Kenya Focus</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@supplymetricsoptimax.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+254 (0) 700 123 456</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>Nairobi, Kenya<br />East Africa Hub</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Supply Metrics Optimax. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
