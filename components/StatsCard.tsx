'use client'

import { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  value: string
  label: string
  color?: string
}

export default function StatsCard({ icon, value, label, color = "text-gray-600" }: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className={`mb-4 ${color}`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-600 uppercase font-medium tracking-wider">
        {label}
      </div>
    </div>
  )
}