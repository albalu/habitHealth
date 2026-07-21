import React, { useEffect, useRef, useState } from 'react'
import { DIMENSIONS, SYSTEMS } from '../data/model.js'
import { computeScores, overallScore } from '../lib/scoring.js'
import { TOUR, stateAtStep, parseCommand } from '../data/tour.js'

const ALL_GOOD = Object.fromEntries(DIMENSIONS.map((d) => [d.id, 'good']))

/**
 * Voice-controlled demo mode for the leadership walkthrough. Listens through
 * the browser's built-in speech recognition and drives the scripted TOUR;
 * arrow keys and the on-screen controls do the same thing wherever
 * recognition is unavailable (Firefox, denied mic). Vita narrates each step.
 */
export default function DemoMode({ state, setState, selectSystem, announce, onExit }) {
  const [step, setStep] = useState(-1) // -1 = tour not started yet
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [heard, setHeard] = useState('')
  const [showHelp, setShowHelp] = useState(true)

  const stepRef = useRef(step)
  stepRef.current = step
  const stateRef = useRef(state)
  stateRef.current = state
  const activeRef = useRef(true)

  const goTo = (i) => {
    const idx = Math.max(0, Math.min(TOUR.length - 1, i))
    const def = TOUR[idx]
    const next = def.patch || def.state ? stateAtStep(idx) : stateRef.current
    setState(next)
    const overall = overallScore(computeScores(next))
    announce(def.text(overall), def.mood ?? 'happy')
    setStep(idx)
  }
  const goToRef = useRef(goTo)
  goToRef.current = goTo

  const handleCommand = (raw) => {
    // Don't let Vita's own narration trigger commands through the mic.
    if (window.speechSynthesis?.speaking) return
    setHeard(raw.trim())
    const cmd = parseCommand(raw)
    if (!cmd) return
    const cur = stepRef.current
    switch (cmd.type) {
      case 'start':
        goToRef.current(0)
        break
      case 'next':
        goToRef.current(cur < 0 ? 0 : cur + 1)
        break
      case 'prev':
        goToRef.current(cur - 1)
        break
      case 'exit':
        onExit()
        break
      case 'optimize':
        setState(ALL_GOOD)
        break
      case 'reset':
        setState((s) => ({ ...TOUR[0].state }))
        break
      case 'set':
        if (stateRef.current[cmd.dim] === cmd.face) {
          announce('Already smoke-free — nothing to quit.', 'happy')
        } else {
          setState((s) => ({ ...s, [cmd.dim]: cmd.face }))
        }
        break
      case 'swap':
        setState((s) => ({ ...s, [cmd.dim]: s[cmd.dim] === 'good' ? 'bad' : 'good' }))
        break
      case 'improve': {
        const bad = DIMENSIONS.filter((d) => stateRef.current[d.id] === 'bad')
        if (!bad.length) {
          announce('Every habit is already on the healthy setting — nothing left to fix!', 'celebrate')
        } else {
          const pick = bad[Math.floor(Math.random() * bad.length)]
          setState((s) => ({ ...s, [pick.id]: 'good' }))
        }
        break
      }
      case 'show': {
        selectSystem(cmd.system)
        const sys = SYSTEMS.find((s) => s.id === cmd.system)
        announce(`Here's the ${sys.label.toLowerCase()} — the detail panel shows exactly which habits are lifting it up or holding it back.`, 'happy')
        break
      }
    }
  }
  const handleRef = useRef(handleCommand)
  handleRef.current = handleCommand

  // Speech recognition, with auto-restart while demo mode is active.
  useEffect(() => {
    activeRef.current = true
    let rec = null
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setSupported(false)
      announce(
        'Demo mode is on. Voice control isn’t available in this browser, so drive the walkthrough with the arrow keys or the controls below.',
        'happy'
      )
    } else {
      rec = new SR()
      rec.continuous = true
      rec.interimResults = false
      rec.lang = 'en-US'
      rec.onresult = (e) => handleRef.current(e.results[e.results.length - 1][0].transcript)
      rec.onstart = () => setListening(true)
      rec.onend = () => {
        setListening(false)
        if (activeRef.current) {
          try { rec.start() } catch { /* already restarting */ }
        }
      }
      rec.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          activeRef.current = false
          setSupported(false)
        }
      }
      try { rec.start() } catch { /* ignore */ }
      announce(
        'Demo mode is on. Say "start the tour" for the full leadership walkthrough, or drive it yourself — "next", "back", "optimize all", "replace a bad habit", "show the heart". Arrow keys work too.',
        'happy'
      )
    }
    if (import.meta.env.DEV) window.__vitaSay = (t) => handleRef.current(t)
    return () => {
      activeRef.current = false
      if (rec) rec.stop()
      if (import.meta.env.DEV) delete window.__vitaSay
      window.speechSynthesis?.cancel()
    }
  }, [])

  // Keyboard fallback: arrows step the tour, Escape exits.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); handleRef.current('next') }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); handleRef.current('previous') }
      else if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  return (
    <>
      {showHelp && (
        <div className="demo-help" role="note" aria-label="Voice commands">
          <div className="demo-help-head">
            <span>{supported ? 'Voice commands' : 'Voice commands (unavailable here — use arrow keys or the ◀ ▶ buttons)'}</span>
            <button className="demo-help-close" onClick={() => setShowHelp(false)} aria-label="Hide voice commands">✕</button>
          </div>
          <ul>
            <li><b>“start the tour”</b> — scripted leadership walkthrough</li>
            <li><b>“next”</b> / <b>“back”</b> — step through it (or use ← → keys)</li>
            <li><b>“replace a bad habit”</b> — randomly fix one unhealthy habit</li>
            <li><b>“flip movement”</b>, <b>“quit smoking”</b>… — swap a specific habit</li>
            <li><b>“optimize all”</b> / <b>“reset”</b> — best case / starting mix</li>
            <li><b>“show the heart”</b> (brain, lungs…) — highlight an organ</li>
            <li><b>“exit demo”</b> — leave demo mode (or press Esc)</li>
          </ul>
          <p className="demo-help-note">Speak after Vita finishes talking — she ignores commands while narrating.</p>
        </div>
      )}
      <div className="demo-hud" role="toolbar" aria-label="Demo mode controls">
      <span className={`demo-mic${listening ? ' live' : ''}`} aria-hidden>🎤</span>
      <div className="demo-info">
        <span className="demo-title">Leadership demo</span>
        <span className="demo-hint">
          {!supported
            ? 'voice unavailable — use the arrows'
            : heard
              ? `heard: “${heard}”`
              : 'say “start the tour”, “next”, “optimize all”…'}
        </span>
      </div>
      <div className="demo-nav">
        <button onClick={() => handleCommand('previous')} disabled={step <= 0} aria-label="Previous step">◀</button>
        <span className="demo-step">{step < 0 ? '—' : `${step + 1}/${TOUR.length}`}</span>
        <button onClick={() => handleCommand('next')} aria-label="Next step">▶</button>
        <button
          onClick={() => setShowHelp((h) => !h)}
          aria-label="Show voice commands"
          aria-expanded={showHelp}
          className={showHelp ? 'demo-help-toggle on' : 'demo-help-toggle'}
        >?</button>
        <button className="demo-exit" onClick={onExit} aria-label="Exit demo mode">✕</button>
      </div>
      </div>
    </>
  )
}
