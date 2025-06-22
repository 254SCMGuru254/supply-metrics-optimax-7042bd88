import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings, AlertCircle, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface HeuristicCalculatorsProps {
  projectId: string;
}

export function HeuristicCalculators({ projectId }: HeuristicCalculatorsProps) {
  const [activeTab, setActiveTab] = useState('');
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const { data: formulas, isLoading: isLoadingFormulas } = useQuery({
    queryKey: ['heuristicFormulas', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('model_formulas')
        .select('*')
        .eq('project_id', projectId)
        .eq('category', 'heuristic');
      
      if (error) throw new Error(error.message);

      if (data && data.length > 0) {
        setActiveTab(data[0].formula);
      }
      return data || [];
    },
    enabled: !!projectId,
  });

  const { data: projectNodes, isLoading: isLoadingNodes } = useQuery({
    queryKey: ['projectNodes', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase.from("nodes").select("*").eq('project_id', projectId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!projectId,
  });

  const handleInputChange = (id, value) => {
    setInputs(inputs => ({ ...inputs, [id]: value }));
  };

  const handleRun = () => {
    setResult({
      status: "success",
      message: "Heuristic run complete.",
      output: { ...inputs, nodes: projectNodes }
    });
  };

  if (isLoadingFormulas || isLoadingNodes) {
    return (
        <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading Heuristic Models...</span>
        </div>
    );
  }

  if (!formulas || formulas.length === 0) {
    return (
      <Card className="m-4 p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-xl font-semibold text-gray-900">No Heuristic Models Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please add heuristic models to your project to begin optimization.
        </p>
        <div className="mt-6">
          <Link to={`/data-input/${projectId}`}>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Add Models
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-4">
      {/* The main content is now inside the calculator components */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4">
          {formulas.map(f => (
            <TabsTrigger key={f.formula} value={f.formula}>{f.name}</TabsTrigger>
          ))}
        </TabsList>
        {formulas.map(formula => (
          <TabsContent key={formula.formula} value={formula.formula}>
            <Card className="my-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {formula.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleRun(); }}>
                  {formula.inputs.map(input => (
                    <div key={input.name}>
                      <label className="block text-sm font-medium mb-1">{input.label}:</label>
                      <input
                        type="number"
                        value={inputs[input.name] || ""}
                        onChange={e => handleInputChange(input.name, e.target.value)}
                        className="w-full border rounded p-2"
                        min={0}
                      />
                    </div>
                  ))}
                  <button
                    className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    type="submit"
                  >
                    Run
                  </button>
                </form>
                <div className="mt-4">
                  {result && (
                    <Card className="p-3 border border-primary bg-blue-50 mt-4">
                      <div className="font-semibold">Results:</div>
                      <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default HeuristicCalculators;
