
import { useState } from "react"

interface Toast {
  id?: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: React.ReactNode
}

let toastCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ id, ...toastData }: Toast) => {
    const toastId = id || `toast-${++toastCounter}`
    const newToast = { id: toastId, ...toastData }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId))
    }, 3000)
    
    return toastId
  }

  const dismiss = (toastId: string) => {
    setToasts(prev => prev.filter(t => t.id !== toastId))
  }

  return { toast, toasts, dismiss }
}

export { toast } from "@/hooks/use-toast"
