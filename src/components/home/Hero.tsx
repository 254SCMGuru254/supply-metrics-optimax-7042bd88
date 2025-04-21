
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Compass } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">Supply Metrics Optimax</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-6">
        Empowering Kenyan Businesses with Free, Open-Source Supply Chain Optimization
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
