import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SectionHead } from './ui/Section'
import {
  categoryBlurb,
  categoryOrder,
  clusters,
  skillLinks,
  skills,
  type SkillCategory,
} from '../data/skills'
import { Reveal } from './fx/Reveal'
import { useIsCompact } from '../lib/hooks'
import { cn } from '../lib/utils'
import { EASE_EXPO } from '../lib/motion'

type Active = { id: string | null; cat: SkillCategory | null }

/**
 * Graph-based skills: adjacency is declared in data, so the map shows how the
 * technologies actually compose into architectures. Below `lg` the graph is
 * swapped for a purpose-built list rather than scaled down into mush.
 */
export function Skills() {
  const reduce = useReducedMotion()
  const compact = useIsCompact()
  const [active, setActive] = useState<Active>({ id: null, cat: null })
  const [hoverCat, setHoverCat] = useState<SkillCategory | null>(null)

  const links = useMemo(() => {
    const m = new Map(skills.map((s) => [s.id, s]))
    return skillLinks
      .map(([a, b]) => ({ a, b, pa: m.get(a), pb: m.get(b) }))
      .filter((e) => e.pa && e.pb) as Array<{
      a: string
      b: string
      pa: (typeof skills)[number]
      pb: (typeof skills)[number]
    }>
  }, [])

  const adj = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const s of skills) map.set(s.id, [])
    for (const [a, b] of skillLinks) {
      map.set(a, [...(map.get(a) ?? []), b])
      map.set(b, [...(map.get(b) ?? []), a])
    }
    return map
  }, [])

  const related = (id: string | null) => (id ? (adj.get(id) ?? []) : [])

  return (
    <section id="skills" className="relative overflow-x-clip py-24 md:py-32">
      <div className="shell">
        <SectionHead
          index="02"
          eyebrow="Skills"
          title="A technical system, not a list"
          lede="Technologies I reach for because they solve real engineering problems — with the connections that show how they compose into architectures."
        />

        {/* WIDE — SVG constellation */}
        {!compact && (
          <Reveal>
            <div className="mt-14 md:mt-20">
              <svg
                viewBox="0 0 1000 640"
                className="h-auto w-full"
                onPointerLeave={() => {
                  setActive({ id: null, cat: null })
                  setHoverCat(null)
                }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Edges */}
                {links.map((e) => {
                  const activeLine =
                    active.id !== null &&
                    (active.id === e.a || active.id === e.b) &&
                    related(active.id).includes(e.a === active.id ? e.b : e.a)

                  const catLine = hoverCat !== null && (e.pa.category === hoverCat || e.pb.category === hoverCat)

                  const dim = active.id !== null && !activeLine

                  return (
                    <motion.line
                      key={`${e.a}-${e.b}`}
                      x1={e.pa.d[0]}
                      y1={e.pa.d[1]}
                      x2={e.pb.d[0]}
                      y2={e.pb.d[1]}
                      stroke="rgba(150,140,255,0.16)"
                      animate={{
                        opacity: catLine ? 1 : activeLine ? 0.8 : dim ? 0.12 : 0.38,
                        strokeWidth: activeLine || catLine ? 2.2 : 1.2,
                      }}
                      transition={{ duration: 0.5, ease: EASE_EXPO }}
                    />
                  )
                })}

                {/* Cluster hubs */}
                {categoryOrder.map((c) => {
                  const cl = clusters[c]
                  const selected = hoverCat === c || active.cat === c
                  return (
                    <g key={c}>
                      <circle
                        cx={cl.d[0]}
                        cy={cl.d[1]}
                        r="48"
                        className="fill-bg-raise/40 stroke-bg-line"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx={cl.d[0]}
                        cy={cl.d[1]}
                        r="24"
                        className={selected ? 'fill-accent/50' : 'fill-accent/24'}
                      />
                      <text
                        x={cl.d[0]}
                        y={cl.d[1] + 72}
                        textAnchor="middle"
                        className="label-mono fill-muted"
                      >
                        {cl.label}
                      </text>
                    </g>
                  )
                })}

                {/* Nodes */}
                {skills.map((s) => {
                  const isSelf = active.id === s.id
                  const isRel = active.id !== null && related(active.id).includes(s.id)
                  const inCat = hoverCat === s.category || active.cat === s.category
                  const dim = active.id !== null && !isRel && !isSelf

                  return (
                    <g
                      key={s.id}
                      onPointerEnter={() => {
                        setActive({ id: s.id, cat: s.category })
                        setHoverCat(s.category)
                      }}
                      onFocus={() => {
                        setActive({ id: s.id, cat: s.category })
                        setHoverCat(s.category)
                      }}
                      onClick={() => {
                        setActive({ id: s.id, cat: s.category })
                        setHoverCat(s.category)
                      }}
                      className="cursor-pointer select-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${s.label} — ${s.category}`}
                    >
                      {isSelf && !reduce && (
                        <motion.circle
                          cx={s.d[0]}
                          cy={s.d[1]}
                          r="16"
                          className="fill-accent/18"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, ease: EASE_EXPO }}
                        />
                      )}
                      <motion.circle
                        cx={s.d[0]}
                        cy={s.d[1]}
                        animate={{ r: isSelf ? 7.5 : 6.2 }}
                        transition={{ duration: 0.4, ease: EASE_EXPO }}
                        className={cn(
                          'transition-[fill,stroke,opacity] duration-500',
                          isRel || isSelf || inCat
                            ? 'fill-accent stroke-accent-soft/90'
                            : 'fill-white/60 stroke-white/30',
                        )}
                        style={{
                          opacity: dim ? 0.22 : 1,
                          filter: isRel || isSelf ? 'url(#glow)' : 'none',
                        }}
                      />
                      <text
                        x={s.d[0]}
                        y={s.d[1] - 15}
                        textAnchor="middle"
                        className="font-mono text-[0.72rem] tracking-[0.08em] uppercase transition-opacity duration-500"
                        fill={isSelf || isRel || inCat ? '#F2F5F9' : '#7D8899'}
                        style={{ opacity: dim ? 0.18 : 1 }}
                      >
                        {s.label}
                      </text>
                    </g>
                  )
                })}
              </svg>

              <div className="mt-6 flex flex-col gap-2 md:mt-8">
                {categoryOrder.map((c) => (
                  <div key={c} className="flex flex-wrap items-center gap-3 border-t border-bg-line/50 py-3">
                    <span className="label-mono w-28 text-muted">{clusters[c].label}</span>
                    <p className="max-w-[60ch] text-sm text-muted">{categoryBlurb[c]}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* COMPACT — readable list replaces the graph */}
        {compact && (
          <div className="mt-12 space-y-10">
            {categoryOrder.map((c) => (
              <Reveal key={c}>
                <div>
                  <span className="label-mono text-accent">{clusters[c].label}</span>
                  <p className="mt-2 max-w-[46ch] text-sm text-muted">{categoryBlurb[c]}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills
                      .filter((s) => s.category === c)
                      .map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex rounded-full border border-bg-line bg-bg-raise/70 px-3 py-1 font-mono text-[0.6875rem] tracking-[0.08em] uppercase text-muted"
                        >
                          {s.label}
                        </span>
                      ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {!reduce && !compact && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-40 left-[-10%] h-[40vh] w-[40vw] rounded-full bg-accent/10 blur-[150px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          />
        )}
      </div>
    </section>
  )
}