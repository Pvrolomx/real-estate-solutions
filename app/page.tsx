"use client"
import { useState } from "react"

export default function Home() {
  const [tab, setTab] = useState("clientes")

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Real Estate Solutions</h1>
        <p className="text-blue-100 text-sm">CRM para Brokers</p>
      </header>

      <nav className="bg-white shadow-md flex">
        <button onClick={() => setTab("clientes")} className={tab === "clientes" ? "flex-1 p-3 bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "flex-1 p-3"}>Clientes</button>
        <button onClick={() => setTab("inventario")} className={tab === "inventario" ? "flex-1 p-3 bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "flex-1 p-3"}>Inventario</button>
        <button onClick={() => setTab("calc")} className={tab === "calc" ? "flex-1 p-3 bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "flex-1 p-3"}>Calculadora</button>
        <button onClick={() => setTab("match")} className={tab === "match" ? "flex-1 p-3 bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "flex-1 p-3"}>Match</button>
      </nav>

      <div className="p-4">
        {tab === "clientes" && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Clientes</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Nuevo</button>
            </div>
            <div className="bg-white rounded shadow p-4">Lista de clientes</div>
          </div>
        )}
        {tab === "inventario" && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">Inventario</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded">+ Propiedad</button>
            </div>
            <div className="bg-white rounded shadow p-4">Lista de propiedades</div>
          </div>
        )}
        {tab === "calc" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Calculadora Fiscal</h2>
            <div className="bg-white rounded shadow p-4">ISR, ISABI, IVA, Airbnb</div>
          </div>
        )}
        {tab === "match" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Match Cliente-Propiedad</h2>
            <div className="bg-white rounded shadow p-4">Selecciona cliente para ver matches</div>
          </div>
        )}
      </div>
    </main>
  )
}
