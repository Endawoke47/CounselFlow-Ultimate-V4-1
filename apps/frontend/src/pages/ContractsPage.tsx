import React, { useState } from 'react'
import { Plus, Search, Filter, FileText, Calendar, DollarSign, User, MoreVertical, TrendingUp, CheckCircle, Clock, AlertTriangle, Eye, Edit, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Contract {
  id: string
  title: string
  client: string
  type: 'license' | 'service' | 'nda' | 'employment' | 'vendor' | 'partnership'
  status: 'draft' | 'pending' | 'executed' | 'expired' | 'terminated'
  value: number
  startDate: string
  endDate: string
  lastModified: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: string
  renewalDate?: string
  riskLevel: 'low' | 'medium' | 'high'
}

const statusConfig = {
  draft: { icon: Edit, color: 'info' as const },
  pending: { icon: Clock, color: 'warning' as const },
  executed: { icon: CheckCircle, color: 'success' as const },
  expired: { icon: AlertTriangle, color: 'danger' as const },
  terminated: { icon: AlertTriangle, color: 'danger' as const }
}

const priorityConfig = {
  low: { color: 'info' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const },
  critical: { color: 'danger' as const }
}

const riskConfig = {
  low: { color: 'success' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const }
}

export function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const mockContracts: Contract[] = [
    {
      id: '1',
      title: 'Software License Agreement - Enterprise Suite',
      client: 'TechCorp Industries',
      type: 'license',
      status: 'executed',
      value: 150000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      lastModified: '2024-01-15',
      description: 'Annual software licensing agreement for enterprise suite with maintenance and support',
      priority: 'high',
      assignedTo: 'Sarah Johnson',
      renewalDate: '2024-11-01',
      riskLevel: 'low'
    },
    {
      id: '2',
      title: 'Professional Services Agreement',
      client: 'Global Services LLC',
      type: 'service',
      status: 'draft',
      value: 75000,
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      lastModified: '2024-01-10',
      description: 'Professional services agreement for consulting work and implementation',
      priority: 'medium',
      assignedTo: 'Michael Brown',
      riskLevel: 'medium'
    },
    {
      id: '3',
      title: 'Mutual Non-Disclosure Agreement',
      client: 'Innovation Labs',
      type: 'nda',
      status: 'pending',
      value: 0,
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      lastModified: '2024-01-12',
      description: 'Mutual non-disclosure agreement for partnership discussions and technology sharing',
      priority: 'medium',
      assignedTo: 'Jennifer Davis',
      riskLevel: 'low'
    },
    {
      id: '4',
      title: 'Vendor Supply Agreement',
      client: 'Manufacturing Corp',
      type: 'vendor',
      status: 'executed',
      value: 250000,
      startDate: '2023-06-01',
      endDate: '2025-06-01',
      lastModified: '2024-01-05',
      description: 'Multi-year vendor supply agreement with volume discounts and performance metrics',
      priority: 'high',
      assignedTo: 'David Wilson',
      renewalDate: '2025-03-01',
      riskLevel: 'medium'
    },
    {
      id: '5',
      title: 'Employment Agreement - Executive',
      client: 'StartupCo LLC',
      type: 'employment',
      status: 'executed',
      value: 180000,
      startDate: '2024-01-01',
      endDate: '2026-01-01',
      lastModified: '2023-12-20',
      description: 'Executive employment agreement with equity compensation and non-compete clauses',
      priority: 'critical',
      assignedTo: 'Lisa Rodriguez',
      riskLevel: 'high'
    }
  ]

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    const matchesType = typeFilter === 'all' || contract.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'No value'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: Contract['status']) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const totalValue = mockContracts.reduce((sum, contract) => sum + contract.value, 0)
  const activeContracts = mockContracts.filter(c => c.status === 'executed').length
  const pendingContracts = mockContracts.filter(c => c.status === 'pending').length
  const draftContracts = mockContracts.filter(c => c.status === 'draft').length

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
              Contract Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Comprehensive contract lifecycle management and analysis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="h-4 w-4" />
              <span>Renewals</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Contract</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Contracts</p>
                <p className="text-3xl font-bold text-teal-800">{mockContracts.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-600 font-medium">+8%</span>
              <span className="text-teal-500 ml-1">vs last quarter</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Active Contracts</p>
                <p className="text-3xl font-bold text-teal-800">{activeContracts}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">Executed</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Value</p>
                <p className="text-3xl font-bold text-teal-800">{formatCurrency(totalValue)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Portfolio value</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Pending Review</p>
                <p className="text-3xl font-bold text-teal-800">{pendingContracts + draftContracts}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Need attention</span>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
                <Input
                  type="text"
                  placeholder="Search contracts, clients, or types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="executed">Executed</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Types</option>
                  <option value="license">License</option>
                  <option value="service">Service</option>
                  <option value="nda">NDA</option>
                  <option value="employment">Employment</option>
                  <option value="vendor">Vendor</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contracts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedContract(contract)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform duration-200">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-teal-900 group-hover:text-teal-700 transition-colors">{contract.title}</h3>
                      <p className="text-sm text-teal-600 capitalize">{contract.type}</p>
                    </div>
                  </div>
                  <button className="p-1 text-teal-400 hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4 flex items-center space-x-2">
                  <Badge variant={statusConfig[contract.status].color}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(contract.status)}
                      <span className="capitalize">{contract.status}</span>
                    </div>
                  </Badge>
                  <Badge variant={priorityConfig[contract.priority].color}>
                    {contract.priority.charAt(0).toUpperCase() + contract.priority.slice(1)}
                  </Badge>
                </div>

                <p className="text-sm text-teal-700 mb-4 line-clamp-2">{contract.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Client:</span>
                    <span className="font-medium text-teal-900">{contract.client}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Value:</span>
                    <span className="font-medium text-teal-900">{formatCurrency(contract.value)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Duration:</span>
                    <span className="font-medium text-teal-900">{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Assigned:</span>
                    <span className="font-medium text-teal-900">{contract.assignedTo}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant={riskConfig[contract.riskLevel].color}>
                    Risk: {contract.riskLevel.charAt(0).toUpperCase() + contract.riskLevel.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Eye className="h-4 w-4 text-teal-600" />
                    </Button>
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Edit className="h-4 w-4 text-teal-600" />
                    </Button>
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Download className="h-4 w-4 text-teal-600" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredContracts.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="h-12 w-12 text-teal-600 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-teal-900 mb-2">No contracts found</h3>
            <p className="text-teal-600 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first contract'
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center space-x-2 mx-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>New Contract</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <Modal
          isOpen={!!selectedContract}
          onClose={() => setSelectedContract(null)}
          title={selectedContract.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Client</label>
                <p className="text-teal-900 font-semibold">{selectedContract.client}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                <p className="text-teal-900 capitalize">{selectedContract.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Status</label>
                <Badge variant={statusConfig[selectedContract.status].color}>
                  {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Priority</label>
                <Badge variant={priorityConfig[selectedContract.priority].color}>
                  {selectedContract.priority.charAt(0).toUpperCase() + selectedContract.priority.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Contract Value</label>
                <p className="text-teal-900 font-semibold">{formatCurrency(selectedContract.value)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Risk Level</label>
                <Badge variant={riskConfig[selectedContract.riskLevel].color}>
                  {selectedContract.riskLevel.charAt(0).toUpperCase() + selectedContract.riskLevel.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Description</label>
              <p className="text-teal-800">{selectedContract.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Start Date</label>
                <p className="text-teal-900">{formatDate(selectedContract.startDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">End Date</label>
                <p className="text-teal-900">{formatDate(selectedContract.endDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Assigned To</label>
                <p className="text-teal-900">{selectedContract.assignedTo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Last Modified</label>
                <p className="text-teal-900">{formatDate(selectedContract.lastModified)}</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Edit Contract</Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">Download PDF</Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">Add Note</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Contract Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Contract"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Title</label>
                <Input placeholder="Enter contract title" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="license">License</option>
                  <option value="service">Service</option>
                  <option value="nda">NDA</option>
                  <option value="employment">Employment</option>
                  <option value="vendor">Vendor</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Client</label>
                <Input placeholder="Select or enter client" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Contract Value</label>
                <Input type="number" placeholder="0" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Start Date</label>
                <Input type="date" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">End Date</label>
                <Input type="date" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-teal-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="Enter contract description..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Create Contract</Button>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="border-teal-200 text-teal-700 hover:bg-teal-50">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
