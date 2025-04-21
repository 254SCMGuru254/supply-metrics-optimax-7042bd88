
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { Market } from "@/components/icons/market";

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-muted-foreground">
              Supply Metrics Optimax is an open-source platform dedicated to empowering 
              Kenyan businesses with advanced supply chain optimization tools.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/introduction" className="text-muted-foreground hover:text-primary">Introduction</Link></li>
              <li><Link to="/data-input" className="text-muted-foreground hover:text-primary">Data Input</Link></li>
              <li><Link to="/analytics" className="text-muted-foreground hover:text-primary">Analytics</Link></li>
              <li><Link to="/onboarding" className="text-muted-foreground hover:text-primary">Onboarding</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/254SCMGuru254/supply-metrics-optimax" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Globe className="h-6 w-6" />
              </a>
              {/* Add more social links as needed */}
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              © {new Date().getFullYear()} Supply Metrics Optimax. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
