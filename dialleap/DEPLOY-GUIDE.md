# DialLeap - Vercel Deployment Guide

## 🚀 Deploy DialLeap in 15 Minutes

---

## Part 1: Create Accounts (5 minutes)

### 1. GitHub (stores your code)
1. Go to **github.com** → Sign up
2. Verify your email

### 2. Vercel (hosts your app)  
1. Go to **vercel.com** → Sign up
2. Choose **"Continue with GitHub"**

### 3. Supabase (database)
1. Go to **supabase.com** → Start your project
2. Sign in with GitHub
3. Create project named `dialleap`
4. Wait 2 minutes for setup

---

## Part 2: Upload to GitHub (3 minutes)

### Create Repository
1. Go to github.com
2. Click **+** → **New repository**
3. Name: `dialleap`
4. Make it **Public**
5. Check **Add a README**
6. Click **Create repository**

### Upload Files
1. Click **Add file** → **Upload files**
2. Unzip the `dialleap.zip` file on your computer
3. Drag ALL files/folders into GitHub
4. Click **Commit changes**

---

## Part 3: Deploy to Vercel (2 minutes)

1. Go to **vercel.com/dashboard**
2. Click **Add New** → **Project**
3. Import `dialleap` from your repositories
4. Framework: Should auto-detect **Next.js**
5. Click **Deploy**
6. Wait 1-2 minutes

🎉 Your app is now live at `dialleap-xxxx.vercel.app`!

---

## Part 4: Set Up Database (5 minutes)

### Get Supabase Keys
1. Go to your Supabase project
2. Click **Project Settings** → **API**
3. Copy:
   - Project URL
   - anon public key
   - service_role key (click Reveal)

### Run Database Setup
1. In Supabase, click **SQL Editor**
2. Click **New query**
3. Copy everything from `database.sql`
4. Paste and click **Run**

### Add Keys to Vercel
1. Vercel → Your project → **Settings**
2. Click **Environment Variables**
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service_role key

4. Click **Deployments** → **...** → **Redeploy**

---

## Part 5: Add Twilio (for real calls)

### Create Twilio Account
1. Go to **twilio.com/try-twilio**
2. Sign up, verify phone
3. Add $20 credit

### Get Twilio Keys
1. Copy Account SID and Auth Token from dashboard
2. Buy a phone number (Phone Numbers → Buy)
3. Copy the number

### Add to Vercel
Add these environment variables:
- `TWILIO_ACCOUNT_SID` = your Account SID
- `TWILIO_AUTH_TOKEN` = your Auth Token  
- `TWILIO_PHONE_NUMBER` = your phone number

Redeploy!

---

## Part 6: Add Stripe (for payments)

### Create Stripe Account
1. Go to **stripe.com** → Start now
2. Create account

### Get Stripe Keys
1. Go to Developers → API keys
2. Copy Publishable key and Secret key

### Add to Vercel
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = pk_...
- `STRIPE_SECRET_KEY` = sk_...

Redeploy!

---

## 🎉 You're Done!

Your DialLeap app is live with:
- ✅ Landing page with SEO
- ✅ Phone dialer
- ✅ SMS support  
- ✅ Callback queue feature
- ✅ User accounts
- ✅ Payment processing

---

## 💰 Costs

| Service | Cost |
|---------|------|
| Vercel | Free |
| Supabase | Free |
| GitHub | Free |
| Twilio | ~$20 to start |
| Stripe | Free (2.9% per sale) |

**Total: ~$20 to launch**

---

## 🌐 Custom Domain

Want dialleap.com?

1. Buy domain from Namecheap (~$10/year)
2. Vercel → Settings → Domains
3. Add your domain
4. Follow DNS instructions

---

## 📈 Marketing Your App

### SEO Tips (already built-in)
- Optimized title tags and meta descriptions
- Schema markup for rich snippets
- FAQ section for featured snippets
- Mobile-responsive design
- Fast loading speed

### Launch Checklist
1. [ ] Post on Product Hunt
2. [ ] Post on Reddit r/digitalnomad, r/expats
3. [ ] Write blog posts targeting "Skype alternative"
4. [ ] Create comparison pages (vs Yadaphone, vs Google Voice)
5. [ ] Set up Google Search Console

### Target Keywords (built into landing page)
- "cheap international calls"
- "Skype alternative"
- "call from browser"
- "international calling app"
- "browser calling"

---

## Questions?

The code is well-commented. Good luck with DialLeap! 🚀
