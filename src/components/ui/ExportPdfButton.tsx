import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportPdfButtonProps {
  data: any;
  fileName: string;
  isOptimized: boolean;
}

export function ExportPdfButton({ data, fileName, isOptimized }: ExportPdfButtonProps) {
  const handleExportPdf = () => {
    const doc = new jsPDF();

    doc.text(`Optimization Results: ${isOptimized ? 'Optimized' : 'Not Optimized'}`, 10, 10);

    // Convert data to array of arrays for autotable
    const tableData = data.map((item: any) => Object.values(item));

    // Define table headers
    const tableHeaders = Object.keys(data[0]);

    // Add the table to the PDF
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
    });

    // Save the PDF
    doc.save(`${fileName}.pdf`);
  };

  return (
    <Button variant="outline" onClick={handleExportPdf} className="flex items-center gap-1">
      <Download className="h-4 w-4" />
      Export as PDF
    </Button>
  );
}
