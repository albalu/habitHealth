import { DEFAULT_STATE } from './model.js'

/**
 * The scripted leadership walkthrough and the voice-command grammar that
 * drives demo mode. Each tour step either sets the whole habit mix (`state`)
 * or merges a change (`patch`), then narrates with the recomputed overall
 * index. Steps are replayed from the start when navigating backwards, so the
 * mix at any step is deterministic.
 */

export const TOUR = [
  {
    state: DEFAULT_STATE,
    text: (o) =>
      `Welcome to the VitalMap walkthrough. Meet a typical employee: two of seven habits on the healthy setting, overall health index ${o} — at risk. Say "next" and we'll turn that around, one lever at a time.`,
  },
  {
    patch: { movement: 'good' },
    text: (o) =>
      `First lever: movement. Swap eight hours of sitting for brisk daily walking — eight to ten thousand steps — and every system responds. Overall index up to ${o}.`,
  },
  {
    patch: { strength: 'good' },
    text: (o) =>
      `Add two strength sessions a week. Just thirty to sixty minutes links to ten to seventeen percent lower mortality — muscles surge and metabolism follows. Overall ${o}.`,
  },
  {
    patch: { diet: 'good' },
    text: (o) =>
      `Trade ultra-processed meals for fruit and vegetables, where benefit peaks near eight hundred grams a day. The metabolic organs light up — overall ${o}.`,
  },
  {
    patch: { social: 'good' },
    text: (o) =>
      `Connection is a health lever too: strong social ties predict about fifty percent higher survival odds. Overall ${o}.`,
  },
  {
    patch: { stress: 'good' },
    text: (o) =>
      `Last lever: getting chronic stress under control. And that is all seven on green — overall index ${o}, every system thriving.`,
  },
  {
    patch: { smoking: 'bad' },
    mood: 'concerned',
    text: (o) =>
      `Now the cautionary tale. Add smoking — the single most damaging habit on the board — and the lungs and heart drag the whole body down to ${o}.`,
  },
  {
    patch: { smoking: 'good' },
    text: (o) =>
      `Quit, and the Surgeon General's report says you win back roughly a decade of life expectancy. Right back to ${o}.`,
  },
  {
    text: () =>
      `That is VitalMap: prevention your people can actually see, every claim backed by peer-reviewed research, no logins and no data collected. Say "exit demo" to wrap up.`,
  },
]

/** Habit mix at step i — replayed from step 0 so back-navigation is exact. */
export function stateAtStep(i) {
  let s = { ...TOUR[0].state }
  for (let k = 1; k <= i; k++) {
    if (TOUR[k].patch) s = { ...s, ...TOUR[k].patch }
  }
  return s
}

const HABIT_WORDS = {
  movement: ['movement', 'walking', 'walk', 'steps', 'sitting', 'sedentary'],
  strength: ['strength', 'lifting', 'weights', 'resistance'],
  diet: ['diet', 'nutrition', 'food', 'eating', 'vegetables', 'processed'],
  sleep: ['sleep', 'sleeping'],
  social: ['social', 'connection', 'friends', 'isolation', 'community'],
  smoking: ['smoking', 'smoke', 'cigarettes', 'tobacco'],
  stress: ['stress', 'relaxation'],
}

const SYSTEM_WORDS = {
  brain: ['brain', 'mind', 'cognition'],
  heart: ['heart', 'circulation', 'cardiovascular'],
  lungs: ['lungs', 'lung', 'breathing', 'respiratory'],
  muscles: ['muscles', 'muscle', 'mobility'],
  metabolic: ['metabolism', 'metabolic', 'gut', 'liver'],
}

/**
 * Parse a spoken phrase into a demo command, or null if it isn't one.
 * Matching is whole-word and order-independent, so natural phrasings like
 * "okay, let's go to the next one" or "could you quit smoking" all land.
 */
export function parseCommand(raw) {
  const t = ` ${raw.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim()} `
  const has = (...words) => words.some((w) => t.includes(` ${w} `))

  if (has('exit', 'stop', 'end', 'close', 'finish', 'leave') && has('demo', 'tour', 'mode', 'walkthrough'))
    return { type: 'exit' }
  if (has('start', 'begin', 'restart', 'launch', 'play', 'run') && has('tour', 'demo', 'walkthrough', 'over'))
    return { type: 'start' }
  if (has('back', 'previous', 'rewind')) return { type: 'prev' }
  if (has('next', 'continue', 'forward', 'proceed') || t.includes(' go on ') || t.includes(' keep going '))
    return { type: 'next' }
  if (has('optimize', 'optimise') || t.includes(' all green ') || t.includes(' best case ') || t.includes(' all healthy '))
    return { type: 'optimize' }
  if (has('reset', 'baseline') || t.includes(' start over ')) return { type: 'reset' }
  if (has('quit') && has('smoking', 'smoke')) return { type: 'set', dim: 'smoking', face: 'good' }
  if (has('swap', 'flip', 'toggle', 'switch', 'turn', 'change', 'fix')) {
    for (const [dim, words] of Object.entries(HABIT_WORDS)) {
      if (has(...words)) return { type: 'swap', dim }
    }
  }
  if (has('show', 'highlight', 'select', 'view', 'focus')) {
    for (const [system, words] of Object.entries(SYSTEM_WORDS)) {
      if (has(...words)) return { type: 'show', system }
    }
  }
  return null
}
