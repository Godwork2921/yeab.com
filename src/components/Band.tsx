import { Marquee } from './fx/Marquee'
import { useReducedMotion } from 'motion/react'

const A = ['JAVA', 'SPRING BOOT', 'POSTGRESQL', 'PYTHON', 'TRANSFORMERS', 'KAFKA', 'DOCKER', 'NLP', 'REDIS', 'FLYWAY']

/**
 * Full-bleed divider band. Breaks the page without turning it into separate
 * rectangles — the ticker carries over from one section to the next.
 */
export function Band({ reverse = false }: { reverse?: boolean }) {
  const reduce = useReducedMotion()

  return (
    <div
      className="relative border-y border-bg-line/60 bg-bg-raise/25 py-4 backdrop-blur-sm"
      aria-hidden
    >
      <div style={reverse && !reduce ? { transform: 'scaleX(-1)' } : undefined}>
        <Marquee speed={52}>
          {A.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10">
              <span className="font-display text-[0.9375rem] font-medium tracking-[0.16em] whitespace-nowrap text-muted uppercase">
                {item}
              </span>
              <span className="size-1 shrink-0 rounded-full bg-accent/50" />
            </span>
          ))}
        </Marquee>
      </div>
      {/* Hairline fade at both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-bg to-transparent" />
    </div>
  )
}