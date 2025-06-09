
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useKenyaCurrency } from "@/hooks/use-kenya-currency";
import { Truck, Network, Globe, Database, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const IntroductionPage = () => {
  const [activeSection, setActiveSection] = useState(0);
  const { formatKES } = useKenyaCurrency();
  
  // Auto-advance through sections
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSection((prev) => (prev < 4 ? prev + 1 : prev));
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [activeSection]);

  const sections = [
    {
      icon: Globe,
      title: "Supply Chain Optimization for Kenya",
      description: "A comprehensive platform designed to help Kenyan businesses optimize their supply chain operations, reduce costs, and improve efficiency."
    },
    {
      icon: Truck,
      title: "Route Optimization",
      description: "Plan the most efficient delivery routes across Kenya's diverse terrain, saving up to 30% on fuel costs and reducing delivery times."
    },
    {
      icon: Network,
      title: "Network Design",
      description: "Determine optimal facility locations based on demand distribution, minimizing transportation costs and improving customer service."
    },
    {
      icon: Database,
      title: "Simulation & Analysis",
      description: "Test your supply chain against disruptions, analyze performance, and make data-driven decisions to improve resilience."
    },
    {
      icon: Coins,
      title: "Cost Savings",
      description: "Our clients typically save 15-25% on logistics costs by implementing our optimization recommendations."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Chainalyze.io
        </h1>
        <p className="text-xl text-center text-muted-foreground">
          Supply Chain Optimization for East Africa
        </p>

        <div className="relative h-96 w-full overflow-hidden rounded-xl border border-border shadow-lg">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-1000 transform ${
                index === activeSection 
                  ? "translate-x-0 opacity-100" 
                  : index < activeSection 
                    ? "-translate-x-full opacity-0" 
                    : "translate-x-full opacity-0"
              }`}
            >
              <section.icon className="h-20 w-20 text-primary mb-6" />
              <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
              <p className="text-muted-foreground max-w-xl">{section.description}</p>
            </div>
          ))}
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {sections.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeSection ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setActiveSection(index)}
              />
            ))}
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Pricing for Kenyan Market</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Starter</h3>
              <p className="text-3xl font-bold mb-2">{formatKES(25000)} <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
              <p className="text-sm text-muted-foreground mb-4">Perfect for small businesses</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Route optimization (up to 20 stops)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>PayPal payment integration</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">~{formatKES(833)} per day</p>
            </div>
            
            <div className="border rounded-lg p-4 bg-primary/5 border-primary">
              <h3 className="font-semibold text-lg mb-2">Business</h3>
              <p className="text-3xl font-bold mb-2">{formatKES(75000)} <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
              <p className="text-sm text-muted-foreground mb-4">For growing companies</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Route optimization (unlimited stops)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Network optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Center of gravity analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>PayPal payment integration</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">~{formatKES(2500)} per day</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
              <p className="text-3xl font-bold mb-2">{formatKES(200000)} <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
              <p className="text-sm text-muted-foreground mb-4">For large operations</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>All features included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Simulation modeling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Disruption analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground">~{formatKES(6667)} per day</p>
            </div>
          </div>
          
          <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              PayPal Integration Active
            </h3>
            <p className="text-sm">
              All plans now include integrated PayPal payment processing for seamless international 
              and local payments. M-Pesa integration is coming soon for even more convenient local payments.
            </p>
          </div>
        </Card>
        
        <div className="flex justify-center mt-8">
          <Link to="/dashboard">
            <Button size="lg" className="px-8">
              Explore the Platform
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;
