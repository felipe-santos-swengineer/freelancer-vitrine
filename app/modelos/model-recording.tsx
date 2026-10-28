'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { demos, type DemoSlug } from './catalog';
import { resolveVisual, visualStyles, type VisualStyle } from './visuals';
import './model-recording.css';

export default function ModelRecording({ slug, initialVisual, autoPlay = true }: { slug: DemoSlug; initialVisual?: VisualStyle; autoPlay?: boolean }) {
  const visual = resolveVisual(slug, initialVisual); const demo = demos.find(d => d.slug === slug)!;
  const [paused, setPaused] = useState(!autoPlay); const [visible, setVisible] = useState(false); const [hidden, setHidden] = useState(false); const [reduced, setReduced] = useState(true); const [unavailable, setUnavailable] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  const poster = `${basePath}/previews/${slug}-${visual}.jpg`; const gif = `${basePath}/previews/${slug}-${visual}.gif`;
  const playing = visible && !paused && !hidden && !reduced && !unavailable;
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)'); const updatePreference = () => setReduced(preference.matches); const updateVisibility = () => setHidden(document.hidden);
    updatePreference(); updateVisibility(); preference.addEventListener('change', updatePreference); document.addEventListener('visibilitychange', updateVisibility);
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: .15 }) : null;
    if (root.current && observer) observer.observe(root.current); else setVisible(true);
    return () => { observer?.disconnect(); preference.removeEventListener('change', updatePreference); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);
  return <div className="model-recording" ref={root} data-model-preview="recording" data-gif={gif}><Link className="model-recording-link" href={`/modelos/${slug}?visual=${visual}`} aria-label={`Experimentar ${demo.title} no estilo ${visualStyles[visual].name}`}>
    {!unavailable ? <img src={playing ? gif : poster} width={720} height={450} alt={`Gravação de ${demo.title}: uso e navegação da aplicação no estilo ${visualStyles[visual].name}.`} loading="lazy" decoding="async" draggable={false} onError={() => setUnavailable(true)} /> : <div className="recording-unavailable"><Play size={24} /><span>Abrir a demonstração</span></div>}
    <span className="model-recording-badge">CAPTURA REAL <i /> GIF</span><span className="model-recording-open"><ArrowUpRight size={16} /></span>
  </Link><div className="model-recording-footer"><span><b>EM USO</b>{visualStyles[visual].name}</span><button type="button" aria-label={reduced ? 'Animação desativada por movimento reduzido' : playing ? `Pausar GIF de ${demo.title}` : `Reproduzir GIF de ${demo.title}`} title={reduced ? 'Movimento reduzido: prévia estática' : playing ? 'Pausar demonstração' : 'Reproduzir demonstração'} disabled={reduced || unavailable} onClick={() => setPaused(v => !v)}>{playing ? <Pause size={12} /> : <Play size={12} />}{playing ? 'Pausar' : 'Reproduzir'}</button></div></div>;
}
