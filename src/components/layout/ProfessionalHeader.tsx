import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const ProfessionalHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl text-primary">
            Chain.io
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Platform
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/documentation" className="text-foreground hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link to="/support" className="text-foreground hover:text-primary transition-colors">
              Support
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4 space-y-4">
            <Link 
              to="/dashboard" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Platform
            </Link>
            <Link 
              to="/pricing" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/documentation" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link 
              to="/support" 
              className="block text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link to="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfessionalHeader;