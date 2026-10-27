import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Felipe · Desenvolvimento web & ideias digitais',
  description: 'Sites 3D interativos, showrooms, produtos em 360°, sistemas, assistentes de IA e automações: explore experiências para o seu próximo projeto.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
