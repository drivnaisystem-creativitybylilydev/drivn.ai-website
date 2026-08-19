"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const CAL_LINK = "https://calendar.app.google/hwHNSN7M7Lf4xwrK8";

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

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="9" cy="9" r="9" fill="#7c4dff" fillOpacity="0.18" />
    <path d="M5.5 9.3L7.6 11.5L12.5 6.3" stroke="#b79cff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CrossIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }}>
    <circle cx="9" cy="9" r="9" fill="#ffffff" fillOpacity="0.06" />
    <path d="M6 6L12 12M12 6L6 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const PHASES = [
  {
    tag: "Phase 1 — Start Here",
    title: "Website Rebuild + Rough Quoting",
    why: "Everything else depends on this working first.",
    points: [
      "A real, current design that actually matches a 5.0-rated, established mover",
      "Your 8 reviews shown where people can see them — not buried or missing entirely",
      "Every page finished, every link working, no more placeholder pages",
      "A rough on-site quote tool using your real pricing tiers — $600–950 for a studio/1-bed up to $1,500–1,750 for a 4-bed — so visitors get a real number without waiting on a callback",
    ],
  },
  {
    tag: "Phase 2 — Once The Site Is Live",
    title: "Speed-to-Lead + Review Automation",
    why: "Now that the foundation converts, this is what keeps it full.",
    points: [
      "Instant acknowledgment the moment a quote request comes in, day or night",
      "A few quick follow-up questions answered automatically, before your team even picks up the phone",
      "An automated review request sent after every completed move — turning good work you're already doing into visible proof",
    ],
  },
  {
    tag: "Phase 3 — Once The Site Converts",
    title: "Marketing / Paid Ads",
    why: "You asked about this on the call — here's the honest order to do it in.",
    points: [
      "Paid traffic only pays off once the page it lands on can actually convert it",
      "Sending ad spend to a site with no visible reviews and a broken link burns budget before it has a chance to work",
      "Once Phase 1 and 2 are live, the same ad spend goes to a page with real reviews and instant quoting — a completely different return",
    ],
  },
];

export default function BellahMovingPage() {
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
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
        .bm-h1, .bm-h2, .bm-h3 { font-family: var(--font-display, ui-sans-serif), -apple-system, sans-serif; }
        .bm-glass {
          background: rgba(124,77,255,0.05);
          border: 1px solid rgba(124,77,255,0.18);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .bm-link-btn:hover { background: #8f63ff !important; }
        @media (max-width: 680px) {
          .bm-compare { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(28px,6vw,64px) clamp(20px,5vw,40px) 80px" }}>

        {/* Brandline */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 44, flexWrap: "wrap", gap: 8 }}>
          <span className="bm-h3" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.02em" }}>
            DRIVN<span style={{ color: "#b79cff" }}>.AI</span>
          </span>
          <span style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Prepared for Bellah Moving Services
          </span>
        </div>

        {/* Hero */}
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b79cff", display: "inline-block", animation: "pulseDot 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700 }}>
                Website &middot; Speed-to-Lead &middot; Marketing
              </span>
            </div>
            <h1 className="bm-h1" style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.015em", margin: "0 0 20px" }}>
              Your reviews say 5.0. Your website says otherwise.
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.68)", maxWidth: "58ch", margin: 0 }}>
              Following up on our call — this walks through what I&rsquo;d actually fix at Bellah Moving, in the
              order that makes sense, including the ads question you raised. No pricing on this page on
              purpose — that comes after a short call, once we know your real numbers.
            </p>
          </div>
        </Reveal>

        {/* Today vs After */}
        <Reveal delay={80}>
          <div className="bm-compare" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 60 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                Right Now, On Your Site
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "Homepage stats show 0 team members, 0 moves, 0 rating — even though you're 5.0 with 8 real Google reviews",
                  "Your contact link is broken — it doesn't actually go anywhere",
                  "A couple of pages were started and never finished",
                  "Quoting is a form-and-wait — no price until someone calls back",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.55)" }}>
                    <CrossIcon />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="bm-glass" style={{ padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#b79cff", marginBottom: 16 }}>
                After Phase 1
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "A real, current site that actually matches your reputation",
                  "Your 8 five-star reviews visible where people actually look",
                  "Every page finished, every link working",
                  "A rough instant-quote tool using your real pricing, so people get a number in seconds",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>
                    <CheckIcon />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Three-phase roadmap */}
        <div style={{ marginBottom: 60 }}>
          <Reveal>
            <h2 className="bm-h3" style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>The order that actually makes sense</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 32px", maxWidth: "54ch" }}>
              Three things came up between the site and the call — the site itself, speed on incoming leads,
              and paid ads. They work best in this order, not all at once.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PHASES.map((phase, i) => (
              <Reveal key={phase.title} delay={i * 100}>
                <div className="bm-glass" style={{ padding: "24px 24px 26px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", background: "#16161a",
                      border: "1.5px solid #7c4dff", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12.5, fontWeight: 800, color: "#b79cff", flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#b79cff" }}>
                      {phase.tag}
                    </span>
                  </div>
                  <h3 className="bm-h2" style={{ fontSize: 19, fontWeight: 800, margin: "0 0 4px" }}>{phase.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 16px", fontStyle: "italic" }}>{phase.why}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {phase.points.map((pt) => (
                      <div key={pt} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.75)" }}>
                        <CheckIcon />
                        {pt}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Reputation callout */}
        <Reveal>
          <div style={{ borderLeft: "3px solid #7c4dff", padding: "2px 0 2px 18px", marginBottom: 60 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              A 5.0-star rating doesn&rsquo;t happen by accident, even at 8 reviews. This isn&rsquo;t about
              fixing something broken with your moves — it&rsquo;s about closing the gap between how good the
              work already is and what the website actually shows a stranger deciding whether to call you.
            </p>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="bm-glass" style={{ padding: "clamp(24px,4vw,36px)", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700, marginBottom: 10 }}>
              Next Step
            </div>
            <h2 className="bm-h2" style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, margin: "0 0 10px" }}>
              20 minutes to go through this properly — no pitch, just numbers.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 24px", maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>
              We&rsquo;ll walk through what Phase 1 actually looks like for your site specifically, and where
              ads fit once it&rsquo;s ready for them. Pick whatever time works.
            </p>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bm-link-btn"
              style={{
                display: "inline-block", background: "#7c4dff", color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 14.5, padding: "13px 30px", borderRadius: 10,
                transition: "background 0.15s ease",
              }}
            >
              Book a Call
            </a>
          </div>
        </Reveal>

        {/* Footer */}
        <div style={{ marginTop: 56, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          <span>Prepared by Finn &middot; Drivn.AI &middot; drivn.ai.system@gmail.com</span>
          <span>Reply anytime, or book the call above</span>
        </div>

      </div>
    </div>
  );
}
