'use client'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'green' | 'orange' | 'blue' | 'red'
}

const colorClasses = {
  green: 'bg-brand-green/10 text-brand-green',
  orange: 'bg-brand-orange/10 text-brand-orange',
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600',
}

export default function StatsCard({ title, value, subtitle, icon, trend, color = 'green' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-brand-green' : 'text-red-500'}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400 ml-1">vs mese scorso</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}