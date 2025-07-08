
import React from "react";
import { Link } from "react-router-dom";
import { 
  Network,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

export const ProfessionalFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">Supply Metrics Optimax</div>
                <div className="text-sm text-gray-400">Advanced Supply Chain Intelligence</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Transform your supply chain with AI-powered optimization and real-time analytics.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/documentation" className="text-gray-300 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/kenya-supply-chain" className="text-gray-300 hover:text-white transition-colors">Kenya Focus</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/documentation" className="text-gray-300 hover:text-white transition-colors">API Docs</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">support@optimax.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 Supply Metrics Optimax. All rights reserved.
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
