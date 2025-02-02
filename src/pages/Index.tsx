import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Network, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Network,
    title: "Network Optimization",
    description: "Optimize your supply chain network with advanced algorithms",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Monitor and analyze your supply chain performance in real-time",
  },
  {
    icon: Settings,
    title: "Custom Solutions",
    description: "Tailored solutions for your specific business needs",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl px-6 lg:px-8"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Supply Chain Analytics Platform
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Optimize your supply chain with advanced analytics and real-time
              insights. Make data-driven decisions and improve efficiency.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/analytics">
                <Button className="rounded-full">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link
                to="/guide"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-20"
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="relative backdrop-blur-sm bg-white/30 border border-gray-200 rounded-2xl p-8 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;