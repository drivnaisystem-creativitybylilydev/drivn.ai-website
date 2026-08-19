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

export default function SheridanMoversPage() {
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
        @keyframes drawLine { from { height: 0; } to { height: 100%; } }
        .sm-h1, .sm-h2, .sm-h3 { font-family: var(--font-display, ui-sans-serif), -apple-system, sans-serif; }
        .sm-glass {
          background: rgba(124,77,255,0.05);
          border: 1px solid rgba(124,77,255,0.18);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .sm-link-btn:hover { background: #8f63ff !important; }
        @media (max-width: 680px) {
          .sm-compare { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(28px,6vw,64px) clamp(20px,5vw,40px) 80px" }}>

        {/* Brandline */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 44, flexWrap: "wrap", gap: 8 }}>
          <span className="sm-h3" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.02em" }}>
            DRIVN<span style={{ color: "#b79cff" }}>.AI</span>
          </span>
          <span style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Prepared for Sheridan Movers
          </span>
        </div>

        {/* Hero */}
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b79cff", display: "inline-block", animation: "pulseDot 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700 }}>
                Speed-to-Lead + Quoting
              </span>
            </div>
            <h1 className="sm-h1" style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.015em", margin: "0 0 20px" }}>
              Every quote request gets answered before the other guy even calls back.
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.68)", maxWidth: "58ch", margin: 0 }}>
              Following up on our call — this walks through what Speed-to-Lead and Quoting Automation would
              actually change day-to-day at Sheridan, and how the system works underneath. No pricing on this
              page on purpose — that comes after a short audit call, once we know your real numbers.
            </p>
          </div>
        </Reveal>

        {/* Today vs After */}
        <Reveal delay={80}>
          <div className="sm-compare" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 60 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                Today
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "Someone fills out your quote form, or calls after hours",
                  "The request sits until someone's free to call back",
                  "No price given until that callback happens",
                  "Whoever answers first usually books it — and it's often not you",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.55)" }}>
                    <CrossIcon />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="sm-glass" style={{ padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#b79cff", marginBottom: 16 }}>
                After This Build
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "Quote request comes in, day or night, weekends included",
                  "Instant response confirms it was received",
                  "A couple of quick questions get answered right away",
                  "A real price range appears on screen — before the other guy calls back",
                  "Your team confirms final pricing and books it, same as today",
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

        {/* Stats */}
        <Reveal delay={100}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 60 }}>
            <div className="sm-glass" style={{ padding: "18px 20px" }}>
              <div className="sm-h2" style={{ fontSize: 28, fontWeight: 800, color: "#f0eef7" }}>~78%</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginTop: 4, lineHeight: 1.5 }}>
                of home-service jobs go to whoever responds first — not necessarily the better company.
              </div>
            </div>
            <div className="sm-glass" style={{ padding: "18px 20px" }}>
              <div className="sm-h2" style={{ fontSize: 28, fontWeight: 800, color: "#f0eef7" }}>73% <span style={{ opacity: 0.4, fontWeight: 500, fontSize: 18 }}>vs</span> 4%</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginTop: 4, lineHeight: 1.5 }}>
                close rate on a reply inside 60 seconds, vs. a reply that takes 30+ minutes.
              </div>
            </div>
          </div>
        </Reveal>

        {/* How it works — animated flow */}
        <div style={{ marginBottom: 60 }}>
          <Reveal>
            <h2 className="sm-h3" style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>How this actually works</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 32px", maxWidth: "54ch" }}>
              Nothing about how a customer requests a quote changes. This is what happens automatically
              behind the scenes, in the order it happens.
            </p>
          </Reveal>

          <div style={{ position: "relative" }}>
            <div
              aria-hidden
              style={{
                position: "absolute", left: 15, top: 6, bottom: 6, width: 1,
                background: "linear-gradient(to bottom, rgba(124,77,255,0.5), rgba(124,77,255,0.05))",
              }}
            />
            {[
              { t: "Request comes in — anytime", d: "From your existing quote form or a missed call. No changes needed on your end, day or night." },
              { t: "Instant acknowledgment goes out", d: "A text or email confirming you received it — inside a minute or two, not by end of day." },
              { t: "A few quick details get collected", d: "Move date, size, origin/destination — the same info your form already asks for." },
              { t: "A real price range appears on screen", d: "Calculated from those details, so they're not left guessing while they compare you to other movers." },
              { t: "Your team steps in to confirm and book", d: "Exactly like today — the difference is they're starting from a warm, already-informed lead instead of a cold one." },
            ].map((step, i) => (
              <Reveal key={step.t} delay={i * 90}>
                <div style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 16, paddingBottom: 28, position: "relative" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: "#16161a",
                    border: "1.5px solid #7c4dff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "#b79cff", flexShrink: 0, zIndex: 1,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ paddingTop: 4 }}>
                    <h3 className="sm-h3" style={{ fontSize: 15.5, fontWeight: 700, margin: "0 0 4px" }}>{step.t}</h3>
                    <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: "50ch" }}>{step.d}</p>
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
              A 5.0-star rating across 300+ reviews doesn&rsquo;t happen by accident. This isn&rsquo;t about
              fixing something broken — it&rsquo;s about closing the gap between how good that reputation is
              and how fast it actually turns into a booked truck.
            </p>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="sm-glass" style={{ padding: "clamp(24px,4vw,36px)", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700, marginBottom: 10 }}>
              Next Step
            </div>
            <h2 className="sm-h2" style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, margin: "0 0 10px" }}>
              20 minutes to run the audit — no pitch, just numbers.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 24px", maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>
              We&rsquo;ll walk through your actual lead volume and response time so anything proposed after
              this is sized to real numbers, not a guess. Pick whatever time works.
            </p>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="sm-link-btn"
              style={{
                display: "inline-block", background: "#7c4dff", color: "#fff", textDecoration: "none",
                fontWeight: 700, fontSize: 14.5, padding: "13px 30px", borderRadius: 999,
                transition: "background 0.15s ease",
              }}
            >
              Book the Audit Call
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
