import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_EXPO, VIEWPORT } from '../../lib/motion'
import { cn } from '../../lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Travel distance in px before settling */
  y?: number
  blur?: boolean
  as?: 'div' | 'span' | 'li' | 'section' | 'article'
}

/**
 * The workhorse reveal: rises, de-blurs, settles. Collapses to a plain
 * opacity fade when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  blur = true,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]

  if (reduce) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(7px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, delay, ease: EASE_EXPO }}
    >
      {children}
    </MotionTag>
  )
}

/** Word-by-word rise, for paragraphs where the reading rhythm matters. */
export function RevealLines({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    return <p className={className}>{text}</p>
  }

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.028, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={cn('inline-block', wordClassName)}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE_EXPO } },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.p>
  )
}
