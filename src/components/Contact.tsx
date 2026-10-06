import { useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react'
import { profile } from '../data/profile'
import { Button } from './ui/Button'
import { SplitText } from './fx/SplitText'
import { EASE_EXPO } from '../lib/motion'

const PROFILE_IMAGE = '/assets/images/profile/portfolio.jpg'

const channels = [
  { label: 'Email', value: profile.contactEmail, href: `mailto:${profile.contactEmail}`, icon: Mail },
  { label: 'GitHub', value: profile.githubHandle, href: profile.github, icon: Github },
  {
    label: 'LinkedIn',
    value: profile.linkedinHandle,
    href: profile.linkedin,
    icon: Linkedin,
  },
]

export function Contact() {
  const reduce = useReducedMotion()
  const [imgOk, setImgOk] = useState(true)
  const { scrollYProgress } = useScroll({
    target: undefined,
    offset: ['start end', 'end end'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      {/* Animated background — a slow violet bloom behind the CTA */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[70vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[180px]"
          animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="shell relative">
        <motion.div style={reduce ? undefined : { y }} className="flex flex-col gap-16">
          {/* Headline */}
          <div>
            <div className="flex items-center gap-4">
              <span className="label-mono text-accent">07</span>
              <span className="h-px flex-1 bg-linear-to-r from-bg-line to-transparent" />
              <span className="label-mono text-muted">Contact</span>
            </div>

            <h2 className="mt-9 max-w-[16ch] text-[clamp(2.5rem,8vw,6.5rem)] font-semibold tracking-[-0.035em] text-ink">
              <SplitText text="Let's build" mode="words" stagger={0.07} />
              <span className="text-accent-sheen block">
                <SplitText text="something meaningful." mode="words" stagger={0.07} delay={0.12} />
              </span>
            </h2>

            <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted md:text-[1.1875rem]">
              I'm interested in ambitious engineering problems, AI systems, product ideas, and
              opportunities to learn by building.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={`mailto:${profile.contactEmail}`} cursorLabel="EMAIL">
                Email me
              </Button>
              <Button href={profile.github} external variant="ghost" cursorLabel="GITHUB">
                GitHub
              </Button>
              <Button href={profile.linkedin} external variant="ghost" cursorLabel="LINKEDIN">
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Channels + portrait */}
          <div className="grid gap-10 border-t border-bg-line/70 pt-10 md:grid-cols-12 md:gap-14">
            <ul className="flex flex-col md:col-span-7">
              {channels.map((c, i) => (
                <motion.li
                  key={c.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: EASE_EXPO }}
                >
                  <a
                    href={c.href}
                    {...(c.href.startsWith('mailto:')
                      ? {}
                      : { target: '_blank', rel: 'noreferrer noopener' })}
                    data-cursor="open"
                    className="group flex items-center gap-5 border-b border-bg-line/60 py-5 transition-colors duration-500"
                    style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-bg-line bg-bg-raise/60 text-muted transition-colors duration-500 group-hover:border-accent/60 group-hover:text-accent-soft">
                      <c.icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="label-mono block text-faint">{c.label}</span>
                      <span className="mt-1.5 block truncate text-[0.9375rem] text-ink-dim transition-colors duration-500 group-hover:text-ink">
                        {c.value}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent" />
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Portrait — monogram plate if the photo isn't there yet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_EXPO }}
              className="md:col-span-5"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-[calc(var(--radius-panel)+0.25rem)] border border-bg-line bg-bg-raise">
                <div className="absolute inset-0 bg-linear-to-br from-accent/22 via-bg-raise to-signal/10" />
                {imgOk && (
                  <img
                    src={PROFILE_IMAGE}
                    alt={`${profile.name}, Software Engineer and AI Engineer`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgOk(false)}
                    className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-luminosity transition-transform duration-1000 hover:scale-[1.04]"
                  />
                )}
                {/* Monogram plate — always visible, sits over the photo as a watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-5">
                  <span className="font-display text-[2.25rem] leading-none font-bold text-ink/12 select-none">
                    YA.
                  </span>
                  <span className="label-mono text-ink/50">{profile.location.toUpperCase()}</span>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg/85 via-transparent to-transparent" />
              </div>

              <div className="mt-4 flex items-center gap-2.5">
                <span className="relative flex size-2 items-center justify-center">
                  <span className="absolute inline-flex size-2 rounded-full bg-signal" />
                  {!reduce && (
                    <span
                      className="absolute inline-flex h-full w-full rounded-full bg-signal"
                      style={{ animation: 'pulse-ring 2.4s ease-out infinite' }}
                    />
                  )}
                </span>
                <span className="label-mono text-signal">OPEN TO OPPORTUNITIES</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}