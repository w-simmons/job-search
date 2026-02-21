# Job Search

Cross-source semantic job search platform for the US market.

## Vision

A unified job search experience that aggregates listings from multiple sources (LinkedIn, Indeed, Greenhouse, company career pages, etc.) and enables semantic/AI-powered search to find the most relevant opportunities.

### Key Features (Planned)
- **Multi-source aggregation** - Single interface for jobs from 10+ sources
- **Semantic search** - Find jobs by meaning, not just keywords
- **Smart deduplication** - Same job posted on multiple boards? We'll catch it
- **Saved searches & alerts** - Get notified when new matching jobs appear
- **Application tracking** - Track what you've applied to and follow up

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle
- **Deployment:** Vercel

## Project Structure

```
job-search/
├── app/
│   ├── api/              # API routes
│   │   ├── jobs/         # Job CRUD & search
│   │   └── health/       # Health check
│   ├── (dashboard)/      # Main app pages
│   └── layout.tsx
├── lib/
│   ├── db/               # Database client + schema (Drizzle)
│   └── sources/          # Job source adapters
├── components/           # React components
└── drizzle/              # Database migrations
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (recommend [Neon](https://neon.tech))

### Setup

1. Clone the repo:
```bash
git clone https://github.com/w-simmons/job-search.git
cd job-search
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database URL
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Architecture

### Job Source Adapters

Each job source (LinkedIn, Indeed, etc.) implements the `JobSourceAdapter` interface in `lib/sources/`. This normalizes data from different APIs/scraping methods into a common format.

```typescript
interface JobSourceAdapter {
  name: string;
  search(params: SearchParams): Promise<RawJobListing[]>;
  healthCheck(): Promise<boolean>;
}
```

### Database Schema

- **jobs** - Aggregated job listings from all sources
- **saved_searches** - User-defined search queries with optional alerts
- **job_interactions** - Track views, saves, applications

### API Routes

- `GET /api/jobs` - List/search stored jobs
- `POST /api/jobs/search` - Trigger fresh search across sources
- `GET /api/health` - System health check

## Development

```bash
# Run dev server
npm run dev

# Generate Drizzle migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio

# Type check
npm run lint
```

## Adding a New Job Source

1. Create adapter in `lib/sources/your-source.ts`
2. Implement `JobSourceAdapter` interface
3. Register in `lib/sources/index.ts`
4. Add any required credentials to `.env.example`

## License

Private - All rights reserved.
