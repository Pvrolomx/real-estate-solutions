import "./globals.css"

export const metadata = {
  title: "Real Estate Solutions",
  description: "CRM para Brokers",
  manifest: "/manifest.json",
  themeColor: "#1e293b",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <style>{`
          body {
            background: 
              linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)),
              url('/bg-hero.jpg') center/cover no-repeat fixed;
            min-height: 100vh;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
