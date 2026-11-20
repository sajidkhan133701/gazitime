import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allPosts, href } from '../lib/feed';
import site from '../data/site.json';

export async function GET(context: APIContext) {
  const posts = await allPosts();
  return rss({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    site: context.site ?? 'https://gazitime.online',
    items: posts.slice(0, 40).map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.dek ?? '',
      link: href(p),
      categories: [p.data.category],
    })),
    customData: '<language>bn-bd</language>',
  });
}
