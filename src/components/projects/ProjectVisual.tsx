import type { Project } from '../../data/projects'
import { CommerceVisual } from './CommerceVisual'
import { RoadGuardVisual } from './RoadGuardVisual'
import { TicketingVisual } from './TicketingVisual'
import { TranslationVisual } from './TranslationVisual'
import { SecurityVisual } from './SecurityVisual'
import { SmartImage } from '../fx/SmartImage'
import { motion, useReducedMotion } from 'motion/react'

/**
 * The visual panel for a project: the live diagram is the readable layer, an
 * optional bitmap backdrop sits beneath it at low opacity for texture.
 */
export function ProjectVisual({ project, active }: { project: Project; active: boolean }) {
  const reduce = useReducedMotion()

  return (
    <div
      data-active={active ? 'true' : 'false'}
      className="border-spin relative h-full w-full overflow-hidden rounded-[calc(var(--radius-panel)+0.25rem)] border border-bg-line bg-bg-raise/40"
    >
      {/* Backdrop — only renders if the asset actually exists */}
      <div className="absolute inset-0">
        <SmartImage
          src={project.image}
          alt=""
          className="absolute inset-0"
          imgClassName="mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-transparent to-signal/6" />
      </div>

      {/* Live diagram */}
      <div className="relative z-10 h-full w-full p-4 md:p-6">
        {project.visual === 'translation' && <TranslationVisual active={active} />}
        {project.visual === 'ticketing' && <TicketingVisual active={active} />}
        {project.visual === 'commerce' && <CommerceVisual active={active} />}
        {project.visual === 'roadguard' && <RoadGuardVisual active={active} />}
        {project.visual === 'negarit' && <SecurityVisual active={active} />}
      </div>

      {/* Corner chrome */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 pb-3">
        <span className="label-mono text-faint">
          {project.visual === 'translation' && 'FIG. 01 — SEMANTIC FLOW'}
          {project.visual === 'ticketing' && 'FIG. 02 — REQUEST + INVENTORY'}
          {project.visual === 'commerce' && 'FIG. 03 — STOREFRONT'}
          {project.visual === 'roadguard' && 'FIG. 04 — RISK SURFACE'}
          {project.visual === 'negarit' && 'FIG. 05 — SIGNAL TRIAGE'}
        </span>
        {!reduce && (
          <motion.span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-signal/70"
            animate={{ opacity: active ? [0.25, 1, 0.25] : 0.25 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
    </div>
  )
}