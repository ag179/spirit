import sitemap from '@astrojs/sitemap';

export default {
  site: 'https://arizonaspiritualretreats.local',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    ssr: {
      external: ['astro']
    }
  }
};
