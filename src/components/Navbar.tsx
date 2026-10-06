import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEscape, useScrollLock, useScrollSpy } from '../lib/hooks'
import { EASE_EXPO } from '../lib/motion'
import { cn } from '../lib/utils'
import { SplitText } from './fx/SplitText'
import { profile } from '../data/profile'

const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

const SECTION_IDS = links.map((l) => l.id)

export function Navbar() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [pct, setPct] = useState(0)
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(SECTION_IDS)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24
    setScrolled((prev) => (prev === next ? prev : next))
    const p = Math.min(100, Math.round((y / Math.max(1, document.body.scrollHeight - window.innerHeight)) * 100))
    setPct((prev) => (prev === p ? prev : p))
  })

  useScrollLock(open)
  useEscape(open, () => setOpen(false))

  // Close the overlay if the viewport grows into a desktop layout
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 64rem)')
    const onChange = () => mql.matches && setOpen(false)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    window.requestAnimationFrame(() =>
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }),
    )
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE_EXPO, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-90"
      >
        <div className="shell">
          <nav
            aria-label="Primary"
            className={cn(
              'mt-3 flex items-center justify-between gap-4 rounded-full px-4 transition-all duration-700 md:mt-5 md:px-5',
              scrolled
                ? 'glass border border-bg-line/90 py-2.5 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)]'
                : 'border border-transparent py-4',
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
          >
            {/* Monogram */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
              className="group relative flex items-center gap-2.5 rounded-full pr-2"
              aria-label="Yeabsra Andargachew — back to top"
            >
              <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-bg-line bg-bg-raise">
                <span className="absolute inset-0 bg-accent/0 transition-colors duration-700 group-hover:bg-accent/25" />
                <span className="relative font-display text-[0.8125rem] font-semibold tracking-tight text-ink">
                  YA
                  <span className="text-accent">.</span>
                </span>
              </span>
              <span className="hidden font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase sm:block">
                Software &amp; AI Engineer
              </span>
            </button>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    aria-current={active === l.id ? 'true' : undefined}
                    className={cn(
                      'group relative rounded-full px-4 py-2 text-[0.8125rem] transition-colors duration-400',
                      active === l.id ? 'text-ink' : 'text-muted hover:text-ink',
                    )}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full border border-bg-line bg-bg-high"
                        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                      />
                    )}
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {/* Scroll readout — a small instrument, not decoration */}
              <div className="hidden items-center gap-2.5 lg:flex">
                <span className="h-px w-8 bg-bg-line" />
                <span className="label-mono w-8 text-right text-muted tabular-nums">
                  {String(pct).padStart(2, '0')}
                </span>
              </div>

              <button
                className="relative flex size-10 items-center justify-center rounded-full border border-bg-line bg-bg-raise/60 lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
                <span className="relative block h-3 w-4">
                  <motion.span
                    className="absolute left-0 block h-px w-full bg-ink"
                    animate={open ? { top: 6, rotate: 45 } : { top: 0, rotate: 0 }}
                    transition={{ duration: 0.4, ease: EASE_EXPO }}
                  />
                  <motion.span
                    className="absolute left-0 block h-px w-full bg-ink"
                    animate={open ? { top: 6, rotate: -45 } : { top: 11, rotate: 0 }}
                    transition={{ duration: 0.4, ease: EASE_EXPO }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Full-screen menu — staggered, cinematic, thumb-friendly */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-80 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_EXPO }}
          >
            <motion.div
              className="absolute inset-0 bg-bg/92 backdrop-blur-2xl"
              initial={{ clipPath: 'circle(0% at 88% 4%)' }}
              animate={{ clipPath: 'circle(150% at 88% 4%)' }}
              exit={{ clipPath: 'circle(0% at 88% 4%)' }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
            />

            <div className="relative flex h-full flex-col justify-between px-6 pt-28 pb-10">
              <ul className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.14 + i * 0.06 }}
                  >
                    <button
                      onClick={() => go(l.id)}
                      className="group flex w-full items-baseline gap-4 border-b border-bg-line/70 py-5 text-left"
                    >
                      <span className="label-mono text-faint">0{i + 1}</span>
                      <span className="font-display text-[clamp(2rem,9vw,2.75rem)] font-semibold tracking-tight text-ink transition-transform duration-500 group-hover:translate-x-2">
                        {l.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4"
              >
                <p className="max-w-[28ch] text-sm text-muted">
                  Open to ambitious engineering problems, AI systems, and product ideas.
                </p>
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="label-mono text-accent transition-opacity hover:opacity-70"
                >
                  Email me →
                </a>
                <SplitText text="YEABSRA ANDARGACHEW" className="label-mono text-faint" mode="words" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
