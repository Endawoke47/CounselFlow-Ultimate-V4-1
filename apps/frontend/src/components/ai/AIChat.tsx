import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader, Copy, ThumbsUp, ThumbsDown, MoreVertical, Zap, FileText, Scale, Shield, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '../../contexts/AIContext'
import { AIResponse } from '../../services/ai/types'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  metadata?: AIResponse['metadata']
  provider?: string
  confidence?: number
}

interface AIChatProps {
  context?: string
  mode?: 'chat' | 'research' | 'contract' | 'analysis'
  onActionRequest?: (action: string, data: any) => void
}

export function AIChat({ context, mode = 'chat', onActionRequest }: AIChatProps) {
  const { aiService, isLoading, error, currentProvider, setProvider, availableProviders } = useAI()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: getWelcomeMessage(mode),
        timestamp: new Date().toISOString()
      }])
    }
  }, [mode])

  const getWelcomeMessage = (chatMode: string) => {
    switch (chatMode) {
      case 'research':
        return "Hello! I'm your legal research assistant. I can help you find case law, analyze precedents, and research legal questions. What would you like to research?"
      case 'contract':
        return "Hi! I'm here to help with contract drafting and analysis. I can draft new contracts, review existing ones, or suggest improvements. What contract work do you need?"
      case 'analysis':
        return "Welcome! I specialize in legal document analysis and risk assessment. Upload a document or describe what you'd like me to analyze."
      default:
        return "Hello! I'm CounselFlow AI, your comprehensive legal assistant. I can help with legal research, contract drafting, document analysis, risk assessment, and general legal questions. How can I assist you today?"
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await aiService.chatWithAI(inputValue, context)
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: response.timestamp,
        metadata: response.metadata,
        provider: response.provider,
        confidence: response.confidence
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleQuickAction = async (action: string) => {
    const actions = {
      'draft-nda': 'Draft a standard non-disclosure agreement for a technology company',
      'research-precedent': 'Find recent precedents for software licensing disputes',
      'analyze-risk': 'Analyze the legal risks in this situation',
      'compliance-check': 'Check compliance requirements for data privacy'
    }

    if (actions[action as keyof typeof actions]) {
      setInputValue(actions[action as keyof typeof actions])
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-lg">
            <Brain size={24} className="text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">CounselFlow AI</h3>
            <p className="text-sm text-gray-500">
              {mode === 'chat' ? 'Legal Assistant' : 
               mode === 'research' ? 'Legal Research' :
               mode === 'contract' ? 'Contract Expert' : 'Document Analysis'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={currentProvider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            {availableProviders.map(provider => (
              <option key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </option>
            ))}
          </select>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('draft-nda')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 rounded-lg hover:from-cyan-100 hover:to-teal-100 transition-all"
          >
            <FileText size={16} />
            Draft NDA
          </button>
          <button
            onClick={() => handleQuickAction('research-precedent')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all"
          >
            <Scale size={16} />
            Research
          </button>
          <button
            onClick={() => handleQuickAction('analyze-risk')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 rounded-lg hover:from-orange-100 hover:to-red-100 transition-all"
          >
            <Shield size={16} />
            Risk Analysis
          </button>
          <button
            onClick={() => handleQuickAction('compliance-check')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all"
          >
            <Zap size={16} />
            Compliance
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  {message.type === 'ai' && message.confidence && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                      {message.provider && (
                        <span>• {message.provider}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy message"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Good response"
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Poor response"
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-1">
                <Loader className="animate-spin" size={16} />
                <span className="text-sm text-gray-600 ml-2">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything legal..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              disabled={isTyping}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}