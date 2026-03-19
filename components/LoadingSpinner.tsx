'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'white' | 'primary' | 'gray'
}

export default function LoadingSpinner({ size = 'md', color = 'white' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  }

  const colorClasses = {
    white: 'border-white border-l-transparent',
    primary: 'border-primary-500 border-l-transparent',
    gray: 'border-gray-300 border-l-transparent'
  }

  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
      aria-label="Carregando"
    />
  )
}