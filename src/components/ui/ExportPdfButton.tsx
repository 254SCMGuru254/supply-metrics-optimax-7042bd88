import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useReactToPrint } from 'react-to-print';

interface ExportPdfButtonProps {
  title: string;
  exportId: string;
  disabled?: boolean;
  fileName?: string;
}

export function ExportPdfButton({ title, exportId, disabled, fileName }: ExportPdfButtonProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useReactToPrint({
    content: () => componentRef.current as HTMLDivElement,
    documentTitle: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
    onBeforeGetContent: () => {
      setIsExporting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => setIsExporting(false),
  });
  
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
