import type { Invoice } from '@/types/invoice'
import { calculateTotals } from '@/types/invoice'

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const totals = calculateTotals(invoice.lineItems, invoice.taxRate)

  return (
    <div className="bg-white text-gray-900 p-8 font-sans" style={{ minWidth: '640px' }}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
          <p className="text-lg font-semibold text-gray-700 mt-1">
            {invoice.invoiceNumber}
          </p>
        </div>
        <div className="text-right text-sm text-gray-600 space-y-0.5">
          <p>
            <span className="font-medium">Date:</span> {formatDate(invoice.createdAt)}
          </p>
          <p>
            <span className="font-medium">Due:</span> {formatDate(invoice.dueDate)}
          </p>
          <p>
            <span className="font-medium">Status:</span>{' '}
            <span
              className={
                invoice.status === 'paid'
                  ? 'text-green-600 font-medium'
                  : invoice.status === 'cancelled'
                    ? 'text-gray-500'
                    : 'text-yellow-600 font-medium'
              }
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            From
          </h2>
          <div className="text-sm text-gray-800 space-y-0.5">
            <p className="font-medium">{invoice.sender.name || '—'}</p>
            {invoice.sender.email && <p>{invoice.sender.email}</p>}
            {invoice.sender.phone && <p>{invoice.sender.phone}</p>}
            {invoice.sender.address && (
              <p className="whitespace-pre-line">{invoice.sender.address}</p>
            )}
            {invoice.sender.taxId && <p>Tax ID: {invoice.sender.taxId}</p>}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Bill To
          </h2>
          <div className="text-sm text-gray-800 space-y-0.5">
            <p className="font-medium">{invoice.client.name || '—'}</p>
            {invoice.client.email && <p>{invoice.client.email}</p>}
            {invoice.client.phone && <p>{invoice.client.phone}</p>}
            {invoice.client.address && (
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            )}
            {invoice.client.taxId && <p>Tax ID: {invoice.client.taxId}</p>}
          </div>
        </div>
      </div>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2 pr-2">
              Description
            </th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2 px-2 w-16">
              Qty
            </th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2 px-2 w-24">
              Unit Price
            </th>
            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2 pl-2 w-24">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-2.5 pr-2 text-sm text-gray-800">
                {item.description || '—'}
              </td>
              <td className="py-2.5 px-2 text-sm text-gray-800 text-right">
                {item.quantity}
              </td>
              <td className="py-2.5 px-2 text-sm text-gray-800 text-right">
                {invoice.currency} {item.unitPrice.toFixed(2)}
              </td>
              <td className="py-2.5 pl-2 text-sm text-gray-800 text-right font-medium">
                {invoice.currency} {(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-56 space-y-1.5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>
              {invoice.currency} {totals.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax ({invoice.taxRate}%)</span>
            <span>
              {invoice.currency} {totals.taxAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
            <span>Total</span>
            <span>
              {invoice.currency} {totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Notes
          </h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
