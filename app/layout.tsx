import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real Estate Solutions',
  description: 'CRM para Brokers - Bahía de Banderas & PV',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang=" es\>
 <body>{children}</body>
 </html>
 )
}
