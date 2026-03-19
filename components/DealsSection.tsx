'use client'

import { Plane, Clock, MapPin } from 'lucide-react'
import type { FlightDeal } from '../types/flight'

interface DealsSectionProps {
  deals: FlightDeal[]
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const routeNames = {
    'GIG-LAX': 'Rio Galeão → Los Angeles',
    'GIG-SFO': 'Rio Galeão → San Francisco',
    'SDU-LAX': 'Santos Dumont → Los Angeles',
    'SDU-SFO': 'Santos Dumont → San Francisco'
  }

  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Voo direto'
    if (stops === 1) return '1 escala'
    return `${stops} escalas`
  }

  if (deals.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          🎯 Melhores Ofertas Encontradas
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✈️</div>
          <p className="text-gray-600">
            Nenhuma oferta encontrada ainda.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Aguarde o sistema coletar mais dados de voos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        🎯 Melhores Ofertas Encontradas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.slice(0, 12).map((deal, index) => (
          <div
            key={`${deal.route}-${deal.departure_date}-${index}`}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-primary-500 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105"
          >
            {/* Route Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-800 text-sm">
                {routeNames[deal.route as keyof typeof routeNames] || deal.route}
              </h4>
              <Plane className="h-4 w-4 text-primary-500" />
            </div>
            
            {/* Price */}
            <div className="text-2xl font-bold text-primary-600 mb-2">
              R$ {deal.price.toLocaleString('pt-BR')}
            </div>
            
            {/* Flight Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{deal.airline}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Partida: {new Date(deal.departure_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                <span className="font-medium">
                  {getStopsText(deal.stops)}
                </span>
              </div>
            </div>
            
            {/* Deal Badge */}
            {index < 3 && (
              <div className="mt-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  index === 0 ? 'bg-green-100 text-green-700' :
                  index === 1 ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {index === 0 ? '🥇 Melhor Preço' :
                   index === 1 ? '🥈 2º Melhor' :
                   '🥉 3º Melhor'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {deals.length > 12 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Mostrando 12 de {deals.length} ofertas encontradas
          </p>
        </div>
      )}
    </div>
  )
}