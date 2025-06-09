
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

interface ExportPdfButtonProps {
  title: string
  exportId: string
  fileName: string
}

export function ExportPdfButton({ title, exportId, fileName }: ExportPdfButtonProps) {
  const handleExport = () => {
    // Simple implementation - in a real app you'd use a PDF library
    const element = document.getElementById(exportId)
    if (element) {
      window.print()
    }
  }

  return (
    <Button onClick={handleExport} variant="outline">
      <FileDown className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  )
}
