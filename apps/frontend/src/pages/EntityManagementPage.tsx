import React, { useState } from 'react'
import { Building2, CheckCircle, XCircle, AlertTriangle, DollarSign, Plus, Search, Eye, Edit, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EntityData } from '../types/models'

const statusConfig = {
  active: { icon: CheckCircle, color: 'success' as const },
  inactive: { icon: XCircle, color: 'info' as const },
  dissolved: { icon: XCircle, color: 'danger' as const },
  suspended: { icon: AlertTriangle, color: 'warning' as const }
}

const riskConfig = {
  low: { color: 'success' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const },
  critical: { color: 'danger' as const }
}

export function EntityManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedEntity, setSelectedEntity] = useState<EntityData | null>(null)

  // Simplified entities array to match EntityData interface
  const entities: EntityData[] = [
    {
      id: 'ENT-001',
      name: 'TechCorp International Ltd.',
      type: 'Corporation',
      registrationNumber: 'TC2023001',
      jurisdiction: 'Delaware',
      incorporationDate: '2023-01-15',
      status: 'active',
      description: 'Technology consulting and software development corporation',
      address: '123 Tech Street, Wilmington, DE 19801',
      directors: ['John Smith', 'Jane Doe'],
      shareholders: ['Smith Holdings', 'Venture Capital LLC'],
      authorizedCapital: 10000000,
      paidUpCapital: 5000000,
      businessActivities: ['Software Development', 'Consulting', 'Technology Services'],
      complianceStatus: 'compliant',
      createdAt: '2023-01-15T00:00:00.000Z',
      updatedAt: '2024-03-15T00:00:00.000Z',
      riskLevel: 'low',
      tags: ['Technology', 'US', 'Active']
    },
    {
      id: 'ENT-002',
      name: 'Global Trading LLC',
      type: 'LLC',
      registrationNumber: 'GT2023002',
      jurisdiction: 'Nevada',
      incorporationDate: '2023-03-20',
      status: 'active',
      description: 'International trading and commerce limited liability company',
      address: '456 Commerce Ave, Las Vegas, NV 89101',
      directors: ['Maria Rodriguez', 'David Chen'],
      shareholders: ['Rodriguez Family Trust', 'Chen Investments'],
      authorizedCapital: 5000000,
      paidUpCapital: 2500000,
      businessActivities: ['International Trading', 'Import/Export', 'Logistics'],
      complianceStatus: 'compliant',
      createdAt: '2023-03-20T00:00:00.000Z',
      updatedAt: '2024-03-15T00:00:00.000Z',
      riskLevel: 'medium',
      tags: ['Trading', 'International', 'LLC']
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filter logic
  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter
    const matchesType = typeFilter === 'all' || entity.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Stats
  const totalEntities = entities.length
  const activeEntities = entities.filter(e => e.status === 'active').length
  const totalValue = entities.reduce((sum, entity) => sum + entity.authorizedCapital, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entity Management</h1>
          <p className="text-gray-600">Manage corporate entities, subsidiaries, and business structures</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Entity
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Entities</p>
              <p className="text-2xl font-bold text-gray-900">{totalEntities}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Entities</p>
              <p className="text-2xl font-bold text-gray-900">{activeEntities}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-gray-900">95%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="dissolved">Dissolved</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Corporation">Corporation</option>
            <option value="LLC">LLC</option>
            <option value="Partnership">Partnership</option>
            <option value="Trust">Trust</option>
            <option value="Foundation">Foundation</option>
          </select>
        </div>
      </div>

      {/* Entities Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntities.map((entity) => (
                <motion.tr
                  key={entity.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedEntity(entity)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{entity.name}</div>
                        <div className="text-sm text-gray-500">{entity.registrationNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        entity.status === 'active' ? 'bg-green-100 text-green-800' :
                        entity.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        entity.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {entity.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">{entity.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entity.jurisdiction}</div>
                    <div className="text-sm text-gray-500">{entity.incorporationDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      entity.complianceStatus === 'compliant' ? 'bg-green-100 text-green-800' :
                      entity.complianceStatus === 'non_compliant' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {entity.complianceStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(entity.authorizedCapital)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Paid: {formatCurrency(entity.paidUpCapital)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entity Details Modal */}
      <AnimatePresence>
        {selectedEntity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEntity(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEntity.name}</h3>
                  <p className="text-gray-500">{selectedEntity.registrationNumber}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedEntity.status === 'active' ? 'bg-green-100 text-green-800' :
                  selectedEntity.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  selectedEntity.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedEntity.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Entity Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="text-gray-800">{selectedEntity.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Jurisdiction:</span>
                      <p className="text-gray-800">{selectedEntity.jurisdiction}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Incorporation Date:</span>
                      <p className="text-gray-800">{selectedEntity.incorporationDate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Address:</span>
                      <p className="text-gray-800">{selectedEntity.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Financial Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Authorized Capital:</span>
                      <p className="text-gray-800">{formatCurrency(selectedEntity.authorizedCapital)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Paid-up Capital:</span>
                      <p className="text-gray-800">{formatCurrency(selectedEntity.paidUpCapital)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Compliance Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        selectedEntity.complianceStatus === 'compliant' ? 'bg-green-100 text-green-800' :
                        selectedEntity.complianceStatus === 'non_compliant' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedEntity.complianceStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    {selectedEntity.riskLevel && (
                      <div>
                        <span className="text-sm text-gray-600">Risk Level:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedEntity.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                          selectedEntity.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          selectedEntity.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedEntity.riskLevel.charAt(0).toUpperCase() + selectedEntity.riskLevel.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Business Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntity.businessActivities.map((activity, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Directors</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntity.directors.map((director, index) => (
                    <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {director}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedEntity(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Entity
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
