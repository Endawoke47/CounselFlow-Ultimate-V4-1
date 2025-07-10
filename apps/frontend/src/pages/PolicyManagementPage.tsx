import React, { useState, useEffect } from 'react'
import { FileText, Shield, AlertTriangle, Upload, Download, Search, Filter, Plus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Users, Building, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PolicyData } from '../types/models'
import { formatDate } from '../utils/dateUtils'
import { downloadCSV, downloadPDF } from '../utils/exportUtils'
import { parseCSV } from '../utils/importUtils'
import { useAI } from '../services/aiService'
import { DocumentUpload } from '../components/ui/DocumentUpload'
import { AISearch } from '../components/ui/AISearch'
import { ImportExport } from '../components/ui/ImportExport'
import { RoleBasedAccess } from '../components/ui/RoleBasedAccess'
import { InterModuleLinkage } from '../components/ui/InterModuleLinkage'

export function PolicyManagementPage() {
  const [policies, setPolicies] = useState<PolicyData[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<PolicyData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<PolicyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const { generatePolicyDraft, reviewPolicyCompliance } = useAI()

  const [formData, setFormData] = useState({
    title: '',
    type: 'Corporate Policy',
    description: '',
    category: 'Governance',
    version: '1.0',
    effectiveDate: '',
    expiryDate: '',
    approver: '',
    department: '',
    compliance: 'pending',
    documentUrl: '',
    tags: ''
  })

  // Sample data
  const samplePolicies: PolicyData[] = [
    {
      id: '1',
      title: 'Data Privacy and Protection Policy',
      type: 'Privacy Policy',
      description: 'Comprehensive data protection policy covering GDPR and local privacy laws',
      category: 'Data Protection',
      version: '2.1',
      status: 'active',
      effectiveDate: '2024-01-01',
      expiryDate: '2025-12-31',
      approver: 'Chief Privacy Officer',
      department: 'Legal',
      compliance: 'compliant',
      documentUrl: '/policies/data-privacy-v2.1.pdf',
      tags: ['GDPR', 'Privacy', 'Data Protection', 'Compliance'],
      createdAt: '2023-12-15',
      updatedAt: '2024-01-01',
      linkedEntities: ['Legal Department', 'IT Department', 'HR Department'],
      riskLevel: 'high'
    },
    {
      id: '2',
      title: 'Code of Business Conduct',
      type: 'Ethical Policy',
      description: 'Ethical guidelines and code of conduct for all employees',
      category: 'Ethics',
      version: '3.0',
      status: 'active',
      effectiveDate: '2024-02-01',
      expiryDate: '2026-01-31',
      approver: 'Chief Executive Officer',
      department: 'Human Resources',
      compliance: 'compliant',
      documentUrl: '/policies/code-of-conduct-v3.0.pdf',
      tags: ['Ethics', 'Conduct', 'Compliance', 'Employee Guidelines'],
      createdAt: '2024-01-15',
      updatedAt: '2024-02-01',
      linkedEntities: ['All Departments', 'Board of Directors'],
      riskLevel: 'medium'
    },
    {
      id: '3',
      title: 'Anti-Money Laundering Policy',
      type: 'Compliance Policy',
      description: 'AML policy and procedures for financial crime prevention',
      category: 'Financial Crime',
      version: '1.5',
      status: 'review',
      effectiveDate: '2023-06-01',
      expiryDate: '2024-05-31',
      approver: 'Chief Compliance Officer',
      department: 'Compliance',
      compliance: 'review_required',
      documentUrl: '/policies/aml-policy-v1.5.pdf',
      tags: ['AML', 'Financial Crime', 'Due Diligence', 'KYC'],
      createdAt: '2023-05-15',
      updatedAt: '2023-12-01',
      linkedEntities: ['Finance Department', 'Legal Department'],
      riskLevel: 'high'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setPolicies(samplePolicies)
      setFilteredPolicies(samplePolicies)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = policies.filter(policy => {
      const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = filterStatus === 'all' || policy.status === filterStatus
      const matchesType = filterType === 'all' || policy.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
    setFilteredPolicies(filtered)
  }, [searchTerm, filterStatus, filterType, policies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newPolicy: PolicyData = {
        id: editingPolicy?.id || Date.now().toString(),
        title: formData.title,
        type: formData.type as PolicyData['type'],
        description: formData.description,
        category: formData.category as PolicyData['category'],
        version: formData.version,
        effectiveDate: formData.effectiveDate,
        expiryDate: formData.expiryDate || undefined,
        approver: formData.approver,
        department: formData.department,
        compliance: formData.compliance as PolicyData['compliance'],
        documentUrl: formData.documentUrl || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'draft',
        createdAt: editingPolicy?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium'
      }

      if (editingPolicy) {
        setPolicies(prev => prev.map(p => p.id === editingPolicy.id ? newPolicy : p))
      } else {
        setPolicies(prev => [...prev, newPolicy])
      }

      setShowForm(false)
      setEditingPolicy(null)
      setFormData({
        title: '',
        type: 'Corporate Policy',
        description: '',
        category: 'Governance',
        version: '1.0',
        effectiveDate: '',
        expiryDate: '',
        approver: '',
        department: '',
        compliance: 'pending',
        documentUrl: '',
        tags: ''
      })
    } catch (error) {
      console.error('Error saving policy:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (policy: PolicyData) => {
    setEditingPolicy(policy)
    setFormData({
      title: policy.title,
      type: policy.type,
      description: policy.description,
      category: policy.category,
      version: policy.version,
      effectiveDate: policy.effectiveDate,
      expiryDate: policy.expiryDate || '',
      approver: policy.approver,
      department: policy.department,
      compliance: policy.compliance,
      documentUrl: policy.documentUrl || '',
      tags: policy.tags?.join(', ') || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      setPolicies(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedPolicies.length === 0) return

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedPolicies.length} selected policies?`)) {
          setPolicies(prev => prev.filter(p => !selectedPolicies.includes(p.id)))
          setSelectedPolicies([])
        }
        break
      case 'activate':
        setPolicies(prev => prev.map(p => 
          selectedPolicies.includes(p.id) ? { ...p, status: 'active' } : p
        ))
        setSelectedPolicies([])
        break
      case 'review':
        setPolicies(prev => prev.map(p => 
          selectedPolicies.includes(p.id) ? { ...p, status: 'review' } : p
        ))
        setSelectedPolicies([])
        break
    }
  }

  const handleImport = async (file: File) => {
    try {
      setLoading(true)
      const csvData = await parseCSV(file)
      const importedPolicies: PolicyData[] = csvData.map((row: any, index: number) => ({
        id: Date.now().toString() + index,
        title: row.title || '',
        type: (row.type || 'Corporate Policy') as PolicyData['type'],
        description: row.description || '',
        category: (row.category || 'Governance') as PolicyData['category'],
        version: row.version || '1.0',
        status: (row.status || 'draft') as PolicyData['status'],
        effectiveDate: row.effectiveDate || '',
        expiryDate: row.expiryDate || undefined,
        approver: row.approver || '',
        department: row.department || '',
        compliance: (row.compliance || 'pending') as PolicyData['compliance'],
        documentUrl: row.documentUrl || undefined,
        tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium' as const
      }))
      setPolicies(prev => [...prev, ...importedPolicies])
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    const dataToExport = selectedPolicies.length > 0 
      ? policies.filter(p => selectedPolicies.includes(p.id))
      : filteredPolicies

    if (format === 'csv') {
      downloadCSV(dataToExport, 'policies-export.csv')
    } else {
      downloadPDF(dataToExport, 'Policies Report', 'policies-export.pdf')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'draft': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'review': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'bg-green-100 text-green-800'
      case 'non_compliant': return 'bg-red-100 text-red-800'
      case 'review_required': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600 mt-2">Manage corporate policies, procedures, and compliance documentation</p>
        </div>
        <div className="flex gap-3">
          <ImportExport
            onImport={handleImport}
            onExport={handleExport}
            selectedCount={selectedPolicies.length}
            totalCount={filteredPolicies.length}
          />
          <RoleBasedAccess requiredPermissions={['create_policy']}>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Policy
            </button>
          </RoleBasedAccess>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies..."
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
            <option value="draft">Draft</option>
            <option value="review">Under Review</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Corporate Policy">Corporate Policy</option>
            <option value="Privacy Policy">Privacy Policy</option>
            <option value="Compliance Policy">Compliance Policy</option>
            <option value="Ethical Policy">Ethical Policy</option>
          </select>
          <AISearch
            onSearch={(query) => setSearchTerm(query)}
            placeholder="AI-powered policy search..."
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPolicies.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedPolicies.length} policies selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('review')}
                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                Mark for Review
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

      {/* Policies List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading policies...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPolicies.length === filteredPolicies.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPolicies(filteredPolicies.map(p => p.id))
                        } else {
                          setSelectedPolicies([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Policy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <motion.tr
                    key={policy.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPolicies.includes(policy.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPolicies([...selectedPolicies, policy.id])
                          } else {
                            setSelectedPolicies(selectedPolicies.filter(id => id !== policy.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{policy.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">v{policy.version}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{policy.department}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{policy.type}</span>
                        <p className="text-sm text-gray-500">{policy.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(policy.status)}
                        <span className={`text-sm capitalize ${
                          policy.status === 'active' ? 'text-green-600' :
                          policy.status === 'draft' ? 'text-yellow-600' :
                          policy.status === 'review' ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {policy.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(policy.compliance)}`}>
                        {policy.compliance.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(policy.effectiveDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(policy.documentUrl, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <RoleBasedAccess requiredPermissions={['edit_policy']}>
                          <button
                            onClick={() => handleEdit(policy)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <RoleBasedAccess requiredPermissions={['delete_policy']}>
                          <button
                            onClick={() => handleDelete(policy.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </RoleBasedAccess>
                        <InterModuleLinkage
                          sourceModule="policies"
                          sourceId={policy.id}
                          linkedEntities={policy.linkedEntities}
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

      {/* Policy Form Modal */}
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
                {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Title *
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
                      Policy Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Corporate Policy">Corporate Policy</option>
                      <option value="Privacy Policy">Privacy Policy</option>
                      <option value="Compliance Policy">Compliance Policy</option>
                      <option value="Ethical Policy">Ethical Policy</option>
                      <option value="Security Policy">Security Policy</option>
                      <option value="HR Policy">HR Policy</option>
                    </select>
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
                      <option value="Governance">Governance</option>
                      <option value="Data Protection">Data Protection</option>
                      <option value="Ethics">Ethics</option>
                      <option value="Financial Crime">Financial Crime</option>
                      <option value="Security">Security</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effective Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approver *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.approver}
                      onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                    Document URL
                  </label>
                  <input
                    type="url"
                    value={formData.documentUrl}
                    onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
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
                    placeholder="e.g., GDPR, Privacy, Compliance"
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
                    {loading ? 'Saving...' : (editingPolicy ? 'Update' : 'Create')} Policy
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
