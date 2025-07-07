import React from 'react'
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Briefcase
} from 'lucide-react'

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'overdue' | 'draft' | 'review' | 'executed'
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          text: 'Active'
        }
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          text: 'Pending'
        }
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle,
          text: 'Completed'
        }
      case 'overdue':
        return {
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          text: 'Overdue'
        }
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: FileText,
          text: 'Draft'
        }
      case 'review':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: Clock,
          text: 'Review'
        }
      case 'executed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          text: 'Executed'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          text: status
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </span>
  )
}

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low'
  className?: string
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800',
          icon: TrendingUp,
          text: 'High Priority'
        }
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: DollarSign,
          text: 'Medium Priority'
        }
      case 'low':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: TrendingDown,
          text: 'Low Priority'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          text: priority
        }
    }
  }

  const config = getPriorityConfig()
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </span>
  )
}
