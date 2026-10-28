const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
const sharp = require('sharp');
const root = path.join(__dirname, '..');
function load(file) { const context = { exports: {} }; vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, context); return context.exports; }
const { demos } = load('app/modelos/catalog.ts');
const { visualProfiles } = load('app/modelos/visuals.ts');
const directory = path.join(root, 'public/previews');
async function check() {
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8')); let count = 0; let bytes = 0;
  for (const demo of demos) for (const visual of visualProfiles[demo.slug]) {
    const key = `${demo.slug}-${visual}`; const item = manifest[key]; assert.ok(item, `Missing recording ${key}`);
    assert.equal(item.slug, demo.slug); assert.equal(item.visual, visual); assert.equal(item.frames, 20);
    const gif = fs.readFileSync(path.join(directory, item.gif)); assert.equal(gif.subarray(0, 6).toString(), 'GIF89a');
    const metadata = await sharp(gif).metadata(); assert.equal(metadata.pages, 20); assert.equal(metadata.width, 720); assert.equal(metadata.height, 450);
    assert.ok(gif.length < 4 * 1024 * 1024, `Recording too large: ${key}`);
    const first = await sharp(gif, { page: 0 }).raw().toBuffer(); const middle = await sharp(gif, { page: 12 }).raw().toBuffer();
    assert.notEqual(crypto.createHash('sha256').update(first).digest('hex'), crypto.createHash('sha256').update(middle).digest('hex'), `Recording has no change: ${key}`);
    const poster = await sharp(path.join(directory, item.poster)).metadata(); assert.equal(poster.width, 720); assert.equal(poster.height, 450);
    count++; bytes += gif.length;
  }
  assert.equal(count, demos.length * 3);
  console.log(`Validated ${count} real recordings: 20 frames each, visible changes, correct posters; ${(bytes / 1024 / 1024).toFixed(1)} MB total.`);
}
check().catch(error => { console.error(error); process.exitCode = 1; });
