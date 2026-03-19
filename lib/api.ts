import axios from 'axios'
import type { FlightStats, FlightDeal, FlightPrice, FlightAlert } from '../types/flight'

// Mock data for fallback when API is not available
const mockStats: FlightStats = {
  total_flights: 147,
  total_alerts: 0,
  routes: {
    'GIG-LAX': 42,
    'GIG-SFO': 41,
    'SDU-LAX': 42,
    'SDU-SFO': 22
  },
  database_size: 32768
}

const mockDeals: FlightDeal[] = [
  {
    route: 'GIG-LAX',
    price: 2444.98,
    airline: 'Avianca',
    departure_date: '2026-05-18',
    stops: 2,
    checked_at: '2026-03-19T10:08:00'
  },
  {
    route: 'GIG-SFO',
    price: 2558.74,
    airline: 'Copa Airlines',
    departure_date: '2026-05-18',
    stops: 1,
    checked_at: '2026-03-19T10:08:00'
  },
  {
    route: 'SDU-LAX',
    price: 2712.29,
    airline: 'Delta Air Lines',
    departure_date: '2026-05-18',
    stops: 2,
    checked_at: '2026-03-19T10:08:00'
  },
  {
    route: 'GIG-LAX',
    price: 2867.09,
    airline: 'LATAM Airlines',
    departure_date: '2026-04-03',
    stops: 1,
    checked_at: '2026-03-19T10:08:00'
  },
  {
    route: 'GIG-SFO',
    price: 2898.65,
    airline: 'American Airlines',
    departure_date: '2026-04-03',
    stops: 1,
    checked_at: '2026-03-19T10:08:00'
  },
  {
    route: 'SDU-SFO',
    price: 3145.96,
    airline: 'United Airlines',
    departure_date: '2026-04-18',
    stops: 0,
    checked_at: '2026-03-19T10:08:00'
  }
]

const mockPrices: FlightPrice[] = mockDeals.map((deal, index) => ({
  departure_airport: deal.route.split('-')[0],
  arrival_airport: deal.route.split('-')[1],
  route: deal.route,
  departure_date: deal.departure_date,
  price: deal.price + (Math.random() * 1000 - 500), // Add some variation
  airline: deal.airline,
  stops: deal.stops,
  checked_at: deal.checked_at,
  source: 'realistic_mock'
}))

class FlightAPI {
  private baseURL: string
  private useMockData: boolean = false

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app.up.railway.app'
    
    // Try to detect if we're in development or if API is not available
    if (typeof window !== 'undefined') {
      this.useMockData = localStorage.getItem('use_mock_data') === 'true'
    }
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.warn(`API request failed for ${endpoint}, using mock data:`, error)
      this.useMockData = true
      throw error
    }
  }

  async getStats(): Promise<FlightStats> {
    if (this.useMockData) {
      return mockStats
    }

    try {
      return await this.makeRequest<FlightStats>('/api/stats')
    } catch (error) {
      console.log('Using mock stats data')
      return mockStats
    }
  }

  async getDeals(limit: number = 20): Promise<FlightDeal[]> {
    if (this.useMockData) {
      return mockDeals.slice(0, limit)
    }

    try {
      return await this.makeRequest<FlightDeal[]>(`/api/deals?limit=${limit}`)
    } catch (error) {
      console.log('Using mock deals data')
      return mockDeals.slice(0, limit)
    }
  }

  async getPrices(route?: string, days: number = 7): Promise<FlightPrice[]> {
    if (this.useMockData) {
      let filteredPrices = mockPrices
      if (route) {
        filteredPrices = mockPrices.filter(price => price.route === route)
      }
      return filteredPrices
    }

    try {
      const queryParams = new URLSearchParams()
      if (route) queryParams.append('route', route)
      queryParams.append('days', days.toString())
      
      const endpoint = `/api/prices${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      return await this.makeRequest<FlightPrice[]>(endpoint)
    } catch (error) {
      console.log('Using mock prices data')
      let filteredPrices = mockPrices
      if (route) {
        filteredPrices = mockPrices.filter(price => price.route === route)
      }
      return filteredPrices
    }
  }

  async getTrends(days: number = 30): Promise<Record<string, any[]>> {
    if (this.useMockData) {
      return {}
    }

    try {
      return await this.makeRequest<Record<string, any[]>>(`/api/trends?days=${days}`)
    } catch (error) {
      console.log('Using mock trends data')
      return {}
    }
  }

  async getAlerts(limit: number = 50): Promise<FlightAlert[]> {
    if (this.useMockData) {
      return []
    }

    try {
      return await this.makeRequest<FlightAlert[]>(`/api/alerts?limit=${limit}`)
    } catch (error) {
      console.log('Using mock alerts data')
      return []
    }
  }

  // Method to force use of mock data (useful for development)
  setUseMockData(useMock: boolean) {
    this.useMockData = useMock
    if (typeof window !== 'undefined') {
      localStorage.setItem('use_mock_data', useMock.toString())
    }
  }

  // Method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest<any>('/health')
      return true
    } catch (error) {
      return false
    }
  }
}

export const flightAPI = new FlightAPI()
export default flightAPI