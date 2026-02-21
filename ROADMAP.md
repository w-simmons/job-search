# Job Search Platform - Feature Roadmap

## Vision
Cross-source semantic job search for the US market. Find any job, anywhere, with intelligent matching and proactive monitoring.

---

## Core Features

### 1. 🔍 Unified Search
Search across all sources with a single query. Smart filters for location, salary, remote, experience level.

- **Keyword search** - Title, company, description
- **Semantic search** - "ML roles at AI startups" understands intent
- **Filters** - Location, salary range, remote, company size, industry
- **Sort** - Relevance, date posted, salary

### 2. 📊 Kanban Pipeline
Track your job hunt like a CRM. Move jobs through stages.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Discover   │→ │  Shortlist  │→ │   Applied   │→ │ Interviewing│
│   (inbox)   │  │   (saved)   │  │  (tracking) │  │  (active)   │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

- **Discover** - New jobs from saved searches
- **Shortlist** - Jobs you're interested in
- **Applied** - Track where you've applied
- **Interviewing** - Active interview processes
- **Archive** - Hidden/rejected/closed

### 3. 🔔 Smart Alerts
Get notified when new jobs match your criteria.

- **Saved searches** - Save any search as an alert
- **Frequency** - Real-time, daily digest, weekly summary
- **Channels** - Email, push notification, Slack
- **Smart ranking** - Best matches at the top

### 4. 🤖 Background Scraping
Continuous ingestion from multiple sources.

- **Multi-source** - LinkedIn, Indeed, Greenhouse, Lever, company sites
- **Deduplication** - Same job from multiple sources = one entry
- **Freshness** - Track when jobs go stale or get removed
- **Company normalization** - "Anthropic" = "Anthropic, Inc."

### 5. 🧠 Semantic Matching
Understand job similarity and fit.

- **Embeddings** - Every job gets a vector embedding
- **Similar jobs** - "Show me jobs like this one"
- **Resume matching** - (v2) Upload resume, get matched
- **Skill extraction** - Auto-detect skills from descriptions

---

## Experience Flow

### First Visit
1. Land on search page
2. Enter search (e.g., "senior engineer SF")
3. See results from all sources
4. Save search → creates alert
5. Shortlist interesting jobs

### Daily Use
1. Check "Discover" for new matches
2. Review, shortlist, or hide
3. Move shortlisted → Applied when you apply
4. Update status as you progress

### Power User
1. Multiple saved searches (different roles/locations)
2. Kanban view of full pipeline
3. Analytics: jobs applied, response rate
4. Export data for spreadsheet tracking

---

## Technical Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      FRONTEND                               │
│  Next.js 15 • React • Tailwind • shadcn/ui                 │
├────────────────────────────────────────────────────────────┤
│                      API LAYER                              │
│  Server Actions • tRPC or REST • Rate limiting             │
├────────────────────────────────────────────────────────────┤
│                     BACKGROUND                              │
│  Inngest • Scheduled scraping • Alert delivery             │
├────────────────────────────────────────────────────────────┤
│                     DATABASE                                │
│  Neon PostgreSQL • Drizzle ORM • pgvector                  │
├────────────────────────────────────────────────────────────┤
│                   JOB SOURCES                               │
│  TheirStack • Bloomberry • Fantastic.jobs • JobDataAPI     │
└────────────────────────────────────────────────────────────┘
```

---

## Phased Delivery

### Phase 1: Foundation ✅ (Current)
- [x] Repo setup with Next.js 16 + Drizzle
- [x] Database schema (jobs, saved_searches, interactions)
- [ ] **DB connected (Neon)** ← YOU ARE HERE
- [ ] Seed with dummy data
- [ ] Basic job list UI

### Phase 2: Core Search (Week 1)
- [ ] Search API with filters
- [ ] Job detail page
- [ ] Shortlist/hide actions
- [ ] Saved searches CRUD

### Phase 3: Pipeline UX (Week 2)
- [ ] Kanban board view
- [ ] Drag-and-drop status changes
- [ ] Notes on jobs
- [ ] Bulk actions

### Phase 4: Source Integration (Week 2-3)
- [ ] Copy source adapters from app-playground
- [ ] Connect 2-3 real APIs
- [ ] Deduplication logic
- [ ] Source health monitoring

### Phase 5: Automation (Week 3-4)
- [ ] Inngest integration
- [ ] Scheduled search runs
- [ ] Email alerts (Resend)
- [ ] Slack notifications

### Phase 6: Intelligence (Week 4+)
- [ ] pgvector setup
- [ ] OpenAI embeddings for jobs
- [ ] Semantic search
- [ ] Similar jobs feature

---

## API Keys Needed

| Service | Purpose | Pricing |
|---------|---------|---------|
| **Neon** | PostgreSQL database | Free tier available |
| **OpenAI** | Embeddings (text-embedding-3-small) | ~$0.02/1M tokens |
| **JobDataAPI** | Job listings + vector search | $97/mo unlimited |
| **Bloomberry** | High-quality job data | $0.006/job |
| **Resend** | Email alerts | Free tier available |
| **Inngest** | Background jobs | Free tier available |

---

## Success Metrics

1. **Coverage** - # of unique jobs in database
2. **Freshness** - % of jobs < 7 days old
3. **Dedup rate** - % of duplicates caught
4. **Search latency** - P95 < 200ms
5. **Alert accuracy** - % of alerts that are relevant

---

## Open Questions

1. **Auth** - Do we need user accounts? Or local-first?
2. **Mobile** - PWA or native app later?
3. **Pricing** - Free tool or paid tiers?
4. **Data retention** - How long to keep old jobs?

---

*Last updated: 2026-02-21*
