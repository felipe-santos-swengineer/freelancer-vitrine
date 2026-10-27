export const CATALOG_PAGE_SIZE = 6;
export function paginate<T>(items: readonly T[], requestedPage: number, size = CATALOG_PAGE_SIZE) {
  const pageSize = Number.isFinite(size) && size >= 1 ? Math.floor(size) : CATALOG_PAGE_SIZE;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1));
  const offset = (page - 1) * pageSize;
  return { items: items.slice(offset, offset + pageSize), page, totalPages, total, start: total ? offset + 1 : 0, end: Math.min(offset + pageSize, total) };
}
export function pageForSlug(items: readonly { slug: string }[], slug: string) {
  const index = items.findIndex(item => item.slug === slug);
  return index < 0 ? null : Math.floor(index / CATALOG_PAGE_SIZE) + 1;
}
