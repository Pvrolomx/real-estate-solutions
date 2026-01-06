import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")

    const apiKey = process.env.GOOGLE_VISION_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured", text: "", fields: {} }, { status: 200 })
    }

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: base64 },
            features: [{ type: "DOCUMENT_TEXT_DETECTION" }]
          }]
        })
      }
    )

    const data = await response.json()
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message, text: "", fields: {} }, { status: 200 })
    }
    
    const text = data.responses?.[0]?.fullTextAnnotation?.text || ""
    const fields = parseClientFields(text)

    return NextResponse.json({ text, fields, rawLength: text.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, text: "", fields: {} }, { status: 500 })
  }
}

function parseClientFields(text: string) {
  const fields: Record<string, string> = {}
  
  // Keep original for some patterns
  const lines = text.split("\n").map(l => l.trim()).filter(l => l)
  const flat = text.replace(/\n/g, " ").replace(/\s+/g, " ")
  
  // Name - after "Name:" until next label
  let match = flat.match(/Name:\s*([A-Za-z\s]+?)(?=Date|DOB|Place|Nationality|\*|$)/i)
  if (match) fields.name = match[1].trim()

  // Date of Birth - handle "16 / 09 /19 42" format
  match = flat.match(/(?:Date of Birth|DOB):\s*([\d\s\/]+?)(?=Place|Nationality|\*|$)/i)
  if (match) {
    const dobRaw = match[1].replace(/\s+/g, "").replace(/(\d{2})(\d{2})$/, "$1$2")
    const parts = dobRaw.split("/")
    if (parts.length >= 3) {
      let day = parts[0].padStart(2, "0")
      let month = parts[1].padStart(2, "0")
      let year = parts[2]
      if (year.length === 4 && year.startsWith("19")) {
        // already good
      } else if (year.length === 4) {
        year = "19" + year.slice(2)
      } else if (year.length === 2) {
        year = parseInt(year) > 30 ? "19" + year : "20" + year
      }
      fields.dob = `${year}-${month}-${day}`
    }
  }

  // Place of Birth
  match = flat.match(/Place of Birth:\s*([^*]+?)(?=Nationality|\*|$)/i)
  if (match) fields.pob = match[1].trim()

  // Nationality
  match = flat.match(/Nationality:\s*([A-Za-z]+)/i)
  if (match) {
    const n = match[1].toUpperCase()
    if (n === "USA" || n === "US" || n === "AMERICAN") fields.nationality = "USA"
    else if (n === "MEXICO" || n === "MEXICAN" || n === "MX") fields.nationality = "Mexico"
    else if (n === "CANADA" || n === "CANADIAN" || n === "CA") fields.nationality = "Canada"
    else fields.nationality = match[1]
  }

  // Passport - number only
  match = flat.match(/Passport:\s*(\d+)/i)
  if (match) fields.passport = match[1]

  // Immigration Status
  match = flat.match(/Immigration Status:\s*([A-Za-z\s]+?)(?=Marital|Address|\*|$)/i)
  if (match) fields.immigration = match[1].trim()

  // Marital Status
  match = flat.match(/Marital Status:\s*([A-Za-z]+)/i)
  if (match) fields.marital = match[1]

  // Address in Mexico
  match = flat.match(/Address in Mexico:\s*(.+?)(?=Address Abroad|\*|$)/i)
  if (match) fields.addressMx = match[1].trim()

  // Address Abroad
  match = flat.match(/Address Abroad:\s*(.+?)(?=Occupation|Name of|\*|$)/i)
  if (match) fields.addressAbroad = match[1].trim()

  // Occupation
  match = flat.match(/Occupation:\s*([A-Za-z\s]+?)(?=Name of|Company|Type|\*|$)/i)
  if (match) fields.occupation = match[1].trim()

  // Email
  match = flat.match(/Email:\s*([^\s*]+@[^\s*]+)/i)
  if (match) fields.email = match[1].toLowerCase()

  // Cell Phone
  match = flat.match(/Cell Phone:\s*([+\d\s()-]+?)(?=SS|SIN|\*|$)/i)
  if (match) fields.phone = match[1].trim()

  // SS#
  match = flat.match(/SS\s*#?\s*(?:\(or SIN #\))?:\s*([\d\s]+)/i)
  if (match) fields.ssn = match[1].trim()

  return fields
}
