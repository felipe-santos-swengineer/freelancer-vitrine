import type { DemoSlug } from './catalog';

export const visualStyles = {
  editorial: { name: 'Editorial', tagline: 'Tipografia expressiva, composição assimétrica e navegação de revista.', nav: 'Índice horizontal', motion: 'Revelação suave e imagens em destaque', symbol: 'Aa', colors: ['#efe9dd', '#25291f', '#ae422b'] },
  brutalist: { name: 'Brutalista', tagline: 'Blocos fortes, contraste alto e uma experiência direta.', nav: 'Blocos numerados', motion: 'Recortes, deslocamento e sombras duras', symbol: '↗', colors: ['#f2ff61', '#171717', '#f5f2e9'] },
  aurora: { name: 'Imersivo', tagline: 'Uma atmosfera escura com luz, profundidade e superfícies translúcidas.', nav: 'Dock flutuante', motion: 'Gradientes em movimento e brilho interativo', symbol: '✳', colors: ['#101329', '#bba4ff', '#7eebd3'] },
  atelier: { name: 'Atelier', tagline: 'Materiais suaves, ritmo acolhedor e composição com respiro.', nav: 'Menu lateral', motion: 'Formas orgânicas e transições delicadas', symbol: '◒', colors: ['#f4ede2', '#704e3a', '#c18d73'] },
  terminal: { name: 'Terminal', tagline: 'Precisão de uma ferramenta com linguagem de console e dados em foco.', nav: 'Menu expansível', motion: 'Grade técnica e indicadores de estado', symbol: '>_', colors: ['#0e1915', '#bcf793', '#74968b'] },
  minimal: { name: 'Minimalista', tagline: 'Conteúdo em primeiro plano, linhas finas e uma interface silenciosa.', nav: 'Abas compactas', motion: 'Transições curtas e discretas', symbol: '—', colors: ['#fafafa', '#222b35', '#748ba5'] },
} as const;
export type VisualStyle = keyof typeof visualStyles;
export const visualProfiles: Record<DemoSlug, readonly [VisualStyle, VisualStyle, VisualStyle]> = {
  commerce: ['editorial', 'brutalist', 'aurora'], education: ['minimal', 'editorial', 'aurora'], game: ['brutalist', 'aurora', 'terminal'], booking: ['atelier', 'minimal', 'aurora'], dashboard: ['terminal', 'minimal', 'brutalist'], health: ['minimal', 'atelier', 'editorial'],
  menu: ['brutalist', 'editorial', 'atelier'], configurator: ['aurora', 'minimal', 'editorial'], flashcards: ['atelier', 'brutalist', 'minimal'], 'study-planner': ['minimal', 'terminal', 'aurora'], quiz: ['brutalist', 'aurora', 'editorial'], maze: ['terminal', 'aurora', 'brutalist'], portfolio: ['editorial', 'aurora', 'brutalist'], estimator: ['atelier', 'terminal', 'minimal'], clinic: ['atelier', 'editorial', 'minimal'], wellness: ['aurora', 'atelier', 'minimal'],
  'faq-bot': ['minimal', 'atelier', 'brutalist'], whatsapp: ['minimal', 'terminal', 'aurora'], automation: ['terminal', 'aurora', 'brutalist'], 'ai-assistant': ['aurora', 'editorial', 'terminal'],
  'product-3d': ['aurora', 'minimal', 'brutalist'], 'space-3d': ['atelier', 'editorial', 'minimal'], 'immersive-3d': ['aurora', 'terminal', 'brutalist'],
  platformer: ['aurora', 'brutalist', 'terminal'], 'space-shooter': ['terminal', 'aurora', 'brutalist'],
};
export function resolveVisual(slug: DemoSlug, candidate: string | null | undefined): VisualStyle {
  return visualProfiles[slug].find(v => v === candidate) || visualProfiles[slug][0];
}
