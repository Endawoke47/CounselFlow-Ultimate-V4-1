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
  BarChart3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { mattersApi, contractsApi, usersApi } from '../services/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any[]>([])
  const [recentMatters, setRecentMatters] = useState<any[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [mattersResponse, contractsResponse, usersResponse] = await Promise.allSettled([
        mattersApi.getAll(),
        contractsApi.getAll(),
        usersApi.getAll()
      ])

      // Process matters data
      let matters = []
      if (mattersResponse.status === 'fulfilled') {
        matters = mattersResponse.value.data
        setRecentMatters(matters.slice(0, 3).map((matter: any) => ({
          id: matter.id,
          title: matter.title,
          client: matter.clientName,
          status: matter.status,
          priority: matter.priority,
          dueDate: matter.dueDate ? new Date(matter.dueDate).toLocaleDateString() : 'No due date',
          value: matter.estimatedValue ? `$${matter.estimatedValue.toLocaleString()}` : 'TBD'
        })))
      }

      // Process contracts data
      let contracts = []
      if (contractsResponse.status === 'fulfilled') {
        contracts = contractsResponse.value.data
      }

      // Process users data
      let users = []
      if (usersResponse.status === 'fulfilled') {
        users = usersResponse.value.data
      }

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
      const deadlines = matters
        .filter((m: any) => m.dueDate && new Date(m.dueDate) > new Date())
        .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3)
        .map((matter: any, index: number) => ({
          id: matter.id,
          title: matter.title,
          client: matter.clientName,
          date: new Date(matter.dueDate).toLocaleDateString(),
          time: '9:00 AM', // Default time for demo
          type: matter.type
        }))

      setUpcomingDeadlines(deadlines)

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
    <div className="px-4 lg:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your legal practice today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Matters</h3>
              <Link
                to="/matters"
                className="text-teal-600 hover:text-teal-500 text-sm font-medium flex items-center"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMatters.map((matter) => (
                <div key={matter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{matter.title}</h4>
                    <p className="text-sm text-gray-600">{matter.client}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        matter.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {matter.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        matter.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {matter.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{matter.value}</p>
                    <p className="text-xs text-gray-500">Due: {matter.dueDate}</p>
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
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                    <p className="text-xs text-gray-500">{deadline.client}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
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

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {insight.type === 'risk' && <AlertCircle className="h-5 w-5 text-red-500" />}
                    {insight.type === 'opportunity' && <TrendingUp className="h-5 w-5 text-green-500" />}
                    {insight.type === 'deadline' && <Clock className="h-5 w-5 text-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                    <button className="text-xs text-teal-600 hover:text-teal-500 mt-2 font-medium">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}