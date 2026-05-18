import html2pdf from 'html2pdf.js'

export interface PdfOptions {
  filename?: string
  margin?: number | [number, number] | [number, number, number, number]
}

export function generateInvoicePdf(
  element: HTMLElement,
  options: PdfOptions = {},
): Promise<void> {
  const { filename = 'invoice.pdf', margin = 10 } = options

  return html2pdf()
    .set({
      margin,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    })
    .from(element)
    .save()
}
