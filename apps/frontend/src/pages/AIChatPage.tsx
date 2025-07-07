import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Loader2, RefreshCw, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiApi } from '../services/api'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Flow, your AI Legal Assistant. I specialize in legal research, contract drafting, document analysis, and providing strategic legal guidance. How can I assist you with your legal practice today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

    try {
      const response = await aiApi.chat(userMessage.content)
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI chat error:', error)
      
      // Enhanced fallback responses based on message content
      let fallbackResponse = "I'm Flow, and I'm currently operating in offline mode. However, I can still provide helpful legal guidance based on my training.";
      
      const userInput = userMessage.content.toLowerCase();
      
      if (userInput.includes('contract') || userInput.includes('agreement')) {
        fallbackResponse = "I'm Flow, your AI Legal Assistant. While I'm currently offline, I can offer some general guidance on contracts:\n\n📋 **Key Contract Elements to Review:**\n• Parties and their obligations\n• Payment terms and deadlines\n• Termination clauses\n• Liability and indemnification\n• Dispute resolution mechanisms\n• Governing law provisions\n\n⚠️ **Common Red Flags:**\n• Unlimited liability exposure\n• Vague performance standards\n• Automatic renewal without notice\n• One-sided termination rights\n\nFor detailed contract analysis, please try again when my full capabilities are available.";
      } else if (userInput.includes('research') || userInput.includes('case law')) {
        fallbackResponse = "I'm Flow, your AI Legal Research Assistant. In offline mode, here's general guidance for legal research:\n\n🔍 **Research Strategy:**\n• Start with primary sources (statutes, cases)\n• Use secondary sources for context\n• Check for recent updates and amendments\n• Consider jurisdictional differences\n\n📚 **Key Databases:**\n• Westlaw, Lexis, Bloomberg Law\n• Google Scholar for free access\n• Court websites for recent decisions\n• Bar association resources\n\n⏰ **Research Tips:**\n• Use Boolean search operators\n• Check citation validity\n• Review headnotes and summaries\n• Note circuit splits or conflicts\n\nI'll provide more specific research assistance when fully online.";
      } else if (userInput.includes('draft') || userInput.includes('document')) {
        fallbackResponse = "I'm Flow, your AI Document Drafting Assistant. While offline, here are general drafting principles:\n\n✍️ **Professional Drafting Guidelines:**\n• Use clear, unambiguous language\n• Define all technical terms\n• Organize content logically\n• Include necessary disclaimers\n\n📝 **Common Document Types:**\n• Non-disclosure agreements\n• Service agreements\n• Employment contracts\n• Privacy policies\n• Terms of service\n\n🎯 **Best Practices:**\n• Tailor to specific jurisdiction\n• Include dispute resolution clauses\n• Specify governing law\n• Regular review and updates\n\nFor custom document generation, please reconnect when I'm fully operational.";
      } else if (userInput.includes('litigation') || userInput.includes('dispute')) {
        fallbackResponse = "I'm Flow, your AI Litigation Assistant. Here's general dispute resolution guidance:\n\n⚖️ **Litigation Strategy Basics:**\n• Assess strength of claims/defenses\n• Evaluate potential damages\n• Consider alternative dispute resolution\n• Analyze cost-benefit of proceeding\n\n📋 **Pre-Litigation Checklist:**\n• Preserve all relevant documents\n• Interview key witnesses\n• Research applicable law\n• Calculate damages accurately\n\n🤝 **Settlement Considerations:**\n• Costs of continued litigation\n• Probability of success\n• Collectibility of judgment\n• Business relationship preservation\n\nFor case-specific analysis, please try again when my full capabilities return.";
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
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
          <motion.button
            onClick={clearChat}
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl text-teal-700 font-semibold hover:bg-teal-50 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Clear Chat</span>
          </motion.button>
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