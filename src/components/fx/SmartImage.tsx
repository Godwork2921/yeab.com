import { useState } from 'react'
import { cn } from '../../lib/utils'

/**
 * Image that degrades silently. If the file is absent (as the placeholder
 * assets are), the element is removed entirely and the layered CSS artwork
 * underneath becomes the visible layer. Never renders a broken-image glyph.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  fill = true,
  opacity = 0.42,
  loading = 'lazy',
  decoding = 'async',
}: {
  src?: string
  alt: string
  className?: string
  imgClassName?: string
  /** Fill the nearest positioned ancestor (backdrops). Off for inline marks. */
  fill?: boolean
  /** Backdrops sit low so the live diagram stays readable; marks need full opacity. */
  opacity?: number
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return null

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={() => setFailed(true)}
      className={cn(
        // Sizing is only baked in for backdrops; inline marks size themselves
        fill && 'absolute inset-0 h-full w-full object-cover',
        className,
        imgClassName,
      )}
      style={{ opacity }}
    />
  )
}