import { useEffect } from 'react'
import { useInvoiceStore } from '@/store/useInvoiceStore'
import { InvoiceForm } from '@/components/invoice/InvoiceForm'
import { InvoiceDashboard } from '@/components/invoice/InvoiceDashboard'

function App() {
  const loadInvoices = useInvoiceStore((s) => s.loadInvoices)
  const currentInvoice = useInvoiceStore((s) => s.currentInvoice)

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  if (currentInvoice) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <InvoiceForm />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <InvoiceDashboard />
    </div>
  )
}

export default App
