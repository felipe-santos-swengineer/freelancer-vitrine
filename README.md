# Freelancer Vitrine

Portfólio em português feito com Next.js App Router, React e TypeScript.

## Executar

É necessário Node.js 20.9 ou superior.

```sh
npm install
npm run dev
```

Abra http://localhost:3000. Para verificar e gerar a versão de produção:

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Personalizar

- `app/page.tsx`: apresentação, categorias, modelos e processo de trabalho. O nome Felipe é um texto inicial editável; revise a apresentação antes de publicar.
- `app/layout.tsx`: título e descrição para buscadores.
- `app/about-me.tsx` e `app/about.css`: apresentação, formação, histórico profissional e referências de projetos, com links para o portfólio completo, GitHub e LinkedIn. O conteúdo foi adaptado das informações públicas do [portfólio de Felipe Santos](https://felipe-santos-swengineer.github.io/fs_portfolio/) e de seu arquivo `src/content.js`.
- `app/globals.css`: cores, tipografia e layouts responsivos.

## Aplicações demonstrativas

Os cards da vitrine abrem aplicações navegáveis. A página `/modelos` reúne todos os modelos:

| Rota | Fluxos implementados |
| --- | --- |
| `/modelos/commerce` | Catálogo, busca, categorias, ordenação, detalhes, quantidades no carrinho, entrega, checkout simulado e histórico de pedidos. |
| `/modelos/education` | Trilha com quatro aulas de leitura, exercícios com anotações, questionários, progresso persistente e certificado em texto. |
| `/modelos/game` | Jogo de memória com três dificuldades, cartas embaralhadas, pares, cronômetro, pausa, pontuação e recordes. |
| `/modelos/booking` | Serviços, equipe, disponibilidade nos próximos 14 dias, confirmação, comprovante e cancelamento de reservas. |
| `/modelos/dashboard` | Indicadores calculados, gráficos, filtros, cadastro, edição e exclusão de pedidos, clientes e exportação CSV. |
| `/modelos/health` | Especialidades, busca de profissionais fictícios, reserva de consultas, comprovante e cancelamento. |
| `/modelos/menu` | Cardápio por categoria, busca, comanda, quantidades, observações e simulação das etapas de preparo. |
| `/modelos/configurator` | Mesa personalizável com largura, acabamento e base, prévia 2D, cálculo por regras e configurações exportáveis. |
| `/modelos/flashcards` | Criação, edição e remoção de cartões, revisão com respostas, autoavaliação e repetição de cartões pendentes. |
| `/modelos/study-planner` | Plano por matérias, objetivo, dias e disponibilidade, distribuição de sessões por regras, progresso e exportação. |
| `/modelos/quiz` | Dois temas, quatro perguntas por rodada, respostas explicadas, pontuação e histórico. |
| `/modelos/maze` | Labirintos procedurais em três tamanhos, três cristais, teclado/WASD/toque, saída e recordes por tamanho. |
| `/modelos/portfolio` | Site de estúdio fictício, projetos por categoria, detalhes, perguntas frequentes e solicitações exportáveis. |
| `/modelos/estimator` | Simulador de interiores por área, ambientes e complementos, estimativa de valor/prazo, comparação e exportação. |
| `/modelos/clinic` | Site de consultório fictício, apresentação do espaço, informações, dúvidas e solicitações locais. |
| `/modelos/wellness` | Hábitos personalizáveis, registros por dia, acompanhamento dos últimos sete dias e exportação JSON. |
| `/modelos/faq-bot` | Chat de perguntas frequentes com base editável, respostas por palavras-chave, encaminhamento humano e exportação. |
| `/modelos/whatsapp` | Central de atendimento simulada, conversas, identificação de interesse, fila, troca entre cliente/atendente e indicadores. |
| `/modelos/automation` | Fluxo de leads configurável, regras de prioridade, execução local, aprovação/rejeição humana, logs e exportação JSON. |
| `/modelos/ai-assistant` | Base de conhecimento editável, busca com fontes, resumo extrativo, rascunho de comunicado e exportação. |
| `/modelos/product-3d` | Produto tridimensional geométrico, giro/zoom, quatro acabamentos, vistas e separação ilustrativa de componentes. |
| `/modelos/space-3d` | Showroom tridimensional com sofá, mesa, planta e luminária, cores, luz, vistas e propostas exportáveis. |
| `/modelos/immersive-3d` | Narrativa de marca em três capítulos, com esculturas 3D distintas e navegação por botões/teclado. |
| `/modelos/platformer` | Vale das Centelhas: plataforma com três fases, física, câmera lateral, inimigos, saltos, coleta, checkpoints e vidas. |
| `/modelos/space-shooter` | Órbita Zero: combate de nave em cinco ondas, projéteis, colisões, escudos e dificuldade progressiva. |

Os 25 modelos usam o catálogo central em `app/modelos/catalog.ts`, incluindo **IA e automações** e **Experiências 3D**. Cada categoria tem pelo menos uma opção **Essencial**, uma **Profissional** e uma **Inovadora**. A vitrine e `/modelos` permitem combinar busca, categoria e nível, com o público de cada modelo. Os níveis descrevem o tipo de experiência, sem impor valores ou promessas comerciais.

Com o servidor rodando, `npm run test:routes` verifica todas as rotas, os links dos dois catálogos, o conteúdo inicial de cada aplicação e o 404 de uma rota inexistente. Para outro endereço: `npm run test:routes -- http://localhost:3100`.

### IA e automações

Os quatro modelos desta categoria demonstram experiências de produto, sem chamadas a modelos de IA, conexão com WhatsApp, envio de mensagens, CRM ou execução externa. A busca e a classificação usam regras locais em `ai-logic.ts`. As interfaces em `ai-apps.tsx` identificam a simulação. O assistente de conhecimento retorna textos cadastrados e fontes; seu resumo é extrativo e o comunicado usa um modelo fixo.

Uma versão de produção exige definir e conectar provedor de IA, canal oficial de atendimento, fontes autorizadas, armazenamento de conversas, regras de encaminhamento e sistemas do cliente. Nenhuma credencial é necessária para experimentar estas demonstrações. Use dados fictícios.

### Variações visuais e de navegação

Cada uma das 25 aplicações tem três composições selecionadas, totalizando **75 variações de apresentação** em seis direções:

| Estilo | Composição e navegação |
| --- | --- |
| Editorial | Tipografia serifada, proporções assimétricas, catálogo em duas colunas e índice horizontal. |
| Brutalista | Títulos grandes, bordas marcadas, sombras duras, blocos contrastantes e navegação numerada. |
| Imersivo | Fundo escuro, superfícies translúcidas, gradientes animados, composição em blocos e dock inferior flutuante. |
| Atelier | Cores de papel e materiais naturais, formas orgânicas, listagens horizontais e menu lateral no desktop. |
| Terminal | Tipografia monoespaçada, grade técnica, painéis de dados e menu expansível. |
| Minimalista | Espaçamento generoso, linhas finas, interface clara e abas compactas fixadas durante a rolagem. |

O catálogo permite filtrar por estilo e abrir cada variação diretamente. Dentro das aplicações, a barra superior alterna os estilos sem reiniciar a aplicação ou limpar seus dados. Links com `?visual=editorial`, por exemplo, preservam a escolha visual; estilos indisponíveis retornam à composição padrão daquela aplicação. A seleção por URL é aplicada no cliente após a hidratação.

As direções alteram layout, hierarquia tipográfica, apresentação de listas/cards e navegação, além da paleta. Não representam 75 sistemas independentes: são 75 apresentações para os 25 modelos funcionais. O controle **Efeitos ativos/pausados** desliga animações e transições; `prefers-reduced-motion` também é respeitado. A navegação lateral se adapta para uma faixa horizontal no celular; o dock continua acessível e o menu de console abre por botão.

### Jogos de plataforma e ação

Os dois jogos avançados usam Canvas 2D, com personagens, formas e cenários originais desenhados pelo código. O motor em `game-engine.ts` usa simulação em passos fixos de 1/60 s, independente da frequência de renderização. Os testes cobrem salto sobre abismo, aterrissagem, pausa, coleta única, respawn, invulnerabilidade, salto sobre inimigos, progressão das fases, cadência dos tiros, colisões e vitória.

**Vale das Centelhas:** setas/A/D para mover; Espaço/W/↑ para pular. Colete centelhas, salte sobre os adversários e chegue ao portal. Cada fase tem um checkpoint; vidas e pontos acompanham a progressão entre as três fases.

**Órbita Zero:** setas/WASD para pilotar e Espaço para disparar. Complete cinco ondas, preservando os três escudos. As últimas ondas têm adversários com mais resistência.

Os dois têm controles por toque, instruções, pausa e recordes locais. P/Escape pausa pelo teclado. Perda de foco, aba oculta, saída do tabuleiro visível e mudança de seção pausam a partida. Não há limite de tempo, backend ou sincronização de recordes. A pausa dos efeitos decorativos do site é separada da pausa do jogo.

### Experiências 3D

A página principal destaca os modelos em uma seção própria (`#experiencias-3d`) e apresenta uma escultura interativa na abertura. As três demonstrações usam Three.js/WebGL e geometrias construídas localmente, sem modelos, imagens ou serviços de terceiros. Os cards da seção de destaque usam ilustrações leves em CSS; as experiências completas e a abertura usam cenas 3D reais.

Arraste ou use as setas com o canvas em foco para mudar o ângulo. Nas demonstrações, use os controles de zoom, iluminação, acabamento e rotação. Na abertura, a roda continua disponível para rolar a página. Movimento reduzido e pausa de efeitos interrompem o giro automático; cenas fora da tela ou em uma aba oculta não renderizam quadros. A resolução é limitada a 1,5× a densidade CSS. Recursos gráficos e controles são liberados ao sair da cena.

Se WebGL não estiver disponível ou o contexto gráfico for perdido, a página apresenta uma prévia estática e opção de tentar novamente. Objetos e ambientes são ilustrativos: não há venda, especificação técnica, medidas reais ou orçamento associado.

Arquivos: `app/three-showcase.tsx`, `app/modelos/scene-3d.tsx`, `three-apps.tsx`, `three-config.ts` e `three.css`.

Configuração: `visuals.ts`. Interface de comparação e navegação: `design-experience.tsx`. Composições: `visuals.css`. Prévias: `variant-preview.tsx` e `variant-previews.css`.

Novas aplicações ficam em `app/modelos/extra-apps.tsx`, com estilos em `extras.css`, persistência em `storage.ts` e cálculos/geração em `logic.ts`. A coleção de testes verifica cobertura de categorias e níveis, preços, estimativas, distribuição dos estudos e conectividade dos labirintos.

Carrinhos, pedidos, progresso, recordes e reservas ficam no `localStorage`, separados por aplicação. Não há autenticação, servidor de dados, sincronização entre dispositivos, cobrança, entrega ou agendamento real. Use dados fictícios. Se o armazenamento estiver bloqueado, as interações continuam disponíveis em memória durante a sessão. Para reiniciar uma demonstração, remova as respectivas chaves no armazenamento do navegador.

As aplicações são demonstrações funcionais dos fluxos de interface; uma implantação de produção precisa de backend, autenticação, integrações e validações adequadas ao negócio. Os modelos não representam clientes ou empresas reais.

O formulário de contato da vitrine abre o WhatsApp para **+55 (88) 99837-8028**, com nome, e-mail e ideia do projeto preenchidos na mensagem. O visitante precisa tocar em **Enviar** no WhatsApp para concluir. O resumo fica disponível na página, com link para reabrir a conversa e opção de copiar se necessário. O número e a montagem da mensagem ficam em `app/contact.ts`. Não há envio automático por API nem confirmação de entrega.

As fontes são carregadas pelo Google Fonts, com alternativas locais em caso de indisponibilidade.

## GitHub Pages

Site: https://felipe-santos-swengineer.github.io/freelancer-vitrine/

Repositório: https://github.com/felipe-santos-swengineer/freelancer-vitrine

O workflow `.github/workflows/pages.yml` testa, exporta e publica automaticamente os pushes na branch `main`. O Next.js gera o diretório `out/`, com `trailingSlash` e o prefixo `/freelancer-vitrine` configurado no ambiente de build. Links internos usam `next/link` para respeitar o prefixo. O Pages hospeda os arquivos estáticos; as interações, cenas 3D e dados locais continuam no navegador.

Para testar a mesma exportação em PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/freelancer-vitrine'
npm run build
npm run test:export
npm start
```

Abra http://localhost:3000/freelancer-vitrine/. Sem essa variável, o build e a prévia usam a raiz. `npm run dev` mantém o desenvolvimento com recarregamento. `npm start` serve a exportação localmente, sem backend.
