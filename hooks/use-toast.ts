import { useState, useCallback } from 'react'

interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast])
    
    // Simple console log for now - in a real app you'd show a proper toast UI
    console.log(`Toast: ${toast.title}${toast.description ? ` - ${toast.description}` : ''}`)
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }, [])

  return { toast, toasts }
}