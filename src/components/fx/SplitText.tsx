import { motion, useReducedMotion } from 'motion/react'
import { EASE_EXPO } from '../../lib/motion'
import { cn } from '../../lib/utils'

type SplitProps = {
  text: string
  className?: string
  /** 'chars' for the hero (per-glyph life), 'words' for body copy */
  mode?: 'chars' | 'words'
  delay?: number
  stagger?: number
  /** Runs on mount (hero) instead of on scroll (sections) */
  immediate?: boolean
  blur?: boolean
}

/**
 * Per-character reveal: each glyph rises from behind a mask, un-blurs, and
 * settles with a long expo-out tail. Spacing is preserved with explicit
 * letter spans so kerning is untouched.
 */
export function SplitText({
  text,
  className,
  mode = 'chars',
  delay = 0,
  stagger,
  immediate = false,
  blur = true,
}: SplitProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <span className={className}>{text}</span>
  }

  const units = mode === 'chars' ? Array.from(text) : text.split(' ')
  const step = stagger ?? (mode === 'chars' ? 0.026 : 0.05)
  const duration = mode === 'chars' ? 1.05 : 0.85

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  }

  const unit = {
    hidden: { y: '115%', opacity: 0, filter: blur ? 'blur(10px)' : 'blur(0px)' },
    show: {
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration, ease: EASE_EXPO },
    },
  }

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      variants={container}
      initial="hidden"
      {...(immediate
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once: true, margin: '-10% 0px -10% 0px' } })}
      aria-label={text}
    >
      {units.map((u, i) => (
        <span
          key={`${u}-${i}`}
          aria-hidden
          className="inline-flex overflow-hidden pb-[0.08em] [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_88%,transparent)]"
        >
          <motion.span variants={unit} className="inline-block will-change-transform">
            {u === ' ' ? '\u00A0' : u}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/**
 * One-shot line reveal driven by a mask — used for the hero's second line so
 * it can carry an outline treatment the char engine doesn't handle.
 */
export function MaskLine({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  immediate?: boolean
}) {
  const reduce = useReducedMotion()

  if (reduce) return <span className={className}>{children}</span>

  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className={cn('block', className)}
        initial={{ y: '110%', opacity: 0 }}
        {...(immediate
          ? { animate: { y: '0%', opacity: 1 } }
          : {
              whileInView: { y: '0%', opacity: 1 },
              viewport: { once: true, margin: '-10% 0px -10% 0px' },
            })}
        transition={{ duration: 1.1, ease: EASE_EXPO, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}
