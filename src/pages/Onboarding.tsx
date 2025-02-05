
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LightbulbIcon, Rocket, BarChart3, Network } from "lucide-react";

const Onboarding = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Chainalyze.io</h1>
          <p className="text-xl text-muted-foreground">
            Transform your supply chain with data-driven optimization
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LightbulbIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Unlock Hidden Value</h3>
                <p className="text-muted-foreground">
                  Identify cost-saving opportunities and optimize your network design with advanced analytics.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Accelerate Decisions</h3>
                <p className="text-muted-foreground">
                  Make data-driven decisions faster with our intuitive analysis tools and visualization.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Reduce Complexity</h3>
                <p className="text-muted-foreground">
                  Simplify your network analysis with our comprehensive suite of optimization models.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Scale Confidently</h3>
                <p className="text-muted-foreground">
                  Future-proof your supply chain with adaptable network design solutions.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose Chainalyze.io?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-2" />
              <p>Struggling with complex supply chain decisions? Our analytics suite simplifies network optimization.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-2" />
              <p>Tired of manual calculations? Automate your analysis with our advanced algorithms.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-primary mt-2" />
              <p>Need better visibility? Get clear insights with our interactive visualizations.</p>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Link to="/data-input">
            <Button size="lg">Start Optimizing Your Network</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
