import React from 'react';
import { Button } from './button';
import { FileDown } from 'lucide-react';
import { exportOptimizationResultsToPdf } from '@/utils/exportToPdf';

interface ExportPdfButtonProps {
  networkName: string;
  optimizationType: string;
  results: any;
  fileName?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
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
}) => {
  const handleExport = () => {
    exportOptimizationResultsToPdf(
      networkName,
      optimizationType,
      results,
      fileName
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
    >
      <FileDown className="w-4 h-4 mr-2" />
      Export PDF
    </Button>
  );
};
