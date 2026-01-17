// app/api/voice/route.ts
// Handles voice call webhooks and status updates from Twilio

import { NextResponse } from 'next/server'

// Handle call status webhooks from Twilio
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const callSid = formData.get('CallSid')
    const callStatus = formData.get('CallStatus')
    const duration = formData.get('CallDuration')
    
    console.log('Call status update:', {
      callSid,
      callStatus,
      duration,
    })

    // In production, you would:
    // 1. Look up the call in your database
    // 2. Update the call record with duration
    // 3. Calculate and deduct credits
    
    // For now, just acknowledge the webhook
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    )

  } catch (error: any) {
    console.error('Voice webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'voice' })
}
