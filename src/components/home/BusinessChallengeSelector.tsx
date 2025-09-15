import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingDown, Truck, MapPin, BarChart3, AlertTriangle, Package } from "lucide-react";

const BusinessChallengeSelector = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const challenges = [
    {
      id: "cost-pressures",
      icon: TrendingDown,
      title: "Cost Pressures Keeping You Up at Night?",
      description: "Rising fuel, labor and material costs eating into margins",
      business_impact: "15-30% cost reduction possible",
      hidden_models: ["cost-modeling", "route-optimization", "network-optimization"]
    },
    {
      id: "demand-volatility",
      icon: BarChart3,
      title: "Demand Volatility Disrupting Your Plans?",
      description: "Unpredictable customer demand causing stockouts or excess inventory",
      business_impact: "40% forecast accuracy improvement",
      hidden_models: ["demand-forecasting", "inventory-optimization", "simulation"]
    },
    {
      id: "supply-disruptions",
      icon: AlertTriangle,
      title: "Supply Disruptions Causing Delays?",
      description: "Supplier issues, weather, or transport disruptions affecting delivery",
      business_impact: "60% risk reduction potential",
      hidden_models: ["risk-management", "supplier-diversity", "resilience-metrics"]
    },
    {
      id: "inventory-control",
      icon: Package,
      title: "Inventory Levels Out of Control?",
      description: "Too much stock tying up cash or stockouts losing sales",
      business_impact: "25-40% inventory cost reduction",
      hidden_models: ["inventory-optimization", "abc-analysis", "safety-stock"]
    },
    {
      id: "distribution-inefficiency",
      icon: Truck,
      title: "Distribution Network Inefficiencies?",
      description: "High transport costs, long delivery times, route inefficiencies",
      business_impact: "30% logistics cost savings",
      hidden_models: ["route-optimization", "vehicle-routing", "network-design"]
    },
    {
      id: "facility-planning",
      icon: MapPin,
      title: "Where to Locate New Facilities?",
      description: "Strategic decisions on warehouse or facility locations",
      business_impact: "Strategic competitive advantage",
      hidden_models: ["facility-location", "center-of-gravity", "market-analysis"]
    }
  ];

  const handleChallengeSelect = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    // Scroll to questionnaire
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            What's Your Biggest Supply Chain Challenge?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select your primary challenge to discover how AI-powered optimization can solve it
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selectedChallenge === challenge.id ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => handleChallengeSelect(challenge.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <challenge.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-foreground">
                      {challenge.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {challenge.description}
                    </p>
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                      <div className="text-green-800 font-semibold text-sm">
                        Potential Impact: {challenge.business_impact}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant={selectedChallenge === challenge.id ? "default" : "outline"}
                >
                  {selectedChallenge === challenge.id ? "Selected - Continue Below" : "Select This Challenge"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {selectedChallenge && (
          <div className="text-center mt-12">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-2xl mx-auto">
              <h4 className="font-bold text-blue-900 mb-2">Next Step: Get Your Personalized Solution</h4>
              <p className="text-blue-700 text-sm">
                Complete our quick assessment below to get specific recommendations for your selected challenge
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessChallengeSelector;