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

export default function AllsetMovingPage() {
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
        .am-h1, .am-h2, .am-h3 { font-family: var(--font-display, ui-sans-serif), -apple-system, sans-serif; }
        .am-glass {
          background: rgba(124,77,255,0.05);
          border: 1px solid rgba(124,77,255,0.18);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .am-link-btn:hover { background: #8f63ff !important; }
        @media (max-width: 680px) {
          .am-compare, .am-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(28px,6vw,64px) clamp(20px,5vw,40px) 80px" }}>

        {/* Brandline */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 44, flexWrap: "wrap", gap: 8 }}>
          <span className="am-h3" style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.02em" }}>
            DRIVN<span style={{ color: "#b79cff" }}>.AI</span>
          </span>
          <span style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Prepared for Allset Moving Company
          </span>
        </div>

        {/* Hero */}
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b79cff", display: "inline-block", animation: "pulseDot 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700 }}>
                Faster Quoting &middot; Automatic Lead Response
              </span>
            </div>
            <h1 className="am-h1" style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.015em", margin: "0 0 20px" }}>
              One person handling every lead is one person you can&rsquo;t afford to lose a request to.
            </h1>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, color: "rgba(255,255,255,0.68)", maxWidth: "58ch", margin: 0 }}>
              Following up on our call — this isn&rsquo;t about your website. It&rsquo;s about how fast a
              quote request turns into a booked job, and how many of those requests are slipping away right
              now before anyone even calls back. No pricing on this page on purpose — that comes after a
              short call.
            </p>
          </div>
        </Reveal>

        {/* Stat callout */}
        <Reveal delay={60}>
          <div className="am-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 60 }}>
            <div className="am-glass" style={{ padding: "20px 22px" }}>
              <div className="am-h2" style={{ fontSize: 32, fontWeight: 800, color: "#f0eef7" }}>Up to 40%</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginTop: 4, lineHeight: 1.5 }}>
                more jobs booked, on autopilot — purely from responding before the other guy does.
              </div>
            </div>
            <div className="am-glass" style={{ padding: "20px 22px" }}>
              <div className="am-h2" style={{ fontSize: 32, fontWeight: 800, color: "#f0eef7" }}>Pre-Qualified</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginTop: 4, lineHeight: 1.5 }}>
                leads land in your inbox already priced and detailed — ready to book, not ready to be chased.
              </div>
            </div>
          </div>
        </Reveal>

        {/* Today vs After */}
        <Reveal delay={100}>
          <div className="am-compare" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 60 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                Today
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "A quote request comes in, then waits on a callback before it even gets a price",
                  "No way to tell which leads are worth chasing until someone manually works the details",
                  "If the one person handling leads is out or slammed, requests just sit",
                  "Whoever answers first books the job — even when it's not you",
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.55)" }}>
                    <CrossIcon />
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="am-glass" style={{ padding: "22px 22px 24px" }}>
              <div style={{ fontSize: 11.5, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "#b79cff", marginBottom: 16 }}>
                After This Build
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[
                  "Every request gets an instant, automatic response — day or night, no exceptions",
                  "Pricing and key details are captured before your team even picks up the phone",
                  "Leads land already pre-qualified — ready to book, not ready to be chased down",
                  "Booking speed stops depending on one person being at their desk",
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

        {/* How it works — animated flow */}
        <div style={{ marginBottom: 60 }}>
          <Reveal>
            <h2 className="am-h3" style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>How this actually works</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 32px", maxWidth: "54ch" }}>
              Nothing about how a customer requests a quote changes. This runs automatically behind the
              scenes, turning every request into a pre-qualified, ready-to-book lead.
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
              { t: "Request comes in — anytime", d: "From your existing form or an email inquiry. Doesn't matter if it's midnight or if the lead person's out on a job." },
              { t: "Instant response goes out automatically", d: "Confirms it was received inside a minute or two — on autopilot, not whenever someone's next free." },
              { t: "Details get collected and the lead gets qualified", d: "Move date, size, origin/destination — captured automatically, so you know what you're looking at before you call." },
              { t: "A real price range appears on screen", d: "Calculated from those details, so they're not sitting there guessing while they check other movers." },
              { t: "Your team steps in on an already-warm lead", d: "Exactly like today, minus the chasing — every request gets this, whether or not one specific person is free right then." },
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
                    <h3 className="am-h3" style={{ fontSize: 15.5, fontWeight: 700, margin: "0 0 4px" }}>{step.t}</h3>
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
              A 5.0 rating is a 5.0 rating — but every job that slips to a faster competitor is one less
              chance to earn the next one. This closes that gap on autopilot, without adding anything to
              anyone&rsquo;s plate.
            </p>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="am-glass" style={{ padding: "clamp(24px,4vw,36px)", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b79cff", fontWeight: 700, marginBottom: 10 }}>
              Next Step
            </div>
            <h2 className="am-h2" style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, margin: "0 0 10px" }}>
              20 minutes to run the numbers — no pitch, just what it&rsquo;d actually book you.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "0 0 24px", maxWidth: "44ch", marginLeft: "auto", marginRight: "auto" }}>
              We&rsquo;ll walk through your actual lead volume and response time so anything proposed after
              this is sized to real numbers, not a guess.
            </p>
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="am-link-btn"
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
