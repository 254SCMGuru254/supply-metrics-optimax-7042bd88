
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, List } from "lucide-react";
import { ExportPdfButton } from "@/components/ui/ExportPdfButton";
import Papa from "papaparse";
import { ErrorHandlingService } from "@/services/ErrorHandlingService";

interface ErrorsTabProps {
  errorSummary: any;
  errorHandler: ErrorHandlingService;
}

export const ErrorsTab = ({ errorSummary, errorHandler }: ErrorsTabProps) => {
  const errors = errorHandler.getErrorHistory();

  // Simple filtering state
  const [filterSeverity, setFilterSeverity] = React.useState<string>("all");

  const filtered = filterSeverity === 'all'
    ? errors
    : errors.filter(e => e.severity === filterSeverity);

  const exportCsv = () => {
    const rows = filtered.map(e => ({
      code: e.code,
      message: e.message,
      severity: e.severity,
      timestamp: e.timestamp instanceof Date ? e.timestamp.toISOString() : String(e.timestamp),
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `optimization_errors.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(filtered, null, 2));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-4 h-4" />
          Optimization Errors Log
        </CardTitle>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" size="sm" onClick={exportCsv}><ClipboardCopy className="w-4 h-4 mr-1" />Export CSV</Button>
          <ExportPdfButton exportId="enterprise-route-errors" fileName="route_optimization_errors" />
          <Button variant="outline" size="sm" onClick={handleCopyJson}>Copy as JSON</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-3 items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            Showing {filtered.length} / {errors.length}
          </span>
        </div>
        {filtered.length === 0 ? (
          <span className="text-gray-400">No errors to show for selected level.</span>
        ) : (
          <div className="space-y-2" id="enterprise-route-errors">
            {filtered.map((error, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs">{error.code}</span>
                  <Badge variant={error.severity === 'critical' ? "destructive" : 'secondary'}>
                    {error.severity}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">{error.message}</div>
                <div className="text-xs text-gray-400">{error.timestamp instanceof Date
                  ? error.timestamp.toLocaleString()
                  : String(error.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
