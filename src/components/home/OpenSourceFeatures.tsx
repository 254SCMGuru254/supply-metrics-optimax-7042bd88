
import { Card } from "@/components/ui/card";
import { 
  Code, 
  Server, 
  Database, 
  Zap, 
  Lock, 
  Hand 
} from "lucide-react";
import { motion } from "framer-motion";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const OpenSourceFeatures = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="p-6 mb-8">
        <motion.h2 
          className="text-xl font-semibold mb-4"
          variants={item}
        >
          100% Free & Open-Source
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={container}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex items-center gap-3"
              variants={item}
            >
              <feature.icon className="h-6 w-6 text-primary" />
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default OpenSourceFeatures;
