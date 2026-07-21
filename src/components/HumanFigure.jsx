import React from 'react'
import { healthColor } from '../lib/color.js'

/**
 * Stylized front-facing anatomical figure. Five colorable systems:
 *   brain, heart, lungs, muscles (arms + legs), metabolic (abdomen organs).
 * Each region's fill is driven by its 0–100 score; healthy organs glow.
 *
 * Symmetric parts (arm, leg, lung) are drawn once and mirrored with a matrix
 * transform so the two sides always match.
 */

// --- Neutral shell (non-scored structure) ---------------------------------
const HEAD_SHELL = 'M160 26 c 26 0 44 20 44 46 c 0 26 -18 46 -44 46 c -26 0 -44 -20 -44 -46 c 0 -26 18 -46 44 -46 Z'
const NECK = 'M146 112 h28 v20 q -14 8 -28 0 Z'
const TORSO =
  'M112 150 C110 132 128 126 160 126 C192 126 210 132 208 150 L202 268 C200 300 186 320 160 320 C134 320 120 300 118 268 Z'

// --- Muscles (drawn behind the torso, mirrored) ---------------------------
const ARM =
  'M116 150 C96 158 86 190 88 226 C90 260 95 292 104 316 C108 328 120 328 123 315 C115 288 111 258 113 226 C115 198 121 172 129 156 C126 151 121 148 116 150 Z'
const LEG =
  'M120 300 C114 342 114 408 115 466 C115 506 120 546 133 558 C142 566 153 562 154 550 C154 502 154 442 154 394 C154 354 152 328 150 306 C143 300 130 297 120 300 Z'

// --- Organs ----------------------------------------------------------------
const BRAIN =
  'M140 52 C138 40 150 32 160 36 C170 32 182 40 180 52 C189 55 189 71 179 75 C177 84 166 88 160 81 C154 88 143 84 141 75 C131 71 131 55 140 52 Z'
const LUNG =
  'M154 156 C142 152 129 158 125 178 C121 202 126 232 140 246 C149 254 155 249 155 236 L155 158 C155 157 154 156 154 156 Z'
const HEART =
  'M160 176 C155 165 141 165 139 180 C137 193 150 203 160 215 C170 203 183 193 181 180 C179 165 165 165 160 176 Z'
const METABOLIC =
  'M136 222 C125 230 123 255 129 278 C135 299 148 309 160 309 C172 309 185 299 191 278 C197 255 195 230 184 222 C170 215 150 215 136 222 Z'

const MIRROR = 'matrix(-1 0 0 1 320 0)'

function Region({ path, color, selected, dim, onSelect, systemId, label, mirror }) {
  const style = {
    fill: color.fill,
    stroke: color.stroke,
    strokeWidth: selected ? 2.4 : 1.4,
    filter: color.glow > 0.02 ? `url(#glow-${systemId})` : undefined,
    opacity: dim ? 0.35 : 1,
    cursor: 'pointer',
    transition: 'fill .5s ease, stroke .5s ease, opacity .3s ease, stroke-width .2s ease',
  }
  return (
    <path
      d={path}
      transform={mirror ? MIRROR : undefined}
      style={style}
      onClick={() => onSelect(systemId)}
      role="button"
      aria-label={label}
    />
  )
}

export default function HumanFigure({ scores, selectedSystem, hoveredSystems, onSelect }) {
  const colors = Object.fromEntries(
    Object.entries(scores).map(([id, s]) => [id, healthColor(s)]),
  )

  // When a habit card is hovered, dim systems it does NOT affect.
  const isDim = (id) => hoveredSystems && hoveredSystems.length > 0 && !hoveredSystems.includes(id)

  const regionProps = (systemId, label) => ({
    color: colors[systemId],
    selected: selectedSystem === systemId,
    dim: isDim(systemId),
    onSelect,
    systemId,
    label,
  })

  return (
    <svg
      className="figure"
      viewBox="0 0 320 600"
      role="group"
      aria-label="Interactive human body, colored by health"
    >
      <defs>
        {Object.entries(colors).map(([id, c]) => (
          <filter key={id} id={`glow-${id}`} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation={2 + 7 * c.glow}
              floodColor={c.hex}
              floodOpacity={0.35 + 0.5 * c.glow}
            />
          </filter>
        ))}
        <radialGradient id="stage-glow" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#173a2f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0a1512" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="160" cy="300" rx="150" ry="290" fill="url(#stage-glow)" />

      {/* Muscles — arms & legs, behind the torso shell */}
      <g>
        <Region path={ARM} {...regionProps('muscles', 'Muscles — left arm')} />
        <Region path={ARM} mirror {...regionProps('muscles', 'Muscles — right arm')} />
        <Region path={LEG} {...regionProps('muscles', 'Muscles — left leg')} />
        <Region path={LEG} mirror {...regionProps('muscles', 'Muscles — right leg')} />
      </g>

      {/* Neutral body shell */}
      <path d={NECK} className="shell" />
      <path d={TORSO} className="shell" />
      <path d={HEAD_SHELL} className="shell" />

      {/* Organs */}
      <Region path={BRAIN} {...regionProps('brain', 'Brain')} />
      <line
        x1="160"
        y1="38"
        x2="160"
        y2="81"
        stroke={colors.brain.stroke}
        strokeWidth="1"
        opacity="0.5"
        pointerEvents="none"
      />

      <Region path={LUNG} {...regionProps('lungs', 'Lungs — left')} />
      <Region path={LUNG} mirror {...regionProps('lungs', 'Lungs — right')} />
      <Region path={HEART} {...regionProps('heart', 'Heart')} />
      <Region path={METABOLIC} {...regionProps('metabolic', 'Metabolic organs')} />
    </svg>
  )
}
