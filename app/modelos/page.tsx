import Link from 'next/link';
import CatalogBrowser from './catalog-browser';
import './demos.css';
import './extras.css';
import './variant-previews.css';

export default function Models() {
  return <main className="demo-shell demo-index"><Link href="/">← Voltar à vitrine</Link><p className="demo-kicker">APLICAÇÕES E EXPERIÊNCIAS PARA EXPERIMENTAR</p><h1>Uma ideia.<br />Diferentes formas de sentir.</h1><p>Do visual discreto a experiências expressivas: explore aplicações com composições, movimentos e navegações diferentes. Os dados das demonstrações ficam apenas neste navegador.</p><CatalogBrowser /></main>;
}
