
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Loader2 } from 'lucide-react';
import { formulaBackendConnector } from '@/services/FormulaBackendConnector';
import { useToast } from '@/hooks/use-toast';

interface FormulaCalculatorProps {
  formula: {
    id: string;
    name: string;
    description: string;
    inputs: Array<{
      name: string;
      label: string;
      type: string;
      unit?: string;
      defaultValue?: any;
    }>;
    outputs: Array<{
      name: string;
      label: string;
      unit?: string;
    }>;
  };
  modelType: string;
}

export function FormulaCalculator({ formula, modelType }: FormulaCalculatorProps) {
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (inputName: string, value: any) => {
    setInputValues(prev => ({
      ...prev,
      [inputName]: value
    }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      const calculationResult = await formulaBackendConnector.calculateFormula({
        formulaId: formula.id,
        modelType,
        inputParameters: inputValues
      });

      if (calculationResult.success) {
        setResult(calculationResult);
        toast({
          title: "Calculation Complete",
          description: `Formula executed in ${calculationResult.executionTime}ms`,
        });
      } else {
        toast({
          title: "Calculation Failed",
          description: "Please check your input parameters and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate formula. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {formula.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{formula.description}</p>
        
        <div className="space-y-3">
          <h4 className="font-medium">Input Parameters</h4>
          {formula.inputs.map((input) => (
            <div key={input.name} className="space-y-1">
              <Label htmlFor={input.name}>
                {input.label}
                {input.unit && <span className="text-muted-foreground"> ({input.unit})</span>}
              </Label>
              <Input
                id={input.name}
                type={input.type === 'number' ? 'number' : 'text'}
                step={input.type === 'number' ? 'any' : undefined}
                value={inputValues[input.name] || input.defaultValue || ''}
                onChange={(e) => handleInputChange(input.name, 
                  input.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                )}
                placeholder={`Enter ${input.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <Button 
          onClick={handleCalculate} 
          disabled={isCalculating}
          className="w-full"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium">Results</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Result:</span>
                <Badge variant="default">
                  {typeof result.result === 'object' 
                    ? JSON.stringify(result.result) 
                    : result.result?.toFixed?.(2) || result.result
                  }
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Execution Time:</span>
                <Badge variant="outline">{result.executionTime}ms</Badge>
              </div>
            </div>

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-sm">Recommendations:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
