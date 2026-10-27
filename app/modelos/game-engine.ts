export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export type Mode = 'ready' | 'playing' | 'paused' | 'gameover' | 'levelcomplete' | 'won';
export type Controls = { left: boolean; right: boolean; up: boolean; down: boolean; action: boolean; jump: boolean };
export const emptyControls = (): Controls => ({ left: false, right: false, up: false, down: false, action: false, jump: false });
export type Rect = { x: number; y: number; w: number; h: number };
export const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export type Level = { title: string; width: number; platforms: Rect[]; coins: { x: number; y: number }[]; enemies: { x: number; y: number; min: number; max: number }[]; spikes: Rect[]; checkpoint: number; sky: string[] };
const ground = (x: number, w: number): Rect => ({ x, y: 470, w, h: 100 });
const ledge = (x: number, y: number, w = 130): Rect => ({ x, y, w, h: 24 });
export const platformLevels: Level[] = [
  { title: 'Jardins suspensos', width: 2850, platforms: [ground(0, 640), ground(740, 600), ground(1440, 600), ground(2150, 700), ledge(270, 365), ledge(460, 290), ledge(900, 370), ledge(1120, 315), ledge(1630, 370), ledge(1860, 300), ledge(2390, 360)], coins: [{ x: 320, y: 330 }, { x: 510, y: 255 }, { x: 680, y: 350 }, { x: 950, y: 335 }, { x: 1170, y: 280 }, { x: 1390, y: 355 }, { x: 1680, y: 335 }, { x: 1910, y: 265 }, { x: 2090, y: 350 }, { x: 2440, y: 325 }, { x: 2670, y: 420 }], enemies: [{ x: 850, y: 442, min: 780, max: 1250 }, { x: 1580, y: 442, min: 1500, max: 1950 }, { x: 2440, y: 442, min: 2230, max: 2680 }], spikes: [{ x: 1780, y: 452, w: 62, h: 18 }], checkpoint: 1500, sky: ['#203d58', '#91b6b1'] },
  { title: 'Ruínas do crepúsculo', width: 3200, platforms: [ground(0, 520), ground(630, 560), ground(1300, 600), ground(2010, 510), ground(2630, 570), ledge(220, 365), ledge(410, 290), ledge(820, 360), ledge(1040, 285), ledge(1440, 365), ledge(1660, 290), ledge(2160, 360), ledge(2400, 300), ledge(2800, 360)], coins: [{ x: 270, y: 330 }, { x: 460, y: 255 }, { x: 575, y: 350 }, { x: 870, y: 325 }, { x: 1090, y: 250 }, { x: 1240, y: 350 }, { x: 1490, y: 330 }, { x: 1710, y: 255 }, { x: 1950, y: 350 }, { x: 2210, y: 325 }, { x: 2570, y: 350 }, { x: 2850, y: 325 }], enemies: [{ x: 740, y: 442, min: 670, max: 1100 }, { x: 1480, y: 442, min: 1360, max: 1810 }, { x: 2180, y: 442, min: 2070, max: 2430 }, { x: 2820, y: 442, min: 2700, max: 3050 }], spikes: [{ x: 930, y: 452, w: 62, h: 18 }, { x: 2230, y: 452, w: 70, h: 18 }], checkpoint: 1360, sky: ['#39345d', '#c2a596'] },
  { title: 'O farol das centelhas', width: 3480, platforms: [ground(0, 490), ground(600, 520), ground(1230, 580), ground(1920, 530), ground(2560, 460), ground(3130, 350), ledge(230, 365), ledge(730, 365), ledge(960, 290), ledge(1410, 360), ledge(1640, 285), ledge(2070, 360), ledge(2310, 285), ledge(2700, 360), ledge(2920, 290), ledge(3210, 360)], coins: [{ x: 280, y: 330 }, { x: 545, y: 350 }, { x: 780, y: 330 }, { x: 1010, y: 255 }, { x: 1175, y: 350 }, { x: 1460, y: 325 }, { x: 1690, y: 250 }, { x: 1860, y: 350 }, { x: 2120, y: 325 }, { x: 2360, y: 250 }, { x: 2500, y: 350 }, { x: 2750, y: 325 }, { x: 2970, y: 255 }, { x: 3075, y: 350 }, { x: 3260, y: 325 }], enemies: [{ x: 780, y: 442, min: 640, max: 1030 }, { x: 1390, y: 442, min: 1290, max: 1720 }, { x: 2090, y: 442, min: 1980, max: 2360 }, { x: 2730, y: 442, min: 2620, max: 2930 }], spikes: [{ x: 1510, y: 452, w: 70, h: 18 }, { x: 2130, y: 452, w: 65, h: 18 }, { x: 2770, y: 452, w: 65, h: 18 }], checkpoint: 1980, sky: ['#182f4b', '#90aeb2'] },
];
export type PlatformState = { level: number; player: Rect & { vx: number; vy: number; grounded: boolean; facing: number }; coins: boolean[]; enemies: (Rect & { min: number; max: number; direction: number; alive: boolean })[]; lives: number; score: number; time: number; mode: Mode; checkpoint: boolean; invulnerable: number; coyote: number; jumpBuffer: number; camera: number };
export function createPlatform(level = 0, previous?: PlatformState): PlatformState {
  const map = platformLevels[level];
  return { level, player: { x: 60, y: 430, w: 28, h: 36, vx: 0, vy: 0, grounded: false, facing: 1 }, coins: map.coins.map(() => false), enemies: map.enemies.map(e => ({ ...e, w: 34, h: 28, direction: 1, alive: true })), lives: previous?.lives ?? 3, score: previous?.score ?? 0, time: previous?.time ?? 0, mode: 'ready', checkpoint: false, invulnerable: 0, coyote: 0, jumpBuffer: 0, camera: 0 };
}
function platformDamage(state: PlatformState) {
  if (state.invulnerable > 0 || state.mode !== 'playing') return;
  state.lives--; if (state.lives <= 0) { state.mode = 'gameover'; return; }
  state.player.x = state.checkpoint ? platformLevels[state.level].checkpoint : 60; state.player.y = 420; state.player.vx = 0; state.player.vy = 0; state.player.grounded = false; state.invulnerable = 1.5; state.coyote = 0; state.jumpBuffer = 0;
}
export function stepPlatform(state: PlatformState, input: Controls, dt: number) {
  if (state.mode !== 'playing') return;
  const map = platformLevels[state.level]; const player = state.player;
  state.time += dt; state.invulnerable = Math.max(0, state.invulnerable - dt);
  state.coyote = player.grounded ? .1 : Math.max(0, state.coyote - dt); state.jumpBuffer = input.jump ? .12 : Math.max(0, state.jumpBuffer - dt);
  if (state.jumpBuffer > 0 && state.coyote > 0) { player.vy = -650; player.grounded = false; state.jumpBuffer = 0; state.coyote = 0; }
  const direction = Number(input.right) - Number(input.left); player.vx = direction * 255; if (direction) player.facing = direction;
  player.x = clamp(player.x + player.vx * dt, 0, map.width - player.w);
  for (const platform of map.platforms) if (overlaps(player, platform)) { if (player.vx > 0) player.x = platform.x - player.w; else if (player.vx < 0) player.x = platform.x + platform.w; }
  const oldBottom = player.y + player.h; player.vy = Math.min(900, player.vy + 1700 * dt); player.y += player.vy * dt; player.grounded = false;
  for (const platform of map.platforms) if (overlaps(player, platform)) { if (player.vy >= 0) { player.y = platform.y - player.h; player.vy = 0; player.grounded = true; } else { player.y = platform.y + platform.h; player.vy = 0; } }
  map.coins.forEach((coin, i) => { if (!state.coins[i] && overlaps(player, { x: coin.x - 10, y: coin.y - 10, w: 20, h: 20 })) { state.coins[i] = true; state.score += 100; } });
  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    enemy.x += enemy.direction * (55 + state.level * 12) * dt;
    if (enemy.x < enemy.min || enemy.x > enemy.max) { enemy.direction *= -1; enemy.x = clamp(enemy.x, enemy.min, enemy.max); }
    if (overlaps(player, enemy)) { if (player.vy > 0 && oldBottom <= enemy.y + 12) { enemy.alive = false; player.vy = -410; state.score += 200; } else platformDamage(state); }
  }
  if (map.spikes.some(spike => overlaps(player, spike))) platformDamage(state);
  if (player.y > GAME_HEIGHT + 80) { state.invulnerable = 0; platformDamage(state); }
  if (player.x >= map.checkpoint && player.y < 480) state.checkpoint = true;
  if (player.x > map.width - 100 && player.y < 470 && state.mode === 'playing') { state.score += 500; state.mode = state.level === platformLevels.length - 1 ? 'won' : 'levelcomplete'; }
  state.camera = clamp(player.x - 300, 0, map.width - GAME_WIDTH);
}

export type Shot = { x: number; y: number; active: boolean };
export type Foe = { x: number; y: number; baseX: number; baseY: number; hp: number; alive: boolean; phase: number };
export type ShooterState = { player: { x: number; y: number }; enemies: Foe[]; shots: Shot[]; hostile: Shot[]; lives: number; score: number; wave: number; time: number; mode: Mode; cooldown: number; invulnerable: number; fireTimer: number; cursor: number };
function createWave(wave: number): Foe[] { return Array.from({ length: 6 + wave * 3 }, (_, i) => ({ x: 150 + i % 6 * 125, y: 65 + Math.floor(i / 6) * 55, baseX: 150 + i % 6 * 125, baseY: 65 + Math.floor(i / 6) * 55, hp: wave >= 4 ? 2 : 1, alive: true, phase: i * .6 })); }
export function createShooter(): ShooterState { return { player: { x: 480, y: 465 }, enemies: createWave(1), shots: [], hostile: [], lives: 3, score: 0, wave: 1, time: 0, mode: 'ready', cooldown: 0, invulnerable: 0, fireTimer: 1.2, cursor: 0 }; }
function shooterDamage(state: ShooterState) { if (state.invulnerable > 0) return; state.lives--; state.invulnerable = 1.4; if (state.lives <= 0) state.mode = 'gameover'; }
export function stepShooter(state: ShooterState, input: Controls, dt: number) {
  if (state.mode !== 'playing') return;
  state.time += dt; state.cooldown -= dt; state.invulnerable = Math.max(0, state.invulnerable - dt);
  const dx = Number(input.right) - Number(input.left); const dy = Number(input.down) - Number(input.up); const factor = dx && dy ? Math.SQRT1_2 : 1;
  state.player.x = clamp(state.player.x + dx * 330 * factor * dt, 25, 935); state.player.y = clamp(state.player.y + dy * 330 * factor * dt, 285, 510);
  if (input.action && state.cooldown <= 0) { state.shots.push({ x: state.player.x, y: state.player.y - 20, active: true }); state.cooldown = .16; }
  for (const enemy of state.enemies) if (enemy.alive) { enemy.x = enemy.baseX + Math.sin(state.time * .9 + enemy.phase) * 65; enemy.y = enemy.baseY + Math.sin(state.time * .65 + enemy.phase) * 14; }
  state.fireTimer -= dt;
  if (state.fireTimer <= 0) { const alive = state.enemies.filter(e => e.alive); const enemy = alive[state.cursor++ % Math.max(1, alive.length)]; if (enemy) state.hostile.push({ x: enemy.x, y: enemy.y + 16, active: true }); state.fireTimer = Math.max(.2, .95 - state.wave * .13); }
  for (const shot of state.shots) { shot.y -= 580 * dt; if (shot.y < -20) shot.active = false; if (!shot.active) continue; for (const enemy of state.enemies) if (enemy.alive && Math.abs(shot.x - enemy.x) < 23 && Math.abs(shot.y - enemy.y) < 20) { shot.active = false; enemy.hp--; if (enemy.hp <= 0) { enemy.alive = false; state.score += 150; } break; } }
  for (const shot of state.hostile) { shot.y += (180 + state.wave * 28) * dt; if (shot.y > 560) shot.active = false; if (shot.active && Math.abs(shot.x - state.player.x) < 20 && Math.abs(shot.y - state.player.y) < 22) { shot.active = false; shooterDamage(state); } }
  state.shots = state.shots.filter(s => s.active); state.hostile = state.hostile.filter(s => s.active);
  if (state.enemies.every(e => !e.alive) && state.mode === 'playing') { state.score += 500; if (state.wave === 5) state.mode = 'won'; else { state.wave++; state.enemies = createWave(state.wave); state.hostile = []; state.shots = []; state.invulnerable = 1.2; state.fireTimer = 1.2; } }
}
