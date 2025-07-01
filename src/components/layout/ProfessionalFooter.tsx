
import React from "react";
import { Link } from "react-router-dom";
import { Network, MapPin, Award, Globe } from "lucide-react";

const ProfessionalFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Network className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Supply Metrics Optimax</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced supply chain optimization platform with specialized focus on Kenya market dynamics. 
              Empowering businesses with AI-driven insights and mathematical optimization.
            </p>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Kenya & Global Markets</span>
            </div>
          </div>
          
          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Platform</h3>
            <div className="space-y-3">
              <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Dashboard
              </Link>
              <Link to="/analytics-dashboard/demo" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Analytics
              </Link>
              <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Documentation
              </Link>
              <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Pricing Plans
              </Link>
              <Link to="/business-value" className="block text-gray-400 hover:text-white transition-colors text-sm">
                ROI Calculator
              </Link>
            </div>
          </div>
          
          {/* Solutions Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg flex items-center">
              <Globe className="h-4 w-4 mr-2 text-green-400" />
              Solutions
            </h3>
            <div className="space-y-3">
              <Link to="/kenya-supply-chain" className="block text-gray-400 hover:text-white transition-colors text-sm">
                🇰🇪 Kenya Focus
              </Link>
              <Link to="/route-optimization/demo" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Route Optimization
              </Link>
              <Link to="/inventory-management/demo" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Inventory Management
              </Link>
              <Link to="/network-optimization/demo" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Network Design
              </Link>
              <Link to="/center-of-gravity/demo" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Facility Location
              </Link>
            </div>
          </div>
          
          {/* Support & Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-lg flex items-center">
              <Award className="h-4 w-4 mr-2 text-yellow-400" />
              Support
            </h3>
            <div className="space-y-3">
              <Link to="/support" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Help Center
              </Link>
              <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors text-sm">
                API Reference
              </Link>
              <Link to="/auth" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Community Forum
              </Link>
              <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Training Resources
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} Supply Metrics Optimax. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Powered by advanced AI & optimization</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProfessionalFooter;
