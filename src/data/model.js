/**
 * VitalMap data model
 * ---------------------------------------------------------------------------
 * Everything the app knows about the body, habits and the science lives here so
 * it is easy to audit and extend. Three pieces:
 *
 *   SYSTEMS     — the five body systems drawn on the figure.
 *   REFERENCES  — the peer-reviewed sources every claim points to.
 *   DIMENSIONS  — the seven lifestyle levers. Each has a "good" and a "bad"
 *                 face, a per-system impact table, plain-language claims, and
 *                 the reference ids that back them.
 *
 * Scoring (see ../lib/scoring.js): every system starts at a baseline of 50.
 * For each dimension, choosing the healthy option ADDS `good` points to the
 * systems it affects; the unhealthy option SUBTRACTS `harm` points. The result
 * is clamped to 0–100. Impact magnitudes are a transparent, defensible ranking
 * of effect — larger where the evidence base is strongest and the effect on
 * that organ system is most direct (e.g. smoking → lungs, resistance training
 * → muscles) — not a clinical risk calculator.
 */

export const BASELINE = 50

export const SYSTEMS = [
  {
    id: 'brain',
    label: 'Brain',
    tagline: 'Cognition, mood & memory',
    blurb:
      'Focus, mental health and long-term dementia risk. Highly sensitive to sleep, movement, connection and stress.',
  },
  {
    id: 'heart',
    label: 'Heart & circulation',
    tagline: 'Cardiovascular health',
    blurb:
      'The cardiovascular system — the leading cause of death worldwide, and the one most responsive to daily habits.',
  },
  {
    id: 'lungs',
    label: 'Lungs',
    tagline: 'Respiratory capacity',
    blurb:
      'Airways and breathing capacity. Dominated by whether or not a person smokes, and supported by aerobic fitness.',
  },
  {
    id: 'muscles',
    label: 'Muscles',
    tagline: 'Strength & mobility',
    blurb:
      'Muscle mass, strength and mobility — the engine of metabolism and the strongest predictor of independent aging.',
  },
  {
    id: 'metabolic',
    label: 'Metabolic organs',
    tagline: 'Gut, liver & blood sugar',
    blurb:
      'Digestion, liver health and blood-sugar control. Steered most by diet quality, movement and muscle.',
  },
]

/**
 * References — every one verified against the primary source (journal / agency).
 */
export const REFERENCES = {
  paluch2022: {
    authors: 'Paluch AE, et al.',
    title: 'Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts',
    source: 'Lancet Public Health, 2022;7(3):e219–e228',
    url: 'https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(21)00302-9/fulltext',
  },
  ekelund2016: {
    authors: 'Ekelund U, et al.',
    title:
      'Does physical activity attenuate the detrimental association of sitting time with mortality? A harmonised meta-analysis of >1 million adults',
    source: 'The Lancet, 2016;388:1302–1310',
    url: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(16)30370-1/abstract',
  },
  momma2022: {
    authors: 'Momma H, et al.',
    title:
      'Muscle-strengthening activities and lower risk & mortality in major non-communicable diseases: systematic review & meta-analysis',
    source: 'British Journal of Sports Medicine, 2022;56:755–763',
    url: 'https://pubmed.ncbi.nlm.nih.gov/35228201/',
  },
  aune2017: {
    authors: 'Aune D, et al.',
    title:
      'Fruit and vegetable intake and the risk of cardiovascular disease, total cancer and all-cause mortality: dose-response meta-analysis',
    source: 'International Journal of Epidemiology, 2017;46(3):1029–1056',
    url: 'https://academic.oup.com/ije/article/46/3/1029/3039477',
  },
  pagliai2021: {
    authors: 'Pagliai G, et al.',
    title: 'Consumption of ultra-processed foods and health status: a systematic review and meta-analysis',
    source: 'British Journal of Nutrition, 2021;125:308–318',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8747520/',
  },
  cappuccio2010: {
    authors: 'Cappuccio FP, et al.',
    title: 'Sleep duration and all-cause mortality: a systematic review and meta-analysis of prospective studies',
    source: 'Sleep, 2010;33(5):585–592',
    url: 'https://pubmed.ncbi.nlm.nih.gov/20469800/',
  },
  holtlunstad2010: {
    authors: 'Holt-Lunstad J, et al.',
    title: 'Social relationships and mortality risk: a meta-analytic review',
    source: 'PLoS Medicine, 2010;7(7):e1000316',
    url: 'https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1000316',
  },
  sgr2020: {
    authors: 'U.S. Surgeon General',
    title: 'Smoking Cessation: A Report of the Surgeon General',
    source: 'U.S. Dept. of Health & Human Services / CDC, 2020',
    url: 'https://www.cdc.gov/tobacco-surgeon-general-reports/reports/2020-smoking-cessation/index.html',
  },
  kivimaki2018: {
    authors: 'Kivimäki M, Steptoe A.',
    title: 'Effects of stress on the development and progression of cardiovascular disease',
    source: 'Nature Reviews Cardiology, 2018;15:215–229',
    url: 'https://www.nature.com/articles/nrcardio.2017.189',
  },
}

/**
 * The seven lifestyle levers. `impact[systemId] = { good, harm }`.
 * `good`  = points added when the healthy card is active.
 * `harm`  = points removed when the unhealthy card is active.
 */
export const DIMENSIONS = [
  {
    id: 'movement',
    category: 'Movement',
    icon: 'walk',
    good: { title: 'Brisk daily walking', tag: '8,000–10,000 steps' },
    bad: { title: 'Sitting 8+ hours a day', tag: 'Mostly sedentary' },
    impact: {
      brain: { good: 8, harm: 6 },
      heart: { good: 12, harm: 10 },
      lungs: { good: 8, harm: 6 },
      muscles: { good: 8, harm: 6 },
      metabolic: { good: 9, harm: 7 },
    },
    claims: [
      { text: 'Reaching ~8,000–10,000 steps/day was associated with a 40–53% lower risk of death vs. the least active adults.', refs: ['paluch2022'] },
      { text: 'Sitting 8+ hours a day raised mortality risk by up to ~90% in the least active — an effect largely offset by 60–75 min of daily activity.', refs: ['ekelund2016'] },
    ],
    refs: ['paluch2022', 'ekelund2016'],
  },
  {
    id: 'strength',
    category: 'Strength',
    icon: 'strength',
    good: { title: 'Resistance training', tag: '2× per week' },
    bad: { title: 'No strength training', tag: 'Losing muscle' },
    impact: {
      brain: { good: 4, harm: 3 },
      heart: { good: 6, harm: 4 },
      lungs: { good: 3, harm: 2 },
      muscles: { good: 20, harm: 16 },
      metabolic: { good: 8, harm: 6 },
    },
    claims: [
      { text: 'Just 30–60 min/week of muscle-strengthening activity was linked to a 10–17% lower risk of all-cause mortality, CVD, diabetes and cancer.', refs: ['momma2022'] },
      { text: 'Benefits held independently of aerobic exercise — strength work is its own lever, protecting muscle and insulin sensitivity.', refs: ['momma2022'] },
    ],
    refs: ['momma2022'],
  },
  {
    id: 'diet',
    category: 'Nutrition',
    icon: 'produce',
    good: { title: 'Fruits & vegetables', tag: '~800 g / day' },
    bad: { title: 'Ultra-processed food', tag: 'Most meals' },
    impact: {
      brain: { good: 7, harm: 6 },
      heart: { good: 9, harm: 8 },
      lungs: { good: 5, harm: 4 },
      muscles: { good: 8, harm: 6 },
      metabolic: { good: 14, harm: 13 },
    },
    claims: [
      { text: 'Risk of CVD and early death kept falling up to ~800 g/day of fruit & vegetables (about 10 portions).', refs: ['aune2017'] },
      { text: 'High ultra-processed food intake was associated with a ~25% higher risk of all-cause mortality and higher cardiovascular risk.', refs: ['pagliai2021'] },
    ],
    refs: ['aune2017', 'pagliai2021'],
  },
  {
    id: 'sleep',
    category: 'Sleep',
    icon: 'sleep',
    good: { title: '7–8 h quality sleep', tag: 'Consistent schedule' },
    bad: { title: 'Chronic sleep loss', tag: '< 6 h / night' },
    impact: {
      brain: { good: 12, harm: 12 },
      heart: { good: 6, harm: 6 },
      lungs: { good: 3, harm: 3 },
      muscles: { good: 6, harm: 6 },
      metabolic: { good: 6, harm: 6 },
    },
    claims: [
      { text: 'Short sleep duration was associated with a ~12% greater risk of dying over follow-up across 1.3M+ adults.', refs: ['cappuccio2010'] },
      { text: 'Sleep is when the brain clears metabolic waste and consolidates memory — the system most sensitive to sleep debt.', refs: ['cappuccio2010'] },
    ],
    refs: ['cappuccio2010'],
  },
  {
    id: 'social',
    category: 'Connection',
    icon: 'community',
    good: { title: 'Community & connection', tag: 'Strong ties' },
    bad: { title: 'Social isolation', tag: 'Few connections' },
    impact: {
      brain: { good: 10, harm: 9 },
      heart: { good: 5, harm: 5 },
      lungs: { good: 3, harm: 3 },
      muscles: { good: 2, harm: 2 },
      metabolic: { good: 2, harm: 2 },
    },
    claims: [
      { text: 'Strong social relationships were linked to a 50% higher likelihood of survival — an effect comparable to quitting smoking.', refs: ['holtlunstad2010'] },
      { text: 'The protective effect was strongest for rich social integration and held across age, sex and baseline health.', refs: ['holtlunstad2010'] },
    ],
    refs: ['holtlunstad2010'],
  },
  {
    id: 'smoking',
    category: 'Smoking',
    icon: 'nosmoke',
    good: { title: 'Smoke-free', tag: 'Quit / never smoked' },
    bad: { title: 'Smoking', tag: 'Daily smoker' },
    impact: {
      brain: { good: 5, harm: 6 },
      heart: { good: 12, harm: 14 },
      lungs: { good: 22, harm: 24 },
      muscles: { good: 4, harm: 5 },
      metabolic: { good: 4, harm: 5 },
    },
    claims: [
      { text: 'Quitting cuts cardiovascular risk sharply within 1–2 years and can add up to a decade of life expectancy.', refs: ['sgr2020'] },
      { text: 'After cessation, lung and airway damage slows and lung-cancer risk falls toward half that of continuing smokers over ~15 years.', refs: ['sgr2020'] },
    ],
    refs: ['sgr2020'],
  },
  {
    id: 'stress',
    category: 'Stress',
    icon: 'calm',
    good: { title: 'Stress recovery', tag: 'Mindfulness & rest' },
    bad: { title: 'Chronic stress', tag: 'Always "on"' },
    impact: {
      brain: { good: 9, harm: 9 },
      heart: { good: 6, harm: 6 },
      lungs: { good: 4, harm: 4 },
      muscles: { good: 4, harm: 4 },
      metabolic: { good: 6, harm: 6 },
    },
    claims: [
      { text: 'Chronic psychological stress is an independent contributor to the development and progression of cardiovascular disease.', refs: ['kivimaki2018'] },
      { text: 'Building recovery — through rest, mindfulness and downtime — helps blunt the stress pathways that drive heart and brain risk.', refs: ['kivimaki2018'] },
    ],
    refs: ['kivimaki2018'],
  },
]

/** A realistic "average knowledge worker" starting point — lots of upside. */
export const DEFAULT_STATE = {
  movement: 'bad',
  strength: 'bad',
  diet: 'bad',
  sleep: 'good',
  social: 'bad',
  smoking: 'good',
  stress: 'bad',
}
