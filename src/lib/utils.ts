import categories from '../data/categories.json';

export const bnDate = (d: Date) =>
  new Intl.DateTimeFormat('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);

export const bnDateShort = (d: Date) =>
  new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'short' }).format(d);

export const catName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const catSlug = (slug: string) => slug;

export const readingTime = (body: string) => {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
};

export const excerpt = (text: string, max = 160) =>
  text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
