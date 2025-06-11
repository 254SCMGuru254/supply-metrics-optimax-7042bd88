import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from "react";
import { generateAINarrative } from "@/utils/aiNarrative";

interface ExportPdfButtonProps {
  title?: string;
  exportId?: string;
  fileName: string;
  data?: any;
  isOptimized?: boolean;
  networkName?: string;
  optimizationType?: string;
  results?: any;
  aiPrompt?: string;
}

export function ExportPdfButton({ 
  title = "Report", 
  exportId, 
  fileName, 
  data, 
  isOptimized,
  networkName,
  optimizationType,
  results,
  aiPrompt
}: ExportPdfButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExportPdf = async () => {
    setLoading(true);
    try {
      let aiNarrative = "";
      if (aiPrompt && results) {
        // Build the prompt with user data and results
        const prompt = `${aiPrompt}\n\nUser Inputs: ${JSON.stringify(data)}\n\nResults: ${JSON.stringify(results)}`;
        aiNarrative = await generateAINarrative(prompt);
      }
      if (exportId) {
        // Export specific element by ID
        const element = document.getElementById(exportId);
        if (element) {
          const canvas = await html2canvas(element);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          if (aiNarrative) {
            pdf.addPage();
            pdf.setFontSize(14);
            pdf.text("AI-Generated Analysis", 10, 20);
            pdf.setFontSize(11);
            pdf.text(aiNarrative, 10, 30, { maxWidth: 190 });
          }

          pdf.save(`${fileName}.pdf`);
        }
      } else if (data) {
        // Export data as table
        const doc = new jsPDF();
        doc.text(title, 10, 10);
        if (aiNarrative) {
          doc.setFontSize(14);
          doc.text("AI-Generated Analysis", 10, 20);
          doc.setFontSize(11);
          doc.text(aiNarrative, 10, 30, { maxWidth: 190 });
        }
        if (Array.isArray(data)) {
          const tableData = data.map((item: any) => Object.values(item));
          const tableHeaders = Object.keys(data[0] || {});
          (doc as any).autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: aiNarrative ? 60 : 20
          });
        }
        doc.save(`${fileName}.pdf`);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
    setLoading(false);
  };

  return (
    <Button variant="outline" onClick={handleExportPdf} className="flex items-center gap-1" disabled={loading}>
      <Download className="h-4 w-4" />
      {loading ? "Generating AI Report..." : "Export PDF"}
    </Button>
  );
}
