import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

/**
 * Fixed chassis: drifting grid, a slow violet aurora, film grain and a vignette.
 * All GPU-cheap (transform/opacity only) and parked under reduced-motion.
 */
export function Atmosphere() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()

  const gridY = useTransform(scrollY, [0, 3000], [0, 160])
  const gridOpacity = useTransform(scrollY, [0, 900, 2600], [0.5, 0.22, 0.07])
  const auroraY = useTransform(scrollY, [0, 3000], [0, -220])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Aurora — two very soft violet lobes, animated with transform only */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -top-[28%] left-[6%] h-[62vh] w-[62vw] rounded-full opacity-[0.16] blur-[130px]"
            style={{
              background:
                'radial-gradient(closest-side, rgba(124,108,255,0.85), rgba(124,108,255,0))',
              y: auroraY,
            }}
            animate={{ x: ['-4%', '6%', '-4%'], scale: [1, 1.12, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[52%] right-[2%] h-[46vh] w-[46vw] rounded-full opacity-[0.1] blur-[140px]"
            style={{
              background:
                'radial-gradient(closest-side, rgba(95,227,192,0.7), rgba(95,227,192,0))',
            }}
            animate={{ x: ['5%', '-5%', '5%'], scale: [1.08, 1, 1.08] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Technical grid with parallax */}
      <motion.div
        className="fx-grid absolute -inset-y-[20%] inset-x-0"
        style={reduce ? { opacity: 0.28 } : { y: gridY, opacity: gridOpacity }}
      />

      {/* Vignette + grain */}
      <div className="fx-vignette absolute inset-0" />
      <div className="fx-noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  )
}
