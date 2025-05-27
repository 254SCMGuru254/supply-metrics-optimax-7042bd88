
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportToPdf } from "@/utils/exportToPdf";

interface ExportPdfButtonProps {
  title: string;
  exportId: string;
  disabled?: boolean;
  fileName?: string;
}

export function ExportPdfButton({ title, exportId, disabled, fileName }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!exportId) return;
    
    setIsExporting(true);
    try {
      await exportToPdf(exportId, fileName || title.replace(/\s+/g, '_'));
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      variant="default" 
      size="default"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}
