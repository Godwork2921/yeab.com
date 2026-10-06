import { useEffect, useState } from 'react'

/** Matches a CSS media query and stays in sync. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True on devices with a real hover-capable pointer (i.e. not touch). */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 47.99rem)')
}

/**
 * Below `lg` the wide diagrams stop being readable, so sections swap to a
 * purpose-built layout instead of scaling the desktop one down.
 */
export function useIsCompact(): boolean {
  return useMediaQuery('(max-width: 63.99rem)')
}

/** Locks body scroll while `active`, compensating for the scrollbar width. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const { body } = document
    const prevPadding = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.classList.add('is-locked')
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.classList.remove('is-locked')
      body.style.paddingRight = prevPadding
    }
  }, [active])
}

/** Calls `handler` on Escape. */
export function useEscape(active: boolean, handler: () => void) {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, handler])
}

/**
 * Minimal scroll-spy: returns the id of the section currently occupying the
 * middle of the viewport. Cheap because it only fires on threshold changes.
 */
export function useScrollSpy(ids: string[], offset = 0.42): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.innerHeight * offset
      let current: string | null = null

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= line) current = id
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return active
}

/** True once the page has scrolled past `px`. */
export function useScrolledPast(px = 24): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setPast(window.scrollY > px)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [px])

  return past
}
