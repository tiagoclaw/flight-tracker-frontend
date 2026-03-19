import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: '🛫 Flight Tracker Rio-California',
  description: 'Monitoramento inteligente de preços de voos Rio de Janeiro para Califórnia',
  keywords: 'voos, preços, Rio de Janeiro, California, Los Angeles, San Francisco, monitoramento',
  authors: [{ name: 'Flight Tracker Team' }],
  openGraph: {
    title: '🛫 Flight Tracker Rio-California',
    description: 'Monitoramento inteligente de preços de voos Rio → California',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}