// app/api/voice/route.ts
// This handles initiating phone calls via Twilio

import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { to } = await request.json()
    
    // Check if Twilio is configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      return NextResponse.json(
        { error: 'Twilio not configured', demo: true },
        { status: 200 }
      )
    }

    // Import Twilio (dynamic import for edge compatibility)
    const twilio = require('twilio')
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    // Create the call
    const call = await client.calls.create({
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER,
      // TwiML that connects the call
      twiml: `
        <Response>
          <Say>Connecting your call through DialLeap.</Say>
          <Dial>${to}</Dial>
        </Response>
      `
    })

    return NextResponse.json({
      success: true,
      callSid: call.sid
    })

  } catch (error) {
    console.error('Voice API error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Handle Twilio webhook callbacks
export async function GET(request) {
  // This would handle incoming call status updates
  return NextResponse.json({ status: 'ok' })
}
