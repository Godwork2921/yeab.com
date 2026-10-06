import type { Transition, Variants } from 'motion/react'

/** House easing — expo-out. The single curve used across the site. */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_SOFT = [0.32, 0.72, 0, 1] as const

/** Spring-ish transitions for anything that should feel physical */
export const spring: Transition = { type: 'spring', stiffness: 190, damping: 26, mass: 0.9 }
export const springSoft: Transition = { type: 'spring', stiffness: 110, damping: 20, mass: 1 }
export const springSnap: Transition = { type: 'spring', stiffness: 320, damping: 30, mass: 0.7 }

export const ease = (duration = 0.7, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_EXPO,
})

/** Standard viewport reveal — used by almost every block on the page. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE_EXPO },
  },
}

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE_EXPO } },
}

/** Parent that hands its children a stagger clock. */
export const stagger = (each = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren } },
})

export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' } as const
