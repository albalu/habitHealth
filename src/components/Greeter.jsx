import React, { useEffect, useRef, useState } from 'react'
import { DIMENSIONS, SYSTEMS } from '../data/model.js'

/**
 * Vita — an animated guide that greets every visitor and reacts, live, to each
 * habit swap with the score movement it actually caused. Pure client-side:
 * scripted commentary over the app's own data model, optional voice through
 * the browser's built-in speech synthesis. No network calls, nothing collected.
 */

const VOICE_KEY = 'vitalmap.voice'

/** One short, sourced-in-spirit line per habit face (kept in sync with model.js claims). */
const FLAVOR = {
  movement: {
    good: 'Back on your feet — 8 to 10k steps a day is tied to a 40–53% lower risk of early death.',
    bad: 'Ouch. Sitting 8+ hours a day sharply raises mortality risk unless activity offsets it.',
  },
  strength: {
    good: 'Strength work is on. Just 30–60 minutes a week links to 10–17% lower all-cause mortality.',
    bad: 'No resistance training — muscle is your metabolic engine, and it fades without pushback.',
  },
  diet: {
    good: 'Plants on the plate. Benefit peaks around 800 g of fruit and veg a day.',
    bad: 'Ultra-processed meals most of the time — gut, liver and blood sugar all carry that load.',
  },
  sleep: {
    good: 'Sleep restored. Seven to eight hours sits right at the low point of the mortality curve.',
    bad: 'Short sleep hits the brain first — mood, memory and focus all pay for it.',
  },
  social: {
    good: 'Connection counts: strong social ties predict about 50% higher odds of survival.',
    bad: 'Isolation is a genuine health risk — it rivals the classic clinical risk factors.',
  },
  smoking: {
    good: 'Huge. Quitting smoking can win back roughly a decade of life expectancy.',
    bad: 'Smoking is the hardest single hit on the board — lungs and heart take it worst.',
  },
  stress: {
    good: 'Stress managed. Heart and brain both recover when the pressure actually lets off.',
    bad: 'Chronic stress keeps the whole cardiovascular system stuck on high alert.',
  },
}

function timeGreeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Up late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function reactionFor(prevSnap, { state, scores, overall, healthy }) {
  const changed = DIMENSIONS.filter((d) => state[d.id] !== prevSnap.state[d.id])
  if (!changed.length) return null

  if (changed.length > 1) {
    if (healthy === DIMENSIONS.length) {
      return {
        mood: 'celebrate',
        text: `All seven levers flipped to green at once — overall index ${overall}. That is a body firing on every system.`,
      }
    }
    return {
      mood: 'neutral',
      text: `Back to the starting mix — overall index ${overall}. Flip any card and I'll tell you exactly what it moves.`,
    }
  }

  const dim = changed[0]
  const face = state[dim.id]
  let top = null
  for (const s of SYSTEMS) {
    const d = scores[s.id] - prevSnap.scores[s.id]
    if (!top || Math.abs(d) > Math.abs(top.d)) top = { s, d }
  }
  const trend = overall > prevSnap.overall ? 'up' : overall < prevSnap.overall ? 'down' : 'holding'
  const move = `${top.s.label} ${top.d >= 0 ? '+' : ''}${top.d}, overall ${trend} at ${overall}.`
  const flavor = FLAVOR[dim.id]?.[face] ?? ''

  if (healthy === DIMENSIONS.length) {
    return { mood: 'celebrate', text: `${flavor} ${move} And that makes all seven green — every system thriving!` }
  }
  return { mood: face === 'good' ? 'happy' : 'concerned', text: `${flavor} ${move}` }
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function Avatar({ talking, mood, waving }) {
  return (
    <svg viewBox="0 0 120 120" className={`greeter-avatar mood-${mood}`} aria-hidden="true">
      <defs>
        <linearGradient id="vita-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1ecf76" />
          <stop offset="1" stopColor="#12a35a" />
        </linearGradient>
      </defs>
      {/* antenna — bulb lights while speaking */}
      <line x1="60" y1="24" x2="60" y2="11" stroke="#0b6e3c" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="60" cy="8" r="4.5" className={`greeter-bulb${talking ? ' on' : ''}`} />
      {/* waving arm, drawn behind the body */}
      <g className={`greeter-arm${waving ? ' wave' : ''}`}>
        <rect x="92" y="54" width="26" height="11" rx="5.5" fill="#0f8f50" />
      </g>
      {/* feet */}
      <ellipse cx="44" cy="104" rx="11" ry="6.5" fill="#0f8f50" />
      <ellipse cx="76" cy="104" rx="11" ry="6.5" fill="#0f8f50" />
      {/* body */}
      <rect x="18" y="22" width="84" height="82" rx="38" fill="url(#vita-body)" />
      {/* heartbeat trace on the chest */}
      <path
        d="M34 86 h13 l5 -8 l7 12 l6 -9 h21"
        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* eyes */}
      <g className="greeter-eye">
        <circle cx="45" cy="52" r="6.5" fill="#fff" />
        <circle cx="46.5" cy="53" r="3" fill="#0e1a15" />
      </g>
      <g className="greeter-eye eye-2">
        <circle cx="75" cy="52" r="6.5" fill="#fff" />
        <circle cx="76.5" cy="53" r="3" fill="#0e1a15" />
      </g>
      {/* brows only show in the concerned mood */}
      <path className="greeter-brow" d="M38 42 l13 3.5" stroke="#0b6e3c" strokeWidth="3" strokeLinecap="round" />
      <path className="greeter-brow" d="M82 42 l-13 3.5" stroke="#0b6e3c" strokeWidth="3" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="34" cy="63" r="4.5" fill="rgba(255,255,255,0.28)" />
      <circle cx="86" cy="63" r="4.5" fill="rgba(255,255,255,0.28)" />
      {/* mouth */}
      {talking ? (
        <ellipse className="greeter-mouth-talk" cx="60" cy="70" rx="7.5" ry="5.5" fill="#0e2a1c" />
      ) : mood === 'concerned' ? (
        <path d="M52 73 q8 -5 16 0" stroke="#0e2a1c" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M50 67 q10 9 20 0" stroke="#0e2a1c" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}

export default function Greeter({ state, scores, overall, healthy, announcement, demoActive }) {
  const [message, setMessage] = useState('')
  const [shown, setShown] = useState('')
  const [mood, setMood] = useState('happy')
  const [waving, setWaving] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [voiceOn, setVoiceOn] = useState(() => {
    try { return localStorage.getItem(VOICE_KEY) === 'on' } catch { return false }
  })
  const prev = useRef({ state, scores, overall })
  const waveTimer = useRef(null)

  const wave = () => {
    setWaving(true)
    clearTimeout(waveTimer.current)
    waveTimer.current = setTimeout(() => setWaving(false), 1800)
  }

  // Greet every visitor shortly after the page settles.
  useEffect(() => {
    const t = setTimeout(() => {
      wave()
      setMessage(
        `${timeGreeting()}! I'm Vita, your VitalMap guide. Flip any habit card and I'll show you, live, what it does to your body — every effect backed by peer-reviewed research.`
      )
    }, 700)
    return () => { clearTimeout(t); clearTimeout(waveTimer.current) }
  }, [])

  // React to habit swaps with the real deltas they caused.
  useEffect(() => {
    const reaction = reactionFor(prev.current, { state, scores, overall, healthy })
    prev.current = { state, scores, overall }
    if (!reaction) return
    setMood(reaction.mood)
    setMessage(reaction.text)
    if (reaction.mood === 'celebrate') wave()
  }, [state, scores, overall, healthy])

  // Scripted narration (demo mode) overrides the automatic reaction above —
  // this effect is declared after it, so in a shared commit it wins.
  useEffect(() => {
    if (!announcement) return
    setMood(announcement.mood ?? 'happy')
    setMessage(announcement.text)
    setMinimized(false)
  }, [announcement])

  // Typewriter reveal; the mouth animates while text is still arriving.
  useEffect(() => {
    if (!message) return
    if (reducedMotion()) { setShown(message); return }
    setShown('')
    const start = performance.now()
    const CHAR_MS = 14
    const id = setInterval(() => {
      const i = Math.floor((performance.now() - start) / CHAR_MS)
      setShown(message.slice(0, i))
      if (i >= message.length) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [message])

  // Optional voice — browser speech synthesis. On when the user enables it,
  // and always on during demo mode so the walkthrough is narrated aloud.
  useEffect(() => {
    if ((!voiceOn && !demoActive) || !message || !('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(message)
    u.rate = 1.03
    u.pitch = 1.05
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
    return () => window.speechSynthesis.cancel()
  }, [message, voiceOn, demoActive])

  const toggleVoice = () => {
    setVoiceOn((on) => {
      const next = !on
      try { localStorage.setItem(VOICE_KEY, next ? 'on' : 'off') } catch { /* private mode */ }
      if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel()
      return next
    })
  }

  const talking = shown.length < message.length

  if (minimized) {
    return (
      <button
        className="greeter greeter-min"
        onClick={() => setMinimized(false)}
        aria-label="Open Vita, your VitalMap guide"
      >
        <Avatar talking={false} mood="happy" waving={false} />
      </button>
    )
  }

  return (
    <aside className="greeter greeter-card" aria-label="Vita, your VitalMap guide">
      <div className="greeter-figure">
        <Avatar talking={talking} mood={mood} waving={waving} />
      </div>
      <div className="greeter-body">
        <div className="greeter-head">
          <span className="greeter-name">Vita <span className="greeter-role">· your guide</span></span>
          <div className="greeter-actions">
            <button
              className={`greeter-btn${voiceOn ? ' active' : ''}`}
              onClick={toggleVoice}
              aria-pressed={voiceOn}
              title={voiceOn ? 'Turn voice off' : 'Turn voice on'}
            >
              {voiceOn ? '🔊' : '🔇'}
            </button>
            <button className="greeter-btn" onClick={() => setMinimized(true)} title="Minimize" aria-label="Minimize guide">
              —
            </button>
          </div>
        </div>
        <p className="greeter-text" aria-live="polite">{shown}{talking && <span className="greeter-caret" />}</p>
      </div>
    </aside>
  )
}
