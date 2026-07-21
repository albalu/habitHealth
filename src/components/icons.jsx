import React from 'react'

/**
 * Minimal line icons for each habit dimension, drawn on a 24×24 grid.
 * `currentColor` so they inherit the card's good/bad tint.
 */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function HabitIcon({ name, size = 22 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24' }
  switch (name) {
    case 'walk':
      return (
        <svg {...common}><g {...P}>
          <circle cx="13" cy="4" r="1.6" />
          <path d="M12 8l-2 4 3 2 1 5" />
          <path d="M12 8l3 1 2 3" />
          <path d="M10 12l-2 2-1 4" />
        </g></svg>
      )
    case 'strength':
      return (
        <svg {...common}><g {...P}>
          <path d="M4 9v6M7 7v10M17 7v10M20 9v6" />
          <path d="M7 12h10" />
        </g></svg>
      )
    case 'produce':
      return (
        <svg {...common}><g {...P}>
          <path d="M12 8c-3-3-8-1-8 4 0 4 3 7 8 7s8-3 8-7c0-5-5-7-8-4z" />
          <path d="M12 8c0-2 1-4 4-5" />
        </g></svg>
      )
    case 'sleep':
      return (
        <svg {...common}><g {...P}>
          <path d="M20 14a7 7 0 1 1-8-9 5.5 5.5 0 0 0 8 9z" />
        </g></svg>
      )
    case 'community':
      return (
        <svg {...common}><g {...P}>
          <circle cx="8" cy="8" r="2.3" /><circle cx="16" cy="8" r="2.3" />
          <path d="M4 18c0-2.5 2-4 4-4s4 1.5 4 4M12 18c0-2.5 2-4 4-4s4 1.5 4 4" />
        </g></svg>
      )
    case 'nosmoke':
      return (
        <svg {...common}><g {...P}>
          <rect x="3" y="13" width="15" height="3" rx="1" />
          <path d="M18 9c1.5 0 2-1 2-2M15 9c1.5 0 2-1 2-2" />
          <path d="M4 4l16 16" />
        </g></svg>
      )
    case 'calm':
      return (
        <svg {...common}><g {...P}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 13a3.5 3.5 0 0 0 7 0" />
          <path d="M9 9h.01M15 9h.01" />
        </g></svg>
      )
    default:
      return null
  }
}

export function ArrowIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"><g {...P}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </g></svg>
  )
}

export function CheckIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"><g {...P}>
      <path d="M5 12l5 5L19 7" />
    </g></svg>
  )
}
