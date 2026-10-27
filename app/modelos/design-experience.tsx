'use client';
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Menu, Pause, Play, X } from 'lucide-react';
import { demos, type DemoSlug } from './catalog';
import { resolveVisual, visualProfiles, visualStyles, type VisualStyle } from './visuals';

const DesignContext = createContext<VisualStyle>('minimal');
export function DesignExperience({ slug, children }: { slug: DemoSlug; children: ReactNode }) {
  const [visual, setVisual] = useState<VisualStyle>(visualProfiles[slug][0]);
  const [paused, setPaused] = useState(false);
  const [details, setDetails] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const style = visualStyles[visual];
  useEffect(() => {
    const restore = () => setVisual(resolveVisual(slug, new URLSearchParams(window.location.search).get('visual')));
    restore(); window.addEventListener('popstate', restore); return () => window.removeEventListener('popstate', restore);
  }, [slug]);
  useEffect(() => {
    if (!root.current) return;
    const targets = root.current.querySelectorAll('.d-main > section, .d-main > .d-page-title, .product-grid > article, .service-grid > *, .lesson-grid > *, .stat-grid > *, .plan-days > *, .ai-workspace > *, .automation-flow > *');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    targets.forEach((element, i) => { (element as HTMLElement).style.setProperty('--reveal-delay', `${Math.min(i % 4 * 65, 195)}ms`); element.classList.add('motion-ready'); observer.observe(element); });
    return () => { observer.disconnect(); targets.forEach(element => element.classList.remove('motion-ready', 'motion-visible')); };
  }, [visual]);
  const selectVisual = (next: VisualStyle) => {
    setVisual(next); const url = new URL(window.location.href); url.searchParams.set('visual', next); window.history.replaceState({}, '', url); setDetails(false);
  };
  return <DesignContext.Provider value={visual}><div ref={root} className={`design-experience visual-${visual} ${paused ? 'motion-paused' : ''}`} style={{ '--visual-highlight': style.colors[1] } as CSSProperties}>
    <div className="design-toolbar"><Link href="/modelos" className="design-toolbar-label">GALERIA DE EXPERIÊNCIAS <ArrowUpRight size={12} /></Link><div className="design-options" aria-label="Variação visual">{visualProfiles[slug].map((v, i) => <button key={v} aria-pressed={visual === v} className={visual === v ? 'selected' : ''} onClick={() => selectVisual(v)}><span>0{i + 1}</span>{visualStyles[v].name}</button>)}</div><button className="design-motion" aria-label={paused ? 'Ativar efeitos e animações' : 'Pausar efeitos e animações'} aria-pressed={paused} onClick={() => setPaused(p => !p)}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>Efeitos {paused ? 'pausados' : 'ativos'}</span></button><button className="design-info-toggle" aria-label="Sobre esta variação" aria-expanded={details} onClick={() => setDetails(v => !v)}><ChevronDown size={15} /></button></div>
    {details && <div className="design-style-info"><b>{style.name}</b><span>{style.tagline}</span><small>{style.nav} · {style.motion}</small></div>}
    <div className="design-ambient" aria-hidden="true"><i /><i /><i /></div>
    {children}
    <div className="design-next"><span>Outra forma de apresentar a mesma ideia.</span><div>{visualProfiles[slug].filter(v => v !== visual).map(v => <button key={v} onClick={() => { selectVisual(v); root.current?.scrollIntoView({ behavior: 'instant' }); }}>Experimentar {visualStyles[v].name.toLocaleLowerCase('pt-BR')} <ArrowUpRight size={14} /></button>)}</div><small>{demos.find(d => d.slug === slug)?.title} · 3 experiências visuais</small></div>
  </div></DesignContext.Provider>;
}

export function DemoNavigation({ items, value, onChange }: { items: string[]; value: string; onChange: (value: string) => void }) {
  const visual = useContext(DesignContext); const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [visual]);
  return <nav className={`d-tabs experience-nav ${open ? 'nav-expanded' : ''}`} aria-label="Navegação da aplicação"><button className="experience-menu-toggle" aria-expanded={open} aria-controls="experience-nav-items" onClick={() => setOpen(v => !v)}>{open ? <X size={15} /> : <Menu size={15} />}<span>{value}</span><small>MENU</small></button><div id="experience-nav-items" className="experience-nav-items">{items.map((item, i) => <button key={item} aria-current={value === item ? 'page' : undefined} className={value === item ? 'is-active' : ''} onClick={() => { onChange(item); setOpen(false); }}><span className="nav-index">0{i + 1}</span><span>{item}</span><span className="nav-pointer">↗</span></button>)}</div></nav>;
}
