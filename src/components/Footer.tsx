import { profile } from '../data/profile'
import { DrawLine } from './ui/Section'

export function Footer() {
  return (
    <footer className="relative pb-10">
      <div className="shell">
        <DrawLine />

        <div className="flex flex-col gap-8 pt-8 md:flex-row md:items-end md:justify-between">
          {/* Identity */}
          <div className="flex flex-col gap-2">
            <p className="font-display text-[1.375rem] font-semibold tracking-tight text-ink">
              {profile.name}
            </p>
            <p className="font-mono text-[0.75rem] tracking-[0.1em] text-muted uppercase">
              Software Engineer · AI Engineer
            </p>
          </div>

          {/* Channels */}
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {[
              { label: 'GitHub', href: profile.github },
              { label: 'LinkedIn', href: profile.linkedin },
              { label: 'Email', href: `mailto:${profile.contactEmail}` },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.href.startsWith('mailto:')
                  ? {}
                  : { target: '_blank', rel: 'noreferrer noopener' })}
                data-cursor="open"
                className="group relative font-mono text-[0.75rem] tracking-[0.1em] text-muted uppercase transition-colors duration-400 hover:text-ink"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
        </div>

        {/* Colophon */}
        <div className="mt-10 flex flex-col gap-2 border-t border-bg-line/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-faint uppercase">
            © 2026 {profile.name}
          </p>
          <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-faint uppercase">
            Designed &amp; built from scratch · Move Forward · Live Your Dream
          </p>
        </div>
      </div>
    </footer>
  )
}