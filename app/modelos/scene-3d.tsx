'use client';
import { useEffect, useRef, useState } from 'react';
import { safeZoom, sceneDistance, type SceneKind } from './three-config';

type SceneProps = { kind: SceneKind; color?: string; variant?: number; autoRotate?: boolean; zoom?: number; lighting?: 'day' | 'night'; view?: 'overview' | 'front' | 'side'; resetKey?: number; exploded?: boolean; label?: string; embedded?: boolean };
export default function Scene3D({ kind, color = '#b19ddd', variant = 0, autoRotate = true, zoom = 1, lighting = 'day', view = 'overview', resetKey = 0, exploded = false, label = 'Cena tridimensional interativa', embedded = false }: SceneProps) {
  const host = useRef<HTMLDivElement>(null); const live = useRef({ color, variant, autoRotate, zoom, lighting, view, resetKey, exploded });
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading'); const [retry, setRetry] = useState(0);
  useEffect(() => { live.current = { color, variant, autoRotate, zoom, lighting, view, resetKey, exploded }; }, [color, variant, autoRotate, zoom, lighting, view, resetKey, exploded]);
  useEffect(() => { host.current?.querySelector('canvas')?.setAttribute('aria-label', `${label}. Arraste ou use as setas do teclado para girar.`); }, [label]);
  useEffect(() => {
    const container = host.current; if (!container) return;
    let cancelled = false; let release = () => {}; let visible = true; const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setStatus('loading');
    async function initialize() {
      try {
        const THREE = await import('three'); const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
        if (cancelled || !container) return;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        release = () => { renderer.setAnimationLoop(null); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); renderer.setClearColor(0x000000, 0); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.35;
        container.appendChild(renderer.domElement); renderer.domElement.tabIndex = 0; renderer.domElement.setAttribute('role', 'img'); renderer.domElement.setAttribute('aria-label', `${label}. Arraste ou use as setas do teclado para girar.${embedded ? '' : ' Use a roda para aproximar.'}`);
        const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100); const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false; controls.enableZoom = !embedded; controls.minDistance = kind === 'space' ? 3.5 : 2.4; controls.maxDistance = 12; controls.maxPolarAngle = Math.PI * 0.85; controls.autoRotateSpeed = 0.8;
        const target = new THREE.Vector3(0, kind === 'space' ? .65 : .25, 0); controls.target.copy(target);
        const ambient = new THREE.HemisphereLight(0xe9efff, 0x49405a, 2.4); scene.add(ambient);
        const key = new THREE.DirectionalLight(0xffedcf, 4); key.position.set(3, 5, 4); scene.add(key);
        const rim = new THREE.DirectionalLight(0xc0b4ff, 3); rim.position.set(-4, 3, -3); scene.add(rim);
        const root = new THREE.Group(); scene.add(root); const accents: InstanceType<typeof THREE.MeshStandardMaterial>[] = []; const moving: InstanceType<typeof THREE.Group>[] = []; const cups: InstanceType<typeof THREE.Mesh>[] = [];
        const material = (value: string, metalness = .2, roughness = .4) => new THREE.MeshStandardMaterial({ color: value, metalness, roughness });
        const accent = material(live.current.color, .45, .3); accents.push(accent);
        const dark = material('#262a30', .3, .35); const metal = material('#a9b1bd', .75, .2); const cream = material('#e4dccb', .1, .7);
        function box(w: number, h: number, d: number, mat: InstanceType<typeof THREE.MeshStandardMaterial>, x: number, y: number, z: number, parent = root) { const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
        function sphere(radius: number, mat: InstanceType<typeof THREE.MeshStandardMaterial>, x: number, y: number, z: number, parent = root) { const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 20), mat); mesh.position.set(x, y, z); parent.add(mesh); return mesh; }
        if (kind === 'product') {
          const band = new THREE.Mesh(new THREE.TorusGeometry(1.02, .115, 18, 90, Math.PI), accent); band.position.y = .12; root.add(band);
          const inner = new THREE.Mesh(new THREE.TorusGeometry(.98, .07, 14, 90, Math.PI), dark); inner.position.set(0, .1, -.02); root.add(inner);
          for (const sign of [-1, 1]) {
            const cup = new THREE.Mesh(new THREE.CylinderGeometry(.39, .39, .22, 48), accent); cup.rotation.z = Math.PI / 2; cup.position.set(sign * 1.05, -.15, 0); root.add(cup); cups.push(cup);
            const pad = new THREE.Mesh(new THREE.TorusGeometry(.28, .12, 16, 48), dark); pad.rotation.y = Math.PI / 2; pad.position.set(sign * .91, -.15, 0); root.add(pad);
            box(.08, .32, .12, metal, sign * 1.02, .13, 0);
            const disk = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .012, 40), metal); disk.rotation.z = Math.PI / 2; disk.position.set(sign * 1.17, -.15, 0); root.add(disk); cups.push(disk);
          }
          const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.65, .12, 72), material('#404153', .35, .45)); pedestal.position.y = -.83; root.add(pedestal); root.rotation.y = -.2;
        } else if (kind === 'space') {
          box(4.5, .13, 3.7, material('#bfa88a', .1, .8), 0, -.07, 0); box(4.5, 2.7, .1, cream, 0, 1.3, -1.85); box(.1, 2.7, 3.7, material('#c9c2b5', .1, .9), -2.25, 1.3, 0);
          box(2.5, .4, .85, accent, .15, .36, -.85); box(2.5, .65, .2, accent, .15, .78, -1.18);
          for (const x of [-1.03, 1.33]) box(.18, .43, .85, accent, x, .65, -.85);
          for (const x of [-.55, .8]) { const cushion = box(.63, .38, .18, material('#ded6c5'), x, .79, -1.01); cushion.rotation.z = .1; }
          box(2.7, .025, 1.65, material('#eee2ca', .05, .9), .1, .02, .4);
          const table = new THREE.Mesh(new THREE.CylinderGeometry(.58, .58, .08, 48), material('#775c47', .1, .6)); table.position.set(.1, .48, .5); root.add(table); box(.1, .45, .1, dark, .1, .23, .5);
          const vase = new THREE.Mesh(new THREE.CylinderGeometry(.09, .13, .22, 24), cream); vase.position.set(.15, .62, .5); root.add(vase);
          box(.65, .9, .06, material('#7b907a', .05, .8), .55, 1.85, -1.77); box(.72, .97, .025, material('#80684e'), .55, 1.85, -1.81);
          const plantpot = new THREE.Mesh(new THREE.CylinderGeometry(.2, .14, .35, 28), material('#b78d70')); plantpot.position.set(-1.55, .18, -.8); root.add(plantpot);
          box(.025, 1.1, .025, material('#536b45'), -1.55, .7, -.8); for (let i = 0; i < 6; i++) { const leaf = sphere(.2, material('#657a4b', 0, .8), -1.55 + Math.sin(i * 2) * .18, .65 + i * .12, -.8 + Math.cos(i * 2) * .18); leaf.scale.set(.5, 1.7, .65); leaf.rotation.z = Math.sin(i) * .7; }
          box(.04, 1.7, .04, dark, 1.73, .85, -1.2); const shade = new THREE.Mesh(new THREE.ConeGeometry(.35, .38, 48, 1, true), cream); shade.position.set(1.73, 1.75, -1.2); root.add(shade);
          box(.6, .7, .5, material('#8c6a51'), -1.7, .35, .75);
        } else {
          for (let chapter = 0; chapter < 3; chapter++) {
            const group = new THREE.Group(); root.add(group); moving.push(group);
            if (chapter === 0) { group.add(new THREE.Mesh(new THREE.TorusKnotGeometry(.8, .24, 150, 22), accent)); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.65, .012, 8, 100), metal); ring.rotation.x = Math.PI / 3; group.add(ring); }
            if (chapter === 1) { sphere(.48, accent, 0, 0, 0, group); for (let i = 0; i < 3; i++) { const orbit = new THREE.Group(); orbit.rotation.set(i * .9, i * .65, .3); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25 + i * .22, .025, 10, 100), accent); orbit.add(ring); sphere(.12, metal, 1.25 + i * .22, 0, 0, orbit); group.add(orbit); } }
            if (chapter === 2) { const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(.9, 0), accent); group.add(crystal); const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), new THREE.MeshBasicMaterial({ color: '#d0c0ee', wireframe: true, transparent: true, opacity: .35 })); group.add(wire); for (let i = 0; i < 8; i++) sphere(.08, metal, Math.sin(i) * 1.8, Math.cos(i * 2) * 1.5, Math.cos(i) * 1.3, group); }
          }
        }
        let lastColor = ''; let lastView = ''; let lastZoom = 0; let lastReset = -1; let dirty = true; let lastState = ''; const baseDistance = sceneDistance(kind);
        const invalidate = () => { dirty = true; }; controls.addEventListener('change', invalidate);
        const resize = new ResizeObserver(() => { const w = container.clientWidth; const h = container.clientHeight; if (w && h) { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true; } }); resize.observe(container);
        const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; dirty = true; }); intersection.observe(container);
        const onKey = (event: KeyboardEvent) => { if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return; event.preventDefault(); const offset = camera.position.clone().sub(controls.target); if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), event.key === 'ArrowLeft' ? .15 : -.15); else offset.y += event.key === 'ArrowUp' ? .25 : -.25; camera.position.copy(controls.target).add(offset); controls.update(); };
        renderer.domElement.addEventListener('keydown', onKey);
        const lost = (event: Event) => { event.preventDefault(); renderer.setAnimationLoop(null); if (!cancelled) setStatus('fallback'); }; renderer.domElement.addEventListener('webglcontextlost', lost);
        renderer.setAnimationLoop(() => {
          if (!visible || document.hidden || cancelled) return;
          const props = live.current; const paused = motion.matches || !!container.closest('.motion-paused');
          const state = `${props.color}/${props.variant}/${props.autoRotate}/${props.zoom}/${props.lighting}/${props.view}/${props.resetKey}/${props.exploded}/${paused}`; if (state !== lastState) { dirty = true; lastState = state; }
          if (props.color !== lastColor) { accents.forEach(m => m.color.set(props.color)); lastColor = props.color; }
          if (props.view !== lastView || props.resetKey !== lastReset) { const direction = props.view === 'front' ? new THREE.Vector3(0, .7, 5) : props.view === 'side' ? new THREE.Vector3(5, 1.4, .3) : new THREE.Vector3(kind === 'space' ? 5 : 3.5, kind === 'space' ? 4 : 2, 5); direction.normalize().multiplyScalar(baseDistance / safeZoom(props.zoom)); camera.position.copy(target).add(direction); controls.target.copy(target); lastView = props.view; lastReset = props.resetKey; lastZoom = props.zoom; }
          if (props.zoom !== lastZoom) { camera.position.sub(controls.target).normalize().multiplyScalar(baseDistance / safeZoom(props.zoom)).add(controls.target); lastZoom = props.zoom; }
          controls.autoRotate = props.autoRotate && !paused;
          ambient.intensity = props.lighting === 'night' ? .8 : 2.4; key.intensity = props.lighting === 'night' ? 1.5 : 4; rim.intensity = props.lighting === 'night' ? 4 : 2.5;
          moving.forEach((group, i) => { group.visible = i === props.variant; if (!paused && props.autoRotate) group.rotation.y += .002; });
          cups.forEach((cup, i) => { const sign = i < 2 ? -1 : 1; cup.position.x = sign * ((i % 2 === 0 ? 1.05 : 1.17) + (props.exploded ? .38 : 0)); });
          controls.update(); if (dirty || controls.autoRotate) { renderer.render(scene, camera); dirty = false; }
        });
        setStatus('ready');
        release = () => { renderer.setAnimationLoop(null); resize.disconnect(); intersection.disconnect(); controls.dispose(); renderer.domElement.removeEventListener('keydown', onKey); renderer.domElement.removeEventListener('webglcontextlost', lost); const geometries = new Set<InstanceType<typeof THREE.BufferGeometry>>(); const materials = new Set<InstanceType<typeof THREE.Material>>(); scene.traverse(obj => { if (obj instanceof THREE.Mesh) { geometries.add(obj.geometry); (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => materials.add(m)); } }); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); [accent, dark, metal, cream].forEach(m => m.dispose()); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
        if (cancelled) release();
      } catch { release(); if (!cancelled) setStatus('fallback'); }
    }
    initialize(); return () => { cancelled = true; release(); };
  }, [kind, retry, embedded]);
  return <div className={`scene3d scene-${kind} scene-status-${status}`}><div className="scene3d-host" ref={host} /><div className="scene3d-poster" aria-hidden="true"><div className="scene-poster-orbit" /><span>{kind === 'product' ? '◉' : kind === 'space' ? '▱' : '✧'}</span></div>{status !== 'ready' && <div className="scene3d-status" role="status">{status === 'loading' ? 'Preparando experiência 3D…' : <><span>Prévia estática: o 3D não ficou disponível neste navegador.</span><button type="button" onClick={() => setRetry(r => r + 1)}>Tentar novamente</button></>}</div>}<div className="scene3d-caption">{status === 'ready' ? 'ARRASTE PARA EXPLORAR · ROLE PARA APROXIMAR' : 'EXPERIÊNCIA TRIDIMENSIONAL'}</div></div>;
}
