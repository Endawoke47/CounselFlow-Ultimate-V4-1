import React, { useState } from 'react'
import { Search, Brain, Sparkles } from 'lucide-react'

interface AISearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function AISearch({ onSearch, placeholder = "AI-powered search...", className = "" }: AISearchProps) {
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isProcessing) return

    setIsProcessing(true)
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 800))
      onSearch(query)
    } catch (error) {
      console.error('AI search error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isProcessing ? (
            <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
          ) : (
            <Brain className="h-4 w-4 text-purple-500" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={isProcessing}
          className="w-full pl-10 pr-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50 placeholder-purple-400 text-gray-900 disabled:opacity-50"
        />
        {isProcessing && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  )
}
