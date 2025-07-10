// Export utilities for CSV and PDF generation

export function downloadCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  try {
    // Get all unique keys from all objects
    const allKeys = data.reduce((keys, item) => {
      Object.keys(item).forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key)
        }
      })
      return keys
    }, [] as string[])

    // Create header row
    const headers = allKeys.map((key: string) => `"${key}"`)
    
    // Create data rows
    const rows = data.map(item => {
      return allKeys.map((key: string) => {
        let value = item[key]
        
        // Handle different data types
        if (value === null || value === undefined) {
          value = ''
        } else if (Array.isArray(value)) {
          value = value.join('; ')
        } else if (typeof value === 'object') {
          value = JSON.stringify(value)
        } else {
          value = String(value)
        }
        
        // Escape quotes and wrap in quotes
        return `"${value.replace(/"/g, '""')}"`
      })
    })

    // Combine headers and rows
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Error generating CSV:', error)
    alert('Failed to generate CSV file')
  }
}

export function downloadPDF(data: any[], title: string, filename: string): void {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  try {
    // Create a simple HTML structure for PDF generation
    const htmlContent = generatePDFHTML(data, title)
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to download PDF')
      return
    }

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
      setTimeout(() => {
        printWindow.close()
      }, 1000)
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF file')
  }
}

function generatePDFHTML(data: any[], title: string): string {
  const now = new Date().toLocaleDateString()
  
  // Get column headers (excluding complex objects and arrays)
  const sampleItem = data[0]
  const columns = Object.keys(sampleItem).filter(key => {
    const value = sampleItem[key]
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
  })

  const tableHeaders = columns.map(col => 
    `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">${formatColumnName(col)}</th>`
  ).join('')

  const tableRows = data.map(item => {
    const cells = columns.map(col => {
      let value = item[col]
      if (value === null || value === undefined) value = ''
      if (typeof value === 'boolean') value = value ? 'Yes' : 'No'
      
      return `<td style="border: 1px solid #ddd; padding: 8px;">${value}</td>`
    }).join('')
    
    return `<tr>${cells}</tr>`
  }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .title { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 10px;
        }
        .meta { 
          font-size: 14px; 
          color: #666; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
          font-size: 12px;
        }
        th { 
          background-color: #f8f9fa;
          font-weight: bold;
        }
        tr:nth-child(even) { 
          background-color: #f9f9f9; 
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        @media print {
          body { margin: 0; }
          .header { page-break-after: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">${title}</div>
        <div class="meta">Generated on ${now} • Total Records: ${data.length}</div>
      </div>
      
      <table>
        <thead>
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      
      <div class="footer">
        Generated by CounselFlow Ultimate - Legal Management System
      </div>
    </body>
    </html>
  `
}

function formatColumnName(columnName: string): string {
  // Convert camelCase to Title Case
  return columnName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

// Excel export (requires additional library in production)
export function downloadExcel(data: any[], filename: string): void {
  // For now, fallback to CSV
  console.log('Excel export not implemented, using CSV instead')
  downloadCSV(data, filename.replace('.xlsx', '.csv'))
}

// Utility to prepare data for export (clean up complex objects)
export function prepareDataForExport(data: any[]): any[] {
  return data.map(item => {
    const cleanItem: any = {}
    
    Object.entries(item).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        cleanItem[key] = ''
      } else if (Array.isArray(value)) {
        cleanItem[key] = value.join(', ')
      } else if (typeof value === 'object' && value instanceof Date) {
        cleanItem[key] = value.toISOString().split('T')[0]
      } else if (typeof value === 'object') {
        // Skip complex objects or stringify simple ones
        if (Object.keys(value).length <= 3) {
          cleanItem[key] = JSON.stringify(value)
        }
      } else {
        cleanItem[key] = value
      }
    })
    
    return cleanItem
  })
}
