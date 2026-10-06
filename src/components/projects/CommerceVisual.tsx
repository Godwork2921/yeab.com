import { motion, useReducedMotion } from 'motion/react'

const CHIPS = [
  { label: 'SPRING BOOT', x: 34, y: 44, w: 92 },
  { label: 'DIGITAL PAYMENTS', x: 372, y: 62, w: 128 },
  { label: 'ETHIOPIAN FASHION', x: 26, y: 258, w: 132 },
  { label: 'PRODUCT DISCOVERY', x: 366, y: 246, w: 126 },
]

/**
 * Project 03 — commerce as a product. A phone storefront with orbiting
 * capability chips; richer treatment because this one is a product, not a
 * distributed system.
 */
export function CommerceVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion()
  const run = active && !reduce

  return (
    <svg viewBox="0 0 540 340" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="hm-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5FE3C0" stopOpacity="0" />
          <stop offset="50%" stopColor="#5FE3C0" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5FE3C0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hm-hero" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5FE3C0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7C6CFF" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Connection threads to the phone */}
      {CHIPS.map((c) => (
        <motion.path
          key={c.label}
          d={`M ${c.x + c.w / 2} ${c.y + 12} Q 270 ${c.y + 60} 270 ${c.y > 150 ? 118 : 224}`}
          fill="none"
          stroke="rgba(95,227,192,0.16)"
          strokeWidth="1"
          strokeDasharray="2 4"
          animate={run ? { strokeDashoffset: [0, -48] } : {}}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Phone */}
      <motion.g
        animate={run ? { y: [0, -7, 0] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect
          x="196"
          y="42"
          width="148"
          height="258"
          rx="26"
          fill="#0B1017"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.4"
        />
        {/* notch */}
        <rect x="248" y="52" width="44" height="7" rx="3.5" fill="rgba(255,255,255,0.1)" />

        {/* hero banner */}
        <rect x="208" y="68" width="124" height="58" rx="12" fill="url(#hm-hero)" />
        <text
          x="220"
          y="88"
          className="font-mono"
          fontSize="9"
          fill="#5FE3C0"
          letterSpacing="0.16em"
        >
          NEW SEASON
        </text>
        <text
          x="220"
          y="108"
          className="font-display"
          fontSize="15"
          fontWeight="600"
          fill="#F2F5F9"
        >
          Hieemien
        </text>
        <rect x="220" y="114" width="46" height="5" rx="2.5" fill="rgba(255,255,255,0.16)" />

        {/* product rows */}
        {[
          { y: 140, on: true },
          { y: 184, on: false },
          { y: 228, on: false },
        ].map((p) => (
          <g key={p.y}>
            <rect
              x="208"
              y={p.y}
              width="124"
              height="36"
              rx="10"
              fill="rgba(255,255,255,0.028)"
              stroke="rgba(255,255,255,0.06)"
            />
            <rect x="214" y={p.y + 6} width="24" height="24" rx="7" fill="rgba(124,108,255,0.22)" />
            <rect
              x="244"
              y={p.y + 12}
              width={p.on ? 52 : 38}
              height="5"
              rx="2.5"
              fill="rgba(255,255,255,0.2)"
            />
            <rect x="244" y={p.y + 22} width="26" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
            <text
              x="326"
              y={p.y + 21}
              textAnchor="end"
              className="font-mono"
              fontSize="9.5"
              fill={p.on ? '#5FE3C0' : '#7D8899'}
            >
              {p.on ? 'ETB 2,400' : 'ETB 1,850'}
            </text>
            {p.on && run && (
              <motion.circle
                cx="318"
                cy={p.y + 12}
                r="2.5"
                fill="#5FE3C0"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </g>
        ))}

        {/* bottom nav */}
        <rect x="208" y="272" width="124" height="1" fill="rgba(255,255,255,0.08)" />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={232 + i * 26}
            y="281"
            width={i === 0 ? 16 : 10}
            height="5"
            rx="2.5"
            fill={i === 0 ? '#5FE3C0' : 'rgba(255,255,255,0.14)'}
          />
        ))}

        {/* sweep */}
        {run && (
          <motion.rect
            x="196"
            width="60"
            height="258"
            fill="url(#hm-sweep)"
            animate={{ x: [196, 284] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              repeatDelay: 2.4,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.g>

      {/* Capability chips */}
      {CHIPS.map((c, i) => (
        <g key={c.label}>
          <motion.rect
            x={c.x}
            y={c.y}
            width={c.w}
            height="24"
            rx="12"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.1)"
            animate={run ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.8 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
          <text
            x={c.x + c.w / 2}
            y={c.y + 15.5}
            textAnchor="middle"
            className="font-mono"
            fontSize="9.5"
            letterSpacing="0.12em"
            fill="#B6C0CF"
          >
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  )
}