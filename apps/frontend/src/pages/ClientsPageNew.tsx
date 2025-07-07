import React, { useState } from 'react'
import { Plus, Search, User, Mail, Phone, MapPin, MoreVertical, Building, Users, DollarSign, Briefcase, Eye, Edit, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button, Card, Input, Badge, Modal } from '../components/ui/UIComponents'

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  type: 'individual' | 'business'
  status: 'active' | 'inactive' | 'prospect'
  createdAt: string
  lastContact: string
  totalMatters: number
  totalValue: number
  industry: string
  primaryContact: string
  tags: string[]
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Industries',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94105',
    type: 'business',
    status: 'active',
    createdAt: '2023-01-15',
    lastContact: '2024-01-10',
    totalMatters: 8,
    totalValue: 450000,
    industry: 'Technology',
    primaryContact: 'John Smith - CEO',
    tags: ['Fortune 500', 'Tech', 'Long-term']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Global Services LLC',
    email: 'sarah.j@globalservices.com',
    phone: '+1 (555) 234-5678',
    address: '456 Business Ave, New York, NY 10001',
    type: 'business',
    status: 'active',
    createdAt: '2023-03-20',
    lastContact: '2024-01-08',
    totalMatters: 3,
    totalValue: 125000,
    industry: 'Consulting',
    primaryContact: 'Sarah Johnson - Founder',
    tags: ['SMB', 'Consulting', 'Regular']
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: '',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 345-6789',
    address: '789 Residential St, Austin, TX 73301',
    type: 'individual',
    status: 'active',
    createdAt: '2023-06-10',
    lastContact: '2024-01-05',
    totalMatters: 2,
    totalValue: 35000,
    industry: 'Individual',
    primaryContact: 'Michael Brown',
    tags: ['Personal', 'Real Estate']
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'InnovaTech Solutions',
    email: 'emily.davis@innovatech.com',
    phone: '+1 (555) 456-7890',
    address: '321 Innovation Dr, Seattle, WA 98101',
    type: 'business',
    status: 'prospect',
    createdAt: '2024-01-01',
    lastContact: '2024-01-12',
    totalMatters: 0,
    totalValue: 0,
    industry: 'Software',
    primaryContact: 'Emily Davis - CTO',
    tags: ['Prospect', 'Software', 'AI']
  },
  {
    id: '5',
    name: 'Robert Wilson',
    company: 'Manufacturing Corp',
    email: 'r.wilson@mfgcorp.com',
    phone: '+1 (555) 567-8901',
    address: '654 Industrial Blvd, Detroit, MI 48201',
    type: 'business',
    status: 'inactive',
    createdAt: '2022-11-05',
    lastContact: '2023-08-15',
    totalMatters: 12,
    totalValue: 890000,
    industry: 'Manufacturing',
    primaryContact: 'Robert Wilson - VP Legal',
    tags: ['Manufacturing', 'Compliance', 'Completed']
  }
]

const statusConfig = {
  active: { color: 'success' as const, bgColor: 'bg-green-50' },
  inactive: { color: 'danger' as const, bgColor: 'bg-red-50' },
  prospect: { color: 'warning' as const, bgColor: 'bg-yellow-50' }
}

const typeConfig = {
  business: { icon: Building, color: 'primary' as const },
  individual: { icon: User, color: 'info' as const }
}

export function ClientsPageNew() {
  const [clients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    const matchesType = filterType === 'all' || client.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeIcon = (type: Client['type']) => {
    const IconComponent = typeConfig[type].icon
    return <IconComponent className="h-4 w-4" />
  }

  const totalClients = clients.length
  const activeClients = clients.filter(c => c.status === 'active').length
  const totalValue = clients.reduce((sum, client) => sum + client.totalValue, 0)
  const prospects = clients.filter(c => c.status === 'prospect').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Clients</h1>
          <p className="text-muted-600 mt-1">Manage your client relationships and contacts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </Button>
          <Button 
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Client</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Clients</p>
              <p className="text-2xl font-bold text-navy-900">{totalClients}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Active Clients</p>
              <p className="text-2xl font-bold text-navy-900">{activeClients}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Total Value</p>
              <p className="text-2xl font-bold text-navy-900">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-600">Prospects</p>
              <p className="text-2xl font-bold text-navy-900">{prospects}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 bg-white p-4 rounded-lg border border-light-300">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-500" />
            <Input
              type="text"
              placeholder="Search clients, companies, or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-light-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="business">Business</option>
              <option value="individual">Individual</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Clients Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div 
                  className="w-full h-full"
                  onClick={() => setSelectedClient(client)}
                >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${statusConfig[client.status].bgColor}`}>
                      {getTypeIcon(client.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900 text-sm">{client.name}</h3>
                      <p className="text-sm text-muted-600">{client.company || 'Individual'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant={statusConfig[client.status].color}>
                      {client.status}
                    </Badge>
                    <button className="p-1 text-muted-400 hover:text-muted-600 rounded-full hover:bg-light-200">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <Badge variant={typeConfig[client.type].color}>
                    {client.type}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-500" />
                    <span className="text-navy-900 truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-500" />
                    <span className="text-navy-900">{client.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-500" />
                    <span className="text-navy-900 text-xs line-clamp-1">{client.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-light-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-500">Matters:</span>
                      <span className="font-medium text-navy-900 ml-1">{client.totalMatters}</span>
                    </div>
                    <div>
                      <span className="text-muted-500">Value:</span>
                      <span className="font-medium text-navy-900 ml-1">{formatCurrency(client.totalValue)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-500">Last Contact:</span>
                      <span className="font-medium text-navy-900 ml-1">{formatDate(client.lastContact)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-1">
                    {client.tags.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="info" size="sm">
                        {tag}
                      </Badge>
                    ))}
                    {client.tags.length > 2 && (
                      <Badge variant="info" size="sm">
                        +{client.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-100 border-b border-light-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Matters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-600 uppercase tracking-wider">Last Contact</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-light-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-light-50 cursor-pointer"
                      onClick={() => setSelectedClient(client)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${statusConfig[client.status].bgColor} mr-3`}>
                          {getTypeIcon(client.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-navy-900">{client.name}</div>
                          <div className="text-sm text-muted-500">{client.company || 'Individual'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-navy-900">{client.email}</div>
                      <div className="text-sm text-muted-500">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={statusConfig[client.status].color}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={typeConfig[client.type].color}>
                        {client.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                      {client.totalMatters}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-900">
                      {formatCurrency(client.totalValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-900">
                      {formatDate(client.lastContact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-light-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-muted-400" />
          </div>
          <h3 className="text-lg font-medium text-navy-900 mb-2">No clients found</h3>
          <p className="text-muted-600 mb-6 max-w-md mx-auto">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search criteria or filters to find clients.'
              : 'Get started by adding your first client to manage relationships and contacts.'
            }
          </p>
          <Button 
            className="bg-primary-600 hover:bg-primary-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title={selectedClient.name}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant={statusConfig[selectedClient.status].color}>
                {selectedClient.status}
              </Badge>
              <Badge variant={typeConfig[selectedClient.type].color}>
                {selectedClient.type}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Company</label>
                <p className="text-navy-900">{selectedClient.company || 'Individual'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Industry</label>
                <p className="text-navy-900">{selectedClient.industry}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Email</label>
                <p className="text-navy-900">{selectedClient.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Phone</label>
                <p className="text-navy-900">{selectedClient.phone}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-muted-700 mb-1">Address</label>
                <p className="text-navy-900">{selectedClient.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Primary Contact</label>
                <p className="text-navy-900">{selectedClient.primaryContact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Client Since</label>
                <p className="text-navy-900">{formatDate(selectedClient.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Total Matters</label>
                <p className="text-navy-900 font-medium">{selectedClient.totalMatters}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Total Value</label>
                <p className="text-navy-900 font-medium">{formatCurrency(selectedClient.totalValue)}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {selectedClient.tags.map((tag, idx) => (
                  <Badge key={idx} variant="info">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-200">
              <Button variant="secondary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Client
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Eye className="h-4 w-4 mr-2" />
                View Matters
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add New Client"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Client Name</label>
                <Input placeholder="Enter client name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Client Type</label>
                <select className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option>Business</option>
                  <option>Individual</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Company</label>
                <Input placeholder="Company name (if applicable)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Industry</label>
                <Input placeholder="Industry or sector" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Email</label>
                <Input type="email" placeholder="client@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Phone</label>
                <Input type="tel" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1">Address</label>
              <Input placeholder="Full address" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Primary Contact</label>
                <Input placeholder="Primary contact person" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option>Active</option>
                  <option>Prospect</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-light-200">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button className="bg-primary-600 hover:bg-primary-700">
                Add Client
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
