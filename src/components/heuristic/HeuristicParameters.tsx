
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type HeuristicParametersProps = {
  iterations: number;
  initialTemperature: number;
  coolingRate: number;
  onIterationsChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
  onCoolingRateChange: (value: number) => void;
};

export const HeuristicParameters = ({
  iterations,
  initialTemperature,
  coolingRate,
  onIterationsChange,
  onTemperatureChange,
  onCoolingRateChange,
}: HeuristicParametersProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="iterations">Iterations: {iterations}</Label>
        </div>
        <Slider
          id="iterations"
          min={100}
          max={2000}
          step={100}
          value={[iterations]}
          onValueChange={(vals) => onIterationsChange(vals[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="temperature">Initial Temperature: {initialTemperature}</Label>
        </div>
        <Slider
          id="temperature"
          min={100}
          max={5000}
          step={100}
          value={[initialTemperature]}
          onValueChange={(vals) => onTemperatureChange(vals[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="cooling-rate">Cooling Rate: {coolingRate.toFixed(2)}</Label>
        </div>
        <Slider
          id="cooling-rate"
          min={0.8}
          max={0.99}
          step={0.01}
          value={[coolingRate]}
          onValueChange={(vals) => onCoolingRateChange(vals[0])}
        />
      </div>
    </div>
  );
};
