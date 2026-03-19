'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { Bar, Line } from 'react-chartjs-2'
import type { FlightPrice } from '../types/flight'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface FlightChartProps {
  prices: FlightPrice[]
  type: 'distribution' | 'trends'
}

export default function FlightChart({ prices, type }: FlightChartProps) {
  if (prices.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>Nenhum dado disponível</p>
          <p className="text-sm">Aguarde a coleta de dados</p>
        </div>
      </div>
    )
  }

  const colors = [
    'rgba(102, 126, 234, 0.8)',
    'rgba(118, 75, 162, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)'
  ]

  if (type === 'distribution') {
    // Group prices by route and calculate averages
    const routeData = prices.reduce((acc, flight) => {
      if (!acc[flight.route]) {
        acc[flight.route] = []
      }
      acc[flight.route].push(flight.price)
      return acc
    }, {} as Record<string, number[]>)

    const routes = Object.keys(routeData)
    const avgPrices = routes.map(route => {
      const prices = routeData[route]
      return prices.reduce((sum, price) => sum + price, 0) / prices.length
    })

    const routeNames = {
      'GIG-LAX': 'Rio Galeão → Los Angeles',
      'GIG-SFO': 'Rio Galeão → San Francisco',
      'SDU-LAX': 'Santos Dumont → Los Angeles',
      'SDU-SFO': 'Santos Dumont → San Francisco'
    }

    const data = {
      labels: routes.map(route => routeNames[route as keyof typeof routeNames] || route),
      datasets: [{
        label: 'Preço Médio (R$)',
        data: avgPrices,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `Preço médio: R$ ${context.parsed.y.toLocaleString('pt-BR')}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value: any) {
              return 'R$ ' + value.toLocaleString('pt-BR')
            }
          }
        }
      }
    }

    return (
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    )
  }

  if (type === 'trends') {
    // Group by route and date for trend analysis
    const routeDataByDate = prices.reduce((acc, flight) => {
      const date = flight.checked_at.split('T')[0] // Get date part
      if (!acc[flight.route]) {
        acc[flight.route] = {}
      }
      if (!acc[flight.route][date]) {
        acc[flight.route][date] = []
      }
      acc[flight.route][date].push(flight.price)
      return acc
    }, {} as Record<string, Record<string, number[]>>)

    const datasets = Object.keys(routeDataByDate).map((route, index) => {
      const routeData = routeDataByDate[route]
      const dates = Object.keys(routeData).sort()
      
      const routeNames = {
        'GIG-LAX': 'GIG → LAX',
        'GIG-SFO': 'GIG → SFO',
        'SDU-LAX': 'SDU → LAX',
        'SDU-SFO': 'SDU → SFO'
      }

      return {
        label: routeNames[route as keyof typeof routeNames] || route,
        data: dates.map(date => {
          const dayPrices = routeData[date]
          const avgPrice = dayPrices.reduce((sum, price) => sum + price, 0) / dayPrices.length
          return {
            x: date,
            y: avgPrice
          }
        }),
        borderColor: colors[index % colors.length].replace('0.8', '1'),
        backgroundColor: colors[index % colors.length],
        tension: 0.4,
        fill: false
      }
    })

    const data = {
      datasets
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time' as const,
          time: {
            unit: 'day' as const
          }
        },
        y: {
          ticks: {
            callback: function(value: any) {
              return 'R$ ' + value.toLocaleString('pt-BR')
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: R$ ${context.parsed.y.toLocaleString('pt-BR')}`
            }
          }
        }
      }
    }

    return (
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    )
  }

  return null
}