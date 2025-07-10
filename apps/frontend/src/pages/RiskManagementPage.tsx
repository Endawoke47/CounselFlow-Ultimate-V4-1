import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Archive,
  ChevronRight,
  BarChart3,
  PieChart,
  Target,
  Briefcase,
  DollarSign,
  Users,
  Building
} from 'lucide-react'

interface Risk {
  id: string
  title: string
  description: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  probability: 'Low' | 'Medium' | 'High'
  category: 'Financial' | 'Legal' | 'Operational' | 'Regulatory' | 'Reputational'
  status: 'Open' | 'Monitoring' | 'Mitigated' | 'Closed'
  assignedTo: string
  dueDate: string
  lastUpdated: string
  impact: string
  mitigation: string
  associatedMatter?: string
  financialImpact?: number
}

interface RiskMetric {
  title: string
  value: string | number
  change: number
  icon: any
  color: string
}

export function RiskManagementPage() {
  console.log('RiskManagementPage component rendered!')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for African legal practice risks
  const risks: Risk[] = [
    {
      id: '1',
      title: 'Currency Fluctuation Risk - Nigerian Operations',
      description: 'Exposure to NGN/USD exchange rate volatility affecting cross-border transactions',
      severity: 'High',
      probability: 'High',
      category: 'Financial',
      status: 'Open',
      assignedTo: 'Adaora Okeke',
      dueDate: '2025-08-15',
      lastUpdated: '2025-07-08',
      impact: 'Potential 15-20% variance in transaction values',
      mitigation: 'Implement currency hedging strategies and shorter payment terms',
      associatedMatter: 'Cross-Border M&A Advisory',
      financialImpact: 250000
    },
    {
      id: '2',
      title: 'Regulatory Changes - Ghana Mining Law',
      description: 'Proposed amendments to Minerals and Mining Act may affect client operations',
      severity: 'Critical',
      probability: 'Medium',
      category: 'Regulatory',
      status: 'Monitoring',
      assignedTo: 'Kwame Asante',
      dueDate: '2025-09-01',
      lastUpdated: '2025-07-09',
      impact: 'Could invalidate existing mining licenses',
      mitigation: 'Monitor legislative progress and prepare compliance strategy',
      associatedMatter: 'Mining Rights Advisory',
      financialImpact: 500000
    },
    {
      id: '3',
      title: 'Data Privacy Compliance - POPIA Implementation',
      description: 'South African POPIA compliance gaps in client data management',
      severity: 'Medium',
      probability: 'High',
      category: 'Legal',
      status: 'Open',
      assignedTo: 'Thandiwe Mthembu',
      dueDate: '2025-07-25',
      lastUpdated: '2025-07-07',
      impact: 'Potential fines up to R10 million',
      mitigation: 'Complete data audit and implement privacy controls',
      associatedMatter: 'Corporate Compliance Review',
      financialImpact: 150000
    },
    {
      id: '4',
      title: 'Political Instability - East African Operations',
      description: 'Regional political tensions affecting cross-border trade agreements',
      severity: 'High',
      probability: 'Medium',
      category: 'Operational',
      status: 'Monitoring',
      assignedTo: 'Fatima Hassan',
      dueDate: '2025-08-30',
      lastUpdated: '2025-07-06',
      impact: 'Disruption to supply chain and contract execution',
      mitigation: 'Diversify operational jurisdictions and include force majeure clauses',
      associatedMatter: 'Regional Trade Agreement',
      financialImpact: 300000
    },
    {
      id: '5',
      title: 'Cybersecurity Vulnerability Assessment',
      description: 'Potential data breach risks in client information systems',
      severity: 'High',
      probability: 'Medium',
      category: 'Operational',
      status: 'Open',
      assignedTo: 'Chinedu Okafor',
      dueDate: '2025-07-20',
      lastUpdated: '2025-07-05',
      impact: 'Client confidentiality breach and regulatory penalties',
      mitigation: 'Implement multi-factor authentication and security training',
      financialImpact: 200000
    },
    {
      id: '6',
      title: 'Local Content Requirements - Angola Oil & Gas',
      description: 'New local content regulations affecting international oil companies',
      severity: 'Medium',
      probability: 'High',
      category: 'Regulatory',
      status: 'Mitigated',
      assignedTo: 'Maria Santos',
      dueDate: '2025-07-15',
      lastUpdated: '2025-07-10',
      impact: 'Requirement for 30% local content in operations',
      mitigation: 'Established local partnerships and compliance framework',
      associatedMatter: 'Energy Sector Advisory',
      financialImpact: 100000
    }
  ]

  const riskMetrics: RiskMetric[] = [
    {
      title: 'Total Open Risks',
      value: '24',
      change: -8,
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: 'Critical Risks',
      value: '3',
      change: 0,
      icon: Shield,
      color: 'text-red-500'
    },
    {
      title: 'Avg Resolution Time',
      value: '14 days',
      change: -15,
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Risk Score',
      value: '7.2/10',
      change: -5,
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800'
      case 'Monitoring': return 'bg-yellow-100 text-yellow-800'
      case 'Mitigated': return 'bg-blue-100 text-blue-800'
      case 'Closed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRisks = risks.filter(risk => {
    const matchesFilter = selectedFilter === 'all' || risk.category.toLowerCase() === selectedFilter
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         risk.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const riskCategories = ['all', 'financial', 'legal', 'operational', 'regulatory', 'reputational']

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Management</h1>
            <p className="text-gray-600">Monitor and manage legal and operational risks across your practice</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Risk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'risks', name: 'Risk Register', icon: AlertTriangle },
              { id: 'analytics', name: 'Analytics', icon: PieChart },
              { id: 'mitigation', name: 'Mitigation Plans', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {riskMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-50`}>
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    {metric.change < 0 ? (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${metric.change < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(metric.change)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Risk Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk by Category</h3>
              <div className="space-y-4">
                {[
                  { category: 'Financial', count: 8, percentage: 33, color: 'bg-red-500' },
                  { category: 'Regulatory', count: 6, percentage: 25, color: 'bg-orange-500' },
                  { category: 'Operational', count: 5, percentage: 21, color: 'bg-yellow-500' },
                  { category: 'Legal', count: 3, percentage: 13, color: 'bg-blue-500' },
                  { category: 'Reputational', count: 2, percentage: 8, color: 'bg-purple-500' }
                ].map((item) => (
                  <div key={item.category} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{item.category}</span>
                        <span className="text-gray-500">{item.count} risks</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Severity Distribution</h3>
              <div className="space-y-4">
                {[
                  { severity: 'Critical', count: 3, percentage: 13, color: 'bg-red-600' },
                  { severity: 'High', count: 8, percentage: 33, color: 'bg-red-400' },
                  { severity: 'Medium', count: 10, percentage: 42, color: 'bg-yellow-500' },
                  { severity: 'Low', count: 3, percentage: 12, color: 'bg-green-500' }
                ].map((item) => (
                  <div key={item.severity} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900">{item.severity}</span>
                        <span className="text-gray-500">{item.count} risks</span>
                      </div>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent High-Priority Risks */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">High-Priority Risks Requiring Attention</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {risks.filter(risk => risk.severity === 'Critical' || risk.severity === 'High').slice(0, 4).map((risk) => (
                <div key={risk.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(risk.severity)}`}>
                          {risk.severity}
                        </span>
                        <h4 className="text-sm font-medium text-gray-900">{risk.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {risk.assignedTo}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due {risk.dueDate}
                        </span>
                        {risk.financialImpact && (
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            ${risk.financialImpact.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Register Tab */}
      {activeTab === 'risks' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2">
                {riskCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedFilter(category)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      selectedFilter === category
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search risks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Risk List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{risk.title}</div>
                          <div className="text-sm text-gray-500">{risk.description.substring(0, 80)}...</div>
                          {risk.associatedMatter && (
                            <div className="text-xs text-blue-600 mt-1 flex items-center">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {risk.associatedMatter}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {risk.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(risk.severity)}`}>
                          {risk.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(risk.status)}`}>
                          {risk.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {risk.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {risk.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Archive className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trends (Last 6 Months)</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Risk trend chart would be displayed here</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk by Practice Area</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Practice area risk distribution chart would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mitigation Plans Tab */}
      {activeTab === 'mitigation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Mitigation Plans</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {risks.filter(risk => risk.status === 'Open' || risk.status === 'Monitoring').map((risk) => (
                <div key={risk.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">{risk.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Impact</p>
                          <p className="text-sm text-gray-900">{risk.impact}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mitigation Strategy</p>
                          <p className="text-sm text-gray-900">{risk.mitigation}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {risk.assignedTo}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due {risk.dueDate}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${getStatusColor(risk.status)}`}>
                          {risk.status}
                        </span>
                      </div>
                    </div>
                    <button className="ml-4 text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Update Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
