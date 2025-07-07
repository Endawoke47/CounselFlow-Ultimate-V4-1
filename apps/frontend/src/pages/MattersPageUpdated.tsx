import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  DollarSign,
  User,
  Clock,
  Briefcase,
  Edit,
  Eye,
  Archive,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Building,
  FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Matter {
  id: string
  title: string
  clientName: string
  type: 'corporate' | 'employment' | 'intellectual_property' | 'real_estate' | 'family' | 'litigation' | 'compliance'
  status: 'active' | 'pending' | 'closed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedLawyer: { firstName: string; lastName: string }
  createdAt: string
  dueDate: string
  estimatedValue: number
  description: string
  hoursLogged?: number
  progressPercentage?: number
}

const statusConfig = {
  active: { icon: CheckCircle, color: 'success' as const },
  pending: { icon: Clock, color: 'warning' as const },
  closed: { icon: Archive, color: 'info' as const },
  on_hold: { icon: AlertTriangle, color: 'danger' as const }
}

const priorityConfig = {
  low: { color: 'info' as const },
  medium: { color: 'warning' as const },
  high: { color: 'danger' as const },
  critical: { color: 'danger' as const }
}

const typeConfig = {
  corporate: { icon: Building, color: 'bg-blue-500' },
  employment: { icon: User, color: 'bg-green-500' },
  intellectual_property: { icon: FileText, color: 'bg-purple-500' },
  real_estate: { icon: Building, color: 'bg-orange-500' },
  family: { icon: User, color: 'bg-pink-500' },
  litigation: { icon: Briefcase, color: 'bg-red-500' },
  compliance: { icon: CheckCircle, color: 'bg-indigo-500' }
}

export function MattersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const mockMatters: Matter[] = [
    {
      id: '1',
      title: 'Corporate Merger - TechCorp Acquisition',
      clientName: 'TechCorp Industries',
      type: 'corporate',
      status: 'active',
      priority: 'high',
      assignedLawyer: { firstName: 'John', lastName: 'Smith' },
      createdAt: '2025-01-15T10:00:00Z',
      dueDate: '2025-08-15T17:00:00Z',
      estimatedValue: 2500000,
      description: 'Major corporate acquisition requiring due diligence, regulatory approval, and contract negotiations with multiple stakeholders.',
      hoursLogged: 125,
      progressPercentage: 65
    },
    {
      id: '2',
      title: 'Employment Contract Dispute',
      clientName: 'StartupCo LLC',
      type: 'employment',
      status: 'active',
      priority: 'medium',
      assignedLawyer: { firstName: 'Sarah', lastName: 'Johnson' },
      createdAt: '2025-02-01T09:30:00Z',
      dueDate: '2025-07-30T16:00:00Z',
      estimatedValue: 150000,
      description: 'Non-compete clause enforcement and severance negotiations for senior executive termination.',
      hoursLogged: 45,
      progressPercentage: 40
    },
    {
      id: '3',
      title: 'Intellectual Property Registration',
      clientName: 'InnovaTech Solutions',
      type: 'intellectual_property',
      status: 'pending',
      priority: 'medium',
      assignedLawyer: { firstName: 'Michael', lastName: 'Brown' },
      createdAt: '2025-02-10T14:15:00Z',
      dueDate: '2025-09-01T12:00:00Z',
      estimatedValue: 75000,
      description: 'Patent filing and trademark registration for new software platform and associated branding materials.',
      hoursLogged: 20,
      progressPercentage: 15
    },
    {
      id: '4',
      title: 'Real Estate Transaction',
      clientName: 'Metro Properties Group',
      type: 'real_estate',
      status: 'active',
      priority: 'high',
      assignedLawyer: { firstName: 'John', lastName: 'Smith' },
      createdAt: '2025-03-01T11:00:00Z',
      dueDate: '2025-07-20T15:00:00Z',
      estimatedValue: 500000,
      description: 'Commercial property acquisition and lease negotiations for multi-building office complex.',
      hoursLogged: 80,
      progressPercentage: 55
    },
    {
      id: '5',
      title: 'Regulatory Compliance Review',
      clientName: 'FinanceFirst Bank',
      type: 'compliance',
      status: 'pending',
      priority: 'low',
      assignedLawyer: { firstName: 'Sarah', lastName: 'Johnson' },
      createdAt: '2025-03-15T13:45:00Z',
      dueDate: '2025-10-15T17:00:00Z',
      estimatedValue: 100000,
      description: 'Annual compliance audit and policy updates for financial services regulations.',
      hoursLogged: 15,
      progressPercentage: 10
    },
    {
      id: '6',
      title: 'Family Business Succession',
      clientName: 'Heritage Manufacturing Co',
      type: 'family',
      status: 'on_hold',
      priority: 'medium',
      assignedLawyer: { firstName: 'Michael', lastName: 'Brown' },
      createdAt: '2025-01-20T08:30:00Z',
      dueDate: '2025-12-01T16:00:00Z',
      estimatedValue: 300000,
      description: 'Multi-generational business transfer planning and estate structuring for family-owned manufacturing company.',
      hoursLogged: 35,
      progressPercentage: 25
    }
  ]

  const filteredMatters = mockMatters.filter(matter => {
    const matchesSearch = matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${matter.assignedLawyer.firstName} ${matter.assignedLawyer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || matter.status === filterStatus
    const matchesType = filterType === 'all' || matter.type === filterType
    const matchesPriority = filterPriority === 'all' || matter.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    if (!amount) return 'TBD'
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const getStatusIcon = (status: Matter['status']) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const getTypeIcon = (type: Matter['type']) => {
    const IconComponent = typeConfig[type].icon
    return <IconComponent className="h-5 w-5 text-white" />
  }

  const totalValue = mockMatters.reduce((sum, matter) => sum + matter.estimatedValue, 0)
  const activeMatters = mockMatters.filter(m => m.status === 'active').length
  const pendingMatters = mockMatters.filter(m => m.status === 'pending').length
  const totalHours = mockMatters.reduce((sum, matter) => sum + (matter.hoursLogged || 0), 0)

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
              Matter Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Track and manage all legal matters with comprehensive insights
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="h-4 w-4" />
              <span>Deadlines</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Matter</span>
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
                <p className="text-sm font-semibold text-teal-600">Total Matters</p>
                <p className="text-3xl font-bold text-teal-800">{mockMatters.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-blue-600 font-medium">+12%</span>
              <span className="text-teal-500 ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Active Matters</p>
                <p className="text-3xl font-bold text-teal-800">{activeMatters}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">In progress</span>
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
                <p className="text-sm font-semibold text-teal-600">Hours Logged</p>
                <p className="text-3xl font-bold text-teal-800">{totalHours}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">This quarter</span>
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
                  placeholder="Search matters, clients, or lawyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                  <option value="on_hold">On Hold</option>
                </select>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Types</option>
                  <option value="corporate">Corporate</option>
                  <option value="employment">Employment</option>
                  <option value="intellectual_property">IP</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="family">Family</option>
                  <option value="litigation">Litigation</option>
                  <option value="compliance">Compliance</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-teal-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Matters Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatters.map((matter, index) => (
              <motion.div
                key={matter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedMatter(matter)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 ${typeConfig[matter.type].color} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                      {getTypeIcon(matter.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-teal-900 group-hover:text-teal-700 transition-colors">{matter.title}</h3>
                      <p className="text-sm text-teal-600">{getTypeLabel(matter.type)}</p>
                    </div>
                  </div>
                  <button className="p-1 text-teal-400 hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4 flex items-center space-x-2">
                  <Badge variant={statusConfig[matter.status].color}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(matter.status)}
                      <span className="capitalize">{matter.status.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                  <Badge variant={priorityConfig[matter.priority].color}>
                    {matter.priority.charAt(0).toUpperCase() + matter.priority.slice(1)}
                  </Badge>
                </div>

                <p className="text-sm text-teal-700 mb-4 line-clamp-2">{matter.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Client:</span>
                    <span className="font-medium text-teal-900">{matter.clientName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Value:</span>
                    <span className="font-medium text-teal-900">{formatCurrency(matter.estimatedValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Due Date:</span>
                    <span className="font-medium text-teal-900">{formatDate(matter.dueDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">Lawyer:</span>
                    <span className="font-medium text-teal-900">{matter.assignedLawyer.firstName} {matter.assignedLawyer.lastName}</span>
                  </div>
                </div>

                {matter.progressPercentage !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-teal-600">Progress</span>
                      <span className="font-medium text-teal-900">{matter.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-teal-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${matter.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-teal-600">{matter.hoursLogged || 0} hours logged</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Eye className="h-4 w-4 text-teal-600" />
                    </Button>
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Edit className="h-4 w-4 text-teal-600" />
                    </Button>
                    <Button variant="secondary" size="sm" className="p-2 bg-white/50 border-teal-200 hover:bg-teal-50">
                      <Archive className="h-4 w-4 text-teal-600" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredMatters.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6">
              <Briefcase className="h-12 w-12 text-teal-600 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-teal-900 mb-2">No matters found</h3>
            <p className="text-teal-600 mb-6">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first matter'
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 flex items-center space-x-2 mx-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>New Matter</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Matter Detail Modal */}
      {selectedMatter && (
        <Modal
          isOpen={!!selectedMatter}
          onClose={() => setSelectedMatter(null)}
          title={selectedMatter.title}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Client</label>
                <p className="text-teal-900 font-semibold">{selectedMatter.clientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                <p className="text-teal-900">{getTypeLabel(selectedMatter.type)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Status</label>
                <Badge variant={statusConfig[selectedMatter.status].color}>
                  {selectedMatter.status.charAt(0).toUpperCase() + selectedMatter.status.slice(1).replace('_', ' ')}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Priority</label>
                <Badge variant={priorityConfig[selectedMatter.priority].color}>
                  {selectedMatter.priority.charAt(0).toUpperCase() + selectedMatter.priority.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Estimated Value</label>
                <p className="text-teal-900 font-semibold">{formatCurrency(selectedMatter.estimatedValue)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Hours Logged</label>
                <p className="text-teal-900 font-semibold">{selectedMatter.hoursLogged || 0} hours</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-2">Description</label>
              <p className="text-teal-800">{selectedMatter.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Created Date</label>
                <p className="text-teal-900">{formatDate(selectedMatter.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Due Date</label>
                <p className="text-teal-900">{formatDate(selectedMatter.dueDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Assigned Lawyer</label>
                <p className="text-teal-900">{selectedMatter.assignedLawyer.firstName} {selectedMatter.assignedLawyer.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Progress</label>
                <p className="text-teal-900">{selectedMatter.progressPercentage || 0}% Complete</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Edit Matter</Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">Log Time</Button>
              <Button variant="secondary" className="border-teal-200 text-teal-700 hover:bg-teal-50">Add Note</Button>
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
                <label className="block text-sm font-medium text-teal-600 mb-1">Title</label>
                <Input placeholder="Enter matter title" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Type</label>
                <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="corporate">Corporate</option>
                  <option value="employment">Employment</option>
                  <option value="intellectual_property">Intellectual Property</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="family">Family Law</option>
                  <option value="litigation">Litigation</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Client</label>
                <Input placeholder="Select or enter client" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Estimated Value</label>
                <Input type="number" placeholder="0" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Due Date</label>
                <Input type="date" className="border-teal-200 focus:border-teal-500 focus:ring-teal-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-teal-600 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-teal-600 mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-teal-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="Enter matter description..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">Create Matter</Button>
              <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="border-teal-200 text-teal-700 hover:bg-teal-50">Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
