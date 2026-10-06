export type SkillCategory = 'backend' | 'ai' | 'frontend' | 'infra'

export type Skill = {
  id: string
  label: string
  category: SkillCategory
  /** Desktop viewBox coords (1000 × 640) and mobile coords (400 × 1120) */
  d: [number, number]
  m: [number, number]
}

/** Cluster anchors used to draw category hubs */
export const clusters: Record<SkillCategory, { d: [number, number]; m: [number, number]; label: string }> = {
  backend: { d: [262, 168], m: [200, 150], label: 'Backend' },
  ai: { d: [742, 164], m: [200, 420], label: 'AI / ML' },
  frontend: { d: [258, 476], m: [200, 690], label: 'Frontend' },
  infra: { d: [744, 480], m: [200, 960], label: 'Infrastructure' },
}

export const skills: Skill[] = [
  // ── Backend ──────────────────────────────────────────────
  { id: 'java', label: 'Java', category: 'backend', d: [190, 74], m: [75, 95] },
  { id: 'spring', label: 'Spring Boot', category: 'backend', d: [300, 60], m: [200, 55] },
  { id: 'rest', label: 'REST APIs', category: 'backend', d: [356, 132], m: [325, 95] },
  { id: 'microservices', label: 'Microservices', category: 'backend', d: [336, 216], m: [325, 205] },
  { id: 'postgres', label: 'PostgreSQL', category: 'backend', d: [252, 248], m: [200, 245] },
  { id: 'flyway', label: 'Flyway', category: 'backend', d: [150, 200], m: [75, 205] },

  // ── AI / ML ──────────────────────────────────────────────
  { id: 'python', label: 'Python', category: 'ai', d: [668, 62], m: [75, 365] },
  { id: 'nlp', label: 'NLP', category: 'ai', d: [742, 46], m: [200, 325] },
  { id: 'transformers', label: 'Transformers', category: 'ai', d: [790, 62], m: [325, 365] },
  { id: 'mt', label: 'Machine Translation', category: 'ai', d: [836, 134], m: [325, 475] },
  { id: 'embeddings', label: 'Embeddings', category: 'ai', d: [828, 216], m: [200, 515] },
  { id: 'eval', label: 'Model Evaluation', category: 'ai', d: [740, 252], m: [75, 475] },

  // ── Frontend ─────────────────────────────────────────────
  { id: 'javascript', label: 'JavaScript', category: 'frontend', d: [196, 408], m: [200, 605] },
  { id: 'react', label: 'React', category: 'frontend', d: [292, 388], m: [325, 690] },
  { id: 'html', label: 'HTML', category: 'frontend', d: [330, 470], m: [200, 775] },
  { id: 'css', label: 'CSS', category: 'frontend', d: [206, 540], m: [75, 690] },

  // ── Infrastructure ──────────────────────────────────────
  { id: 'docker', label: 'Docker', category: 'infra', d: [668, 386], m: [75, 905] },
  { id: 'kafka', label: 'Kafka', category: 'infra', d: [790, 380], m: [200, 865] },
  { id: 'keycloak', label: 'Keycloak', category: 'infra', d: [840, 470], m: [325, 905] },
  { id: 'redis', label: 'Redis', category: 'infra', d: [772, 556], m: [325, 1015] },
  { id: 'minio', label: 'MinIO', category: 'infra', d: [660, 562], m: [200, 1055] },
  { id: 'git', label: 'Git', category: 'infra', d: [598, 462], m: [75, 1015] },
]

/**
 * Declared adjacency — this is what turns the section from a list into a
 * system map. Edges exist because the technologies genuinely compose into
 * architectures, not because they sit near each other.
 */
export const skillLinks: [string, string][] = [
  // Backend internal
  ['java', 'spring'],
  ['spring', 'rest'],
  ['rest', 'microservices'],
  ['microservices', 'postgres'],
  ['postgres', 'flyway'],
  ['flyway', 'java'],

  // Backend ↔ Infrastructure
  ['spring', 'redis'],
  ['java', 'docker'],
  ['flyway', 'docker'],
  ['microservices', 'kafka'],
  ['microservices', 'keycloak'],
  ['docker', 'git'],
  ['git', 'kafka'],
  ['kafka', 'redis'],
  ['keycloak', 'docker'],
  ['minio', 'git'],

  // AI internal
  ['python', 'eval'],
  ['nlp', 'transformers'],
  ['transformers', 'mt'],
  ['mt', 'embeddings'],
  ['embeddings', 'eval'],
  ['transformers', 'embeddings'],
  ['nlp', 'mt'],
  ['python', 'nlp'],

  // AI ↔ Infrastructure
  ['python', 'docker'],
  ['eval', 'git'],

  // Frontend internal
  ['react', 'javascript'],
  ['react', 'html'],
  ['html', 'css'],
  ['css', 'javascript'],

  // Frontend ↔ Backend / Infra
  ['javascript', 'git'],
  ['rest', 'html'],
]

export const categoryOrder: SkillCategory[] = ['backend', 'ai', 'frontend', 'infra']

export const categoryBlurb: Record<SkillCategory, string> = {
  backend: 'Services, APIs and data — the load-bearing layer.',
  ai: 'Language models, embeddings and honest evaluation.',
  frontend: 'Interfaces that make complex systems feel obvious.',
  infra: 'The runtime: containers, streams, identity, storage.',
}
