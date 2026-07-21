import React from 'react'
import { SYSTEMS, DIMENSIONS, REFERENCES } from '../data/model.js'
import { driversForSystem, scoreLabel } from '../lib/scoring.js'
import { healthColor } from '../lib/color.js'
import { HabitIcon } from './icons.jsx'

const systemById = Object.fromEntries(SYSTEMS.map((s) => [s.id, s]))
const dimById = Object.fromEntries(DIMENSIONS.map((d) => [d.id, d]))

function Citations({ refs }) {
  return (
    <span className="cite-group">
      {refs.map((rid) => {
        const r = REFERENCES[rid]
        return (
          <a key={rid} className="cite" href={r.url} target="_blank" rel="noopener noreferrer" title={`${r.authors} ${r.source}`}>
            {r.authors.split(' ')[0].replace(',', '')} {r.source.match(/\d{4}/)?.[0]}
          </a>
        )
      })}
    </span>
  )
}

/** Detail for a selected habit dimension. */
function HabitDetail({ dim, state }) {
  const good = state === 'good'
  return (
    <div className="detail">
      <div className="detail-eyebrow">{dim.category}</div>
      <h3 className="detail-title">{(good ? dim.good : dim.bad).title}</h3>
      <p className="detail-lead">
        You currently have the <strong className={good ? 'txt-good' : 'txt-bad'}>{good ? 'healthy' : 'unhealthy'}</strong> option
        active. Here is what the evidence says about switching this lever.
      </p>

      <div className="claim-list">
        {dim.claims.map((c, i) => (
          <div className="claim" key={i}>
            <p>{c.text}</p>
            <Citations refs={c.refs} />
          </div>
        ))}
      </div>

      <div className="affects">
        <div className="affects-head">Systems this habit moves</div>
        <div className="affects-tags">
          {SYSTEMS.filter((s) => dim.impact[s.id]).map((s) => {
            const im = dim.impact[s.id]
            const strength = im.good >= 12 ? 'high' : im.good >= 6 ? 'med' : 'low'
            return (
              <span key={s.id} className={`affect-tag strength-${strength}`}>
                {s.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** Detail for a selected body system. */
function SystemDetail({ system, scores, state }) {
  const score = scores[system.id]
  const color = healthColor(score)
  const label = scoreLabel(score)
  const { helping, hurting } = driversForSystem(system.id, state)

  return (
    <div className="detail">
      <div className="detail-eyebrow">{system.tagline}</div>
      <div className="detail-title-row">
        <h3 className="detail-title">{system.label}</h3>
        <span className="detail-score" style={{ color: color.hex }}>
          {score}<span className={`detail-badge tone-${label.tone}`}>{label.label}</span>
        </span>
      </div>
      <p className="detail-lead">{system.blurb}</p>

      <div className="drivers">
        <div className="driver-col">
          <div className="driver-head good">Lifting it up</div>
          {helping.length === 0 && <div className="driver-empty">No healthy habits active yet.</div>}
          {helping.map(({ dim, magnitude }) => (
            <div className="driver-row" key={dim.id}>
              <span className="driver-icon good"><HabitIcon name={dim.icon} size={16} /></span>
              <span className="driver-name">{dim.good.title}</span>
              <span className="driver-mag good">+{magnitude}</span>
            </div>
          ))}
        </div>
        <div className="driver-col">
          <div className="driver-head bad">Holding it back</div>
          {hurting.length === 0 && <div className="driver-empty">Nothing dragging it down. 🎉</div>}
          {hurting.map(({ dim, magnitude }) => (
            <div className="driver-row" key={dim.id}>
              <span className="driver-icon bad"><HabitIcon name={dim.icon} size={16} /></span>
              <span className="driver-name">{dim.bad.title}</span>
              <span className="driver-mag bad">−{magnitude}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="detail-foot">Swap the habits on the right and watch this number — and the organ — respond.</p>
    </div>
  )
}

/** Default overview when nothing is selected. */
function Overview({ healthy }) {
  return (
    <div className="detail">
      <div className="detail-eyebrow">How to read this</div>
      <h3 className="detail-title">Your body, driven by your week</h3>
      <p className="detail-lead">
        The figure shows five systems — brain, heart, lungs, muscles and metabolic organs. Gray means a system is
        <strong className="txt-bad"> at risk</strong>; it turns <strong className="txt-good">bright green</strong> and
        glows as your habits improve.
      </p>
      <ul className="overview-steps">
        <li><span className="step-n">1</span> Tap a habit card to see the science behind it.</li>
        <li><span className="step-n">2</span> Hit <em>Swap</em> to trade an unhealthy habit for a healthy one.</li>
        <li><span className="step-n">3</span> Tap any organ to see what’s lifting it up or holding it back.</li>
      </ul>
      <p className="detail-foot">
        You have <strong>{healthy} of 7</strong> habits on the healthy setting. Every claim links to a peer-reviewed source.
      </p>
    </div>
  )
}

export default function DetailPanel({ selected, scores, state, healthy }) {
  if (selected?.type === 'habit') {
    return <HabitDetail dim={dimById[selected.id]} state={state[selected.id]} />
  }
  if (selected?.type === 'system') {
    return <SystemDetail system={systemById[selected.id]} scores={scores} state={state} />
  }
  return <Overview healthy={healthy} />
}
