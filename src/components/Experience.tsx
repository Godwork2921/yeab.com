import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { education, experience } from '../data/experience'
import { SectionHead, Tag } from './ui/Section'
import { Counter } from './fx/Counter'
import { SmartImage } from './fx/SmartImage'
import { EASE_EXPO } from '../lib/motion'
import { cn } from '../lib/utils'

export function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 78%', 'end 62%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.6 })
  const glow = useTransform(scrollYProgress, [0, 1], [0.15, 0.9])

  return (
    <section id="experience" className="relative overflow-x-clip py-24 md:py-32">
      <div className="shell">
        <SectionHead index="04" eyebrow="Experience" title="Where I've been building" />

        <div ref={wrapRef} className="relative mt-16 md:mt-24">
          {/* Spine — draws as you scroll */}
          <div
            aria-hidden
            className="absolute top-2 left-[7px] bottom-2 w-px bg-bg-line md:left-[calc(9rem+7px)]"
          >
            <motion.div
              className="h-full w-full origin-top bg-linear-to-b from-accent via-accent-soft to-signal"
              style={{ scaleY, opacity: glow }}
            />
          </div>

          <ol className="space-y-14 md:space-y-20">
            {experience.map((e, i) => (
              <li key={e.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-12% 0px' }}
                  transition={{ duration: 0.9, ease: EASE_EXPO }}
                  className="grid gap-4 pl-9 md:grid-cols-12 md:gap-8 md:pl-0"
                >
                  {/* Date column */}
                  <div className="md:col-span-3 md:pr-6 md:text-right">
                    <p className="label-mono text-accent">{String(i + 1).padStart(2, '0')}</p>
                    <p className="mt-2 font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase">
                      {e.period}
                    </p>
                    <p className="label-mono mt-1.5 text-faint">{e.kind}</p>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-9 md:pl-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                      {e.logo && (
                        <SmartImage
                          src={e.logo}
                          alt={`${e.org} logo`}
                          fill={false}
                          opacity={1}
                          className="relative size-12 shrink-0 rounded-xl border border-bg-line bg-bg-raise/70 object-contain p-1.5 backdrop-blur-xl md:size-14"
                        />
                      )}
                      <h3 className="text-[clamp(1.5rem,3vw,2.125rem)] font-semibold text-ink">
                        {e.org}
                      </h3>
                      {e.current && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/8 px-2.5 py-0.5 font-mono text-[0.625rem] tracking-[0.12em] text-signal uppercase">
                          <span className="size-1.5 rounded-full bg-signal" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 font-display text-[1.0625rem] text-ink-dim">{e.role}</p>
                    <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted">
                      {e.body}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {e.focus.map((f) => (
                        <Tag key={f}>{f}</Tag>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Node on the spine */}
                <motion.span
                  aria-hidden
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE_EXPO }}
                  className="absolute top-2 left-0 flex size-[15px] items-center justify-center md:left-[9rem]"
                >
                  <span className="absolute inset-0 rounded-full border border-accent/50" />
                  <span className="size-[5px] rounded-full bg-accent" />
                </motion.span>
              </li>
            ))}

            {/* Education as the final timeline node */}
            <li className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px' }}
                transition={{ duration: 0.9, ease: EASE_EXPO }}
                className="grid gap-4 pl-9 md:grid-cols-12 md:gap-8 md:pl-0"
              >
                <div className="md:col-span-3 md:pr-6 md:text-right">
                  <p className="label-mono text-accent">EDU</p>
                  <p className="mt-2 font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase">
                    {education.expected}
                  </p>
                  <p className="label-mono mt-1.5 text-faint">Expected</p>
                </div>
                <div className="md:col-span-9 md:pl-8">
                  <h3 className="text-[clamp(1.5rem,3vw,2.125rem)] font-semibold text-ink">
                    {education.institution}
                  </h3>
                  <p className="mt-1.5 font-display text-[1.0625rem] text-ink-dim">
                    {education.degree}
                  </p>
                  <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-muted">
                    Learning to build by building — the parts of systems that only
                    appear once you have to make them work under real constraints.
                  </p>
                </div>
              </motion.div>
              <span
                aria-hidden
                className="absolute top-2 left-0 flex size-[15px] items-center justify-center md:left-[9rem]"
              >
                <span className="absolute inset-0 rounded-full border border-bg-line" />
                <span className="size-[5px] rounded-full bg-faint" />
              </span>
            </li>
          </ol>
        </div>

        {/* Numbers — earned, not decorative */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_EXPO }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bg-line bg-bg-line md:mt-28 md:grid-cols-4"
        >
          {[
            { v: 3, s: '', l: 'Roles held' },
            { v: 4, s: '', l: 'Systems shipped' },
            { v: 2, s: '', l: 'Languages, daily' },
            { v: 1, s: '', l: 'Degree, in progress' },
          ].map((s, i) => (
            <div
              key={s.l}
              className={cn(
                'flex flex-col gap-1.5 bg-bg-raise/60 p-5 backdrop-blur-xl',
                i < 2 && 'border-b border-bg-line md:border-b-0',
                i % 2 === 0 && 'border-r border-bg-line',
              )}
            >
              <dt className="order-2 label-mono text-faint">{s.l}</dt>
              <dd className="order-1 font-display text-[2.5rem] leading-none font-semibold text-ink tabular-nums">
                <Counter to={s.v} suffix={s.s} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}