import "./globals.css"

export const metadata = {
  title: "Real Estate Solutions",
  description: "CRM para Brokers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
