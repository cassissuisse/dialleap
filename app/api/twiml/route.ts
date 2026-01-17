// app/api/twiml/route.ts
// TwiML endpoint - Twilio calls this to get instructions for handling calls

import { NextResponse } from 'next/server'

// Emergency numbers that should be blocked
const EMERGENCY_NUMBERS = [
  '911', '112', '999', '000', '110', '119', '117', '118', '144', '190', '100', '101', '102', '108'
]

// Check if a number is an emergency number
function isEmergencyNumber(num: string): boolean {
  const cleaned = num.replace(/[\s\-\(\)\+]/g, '')
  return EMERGENCY_NUMBERS.some(emergency => 
    cleaned === emergency || 
    cleaned.endsWith(emergency) && cleaned.length <= emergency.length + 3
  )
}

export async function POST(request: Request) {
  try {
    // Get the dialed number from the request
    const formData = await request.formData()
    const to = formData.get('To') as string

    console.log('TwiML request received, To:', to)

    // Validate the number
    if (!to) {
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>No phone number provided.</Say>
        </Response>`
      return new NextResponse(errorTwiml, {
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Block emergency numbers
    if (isEmergencyNumber(to)) {
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Emergency calls cannot be made through DialLeap. Please hang up and dial emergency services from a regular phone.</Say>
        </Response>`
      return new NextResponse(errorTwiml, {
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Clean the number - ensure it starts with +
    let phoneNumber = to.trim()
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber
    }

    // Generate TwiML to dial the number
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Dial callerId="${process.env.TWILIO_PHONE_NUMBER}">
          <Number>${phoneNumber}</Number>
        </Dial>
      </Response>`

    console.log('TwiML response:', twiml)

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    })

  } catch (error: any) {
    console.error('TwiML error:', error)
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>An error occurred. Please try again.</Say>
      </Response>`
    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' },
    })
  }
}

// Also handle GET requests (Twilio sometimes uses GET)
export async function GET(request: Request) {
  const url = new URL(request.url)
  const to = url.searchParams.get('To')

  console.log('TwiML GET request, To:', to)

  if (!to) {
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>No phone number provided.</Say>
      </Response>`
    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  // Block emergency numbers
  if (isEmergencyNumber(to)) {
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Emergency calls cannot be made through DialLeap. Please hang up and dial emergency services from a regular phone.</Say>
      </Response>`
    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  let phoneNumber = to.trim()
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+' + phoneNumber
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Dial callerId="${process.env.TWILIO_PHONE_NUMBER}">
        <Number>${phoneNumber}</Number>
      </Dial>
    </Response>`

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
