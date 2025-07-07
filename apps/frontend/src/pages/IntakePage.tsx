import React, { useState } from 'react'
import { Plus, Search, Filter, UserCheck, Calendar, DollarSign, User, MoreVertical, Brain, AlertTriangle, TrendingUp, Clock, Download, Eye, Edit, Trash2, Upload, BarChart3, Zap, Bell, CheckCircle, XCircle, AlertCircle, Activity, Target, FileText, Users, Building2, Globe, ArrowRight, MessageSquare, Send, Phone, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

interface IntakeRequest {
  id: string
  title: string
  type: 'contract-review' | 'legal-advice' | 'litigation-support' | 'compliance-query' | 'ip-protection' | 'employment-issue' | 'other'
  status: 'new' | 'triaged' | 'assigned' | 'in-progress' | 'completed' | 'on-hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requestor: {
    name: string
    email: string
    department: string
    title: string
    phone?: string
  }
  description: string
  urgency: 'immediate' | 'within-week' | 'within-month' | 'flexible'
  estimatedValue: number
  submittedDate: string
  dueDate: string
  assignedTo?: string
  estimatedHours: number
  tags: string[]
  attachments: string[]
  aiTriage: {
    suggestedType: string
    confidence: number
    recommendedAssignee: string
    estimatedComplexity: 'low' | 'medium' | 'high'
    riskLevel: 'low' | 'medium' | 'high'
    insights: string[]
  }
  communications: {
    date: string
    type: 'email' | 'phone' | 'meeting' | 'note'
    content: string
    author: string
  }[]
}

interface RequestTemplate {
  id: string
  name: string
  type: string
  description: string
  fields: {
    name: string
    type: 'text' | 'textarea' | 'select' | 'date' | 'number'
    required: boolean
    options?: string[]
  }[]
  estimatedTime: string
  icon: any
}

export function IntakePage() {
  const [requests] = useState<IntakeRequest[]>([
    {
      id: '1',
      title: 'Software License Agreement Review',
      type: 'contract-review',
      status: 'assigned',
      priority: 'high',
      requestor: {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@company.com',
        department: 'IT',
        title: 'IT Director',
        phone: '+1-555-0123'
      },
      description: 'Need urgent review of enterprise software license agreement with vendor. Contract value $500K, covers 2000 users, 3-year term.',
      urgency: 'within-week',
      estimatedValue: 500000,
      submittedDate: '2024-01-20',
      dueDate: '2024-01-27',
      assignedTo: 'Michael Chen',
      estimatedHours: 8,
      tags: ['contract', 'software', 'enterprise', 'urgent'],
      attachments: ['license-agreement-draft.pdf', 'vendor-terms.docx'],
      aiTriage: {
        suggestedType: 'contract-review',
        confidence: 95,
        recommendedAssignee: 'Michael Chen',
        estimatedComplexity: 'medium',
        riskLevel: 'medium',
        insights: ['Standard enterprise license terms', 'Review liability limitations', 'Check termination clauses']
      },
      communications: [
        {
          date: '2024-01-20',
          type: 'email',
          content: 'Request submitted via intake form',
          author: 'System'
        },
        {
          date: '2024-01-21',
          type: 'email',
          content: 'Assigned to Michael Chen for review',
          author: 'Legal Department'
        }
      ]
    },
    {
      id: '2',
      title: 'Employment Policy Updates',
      type: 'legal-advice',
      status: 'new',
      priority: 'medium',
      requestor: {
        name: 'David Wilson',
        email: 'david.wilson@company.com',
        department: 'HR',
        title: 'HR Manager'
      },
      description: 'Need guidance on updating employee handbook to comply with new state regulations. Covers remote work policies and leave entitlements.',
      urgency: 'within-month',
      estimatedValue: 0,
      submittedDate: '2024-01-22',
      dueDate: '2024-02-22',
      estimatedHours: 12,
      tags: ['employment', 'compliance', 'policy', 'hr'],
      attachments: ['current-handbook.pdf', 'state-regulations.pdf'],
      aiTriage: {
        suggestedType: 'legal-advice',
        confidence: 88,
        recommendedAssignee: 'Emma Davis',
        estimatedComplexity: 'medium',
        riskLevel: 'low',
        insights: ['Employment law expertise required', 'Multi-state compliance needed', 'Policy template available']
      },
      communications: [
        {
          date: '2024-01-22',
          type: 'email',
          content: 'Initial request submitted',
          author: 'System'
        }
      ]
    },
    {
      id: '3',
      title: 'Patent Application Support',
      type: 'ip-protection',
      status: 'in-progress',
      priority: 'high',
      requestor: {
        name: 'Lisa Thompson',
        email: 'lisa.thompson@company.com',
        department: 'R&D',
        title: 'Research Director',
        phone: '+1-555-0456'
      },
      description: 'Support needed for filing patent application for new AI algorithm. International filing strategy required.',
      urgency: 'immediate',
      estimatedValue: 2000000,
      submittedDate: '2024-01-18',
      dueDate: '2024-02-18',
      assignedTo: 'Sarah Johnson',
      estimatedHours: 25,
      tags: ['patent', 'ip', 'ai', 'international'],
      attachments: ['invention-disclosure.pdf', 'technical-drawings.zip', 'prior-art-search.pdf'],
      aiTriage: {
        suggestedType: 'ip-protection',
        confidence: 92,
        recommendedAssignee: 'Sarah Johnson',
        estimatedComplexity: 'high',
        riskLevel: 'medium',
        insights: ['Complex technical subject matter', 'International filing strategy needed', 'High commercial value']
      },
      communications: [
        {
          date: '2024-01-18',
          type: 'meeting',
          content: 'Initial consultation with R&D team',
          author: 'Sarah Johnson'
        },
        {
          date: '2024-01-19',
          type: 'email',
          content: 'Requested additional technical documentation',
          author: 'Sarah Johnson'
        }
      ]
    },
    {
      id: '4',
      title: 'Vendor Contract Dispute',
      type: 'litigation-support',
      status: 'triaged',
      priority: 'urgent',
      requestor: {
        name: 'James Anderson',
        email: 'james.anderson@company.com',
        department: 'Procurement',
        title: 'Procurement Manager'
      },
      description: 'Vendor threatening litigation over contract termination. Need immediate legal support for dispute resolution.',
      urgency: 'immediate',
      estimatedValue: 150000,
      submittedDate: '2024-01-23',
      dueDate: '2024-01-25',
      estimatedHours: 15,
      tags: ['dispute', 'contract', 'vendor', 'urgent'],
      attachments: ['contract.pdf', 'termination-notice.pdf', 'vendor-response.pdf'],
      aiTriage: {
        suggestedType: 'litigation-support',
        confidence: 90,
        recommendedAssignee: 'David Wilson',
        estimatedComplexity: 'high',
        riskLevel: 'high',
        insights: ['Urgent response required', 'Potential litigation risk', 'Contract termination clause review needed']
      },
      communications: [
        {
          date: '2024-01-23',
          type: 'phone',
          content: 'Urgent call received from procurement',
          author: 'Legal Department'
        }
      ]
    },
    {
      id: '5',
      title: 'Data Privacy Compliance Audit',
      type: 'compliance-query',
      status: 'assigned',
      priority: 'medium',
      requestor: {
        name: 'Emma Davis',
        email: 'emma.davis@company.com',
        department: 'Compliance',
        title: 'Compliance Officer'
      },
      description: 'Annual GDPR compliance audit preparation. Need legal guidance on new data processing activities.',
      urgency: 'within-month',
      estimatedValue: 0,
      submittedDate: '2024-01-15',
      dueDate: '2024-02-15',
      assignedTo: 'Michael Chen',
      estimatedHours: 20,
      tags: ['gdpr', 'compliance', 'audit', 'privacy'],
      attachments: ['data-mapping.xlsx', 'processing-activities.pdf'],
      aiTriage: {
        suggestedType: 'compliance-query',
        confidence: 85,
        recommendedAssignee: 'Michael Chen',
        estimatedComplexity: 'medium',
        riskLevel: 'low',
        insights: ['GDPR expertise required', 'Regular compliance review', 'Documentation updates needed']
      },
      communications: [
        {
          date: '2024-01-15',
          type: 'email',
          content: 'Compliance audit request submitted',
          author: 'System'
        },
        {
          date: '2024-01-16',
          type: 'meeting',
          content: 'Initial scoping meeting scheduled',
          author: 'Michael Chen'
        }
      ]
    }
  ])

  const [templates] = useState<RequestTemplate[]>([
    {
      id: '1',
      name: 'Contract Review',
      type: 'contract-review',
      description: 'Review and analysis of contracts, agreements, and terms',
      fields: [
        { name: 'Contract Type', type: 'select', required: true, options: ['Service Agreement', 'License Agreement', 'NDA', 'Employment Contract', 'Other'] },
        { name: 'Contract Value', type: 'number', required: true },
        { name: 'Counterparty', type: 'text', required: true },
        { name: 'Key Concerns', type: 'textarea', required: false }
      ],
      estimatedTime: '3-5 business days',
      icon: FileText
    },
    {
      id: '2',
      name: 'Legal Advice',
      type: 'legal-advice',
      description: 'General legal consultation and guidance',
      fields: [
        { name: 'Topic Area', type: 'select', required: true, options: ['Employment', 'Corporate', 'IP', 'Compliance', 'Other'] },
        { name: 'Background', type: 'textarea', required: true },
        { name: 'Specific Questions', type: 'textarea', required: true }
      ],
      estimatedTime: '1-3 business days',
      icon: MessageSquare
    },
    {
      id: '3',
      name: 'IP Protection',
      type: 'ip-protection',
      description: 'Patent, trademark, and IP protection services',
      fields: [
        { name: 'IP Type', type: 'select', required: true, options: ['Patent', 'Trademark', 'Copyright', 'Trade Secret'] },
        { name: 'Invention/Mark Description', type: 'textarea', required: true },
        { name: 'Commercial Value', type: 'number', required: false },
        { name: 'Filing Jurisdictions', type: 'text', required: true }
      ],
      estimatedTime: '2-4 weeks',
      icon: Target
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [activeTab, setActiveTab] = useState<'requests' | 'templates' | 'analytics'>('requests')

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus
    const matchesType = filterType === 'all' || request.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Intake Analytics
  const totalRequests = requests.length
  const newRequests = requests.filter(r => r.status === 'new').length
  const urgentRequests = requests.filter(r => r.priority === 'urgent').length
  const avgResponseTime = '2.5 hours'
  const completionRate = Math.round((requests.filter(r => r.status === 'completed').length / totalRequests) * 100)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract-review': return FileText
      case 'legal-advice': return MessageSquare
      case 'litigation-support': return Target
      case 'compliance-query': return CheckCircle
      case 'ip-protection': return Target
      case 'employment-issue': return Users
      case 'other': return AlertCircle
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract-review': return 'from-blue-500 to-blue-600'
      case 'legal-advice': return 'from-green-500 to-green-600'
      case 'litigation-support': return 'from-red-500 to-red-600'
      case 'compliance-query': return 'from-purple-500 to-purple-600'
      case 'ip-protection': return 'from-orange-500 to-orange-600'
      case 'employment-issue': return 'from-teal-500 to-teal-600'
      case 'other': return 'from-gray-500 to-gray-600'
      default: return 'from-counsel-500 to-counsel-600'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-700 border-red-200'
      case 'within-week': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'within-month': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'flexible': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-legal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-counsel-700 to-legal-600 bg-clip-text text-transparent">
              Legal Intake & Request Management
            </h1>
            <p className="text-counsel-600 mt-2 text-lg font-medium">
              AI-powered request routing, intake automation, and task assignment
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button 
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-counsel-200 rounded-xl text-counsel-700 font-semibold hover:bg-counsel-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Import</span>
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-counsel-600 to-legal-600 text-white font-semibold rounded-xl shadow-lg hover:from-counsel-700 hover:to-legal-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Total Requests</p>
                <p className="text-3xl font-bold text-counsel-800">{totalRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-counsel-500 to-counsel-600 rounded-xl">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-counsel-500 ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">New Requests</p>
                <p className="text-3xl font-bold text-counsel-800">{newRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Awaiting triage</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Urgent</p>
                <p className="text-3xl font-bold text-counsel-800">{urgentRequests}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Immediate attention</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Avg Response</p>
                <p className="text-3xl font-bold text-counsel-800">{avgResponseTime}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-blue-600 font-medium">Response time</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-counsel-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-counsel-600">Completion</p>
                <p className="text-3xl font-bold text-counsel-800">{completionRate}%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">Success rate</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-xl p-1 mb-6 border border-counsel-200/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[
            { id: 'requests', label: 'Active Requests', icon: UserCheck },
            { id: 'templates', label: 'Request Templates', icon: FileText },
            { id: 'analytics', label: 'Intake Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-counsel-600 to-legal-600 text-white shadow-lg'
                    : 'text-counsel-600 hover:bg-counsel-50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Search and Filters - Only for requests tab */}
        {activeTab === 'requests' && (
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-counsel-400" />
                <input
                  type="text"
                  placeholder="Search requests, requestors, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-counsel-200 rounded-xl focus:border-counsel-500 focus:ring-0 outline-none transition-colors duration-200 bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border-2 border-counsel-200 rounded-xl px-4 py-3 focus:border-counsel-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-counsel-700 font-medium"
              >
                <option value="all">All Types</option>
                <option value="contract-review">Contract Review</option>
                <option value="legal-advice">Legal Advice</option>
                <option value="litigation-support">Litigation Support</option>
                <option value="compliance-query">Compliance Query</option>
                <option value="ip-protection">IP Protection</option>
                <option value="employment-issue">Employment Issue</option>
                <option value="other">Other</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border-2 border-counsel-200 rounded-xl px-4 py-3 focus:border-counsel-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-counsel-700 font-medium"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="triaged">Triaged</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
              
              <motion.button 
                className="p-3 bg-counsel-600 text-white rounded-xl hover:bg-counsel-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => {
            const TypeIcon = getTypeIcon(request.type)
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                whileHover={{ y: -5 }}
              >
                {/* Request Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(request.type)}`}>
                        <TypeIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-counsel-800 text-lg leading-tight group-hover:text-counsel-700 transition-colors">
                          {request.title}
                        </h3>
                        <p className="text-sm text-counsel-600 font-medium capitalize">{request.type.replace('-', ' ')}</p>
                        <p className="text-xs text-counsel-500">ID: {request.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* AI Confidence Indicator */}
                      <div className={`w-3 h-3 rounded-full ${
                        request.aiTriage.confidence >= 90 ? 'bg-green-500' :
                        request.aiTriage.confidence >= 75 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`} />
                      
                      <motion.button 
                        className="p-2 text-counsel-400 hover:text-counsel-600 hover:bg-counsel-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Status and Priority */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      request.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                      request.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      request.status === 'assigned' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      request.status === 'triaged' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                      request.status === 'new' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {request.status.replace('-', ' ').toUpperCase()}
                    </span>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                      request.priority === 'urgent' ? 'bg-red-50 text-red-600' :
                      request.priority === 'high' ? 'bg-orange-50 text-orange-600' :
                      request.priority === 'medium' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>
                      {request.priority.toUpperCase()}
                    </span>
                  </div>

                  {/* Urgency Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-counsel-600 mb-4 line-clamp-2 leading-relaxed">
                    {request.description}
                  </p>
                </div>

                {/* Requestor Details */}
                <div className="px-6 py-4 bg-gradient-to-br from-legal-50/50 to-counsel-50/30 border-t border-counsel-100">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-counsel-600 font-medium">Requestor:</span>
                      <span className="font-bold text-counsel-800 text-xs">{request.requestor.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-counsel-600 font-medium">Department:</span>
                      <span className="font-medium text-counsel-800 text-xs">{request.requestor.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-counsel-600 font-medium">Due Date:</span>
                      <span className="font-bold text-counsel-800 text-xs">{new Date(request.dueDate).toLocaleDateString()}</span>
                    </div>
                    {request.assignedTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-counsel-600 font-medium">Assigned:</span>
                        <span className="font-bold text-counsel-800 text-xs">{request.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Triage */}
                <div className="px-6 py-4 bg-gradient-to-r from-counsel-50 to-legal-50 border-t border-counsel-100">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-counsel-600 mr-2" />
                    <span className="text-sm font-bold text-counsel-700">AI Triage</span>
                    <span className="text-xs text-counsel-500 ml-2">({request.aiTriage.confidence}% confidence)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                      <p className="text-counsel-500 font-medium">Complexity</p>
                      <p className={`font-bold capitalize ${
                        request.aiTriage.estimatedComplexity === 'high' ? 'text-red-600' :
                        request.aiTriage.estimatedComplexity === 'medium' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {request.aiTriage.estimatedComplexity}
                      </p>
                    </div>
                    <div>
                      <p className="text-counsel-500 font-medium">Est. Hours</p>
                      <p className="font-bold text-counsel-800">{request.estimatedHours}h</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {request.aiTriage.insights.slice(0, 2).map((insight, idx) => (
                      <p key={idx} className="text-xs text-counsel-600 leading-relaxed">
                        • {insight}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-counsel-100 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <motion.button 
                        className="p-2 text-counsel-600 hover:bg-counsel-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 text-counsel-600 hover:bg-counsel-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </motion.button>
                      <motion.button 
                        className="p-2 text-counsel-600 hover:bg-counsel-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <motion.button 
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-counsel-600 to-legal-600 text-white text-xs font-semibold rounded-lg hover:from-counsel-700 hover:to-legal-700 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="h-3 w-3" />
                      <span>Auto-Assign</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => {
            const TemplateIcon = template.icon
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${getTypeColor(template.type)}`}>
                    <TemplateIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-counsel-800 mb-2">{template.name}</h3>
                    <p className="text-sm text-counsel-600 mb-3">{template.description}</p>
                    <div className="flex items-center text-xs text-counsel-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Est. time: {template.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-counsel-700">Required Fields:</p>
                  {template.fields.slice(0, 3).map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-counsel-600">{field.name}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        field.required ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  ))}
                  {template.fields.length > 3 && (
                    <p className="text-xs text-counsel-500">+{template.fields.length - 3} more fields</p>
                  )}
                </div>
                
                <motion.button 
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-counsel-600 to-legal-600 text-white font-semibold rounded-xl hover:from-counsel-700 hover:to-legal-700 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Use Template</span>
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-counsel-800 mb-4">Request Types Distribution</h3>
            <div className="space-y-3">
              {['contract-review', 'legal-advice', 'ip-protection', 'compliance-query', 'litigation-support'].map((type, index) => {
                const count = requests.filter(r => r.type === type).length
                const percentage = Math.round((count / totalRequests) * 100)
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-counsel-700 capitalize">{type.replace('-', ' ')}</span>
                      <span className="font-bold text-counsel-800">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-counsel-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getTypeColor(type)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl border border-counsel-200/50 shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-counsel-800 mb-4">Response Time Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="font-medium text-green-700">Avg Response Time</span>
                <span className="font-bold text-green-800">2.5 hours</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="font-medium text-blue-700">SLA Compliance</span>
                <span className="font-bold text-blue-800">95.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <span className="font-medium text-orange-700">Escalated Requests</span>
                <span className="font-bold text-orange-800">3.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <span className="font-medium text-purple-700">Auto-Triaged</span>
                <span className="font-bold text-purple-800">78%</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'requests' && filteredRequests.length === 0) ||
        (activeTab === 'templates' && templates.length === 0)) && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-counsel-200/50 shadow-lg max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-counsel-100 to-legal-100 rounded-2xl w-fit mx-auto mb-6">
              <UserCheck className="h-12 w-12 text-counsel-600" />
            </div>
            <h3 className="text-xl font-bold text-counsel-800 mb-3">No {activeTab} found</h3>
            <p className="text-counsel-600 mb-6 leading-relaxed">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : `Start managing your legal ${activeTab} with AI-powered automation and routing.`}
            </p>
            <motion.button 
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-counsel-600 to-legal-600 text-white font-semibold rounded-xl shadow-lg hover:from-counsel-700 hover:to-legal-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>Create {activeTab === 'requests' ? 'Request' : 'Template'}</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}