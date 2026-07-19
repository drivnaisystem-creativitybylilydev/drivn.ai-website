'use client'

import { useState } from 'react'

const O = '#E04E22'
const OD = '#C13D18'
const OL = '#FFF4F1'

const PACKAGES = [
  { id: 'strategy', name: 'Karriere-Strategie Session', duration: '1 × 60 Min.', description: 'Einmalige Standortbestimmung: Wo stehen Sie aktuell, wohin möchten Sie, und was sind die nächsten konkreten Schritte.', tags: ['Einstieg', 'Orientierung'] },
  { id: 'coaching-6', name: 'Karriere-Coaching Paket', duration: '6 × 60 Min.', description: 'Strukturierte Begleitung durch eine Karrieretransition oder berufliche Neuausrichtung mit nachhaltigem Prozess.', tags: ['Beliebt', 'Transition'] },
  { id: 'linkedin', name: 'LinkedIn & Personal Branding', duration: '3 × 60 Min.', description: 'Profiloptimierung, Content-Strategie und Aufbau einer authentischen Personal Brand für sichtbaren Karriereerfolg.', tags: ['LinkedIn', 'Sichtbarkeit'] },
  { id: 'interview', name: 'Interview-Vorbereitung', duration: '2 × 60 Min.', description: 'Gezielte Vorbereitung auf Vorstellungsgespräche, Assessment Center und Gehaltsverhandlungen.', tags: ['Vorbereitung', 'Verhandlung'] },
  { id: 'executive', name: 'Executive Career Coaching', duration: '12 × 60 Min.', description: 'Premium-Begleitung für Führungskräfte bei Karrieretransitionen, Positionswechsel und strategischer Neuausrichtung.', tags: ['Führungskräfte', 'Premium'] },
  { id: 'expat', name: 'Expat-Karrierebegleitung', duration: '4 × 60 Min.', description: 'Maßgeschneidertes Coaching für internationale Fachkräfte auf dem deutschen Arbeitsmarkt.', tags: ['Expats', 'International'] },
]

interface Client {
  firstName: string; lastName: string; role: string; company: string
  callDate: string; goal: string; notes: string
  language: 'de' | 'en'; tone: 'formal' | 'informal'
}

const EMPTY: Client = { firstName: '', lastName: '', role: '', company: '', callDate: '', goal: '', notes: '', language: 'de', tone: 'formal' }

export default function ProposalGenerator() {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [client, setClient] = useState<Client>(EMPTY)
  const [proposal, setProposal] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const set = (k: keyof Client, v: string) => setClient(p => ({ ...p, [k]: v }))

  async function generate() {
    setLoading(true)
    setProposal('')
    try {
      const res = await fetch('/api/afrodita-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packages: PACKAGES.filter(p => selected.includes(p.id)), client }),
      })
      const data = await res.json()
      setProposal(data.proposal ?? 'Fehler beim Generieren.')
    } catch {
      setProposal('Verbindungsfehler. Bitte versuchen Sie es erneut.')
    }
    setLoading(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const ok1 = selected.length > 0
  const ok2 = client.firstName.trim() && client.lastName.trim() && client.goal.trim()

  return (
    <div style={{ minHeight: '100vh', background: '#f8f8f6', fontFamily: 'Inter, system-ui, sans-serif', color: '#1a1a1a' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: O, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>AP</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Afrodita Panovska</div>
              <div style={{ fontSize: 11, color: '#999' }}>Executive & Career Coach</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#bbb' }}>Proposal Generator</div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: '#fff', borderBottom: '1px solid #ebebeb' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 0 }}>
          {[{ n: 1, label: 'Paket wählen' }, { n: 2, label: 'Kundendaten' }, { n: 3, label: 'Proposal' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: step >= s.n ? O : '#eee', color: step >= s.n ? '#fff' : '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span style={{ fontSize: 13, color: step === s.n ? O : step > s.n ? '#888' : '#bbb', fontWeight: step === s.n ? 500 : 400, display: window?.innerWidth < 500 ? 'none' : undefined }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > s.n ? O : '#e5e5e5', margin: '0 12px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Paket auswählen</h1>
              <p style={{ color: '#777', marginTop: 4, fontSize: 14 }}>Wählen Sie ein oder mehrere Pakete für diesen Klienten.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {PACKAGES.map(pkg => {
                const on = selected.includes(pkg.id)
                return (
                  <button key={pkg.id} onClick={() => toggle(pkg.id)} style={{ textAlign: 'left', padding: 16, borderRadius: 12, border: `2px solid ${on ? O : '#e5e5e5'}`, background: on ? OL : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{pkg.name}</span>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${on ? O : '#ccc'}`, background: on ? O : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10 }}>
                        {on && '✓'}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: O, fontWeight: 500, marginBottom: 8 }}>{pkg.duration}</div>
                    <div style={{ fontSize: 12, color: '#777', lineHeight: 1.5, marginBottom: 10 }}>{pkg.description}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {pkg.tags.map(t => (
                        <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: on ? `${O}18` : '#f0f0f0', color: on ? O : '#888' }}>{t}</span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
              <button onClick={() => setStep(2)} disabled={!ok1} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: ok1 ? O : '#e5e5e5', color: ok1 ? '#fff' : '#aaa', fontSize: 13, fontWeight: 600, cursor: ok1 ? 'pointer' : 'not-allowed' }}>
                Weiter → Kundendaten
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Kundendaten</h1>
              <p style={{ color: '#777', marginTop: 4, fontSize: 14 }}>Informationen aus dem Discovery Call fließen direkt ins Proposal ein.</p>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[['firstName', 'Vorname *', 'z.B. Maria'], ['lastName', 'Nachname *', 'z.B. Müller']].map(([k, label, ph]) => (
                  <div key={k}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 6 }}>{label}</label>
                    <input value={client[k as keyof Client]} onChange={e => set(k as keyof Client, e.target.value)} placeholder={ph} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[['role', 'Aktuelle Rolle', 'z.B. Senior Developer'], ['company', 'Unternehmen / Branche', 'z.B. Tech-Startup Berlin']].map(([k, label, ph]) => (
                  <div key={k}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 6 }}>{label}</label>
                    <input value={client[k as keyof Client]} onChange={e => set(k as keyof Client, e.target.value)} placeholder={ph} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 6 }}>Datum des Discovery Calls</label>
                <input type="date" value={client.callDate} onChange={e => set('callDate', e.target.value)} style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 6 }}>Hauptziel des Klienten *</label>
                <textarea value={client.goal} onChange={e => set('goal', e.target.value)} placeholder="z.B. Wechsel aus dem Tech-Bereich in eine Führungsrolle im Produktmanagement innerhalb von 6 Monaten." rows={3} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 6 }}>Notizen aus dem Discovery Call</label>
                <textarea value={client.notes} onChange={e => set('notes', e.target.value)} placeholder="z.B. 3 gescheiterte Bewerbungen, starkes Profil aber kein klares Narrativ, möchte Führungserfahrung hervorheben..." rows={4} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 6 }}>Sprache</label>
                  <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                    {(['de', 'en'] as const).map(l => (
                      <button key={l} onClick={() => set('language', l)} style={{ flex: 1, padding: '9px 0', border: 'none', background: client.language === l ? O : '#fff', color: client.language === l ? '#fff' : '#666', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                        {l === 'de' ? '🇩🇪 Deutsch' : '🇬🇧 English'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 6 }}>Anrede</label>
                  <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                    {([['formal', 'Sie'], ['informal', 'Du']] as const).map(([v, lbl]) => (
                      <button key={v} onClick={() => set('tone', v)} style={{ flex: 1, padding: '9px 0', border: 'none', background: client.tone === v ? O : '#fff', color: client.tone === v ? '#fff' : '#666', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, padding: '10px 14px', background: OL, borderRadius: 8, border: `1px solid ${O}30` }}>
              <span style={{ fontSize: 12, color: O, fontWeight: 500 }}>
                Pakete: {PACKAGES.filter(p => selected.includes(p.id)).map(p => p.name).join(' · ')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <button onClick={() => setStep(1)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', fontSize: 13, color: '#555', cursor: 'pointer' }}>← Zurück</button>
              <button onClick={() => { setStep(3); generate() }} disabled={!ok2} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: ok2 ? O : '#e5e5e5', color: ok2 ? '#fff' : '#aaa', fontSize: 13, fontWeight: 600, cursor: ok2 ? 'pointer' : 'not-allowed' }}>
                Proposal generieren →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Ihr Proposal</h1>
                <p style={{ color: '#777', marginTop: 4, fontSize: 14 }}>Für {client.firstName} {client.lastName}{client.company ? ` · ${client.company}` : ''}</p>
              </div>
              {!loading && proposal && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setStep(2); setProposal('') }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', fontSize: 12, color: '#555', cursor: 'pointer' }}>Bearbeiten</button>
                  <button onClick={copy} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: O, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {copied ? '✓ Kopiert' : 'Kopieren'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', overflow: 'hidden' }}>
              <div style={{ background: O, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Coaching-Angebot</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                    {client.firstName} {client.lastName}
                    {client.callDate ? ` · ${new Date(client.callDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>Afrodita Panovska</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>ACC · ICF · MBA</div>
                </div>
              </div>

              <div style={{ padding: '28px 32px', minHeight: 300 }}>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16 }}>
                    <div style={{ width: 36, height: 36, border: `3px solid ${O}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ color: '#999', fontSize: 13 }}>Proposal wird generiert…</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, lineHeight: 1.8, color: '#333', whiteSpace: 'pre-wrap' }}>{proposal}</div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 24px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#bbb' }}>afrodita-panovska.com · info@afrodita-panovska.com</span>
                <button onClick={() => window.print()} style={{ fontSize: 11, color: '#bbb', background: 'none', border: 'none', cursor: 'pointer' }}>Drucken / PDF</button>
              </div>
            </div>

            {!loading && proposal && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                <button onClick={() => { setStep(1); setSelected([]); setClient(EMPTY); setProposal('') }} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', fontSize: 12, color: '#555', cursor: 'pointer' }}>Neues Proposal</button>
                <button onClick={copy} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: O, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {copied ? '✓ Kopiert' : 'In Zwischenablage kopieren'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '20px 0 32px', fontSize: 11, color: '#ccc' }}>
        Powered by <span style={{ color: '#aaa', fontWeight: 500 }}>Drivn.AI</span>
      </div>
    </div>
  )
}
