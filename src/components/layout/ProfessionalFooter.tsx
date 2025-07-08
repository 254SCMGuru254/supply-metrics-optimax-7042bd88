
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Activity, 
  MapPin, 
  Target,
  Settings
} from 'lucide-react';

export const ProfessionalFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Supply Metrics</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced supply chain optimization platform powered by AI and machine learning. 
              Transform your operations with data-driven insights.
            </p>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Enterprise-Grade Solutions</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
              <li><Link to="/analytics" className="text-gray-400 hover:text-white transition-colors text-sm">Analytics</Link></li>
              <li><Link to="/route-optimization" className="text-gray-400 hover:text-white transition-colors text-sm">Optimization</Link></li>
              <li><Link to="/simulation" className="text-gray-400 hover:text-white transition-colors text-sm">Simulation</Link></li>
              <li><Link to="/cost-modeling" className="text-gray-400 hover:text-white transition-colors text-sm">Cost Modeling</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/documentation" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support Center</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Case Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Webinars</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">support@supplymetrics.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400 text-sm">Nairobi, Kenya</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Activity className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Target className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Supply Metrics Optimax. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
