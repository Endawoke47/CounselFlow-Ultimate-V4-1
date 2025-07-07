import React, { useState } from 'react'
import { Plus, Search, Filter, Building2, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, FileCheck, Globe, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Entity {
  id: string
  name: string
  type: 'corporation' | 'llc' | 'partnership' | 'subsidiary' | 'branch' | 'joint-venture'
  status: 'active' | 'inactive' | 'pending' | 'dissolved'
  jurisdiction: string
  incorporationDate: string
  entityNumber: string
  registeredAgent: string
  businessAddress: string
  filingStatus: 'current' | 'overdue' | 'pending' | 'delinquent'
  nextFilingDue: string
  annualReportStatus: 'filed' | 'due' | 'overdue'
  taxId: string
  parentEntity?: string
  subsidiaries: number
  complianceScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  aiInsights: string[]
  estimatedValue: number
  assignedCounsel: string
  lastAudit: string
}

const statusConfig = {
  active: { icon: CheckCircle, color: 'success' as const },
  inactive: { icon: XCircle, color: 'info' as const },
  pending: { icon: Clock, color: 'warning' as const },
  dissolved: { icon: XCircle, color: 'danger' as const }
}

const filingStatusConfig = {
  current: { icon: CheckCircle, color: 'success' as const },
  overdue: { icon: AlertTriangle, color: 'danger' as const },
  pending: { icon: Clock, color: 'warning' as const },
  delinquent: { icon: AlertCircle, color: 'danger' as const }
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
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all')
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const entities: Entity[] = [
    {
      id: '1',
      name: 'TechCorp Industries Inc.',
      type: 'corporation',
      status: 'active',
      jurisdiction: 'Delaware',
      incorporationDate: '2018-03-15',
      entityNumber: 'DE7891234',
      registeredAgent: 'Corporate Services Company',
      businessAddress: '100 Technology Drive, San Francisco, CA 94105',
      filingStatus: 'current',
      nextFilingDue: '2024-03-15',
      annualReportStatus: 'filed',
      taxId: '87-1234567',
      subsidiaries: 3,
      complianceScore: 95,
      riskLevel: 'low',
      aiInsights: ['All filings up to date', 'Strong compliance history', 'No regulatory issues'],
      estimatedValue: 50000000,
      assignedCounsel: 'Sarah Johnson',
      lastAudit: '2023-12-01'
    },
    {
      id: '2',
      name: 'Innovation Labs LLC',
      type: 'llc',
      status: 'active',
      jurisdiction: 'California',
      incorporationDate: '2020-06-10',
      entityNumber: 'CA202012345',
      registeredAgent: 'Legal Filing Services',
      businessAddress: '789 Innovation Drive, Austin, TX 78701',
      filingStatus: 'overdue',
      nextFilingDue: '2024-01-15',
      annualReportStatus: 'overdue',
      taxId: '88-9876543',
      subsidiaries: 0,
      complianceScore: 72,
      riskLevel: 'medium',
      aiInsights: ['Annual report overdue', 'Immediate filing required', 'Potential penalties pending'],
      estimatedValue: 15000000,
      assignedCounsel: 'Michael Chen',
      lastAudit: '2023-08-15'
    },
    {
      id: '3',
      name: 'Metro Holdings Partnership',
      type: 'partnership',
      status: 'active',
      jurisdiction: 'New York',
      incorporationDate: '2015-09-20',
      entityNumber: 'NY456789',
      registeredAgent: 'Empire Business Services',
      businessAddress: '321 Metro Plaza, New York, NY 10001',
      filingStatus: 'current',
      nextFilingDue: '2024-09-20',
      annualReportStatus: 'filed',
      taxId: '12-3456789',
      subsidiaries: 2,
      complianceScore: 88,
      riskLevel: 'low',
      aiInsights: ['Partnership agreement renewal due', 'Consider tax optimization', 'Strong performance metrics'],
      estimatedValue: 25000000,
      assignedCounsel: 'David Wilson',
      lastAudit: '2023-11-30'
    },
    {
      id: '4',
      name: 'Global Services Europe Ltd',
      type: 'subsidiary',
      status: 'active',
      jurisdiction: 'United Kingdom',
      incorporationDate: '2019-11-05',
      entityNumber: 'UK987654321',
      registeredAgent: 'UK Corporate Services',
      businessAddress: '42 London Bridge Street, London, UK SE1 9BL',
      filingStatus: 'current',
      nextFilingDue: '2024-11-05',
      annualReportStatus: 'filed',
      taxId: 'GB123456789',
      parentEntity: 'TechCorp Industries Inc.',
      subsidiaries: 0,
      complianceScore: 91,
      riskLevel: 'low',
      aiInsights: ['International compliance maintained', 'Brexit implications reviewed', 'Strong local operations'],
      estimatedValue: 8000000,
      assignedCounsel: 'Lisa Rodriguez',
      lastAudit: '2023-10-15'
    },
    {
      id: '5',
      name: 'Startup Ventures JV',
      type: 'joint-venture',
      status: 'pending',
      jurisdiction: 'Texas',
      incorporationDate: '2024-01-10',
      entityNumber: 'TX2024001',
      registeredAgent: 'Texas Business Formations',
      businessAddress: '500 Innovation Blvd, Austin, TX 78759',
      filingStatus: 'pending',
      nextFilingDue: '2024-07-10',
      annualReportStatus: 'due',
      taxId: 'PENDING',
      subsidiaries: 0,
      complianceScore: 65,
      riskLevel: 'medium',
      aiInsights: ['New entity setup in progress', 'Documentation review needed', 'Joint venture agreement pending'],
      estimatedValue: 5000000,
      assignedCounsel: 'Robert Miller',
      lastAudit: 'N/A'
    }
  ]

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter
    const matchesType = typeFilter === 'all' || entity.type === typeFilter
    const matchesJurisdiction = jurisdictionFilter === 'all' || entity.jurisdiction === jurisdictionFilter
    return matchesSearch && matchesStatus && matchesType && matchesJurisdiction
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

  const getStatusIcon = (status: Entity['status']) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const getFilingStatusIcon = (status: Entity['filingStatus']) => {
    const IconComponent = filingStatusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const totalEntities = entities.length
  const activeEntities = entities.filter(e => e.status === 'active').length
  const overdueFilings = entities.filter(e => e.filingStatus === 'overdue').length
  const totalValue = entities.reduce((sum, entity) => sum + entity.estimatedValue, 0)

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
              Entity Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Manage corporate entities, compliance, and governance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>New Entity</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Entities</p>
                <p className="text-3xl font-bold text-teal-800">{totalEntities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-teal-600 font-medium">Across all jurisdictions</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Active Entities</p>
                <p className="text-3xl font-bold text-teal-800">{activeEntities}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-teal-500 ml-1">this quarter</span>
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
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-teal-500 ml-1">this year</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Overdue Filings</p>
                <p className="text-3xl font-bold text-teal-800">{overdueFilings}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Immediate attention</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
              <input
                type="text"
                placeholder="Search entities, types, or jurisdictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="dissolved">Dissolved</option>
              </select>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="corporation">Corporation</option>
                <option value="llc">LLC</option>
                <option value="partnership">Partnership</option>
                <option value="subsidiary">Subsidiary</option>
                <option value="branch">Branch</option>
                <option value="joint-venture">Joint Venture</option>
              </select>

              <select
                value={jurisdictionFilter}
                onChange={(e) => setJurisdictionFilter(e.target.value)}
                className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Jurisdictions</option>
                <option value="Delaware">Delaware</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Texas">Texas</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Entities Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {filteredEntities.map((entity, index) => (
            <motion.div
              key={entity.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEntity(entity)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-teal-800 mb-1">{entity.name}</h3>
                  <p className="text-sm text-teal-600 mb-2">{entity.jurisdiction}</p>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={statusConfig[entity.status].color}
                    >
                      {entity.status.toUpperCase()}
                    </Badge>
                    <Badge 
                      variant={filingStatusConfig[entity.filingStatus].color}
                    >
                      {entity.filingStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${
                    entity.type === 'corporation' ? 'from-blue-500 to-blue-600' :
                    entity.type === 'llc' ? 'from-purple-500 to-purple-600' :
                    entity.type === 'partnership' ? 'from-green-500 to-green-600' :
                    entity.type === 'subsidiary' ? 'from-orange-500 to-orange-600' :
                    'from-gray-500 to-gray-600'
                  }`}>
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Type</span>
                  <span className="text-sm font-medium text-teal-800 capitalize">{entity.type.replace('-', ' ')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Entity Number</span>
                  <span className="text-sm font-medium text-teal-800">{entity.entityNumber}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Compliance Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-teal-100 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          entity.complianceScore >= 90 ? 'bg-green-500' :
                          entity.complianceScore >= 75 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${entity.complianceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-teal-800">{entity.complianceScore}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Estimated Value</span>
                  <span className="text-sm font-bold text-teal-800">{formatCurrency(entity.estimatedValue)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-600">Next Filing</span>
                  <span className={`text-sm font-medium ${
                    entity.filingStatus === 'overdue' ? 'text-red-600' : 'text-teal-800'
                  }`}>
                    {new Date(entity.nextFilingDue).toLocaleDateString()}
                  </span>
                </div>

                {entity.riskLevel !== 'low' && (
                  <div className="flex items-center space-x-2 mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700 font-medium">
                      {entity.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                )}

                {entity.aiInsights.length > 0 && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-semibold text-teal-700">AI Insights</span>
                    </div>
                    <ul className="space-y-1">
                      {entity.aiInsights.slice(0, 2).map((insight, idx) => (
                        <li key={idx} className="text-xs text-teal-600 flex items-start">
                          <span className="w-1 h-1 bg-teal-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

      {/* Entity Detail Modal */}
      {selectedEntity && (
        <Modal
          isOpen={!!selectedEntity}
          onClose={() => setSelectedEntity(null)}
          title={selectedEntity.name}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Type</label>
                <p className="text-teal-800 font-semibold capitalize">{selectedEntity.type.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Status</label>
                <Badge variant={statusConfig[selectedEntity.status].color}>
                  {selectedEntity.status.charAt(0).toUpperCase() + selectedEntity.status.slice(1)}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Jurisdiction</label>
                <p className="text-teal-800">{selectedEntity.jurisdiction}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Entity Number</label>
                <p className="text-teal-800">{selectedEntity.entityNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Incorporation Date</label>
                <p className="text-teal-800">{formatDate(selectedEntity.incorporationDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Tax ID</label>
                <p className="text-teal-800">{selectedEntity.taxId}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-1">Business Address</label>
              <p className="text-teal-800">{selectedEntity.businessAddress}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-1">Registered Agent</label>
              <p className="text-teal-800">{selectedEntity.registeredAgent}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Compliance Score</label>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-teal-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        selectedEntity.complianceScore >= 90 ? 'bg-green-500' :
                        selectedEntity.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedEntity.complianceScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-teal-800">{selectedEntity.complianceScore}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Risk Level</label>
                <Badge variant={riskConfig[selectedEntity.riskLevel].color}>
                  {selectedEntity.riskLevel.charAt(0).toUpperCase() + selectedEntity.riskLevel.slice(1)}
                </Badge>
              </div>
            </div>

            {selectedEntity.aiInsights.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-2">AI Insights</label>
                <div className="space-y-2">
                  {selectedEntity.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                      <Brain className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-teal-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <motion.button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit Entity
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Report
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                File Documents
              </motion.button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Entity Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Entity"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Entity Name</label>
                <input 
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter entity name" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Type</label>
                <select className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200">
                  <option value="corporation">Corporation</option>
                  <option value="llc">LLC</option>
                  <option value="partnership">Partnership</option>
                  <option value="subsidiary">Subsidiary</option>
                  <option value="branch">Branch</option>
                  <option value="joint-venture">Joint Venture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Jurisdiction</label>
                <input 
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter jurisdiction" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-600 mb-1">Estimated Value</label>
                <input 
                  type="number"
                  className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="0" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-teal-600 mb-1">Business Address</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-900 placeholder-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 h-20 resize-none"
                placeholder="Enter business address..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Entity
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
