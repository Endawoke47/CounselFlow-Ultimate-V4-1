import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  BarChart3,
  Shield,
  Building,
  Archive,
  Inbox,
  Gavel,
  Database,
  Scale
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { mattersApi, contractsApi, usersApi } from '../services/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Chart } from '../components/ui/Chart'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'

export function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any[]>([])
  const [recentMatters, setRecentMatters] = useState<any[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([])
  const [chartData, setChartData] = useState<any>({
    mattersByMonth: [],
    mattersByType: [],
    revenueByMonth: []
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch from API, but fallback to mock data if it fails
      const [mattersResponse, contractsResponse, usersResponse] = await Promise.allSettled([
        mattersApi.getAll(),
        contractsApi.getAll(),
        usersApi.getAll()
      ])

      // Check if API calls failed, use mock data instead
      let matters = []
      let contracts = []
      let users = []

      if (mattersResponse.status === 'fulfilled') {
        matters = mattersResponse.value.data
      } else {
        // Mock data for matters
        matters = [
          {
            id: '1',
            title: 'Corporate Merger - TechCorp Acquisition',
            clientName: 'TechCorp Industries',
            status: 'active',
            priority: 'high',
            estimatedValue: 2500000,
            dueDate: '2025-08-15',
            description: 'Major corporate acquisition requiring due diligence and regulatory approval'
          },
          {
            id: '2',
            title: 'Employment Contract Dispute',
            clientName: 'StartupCo LLC',
            status: 'active',
            priority: 'medium',
            estimatedValue: 150000,
            dueDate: '2025-07-30',
            description: 'Non-compete clause enforcement and severance negotiations'
          },
          {
            id: '3',
            title: 'Intellectual Property Registration',
            clientName: 'InnovaTech Solutions',
            status: 'pending',
            priority: 'medium',
            estimatedValue: 75000,
            dueDate: '2025-09-01',
            description: 'Patent filing and trademark registration for new software platform'
          },
          {
            id: '4',
            title: 'Real Estate Transaction',
            clientName: 'Metro Properties Group',
            status: 'active',
            priority: 'high',
            estimatedValue: 500000,
            dueDate: '2025-07-20',
            description: 'Commercial property acquisition and lease negotiations'
          },
          {
            id: '5',
            title: 'Regulatory Compliance Review',
            clientName: 'FinanceFirst Bank',
            status: 'pending',
            priority: 'low',
            estimatedValue: 100000,
            dueDate: '2025-10-15',
            description: 'Annual compliance audit and policy updates'
          }
        ]
      }

      if (contractsResponse.status === 'fulfilled') {
        contracts = contractsResponse.value.data
      } else {
        // Mock data for contracts
        contracts = [
          {
            id: '1',
            title: 'Software License Agreement',
            type: 'licensing',
            status: 'draft',
            priority: 'high',
            value: 250000,
            effectiveDate: '2025-08-01',
            expirationDate: '2026-08-01'
          },
          {
            id: '2',
            title: 'Service Provider Agreement',
            type: 'service',
            status: 'review',
            priority: 'medium',
            value: 180000,
            effectiveDate: '2025-07-15',
            expirationDate: '2025-12-31'
          },
          {
            id: '3',
            title: 'Non-Disclosure Agreement',
            type: 'nda',
            status: 'executed',
            priority: 'low',
            value: 0,
            effectiveDate: '2025-06-01',
            expirationDate: '2027-06-01'
          }
        ]
      }

      if (usersResponse.status === 'fulfilled') {
        users = usersResponse.value.data
      } else {
        // Mock data for users
        users = [
          { id: '1', firstName: 'John', lastName: 'Smith', role: 'partner' },
          { id: '2', firstName: 'Sarah', lastName: 'Johnson', role: 'associate' },
          { id: '3', firstName: 'Michael', lastName: 'Brown', role: 'paralegal' }
        ]
      }

      // Process recent matters
      setRecentMatters(matters.slice(0, 3).map((matter: any) => ({
        id: matter.id,
        title: matter.title,
        client: matter.clientName,
        status: matter.status,
        priority: matter.priority,
        dueDate: matter.dueDate ? new Date(matter.dueDate).toLocaleDateString() : 'No due date',
        value: matter.estimatedValue ? `$${matter.estimatedValue.toLocaleString()}` : 'TBD'
      })))

      // Calculate stats
      const activeMatters = matters.filter((m: any) => m.status === 'active').length
      const pendingContracts = contracts.filter((c: any) => c.status === 'review' || c.status === 'draft').length
      const totalClients = new Set(matters.map((m: any) => m.clientName)).size
      const totalRevenue = matters.reduce((sum: number, m: any) => sum + (m.estimatedValue || 0), 0)

      setStats([
        {
          name: 'Active Matters',
          value: activeMatters.toString(),
          change: '+12%',
          changeType: 'positive' as const,
          icon: Briefcase,
          color: 'bg-teal-500'
        },
        {
          name: 'Pending Contracts',
          value: pendingContracts.toString(),
          change: '+4%',
          changeType: 'positive' as const,
          icon: FileText,
          color: 'bg-blue-500'
        },
        {
          name: 'Total Clients',
          value: totalClients.toString(),
          change: '+8%',
          changeType: 'positive' as const,
          icon: Users,
          color: 'bg-purple-500'
        },
        {
          name: 'Revenue (YTD)',
          value: `$${(totalRevenue / 1000000).toFixed(1)}M`,
          change: '+15%',
          changeType: 'positive' as const,
          icon: DollarSign,
          color: 'bg-green-500'
        }
      ])

      // Generate upcoming deadlines from matters with due dates
      let deadlines = matters
        .filter((m: any) => m.dueDate && new Date(m.dueDate) > new Date())
        .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3)
        .map((matter: any, index: number) => ({
          id: matter.id,
          title: matter.title,
          client: matter.clientName,
          date: new Date(matter.dueDate).toLocaleDateString(),
          time: '9:00 AM', // Default time for demo
          type: matter.type || 'meeting'
        }))

      // If no deadlines from API, add mock deadlines
      if (deadlines.length === 0) {
        deadlines = [
          {
            id: 'deadline-1',
            title: 'Contract Review Meeting',
            client: 'TechCorp Industries',
            date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
            time: '10:00 AM',
            type: 'meeting'
          },
          {
            id: 'deadline-2',
            title: 'Due Diligence Report',
            client: 'StartupCo LLC',
            date: new Date(Date.now() + 172800000).toLocaleDateString(), // Day after tomorrow
            time: '2:00 PM',
            type: 'document'
          },
          {
            id: 'deadline-3',
            title: 'Court Filing Deadline',
            client: 'Metro Properties Group',
            date: new Date(Date.now() + 259200000).toLocaleDateString(), // 3 days from now
            time: '5:00 PM',
            type: 'filing'
          }
        ]
      }

      setUpcomingDeadlines(deadlines)

      // Generate chart data
      const mattersByMonth = [
        { name: 'Jan', value: 12 },
        { name: 'Feb', value: 19 },
        { name: 'Mar', value: 15 },
        { name: 'Apr', value: 22 },
        { name: 'May', value: 18 },
        { name: 'Jun', value: 25 },
        { name: 'Jul', value: activeMatters }
      ]

      const mattersByType = [
        { name: 'Corporate', value: Math.floor(matters.length * 0.4) || 8 },
        { name: 'Litigation', value: Math.floor(matters.length * 0.3) || 6 },
        { name: 'Real Estate', value: Math.floor(matters.length * 0.2) || 4 },
        { name: 'Employment', value: Math.floor(matters.length * 0.1) || 2 }
      ]

      const revenueByMonth = [
        { name: 'Jan', value: 150000 },
        { name: 'Feb', value: 180000 },
        { name: 'Mar', value: 165000 },
        { name: 'Apr', value: 220000 },
        { name: 'May', value: 195000 },
        { name: 'Jun', value: 240000 },
        { name: 'Jul', value: totalRevenue || 200000 }
      ]

      setChartData({
        mattersByMonth,
        mattersByType,
        revenueByMonth
      })

    } catch (err: any) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const aiInsights = [
    {
      id: 1,
      type: 'risk',
      title: 'High Value Matters Require Attention',
      description: `${recentMatters.filter(m => m.priority === 'high').length} high-priority matters need immediate focus`,
      action: 'Review matters'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Client Expansion Opportunity',
      description: 'Multiple active matters suggest potential for expanded services',
      action: 'Schedule meeting'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Approaching Deadlines',
      description: `${upcomingDeadlines.length} matters have deadlines within the next 30 days`,
      action: 'Review schedule'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Welcome Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-teal-600 mt-2 text-lg font-medium">
            Here's what's happening with your legal practice today.
          </p>
        </motion.div>
      </div>

      {/* Enhanced KPI Cards with teal theme */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">{stat.name}</p>
                  <p className="text-3xl font-bold text-teal-800 mt-2">{stat.value}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">{stat.change}</span>
                <span className="text-teal-500 ml-1">from last month</span>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick Access Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">Quick Access</h2>
          <p className="text-teal-600">Access all legal practice modules</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Legal Intake', href: '/intake', icon: Inbox, color: 'from-blue-500 to-blue-600', description: 'Request routing' },
            { name: 'IP Management', href: '/ip-management', icon: Shield, color: 'from-purple-500 to-purple-600', description: 'Patents & trademarks' },
            { name: 'Entity Management', href: '/entity-management', icon: Building, color: 'from-indigo-500 to-indigo-600', description: 'Corporate entities' },
            { name: 'Compliance', href: '/compliance', icon: Scale, color: 'from-green-500 to-green-600', description: 'Risk & compliance' },
            { name: 'Privacy & Data', href: '/privacy', icon: Shield, color: 'from-cyan-500 to-cyan-600', description: 'GDPR & data protection' },
            { name: 'Disputes', href: '/disputes', icon: Gavel, color: 'from-red-500 to-red-600', description: 'Litigation management' },
            { name: 'Spend Analytics', href: '/spend-analytics', icon: TrendingUp, color: 'from-orange-500 to-orange-600', description: 'Financial insights' },
            { name: 'Knowledge Base', href: '/knowledge', icon: Database, color: 'from-pink-500 to-pink-600', description: 'Legal research' },
            { name: 'Documents', href: '/documents', icon: Archive, color: 'from-gray-500 to-gray-600', description: 'Document management' },
            { name: 'AI Assistant', href: '/ai', icon: MessageSquare, color: 'from-teal-500 to-cyan-500', description: 'AI-powered assistance' }
          ].map((module, index) => {
            const Icon = module.icon
            return (
              <Link
                key={module.name}
                to={module.href}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-teal-400 group-hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${module.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-teal-800 text-sm mb-2 group-hover:text-teal-600 transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-xs text-teal-600 leading-tight">
                      {module.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg"
        >
          <div className="p-6 border-b border-teal-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-teal-800">Recent Matters</h3>
              <Link
                to="/matters"
                className="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center transition-colors duration-200"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMatters.map((matter) => (
                <div key={matter.id} className="flex items-center justify-between p-4 bg-teal-50/50 rounded-xl hover:bg-teal-50 transition-colors duration-200">
                  <div className="flex-1">
                    <h4 className="font-semibold text-teal-900">{matter.title}</h4>
                    <p className="text-sm text-teal-600 mt-1">{matter.client}</p>
                    <div className="flex items-center mt-3 space-x-4">
                      <StatusBadge status={matter.status} />
                      <PriorityBadge priority={matter.priority} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-teal-900">{matter.value}</p>
                    <p className="text-xs text-teal-500 mt-1">Due: {matter.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg"
        >
          <div className="p-6 border-b border-teal-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-teal-800">Upcoming Deadlines</h3>
              <Calendar className="h-5 w-5 text-teal-500" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start space-x-3 p-3 bg-teal-50/50 rounded-lg hover:bg-teal-50 transition-colors duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-teal-900">{deadline.title}</p>
                    <p className="text-xs text-teal-600 mt-1">{deadline.client}</p>
                    <div className="flex items-center mt-2 text-xs text-teal-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {deadline.date} at {deadline.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg p-6">
          <Chart
            data={chartData.mattersByMonth}
            type="area"
            title="Matters by Month"
          />
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg p-6">
          <Chart
            data={chartData.revenueByMonth}
            type="bar"
            title="Revenue Trend"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg p-6"
      >
        <Chart
          data={chartData.mattersByType}
          type="pie"
          title="Matters by Practice Area"
        />
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 shadow-lg"
      >
        <div className="p-6 border-b border-teal-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-teal-800">AI Insights</h3>
            <MessageSquare className="h-5 w-5 text-teal-600" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiInsights.map((insight) => (
              <motion.div 
                key={insight.id} 
                className="p-4 bg-teal-50/50 rounded-xl hover:bg-teal-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-600">
                    {insight.type === 'risk' && <AlertCircle className="h-4 w-4 text-white" />}
                    {insight.type === 'opportunity' && <TrendingUp className="h-4 w-4 text-white" />}
                    {insight.type === 'deadline' && <Clock className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-teal-900">{insight.title}</h4>
                    <p className="text-xs text-teal-600 mt-2 leading-relaxed">{insight.description}</p>
                    <button className="text-xs text-teal-600 hover:text-teal-700 mt-3 font-semibold transition-colors duration-200">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}