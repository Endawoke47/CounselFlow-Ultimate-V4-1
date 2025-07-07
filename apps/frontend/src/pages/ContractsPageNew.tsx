import React, { useState } from 'react'
import { Plus, Search, Filter, FileText, Calendar, DollarSign, User, MoreVertical, Download, Eye, Edit, Trash2, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

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
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

const mockContracts: Contract[] = [
  {
    id: '9b0a0667-6343-4c06-bd26-7154311d4720',
    title: 'Whiteboard Compelling Architectures',
    client: 'Brown-Braun',
    type: 'Employment',
    status: 'expired' as const,
    value: 952530.93,
    startDate: '2023-10-12',
    endDate: '2026-03-19',
    lastModified: '2024-01-15',
    description: 'Comprehensive employment agreement with intellectual property and non-compete clauses',
    priority: 'high' as const,
    tags: ['Employment', 'IP', 'Non-Compete']
  },
  {
    id: '66f06d14-27bd-41b3-8ca6-d8c1b5ceea98',
    title: 'Leverage Impactful Models',
    client: 'Moore-Gomez',
    type: 'Employment',
    status: 'draft' as const,
    value: 605863.88,
    startDate: '2023-07-17',
    endDate: '2026-03-29',
    lastModified: '2024-01-10',
    description: 'Employment contract for senior management position with equity participation',
    priority: 'medium' as const,
    tags: ['Employment', 'Senior', 'Equity']
  },
  {
    id: 'bc8acc54-7287-4bb1-b8a7-178153ae297f',
    title: 'Generate Integrated Synergies',
    client: 'Sanders-Nguyen',
    type: 'Employment',
    status: 'expired' as const,
    value: 867663.51,
    startDate: '2024-06-22',
    endDate: '2026-02-27',
    lastModified: '2024-06-25',
    description: 'Executive employment agreement with performance-based compensation',
    priority: 'high' as const,
    tags: ['Executive', 'Performance', 'Compensation']
  },
  {
    id: 'ba8ef08f-8502-45c3-916d-7e0193f68f10',
    title: 'Whiteboard Viral Relationships',
    client: 'Dean, Mcgee and Torres',
    type: 'SOW',
    status: 'draft' as const,
    value: 565513.2,
    startDate: '2023-08-04',
    endDate: '2026-03-24',
    lastModified: '2023-08-15',
    description: 'Statement of Work for strategic consulting and business development services',
    priority: 'high' as const,
    tags: ['SOW', 'Consulting', 'Strategy']
  },
  {
    id: '3b16da41-95c7-43f5-8d61-0388a87d04f9',
    title: 'Deploy B2C E-Commerce',
    client: 'Mills, Ellis and Brown',
    type: 'MSA',
    status: 'expired' as const,
    value: 416154.07,
    startDate: '2023-10-31',
    endDate: '2025-08-16',
    lastModified: '2023-11-05',
    description: 'Master Service Agreement for e-commerce platform development and maintenance',
    priority: 'medium' as const,
    tags: ['MSA', 'E-commerce', 'Platform']
  },
  {
    id: '9b79a268-f704-49c1-a40f-cffc3b7115db',
    title: 'Synergize Robust E-Commerce',
    client: 'Fuller, Lang and Duncan',
    type: 'NDA',
    status: 'draft' as const,
    value: 39093.04,
    startDate: '2023-08-10',
    endDate: '2026-05-29',
    lastModified: '2023-08-12',
    description: 'Non-disclosure agreement for proprietary technology sharing and collaboration',
    priority: 'low' as const,
    tags: ['NDA', 'Technology', 'Collaboration']
  },
  {
    id: 'dcde1a1d-85bc-4780-ae2b-6331bd9ca2bf',
    title: 'Disintermediate Virtual Models',
    client: 'Sharp-Hoover',
    type: 'MSA',
    status: 'draft' as const,
    value: 148365.01,
    startDate: '2024-02-09',
    endDate: '2026-02-03',
    lastModified: '2024-02-15',
    description: 'Master Service Agreement for virtual consulting and digital transformation services',
    priority: 'low' as const,
    tags: ['MSA', 'Virtual', 'Digital Transformation']
  },
  {
    id: '409a0daa-a2b2-45d6-8d72-fbe3d0ff02dc',
    title: 'Orchestrate Efficient Convergence',
    client: 'Clark PLC',
    type: 'Employment',
    status: 'executed' as const,
    value: 835912.37,
    startDate: '2024-06-02',
    endDate: '2026-05-20',
    lastModified: '2024-06-05',
    description: 'Senior executive employment contract with stock options and retention bonus',
    priority: 'high' as const,
    tags: ['Executive', 'Stock Options', 'Retention']
  }
];

const statusConfig = {
  draft: { icon: Edit, color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' },
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
  executed: { icon: CheckCircle, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
  expired: { icon: XCircle, color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' }
}

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-700' },
  medium: { color: 'bg-yellow-100 text-yellow-700' },
  high: { color: 'bg-red-100 text-red-700' }
}

export function ContractsPageNew() {
  const [contracts] = useState<Contract[]>(mockContracts)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus
    const matchesPriority = filterPriority === 'all' || contract.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const formatCurrency = (amount: number) => {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Contracts</h1>
          <p className="text-muted-600 mt-1">Manage your contract portfolio and lifecycle</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button 
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Contract</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Contracts</p>
              <p className="text-2xl font-bold text-navy-900">{contracts.length}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Value</p>
              <p className="text-2xl font-bold text-navy-900">
                {formatCurrency(contracts.reduce((sum, c) => sum + c.value, 0))}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Active</p>
              <p className="text-2xl font-bold text-navy-900">
                {contracts.filter(c => c.status === 'executed').length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Pending</p>
              <p className="text-2xl font-bold text-navy-900">
                {contracts.filter(c => c.status === 'pending' || c.status === 'draft').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 bg-white p-4 rounded-lg border border-light-300">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-500" />
            <Input
              type="text"
              placeholder="Search contracts, clients, or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="executed">Executed</option>
              <option value="expired">Expired</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Contracts Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div 
                  className="w-full h-full"
                  onClick={() => setSelectedContract(contract)}
                >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${statusConfig[contract.status].bgColor}`}>
                      {getStatusIcon(contract.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 text-sm">{contract.title}</h3>
                      <p className="text-sm text-muted-600">{contract.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={contract.priority === 'high' ? 'danger' : contract.priority === 'medium' ? 'warning' : 'info'}>
                      {contract.priority}
                    </Badge>
                    <button className="p-1 text-muted-400 hover:text-muted-600 rounded-full hover:bg-light-200">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <Badge variant={contract.status === 'executed' ? 'success' : contract.status === 'pending' ? 'warning' : contract.status === 'expired' ? 'danger' : 'info'}>
                    {contract.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-600 mb-4 line-clamp-2">{contract.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">Client:</span>
                    <span className="font-medium text-navy-900">{contract.client}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">Value:</span>
                    <span className="font-medium text-navy-900">{formatCurrency(contract.value)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">End Date:</span>
                    <span className="font-medium text-navy-900">{formatDate(contract.endDate)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-light-200">
                  <div className="flex flex-wrap gap-1">
                    {contract.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {contract.tags.length > 2 && (
                      <Badge variant="info" size="sm">
                        +{contract.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-100 border-b border-light-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Contract</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-light-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-light-50 cursor-pointer"
                      onClick={() => setSelectedContract(contract)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${statusConfig[contract.status].bgColor} mr-3`}>
                          {getStatusIcon(contract.status)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-navy-900">{contract.title}</div>
                          <div className="text-sm text-muted-500">{contract.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-900">{contract.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={contract.status === 'executed' ? 'success' : contract.status === 'pending' ? 'warning' : contract.status === 'expired' ? 'danger' : 'info'}>
                        {contract.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                      {formatCurrency(contract.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-900">
                      {formatDate(contract.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={contract.priority === 'high' ? 'danger' : contract.priority === 'medium' ? 'warning' : 'info'}>
                        {contract.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-light-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-muted-400" />
          </div>
          <h3 className="text-lg font-medium text-navy-900 mb-2">No contracts found</h3>
          <p className="text-muted-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search criteria or filters to find contracts.'
              : 'Get started by creating your first contract to manage your legal agreements.'
            }
          </p>
          <Button 
            className="bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Contract
          </Button>
        </div>
      )}

      {/* Contract Detail Modal */}
      {selectedContract && (
        <Modal
          isOpen={!!selectedContract}
          onClose={() => setSelectedContract(null)}
          title={selectedContract.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant={selectedContract.status === 'executed' ? 'success' : selectedContract.status === 'pending' ? 'warning' : selectedContract.status === 'expired' ? 'danger' : 'info'}>
                {selectedContract.status}
              </Badge>
              <Badge variant={selectedContract.priority === 'high' ? 'danger' : selectedContract.priority === 'medium' ? 'warning' : 'info'}>
                {selectedContract.priority} priority
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Client</label>
                <p className="text-navy-900">{selectedContract.client}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Type</label>
                <p className="text-navy-900">{selectedContract.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Value</label>
                <p className="text-navy-900 font-medium">{formatCurrency(selectedContract.value)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Duration</label>
                <p className="text-navy-900">{formatDate(selectedContract.startDate)} - {formatDate(selectedContract.endDate)}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-2">Description</label>
              <p className="text-navy-900">{selectedContract.description}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {selectedContract.tags.map((tag, idx) => (
                  <Badge key={idx} variant="info">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-200">
              <Button variant="secondary">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="secondary">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Eye className="h-4 w-4 mr-2" />
                View Full Contract
              </Button>
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
                <label className="block text-sm font-medium text-muted-700 mb-1">Contract Title</label>
                <Input placeholder="Enter contract title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Contract Type</label>
                <select className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option>License Agreement</option>
                  <option>Service Agreement</option>
                  <option>NDA</option>
                  <option>Employment</option>
                  <option>MSA</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Client</label>
                <Input placeholder="Select or enter client" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Value</label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Start Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">End Date</label>
                <Input type="date" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Enter contract description"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-200">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                Create Contract
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
