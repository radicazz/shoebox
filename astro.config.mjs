import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://radicazz.github.io',
  base: '/shoebox',
  integrations: [tailwind({
    config: {
      applyBaseStyles: true,
    },
  })],
  output: 'static',
});
