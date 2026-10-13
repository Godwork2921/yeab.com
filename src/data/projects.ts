export type Project = {
  id: string
  index: string
  title: string
  kicker: string
  year: string
  role: string
  status: string
  summary: string
  stack: string[]
  /** Visual system key — selects the bespoke architecture diagram */
  visual: 'translation' | 'ticketing' | 'commerce' | 'roadguard' | 'negarit'
  /** Optional backdrop — see public/assets/README.md. Falls back to the live diagram. */
  image?: string
  accent: 'violet' | 'signal'
  detail: {
    problem: string
    approach: string
    architecture: string[]
    challenges: { title: string; body: string }[]
    learned: string[]
  }
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    id: 'amharic-english-mt',
    index: '01',
    title: 'Amharic ↔ English Machine Translation',
    kicker: 'Applied NLP · Research',
    year: '2026',
    role: 'Research & Engineering',
    status: 'Active research',
    summary:
      'An end-to-end machine translation system for a language pair with scarce high-quality parallel data — built from corpus construction all the way through to evaluation.',
    stack: ['Python', 'NLP', 'Transformers', 'Sentence Embeddings', 'Machine Translation'],
    visual: 'translation',
    image: '/assets/images/projects/machine-translation.png',
    accent: 'violet',
    detail: {
      problem:
        'Amharic is a morphologically rich, low-resource language. Publicly available Amharic–English parallel corpora are small, noisy, frequently machine-generated, and inconsistent in domain and register. Off-the-shelf translation models degrade badly on it — fluent output, wrong meaning.',
      approach:
        'Rather than starting from a model, I started from data. The system is a pipeline: corpus acquisition and filtering, semantic quality scoring with sentence embeddings, Transformer fine-tuning, then a layered evaluation harness that measures more than aggregate BLEU.',
      architecture: [
        'Corpus ingestion & normalisation — dedup, length filtering, Unicode normalisation, language ID',
        'Semantic filter — dual-encoder cosine similarity against reference distribution to reject mistranslated and off-domain pairs',
        'Train / dev / test split with contamination checks across splits',
        'Transformer backbone fine-tuning with subword segmentation tuned for Amharic morphology',
        'Evaluation harness — BLEU, chrF, and targeted directional probes per domain and sentence length',
      ],
      challenges: [
        {
          title: 'Noisy parallel data',
          body: 'Machine-generated pairs in the corpus look grammatical but are semantically wrong. Embedding-similarity filtering against a reference distribution removed a large share of them — the single highest-leverage step in the whole pipeline.',
        },
        {
          title: 'Morphology and segmentation',
          body: 'Amharic verb morphology is productive and largely uninflected in the written form, so naive word-level tokenisation destroys grammatical information. Subword segmentation tuned for the script measurably outperformed the default.',
        },
        {
          title: 'Evaluation blind spots',
          body: 'Aggregate BLEU hid regressions that mattered. Breaking results down by direction, domain, and sentence length exposed failure modes a single scalar never would.',
        },
      ],
      learned: [
        'Data quality dominates model choice — a dirty corpus will cap a strong model, and a clean one will lift a modest one.',
        'Evaluation design is a modelling decision, not an afterthought.',
        'Every embedding-based filter has to be validated against human judgement or it just deletes your hardest examples.',
      ],
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/Godwork2921/EAII-Internship-MT-Project' },
    ],
  },
  {
    id: 'ticketing-reservation',
    index: '02',
    title: 'Ticketing Reservation System',
    kicker: 'Distributed Systems · Backend',
    year: '2026',
    role: 'Backend Architecture',
    status: 'Production-oriented',
    summary:
      'A reservation backend engineered around the one problem ticketing actually has: two people must never be able to hold the same seat.',
    stack: [
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'Flyway',
      'Docker',
      'Kafka',
      'Keycloak',
      'Microservices',
    ],
    visual: 'ticketing',
    image: '/assets/images/projects/ticketing-system.png',
    accent: 'violet',
    detail: {
      problem:
        'Seat inventory is a contended, non-idempotent resource. The hard part is not CRUD on events — it is guaranteeing that a seat hold is atomic, expiring correctly, and never double-sold under concurrent load, while the rest of the platform stays independently deployable.',
      approach:
        'I decomposed the domain along transaction boundaries rather than along noun boundaries, so each service owns exactly one reason to fail. Reservation is a short-lived lease with a deterministic expiry, and every downstream side effect is driven by an event.',
      architecture: [
        'Identity service — Keycloak-backed OAuth2 / OIDC, stateless JWT verification at every boundary',
        'Event service — catalogue, venues, seat inventory projection',
        'Reservation service — seat holds as leases with TTL expiry, uniqueness enforced in the database',
        'Payment service — consuming hold-created events, settlement and compensation on failure',
        'PostgreSQL as source of truth; Kafka for inter-service propagation and audit trail',
        'Flyway for versioned, reproducible schema migrations across every service',
      ],
      challenges: [
        {
          title: 'Concurrency and double-selling',
          body: 'Seat holds are protected with a conditional update — the hold only succeeds if the seat is still free, enforced by a unique constraint plus row locking. Combined with lease expiry this makes double-selling structurally impossible rather than merely unlikely.',
        },
        {
          title: 'Failure between hold and payment',
          body: 'A hold can outlive or precede a failed payment. I used the transactional outbox pattern so the hold-created event is published atomically with the state change, then relied on idempotent consumers and compensating release rather than distributed transactions.',
        },
        {
          title: 'Schema evolution across services',
          body: 'Several services shared tables. Flyway gave every service a versioned migration chain, so schema changes became reviewable, ordered, and reproducible rather than tribal knowledge.',
        },
      ],
      learned: [
        'Boundary a service by transaction boundary and failure mode first; entity names come second.',
        'Most "distributed" problems are really local problems wearing an expensive disguise.',
        'Idempotency is a design decision made at the edge, not a retry wrapper added at the consumer.',
      ],
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/Godwork2921/microservice-ticketing-system' },
      { label: 'Architecture', href: 'https://github.com/Godwork2921/microservice-ticketing-system' },
    ],
  },
  {
    id: 'hieemien',
    index: '03',
    title: 'Hieemien',
    kicker: 'Product · Mobile Commerce',
    year: '2025 — Present',
    role: 'Founder / Builder',
    status: 'Shipping',
    summary:
      'A fashion-commerce product concept for Ethiopian designers: mobile-first discovery, a Spring Boot commerce core, and digital payments tuned to how people actually buy locally.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Digital Payments', 'Product Design'],
    visual: 'commerce',
    image: '/assets/images/projects/hieemien.png',
    accent: 'signal',
    detail: {
      problem:
        'Ethiopian fashion exists in vibrant local commerce — markets, social media, word of mouth — but without a structured catalogue, sizing, or trust layer. The discovery experience is fragmented and the transaction often has to be completed over an app chat.',
      approach:
        'I treated it as a product problem first. The commerce core stays conventional and reliable; the value is in the discovery layer, the fit-confidence problem, and closing the loop on payment inside the app.',
      architecture: [
        'Catalogue and inventory services with variant-level stock tracking',
        'Mobile-first storefront tuned for low-bandwidth and mid-range devices',
        'Spring Boot commerce API — cart, checkout, order lifecycle',
        'Digital payment integration with webhook-confirmed settlement',
        'PostgreSQL catalogue with image assets behind a Dockerised object store',
      ],
      challenges: [
        {
          title: 'Fit and sizing confidence',
          body: 'Fashion online lives or dies on whether a customer trusts the size. Product pages needed real measurements and garment detail, not abstract S/M/L — that pushed the data model toward detailed variant attributes.',
        },
        {
          title: 'Building a brand from nothing',
          body: 'No audience, no supply relationships, no trust. As a solo founder the constraint was attention, not code, which forced ruthless prioritisation: one perfect product page beats ten broken ones.',
        },
      ],
      learned: [
        'Shipping taught me more about product decisions than any amount of building did.',
        'The last 20% of an e-commerce checkout is where trust is won or lost.',
        'Constraints — bandwidth, device class, trust — make better design decisions than freedom does.',
      ],
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/Godwork2921/Hie-emien' },
    ],
  },
  {
    id: 'roadguard-ai',
    index: '04',
    title: 'RoadGuard AI',
    kicker: 'Geospatial · AI Systems',
    year: '2026',
    role: 'Systems Design',
    status: 'Concept · In design',
    summary:
      'A road-safety platform concept that turns raw GPS traces and hazard reports into a live, queryable picture of where roads are actually dangerous.',
    stack: ['PostGIS', 'Redis Geo', 'Kafka', 'MinIO', 'Keycloak', 'Python', 'AI'],
    visual: 'roadguard',
    image: '/assets/images/projects/roadguard-ai.png',
    accent: 'violet',
    detail: {
      problem:
        'Road risk data is scattered, delayed, and usually only exists after an accident. But GPS traces are not. Roads where vehicles brake hard, speed drops sharply, or routes are repeatedly avoided already behave like accident statistics — the signal is there long before the report.',
      approach:
        'Ingest telemetry at volume, detect behavioural anomalies per road segment, and serve a queryable risk surface that consumers can hit by map viewport — with hot-segment state kept out of the database.',
      architecture: [
        'Telemetry ingestion — Kafka topics partitioned by geography, consumer groups for horizontal scale',
        'Spatial index — PostGIS segment geometry with GiST indexes and risk aggregation queries',
        'Hot-path cache — Redis Geo for viewport queries, so maps never hit primary storage',
        'Object store — MinIO for raw trace retention and replay',
        'Anomaly detection — braking, speed variance, and avoidance signals scored per segment',
        'Keycloak for identity and role-scoped access to hazard administration',
      ],
      challenges: [
        {
          title: 'Viewport queries at map speed',
          body: 'Maps fire a query per pan and zoom. Aggregating risk per viewport against PostGIS was workable but slow under movement, so hot segments are projected into Redis Geo and invalidated by ingestion events.',
        },
        {
          title: 'GPS is noisy',
          body: 'Raw traces contain urban-canyon drift, tunnel dropouts, and parking. The pipeline needs to treat positioning error as a first-class input rather than assuming every point is a real road observation.',
        },
        {
          title: 'Inference cost vs. freshness',
          body: 'Re-scoring every segment continuously is wasteful. Scored segments are versioned and only recomputed when new traces materially change the window.',
        },
      ],
      learned: [
        'Geo data has access patterns unlike any other kind of relational data — design for the viewport, not the table.',
        'Ingest and query want opposite guarantees; separating them is what makes the system scale.',
        'The signal is rarely in the label you have — it is in the behaviour you can already see.',
      ],
    },
    links: [{ label: 'GitHub', href: 'https://github.com/Godwork2921/roadguard-ai' }],
  },
  {
    id: 'negarit-ai',
    index: '05',
    title: 'Negarit AI',
    kicker: 'Security · Applied ML',
    year: '2026',
    role: 'ML Engineering & Backend',
    status: 'Building',
    summary:
      'An AI-powered cybersecurity platform that detects phishing messages, malicious URLs, and AI-generated deepfakes — pairing model inference with threat intelligence so the output is a risk score and a next action, not just an alert.',
    stack: ['Python', 'FastAPI', 'NLP', 'LLM', 'Threat Intel', 'URL Analysis', 'Docker'],
    visual: 'negarit',
    image: '/assets/images/projects/negarit-ai.png',
    accent: 'violet',
    detail: {
      problem:
        'Phishing has changed shape. The message no longer has to be badly written, and the video on the call no longer has to be obviously fake — generative models have removed the tells people were taught to look for. Meanwhile the classic defence, a blocklist of known-bad URLs, only catches attacks that someone else already reported. For an individual or a small team the gap is wide: real threats arrive before they are on any list, and the tooling that could help is either enterprise-priced or explains itself in threat-intelligence jargon nobody outside a SOC can act on.',
      approach:
        'Treat every untrusted artefact — text, link, or media — as the same problem with different surfaces. Analyse it, score it against both model inference and live threat intelligence, and return a single number with a plain-language reason and a concrete recommendation. The model says what the content looks like; the intelligence layer says what is known about it. Neither alone is trustworthy, so the score is an explicit combination of the two.',
      architecture: [
        'Ingestion gateway — messages, URLs, and media normalised into one analysis request shape',
        'Content analysis — NLP classifiers score linguistic and structural signals typical of social engineering',
        'URL intelligence — reputation, age, redirect chain, and hosting-asymmetry checks resolved in parallel',
        'Deepfake detection — frame-level consistency and audio-visual artefact analysis for synthetic media',
        'Threat intelligence layer — live feeds joined to model output; known-bad alone never fails the request',
        'Risk engine — model score and intelligence score fused into one verdict with stated reasoning',
        'FastAPI service layer — synchronous scoring for interactive use, queued scoring for bulk submission',
      ],
      challenges: [
        {
          title: 'A score a person can act on',
          body: 'Raw model probabilities are not advice. Anything below 0.6 is noise dressed as precision, and a number with no stated reason gets ignored or over-trusted. The output carries a band, a plain-language explanation, and a specific recommendation so the person receiving it knows what to do next.',
        },
        {
          title: 'The intelligence layer must never be the only defence',
          body: 'Feed outages and cold-start coverage are real: a domain registered this morning appears in no feed yet. Treating reputation as authoritative means a first-of-kind attack scores as clean. The model output carries the decision when intelligence is missing, and the response says which path produced the verdict.',
        },
        {
          title: 'Different media, one response shape',
          body: 'A URL, a message, and a video clip have almost nothing in common as data but need to reach the same consumer. Normalising early keeps the frontend, the risk engine, and the audit log identical across all three instead of forking per media type.',
        },
      ],
      learned: [
        'Detection accuracy is not the product — the decision is. A better score that changes nobody’s behaviour is a research result, not a shipped feature.',
        'For unseen attacks, model generalisation is the only line of defence, which makes the intelligence layer an accelerant rather than the foundation.',
        'Security tooling fails on legibility long before it fails on capability; the explanation is part of the feature.',
      ],
    },
    links: [{ label: 'GitHub', href: 'https://github.com/Godwork2921/Negarit-AI' }],
  },
]
