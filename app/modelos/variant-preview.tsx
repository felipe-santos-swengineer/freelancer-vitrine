import { demos, type DemoSlug } from './catalog';
import { visualStyles, type VisualStyle } from './visuals';

export default function VariantPreview({ slug, visual }: { slug: DemoSlug; visual: VisualStyle }) {
  const demo = demos.find(d => d.slug === slug)!;
  return <div className={`variant-preview vp-${visual}`} aria-hidden="true"><div className="vp-top"><i /><i /><i /><span>{demo.brand} / {visualStyles[visual].name}</span></div><div className="vp-site"><div className="vp-header"><b>{demo.brand}<i>✳</i></b><span>EXPLORE ↗</span></div><div className="vp-nav"><i>01 INÍCIO</i><i>02 EXPLORE</i><i>03 CONTATO</i></div><div className="vp-content"><div className="vp-type"><small>{demo.category.toUpperCase()}</small><h3>{demo.headline}</h3><span>Descubra a experiência ↗</span></div><div className="vp-sculpture"><i /><b>{demo.symbol}</b></div></div><div className="vp-blocks"><span><i />{demo.features[0]}</span><span><i />{demo.features[1]}</span><span><i />{demo.features[2]}</span></div></div></div>;
}
