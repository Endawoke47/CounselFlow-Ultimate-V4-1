import React, { useState } from 'react'
import { Plus, Search, Filter, Calendar, DollarSign, User, Clock, Briefcase, Eye, Edit, MoreVertical, AlertTriangle, CheckCircle, Pause, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Matter {
  id: string
  title: string
  client: string
  type: string
  status: 'active' | 'pending' | 'closed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedLawyer: string
  createdAt: string
  dueDate: string
  estimatedValue: number
  description: string
  hoursLogged: number
  tags: string[]
  lastActivity: string
}

const mockMatters: Matter[] = [
  {
    id: '5da33d7b-e9a5-4de3-8919-92cbffacb059',
    title: 'Synergize Vertical Supply-Chains',
    client: 'Supply Chain Dynamics LLC',
    type: 'Litigation',
    status: 'active',
    priority: 'low',
    assignedLawyer: 'John Smith',
    createdAt: '2023-08-15',
    dueDate: '2024-12-15',
    estimatedValue: 980000,
    description: 'Complex litigation involving vertical supply chain integration and antitrust considerations.',
    hoursLogged: 245,
    tags: ['Litigation', 'Supply Chain', 'Antitrust'],
    lastActivity: '2024-01-20'
  },
  {
    id: '35b66297-498c-4af0-b686-a525d7e91763',
    title: 'Expedite Killer Initiatives',
    client: 'Innovation Partners Corp',
    type: 'Advisory',
    status: 'active',
    priority: 'high',
    assignedLawyer: 'Sarah Johnson',
    createdAt: '2023-09-01',
    dueDate: '2024-06-30',
    estimatedValue: 180000,
    description: 'Strategic advisory services for high-impact business initiatives and market expansion.',
    hoursLogged: 89,
    tags: ['Advisory', 'Strategy', 'Market Expansion'],
    lastActivity: '2024-01-18'
  },
  {
    id: 'a3e24549-d2ff-487a-b130-a6643025452e',
    title: 'Disintermediate Proactive Paradigms',
    client: 'Technology Solutions Inc',
    type: 'Transactional',
    status: 'active',
    priority: 'medium',
    assignedLawyer: 'Michael Brown',
    createdAt: '2023-10-10',
    dueDate: '2024-08-01',
    estimatedValue: 440000,
    description: 'Transactional work involving technology transfer and paradigm shift implementation.',
    hoursLogged: 156,
    tags: ['Transactional', 'Technology', 'Paradigm'],
    lastActivity: '2024-01-19'
  },
  {
    id: 'b1d4c2e9-920f-45c5-9040-e564b2eb56fa',
    title: 'Redefine Granular Architectures',
    client: 'Enterprise Systems Ltd',
    type: 'Litigation',
    status: 'active',
    priority: 'medium',
    assignedLawyer: 'Emily Davis',
    createdAt: '2023-07-01',
    dueDate: '2024-05-15',
    estimatedValue: 900000,
    description: 'Litigation involving complex system architectures and intellectual property disputes.',
    hoursLogged: 198,
    tags: ['Litigation', 'Architecture', 'IP'],
    lastActivity: '2024-01-15'
  },
  {
    id: '617d4b33-a1b7-4d48-963f-b49bae32c2ab',
    title: 'Grow Wireless Channels',
    client: 'Wireless Communications Corp',
    type: 'Transactional',
    status: 'active',
    priority: 'low',
    assignedLawyer: 'Robert Wilson',
    createdAt: '2023-06-05',
    dueDate: '2024-04-30',
    estimatedValue: 710000,
    description: 'Transactional matters related to wireless channel expansion and regulatory compliance.',
    hoursLogged: 123,
    tags: ['Transactional', 'Wireless', 'Regulatory'],
    lastActivity: '2024-01-16'
  },
  {
    id: '200e7c8f-82c7-449a-97f5-ac18d1c5fb86',
    title: 'Engineer Cutting-Edge Applications',
    client: 'Software Engineering LLC',
    type: 'Transactional',
    status: 'closed',
    priority: 'low',
    assignedLawyer: 'Jennifer Lee',
    createdAt: '2023-05-01',
    dueDate: '2023-12-15',
    estimatedValue: 860000,
    description: 'Engineering application development contracts and technology licensing agreements.',
    hoursLogged: 167,
    tags: ['Engineering', 'Applications', 'Licensing'],
    lastActivity: '2023-12-15'
  },
  {
    id: '9703a1c0-6431-4b0b-9885-a99f85aea66d',
    title: 'Extend Collaborative Communities',
    client: 'Community Partners Group',
    type: 'Regulatory',
    status: 'closed',
    priority: 'medium',
    assignedLawyer: 'David Miller',
    createdAt: '2023-04-10',
    dueDate: '2023-11-30',
    estimatedValue: 380000,
    description: 'Regulatory compliance for collaborative community development and partnership structures.',
    hoursLogged: 95,
    tags: ['Regulatory', 'Community', 'Partnership'],
    lastActivity: '2023-11-30'
  }
];

const statusConfig = {
  active: { icon: CheckCircle, color: 'success' as const, bgColor: 'bg-green-50' },
  pending: { icon: Clock, color: 'warning' as const, bgColor: 'bg-yellow-50' },
  closed: { icon: XCircle, color: 'info' as const, bgColor: 'bg-gray-50' },
  on_hold: { icon: Pause, color: 'danger' as const, bgColor: 'bg-red-50' }
}

const priorityConfig = {
  low: { color: 'info' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const },
  critical: { color: 'danger' as const }
}

export function MattersPageNew() {
  const [matters] = useState<Matter[]>(mockMatters)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredMatters = matters.filter(matter => {
    const matchesSearch = matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || matter.status === filterStatus
    const matchesPriority = filterPriority === 'all' || matter.priority === filterPriority
    const matchesType = filterType === 'all' || matter.type === filterType
    return matchesSearch && matchesStatus && matchesPriority && matchesType
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

  const getStatusIcon = (status: Matter['status']) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const totalValue = matters.reduce((sum, matter) => sum + matter.estimatedValue, 0)
  const activeMatters = matters.filter(m => m.status === 'active').length
  const overdueMatters = matters.filter(m => getDaysUntilDue(m.dueDate) < 0).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Matters</h1>
          <p className="text-muted-600 mt-1">Manage legal matters and case workflow</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </Button>
          <Button 
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Matter</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Matters</p>
              <p className="text-2xl font-bold text-navy-900">{matters.length}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Active Matters</p>
              <p className="text-2xl font-bold text-navy-900">{activeMatters}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Value</p>
              <p className="text-2xl font-bold text-navy-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Overdue</p>
              <p className="text-2xl font-bold text-navy-900">{overdueMatters}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
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
              placeholder="Search matters, clients, or types..."
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
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
              <option value="on_hold">On Hold</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="Corporate">Corporate</option>
              <option value="Employment">Employment</option>
              <option value="IP">Intellectual Property</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Litigation">Litigation</option>
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

      {/* Matters Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatters.map((matter, index) => (
            <motion.div
              key={matter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div 
                  className="w-full h-full"
                  onClick={() => setSelectedMatter(matter)}
                >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${statusConfig[matter.status].bgColor}`}>
                      {getStatusIcon(matter.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 text-sm">{matter.title}</h3>
                      <p className="text-sm text-muted-600">{matter.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={priorityConfig[matter.priority].color}>
                      {matter.priority}
                    </Badge>
                    <button className="p-1 text-muted-400 hover:text-muted-600 rounded-full hover:bg-light-200">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <Badge variant={statusConfig[matter.status].color}>
                    {matter.status.replace('_', ' ')}
                  </Badge>
                </div>

                <p className="text-sm text-muted-600 mb-4 line-clamp-2">{matter.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">Client:</span>
                    <span className="font-medium text-navy-900">{matter.client}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">Lawyer:</span>
                    <span className="font-medium text-navy-900">{matter.assignedLawyer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">Value:</span>
                    <span className="font-medium text-navy-900">{formatCurrency(matter.estimatedValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">Due Date:</span>
                    <span className={`font-medium ${getDaysUntilDue(matter.dueDate) < 0 ? 'text-red-600' : 'text-navy-900'}`}>
                      {formatDate(matter.dueDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-500">Hours:</span>
                    <span className="font-medium text-navy-900">{matter.hoursLogged}h</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-light-200">
                  <div className="flex flex-wrap gap-1">
                    {matter.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {matter.tags.length > 2 && (
                      <Badge variant="info" size="sm">
                        +{matter.tags.length - 2}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Matter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-light-200">
                {filteredMatters.map((matter) => (
                  <tr key={matter.id} className="hover:bg-light-50 cursor-pointer"
                      onClick={() => setSelectedMatter(matter)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${statusConfig[matter.status].bgColor} mr-3`}>
                          {getStatusIcon(matter.status)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-navy-900">{matter.title}</div>
                          <div className="text-sm text-muted-500">{matter.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-navy-900">{matter.client}</div>
                      <div className="text-sm text-muted-500">{matter.assignedLawyer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusConfig[matter.status].color}>
                        {matter.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={priorityConfig[matter.priority].color}>
                        {matter.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                      {formatCurrency(matter.estimatedValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-900">
                      <div className={getDaysUntilDue(matter.dueDate) < 0 ? 'text-red-600' : ''}>
                        {formatDate(matter.dueDate)}
                      </div>
                      <div className="text-xs text-muted-500">
                        {getDaysUntilDue(matter.dueDate) < 0 
                          ? `${Math.abs(getDaysUntilDue(matter.dueDate))} days overdue`
                          : `${getDaysUntilDue(matter.dueDate)} days left`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-900">
                      {matter.hoursLogged}h
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
      {filteredMatters.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-light-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-12 w-12 text-muted-400" />
          </div>
          <h3 className="text-lg font-medium text-navy-900 mb-2">No matters found</h3>
          <p className="text-muted-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search criteria or filters to find matters.'
              : 'Get started by creating your first matter to track legal cases and projects.'
            }
          </p>
          <Button 
            className="bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Matter
          </Button>
        </div>
      )}

      {/* Matter Detail Modal */}
      {selectedMatter && (
        <Modal
          isOpen={!!selectedMatter}
          onClose={() => setSelectedMatter(null)}
          title={selectedMatter.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant={statusConfig[selectedMatter.status].color}>
                {selectedMatter.status.replace('_', ' ')}
              </Badge>
              <Badge variant={priorityConfig[selectedMatter.priority].color}>
                {selectedMatter.priority} priority
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Client</label>
                <p className="text-navy-900">{selectedMatter.client}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Type</label>
                <p className="text-navy-900">{selectedMatter.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Assigned Lawyer</label>
                <p className="text-navy-900">{selectedMatter.assignedLawyer}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Estimated Value</label>
                <p className="text-navy-900 font-medium">{formatCurrency(selectedMatter.estimatedValue)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Created</label>
                <p className="text-navy-900">{formatDate(selectedMatter.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Due Date</label>
                <p className={getDaysUntilDue(selectedMatter.dueDate) < 0 ? 'text-red-600' : 'text-navy-900'}>
                  {formatDate(selectedMatter.dueDate)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Hours Logged</label>
                <p className="text-navy-900">{selectedMatter.hoursLogged} hours</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Last Activity</label>
                <p className="text-navy-900">{formatDate(selectedMatter.lastActivity)}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-2">Description</label>
              <p className="text-navy-900">{selectedMatter.description}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {selectedMatter.tags.map((tag, idx) => (
                  <Badge key={idx} variant="info">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-200">
              <Button variant="secondary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Matter
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Matter Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Matter"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Matter Title</label>
                <Input placeholder="Enter matter title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Matter Type</label>
                <select className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option>Corporate</option>
                  <option>Employment</option>
                  <option>Intellectual Property</option>
                  <option>Real Estate</option>
                  <option>Litigation</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Client</label>
                <Input placeholder="Select or enter client" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Assigned Lawyer</label>
                <Input placeholder="Select lawyer" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Estimated Value</label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Due Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>On Hold</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Enter matter description"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-200">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                Create Matter
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
