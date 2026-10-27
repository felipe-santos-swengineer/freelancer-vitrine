const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app/modelos/catalog.ts'), 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context);
const { demos } = context.exports;
const visualContext = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../app/modelos/visuals.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, visualContext);
const { visualProfiles } = visualContext.exports;
const base = process.argv[2] || 'http://localhost:3000';
const site = new URL(base);
const prefix = site.pathname.replace(/\/$/, '');
const markers = { commerce: 'OBJETOS PARA VIVER BEM', education: 'SEU PRÓXIMO PASSO COMEÇA AQUI', game: 'MEMORY', booking: 'UM TEMPO PARA VOCÊ', dashboard: 'SEU NEGÓCIO EM PERSPECTIVA', health: 'CUIDADO EM CADA DETALHE', menu: 'CAFÉ, COMIDA E BOAS PAUSAS', configurator: 'Monte sua mesa', flashcards: 'PEQUENAS REVISÕES', 'study-planner': 'Seu próximo objetivo pode começar aqui.', quiz: 'UMA IDEIA ACENDE OUTRA', maze: 'Encontre seu nexo.', portfolio: 'ESTÚDIO CRIATIVO', estimator: 'Dê forma ao seu escopo.', clinic: 'TEMPO PARA ESCUTAR.', wellness: 'PEQUENOS PASSOS', 'faq-bot': 'Uma resposta pode ser o começo.', whatsapp: 'Conversa que vira oportunidade.', automation: 'Repetir menos. Construir mais.', 'ai-assistant': 'Sua equipe encontra o que precisa.', 'product-3d': 'AURA / OBJETO DE EXPLORAÇÃO 01', 'space-3d': 'HABITA / ESPAÇOS QUE CONVIDAM', 'immersive-3d': 'UMA NARRATIVA PARA EXPLORAR' };

async function check() {
  const pages = await Promise.all(['/', '/modelos', ...demos.map(d => `/modelos/${d.slug}`)].map(async route => {
    const response = await fetch(`${site.origin}${prefix}${route}`); assert.equal(response.status, 200, route);
    const html = await response.text();
    const links = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1].replaceAll('&amp;', '&'));
    const hasLink = (slug, visual) => links.some(link => {
      const url = new URL(link, site.origin);
      return url.pathname.replace(/\/$/, '') === `${prefix}/modelos/${slug}` && (!visual || url.searchParams.get('visual') === visual);
    });
    if (route === '/' || route === '/modelos') {
      if (route === '/') {
        assert.ok(html.includes('id="experiencias-3d"'), 'Missing featured 3D section');
        assert.ok(html.includes('home-three-hero'), 'Missing interactive 3D hero');
        assert.ok(html.includes('Explore experiências 3D'), 'Missing primary 3D call to action');
      }
      for (const demo of demos) {
        assert.ok(hasLink(demo.slug), `Missing ${demo.slug} on ${route}`);
        if (route === '/modelos') for (const visual of visualProfiles[demo.slug]) assert.ok(hasLink(demo.slug, visual), `Missing ${demo.slug}/${visual}`);
      }
    } else {
      const slug = route.split('/').pop(); assert.ok(html.includes(markers[slug]), `Wrong application rendered at ${route}`);
      assert.ok(html.includes('GALERIA DE EXPERIÊNCIAS'), `Missing visual controls at ${route}`);
      assert.ok(html.includes(`visual-${visualProfiles[slug][0]}`), `Wrong initial visual at ${route}`);
    }
    return `${response.status} ${route}`;
  }));
  const missing = await fetch(`${site.origin}${prefix}/modelos/modelo-inexistente/`); assert.equal(missing.status, 404);
  console.log(pages.join('\n')); console.log('404 /modelos/modelo-inexistente');
  console.log('All applications, both catalogs and all visual variation links passed HTTP/render checks.');
}
check().catch(error => { console.error(error); process.exitCode = 1; });
