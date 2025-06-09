
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPdfButtonProps {
  title?: string;
  exportId?: string;
  fileName: string;
  data?: any;
  isOptimized?: boolean;
  networkName?: string;
  optimizationType?: string;
  results?: any;
}

export function ExportPdfButton({ 
  title = "Report", 
  exportId, 
  fileName, 
  data, 
  isOptimized,
  networkName,
  optimizationType,
  results 
}: ExportPdfButtonProps) {
  const handleExportPdf = async () => {
    try {
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

          pdf.save(`${fileName}.pdf`);
        }
      } else if (data) {
        // Export data as table
        const doc = new jsPDF();
        doc.text(title, 10, 10);
        
        if (Array.isArray(data)) {
          const tableData = data.map((item: any) => Object.values(item));
          const tableHeaders = Object.keys(data[0] || {});
          
          (doc as any).autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 20
          });
        }
        
        doc.save(`${fileName}.pdf`);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <Button variant="outline" onClick={handleExportPdf} className="flex items-center gap-1">
      <Download className="h-4 w-4" />
      Export PDF
    </Button>
  );
}
