import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, PieChart, BarChart3, Upload, Download, Search, Filter, Plus, Edit, Trash2, Eye, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { OutsourcingData } from '../types/models'
import { formatDate, formatCurrency } from '../utils/dateUtils'
import { downloadCSV, downloadPDF } from '../utils/exportUtils'
import { parseCSV } from '../utils/importUtils'
import { useAI } from '../services/aiService'
import { DocumentUpload } from '../components/ui/DocumentUpload'
import { AISearch } from '../components/ui/AISearch'
import { ImportExport } from '../components/ui/ImportExport'
import { RoleBasedAccess } from '../components/ui/RoleBasedAccess'
import { InterModuleLinkage } from '../components/ui/InterModuleLinkage'

export function OutsourcingLegalSpendPage() {
  const [engagements, setEngagements] = useState<OutsourcingData[]>([])
  const [filteredEngagements, setFilteredEngagements] = useState<OutsourcingData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingEngagement, setEditingEngagement] = useState<OutsourcingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedEngagements, setSelectedEngagements] = useState<string[]>([])
  const { analyzeSpendPattern, optimizeLegalCosts } = useAI()

  const [formData, setFormData] = useState({
    vendor: '',
    type: 'Law Firm',
    description: '',
    matterType: 'Corporate',
    startDate: '',
    endDate: '',
    budget: '',
    actualSpend: '',
    status: 'active',
    partner: '',
    hourlyRate: '',
    retainer: '',
    invoiceFrequency: 'monthly',
    paymentTerms: '30',
    performanceRating: '',
    tags: ''
  })

  // Sample data
  const sampleEngagements: OutsourcingData[] = [
    {
      id: '1',
      vendor: 'Kaplan & Stratton Advocates',
      type: 'Law Firm',
      description: 'Corporate restructuring and M&A advisory',
      matterType: 'Corporate',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      budget: 2500000,
      actualSpend: 1850000,
      status: 'active',
      partner: 'Sarah Kaplan',
      hourlyRate: 15000,
      retainer: 500000,
      invoiceFrequency: 'monthly',
      paymentTerms: '30',
      performanceRating: 4.5,
      tags: ['M&A', 'Corporate', 'Restructuring'],
      createdAt: '2024-01-15',
      updatedAt: '2024-03-01',
      linkedEntities: ['Corporate Matters', 'Finance Department'],
      riskLevel: 'medium',
      invoices: [
        { date: '2024-02-01', amount: 450000, status: 'paid' },
        { date: '2024-03-01', amount: 520000, status: 'paid' },
        { date: '2024-04-01', amount: 480000, status: 'pending' }
      ],
      metrics: {
        costEfficiency: 0.74,
        timeToResolution: 120,
        clientSatisfaction: 4.5
      }
    },
    {
      id: '2',
      vendor: 'Intellectual Property Associates',
      type: 'Specialist Firm',
      description: 'Patent filing and IP portfolio management',
      matterType: 'Intellectual Property',
      startDate: '2023-10-01',
      endDate: '2024-12-31',
      budget: 1800000,
      actualSpend: 1200000,
      status: 'active',
      partner: 'David Mwangi',
      hourlyRate: 12000,
      retainer: 300000,
      invoiceFrequency: 'quarterly',
      paymentTerms: '15',
      performanceRating: 4.8,
      tags: ['IP', 'Patents', 'Trademarks'],
      createdAt: '2023-10-01',
      updatedAt: '2024-03-15',
      linkedEntities: ['IP Department', 'R&D Department'],
      riskLevel: 'low',
      invoices: [
        { date: '2024-01-01', amount: 350000, status: 'paid' },
        { date: '2024-04-01', amount: 380000, status: 'pending' }
      ],
      metrics: {
        costEfficiency: 0.67,
        timeToResolution: 90,
        clientSatisfaction: 4.8
      }
    },
    {
      id: '3',
      vendor: 'Employment Law Consultants',
      type: 'Boutique Firm',
      description: 'Employment disputes and HR compliance',
      matterType: 'Employment',
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      budget: 900000,
      actualSpend: 650000,
      status: 'on_hold',
      partner: 'Grace Wanjiku',
      hourlyRate: 8500,
      retainer: 150000,
      invoiceFrequency: 'monthly',
      paymentTerms: '30',
      performanceRating: 4.2,
      tags: ['Employment', 'HR', 'Disputes'],
      createdAt: '2024-02-01',
      updatedAt: '2024-03-10',
      linkedEntities: ['HR Department', 'Legal Department'],
      riskLevel: 'high',
      invoices: [
        { date: '2024-02-15', amount: 200000, status: 'paid' },
        { date: '2024-03-15', amount: 225000, status: 'overdue' }
      ],
      metrics: {
        costEfficiency: 0.72,
        timeToResolution: 150,
        clientSatisfaction: 4.2
      }
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setEngagements(sampleEngagements)
      setFilteredEngagements(sampleEngagements)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = engagements.filter(engagement => {
      const matchesSearch = engagement.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          engagement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          engagement.matterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          engagement.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = filterStatus === 'all' || engagement.status === filterStatus
      const matchesType = filterType === 'all' || engagement.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
    setFilteredEngagements(filtered)
  }, [searchTerm, filterStatus, filterType, engagements])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newEngagement: OutsourcingData = {
        id: editingEngagement?.id || Date.now().toString(),
        vendor: formData.vendor,
        type: formData.type as OutsourcingData['type'],
        description: formData.description,
        matterType: formData.matterType as OutsourcingData['matterType'],
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        status: formData.status as OutsourcingData['status'],
        partner: formData.partner || undefined,
        invoiceFrequency: formData.invoiceFrequency as OutsourcingData['invoiceFrequency'],
        paymentTerms: formData.paymentTerms,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        actualSpend: formData.actualSpend ? parseFloat(formData.actualSpend) : undefined,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
        retainer: formData.retainer ? parseFloat(formData.retainer) : undefined,
        performanceRating: formData.performanceRating ? parseFloat(formData.performanceRating) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: editingEngagement?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium',
        invoices: [],
        metrics: {
          costEfficiency: 0,
          timeToResolution: 0,
          clientSatisfaction: 0
        }
      }

      if (editingEngagement) {
        setEngagements(prev => prev.map(e => e.id === editingEngagement.id ? newEngagement : e))
      } else {
        setEngagements(prev => [...prev, newEngagement])
      }

      setShowForm(false)
      setEditingEngagement(null)
      setFormData({
        vendor: '',
        type: 'Law Firm',
        description: '',
        matterType: 'Corporate',
        startDate: '',
        endDate: '',
        budget: '',
        actualSpend: '',
        status: 'active',
        partner: '',
        hourlyRate: '',
        retainer: '',
        invoiceFrequency: 'monthly',
        paymentTerms: '30',
        performanceRating: '',
        tags: ''
      })
    } catch (error) {
      console.error('Error saving engagement:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (engagement: OutsourcingData) => {
    setEditingEngagement(engagement)
    setFormData({
      vendor: engagement.vendor,
      type: engagement.type,
      description: engagement.description,
      matterType: engagement.matterType,
      startDate: engagement.startDate,
      endDate: engagement.endDate || '',
      budget: engagement.budget?.toString() || '',
      actualSpend: engagement.actualSpend?.toString() || '',
      status: engagement.status,
      partner: engagement.partner || '',
      hourlyRate: engagement.hourlyRate?.toString() || '',
      retainer: engagement.retainer?.toString() || '',
      invoiceFrequency: engagement.invoiceFrequency,
      paymentTerms: engagement.paymentTerms,
      performanceRating: engagement.performanceRating?.toString() || '',
      tags: engagement.tags?.join(', ') || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this engagement?')) {
      setEngagements(prev => prev.filter(e => e.id !== id))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedEngagements.length === 0) return

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedEngagements.length} selected engagements?`)) {
          setEngagements(prev => prev.filter(e => !selectedEngagements.includes(e.id)))
          setSelectedEngagements([])
        }
        break
      case 'complete':
        setEngagements(prev => prev.map(e => 
          selectedEngagements.includes(e.id) ? { ...e, status: 'completed' } : e
        ))
        setSelectedEngagements([])
        break
    }
  }

  const handleImport = async (file: File) => {
    try {
      setLoading(true)
      const csvData = await parseCSV(file)
      const importedEngagements: OutsourcingData[] = csvData.map((row: any, index: number) => ({
        id: Date.now().toString() + index,
        vendor: row.vendor || '',
        type: (row.type || 'Law Firm') as OutsourcingData['type'],
        description: row.description || '',
        matterType: (row.matterType || 'Corporate') as OutsourcingData['matterType'],
        startDate: row.startDate || '',
        endDate: row.endDate || undefined,
        budget: row.budget ? parseFloat(row.budget) : undefined,
        actualSpend: row.actualSpend ? parseFloat(row.actualSpend) : undefined,
        status: (row.status || 'active') as OutsourcingData['status'],
        partner: row.partner || undefined,
        hourlyRate: row.hourlyRate ? parseFloat(row.hourlyRate) : undefined,
        retainer: row.retainer ? parseFloat(row.retainer) : undefined,
        invoiceFrequency: (row.invoiceFrequency || 'monthly') as OutsourcingData['invoiceFrequency'],
        paymentTerms: row.paymentTerms || '30',
        performanceRating: row.performanceRating ? parseFloat(row.performanceRating) : undefined,
        tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium' as const,
        invoices: [],
        metrics: {
          costEfficiency: 0,
          timeToResolution: 0,
          clientSatisfaction: 0
        }
      }))
      setEngagements(prev => [...prev, ...importedEngagements])
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    const dataToExport = selectedEngagements.length > 0 
      ? engagements.filter(e => selectedEngagements.includes(e.id))
      : filteredEngagements

    if (format === 'csv') {
      downloadCSV(dataToExport, 'outsourcing-spend-export.csv')
    } else {
      downloadPDF(dataToExport, 'Outsourcing & Legal Spend Report', 'outsourcing-spend-export.pdf')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'on_hold': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'cancelled': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const calculateTotalSpend = () => {
    return engagements.reduce((total, engagement) => total + (engagement.actualSpend || 0), 0)
  }

  const calculateTotalBudget = () => {
    return engagements.reduce((total, engagement) => total + (engagement.budget || 0), 0)
  }

  const getSpendEfficiency = () => {
    const totalSpend = calculateTotalSpend()
    const totalBudget = calculateTotalBudget()
    return totalBudget > 0 ? ((totalBudget - totalSpend) / totalBudget * 100) : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outsourcing & Legal Spend</h1>
          <p className="text-gray-600 mt-2">Manage external legal services, track spend, and optimize costs</p>
        </div>
        <div className="flex gap-3">
          <ImportExport
            onImport={handleImport}
            onExport={handleExport}
            selectedCount={selectedEngagements.length}
            totalCount={filteredEngagements.length}
          />
          <RoleBasedAccess requiredPermissions={['create_engagement']}>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Engagement
            </button>
          </RoleBasedAccess>
        </div>
      </div>

      {/* Spend Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spend</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(calculateTotalSpend())}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Efficiency</p>
              <p className="text-2xl font-semibold text-gray-900">
                {getSpendEfficiency().toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Engagements</p>
              <p className="text-2xl font-semibold text-gray-900">
                {engagements.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <PieChart className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(engagements.reduce((sum, e) => sum + (e.performanceRating || 0), 0) / engagements.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search engagements..."
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Law Firm">Law Firm</option>
            <option value="Specialist Firm">Specialist Firm</option>
            <option value="Boutique Firm">Boutique Firm</option>
            <option value="Consultant">Consultant</option>
          </select>
          <AISearch
            onSearch={(query) => setSearchTerm(query)}
            placeholder="AI-powered spend analysis..."
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEngagements.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedEngagements.length} engagements selected
            </span>
            <div className="flex gap-2">
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

      {/* Engagements List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading engagements...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEngagements.length === filteredEngagements.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEngagements(filteredEngagements.map(e => e.id))
                        } else {
                          setSelectedEngagements([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor & Matter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget vs Spend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEngagements.map((engagement) => (
                  <motion.tr
                    key={engagement.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEngagements.includes(engagement.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEngagements([...selectedEngagements, engagement.id])
                          } else {
                            setSelectedEngagements(selectedEngagements.filter(id => id !== engagement.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{engagement.vendor}</h3>
                          <p className="text-sm text-gray-500 mt-1">{engagement.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">{engagement.type}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{engagement.matterType}</span>
                            {engagement.partner && (
                              <>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">{engagement.partner}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">{formatCurrency(engagement.budget || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Spend:</span>
                          <span className="font-medium">{formatCurrency(engagement.actualSpend || 0)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              (engagement.actualSpend || 0) > (engagement.budget || 0) 
                                ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min(((engagement.actualSpend || 0) / (engagement.budget || 1)) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(engagement.status)}
                          <span className={`text-sm capitalize ${
                            engagement.status === 'active' ? 'text-green-600' :
                            engagement.status === 'completed' ? 'text-blue-600' :
                            engagement.status === 'on_hold' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {engagement.status.replace('_', ' ')}
                          </span>
                        </div>
                        {engagement.performanceRating && (
                          <div className="flex items-center space-x-1">
                            <span className={`text-sm font-medium ${getPerformanceColor(engagement.performanceRating)}`}>
                              ★ {engagement.performanceRating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">Start: {formatDate(engagement.startDate)}</p>
                        {engagement.endDate && (
                          <p className="text-gray-500">End: {formatDate(engagement.endDate)}</p>
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
                        <RoleBasedAccess requiredPermissions={['edit_engagement']}>
                          <button
                            onClick={() => handleEdit(engagement)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <RoleBasedAccess requiredPermissions={['delete_engagement']}>
                          <button
                            onClick={() => handleDelete(engagement.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <InterModuleLinkage
                          sourceModule="outsourcing"
                          sourceId={engagement.id}
                          linkedEntities={engagement.linkedEntities}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Engagement Form Modal */}
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
                {editingEngagement ? 'Edit Engagement' : 'Create New Engagement'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor/Firm Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Law Firm">Law Firm</option>
                      <option value="Specialist Firm">Specialist Firm</option>
                      <option value="Boutique Firm">Boutique Firm</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Service Provider">Service Provider</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matter Type *
                    </label>
                    <select
                      required
                      value={formData.matterType}
                      onChange={(e) => setFormData({ ...formData, matterType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Litigation">Litigation</option>
                      <option value="Employment">Employment</option>
                      <option value="Intellectual Property">Intellectual Property</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Tax">Tax</option>
                      <option value="Regulatory">Regulatory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner/Contact
                    </label>
                    <input
                      type="text"
                      value={formData.partner}
                      onChange={(e) => setFormData({ ...formData, partner: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget (KES) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actual Spend (KES)
                    </label>
                    <input
                      type="number"
                      value={formData.actualSpend}
                      onChange={(e) => setFormData({ ...formData, actualSpend: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (KES)
                    </label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retainer (KES)
                    </label>
                    <input
                      type="number"
                      value={formData.retainer}
                      onChange={(e) => setFormData({ ...formData, retainer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Frequency
                    </label>
                    <select
                      value={formData.invoiceFrequency}
                      onChange={(e) => setFormData({ ...formData, invoiceFrequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="project-based">Project-based</option>
                      <option value="as-incurred">As Incurred</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms (days)
                    </label>
                    <input
                      type="number"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
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
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., M&A, Corporate, Restructuring"
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
                    {loading ? 'Saving...' : (editingEngagement ? 'Update' : 'Create')} Engagement
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
