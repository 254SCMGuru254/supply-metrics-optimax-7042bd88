import { Shield, Users, Database, CheckCircle } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    { icon: Database, label: "86+ Models", detail: "Proven Algorithms" },
    { icon: Users, label: "Enterprise", detail: "Grade Security" },
    { icon: Shield, label: "98% Accuracy", detail: "Mathematical Precision" },
    { icon: CheckCircle, label: "Kenya Focus", detail: "Local Expertise" }
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <indicator.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-lg font-bold text-foreground">{indicator.label}</div>
              <div className="text-sm text-muted-foreground">{indicator.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;