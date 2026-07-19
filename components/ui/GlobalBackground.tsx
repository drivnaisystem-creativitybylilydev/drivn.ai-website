// Organic, crossing sweeps — modeled on the brand logo's background art (a handful of
// wandering curves that cross each other, not neat parallel diagonal lines). Varied
// amplitude/curvature per path is what reads as "chaotic" rather than a uniform fan.
const PATHS = [
  "M -150,120 C 250,-80 500,420 900,180 C 1250,-30 1500,300 1750,80",
  "M 1700,-100 C 1300,250 1500,600 1050,700 C 650,790 750,1150 300,1200",
  "M -100,1000 C 300,850 250,1350 700,1300 C 1100,1260 1050,1650 1500,1550",
  "M 1750,1300 C 1350,1500 1450,1050 1000,1150 C 600,1240 550,850 150,950",
  "M -150,2000 C 300,1850 200,2350 650,2250 C 1050,2160 1150,2500 1600,2400",
];

// Decorative, non-interactive — purely visual, no meaningful content for a11y tree.
export function GlobalBackground() {
  return (
    <div className="global-bg" aria-hidden>
      <div className="global-bg-blob global-bg-blob-a" />
      <div className="global-bg-blob global-bg-blob-b" />

      <div className="global-bg-lines">
        <svg viewBox="0 0 1600 2400" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
          <defs>
            <filter id="globalLineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {PATHS.map((d, i) => (
            <path
              key={`glow-${i}`}
              d={d}
              fill="none"
              stroke="oklch(58% 0.23 296)"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.16}
              filter="url(#globalLineGlow)"
            />
          ))}
          {PATHS.map((d, i) => (
            <path
              key={`core-${i}`}
              d={d}
              fill="none"
              stroke="oklch(85% 0.09 296)"
              strokeWidth={0.9}
              strokeLinecap="round"
              opacity={0.22}
            />
          ))}
        </svg>
      </div>

      <div className="global-bg-fade" />
    </div>
  );
}
