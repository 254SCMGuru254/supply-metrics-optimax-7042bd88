import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Building, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
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

      // Store lead in database
      const { data, error } = await supabase.from('leads').insert(payload);
      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to submit form. Please try again or contact support if the issue persists.');
      }

      // Send email with recommendations
      const { error: emailError } = await supabase.functions.invoke('send-recommendations-email', {
        body: { 
          email: formData.email,
          recommendations: recommendations,
          userData: {
            role: formData.role,
            company_size: formData.company_size,
            primary_challenge: formData.primary_challenge
          }
        }
      });
      
      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue with success state but log the error
      }
      
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

  const generateDetailedRecommendations = () => {
    const baseRecommendations = generateRecommendations();
    const { primary_challenge, company_size, current_tools, success_metrics } = formData;

    // Immediate Actions based on primary challenge
    const immediateActions = {
      'inventory': {
        steps: [
          'Start with top 20% of products that drive 80% of revenue',
          'Implement basic stock level tracking',
          'Set up minimum stock alerts'
        ],
        timeline: '1-2 weeks',
        expectedImpact: 'Reduce stockouts by 40% in first month'
      },
      'delivery': {
        steps: [
          'Map current delivery routes',
          'Track fuel consumption per route',
          'Identify peak delivery times'
        ],
        timeline: '1 week',
        expectedImpact: '25% fuel savings in first month'
      },
      'waste': {
        steps: [
          'Track expiry dates of current stock',
          'Monitor daily waste levels',
          'Implement first-in-first-out system'
        ],
        timeline: '1-2 weeks',
        expectedImpact: 'Reduce waste by 30% in first month'
      }
    };

    // Tool recommendations based on current tools
    const toolRecommendations = current_tools?.includes('Excel spreadsheets') 
      ? 'Gradual transition from spreadsheets to digital system'
      : 'Immediate implementation of digital tracking';

    // Scale-appropriate solutions
    const scaleSolutions = {
      'small': {
        focus: 'Essential features with mobile-first approach',
        implementation: 'Start with basic tracking, expand as needed',
        investment: 'Pay-as-you-grow model'
      },
      'medium': {
        focus: 'Balanced feature set with growth capability',
        implementation: 'Phased rollout over 2-3 months',
        investment: 'Standard package with optional add-ons'
      },
      'large': {
        focus: 'Full feature set with custom integrations',
        implementation: 'Comprehensive implementation with team training',
        investment: 'Enterprise package with dedicated support'
      }
    };

    return {
      ...baseRecommendations,
      immediateActions: immediateActions[primary_challenge as keyof typeof immediateActions] || immediateActions['inventory'],
      scaleApproach: scaleSolutions[company_size as keyof typeof scaleSolutions] || scaleSolutions['small'],
      toolingStrategy: toolRecommendations,
      successMetrics: success_metrics?.map(metric => ({
        metric,
        timeline: '90 days',
        milestones: ['30-day checkpoint', '60-day review', '90-day achievement']
      }))
    };
  };

  if (isComplete) {
    const detailedRecommendations = generateDetailedRecommendations();
    return (
      <section id="assessment" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-[#0067b9] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-[#1a1f2f] mb-4">
                Your Personalized Action Plan
              </h2>
              <p className="text-lg text-[#475467] mb-6">
                Based on your responses, here's your customized roadmap to transform your business challenges into competitive advantages.
              </p>
            </div>

            {/* Immediate Actions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Start Here: Immediate Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {detailedRecommendations.immediateActions.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <Badge>{index + 1}</Badge>
                      </div>
                      <div>
                        <p className="font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Expected Impact: {detailedRecommendations.immediateActions.expectedImpact}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Timeline: {detailedRecommendations.immediateActions.timeline}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Approach */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Custom Implementation Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Focus Areas</h4>
                    <p>{detailedRecommendations.scaleApproach.focus}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Implementation Strategy</h4>
                    <p>{detailedRecommendations.scaleApproach.implementation}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Technology Transition</h4>
                    <p>{detailedRecommendations.toolingStrategy}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Metrics */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Success Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {detailedRecommendations.successMetrics?.map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <h4 className="font-semibold">{item.metric}</h4>
                      <div className="mt-2 space-y-2">
                        {item.milestones.map((milestone, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{milestone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              {/* Immediate Actions */}
              <Card className="border-2 border-[#0067b9]">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1a1f2f]">Immediate Actions (Next 30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.primary_challenge === 'revenue' && (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-[#0067b9] mt-0.5" />
                        <div>
                          <p className="font-medium">Implement Real-Time Demand Tracking</p>
                          <p className="text-sm text-[#475467]">Expected outcome: 15-20% revenue increase through better stock availability</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-[#0067b9] mt-0.5" />
                        <div>
                          <p className="font-medium">Dynamic Pricing Optimization</p>
                          <p className="text-sm text-[#475467]">Expected outcome: 10-15% margin improvement</p>
                        </div>
                      </div>
                    </>
                  )}
                  {formData.primary_challenge === 'costs' && (
                    <>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-[#0067b9] mt-0.5" />
                        <div>
                          <p className="font-medium">Smart Route Optimization</p>
                          <p className="text-sm text-[#475467]">Expected outcome: 25-30% reduction in transportation costs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-[#0067b9] mt-0.5" />
                        <div>
                          <p className="font-medium">Inventory Carrying Cost Reduction</p>
                          <p className="text-sm text-[#475467]">Expected outcome: 20-25% reduction in holding costs</p>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Add similar blocks for other primary challenges */}
                </CardContent>
              </Card>

              {/* 90-Day Transformation Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#1a1f2f]">90-Day Transformation Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Month 1: Quick Wins</h4>
                      <ul className="list-disc pl-5 space-y-2 text-[#475467]">
                        <li>Deploy rapid response solutions for immediate impact</li>
                        <li>Initial team training and process optimization</li>
                        <li>First cost savings realized within 2 weeks</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Month 2: Scale & Optimize</h4>
                      <ul className="list-disc pl-5 space-y-2 text-[#475467]">
                        <li>Expand successful solutions across operations</li>
                        <li>Advanced analytics implementation</li>
                        <li>Team capability building</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Month 3: Transform & Excel</h4>
                      <ul className="list-disc pl-5 space-y-2 text-[#475467]">
                        <li>Full system integration</li>
                        <li>Automated optimization routines</li>
                        <li>Predictive analytics deployment</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expected Outcomes */}
              <Card className="bg-[#f8f9fa]">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1a1f2f]">Expected Business Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0067b9] mb-2">30%</div>
                      <div className="text-sm text-[#475467]">Average Cost Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0067b9] mb-2">2x</div>
                      <div className="text-sm text-[#475467]">Operational Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0067b9] mb-2">20%</div>
                      <div className="text-sm text-[#475467]">Revenue Growth</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 text-center space-y-4">
              <Button size="lg" asChild className="bg-[#0067b9] hover:bg-[#005296]">
                <Link to="/dashboard">Start Your Transformation Now</Link>
              </Button>
              <p className="text-sm text-[#475467]">
                A copy of this plan has been sent to {formData.email}. Our team will contact you within 24 hours to discuss implementation.
              </p>
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
                    <label className="block font-semibold mb-2">What's your biggest business challenge? *</label>
                    <select 
                      className="w-full p-3 border rounded-lg"
                      value={formData.primary_challenge || ""}
                      onChange={(e) => handleInputChange('primary_challenge', e.target.value)}
                      required
                    >
                      <option value="">Select your main challenge</option>
                      <option value="revenue">Revenue is lower than expected</option>
                      <option value="costs">Operating costs are too high</option>
                      <option value="customer-satisfaction">Customer satisfaction is declining</option>
                      <option value="market-share">Losing market share to competitors</option>
                      <option value="stockouts">Frequently running out of stock</option>
                      <option value="cash-flow">Cash flow problems due to excess inventory</option>
                      <option value="delivery">Late or unreliable deliveries</option>
                      <option value="quality">Product quality inconsistency</option>
                      <option value="growth">Unable to scale operations efficiently</option>
                      <option value="wastage">High product wastage or spoilage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-3">What other issues are impacting your business? (Select all that apply)</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Can't predict customer demand accurately", "Suppliers are unreliable",
                        "Too much money tied up in inventory", "High transportation costs",
                        "Market expansion difficulties", "Competition is undercutting prices",
                        "Staff productivity issues", "Manual processes slowing us down",
                        "Unable to track performance effectively", "Limited visibility of operations"
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
                    <label className="block font-semibold mb-3">What business results are most important to you?</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        "Increase revenue by 20%+", "Cut operational costs by 30%+",
                        "Improve customer satisfaction", "Expand to new markets",
                        "Reduce stockouts by 90%", "Free up working capital",
                        "Same-day delivery capability", "Double inventory turns",
                        "Achieve reliable 24-hour fulfillment", "Reduce waste by 50%+"
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
                      placeholder="you@company.com"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact chainio@tenderzville-portal.co.ke or submit this form for your customized solution roadmap
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