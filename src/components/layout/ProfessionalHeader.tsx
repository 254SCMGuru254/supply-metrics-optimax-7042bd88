
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Menu, X } from "lucide-react";
import { useState } from "react";

const ProfessionalHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: "Features", href: "#features", type: "anchor" },
    { name: "Pricing", href: "/pricing", type: "route" },
    { name: "Documentation", href: "/documentation", type: "route" },
    { name: "Kenya Focus", href: "/kenya-supply-chain", type: "route" },
    { name: "Support", href: "/support", type: "route" }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Professional Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Supply Metrics Optimax
              </span>
              <span className="text-xs text-gray-500 -mt-1">Advanced Supply Chain Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.type === "anchor" ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors relative group ${
                    isActive(item.href) 
                      ? "text-blue-600" 
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              🇰🇪 Kenya Ready
            </Badge>
            <Link to="/auth">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">
                Launch App
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                item.type === "anchor" ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="pt-3 border-t">
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="block mt-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Launch App
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfessionalHeader;
