import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '../../lib/utils'

/**
 * Infinite ticker. The list is rendered twice and shifted by -50%, so the
 * seam is never visible and no JS runs per frame.
 */
export function Marquee({
  children,
  speed = 38,
  className,
  fade = true,
}: {
  children: ReactNode
  speed?: number
  className?: string
  fade?: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <div
      className={cn(
        'relative flex overflow-hidden',
        fade &&
          '[mask-image:linear-gradient(to_right,transparent,#000_9%,#000_91%,transparent)]',
        className,
      )}
    >
      {/* Two structurally identical halves, so the -50% loop has no seam. */}
      <div
        className="flex w-max shrink-0"
        style={reduce ? undefined : { animation: `marquee-x ${speed}s linear infinite` }}
      >
        <span className="flex shrink-0 items-center gap-10 pr-10">{children}</span>
        <span aria-hidden className="flex shrink-0 items-center gap-10 pr-10">
          {children}
        </span>
      </div>
    </div>
  )
}
