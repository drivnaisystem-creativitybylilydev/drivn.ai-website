"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const QUOTE_EMAIL = "atsimo1987@gmail.com";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const StarRow = ({ size = 15 }: { size?: number }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="#f5c451">
        <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
      </svg>
    ))}
  </div>
);

const SERVICES = [
  {
    t: "Local & Long-Distance Moving",
    d: "Full-service residential moves across the Merrimack Valley and beyond — packed, loaded, and handled with care from the first box to the last.",
  },
  {
    t: "Junk & Debris Removal",
    d: "Furniture, appliances, construction debris, and household clutter — hauled and disposed of the same day in most cases.",
  },
  {
    t: "Packing & Storage",
    d: "Full or partial packing service, plus short- and long-term storage for moves that need a landing spot in between.",
  },
];

export default function ApollonasMovingDemo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0c",
        color: "#f0eef7",
        fontFamily: "var(--font-mono, ui-monospace), -apple-system, sans-serif",
      }}
    >
      <style>{`
        .apm-h1, .apm-h2, .apm-h3 { font-family: var(--font-display, ui-sans-serif), -apple-system, sans-serif; }
        .apm-glass {
          background: rgba(124,77,255,0.05);
          border: 1px solid rgba(124,77,255,0.18);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .apm-btn:hover { background: #8f63ff !important; }
        .apm-badge { position: fixed; bottom: 18px; right: 18px; z-index: 50; }
        @media (max-width: 680px) {
          .apm-services, .apm-stats { grid-template-columns: 1fr !important; }
          .apm-badge { left: 18px; right: 18px; bottom: 14px; text-align: center; }
        }
      `}</style>

      {/* Preview badge — this is a demo only Apollonas' owner sees via a private link, not a public/live page */}
      <div className="apm-badge">
        <div
          style={{
            background: "rgba(10,10,12,0.9)",
            border: "1px solid rgba(124,77,255,0.35)",
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 11.5,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          Free preview built by <span style={{ color: "#b79cff", fontWeight: 700 }}>Drivn.AI</span> — not your live site
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(28px,6vw,64px) clamp(20px,5vw,40px) 100px" }}>

        {/* Nav / brandline */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 48, flexWrap: "wrap", gap: 10 }}>
          <span className="apm-h3" style={{ fontSize: 17, fontWeight: 800, letterSpacing: "0.01em" }}>
            Apollonas <span style={{ color: "#b79cff" }}>Moving & Junk Removal</span>
          </span>
          <a
            href={`mailto:${QUOTE_EMAIL}`}
            className="apm-btn"
            style={{ background: "#7c4dff", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 13.5, padding: "9px 18px", borderRadius: 9, transition: "background 0.15s ease" }}
          >
            Get a Free Quote
          </a>
        </div>

        {/* Hero */}
        <Reveal>
          <div style={{ marginBottom: 52 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <StarRow />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>4.7 out of 5 — trusted across Lowell &amp; the Merrimack Valley</span>
            </div>
            <h1 className="apm-h1" style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, lineHeight: 1.14, letterSpacing: "-0.015em", margin: "0 0 18px" }}>
              Moving and junk removal, handled by the same crew you can actually reach.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.68)", maxWidth: "56ch", margin: "0 0 26px" }}>
              Locally owned, Lowell-based — full-service moving, junk removal, and storage, with a real
              quote before moving day, not a guess.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={`mailto:${QUOTE_EMAIL}`} className="apm-btn" style={{ background: "#7c4dff", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14.5, padding: "13px 26px", borderRadius: 10, transition: "background 0.15s ease" }}>
                Request a Quote
              </a>
            </div>
          </div>
        </Reveal>

        {/* Services */}
        <div style={{ marginBottom: 56 }}>
          <Reveal>
            <h2 className="apm-h3" style={{ fontSize: 21, fontWeight: 800, margin: "0 0 24px" }}>What We Do</h2>
          </Reveal>
          <div className="apm-services" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.t} delay={i * 80}>
                <div className="apm-glass" style={{ padding: "22px 20px", height: "100%" }}>
                  <h3 className="apm-h3" style={{ fontSize: 15.5, fontWeight: 700, margin: "0 0 8px" }}>{s.t}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: 0 }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <Reveal>
          <div className="apm-glass" style={{ padding: "clamp(24px,4vw,32px)", marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <StarRow size={18} />
              <span className="apm-h3" style={{ fontSize: 16, fontWeight: 800 }}>4.7 / 5</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>from customers across the Merrimack Valley</span>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontStyle: "italic", margin: 0 }}>
              &ldquo;Efficient, timely, professional, and careful with every item — even let me ride along to my
              new place 50 minutes away.&rdquo;
            </p>
          </div>
        </Reveal>

        {/* Service area */}
        <Reveal>
          <div style={{ borderLeft: "3px solid #7c4dff", padding: "2px 0 2px 18px", marginBottom: 56 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              Based in Lowell, MA — serving the Merrimack Valley and Greater Boston for local and long-distance
              moves, junk removal, and storage.
            </p>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="apm-glass" style={{ padding: "clamp(24px,4vw,36px)", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700, marginBottom: 10 }}>
              Ready When You Are
            </div>
            <h2 className="apm-h2" style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, margin: "0 0 10px" }}>
              Get a free, no-obligation quote today.
            </h2>
            <a
              href={`mailto:${QUOTE_EMAIL}`}
              className="apm-btn"
              style={{ display: "inline-block", background: "#7c4dff", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14.5, padding: "13px 30px", borderRadius: 10, transition: "background 0.15s ease" }}
            >
              Request a Quote
            </a>
          </div>
        </Reveal>

        {/* Footer */}
        <div style={{ marginTop: 56, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          This is a free preview homepage built by Drivn.AI for Apollonas Moving &amp; Junk Removal — not a live site.
        </div>

      </div>
    </div>
  );
}
