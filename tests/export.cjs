const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.join(__dirname, '..');
function load(file) { const context = { exports: {} }; vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context); return context.exports; }
const { demos } = load('app/modelos/catalog.ts');
const { visualProfiles } = load('app/modelos/visuals.ts');
const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
for (const route of ['', 'modelos', ...demos.map(d => `modelos/${d.slug}`)]) {
  const file = path.join(root, 'out', route, 'index.html'); assert.ok(fs.existsSync(file), `Missing ${route}`);
  const html = fs.readFileSync(file, 'utf8');
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1].replaceAll('&amp;', '&'));
  for (const link of links) {
    if (!link.startsWith('/') || link.startsWith('//')) continue;
    assert.ok(!base || link.startsWith(`${base}/`) || link === base, `Unprefixed link on ${route}: ${link}`);
    const local = decodeURIComponent(link.split(/[?#]/)[0].slice(base.length));
    assert.ok(fs.existsSync(path.join(root, 'out', local)), `Missing asset/route on ${route}: ${link}`);
  }
  if (route === 'modelos') for (const demo of demos) for (const visual of visualProfiles[demo.slug]) {
    assert.ok(links.some(link => link.split('?')[0].replace(/\/$/, '') === `${base}/modelos/${demo.slug}` && link.includes(`visual=${visual}`)), `Missing variation: ${demo.slug}/${visual}`);
  }
}
assert.ok(fs.existsSync(path.join(root, 'out/404.html')));
console.log(`Static export validated: ${demos.length} applications, all variant links and local assets under ${base || '/'}.`);
