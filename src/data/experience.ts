export type Experience = {
  id: string
  org: string
  role: string
  period: string
  kind: string
  focus: string[]
  body: string
  current?: boolean
  /** Organisation mark — see public/assets/README.md. Omit and it degrades cleanly. */
  logo?: string
}

export const experience: Experience[] = [
  {
    id: 'ethiopian-ai-institute',
    org: 'Ethiopian AI Institute',
    role: 'AI Engineer · Machine Translation',
    period: '2026 — Present',
    kind: 'Research',
    current: true,
    logo: '/assets/images/projects/EAII.jpg',
    focus: ['Dataset preparation', 'NLP', 'Machine Translation', 'Transformers', 'Data quality', 'Evaluation'],
    body: 'Building Amharic–English translation systems end to end. Most of the work lives in the data: assembling and filtering parallel corpora, then designing evaluation that can actually detect a regression in a low-resource setting.',
  },
  {
    id: 'atlas',
    org: 'Atlas Computer Technology',
    role: 'Software Development · Full-Stack Engineering',
    period: 'June — August 2026',
    kind: 'Engineering',
    logo: '/assets/images/projects/atlas.jpg',
    focus: ['Spring Boot', 'Backend APIs', 'Full-stack', 'Service-oriented architecture'],
    body: 'Worked across the stack on service-oriented business systems. Backend APIs in Spring Boot, schema and persistence decisions, and the front-end work needed to make the whole thing usable rather than merely functional.',
  },
  {
    id: 'yodahie',
    org: 'YODAHIE',
    role: 'Founder · Builder',
    period: '2025 — Present',
    kind: 'Product',
    current: true,
    logo: '/assets/images/projects/yodahie.jpg',
    focus: ['Product engineering', 'Applied AI', 'Creative technology', 'Experimentation'],
    body: 'A studio I run to test ideas end to end — technology, AI and product craft together. Building things that were not asked for, to find out which ones are worth keeping.',
  },
]

export const education = {
  institution: 'University of Gondar',
  degree: 'Computer Science',
  expected: '2027',
}
