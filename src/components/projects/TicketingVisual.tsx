import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const STAGES = ['USER', 'AUTH', 'EVENT', 'SEAT', 'RESERVATION', 'PAYMENT']
const ROWS = ['A', 'B', 'C', 'D', 'E']
const COLS = 8
const HELD = new Set(['B3', 'B4', 'C5', 'D2'])

/**
 * Project 02 — the pipeline plus the thing that actually makes ticketing
 * hard: a seat map where holds are exclusive and expiring.
 */
export function TicketingVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion()
  const run = active && !reduce

  // Live TTL readout — a held seat is a lease, not a purchase
  const [secs, setSecs] = useState(299)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 299 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [reduce])
  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')

  return (
    <svg viewBox="0 0 560 320" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="tk-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C6CFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7C6CFF" stopOpacity="0.06" />
        </linearGradient>
        <filter id="tk-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* ── Pipeline ───────────────────────────────────── */}
      <text x="14" y="18" className="label-mono" fill="#4C5768">
        REQUEST FLOW
      </text>
      <line x1="52" y1="34" x2="52" y2="292" stroke="url(#tk-line)" strokeWidth="1.4" />

      {run && (
        <motion.circle
          r="3.5"
          fill="#A99BFF"
          filter="url(#tk-glow)"
          animate={{ cy: [36, 290] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
          cx="52"
        />
      )}

      {STAGES.map((s, i) => {
        const y = 38 + i * 50
        return (
          <g key={s}>
            <motion.circle
              cx="52"
              cy={y}
              r="4.5"
              stroke="#7C6CFF"
              strokeWidth="1.3"
              fill="#0B1017"
              animate={run ? { fill: ['#0B1017', '#7C6CFF', '#0B1017'] } : {}}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: i * (2.6 / 6),
                ease: 'easeInOut',
              }}
            />
            <text
              x="70"
              y={y + 3.5}
              className="font-mono"
              fontSize="11.5"
              letterSpacing="0.14em"
              fill={i === 4 ? '#A99BFF' : '#7D8899'}
            >
              {s}
            </text>
            <motion.line
              x1="196"
              y1={y}
              x2="214"
              y2={y}
              stroke="rgba(150,140,255,0.2)"
              strokeWidth="1"
              strokeDasharray="2 3"
              animate={run ? { x2: [196, 216, 196], opacity: [0, 0.9, 0] } : {}}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: i * (2.6 / 6),
                ease: 'easeInOut',
              }}
            />
          </g>
        )
      })}

      {/* ── Seat map ───────────────────────────────────── */}
      <text x="228" y="18" className="label-mono" fill="#4C5768">
        SEAT INVENTORY
      </text>
      <path
        d="M 248 32 Q 400 12 552 32"
        fill="none"
        stroke="rgba(124,108,255,0.28)"
        strokeWidth="1.2"
        strokeDasharray="4 4"
      />
      <text x="400" y="30" textAnchor="middle" className="font-mono" fontSize="9.5" fill="#4C5768">
        STAGE
      </text>

      {ROWS.map((row, ri) =>
        Array.from({ length: COLS }, (_, ci) => {
          const id = `${row}${ci + 1}`
          const held = HELD.has(id)
          const x = 244 + ci * 38
          const y = 56 + ri * 42
          return (
            <motion.g
              key={id}
              initial={false}
              animate={held && run ? { opacity: [1, 0.45, 1] } : { opacity: held ? 0.55 : 0.28 }}
              transition={
                held && run
                  ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.5 }
              }
            >
              <rect
                x={x}
                y={y}
                width="26"
                height="20"
                rx="5"
                fill={held ? 'rgba(124,108,255,0.18)' : 'rgba(255,255,255,0.03)'}
                stroke={held ? 'rgba(169,155,255,0.6)' : 'rgba(255,255,255,0.12)'}
              />
              {held && <circle cx={x + 13} cy={y + 10} r="2.4" fill="#A99BFF" />}
            </motion.g>
          )
        }),
      )}

      {/* TTL readout */}
      <g>
        <rect
          x="228"
          y="272"
          width="304"
          height="30"
          rx="9"
          fill="rgba(255,255,255,0.025)"
          stroke="rgba(255,255,255,0.07)"
        />
        <text
          x="242"
          y="291"
          className="font-mono"
          fontSize="9.5"
          fill="#4C5768"
          letterSpacing="0.1em"
        >
          HOLD LEASE TTL
        </text>
        <text
          x="518"
          y="291"
          textAnchor="end"
          className="font-mono"
          fontSize="12.5"
          fill="#5FE3C0"
          letterSpacing="0.08em"
        >
          00:{mm}:{ss}
        </text>
      </g>
    </svg>
  )
}