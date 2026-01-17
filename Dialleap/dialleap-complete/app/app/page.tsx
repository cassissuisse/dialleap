'use client'

// app/app/page.tsx
// DialLeap - Real browser-to-phone calling with Twilio Client SDK

import { useState, useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'

// ============================================
// CONFIGURATION
// ============================================

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

const COUNTRIES: Record<string, { name: string; flag: string; rate: number }> = {
  '+1': { name: 'US/Canada', flag: '🇺🇸', rate: 2 },
  '+44': { name: 'UK', flag: '🇬🇧', rate: 3 },
  '+49': { name: 'Germany', flag: '🇩🇪', rate: 4 },
  '+33': { name: 'France', flag: '🇫🇷', rate: 4 },
  '+41': { name: 'Switzerland', flag: '🇨🇭', rate: 5 },
  '+81': { name: 'Japan', flag: '🇯🇵', rate: 8 },
  '+61': { name: 'Australia', flag: '🇦🇺', rate: 5 },
  '+91': { name: 'India', flag: '🇮🇳', rate: 3 },
  '+52': { name: 'Mexico', flag: '🇲🇽', rate: 4 },
  '+55': { name: 'Brazil', flag: '🇧🇷', rate: 6 },
}

const KNOWN_NUMBERS: Record<string, { name: string; avgHold: number; tip: string }> = {
  '+18008291040': { name: 'IRS', avgHold: 45, tip: 'Call early Tue-Thu, 7-8 AM EST' },
  '+18007721213': { name: 'Social Security', avgHold: 35, tip: 'Wednesdays have shortest waits' },
  '+18004321000': { name: 'US Passport', avgHold: 25, tip: 'Call right when they open' },
  '+18002829749': { name: 'USCIS', avgHold: 55, tip: 'Avoid Monday mornings' },
}

// Emergency numbers that should be blocked (use a real phone for emergencies)
const EMERGENCY_NUMBERS = [
  '911',        // US/Canada
  '112',        // EU/International
  '999',        // UK
  '000',        // Australia
  '110',        // Germany/Japan police
  '119',        // Japan fire/ambulance
  '117',        // Switzerland police
  '118',        // Switzerland fire
  '144',        // Switzerland ambulance
  '190',        // Brazil
  '100',        // India police
  '101',        // India fire
  '102',        // India ambulance
  '108',        // India emergency
]

// ============================================
// TYPES
// ============================================

declare global {
  interface Window {
    Twilio: any
  }
}

type CallState = 'idle' | 'initializing' | 'ready' | 'dialing' | 'connected' | 'ended' | 'error'

// ============================================
// MAIN COMPONENT
// ============================================

export default function DialLeap() {
  // State
  const [number, setNumber] = useState('')
  const [credits, setCredits] = useState(500)
  const [callState, setCallState] = useState<CallState>('idle')
  const [callDuration, setCallDuration] = useState(0)
  const [activeTab, setActiveTab] = useState('dialer')
  const [showTopUp, setShowTopUp] = useState(false)
  const [callHistory, setCallHistory] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [twilioReady, setTwilioReady] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  
  // Refs
  const deviceRef = useRef<any>(null)
  const callRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const callStartTimeRef = useRef<number>(0)

  // ============================================
  // TWILIO INITIALIZATION
  // ============================================

  const initializeTwilio = useCallback(async () => {
    if (!window.Twilio) {
      console.log('Twilio SDK not loaded yet')
      return
    }

    try {
      setCallState('initializing')
      setError(null)

      // Get access token from our API
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to get token')
      }

      const { token } = await response.json()

      // Initialize Twilio Device
      const device = new window.Twilio.Device(token, {
        codecPreferences: ['opus', 'pcmu'],
        enableRingingState: true,
      })

      // Set up event handlers
      device.on('registered', () => {
        console.log('Twilio Device registered')
        setCallState('ready')
        setTwilioReady(true)
      })

      device.on('error', (error: any) => {
        console.error('Twilio Device error:', error)
        setError(error.message || 'Device error')
        setCallState('error')
      })

      device.on('incoming', (call: any) => {
        console.log('Incoming call:', call)
        // For now, we reject incoming calls
        call.reject()
      })

      // Register the device
      await device.register()
      deviceRef.current = device

    } catch (err: any) {
      console.error('Failed to initialize Twilio:', err)
      setError(err.message || 'Failed to initialize calling')
      setCallState('error')
    }
  }, [])

  // Initialize Twilio when SDK is loaded
  const handleTwilioLoad = () => {
    console.log('Twilio SDK loaded')
    initializeTwilio()
  }

  // ============================================
  // CALL HANDLERS
  // ============================================

  // Check if a number is an emergency number
  const isEmergencyNumber = (num: string): boolean => {
    const cleaned = num.replace(/[\s\-\(\)\+]/g, '')
    return EMERGENCY_NUMBERS.some(emergency => 
      cleaned === emergency || 
      cleaned.endsWith(emergency) && cleaned.length <= emergency.length + 3
    )
  }

  const handleCall = async () => {
    if (number.length < 3) return
    
    // Block emergency numbers
    if (isEmergencyNumber(number)) {
      setError('⚠️ Emergency calls (911, 112, etc.) cannot be made through DialLeap. Please use a regular phone for emergencies.')
      return
    }
    
    if (number.length < 5) return
    if (credits < currentRate) {
      setShowTopUp(true)
      return
    }

    if (!deviceRef.current || !twilioReady) {
      setError('Phone system not ready. Please wait...')
      initializeTwilio()
      return
    }

    try {
      setCallState('dialing')
      setError(null)

      // Format the number
      let dialNumber = number.replace(/[\s\-\(\)]/g, '')
      if (!dialNumber.startsWith('+')) {
        dialNumber = '+' + dialNumber
      }

      // Make the call
      const call = await deviceRef.current.connect({
        params: {
          To: dialNumber,
        }
      })

      callRef.current = call

      // Set up call event handlers
      call.on('accept', () => {
        console.log('Call accepted/connected')
        setCallState('connected')
        setCallDuration(0)
        callStartTimeRef.current = Date.now()
      })

      call.on('disconnect', () => {
        console.log('Call disconnected')
        handleCallEnded()
      })

      call.on('cancel', () => {
        console.log('Call cancelled')
        handleCallEnded()
      })

      call.on('reject', () => {
        console.log('Call rejected')
        setError('Call was rejected')
        handleCallEnded()
      })

      call.on('error', (error: any) => {
        console.error('Call error:', error)
        setError(error.message || 'Call failed')
        handleCallEnded()
      })

      // Ringing state
      call.on('ringing', () => {
        console.log('Ringing...')
        setCallState('dialing')
      })

    } catch (err: any) {
      console.error('Failed to make call:', err)
      setError(err.message || 'Failed to connect call')
      setCallState('ready')
    }
  }

  const handleEndCall = () => {
    if (callRef.current) {
      callRef.current.disconnect()
    }
    handleCallEnded()
  }

  const handleCallEnded = () => {
    const duration = callDuration
    const cost = Math.ceil((duration / 60) * currentRate)
    
    // Deduct credits
    if (duration > 0) {
      setCredits(prev => Math.max(0, prev - cost))
      
      // Add to history
      setCallHistory(prev => [{
        id: Date.now(),
        number: number,
        country: currentCountry.flag,
        duration: duration,
        cost: cost,
        date: new Date().toLocaleDateString()
      }, ...prev.slice(0, 19)])
    }
    
    setCallState('ended')
    callRef.current = null
    
    setTimeout(() => {
      setCallState('ready')
      setCallDuration(0)
    }, 1500)
  }

  const handleToggleMute = () => {
    if (callRef.current) {
      if (isMuted) {
        callRef.current.mute(false)
      } else {
        callRef.current.mute(true)
      }
      setIsMuted(!isMuted)
    }
  }

  const handleSendDigit = (digit: string) => {
    if (callRef.current && callState === 'connected') {
      callRef.current.sendDigits(digit)
    }
  }

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (deviceRef.current) {
        deviceRef.current.destroy()
      }
    }
  }, [])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getCountry = (num: string) => {
    const cleaned = num.replace(/[\s\-\(\)]/g, '')
    for (const [code, info] of Object.entries(COUNTRIES)) {
      if (cleaned.startsWith(code)) {
        return { code, ...info }
      }
    }
    return { code: '', name: 'Unknown', flag: '🌍', rate: 10 }
  }

  const getKnownNumber = (num: string) => {
    const cleaned = num.replace(/[\s\-\(\)]/g, '')
    return KNOWN_NUMBERS[cleaned] || null
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatCredits = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const handleDial = (digit: string) => {
    // If in a call, send DTMF tone
    if (callState === 'connected') {
      handleSendDigit(digit)
      return
    }
    
    if (number.length < 20) {
      if (digit === '0' && number === '') {
        setNumber('+')
      } else {
        setNumber(prev => prev + digit)
      }
    }
  }

  const handleBackspace = () => {
    setNumber(prev => prev.slice(0, -1))
  }

  const handleTopUp = async (amount: number) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          // Demo mode
          setCredits(prev => prev + (amount * 100))
          setShowTopUp(false)
        }
      } else {
        // Demo mode
        setCredits(prev => prev + (amount * 100))
        setShowTopUp(false)
      }
    } catch (err) {
      // Demo mode
      setCredits(prev => prev + (amount * 100))
      setShowTopUp(false)
    }
  }

  // Current values
  const currentCountry = getCountry(number)
  const currentRate = currentCountry.rate
  const estimatedMinutes = Math.floor(credits / currentRate)
  const knownNumber = getKnownNumber(number)

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* Load Twilio Client SDK */}
      <Script 
        src="https://sdk.twilio.com/js/client/releases/1.14/twilio.min.js"
        onLoad={handleTwilioLoad}
      />

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
                <p className="text-xs text-muted">
                  {!twilioReady && callState === 'initializing' && '🔄 Connecting...'}
                  {!twilioReady && callState === 'idle' && '⏳ Loading...'}
                  {!twilioReady && callState === 'error' && '❌ Connection failed'}
                  {twilioReady && '✅ Ready to call'}
                </p>
              </div>
            </div>
            
            {/* Status indicator */}
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: twilioReady ? '#10b981' : callState === 'error' ? '#ef4444' : '#fbbf24',
              boxShadow: twilioReady ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
            }} />
          </div>

          {/* Emergency Notice Banner */}
          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <p style={{ color: '#fcd34d', fontSize: 12, lineHeight: 1.4 }}>
              <strong>Not for emergencies.</strong> DialLeap cannot call 911, 112, or other emergency services. Use a regular phone for emergencies.
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <p style={{ color: '#fca5a5', fontSize: 14 }}>{error}</p>
              <button 
                onClick={() => setError(null)}
                style={{ color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Credits Display */}
          <div className="glass rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Balance</p>
                <p className="credits-display" style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                  {formatCredits(credits)}
                </p>
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
              style={{
                width: '100%',
                marginTop: 16,
                padding: '12px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Credits
            </button>
          </div>

          {/* Known Number Info */}
          {knownNumber && callState !== 'connected' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16
            }}>
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
                  <p className="text-xs" style={{ color: '#e4e4e7', marginTop: 4 }}>
                    Avg hold: <span style={{ color: '#fbbf24' }}>{knownNumber.avgHold} min</span>
                  </p>
                  <p className="text-xs" style={{ color: '#a1a1aa', marginTop: 4 }}>💡 {knownNumber.tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="glass rounded-2xl" style={{ overflow: 'hidden' }}>
            
            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === 'dialer' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'dialer' ? 'white' : '#71717a',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
                onClick={() => setActiveTab('dialer')}
              >
                📞 Dialer
              </button>
              <button 
                style={{
                  flex: 1,
                  padding: '16px',
                  background: activeTab === 'history' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: 'none',
                  color: activeTab === 'history' ? 'white' : '#71717a',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
                onClick={() => setActiveTab('history')}
              >
                📋 History
              </button>
            </div>

            <div style={{ padding: 24 }}>
              
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
                          background: 'rgba(16, 185, 129, 0.2)',
                          animation: 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }} />
                        <div style={{ position: 'relative' }}>
                          <p style={{ fontSize: 14, color: '#10b981', marginBottom: 8 }}>
                            🔊 Connected
                          </p>
                          <p style={{ fontSize: 40, fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>
                            {formatDuration(callDuration)}
                          </p>
                          <p style={{ fontSize: 14, color: '#a1a1aa', marginTop: 4 }}>{number}</p>
                        </div>
                      </div>
                    ) : callState === 'dialing' ? (
                      <div>
                        <p style={{ fontSize: 14, color: '#fbbf24', marginBottom: 8, animation: 'pulse 1s infinite' }}>
                          📞 Calling...
                        </p>
                        <p style={{ fontSize: 28, fontWeight: 600, color: '#e4e4e7' }}>{number || '\u00A0'}</p>
                      </div>
                    ) : callState === 'ended' ? (
                      <div>
                        <p style={{ fontSize: 14, color: '#a1a1aa', marginBottom: 8 }}>Call ended</p>
                        <p style={{ fontSize: 28, fontWeight: 600, color: '#e4e4e7' }}>{formatDuration(callDuration)}</p>
                      </div>
                    ) : (
                      <div style={{ minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <p style={{ fontSize: 28, fontWeight: 600, color: number ? 'white' : '#52525b' }}>
                          {number || 'Enter number'}
                        </p>
                        {number && (
                          <p style={{ fontSize: 14, color: '#a1a1aa', marginTop: 4 }}>
                            {currentCountry.flag} {currentCountry.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dial Pad - Show when idle/ready, or during call for DTMF */}
                  {(callState === 'idle' || callState === 'ready' || callState === 'initializing' || callState === 'connected') && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 12,
                      marginBottom: 24
                    }}>
                      {DIAL_PAD.map(({ digit, letters }) => (
                        <button
                          key={digit}
                          onClick={() => handleDial(digit)}
                          style={{
                            aspectRatio: '1.3',
                            borderRadius: 16,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: 24, fontWeight: 500 }}>{digit}</span>
                          {letters && <span style={{ fontSize: 10, color: '#71717a', marginTop: 2 }}>{letters}</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Call Controls */}
                  <div className="flex items-center justify-center gap-4">
                    {/* Backspace button - only when not in call */}
                    {(callState === 'idle' || callState === 'ready') && number && (
                      <button 
                        onClick={handleBackspace} 
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: 'none',
                          color: '#a1a1aa',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                      </button>
                    )}

                    {/* Mute button - only during call */}
                    {callState === 'connected' && (
                      <button 
                        onClick={handleToggleMute}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: 'none',
                          color: isMuted ? '#fca5a5' : '#a1a1aa',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isMuted ? (
                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                        ) : (
                          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        )}
                      </button>
                    )}
                    
                    {/* Main call/end button */}
                    {callState === 'connected' || callState === 'dialing' ? (
                      <button 
                        onClick={handleEndCall}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                        </svg>
                      </button>
                    ) : (
                      <button 
                        onClick={handleCall}
                        disabled={number.length < 5 || (!twilioReady && callState !== 'error')}
                        style={{
                          width: 72,
                          height: 72,
                          borderRadius: '50%',
                          background: number.length >= 5 && twilioReady
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : 'rgba(255, 255, 255, 0.1)',
                          boxShadow: number.length >= 5 && twilioReady
                            ? '0 4px 20px rgba(16, 185, 129, 0.4)'
                            : 'none',
                          border: 'none',
                          cursor: number.length >= 5 && twilioReady ? 'pointer' : 'not-allowed',
                          opacity: number.length >= 5 ? 1 : 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Retry button if error */}
                  {callState === 'error' && (
                    <button 
                      onClick={initializeTwilio}
                      style={{
                        width: '100%',
                        marginTop: 16,
                        padding: '12px',
                        borderRadius: 12,
                        background: 'rgba(251, 191, 36, 0.1)',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 500
                      }}
                    >
                      🔄 Retry Connection
                    </button>
                  )}
                </>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {callHistory.length === 0 ? (
                    <div className="text-center" style={{ padding: '40px 0' }}>
                      <p style={{ fontSize: 40, marginBottom: 8 }}>📞</p>
                      <p style={{ color: '#71717a' }}>No calls yet</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {callHistory.map((call) => (
                        <div
                          key={call.id}
                          onClick={() => {
                            setNumber(call.number)
                            setActiveTab('dialer')
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            borderRadius: 12,
                            background: 'rgba(255, 255, 255, 0.02)',
                            cursor: 'pointer'
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
                              <p style={{ fontWeight: 500, fontSize: 14 }}>{call.number}</p>
                              <p style={{ fontSize: 12, color: '#71717a' }}>
                                {call.date} · {formatDuration(call.duration)}
                              </p>
                            </div>
                          </div>
                          <p style={{ fontSize: 14, color: '#71717a' }}>
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

          {/* Footer note */}
          <p className="text-center text-xs mt-6" style={{ color: '#52525b' }}>
            ⚠️ DialLeap cannot be used for emergency calls (911)
          </p>
          <p className="text-center text-xs mt-2" style={{ color: '#52525b' }}>
            Rates from $0.02/min · 180+ countries · Credits never expire
          </p>
        </div>

        {/* Top Up Modal */}
        {showTopUp && (
          <div 
            onClick={() => setShowTopUp(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              zIndex: 50
            }}
          >
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                background: '#18181b',
                borderRadius: 24,
                padding: 24,
                width: '100%',
                maxWidth: 400,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Add Credits</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[5, 10, 25, 50].map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleTopUp(amount)}
                    style={{
                      padding: '20px 16px',
                      borderRadius: 16,
                      background: amount === 25 
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.1) 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: amount === 25 
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>${amount}</p>
                    <p style={{ fontSize: 12, color: '#a1a1aa', marginTop: 4 }}>
                      ~{Math.floor(amount / 0.02)} min to US
                    </p>
                    {amount === 25 && (
                      <p style={{ fontSize: 12, color: '#a7f3d0', marginTop: 4 }}>Most Popular</p>
                    )}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#71717a', textAlign: 'center' }}>
                Powered by Stripe · Credits never expire
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.7;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  )
}
