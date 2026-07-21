import { BASELINE, SYSTEMS, DIMENSIONS } from '../data/model.js'

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))

/**
 * Compute a 0–100 score for every system given the current habit state.
 * state = { [dimensionId]: 'good' | 'bad' }
 */
export function computeScores(state) {
  const scores = {}
  for (const system of SYSTEMS) {
    let value = BASELINE
    for (const dim of DIMENSIONS) {
      const impact = dim.impact[system.id]
      if (!impact) continue
      if (state[dim.id] === 'good') value += impact.good
      else value -= impact.harm
    }
    scores[system.id] = Math.round(clamp(value))
  }
  return scores
}

/** Overall index = mean of the five system scores. */
export function overallScore(scores) {
  const vals = SYSTEMS.map((s) => scores[s.id])
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

/** For a selected system, rank which active habits help or hurt it most. */
export function driversForSystem(systemId, state) {
  const helping = []
  const hurting = []
  for (const dim of DIMENSIONS) {
    const impact = dim.impact[systemId]
    if (!impact) continue
    if (state[dim.id] === 'good') {
      helping.push({ dim, magnitude: impact.good })
    } else {
      hurting.push({ dim, magnitude: impact.harm })
    }
  }
  helping.sort((a, b) => b.magnitude - a.magnitude)
  hurting.sort((a, b) => b.magnitude - a.magnitude)
  return { helping, hurting }
}

/** How many habits are currently on the healthy setting. */
export function healthyCount(state) {
  return DIMENSIONS.filter((d) => state[d.id] === 'good').length
}

const LABELS = [
  { min: 90, label: 'Thriving', tone: 'thriving' },
  { min: 75, label: 'Strong', tone: 'strong' },
  { min: 58, label: 'Good', tone: 'good' },
  { min: 40, label: 'Needs work', tone: 'fair' },
  { min: 0, label: 'At risk', tone: 'risk' },
]

export function scoreLabel(score) {
  return LABELS.find((l) => score >= l.min) ?? LABELS[LABELS.length - 1]
}
