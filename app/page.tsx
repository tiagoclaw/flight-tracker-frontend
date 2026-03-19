'use client'

import { useState, useEffect } from 'react'
import { Plane, TrendingUp, AlertCircle, DollarSign, RefreshCw } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import FlightChart from '../components/FlightChart'
import DealsSection from '../components/DealsSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { flightAPI } from '../lib/api'
import type { FlightStats, FlightDeal, FlightPrice } from '../types/flight'

export default function Dashboard() {
  const [stats, setStats] = useState<FlightStats | null>(null)
  const [deals, setDeals] = useState<FlightDeal[]>([])
  const [prices, setPrices] = useState<FlightPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<string>('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const routes = [
    { value: '', label: 'Todas as rotas' },
    { value: 'GIG-LAX', label: 'Rio Galeão → Los Angeles' },
    { value: 'GIG-SFO', label: 'Rio Galeão → San Francisco' },
    { value: 'SDU-LAX', label: 'Santos Dumont → Los Angeles' },
    { value: 'SDU-SFO', label: 'Santos Dumont → San Francisco' }
  ]

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError(null)

    try {
      const [statsData, dealsData, pricesData] = await Promise.all([
        flightAPI.getStats(),
        flightAPI.getDeals(12),
        flightAPI.getPrices(selectedRoute, 30)
      ])

      setStats(statsData)
      setDeals(dealsData)
      setPrices(pricesData)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Erro ao carregar dados. Verifique se o sistema está funcionando.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedRoute])

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false) // Silent refresh
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [selectedRoute])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
        <span className="ml-4 text-white text-xl">Carregando dados de voos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => loadData()}
            className="btn-primary"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="text-center text-white mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          🛫 Flight Tracker Rio-California
        </h1>
        <p className="text-xl opacity-90 mb-6">
          Monitoramento inteligente de preços de voos Rio → California
        </p>
        
        {/* Route Selector */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 inline-block">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="route" className="text-white font-medium">
              📍 Filtrar por rota:
            </label>
            <select
              id="route"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="bg-white text-gray-800 border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500"
            >
              {routes.map(route => (
                <option key={route.value} value={route.value}>
                  {route.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => loadData()}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="animate-slide-up">
          <StatsCard
            icon={<Plane className="h-8 w-8" />}
            value={stats?.total_flights?.toLocaleString('pt-BR') || '0'}
            label="Voos Monitorados"
            color="text-blue-600"
          />
        </div>
        <div className="animate-slide-up animation-delay-200">
          <StatsCard
            icon={<AlertCircle className="h-8 w-8" />}
            value={stats?.total_alerts?.toString() || '0'}
            label="Alertas de Preço"
            color="text-orange-600"
          />
        </div>
        <div className="animate-slide-up animation-delay-400">
          <StatsCard
            icon={<TrendingUp className="h-8 w-8" />}
            value={Object.keys(stats?.routes || {}).length.toString()}
            label="Rotas Ativas"
            color="text-green-600"
          />
        </div>
        <div className="animate-slide-up animation-delay-600">
          <StatsCard
            icon={<DollarSign className="h-8 w-8" />}
            value={deals.length > 0 ? `R$ ${deals[0].price.toLocaleString('pt-BR')}` : 'R$ 0'}
            label="Melhor Preço"
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <div className="card animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📊 Distribuição de Preços por Rota
          </h3>
          <FlightChart prices={prices} type="distribution" />
        </div>
        
        <div className="card animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📈 Tendência de Preços (30 dias)
          </h3>
          <FlightChart prices={prices} type="trends" />
        </div>
      </div>

      {/* Best Deals Section */}
      <div className="animate-slide-up">
        <DealsSection deals={deals} />
      </div>

      {/* Footer */}
      <footer className="text-center text-white/80 mt-12 py-6">
        <div className="space-y-2">
          <p className="text-lg">🛫 Flight Tracker Rio-California</p>
          <p className="text-sm">
            Atualizado automaticamente a cada 3 horas | 
            {lastUpdated && (
              <span className="ml-2">
                Última atualização: {lastUpdated.toLocaleString('pt-BR')}
              </span>
            )}
          </p>
          <p className="text-xs opacity-60">
            Sistema desenvolvido para monitoramento inteligente de preços de voos
          </p>
        </div>
      </footer>
    </div>
  )
}