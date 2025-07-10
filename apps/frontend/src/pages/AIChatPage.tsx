import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Loader2, RefreshCw, Copy, ThumbsUp, ThumbsDown, Settings, Zap, Brain } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiApi } from '../services/api'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
  provider?: string
  model?: string
  usage?: any
}

interface ProviderStatus {
  currentProvider: string
  available: {
    openai: boolean
    deepseek: boolean
    mock: boolean
  }
  models: {
    openai: string
    deepseek: string
  }
}

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Flow, your AI Legal Assistant powered by advanced generative AI. I specialize in legal research, contract drafting, document analysis, and providing strategic legal guidance. I'm now connected to powerful AI models and ready to provide comprehensive assistance. How can I help you with your legal practice today?",
      timestamp: new Date(),
      provider: 'flow-ai',
      model: 'legal-assistant'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null)
  const [showProviderSettings, setShowProviderSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load provider status on component mount
  useEffect(() => {
    loadProviderStatus()
  }, [])

  const loadProviderStatus = async () => {
    try {
      const response = await aiApi.getProviderStatus()
      setProviderStatus(response.data)
    } catch (error) {
      console.error('Failed to load provider status:', error)
    }
  }

  const switchProvider = async (provider: 'openai' | 'deepseek' | 'mock') => {
    try {
      await aiApi.switchProvider(provider)
      await loadProviderStatus()
      toast.success(`Switched to ${provider.toUpperCase()} provider`)
      
      // Add system message about provider switch
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I've switched to the ${provider.toUpperCase()} AI provider. I'm now powered by ${provider === 'openai' ? 'OpenAI GPT models' : provider === 'deepseek' ? 'DeepSeek AI models' : 'mock responses'} and ready to assist you with enhanced capabilities!`,
        timestamp: new Date(),
        provider: provider,
        model: provider === 'openai' ? 'gpt-4o' : provider === 'deepseek' ? 'deepseek-chat' : 'mock'
      }
      setMessages(prev => [...prev, systemMessage])
    } catch (error) {
      toast.error('Failed to switch provider')
      console.error('Provider switch error:', error)
    }
  }

  // Quick action templates
  const quickActions = [
    {
      title: "Draft NDA",
      prompt: "Help me draft a comprehensive Non-Disclosure Agreement for a technology company",
      icon: "📄",
      color: "bg-primary"
    },
    {
      title: "Research Case Law",
      prompt: "I need help researching case law about employment contracts and non-compete clauses",
      icon: "🔍",
      color: "bg-info"
    },
    {
      title: "Analyze Contract",
      prompt: "Please analyze this contract for potential risks and suggest improvements",
      icon: "📊",
      color: "bg-warning"
    },
    {
      title: "Legal Strategy",
      prompt: "I need strategic advice for a complex litigation matter involving intellectual property",
      icon: "⚖️",
      color: "bg-accent-purple"
    }
  ]

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'ai',
      content: 'Flow is thinking...',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      // Prepare conversation history (last 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      const response = await aiApi.chat(userMessage.content, undefined, conversationHistory)
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.message,
        timestamp: new Date(),
        provider: response.data.provider,
        model: response.data.model,
        usage: response.data.usage
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Show success toast with provider info
      if (response.data.provider !== 'mock') {
        toast.success(`Response from ${response.data.provider?.toUpperCase()} AI`)
      }
    } catch (error) {
      console.error('AI chat error:', error)
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      
      // Enhanced fallback responses based on message content
      let fallbackResponse = "I'm Flow, and I'm currently operating in offline mode. However, I can still provide helpful legal guidance based on my training.";
      
      const userInput = userMessage.content.toLowerCase();
      
      if (userInput.includes('contract') || userInput.includes('agreement')) {
        fallbackResponse = `I'm Flow, your AI Legal Assistant. While I'm experiencing connectivity issues, I can offer some general guidance on contracts:

📋 **Key Contract Elements to Review:**
• Parties and their obligations
• Payment terms and deadlines  
• Termination clauses
• Liability and indemnification
• Dispute resolution mechanisms
• Governing law provisions

⚠️ **Common Red Flags:**
• Unlimited liability exposure
• Vague performance standards
• Automatic renewal without notice
• One-sided termination rights

💡 **Recommendation:** For detailed contract analysis, please try again in a moment when my full AI capabilities are restored.`;
      } else if (userInput.includes('research') || userInput.includes('case law')) {
        fallbackResponse = `I'm Flow, your AI Legal Research Assistant. Here's general guidance for legal research:

🔍 **Research Strategy:**
• Start with primary sources (statutes, cases)
• Use secondary sources for context
• Check for recent updates and amendments
• Consider jurisdictional differences

📚 **Key Databases:**
• Westlaw, Lexis, Bloomberg Law
• Google Scholar for free access
• Court websites for recent decisions
• Bar association resources

⏰ **Research Tips:**
• Use Boolean search operators
• Check citation validity
• Review headnotes and summaries
• Note circuit splits or conflicts

🤖 **Note:** I'll provide more specific research assistance when my full AI capabilities are restored.`;
      } else if (userInput.includes('draft') || userInput.includes('document')) {
        fallbackResponse = `I'm Flow, your AI Document Drafting Assistant. Here are general drafting principles:

✍️ **Professional Drafting Guidelines:**
• Use clear, unambiguous language
• Define all technical terms
• Organize content logically
• Include necessary disclaimers

📝 **Common Document Types:**
• Non-disclosure agreements
• Service agreements
• Employment contracts
• Privacy policies
• Terms of service

🎯 **Best Practices:**
• Tailor to specific jurisdiction
• Include dispute resolution clauses
• Specify governing law
• Regular review and updates

🤖 **For Custom Document Generation:** Please try again when my AI capabilities are fully operational.`;
      } else if (userInput.includes('litigation') || userInput.includes('dispute')) {
        fallbackResponse = `I'm Flow, your AI Litigation Assistant. Here's general dispute resolution guidance:

⚖️ **Litigation Strategy Basics:**
• Assess strength of claims/defenses
• Evaluate potential damages
• Consider alternative dispute resolution
• Analyze cost-benefit of proceeding

📋 **Pre-Litigation Checklist:**
• Preserve all relevant documents
• Interview key witnesses
• Research applicable law
• Calculate damages accurately

🤝 **Settlement Considerations:**
• Costs of continued litigation
• Probability of success
• Collectibility of judgment
• Business relationship preservation

🤖 **For Case-Specific Analysis:** Please reconnect when my full AI capabilities are available.`;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date(),
        provider: 'offline-mode'
      }
      
      setMessages(prev => [...prev, aiMessage])
      toast.error('AI temporarily unavailable - using offline guidance')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: "Hello! I'm Flow, your AI Legal Assistant. I specialize in legal research, contract drafting, document analysis, and providing strategic legal guidance. How can I assist you with your legal practice today?",
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="px-4 lg:px-6 bg-gradient-to-br from-teal-50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
                Flow - AI Legal Assistant
              </h1>
              <p className="text-teal-600 mt-2 text-lg font-medium">
                Your intelligent legal partner for research, drafting, and analysis
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setShowProviderSettings(!showProviderSettings)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="h-4 w-4" />
              <span>AI Settings</span>
            </motion.button>
            <motion.button
              onClick={clearChat}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear Chat</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-teal-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                className={`bg-white/80 backdrop-blur-sm border border-teal-200/50 text-teal-700 p-4 rounded-xl hover:bg-teal-50 transition-all duration-200 shadow-lg group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm font-medium">{action.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* AI Provider Settings Panel */}
        <AnimatePresence>
          {showProviderSettings && providerStatus && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-teal-800 flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>AI Provider Settings</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${providerStatus.currentProvider !== 'mock' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm font-medium text-teal-600">
                      {providerStatus.currentProvider.toUpperCase()} Active
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(providerStatus.available).map(([provider, available]) => (
                    <motion.button
                      key={provider}
                      onClick={() => available && switchProvider(provider as any)}
                      disabled={!available || providerStatus.currentProvider === provider}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        providerStatus.currentProvider === provider
                          ? 'bg-teal-100 border-teal-300 text-teal-800'
                          : available
                          ? 'bg-white border-gray-200 text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                          : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={available ? { scale: 1.02 } : {}}
                      whileTap={available ? { scale: 0.98 } : {}}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          {provider === 'openai' && <Zap className="h-5 w-5" />}
                          {provider === 'deepseek' && <Brain className="h-5 w-5" />}
                          {provider === 'mock' && <Settings className="h-5 w-5" />}
                          <span className="font-medium capitalize">{provider}</span>
                        </div>
                        <div className="text-xs text-center">
                          {provider === 'openai' && 'GPT-4o Model'}
                          {provider === 'deepseek' && 'DeepSeek Chat'}
                          {provider === 'mock' && 'Demo Mode'}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-700">
                    <strong>Current Model:</strong> {
                      providerStatus.currentProvider === 'openai' 
                        ? providerStatus.models.openai 
                        : providerStatus.currentProvider === 'deepseek'
                        ? providerStatus.models.deepseek
                        : 'Demo Mode'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Container */}
      <motion.div 
        className="flex-1 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-teal-200/50 flex flex-col overflow-hidden mb-6">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                    <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white' 
                          : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <span className="font-bold text-sm">F</span>
                        )}
                      </div>
                    </div>
                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block px-4 py-3 rounded-xl shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                          : 'bg-teal-50/80 text-teal-900 border border-teal-200'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-teal-500">
                          {message.type === 'ai' ? 'Flow' : 'You'} • {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'ai' && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => copyToClipboard(message.content)}
                              className="text-teal-500 hover:text-teal-700 p-1 rounded transition-colors"
                              title="Copy message"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              className="text-teal-500 hover:text-green-600 p-1 rounded transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            <button
                              className="text-teal-500 hover:text-red-600 p-1 rounded transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm">
                    <span className="font-bold text-sm">F</span>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 px-4 py-3 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                      <span className="text-teal-600 text-sm">Flow is thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-teal-200 p-6 bg-gradient-to-r from-teal-50/30 to-cyan-50/30">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about legal matters, contract analysis, research, or anything else..."
                  className="w-full px-4 py-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none bg-white/50 backdrop-blur-sm"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <motion.button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Send</span>
              </motion.button>
            </form>
            <p className="text-xs text-teal-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Suggestions */}
        <motion.div 
          className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            "Help me review this contract for potential risks",
            "What are the key legal considerations for a merger?",
            "Analyze the liability clauses in my service agreement",
            "What's the statute of limitations for breach of contract?",
            "Draft a non-disclosure agreement template",
            "Explain the difference between copyright and trademark"
          ].map((suggestion, index) => (
            <motion.button
              key={index}
              onClick={() => setInputValue(suggestion)}
              className="text-left p-4 bg-white/80 backdrop-blur-sm border border-teal-200/50 rounded-xl hover:bg-teal-50 transition-all duration-200 text-sm shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-teal-800 font-medium">{suggestion}</span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}