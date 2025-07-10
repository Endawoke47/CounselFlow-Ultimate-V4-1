import React, { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, Brain, Search, Plus, Filter, BarChart3, TrendingUp, DollarSign, Calendar, Users, FileText, Eye, Edit, Trash2, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface ComplianceItem {
  id: string
  title: string
  category: 'regulatory' | 'internal' | 'data-protection' | 'industry-specific' | 'contractual'
  status: 'compliant' | 'at-risk' | 'non-compliant' | 'under-review'
  priority: 'low' | 'medium' | 'high' | 'critical'
  lastAssessment: string
  nextReview: string
  assignedTo: string
  description: string
  riskScore: number
  aiInsights: string[]
  requirements: string[]
  actions: string[]
  framework: string
  jurisdiction: string
}

export function CompliancePage() {
  const [complianceItems] = useState<ComplianceItem[]>([
    {
      id: 'PLC-010',
      title: 'Anti-Bribery & Corruption Policy - SaharaMinerals',
      category: 'regulatory',
      status: 'compliant',
      priority: 'high',
      lastAssessment: '2024-08-01',
      nextReview: '2025-08-01',
      assignedTo: 'Amara Touré',
      description: 'Anti-Bribery & Corruption Policy for Algeria mining operations in compliance with local and international standards',
      riskScore: 25,
      aiInsights: ['Policy aligns with OECD guidelines', 'Training completion at 95%', 'Regular audits scheduled'],
      requirements: ['OECD Anti-Bribery Convention', 'Algeria Business Code', 'Due Diligence Procedures'],
      actions: ['Annual policy review', 'Enhanced vendor screening'],
      framework: 'OECD Anti-Bribery',
      jurisdiction: 'Algeria'
    },
    {
      id: 'PLC-011',
      title: 'NDPR Data Breach Notification Protocol - NaijaCredit',
      category: 'data-protection',
      status: 'compliant',
      priority: 'critical',
      lastAssessment: '2025-01-15',
      nextReview: '2025-07-15',
      assignedTo: 'Ifeoma Ajayi',
      description: 'Nigeria Data Protection Regulation breach notification protocol and response procedures',
      riskScore: 15,
      aiInsights: ['Notification procedures well-documented', 'Response timeline compliant', 'Regular testing conducted'],
      requirements: ['72-hour notification', 'NITDA compliance', 'Data subject notification'],
      actions: ['Quarterly breach simulation', 'Update notification templates'],
      framework: 'NDPR',
      jurisdiction: 'Nigeria'
    },
    {
      id: 'PLC-012',
      title: 'IP Licensing Policy - AgriGrowth Morocco',
      category: 'internal',
      status: 'under-review',
      priority: 'medium',
      lastAssessment: '2024-09-12',
      nextReview: '2025-03-12',
      assignedTo: 'Rachid Belhaj',
      description: 'Intellectual Property licensing policy framework for agricultural technology in Morocco',
      riskScore: 45,
      aiInsights: ['Draft requires legal review', 'Licensing terms need clarification', 'Territorial restrictions undefined'],
      requirements: ['OMPIC registration', 'Licensing framework', 'Territory definitions'],
      actions: ['Complete legal review', 'Define territorial scope'],
      framework: 'IP Law Morocco',
      jurisdiction: 'Morocco'
    },
    {
      id: 'PLC-013',
      title: 'B-BBEE Preferential Procurement Policy - BuildAfrica SA',
      category: 'regulatory',
      status: 'compliant',
      priority: 'high',
      lastAssessment: '2023-11-01',
      nextReview: '2024-11-01',
      assignedTo: 'Thabo Mthembu',
      description: 'Broad-Based Black Economic Empowerment preferential procurement policy compliance',
      riskScore: 20,
      aiInsights: ['B-BBEE level 4 certification maintained', 'Procurement targets exceeded', 'Regular verification audits passed'],
      requirements: ['B-BBEE Certification', 'Procurement Targets', 'Verification Audits'],
      actions: ['Annual verification audit', 'Update procurement guidelines'],
      framework: 'B-BBEE Act',
      jurisdiction: 'South Africa'
    },
    {
      id: 'PLC-014',
      title: 'Cross-border Data Sharing Policy - MobiPay Egypt',
      category: 'data-protection',
      status: 'under-review',
      priority: 'critical',
      lastAssessment: '2024-06-10',
      nextReview: '2025-06-10',
      assignedTo: 'Ahmed El-Rashid',
      description: 'Cross-border data sharing policy for mobile payment operations in compliance with Egyptian data protection laws',
      riskScore: 65,
      aiInsights: ['Central bank regulations changing', 'Cross-border transfer limits unclear', 'Consent mechanisms need update'],
      requirements: ['CBE approval', 'Data localization compliance', 'Transfer agreements'],
      actions: ['Obtain CBE clarification', 'Update transfer agreements'],
      framework: 'Egypt Data Protection Law',
      jurisdiction: 'Egypt'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Analytics
  const totalItems = complianceItems.length
  const compliantItems = complianceItems.filter(item => item.status === 'compliant').length
  const atRiskItems = complianceItems.filter(item => item.status === 'at-risk').length
  const nonCompliantItems = complianceItems.filter(item => item.status === 'non-compliant').length
  const avgRiskScore = Math.round(complianceItems.reduce((sum, item) => sum + item.riskScore, 0) / totalItems)
  const criticalItems = complianceItems.filter(item => item.priority === 'critical').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'from-green-500 to-green-600'
      case 'at-risk': return 'from-orange-500 to-orange-600'
      case 'non-compliant': return 'from-red-500 to-red-600'
      case 'under-review': return 'from-blue-500 to-blue-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle
      case 'at-risk': return AlertTriangle
      case 'non-compliant': return AlertTriangle
      case 'under-review': return Clock
      default: return Shield
    }
  }

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
              Risk & Compliance Management
            </h1>
            <p className="text-teal-600 mt-2 text-lg font-medium">
              Comprehensive compliance monitoring and risk assessment dashboard
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
            >
              <Plus className="h-4 w-4" />
              <span>New Assessment</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Total Items</p>
                <p className="text-3xl font-bold text-teal-800">{totalItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-teal-600 font-medium">Active monitoring</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Compliant</p>
                <p className="text-3xl font-bold text-green-600">{compliantItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{Math.round((compliantItems/totalItems)*100)}%</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">At Risk</p>
                <p className="text-3xl font-bold text-orange-600">{atRiskItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600 font-medium">Need attention</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Non-Compliant</p>
                <p className="text-3xl font-bold text-red-600">{nonCompliantItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600 font-medium">Immediate action</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Avg Risk Score</p>
                <p className="text-3xl font-bold text-teal-800">{avgRiskScore}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium">Out of 100</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600">Critical</p>
                <p className="text-3xl font-bold text-red-700">{criticalItems}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-700 font-medium">Urgent review</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-400" />
              <input
                type="text"
                placeholder="Search compliance items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-0 outline-none transition-colors duration-200 bg-white/70 backdrop-blur-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border-2 border-teal-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-teal-700 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="regulatory">Regulatory</option>
              <option value="internal">Internal Policy</option>
              <option value="data-protection">Data Protection</option>
              <option value="industry-specific">Industry-Specific</option>
              <option value="contractual">Contractual</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-teal-200 rounded-xl px-4 py-3 focus:border-teal-500 focus:ring-0 outline-none bg-white/70 backdrop-blur-sm text-teal-700 font-medium"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="at-risk">At Risk</option>
              <option value="non-compliant">Non-Compliant</option>
              <option value="under-review">Under Review</option>
            </select>
            
            <motion.button 
              className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Compliance Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item, index) => {
          const StatusIcon = getStatusIcon(item.status)
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Item Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getStatusColor(item.status)}`}>
                      <StatusIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-teal-800 text-lg leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-teal-600 font-medium capitalize">{item.category.replace('-', ' ')}</p>
                      <p className="text-xs text-teal-500 font-mono">{item.framework}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      item.riskScore <= 25 ? 'bg-green-100 text-green-700' :
                      item.riskScore <= 50 ? 'bg-yellow-100 text-yellow-700' :
                      item.riskScore <= 75 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Risk: {item.riskScore}
                    </div>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'compliant' ? 'bg-green-100 text-green-700 border border-green-200' :
                    item.status === 'at-risk' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                    item.status === 'non-compliant' ? 'bg-red-100 text-red-700 border border-red-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {item.status.replace('-', ' ').toUpperCase()}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                    item.priority === 'critical' ? 'bg-red-50 text-red-700' :
                    item.priority === 'high' ? 'bg-orange-50 text-orange-600' :
                    item.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-teal-600 mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Compliance Details */}
              <div className="px-6 py-4 bg-gradient-to-br from-cyan-50/50 to-teal-50/30 border-t border-teal-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600 font-medium">Last Assessment:</span>
                      <span className="font-medium text-teal-800 text-xs">
                        {new Date(item.lastAssessment).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600 font-medium">Assigned:</span>
                      <span className="font-medium text-teal-800">{item.assignedTo}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600 font-medium">Next Review:</span>
                      <span className="font-medium text-teal-800 text-xs">
                        {new Date(item.nextReview).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-teal-600 font-medium">Jurisdiction:</span>
                      <span className="font-medium text-teal-800">{item.jurisdiction}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              {item.aiInsights && item.aiInsights.length > 0 && (
                <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-t border-teal-100">
                  <div className="flex items-center mb-2">
                    <Brain className="h-4 w-4 text-teal-600 mr-2" />
                    <span className="text-sm font-bold text-teal-700">AI Analysis</span>
                  </div>
                  <div className="space-y-1">
                    {item.aiInsights.map((insight, idx) => (
                      <p key={idx} className="text-xs text-teal-600 leading-relaxed">
                        • {insight}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-6 py-4 border-t border-teal-100 bg-white/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.button 
                      className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <motion.button 
                      className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button 
                      className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FileText className="h-4 w-4" />
                    </motion.button>
                  </div>
                  
                  <motion.button 
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Zap className="h-3 w-3" />
                    <span>AI Review</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-teal-200/50 shadow-lg max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl w-fit mx-auto mb-6">
              <Shield className="h-12 w-12 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-teal-800 mb-3">No compliance items found</h3>
            <p className="text-teal-600 mb-6 leading-relaxed">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Start building your compliance framework with AI-powered monitoring and assessment.'}
            </p>
            <motion.button 
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Assessment</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
