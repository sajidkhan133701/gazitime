// Cloudflare Pages Function — one view per page load
// KV binding required: VIEWS
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

  const key = 'views:' + slug;
  const store = ctx.env.VIEWS;

  if (!store) {
    return new Response(JSON.stringify({ error: 'VIEWS binding missing' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (ctx.request.method === 'POST') {
    const current = parseInt((await store.get(key)) || '0', 10) || 0;
    const next = current + 1;
    await store.put(key, String(next), {
      metadata: { count: next, title, cat, updated: Date.now() },
    });
    return new Response(JSON.stringify({ slug, views: next }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const views = parseInt((await store.get(key)) || '0', 10) || 0;
  return new Response(JSON.stringify({ slug, views }), {
    headers: { 'content-type': 'application/json' },
  });
};
