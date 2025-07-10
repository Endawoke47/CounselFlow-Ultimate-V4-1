import React from 'react'

interface CFLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CFLogo({ className = '', size = 'md' }: CFLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  }

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-full flex items-center justify-center font-bold text-primary shadow-lg border-2 border-white/20 ${className}`}>
      <span className="text-primary font-extrabold tracking-tight">CF</span>
    </div>
  )
}
