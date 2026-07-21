import React from 'react'
import { REFERENCES } from '../data/model.js'

/** Numbered, linked bibliography — the credibility backbone for enterprise buyers. */
export default function ReferencesSection() {
  const entries = Object.entries(REFERENCES)
  return (
    <section className="refs" id="references">
      <div className="refs-inner">
        <div className="refs-head">
          <h2>The evidence</h2>
          <p>
            Every impact in VitalMap traces to peer-reviewed research — meta-analyses, cohort studies and national
            health authorities. Nothing here is invented.
          </p>
        </div>
        <ol className="ref-list">
          {entries.map(([id, r]) => (
            <li key={id}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <span className="ref-authors">{r.authors}</span> {r.title}.
                <span className="ref-source"> {r.source}.</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
