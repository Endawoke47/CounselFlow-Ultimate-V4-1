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
  Archive
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate, formatCurrency, getStatusColor, getPriorityColor } from '@/lib/utils'

interface Matter {
  id: string
  title: string
  client: string
  type: string
  status: 'active' | 'pending' | 'closed' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignedTo: string
  createdAt: string
  dueDate: string
  estimatedValue: number
  description: string
}

export function MattersPage() {
  const [matters, setMatters] = useState<Matter[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const mockMatters: Matter[] = [
    {
      id: '1',
      title: 'Corporate Merger - TechCorp Acquisition',
      client: 'TechCorp Industries',
      type: 'corporate',
      status: 'active',
      priority: 'high',
      assignedTo: 'John Smith',
      createdAt: '2024-01-01',
      dueDate: '2024-01-15',
      estimatedValue: 250000,
      description: 'Complete merger and acquisition documentation for TechCorp Industries acquisition of StartupCo.'
    },
    {
      id: '2',
      title: 'Employment Contract Review',
      client: 'Global Services LLC',
      type: 'employment',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-02',
      dueDate: '2024-01-20',
      estimatedValue: 15000,
      description: 'Review and update employment contracts for C-level executives.'
    },
    {
      id: '3',
      title: 'IP Licensing Agreement',
      client: 'Innovation Labs',
      type: 'intellectual_property',
      status: 'active',
      priority: 'high',
      assignedTo: 'Michael Chen',
      createdAt: '2024-01-03',
      dueDate: '2024-01-25',
      estimatedValue: 75000,
      description: 'Negotiate and draft intellectual property licensing agreement for patent portfolio.'
    },
    {
      id: '4',
      title: 'Real Estate Transaction',
      client: 'Metro Holdings',
      type: 'real_estate',
      status: 'closed',
      priority: 'low',
      assignedTo: 'Emily Davis',
      createdAt: '2023-12-15',
      dueDate: '2024-01-10',
      estimatedValue: 45000,
      description: 'Commercial real estate purchase and due diligence for office complex.'
    },
    {
      id: '5',
      title: 'Litigation - Contract Dispute',
      client: 'Sterling Enterprises',
      type: 'litigation',
      status: 'on_hold',
      priority: 'critical',
      assignedTo: 'Robert Wilson',
      createdAt: '2024-01-05',
      dueDate: '2024-02-01',
      estimatedValue: 500000,
      description: 'Represent client in breach of contract dispute with former business partner.'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setMatters(mockMatters)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredMatters = matters.filter(matter => {
    const matchesSearch = matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         matter.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || matter.status === filterStatus
    const matchesType = filterType === 'all' || matter.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  if (loading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Matters</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your legal matters
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Matter</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search matters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-gray-50 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Types</option>
                    <option value="litigation">Litigation</option>
                    <option value="corporate">Corporate</option>
                    <option value="employment">Employment</option>
                    <option value="intellectual_property">Intellectual Property</option>
                    <option value="real_estate">Real Estate</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStatus('all')
                      setFilterType('all')
                      setSearchTerm('')
                    }}
                    className="btn-secondary w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Matters List */}
      <div className="space-y-4">
        {filteredMatters.map((matter, index) => (
          <motion.div
            key={matter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{matter.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(matter.status)}`}>
                    {matter.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(matter.priority)}`}>
                    {matter.priority} priority
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{matter.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{matter.client}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{getTypeLabel(matter.type)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Due: {formatDate(matter.dueDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{formatCurrency(matter.estimatedValue)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Assigned to: {matter.assignedTo}</span>
                  <span>Created: {formatDate(matter.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMatters.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matters found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first matter'
            }
          </p>
          <button className="btn-primary flex items-center space-x-2 mx-auto">
            <Plus className="h-4 w-4" />
            <span>New Matter</span>
          </button>
        </div>
      )}
    </div>
  )
}