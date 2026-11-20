// Cloudflare Pages Function — count one view, keep a ranked index
// KV binding required: VIEWS
const INDEX_KEY = 'popular:index';
const INDEX_SIZE = 50;

export const onRequest = async (ctx: any) => {
  const url = new URL(ctx.request.url);
  let slug = url.searchParams.get('slug') || '';
  let title = '';
  let cat = '';

  if (ctx.request.method === 'POST') {
    try {
      const body = await ctx.request.json();
      slug = body.slug || slug;
      title = body.title || '';
      cat = body.cat || '';
    } catch (e) {
      // ignore malformed body
    }
  }

  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const store = ctx.env.VIEWS;
  if (!store) {
    return new Response(JSON.stringify({ error: 'VIEWS binding missing' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const key = 'views:' + slug;

  if (ctx.request.method === 'POST') {
    const current = parseInt((await store.get(key)) || '0', 10) || 0;
    const next = current + 1;
    await store.put(key, String(next));

    // maintain the ranked index so /api/popular never depends on KV list()
    let index: any[] = [];
    try {
      index = JSON.parse((await store.get(INDEX_KEY)) || '[]');
      if (!Array.isArray(index)) index = [];
    } catch (e) {
      index = [];
    }

    const row = index.find((r) => r.slug === slug);
    if (row) {
      row.count = next;
      if (title) row.title = title;
      if (cat) row.cat = cat;
    } else {
      index.push({ slug, count: next, title, cat });
    }

    index.sort((a, b) => b.count - a.count);
    await store.put(INDEX_KEY, JSON.stringify(index.slice(0, INDEX_SIZE)));

    return new Response(JSON.stringify({ slug, views: next }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const views = parseInt((await store.get(key)) || '0', 10) || 0;
  return new Response(JSON.stringify({ slug, views }), {
    headers: { 'content-type': 'application/json' },
  });
};
