"use client";

import type { ProposalData } from "@/lib/proposals/proposals";

const today = new Date().toLocaleDateString("de-DE", {
  day: "2-digit", month: "long", year: "numeric",
});

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        marginBottom: "1.25rem", paddingBottom: "0.75rem",
        borderBottom: `1px solid rgba(255,255,255,0.07)`,
      }}>
        <div style={{ width: 3, height: 20, background: accent, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Table({ rows, cols }: { rows: string[][]; cols: string[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} style={{ textAlign: "left", padding: "0.5rem 0.75rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "0.65rem 0.75rem", color: j === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)", verticalAlign: "top", lineHeight: 1.5 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pill({ text, accent }: { text: string; accent: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "0.25rem 0.75rem",
      borderRadius: 99, fontSize: "0.72rem", fontWeight: 600,
      border: `1px solid ${accent}55`, color: accent,
      background: `${accent}11`, marginRight: "0.5rem", marginBottom: "0.4rem",
    }}>{text}</span>
  );
}

export default function ProposalView({ proposal: p }: { proposal: ProposalData }) {
  const accent = p.accentColor;
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { background: #0a0a0f; }
        body { background: #0a0a0f; color: #e8e8f0; font-family: 'Inter', system-ui, sans-serif; font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased; }

        @media print {
          html, body { background: #fff !important; color: #111 !important; font-size: 13px; }
          .no-print { display: none !important; }
          .print-page { background: #fff !important; color: #111 !important; padding: 0 !important; max-width: 100% !important; }
          .card { background: #f9f9f9 !important; border: 1px solid #e0e0e0 !important; }
          table td, table th { color: #333 !important; border-color: #e0e0e0 !important; }
          h1, h2 { color: #111 !important; }
          a { color: #333 !important; }
          .pricing-card { background: #f5f5f5 !important; border: 1px solid #e0e0e0 !important; }
          @page { margin: 1.5cm 2cm; }
        }
      `}</style>

      {/* Sticky action bar */}
      <div className="no-print" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,15,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.75rem 1.5rem", gap: "1rem",
      }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: accent }}>
          Drivn.AI
        </span>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hier ist unser Angebot für ${p.client}: ${url}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.45rem 1rem", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600,
              background: "#25D36611", border: "1px solid #25D36655", color: "#25D366",
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <button
            onClick={() => window.print()}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.45rem 1rem", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600,
              background: `${accent}18`, border: `1px solid ${accent}55`, color: accent,
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF speichern
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="print-page" style={{ maxWidth: 760, margin: "0 auto", padding: "5.5rem 1.5rem 4rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1rem", color: accent }}>Drivn.AI</span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{today}</span>
          </div>
          <div style={{ marginBottom: "0.5rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
            Angebot
          </div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "0.5rem" }}>
            {p.client}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
            <Pill text={p.niche} accent={accent} />
            <Pill text={p.city} accent={accent} />
          </div>
        </div>

        {/* Situation */}
        <Section title="Ausgangslage" accent={accent}>
          <div className="card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.25rem 1.5rem" }}>
            {p.situation.split("\n\n").map((para, i) => (
              <p key={i} style={{ marginBottom: i < p.situation.split("\n\n").length - 1 ? "0.85rem" : 0, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{para}</p>
            ))}
          </div>
        </Section>

        {/* Website */}
        <Section title="Was wir bauen" accent={accent}>
          <div style={{ marginBottom: "1rem" }}>
            {p.websiteLanguages && (
              <div style={{ marginBottom: "0.85rem" }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", marginRight: "0.5rem" }}>Sprachen:</span>
                {p.websiteLanguages.map((l) => <Pill key={l} text={l} accent={accent} />)}
              </div>
            )}
            <p style={{ fontSize: "0.82rem", color: accent, marginBottom: "1rem", fontStyle: "italic" }}>{p.websiteDesign}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {p.websitePages.map((page, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: "0.55rem" }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.55 }}>{page}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Google visibility */}
        <Section title="Google-Sichtbarkeit" accent={accent}>
          <Table
            cols={["Was wir einrichten", "Warum das wichtig ist"]}
            rows={p.googleDeliverables.map((d) => [d.item, d.why])}
          />
          {p.extra && (
            <div style={{ marginTop: "1rem", padding: "0.9rem 1.1rem", background: `${accent}0d`, border: `1px solid ${accent}33`, borderRadius: 8, fontSize: "0.82rem", color: `${accent}cc`, lineHeight: 1.6 }}>
              {p.extra}
            </div>
          )}
        </Section>

        {/* Delivery */}
        <Section title="Was ihr bekommt" accent={accent}>
          <Table
            cols={["Lieferung", "Details"]}
            rows={p.deliveryTable.map((d) => [d.item, d.detail])}
          />
        </Section>

        {/* Pricing */}
        <Section title="Investition" accent={accent}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Option A */}
            <div className="pricing-card" style={{ background: `${accent}0f`, border: `1px solid ${accent}44`, borderRadius: 10, padding: "1.25rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: accent, marginBottom: "0.75rem" }}>Option A</div>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>{p.pricingA.setup}</span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginLeft: "0.4rem" }}>einmalig</span>
              </div>
              <div style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.4rem" }}>dann {p.pricingA.monthly}</div>
              {p.pricingA.note && <div style={{ fontSize: "0.75rem", color: accent }}>{p.pricingA.note}</div>}
              <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>Monatlich kündbar · 30 Tage Frist</div>
            </div>
            {/* Option B */}
            <div className="pricing-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "1.25rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>Option B — Kein Setup-Fee</div>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "rgba(255,255,255,0.8)" }}>{p.pricingB.monthly}</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" }}>{p.pricingB.term}</div>
              <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>Monatlich kündbar · 30 Tage Frist</div>
            </div>
          </div>
          <p style={{ marginTop: "0.85rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>Alle Preise zzgl. gesetzlicher MwSt. Beide Optionen beinhalten denselben Leistungsumfang.</p>
        </Section>

        {/* Timeline */}
        <Section title="Zeitplan" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {p.timeline.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? accent : "rgba(255,255,255,0.15)", border: `2px solid ${i === 0 ? accent : "rgba(255,255,255,0.1)"}`, marginTop: "0.9rem" }} />
                  {i < p.timeline.length - 1 && <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.07)", marginTop: 2 }} />}
                </div>
                <div style={{ paddingTop: "0.6rem", paddingBottom: i < p.timeline.length - 1 ? "0" : "0" }}>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{t.step}</div>
                  <div style={{ fontSize: "0.75rem", color: accent, marginTop: "0.1rem" }}>{t.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Next steps */}
        <Section title="Nächste Schritte" accent={accent}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              "Angebot annehmen — kurze Rückmeldung per WhatsApp oder E-Mail",
              "Vertrag digital unterschreiben (2 Minuten, wir schicken ihn zu)",
              "500 € Anzahlung — Rest bei Live-Schaltung",
              "Kickoff-Gespräch: 30 Minuten, vor Ort oder per Video",
              "Ihr entspannt — wir bauen",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${accent}18`, border: `1px solid ${accent}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.65rem", fontWeight: 700, color: accent }}>{i + 1}</div>
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", paddingTop: "0.2rem", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: accent, marginBottom: "0.35rem" }}>Drivn.AI</div>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
              Finn [Nachname]<br />
              [Telefon] · [E-Mail]
            </div>
          </div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", textAlign: "right" }}>
            Angebot gültig 14 Tage<br />
            ab Erstellungsdatum
          </div>
        </div>

      </div>
    </>
  );
}
