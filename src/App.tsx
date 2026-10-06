import { useState } from 'react'
import type { Project } from './data/projects'
import { projects } from './data/projects'
import { Atmosphere } from './components/fx/Atmosphere'
import { BackgroundField } from './components/fx/BackgroundField'
import { Cursor } from './components/fx/Cursor'
import { ScrollProgress } from './components/fx/ScrollProgress'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { ProjectModal } from './components/ProjectModal'
import { Experience } from './components/Experience'
import { Philosophy } from './components/Philosophy'
import { Lab } from './components/Lab'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Band } from './components/Band'

export default function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <>
      {/* Skip link — keyboard and screen-reader users land here first */}
      <a
        href="#main"
        className="sr-only rounded-full bg-accent px-4 py-2 font-mono text-xs tracking-widest text-white uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-200"
      >
        Skip to content
      </a>

      {/* Persistent layers, painted once, behind everything */}
      <Atmosphere />
      <BackgroundField />

      <ScrollProgress />
      <Cursor />
      <Navbar />

      <main id="main" className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Band />
        <Projects onOpen={setActiveProject} />
        <Experience />
        <Band reverse />
        <Philosophy />
        <Lab />
        <Contact />
      </main>

      <Footer />

      {/* One dialog instance for all four case studies */}
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />

      {/* Keeps the bundle honest: project count is data-driven */}
      <span className="sr-only">{projects.length} case studies available</span>
    </>
  )
}