import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Building, Users, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuestionnaireData {
  role: string;
  industry: string;
  company_size: string;
  revenue_range: string;
  primary_challenge: string;
  secondary_challenges: string[];
  geographic_scope: string;
  current_tools: string[];
  optimization_experience: string;
  decision_timeline: string;
  success_metrics: string[];
  email: string;
}

const ComprehensiveQuestionnaire = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<QuestionnaireData>>({
    secondary_challenges: [],
    current_tools: [],
    success_metrics: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { id: "profile", title: "Your Profile", icon: Users },
    { id: "business", title: "Business Context", icon: Building },
    { id: "challenges", title: "Supply Chain Challenges", icon: MapPin },
    { id: "requirements", title: "Requirements & Goals", icon: CheckCircle }
  ];

  const industryModelsMapping = {
    "agriculture": {
      models: ["cold-chain", "seasonal-inventory", "weather-risk", "cooperative-optimization", "export-logistics"],
      solutions: "Cold chain management, seasonal demand planning, weather risk modeling"
    },
    "manufacturing": {
      models: ["production-scheduling", "supplier-risk", "lean-optimization", "quality-control", "capacity-planning"],
      solutions: "Production optimization, supplier diversification, lean manufacturing"
    },
    "retail": {
      models: ["demand-forecasting", "inventory-optimization", "distribution-planning", "promotion-optimization"],
      solutions: "Demand planning, inventory management, distribution network optimization"
    },
    "logistics": {
      models: ["route-optimization", "fleet-management", "hub-location", "cross-docking", "last-mile"],
      solutions: "Route planning, fleet optimization, hub location planning"
    },
    "mining": {
      models: ["heavy-haul", "maintenance-scheduling", "supply-planning", "equipment-optimization"],
      solutions: "Heavy equipment optimization, maintenance planning, supply chain resilience"
    }
  };

  const companySizeModels = {
    "small": ["center-of-gravity", "basic-eoq", "simple-routing", "cash-flow-optimization"],
    "medium": ["multi-echelon-inventory", "network-optimization", "demand-forecasting", "supplier-selection"],
    "large": ["enterprise-optimization", "advanced-simulation", "ai-forecasting", "risk-management"],
    "enterprise": ["global-optimization", "quantum-algorithms", "real-time-optimization", "digital-twin"]
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInput = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof QuestionnaireData] as string[] || []), value]
        : (prev[field as keyof QuestionnaireData] as string[] || []).filter(item => item !== value)
    }));
  };

  const generateRecommendations = () => {
    const industryModels = industryModelsMapping[formData.industry as keyof typeof industryModelsMapping]?.models || [];
    const sizeModels = companySizeModels[formData.company_size as keyof typeof companySizeModels] || [];
    
    // Challenge-based model recommendations
    const challengeModels: Record<string, string[]> = {
      "inventory": ["eoq-optimization", "abc-analysis", "safety-stock", "multi-echelon"],
      "routes": ["vehicle-routing", "tsp-optimization", "delivery-planning", "fuel-optimization"],
      "facilities": ["facility-location", "center-of-gravity", "p-median", "hub-location"],
      "demand": ["arima-forecasting", "machine-learning", "seasonal-decomposition", "prophet"],
      "costs": ["cost-modeling", "activity-based-costing", "total-cost-ownership"],
      "risk": ["risk-assessment", "scenario-analysis", "supplier-diversification", "resilience-metrics"],
      "quality": ["six-sigma", "statistical-process-control", "quality-optimization"],
      "sustainability": ["carbon-footprint", "green-optimization", "circular-economy"]
    };

    const primaryModels = challengeModels[formData.primary_challenge as string] || [];
    const secondaryModels = formData.secondary_challenges?.flatMap(challenge => 
      challengeModels[challenge] || []
    ) || [];

    return {
      primary_models: primaryModels,
      industry_models: industryModels,
      size_appropriate_models: sizeModels,
      secondary_models: secondaryModels,
      recommended_solution_path: generateSolutionPath()
    };
  };

  const generateSolutionPath = () => {
    const paths = {
      "immediate": "Quick wins → Pilot implementation → Full rollout",
      "short-term": "Assessment → Proof of concept → Phased implementation",
      "long-term": "Strategic planning → Pilot programs → Enterprise rollout"
    };
    return paths[formData.decision_timeline as keyof typeof paths] || paths["short-term"];
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const recommendations = generateRecommendations();
      
      const payload = {
        ...formData,
        source: 'comprehensive_questionnaire',
        recommendations,
        meta: {
          completion_date: new Date().toISOString(),
          recommended_models: recommendations.primary_models,
          solution_path: recommendations.recommended_solution_path
        }
      };

      const { error } = await supabase.from('leads').insert(payload);
      if (error) throw error;
      
      setIsComplete(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isComplete) {
    return (
      <section id="assessment" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                Assessment Complete!
              </h2>
              <p className="text-lg text-green-700 mb-6">
                Thank you for completing our comprehensive supply chain assessment. We're analyzing your responses and will send you a personalized optimization roadmap within 24 hours.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg border">
              <h3 className="text-xl font-bold mb-4">What Happens Next?</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div className="font-semibold">Analysis</div>
                  <div className="text-muted-foreground">Our algorithms match your needs to optimal models</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div className="font-semibold">Recommendations</div>
                  <div className="text-muted-foreground">Personalized roadmap with specific solutions</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div className="font-semibold">Implementation</div>
                  <div className="text-muted-foreground">Guided setup and optimization deployment</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button size="lg" asChild>
                <a href="/dashboard">Explore Platform While You Wait</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <section id="assessment" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Get Your Personalized Supply Chain Optimization Roadmap
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Complete this comprehensive assessment to receive specific model recommendations for your business
            </p>
            
            <div className="flex justify-center items-center gap-4 mb-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <step.icon className="h-4 w-4" />
                    {step.title}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                  )}
                </div>
              ))}
            </div>
            
            <Progress value={progress} className="max-w-md mx-auto" />
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const IconComponent = steps[currentStep].icon;
                  return <IconComponent className="h-5 w-5" />;
                })()}
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-2">Your Role *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.role || ""}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      required
                    >
                      <option value="">Select your role</option>
                      <option value="ceo">CEO/Executive</option>
                      <option value="supply-chain-director">Supply Chain Director</option>
                      <option value="supply-chain-manager">Supply Chain Manager</option>
                      <option value="operations-manager">Operations Manager</option>
                      <option value="logistics-manager">Logistics Manager</option>
                      <option value="procurement-manager">Procurement Manager</option>
                      <option value="consultant">Supply Chain Consultant</option>
                      <option value="business-analyst">Business Analyst</option>
                      <option value="farmer">Farmer/Cooperative Leader</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-semibold mb-2">Industry/Sector *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.industry || ""}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="agriculture">Agriculture (Tea, Coffee, Horticulture)</option>
                      <option value="manufacturing">Manufacturing & Production</option>
                      <option value="retail">Retail & FMCG</option>
                      <option value="logistics">Logistics & Transportation</option>
                      <option value="mining">Mining & Heavy Industry</option>
                      <option value="healthcare">Healthcare & Pharmaceuticals</option>
                      <option value="construction">Construction & Materials</option>
                      <option value="oil-gas">Oil & Gas</option>
                      <option value="consulting">Supply Chain Consulting</option>
                      <option value="government">Government/Public Sector</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-semibold mb-2">Company Size *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.company_size || ""}
                      onChange={(e) => handleInputChange('company_size', e.target.value)}
                      required
                    >
                      <option value="">Select company size</option>
                      <option value="small">Small (1-50 employees)</option>
                      <option value="medium">Medium (51-500 employees)</option>
                      <option value="large">Large (501-5000 employees)</option>
                      <option value="enterprise">Enterprise (5000+ employees)</option>
                      <option value="consultant">I'm a consultant</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-semibold mb-2">Annual Revenue Range</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.revenue_range || ""}
                      onChange={(e) => handleInputChange('revenue_range', e.target.value)}
                    >
                      <option value="">Select revenue range</option>
                      <option value="under-1m">Under KES 100M ($1M USD)</option>
                      <option value="1m-10m">KES 100M - 1B ($1M-$10M USD)</option>
                      <option value="10m-100m">KES 1B - 10B ($10M-$100M USD)</option>
                      <option value="over-100m">Over KES 10B ($100M+ USD)</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-2">Geographic Scope *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.geographic_scope || ""}
                      onChange={(e) => handleInputChange('geographic_scope', e.target.value)}
                      required
                    >
                      <option value="">Select geographic scope</option>
                      <option value="local">Local/City (Single city or region)</option>
                      <option value="national">National (Kenya-wide operations)</option>
                      <option value="east-africa">East Africa (Kenya, Uganda, Tanzania, etc.)</option>
                      <option value="africa">Africa-wide</option>
                      <option value="global">Global operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">Current Tools & Systems (Select all that apply)</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Excel spreadsheets", "ERP system (SAP, Oracle, etc.)", "WMS (Warehouse Management)",
                        "TMS (Transportation Management)", "Demand planning software", "Inventory management system",
                        "Business intelligence tools", "No formal systems", "Other"
                      ].map(tool => (
                        <label key={tool} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={formData.current_tools?.includes(tool) || false}
                            onChange={(e) => handleArrayInput('current_tools', tool, e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">{tool}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Optimization Experience Level *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.optimization_experience || ""}
                      onChange={(e) => handleInputChange('optimization_experience', e.target.value)}
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner (New to supply chain optimization)</option>
                      <option value="some-experience">Some Experience (Used basic tools/methods)</option>
                      <option value="experienced">Experienced (Implemented optimization projects)</option>
                      <option value="expert">Expert (Advanced optimization background)</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-2">Primary Supply Chain Challenge *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.primary_challenge || ""}
                      onChange={(e) => handleInputChange('primary_challenge', e.target.value)}
                      required
                    >
                      <option value="">Select primary challenge</option>
                      <option value="inventory">Inventory Management (High costs, stockouts)</option>
                      <option value="routes">Transportation & Route Optimization</option>
                      <option value="facilities">Facility Location & Network Design</option>
                      <option value="demand">Demand Forecasting & Planning</option>
                      <option value="costs">Cost Reduction & Optimization</option>
                      <option value="risk">Risk Management & Resilience</option>
                      <option value="quality">Quality Management & Control</option>
                      <option value="sustainability">Sustainability & Green Operations</option>
                      <option value="supplier">Supplier Management & Selection</option>
                      <option value="visibility">Supply Chain Visibility & Tracking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">Secondary Challenges (Select all that apply)</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Cash flow management", "Seasonal demand variations", "Supplier reliability",
                        "Quality control issues", "Regulatory compliance", "Technology integration",
                        "Staff training & capability", "Performance measurement", "Customer service levels"
                      ].map(challenge => (
                        <label key={challenge} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={formData.secondary_challenges?.includes(challenge) || false}
                            onChange={(e) => handleArrayInput('secondary_challenges', challenge, e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">{challenge}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-2">Decision Timeline *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.decision_timeline || ""}
                      onChange={(e) => handleInputChange('decision_timeline', e.target.value)}
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (Within 1 month)</option>
                      <option value="short-term">Short-term (1-3 months)</option>
                      <option value="medium-term">Medium-term (3-6 months)</option>
                      <option value="long-term">Long-term (6+ months)</option>
                      <option value="exploring">Just exploring options</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">Success Metrics (What defines success for you?)</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Cost reduction", "Improved service levels", "Faster delivery times",
                        "Better inventory turnover", "Risk reduction", "Sustainability goals",
                        "Operational efficiency", "Customer satisfaction", "Compliance improvement"
                      ].map(metric => (
                        <label key={metric} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={formData.success_metrics?.includes(metric) || false}
                            onChange={(e) => handleArrayInput('success_metrics', metric, e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">{metric}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Email Address *</label>
                    <input 
                      type="email"
                      className="w-full p-3 border rounded-lg"
                      placeholder="your@email.com"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll send your personalized roadmap to this email
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : 
                   currentStep === steps.length - 1 ? "Get My Recommendations" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveQuestionnaire;