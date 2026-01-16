'use client'

// app/app/page.tsx
// This is the main DialLeap app - everything in one file for simplicity
// BILLING: Per-minute, rounded UP (industry standard)

import { useState, useEffect, useRef } from 'react'

// ============================================
// CONFIGURATION
// ============================================

// Dial pad layout
const DIAL_PAD = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' },
]

// Country codes and rates (cents per minute)
// These rates give ~40-50% margin over Twilio costs
const COUNTRIES = {
  '+1': { name: 'US/Canada', flag: '🇺🇸', rate: 3 },      // Twilio: ~1.4¢
  '+44': { name: 'UK', flag: '🇬🇧', rate: 4 },            // Twilio: ~2¢
  '+49': { name: 'Germany', flag: '🇩🇪', rate: 5 },       // Twilio: ~2.5¢
  '+33': { name: 'France', flag: '🇫🇷', rate: 5 },        // Twilio: ~2.5¢
  '+81': { name: 'Japan', flag: '🇯🇵', rate: 10 },        // Twilio: ~5¢
  '+61': { name: 'Australia', flag: '🇦🇺', rate: 6 },     // Twilio: ~3¢
  '+91': { name: 'India', flag: '🇮🇳', rate: 4 },         // Twilio: ~2¢
  '+52': { name: 'Mexico', flag: '🇲🇽', rate: 5 },        // Twilio: ~2.5¢
  '+55': { name: 'Brazil', flag: '🇧🇷', rate: 8 },        // Twilio: ~4¢
}

// Known numbers with hold time info
const KNOWN_NUMBERS = {
  '+18008291040': { name: 'IRS', avgHold: 45, tip: 'Call early Tue-Thu, 7-8 AM EST' },
  '+18007721213': { name: 'Social Security', avgHold: 35, tip: 'Wednesdays have shortest waits' },
  '+18004321000': { name: 'US Passport', avgHold: 25, tip: 'Call right when they open' },
  '+18002829749': { name: 'USCIS', avgHold: 55, tip: 'Avoid Monday mornings' },
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DialLeap() {
  // State
  const [number, setNumber] = useState('')
  const [credits, setCredits] = useState(500) // Start with $5.00 (in cents)
  const [callState, setCallState] = useState('idle') // idle, dialing, connected, ended
  const [callDuration, setCallDuration] = useState(0)
  const [activeTab, setActiveTab] = useState('dialer')
  const [showTopUp, setShowTopUp] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [callHistory, setCallHistory] = useState([])
  
  // Timer ref for call duration
  const timerRef = useRef(null)

  // ============================================
  // EFFECTS
  // ============================================

  // Call duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(d => d + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [callState])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Get country info from phone number
  const getCountry = (num) => {
    const cleaned = num.replace(/[\s\-\(\)]/g, '')
    for (const [code, info] of Object.entries(COUNTRIES)) {
      if (cleaned.startsWith(code)) {
        return { code, ...info }
      }
    }
    return { code: '', name: 'Unknown', flag: '🌍', rate: 15 }
  }

  // Check if number is a known number
  const getKnownNumber = (num) => {
    const cleaned = num.replace(/[\s\-\(\)]/g, '')
    return KNOWN_NUMBERS[cleaned] || null
  }

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format credits as dollars
  const formatCredits = (cents) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  // Calculate billed minutes (rounded UP)
  const getBilledMinutes = (seconds) => {
    if (seconds === 0) return 0
    return Math.ceil(seconds / 60)
  }

  // Current rate based on number
  const currentCountry = getCountry(number)
  const currentRate = currentCountry.rate
  const estimatedMinutes = Math.floor(credits / currentRate)
  const knownNumber = getKnownNumber(number)

  // ============================================
  // HANDLERS
  // ============================================

  // Add digit to number
  const handleDial = (digit) => {
    if (number.length < 20) {
      // Long press 0 adds +
      if (digit === '0' && number === '') {
        setNumber('+')
      } else {
        setNumber(prev => prev + digit)
      }
    }
  }

  // Remove last digit
  const handleBackspace = () => {
    setNumber(prev => prev.slice(0, -1))
  }

  // Start a call
  const handleCall = async () => {
    if (number.length < 5) return
    if (credits < currentRate) {
      setShowTopUp(true)
      return
    }

    setCallState('dialing')

    // In production, this would call your API to initiate Twilio call
    // For demo, we simulate the connection
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: number })
      })
      
      if (!response.ok) {
        // If API fails, still simulate for demo
        console.log('API not configured, simulating call')
      }
    } catch (err) {
      console.log('Running in demo mode')
    }

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setCallState('connected')
      setCallDuration(0)
    }, 2000)
  }

  // End a call
  const handleEndCall = () => {
    // BILLING: Round up to nearest minute
    const billedMinutes = getBilledMinutes(callDuration)
    const cost = billedMinutes * currentRate
    
    // Deduct credits
    setCredits(prev => Math.max(0, prev - cost))
    
    // Add to history
    setCallHistory(prev => [{
      id: Date.now(),
      number: number,
      country: currentCountry.flag,
      duration: callDuration,
      billedMinutes: billedMinutes,
      cost: cost,
      date: new Date().toLocaleDateString()
    }, ...prev.slice(0, 19)])
    
    // Reset state
    setCallState('ended')
    setTimeout(() => {
      setCallState('idle')
      setCallDuration(0)
    }, 1500)
  }

  // Handle top-up (opens Stripe checkout)
  const handleTopUp = async (amount) => {
    // In production, this creates a Stripe checkout session
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        // Demo mode - just add credits
        setCredits(prev => prev + (amount * 100))
        setShowTopUp(false)
      }
    } catch (err) {
      // Demo mode - just add credits
      setCredits(prev => prev + (amount * 100))
      setShowTopUp(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-gradient" style={{ minHeight: '100vh', padding: '16px' }}>
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
            }}>
              <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 600 }}>DialLeap</h1>
              <p className="text-xs text-muted">Call anywhere, from your browser</p>
            </div>
          </div>
        </div>

        {/* Credits Display */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Balance</p>
              <p className="credits-display">{formatCredits(credits)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">
                {number ? `To ${currentCountry.flag}` : 'Est. minutes'}
              </p>
              <p style={{ fontSize: 24, fontWeight: 600, color: '#d4d4d8' }}>
                ~{estimatedMinutes} min
              </p>
              <p className="text-xs text-muted">${(currentRate / 100).toFixed(2)}/min</p>
            </div>
          </div>
          <button 
            onClick={() => setShowTopUp(true)}
            className="btn-secondary mt-4 flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Credits
          </button>
        </div>

        {/* Known Number Info */}
        {knownNumber && callState === 'idle' && (
          <div className="info-card">
            <div className="flex gap-3">
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(251, 191, 36, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span>⏱️</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#fbbf24' }}>{knownNumber.name}</p>
                <p className="text-xs text-light mt-1">
                  Avg hold: <span className="text-amber">{knownNumber.avgHold} min</span>
                </p>
                <p className="text-xs text-muted mt-1">💡 {knownNumber.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="glass rounded-2xl" style={{ overflow: 'hidden' }}>
          
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              className={`tab ${activeTab === 'dialer' ? 'active' : ''}`}
              onClick={() => setActiveTab('dialer')}
            >
              📞 Dialer
            </button>
            <button 
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📋 History
            </button>
          </div>

          <div className="p-6">
            
            {/* Dialer Tab */}
            {activeTab === 'dialer' && (
              <>
                {/* Number Display */}
                <div className="text-center mb-6">
                  {callState === 'connected' ? (
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.2)'
                      }} className="pulse-ring" />
                      <div style={{ position: 'relative' }}>
                        <p className="text-sm text-emerald mb-2">Connected</p>
                        <p className="number-display" style={{ fontSize: 40 }}>
                          {formatDuration(callDuration)}
                        </p>
                        <p className="text-sm text-muted">{number}</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Billed: {getBilledMinutes(callDuration)} min
                        </p>
                      </div>
                    </div>
                  ) : callState === 'dialing' ? (
                    <div>
                      <p className="text-sm text-amber mb-2" style={{ animation: 'pulse 1s infinite' }}>
                        Connecting...
                      </p>
                      <p className="number-display text-light">{number || '\u00A0'}</p>
                    </div>
                  ) : callState === 'ended' ? (
                    <div>
                      <p className="text-sm text-muted mb-2">Call ended</p>
                      <p className="number-display text-light">{formatDuration(callDuration)}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Billed: {getBilledMinutes(callDuration)} min
                      </p>
                    </div>
                  ) : (
                    <div style={{ minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <p className="number-display">
                        {number || <span className="text-muted">Enter number</span>}
                      </p>
                      {number && (
                        <p className="text-sm text-muted mt-1">
                          {currentCountry.flag} {currentCountry.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Dial Pad */}
                {callState === 'idle' && (
                  <div className="grid-3 mb-6">
                    {DIAL_PAD.map(({ digit, letters }) => (
                      <button
                        key={digit}
                        onClick={() => handleDial(digit)}
                        className="dial-btn"
                      >
                        <span>{digit}</span>
                        {letters && <span className="dial-btn-letters">{letters}</span>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4">
                  {callState === 'idle' && number && (
                    <button onClick={handleBackspace} className="backspace-btn">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                      </svg>
                    </button>
                  )}
                  
                  {callState === 'connected' ? (
                    <button onClick={handleEndCall} className="end-btn">
                      <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                      </svg>
                    </button>
                  ) : callState === 'idle' ? (
                    <button 
                      onClick={handleCall}
                      disabled={number.length < 5}
                      className="call-btn"
                    >
                      <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                  ) : null}
                </div>
              </>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {callHistory.length === 0 ? (
                  <div className="text-center" style={{ padding: '40px 0' }}>
                    <p style={{ fontSize: 40, marginBottom: 8 }}>📞</p>
                    <p className="text-muted">No calls yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {callHistory.map((call) => (
                      <div
                        key={call.id}
                        className="history-item"
                        onClick={() => {
                          setNumber(call.number)
                          setActiveTab('dialer')
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#27272a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span>{call.country}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{call.number}</p>
                            <p className="text-xs text-muted">
                              {call.date} · {formatDuration(call.duration)} ({call.billedMinutes} min billed)
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted">
                          -${(call.cost / 100).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-6">
          Rates from $0.03/min · 180+ countries · Credits never expire
        </p>
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="modal-overlay" onClick={() => setShowTopUp(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Add Credits</h3>
            <div className="grid-2 mb-4">
              {[5, 10, 25, 50].map(amount => (
                <button
                  key={amount}
                  onClick={() => handleTopUp(amount)}
                  className={`topup-btn ${amount === 25 ? 'popular' : ''}`}
                >
                  <p style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>${amount}</p>
                  <p className="text-xs text-light">~{Math.floor(amount / 0.03)} min to US</p>
                  {amount === 25 && (
                    <p className="text-xs" style={{ color: '#a7f3d0', marginTop: 4 }}>Most Popular</p>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted text-center">
              Powered by Stripe · Credits never expire
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
