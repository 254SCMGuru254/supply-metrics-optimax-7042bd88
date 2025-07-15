
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkDesignFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const NetworkDesignForm: React.FC<NetworkDesignFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    algorithm: 'genetic',
    iterations: 1000,
    populationSize: 50,
    mutationRate: 0.1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Design Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="algorithm">Algorithm</Label>
            <Input
              id="algorithm"
              value={formData.algorithm}
              onChange={(e) => setFormData(prev => ({ ...prev, algorithm: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="iterations">Iterations</Label>
            <Input
              id="iterations"
              type="number"
              value={formData.iterations}
              onChange={(e) => setFormData(prev => ({ ...prev, iterations: parseInt(e.target.value) }))}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
