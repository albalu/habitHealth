import React, { useMemo, useState } from 'react'
import { DIMENSIONS, DEFAULT_STATE, SYSTEMS } from './data/model.js'
import { computeScores, overallScore, healthyCount } from './lib/scoring.js'
import HumanFigure from './components/HumanFigure.jsx'
import HabitBoard from './components/HabitBoard.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import SystemBars from './components/SystemBars.jsx'
import ScoreDial from './components/ScoreDial.jsx'
import ReferencesSection from './components/ReferencesSection.jsx'
import Greeter from './components/Greeter.jsx'
import DemoMode from './components/DemoMode.jsx'

const ALL_GOOD = Object.fromEntries(DIMENSIONS.map((d) => [d.id, 'good']))

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE)
  const [selected, setSelected] = useState(null) // { type:'habit'|'system', id }
  const [hoverHabit, setHoverHabit] = useState(null)
  const [demo, setDemo] = useState(false)
  const [announcement, setAnnouncement] = useState(null) // scripted line for Vita

  const announce = (text, mood = 'happy') => setAnnouncement({ text, mood })
  const exitDemo = () => {
    setDemo(false)
    announce('Demo mode off — back to free exploration.')
  }

  const scores = useMemo(() => computeScores(state), [state])
  const overall = overallScore(scores)
  const healthy = healthyCount(state)

  const swap = (id) => setState((s) => ({ ...s, [id]: s[id] === 'good' ? 'bad' : 'good' }))
  const selectHabit = (id) => setSelected({ type: 'habit', id })
  const selectSystem = (id) => setSelected({ type: 'system', id })

  // Systems highlighted on the figure when a habit card is hovered.
  const hoveredSystems = useMemo(() => {
    if (!hoverHabit) return null
    const dim = DIMENSIONS.find((d) => d.id === hoverHabit)
    if (!dim) return null
    return SYSTEMS.filter((s) => (dim.impact[s.id]?.good ?? 0) >= 6).map((s) => s.id)
  }, [hoverHabit])

  const selectedSystem = selected?.type === 'system' ? selected.id : null

  return (
    <div className={demo ? 'page demo-on' : 'page'}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden>💚</span>
          <div>
            <div className="brand-name">VitalMap</div>
            <div className="brand-sub">Habits, made visible</div>
          </div>
        </div>
        <nav className="topnav">
          <a href="#references">Evidence</a>
          <button className="btn-ghost demo-toggle" onClick={() => (demo ? exitDemo() : setDemo(true))}>
            {demo ? '✕ Exit demo' : '🎤 Demo'}
          </button>
          <a href="#teams" className="btn-ghost">For teams</a>
        </nav>
      </header>

      <section className="hero">
        <h1>See what your habits do to your body.</h1>
        <p className="hero-lead">
          Trade an unhealthy habit for a healthy one and watch the change ripple through the brain, heart, lungs,
          muscles and metabolism — in real time, every effect grounded in peer-reviewed science.
        </p>
      </section>

      <main className="stage-wrap">
        {/* LEFT — the body stage */}
        <section className="stage" aria-label="Body visualization">
          <div className="stage-header">
            <ScoreDial score={overall} />
            <div className="stage-meta">
              <div className="stage-meta-title">Overall health index</div>
              <p>A live composite of your five body systems. Move the habits on the right and it responds instantly.</p>
              <div className="ramp-legend">
                <span className="ramp-swatch" />
                <span className="ramp-ends"><span>At risk</span><span>Thriving</span></span>
              </div>
            </div>
          </div>

          <div className="figure-row">
            <HumanFigure
              scores={scores}
              selectedSystem={selectedSystem}
              hoveredSystems={hoveredSystems}
              onSelect={selectSystem}
            />
            <SystemBars
              scores={scores}
              selectedSystem={selectedSystem}
              onSelect={(id) => selectSystem(id)}
            />
          </div>
        </section>

        {/* RIGHT — controls + detail */}
        <section className="controls" aria-label="Habits and details">
          <div className="controls-head">
            <div>
              <h2>Your daily habits</h2>
              <p className="controls-sub">{healthy} of 7 on the healthy setting</p>
            </div>
            <div className="controls-actions">
              <button className="btn-primary" onClick={() => setState(ALL_GOOD)}>Optimize all</button>
              <button className="btn-secondary" onClick={() => setState(DEFAULT_STATE)}>Reset</button>
            </div>
          </div>

          <HabitBoard
            state={state}
            selected={selected}
            onSwap={swap}
            onSelect={selectHabit}
            onHover={setHoverHabit}
            onHoverEnd={() => setHoverHabit(null)}
          />

          <div className="detail-card">
            <DetailPanel selected={selected} scores={scores} state={state} healthy={healthy} />
          </div>
        </section>
      </main>

      <section className="teams" id="teams">
        <div className="teams-inner">
          <div className="teams-copy">
            <div className="detail-eyebrow light">For people teams</div>
            <h2>Turn wellbeing programs into something people can feel.</h2>
            <p>
              VitalMap makes the invisible payoff of healthy habits tangible — the moment an employee swaps a card and
              watches an organ light up, prevention stops being abstract. Drop it into onboarding, benefits enrollment
              or a wellness challenge, fully white-labeled to your brand and backed by citable science.
            </p>
            <ul className="teams-points">
              <li>Evidence-based, audit-ready health claims</li>
              <li>Runs anywhere — no login, no personal data collected</li>
              <li>Customizable habits, branding and metrics</li>
            </ul>
          </div>
          <div className="teams-stats">
            <div className="stat"><span className="stat-num">50%</span><span className="stat-cap">higher survival odds with strong social ties</span></div>
            <div className="stat"><span className="stat-num">10–17%</span><span className="stat-cap">lower mortality from 30–60 min/wk of strength work</span></div>
            <div className="stat"><span className="stat-num">~800 g</span><span className="stat-cap">daily fruit & veg where benefit peaks</span></div>
            <div className="stat"><span className="stat-num">10 yrs</span><span className="stat-cap">of life expectancy regained by quitting smoking</span></div>
          </div>
        </div>
      </section>

      <ReferencesSection />

      <footer className="footer">
        <p>
          VitalMap is an educational visualization, not medical advice. Impact magnitudes are a transparent ranking of
          effect drawn from the cited research, not a personalized clinical risk score.
        </p>
        <p className="footer-tiny">Built as an open demo · every figure links to its primary source.</p>
      </footer>

      <Greeter
        state={state}
        scores={scores}
        overall={overall}
        healthy={healthy}
        announcement={announcement}
        demoActive={demo}
      />
      {demo && (
        <DemoMode
          state={state}
          setState={setState}
          selectSystem={selectSystem}
          announce={announce}
          onExit={exitDemo}
        />
      )}
    </div>
  )
}
