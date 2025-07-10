import React, { useState } from 'react'
import { Link2, ExternalLink, Plus, X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface InterModuleLinkageProps {
  sourceModule: string
  sourceId: string
  linkedEntities?: string[]
  onLink?: (targetModule: string, targetId: string) => void
  onUnlink?: (targetModule: string, targetId: string) => void
}

export function InterModuleLinkage({ 
  sourceModule, 
  sourceId, 
  linkedEntities = [],
  onLink,
  onUnlink 
}: InterModuleLinkageProps) {
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for demonstration - in a real app, this would come from API
  const availableEntities = [
    { id: '1', name: 'Corporate Restructuring Matter', module: 'matters', type: 'Matter' },
    { id: '2', name: 'TechCorp Service Agreement', module: 'contracts', type: 'Contract' },
    { id: '3', name: 'Data Protection Risk Assessment', module: 'risks', type: 'Risk' },
    { id: '4', name: 'GDPR Privacy Policy', module: 'policies', type: 'Policy' },
    { id: '5', name: 'Software License Renewal', module: 'licenses', type: 'License' },
    { id: '6', name: 'Employment Dispute - John Doe', module: 'disputes', type: 'Dispute' },
    { id: '7', name: 'Client Onboarding Task', module: 'tasks', type: 'Task' },
    { id: '8', name: 'TechCorp Subsidiary Ltd', module: 'entities', type: 'Entity' },
    { id: '9', name: 'Contract Review Procedure', module: 'knowledge', type: 'Knowledge' },
  ]

  const filteredEntities = availableEntities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !linkedEntities.includes(entity.name) &&
    !(entity.module === sourceModule && entity.id === sourceId)
  )

  const getModuleIcon = (module: string) => {
    const icons = {
      entities: '🏢',
      contracts: '📄',
      disputes: '⚖️',
      matters: '💼',
      risks: '⚠️',
      policies: '🛡️',
      licenses: '📋',
      tasks: '✅',
      knowledge: '📚',
      outsourcing: '💰'
    }
    return icons[module as keyof typeof icons] || '📎'
  }

  const getModuleColor = (module: string) => {
    const colors = {
      entities: 'bg-blue-100 text-blue-700',
      contracts: 'bg-green-100 text-green-700',
      disputes: 'bg-red-100 text-red-700',
      matters: 'bg-purple-100 text-purple-700',
      risks: 'bg-orange-100 text-orange-700',
      policies: 'bg-indigo-100 text-indigo-700',
      licenses: 'bg-teal-100 text-teal-700',
      tasks: 'bg-yellow-100 text-yellow-700',
      knowledge: 'bg-pink-100 text-pink-700',
      outsourcing: 'bg-gray-100 text-gray-700'
    }
    return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const handleLink = (entity: any) => {
    onLink?.(entity.module, entity.id)
    setShowLinkMenu(false)
    setSearchQuery('')
  }

  const handleUnlink = (entityName: string) => {
    // Find the entity by name to get module and id
    const entity = availableEntities.find(e => e.name === entityName)
    if (entity) {
      onUnlink?.(entity.module, entity.id)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowLinkMenu(!showLinkMenu)}
        className="text-blue-600 hover:text-blue-800 relative"
        title="Link to other modules"
      >
        <Link2 className="w-4 h-4" />
        {linkedEntities.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
            {linkedEntities.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showLinkMenu && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowLinkMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-40"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Module Linkages</h3>
                  <button
                    onClick={() => setShowLinkMenu(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Current Links */}
                {linkedEntities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Linked Items</h4>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {linkedEntities.map((entityName, index) => {
                        const entity = availableEntities.find(e => e.name === entityName)
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                          >
                            <div className="flex items-center space-x-2">
                              <span>{entity ? getModuleIcon(entity.module) : '📎'}</span>
                              <span className="truncate">{entityName}</span>
                            </div>
                            <button
                              onClick={() => handleUnlink(entityName)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Search and Add Links */}
                <div>
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items to link..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {filteredEntities.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">
                        {searchQuery ? 'No matching items found' : 'Type to search for items to link'}
                      </p>
                    ) : (
                      filteredEntities.map((entity) => (
                        <button
                          key={`${entity.module}-${entity.id}`}
                          onClick={() => handleLink(entity)}
                          className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-left text-xs"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{getModuleIcon(entity.module)}</span>
                            <div>
                              <p className="font-medium text-gray-900 truncate">{entity.name}</p>
                              <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs ${getModuleColor(entity.module)}`}>
                                {entity.type}
                              </span>
                            </div>
                          </div>
                          <Plus className="w-3 h-3 text-blue-500" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
