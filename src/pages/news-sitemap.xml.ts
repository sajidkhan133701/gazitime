import type { APIContext } from 'astro';
import { allPosts, href } from '../lib/feed';

const ORIGIN = 'https://gazitime.online';

export async function GET(_context: APIContext) {
  const posts = await allPosts();
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = posts.filter((p) => p.data.date.valueOf() >= cutoff).slice(0, 1000);

  const urls = recent
    .map((p) => {
      const loc = `${ORIGIN}${href(p)}`;
      const date = new Date(p.data.date).toISOString();
      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>গাজী টাইম</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${date}</news:publication_date>
      <news:title><![CDATA[${p.data.title}]]></news:title>
      <news:keywords><![CDATA[গাজীপুর, গাজীপুরের খবর, স্থানীয় সংবাদ]]></news:keywords>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
