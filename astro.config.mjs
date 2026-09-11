export default {
  site: 'https://arizonaspiritualretreats.local',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    ssr: {
      external: ['astro']
    }
  }
};
