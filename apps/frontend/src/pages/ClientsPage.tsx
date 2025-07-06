import React, { useState } from 'react'
import { Plus, Search, User, Mail, Phone, MapPin, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  type: 'individual' | 'business'
  status: 'active' | 'inactive'
  createdAt: string
  lastContact: string
  totalMatters: number
  totalValue: number
}

export function ClientsPage() {
  const [clients] = useState<Client[]>([
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
      totalValue: 450000
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
      totalValue: 125000
    },
    {
      id: '3',
      name: 'Michael Chen',
      company: 'Innovation Labs',
      email: 'michael.chen@innovationlabs.com',
      phone: '+1 (555) 345-6789',
      address: '789 Innovation Drive, Austin, TX 78701',
      type: 'business',
      status: 'active',
      createdAt: '2023-06-10',
      lastContact: '2024-01-05',
      totalMatters: 5,
      totalValue: 275000
    },
    {
      id: '4',
      name: 'Emily Davis',
      company: 'Metro Holdings',
      email: 'emily.davis@metroholdings.com',
      phone: '+1 (555) 456-7890',
      address: '321 Metro Plaza, Chicago, IL 60601',
      type: 'business',
      status: 'inactive',
      createdAt: '2023-02-28',
      lastContact: '2023-12-15',
      totalMatters: 2,
      totalValue: 85000
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || client.type === filterType
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client relationships</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Client</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-semibold">{getInitials(client.name)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.company}</p>
                </div>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {client.status}
              </span>
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {client.type}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{client.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{client.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-600 text-xs">{client.address}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Matters</p>
                  <p className="font-semibold">{client.totalMatters}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Value</p>
                  <p className="font-semibold">${client.totalValue.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>Created: {formatDate(client.createdAt)}</p>
                <p>Last Contact: {formatDate(client.lastContact)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first client'
            }
          </p>
          <button className="btn-primary flex items-center space-x-2 mx-auto">
            <Plus className="h-4 w-4" />
            <span>New Client</span>
          </button>
        </div>
      )}
    </div>
  )
}