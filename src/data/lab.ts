export type LabTopic = {
  id: string
  label: string
  status: string
  progress: number
  note: string
  /** Position on the board (0–1 normalised) */
  x: number
  y: number
}

export const labTopics: LabTopic[] = [
  {
    id: 'llm',
    label: 'LLMs',
    status: 'Reading + building',
    progress: 68,
    note: 'Attention mechanics, decoding strategies, evaluation harnesses.',
    x: 0.5,
    y: 0.2,
  },
  {
    id: 'mt',
    label: 'Machine Translation',
    status: 'Primary research',
    progress: 74,
    note: 'Low-resource NMT. Amharic–English parallel data and fine-tuning.',
    x: 0.19,
    y: 0.36,
  },
  {
    id: 'nlp',
    label: 'NLP',
    status: 'Daily practice',
    progress: 82,
    note: 'Tokenisation for morphologically rich scripts, embeddings, retrieval.',
    x: 0.81,
    y: 0.37,
  },
  {
    id: 'aeng',
    label: 'AI Engineering',
    status: 'Applied',
    progress: 61,
    note: 'Getting models behind a real API: latency, cost, failure modes.',
    x: 0.29,
    y: 0.63,
  },
  {
    id: 'dist',
    label: 'Distributed Systems',
    status: 'Deepening',
    progress: 58,
    note: 'Consistency, idempotency, outbox patterns, partial failure.',
    x: 0.72,
    y: 0.64,
  },
  {
    id: 'micro',
    label: 'Microservices',
    status: 'In practice',
    progress: 71,
    note: 'Transaction boundaries as service boundaries. Spring Boot + Kafka.',
    x: 0.5,
    y: 0.83,
  },
  {
    id: 'backend',
    label: 'Backend Architecture',
    status: 'Core discipline',
    progress: 88,
    note: 'Java, Spring Boot, PostgreSQL. Designing for the failure modes.',
    x: 0.08,
    y: 0.84,
  },
]

/** Edges of the research board — topics that inform each other */
export const labLinks: [string, string][] = [
  ['llm', 'nlp'],
  ['llm', 'mt'],
  ['nlp', 'mt'],
  ['mt', 'aeng'],
  ['llm', 'aeng'],
  ['aeng', 'backend'],
  ['dist', 'micro'],
  ['micro', 'backend'],
  ['dist', 'aeng'],
  ['micro', 'nlp'],
]
