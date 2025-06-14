
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PricingModel {
  type: 'cost_plus' | 'value_based' | 'competitive' | 'dynamic' | 'penetration' | 'skimming';
  name: string;
  description: string;
  parameters: Record<string, any>;
}

interface PricingResult {
  recommendedPrice: number;
  priceRange: [number, number];
  margin: number;
  elasticity: number;
  competitivePosition: 'below' | 'at' | 'above';
  recommendations: string[];
}

export function PricingEngine({ projectId }: { projectId: string }) {
  const [selectedModel, setSelectedModel] = useState<string>('cost_plus');
  const [parameters, setParameters] = useState<Record<string, any>>({
    cost: 100,
    markup: 0.25,
    competitorPrice: 150,
    valuePerception: 0.8,
    demandElasticity: -1.5,
    marketSize: 10000
  });
  const [result, setResult] = useState<PricingResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  const pricingModels: PricingModel[] = [
    {
      type: 'cost_plus',
      name: 'Cost-Plus Pricing',
      description: 'Set price based on cost plus desired markup percentage',
      parameters: {
        cost: { label: 'Unit Cost (KES)', type: 'number', required: true },
        markup: { label: 'Markup (%)', type: 'number', min: 0, max: 2, step: 0.01, required: true }
      }
    },
    {
      type: 'value_based',
      name: 'Value-Based Pricing',
      description: 'Price based on perceived customer value',
      parameters: {
        cost: { label: 'Unit Cost (KES)', type: 'number', required: true },
        valuePerception: { label: 'Value Perception (0-1)', type: 'number', min: 0, max: 1, step: 0.1, required: true },
        maxWillingness: { label: 'Max Willingness to Pay (KES)', type: 'number', required: true }
      }
    },
    {
      type: 'competitive',
      name: 'Competitive Pricing',
      description: 'Price relative to competitor pricing',
      parameters: {
        cost: { label: 'Unit Cost (KES)', type: 'number', required: true },
        competitorPrice: { label: 'Competitor Price (KES)', type: 'number', required: true },
        positionStrategy: { label: 'Position Strategy', type: 'select', options: ['below', 'match', 'premium'], required: true }
      }
    },
    {
      type: 'dynamic',
      name: 'Dynamic Pricing',
      description: 'Adjust prices based on demand and market conditions',
      parameters: {
        baseCost: { label: 'Base Cost (KES)', type: 'number', required: true },
        demandElasticity: { label: 'Demand Elasticity', type: 'number', min: -5, max: 0, step: 0.1, required: true },
        demandLevel: { label: 'Current Demand Level (0-1)', type: 'number', min: 0, max: 1, step: 0.1, required: true },
        seasonalFactor: { label: 'Seasonal Factor (0.5-2)', type: 'number', min: 0.5, max: 2, step: 0.1, required: true }
      }
    },
    {
      type: 'penetration',
      name: 'Market Penetration',
      description: 'Low initial price to gain market share',
      parameters: {
        cost: { label: 'Unit Cost (KES)', type: 'number', required: true },
        marketSize: { label: 'Target Market Size', type: 'number', required: true },
        penetrationRate: { label: 'Target Penetration Rate (%)', type: 'number', min: 0, max: 100, required: true },
        timeHorizon: { label: 'Time Horizon (months)', type: 'number', min: 1, max: 36, required: true }
      }
    },
    {
      type: 'skimming',
      name: 'Price Skimming',
      description: 'High initial price, gradually decrease',
      parameters: {
        cost: { label: 'Unit Cost (KES)', type: 'number', required: true },
        premiumWillingness: { label: 'Premium Willingness (KES)', type: 'number', required: true },
        marketAdoption: { label: 'Market Adoption Rate', type: 'number', min: 0, max: 1, step: 0.1, required: true },
        competitionThreat: { label: 'Competition Threat (0-1)', type: 'number', min: 0, max: 1, step: 0.1, required: true }
      }
    }
  ];

  const currentModel = pricingModels.find(m => m.type === selectedModel);

  const calculatePrice = async () => {
    setCalculating(true);
    try {
      const result = await executePricingModel(selectedModel, parameters);
      setResult(result);

      // Save to database
      await supabase.from('optimization_results').insert({
        project_id: projectId,
        optimization_type: 'pricing',
        input_parameters: { model: selectedModel, ...parameters },
        results: result,
        performance_metrics: {
          recommendedPrice: result.recommendedPrice,
          margin: result.margin,
          competitivePosition: result.competitivePosition
        }
      });

      toast({
        title: "Pricing Analysis Complete",
        description: `Recommended price: KES ${result.recommendedPrice.toLocaleString()}`
      });
    } catch (error) {
      console.error('Pricing calculation error:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate pricing. Please check inputs.",
        variant: "destructive"
      });
    } finally {
      setCalculating(false);
    }
  };

  const executePricingModel = async (model: string, params: Record<string, any>): Promise<PricingResult> => {
    let recommendedPrice = 0;
    let margin = 0;
    let priceRange: [number, number] = [0, 0];
    const recommendations: string[] = [];

    switch (model) {
      case 'cost_plus':
        recommendedPrice = params.cost * (1 + params.markup);
        margin = params.markup;
        priceRange = [recommendedPrice * 0.95, recommendedPrice * 1.05];
        recommendations.push(`Cost-plus pricing provides ${(margin * 100).toFixed(1)}% margin`);
        if (margin < 0.2) recommendations.push('Consider increasing markup for better profitability');
        break;

      case 'value_based':
        const valuePrice = params.maxWillingness * params.valuePerception;
        recommendedPrice = Math.max(valuePrice, params.cost * 1.1); // Ensure minimum 10% margin
        margin = (recommendedPrice - params.cost) / recommendedPrice;
        priceRange = [valuePrice * 0.9, valuePrice * 1.1];
        recommendations.push(`Price based on ${(params.valuePerception * 100)}% of perceived value`);
        if (margin > 0.5) recommendations.push('High margin suggests strong value proposition');
        break;

      case 'competitive':
        const strategies = {
          below: 0.95,
          match: 1.0,
          premium: 1.15
        };
        const multiplier = strategies[params.positionStrategy as keyof typeof strategies] || 1.0;
        recommendedPrice = params.competitorPrice * multiplier;
        margin = (recommendedPrice - params.cost) / recommendedPrice;
        priceRange = [recommendedPrice * 0.98, recommendedPrice * 1.02];
        recommendations.push(`${params.positionStrategy} pricing vs competition`);
        if (recommendedPrice < params.cost) recommendations.push('WARNING: Price below cost');
        break;

      case 'dynamic':
        const basePrice = params.baseCost * 1.25; // 25% base markup
        const demandAdjustment = 1 + (params.demandLevel - 0.5) * 0.2; // ±10% based on demand
        const seasonalAdjustment = params.seasonalFactor;
        recommendedPrice = basePrice * demandAdjustment * seasonalAdjustment;
        margin = (recommendedPrice - params.baseCost) / recommendedPrice;
        priceRange = [recommendedPrice * 0.9, recommendedPrice * 1.3];
        recommendations.push('Dynamic pricing adjusts to market conditions');
        recommendations.push(`Current demand factor: ${demandAdjustment.toFixed(2)}`);
        break;

      case 'penetration':
        const penetrationPrice = params.cost * (1 + 0.1); // Low 10% markup
        const volumeBonus = Math.log(params.marketSize) * 0.01; // Scale with market size
        recommendedPrice = penetrationPrice * (1 + volumeBonus);
        margin = (recommendedPrice - params.cost) / recommendedPrice;
        priceRange = [params.cost * 1.05, params.cost * 1.2];
        recommendations.push('Low price to penetrate market quickly');
        recommendations.push(`Target ${params.penetrationRate}% market share in ${params.timeHorizon} months`);
        break;

      case 'skimming':
        const skimmingPrice = params.premiumWillingness * (1 - params.competitionThreat * 0.2);
        recommendedPrice = Math.max(skimmingPrice, params.cost * 1.5); // Minimum 50% margin
        margin = (recommendedPrice - params.cost) / recommendedPrice;
        priceRange = [recommendedPrice * 0.8, recommendedPrice * 1.2];
        recommendations.push('High initial price for early adopters');
        recommendations.push('Plan price reductions as market matures');
        if (params.competitionThreat > 0.7) recommendations.push('High competition threat - consider faster price decline');
        break;
    }

    // Calculate elasticity estimate
    const elasticity = params.demandElasticity || -1.2;
    
    // Determine competitive position
    const competitivePosition = !params.competitorPrice ? 'at' :
      recommendedPrice < params.competitorPrice * 0.95 ? 'below' :
      recommendedPrice > params.competitorPrice * 1.05 ? 'above' : 'at';

    return {
      recommendedPrice: Math.round(recommendedPrice * 100) / 100,
      priceRange: [Math.round(priceRange[0] * 100) / 100, Math.round(priceRange[1] * 100) / 100],
      margin: Math.round(margin * 10000) / 100, // Percentage with 2 decimals
      elasticity,
      competitivePosition,
      recommendations
    };
  };

  const renderParameterInput = (paramKey: string, paramConfig: any) => {
    const value = parameters[paramKey] || '';
    
    if (paramConfig.type === 'select') {
      return (
        <Select value={value} onValueChange={(val) => setParameters({...parameters, [paramKey]: val})}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${paramConfig.label}`} />
          </SelectTrigger>
          <SelectContent>
            {paramConfig.options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    return (
      <Input
        type={paramConfig.type}
        value={value}
        onChange={(e) => setParameters({
          ...parameters, 
          [paramKey]: paramConfig.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
        })}
        min={paramConfig.min}
        max={paramConfig.max}
        step={paramConfig.step}
        required={paramConfig.required}
      />
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Advanced Pricing Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="model-selection">
            <TabsList>
              <TabsTrigger value="model-selection">Model Selection</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="model-selection">
              <div className="space-y-4">
                <Label>Select Pricing Model</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pricingModels.map((model) => (
                    <Card 
                      key={model.type} 
                      className={`cursor-pointer transition-colors ${selectedModel === model.type ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      onClick={() => setSelectedModel(model.type)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="parameters">
              {currentModel && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{currentModel.name}</h3>
                    <p className="text-muted-foreground mb-4">{currentModel.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(currentModel.parameters).map(([key, config]: [string, any]) => (
                      <div key={key}>
                        <Label className="mb-2 block">{config.label}</Label>
                        {renderParameterInput(key, config)}
                      </div>
                    ))}
                  </div>
                  
                  <Button onClick={calculatePrice} disabled={calculating} className="w-full">
                    {calculating ? 'Calculating...' : 'Calculate Optimal Price'}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results">
              {result ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-8 w-8 mx-auto text-green-500 mb-2" />
                        <p className="text-sm text-muted-foreground">Recommended Price</p>
                        <p className="text-2xl font-bold">KES {result.recommendedPrice.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <p className="text-sm text-muted-foreground">Profit Margin</p>
                        <p className="text-2xl font-bold">{result.margin.toFixed(1)}%</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Target className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                        <p className="text-sm text-muted-foreground">Competitive Position</p>
                        <Badge variant={result.competitivePosition === 'above' ? 'default' : result.competitivePosition === 'below' ? 'secondary' : 'outline'}>
                          {result.competitivePosition.toUpperCase()}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Price Range Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Minimum Price:</span>
                          <span className="font-semibold">KES {result.priceRange[0].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maximum Price:</span>
                          <span className="font-semibold">KES {result.priceRange[1].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price Elasticity:</span>
                          <span className="font-semibold">{result.elasticity.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Configure parameters and calculate pricing to see results
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
