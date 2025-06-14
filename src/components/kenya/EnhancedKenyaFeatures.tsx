
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Leaf, Coffee, Flower2, Factory, Truck, MapPin } from 'lucide-react';

interface IndustryAnalysis {
  industry: string;
  exportValue: string;
  keyChallenges: string[];
  optimizationOpportunities: string[];
}

interface IndustryConfiguration {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  exportValue: string;
  challenges: string[];
}

const analyzeIndustry = (industry: string): IndustryAnalysis => {
  switch (industry) {
    case 'tea':
      return {
        industry: 'Tea Industry',
        exportValue: 'KES 181.69B',
        keyChallenges: ['Quality consistency', 'Price volatility', 'Logistics efficiency'],
        optimizationOpportunities: ['Improved sorting techniques', 'Direct farmer support', 'Route optimization']
      };
    case 'coffee':
      return {
        industry: 'Coffee Industry',
        exportValue: 'KES 31.48B',
        keyChallenges: ['Climate change', 'Market access', 'Aging farmers'],
        optimizationOpportunities: ['Drought-resistant varieties', 'Fair trade certifications', 'Youth involvement programs']
      };
    case 'floriculture':
      return {
        industry: 'Floriculture Industry',
        exportValue: 'KES 108.76B',
        keyChallenges: ['Pest control', 'Cold chain logistics', 'Market competition'],
        optimizationOpportunities: ['Integrated pest management', 'Refrigerated transport', 'Niche market development']
      };
    case 'manufacturing':
      return {
        industry: 'Manufacturing Industry',
        exportValue: 'KES 650B',
        keyChallenges: ['Raw material costs', 'Energy supply', 'Skilled labor'],
        optimizationOpportunities: ['Local sourcing', 'Renewable energy adoption', 'Technical training programs']
      };
    default:
      return {
        industry: 'Unknown',
        exportValue: 'N/A',
        keyChallenges: [],
        optimizationOpportunities: []
      };
  }
};

export function EnhancedKenyaFeatures() {
  const [selectedIndustry, setSelectedIndustry] = useState('tea');
  const [analysisResults, setAnalysisResults] = useState<IndustryAnalysis | null>(null);

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    setAnalysisResults(analyzeIndustry(industry));
  };

  const industries = [
    { 
      id: 'tea', 
      name: 'Tea Industry', 
      icon: Leaf, 
      exportValue: 'KES 181.69B',
      challenges: ['Quality consistency', 'Price volatility', 'Logistics efficiency']
    },
    { 
      id: 'coffee', 
      name: 'Coffee Industry', 
      icon: Coffee, 
      exportValue: 'KES 31.48B',
      challenges: ['Climate change', 'Market access', 'Aging farmers']
    },
    { 
      id: 'floriculture', 
      name: 'Floriculture Industry', 
      icon: Flower2, 
      exportValue: 'KES 108.76B',
      challenges: ['Pest control', 'Cold chain logistics', 'Market competition']
    },
    { 
      id: 'manufacturing', 
      name: 'Manufacturing Industry', 
      icon: Factory, 
      exportValue: 'KES 650B',
      challenges: ['Raw material costs', 'Energy supply', 'Skilled labor']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {industries.map((industry) => (
          <Card key={industry.id} className="border-dashed border-2">
            <CardContent className="p-6 text-center">
              <industry.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-semibold mb-2">{industry.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export Value: {industry.exportValue}
              </p>
              <Button variant="outline" onClick={() => handleIndustryChange(industry.id)}>
                Analyze
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {analysisResults.industry} Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Key Challenges</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {analysisResults.keyChallenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Optimization Opportunities</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {analysisResults.optimizationOpportunities.map((opportunity, index) => (
                      <li key={index}>{opportunity}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Supply Chain Insights</h4>
                <p className="text-sm text-muted-foreground">
                  Explore detailed supply chain maps, logistics network analysis, and infrastructure assessments specific to {analysisResults.industry}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
