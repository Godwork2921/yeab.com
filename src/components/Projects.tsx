import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { projects, type Project } from '../data/projects'
import { ProjectVisual } from './projects/ProjectVisual'
import { SectionHead, Tag } from './ui/Section'
import { Reveal } from './fx/Reveal'
import { useFinePointer } from '../lib/hooks'
import { EASE_EXPO } from '../lib/motion'
import { cn } from '../lib/utils'

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const fine = useFinePointer()

  return (
    <section id="work" className="relative overflow-x-clip py-24 md:py-32">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead index="03" eyebrow="Selected work" title="Selected Work" className="flex-1" />
          <Reveal delay={0.1}>
            <p className="max-w-[30ch] text-[1.0625rem] leading-relaxed text-muted">
              Systems, experiments, and products I've been building.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-24">
          {projects.map((p, i) => (
            <ProjectBand
              key={p.id}
              project={p}
              index={i}
              fine={fine}
              onOpen={() => onOpen(p)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectBand({
  project,
  index,
  fine,
  onOpen,
}: {
  project: Project
  index: number
  fine: boolean
  onOpen: () => void
}) {
  const reduce = useReducedMotion()
  const bandRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const inView = useInView(bandRef, { margin: '-25% 0px -25% 0px' })
  const active = hovered || inView
  // `cursor-none` is only safe when the custom cursor is actually rendering
  const cursorActive = fine && !reduce

  // Arrow that trails the cursor inside the visual panel
  const arrow = useRef({ x: 0, y: 0 })
  const arrowRef = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent) => {
    if (!fine || reduce) return
    const el = panelRef.current
    const node = arrowRef.current
    if (!el || !node) return
    const r = el.getBoundingClientRect()
    const tx = e.clientX - r.left
    const ty = e.clientY - r.top
    arrow.current.x += (tx - arrow.current.x) * 0.16
    arrow.current.y += (ty - arrow.current.y) * 0.16
    node.style.transform = `translate3d(${arrow.current.x}px, ${arrow.current.y}px, 0) translate(-50%, -50%)`
  }

  const enter = () => {
    setHovered(true)
    const el = panelRef.current
    const node = arrowRef.current
    if (el && node) {
      const r = el.getBoundingClientRect()
      arrow.current.x = r.width * 0.5
      arrow.current.y = r.height * 0.5
      node.style.transform = `translate3d(${arrow.current.x}px, ${arrow.current.y}px, 0) translate(-50%, -50%)`
    }
  }

  const last = index === projects.length - 1

  return (
    <motion.article
      ref={bandRef}
      className={cn('group relative', !last && 'border-t border-bg-line/70')}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 1, ease: EASE_EXPO }}
    >
      {/* Hover wash — gradient drifts under the band */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -inset-x-6 -inset-y-8 rounded-[2rem] bg-linear-to-br from-accent/8 via-transparent to-transparent opacity-0 transition-opacity duration-700',
          hovered && 'opacity-100',
        )}
        style={{
          backgroundSize: '200% 200%',
          transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
        }}
      />

      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => (fine ? enter() : setHovered(true))}
        onPointerMove={onMove}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        data-cursor="view"
        data-cursor-label="VIEW"
        className={cn(
          'relative w-full py-10 text-left md:py-14',
          // Only hide the OS cursor when we are actually drawing a replacement
          cursorActive && 'cursor-none',
        )}
        aria-label={`Open case study: ${project.title}`}
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="label-mono text-accent">{project.index}</span>
          <span className="label-mono text-muted">{project.kicker}</span>
          <span className="h-px flex-1 bg-linear-to-r from-bg-line to-transparent" />
          <span className="label-mono text-faint">{project.year}</span>
          {project.status && (
            <span
              className={cn(
                'label-mono rounded-full border px-2.5 py-1',
                project.accent === 'signal'
                  ? 'border-signal/30 text-signal'
                  : 'border-accent/30 text-accent-soft',
              )}
            >
              {project.status}
            </span>
          )}
        </div>

        <div className="mt-7 grid gap-8 md:mt-9 md:grid-cols-12 md:gap-10">
          {/* Text */}
          <div className="md:col-span-7 lg:col-span-7">
            <h3
              className="max-w-[16ch] text-[clamp(2rem,4.6vw,3.5rem)] font-semibold text-ink transition-transform duration-700 md:transition-[transform,color]"
              style={{
                transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)',
                transform: hovered && !reduce ? 'translateX(6px)' : 'translateX(0)',
              }}
            >
              {project.title}
            </h3>

            <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{project.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>

            <span className="mt-7 inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.12em] text-ink uppercase">
              Read the case study
              <ArrowUpRight
                className={cn(
                  'size-4 text-accent transition-transform duration-500',
                  hovered && !reduce && 'translate-x-1 -translate-y-1',
                )}
                style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
              />
            </span>
          </div>

          {/* Visual */}
          <div
            ref={panelRef}
            className="relative h-[19rem] md:col-span-5 md:h-[22rem] lg:h-[24rem]"
          >
            <ProjectVisual project={project} active={active} />

            {/* Cursor-tracking arrow */}
            {fine && (
              <div
                ref={arrowRef}
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-30 flex size-16 items-center justify-center rounded-full bg-ink/95 text-bg will-change-transform"
                style={{ opacity: hovered && !reduce ? 1 : 0, transition: 'opacity 0.35s' }}
              >
                <span className="label-mono text-[0.625rem]">OPEN</span>
              </div>
            )}
          </div>
        </div>
      </button>
    </motion.article>
  )
}