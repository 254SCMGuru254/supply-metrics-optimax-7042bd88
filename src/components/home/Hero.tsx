import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Compass } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center mb-16">
      <div className="mb-6">
        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          AI-First Supply Chain Management
        </h1>
        <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Move from what happened to what's coming. 
          <span className="block mt-2 font-medium text-foreground">
            Start Smart with AI built in, not bolted on
          </span>
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/dashboard">
          <Button size="lg" className="px-8 py-3 text-lg font-semibold">
            <MapPin className="mr-2 h-6 w-6" />
            Launch Strategic Dashboard
          </Button>
        </Link>
        <Link to="/chat-assistant">
          <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
            <Compass className="mr-2 h-5 w-5" />
            Talk to AI Assistant
          </Button>
        </Link>
      </div>
      
      <div className="mt-12 text-sm text-muted-foreground">
        <p>Trusted by 100K+ supply chain professionals • 50+ optimization models • Real-time Kenya integration</p>
      </div>
    </div>
  );
};

export default Hero;
