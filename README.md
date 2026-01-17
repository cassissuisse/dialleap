# DialLeap 📞

**Make cheap international calls from your browser. The best Skype alternative.**

---

## Quick Setup

### 1. Upload to GitHub
Upload this entire `dialleap` folder to your GitHub repository.

### 2. Deploy to Vercel
1. Go to vercel.com
2. Import your GitHub repo
3. Deploy

### 3. Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

#### Twilio (Required for calling)
```
TWILIO_ACCOUNT_SID=ACxxxxxxxx          # From Twilio Console
TWILIO_AUTH_TOKEN=xxxxxxxx             # From Twilio Console
TWILIO_PHONE_NUMBER=+16199146125       # Your Twilio number
TWILIO_API_KEY_SID=SKxxxxxxxx          # Create at Twilio Console → Account → API Keys
TWILIO_API_KEY_SECRET=xxxxxxxx         # From API Key creation
TWILIO_TWIML_APP_SID=APxxxxxxxx        # Create at Twilio Console → Voice → TwiML Apps
```

#### Supabase (Required for database)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

#### Stripe (Required for payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 4. Create TwiML App in Twilio

1. Go to: https://console.twilio.com/us1/develop/voice/manage/twiml-apps
2. Click "Create new TwiML App"
3. Set Voice Request URL to: `https://YOUR-VERCEL-URL.vercel.app/api/twiml`
4. Copy the SID and add as `TWILIO_TWIML_APP_SID`

### 5. Redeploy
After adding all environment variables, redeploy your app.

---

## Features

- 📞 **Browser-based calling** — No app downloads
- ⏱️ **Per-second billing** — Save 20-30%
- 💬 **SMS support** — $0.05 per message
- 🔔 **Callback queue** — We wait on hold for you
- 💳 **Credits never expire** — No subscriptions
- 🌍 **180+ countries** — Rates from $0.019/min

---

## Tech Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **Telephony:** Twilio Voice SDK

---

## File Structure

```
dialleap/
├── app/
│   ├── api/
│   │   ├── token/route.ts      # Generates Twilio access tokens
│   │   ├── twiml/route.ts      # TwiML instructions for calls
│   │   ├── voice/route.ts      # Call status webhooks
│   │   ├── checkout/route.ts   # Stripe checkout
│   │   └── webhook/route.ts    # Stripe webhooks
│   ├── app/
│   │   └── page.tsx            # The dialer app
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## License

MIT
