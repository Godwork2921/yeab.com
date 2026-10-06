import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useFinePointer } from '../../lib/hooks'
import { lerp } from '../../lib/utils'

type CursorState = { mode: 'default' | 'view' | 'open' | 'drag'; label: string }

/**
 * Desktop-only cursor: a precise dot that tracks tightly, and a ring that
 * follows with weight. Interactive elements opt in declaratively:
 *
 *   <a data-cursor="view" data-cursor-label="VIEW">
 *
 * Touch devices and reduced-motion users never see it.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const seenRef = useRef(false)
  const [state, setState] = useState<CursorState>({ mode: 'default', label: '' })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let raf = 0
    let running = true
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let scale = 1
    let targetScale = 1

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!seenRef.current) {
        seenRef.current = true
        setVisible(true)
      }

      const el = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      if (el) {
        const mode = (el.dataset.cursor ?? 'default') as CursorState['mode']
        const label = el.dataset.cursorLabel ?? ''
        setState((s) => (s.mode === mode && s.label === label ? s : { mode, label }))
        targetScale = mode === 'default' ? 1.75 : 3.4
      } else {
        setState((s) => (s.mode === 'default' ? s : { mode: 'default', label: '' }))
        targetScale = 1
      }
    }

    const onLeaveWindow = () => setVisible(false)

    const tick = () => {
      if (!running) return
      ringPos.x = lerp(ringPos.x, pos.x, 0.14)
      ringPos.y = lerp(ringPos.y, pos.y, 0.14)
      scale = lerp(scale, targetScale, 0.14)
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`
      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      running = !document.hidden
      if (running) raf = requestAnimationFrame(tick)
      else cancelAnimationFrame(raf)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeaveWindow)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeaveWindow)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-200 hidden lg:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border border-accent-soft/45 bg-accent/8 backdrop-blur-[1px] will-change-transform"
        style={{ width: 44, height: 44, opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <AnimatePresence>
          {state.label && (
            <motion.span
              key={state.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="label-mono text-[9px] text-ink"
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full bg-ink will-change-transform"
        style={{
          width: 6,
          height: 6,
          opacity: visible && state.mode === 'default' ? 1 : 0,
          transition: 'opacity 0.25s',
        }}
      />
    </div>
  )
}
