import { ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';
import './project-process.css';

const stages = [
  { title: 'Diagnóstico e definição do escopo', description: 'Entendo os objetivos do negócio, o público e os desafios do projeto. Detalhamos requisitos, funcionalidades, prioridades, integrações e critérios de aceite para alinhar expectativas desde o início.', delivery: 'Escopo documentado, proposta e cronograma por etapas.' },
  { title: 'Prototipação e validação da experiência', description: 'Transformo os requisitos em uma prévia navegável, utilizando Figma ou protótipos funcionais com apoio de IA, conforme as necessidades do projeto. Validamos os principais fluxos, a direção visual e a experiência em desktop e celular antes de consolidar a implementação.', delivery: 'Prévia navegável revisada, principais fluxos validados e direção visual aprovada.' },
  { title: 'Desenvolvimento e acompanhamento', description: 'Implemento a solução em entregas incrementais, com código versionado e boas práticas de engenharia. Compartilho a evolução para colher feedback e acompanhar as decisões ao longo do projeto.', delivery: 'Funcionalidades implementadas e demonstrações por etapa.' },
  { title: 'Testes e validação', description: 'Verifico os fluxos principais, a responsividade, a acessibilidade e os pontos de desempenho e segurança previstos no escopo. Você participa da homologação, e os ajustes são conferidos antes da publicação.', delivery: 'Critérios de aceite verificados e aprovação para lançamento.' },
  { title: 'Publicação e entrega', description: 'Preparo o ambiente de produção, o domínio e as configurações necessárias. Após a publicação, verifico o funcionamento da aplicação e entrego as orientações de uso e os acessos combinados.', delivery: 'Aplicação publicada e orientações para a operação.' },
  { title: 'Manutenção e evolução contínua', description: 'Após o lançamento, o projeto pode contar com acompanhamento para correções, atualizações de dependências, monitoramento e melhorias. Novas funcionalidades são priorizadas conforme os resultados e as necessidades do negócio.', delivery: 'Plano de manutenção com escopo, frequência e condições definidos à parte.' },
];

export default function ProjectProcess() {
  return <section id="processo" className="process process-detailed container" aria-labelledby="process-title">
    <div className="section-top"><div><div className="eyebrow"><span className="section-number">03 /</span> PROCESSO DE DESENVOLVIMENTO</div><h2 id="process-title">Do escopo à evolução.<br /><span>Clareza em cada entrega.</span></h2></div><p>Planejamento, validação e acompanhamento<br />para transformar sua ideia em uma solução<br />alinhada ao seu negócio.</p></div>
    <ol className="process-stages">{stages.map((stage, index) => <li className="process-stage" key={stage.title}><div className="process-stage-index"><span>ETAPA {String(index + 1).padStart(2, '0')}</span><span aria-hidden="true">↗</span></div><h3>{stage.title}</h3><p>{stage.description}</p><div className="process-delivery"><Check size={15} aria-hidden="true" /><div><span>ENTREGA DA ETAPA</span><p>{stage.delivery}</p></div></div></li>)}</ol>
    <div className="process-agreement"><p>As etapas são adaptadas ao tamanho e à complexidade do projeto. Mudanças no escopo são alinhadas com você, incluindo impactos em prazo e investimento.</p><Link className="text-link" href="#contato">Vamos planejar seu projeto <ArrowUpRight size={16} /></Link></div>
  </section>;
}
