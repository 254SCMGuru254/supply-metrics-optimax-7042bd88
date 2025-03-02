
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ExportPDFProps = {
  contentRef: React.RefObject<HTMLElement>;
  filename?: string;
  paperSize?: "a4" | "letter";
  title?: string;
  includeDate?: boolean;
  includePageNumbers?: boolean;
};

export const ExportPDF = ({
  contentRef,
  filename = "supply-chain-analysis",
  paperSize = "a4",
  title = "Supply Chain Analysis Report",
  includeDate = true,
  includePageNumbers = true,
}: ExportPDFProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!contentRef.current) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not find content to export",
      });
      return;
    }

    try {
      setIsExporting(true);
      
      // Dimensions for PDF (in mm)
      const dimensions = paperSize === "a4" 
        ? { width: 210, height: 297 } 
        : { width: 216, height: 279 };
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: paperSize
      });
      
      // Add title
      pdf.setFontSize(18);
      pdf.text(title, 20, 20);
      
      // Add date if requested
      if (includeDate) {
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
      }
      
      // Capture the content as an image
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      // Calculate image dimensions to fit in PDF
      const imgWidth = dimensions.width - 40; // 20mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to PDF (with a margin from the top)
      pdf.addImage(imgData, "PNG", 20, 40, imgWidth, imgHeight);
      
      // Add page numbers if requested
      if (includePageNumbers) {
        const totalPages = Math.ceil(imgHeight / (dimensions.height - 60)) || 1;
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.text(`Page ${i} of ${totalPages}`, dimensions.width - 45, dimensions.height - 15);
        }
      }
      
      // Save the PDF
      pdf.save(`${filename}.pdf`);
      
      toast({
        title: "Export Complete",
        description: "Your analysis has been exported as PDF",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred during PDF generation",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isExporting ? "Exporting..." : "Export as PDF"}
    </Button>
  );
};
