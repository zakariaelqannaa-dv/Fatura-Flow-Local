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

  const statusColor =
    invoice.status === 'paid'
      ? '#16a34a'
      : invoice.status === 'cancelled'
        ? '#9ca3af'
        : '#ca8a04'

  return (
    <div
      style={{
        background: '#ffffff',
        color: '#111827',
        padding: '48px',
        fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
        minWidth: '640px',
        borderRadius: '16px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            INVOICE
          </h1>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '6px 0 0' }}>
            {invoice.invoiceNumber}
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: '13px', color: '#6b7280', lineHeight: '1.7' }}>
          <p style={{ margin: 0 }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>Date: </span>
            {formatDate(invoice.createdAt)}
          </p>
          <p style={{ margin: 0 }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>Due: </span>
            {formatDate(invoice.dueDate)}
          </p>
          <p style={{ margin: 0 }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>Status: </span>
            <span style={{ color: statusColor, fontWeight: 600 }}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '2px solid #f3f4f6', marginBottom: '32px' }} />

      {/* From / To */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        {[
          { heading: 'From', info: invoice.sender },
          { heading: 'Bill To', info: invoice.client },
        ].map(({ heading, info }) => (
          <div key={heading}>
            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9ca3af', marginBottom: '10px' }}>
              {heading}
            </p>
            <div style={{ fontSize: '13px', color: '#1f2937', lineHeight: '1.7' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>{info.name || '—'}</p>
              {info.email   && <p style={{ margin: 0 }}>{info.email}</p>}
              {info.phone   && <p style={{ margin: 0 }}>{info.phone}</p>}
              {info.address && <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{info.address}</p>}
              {info.taxId   && <p style={{ margin: 0, color: '#6b7280' }}>Tax ID: {info.taxId}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Line items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
            {['Description', 'Qty', 'Unit Price', 'Total'].map((h, i) => (
              <th
                key={h}
                style={{
                  padding: '8px 0',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#9ca3af',
                  textAlign: i === 0 ? 'left' : 'right',
                  paddingLeft: i === 0 ? 0 : '12px',
                  paddingRight: i === 3 ? 0 : '12px',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '12px 0', fontSize: '13px', color: '#1f2937' }}>
                {item.description || '—'}
              </td>
              <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', textAlign: 'right' }}>
                {item.quantity}
              </td>
              <td style={{ padding: '12px 12px', fontSize: '13px', color: '#4b5563', textAlign: 'right' }}>
                {invoice.currency} {item.unitPrice.toFixed(2)}
              </td>
              <td style={{ padding: '12px 0', fontSize: '13px', color: '#1f2937', textAlign: 'right', fontWeight: 600 }}>
                {invoice.currency} {(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px' }}>
        <div style={{ width: '220px' }}>
          {[
            { label: 'Subtotal', value: `${invoice.currency} ${totals.subtotal.toFixed(2)}`, bold: false },
            { label: `Tax (${invoice.taxRate}%)`, value: `${invoice.currency} ${totals.taxAmount.toFixed(2)}`, bold: false },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#111827', borderTop: '2px solid #e5e7eb', paddingTop: '10px', marginTop: '6px' }}>
            <span>Total</span>
            <span>{invoice.currency} {totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginBottom: '8px' }}>
            Notes
          </p>
          <p style={{ fontSize: '13px', color: '#4b5563', whiteSpace: 'pre-line', margin: 0 }}>
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  )
}
