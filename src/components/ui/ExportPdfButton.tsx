
import React from "react";
import { Button } from "./button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

interface ExportPdfButtonProps {
  exportId: string;
  fileName?: string;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  exportId,
  fileName = "exported_results",
}) => {
  const handleExport = async () => {
    const element = document.getElementById(exportId);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    pdf.save(`${fileName}.pdf`);
  };

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleExport} className="flex gap-2">
      <Download className="w-4 h-4" />
      PDF
    </Button>
  );
};
export default ExportPdfButton;
