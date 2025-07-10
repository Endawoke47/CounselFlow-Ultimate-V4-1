import React, { useState, useEffect } from 'react'
import { Award, Shield, Building, AlertTriangle, Upload, Download, Search, Filter, Plus, Edit, Trash2, Eye, Clock, CheckCircle, XCircle, Calendar, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LicenseData } from '../types/models'
import { formatDate } from '../utils/dateUtils'
import { downloadCSV, downloadPDF } from '../utils/exportUtils'
import { parseCSV } from '../utils/importUtils'
import { useAI } from '../services/aiService'
import { DocumentUpload } from '../components/ui/DocumentUpload'
import { AISearch } from '../components/ui/AISearch'
import { ImportExport } from '../components/ui/ImportExport'
import { RoleBasedAccess } from '../components/ui/RoleBasedAccess'
import { InterModuleLinkage } from '../components/ui/InterModuleLinkage'

export function LicensingRegulatoryPage() {
  const [licenses, setLicenses] = useState<LicenseData[]>([])
  const [filteredLicenses, setFilteredLicenses] = useState<LicenseData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingLicense, setEditingLicense] = useState<LicenseData | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([])
  const { generateComplianceReport, analyzeRegulatoryRequirements } = useAI()

  const [formData, setFormData] = useState({
    name: '',
    type: 'Business License',
    description: '',
    authority: '',
    licenseNumber: '',
    jurisdiction: '',
    issueDate: '',
    expiryDate: '',
    renewalDate: '',
    status: 'active',
    requirements: '',
    complianceStatus: 'compliant',
    documentUrl: '',
    cost: '',
    tags: ''
  })

  // Sample data
  const sampleLicenses: LicenseData[] = [
    {
      id: '1',
      name: 'Corporate Law Practice License',
      type: 'Professional License',
      description: 'License to practice corporate law in Kenya',
      authority: 'Law Society of Kenya',
      licenseNumber: 'LSK/CL/2024/001',
      jurisdiction: 'Kenya',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-14',
      renewalDate: '2024-11-15',
      status: 'active',
      requirements: ['Annual CLE requirements', 'Professional indemnity insurance', 'Good standing certificate'],
      complianceStatus: 'compliant',
      documentUrl: '/licenses/lsk-corporate-law-2024.pdf',
      cost: 50000,
      tags: ['Corporate Law', 'Professional', 'Kenya', 'LSK'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      linkedEntities: ['Legal Department', 'Corporate Matters'],
      riskLevel: 'high',
      autoRenewal: true,
      notifications: ['30 days before expiry', '7 days before expiry']
    },
    {
      id: '2',
      name: 'Data Protection Officer Registration',
      type: 'Regulatory Registration',
      description: 'Registration as Data Protection Officer with ODPC',
      authority: 'Office of the Data Protection Commissioner',
      licenseNumber: 'DPO/REG/2024/156',
      jurisdiction: 'Kenya',
      issueDate: '2024-02-01',
      expiryDate: '2025-01-31',
      renewalDate: '2024-12-01',
      status: 'active',
      requirements: ['DPO certification', 'Annual compliance report', 'Training certificates'],
      complianceStatus: 'compliant',
      documentUrl: '/licenses/dpo-registration-2024.pdf',
      cost: 25000,
      tags: ['Data Protection', 'GDPR', 'Privacy', 'ODPC'],
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01',
      linkedEntities: ['Privacy Department', 'Data Protection Policies'],
      riskLevel: 'high',
      autoRenewal: false,
      notifications: ['60 days before expiry']
    },
    {
      id: '3',
      name: 'Securities Dealing License',
      type: 'Financial License',
      description: 'License to deal in securities and investment advisory',
      authority: 'Capital Markets Authority',
      licenseNumber: 'CMA/SDL/2023/098',
      jurisdiction: 'Kenya',
      issueDate: '2023-06-15',
      expiryDate: '2024-06-14',
      renewalDate: '2024-04-15',
      status: 'renewal_required',
      requirements: ['Capital adequacy', 'Professional qualifications', 'Annual audited accounts'],
      complianceStatus: 'review_required',
      documentUrl: '/licenses/cma-securities-2023.pdf',
      cost: 150000,
      tags: ['Securities', 'Investment', 'CMA', 'Financial'],
      createdAt: '2023-06-15',
      updatedAt: '2024-03-01',
      linkedEntities: ['Finance Department', 'Investment Matters'],
      riskLevel: 'critical',
      autoRenewal: false,
      notifications: ['90 days before expiry', '30 days before expiry']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setLicenses(sampleLicenses)
      setFilteredLicenses(sampleLicenses)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = licenses.filter(license => {
      const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          license.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          license.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          license.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = filterStatus === 'all' || license.status === filterStatus
      const matchesType = filterType === 'all' || license.type === filterType
      return matchesSearch && matchesStatus && matchesType
    })
    setFilteredLicenses(filtered)
  }, [searchTerm, filterStatus, filterType, licenses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newLicense: LicenseData = {
        id: editingLicense?.id || Date.now().toString(),
        name: formData.name,
        type: formData.type as LicenseData['type'],
        description: formData.description,
        authority: formData.authority,
        licenseNumber: formData.licenseNumber,
        jurisdiction: formData.jurisdiction,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        renewalDate: formData.renewalDate || undefined,
        status: formData.status as LicenseData['status'],
        complianceStatus: formData.complianceStatus as LicenseData['complianceStatus'],
        documentUrl: formData.documentUrl || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        createdAt: editingLicense?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium',
        autoRenewal: false,
        notifications: []
      }

      if (editingLicense) {
        setLicenses(prev => prev.map(l => l.id === editingLicense.id ? newLicense : l))
      } else {
        setLicenses(prev => [...prev, newLicense])
      }

      setShowForm(false)
      setEditingLicense(null)
      setFormData({
        name: '',
        type: 'Business License',
        description: '',
        authority: '',
        licenseNumber: '',
        jurisdiction: '',
        issueDate: '',
        expiryDate: '',
        renewalDate: '',
        status: 'active',
        requirements: '',
        complianceStatus: 'compliant',
        documentUrl: '',
        cost: '',
        tags: ''
      })
    } catch (error) {
      console.error('Error saving license:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (license: LicenseData) => {
    setEditingLicense(license)
    setFormData({
      name: license.name,
      type: license.type,
      description: license.description,
      authority: license.authority,
      licenseNumber: license.licenseNumber,
      jurisdiction: license.jurisdiction,
      issueDate: license.issueDate,
      expiryDate: license.expiryDate,
      renewalDate: license.renewalDate || '',
      status: license.status,
      requirements: license.requirements?.join('\n') || '',
      complianceStatus: license.complianceStatus,
      documentUrl: license.documentUrl || '',
      cost: license.cost?.toString() || '',
      tags: license.tags?.join(', ') || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this license?')) {
      setLicenses(prev => prev.filter(l => l.id !== id))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedLicenses.length === 0) return

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedLicenses.length} selected licenses?`)) {
          setLicenses(prev => prev.filter(l => !selectedLicenses.includes(l.id)))
          setSelectedLicenses([])
        }
        break
      case 'renew':
        setLicenses(prev => prev.map(l => 
          selectedLicenses.includes(l.id) ? { ...l, status: 'renewal_required' as const } : l
        ))
        setSelectedLicenses([])
        break
    }
  }

  const handleImport = async (file: File) => {
    try {
      setLoading(true)
      const csvData = await parseCSV(file)
      const importedLicenses: LicenseData[] = csvData.map((row: any, index: number) => ({
        id: Date.now().toString() + index,
        name: row.name || '',
        type: (row.type || 'Business License') as LicenseData['type'],
        description: row.description || '',
        authority: row.authority || '',
        licenseNumber: row.licenseNumber || '',
        jurisdiction: row.jurisdiction || '',
        issueDate: row.issueDate || '',
        expiryDate: row.expiryDate || '',
        renewalDate: row.renewalDate || undefined,
        status: (row.status || 'active') as LicenseData['status'],
        requirements: row.requirements ? row.requirements.split(';') : [],
        complianceStatus: (row.complianceStatus || 'compliant') as LicenseData['complianceStatus'],
        documentUrl: row.documentUrl || undefined,
        cost: row.cost ? parseFloat(row.cost) : undefined,
        tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedEntities: [],
        riskLevel: 'medium' as const,
        autoRenewal: false,
        notifications: []
      }))
      setLicenses(prev => [...prev, ...importedLicenses])
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    const dataToExport = selectedLicenses.length > 0 
      ? licenses.filter(l => selectedLicenses.includes(l.id))
      : filteredLicenses

    if (format === 'csv') {
      downloadCSV(dataToExport, 'licenses-export.csv')
    } else {
      downloadPDF(dataToExport, 'Licenses Report', 'licenses-export.pdf')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'renewal_required': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />
      case 'suspended': return <XCircle className="w-4 h-4 text-red-500" />
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Licensing & Regulatory</h1>
          <p className="text-gray-600 mt-2">Manage licenses, permits, registrations, and regulatory compliance</p>
        </div>
        <div className="flex gap-3">
          <ImportExport
            onImport={handleImport}
            onExport={handleExport}
            selectedCount={selectedLicenses.length}
            totalCount={filteredLicenses.length}
          />
          <RoleBasedAccess requiredPermissions={['create_license']}>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New License
            </button>
          </RoleBasedAccess>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Licenses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {licenses.filter(l => l.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Renewal Required</p>
              <p className="text-2xl font-semibold text-gray-900">
                {licenses.filter(l => l.status === 'renewal_required').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-semibold text-gray-900">
                {licenses.filter(l => {
                  const days = getDaysUntilExpiry(l.expiryDate)
                  return days <= 30 && days > 0
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-semibold text-gray-900">
                {licenses.filter(l => l.status === 'expired').length}
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
              placeholder="Search licenses..."
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
            <option value="pending">Pending</option>
            <option value="renewal_required">Renewal Required</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Business License">Business License</option>
            <option value="Professional License">Professional License</option>
            <option value="Regulatory Registration">Regulatory Registration</option>
            <option value="Financial License">Financial License</option>
            <option value="Operating Permit">Operating Permit</option>
          </select>
          <AISearch
            onSearch={(query) => setSearchTerm(query)}
            placeholder="AI-powered license search..."
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLicenses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedLicenses.length} licenses selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('renew')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Initiate Renewal
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

      {/* Licenses List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading licenses...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLicenses.length === filteredLicenses.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLicenses(filteredLicenses.map(l => l.id))
                        } else {
                          setSelectedLicenses([])
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Authority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLicenses.map((license) => {
                  const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate)
                  return (
                    <motion.tr
                      key={license.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLicenses.includes(license.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLicenses([...selectedLicenses, license.id])
                            } else {
                              setSelectedLicenses(selectedLicenses.filter(id => id !== license.id))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <Award className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{license.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{license.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">{license.licenseNumber}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">{license.type}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{license.authority}</span>
                          <p className="text-sm text-gray-500">{license.jurisdiction}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(license.status)}
                          <span className={`text-sm capitalize ${
                            license.status === 'active' ? 'text-green-600' :
                            license.status === 'pending' ? 'text-yellow-600' :
                            license.status === 'renewal_required' ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {license.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{formatDate(license.expiryDate)}</p>
                          {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                            <p className="text-xs text-orange-600">
                              {daysUntilExpiry} days remaining
                            </p>
                          )}
                          {daysUntilExpiry <= 0 && (
                            <p className="text-xs text-red-600">Expired</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(license.complianceStatus)}`}>
                          {license.complianceStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(license.documentUrl, '_blank')}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <RoleBasedAccess requiredPermissions={['edit_license']}>
                            <button
                              onClick={() => handleEdit(license)}
                              className="text-green-600 hover:text-green-800"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </RoleBasedAccess>
                          <RoleBasedAccess requiredPermissions={['delete_license']}>
                            <button
                              onClick={() => handleDelete(license.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </RoleBasedAccess>
                          <InterModuleLinkage
                            sourceModule="licenses"
                            sourceId={license.id}
                            linkedEntities={license.linkedEntities}
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

      {/* License Form Modal */}
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
                {editingLicense ? 'Edit License' : 'Create New License'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Business License">Business License</option>
                      <option value="Professional License">Professional License</option>
                      <option value="Regulatory Registration">Regulatory Registration</option>
                      <option value="Financial License">Financial License</option>
                      <option value="Operating Permit">Operating Permit</option>
                      <option value="Environmental Permit">Environmental Permit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Licensing Authority *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.authority}
                      onChange={(e) => setFormData({ ...formData, authority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      License Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jurisdiction *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jurisdiction}
                      onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewal Date
                    </label>
                    <input
                      type="date"
                      value={formData.renewalDate}
                      onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="renewal_required">Renewal Required</option>
                      <option value="expired">Expired</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost (KES)
                    </label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
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
                    Requirements (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="e.g., Annual CLE requirements&#10;Professional indemnity insurance"
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
                    placeholder="e.g., Professional, Kenya, LSK"
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
                    {loading ? 'Saving...' : (editingLicense ? 'Update' : 'Create')} License
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
