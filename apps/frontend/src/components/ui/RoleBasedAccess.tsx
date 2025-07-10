import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface RoleBasedAccessProps {
  children: React.ReactNode
  requiredPermissions: string[]
  fallback?: React.ReactNode
}

export function RoleBasedAccess({ children, requiredPermissions, fallback = null }: RoleBasedAccessProps) {
  const { user } = useAuth()

  // Mock permission checking - in a real app, this would check against user permissions
  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    // Admin role has all permissions
    if (user.role === 'admin') return true
    
    // Mock permission mapping based on role
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'], // All permissions
      partner: [
        'create_entity', 'edit_entity', 'delete_entity', 'view_entity',
        'create_contract', 'edit_contract', 'delete_contract', 'view_contract',
        'create_matter', 'edit_matter', 'delete_matter', 'view_matter',
        'create_dispute', 'edit_dispute', 'delete_dispute', 'view_dispute',
        'create_risk', 'edit_risk', 'delete_risk', 'view_risk',
        'create_policy', 'edit_policy', 'delete_policy', 'view_policy',
        'create_license', 'edit_license', 'delete_license', 'view_license',
        'create_engagement', 'edit_engagement', 'delete_engagement', 'view_engagement',
        'create_task', 'edit_task', 'delete_task', 'view_task',
        'create_knowledge', 'edit_knowledge', 'delete_knowledge', 'view_knowledge'
      ],
      associate: [
        'create_entity', 'edit_entity', 'view_entity',
        'create_contract', 'edit_contract', 'view_contract',
        'create_matter', 'edit_matter', 'view_matter',
        'create_dispute', 'edit_dispute', 'view_dispute',
        'create_risk', 'edit_risk', 'view_risk',
        'view_policy', 'view_license', 'view_engagement',
        'create_task', 'edit_task', 'view_task',
        'create_knowledge', 'edit_knowledge', 'view_knowledge'
      ],
      paralegal: [
        'view_entity', 'view_contract', 'view_matter', 'view_dispute',
        'create_task', 'edit_task', 'view_task',
        'view_knowledge', 'view_policy', 'view_license'
      ],
      secretary: [
        'view_entity', 'view_contract', 'view_matter',
        'create_task', 'view_task', 'view_knowledge'
      ],
      clerk: [
        'view_entity', 'view_contract', 'view_matter', 'view_task', 'view_knowledge'
      ]
    }

    const userPermissions = rolePermissions[user.role] || []
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }

  const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission))

  if (!hasAllPermissions) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Higher-order component version
export function withRoleBasedAccess<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: string[],
  fallback?: React.ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <RoleBasedAccess requiredPermissions={requiredPermissions} fallback={fallback}>
        <Component {...props} />
      </RoleBasedAccess>
    )
  }
}

// Hook for permission checking
export function usePermissions() {
  const { user } = useAuth()

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    if (user.role === 'admin') return true
    
    const rolePermissions: Record<string, string[]> = {
      admin: ['*'],
      partner: [
        'create_entity', 'edit_entity', 'delete_entity', 'view_entity',
        'create_contract', 'edit_contract', 'delete_contract', 'view_contract',
        'create_matter', 'edit_matter', 'delete_matter', 'view_matter',
        'create_dispute', 'edit_dispute', 'delete_dispute', 'view_dispute',
        'create_risk', 'edit_risk', 'delete_risk', 'view_risk',
        'create_policy', 'edit_policy', 'delete_policy', 'view_policy',
        'create_license', 'edit_license', 'delete_license', 'view_license',
        'create_engagement', 'edit_engagement', 'delete_engagement', 'view_engagement',
        'create_task', 'edit_task', 'delete_task', 'view_task',
        'create_knowledge', 'edit_knowledge', 'delete_knowledge', 'view_knowledge'
      ],
      associate: [
        'create_entity', 'edit_entity', 'view_entity',
        'create_contract', 'edit_contract', 'view_contract',
        'create_matter', 'edit_matter', 'view_matter',
        'create_dispute', 'edit_dispute', 'view_dispute',
        'create_risk', 'edit_risk', 'view_risk',
        'view_policy', 'view_license', 'view_engagement',
        'create_task', 'edit_task', 'view_task',
        'create_knowledge', 'edit_knowledge', 'view_knowledge'
      ],
      paralegal: [
        'view_entity', 'view_contract', 'view_matter', 'view_dispute',
        'create_task', 'edit_task', 'view_task',
        'view_knowledge', 'view_policy', 'view_license'
      ],
      secretary: [
        'view_entity', 'view_contract', 'view_matter',
        'create_task', 'view_task', 'view_knowledge'
      ],
      clerk: [
        'view_entity', 'view_contract', 'view_matter', 'view_task', 'view_knowledge'
      ]
    }

    const userPermissions = rolePermissions[user.role] || []
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    userRole: user?.role,
    isAdmin: user?.role === 'admin'
  }
}
