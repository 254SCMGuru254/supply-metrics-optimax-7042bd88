
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Download, Check, Loader2 } from "lucide-react";

export const SupplyChainReportGenerator: React.FC = () => {
  const [title, setTitle] = useState("Supply Chain Analysis Report");
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = () => {
    setGenerating(true);
    
    // Simulate PDF generation (in a real app, this would call an API)
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      
      toast({
        title: "Report Generated",
        description: "Your supply chain analysis report is ready to download",
      });
    }, 2000);
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded",
    });
    
    // In a real app, this would trigger actual file download
    const dummyLink = document.createElement('a');
    dummyLink.href = '/sample-report.pdf';
    dummyLink.download = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Supply Chain Report Generator</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="report-title" className="block text-sm font-medium mb-1">
            Report Title
          </label>
          <Input 
            id="report-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter report title"
          />
        </div>
        
        <div>
          <label htmlFor="report-description" className="block text-sm font-medium mb-1">
            Report Description
          </label>
          <Textarea
            id="report-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter additional details to include in the report..."
            rows={3}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateReport}
            disabled={generating || generated || !title}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : generated ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Generated
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
          
          {generated && (
            <Button
              onClick={handleDownload}
              variant="outline"
              className="whitespace-nowrap"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SupplyChainReportGenerator;
