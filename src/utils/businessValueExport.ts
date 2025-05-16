
import jsPDF from 'jspdf';
import { ModelValueMetricsType } from '@/types/business';

/**
 * Generate a detailed business value PDF report
 * @param modelName The name of the optimization model
 * @param metrics The metrics associated with the model
 * @param implementationDetails Implementation details for the model
 * @param caseStudies Case studies related to the model
 * @param fileName The name for the generated file
 */
export const generateBusinessValueReport = (
  modelName: string,
  metrics: any,
  implementationDetails: any,
  caseStudies: any[],
  fileName: string = 'business-value-report'
): void => {
  // Create PDF document
  const pdf = new jsPDF();
  let yPos = 20;
  
  // Add title and branding
  pdf.setFontSize(24);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Business Value Report', 105, yPos, { align: 'center' });
  
  yPos += 10;
  pdf.setFontSize(16);
  pdf.setTextColor(100, 100, 100);
  pdf.text(modelName, 105, yPos, { align: 'center' });
  
  yPos += 20;

  // Add business metrics section
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Business Value Metrics', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  
  // Add metrics data
  if (metrics && metrics.metrics) {
    metrics.metrics.forEach((metric: any, index: number) => {
      pdf.text(`${metric.name}: ${metric.value}`, 30, yPos);
      yPos += 8;
      
      // Add page break if needed
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });
  }
  
  yPos += 10;

  // Add implementation details
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Implementation Details', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80);
  
  if (implementationDetails) {
    pdf.text(`Difficulty Level: ${implementationDetails.difficulty}`, 30, yPos);
    yPos += 8;
    pdf.text(`Time to Value: ${implementationDetails.timeToValue}`, 30, yPos);
    yPos += 8;
    pdf.text(`Data Readiness: ${implementationDetails.dataReadiness}`, 30, yPos);
    yPos += 12;
    
    pdf.setFontSize(12);
    pdf.text('Technical Requirements:', 30, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    
    if (implementationDetails.requirements) {
      implementationDetails.requirements.forEach((req: string, index: number) => {
        pdf.text(`- ${req}`, 40, yPos);
        yPos += 6;
        
        // Add page break if needed
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
      });
    }
  }
  
  // Add case studies
  if (yPos > 230) {
    pdf.addPage();
    yPos = 20;
  }
  
  yPos += 10;
  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Case Studies', 20, yPos);
  yPos += 10;
  
  if (caseStudies && caseStudies.length > 0) {
    caseStudies.forEach((study, index) => {
      // Check if we need a page break
      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(12);
      pdf.setTextColor(33, 33, 33);
      pdf.text(study.company, 30, yPos);
      yPos += 6;
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Industry: ${study.industry}`, 30, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Challenge: ${study.challenge}`, 30, yPos);
      yPos += 6;
      pdf.text(`Solution: ${study.solution}`, 30, yPos);
      yPos += 6;
      pdf.text(`Results: ${study.results}`, 30, yPos);
      yPos += 15;
    });
  }
  
  // Add footer with date
  const today = new Date().toLocaleDateString();
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generated on ${today} | Supply Chain Analysis by Chainalyze.io`, 105, 290, { align: 'center' });
  
  // Save the PDF
  pdf.save(`${fileName}.pdf`);
};
