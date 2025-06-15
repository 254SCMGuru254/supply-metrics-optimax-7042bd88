
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Compass } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <img src="/logo.png" alt="Chain.io Logo" className="h-16 w-16 mb-4" />
      <h1 className="text-4xl font-bold mb-4">Chain.io</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-6">
        Elite SaaS for Supply Chain Optimization.<br />
        Transform Your Kenyan Business with Powerful, Open-Source Analytics.
      </p>
      <div className="flex gap-4">
        <Link to="/kenya-supply-chain">
          <Button>
            <MapPin className="mr-2 h-4 w-4" />
            Explore Kenya Supply Chain
          </Button>
        </Link>
        <Link to="/onboarding">
          <Button variant="outline">
            <Compass className="mr-2 h-4 w-4" />
            Start Onboarding
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
