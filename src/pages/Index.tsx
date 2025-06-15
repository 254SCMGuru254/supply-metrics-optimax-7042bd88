
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="/lovable-uploads/a2956ea1-b63b-41de-a08a-e2aea31c4533.png" alt="Chain.IO Logo" className="h-8 w-8" />
          <div>
            <div className="text-2xl font-bold text-primary">Chain.IO</div>
            <div className="text-xs text-gray-500">Supply Chain 3.0: Outthink. Outmaneuver. Outperform</div>
          </div>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <Hero />
      <FeatureGrid />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
