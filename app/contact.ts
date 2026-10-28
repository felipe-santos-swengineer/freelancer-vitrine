export const CONTACT_WHATSAPP = '5588998378028';
export const CONTACT_WHATSAPP_LABEL = '+55 (88) 99837-8028';
export type Briefing = { name: string; email: string; idea: string; design?: string };

export function formatBriefing(brief: Briefing) {
  return `Olá, Felipe! Gostaria de conversar sobre um projeto.\n\nNome: ${brief.name.trim()}\nE-mail: ${brief.email.trim()}\n\nMinha ideia de projeto:\n${brief.idea.trim()}${brief.design?.trim() ? `\n\n${brief.design.trim()}` : ''}`;
}

export function briefingWhatsAppUrl(brief: Briefing) {
  return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(formatBriefing(brief))}`;
}
