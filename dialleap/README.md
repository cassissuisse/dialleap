# DialLeap 📞

**Make cheap international calls from your browser. The best Skype alternative.**

🌐 [dialleap.com](https://dialleap.com)

---

## Features

- 📞 **Browser-based calling** — No app downloads, works everywhere
- 💬 **SMS support** — Send texts worldwide for $0.05 each
- 🔔 **Callback queue** — We wait on hold, connect you when a human answers
- 📊 **Smart hold detection** — See estimated wait times before calling
- 💳 **Credits never expire** — No subscriptions, no monthly fees
- 🌍 **180+ countries** — Rates from $0.03/min

---

## Billing

DialLeap uses **per-minute billing**, rounded up to the nearest minute. This is the industry standard used by most calling services.

**Example:**
- 45 second call → billed as 1 minute
- 1 min 15 sec call → billed as 2 minutes
- 3 min 0 sec call → billed as 3 minutes

---

## Why DialLeap?

| Feature | DialLeap | YadaPhone | Google Voice |
|---------|----------|-----------|--------------|
| Browser-based | ✅ | ✅ | ❌ |
| SMS support | ✅ | ❌ | Limited |
| Callback queue | ✅ | ❌ | ❌ |
| Hold time estimates | ✅ | ❌ | ❌ |
| Credits never expire | ✅ | ? | N/A |
| Global availability | ✅ | ✅ | US only |

---

## Tech Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Telephony:** Twilio

---

## Quick Start

```bash
# Clone
git clone https://github.com/yourusername/dialleap

# Install
npm install

# Set up environment variables
cp .env.example .env.local

# Run locally
npm run dev
```

See `DEPLOY-GUIDE.md` for full deployment instructions.

---

## Pricing

| Package | Price | Minutes to US | Minutes to UK |
|---------|-------|---------------|---------------|
| Starter | $5 | ~165 min | ~125 min |
| Standard | $25 | ~830 min | ~625 min |
| Pro | $100 | ~3,300 min | ~2,500 min |

**Rates:**
- US/Canada: $0.03/min
- UK: $0.04/min (mobile), $0.03/min (landline)
- Germany/France: $0.05/min (mobile), $0.04/min (landline)
- See full rate table in the app

---

## Business Model

| Your Rate | Twilio Cost | Your Margin |
|-----------|-------------|-------------|
| $0.03/min (US) | ~$0.014/min | ~53% |
| $0.04/min (UK) | ~$0.02/min | ~50% |
| $0.05/min (EU) | ~$0.025/min | ~50% |

---

## License

MIT

---

Built with ❤️ for the post-Skype world
