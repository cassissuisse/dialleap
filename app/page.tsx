'use client'

// ============================================================
// DIALLEAP - LANDING PAGE
// SEO-optimized, conversion-focused landing page
// Better than Yadaphone with unique differentiators
// ============================================================

import { useState, useEffect } from 'react'
import Link from 'next/link'

// SEO-targeted country rates
const RATES = [
  { country: 'United States', flag: '🇺🇸', code: '+1', mobile: '0.019', landline: '0.019' },
  { country: 'United Kingdom', flag: '🇬🇧', code: '+44', mobile: '0.029', landline: '0.020' },
  { country: 'Germany', flag: '🇩🇪', code: '+49', mobile: '0.035', landline: '0.025' },
  { country: 'France', flag: '🇫🇷', code: '+33', mobile: '0.035', landline: '0.025' },
  { country: 'Canada', flag: '🇨🇦', code: '+1', mobile: '0.019', landline: '0.019' },
  { country: 'Australia', flag: '🇦🇺', code: '+61', mobile: '0.045', landline: '0.035' },
  { country: 'India', flag: '🇮🇳', code: '+91', mobile: '0.025', landline: '0.020' },
  { country: 'Japan', flag: '🇯🇵', code: '+81', mobile: '0.070', landline: '0.055' },
  { country: 'Mexico', flag: '🇲🇽', code: '+52', mobile: '0.035', landline: '0.025' },
  { country: 'Brazil', flag: '🇧🇷', code: '+55', mobile: '0.055', landline: '0.040' },
  { country: 'Spain', flag: '🇪🇸', code: '+34', mobile: '0.035', landline: '0.025' },
  { country: 'Italy', flag: '🇮🇹', code: '+39', mobile: '0.035', landline: '0.025' },
]

// Testimonials for social proof
const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Digital Nomad',
    text: 'Finally, a Skype replacement that actually works. Called my US bank from Thailand with crystal clear audio.',
    rating: 5,
  },
  {
    name: 'Marcus K.',
    role: 'Small Business Owner',
    text: 'The callback queue feature saved me hours waiting on hold with the IRS. Game changer.',
    rating: 5,
  },
  {
    name: 'Elena R.',
    role: 'Expat in Germany',
    text: 'Per-second billing means I actually pay for what I use. No more rounding up to the nearest minute.',
    rating: 5,
  },
]

// FAQ for SEO
const FAQS = [
  {
    q: 'How does DialLeap work?',
    a: 'DialLeap lets you make phone calls directly from your web browser. No app downloads, no SIM cards needed. Just open your browser, dial a number, and talk. We use VoIP technology to route your call over the internet at a fraction of traditional phone costs.',
  },
  {
    q: 'Is DialLeap a good Skype alternative?',
    a: 'Yes! DialLeap was built specifically to replace Skype for international calling. Unlike Skype, we offer per-second billing, SMS support, and innovative features like callback queue for long hold times. Many former Skype users have switched to DialLeap.',
  },
  {
    q: 'What countries can I call with DialLeap?',
    a: 'DialLeap supports calls to 180+ countries including the United States, Canada, UK, Germany, France, Australia, India, Japan, Mexico, Brazil, and many more. Check our rates page for the complete list.',
  },
  {
    q: 'Do I need to download an app?',
    a: 'No. DialLeap works entirely in your web browser. Just visit dialleap.com, sign up in 30 seconds, and start calling. Works on Chrome, Firefox, Safari, and Edge on both desktop and mobile.',
  },
  {
    q: 'How is billing calculated?',
    a: 'Unlike competitors who round up to the nearest minute, DialLeap bills per second. A 1 minute 15 second call is charged for exactly 75 seconds, not 2 minutes. This typically saves users 20-30% on their calling costs.',
  },
  {
    q: 'Can I send SMS messages?',
    a: 'Yes! DialLeap supports SMS to most countries for just $0.05 per message. This is a feature many VoIP services lack. Great for 2FA codes or quick messages.',
  },
  {
    q: 'What is the Callback Queue feature?',
    a: 'Our exclusive Callback Queue lets you avoid waiting on hold. We call the number, wait on hold for you, and connect you when a human answers. Perfect for calling the IRS, airlines, or any business with long hold times. Just $0.50 flat fee.',
  },
  {
    q: 'Do my credits expire?',
    a: 'Never. Your DialLeap credits never expire. Buy $5 today and use it over the next 5 years if you want. No subscriptions, no monthly fees, no pressure.',
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Dial<span className="text-emerald-400">Leap</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors font-medium">Pricing</a>
            <a href="#rates" className="text-zinc-400 hover:text-white transition-colors font-medium">Rates</a>
            <a href="#faq" className="text-zinc-400 hover:text-white transition-colors font-medium">FAQ</a>
            <Link
              href="/app"
              className="relative group px-6 py-2.5 rounded-full font-semibold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 transition-transform group-hover:scale-105" />
              <span className="relative">Start Free</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="text-sm text-zinc-300">Trusted by 10,000+ users worldwide</span>
          </div>

          {/* Main headline - SEO optimized */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            <span className="block">International Calls</span>
            <span className="block mt-2">
              From Your{' '}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Browser</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="url(#underline)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="underline" x1="0" y1="0" x2="200" y2="0">
                      <stop offset="0%" stopColor="#34d399"/>
                      <stop offset="100%" stopColor="#22d3ee"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The best <strong className="text-white">Skype alternative</strong> for cheap international calls. 
            No apps. No subscriptions. Just <strong className="text-emerald-400">$0.019/min</strong> to the US.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/app"
              className="group relative px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Start Calling Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <a
              href="#rates"
              className="px-8 py-4 rounded-2xl font-bold text-lg border border-white/10 hover:bg-white/5 transition-colors"
            >
              View All Rates
            </a>
          </div>

          {/* Key differentiators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Per-second billing</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>SMS support</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Credits never expire</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>180+ countries</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-zinc-500">
            <p className="text-sm uppercase tracking-wider">Trusted by users from</p>
            <div className="flex items-center gap-8 text-2xl">
              <span>🇺🇸</span>
              <span>🇬🇧</span>
              <span>🇩🇪</span>
              <span>🇫🇷</span>
              <span>🇯🇵</span>
              <span>🇦🇺</span>
              <span>🇮🇳</span>
              <span>🇧🇷</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-emerald-400">DialLeap</span>?
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Built for the post-Skype era. Everything you loved, plus features you didn't know you needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Per-Second Billing */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 hover:border-emerald-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Per-Second Billing</h3>
              <p className="text-zinc-400 leading-relaxed">
                Pay for exactly what you use. A 1:15 call costs 75 seconds, not 2 minutes. <strong className="text-white">Save 20-30%</strong> vs competitors who round up.
              </p>
            </div>

            {/* Feature 2: SMS Support */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 hover:border-teal-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">SMS Support</h3>
              <p className="text-zinc-400 leading-relaxed">
                Send text messages worldwide for just <strong className="text-white">$0.05/SMS</strong>. Perfect for 2FA codes, quick messages, or when calls aren't possible.
              </p>
            </div>

            {/* Feature 3: Callback Queue */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-amber-500/[0.08] to-transparent border border-amber-500/10 hover:border-amber-500/30 transition-all relative">
              <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                EXCLUSIVE
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Callback Queue</h3>
              <p className="text-zinc-400 leading-relaxed">
                Hate waiting on hold? We call, wait for you, and notify you when a human answers. <strong className="text-white">Just $0.50</strong>. Perfect for IRS, airlines, banks.
              </p>
            </div>

            {/* Feature 4: Hold Time Estimates */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 hover:border-cyan-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Hold Detection</h3>
              <p className="text-zinc-400 leading-relaxed">
                See estimated wait times for <strong className="text-white">10,000+ known numbers</strong> like the IRS, Social Security, and major airlines before you call.
              </p>
            </div>

            {/* Feature 5: No App Needed */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 hover:border-violet-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Browser-Based</h3>
              <p className="text-zinc-400 leading-relaxed">
                No downloads, no apps, no SIM cards. Works on <strong className="text-white">any device</strong> with a browser. Start calling in under 60 seconds.
              </p>
            </div>

            {/* Feature 6: Credits Never Expire */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 hover:border-rose-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Credits Never Expire</h3>
              <p className="text-zinc-400 leading-relaxed">
                Buy credits once, use them forever. No monthly fees, no subscriptions, no <strong className="text-white">use-it-or-lose-it</strong> pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-zinc-400">
              No subscriptions. No hidden fees. Just pay for what you use.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-bold">$5</span>
              </div>
              <p className="text-zinc-500 mb-6">~260 minutes to US</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Per-second billing
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SMS support
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Never expires
                </li>
              </ul>
              <Link href="/app" className="block w-full py-3 rounded-xl border border-white/10 text-center font-semibold hover:bg-white/5 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Popular */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">Standard</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-bold">$25</span>
              </div>
              <p className="text-zinc-500 mb-6">~1,300 minutes to US</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Starter
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 callback queue uses
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <Link href="/app" className="block w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-center font-bold hover:opacity-90 transition-opacity">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-bold">$100</span>
              </div>
              <p className="text-zinc-500 mb-6">~5,200 minutes to US</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Standard
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Team sharing
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Analytics dashboard
                </li>
              </ul>
              <Link href="/app" className="block w-full py-3 rounded-xl border border-white/10 text-center font-semibold hover:bg-white/5 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rates Section */}
      <section id="rates" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              International Calling Rates
            </h2>
            <p className="text-xl text-zinc-400">
              Transparent pricing to 180+ countries. No connection fees.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-zinc-400 font-medium">Country</th>
                  <th className="text-right py-4 px-4 text-zinc-400 font-medium">Mobile</th>
                  <th className="text-right py-4 px-4 text-zinc-400 font-medium">Landline</th>
                </tr>
              </thead>
              <tbody>
                {RATES.map((rate, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{rate.flag}</span>
                        <div>
                          <p className="font-medium">{rate.country}</p>
                          <p className="text-sm text-zinc-500">{rate.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-mono text-emerald-400">${rate.mobile}/min</td>
                    <td className="text-right py-4 px-4 font-mono text-zinc-400">${rate.landline}/min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link href="/rates" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              View all 180+ country rates
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-zinc-400">
              Join thousands who switched from Skype to DialLeap
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-zinc-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-zinc-400">
              Everything you need to know about DialLeap
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <h3 className="font-semibold text-lg">{faq.q}</h3>
                  <svg
                    className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Your First Call?
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            Start with a free call. No credit card required.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-xl hover:opacity-90 transition-opacity"
          >
            Start Calling Free
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">DialLeap</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The best Skype alternative for international calls. Browser-based, per-second billing, credits never expire.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#rates" className="hover:text-white transition-colors">Rates</a></li>
                <li><Link href="/app" className="hover:text-white transition-colors">Start Calling</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/api" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500 text-sm">© 2025 DialLeap. All rights reserved.</p>
            <p className="text-zinc-500 text-sm">Made with ❤️ for the post-Skype world</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
