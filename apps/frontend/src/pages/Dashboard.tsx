import React from 'react'
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
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

export function Dashboard() {
  const { user } = useAuth()

  const stats = [
    {
      name: 'Active Matters',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Briefcase,
      color: 'bg-teal-500'
    },
    {
      name: 'Pending Contracts',
      value: '8',
      change: '+4%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Clients',
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Revenue (YTD)',
      value: '$847K',
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-green-500'
    }
  ]

  const recentMatters = [
    {
      id: 1,
      title: 'Corporate Merger - TechCorp',
      client: 'TechCorp Industries',
      status: 'active',
      priority: 'high',
      dueDate: '2024-01-15',
      value: '$250,000'
    },
    {
      id: 2,
      title: 'Employment Contract Review',
      client: 'Global Services LLC',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-20',
      value: '$15,000'
    },
    {
      id: 3,
      title: 'IP Licensing Agreement',
      client: 'Innovation Labs',
      status: 'active',
      priority: 'high',
      dueDate: '2024-01-25',
      value: '$75,000'
    }
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Contract Amendment Filing',
      client: 'Apex Corp',
      date: '2024-01-12',
      time: '2:00 PM',
      type: 'filing'
    },
    {
      id: 2,
      title: 'Client Meeting - Discovery Phase',
      client: 'Metro Holdings',
      date: '2024-01-13',
      time: '10:00 AM',
      type: 'meeting'
    },
    {
      id: 3,
      title: 'Court Hearing - Motion Review',
      client: 'Sterling Enterprises',
      date: '2024-01-15',
      time: '9:00 AM',
      type: 'hearing'
    }
  ]

  const aiInsights = [
    {
      id: 1,
      type: 'risk',
      title: 'High Risk Contract Clauses Detected',
      description: 'Found 3 potentially problematic clauses in pending contracts',
      action: 'Review contracts'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Client Expansion Opportunity',
      description: 'TechCorp shows patterns for additional legal services',
      action: 'Schedule meeting'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Approaching Deadlines',
      description: '5 matters have deadlines within the next 7 days',
      action: 'Review schedule'
    }
  ]

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