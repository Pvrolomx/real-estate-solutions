"use client"
import { useState } from "react"

export default function Home() {
  const [tab, setTab] = useState("clientes")

  const tabs = [
    { id: "clientes", label: "Clientes", color: "bg-slate-600" },
    { id: "inventario", label: "Inventario", color: "bg-stone-600" },
    { id: "calc", label: "Calculadora", color: "bg-zinc-600" },
    { id: "match", label: "Match", color: "bg-neutral-600" },
  ]

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-slate-800 text-white p-4">
        <h1 className="text-2xl font-bold">Real Estate Solutions</h1>
        <p className="text-slate-300 text-sm">CRM para Brokers - Bahia y PV</p>
      </header>

      <nav className="bg-white shadow-md p-2 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              tab === t.id
                ? `${t.color} text-white shadow-md`
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="p-4">
        {tab === "clientes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Clientes</h2>
              <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">+ Nuevo</button>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-slate-600">
              <p className="text-gray-500">Lista de clientes</p>
            </div>
          </div>
        )}
        {tab === "inventario" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-800">Inventario</h2>
              <div className="space-x-2">
                <button className="bg-stone-600 hover:bg-stone-700 text-white px-4 py-2 rounded-lg">AMPI</button>
                <button className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded-lg">+ Pocket</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-stone-600">
              <p className="text-gray-500">Lista de propiedades</p>
            </div>
          </div>
        )}
        {tab === "calc" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-800">Calculadora Fiscal</h2>
            <div className="flex gap-2">
              <button className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg">ISR</button>
              <button className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg">ISABI</button>
              <button className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg">IVA</button>
              <button className="bg-zinc-500 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg">Airbnb</button>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-zinc-600">
              <p className="text-gray-500">Selecciona tipo de calculo</p>
            </div>
          </div>
        )}
        {tab === "match" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-800">Match Cliente-Propiedad</h2>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-neutral-600">
              <p className="text-gray-500">Selecciona cliente para ver matches</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
