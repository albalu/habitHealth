import React from 'react'
import { DIMENSIONS } from '../data/model.js'
import { HabitIcon, ArrowIcon, CheckIcon } from './icons.jsx'

/**
 * The board of habit cards. Each card is one lifestyle lever currently showing
 * either its healthy or unhealthy face. The pill button swaps it; clicking the
 * card body selects it so the detail panel explains the science.
 */
function HabitCard({ dim, state, selected, onSwap, onSelect, onHover, onHoverEnd }) {
  const good = state === 'good'
  const current = good ? dim.good : dim.bad
  const alternative = good ? dim.bad : dim.good

  return (
    <div
      className={`habit-card ${good ? 'is-good' : 'is-bad'} ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelect(dim.id)}
      onMouseEnter={() => onHover(dim.id)}
      onMouseLeave={onHoverEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(dim.id) }
      }}
    >
      <div className="habit-top">
        <span className="habit-chip">{dim.category}</span>
        <span className={`habit-state ${good ? 'good' : 'bad'}`}>
          {good ? (<><CheckIcon /> Healthy</>) : 'Unhealthy'}
        </span>
      </div>

      <div className="habit-main">
        <span className="habit-icon"><HabitIcon name={dim.icon} /></span>
        <div className="habit-title-wrap">
          <div className="habit-title">{current.title}</div>
          <div className="habit-tag">{current.tag}</div>
        </div>
      </div>

      <button
        className="swap-btn"
        onClick={(e) => { e.stopPropagation(); onSwap(dim.id) }}
      >
        <span className="swap-label">{good ? 'Revert to' : 'Swap for'}</span>
        <span className="swap-target">{alternative.title}</span>
        <ArrowIcon />
      </button>
    </div>
  )
}

export default function HabitBoard({ state, selected, onSwap, onSelect, onHover, onHoverEnd }) {
  return (
    <div className="habit-grid">
      {DIMENSIONS.map((dim) => (
        <HabitCard
          key={dim.id}
          dim={dim}
          state={state[dim.id]}
          selected={selected?.type === 'habit' && selected.id === dim.id}
          onSwap={onSwap}
          onSelect={onSelect}
          onHover={onHover}
          onHoverEnd={onHoverEnd}
        />
      ))}
    </div>
  )
}
