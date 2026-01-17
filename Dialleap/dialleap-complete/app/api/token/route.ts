// app/api/token/route.ts
// Generates Twilio Access Tokens for browser-based calling

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Check if Twilio is configured
    if (!process.env.TWILIO_ACCOUNT_SID || 
        !process.env.TWILIO_AUTH_TOKEN || 
        !process.env.TWILIO_API_KEY_SID ||
        !process.env.TWILIO_API_KEY_SECRET ||
        !process.env.TWILIO_TWIML_APP_SID) {
      console.error('Missing Twilio configuration')
      return NextResponse.json(
        { error: 'Twilio not fully configured. Check environment variables.' },
        { status: 500 }
      )
    }

    const twilio = require('twilio')
    const AccessToken = twilio.jwt.AccessToken
    const VoiceGrant = AccessToken.VoiceGrant

    // Create a unique identity for this user session
    const identity = 'dialleap-user-' + Date.now()

    // Create an access token
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_KEY_SECRET,
      { identity: identity }
    )

    // Create a Voice grant and add it to the token
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: false, // We don't need incoming calls for now
    })

    token.addGrant(voiceGrant)

    return NextResponse.json({
      token: token.toJwt(),
      identity: identity,
    })

  } catch (error: any) {
    console.error('Token generation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
