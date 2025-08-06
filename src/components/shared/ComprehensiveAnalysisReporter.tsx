import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, TrendingUp, AlertTriangle, CheckCircle, Target, DollarSign, Truck, BarChart3, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface ComprehensiveAnalysisData {
  projectName: string;
  modelType: string;
  inputData: any;
  results: any;
  kpis: {
    costReduction: number;
    efficiencyGain: number;
    carbonReduction: number;
    serviceLevel: number;
    resilience: number;
  };
  recommendations: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string[];
  };
  implementationPlan: {
    phase: string;
    timeline: string;
    priority: 'high' | 'medium' | 'low';
    resources: string;
  }[];
  benchmarking: {
    industry: string;
    percentile: number;
    bestPractices: string[];
  };
}

interface ComprehensiveAnalysisReporterProps {
  data: ComprehensiveAnalysisData;
  onExport?: () => void;
}

export const ComprehensiveAnalysisReporter = ({ 
  data, 
  onExport 
}: ComprehensiveAnalysisReporterProps) => {
  const [reportConfig, setReportConfig] = useState({
    title: `${data.projectName} - Supply Chain Optimization Analysis`,
    executiveSummary: true,
    technicalDetails: true,
    implementationRoadmap: true,
    riskAnalysis: true,
    benchmarking: true,
    appendices: true
  });
  
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const generateComprehensivePDF = async () => {
    setExporting(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      
      // Helper function to add new page if needed
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Title Page
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246);
      doc.text(reportConfig.title, 20, yPosition);
      yPosition += 20;
      
      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Analysis Type: ${data.modelType}`, 20, yPosition);
      yPosition += 20;

      // Executive Summary
      if (reportConfig.executiveSummary) {
        checkPageBreak(40);
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text('Executive Summary', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.text(`This comprehensive analysis of ${data.projectName} reveals significant optimization`, 20, yPosition);
        yPosition += 6;
        doc.text('opportunities across multiple supply chain dimensions.', 20, yPosition);
        yPosition += 15;
        
        // Key Metrics Summary
        doc.setFontSize(14);
        doc.text('Key Performance Indicators:', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`• Cost Reduction: ${data.kpis.costReduction}%`, 25, yPosition);
        yPosition += 5;
        doc.text(`• Efficiency Gain: ${data.kpis.efficiencyGain}%`, 25, yPosition);
        yPosition += 5;
        doc.text(`• Carbon Reduction: ${data.kpis.carbonReduction}%`, 25, yPosition);
        yPosition += 5;
        doc.text(`• Service Level: ${data.kpis.serviceLevel}%`, 25, yPosition);
        yPosition += 5;
        doc.text(`• Resilience Score: ${data.kpis.resilience}/100`, 25, yPosition);
        yPosition += 15;
      }

      // Detailed Analysis Results
      if (reportConfig.technicalDetails) {
        checkPageBreak(30);
        doc.setFontSize(18);
        doc.text('Detailed Analysis Results', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.text('Current State Analysis:', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        if (data.results.currentMetrics) {
          Object.entries(data.results.currentMetrics).forEach(([key, value]) => {
            doc.text(`• ${key}: ${value}`, 25, yPosition);
            yPosition += 5;
          });
        }
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.text('Optimized State Projections:', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        if (data.results.optimizedMetrics) {
          Object.entries(data.results.optimizedMetrics).forEach(([key, value]) => {
            doc.text(`• ${key}: ${value}`, 25, yPosition);
            yPosition += 5;
          });
        }
        yPosition += 15;
      }

      // Risk Assessment
      if (reportConfig.riskAnalysis) {
        checkPageBreak(40);
        doc.setFontSize(18);
        doc.text('Risk Assessment & Mitigation', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(14);
        doc.text(`Risk Level: ${data.riskAssessment.level.toUpperCase()}`, 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.text('Identified Risk Factors:', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        data.riskAssessment.factors.forEach(factor => {
          doc.text(`• ${factor}`, 25, yPosition);
          yPosition += 5;
        });
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.text('Mitigation Strategies:', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        data.riskAssessment.mitigation.forEach(strategy => {
          doc.text(`• ${strategy}`, 25, yPosition);
          yPosition += 5;
        });
        yPosition += 15;
      }

      // Implementation Roadmap
      if (reportConfig.implementationRoadmap) {
        checkPageBreak(50);
        doc.setFontSize(18);
        doc.text('Implementation Roadmap', 20, yPosition);
        yPosition += 15;
        
        data.implementationPlan.forEach((phase, index) => {
          checkPageBreak(20);
          doc.setFontSize(12);
          doc.text(`Phase ${index + 1}: ${phase.phase}`, 20, yPosition);
          yPosition += 8;
          
          doc.setFontSize(10);
          doc.text(`Timeline: ${phase.timeline}`, 25, yPosition);
          yPosition += 5;
          doc.text(`Priority: ${phase.priority.toUpperCase()}`, 25, yPosition);
          yPosition += 5;
          doc.text(`Resources: ${phase.resources}`, 25, yPosition);
          yPosition += 10;
        });
      }

      // Recommendations
      checkPageBreak(30);
      doc.setFontSize(18);
      doc.text('Strategic Recommendations', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      data.recommendations.forEach((rec, index) => {
        checkPageBreak(10);
        doc.text(`${index + 1}. ${rec}`, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 15;

      // Benchmarking
      if (reportConfig.benchmarking) {
        checkPageBreak(30);
        doc.setFontSize(18);
        doc.text('Industry Benchmarking', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(12);
        doc.text(`Industry: ${data.benchmarking.industry}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Performance Percentile: ${data.benchmarking.percentile}th`, 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.text('Best Practices Identified:', 20, yPosition);
        yPosition += 8;
        
        doc.setFontSize(10);
        data.benchmarking.bestPractices.forEach(practice => {
          checkPageBreak(8);
          doc.text(`• ${practice}`, 25, yPosition);
          yPosition += 5;
        });
      }

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Generated by Supply Metrics Optimax - Advanced Supply Chain Analytics Platform', 20, pageHeight - 10);
      
      // Save the PDF
      doc.save(`${data.projectName}_Comprehensive_Analysis.pdf`);
      
      toast({
        title: 'Report Generated Successfully',
        description: 'Your comprehensive supply chain analysis report has been downloaded.',
      });
      
      onExport?.();
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'An error occurred while generating the report.',
      });
    } finally {
      setExporting(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Supply Chain Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.kpis.costReduction}%</div>
              <div className="text-sm text-muted-foreground">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.kpis.efficiencyGain}%</div>
              <div className="text-sm text-muted-foreground">Efficiency Gain</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.kpis.serviceLevel}%</div>
              <div className="text-sm text-muted-foreground">Service Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Carbon Footprint Reduction</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={data.kpis.carbonReduction} className="flex-1" />
                    <span className="text-sm font-medium">{data.kpis.carbonReduction}%</span>
                  </div>
                </div>
                <div>
                  <Label>Supply Chain Resilience</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={data.kpis.resilience} className="flex-1" />
                    <span className="text-sm font-medium">{data.kpis.resilience}/100</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Key Recommendations</h4>
                <div className="space-y-2">
                  {data.recommendations.slice(0, 5).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium">Overall Risk Level:</span>
                  <Badge className={getRiskColor(data.riskAssessment.level)}>
                    {data.riskAssessment.level.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Risk Factors</h4>
                    <ul className="space-y-1">
                      {data.riskAssessment.factors.map((factor, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-500" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Mitigation Strategies</h4>
                    <ul className="space-y-1">
                      {data.riskAssessment.mitigation.map((strategy, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Implementation Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.implementationPlan.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Phase {index + 1}: {phase.phase}</h4>
                      <Badge className={getPriorityColor(phase.priority)}>
                        {phase.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Timeline: {phase.timeline}</div>
                      <div>Resources: {phase.resources}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmark">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Industry Benchmarking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Industry Sector</Label>
                  <div className="text-lg font-medium">{data.benchmarking.industry}</div>
                </div>
                <div>
                  <Label>Performance Percentile</Label>
                  <div className="text-lg font-medium">{data.benchmarking.percentile}th percentile</div>
                </div>
              </div>
              
              <div>
                <Label>Best Practices Identified</Label>
                <div className="space-y-2 mt-2">
                  {data.benchmarking.bestPractices.map((practice, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Report Title</Label>
                  <Input 
                    value={reportConfig.title}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Report Sections</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(reportConfig).filter(([key]) => key !== 'title').map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={generateComprehensivePDF}
                disabled={exporting}
                className="w-full"
                size="lg"
              >
                {exporting ? (
                  <>Generating Report...</>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Comprehensive Analysis Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};