# Arizona Spiritual Retreats Directory

A curated, static directory of 36 spiritual retreat centers, meditation facilities, and wellness organizations across Arizona, built with Astro.

## Build Variant (Step 2 Choices)

This build uses a specific set of styling and structural choices to differentiate from other directory projects:

- **Route Structure**: `/in/[city]/`, `/p/[retreat-name]/`, `/treatments/[service]/`
- **CSS Naming**: BEM-ish with `sr` prefix (`sr-card__title`, `sr-card__meta`)
- **Token Naming**: Role-based (`--surface-primary`, `--text-secondary`, `--accent-warm`)
- **Typography**: Lora (display) + Source Sans 3 (body)
- **Palette**: Forest green + teal with warm copper accent
- **Layout**: Two-column listing pages with right sidebar contact info
- **Copy Voice**: Considered editorial (descriptive, fact-forward)
- **Ranking**: Bayesian average protecting against outliers

## Data Summary

- **Total unique retreats**: 36 (deduplicated from 100 raw listings)
- **Cities represented**: 21 (Phoenix, Sedona, Prescott, Carefree, Peoria, and others)
- **Top locations**: Phoenix (10), Sedona (3), Prescott (2), Carefree (2), Peoria (2)
- **Average rating**: 4.88/5
- **Data freshness**: September 2024 (Google Business Profiles)

### Classification & Filtering

- **CORE** (retreat-focused): 65 listings
- **ADJACENT** (spiritual/related): 12 listings
- **EXCLUDED**: 23 listings (generic categories like vacation rentals, spas)
  - See `excluded.json` for exclusion details

### Deduplication

Merged duplicate records (same phone + address, different place IDs) keeping the higher-reviewed version. Reduced from 77 potential listings to 36 unique businesses.

## Key Features

### 1. Ranking System (Step 4)

Uses a **Bayesian average** to prevent rating outliers from dominating:

```
score = (PRIOR × datasetMean + n × rating) / (PRIOR + n)
PRIOR = 12 (generous benefit of the doubt)
```

- Display rating: Unmodified star rating shown to users
- Ranking score: Used internally for sort order only
- Featured listings: Always pin to #1 on their city page

### 2. Listing Copy (Step 5)

**No templates.** Every retreat description uses clause assembly with 4–6 phrasings per type:
- Location phrasing varies by hash of slug
- Rating language branches on review volume
- All facts from actual data; no generated adjectives

### 3. Visuals (Step 6)

**No scraped photography.** Instead:
- **Per-listing mark**: Deterministic duotone gradient + monogram (from name hash)
- **Category icon**: From type/subtypes
- **Page headers**: Abstract geometric patterns (arcs, waves, dots)
- **Disclosure**: Footer states "Artwork is generated decoration, not photography"

### 4. SEO & Structured Data (Step 7)

- Unique `<title>` and meta description per page
- Canonical URLs and correct `<h1>` structure
- `LocalBusiness` + `ItemList` JSON-LD on city pages
- Sitemap via `@astrojs/sitemap`
- ⚠️ **No aggregateRating** on third-party scraped data (per Google guidelines)
- Internal linking: homepage → cities → listings within 2 clicks

### 5. Monetization (Step 9)

**Paid Featured Placement**

```js
// src/config.mjs
export const PLACEMENTS = {
  featured: ['sedona-mago-retreat-wellness', '...'],  // Slugs pinned to #1
  showOpenSlotPitch: true,  // Show unsold slot banner
  pricing: { featuredPerMonth: 149, currency: 'USD' }
};
```

- One featured slot per city, max
- Visible "Featured" badge; ratings/reviews never altered
- Unsold slots show pitch banner
- Every profile includes claim CTA → `/claim/?listing=<slug>`

### 6. Required Pages (Step 10)

- `/`: Homepage with city grid
- `/in/[city]/`: City listing pages (ranked by Bayesian score)
- `/p/[retreat]/`: Individual retreat profiles with contact/hours/reviews
- `/treatments/[service]/`: Service category pages
- `/about/`: Data provenance, ranking method, exclusion criteria
- `/pricing/`: Featured placement pricing + owner FAQ
- `/contact/`: Contact form
- `/privacy/`: Data collection, removal policy (48-hour turnaround stated)
- `/404/`: Helpful 404 page

### 7. Validator (Step 8)

`scripts/validate.mjs` runs after every build and fails the build if:

- Missing/duplicate `<title>` or meta description
- Missing canonical, wrong `<h1>` count, missing `lang`
- Placeholder text (`undefined`, `NaN`, `[object Object]`)
- Broken internal links or orphan pages
- Pages missing from sitemap
- Near-duplicate copy (Jaccard > 0.7) > 5% of listings

## Launch Blockers

- [ ] **Domain**: Currently using `arizonaspiritualretreats.local`. Replace with real domain.
- [ ] **Form endpoint**: Set `email` in `src/config.mjs` and wire actual form handler (Formspree, Zapier, etc.)
- [ ] **Claim form verification**: Implement email domain check (business website domain vs. claim email)

## File Structure

```
arizona-spiritual-retreats/
├── src/
│   ├── config.mjs           # Site branding, placement, colors (EDIT THIS)
│   ├── data/
│   │   └── retreats.json    # Retreat database (36 listings)
│   ├── lib/
│   │   └── data.js          # Ranking, filtering utilities
│   ├── layouts/
│   │   └── Base.astro       # Main layout wrapper
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── about.astro
│   │   ├── pricing.astro
│   │   ├── contact.astro
│   │   ├── privacy.astro
│   │   ├── 404.astro
│   │   ├── in/[city].astro  # City listing pages
│   │   ├── p/[retreat].astro # Retreat profiles
│   │   └── treatments/[service].astro
│   └── components/
│       ├── Header.astro
│       ├── Footer.astro
│       ├── RetreatCard.astro
│       └── ...
├── scripts/
│   └── validate.mjs         # Post-build validation
├── public/               # Static assets
├── dist/                 # Built output (generated)
└── astro.config.mjs      # Astro configuration
```

## Build & Development

```bash
# Install dependencies
npm install

# Dev server
npm run dev

# Build + validate
npm run build

# Run validator only
npm run validate

# Preview production build
npm run preview
```

## Important Notes

### Why No Photography

Scraped photos belong to businesses, photographers, or reviewers — not licensable to the platform. Stock/AI photos mislabel generic images as specific retreats (false representation). Instead, generated marks are decorative, clearly indicated, and unique per business.

### Why No aggregateRating

Per Google's structured data guidelines, `aggregateRating` requires ratings from your own users, not third-party scrapes. Marking up scraped ratings risks manual action across the domain. We display stars with attribution but do not mark them up.

### Ranking Methodology

The Bayesian score is **displayed** to humans as an unmodified star rating. It is used **internally** to sort listings. This prevents a 5.0-star retreat with 3 reviews from outranking a 4.9-star retreat with 500 reviews.

## Data Source & Updates

- **Source**: Google Business Profiles (Outscraper scrape, September 2024)
- **Exclusion criteria**: See Step 1 classification in README
- **Deduplication**: Same phone + address, keeping highest-reviewed version
- **Update frequency**: Manual (regenerate from CSV/Supabase)
- **Removal policy**: 48-hour turnaround via `/privacy` contact form

## Disclaimer

Nothing on this site constitutes professional spiritual advice, medical advice, or endorsement. Listings reflect public business information; inclusion does not verify credentials or legitimacy. Users should verify details directly and consult appropriate professionals for health or legal matters. See `/privacy` for full terms.

---

**Next steps**:
1. Update domain in `astro.config.mjs` and `src/config.mjs`
2. Wire form endpoint in `src/config.mjs`
3. Review excluded listings (`excluded.json`)
4. Customize colors, fonts in `src/config.mjs`
5. Deploy to static host (Netlify, Vercel, AWS S3)
