
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { 
  LightbulbIcon, 
  Rocket, 
  BarChart3, 
  Network, 
  ChevronRight, 
  CheckCircle2,
  Truck,
  Target,
  LineChart,
  Map,
  TrendingUp
} from "lucide-react";

// Step components
const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="max-w-4xl mx-auto">
    <section className="mb-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Chainalyze.io</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Transform your supply chain with data-driven optimization
      </p>
      <Button onClick={onNext} size="lg">
        Start Onboarding <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </section>

    <div className="grid gap-8 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LightbulbIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Real-World Solutions</h3>
            <p className="text-muted-foreground">
              Our platform is designed for real supply chain challenges in Kenya and beyond.
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
            <h3 className="text-xl font-semibold mb-2">Data-Driven Decisions</h3>
            <p className="text-muted-foreground">
              Make informed choices with advanced analytics and optimization tools.
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const NetworkOptimizationIntro = ({ onNext }: { onNext: () => void }) => (
  <Card className="max-w-4xl mx-auto p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-primary/10 rounded-lg">
        <Network className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Network Optimization</h2>
        <p className="text-muted-foreground">Design efficient supply chain networks</p>
      </div>
    </div>

    <div className="space-y-6 mb-8">
      <div>
        <h3 className="font-semibold mb-2">Key Features</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Optimize facility locations and distribution flows</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Minimize transportation and operational costs</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Balance service levels and network efficiency</span>
          </li>
        </ul>
      </div>
    </div>

    <Button onClick={onNext} size="lg">
      Continue <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </Card>
);

const RouteOptimizationIntro = ({ onNext }: { onNext: () => void }) => (
  <Card className="max-w-4xl mx-auto p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-primary/10 rounded-lg">
        <Truck className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Route Optimization</h2>
        <p className="text-muted-foreground">Optimize delivery routes for maximum efficiency</p>
      </div>
    </div>

    <div className="space-y-6 mb-8">
      <div>
        <h3 className="font-semibold mb-2">Key Features</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Real-world route optimization algorithms</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Vehicle capacity and time window constraints</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Multi-stop route planning and scheduling</span>
          </li>
        </ul>
      </div>
    </div>

    <Button onClick={onNext} size="lg">
      Continue <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </Card>
);

const CenterOfGravityIntro = ({ onNext }: { onNext: () => void }) => (
  <Card className="max-w-4xl mx-auto p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-primary/10 rounded-lg">
        <Target className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Center of Gravity Analysis</h2>
        <p className="text-muted-foreground">Find optimal facility locations</p>
      </div>
    </div>

    <div className="space-y-6 mb-8">
      <div>
        <h3 className="font-semibold mb-2">Key Features</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Weighted demand point analysis</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Multi-facility location optimization</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Real-world distance calculations</span>
          </li>
        </ul>
      </div>
    </div>

    <Button onClick={onNext} size="lg">
      Continue <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </Card>
);

const SimulationIntro = ({ onNext }: { onNext: () => void }) => (
  <Card className="max-w-4xl mx-auto p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-primary/10 rounded-lg">
        <LineChart className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Supply Chain Simulation</h2>
        <p className="text-muted-foreground">Test and validate network designs</p>
      </div>
    </div>

    <div className="space-y-6 mb-8">
      <div>
        <h3 className="font-semibold mb-2">Key Features</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Discrete event simulation</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Risk and resilience analysis</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Performance metric tracking</span>
          </li>
        </ul>
      </div>
    </div>

    <Button onClick={onNext} size="lg">
      Continue <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </Card>
);

const DemandForecastingIntro = ({ onNext }: { onNext: () => void }) => (
  <Card className="max-w-4xl mx-auto p-8">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-primary/10 rounded-lg">
        <TrendingUp className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Demand Forecasting</h2>
        <p className="text-muted-foreground">Predict future demand with time-series analysis</p>
      </div>
    </div>

    <div className="space-y-6 mb-8">
      <div>
        <h3 className="font-semibold mb-2">Key Features</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Advanced time-series forecasting algorithms</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Seasonal pattern detection and decomposition</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Machine learning-based demand prediction</span>
          </li>
        </ul>
      </div>
    </div>

    <Button onClick={onNext} size="lg">
      Continue <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </Card>
);

const CompletionStep = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-4xl mx-auto p-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Onboarding Complete!</h2>
        <p className="text-muted-foreground">
          You're now ready to start optimizing your supply chain
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate("/dashboard")} size="lg">
          Go to Dashboard
        </Button>
        <Button onClick={() => navigate("/kenya-supply-chain")} variant="outline" size="lg">
          Explore Kenya Supply Chain
        </Button>
      </div>
    </Card>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { component: WelcomeStep },
    { component: NetworkOptimizationIntro },
    { component: RouteOptimizationIntro },
    { component: CenterOfGravityIntro },
    { component: SimulationIntro },
    { component: DemandForecastingIntro },
    { component: CompletionStep }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-16 rounded ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      <CurrentStepComponent onNext={handleNext} />
    </div>
  );
};

export default Onboarding;
