import React from 'react'
import { healthColor } from '../lib/color.js'
import { scoreLabel } from '../lib/scoring.js'

/** Circular overall-health gauge that fills and colors with the score. */
export default function ScoreDial({ score }) {
  const color = healthColor(score)
  const label = scoreLabel(score)
  const R = 52
  const C = 2 * Math.PI * R
  const dash = (score / 100) * C

  return (
    <div className="dial">
      <svg viewBox="0 0 130 130" width="118" height="118">
        <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="10" />
        <circle
          cx="65"
          cy="65"
          r={R}
          fill="none"
          stroke={color.hex}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dasharray .6s ease, stroke .5s ease', filter: `drop-shadow(0 0 ${6 * color.glow}px ${color.hex})` }}
        />
        <text x="65" y="60" textAnchor="middle" className="dial-num" fill={color.hex}>{score}</text>
        <text x="65" y="80" textAnchor="middle" className="dial-unit">/ 100</text>
      </svg>
      <div className={`dial-label tone-${label.tone}`}>{label.label}</div>
    </div>
  )
}
