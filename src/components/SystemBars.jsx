import React from 'react'
import { SYSTEMS } from '../data/model.js'
import { healthColor } from '../lib/color.js'

/** Five horizontal system meters. Doubles as legend + quick read of the body. */
export default function SystemBars({ scores, selectedSystem, onSelect }) {
  return (
    <div className="sysbars">
      {SYSTEMS.map((s) => {
        const score = scores[s.id]
        const color = healthColor(score)
        const active = selectedSystem === s.id
        return (
          <button
            key={s.id}
            className={`sysbar ${active ? 'active' : ''}`}
            onClick={() => onSelect(s.id)}
            onMouseEnter={() => onSelect(s.id, true)}
          >
            <span className="sysbar-label">{s.label}</span>
            <span className="sysbar-track">
              <span
                className="sysbar-fill"
                style={{
                  width: `${score}%`,
                  background: color.hex,
                  boxShadow: `0 0 ${10 * color.glow}px ${color.hex}`,
                }}
              />
            </span>
            <span className="sysbar-score" style={{ color: color.hex }}>{score}</span>
          </button>
        )
      })}
    </div>
  )
}
