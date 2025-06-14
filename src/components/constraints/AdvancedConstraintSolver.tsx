
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, CheckCircle, AlertCircle, Settings } from 'lucide-react';

interface Constraint {
  id: string;
  type: 'capacity' | 'time' | 'cost' | 'service_level' | 'sustainability' | 'custom';
  name: string;
  operator: '=' | '<=' | '>=' | '<' | '>';
  value: number;
  unit?: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
  violations?: number;
}

interface AdvancedConstraintSolverProps {
  projectId: string;
  onConstraintsChange?: (constraints: Constraint[]) => void;
}

export function AdvancedConstraintSolver({ projectId, onConstraintsChange }: AdvancedConstraintSolverProps) {
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [newConstraint, setNewConstraint] = useState<Partial<Constraint>>({
    type: 'capacity',
    operator: '<=',
    priority: 'medium',
    isActive: true
  });
  const [solving, setSolving] = useState(false);
  const [feasibility, setFeasibility] = useState<'feasible' | 'infeasible' | 'unknown'>('unknown');
  const { toast } = useToast();

  useEffect(() => {
    loadConstraints();
  }, [projectId]);

  const loadConstraints = async () => {
    try {
      const { data, error } = await supabase
        .from('model_constraints')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true);

      if (error) throw error;

      const formattedConstraints = data?.map(item => ({
        id: item.id,
        type: item.constraint_type,
        name: item.constraint_name,
        operator: item.parameters.operator || '<=',
        value: item.parameters.value || 0,
        unit: item.parameters.unit,
        priority: item.parameters.priority || 'medium',
        isActive: item.is_active,
        violations: 0
      })) || [];

      setConstraints(formattedConstraints);
      onConstraintsChange?.(formattedConstraints);
    } catch (error) {
      console.error('Error loading constraints:', error);
    }
  };

  const addConstraint = async () => {
    if (!newConstraint.name || !newConstraint.value) {
      toast({
        title: "Validation Error",
        description: "Please provide constraint name and value.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('model_constraints')
        .insert({
          project_id: projectId,
          constraint_type: newConstraint.type!,
          constraint_name: newConstraint.name!,
          parameters: {
            operator: newConstraint.operator,
            value: newConstraint.value,
            unit: newConstraint.unit,
            priority: newConstraint.priority
          },
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      const constraint: Constraint = {
        id: data.id,
        type: newConstraint.type!,
        name: newConstraint.name!,
        operator: newConstraint.operator as any,
        value: newConstraint.value!,
        unit: newConstraint.unit,
        priority: newConstraint.priority as any,
        isActive: true,
        violations: 0
      };

      const updatedConstraints = [...constraints, constraint];
      setConstraints(updatedConstraints);
      onConstraintsChange?.(updatedConstraints);

      setNewConstraint({
        type: 'capacity',
        operator: '<=',
        priority: 'medium',
        isActive: true
      });

      toast({
        title: "Constraint Added",
        description: `${constraint.name} constraint has been added successfully.`
      });
    } catch (error) {
      console.error('Error adding constraint:', error);
      toast({
        title: "Error",
        description: "Failed to add constraint.",
        variant: "destructive"
      });
    }
  };

  const removeConstraint = async (id: string) => {
    try {
      const { error } = await supabase
        .from('model_constraints')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      const updatedConstraints = constraints.filter(c => c.id !== id);
      setConstraints(updatedConstraints);
      onConstraintsChange?.(updatedConstraints);

      toast({
        title: "Constraint Removed",
        description: "Constraint has been deactivated."
      });
    } catch (error) {
      console.error('Error removing constraint:', error);
    }
  };

  const solveConstraints = async () => {
    setSolving(true);
    try {
      // Simulate constraint solving (in real implementation, this would call optimization engine)
      const violations = await checkConstraintViolations();
      
      const updatedConstraints = constraints.map(constraint => ({
        ...constraint,
        violations: violations[constraint.id] || 0
      }));

      setConstraints(updatedConstraints);
      onConstraintsChange?.(updatedConstraints);

      const totalViolations = Object.values(violations).reduce((sum: number, val: any) => sum + val, 0);
      setFeasibility(totalViolations === 0 ? 'feasible' : 'infeasible');

      toast({
        title: "Constraint Analysis Complete",
        description: totalViolations === 0 
          ? "All constraints are satisfied." 
          : `${totalViolations} constraint violations detected.`,
        variant: totalViolations === 0 ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error solving constraints:', error);
      toast({
        title: "Solver Error",
        description: "Failed to analyze constraints.",
        variant: "destructive"
      });
    } finally {
      setSolving(false);
    }
  };

  const checkConstraintViolations = async (): Promise<Record<string, number>> => {
    // Fetch current solution data
    const { data: nodes } = await supabase
      .from('supply_nodes')
      .select('*')
      .eq('project_id', projectId);

    const { data: routes } = await supabase
      .from('supply_routes')
      .select('*')
      .eq('project_id', projectId);

    const violations: Record<string, number> = {};

    // Check each constraint
    constraints.forEach(constraint => {
      let actualValue = 0;
      let violationCount = 0;

      switch (constraint.type) {
        case 'capacity':
          actualValue = nodes?.reduce((sum, node) => sum + (node.capacity || 0), 0) || 0;
          break;
        case 'cost':
          actualValue = routes?.reduce((sum, route) => sum + (route.cost_per_unit * route.distance || 0), 0) || 0;
          break;
        case 'time':
          actualValue = routes?.reduce((sum, route) => sum + (route.transit_time || 0), 0) || 0;
          break;
        case 'service_level':
          actualValue = nodes?.reduce((sum, node) => sum + (node.service_level || 0), 0) / (nodes?.length || 1) || 0;
          break;
        default:
          actualValue = Math.random() * 100; // Placeholder for custom constraints
      }

      // Check if constraint is violated
      switch (constraint.operator) {
        case '<=':
          violationCount = actualValue > constraint.value ? 1 : 0;
          break;
        case '>=':
          violationCount = actualValue < constraint.value ? 1 : 0;
          break;
        case '=':
          violationCount = Math.abs(actualValue - constraint.value) > 0.01 ? 1 : 0;
          break;
        case '<':
          violationCount = actualValue >= constraint.value ? 1 : 0;
          break;
        case '>':
          violationCount = actualValue <= constraint.value ? 1 : 0;
          break;
      }

      violations[constraint.id] = violationCount;
    });

    return violations;
  };

  const getConstraintIcon = (constraint: Constraint) => {
    if (constraint.violations && constraint.violations > 0) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Constraint Solver
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Constraint Type</Label>
                <Select value={newConstraint.type} onValueChange={(value) => setNewConstraint({...newConstraint, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="capacity">Capacity</SelectItem>
                    <SelectItem value="cost">Cost</SelectItem>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="service_level">Service Level</SelectItem>
                    <SelectItem value="sustainability">Sustainability</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Max Vehicle Capacity"
                  value={newConstraint.name || ''}
                  onChange={(e) => setNewConstraint({...newConstraint, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Operator</Label>
                <Select value={newConstraint.operator} onValueChange={(value) => setNewConstraint({...newConstraint, operator: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<=">&le; (Less than or equal)</SelectItem>
                    <SelectItem value=">=">&ge; (Greater than or equal)</SelectItem>
                    <SelectItem value="=">=</SelectItem>
                    <SelectItem value="<">&lt; (Less than)</SelectItem>
                    <SelectItem value=">">&gt; (Greater than)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newConstraint.value || ''}
                  onChange={(e) => setNewConstraint({...newConstraint, value: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Unit (Optional)</Label>
                <Input
                  placeholder="e.g., kg, km, hours"
                  value={newConstraint.unit || ''}
                  onChange={(e) => setNewConstraint({...newConstraint, unit: e.target.value})}
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={newConstraint.priority} onValueChange={(value) => setNewConstraint({...newConstraint, priority: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={addConstraint} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Constraint
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active Constraints ({constraints.length})</span>
            <div className="flex gap-2">
              <Badge variant={feasibility === 'feasible' ? 'default' : feasibility === 'infeasible' ? 'destructive' : 'secondary'}>
                {feasibility === 'feasible' ? 'Feasible' : feasibility === 'infeasible' ? 'Infeasible' : 'Unknown'}
              </Badge>
              <Button onClick={solveConstraints} disabled={solving} size="sm">
                {solving ? 'Analyzing...' : 'Analyze Constraints'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {constraints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No constraints defined. Add constraints to ensure your optimization meets business requirements.
            </div>
          ) : (
            <div className="space-y-3">
              {constraints.map((constraint) => (
                <div key={constraint.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getConstraintIcon(constraint)}
                    <div>
                      <div className="font-medium">{constraint.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {constraint.type} {constraint.operator} {constraint.value} {constraint.unit}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(constraint.priority) as any}>
                      {constraint.priority}
                    </Badge>
                    {constraint.violations !== undefined && constraint.violations > 0 && (
                      <Badge variant="destructive">
                        {constraint.violations} violations
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => removeConstraint(constraint.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
