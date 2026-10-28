'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './site-builder.css';

const palettes = { natural: ['Natural', '#c2f570', '#152015', '#f5f8ed'], oceano: ['Oceano', '#2476df', '#102640', '#edf5ff'], terracota: ['Terracota', '#b64b31', '#39241d', '#fff3e9'], violeta: ['Violeta', '#8050d6', '#261b3e', '#f6efff'] };
const fonts = { moderna: ['Moderna', 'Arial, sans-serif'], editorial: ['Editorial', 'Georgia, serif'], tecnica: ['Técnica', 'monospace'] };
const defaults = { brand: 'Sua marca', headline: 'Uma nova forma de fazer acontecer.', description: 'Soluções pensadas para quem quer ir além. Conheça o que podemos construir juntos.', cta: 'Vamos conversar', layout: 'dividido', palette: 'natural', font: 'moderna', theme: 'claro', radius: '16', sections: ['Serviços', 'Sobre', 'Contato'] };
type Design = typeof defaults;
const layouts: Record<string, string> = { dividido: 'Texto à esquerda', invertido: 'Texto à direita', centralizado: 'Centralizado' };
export function designSummary(d: Design) {
  return `Referência visual — Crie você mesmo seu site\nMarca: ${d.brand}\nTítulo: ${d.headline}\nDescrição: ${d.description}\nBotão: ${d.cta}\nOrientação: ${layouts[d.layout]}\nPaleta: ${palettes[d.palette as keyof typeof palettes][0]}\nFonte: ${fonts[d.font as keyof typeof fonts][0]}\nTema: ${d.theme}\nCantos: ${d.radius}px\nSeções: ${d.sections.join(', ') || 'A definir'}`;
}
function validDesign(value: unknown): value is Design {
  if (!value || typeof value !== 'object') return false;
  const d = value as Design;
  return ['brand', 'headline', 'description', 'cta'].every(k => typeof d[k as keyof Design] === 'string' && (d[k as keyof Design] as string).length <= 500) && Object.hasOwn(layouts, d.layout) && Object.hasOwn(palettes, d.palette) && Object.hasOwn(fonts, d.font) && ['claro', 'escuro'].includes(d.theme) && ['0', '16', '32'].includes(d.radius) && Array.isArray(d.sections) && d.sections.every(s => ['Serviços', 'Sobre', 'Depoimentos', 'Contato'].includes(s));
}
export default function SiteBuilder({ onApply, brief }: { onApply: (summary: string) => void; brief: { name: string; email: string; idea: string } }) {
  const [design, setDesign] = useState(defaults);
  const [device, setDevice] = useState('desktop');
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => { try { const saved: unknown = JSON.parse(localStorage.getItem('felipe-site-design') || 'null'); if (validDesign(saved)) setDesign(saved); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem('felipe-site-design', JSON.stringify(design)); } catch {} } }, [design, ready]);
  function update<K extends keyof Design>(key: K, value: Design[K]) { setDesign(d => ({ ...d, [key]: value })); setMessage(''); }
  const palette = palettes[design.palette as keyof typeof palettes];
  const font = fonts[design.font as keyof typeof fonts];
  function exportPdf() {
    const popup = window.open('', '_blank', 'width=1100,height=850');
    if (!popup) { setMessage('Permita abrir a janela de impressão para salvar seu PDF.'); return; }
    const doc = popup.document;
    doc.title = 'Referência visual do site e briefing';
    const style = doc.createElement('style');
    style.textContent = `${Array.from(document.styleSheets).flatMap(sheet => { try { return Array.from(sheet.cssRules).map(rule => rule.cssText); } catch { return []; } }).join('\n')} body{background:white!important;color:#172018!important;padding:24px;font-family:Arial,sans-serif} h1{font-size:24px} pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.7 Arial,sans-serif} .builder-preview{width:100%!important;max-width:none!important;min-height:0!important;print-color-adjust:exact;-webkit-print-color-adjust:exact} .builder-preview *{animation:none!important} @page{size:A4 landscape;margin:12mm} @media print{.pdf-help{display:none}.pdf-details{break-before:page}}`;
    doc.head.append(style);
    const title = doc.createElement('h1'); title.textContent = 'Referência visual do seu site'; doc.body.append(title);
    const help = doc.createElement('p'); help.className = 'pdf-help'; help.textContent = 'Escolha “Salvar como PDF” na impressão. Depois, anexe o arquivo à conversa no WhatsApp.'; doc.body.append(help);
    if (preview.current) doc.body.append(preview.current.cloneNode(true));
    const details = doc.createElement('div'); details.className = 'pdf-details';
    const heading = doc.createElement('h1'); heading.textContent = 'Briefing e escolhas visuais'; details.append(heading);
    const text = doc.createElement('pre'); text.textContent = `Nome: ${brief.name || 'A preencher'}\nE-mail: ${brief.email || 'A preencher'}\n\nIdeia do projeto:\n${brief.idea || 'A preencher'}\n\n${designSummary(design)}\n\nPrévia conceitual para orientar o projeto. Conteúdo e funcionalidades serão definidos no briefing.`; details.append(text); doc.body.append(details);
    void doc.fonts.ready.then(() => { popup.focus(); popup.print(); });
    setMessage('Na janela de impressão, escolha Salvar como PDF. Anexe o arquivo manualmente ao enviar o briefing pelo WhatsApp.');
  }
  return <section id="crie-seu-site" className="site-builder container">
    <div className="section-top"><div><div className="eyebrow">SEU PROJETO, DO SEU JEITO</div><h2>Crie você mesmo<br /><span>o visual do seu site.</span></h2></div><p>Experimente combinações em tempo real.<br />Leve sua referência visual junto com o briefing.</p></div>
    <div className="builder-workspace"><div className="builder-controls">
      <h3>01 / Conteúdo</h3>{([['brand', 'Nome da marca'], ['headline', 'Título principal'], ['description', 'Descrição'], ['cta', 'Texto do botão']] as const).map(([key, label]) => <label key={key}>{label}<input maxLength={key === 'description' ? 300 : 100} value={design[key]} onChange={e => update(key, e.target.value)} /></label>)}
      <h3>02 / Direção visual</h3><label>Orientação<select value={design.layout} onChange={e => update('layout', e.target.value)}>{Object.entries(layouts).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <fieldset><legend>Paleta de cores</legend><div className="builder-palettes">{Object.entries(palettes).map(([key, p]) => <button key={key} type="button" aria-pressed={design.palette === key} onClick={() => update('palette', key)}><i style={{ background: p[1] }} />{p[0]}</button>)}</div></fieldset>
      <label>Fonte<select value={design.font} onChange={e => update('font', e.target.value)}>{Object.entries(fonts).map(([key, f]) => <option key={key} value={key}>{f[0]}</option>)}</select></label>
      <div className="builder-pair"><label>Tema<select value={design.theme} onChange={e => update('theme', e.target.value)}><option value="claro">Claro</option><option value="escuro">Escuro</option></select></label><label>Cantos<select value={design.radius} onChange={e => update('radius', e.target.value)}><option value="0">Retos</option><option value="16">Suaves</option><option value="32">Arredondados</option></select></label></div>
      <fieldset><legend>Seções do site</legend>{['Serviços', 'Sobre', 'Depoimentos', 'Contato'].map(s => <label className="builder-check" key={s}><input type="checkbox" checked={design.sections.includes(s)} onChange={() => update('sections', design.sections.includes(s) ? design.sections.filter(x => x !== s) : [...design.sections, s])} />{s}</label>)}</fieldset>
      <button type="button" className="text-link" onClick={() => { setDesign(defaults); setMessage('Configuração inicial restaurada.'); }}>Restaurar padrão</button>
    </div><div className="builder-stage"><div className="builder-toolbar"><span>PRÉVIA AO VIVO</span><div>{['desktop', 'celular'].map(d => <button type="button" key={d} aria-pressed={device === d} onClick={() => setDevice(d)}>{d === 'desktop' ? 'Desktop' : 'Celular'}</button>)}</div></div>
      <div className="builder-canvas"><div ref={preview} className={`builder-preview layout-${design.layout} device-${device}`} style={{ '--b-accent': palette[1], '--b-button-text': design.palette === 'natural' ? '#152015' : '#ffffff', '--b-ink': design.theme === 'claro' ? palette[2] : palette[3], '--b-bg': design.theme === 'claro' ? palette[3] : palette[2], '--b-radius': `${design.radius}px`, fontFamily: font[1] } as CSSProperties}>
        <div className="builder-site-nav"><b>{design.brand || 'Sua marca'}</b><span>{design.sections.join(' · ')}</span></div>
        <div className="builder-site-hero"><div><small>FEITO PARA O SEU PRÓXIMO PASSO</small><h3>{design.headline || 'Seu título aqui'}</h3><p>{design.description}</p><span className="builder-site-cta">{design.cta || 'Vamos conversar'} ↗</span></div><div className="builder-art" aria-hidden="true"><div /><span>✳</span><small>IDEIAS QUE GANHAM FORMA</small></div></div>
        <div className="builder-site-sections">{design.sections.map((s, i) => <article key={s}><small>0{i + 1} / {s.toUpperCase()}</small><h4>{({ Serviços: 'O que fazemos por você', Sobre: 'Uma história com propósito', Depoimentos: 'Conexões que fazem a diferença', Contato: 'Vamos construir juntos?' })[s]}</h4><p>Um espaço para contar sua história e conectar sua marca às pessoas.</p></article>)}</div>
        <div className="builder-site-footer">{design.brand || 'Sua marca'}<span>Seu próximo capítulo começa aqui.</span></div>
      </div></div><p className="builder-note">Prévia conceitual. As funcionalidades serão definidas com você. Suas escolhas ficam salvas neste navegador quando o armazenamento está disponível.</p>
      <div className="builder-actions"><button type="button" className="button primary" onClick={() => { onApply(designSummary(design)); setMessage('Referência adicionada ao briefing abaixo.'); document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' }); }}>Usar no briefing ↗</button><button type="button" className="button builder-export" onClick={exportPdf}>Salvar em PDF ↓</button></div><p className="builder-note">O PDF inclui a prévia, suas escolhas e os campos preenchidos no briefing. Use “Salvar como PDF” na impressão e anexe o arquivo à conversa no WhatsApp.</p><p role="status" className="builder-status">{message}</p>
    </div></div>
  </section>;
}
