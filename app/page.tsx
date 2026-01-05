'use client'
import { useState } from 'react'

type Tab = 'clientes' | 'inventario' | 'calculadora' | 'match' | 'comparativos'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('clientes')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'inventario', label: 'Inventario', icon: '🏠' },
    { id: 'calculadora', label: 'Calculadora', icon: '🧮' },
    { id: 'match', label: 'Match', icon: '🎯' },
    { id: 'comparativos', label: 'Comparativos', icon: '📊' },
  ]

  return (
    <main className=" min-h-screen bg-gray-50\>
 {/* Header */}
 <header className=\bg-blue-600 text-white p-4 shadow-lg\>
 <h1 className=\text-2xl font-bold\>Real Estate Solutions</h1>
 <p className=\text-blue-100 text-sm\>CRM para Brokers - Bahía & PV</p>
 </header>

 {/* Navigation */}
 <nav className=\bg-white shadow-md sticky top-0 z-10\>
 <div className=\flex overflow-x-auto\>
 {tabs.map((tab) => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={\lex-1 min-w-max px-4 py-3 text-sm font-medium transition-colors
 \\}
 >
 <span className=\mr-2\>{tab.icon}</span>
 {tab.label}
 </button>
 ))}
 </div>
 </nav>

 {/* Content */}
 <div className=\p-4\>
 {activeTab === 'clientes' && <ClientesSection />}
 {activeTab === 'inventario' && <InventarioSection />}
 {activeTab === 'calculadora' && <CalculadoraSection />}
 {activeTab === 'match' && <MatchSection />}
 {activeTab === 'comparativos' && <ComparativosSection />}
 </div>
 </main>
 )
}

function ClientesSection() {
 return (
 <div className=\space-y-4\>
 <div className=\flex justify-between items-center\>
 <h2 className=\text-xl font-bold\>Clientes</h2>
 <button className=\bg-blue-600 text-white px-4 py-2 rounded-lg\>+ Nuevo</button>
 </div>
 <div className=\bg-white rounded-lg shadow p-4\>
 <p className=\text-gray-500\>Lista de clientes aquí...</p>
 </div>
 </div>
 )
}

function InventarioSection() {
 return (
 <div className=\space-y-4\>
 <div className=\flex justify-between items-center\>
 <h2 className=\text-xl font-bold\>Inventario</h2>
 <div className=\space-x-2\>
 <button className=\bg-green-600 text-white px-3 py-2 rounded-lg text-sm\>AMPI</button>
 <button className=\bg-purple-600 text-white px-3 py-2 rounded-lg text-sm\>+ Pocket</button>
 </div>
 </div>
 <div className=\bg-white rounded-lg shadow p-4\>
 <p className=\text-gray-500\>Propiedades aquí...</p>
 </div>
 </div>
 )
}

function CalculadoraSection() {
 const [calcType, setCalcType] = useState('ISR')
 
 return (
 <div className=\space-y-4\>
 <h2 className=\text-xl font-bold\>Calculadora Fiscal</h2>
 <div className=\flex space-x-2\>
 {['ISR', 'ISABI', 'IVA', 'Airbnb'].map((type) => (
 <button
 key={type}
 onClick={() => setCalcType(type)}
 className={\px-4 py-2 rounded-lg \\}
 >
 {type}
 </button>
 ))}
 </div>
 <div className=\bg-white rounded-lg shadow p-4\>
 <p className=\text-gray-500\>Calculadora {calcType} aquí...</p>
 </div>
 </div>
 )
}

function MatchSection() {
 return (
 <div className=\space-y-4\>
 <h2 className=\text-xl font-bold\>🎯 Match Cliente-Propiedad</h2>
 <div className=\bg-white rounded-lg shadow p-4\>
 <p className=\text-gray-500\>Selecciona cliente para ver matches...</p>
 </div>
 </div>
 )
}

function ComparativosSection() {
 return (
 <div className=\space-y-4\>
 <h2 className=\text-xl font-bold\>📊 Comparativos</h2>
 <div className=\bg-white rounded-lg shadow p-4\>
 <p className=\text-gray-500\>Selecciona propiedad para comparar...</p>
 </div>
 </div>
 )
}
