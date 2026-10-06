import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Magnetic } from '../fx/Magnetic'
import { EASE_EXPO } from '../../lib/motion'
import { cn } from '../../lib/utils'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'signal'
  magnetic?: boolean
  trailing?: ReactNode
  className?: string
  cursorLabel?: string
  external?: boolean
  type?: 'button' | 'submit'
}

/**
 * Two weights only: a filled primary and a hairline ghost. Both get the
 * shine sweep and a magnetic lean on desktop.
 */
export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  magnetic = true,
  trailing,
  className,
  cursorLabel,
  external,
  type = 'button',
}: Props) {
  const reduce = useReducedMotion()

  const styles = {
    primary:
      'bg-ink text-bg hover:bg-accent hover:text-white border border-transparent',
    signal:
      'bg-signal text-bg hover:bg-ink hover:text-signal border border-transparent',
    ghost:
      'text-ink border border-bg-line bg-white/2 hover:border-accent/60 hover:bg-accent/8',
  }[variant]

  const inner = (
    <span
      className={cn(
        'group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-[0.8125rem] font-medium tracking-[0.02em] transition-colors duration-500',
        styles,
        className,
      )}
      {...(cursorLabel ? { 'data-cursor': 'open', 'data-cursor-label': cursorLabel } : {})}
    >
      {/* Shine sweep — transform only, retriggered on hover */}
      {!reduce && (
        <span
          aria-hidden
          data-shine
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/22 to-transparent"
        />
      )}
      <span className="relative z-10">{children}</span>
      {trailing ?? (
        <ArrowUpRight
          className="relative z-10 size-4 transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          style={{ transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
        />
      )}
    </span>
  )

  // The shine sweep is retriggered imperatively — cheapest way to avoid a
  // React re-render on every hover.
  const withSweep = (
    <span
      className="relative inline-block overflow-hidden rounded-full"
      onMouseEnter={(e) => {
        if (reduce) return
        const el = e.currentTarget.querySelector<HTMLElement>('[data-shine]')
        if (!el) return
        el.style.animation = 'none'
        // Force reflow so the animation restarts even on re-entry
        void el.offsetWidth
        el.style.animation = 'shine-sweep 0.85s cubic-bezier(.16,1,.3,1)'
      }}
    >
      {inner}
    </span>
  )

  const content = magnetic ? <Magnetic strength={12}>{withSweep}</Magnetic> : withSweep

  if (href) {
    return (
      <motion.a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        className="inline-block"
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE_EXPO }}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className="inline-block"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE_EXPO }}
    >
      {content}
    </motion.button>
  )
}
