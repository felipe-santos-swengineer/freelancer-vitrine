const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) { const ctx = { exports: {} }; vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, ctx); return ctx.exports; }
const { demos } = load('app/modelos/catalog.ts'); const { pageForSlug } = load('app/modelos/pagination.ts');
const base = (process.argv[2] || 'http://localhost:3100/freelancer-vitrine').replace(/\/$/, '');
async function poll(check) { const until = Date.now() + 12000; while (Date.now() < until) { if (await check()) return; await new Promise(r => setTimeout(r, 120)); } throw new Error('Timed out waiting for preview UI state.'); }
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' }); const errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('response', response => { if (response.url().includes('/previews/') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`${base}/modelos/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('[data-model-preview="recording"]').count(), 6);
    const first = page.locator('.model-recording').first(); await first.scrollIntoViewIfNeeded();
    await poll(async () => (await first.locator('img').getAttribute('src')).endsWith('.gif'));
    await poll(() => first.locator('img').evaluate(img => img.complete && img.naturalWidth === 720));
    await first.getByRole('button', { name: /^Pausar GIF/ }).click();
    await poll(async () => (await first.locator('img').getAttribute('src')).endsWith('.jpg'));
    await first.getByRole('button', { name: /^Reproduzir GIF/ }).click();
    await poll(async () => (await first.locator('img').getAttribute('src')).endsWith('.gif'));
    await page.getByRole('button', { name: 'Ir para página 2', exact: true }).click();
    await poll(async () => await page.locator('.visual-catalog-card').first().getAttribute('id') === demos[6].slug);
    assert.ok((await page.locator('.catalog-pagination>p').textContent()).includes('7–12'));
    await page.getByLabel(/^Categoria/).selectOption({ label: 'Jogos' });
    await poll(async () => await page.locator('.visual-catalog-card').count() === 5);
    assert.equal(await page.locator('.visual-catalog-card').first().getAttribute('id'), 'platformer');
    await page.getByRole('textbox', { name: /Buscar modelo/ }).fill('nenhum-modelo-xyz');
    await poll(async () => await page.locator('.visual-catalog-card').count() === 0);
    await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
    await poll(async () => await page.locator('.visual-catalog-card').count() === 6);
    await page.goto(`${base}/modelos/#wellness`, { waitUntil: 'networkidle' });
    await page.locator('article#wellness').waitFor({ state: 'visible' });
    assert.equal(Number(await page.locator('.catalog-page-numbers .current-page').textContent()), pageForSlug(demos, 'wellness'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await poll(async () => await page.locator('.model-recording img[src$=".gif"]').count() === 0);
    assert.equal(await page.locator('.model-recording-footer button:disabled').count(), 6);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.getByRole('button', { name: 'Brutalista', exact: true }).click();
    await poll(async () => await page.locator('.visual-catalog-card').first().getAttribute('id') === 'commerce');
    await page.locator('.model-recording').first().scrollIntoViewIfNeeded();
    await poll(async () => (await page.locator('.model-recording img').first().getAttribute('src')).endsWith('commerce-brutalist.gif'));
    assert.equal(await page.locator('[aria-roledescription="carrossel"]').count(), 0);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'vitrine-gif-catalog.png'), animations: 'disabled', timeout: 30000 });
    console.log('Browser checks passed: real GIF loading, pause/play, pagination, filtering, direct anchors and reduced motion.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
