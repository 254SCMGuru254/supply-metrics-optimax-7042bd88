import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProfessionalNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-2xl font-bold text-primary">
            Chain.io
          </Link>
          <span className="text-xs text-muted-foreground">by Supply Metrics Optimax</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Solutions
          </Link>
          <Link to="/analytics" className="text-sm font-medium hover:text-primary transition-colors">
            Industries
          </Link>
          <Link to="/documentation" className="text-sm font-medium hover:text-primary transition-colors">
            Success Stories
          </Link>
          <Link to="/support" className="text-sm font-medium hover:text-primary transition-colors">
            Resources
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Company
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Button 
            variant="default" 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            asChild
          >
            <Link to="/auth">Request Demo</Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-foreground text-foreground hover:bg-foreground hover:text-background"
            asChild
          >
            <Link to="/dashboard">Let's talk</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalNavbar;