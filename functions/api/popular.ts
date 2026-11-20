// Cloudflare Pages Function — most viewed stories from the ranked index
// KV binding required: VIEWS
const INDEX_KEY = 'popular:index';

export const onRequest = async (ctx: any) => {
  const url = new URL(ctx.request.url);
  const n = Math.min(parseInt(url.searchParams.get('n') || '5', 10) || 5, 20);
  const store = ctx.env.VIEWS;

  let items: any[] = [];
  if (store) {
    try {
      items = JSON.parse((await store.get(INDEX_KEY)) || '[]');
      if (!Array.isArray(items)) items = [];
    } catch (e) {
      items = [];
    }
  }

  const out = items
    .filter((i) => i && i.slug && i.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((i) => ({ slug: i.slug, count: i.count, title: i.title || '', cat: i.cat || '' }));

  return new Response(JSON.stringify(out), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=60',
    },
  });
};
