'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { demos, type DemoSlug } from './catalog';
import { visualProfiles, visualStyles, type VisualStyle } from './visuals';
import VariantPreview from './variant-preview';
import './preview-slider.css';

export default function PreviewSlider({ slug, initialVisual, autoPlay = true }: { slug: DemoSlug; initialVisual?: VisualStyle; autoPlay?: boolean }) {
  const styles = visualProfiles[slug]; const demo = demos.find(d => d.slug === slug)!;
  const [index, setIndex] = useState(() => Math.max(0, styles.findIndex(v => v === initialVisual)));
  const [stopped, setStopped] = useState(!autoPlay); const [hovered, setHovered] = useState(false); const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false); const [hidden, setHidden] = useState(false); const [reduced, setReduced] = useState(true);
  const root = useRef<HTMLDivElement>(null); const gesture = useRef<{ x: number; y: number } | null>(null); const swiped = useRef(false);
  const running = !stopped && !hovered && !focused && visible && !hidden && !reduced;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const preference = () => setReduced(media.matches); const visibility = () => setHidden(document.hidden);
    preference(); visibility(); media.addEventListener('change', preference); document.addEventListener('visibilitychange', visibility);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: .2 }) : null;
    if (root.current && observer) observer.observe(root.current); else setVisible(true);
    return () => { observer?.disconnect(); media.removeEventListener('change', preference); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setIndex(i => (i + 1) % styles.length), 5200 + demos.findIndex(d => d.slug === slug) % 4 * 350);
    return () => window.clearInterval(interval);
  }, [running, styles.length, slug]);
  const choose = (next: number) => { setIndex((next + styles.length) % styles.length); setStopped(true); };
  return <div ref={root} className="preview-slider" role="group" aria-roledescription="carrossel" aria-label={`Prévias de ${demo.title}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }} onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); choose(index + (e.key === 'ArrowRight' ? 1 : -1)); } }}>
    <div className="preview-slider-viewport" onPointerDown={e => { if (e.pointerType === 'mouse' && e.button !== 0) return; gesture.current = { x: e.clientX, y: e.clientY }; swiped.current = false; }} onPointerUp={e => { if (!gesture.current) return; const dx = e.clientX - gesture.current.x; const dy = e.clientY - gesture.current.y; gesture.current = null; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped.current = true; choose(index + (dx < 0 ? 1 : -1)); } }} onPointerCancel={() => { gesture.current = null; }} onClickCapture={e => { if (swiped.current) { e.preventDefault(); e.stopPropagation(); swiped.current = false; } }}>
      {styles.map((visual, i) => <div className={`preview-slide ${index === i ? 'is-current' : ''}`} key={visual} role="group" aria-roledescription="slide" aria-label={`${visualStyles[visual].name}, ${i + 1} de ${styles.length}`} aria-hidden={index !== i} inert={index !== i}><Link href={`/modelos/${slug}?visual=${visual}`} aria-label={`Abrir ${demo.title} no estilo ${visualStyles[visual].name}`} tabIndex={index === i ? 0 : -1} draggable={false}><VariantPreview slug={slug} visual={visual} /></Link></div>)}
    </div>
    <button type="button" className="preview-slider-arrow slide-previous" aria-label={`Prévia anterior de ${demo.title}`} onClick={() => choose(index - 1)}><ChevronLeft size={16} /></button><button type="button" className="preview-slider-arrow slide-next" aria-label={`Próxima prévia de ${demo.title}`} onClick={() => choose(index + 1)}><ChevronRight size={16} /></button>
    <div className="preview-slider-footer"><span className="preview-slider-caption" aria-live={stopped ? 'polite' : 'off'}><b>{String(index + 1).padStart(2, '0')} / 03</b>{visualStyles[styles[index]].name}</span><div className="preview-slider-dots" aria-label="Escolher prévia">{styles.map((visual, i) => <button type="button" key={visual} className={index === i ? 'is-current' : ''} aria-label={`Ver prévia ${visualStyles[visual].name}, ${i + 1} de 3`} aria-pressed={index === i} onClick={() => choose(i)} />)}</div><button type="button" className="preview-slider-pause" disabled={reduced} aria-label={reduced ? 'Troca automática desativada por movimento reduzido' : stopped ? `Ativar troca automática de ${demo.title}` : `Pausar troca automática de ${demo.title}`} title={reduced ? 'Movimento reduzido: use as setas para explorar' : stopped ? 'Ativar troca automática' : 'Pausar troca automática'} onClick={() => { setStopped(v => !v); setFocused(false); }}>{stopped || reduced ? <Play size={11} /> : <Pause size={11} />}</button></div>
  </div>;
}
