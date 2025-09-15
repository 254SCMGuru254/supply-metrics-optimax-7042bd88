import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

const StrategicHero = () => {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <TrendingUp className="h-4 w-4" />
              Tariffs, Disruptions & Cost Pressures Are Reshaping Supply Chains
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Make Smarter Supply Chain Decisions
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              From demand planning to risk management - one intelligent platform that transforms 
              <span className="text-foreground font-semibold"> complexity into competitive advantage</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="#assessment">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                Discover Your Optimization Potential
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                View Live Demo
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Trusted by supply chain leaders across agriculture, manufacturing, retail & logistics</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicHero;