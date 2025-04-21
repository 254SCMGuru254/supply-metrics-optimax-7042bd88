
import { Card } from "@/components/ui/card";
import { 
  Code, 
  Server, 
  Database, 
  Zap, 
  Lock, 
  Hand 
} from "lucide-react";

const features = [
  {
    icon: Code,
    description: "Cutting-edge optimization algorithms using community-developed open-source libraries"
  },
  {
    icon: Server,
    description: "Serverless architecture for efficient, cost-effective API design"
  },
  {
    icon: Database,
    description: "Native NLP processing with local machine learning models, zero external dependencies"
  },
  {
    icon: Zap,
    description: "Intelligent data management with automated archiving and pruning"
  },
  {
    icon: Lock,
    description: "Fully transparent, community-reviewed codebase with open governance"
  },
  {
    icon: Hand,
    description: "Completely free platform with unrestricted commercial usage rights"
  }
];

const OpenSourceFeatures = () => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">100% Free & Open-Source</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <feature.icon className="h-6 w-6 text-primary" />
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OpenSourceFeatures;
