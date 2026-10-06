import { motion, useReducedMotion } from 'motion/react'

const AM = ['selam', 'endegn', 'yemisir', 'hofa', 'degn']
const EN = ['hello', 'peace', 'how are you', 'bread', 'red']

/**
 * Project 01 — the semantic transformation made literal.
 * Amharic tokens converge into a Transformer core, English tokens emerge.
 * Only runs when the card is hovered or in view.
 */
export function TranslationVisual({ active }: { active: boolean }) {
  const reduce = useReducedMotion()
  const run = active && !reduce
  const cycle = run ? { repeat: Infinity, repeatDelay: 1.1 } : { duration: 0.5 }

  return (
    <svg viewBox="0 0 520 300" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="mt-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C6CFF" stopOpacity="0.34" />
          <stop offset="50%" stopColor="#A99BFF" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#5FE3C0" stopOpacity="0.28" />
        </linearGradient>
        <filter id="mt-blur">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Column labels */}
      <text x="18" y="20" className="label-mono" fill="#4C5768">
        SOURCE · AM
      </text>
      <text x="382" y="20" className="label-mono" fill="#4C5768">
        TARGET · EN
      </text>

      {/* Source tokens */}
      {AM.map((t, i) => (
        <motion.g
          key={t}
          initial={false}
          animate={
            run
              ? { x: [0, 128, 128], opacity: [0, 1, 0], scale: [0.92, 1, 0.92] }
              : { x: 0, opacity: 0.42, scale: 1 }
          }
          transition={{ duration: 1.5, delay: run ? i * 0.26 : 0, ...cycle, ease: 'easeInOut' }}
        >
          <rect
            x="18"
            y={44 + i * 47}
            width="104"
            height="26"
            rx="13"
            fill="rgba(124,108,255,0.07)"
            stroke="rgba(124,108,255,0.28)"
          />
          <text
            x="70"
            y={61 + i * 47}
            textAnchor="middle"
            className="font-mono"
            fontSize="12"
            letterSpacing="0.06em"
            fill="#B6C0CF"
          >
            {t}
          </text>
        </motion.g>
      ))}

      {/* Travel path */}
      <path
        d="M 136 150 Q 190 150 208 150"
        fill="none"
        stroke="rgba(150,140,255,0.35)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {/* Model core */}
      <g>
        <rect
          x="208"
          y="96"
          width="106"
          height="108"
          rx="18"
          fill="url(#mt-core)"
          stroke="rgba(169,155,255,0.5)"
          strokeWidth="1.2"
        />
        {run && (
          <motion.rect
            x="209"
            width="104"
            height="34"
            rx="16"
            fill="rgba(169,155,255,0.16)"
            animate={{ y: [98, 168] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <motion.circle
          cx="261"
          cy="150"
          r="22"
          fill="rgba(169,155,255,0.2)"
          animate={run ? { r: [18, 25, 18], opacity: [0.5, 0.15, 0.5] } : {}}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <text
          x="261"
          y="146"
          textAnchor="middle"
          className="font-mono"
          fontSize="11"
          letterSpacing="0.14em"
          fill="#F2F5F9"
        >
          TRANS
        </text>
        <text
          x="261"
          y="160"
          textAnchor="middle"
          className="font-mono"
          fontSize="11"
          letterSpacing="0.14em"
          fill="#A99BFF"
        >
          FORMER
        </text>
        <text x="261" y="82" textAnchor="middle" className="label-mono" fill="#4C5768">
          EMBEDDING SPACE
        </text>
      </g>

      {/* Target tokens */}
      {EN.map((t, i) => (
        <motion.g
          key={t}
          initial={false}
          animate={
            run
              ? { x: [128, 128, 0], opacity: [0, 0, 1], scale: [0.92, 0.92, 1] }
              : { x: 0, opacity: 0.42, scale: 1 }
          }
          transition={{ duration: 1.4, delay: run ? 1.75 + i * 0.24 : 0, ...cycle, ease: 'easeInOut' }}
        >
          <rect
            x="314"
            y={44 + i * 47}
            width={150}
            height="26"
            rx="13"
            fill="rgba(95,227,192,0.06)"
            stroke="rgba(95,227,192,0.26)"
          />
          <text
            x="389"
            y={61 + i * 47}
            textAnchor="middle"
            className="font-mono"
            fontSize="12"
            letterSpacing="0.06em"
            fill="#B6C0CF"
          >
            {t}
          </text>
        </motion.g>
      ))}

      {/* Attention cone between target tokens */}
      <motion.path
        d="M 320 150 L 472 44 L 472 256 Z"
        fill="rgba(95,227,192,0.045)"
        animate={run ? { opacity: [0.2, 0.7, 0.2] } : { opacity: 0.3 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="330" cy="240" r="3" fill="#5FE3C0" opacity="0.7" filter="url(#mt-blur)" />
    </svg>
  )
}