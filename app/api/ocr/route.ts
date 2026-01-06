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
      return NextResponse.json({ error: "API key not configured", fields: {} }, { status: 200 })
    }

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: base64 },
            features: [{ type: "TEXT_DETECTION" }]
          }]
        })
      }
    )

    const data = await response.json()
    const text = data.responses?.[0]?.fullTextAnnotation?.text || ""
    
    console.log("OCR Text:", text)

    const fields = parseClientFields(text)
    console.log("Parsed fields:", fields)

    return NextResponse.json({ text, fields })
  } catch (error) {
    console.error("OCR Error:", error)
    return NextResponse.json({ error: "OCR failed", fields: {} }, { status: 500 })
  }
}

function parseClientFields(text: string) {
  const fields: Record<string, string> = {}
  
  // Normalize text - remove extra spaces and newlines
  const normalized = text.replace(/\n/g, " ").replace(/\s+/g, " ")
  
  // Name - look for "Name:" followed by text until next field
  const nameMatch = normalized.match(/Name:\s*([A-Za-z\s]+?)(?:\s*\*|\s*Date|\s*DOB|$)/i)
  if (nameMatch) fields.name = nameMatch[1].trim()

  // Date of Birth - various formats
  const dobMatch = normalized.match(/(?:Date of Birth|DOB|Birth):\s*(\d{1,2}\s*\/\s*\d{1,2}\s*\/\s*\d{2,4})/i)
  if (dobMatch) fields.dob = formatDate(dobMatch[1])

  // Place of Birth
  const pobMatch = normalized.match(/Place of Birth:\s*([^*]+?)(?:\s*\*|\s*Nationality|$)/i)
  if (pobMatch) fields.pob = pobMatch[1].trim()

  // Nationality
  const natMatch = normalized.match(/Nationality:\s*([A-Za-z]+)/i)
  if (natMatch) {
    const nat = natMatch[1].trim()
    if (nat.toUpperCase() === "USA" || nat.toUpperCase() === "US") fields.nationality = "USA"
    else if (nat.toUpperCase() === "MEXICO" || nat.toUpperCase() === "MX") fields.nationality = "Mexico"
    else if (nat.toUpperCase() === "CANADA" || nat.toUpperCase() === "CA") fields.nationality = "Canada"
    else fields.nationality = nat
  }

  // Passport number - first number sequence after Passport:
  const passMatch = normalized.match(/Passport:\s*(\d+)/i)
  if (passMatch) fields.passport = passMatch[1].trim()

  // Immigration Status
  const immMatch = normalized.match(/Immigration Status:\s*([A-Za-z\s]+?)(?:\s*\*|\s*Marital|$)/i)
  if (immMatch) fields.immigration = immMatch[1].trim()

  // Marital Status
  const marMatch = normalized.match(/Marital Status:\s*([A-Za-z]+)/i)
  if (marMatch) fields.marital = marMatch[1].trim()

  // Address in Mexico
  const addrMxMatch = normalized.match(/Address in Mexico:\s*([^*]+?)(?:\s*\*|\s*Address Abroad|$)/i)
  if (addrMxMatch) fields.addressMx = addrMxMatch[1].trim()

  // Address Abroad
  const addrAbMatch = normalized.match(/Address Abroad:\s*([^*]+?)(?:\s*\*|\s*Occupation|$)/i)
  if (addrAbMatch) fields.addressAbroad = addrAbMatch[1].trim()

  // Occupation
  const occMatch = normalized.match(/Occupation:\s*([A-Za-z\s]+?)(?:\s*\*|\s*Name of|Company|$)/i)
  if (occMatch) fields.occupation = occMatch[1].trim()

  // Email - standard email pattern
  const emailMatch = normalized.match(/Email:\s*([^\s*]+@[^\s*]+)/i)
  if (emailMatch) fields.email = emailMatch[1].trim()

  // Phone - look for Cell Phone or Phone
  const phoneMatch = normalized.match(/(?:Cell Phone|Phone|Tel):\s*([+\d\s()-]+)/i)
  if (phoneMatch) fields.phone = phoneMatch[1].trim()

  // SS# or SIN#
  const ssMatch = normalized.match(/SS\s*#?\s*(?:\(or SIN #\))?:\s*([\d\s]+)/i)
  if (ssMatch) fields.ssn = ssMatch[1].replace(/\s/g, " ").trim()

  // CURP
  const curpMatch = normalized.match(/CURP:\s*([A-Z0-9]+)/i)
  if (curpMatch && curpMatch[1] !== "N" && curpMatch[1] !== "NA") fields.curp = curpMatch[1].trim()

  // RFC
  const rfcMatch = normalized.match(/(?:RFC|Tax ID).*?:\s*([A-Z0-9]+)/i)
  if (rfcMatch && rfcMatch[1] !== "N" && rfcMatch[1] !== "NA") fields.rfc = rfcMatch[1].trim()

  return fields
}

function formatDate(dateStr: string): string {
  const parts = dateStr.replace(/\s/g, "").split("/")
  if (parts.length === 3) {
    let day = parts[0].padStart(2, "0")
    let month = parts[1].padStart(2, "0")
    let year = parts[2]
    
    // Handle 2-digit year
    if (year.length === 2) {
      year = parseInt(year) > 50 ? "19" + year : "20" + year
    }
    // Handle split year like "19 42" -> "1942"
    if (year.length === 4 && parseInt(year) < 1900) {
      year = "19" + year.slice(2)
    }
    
    return `${year}-${month}-${day}`
  }
  return ""
}
