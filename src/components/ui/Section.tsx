import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { EASE_EXPO } from '../../lib/motion'
import { cn } from '../../lib/utils'
import { SplitText } from '../fx/SplitText'

/**
 * Every section shares one grammar: a mono index + rule on the left, then
 * the title. Repetition is what makes a long page feel like one system.
 */
export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  className,
}: {
  index: string
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <span className="label-mono text-accent">{index}</span>
        <span className="h-px flex-1 bg-linear-to-r from-bg-line to-transparent" />
        <span className="label-mono text-muted">{eyebrow}</span>
      </motion.div>

      <h2 className="max-w-[22ch] text-[clamp(2.5rem,6.4vw,5.25rem)] font-semibold text-ink">
        {typeof title === 'string' ? (
          <SplitText text={title} mode="words" stagger={0.05} />
        ) : (
          title
        )}
      </h2>

      {lede && (
        <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted">{lede}</p>
      )}
    </div>
  )
}

/** Thin technical chip. */
export function Tag({
  children,
  active = false,
  tone = 'default',
  className,
}: {
  children: ReactNode
  active?: boolean
  tone?: 'default' | 'signal'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.6875rem] tracking-[0.08em] whitespace-nowrap transition-all duration-500',
        active
          ? 'border-accent/70 bg-accent/14 text-accent-soft'
          : tone === 'signal'
            ? 'border-signal/30 bg-signal/8 text-signal'
            : 'border-bg-line bg-white/2 text-muted',
        className,
      )}
      style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
    >
      {children}
    </span>
  )
}

/** A hairline rule that draws itself when scrolled into view. */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={cn('h-px w-full origin-left bg-bg-line', className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.2, ease: EASE_EXPO, delay }}
    />
  )
}
