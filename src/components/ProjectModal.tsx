import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { ProjectVisual } from './projects/ProjectVisual'
import { Tag } from './ui/Section'
import { useEscape, useScrollLock } from '../lib/hooks'
import { EASE_EXPO } from '../lib/motion'

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null
  onClose: () => void
}) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const open = project !== null

  useScrollLock(open)
  useEscape(open, onClose)

  // Move focus into the dialog so keyboard and screen-reader users land here
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  // Reset internal scroll between projects
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
  }, [project])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-110"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_EXPO }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — case study`}
        >
          {/* Backdrop */}
          <motion.button
            aria-label="Close case study"
            onClick={onClose}
            className="absolute inset-0 w-full cursor-default bg-bg/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 top-0 mx-auto w-full max-w-4xl overflow-y-auto overscroll-contain outline-none sm:inset-y-6 sm:rounded-[1.75rem]"
            initial={reduce ? { opacity: 0 } : { y: 60, scale: 0.97, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 40, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 210, damping: 30, mass: 0.9 }}
            style={{
              background:
                'linear-gradient(180deg, #0B1017 0%, #080C12 55%, #05070A 100%)',
              border: '1px solid rgba(28,37,49,0.9)',
              boxShadow: '0 -20px 120px -40px rgba(124,108,255,0.22)',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              data-cursor="open"
              data-cursor-label="CLOSE"
              className="glass sticky top-4 right-4 z-30 ml-auto mr-4 flex size-11 items-center justify-center rounded-full border border-bg-line text-ink transition-colors duration-500 hover:border-accent/60 hover:bg-accent/10"
              aria-label="Close case study"
            >
              <X className="size-4" />
            </button>

            <div className="px-6 pt-10 pb-16 sm:px-12">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="label-mono text-accent">{project.index}</span>
                <span className="label-mono text-muted">{project.kicker}</span>
                <span className="h-px flex-1 bg-linear-to-r from-bg-line to-transparent" />
                <span className="label-mono text-faint">{project.role}</span>
              </div>

              <h2 className="mt-6 max-w-[18ch] text-[clamp(2rem,5.2vw,3.5rem)] font-semibold text-ink">
                {project.title}
              </h2>

              <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">
                {project.summary}
              </p>

              <div className="mt-6 h-[16rem] sm:h-[20rem]">
                <ProjectVisual project={project} active />
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {project.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="open"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-bg-line bg-white/2 px-5 py-2.5 text-[0.8125rem] text-ink transition-colors duration-500 hover:border-accent/60 hover:bg-accent/10"
                    style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
                  >
                    {l.label}
                    <ArrowUpRight className="size-4 text-accent transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>

              <hr className="my-12 border-0 h-px bg-bg-line" />

              <Block title="The problem" index="01">
                <p className="max-w-[68ch] text-[1.0625rem] leading-relaxed text-muted">
                  {project.detail.problem}
                </p>
              </Block>

              <Block title="The approach" index="02">
                <p className="mb-6 max-w-[68ch] text-[1.0625rem] leading-relaxed text-muted">
                  {project.detail.approach}
                </p>
                <ol className="space-y-3">
                  {project.detail.architecture.map((a, i) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: EASE_EXPO }}
                      className="flex gap-4 border-t border-bg-line/60 pt-3"
                    >
                      <span className="label-mono pt-0.5 text-faint">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-dim">
                        {a}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </Block>

              <Block title="Hard parts" index="03">
                <div className="grid gap-5 sm:grid-cols-2">
                  {project.detail.challenges.map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-10% 0px' }}
                      transition={{ duration: 0.7, delay: i * 0.07, ease: EASE_EXPO }}
                      className="rounded-2xl border border-bg-line bg-bg-raise/50 p-5"
                    >
                      <h4 className="text-[1.0625rem] font-medium text-ink">{c.title}</h4>
                      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                        {c.body}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Block>

              <Block title="What I learned" index="04">
                <ul className="space-y-3">
                  {project.detail.learned.map((l, i) => (
                    <motion.li
                      key={l}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease: EASE_EXPO }}
                      className="flex gap-3.5 text-[0.9375rem] leading-relaxed text-muted"
                    >
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
                      {l}
                    </motion.li>
                  ))}
                </ul>
              </Block>

              <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-bg-line pt-6">
                <span className="label-mono text-faint">{project.year} · YEABSRA ANDARGACHEW</span>
                <button
                  onClick={onClose}
                  className="label-mono text-accent transition-opacity hover:opacity-70"
                >
                  Close ↑
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Block({
  title,
  index,
  children,
}: {
  title: string
  index: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="mb-6 flex items-center gap-4">
        <span className="label-mono text-accent">{index}</span>
        <h3 className="text-[1.5rem] font-semibold text-ink">{title}</h3>
      </div>
      {children}
    </section>
  )
}