'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Move, Pause, Play } from 'lucide-react';
import Scene3D from './modelos/scene-3d';
import { sceneChapters } from './modelos/three-config';
import ModelRecording from './modelos/model-recording';
import './modelos/three.css';

export function HeroThree() {
  const [rotate, setRotate] = useState(true); const [chapter, setChapter] = useState(0);
  return <div className="home-three-hero"><div className="home-three-overline"><span><i /> ALÉM DA TELA</span><span>EXPERIÊNCIA 3D EM TEMPO REAL</span></div><Scene3D kind="immersive" color={sceneChapters[chapter].color} variant={chapter} autoRotate={rotate} embedded label="Escultura 3D interativa da vitrine" /><div className="home-three-bottom"><div className="home-three-chapters" aria-label="Mudar escultura">{sceneChapters.map((c, i) => <button key={c.title} aria-pressed={chapter === i} aria-label={`Explorar escultura ${c.title}`} className={chapter === i ? 'selected' : ''} onClick={() => setChapter(i)}>0{i + 1}</button>)}</div><button className="home-three-pause" aria-label={rotate ? 'Pausar movimento 3D' : 'Ativar movimento 3D'} onClick={() => setRotate(v => !v)}>{rotate ? <Pause size={13} /> : <Play size={13} />}</button><span><Move size={12} /> Arraste e descubra</span></div></div>;
}

const highlights = [
  { slug: 'product-3d', brand: 'aura', label: '01 / PRODUTO EM CENA', title: 'Desejo em cada ângulo.', description: 'Gire, aproxime e personalize o acabamento de um produto em 3D.', art: 'headphone', tag: 'ROTAÇÃO · ZOOM · ACABAMENTOS' },
  { slug: 'space-3d', brand: 'habita', label: '02 / ESPAÇOS PARA EXPLORAR', title: 'Entre. Imagine. Transforme.', description: 'Explore um ambiente e experimente cores, luz e novas perspectivas.', art: 'room', tag: 'SHOWROOM · PERSONALIZAÇÃO' },
  { slug: 'immersive-3d', brand: 'dimensão', label: '03 / EXPERIÊNCIA DE MARCA', title: 'Uma ideia, outro universo.', description: 'Descubra uma narrativa de marca em três capítulos tridimensionais.', art: 'portal', tag: 'NARRATIVA · FORMAS · MOVIMENTO' },
] as const;
export function ThreeShowcase() {
  return <section id="experiencias-3d" className="home-three-section"><div className="container"><div className="home-three-heading"><div><p className="eyebrow"><span className="status-dot" /> EM DESTAQUE / EXPERIÊNCIAS 3D</p><h2>Sites que você<br />não só vê. <em>Explora.</em></h2></div><p>Produtos que ganham presença.<br />Espaços que despertam ideias.<br />Sua marca em outra dimensão.</p></div><div className="home-three-cards">{highlights.map(h => <article className="home-three-card" key={h.slug}><div className="home-three-card-art home-three-recording"><ModelRecording slug={h.slug} /></div><Link className="home-three-card-copy" href={`/modelos/${h.slug}`}><span>{h.label}</span><h3>{h.title}</h3><p>{h.description}</p><b>Abrir experiência <ArrowUpRight size={15} /></b></Link></article>)}</div><div className="home-three-note"><span>3 experiências para girar, personalizar e descobrir.</span><a href="#modelos">Ver todos os modelos <ArrowUpRight size={14} /></a></div></div></section>;
}
