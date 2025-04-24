
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PricingTier = ({
  name,
  price,
  description,
  features,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
}) => (
  <Card className="p-6 flex flex-col h-full">
    <h3 className="text-2xl font-bold mb-2">{name}</h3>
    <div className="mb-4">
      <span className="text-4xl font-bold">{price}</span>
      {price !== "Free" && <span className="text-muted-foreground">/month</span>}
    </div>
    <p className="text-muted-foreground mb-6">{description}</p>
    <ul className="space-y-3 mb-8 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2">
          <Check className="h-5 w-5 text-primary flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full" variant={name === "Enterprise" ? "default" : "outline"}>
      Get Started
    </Button>
  </Card>
);

const Pricing = () => {
  const tiers = [
    {
      name: "Community",
      price: "Free",
      description: "Perfect for open source projects and individual developers",
      features: [
        "Cutting-edge optimization algorithms",
        "Local machine learning models",
        "Basic data management",
        "Community support",
        "Supply chain chatbot",
        "Route optimization",
        "Up to 3 concurrent projects"
      ],
    },
    {
      name: "Professional",
      price: "$49",
      description: "Ideal for small to medium businesses",
      features: [
        "All Community features",
        "Premium algorithms",
        "Advanced data analytics",
        "Priority support",
        "Custom model training",
        "Unlimited projects",
        "API access",
        "Team collaboration"
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations needing advanced features and support",
      features: [
        "All Professional features",
        "Dedicated support",
        "Custom development",
        "SLA guarantee",
        "On-premise deployment",
        "Advanced security",
        "Training & workshops",
        "Custom integrations"
      ],
    },
  ];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that best fits your needs. All plans include our core optimization features.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {tiers.map((tier) => (
          <PricingTier key={tier.name} {...tier} />
        ))}
      </div>
    </div>
  );
};

export default Pricing;
