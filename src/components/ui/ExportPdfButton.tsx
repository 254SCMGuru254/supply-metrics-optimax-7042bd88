
import React from 'react';
import { Button } from './button';
import { FileDown, Loader2 } from 'lucide-react';
import { exportOptimizationResultsToPdf } from '@/utils/exportToPdf';
import { useState } from 'react';
import { useToast } from './use-toast';

interface ExportPdfButtonProps {
  networkName: string;
  optimizationType: string;
  results: any;
  fileName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  isOptimized?: boolean;
}

/**
 * A button component that exports optimization results to PDF
 */
export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  networkName,
  optimizationType,
  results,
  fileName = 'optimization-results',
  variant = 'outline',
  size = 'default',
  className = '',
  isOptimized = true
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!isOptimized) {
      toast({
        title: "Cannot Export",
        description: "Run optimization first to generate results for export",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      await exportOptimizationResultsToPdf(
        networkName,
        optimizationType,
        results,
        fileName
      );
      
      toast({
        title: "Export Complete",
        description: "Your optimization results have been exported as PDF"
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred during PDF generation",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={isExporting || !isOptimized}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </>
      )}
    </Button>
  );
};
