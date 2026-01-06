"use client"
import { useState, useEffect } from "react"

const countries = ["Mexico", "USA", "Canada", "UK", "Germany", "France", "Spain", "Italy", "Other"]
const immigrationStatuses = ["Tourist", "Temporary Resident", "Permanent Resident", "Work Visa", "Student Visa", "Other"]
const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"]

const texts = {
  es: {
    title: "Real Estate Solutions", subtitle: "CRM para Brokers - Bahia y PV",
    clients: "Clientes", inventory: "Inventario", calculator: "Calculadora", match: "Match",
    newClient: "+ Nuevo", clientList: "Lista de clientes", ampi: "AMPI", pocket: "+ Pocket",
    propertyList: "Lista de propiedades", taxCalc: "Calculadora Fiscal",
    selectCalc: "Selecciona tipo de calculo", matchTitle: "Match Cliente-Propiedad",
    matchDesc: "Selecciona cliente para ver matches", install: "Instalar App",
    addClient: "Agregar Cliente", uploadDoc: "Subir Documento (OCR)",
    name: "Nombre Completo", dob: "Fecha Nacimiento", pob: "Lugar Nacimiento",
    nationality: "Nacionalidad", immigration: "Estatus Migratorio", passport: "Pasaporte",
    passportExp: "Expedicion", passportVenc: "Vencimiento", marital: "Estado Civil",
    addressMx: "Direccion en Mexico", addressAbroad: "Direccion en Extranjero",
    occupation: "Ocupacion", company: "Empresa", curp: "CURP", rfc: "RFC",
    email: "Email", phone: "Telefono", ssn: "SS# / SIN#", save: "Guardar", cancel: "Cancelar",
    processing: "Procesando OCR...", ocrSuccess: "Campos extraidos automaticamente",
  },
  en: {
    title: "Real Estate Solutions", subtitle: "CRM for Brokers - Bahia & PV",
    clients: "Clients", inventory: "Inventory", calculator: "Calculator", match: "Match",
    newClient: "+ New", clientList: "Client list", ampi: "AMPI", pocket: "+ Pocket",
    propertyList: "Property list", taxCalc: "Tax Calculator",
    selectCalc: "Select calculation type", matchTitle: "Client-Property Match",
    matchDesc: "Select client to view matches", install: "Install App",
    addClient: "Add Client", uploadDoc: "Upload Document (OCR)",
    name: "Full Name", dob: "Date of Birth", pob: "Place of Birth",
    nationality: "Nationality", immigration: "Immigration Status", passport: "Passport",
    passportExp: "Issue Date", passportVenc: "Expiry Date", marital: "Marital Status",
    addressMx: "Address in Mexico", addressAbroad: "Address Abroad",
    occupation: "Occupation", company: "Company", curp: "CURP", rfc: "RFC",
    email: "Email", phone: "Phone", ssn: "SS# / SIN#", save: "Save", cancel: "Cancel",
    processing: "Processing OCR...", ocrSuccess: "Fields extracted automatically",
  }
}

export default function Home() {
  const [tab, setTab] = useState("clientes")
  const [lang, setLang] = useState<"es" | "en">("es")
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrMessage, setOcrMessage] = useState("")
  const [formData, setFormData] = useState({
    name: "", dob: "", pob: "", nationality: "Mexico", immigration: "",
    passport: "", passportExp: "", passportVenc: "", marital: "Single",
    addressMx: "", addressAbroad: "", occupation: "", company: "",
    curp: "", rfc: "", email: "", phone: "", ssn: ""
  })
  const t = texts[lang]

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js")
    if (window.matchMedia("(display-mode: standalone)").matches) setIsInstalled(true)
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", () => setIsInstalled(true))
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === "accepted") setIsInstalled(true)
    setDeferredPrompt(null)
  }

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })
  
  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsProcessing(true)
    setOcrMessage("")
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formDataUpload
      })
      
      const data = await response.json()
      
      if (data.fields) {
        setFormData(prev => ({ ...prev, ...data.fields }))
        setOcrMessage(t.ocrSuccess)
      }
    } catch (error) {
      console.error("OCR error:", error)
    } finally {
      setIsProcessing(false)
    }
  }
  
  const isInternational = formData.nationality !== "Mexico"

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
            <button onClick={handleInstall} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">{t.install}</button>
          )}
          <button onClick={() => setLang(lang === "es" ? "en" : "es")} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm">
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>
      </header>
      <nav className="bg-white shadow-md p-2 flex gap-2">
        {tabs.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${tab === item.id ? `${item.color} text-white shadow-md` : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4">
        {tab === "clientes" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{t.clients}</h2>
              <button onClick={() => setShowForm(true)} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">{t.newClient}</button>
            </div>
            {showForm ? (
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-slate-600">
                <h3 className="text-lg font-bold mb-4">{t.addClient}</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.uploadDoc}</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="w-full p-2 border rounded" disabled={isProcessing} />
                  {isProcessing && <p className="text-blue-600 text-sm mt-1">{t.processing}</p>}
                  {ocrMessage && <p className="text-green-600 text-sm mt-1">{ocrMessage}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label><input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.dob}</label><input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.pob}</label><input name="pob" value={formData.pob} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.nationality}</label><select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full p-2 border rounded">{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  {isInternational && (<div><label className="block text-sm font-medium text-gray-700 mb-1">{t.immigration}</label><select name="immigration" value={formData.immigration} onChange={handleChange} className="w-full p-2 border rounded"><option value="">-- Select --</option>{immigrationStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>)}
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.passport}</label><input name="passport" value={formData.passport} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.passportExp}</label><input name="passportExp" type="date" value={formData.passportExp} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.passportVenc}</label><input name="passportVenc" type="date" value={formData.passportVenc} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.marital}</label><select name="marital" value={formData.marital} onChange={handleChange} className="w-full p-2 border rounded">{maritalStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">{t.addressMx}</label><input name="addressMx" value={formData.addressMx} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">{t.addressAbroad}</label><input name="addressAbroad" value={formData.addressAbroad} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.occupation}</label><input name="occupation" value={formData.occupation} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.company}</label><input name="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.curp}</label><input name="curp" value={formData.curp} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.rfc}</label><input name="rfc" value={formData.rfc} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label><input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label><input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.ssn}</label><input name="ssn" value={formData.ssn} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg">{t.save}</button>
                  <button onClick={() => setShowForm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg">{t.cancel}</button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-slate-600"><p className="text-gray-500">{t.clientList}</p></div>
            )}
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
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-stone-600"><p className="text-gray-500">{t.propertyList}</p></div>
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
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-zinc-600"><p className="text-gray-500">{t.selectCalc}</p></div>
          </div>
        )}
        {tab === "match" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-800">{t.matchTitle}</h2>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-neutral-600"><p className="text-gray-500">{t.matchDesc}</p></div>
          </div>
        )}
      </div>
    </main>
  )
}
