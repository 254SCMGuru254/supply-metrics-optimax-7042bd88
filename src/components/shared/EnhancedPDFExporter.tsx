
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface EnhancedPDFExporterProps {
  modelType: string;
  inputData: any;
  results: any;
  chartData?: any;
  comparisonResults?: any;
}

export const EnhancedPDFExporter = ({ 
  modelType, 
  inputData, 
  results, 
  chartData, 
  comparisonResults 
}: EnhancedPDFExporterProps) => {
  const [reportConfig, setReportConfig] = useState({
    title: `${modelType} Optimization Report`,
    subtitle: 'Supply Chain Analytics Report',
    company: 'Your Company Name',
    author: 'Supply Metrics Optimax',
    includeCharts: true,
    includeComparison: true,
    includeRecommendations: true
  });
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    setExporting(true);
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text(reportConfig.title, 20, yPosition);
      yPosition += 10;

      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text(reportConfig.subtitle, 20, yPosition);
      yPosition += 20;

      // Company and date info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Company: ${reportConfig.company}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Report Type: ${modelType}`, 20, yPosition);
      yPosition += 20;

      // Executive Summary
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Executive Summary', 20, yPosition);
      yPosition += 15;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const summaryText = `This report presents the optimization results for ${modelType} using advanced mathematical models and algorithms. The analysis includes data processing, formula comparison, and actionable recommendations for supply chain optimization.`;
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, yPosition);
      yPosition += splitSummary.length * 5 + 10;

      // Input Parameters
      if (inputData) {
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('Input Parameters', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const inputEntries = Object.entries(inputData).slice(0, 10); // Limit to prevent overflow
        inputEntries.forEach(([key, value]) => {
          doc.text(`${key}: ${value}`, 20, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
      }

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Results Section
      if (results) {
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('Optimization Results', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        if (typeof results === 'object') {
          Object.entries(results).forEach(([key, value]) => {
            if (typeof value === 'number') {
              doc.text(`${key}: ${value.toLocaleString()}`, 20, yPosition);
            } else if (typeof value === 'string') {
              doc.text(`${key}: ${value}`, 20, yPosition);
            }
            yPosition += 6;
          });
        }
        yPosition += 15;
      }

      // Formula Comparison Results
      if (comparisonResults && reportConfig.includeComparison) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('Formula Comparison Analysis', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        if (Array.isArray(comparisonResults)) {
          comparisonResults.forEach((result, index) => {
            doc.text(`${index + 1}. ${result.formulaName}`, 20, yPosition);
            yPosition += 6;
            doc.text(`   Accuracy: ${result.accuracy}% | Time: ${result.executionTime}ms`, 25, yPosition);
            yPosition += 6;
            doc.text(`   Result: ${result.result}`, 25, yPosition);
            yPosition += 8;
          });
        }
        yPosition += 15;
      }

      // Recommendations
      if (reportConfig.includeRecommendations) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('Recommendations', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        const recommendations = [
          '1. Implement the recommended optimization algorithm for maximum efficiency',
          '2. Monitor key performance indicators regularly for continuous improvement',
          '3. Consider seasonal variations in demand patterns for better forecasting',
          '4. Establish feedback loops for real-time optimization adjustments',
          '5. Train staff on new optimization procedures and tools'
        ];

        recommendations.forEach(rec => {
          const splitRec = doc.splitTextToSize(rec, 170);
          doc.text(splitRec, 20, yPosition);
          yPosition += splitRec.length * 5 + 3;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated by Supply Metrics Optimax | Page ${i} of ${pageCount}`, 20, 285);
      }

      // Save the PDF
      const fileName = `${modelType.toLowerCase().replace(/\s+/g, '-')}-report-${Date.now()}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF Generated Successfully",
        description: `Report saved as ${fileName}`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Enhanced PDF Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Report Title</Label>
            <Input
              value={reportConfig.title}
              onChange={(e) => setReportConfig({...reportConfig, title: e.target.value})}
            />
          </div>
          <div>
            <Label>Company Name</Label>
            <Input
              value={reportConfig.company}
              onChange={(e) => setReportConfig({...reportConfig, company: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label>Report Subtitle</Label>
          <Input
            value={reportConfig.subtitle}
            onChange={(e) => setReportConfig({...reportConfig, subtitle: e.target.value})}
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reportConfig.includeCharts}
              onChange={(e) => setReportConfig({...reportConfig, includeCharts: e.target.checked})}
            />
            Include Charts
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reportConfig.includeComparison}
              onChange={(e) => setReportConfig({...reportConfig, includeComparison: e.target.checked})}
            />
            Include Formula Comparison
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reportConfig.includeRecommendations}
              onChange={(e) => setReportConfig({...reportConfig, includeRecommendations: e.target.checked})}
            />
            Include Recommendations
          </label>
        </div>

        <Button 
          onClick={generatePDF} 
          disabled={exporting || !results}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {exporting ? (
            <>
              <Settings className="h-4 w-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Enhanced PDF Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
