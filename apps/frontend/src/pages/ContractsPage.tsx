import React, { useState } from 'react'
import { Plus, Search, Filter, FileText, Calendar, DollarSign, User, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

interface Contract {
  id: string
  title: string
  client: string
  type: string
  status: 'draft' | 'pending' | 'executed' | 'expired'
  value: number
  startDate: string
  endDate: string
  lastModified: string
  description: string
}

export function ContractsPage() {
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Software License Agreement',
      client: 'TechCorp Industries',
      type: 'License',
      status: 'executed',
      value: 150000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      lastModified: '2024-01-15',
      description: 'Annual software licensing agreement for enterprise suite'
    },
    {
      id: '2',
      title: 'Service Agreement',
      client: 'Global Services LLC',
      type: 'Service',
      status: 'draft',
      value: 75000,
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      lastModified: '2024-01-10',
      description: 'Professional services agreement for consulting work'
    },
    {
      id: '3',
      title: 'Non-Disclosure Agreement',
      client: 'Innovation Labs',
      type: 'NDA',
      status: 'pending',
      value: 0,
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      lastModified: '2024-01-12',
      description: 'Mutual non-disclosure agreement for partnership discussions'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
            <p className="text-gray-600 mt-1">Manage your contract portfolio</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Contract</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="executed">Executed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <FileText className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{contract.title}</h3>
                  <p className="text-sm text-gray-500">{contract.type}</p>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                {contract.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{contract.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Client:</span>
                <span className="font-medium">{contract.client}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Value:</span>
                <span className="font-medium">{formatCurrency(contract.value)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Modified:</span>
                <span className="font-medium">{formatDate(contract.lastModified)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first contract'
            }
          </p>
          <button className="btn-primary flex items-center space-x-2 mx-auto">
            <Plus className="h-4 w-4" />
            <span>New Contract</span>
          </button>
        </div>
      )}
    </div>
  )
}