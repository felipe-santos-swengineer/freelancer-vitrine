const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Load dependency-free domain modules without an extra test runner or build output.
function load(relativePath) {
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const context = { exports: {} }; vm.runInNewContext(result.outputText, context); return context.exports;
}
const { demos, categories, levels } = load('app/modelos/catalog.ts');
const { tablePrice, projectEstimate, studyPlan, generateMaze } = load('app/modelos/logic.ts');
const { identifyIntent, searchKnowledge, runAutomation } = load('app/modelos/ai-logic.ts');
const { visualStyles, visualProfiles, resolveVisual } = load('app/modelos/visuals.ts');
const { briefingWhatsAppUrl, formatBriefing } = load('app/contact.ts');
const { safeZoom, sceneDistance, finishes, sceneChapters } = load('app/modelos/three-config.ts');
const { createPlatform, stepPlatform, createShooter, stepShooter, emptyControls, platformLevels } = load('app/modelos/game-engine.ts');
const { paginate, pageForSlug, CATALOG_PAGE_SIZE } = load('app/modelos/pagination.ts');

test('catalog pagination covers all models once, with six items and a partial last page', () => {
  assert.equal(CATALOG_PAGE_SIZE, 6);
  const pages = Array.from({ length: Math.ceil(demos.length / CATALOG_PAGE_SIZE) }, (_, i) => paginate(demos, i + 1));
  assert.equal(pages[0].start, 1); assert.equal(pages[0].end, 6);
  assert.equal(pages.at(-1).end, demos.length);
  const all = pages.flatMap(p => p.items.map(item => item.slug));
  assert.equal(all.length, demos.length); assert.equal(new Set(all).size, demos.length);
  assert.equal(all.join(','), demos.map(d => d.slug).join(','));
  for (const page of pages) assert.ok(page.items.length <= 6);
});

test('pagination handles filtered results, out-of-range pages, empty search and direct anchors', () => {
  const games = demos.filter(d => d.category === 'Jogos');
  const filtered = paginate(games, 99); assert.equal(filtered.page, 1); assert.equal(filtered.items.length, games.length);
  const empty = paginate([], 5); assert.equal(empty.items.length, 0); assert.equal(empty.start, 0); assert.equal(empty.end, 0); assert.equal(empty.page, 1);
  assert.equal(paginate(demos, -4).page, 1); assert.equal(paginate(demos, NaN).page, 1);
  assert.equal(paginate(demos, 100).page, Math.ceil(demos.length / 6));
  for (const demo of demos) { const page = pageForSlug(demos, demo.slug); assert.ok(paginate(demos, page).items.some(d => d.slug === demo.slug)); }
  assert.equal(pageForSlug(demos, 'modelo-inexistente'), null);
});

test('platform physics clears the first gap, lands and stays still when paused', () => {
  const state = createPlatform(); state.mode = 'playing'; state.enemies.forEach(e => { e.alive = false; });
  Object.assign(state.player, { x: 610, y: 434, grounded: true });
  const input = emptyControls(); input.right = true; input.jump = true;
  stepPlatform(state, input, 1 / 60); assert.ok(state.player.vy < 0);
  input.jump = false;
  for (let i = 0; i < 55; i++) stepPlatform(state, input, 1 / 60);
  assert.ok(state.player.x > 740); assert.equal(state.player.grounded, true); assert.equal(state.lives, 3);
  state.mode = 'paused'; const before = JSON.stringify(state); stepPlatform(state, input, 1 / 60); assert.equal(JSON.stringify(state), before);
});

test('jump height can reach the 105px entry platforms without allowing repeated air jumps', () => {
  const state = createPlatform(); state.mode = 'playing'; state.enemies.forEach(e => { e.alive = false; });
  Object.assign(state.player, { x: 50, y: 434, grounded: true });
  const input = emptyControls(); input.jump = true; stepPlatform(state, input, 1 / 60); input.jump = false;
  let top = state.player.y;
  for (let frame = 0; frame < 40; frame++) { if (frame === 8) input.jump = true; else input.jump = false; stepPlatform(state, input, 1 / 60); top = Math.min(top, state.player.y); }
  const height = 434 - top; assert.ok(height >= 105); assert.ok(height < 130);
});

test('collectibles cannot score twice and falling respawns at the activated checkpoint', () => {
  const state = createPlatform(); state.mode = 'playing'; const coin = platformLevels[0].coins[0];
  Object.assign(state.player, { x: coin.x - 14, y: coin.y - 18 }); stepPlatform(state, emptyControls(), 1 / 60);
  assert.equal(state.score, 100); stepPlatform(state, emptyControls(), 1 / 60); assert.equal(state.score, 100);
  state.checkpoint = true; state.player.y = 700; stepPlatform(state, emptyControls(), 1 / 60);
  assert.equal(state.lives, 2); assert.equal(state.player.x, platformLevels[0].checkpoint); assert.ok(state.invulnerable > 0);
  const lives = state.lives; state.enemies[0].x = state.player.x; state.enemies[0].y = state.player.y; stepPlatform(state, emptyControls(), 1 / 60); assert.equal(state.lives, lives);
});

test('platform progression preserves score and lives and ends on the third portal', () => {
  let state = createPlatform(); state.mode = 'playing'; state.lives = 2; state.score = 100;
  for (let level = 0; level < 3; level++) {
    state.player.x = platformLevels[level].width - 80; state.player.y = 430;
    stepPlatform(state, emptyControls(), 1 / 60);
    assert.equal(state.mode, level === 2 ? 'won' : 'levelcomplete');
    if (level < 2) { state = createPlatform(level + 1, state); state.mode = 'playing'; }
  }
  assert.equal(state.lives, 2); assert.equal(state.score, 1600);
});

test('stomping an enemy rewards the player and bounces upward', () => {
  const state = createPlatform(); state.mode = 'playing'; const enemy = state.enemies[0];
  Object.assign(state.player, { x: enemy.x + 3, y: enemy.y - 37, vy: 160 });
  stepPlatform(state, emptyControls(), 1 / 60);
  assert.equal(enemy.alive, false); assert.equal(state.score, 200); assert.ok(state.player.vy < 0); assert.equal(state.lives, 3);
});

test('shooter respects firing cooldown and one shield loss during invulnerability', () => {
  const state = createShooter(); state.mode = 'playing'; const input = emptyControls(); input.action = true;
  stepShooter(state, input, 1 / 60); assert.equal(state.shots.length, 1);
  stepShooter(state, input, 1 / 60); assert.equal(state.shots.length, 1);
  for (let i = 0; i < 2; i++) state.hostile.push({ x: state.player.x, y: state.player.y - 4, active: true });
  stepShooter(state, emptyControls(), 1 / 60); assert.equal(state.lives, 2); assert.ok(state.invulnerable > 0);
});

test('projectile collision destroys a target and fifth wave completes the expedition', () => {
  const state = createShooter(); state.mode = 'playing'; const target = state.enemies[0];
  target.phase = 0; state.time = -1 / 60; state.shots.push({ x: target.baseX, y: target.baseY + 10, active: true });
  stepShooter(state, emptyControls(), 1 / 60); assert.equal(target.alive, false); assert.equal(state.score, 150);
  state.enemies.forEach(e => { e.alive = false; }); stepShooter(state, emptyControls(), 1 / 60); assert.equal(state.wave, 2); assert.ok(state.enemies.some(e => e.alive));
  state.wave = 5; state.enemies.forEach(e => { e.alive = false; }); stepShooter(state, emptyControls(), 1 / 60); assert.equal(state.mode, 'won');
});

test('briefing targets the owner and preserves accents, line breaks and query characters', () => {
  const brief = { name: '  José & Ana  ', email: 'contato+projeto@example.com', idea: ' Loja & cursos?\nOrçamento: R$ 2.000 + integração #1 🚀 ' };
  const url = new URL(briefingWhatsAppUrl(brief));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5588998378028');
  assert.equal(url.searchParams.get('text'), formatBriefing(brief));
  assert.equal([...url.searchParams.keys()].length, 1);
  assert.ok(url.searchParams.get('text').includes('José & Ana\nE-mail: contato+projeto@example.com'));
  assert.equal(url.hash, '');
});

test('every category offers essential, professional and innovative applications', () => {
  assert.equal(new Set(demos.map(d => d.slug)).size, demos.length);
  assert.equal(demos.length, 25);
  for (const category of categories) {
    for (const level of levels) assert.ok(demos.some(d => d.category === category && d.level === level), `${category} needs ${level}`);
  }
  for (const demo of demos) { assert.ok(demo.audience.length > 10); assert.ok(demo.features.length >= 3); }
});

test('configurator charges once for each selected option and measurement', () => {
  assert.equal(tablePrice(100, 'Natural', 'Metal'), 490);
  assert.equal(tablePrice(200, 'Nogueira', 'Cavalete'), 1550);
  assert.equal(tablePrice(140, 'Carvalho', 'Painel'), 980);
  assert.equal(tablePrice(150, 'Natural', 'Metal') - tablePrice(140, 'Natural', 'Metal'), 70);
});

test('each application has three distinct visual compositions and safe shared URL selection', () => {
  assert.equal(Object.keys(visualStyles).length, 6);
  let combinations = 0;
  for (const demo of demos) {
    const variants = visualProfiles[demo.slug];
    assert.equal(variants.length, 3); assert.equal(new Set(variants).size, 3);
    for (const variant of variants) {
      assert.ok(visualStyles[variant]);
      assert.ok(visualStyles[variant].nav.length > 5);
      assert.equal(resolveVisual(demo.slug, variant), variant);
      combinations++;
    }
    assert.equal(resolveVisual(demo.slug, 'invalid-style'), variants[0]);
    assert.equal(resolveVisual(demo.slug, null), variants[0]);
    const unavailable = Object.keys(visualStyles).find(v => !variants.includes(v));
    assert.equal(resolveVisual(demo.slug, unavailable), variants[0]);
  }
  assert.equal(combinations, 75);
  assert.equal(new Set(Object.values(visualStyles).map(v => v.nav)).size, 6);
});

test('3D controls keep safe zoom limits and all chapters have unique materials', () => {
  assert.equal(safeZoom(0), .65); assert.equal(safeZoom(10), 1.7);
  assert.equal(safeZoom(NaN), 1); assert.equal(safeZoom(Infinity), 1); assert.equal(safeZoom(1.25), 1.25);
  assert.ok(sceneDistance('space') > sceneDistance('product'));
  assert.equal(new Set(finishes.map(f => f.hex)).size, finishes.length);
  assert.equal(sceneChapters.length, 3); assert.equal(new Set(sceneChapters.map(c => c.title)).size, 3);
  for (const color of [...finishes.map(f => f.hex), ...sceneChapters.map(c => c.color)]) assert.match(color, /^#[0-9a-f]{6}$/i);
  for (const slug of ['product-3d', 'space-3d', 'immersive-3d']) assert.ok(demos.some(d => d.slug === slug && d.category === 'Experiências 3D'));
});

test('support triage prioritizes a human request over commercial intent', () => {
  assert.equal(identifyIntent('Quero um orçamento e falar com atendente'), 'human');
  assert.equal(identifyIntent('Qual o preço?'), 'price');
  assert.equal(identifyIntent('Quero agendar'), 'schedule');
  assert.equal(identifyIntent('Qual horário de funcionamento?'), 'hours');
  assert.equal(identifyIntent('Olá!'), 'greeting');
  assert.equal(identifyIntent('Explique astronomia'), 'unknown');
});

test('knowledge search handles accents, returns sources and stays empty without evidence', () => {
  const docs = [{ id: '1', title: 'Horário de suporte', text: 'Atendemos de segunda a sexta.' }, { id: '2', title: 'Entrega de projetos', text: 'O lançamento depende de aprovação.' }];
  const result = searchKnowledge('Qual horario de suporte?', docs);
  assert.equal(result[0].id, '1'); assert.equal(result[0].text, docs[0].text);
  assert.equal(searchKnowledge('Como funciona astronomia?', docs).length, 0);
  assert.equal(searchKnowledge('', docs).length, 0);
  assert.equal(searchKnowledge('Quero suporte', []).length, 0);
});

test('automation holds priority and human requests for review and never reports a real send', () => {
  const input = { name: 'Pessoa Exemplo', email: 'example@example.com', message: 'Quero agendar uma conversa', value: 1500 };
  const high = runAutomation(input, 1500, true);
  assert.equal(high.priority, 'Alta'); assert.equal(high.needsReview, true); assert.equal(high.team, 'Agendamentos');
  const normal = runAutomation({ ...input, value: 1499 }, 1500, false);
  assert.equal(normal.priority, 'Normal'); assert.equal(normal.needsReview, false); assert.equal(normal.summary, input.message);
  const human = runAutomation({ ...input, message: 'Preciso de um atendente', value: 0 }, 1500, true);
  assert.equal(human.needsReview, true); assert.equal(human.team, 'Relacionamento');
  assert.ok(!high.draft.includes('agendamento confirmado'));
});

test('project estimate includes dimensions, rooms and the selected extras only', () => {
  const base = projectEstimate(60, 3, []);
  assert.equal(base.total, 3420); assert.equal(base.days, 16);
  const full = projectEstimate(60, 3, ['Visualização 3D', 'Projeto de iluminação', 'Lista de compras', 'Acompanhamento remoto']);
  assert.equal(full.total, 5520); assert.equal(full.days, 24);
});

test('study plan respects daily availability and rotates subjects evenly', () => {
  for (const days of [3, 5, 7, 14]) for (const minutes of [25, 50, 75, 100]) {
    const subjects = ['Matemática', 'História', 'Programação']; const plan = studyPlan(subjects, days, minutes);
    assert.equal(plan.length, days * (minutes / 25));
    assert.equal(new Set(plan.map(s => s.id)).size, plan.length);
    assert.ok(plan.every(s => !s.complete && s.minutes > 0 && subjects.includes(s.subject)));
    for (let day = 1; day <= days; day++) assert.equal(plan.filter(s => s.day === day).reduce((sum, s) => sum + s.minutes, 0), minutes);
    const counts = subjects.map(subject => plan.filter(s => s.subject === subject).length);
    assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
  }
  assert.equal(studyPlan([], 7, 50).length, 0);
});

test('procedural mazes have reachable exits and crystals, symmetric paths and no row wrapping', () => {
  for (const size of [6, 8, 10]) for (let run = 0; run < 20; run++) {
    const maze = generateMaze(size); const reached = new Set([0]); const pending = [0];
    while (pending.length) {
      const cell = pending.pop();
      for (const neighbor of maze.paths[cell]) {
        assert.ok(neighbor >= 0 && neighbor < size * size);
        assert.ok(maze.paths[neighbor].includes(cell));
        assert.equal(Math.abs(cell % size - neighbor % size) + Math.abs(Math.floor(cell / size) - Math.floor(neighbor / size)), 1);
        if (!reached.has(neighbor)) { reached.add(neighbor); pending.push(neighbor); }
      }
    }
    assert.equal(reached.size, size * size);
    assert.equal(maze.paths.reduce((sum, neighbors) => sum + neighbors.length, 0), (size * size - 1) * 2);
    assert.equal(new Set(maze.crystals).size, 3);
    assert.ok(maze.crystals.every(cell => reached.has(cell) && cell !== 0 && cell !== size * size - 1));
  }
});
