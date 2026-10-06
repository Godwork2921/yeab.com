import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { labLinks, labTopics } from '../data/lab'
import { SectionHead } from './ui/Section'
import { Reveal } from './fx/Reveal'
import { useIsMobile } from '../lib/hooks'
import { EASE_EXPO } from '../lib/motion'
import { cn } from '../lib/utils'

const W = 620
const H = 470

/**
 * Research board — active explorations as a live graph. Not a checklist:
 * nodes drift, edges connect topics that inform each other, and each carries
 * a real progress ring.
 */
export function Lab() {
  const reduce = useReducedMotion()
  const mobile = useIsMobile()
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)

  const focus = hover ?? selected
  const focusNote = labTopics.find((t) => t.id === focus)

  const node = (id: string) => labTopics.find((t) => t.id === id)!
  const neighbours = (id: string | null) =>
    id ? labLinks.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a)) : []

  return (
    <section id="lab" className="relative overflow-x-clip py-24 md:py-32">
      <div className="shell">
        <SectionHead
          index="06"
          eyebrow="Lab"
          title="Current explorations"
          lede="What I'm actively reading, building, or trying to understand — the research bench rather than the finished product."
        />

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-14">
          {/* Board — hidden below md, where it would be illegible.
              The track list becomes the full-width primary layout there. */}
          <div className="hidden md:col-span-7 md:block">
            <Reveal>
              <div className="relative overflow-hidden rounded-[calc(var(--radius-panel)+0.25rem)] border border-bg-line bg-bg-raise/30">
                <div className="flex items-center justify-between border-b border-bg-line/70 px-4 py-3">
                  <span className="label-mono text-faint">RESEARCH BOARD · LIVE</span>
                  <span className="label-mono text-faint tabular-nums">
                    {labTopics.length} TRACKS
                  </span>
                </div>

                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
                  <defs>
                    <radialGradient id="lab-node" cx="0.5" cy="0.35" r="0.65">
                      <stop offset="0%" stopColor="#7C6CFF" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#7C6CFF" stopOpacity="0.04" />
                    </radialGradient>
                    <filter id="lab-glow">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                  </defs>

                  {/* Substrate grid */}
                  <g opacity="0.6">
                    {Array.from({ length: 9 }, (_, i) => (
                      <line
                        key={`gx${i}`}
                        x1={i * 77.5}
                        y1="0"
                        x2={i * 77.5}
                        y2={H}
                        stroke="rgba(255,255,255,0.04)"
                      />
                    ))}
                    {Array.from({ length: 7 }, (_, i) => (
                      <line
                        key={`gy${i}`}
                        x1="0"
                        y1={i * 78}
                        x2={W}
                        y2={i * 78}
                        stroke="rgba(255,255,255,0.04)"
                      />
                    ))}
                  </g>

                  {/* Edges */}
                  {labLinks.map(([a, b]) => {
                    const na = node(a)
                    const nb = node(b)
                    const lit = focus !== null && (a === focus || b === focus)
                    const dim = focus !== null && !lit
                    return (
                      <motion.line
                        key={`${a}-${b}`}
                        x1={na.x * W}
                        y1={na.y * H}
                        x2={nb.x * W}
                        y2={nb.y * H}
                        stroke="rgba(150,140,255,0.28)"
                        strokeWidth={lit ? 1.8 : 1}
                        animate={{ opacity: dim ? 0.12 : lit ? 0.95 : 0.4 }}
                        transition={{ duration: 0.5 }}
                      />
                    )
                  })}

                  {/* Nodes */}
                  {labTopics.map((t, i) => {
                    const cx = t.x * W
                    const cy = t.y * H
                    const lit = focus === t.id
                    const near = focus !== null && neighbours(focus).includes(t.id)
                    const dim = focus !== null && !lit && !near
                    const r = 17
                    const circ = 2 * Math.PI * r

                    return (
                      <motion.g
                        key={t.id}
                        className="cursor-pointer"
                        onPointerEnter={() => !mobile && setHover(t.id)}
                        onPointerLeave={() => !mobile && setHover(null)}
                        onClick={() => setSelected((s) => (s === t.id ? null : t.id))}
                        onFocus={() => setHover(t.id)}
                        animate={
                          reduce
                            ? {}
                            : {
                                x: [0, i % 2 === 0 ? 6 : -6, 0],
                                y: [0, i % 3 === 0 ? -7 : 5, 0],
                              }
                        }
                        transition={{
                          duration: 9 + i * 1.3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        {/* Halo */}
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r="38"
                          fill={lit ? 'url(#lab-node)' : 'transparent'}
                          animate={{ opacity: lit ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        />

                        {/* Progress ring */}
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill="#0B1017"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="2"
                          animate={{ opacity: dim ? 0.25 : 1 }}
                        />
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill="none"
                          stroke={lit ? '#A99BFF' : '#7C6CFF'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          animate={{
                            strokeDashoffset: circ * (1 - t.progress / 100),
                            opacity: dim ? 0.2 : 0.9,
                          }}
                          transition={{ duration: 1.2, ease: EASE_EXPO, delay: i * 0.06 }}
                          transform={`rotate(-90 ${cx} ${cy})`}
                        />

                        {/* Core */}
                        <motion.circle
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill="#F2F5F9"
                          animate={{ opacity: dim ? 0.3 : 1 }}
                        />
                        {lit && (
                          <circle cx={cx} cy={cy} r="4" fill="#A99BFF" filter="url(#lab-glow)" />
                        )}

                        <text
                          x={cx}
                          y={cy + r + 18}
                          textAnchor="middle"
                          className="font-mono"
                          fontSize="11"
                          letterSpacing="0.12em"
                          fill={lit ? '#F2F5F9' : '#7D8899'}
                          style={{ textTransform: 'uppercase', opacity: dim ? 0.3 : 1 }}
                        >
                          {t.label.toUpperCase()}
                        </text>
                      </motion.g>
                    )
                  })}
                </svg>

                {/* Readout strip */}
                <div className="border-t border-bg-line/70 px-4 py-3">
                  <AnimateReadout topic={focusNote} />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Track list */}
          <div className="md:col-span-5">
            <ul className="flex flex-col">
              {labTopics.map((t, i) => {
                const on = focus === t.id
                return (
                  <Reveal key={t.id} delay={i * 0.04} as="li">
                    <button
                      type="button"
                      onClick={() => setSelected((s) => (s === t.id ? null : t.id))}
                      onPointerEnter={() => !mobile && setHover(t.id)}
                      onPointerLeave={() => !mobile && setHover(null)}
                      className={cn(
                        'group w-full cursor-pointer border-t border-bg-line/60 py-4 text-left transition-colors duration-500 last:border-b',
                        on ? 'text-ink' : 'text-muted',
                      )}
                      style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-[1.0625rem] font-medium">{t.label}</span>
                        <span className="label-mono text-faint tabular-nums">{t.progress}%</span>
                      </div>

                      <div className="mt-2.5 h-px w-full overflow-hidden bg-bg-line">
                        <motion.div
                          className="h-full origin-left bg-accent"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: t.progress / 100 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.3,
                            ease: EASE_EXPO,
                            delay: 0.1 + i * 0.05,
                          }}
                        />
                      </div>

                      <motion.p
                        className="overflow-hidden text-[0.875rem] leading-relaxed text-muted"
                        animate={{ opacity: on ? 1 : 0.55, maxHeight: on ? 90 : 34 }}
                        transition={{ duration: 0.6, ease: EASE_EXPO }}
                      >
                        {t.note}
                      </motion.p>

                      <span className="label-mono mt-2.5 inline-block text-faint">{t.status}</span>
                    </button>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimateReadout({ topic }: { topic?: (typeof labTopics)[number] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <span className="label-mono text-accent">
        {topic ? `FOCUS // ${topic.label.toUpperCase()}` : 'AWAITING SELECTION'}
      </span>
      <span className="label-mono text-faint tabular-nums">
        {topic ? topic.status.toUpperCase() : `${labTopics.length} TRACKS ONLINE`}
      </span>
    </div>
  )
}