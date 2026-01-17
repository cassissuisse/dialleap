// app/api/checkout/route.ts
// Creates Stripe checkout sessions for purchasing credits

import { NextResponse } from 'next/server'

// Credit packages
const PACKAGES: Record<number, { credits: number; name: string }> = {
  5: { credits: 500, name: '$5 Credits' },
  10: { credits: 1000, name: '$10 Credits' },
  25: { credits: 2500, name: '$25 Credits' },
  50: { credits: 5000, name: '$50 Credits' },
}

export async function POST(request: Request) {
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
      // Demo mode - return success without Stripe
      return NextResponse.json({
        demo: true,
        credits: PACKAGES[amount].credits,
      })
    }

    // Import Stripe
    const Stripe = require('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // Get the app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000'

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: PACKAGES[amount].name,
              description: `${PACKAGES[amount].credits / 100} credits for DialLeap`,
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

  } catch (error: any) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
