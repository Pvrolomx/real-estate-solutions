"use client"
import { useState, useEffect } from "react"

const texts = {
  es: {
    title: "Real Estate Solutions",
    subtitle: "CRM para Brokers - Bahia y PV",
    clients: "Clientes",
    inventory: "Inventario",
    calculator: "Calculadora",
    match: "Match",
    newClient: "+ Nuevo",
    clientList: "Lista de clientes",
    ampi: "AMPI",
    pocket: "+ Pocket",
    propertyList: "Lista de propiedades",
    taxCalc: "Calculadora Fiscal",
    selectCalc: "Selecciona tipo de calculo",
    matchTitle: "Match Cliente-Propiedad",
    matchDesc: "Selecciona cliente para ver matches",
    install: "Instalar App",
  },
  en: {
    title: "Real Estate Solutions",
    subtitle: "CRM for Brokers - Bahia & PV",
    clients: "Clients",
    inventory: "Inventory",
    calculator: "Calculator",
    match: "Match",
    newClient: "+ New",
    clientList: "Client list",
    ampi: "AMPI",
    pocket: "+ Pocket",
    propertyList: "Property list",
    taxCalc: "Tax Calculator",
    selectCalc: "Select calculation type",
    matchTitle: "Client-Property Match",
    matchDesc: "Select client to view matches",
    install: "Install App",
  }
}

export default function Home() {
  const [tab, setTab] = useState("clientes")
  const [lang, setLang] = useState<"es" | "en">("es")
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const t = texts[lang]

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
    }

    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true)
      }
    }
    checkInstalled()

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", handler)

    window.addEventListener("appinstalled", () => setIsInstalled(true))

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === "accepted") {
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }

  const tabs = [
    { id: "clientes", label: t.clients, color: "bg-slate-600" },
    { id: "inventario", label: t.inventory, color: "bg-stone-600" },
    { id: "calc", label: t.calculator, color: "bg-zinc-600" },
    { id: "match", label: t.match, color: "bg-neutral-600" },
  ]

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-slate-300 text-sm">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          {!isInstalled && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            >
              {t.install}
            </button>
          )}
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>
      </header>

      <nav className="bg-white shadow-md p-2 flex gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              tab === item.id
                ? `${item.color} text-white shadow-md`
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4">
        {tab === "clientes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{t.clients}</h2>
              <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">{t.newClient}</button>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-slate-600">
              <p className="text-gray-500">{t.clientList}</p>
            </div>
          </div>
        )}
        {tab === "inventario" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-800">{t.inventory}</h2>
              <div className="space-x-2">
                <button className="bg-stone-600 hover:bg-stone-700 text-white px-4 py-2 rounded-lg">{t.ampi}</button>
                <button className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded-lg">{t.pocket}</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-stone-600">
              <p className="text-gray-500">{t.propertyList}</p>
            </div>
          </div>
        )}
        {tab === "calc" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-800">{t.taxCalc}</h2>
            <div className="flex gap-2">
              <button className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg">ISR</button>
              <button className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg">ISABI</button>
              <button className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg">IVA</button>
              <button className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg">Airbnb</button>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-zinc-600">
              <p className="text-gray-500">{t.selectCalc}</p>
            </div>
          </div>
        )}
        {tab === "match" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-800">{t.matchTitle}</h2>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-neutral-600">
              <p className="text-gray-500">{t.matchDesc}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
