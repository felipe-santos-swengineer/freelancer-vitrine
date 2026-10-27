import { notFound } from 'next/navigation';
import { demos } from '../catalog';
import DemoApp from '../demo-app';

export function generateStaticParams() { return demos.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = demos.find(d => d.slug === slug);
  return { title: demo ? `${demo.brand} · ${demo.title} | Demonstração` : 'Modelo não encontrado' };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = demos.find(d => d.slug === slug);
  if (!demo) notFound();
  return <DemoApp key={demo.slug} slug={demo.slug} />;
}
