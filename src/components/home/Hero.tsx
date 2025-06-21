import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Compass } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Supply Chain Intelligence, Redefined.
      </h1>
      <div className="flex gap-4 mt-8">
        <Link to="/dashboard">
          <Button size="lg">
            <MapPin className="mr-2 h-5 w-5" />
            Launch Strategic Dashboard
          </Button>
        </Link>
        <Link to="/data-input">
          <Button variant="outline">
            <Compass className="mr-2 h-4 w-4" />
            Start Data Input
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
