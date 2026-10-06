import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { philosophy } from '../data/profile'
import { EASE_EXPO } from '../lib/motion'
import { cn } from '../lib/utils'

/**
 * Progressive, scroll-linked build: items commit in order as the section
 * passes through the viewport, rather than each firing independently.
 */
export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 72%', 'end 68%'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(philosophy.length - 1, Math.floor(v * philosophy.length * 1.06))
    setActive((prev) => (prev === idx ? prev : idx))
  })

  return (
    <section className="relative overflow-x-clip py-24 md:py-32">
      <div className="shell">
        <div ref={ref} className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Sticky title */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-32">
              <div className="flex items-center gap-4">
                <span className="label-mono text-accent">05</span>
                <span className="h-px flex-1 bg-linear-to-r from-bg-line to-transparent" />
                <span className="label-mono text-muted">Engineering philosophy</span>
              </div>

              <h2 className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold text-ink">
                How I build
              </h2>

              <p className="mt-5 max-w-[38ch] text-[1.0625rem] leading-relaxed text-muted">
                A working loop. Each step exists to make the next one cheaper —
                and to make the wrong answer expensive.
              </p>

              {/* Progress readout */}
              <div className="mt-10 hidden items-center gap-4 md:flex">
                <span className="label-mono w-6 text-faint tabular-nums">
                  {String(active + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 overflow-hidden bg-bg-line">
                  <motion.div
                    className="h-full origin-left bg-accent"
                    animate={{ scaleX: (active + 1) / philosophy.length }}
                    transition={{ duration: 0.7, ease: EASE_EXPO }}
                  />
                </div>
                <span className="label-mono w-6 text-faint tabular-nums">
                  {String(philosophy.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Sequential list */}
          <ol className="md:col-span-7">
            {philosophy.map((p, i) => {
              const done = i <= active
              const current = i === active
              return (
                <motion.li
                  key={p.index}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: 'blur(6px)' }}
                  whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.9, ease: EASE_EXPO }}
                  className="group relative border-t border-bg-line/70 py-7 last:border-b"
                >
                  <div className="flex items-start gap-5 md:gap-7">
                    {/* Number — outline when pending, solid when committed */}
                    <span
                      className={cn(
                        'shrink-0 font-display text-[2.5rem] leading-none font-semibold tabular-nums transition-all duration-700 md:text-[3.25rem]',
                        done ? 'text-accent' : 'text-transparent [-webkit-text-stroke:1px_#2A3646]',
                      )}
                      style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
                    >
                      {p.index}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={cn(
                          'text-[1.25rem] font-medium transition-colors duration-700 md:text-[1.5rem]',
                          done ? 'text-ink' : 'text-muted',
                        )}
                      >
                        {p.title}
                      </h3>
                      <motion.p
                        className="mt-2 max-w-[54ch] overflow-hidden text-[0.9375rem] leading-relaxed text-muted"
                        animate={{
                          opacity: done ? 1 : 0.35,
                          maxHeight: done ? 160 : 56,
                        }}
                        transition={{ duration: 0.8, ease: EASE_EXPO }}
                      >
                        {p.body}
                      </motion.p>
                    </div>
                  </div>

                  {/* Commit marker */}
                  <motion.span
                    aria-hidden
                    className="absolute top-0 left-0 h-px w-full origin-left bg-linear-to-r from-accent to-accent-soft/30"
                    initial={reduce ? { scaleX: 1, opacity: 0.4 } : { scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: done ? 1 : 0, opacity: done ? (current ? 1 : 0.4) : 0 }}
                    transition={{ duration: 1, ease: EASE_EXPO }}
                  />
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}