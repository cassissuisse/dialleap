// app/api/checkout/route.ts
// This creates Stripe checkout sessions for purchasing credits

import { NextResponse } from 'next/server'

// Credit packages (value in cents)
const PACKAGES = {
  5: { credits: 500, name: '$5 Credits', description: '~165 minutes to US' },
  10: { credits: 1000, name: '$10 Credits', description: '~330 minutes to US' },
  25: { credits: 2500, name: '$25 Credits', description: '~830 minutes to US' },
  50: { credits: 5000, name: '$50 Credits', description: '~1,660 minutes to US' },
  100: { credits: 10000, name: '$100 Credits', description: '~3,300 minutes to US' },
}

export async function POST(request) {
  try {
    const { amount } = await request.json()
    
    // Validate amount
    if (!PACKAGES[amount]) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured', demo: true },
        { status: 200 }
      )
    }

    // Import Stripe
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // Get the app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL 
      || process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: PACKAGES[amount].name,
              description: PACKAGES[amount].description,
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/app?success=true&credits=${PACKAGES[amount].credits}`,
      cancel_url: `${appUrl}/app?canceled=true`,
      metadata: {
        credits: PACKAGES[amount].credits.toString(),
      },
    })

    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
