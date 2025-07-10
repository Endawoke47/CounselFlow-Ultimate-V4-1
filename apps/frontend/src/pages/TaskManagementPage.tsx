import React, { useState, useEffect } from 'react'
import { CheckSquare, Clock, Calendar, User, Flag, Upload, Download, Search, Filter, Plus, Edit, Trash2, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TaskData } from '../types/models'
import { formatDate } from '../utils/dateUtils'
import { downloadCSV, downloadPDF } from '../utils/exportUtils'
import { parseCSV } from '../utils/importUtils'
import { useAI } from '../services/aiService'
import { DocumentUpload } from '../components/ui/DocumentUpload'
import { AISearch } from '../components/ui/AISearch'
import { ImportExport } from '../components/ui/ImportExport'
import { RoleBasedAccess } from '../components/ui/RoleBasedAccess'
import { InterModuleLinkage } from '../components/ui/InterModuleLinkage'

export function TaskManagementPage() {
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [filteredTasks, setFilteredTasks] = useState<TaskData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const { prioritizeTasks, suggestDeadlines } = useAI()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Legal Research',
    priority: 'medium',
    status: 'not_started',
    assignee: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: '',
    relatedModule: '',
    relatedId: '',
    tags: '',
    dependencies: '',
    notes: ''
  })

  // Sample data
  const sampleTasks: TaskData[] = [
    {
      id: '1',
      title: 'Review and Update Data Protection Policy',
      description: 'Comprehensive review of current data protection policy to ensure GDPR compliance',
      category: 'Policy Review',
      priority: 'high',
      status: 'in_progress',
      assignee: 'Sarah Wanjiku',
      assigneeEmail: 'sarah.wanjiku@company.com',
      dueDate: '2024-04-15',
      estimatedHours: 8,
      actualHours: 5,
      progress: 60,
      relatedModule: 'policies',
      relatedId: '1',
      tags: ['GDPR', 'Privacy', 'Policy', 'Compliance'],
      dependencies: ['Legal audit completion'],
      notes: 'Waiting for input from IT department on technical controls',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-15',
      linkedEntities: ['Policy Management', 'Legal Department'],
      riskLevel: 'medium',
      completionDate: null,
      subtasks: [
        { id: '1a', title: 'Review current policy', completed: true },
        { id: '1b', title: 'Research GDPR updates', completed: true },
        { id: '1c', title: 'Draft revised sections', completed: false },
        { id: '1d', title: 'Stakeholder review', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Prepare Employment Contract Templates',
      description: 'Create standardized employment contract templates for different employee categories',
      category: 'Contract Drafting',
      priority: 'medium',
      status: 'not_started',
      assignee: 'John Mwangi',
      assigneeEmail: 'john.mwangi@company.com',
      dueDate: '2024-04-30',
      estimatedHours: 12,
      actualHours: 0,
      progress: 0,
      relatedModule: 'contracts',
      relatedId: undefined,
      tags: ['Employment', 'Templates', 'HR', 'Contracts'],
      dependencies: [],
      notes: 'Coordinate with HR for different employee categories',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05',
      linkedEntities: ['Contract Management', 'HR Department'],
      riskLevel: 'low',
      completionDate: null,
      subtasks: [
        { id: '2a', title: 'Gather requirements from HR', completed: false },
        { id: '2b', title: 'Research legal requirements', completed: false },
        { id: '2c', title: 'Draft templates', completed: false },
        { id: '2d', title: 'Legal review and approval', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Respond to Regulatory Inquiry',
      description: 'Prepare response to CMA inquiry regarding securities trading practices',
      category: 'Regulatory Response',
      priority: 'critical',
      status: 'overdue',
      assignee: 'Grace Kamau',
      assigneeEmail: 'grace.kamau@company.com',
      dueDate: '2024-03-20',
      estimatedHours: 16,
      actualHours: 12,
      progress: 75,
      relatedModule: 'licensing',
      relatedId: '3',
      tags: ['CMA', 'Securities', 'Regulatory', 'Urgent'],
      dependencies: ['Document collection from Finance'],
      notes: 'Extension request submitted to CMA',
      createdAt: '2024-02-15',
      updatedAt: '2024-03-18',
      linkedEntities: ['Licensing & Regulatory', 'Finance Department'],
      riskLevel: 'high',
      completionDate: null,
      subtasks: [
        { id: '3a', title: 'Collect supporting documents', completed: true },
        { id: '3b', title: 'Analyze regulatory requirements', completed: true },
        { id: '3c', title: 'Draft response letter', completed: true },
        { id: '3d', title: 'Senior partner review', completed: false }
      ]
    },
    {
      id: '4',
      title: 'Complete Client Onboarding Documentation',
      description: 'Finalize KYC and due diligence documentation for new corporate client',
      category: 'Client Onboarding',
      priority: 'medium',
      status: 'completed',
      assignee: 'David Ochieng',
      assigneeEmail: 'david.ochieng@company.com',
      dueDate: '2024-03-25',
      estimatedHours: 6,
      actualHours: 7,
      progress: 100,
      relatedModule: 'clients',
      relatedId: '2',
      tags: ['KYC', 'Due Diligence', 'Client', 'Onboarding'],
      dependencies: [],
      notes: 'Client documentation complete and filed',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-25',
      linkedEntities: ['Entity Management', 'Compliance'],
      riskLevel: 'low',
      completionDate: '2024-03-25',
      subtasks: [
        { id: '4a', title: 'Collect client documents', completed: true },
        { id: '4b', title: 'Verify corporate structure', completed: true },
        { id: '4c', title: 'Complete KYC checklist', completed: true },
        { id: '4d', title: 'File documentation', completed: true }
      ]
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setTasks(sampleTasks)
      setFilteredTasks(sampleTasks)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.assignee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      const matchesAssignee = filterAssignee === 'all' || task.assignee === filterAssignee
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })
    setFilteredTasks(filtered)
  }, [searchTerm, filterStatus, filterPriority, filterAssignee, tasks])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newTask: TaskData = {
        id: editingTask?.id || Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category as TaskData['category'],
        priority: formData.priority as TaskData['priority'],
        status: formData.status as TaskData['status'],
        assignee: formData.assignee || undefined,
        assigneeEmail: formData.assignee ? `${formData.assignee.toLowerCase().replace(' ', '.')}@company.com` : undefined,
        dueDate: formData.dueDate,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        actualHours: formData.actualHours ? parseFloat(formData.actualHours) : undefined,
        progress: 0,
        relatedModule: formData.relatedModule || undefined,
        relatedId: formData.relatedId || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        dependencies: formData.dependencies.split('\n').filter(dep => dep.trim()),
        notes: formData.notes || undefined,
        createdAt: editingTask?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium',
        completionDate: null,
        subtasks: []
      }

      if (editingTask) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? newTask : t))
      } else {
        setTasks(prev => [...prev, newTask])
      }

      setShowForm(false)
      setEditingTask(null)
      setFormData({
        title: '',
        description: '',
        category: 'Legal Research',
        priority: 'medium',
        status: 'not_started',
        assignee: '',
        dueDate: '',
        estimatedHours: '',
        actualHours: '',
        relatedModule: '',
        relatedId: '',
        tags: '',
        dependencies: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (task: TaskData) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      assignee: task.assignee || '',
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours?.toString() || '',
      actualHours: task.actualHours?.toString() || '',
      relatedModule: task.relatedModule || '',
      relatedId: task.relatedId || '',
      tags: task.tags?.join(', ') || '',
      dependencies: task.dependencies?.join('\n') || '',
      notes: task.notes || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id))
    }
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus as TaskData['status'],
            completionDate: newStatus === 'completed' ? new Date().toISOString() : null,
            progress: newStatus === 'completed' ? 100 : task.progress,
            updatedAt: new Date().toISOString()
          } 
        : task
    ))
  }

  const handleBulkAction = (action: string) => {
    if (selectedTasks.length === 0) return

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedTasks.length} selected tasks?`)) {
          setTasks(prev => prev.filter(t => !selectedTasks.includes(t.id)))
          setSelectedTasks([])
        }
        break
      case 'complete':
        setTasks(prev => prev.map(t => 
          selectedTasks.includes(t.id) 
            ? { ...t, status: 'completed', completionDate: new Date().toISOString(), progress: 100 }
            : t
        ))
        setSelectedTasks([])
        break
      case 'in_progress':
        setTasks(prev => prev.map(t => 
          selectedTasks.includes(t.id) ? { ...t, status: 'in_progress' } : t
        ))
        setSelectedTasks([])
        break
    }
  }

  const handleImport = async (file: File) => {
    try {
      setLoading(true)
      const csvData = await parseCSV(file)
      const importedTasks: TaskData[] = csvData.map((row: any, index: number) => ({
        id: Date.now().toString() + index,
        title: row.title || '',
        description: row.description || '',
        category: (row.category || 'Legal Research') as TaskData['category'],
        priority: (row.priority || 'medium') as TaskData['priority'],
        status: (row.status || 'not_started') as TaskData['status'],
        assignee: row.assignee || undefined,
        assigneeEmail: row.assigneeEmail || undefined,
        dueDate: row.dueDate || '',
        estimatedHours: row.estimatedHours ? parseFloat(row.estimatedHours) : undefined,
        actualHours: row.actualHours ? parseFloat(row.actualHours) : undefined,
        progress: 0,
        relatedModule: row.relatedModule || undefined,
        relatedId: row.relatedId || undefined,
        tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
        dependencies: row.dependencies ? row.dependencies.split(';') : [],
        notes: row.notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium' as const,
        completionDate: null,
        subtasks: []
      }))
      setTasks(prev => [...prev, ...importedTasks])
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    const dataToExport = selectedTasks.length > 0 
      ? tasks.filter(t => selectedTasks.includes(t.id))
      : filteredTasks

    if (format === 'csv') {
      downloadCSV(dataToExport, 'tasks-export.csv')
    } else {
      downloadPDF(dataToExport, 'Tasks Report', 'tasks-export.pdf')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />
      case 'on_hold': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'overdue': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'completed') return false
    const today = new Date()
    const due = new Date(dueDate)
    return due < today
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUniqueAssignees = () => {
    const assignees = tasks.map(task => task.assignee).filter(Boolean)
    return [...new Set(assignees)]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-2">Organize, track, and manage legal tasks and workflows</p>
        </div>
        <div className="flex gap-3">
          <ImportExport
            onImport={handleImport}
            onExport={handleExport}
            selectedCount={selectedTasks.length}
            totalCount={filteredTasks.length}
          />
          <RoleBasedAccess requiredPermissions={['create_task']}>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </RoleBasedAccess>
        </div>
      </div>

      {/* Task Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckSquare className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => isOverdue(t.dueDate, t.status)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Flag className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter(t => t.priority === 'high' || t.priority === 'critical').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignees</option>
            {getUniqueAssignees().map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
          <AISearch
            onSearch={(query) => setSearchTerm(query)}
            placeholder="AI-powered task search..."
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedTasks.length} tasks selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('in_progress')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Start Progress
              </button>
              <button
                onClick={() => handleBulkAction('complete')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Mark Complete
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading tasks...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTasks.length === filteredTasks.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks(filteredTasks.map(t => t.id))
                        } else {
                          setSelectedTasks([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate, task.status)
                  const daysRemaining = getDaysRemaining(task.dueDate)
                  
                  return (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTasks([...selectedTasks, task.id])
                            } else {
                              setSelectedTasks(selectedTasks.filter(id => id !== task.id))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <CheckSquare className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">{task.category}</span>
                              {task.estimatedHours && task.estimatedHours > 0 && (
                                <>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-500">{task.estimatedHours}h estimated</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {task.assignee && (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{task.assignee}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(overdue ? 'overdue' : task.status)}
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className={`text-sm border-none bg-transparent focus:ring-0 capitalize ${
                                overdue ? 'text-red-600' :
                                task.status === 'completed' ? 'text-green-600' :
                                task.status === 'in_progress' ? 'text-blue-600' :
                                task.status === 'on_hold' ? 'text-yellow-600' :
                                'text-gray-600'
                              }`}
                            >
                              <option value="not_started">Not Started</option>
                              <option value="in_progress">In Progress</option>
                              <option value="on_hold">On Hold</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                          {task.progress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {formatDate(task.dueDate)}
                          </p>
                          {!overdue && daysRemaining <= 7 && daysRemaining > 0 && (
                            <p className="text-xs text-orange-600">
                              {daysRemaining} days left
                            </p>
                          )}
                          {overdue && (
                            <p className="text-xs text-red-600">
                              {Math.abs(daysRemaining)} days overdue
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {/* View details */}}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <RoleBasedAccess requiredPermissions={['edit_task']}>
                            <button
                              onClick={() => handleEdit(task)}
                              className="text-green-600 hover:text-green-800"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </RoleBasedAccess>
                          <RoleBasedAccess requiredPermissions={['delete_task']}>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </RoleBasedAccess>
                          <InterModuleLinkage
                            sourceModule="tasks"
                            sourceId={task.id}
                            linkedEntities={task.linkedEntities}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Legal Research">Legal Research</option>
                      <option value="Contract Drafting">Contract Drafting</option>
                      <option value="Policy Review">Policy Review</option>
                      <option value="Regulatory Response">Regulatory Response</option>
                      <option value="Client Onboarding">Client Onboarding</option>
                      <option value="Due Diligence">Due Diligence</option>
                      <option value="Compliance Review">Compliance Review</option>
                      <option value="Document Review">Document Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority *
                    </label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignee
                    </label>
                    <input
                      type="text"
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Hours
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.actualHours}
                      onChange={(e) => setFormData({ ...formData, actualHours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dependencies (one per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.dependencies}
                    onChange={(e) => setFormData({ ...formData, dependencies: e.target.value })}
                    placeholder="e.g., Legal audit completion&#10;Document collection from Finance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., GDPR, Privacy, Policy, Compliance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingTask ? 'Update' : 'Create')} Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
