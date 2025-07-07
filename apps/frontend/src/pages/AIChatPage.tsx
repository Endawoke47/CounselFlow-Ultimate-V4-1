import React, { useState } from 'react'
import { Brain, MessageSquare, FileText, Scale, Shield, Search, Zap, BarChart3, Target, Users, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { AIChat } from '../components/ai/AIChat'
import { useAI } from '../contexts/AIContext'

export function AIChatPage() {
  const { currentProvider, availableProviders, providerStatus, setProvider } = useAI()
  const [chatMode, setChatMode] = useState<'chat' | 'research' | 'contract' | 'analysis'>('chat')
  const [showSettings, setShowSettings] = useState(false)

  const chatModes = [
    {
      key: 'chat' as const,
      name: 'General Assistant',
      description: 'Comprehensive legal assistance and Q&A',
      icon: MessageSquare,
      color: 'from-cyan-500 to-teal-500'
    },
    {
      key: 'research' as const,
      name: 'Legal Research',
      description: 'Case law, precedents, and legal analysis',
      icon: Search,
      color: 'from-blue-500 to-purple-500'
    },
    {
      key: 'contract' as const,
      name: 'Contract Expert',
      description: 'Contract drafting, review, and negotiation',
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'analysis' as const,
      name: 'Document Analysis',
      description: 'Risk assessment and document review',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="px-4 lg:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Legal Assistant</h1>
          <p className="text-gray-600 mt-2">Powered by advanced AI for comprehensive legal support</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Current Provider: <span className="font-medium text-gray-900">{currentProvider}</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all"
          >
            <Settings size={20} />
            Settings
          </button>
        </div>
      </div>

      {/* AI Provider Settings */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Provider Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableProviders.map(provider => (
              <div
                key={provider}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  currentProvider === provider
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setProvider(provider)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 capitalize">{provider}</h4>
                  <div className={`w-3 h-3 rounded-full ${
                    providerStatus[provider] ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
                <p className="text-sm text-gray-600">
                  {providerStatus[provider] ? 'Available' : 'Requires configuration'}
                </p>
                {currentProvider === provider && (
                  <div className="mt-2 text-xs text-cyan-600 font-medium">Currently Active</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mode Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose AI Assistant Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chatModes.map((mode, index) => {
            const IconComponent = mode.icon
            return (
              <motion.div
                key={mode.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  chatMode === mode.key
                    ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-teal-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setChatMode(mode.key)}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center mb-3`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{mode.name}</h4>
                <p className="text-sm text-gray-600">{mode.description}</p>
                {chatMode === mode.key && (
                  <div className="mt-3 text-xs text-cyan-600 font-medium">Active Mode</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* AI Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <Brain size={24} />
            <h3 className="text-lg font-semibold">Legal Research</h3>
          </div>
          <ul className="space-y-2 text-sm text-cyan-100">
            <li>• Case law analysis</li>
            <li>• Regulatory research</li>
            <li>• Precedent identification</li>
            <li>• Legal trend analysis</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <FileText size={24} />
            <h3 className="text-lg font-semibold">Document Drafting</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>• Contract generation</li>
            <li>• Legal memo drafting</li>
            <li>• Policy creation</li>
            <li>• Template customization</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield size={24} />
            <h3 className="text-lg font-semibold">Risk Analysis</h3>
          </div>
          <ul className="space-y-2 text-sm text-green-100">
            <li>• Compliance assessment</li>
            <li>• Risk identification</li>
            <li>• Impact analysis</li>
            <li>• Mitigation strategies</li>
          </ul>
        </motion.div>
      </div>

      {/* Chat Interface */}
      <div className="h-[600px]">
        <AIChat mode={chatMode} />
      </div>
    </div>
  )
}