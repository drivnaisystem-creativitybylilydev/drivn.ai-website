"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const CAL_LINK = "https://calendar.app.google/hwHNSN7M7Lf4xwrK8";
const DEMO_LINK = "/apollonas-moving";

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

export default function ApollonasPitchPage() {
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
        .ap-h1, .ap-h2, .ap-h3 { font-family: var(--font-display, ui-sans-serif), -apple-system, sans-serif; }
        .ap-glass {
          background: rgba(124,77,255,0.05);
          border: 1px solid rgba(124,77,255,0.18);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .ap-link-btn:hover { background: #8f63ff !important; }
        @media (max-width: 680px) {
          .ap-compare { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(28px,6vw,64px) clamp(20px,5vw,40px) 80px" }}>

        {/* Brandline */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 44, flexWrap: "wrap", gap: 8 }}>
          <span className="ap-h3" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.02em" }}>
            DRIVN<span style={{ color: "#b79cff" }}>.AI</span>
          </span>
          <span style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Prepared for Apollonas Moving &amp; Junk Removal
          </span>
        </div>

        {/* Hero */}
        <Reveal>
          <div style={{ marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b79cff", display: "inline-block", animation: "pulseDot 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700 }}>
                A Free Website, No Catch
              </span>
            </div>
            <h1 className="ap-h1" style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.015em", margin: "0 0 20px" }}>
              You&rsquo;ve got a 4.7-star reputation and nowhere online for people to find it.
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.68)", maxWidth: "58ch", margin: 0 }}>
              I run Drivn.AI — I build websites and lead systems for moving and junk removal companies. I
              looked you up before reaching out: solid reviews, two services under one roof (moving <em>and</em>
              &nbsp;junk removal), and no website at all. That&rsquo;s a lot of searches you&rsquo;re invisible for. I built
              you a free homepage to show what that could look like — no obligation either way.
            </p>
          </div>
        </Reveal>

        {/* Demo callout */}
        <Reveal delay={40}>
          <a
            href={DEMO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="ap-glass ap-link-btn"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
              padding: "18px 22px", marginBottom: 56, textDecoration: "none", color: "#f0eef7",
              transition: "background 0.15s ease",
            }}
          >
            <div>
              <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700, marginBottom: 4 }}>
                View It
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Your free demo homepage &rarr;</div>
            </div>
            <span style={{ fontSize: 22, color: "#b79cff" }}>&rarr;</span>
          </a>
        </Reveal>

        {/* Today vs After */}
        <Reveal delay={80}>
          <div className="ap-compare" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 60 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                Right Now
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "Someone searches “junk removal Lowell MA” or “movers near me” — you don't show up",
                  "Your 4.7 rating lives on Google/Yelp, not anywhere you control",
                  "Every lead has to already know your name or number to reach you",
                  "Whoever has a website wins the search you never got a shot at",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.55)" }}>
                    <CrossIcon />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="ap-glass" style={{ padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#b79cff", marginBottom: 16 }}>
                With A Site Live
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "Show up when people search for movers or junk removal in Lowell",
                  "Your reviews front and center, working for you instead of sitting on someone else's platform",
                  "One page, two services — moving and junk removal cross-sell each other",
                  "A real quote request comes to your inbox, not a missed call",
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

        {/* Reputation callout */}
        <Reveal>
          <div style={{ borderLeft: "3px solid #7c4dff", padding: "2px 0 2px 18px", marginBottom: 60 }}>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0 }}>
              A 4.7 rating took real work to earn. Right now it&rsquo;s only doing half its job — it can convince
              someone who already found you, but it can&rsquo;t help anyone find you in the first place.
            </p>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="ap-glass" style={{ padding: "clamp(24px,4vw,36px)", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700, marginBottom: 10 }}>
              Next Step
            </div>
            <h2 className="ap-h2" style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, margin: "0 0 10px" }}>
              Take a look at the demo. If it&apos;s not for you, no hard feelings.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 24px", maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>
              If it looks right, a quick call is all it takes to get it live under your own name and get the
              lead-response side set up too.
            </p>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="ap-link-btn"
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
