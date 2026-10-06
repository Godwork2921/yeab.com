import { motion, useReducedMotion } from 'motion/react'

/**
 * Risk ramp. Rose is the only non-brand hue in the whole portfolio and it is
 * here on purpose — a threat gauge with no red in it is dishonest UI.
 */
const SAFE = '#5FE3C0'
const REVIEW = '#A99BFF'
const THREAT = '#FF7A90'

const SIGNALS = [
  { y: 92, label: '01 · MESSAGE', d: 'M 140 92 Q 200 92 244 156' },
  { y: 170, label: '02 · URL', d: 'M 140 170 L 244 170' },
  { y: 248, label: '03 · DEEPFAKE', d: 'M 140 248 Q 200 248 244 184' },
]

const SCORE = 87
const SWEEP = (SCORE / 100) * 180

/**
 * Project 05 — signals in, one verdict out. Four categories of untrusted input
 * converge on an analysis core, and the gauge reduces the whole thing to a
 * number a non-technical person can act on without reading a dashboard.
 */
export function SecurityVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion()
  const run = active && !reduce

  return (
    <svg viewBox="0 0 560 340" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="na-core" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7C6CFF" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#7C6CFF" stopOpacity="0" />
        </radialGradient>
        <filter id="na-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* ---- Inputs ---------------------------------------------------- */}
      {SIGNALS.map((s, i) => (
        <g key={s.label}>
          <rect
            x="14"
            y={s.y - 14}
            width="126"
            height="28"
            rx="7"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <text
            x="26"
            y={s.y + 3.5}
            className="font-mono"
            fontSize="10"
            letterSpacing="0.06em"
            fill={run ? '#9AA5B4' : '#4C5768'}
          >
            {s.label}
          </text>

          <path d={s.d} fill="none" stroke="rgba(124,108,255,0.18)" strokeWidth="1.2" />
          {run && (
            <motion.path
              d={s.d}
              fill="none"
              stroke="#A99BFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 16"
              animate={{ strokeDashoffset: [0, -38] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.35,
                ease: 'linear',
              }}
            />
          )}
        </g>
      ))}

      {/* ---- Analysis core --------------------------------------------- */}
      <circle cx="280" cy="170" r="70" fill="url(#na-core)" opacity={run ? 1 : 0.5} />

      <circle cx="280" cy="170" r="36" fill="none" stroke="rgba(124,108,255,0.22)" strokeWidth="1" />
      <circle cx="280" cy="170" r="26" fill="#05070A" stroke="rgba(169,155,255,0.45)" strokeWidth="1.2" />

      {run && (
        <>
          <motion.g
            style={{ transformOrigin: '280px 170px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              cx="280"
              cy="170"
              r="46"
              fill="none"
              stroke="#A99BFF"
              strokeWidth="1"
              strokeDasharray="2 12"
              opacity="0.5"
            />
          </motion.g>
          {/* scan sweep across the core */}
          <motion.rect
            x="252"
            width="56"
            height="2"
            fill="#A99BFF"
            opacity="0.7"
            initial={{ y: 140 }}
            animate={{ y: [140, 200, 140] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* shield glyph */}
      <path
        d="M 280 154 L 294 159.5 V 171 C 294 180.5 287.5 187 280 190 C 272.5 187 266 180.5 266 171 V 159.5 Z"
        fill="rgba(124,108,255,0.16)"
        stroke="#A99BFF"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M 275 171.5 L 279 175.5 L 286 167.5"
        fill="none"
        stroke={run ? THREAT : '#6E7686'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <text
        x="280"
        y="118"
        textAnchor="middle"
        className="font-mono"
        fontSize="8.5"
        letterSpacing="0.16em"
        fill="#4C5768"
      >
        ANALYSIS CORE
      </text>

      {/* ---- Core -> gauge --------------------------------------------- */}
      <path d="M 326 170 L 398 170" fill="none" stroke="rgba(124,108,255,0.22)" strokeWidth="1.2" />
      {run && (
        <motion.path
          d="M 326 170 L 398 170"
          fill="none"
          stroke="#A99BFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 14"
          animate={{ strokeDashoffset: [0, -36] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* ---- Risk gauge ------------------------------------------------- */}
      <g>
        {/* zone track */}
        <path d="M 416 210 A 54 54 0 0 1 442.5 163.5" fill="none" stroke={SAFE} strokeOpacity="0.32" strokeWidth="7" strokeLinecap="round" />
        <path d="M 442.5 163.5 A 54 54 0 0 1 496.1 162.7" fill="none" stroke={REVIEW} strokeOpacity="0.32" strokeWidth="7" strokeLinecap="round" />
        <path d="M 496.1 162.7 A 54 54 0 0 1 524 210" fill="none" stroke={THREAT} strokeOpacity="0.32" strokeWidth="7" strokeLinecap="round" />

        {/* live zone up to the current score */}
        {run && (
          <>
            <path d="M 416 210 A 54 54 0 0 1 442.5 163.5" fill="none" stroke={SAFE} strokeWidth="7" strokeLinecap="round" />
            <path d="M 442.5 163.5 A 54 54 0 0 1 496.1 162.7" fill="none" stroke={REVIEW} strokeWidth="7" strokeLinecap="round" />
          </>
        )}
        {/* the reached zone, always lit — this is the finding */}
        <path
          d="M 496.1 162.7 A 54 54 0 0 1 524 210"
          fill="none"
          stroke={THREAT}
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#na-glow)"
          opacity="0.85"
        />

        {/* needle — drawn pointing left, rotated to the score */}
        <motion.g
          style={{ transformOrigin: '470px 210px' }}
          initial={false}
          animate={{ rotate: run ? [0, SWEEP, SWEEP] : SWEEP }}
          transition={{ duration: 3.4, times: [0, 0.55, 1], repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }}
        >
          <line x1="470" y1="210" x2="418" y2="210" stroke="#E7EAF0" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        <circle cx="470" cy="210" r="4.5" fill="#05070A" stroke="#E7EAF0" strokeWidth="1.4" />

        {/* reading */}
        <text
          x="470"
          y="258"
          textAnchor="middle"
          className="font-mono"
          fontSize="27"
          fill={run ? THREAT : '#7D8899'}
        >
          {SCORE}
        </text>
        <text x="470" y="280" textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="0.2em" fill="#4C5768">
          RISK · THREAT
        </text>
      </g>

      {/* ---- Telemetry --------------------------------------------------- */}
      <g>
        <text x="14" y="326" className="font-mono" fontSize="10" fill="#4C5768" letterSpacing="0.1em">
          MODELS · THREAT INTEL · SANDBOX
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
          {run ? 'SCANNING · 1.2k/s' : 'IDLE'}
        </text>
      </g>
    </svg>
  )
}
