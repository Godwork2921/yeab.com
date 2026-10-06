import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Button } from './ui/Button'
import { SplitText, MaskLine } from './fx/SplitText'
import { RevealLines } from './fx/Reveal'
import { telemetry } from '../data/profile'

/**
 * The hero needs to answer in one frame — name, role, status, a single line
 * of belief, and a decisive CTA. Motion is split (char + mask) so it's
 * cinematic but reads immediately.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 900], [0, -40])
  const fgY = useTransform(scrollY, [0, 900], [0, 40])
  const innerY = useTransform(scrollY, [0, 900], [0, 20])

  return (
    <section id="hero" className="relative flex min-h-svh items-center overflow-x-clip pt-20 pb-12 md:pt-16">
      {/* Subtle atmospheric shift behind hero as you scroll */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-20 h-[130vh] will-change-transform"
        style={{ y: bgY, opacity: reduce ? 0.4 : 0.8 }}
      />

      <div className="shell relative z-10">
        <motion.div style={{ y: fgY }}>
          <div className="flex flex-col gap-8 md:gap-10">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="inline-flex w-fit items-center gap-3 rounded-full border border-bg-line bg-bg-raise/70 px-4 py-2 backdrop-blur-xl"
            >
              <span className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex size-2 rounded-full bg-signal" />
                {!reduce && (
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-signal"
                    style={{ animation: 'pulse-ring 2.4s ease-out infinite' }}
                  />
                )}
              </span>
              <span className="label-mono text-signal">AVAILABLE FOR BUILDING</span>
              <span className="h-px w-6 bg-bg-line" />
              <span className="label-mono text-muted">ETHIOPIA</span>
            </motion.div>

            {/* Main headline.
                Line 2 carries more glyphs, so it runs smaller — the lockup
                reads as one mark rather than two competing lines. Max widths
                are chosen so ANDARGACHEW cannot overflow the shell at 1440. */}
            <motion.h1
              className="flex flex-col leading-[0.88] tracking-[-0.035em] text-ink"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: {} }}
            >
              <SplitText
                text="YEABSRA"
                mode="chars"
                immediate
                className="text-[clamp(3.25rem,12vw,10.5rem)] font-bold uppercase"
                stagger={0.016}
                delay={0.18}
              />
              <MaskLine
                immediate
                delay={0.36}
                className="text-outline text-[clamp(2.75rem,10.6vw,9.25rem)] font-bold uppercase"
              >
                ANDARGACHEW
              </MaskLine>
            </motion.h1>

            {/* Roles */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[clamp(1.25rem,2.8vw,1.75rem)] text-muted"
            >
              <span>Software Engineer</span>
              <span className="text-accent">·</span>
              <span>AI Engineer</span>
            </motion.div>

            {/* Tagline */}
            <motion.div style={{ y: innerY }}>
              <RevealLines
                delay={0.56}
                text="I build intelligent systems and reliable software at the intersection of backend engineering and AI."
                className="max-w-[36ch] text-[1.0625rem] leading-relaxed text-muted md:text-[1.1875rem]"
              />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Button
                href="#work"
                variant="primary"
                cursorLabel="EXPLORE"
              >
                Explore my work
              </Button>
              <Button href="#contact" variant="ghost" cursorLabel="CONNECT">
                Let's connect
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.82 }}
              className="mt-8 flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-2.5 rounded-full border border-bg-line bg-bg-raise/60 px-4 py-2 backdrop-blur-xl">
                <span className="label-mono text-muted">SCROLL TO EXPLORE</span>
                <span className="relative h-5 w-px overflow-hidden bg-bg-line">
                  <motion.span
                    aria-hidden
                    className="absolute top-0 left-0 h-1/2 w-full bg-accent"
                    animate={{ y: ['-150%', '250%'] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  />
                </span>
              </span>
            </motion.div>

            {/* Telemetry strip */}
            <div className="mt-10 border-t border-bg-line/60 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4">
                {telemetry.map((t, i) => (
                  <motion.div
                    key={t.k}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.9 + i * 0.05 }}
                    className="flex items-center gap-3.5"
                  >
                    <span className="label-mono text-faint">{t.k}</span>
                    <span className="font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase">
                      {t.v}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
