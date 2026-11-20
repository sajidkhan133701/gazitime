import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** newest first — the single ordering rule for the whole site */
const byDate = (a: Post, b: Post) => b.data.date.valueOf() - a.data.date.valueOf();

export const href = (p: Post) => `/news/${p.id}/`;
export const img = (p: Post) => p.data.image ?? '/images/city.jpg';
export const catOf = (p: Post) => p.data.category;

export async function allPosts(): Promise<Post[]> {
  return (await getCollection('blog')).filter((p) => !p.data.draft).sort(byDate);
}

/** latest N, optionally skipping ids already used on the page */
export function latest(posts: Post[], n: number, exclude: string[] = []): Post[] {
  const skip = new Set(exclude);
  const out: Post[] = [];
  for (const p of posts) {
    if (skip.has(p.id)) continue;
    out.push(p);
    if (out.length === n) break;
  }
  return out;
}

export function byCategory(posts: Post[], slug: string, n?: number): Post[] {
  const list = posts.filter((p) => p.data.category === slug);
  return typeof n === 'number' ? list.slice(0, n) : list;
}

/**
 * Editor pins first, then newest.
 * If a pinned id disappears the slot is filled automatically, so a section
 * can never be short or stale.
 */
export function fill(posts: Post[], pinnedIds: string[] = [], n = 4, exclude: string[] = []): Post[] {
  const skip = new Set(exclude);
  const pinned = pinnedIds
    .map((id) => posts.find((p) => p.id === id))
    .filter((p): p is Post => Boolean(p) && !skip.has(p!.id));
  const seen = new Set(pinned.map((p) => p.id));
  const rest = posts.filter((p) => !seen.has(p.id) && !skip.has(p.id));
  return [...pinned, ...rest].slice(0, n);
}

/** Pinned + newest of one category; falls back to site-wide latest if thin */
export function section(posts: Post[], slug: string, _pinnedIds: string[] = [], n = 4): Post[] {
  const cat = byCategory(posts, slug, n);
  if (cat.length >= n) return cat;
  return fill(posts, cat.map((p) => p.id), n);
}

/** Most read. Falls back to newest when view counts are not tracked yet. */
export function popular(posts: Post[], n: number): Post[] {
  const withViews = posts.filter((p) => (p.data.views ?? 0) > 0);
  if (withViews.length === 0) return posts.slice(0, n);
  return [...withViews]
    .sort((a, b) => (b.data.views ?? 0) - (a.data.views ?? 0) || byDate(a, b))
    .slice(0, n);
}

/** Editor-flagged breaking news, else the newest stories */
export function breaking(posts: Post[], n: number): Post[] {
  const flagged = posts.filter((p) => p.data.breaking);
  return (flagged.length ? flagged : posts).slice(0, n);
}

/** Same category first, then newest overall — never empty, never the current post */
export function related(posts: Post[], post: Post, n = 4): Post[] {
  const same = posts.filter((p) => p.id !== post.id && p.data.category === post.data.category);
  const others = posts.filter((p) => p.id !== post.id && p.data.category !== post.data.category);
  return [...same, ...others].slice(0, n);
}
