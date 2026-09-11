// Site configuration - update these to rebrand the entire directory

export const SITE_CONFIG = {
  // Brand
  name: 'Arizona Spiritual Retreats',
  tagline: 'Discover meditation centers, wellness facilities, and spiritual retreats across Arizona',
  description: 'A curated directory of Arizona spiritual retreats, meditation centers, yoga facilities, and wellness organizations.',
  url: 'https://arizonaspiritualretreats.local',

  // Contact
  email: 'hello@arizonaspiritualretreats.local',
  phone: '+1-480-RETREATS',

  // Data & Updates
  dataSource: 'Scraped from Google Business Profiles (September 2024)',
  lastUpdated: '2026-09-11',

  // SEO
  lang: 'en',
};

export const PLACEMENTS = {
  // Featured listings pinned to #1 position on their city pages
  featured: [
    'sedona-mago-retreat-wellness',
    'granite-hills-retreat-conference-center',
    'dharma-treasure-retreat-center'
  ],

  // Show "unsold slot" pitch banner
  showOpenSlotPitch: true,

  // Pricing tiers for featured placement
  pricing: {
    featuredPerMonth: 149,
    currency: 'USD'
  }
};

// Route structure (Step 2 variant)
export const ROUTES = {
  city: '/in/[slug]/',      // /in/sedona/, /in/phoenix/
  listing: '/p/[slug]/',    // /p/sedona-mago-retreat-wellness/
  service: '/treatments/[slug]/',  // /treatments/meditation/, /treatments/yoga/
};

// Typography palette (role-named tokens)
export const TYPOGRAPHY = {
  display: 'Lora',      // Serif for headings
  body: 'Source Sans 3' // Sans for body
};

// Color palette - forest/teal/warm accent theme
export const COLORS = {
  // Backgrounds
  '--surface-primary': '#fafaf8',    // Off-white
  '--surface-secondary': '#f5f3f0',  // Warm white

  // Text
  '--text-primary': '#2d2415',       // Deep charcoal
  '--text-secondary': '#6b5d52',     // Muted brown
  '--text-tertiary': '#9b8b7e',      // Light brown

  // Accents
  '--accent-primary': '#2d5f4f',     // Deep forest
  '--accent-secondary': '#4a7a6b',   // Medium forest
  '--accent-light': '#7eb5a3',       // Light teal
  '--accent-warm': '#c97a46',        // Warm copper

  // Functional
  '--border': '#e8e2d9',
  '--error': '#d84936',
  '--success': '#6b9b8c',
};

// BEM-ish class naming convention
export const NAMING = {
  prefix: 'sr',  // short for "spiritual retreats"
  style: 'bem'   // Block__Element--Modifier
};

// Copy voice: considered editorial
export const COPY = {
  style: 'editorial', // vs. 'factual' or 'consumer-guide'
};

// Disclaimer for regulated niche
export const DISCLAIMERS = {
  heading: 'Important Notice',
  text: 'This directory provides information about retreat centers and spiritual organizations in Arizona. Nothing on this site constitutes professional spiritual advice, medical advice, or an endorsement. Listings reflect business information from public sources; inclusion does not verify credentials, licensing, or legitimacy. Always verify business details directly and consult appropriate professionals for health or legal matters.'
};

// Required pages
export const REQUIRED_PAGES = [
  'about',
  'contact',
  'privacy',
  'pricing',
  '404'
];
