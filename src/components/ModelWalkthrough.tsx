
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type WalkthroughStep = {
  title: string;
  description: string;
  image?: string;
};

type ModelWalkthroughProps = {
  steps: WalkthroughStep[];
};

export const ModelWalkthrough = ({ steps }: ModelWalkthroughProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
        <p className="text-muted-foreground mt-2">{steps[currentStep].description}</p>
      </div>

      {steps[currentStep].image && (
        <div className="aspect-video w-full bg-muted rounded-md mb-4 overflow-hidden">
          <img 
            src={steps[currentStep].image} 
            alt={`Step ${currentStep + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <Button 
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          size="icon"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <Button
              key={index}
              onClick={() => goToStep(index)}
              size="icon"
              className={`h-2 w-2 rounded-full p-0 ${
                index === currentStep ? "bg-primary" : "bg-muted"
              }`}
            >
              <span className="sr-only">Go to step {index + 1}</span>
            </Button>
          ))}
        </div>

        <Button 
          onClick={goToNextStep}
          disabled={currentStep === steps.length - 1}
          size="icon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
