// Run against the local static preview. Only local demo data and simulated actions are used.
const { chromium } = require('playwright');
const sharp = require('sharp');
const { GIFEncoder, quantize, applyPalette } = require('gifenc');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function load(file) { const context = { exports: {} }; vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context); return context.exports; }
const { demos } = load('app/modelos/catalog.ts');
const { visualProfiles } = load('app/modelos/visuals.ts');
const base = process.env.PREVIEW_URL || 'http://localhost:3100/freelancer-vitrine';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Recordings must use the local demo server.');
const only = process.argv.find(v => v.startsWith('--only='))?.slice(7);
const output = path.join(root, 'public/previews'); fs.mkdirSync(output, { recursive: true });
const manifestFile = path.join(output, 'manifest.json');
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};
let rendering3d = false;
const jobs = demos.filter(d => !only || only.split(',').includes(d.slug)).flatMap(d => visualProfiles[d.slug].map(visual => ({ slug: d.slug, visual })));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function tab(page, name) { const menu = page.locator('.experience-menu-toggle'); if (await menu.isVisible()) await menu.click(); await page.locator('.experience-nav').getByRole('button').filter({ has: page.locator('span').filter({ hasText: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }) }).click(); }
async function click(page, selector) { await page.locator(selector).first().click(); }
async function action(page, slug, step) {
  if (slug === 'commerce') { if (step === 0) { await click(page, '[aria-label="Adicionar Vaso Terracota"]'); } if (step === 1) await tab(page, 'Carrinho'); }
  else if (slug === 'education') { if (step === 0) await page.getByRole('button', { name: /Começar minha jornada/ }).click(); if (step === 1) await page.locator('.lesson-nav').nth(1).click(); }
  else if (slug === 'platformer' || slug === 'space-shooter') {
    if (step === 0) { await page.getByRole('button', { name: 'Começar aventura', exact: true }).click(); await page.locator('.advanced-hud').scrollIntoViewIfNeeded(); await page.locator('canvas').focus(); await page.keyboard.down(slug === 'platformer' ? 'ArrowRight' : 'ArrowLeft'); if (slug === 'space-shooter') await page.keyboard.down('Space'); }
    if (step === 1 && slug === 'space-shooter') { await page.keyboard.up('ArrowLeft'); await page.keyboard.down('ArrowRight'); }
  }
  else if (slug === 'game') { if (step === 0) await page.getByRole('button', { name: 'Começar partida', exact: true }).click(); else { const card = page.locator('.memory-card:not(:disabled)').first(); if (await card.count()) await card.click(); } }
  else if (slug === 'booking' || slug === 'health') { if (step === 0) await click(page, '.care-hero .d-button'); if (step === 1) await page.locator('.slot-grid button').first().click(); if (step === 2) await page.locator('input[name="name"]').fill('Pessoa Exemplo'); }
  else if (slug === 'dashboard') { if (step === 0) await page.getByRole('button', { name: /Novo pedido/ }).click(); if (step === 1) { await page.locator('[name="customer"]').fill('Marina Exemplo'); await page.locator('[name="email"]').fill('marina@example.com'); await page.locator('[name="product"]').fill('Site institucional'); await page.locator('[name="total"]').fill('890'); } if (step === 2) await page.getByRole('button', { name: /Salvar pedido/ }).click(); }
  else if (slug === 'menu') { if (step === 0) await page.getByRole('button', { name: 'Adicionar Toast da casa', exact: true }).click(); if (step === 1) await tab(page, 'Minha comanda'); }
  else if (slug === 'configurator') { if (step === 0) await page.getByRole('button', { name: 'Nogueira', exact: true }).click(); if (step === 1) await page.locator('input[type="range"]').press('End'); if (step === 2) await page.getByRole('button', { name: /Salvar configuração/ }).click(); }
  else if (slug === 'flashcards') { if (step === 0) await page.getByRole('button', { name: 'Começar revisão', exact: true }).click(); if (step === 1) await click(page, '.review-card'); if (step === 2) await page.getByRole('button', { name: /Eu sabia!/ }).click(); }
  else if (slug === 'study-planner') { if (step === 0) await page.getByRole('button', { name: 'Montar meu plano', exact: true }).click(); if (step === 1) await page.getByRole('button', { name: /Gerar meu plano/ }).click(); if (step === 2) await page.locator('.session-row input').first().check(); }
  else if (slug === 'quiz') { if (step === 0) await page.getByRole('button', { name: /Começar quiz/ }).click(); if (step === 1) await page.locator('.quiz-play input').nth(1).check(); if (step === 2) await page.getByRole('button', { name: /Próxima pergunta/ }).click(); }
  else if (slug === 'maze') { if (step === 0) await page.getByRole('button', { name: /Começar aventura/ }).click(); else { const direction = await page.locator('.maze-cell.player').evaluate(el => { const s = getComputedStyle(el); return s.borderRightColor === 'rgba(0, 0, 0, 0)' ? 'direita' : s.borderBottomColor === 'rgba(0, 0, 0, 0)' ? 'baixo' : s.borderLeftColor === 'rgba(0, 0, 0, 0)' ? 'esquerda' : 'cima'; }); await page.getByRole('button', { name: `Mover para ${direction}`, exact: true }).click(); } }
  else if (slug === 'portfolio') { if (step === 0) await tab(page, 'Projetos'); if (step === 1) await page.getByRole('button', { name: 'Digital', exact: true }).click(); if (step === 2) await click(page, '.portfolio-card'); }
  else if (slug === 'estimator') { if (step === 0) await page.locator('input[type="range"]').press('End'); if (step === 1) await page.getByLabel('Projeto de iluminação', { exact: true }).check(); if (step === 2) await page.getByRole('button', { name: /Salvar proposta/ }).click(); }
  else if (slug === 'clinic') { if (step === 0) await tab(page, 'O consultório'); if (step === 1) await tab(page, 'Contato'); if (step === 2) await page.locator('input[name="name"]').fill('Pessoa Exemplo'); }
  else if (slug === 'wellness') { if (step === 0) await page.locator('.habit-check input').first().check(); if (step === 1) await page.locator('.habit-check input').nth(1).check(); if (step === 2) await tab(page, 'Minha semana'); }
  else if (slug === 'faq-bot') { if (step === 0) await page.getByRole('button', { name: 'Qual o horário de funcionamento?', exact: true }).click(); if (step === 1) await page.getByRole('button', { name: 'Quero um orçamento', exact: true }).click(); if (step === 2) await page.getByRole('button', { name: 'Falar com atendente', exact: true }).click(); }
  else if (slug === 'whatsapp') { if (step === 0) await page.getByRole('button', { name: 'Quero um orçamento', exact: true }).click(); if (step === 1) await page.getByRole('button', { name: 'Assumir conversa', exact: true }).click(); if (step === 2) { await page.getByRole('textbox', { name: 'Resposta do atendente simulado' }).fill('Olá! Vou ajudar com seu projeto.'); await page.getByRole('button', { name: 'Enviar mensagem simulada', exact: true }).click(); } }
  else if (slug === 'automation') { if (step === 0) await page.getByRole('button', { name: 'Testar meu fluxo', exact: false }).click(); if (step === 1) await page.getByRole('button', { name: /Executar simulação/ }).click(); if (step === 2) await page.getByRole('button', { name: /Aprovar simulação/ }).click(); }
  else if (slug === 'ai-assistant') { if (step === 0) await page.getByRole('button', { name: 'Qual o horário de suporte?', exact: true }).click(); if (step === 1) await tab(page, 'Preparar material'); if (step === 2) await page.locator('form').getByRole('button', { name: /Preparar material/ }).click(); }
  else if (slug === 'product-3d') { if (step === 0) await page.getByRole('button', { name: 'Acabamento Grafite', exact: true }).click(); if (step === 1) await page.getByRole('button', { name: /Cada detalhe importa/ }).click(); if (step === 2) await page.getByRole('button', { name: 'Acabamento Menta', exact: true }).click(); }
  else if (slug === 'space-3d') { if (step === 0) await page.getByRole('button', { name: 'Acabamento Menta', exact: true }).click(); if (step === 1) await page.getByRole('button', { name: 'Atmosfera noturna', exact: true }).click(); if (step === 2) await page.getByRole('button', { name: 'Lateral', exact: true }).click(); }
  else if (slug === 'immersive-3d') { if (step === 0 || step === 1) await page.getByRole('button', { name: 'Próximo capítulo', exact: true }).click(); if (step === 2) await page.getByRole('button', { name: 'Pausar giro', exact: true }).click(); }
}

async function record(browser, job) {
  const key = `${job.slug}-${job.visual}`; const gifFile = path.join(output, `${key}.gif`); const posterFile = path.join(output, `${key}.jpg`);
  if (!process.argv.includes('--force') && manifest[key] && fs.existsSync(gifFile) && fs.existsSync(posterFile)) return;
  const is3d = job.slug.endsWith('-3d');
  if (is3d) { while (rendering3d) await sleep(200); rendering3d = true; }
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'no-preference', locale: 'pt-BR' });
  const page = await context.newPage(); page.setDefaultTimeout(10000); const errors = []; page.on('pageerror', error => errors.push(error.message));
  try {
    const gameplay = job.slug === 'platformer' || job.slug === 'space-shooter';
    if (gameplay) await page.clock.install({ time: new Date('2026-10-27T12:00:00Z') });
    await page.goto(`${base}/modelos/${job.slug}/?visual=${job.visual}`, { waitUntil: 'networkidle' });
    await page.locator(`.visual-${job.visual}`).waitFor(); await page.evaluate(() => document.fonts.ready);
    if (job.slug.endsWith('-3d')) await page.locator('.scene-status-ready').first().waitFor({ timeout: 25000 });
    const top = await page.locator('.d-main').evaluate(el => el.getBoundingClientRect().top + window.scrollY - 75);
    await page.evaluate(y => window.scrollTo(0, y), Math.max(0, top)); await sleep(900);
    if (gameplay) await page.clock.pauseAt(new Date('2026-10-27T13:00:00Z'));
    const gif = GIFEncoder(); const frames = []; let poster;
    for (let frame = 0; frame < 20; frame++) {
      if (frame === 3 || frame === 8 || frame === 13) { await action(page, job.slug, frame === 3 ? 0 : frame === 8 ? 1 : 2); await sleep(200); }
      if (is3d && (frame === 3 || frame === 8 || frame === 13)) { await page.evaluate(y => window.scrollTo(0, y), Math.max(0, top)); await sleep(200); }
      if (gameplay && frame === 3) {
        const boardTop = await page.locator('.advanced-hud').evaluate(el => el.getBoundingClientRect().top + window.scrollY - 70);
        await page.evaluate(y => window.scrollTo(0, y), boardTop);
      }
      if (job.slug === 'platformer' && frame === 5) await page.keyboard.press('Space');
      if (job.slug === 'platformer' && frame === 15) await page.keyboard.up('ArrowRight');
      // A small real scroll between actions shows the depth of presentation-led pages.
      if (['commerce', 'education', 'portfolio', 'clinic', 'booking', 'health', 'study-planner'].includes(job.slug) && frame >= 16) await page.mouse.wheel(0, 65);
      if (gameplay) await page.clock.runFor(170); else await sleep(100);
      if (gameplay && frame > 3 && await page.locator('.advanced-game-overlay').count()) throw new Error('Gameplay was interrupted during capture.');
      const screenshot = await page.screenshot({ type: 'jpeg', quality: 86, caret: 'hide', animations: 'disabled', timeout: 30000 });
      const image = sharp(screenshot).resize(720, 450); const raw = await image.clone().ensureAlpha().raw().toBuffer();
      if (frame === 0) poster = await image.clone().jpeg({ quality: 82 }).toBuffer();
      const palette = quantize(raw, 96, { format: 'rgb444' }); const indexed = applyPalette(raw, palette, 'rgb444');
      gif.writeFrame(indexed, 720, 450, { palette, delay: frame === 0 ? 650 : frame === 19 ? 850 : 170, repeat: 0 });
      frames.push(frame);
    }
    if (errors.length) throw new Error(errors.join('; '));
    gif.finish(); fs.writeFileSync(gifFile, gif.bytes()); fs.writeFileSync(posterFile, poster);
    manifest[key] = { slug: job.slug, visual: job.visual, width: 720, height: 450, frames: frames.length, gif: `${key}.gif`, poster: `${key}.jpg`, bytes: fs.statSync(gifFile).size, source: 'Local application recording', kind: 'interaction-and-scroll' };
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Recorded ${key}: ${Math.round(manifest[key].bytes / 1024)} KB`);
  } finally { await context.close(); if (is3d) rendering3d = false; }
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const failures = []; let cursor = 0;
  async function worker() { while (cursor < jobs.length) { const job = jobs[cursor++]; try { await record(browser, job); } catch (error) { failures.push({ ...job, error: error.message }); console.error(`FAILED ${job.slug}/${job.visual}: ${error.message}`); } } }
  try { await Promise.all([worker(), worker()]); } finally { await browser.close(); }
  console.log(`Recordings available: ${Object.keys(manifest).length}; failures: ${failures.length}`);
  if (failures.length) { fs.writeFileSync(path.join(root, '.preview-recording-errors.json'), JSON.stringify(failures, null, 2)); process.exitCode = 1; }
})().catch(error => { console.error(error); process.exitCode = 1; });
