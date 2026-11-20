// Cloudflare Pages Function — most viewed stories
// KV binding required: VIEWS
export const onRequest = async (ctx: any) => {
  const url = new URL(ctx.request.url);
  const n = Math.min(parseInt(url.searchParams.get('n') || '5', 10) || 5, 20);
  const store = ctx.env.VIEWS;

  if (!store) {
    return new Response(JSON.stringify([]), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const list = await store.list({ prefix: 'views:', limit: 1000 });
  const items = [];

  for (const k of list.keys) {
    const meta: any = k.metadata || {};
    items.push({
      slug: k.name.replace('views:', ''),
      count: meta.count || 0,
      title: meta.title || '',
      cat: meta.cat || '',
    });
  }

  items.sort((a, b) => b.count - a.count);

  return new Response(JSON.stringify(items.slice(0, n)), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=120',
    },
  });
};
