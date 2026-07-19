import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "#08091a",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Purple glow blob — top left (no blur, Satori doesn't support filter) */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "580px",
            height: "480px",
            borderRadius: "50%",
            background: "rgba(139,92,246,0.18)",
          }}
        />
        {/* Softer inner glow */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            left: "-20px",
            width: "340px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(139,92,246,0.12)",
          }}
        />

        {/* TOP — brand pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "999px",
            border: "1px solid rgba(139,92,246,0.35)",
            background: "rgba(139,92,246,0.10)",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#a78bfa",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "rgba(167,139,250,0.9)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            AI Growth Partner for Service Businesses
          </span>
        </div>

        {/* CENTRE — wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span
              style={{
                fontSize: "100px",
                fontWeight: "700",
                color: "#ffffff",
                letterSpacing: "-4px",
                lineHeight: 1,
                fontFamily: "sans-serif",
              }}
            >
              Drivn
            </span>
            <span
              style={{
                fontSize: "100px",
                fontWeight: "700",
                color: "#a78bfa",
                letterSpacing: "-4px",
                lineHeight: 1,
                fontFamily: "sans-serif",
              }}
            >
              .ai
            </span>
          </div>

          {/* Tagline */}
          <span
            style={{
              fontSize: "26px",
              fontWeight: "400",
              color: "rgba(239,240,243,0.60)",
              lineHeight: 1.45,
              maxWidth: "650px",
              fontFamily: "sans-serif",
            }}
          >
            Capture more leads. Respond in under 60 seconds.
            Book more jobs. Automate the rest.
          </span>
        </div>

        {/* BOTTOM — domain + stat pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "rgba(239,240,243,0.28)",
              fontFamily: "sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            drivn-ai-website.vercel.app
          </span>

          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { value: "< 60s", label: "Response" },
              { value: "3.2×", label: "More leads" },
              { value: "4.8★", label: "Avg rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  gap: "3px",
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#a78bfa",
                    fontFamily: "sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "rgba(239,240,243,0.38)",
                    fontFamily: "sans-serif",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
