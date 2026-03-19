export interface FlightStats {
  total_flights: number
  total_alerts: number
  routes: Record<string, number>
  database_size: number
  date_range?: {
    start: string
    end: string
  }
}

export interface FlightPrice {
  departure_airport: string
  arrival_airport: string
  route: string
  departure_date: string
  price: number
  airline: string
  stops: number
  checked_at: string
  source: string
}

export interface FlightDeal {
  route: string
  price: number
  airline: string
  departure_date: string
  stops: number
  checked_at: string
}

export interface FlightAlert {
  route: string
  price: number
  drop_percentage: number
  alert_sent_at: string
}

export interface PriceTrend {
  date: string
  avg_price: number
  min_price: number
  max_price: number
  flight_count: number
}

export interface RouteAnalysis {
  route: string
  avg_price: number
  min_price: number
  max_price: number
  total_flights: number
  best_deal: FlightDeal
  price_trend: 'increasing' | 'decreasing' | 'stable'
}