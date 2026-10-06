import { motion, useScroll, useSpring } from 'motion/react'

/** Hairline scroll progress across the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-100 h-px origin-left bg-linear-to-r from-accent via-accent-soft to-signal"
      style={{ scaleX }}
    />
  )
}
