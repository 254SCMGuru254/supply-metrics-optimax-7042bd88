import { Card, CardContent } from "@/components/ui/card";
import { Crop, Factory, ShoppingCart, Truck, Hammer, Building } from "lucide-react";

const IndustryApplications = () => {
  const applications = [
    {
      icon: Crop,
      title: "Agriculture & Cooperatives",
      challenges: [
        "Seasonal cash flow optimization",
        "Collection route planning from farms",
        "Quality-based inventory allocation",
        "Export logistics coordination"
      ],
      outcomes: [
        "25% reduction in collection costs",
        "40% improvement in farmer payments", 
        "30% faster export processing"
      ]
    },
    {
      icon: Factory,
      title: "Manufacturing Excellence",
      challenges: [
        "Production scheduling optimization",
        "Supplier risk management",
        "Inventory cost reduction",
        "Quality control systems"
      ],
      outcomes: [
        "35% inventory cost reduction",
        "60% improvement in on-time delivery",
        "20% quality improvement"
      ]
    },
    {
      icon: ShoppingCart,
      title: "Retail & Distribution",
      challenges: [
        "Demand forecasting accuracy",
        "Multi-location inventory optimization",
        "Promotion planning coordination",
        "Last-mile delivery efficiency"
      ],
      outcomes: [
        "45% demand forecast improvement",
        "30% inventory turnover increase",
        "25% delivery cost reduction"
      ]
    },
    {
      icon: Truck,
      title: "Logistics & Transport",
      challenges: [
        "Multi-modal transport coordination",
        "Cross-border logistics optimization",
        "Fleet utilization improvement",
        "Hub location planning"
      ],
      outcomes: [
        "40% route efficiency gains",
        "50% better fleet utilization",
        "35% fuel cost savings"
      ]
    },
    {
      icon: Hammer,
      title: "Mining & Heavy Industry",
      challenges: [
        "Heavy equipment optimization",
        "Remote logistics coordination",
        "Maintenance scheduling",
        "Supply chain resilience"
      ],
      outcomes: [
        "60% equipment uptime improvement",
        "45% maintenance cost reduction",
        "30% supply reliability increase"
      ]
    },
    {
      icon: Building,
      title: "Construction & Infrastructure",
      challenges: [
        "Material procurement optimization",
        "Multi-site resource allocation",
        "Quality compliance tracking",
        "Cost volatility management"
      ],
      outcomes: [
        "25% material cost reduction",
        "40% project timeline improvement",
        "50% waste reduction"
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Industry Applications
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how different industries solve their unique supply chain challenges
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <Card key={index} className="h-full transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <app.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{app.title}</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2">Key Challenges Solved:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {app.challenges.map((challenge, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-green-800 mb-2">Typical Outcomes:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {app.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Don't see your industry? Our platform adapts to any supply chain challenge.
          </p>
          <a 
            href="#assessment" 
            className="text-primary hover:text-primary/80 font-semibold underline"
          >
            Get your personalized assessment →
          </a>
        </div>
      </div>
    </section>
  );
};

export default IndustryApplications;