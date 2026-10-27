export type SceneKind = 'product' | 'space' | 'immersive';
export const finishes = [{ name: 'Lavanda', hex: '#b19ddd' }, { name: 'Grafite', hex: '#50565f' }, { name: 'Areia', hex: '#c5af90' }, { name: 'Menta', hex: '#8cbfae' }] as const;
export const sceneChapters = [
  { title: 'Origem', label: '01 / O PRIMEIRO IMPULSO', text: 'Toda ideia começa com um ponto de curiosidade. Explore a forma e encontre seu próprio ângulo.', color: '#b49de8', symbol: '◉' },
  { title: 'Conexão', label: '02 / CAMINHOS QUE SE ENCONTRAM', text: 'Órbitas diferentes, uma experiência compartilhada. Arraste para descobrir as relações entre as formas.', color: '#82cbbd', symbol: '◎' },
  { title: 'Expansão', label: '03 / ALÉM DO ESPERADO', text: 'Novos volumes abrem outras possibilidades. A próxima dimensão pode ser a da sua marca.', color: '#e2ad78', symbol: '✧' },
] as const;
export function sceneDistance(kind: SceneKind) { return kind === 'space' ? 7.2 : kind === 'product' ? 4.7 : 5.6; }
export function safeZoom(value: number) { return Math.min(1.7, Math.max(0.65, Number.isFinite(value) ? value : 1)); }
