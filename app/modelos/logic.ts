export const formatMoney = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export function dayKey(offset = 0) { const date = new Date(); date.setDate(date.getDate() + offset); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
export function tablePrice(width: number, finish: string, legs: string) { return 490 + (width - 100) * 7 + (finish === 'Nogueira' ? 220 : finish === 'Carvalho' ? 120 : 0) + (legs === 'Cavalete' ? 140 : legs === 'Painel' ? 90 : 0); }
export function projectEstimate(area: number, rooms: number, options: string[]) {
  const extras: Record<string, number> = { 'Visualização 3D': 650, 'Projeto de iluminação': 480, 'Lista de compras': 250, 'Acompanhamento remoto': 720 };
  return { total: Math.round(area * 48 + rooms * 180 + options.reduce((sum, option) => sum + (extras[option] || 0), 0)), days: Math.ceil(area / 12) + rooms * 2 + options.length * 2 + 5 };
}
export type StudySession = { id: string; subject: string; day: number; minutes: number; complete: boolean };
export function studyPlan(subjects: string[], days: number, minutes: number): StudySession[] {
  if (!subjects.length || days < 1 || minutes < 15) return [];
  const count = Math.max(1, Math.floor(minutes / 25));
  return Array.from({ length: days * count }, (_, i) => ({ id: `session-${i}`, subject: subjects[i % subjects.length], day: Math.floor(i / count) + 1, minutes: Math.floor(minutes / count), complete: false }));
}
export type Maze = { size: number; paths: number[][]; crystals: number[] };
export function generateMaze(size: number): Maze {
  const paths: number[][] = Array.from({ length: size * size }, () => []);
  const visited = new Set([0]); const stack = [0];
  while (stack.length) {
    const current = stack[stack.length - 1]; const x = current % size; const y = Math.floor(current / size);
    const neighbors = [y > 0 ? current - size : -1, x < size - 1 ? current + 1 : -1, y < size - 1 ? current + size : -1, x > 0 ? current - 1 : -1].filter(n => n >= 0 && !visited.has(n));
    if (!neighbors.length) { stack.pop(); continue; }
    const next = neighbors[Math.floor(Math.random() * neighbors.length)]; paths[current].push(next); paths[next].push(current); visited.add(next); stack.push(next);
  }
  const candidates = Array.from({ length: size * size - 2 }, (_, i) => i + 1);
  for (let i = candidates.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [candidates[i], candidates[j]] = [candidates[j], candidates[i]]; }
  return { size, paths, crystals: candidates.slice(0, 3) };
}
