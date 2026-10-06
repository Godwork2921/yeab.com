import { motion, useReducedMotion } from 'motion/react'
import { Reveal, RevealLines } from './fx/Reveal'
import { SectionHead } from './ui/Section'
import { profile } from '../data/profile'

/** Editorial about section. The key line is a serif italic to create tension. */
export function About() {
  const reduce = useReducedMotion()

  return (
    <section id="about" className="relative overflow-x-clip py-24 md:py-32">
      <div className="shell">
        <SectionHead index="01" eyebrow="About" title="How I think about building" />

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-6 md:pt-4">
            <Reveal>
              <p
                className="max-w-[20ch] leading-[0.96] tracking-[-0.03em] text-ink"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.75rem,6vw,4.25rem)' }}
              >
                <em>{profile.heroStatement}</em>
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <RevealLines
              text="I'm a Computer Science student at the University of Gondar (expected 2027). I work at the intersection of backend engineering and AI/NLP — especially low-resource machine translation, dataset quality, and production-grade distributed systems."
              className="text-[1.0625rem] leading-relaxed text-muted md:text-[1.1875rem]"
            />
            <RevealLines
              delay={0.08}
              text="I believe the most interesting problems are the ones that don't come with clean datasets. So I focus on understanding the system first, designing its boundaries and failure modes, then building the smallest useful version that can tell me whether I'm wrong."
              className="mt-5 text-[1.0625rem] leading-relaxed text-muted md:text-[1.1875rem]"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-bg-line bg-bg-raise/70 px-3.5 py-1.5 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-muted uppercase">
                  Systems design
                </span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-bg-line bg-bg-raise/70 px-3.5 py-1.5 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-muted uppercase">
                  Data quality
                </span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-bg-line bg-bg-raise/70 px-3.5 py-1.5 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
                <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-muted uppercase">
                  Pragmatic experimentation
                </span>
              </span>
            </motion.div>
          </div>
        </div>

        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-10%] h-[46vh] w-[46vw] rounded-full bg-accent/8 blur-[160px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
          />
        )}
      </div>
    </section>
  )
}
