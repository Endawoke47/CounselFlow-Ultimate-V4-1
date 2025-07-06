import React, { useState } from 'react'
import { Plus, Search, Filter, FileText, Download, Upload, Eye, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
  matterId?: string
  matterTitle?: string
  tags: string[]
  status: 'active' | 'archived'
}

export function DocumentsPage() {
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Merger Agreement - Final Draft.pdf',
      type: 'pdf',
      size: 2458624,
      uploadedBy: 'John Smith',
      uploadedAt: '2024-01-15T10:30:00Z',
      matterId: '1',
      matterTitle: 'Corporate Merger - TechCorp',
      tags: ['merger', 'contract', 'final'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Employment Contract Template.docx',
      type: 'docx',
      size: 156432,
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-12T14:20:00Z',
      matterId: '2',
      matterTitle: 'Employment Contract Review',
      tags: ['employment', 'template'],
      status: 'active'
    },
    {
      id: '3',
      name: 'Patent Application - US20240001.pdf',
      type: 'pdf',
      size: 1852945,
      uploadedBy: 'Michael Chen',
      uploadedAt: '2024-01-10T09:15:00Z',
      matterId: '3',
      matterTitle: 'IP Licensing Agreement',
      tags: ['patent', 'application', 'IP'],
      status: 'active'
    },
    {
      id: '4',
      name: 'Due Diligence Report - Metro Holdings.pdf',
      type: 'pdf',
      size: 3456789,
      uploadedBy: 'Emily Davis',
      uploadedAt: '2024-01-08T16:45:00Z',
      matterId: '4',
      matterTitle: 'Real Estate Transaction',
      tags: ['due diligence', 'real estate'],
      status: 'archived'
    },
    {
      id: '5',
      name: 'Litigation Strategy Memo.docx',
      type: 'docx',
      size: 234567,
      uploadedBy: 'Robert Wilson',
      uploadedAt: '2024-01-05T11:30:00Z',
      matterId: '5',
      matterTitle: 'Litigation - Contract Dispute',
      tags: ['litigation', 'strategy', 'memo'],
      status: 'active'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.matterTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'text-red-600 bg-red-100'
      case 'docx':
      case 'doc':
        return 'text-blue-600 bg-blue-100'
      case 'xlsx':
      case 'xls':
        return 'text-green-600 bg-green-100'
      case 'pptx':
      case 'ppt':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage your legal documents and files</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Document</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="docx">Word Document</option>
              <option value="xlsx">Excel</option>
              <option value="pptx">PowerPoint</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredDocuments.length} Documents
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${getFileIcon(doc.type)}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>Uploaded by {doc.uploadedBy}</span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadedAt)}</span>
                    </div>
                    {doc.matterTitle && (
                      <p className="text-xs text-teal-600 mt-1">
                        Associated with: {doc.matterTitle}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by uploading your first document'
            }
          </p>
          <button className="btn-primary flex items-center space-x-2 mx-auto">
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      )}
    </div>
  )
}