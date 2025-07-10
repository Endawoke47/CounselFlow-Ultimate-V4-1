import React, { useState } from 'react'
import { Upload, Download, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImportExportProps {
  onImport: (file: File) => Promise<void>
  onExport: (format: 'csv' | 'pdf') => void
  selectedCount: number
  totalCount: number
}

export function ImportExport({ onImport, onExport, selectedCount, totalCount }: ImportExportProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [importing, setImporting] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      await onImport(file)
      setShowMenu(false)
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setImporting(false)
      // Reset the input
      event.target.value = ''
    }
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    onExport(format)
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <FileText className="w-4 h-4" />
        Import/Export
      </button>

      <AnimatePresence>
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Import/Export Data</h3>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Import Section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Import Data</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Upload a CSV file to import multiple records at once
                  </p>
                  <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {importing ? 'Importing...' : 'Click to upload CSV file'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      disabled={importing}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Export Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Export Data</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    {selectedCount > 0 
                      ? `Export ${selectedCount} selected items`
                      : `Export all ${totalCount} items`
                    }
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport('csv')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      CSV
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
