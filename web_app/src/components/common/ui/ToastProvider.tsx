import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#f9fafb',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500'
        },
        success: {
          style: {
            background: '#10b981',
            color: '#ffffff'
          }
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#ffffff'
          }
        }
      }}
    />
  )
}
