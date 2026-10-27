export type Knowledge = { id: string; title: string; text: string };
export const normalize = (s: string) => s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const stop = new Set(['para', 'como', 'qual', 'quais', 'sobre', 'com', 'uma', 'que', 'das', 'dos', 'por', 'sao', 'tem', 'nos', 'seu', 'sua', 'meu', 'minha', 'voce', 'preciso', 'quero']);
export function searchKnowledge(query: string, docs: readonly Knowledge[]) {
  const tokens = [...new Set(normalize(query).split(/[^a-z0-9]+/).filter(t => t.length > 2 && !stop.has(t)))];
  return docs.map(doc => ({ ...doc, score: tokens.reduce((sum, token) => sum + (normalize(doc.title).includes(token) ? 3 : 0) + (normalize(doc.text).includes(token) ? 1 : 0), 0) })).filter(d => d.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
}
export type Intent = 'human' | 'price' | 'schedule' | 'hours' | 'greeting' | 'unknown';
export function identifyIntent(text: string): Intent {
  const value = normalize(text);
  if (/\b(humano|humana|atendente|pessoa|reclamacao|cancelar)\b/.test(value)) return 'human';
  if (/\b(preco|precos|valor|valores|orcamento|custa|comprar)\b/.test(value)) return 'price';
  if (/\b(agendar|agenda|agendamento|marcar|reserva|reservar)\b/.test(value)) return 'schedule';
  if (/\b(horario|horarios|funcionamento|aberto|abre|fecha)\b/.test(value)) return 'hours';
  if (/\b(oi|ola|bom dia|boa tarde|boa noite)\b/.test(value)) return 'greeting';
  return 'unknown';
}
export type AutomationInput = { name: string; email: string; message: string; value: number };
export function runAutomation(input: AutomationInput, threshold: number, enrich: boolean) {
  const priority = input.value >= threshold ? 'Alta' : 'Normal';
  const intent = identifyIntent(input.message);
  return { priority, team: intent === 'schedule' ? 'Agendamentos' : intent === 'human' ? 'Relacionamento' : 'Comercial', summary: enrich ? `${input.name}: ${input.message.trim().slice(0, 180)}${input.message.trim().length > 180 ? '…' : ''}` : input.message.trim(), draft: `Olá, ${input.name}! Recebemos seu interesse. Nossa equipe vai analisar sua solicitação e confirmar as próximas etapas.`, needsReview: priority === 'Alta' || intent === 'human' };
}
