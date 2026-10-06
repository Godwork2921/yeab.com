export type Principle = { index: string; title: string; body: string }

export const philosophy: Principle[] = [
  {
    index: '01',
    title: 'Understand the problem.',
    body: 'Most engineering waste is solving the wrong problem efficiently. I try to state the real constraint — what is actually scarce, contended, or uncertain — before proposing anything.',
  },
  {
    index: '02',
    title: 'Design the system.',
    body: 'Data model, boundaries and failure modes first. Most decisions I regret were made by writing code before deciding who owns the truth.',
  },
  {
    index: '03',
    title: 'Build the smallest useful version.',
    body: 'A working slice end to end teaches me more than a complete design document. Real constraints only surface once something actually runs.',
  },
  {
    index: '04',
    title: 'Test assumptions.',
    body: 'I write down what I believe might be true, then try to break it deliberately. The goal is to be wrong cheaply and early.',
  },
  {
    index: '05',
    title: 'Measure.',
    body: 'Latency, error rate, recall, precision — pick the metric that reflects the actual requirement, not the one that is easiest to chart.',
  },
  {
    index: '06',
    title: 'Improve.',
    body: 'Optimise the bottleneck, not the codebase. Re-measure after each change, because the bottleneck usually moves.',
  },
  {
    index: '07',
    title: 'Ship.',
    body: 'Unshipped correctness has no value. Deploy behind a flag, observe it in production, and let reality finish the design.',
  },
]

export const profile = {
  name: 'Yeabsra Andargachew',
  short: 'Yeabsra',
  roles: ['Software Engineer', 'AI Engineer'],
  status: 'Available for building',
  location: 'Ethiopia',
  tagline:
    'I build intelligent systems and reliable software at the intersection of backend engineering and AI.',
  heroStatement: 'I like understanding how things work before I build them.',
  contactEmail: 'yeabsra2921@gmail.com',
  github: 'https://github.com/Godwork2921',
  githubHandle: 'github.com/Godwork2921',
  linkedin: 'https://www.linkedin.com/in/yeabsra-andargachew-640ab3355/',
  linkedinHandle: 'linkedin.com/in/yeabsra-andargachew',
}

/** Telemetry strings — texture, not data. */
export const telemetry = [
  { k: 'FOCUS', v: 'BACKEND / AI SYSTEMS' },
  { k: 'STACK', v: 'JAVA · SPRING · PYTHON' },
  { k: 'BUILDING', v: 'AMHARIC ↔ ENGLISH NMT' },
  { k: 'GRADUATING', v: '2027 · COMPUTER SCIENCE' },
]
