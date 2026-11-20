import * as THREE from "three";
import { incomePerSec, has, RAIDERS, SHOTS, sim, tapFire, vaultCap } from "@/game/sim";

const reducedMotion =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function mountScene(canvas: HTMLCanvasElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    sim.viewError = "This browser couldn't start the 3D view. The forge still runs from the panels.";
    return () => {};
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.setClearColor(0x07080c, 1);
  const dprCap = window.innerWidth < 700 ? 1.25 : 1.6;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080c, 0.011);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 220);

  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(resource: T): T => {
    disposables.push(resource);
    return resource;
  };

  scene.add(new THREE.AmbientLight(0x3a342c, 0.35));
  const hemi = new THREE.HemisphereLight(0xb7c4d6, 0x1a120c, 0.55);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1d6, 1.55);
  sun.position.set(8, 14, 6);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x8ea4c8, 0.45);
  rim.position.set(-10, 4, -8);
  scene.add(rim);
  const coreLight = new THREE.PointLight(0xe8a23a, 2.2, 28, 2);
  scene.add(coreLight);

  const starPositions = new Float32Array(420 * 3);
  for (let i = 0; i < 420; i += 1) {
    const radius = 46 + Math.random() * 55;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 50;
    starPositions[i * 3] = Math.cos(theta) * radius;
    starPositions[i * 3 + 1] = y;
    starPositions[i * 3 + 2] = Math.sin(theta) * radius;
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeo,
    track(new THREE.PointsMaterial({ color: 0xefe8d6, size: 0.16, sizeAttenuation: true })),
  );
  scene.add(stars);

  const moon = new THREE.Mesh(
    track(new THREE.SphereGeometry(3.1, 28, 18)),
    track(new THREE.MeshStandardMaterial({ color: 0x6e5b49, roughness: 0.94, metalness: 0.04 })),
  );
  moon.position.set(-26, 7, -18);
  scene.add(moon);

  const belt = new THREE.Group();
  scene.add(belt);
  const rockGeo = track(new THREE.IcosahedronGeometry(0.28, 0));
  const rockMat = track(new THREE.MeshStandardMaterial({ color: 0x3c342c, roughness: 0.9, metalness: 0.15 }));
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, 42);
  rocks.frustumCulled = false;
  const rockDummy = new THREE.Object3D();
  for (let i = 0; i < 42; i += 1) {
    const angle = (i / 42) * Math.PI * 2 + i * 0.17;
    const radius = 16 + (i % 5) * 1.3;
    rockDummy.position.set(Math.cos(angle) * radius, ((i % 7) - 3) * 0.35, Math.sin(angle) * radius);
    rockDummy.rotation.set(i, i * 0.7, i * 0.2);
    const scale = 0.45 + (i % 4) * 0.28;
    rockDummy.scale.setScalar(scale);
    rockDummy.updateMatrix();
    rocks.setMatrixAt(i, rockDummy.matrix);
  }
  belt.add(rocks);

  const coreMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x17140f,
      metalness: 0.86,
      roughness: 0.28,
      emissive: 0xe8a23a,
      emissiveIntensity: 0.03,
    }),
  );
  const core = new THREE.Mesh(track(new THREE.SphereGeometry(1, 48, 32)), coreMat);
  scene.add(core);

  const wire = new THREE.Mesh(
    track(new THREE.SphereGeometry(1.04, 24, 16)),
    track(
      new THREE.MeshBasicMaterial({
        color: 0xe8a23a,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
      }),
    ),
  );
  scene.add(wire);

  const PANEL_COUNT = 168;
  const panelGeo = track(new THREE.BoxGeometry(1, 1, 1));
  const panelMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.62,
      roughness: 0.34,
      emissive: 0x3a2a12,
      emissiveIntensity: 0.25,
    }),
  );
  const panels = new THREE.InstancedMesh(panelGeo, panelMat, PANEL_COUNT);
  panels.frustumCulled = false;
  scene.add(panels);

  const keel = new THREE.Mesh(
    track(new THREE.TorusGeometry(1.18, 0.045, 8, 64)),
    track(new THREE.MeshStandardMaterial({ color: 0xc9842e, metalness: 0.7, roughness: 0.3, emissive: 0xe8a23a, emissiveIntensity: 0.35 })),
  );
  keel.rotation.x = Math.PI / 2;
  scene.add(keel);

  const turretGeo = track(new THREE.BoxGeometry(0.16, 0.42, 0.16));
  const turretMat = track(new THREE.MeshStandardMaterial({ color: 0x2a241c, metalness: 0.8, roughness: 0.3 }));
  const turrets = new THREE.InstancedMesh(turretGeo, turretMat, 12);
  turrets.frustumCulled = false;
  scene.add(turrets);

  const plateRing = new THREE.Mesh(
    track(new THREE.TorusGeometry(1.42, 0.02, 6, 72)),
    track(new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.55 })),
  );
  plateRing.rotation.x = Math.PI / 2.4;
  scene.add(plateRing);

  const deck = new THREE.Mesh(
    track(new THREE.CylinderGeometry(1, 1.08, 0.16, 40)),
    track(new THREE.MeshStandardMaterial({ color: 0x14120e, metalness: 0.55, roughness: 0.62 })),
  );
  scene.add(deck);

  const crystalMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffd27a,
      emissive: 0xe8a23a,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.18,
    }),
  );
  const crystal = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.28, 0)), crystalMat);
  scene.add(crystal);

  const spout = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.12, 0.18, 0.55, 8)),
    track(new THREE.MeshStandardMaterial({ color: 0x3a3228, metalness: 0.6, roughness: 0.4 })),
  );
  scene.add(spout);

  const ingotGeo = track(new THREE.BoxGeometry(0.22, 0.12, 0.22));
  const ingotMat = track(
    new THREE.MeshStandardMaterial({ color: 0xe8a23a, emissive: 0xe8a23a, emissiveIntensity: 0.45, metalness: 0.4, roughness: 0.35 }),
  );
  const ingots = new THREE.InstancedMesh(ingotGeo, ingotMat, 6);
  ingots.frustumCulled = false;
  scene.add(ingots);

  const spire = new THREE.Group();
  scene.add(spire);
  const spireMat = track(
    new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0xe8a23a, emissiveIntensity: 0.55, metalness: 0.35, roughness: 0.2 }),
  );
  for (let i = 0; i < 3; i += 1) {
    const piece = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.34 - i * 0.06, 0)), spireMat);
    piece.position.y = 0.45 + i * 0.55;
    spire.add(piece);
  }

  const lance = new THREE.Group();
  scene.add(lance);
  const prismMat = track(
    new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0xffd27a, emissiveIntensity: 0.9, metalness: 0.15, roughness: 0.12 }),
  );
  for (let i = 0; i < 3; i += 1) {
    const prism = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.16, 0)), prismMat);
    const angle = (i / 3) * Math.PI * 2;
    prism.position.set(0.2, Math.cos(angle) * 0.28, Math.sin(angle) * 0.28);
    lance.add(prism);
  }
  const beam = new THREE.Mesh(
    track(new THREE.CylinderGeometry(0.035, 0.09, 1, 8, 1, true)),
    track(
      new THREE.MeshBasicMaterial({
        color: 0xffd27a,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    ),
  );
  beam.rotation.z = -Math.PI / 2;
  beam.position.x = 2.4;
  lance.add(beam);

  const crown = new THREE.Group();
  scene.add(crown);
  for (let i = 0; i < 8; i += 1) {
    const lamp = new THREE.Mesh(track(new THREE.SphereGeometry(0.08, 10, 8)), prismMat);
    const angle = (i / 8) * Math.PI * 2;
    lamp.position.set(Math.cos(angle) * 1.05, 0.72, Math.sin(angle) * 1.05);
    crown.add(lamp);
  }

  const craftRoot = new THREE.Group();
  const craftBank = new THREE.Group();
  craftRoot.add(craftBank);
  scene.add(craftRoot);
  const hullMat = track(new THREE.MeshStandardMaterial({ color: 0x241f18, metalness: 0.82, roughness: 0.26 }));
  const engineMat = track(
    new THREE.MeshStandardMaterial({ color: 0xffd27a, emissive: 0xe8a23a, emissiveIntensity: 1.1, metalness: 0.2, roughness: 0.3 }),
  );
  const noseGeo = track(new THREE.ConeGeometry(0.26, 1.2, 4));
  noseGeo.rotateX(Math.PI / 2);
  craftBank.add(new THREE.Mesh(noseGeo, hullMat));
  const wing = new THREE.Mesh(track(new THREE.BoxGeometry(1.25, 0.045, 0.34)), hullMat);
  wing.position.set(0, 0, -0.08);
  craftBank.add(wing);
  const fin = new THREE.Mesh(track(new THREE.BoxGeometry(0.06, 0.32, 0.2)), hullMat);
  fin.position.set(0, 0.14, -0.42);
  craftBank.add(fin);
  const engine = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 12, 8)), engineMat);
  engine.position.set(0, 0, -0.58);
  craftBank.add(engine);

  const raiderGeo = track(new THREE.IcosahedronGeometry(0.42, 0));
  const raiderMat = track(
    new THREE.MeshStandardMaterial({ color: 0xa86a32, emissive: 0xe8a23a, emissiveIntensity: 0.35, metalness: 0.45, roughness: 0.4 }),
  );
  const raiderMeshes = RAIDERS.map(() => {
    const mesh = new THREE.Mesh(raiderGeo, raiderMat);
    scene.add(mesh);
    return mesh;
  });

  const shotGeo = track(new THREE.SphereGeometry(0.09, 8, 6));
  const shotMat = track(
    new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const shotMesh = new THREE.InstancedMesh(shotGeo, shotMat, SHOTS.length);
  shotMesh.frustumCulled = false;
  scene.add(shotMesh);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const look = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const normal = new THREE.Vector3();
  const desiredCam = new THREE.Vector3(10, 5, 12);
  const camPos = desiredCam.clone();
  const lookTarget = new THREE.Vector3(0, 0.2, 0);
  const desiredLook = lookTarget.clone();
  let radius = 1.15;
  let orbit = 0.6;
  let lift = 0;
  let zoom = 1;
  let dragging = false;
  let pointerX = 0;
  let pointerY = 0;
  let moved = 0;
  let stopped = false;

  const resize = () => {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas.parentElement ?? canvas);
  resize();

  const onPointerDown = (event: PointerEvent) => {
    dragging = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    moved = 0;
    canvas.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    const dx = event.clientX - pointerX;
    const dy = event.clientY - pointerY;
    pointerX = event.clientX;
    pointerY = event.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (sim.mode === "sortie") return;
    orbit -= dx * 0.005;
    lift = Math.max(-2, Math.min(7, lift + dy * 0.012));
  };
  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;
    if (sim.mode === "sortie" && moved < 14) tapFire();
  };
  const onWheel = (event: WheelEvent) => {
    if (sim.mode === "sortie") return;
    event.preventDefault();
    zoom = Math.max(0.72, Math.min(1.55, zoom + Math.sign(event.deltaY) * 0.06));
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  const render = () => {
    const dt = 1 / 60;
    const progress = sim.owned.size / 19;
    const targetRadius = 1.12 + progress * 2.55;
    const ease = reducedMotion ? 1 : 1 - Math.exp(-2.4 * dt);
    radius += (targetRadius - radius) * ease;
    if (!dragging && sim.mode !== "sortie") orbit += dt * (reducedMotion ? 0 : 0.16);
    belt.rotation.y = sim.time * (reducedMotion ? 0 : 0.03);

    core.scale.setScalar(radius);
    wire.scale.setScalar(radius);
    coreMat.emissiveIntensity = (has("reactor") ? 0.22 : 0.03) + sim.pulse * 0.4 + Math.sin(sim.time * 2) * 0.02;
    coreLight.intensity = 1.4 + (has("reactor") ? 3.2 : 0) + sim.pulse * 2 + Math.sin(sim.time * 3) * 0.15;
    coreLight.position.set(0, 0, 0);

    const litCount = Math.floor(PANEL_COUNT * Math.min(1, 0.07 + progress * 1.08));
    const plate = has("shell") ? 0.34 : 0.2;
    for (let i = 0; i < PANEL_COUNT; i += 1) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / PANEL_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);
      const lit = i < litCount;
      normal.set(nx, ny, nz);
      dummy.position.copy(normal).multiplyScalar(radius * 1.03);
      dummy.quaternion.setFromUnitVectors(up, normal);
      const size = lit ? plate : plate * 0.62;
      dummy.scale.set(size, lit ? 0.07 : 0.045, size * 0.72);
      dummy.updateMatrix();
      panels.setMatrixAt(i, dummy.matrix);
      color.set(lit ? (i % 9 === 0 ? 0xffd27a : 0xe8a23a) : 0x2a261f);
      panels.setColorAt(i, color);
    }
    panels.instanceMatrix.needsUpdate = true;
    if (panels.instanceColor) panels.instanceColor.needsUpdate = true;

    keel.visible = has("keel");
    keel.scale.setScalar(radius);
    plateRing.visible = has("plating");
    plateRing.scale.setScalar(radius);
    turrets.visible = has("turrets");
    if (turrets.visible) {
      for (let i = 0; i < 12; i += 1) {
        const angle = (i / 12) * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * radius * 1.16, 0, Math.sin(angle) * radius * 1.16);
        dummy.rotation.set(0, -angle, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        turrets.setMatrixAt(i, dummy.matrix);
      }
      turrets.instanceMatrix.needsUpdate = true;
    }

    const deckY = -radius * 0.82;
    const deckRadius = radius * 1.25 + 1.35;
    deck.position.y = deckY;
    deck.scale.set(deckRadius, 1, deckRadius);
    const fill = has("siphon") ? 0.7 : Math.min(1, sim.vault / Math.max(1, vaultCap()));
    crystal.position.set(0, deckY + 0.42 + fill * 0.15, 0);
    crystal.scale.setScalar(0.35 + fill * 1.15);
    crystal.rotation.y = sim.time * 0.6;
    crystalMat.emissiveIntensity = 0.35 + fill * 1.3;

    const showDrop = has("dropper");
    spout.visible = showDrop;
    ingots.visible = showDrop;
    if (showDrop) {
      spout.position.set(deckRadius * 0.62, deckY + 0.45, deckRadius * 0.15);
      const flow = 0.28 + Math.min(1.4, incomePerSec() / 70);
      for (let i = 0; i < 6; i += 1) {
        const t = (sim.time * flow + i / 6) % 1;
        dummy.position.set(deckRadius * 0.62 * (1 - t), deckY + 0.32, deckRadius * 0.15 * (1 - t * 0.4));
        dummy.rotation.set(sim.time + i, 0, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        ingots.setMatrixAt(i, dummy.matrix);
      }
      ingots.instanceMatrix.needsUpdate = true;
    }

    spire.visible = has("spire");
    spire.position.y = radius * 0.92;
    spire.scale.setScalar(0.85 + radius * 0.18);
    lance.visible = has("lance");
    lance.position.set(radius * 0.92, 0.15, 0);
    const beamPulse = 3.2 + Math.sin(sim.time * 4) * 0.45;
    beam.scale.set(1, beamPulse, 1);
    beam.position.x = 0.45 + beamPulse * 0.5;
    crown.visible = has("crown");
    crown.scale.setScalar(radius);

    for (let i = 0; i < raiderMeshes.length; i += 1) {
      const mesh = raiderMeshes[i];
      const raider = RAIDERS[i];
      mesh.visible = raider.alive && (sim.mode === "sortie" ? i < sim.wave : i < 7);
      if (!mesh.visible) continue;
      mesh.position.set(raider.x, raider.y, raider.z);
      mesh.rotation.y = sim.time + raider.seed;
      mesh.rotation.x = sim.time * 0.4;
    }

    for (let i = 0; i < SHOTS.length; i += 1) {
      const shot = SHOTS[i];
      if (shot.life <= 0) {
        dummy.position.set(0, -50, 0);
        dummy.scale.setScalar(0.001);
      } else {
        dummy.position.set(shot.x, shot.y, shot.z);
        dummy.scale.setScalar(1);
      }
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      shotMesh.setMatrixAt(i, dummy.matrix);
    }
    shotMesh.instanceMatrix.needsUpdate = true;

    const craft = sim.craft;
    if (sim.mode === "sortie") {
      const fx = -Math.sin(craft.yaw);
      const fz = -Math.cos(craft.yaw);
      craftRoot.position.set(craft.x, craft.y, craft.z);
      look.set(craft.x + fx, craft.y, craft.z + fz);
      craftRoot.lookAt(look);
      craftBank.rotation.z = craft.steer * 0.55;
      const glow = 0.7 + Math.min(1.2, Math.abs(craft.speed) / 20);
      engine.scale.setScalar(glow);
      desiredCam.set(craft.x - fx * 8.6, craft.y + 3.15, craft.z - fz * 8.6);
      desiredLook.set(craft.x + fx * 7, craft.y + 0.35, craft.z + fz * 7);
    } else {
      const parkY = deckY + 0.46;
      craftRoot.position.set(deckRadius * 0.48, parkY, deckRadius * 0.42);
      look.set(craftRoot.position.x + 2, parkY, craftRoot.position.z - 2);
      craftRoot.lookAt(look);
      craftBank.rotation.z = Math.sin(sim.time * 0.8) * 0.04;
      engine.scale.setScalar(0.75);
      const dist = (10.5 + radius * 2.5) * zoom;
      desiredCam.set(Math.sin(orbit) * dist, 3.1 + radius * 0.9 + lift, Math.cos(orbit) * dist);
      desiredLook.set(0, 0.15, 0);
    }

    const blend = 1 - Math.exp(-4.2 * dt);
    camPos.lerp(desiredCam, reducedMotion ? 1 : blend);
    lookTarget.lerp(desiredLook, reducedMotion ? 1 : blend);
    camera.position.copy(camPos);
    if (!reducedMotion && sim.shake > 0.03) {
      camera.position.x += (Math.random() - 0.5) * sim.shake * 0.45;
      camera.position.y += (Math.random() - 0.5) * sim.shake * 0.28;
    }
    camera.up.set(0, 1, 0);
    camera.lookAt(lookTarget);
    renderer.render(scene, camera);
  };

  let raf = 0;
  const loop = () => {
    if (stopped) return;
    raf = requestAnimationFrame(loop);
    render();
  };
  raf = requestAnimationFrame(loop);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    canvas.removeEventListener("wheel", onWheel);
    disposables.forEach((resource) => resource.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
