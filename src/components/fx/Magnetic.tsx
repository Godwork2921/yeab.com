import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useFinePointer } from '../../lib/hooks'

type MagneticProps = {
  children: ReactNode
  className?: string
  /** How far the element travels toward the cursor, in px at full deflection */
  strength?: number
}

/**
 * Magnetic hover: the element leans toward the pointer and springs back on
 * exit. Fine-pointer only — touch devices get a plain tap target.
 */
export function Magnetic({ children, className, strength = 16 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.5 })
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.5 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const relX = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const relY = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      mx.set(Math.max(-1, Math.min(1, relX)) * strength)
      my.set(Math.max(-1, Math.min(1, relY)) * strength * 0.6)
    }

    const onEnter = () => setActive(true)
    const onLeave = () => {
      setActive(false)
      mx.set(0)
      my.set(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, mx, my, strength])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { x, y } : undefined}
      animate={{ scale: active ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {children}
    </motion.div>
  )
}
