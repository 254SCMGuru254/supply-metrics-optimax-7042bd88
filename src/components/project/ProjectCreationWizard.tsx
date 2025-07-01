
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Package, Globe, Factory, Truck } from "lucide-react";

const ProjectCreationWizard = ({ onProjectCreated }: { onProjectCreated?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    project_type: "",
    industry: ""
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const projectTypes = [
    { value: "supply_chain_optimization", label: "Supply Chain Optimization", icon: Package },
    { value: "kenya_focused", label: "Kenya Market Focus", icon: Globe },
    { value: "manufacturing", label: "Manufacturing Network", icon: Factory },
    { value: "logistics", label: "Logistics & Transportation", icon: Truck }
  ];

  const kenyaIndustries = [
    { value: "tea", label: "Tea Processing & Export" },
    { value: "coffee", label: "Coffee Supply Chain" },
    { value: "horticulture", label: "Horticultural Products" },
    { value: "manufacturing", label: "Manufacturing & Assembly" },
    { value: "retail", label: "Retail & Distribution" },
    { value: "logistics", label: "Logistics Services" }
  ];

  const handleCreateProject = async () => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to create a project.", variant: "destructive" });
      return;
    }

    if (!projectData.name.trim() || !projectData.project_type) {
      toast({ title: "Missing information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name: projectData.name.trim(),
          description: projectData.description.trim(),
          project_type: projectData.project_type,
          user_id: user.id,
          settings: {
            industry: projectData.industry,
            created_via: "wizard",
            features_enabled: ["basic_optimization", "data_input", "reporting"]
          }
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project created successfully!",
        description: `"${projectData.name}" is ready for optimization.`
      });

      // Navigate to the project's data input page
      navigate(`/data-input/${data.id}`);
      
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create New Project</CardTitle>
        <p className="text-center text-gray-600">
          Set up your supply chain optimization project in minutes
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Project Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Kenya Tea Cooperative Network"
            value={projectData.name}
            onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
          />
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <Label>Project Type *</Label>
          <div className="grid grid-cols-2 gap-3">
            {projectTypes.map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer border-2 transition-all ${
                  projectData.project_type === type.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setProjectData({ ...projectData, project_type: type.value })}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium text-sm">{type.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Kenya Industry (if Kenya focused) */}
        {projectData.project_type === "kenya_focused" && (
          <div className="space-y-2">
            <Label htmlFor="industry">Kenya Industry Focus</Label>
            <Select value={projectData.industry} onValueChange={(value) => setProjectData({ ...projectData, industry: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {kenyaIndustries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your supply chain optimization goals..."
            value={projectData.description}
            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
            rows={3}
          />
        </div>

        {/* Features Badge */}
        <div className="space-y-2">
          <Label>Included Features</Label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Data Input & Management</Badge>
            <Badge variant="secondary">42+ Optimization Models</Badge>
            <Badge variant="secondary">Advanced Analytics</Badge>
            <Badge variant="secondary">Kenya Market Data</Badge>
            <Badge variant="secondary">Export & Reporting</Badge>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateProject}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Project...
            </>
          ) : (
            "Create Project & Start Optimizing"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCreationWizard;
