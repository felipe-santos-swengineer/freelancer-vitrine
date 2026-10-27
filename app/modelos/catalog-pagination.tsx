'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paginate, pageForSlug } from './pagination';
import './catalog-pagination.css';

export function usePagedCatalog<T extends { slug: string }>(items: readonly T[], criteria: string) {
  const [selection, setSelection] = useState({ criteria, page: 1 });
  const latest = useRef({ items, criteria }); latest.current = { items, criteria };
  const results = useRef<HTMLDivElement>(null);
  const pagination = paginate(items, selection.criteria === criteria ? selection.page : 1);
  useEffect(() => { setSelection(current => current.criteria === criteria ? current : { criteria, page: 1 }); }, [criteria]);
  useEffect(() => {
    const openLinkedModel = () => {
      let slug = ''; try { slug = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const page = pageForSlug(latest.current.items, slug); if (page === null) return;
      setSelection({ criteria: latest.current.criteria, page });
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: 'start', behavior: 'instant' }));
    };
    openLinkedModel(); window.addEventListener('hashchange', openLinkedModel);
    return () => window.removeEventListener('hashchange', openLinkedModel);
  }, []);
  const goToPage = (page: number) => {
    setSelection({ criteria, page });
    const url = new URL(window.location.href); let linked = ''; try { linked = decodeURIComponent(url.hash.slice(1)); } catch { /* Ignore malformed anchors. */ }
    if (pageForSlug(items, linked) !== null) { url.hash = ''; window.history.replaceState({}, '', url); }
    requestAnimationFrame(() => { results.current?.focus({ preventScroll: true }); results.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); });
  };
  return { pagination, results, goToPage };
}

export default function CatalogPagination({ page, totalPages, total, start, end, onChange }: { page: number; totalPages: number; total: number; start: number; end: number; onChange: (page: number) => void }) {
  if (!total) return null;
  return <div className="catalog-pagination"><p role="status">Exibindo <b>{start}–{end}</b> de <b>{total}</b> modelos</p>{totalPages > 1 && <nav aria-label="Páginas dos modelos"><button type="button" className="pagination-direction" disabled={page === 1} aria-label="Página anterior" onClick={() => onChange(page - 1)}><ChevronLeft size={15} /><span>Anterior</span></button><div className="catalog-page-numbers">{Array.from({ length: totalPages }, (_, i) => i + 1).map(n => <button type="button" key={n} aria-label={`Ir para página ${n}`} aria-current={n === page ? 'page' : undefined} className={page === n ? 'current-page' : ''} onClick={() => onChange(n)}>{n}</button>)}</div><button type="button" className="pagination-direction" disabled={page === totalPages} aria-label="Próxima página" onClick={() => onChange(page + 1)}><span>Próxima</span><ChevronRight size={15} /></button></nav>}</div>;
}
