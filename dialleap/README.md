# DialLeap 📞

**Make cheap international calls from your browser. The best Skype alternative.**

🌐 [dialleap.com](https://dialleap.com)

---

## Features

- 📞 **Browser-based calling** — No app downloads, works everywhere
- ⏱️ **Per-second billing** — Pay for exactly what you use (20-30% savings)
- 💬 **SMS support** — Send texts worldwide for $0.05 each
- 🔔 **Callback queue** — We wait on hold, connect you when a human answers
- 📊 **Smart hold detection** — See estimated wait times before calling
- 💳 **Credits never expire** — No subscriptions, no monthly fees
- 🌍 **180+ countries** — Rates from $0.019/min

---

## Why DialLeap?

| Feature | DialLeap | Yadaphone | Google Voice |
|---------|----------|-----------|--------------|
| Per-second billing | ✅ | ❌ | ❌ |
| SMS support | ✅ | ❌ | Limited |
| Callback queue | ✅ | ❌ | ❌ |
| Hold time estimates | ✅ | ❌ | ❌ |
| No app needed | ✅ | ✅ | ❌ |
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

| Package | Price | Minutes to US |
|---------|-------|---------------|
| Starter | $5 | ~260 min |
| Standard | $25 | ~1,300 min |
| Pro | $100 | ~5,200 min |

---

## License

MIT

---

Built with ❤️ for the post-Skype world
