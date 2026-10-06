import { motion, useReducedMotion } from 'motion/react'

const ROADS: { d: string; w: number; fast: number }[] = [
  { d: 'M 20 288 Q 140 250 250 214 T 520 176', w: 5, fast: 11 },
  { d: 'M 96 20 Q 130 130 206 210 T 300 320', w: 4, fast: 14 },
  { d: 'M 20 96 Q 180 60 330 96 T 520 64', w: 3, fast: 9 },
  { d: 'M 420 20 Q 396 140 344 208 T 300 320', w: 3, fast: 12 },
]

const HAZARDS = [
  { x: 250, y: 214, level: 'HIGH' },
  { x: 344, y: 208, level: 'MED' },
  { x: 130, y: 130, level: 'LOW' },
]

/**
 * Project 04 — roads as data. Traces stream along the network, hazards pulse
 * at their real coordinates, and a viewport radar sweeps the query surface.
 */
export function RoadGuardVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion()
  const run = active && !reduce

  return (
    <svg viewBox="0 0 560 340" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="rg-radar" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7C6CFF" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#7C6CFF" stopOpacity="0" />
        </radialGradient>
        <filter id="rg-glow">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>

      {/* Spatial grid */}
      <g opacity="0.5">
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={i * 78}
            y1="0"
            x2={i * 78}
            y2="340"
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={`v${i}`}
            x1="0"
            y1={i * 78}
            x2="560"
            y2={i * 78}
            stroke="rgba(255,255,255,0.045)"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Viewport radar */}
      <circle cx="280" cy="170" r="150" fill="url(#rg-radar)" opacity={run ? 0.9 : 0.5} />
      {run && (
        <motion.circle
          cx="280"
          cy="170"
          fill="none"
          stroke="rgba(169,155,255,0.4)"
          strokeWidth="1"
          r="150"
          initial={{ opacity: 0.55, scale: 0.72 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
          style={{ transformOrigin: '280px 170px' }}
        />
      )}

      {/* Roads (casing + surface) */}
      {ROADS.map((r, i) => (
        <g key={i}>
          <path
            d={r.d}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={r.w + 4}
            strokeLinecap="round"
          />
          <path
            d={r.d}
            fill="none"
            stroke="rgba(124,108,255,0.16)"
            strokeWidth={r.w}
            strokeLinecap="round"
          />
          {run && (
            <motion.path
              d={r.d}
              fill="none"
              stroke="#A99BFF"
              strokeWidth={r.w * 0.5}
              strokeLinecap="round"
              strokeDasharray="14 46"
              animate={{ strokeDashoffset: [0, -60 * (r.fast / 10)] }}
              transition={{ duration: r.fast / 3, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </g>
      ))}

      {/* Hazards */}
      {HAZARDS.map((h, i) => {
        const tone = h.level === 'HIGH' ? '#5FE3C0' : h.level === 'MED' ? '#A99BFF' : '#7D8899'
        return (
          <g key={i}>
            {run && (
              <motion.circle
                cx={h.x}
                cy={h.y}
                r="6"
                fill="none"
                stroke={tone}
                strokeWidth="1.2"
                animate={{ r: [6, 26], opacity: [0.7, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.85, ease: 'easeOut' }}
              />
            )}
            <circle cx={h.x} cy={h.y} r="7" fill="#05070A" stroke={tone} strokeWidth="1.3" />
            <text
              x={h.x}
              y={h.y + 3.5}
              textAnchor="middle"
              className="font-mono"
              fontSize="10"
              fill={tone}
            >
              !
            </text>
            <text
              x={h.x + 13}
              y={h.y - 8}
              className="font-mono"
              fontSize="9"
              letterSpacing="0.1em"
              fill="#4C5768"
            >
              {h.level}
            </text>
          </g>
        )
      })}

      {/* Telemetry strip */}
      <g>
        <text
          x="14"
          y="326"
          className="font-mono"
          fontSize="10"
          fill="#4C5768"
          letterSpacing="0.1em"
        >
          POSTGIS · REDIS GEO · KAFKA
        </text>
        <text
          x="546"
          y="326"
          textAnchor="end"
          className="font-mono"
          fontSize="10"
          fill={run ? '#5FE3C0' : '#4C5768'}
          letterSpacing="0.1em"
        >
          {run ? 'STREAMING · 2.4k evt/s' : 'IDLE'}
        </text>
      </g>
    </svg>
  )
}