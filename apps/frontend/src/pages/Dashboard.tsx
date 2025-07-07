import React, { useState, useEffect } from 'react'
import { logger } from '../services/logger'
import { safeAsync } from '../services/errorHandler'
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
  Brain,
  Shield,
  Database,
  Scale,
  Banknote,
  UserCheck,
  Building2,
  BookOpen,
  ArrowUpRight,
  Activity,
  Target,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { mattersApi, contractsApi, usersApi } from '../services/api'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { AIInsights } from '../components/ai/AIInsights'

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
      logger.error('Error loading dashboard data', err)
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

  // Define all 10 legal modules
  const legalModules = [
    {
      id: 'contracts',
      name: 'Contract Lifecycle Management',
      description: 'AI-powered contract analysis, drafting, and management',
      icon: FileText,
      path: '/contracts',
      color: 'from-counsel-500 to-counsel-600',
      bgColor: 'bg-counsel-50',
      count: stats.find(s => s.name === 'Pending Contracts')?.value || '0',
      trending: '+8%'
    },
    {
      id: 'ip',
      name: 'IP Management',
      description: 'Patent, trademark, and intellectual property tracking',
      icon: Shield,
      path: '/ip-management',
      color: 'from-legal-500 to-legal-600',
      bgColor: 'bg-legal-50',
      count: '24',
      trending: '+12%'
    },
    {
      id: 'matters',
      name: 'Matter Management',
      description: 'Case lifecycle, timeline, and resource management',
      icon: Briefcase,
      path: '/matters',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      count: stats.find(s => s.name === 'Active Matters')?.value || '0',
      trending: '+5%'
    },
    {
      id: 'compliance',
      name: 'Risk & Compliance',
      description: 'Regulatory compliance monitoring and risk assessment',
      icon: Scale,
      path: '/compliance',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      count: '3',
      trending: 'Low'
    },
    {
      id: 'privacy',
      name: 'Data Protection & Privacy',
      description: 'GDPR compliance, DSARs, and privacy management',
      icon: Database,
      path: '/privacy',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      count: '7',
      trending: '+2%'
    },
    {
      id: 'disputes',
      name: 'Dispute & Litigation',
      description: 'Litigation tracking, settlement analysis, and case strategy',
      icon: Users,
      path: '/disputes',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      count: '5',
      trending: '-10%'
    },
    {
      id: 'spend',
      name: 'Legal Spend Analytics',
      description: 'Budget tracking, vendor analysis, and cost optimization',
      icon: Banknote,
      path: '/spend',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      count: '$2.4M',
      trending: '+15%'
    },
    {
      id: 'intake',
      name: 'Legal Intake & Requests',
      description: 'Request routing, intake automation, and task assignment',
      icon: UserCheck,
      path: '/intake',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      count: '18',
      trending: '+25%'
    },
    {
      id: 'entities',
      name: 'Entity Management',
      description: 'Corporate entities, filings, and governance tracking',
      icon: Building2,
      path: '/entities',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      count: '45',
      trending: '+3%'
    },
    {
      id: 'knowledge',
      name: 'Knowledge Management',
      description: 'Legal precedents, clause library, and AI-powered search',
      icon: BookOpen,
      path: '/knowledge',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      count: '1.2K',
      trending: '+18%'
    }
  ]

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-legal-50 to-white min-h-screen">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-counsel-700 to-legal-600 bg-clip-text text-transparent">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-counsel-600 mt-2 text-lg font-medium">
            Your comprehensive legal command center is ready
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-counsel-200/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-counsel-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-counsel-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color === 'bg-teal-500' ? 'from-counsel-500 to-counsel-600' : stat.color === 'bg-blue-500' ? 'from-legal-500 to-legal-600' : stat.color === 'bg-purple-500' ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600'}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                <span className="text-sm text-counsel-500 ml-2">from last month</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legal Modules Grid - All 10 Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-counsel-800 mb-2">Legal Practice Modules</h2>
          <p className="text-counsel-600">Access all areas of your legal practice management platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {legalModules.map((module, index) => {
            const Icon = module.icon
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Link
                  to={module.path}
                  className="block bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-counsel-200/50 hover:shadow-2xl transition-all duration-300 hover:border-counsel-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-counsel-800 mb-2 group-hover:text-counsel-700 transition-colors">
                    {module.name}
                  </h3>
                  
                  <p className="text-sm text-counsel-600 mb-4 line-clamp-2">
                    {module.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-counsel-800">{module.count}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        module.trending.includes('+') 
                          ? 'bg-green-100 text-green-700' 
                          : module.trending.includes('-')
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {module.trending}
                      </span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-counsel-400 group-hover:text-counsel-600 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-counsel-200/50"
        >
          <div className="p-6 border-b border-counsel-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-counsel-500 to-counsel-600 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-counsel-800">Recent Matters</h3>
              </div>
              <Link
                to="/matters"
                className="text-counsel-600 hover:text-counsel-700 text-sm font-semibold flex items-center transition-colors"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMatters.map((matter, index) => (
                <motion.div 
                  key={matter.id} 
                  className="flex items-center justify-between p-5 bg-gradient-to-r from-legal-50 to-counsel-50 rounded-xl border border-counsel-100 hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-counsel-800">{matter.title}</h4>
                    <p className="text-sm text-counsel-600 font-medium">{matter.client}</p>
                    <div className="flex items-center mt-3 space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        matter.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {matter.status}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        matter.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {matter.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-counsel-800">{matter.value}</p>
                    <p className="text-xs text-counsel-500 font-medium">Due: {matter.dueDate}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-counsel-200/50"
        >
          <div className="p-6 border-b border-counsel-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-counsel-800">Upcoming Deadlines</h3>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <motion.div 
                  key={deadline.id} 
                  className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mt-2 animate-pulse-legal"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-counsel-800">{deadline.title}</p>
                    <p className="text-xs text-counsel-600 font-medium">{deadline.client}</p>
                    <div className="flex items-center mt-2 text-xs text-orange-600 font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {deadline.date} at {deadline.time}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="mt-8 bg-gradient-to-br from-white/90 to-legal-50/50 backdrop-blur-sm rounded-2xl shadow-lg border border-counsel-200/50"
      >
        <div className="p-6 border-b border-counsel-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-counsel-500 to-legal-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-counsel-800">AI-Powered Insights</h3>
                <p className="text-sm text-counsel-600">Smart recommendations for your practice</p>
              </div>
            </div>
            <Link to="/ai" className="text-counsel-600 hover:text-counsel-700 text-sm font-semibold flex items-center transition-colors">
              Chat with AI
              <MessageSquare className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
        <div className="p-6">
          <AIInsights type="dashboard" />
        </div>
      </motion.div>
    </div>
  )
}