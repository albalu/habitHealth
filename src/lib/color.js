/**
 * Health color ramp: gray (unhealthy) -> vivid green (healthy).
 * The single most important visual in the app, so it is computed, not eyeballed.
 *
 * The ramp deliberately travels through a desaturated slate at the low end
 * (reads as "dormant / at risk") and arrives at a saturated, luminous green at
 * the top (reads as "alive / thriving"). Glow intensity scales with the score
 * so healthy organs literally light up.
 */

const STOPS = [
  { t: 0, c: [96, 105, 120] }, //  #606978  slate gray — at risk
  { t: 32, c: [120, 138, 108] }, // #788a6c  muted olive — waking up
  { t: 55, c: [86, 178, 110] }, //  #56b26e  fresh green
  { t: 78, c: [45, 200, 118] }, //  #2dc876  vivid green
  { t: 100, c: [38, 224, 130] }, // #26e082  luminous green — thriving
]

const lerp = (a, b, t) => a + (b - a) * t
const toHex = (n) => Math.round(n).toString(16).padStart(2, '0')

function rampColor(score) {
  const s = Math.max(0, Math.min(100, score))
  let lo = STOPS[0]
  let hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (s >= STOPS[i].t && s <= STOPS[i + 1].t) {
      lo = STOPS[i]
      hi = STOPS[i + 1]
      break
    }
  }
  const span = hi.t - lo.t || 1
  const f = (s - lo.t) / span
  return [lerp(lo.c[0], hi.c[0], f), lerp(lo.c[1], hi.c[1], f), lerp(lo.c[2], hi.c[2], f)]
}

/** Full descriptor used across the figure and UI for a given score. */
export function healthColor(score) {
  const [r, g, b] = rampColor(score)
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  // Glow ramps in from ~45 upward so only genuinely healthy organs light up.
  const glow = Math.max(0, Math.min(1, (score - 45) / 55))
  return {
    hex,
    rgb: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
    glow,
    // A translucent fill + a solid stroke reads well on the dark stage.
    fill: `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${0.35 + 0.5 * (score / 100)})`,
    stroke: hex,
  }
}
