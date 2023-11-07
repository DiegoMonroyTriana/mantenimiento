'use client'

import Button from '@/components/Button'
import * as XLSX from 'xlsx'

function DataPage () {
  const downloadExcel = async () => {
    const res = await fetch('/api/all')
    const data = await res.json()
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1')
    XLSX.writeFile(wb, 'archivo.xlsx')
  }

  return (
    <Button onClick={downloadExcel}>
      Descargar Excel
    </Button>
  )
}

export default DataPage
