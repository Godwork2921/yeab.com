import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { clamp, lerp } from '../../lib/utils'

type Node = { x: number; y: number; vx: number; vy: number; r: number }

const LINK_DIST = 148
const POINTER_R = 190

/**
 * Persistent network field behind the upper half of the page.
 *
 * Performance contract:
 *  · single rAF loop, one canvas, DPR clamped to 2
 *  · O(n²) link test, but n is capped at ~110 so it's ~6k cheap ops
 *  · loop parks entirely when the tab is hidden
 *  · reduced-motion users get exactly one static frame
 */
export function BackgroundField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 1100, 2200], [1, 0.5, 0.12])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let nodes: Node[] = []
    let raf = 0
    let running = true

    // Pointer state, lerped each frame for a soft, weighted feel
    const target = { x: 0, y: 0 }
    const smooth = { x: 0, y: 0 }
    const parallax = { x: 0, y: 0 }

    const seed = () => {
      const count = clamp(Math.round((w * h) / 20000), 34, 110)
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.19,
        vy: (Math.random() - 0.5) * 0.19,
        r: Math.random() * 1.25 + 0.5,
      }))
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Field-level parallax: the whole system drifts with the cursor
      ctx.save()
      ctx.translate(parallax.x, parallax.y)

      const linkSq = LINK_DIST * LINK_DIST

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]

        // Pointer repulsion + brightening
        const dx = a.x - smooth.x
        const dy = a.y - smooth.y
        const pSq = dx * dx + dy * dy

        if (pSq < POINTER_R * POINTER_R) {
          const dist = Math.sqrt(pSq) || 1
          const force = (1 - dist / POINTER_R) * 0.85
          a.x += (dx / dist) * force
          a.y += (dy / dist) * force
        }

        // Drift + wrap
        a.x += a.vx
        a.y += a.vy
        if (a.x < -20) a.x = w + 20
        else if (a.x > w + 20) a.x = -20
        if (a.y < -20) a.y = h + 20
        else if (a.y > h + 20) a.y = -20

        const near = pSq < POINTER_R * POINTER_R

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const ex = a.x - b.x
          const ey = a.y - b.y
          const dSq = ex * ex + ey * ey
          if (dSq > linkSq) continue

          const d = Math.sqrt(dSq)
          // Edges brighten where the pointer is — the field appears to notice you
          const focus =
            (Math.max(0, 1 - Math.hypot(a.x - smooth.x, a.y - smooth.y) / 260) +
              Math.max(0, 1 - Math.hypot(b.x - smooth.x, b.y - smooth.y) / 260)) *
            0.5
          const alpha = (1 - d / LINK_DIST) * (0.1 + focus * 0.34)

          ctx.strokeStyle = `rgba(150, 140, 255, ${alpha.toFixed(3)})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }

        // Pointer tethers
        if (near) {
          const d = Math.sqrt(pSq) || 1
          const alpha = (1 - d / POINTER_R) * 0.3
          ctx.strokeStyle = `rgba(169, 155, 255, ${alpha.toFixed(3)})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(smooth.x, smooth.y)
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(a.x, a.y, near ? a.r + 0.7 : a.r, 0, Math.PI * 2)
        ctx.fillStyle = near ? 'rgba(190, 180, 255, 0.85)' : 'rgba(150, 165, 190, 0.4)'
        ctx.fill()
      }

      ctx.restore()
    }

    const step = () => {
      if (!running) return
      smooth.x = lerp(smooth.x, target.x, 0.07)
      smooth.y = lerp(smooth.y, target.y, 0.07)
      parallax.x = lerp(parallax.x, (smooth.x - w / 2) * -0.016, 0.05)
      parallax.y = lerp(parallax.y, (smooth.y - h / 2) * -0.016, 0.05)
      draw()
      raf = requestAnimationFrame(step)
    }

    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const onLeave = () => {
      target.x = w / 2
      target.y = h / 2
    }

    const onVisibility = () => {
      running = !document.hidden
      if (running) raf = requestAnimationFrame(step)
      else cancelAnimationFrame(raf)
    }

    resize()
    smooth.x = target.x = w / 2
    smooth.y = target.y = h / 2

    if (reduceMotion) {
      // One static frame — texture without motion
      parallax.x = 0
      parallax.y = 0
      draw()
    } else {
      raf = requestAnimationFrame(step)
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerleave', onLeave)
      document.addEventListener('visibilitychange', onVisibility)
    }

    window.addEventListener('resize', resize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduceMotion])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity }}
    >
      <canvas ref={canvasRef} />
    </motion.div>
  )
}
