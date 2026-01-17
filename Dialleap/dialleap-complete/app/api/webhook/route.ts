// app/api/webhook/route.ts
// Handles Stripe webhooks (payment confirmations)

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ received: true })
    }

    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const credits = parseInt(session.metadata.credits || '0')
      
      console.log(`Payment successful! Adding ${credits} credits`)
      
      // In production, you would:
      // 1. Get the user ID from session metadata
      // 2. Add credits to their account in the database
      // 
      // Example with Supabase:
      // const supabase = createClient(...)
      // await supabase.rpc('add_credits', { 
      //   user_id: session.metadata.user_id, 
      //   amount: credits 
      // })
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
