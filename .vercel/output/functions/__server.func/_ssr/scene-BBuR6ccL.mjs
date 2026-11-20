import { a as incomePerSec, c as vaultCap, i as has, n as RAIDERS, o as sim, r as SHOTS, s as tapFire } from "./routes-DNfmi2SV.mjs";
import { C as PointsMaterial, D as TorusGeometry, E as SphereGeometry, O as Vector3, S as Points, T as Scene, _ as MeshStandardMaterial, a as BufferGeometry, b as PerspectiveCamera, c as CylinderGeometry, d as Group, f as HemisphereLight, g as MeshBasicMaterial, h as Mesh, i as BufferAttribute, l as DirectionalLight, m as InstancedMesh, n as AmbientLight, o as Color, p as IcosahedronGeometry, r as BoxGeometry, s as ConeGeometry, t as WebGLRenderer, u as FogExp2, v as Object3D, w as SRGBColorSpace, x as PointLight, y as OctahedronGeometry } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scene-BBuR6ccL.js
var reducedMotion = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function mountScene(canvas) {
	let renderer;
	try {
		renderer = new WebGLRenderer({
			canvas,
			antialias: true,
			alpha: false,
			powerPreference: "high-performance"
		});
	} catch {
		sim.viewError = "This browser couldn't start the 3D view. The forge still runs from the panels.";
		return () => {};
	}
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = 4;
	renderer.toneMappingExposure = 1.12;
	renderer.setClearColor(460812, 1);
	const dprCap = window.innerWidth < 700 ? 1.25 : 1.6;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
	const scene = new Scene();
	scene.fog = new FogExp2(460812, .011);
	const camera = new PerspectiveCamera(48, 1, .1, 220);
	const disposables = [];
	const track = (resource) => {
		disposables.push(resource);
		return resource;
	};
	scene.add(new AmbientLight(3814444, .35));
	const hemi = new HemisphereLight(12043478, 1708556, .55);
	scene.add(hemi);
	const sun = new DirectionalLight(16773590, 1.55);
	sun.position.set(8, 14, 6);
	scene.add(sun);
	const rim = new DirectionalLight(9348296, .45);
	rim.position.set(-10, 4, -8);
	scene.add(rim);
	const coreLight = new PointLight(15245882, 2.2, 28, 2);
	scene.add(coreLight);
	const starPositions = /* @__PURE__ */ new Float32Array(1260);
	for (let i = 0; i < 420; i += 1) {
		const radius = 46 + Math.random() * 55;
		const theta = Math.random() * Math.PI * 2;
		const y = (Math.random() - .5) * 50;
		starPositions[i * 3] = Math.cos(theta) * radius;
		starPositions[i * 3 + 1] = y;
		starPositions[i * 3 + 2] = Math.sin(theta) * radius;
	}
	const starGeo = track(new BufferGeometry());
	starGeo.setAttribute("position", new BufferAttribute(starPositions, 3));
	const stars = new Points(starGeo, track(new PointsMaterial({
		color: 15722710,
		size: .16,
		sizeAttenuation: true
	})));
	scene.add(stars);
	const moon = new Mesh(track(new SphereGeometry(3.1, 28, 18)), track(new MeshStandardMaterial({
		color: 7232329,
		roughness: .94,
		metalness: .04
	})));
	moon.position.set(-26, 7, -18);
	scene.add(moon);
	const belt = new Group();
	scene.add(belt);
	const rockGeo = track(new IcosahedronGeometry(.28, 0));
	const rockMat = track(new MeshStandardMaterial({
		color: 3945516,
		roughness: .9,
		metalness: .15
	}));
	const rocks = new InstancedMesh(rockGeo, rockMat, 42);
	rocks.frustumCulled = false;
	const rockDummy = new Object3D();
	for (let i = 0; i < 42; i += 1) {
		const angle = i / 42 * Math.PI * 2 + i * .17;
		const radius = 16 + i % 5 * 1.3;
		rockDummy.position.set(Math.cos(angle) * radius, (i % 7 - 3) * .35, Math.sin(angle) * radius);
		rockDummy.rotation.set(i, i * .7, i * .2);
		const scale = .45 + i % 4 * .28;
		rockDummy.scale.setScalar(scale);
		rockDummy.updateMatrix();
		rocks.setMatrixAt(i, rockDummy.matrix);
	}
	belt.add(rocks);
	const coreMat = track(new MeshStandardMaterial({
		color: 1512463,
		metalness: .86,
		roughness: .28,
		emissive: 15245882,
		emissiveIntensity: .03
	}));
	const core = new Mesh(track(new SphereGeometry(1, 48, 32)), coreMat);
	scene.add(core);
	const wire = new Mesh(track(new SphereGeometry(1.04, 24, 16)), track(new MeshBasicMaterial({
		color: 15245882,
		wireframe: true,
		transparent: true,
		opacity: .14
	})));
	scene.add(wire);
	const PANEL_COUNT = 168;
	const panelGeo = track(new BoxGeometry(1, 1, 1));
	const panelMat = track(new MeshStandardMaterial({
		color: 16777215,
		metalness: .62,
		roughness: .34,
		emissive: 3811858,
		emissiveIntensity: .25
	}));
	const panels = new InstancedMesh(panelGeo, panelMat, PANEL_COUNT);
	panels.frustumCulled = false;
	scene.add(panels);
	const keel = new Mesh(track(new TorusGeometry(1.18, .045, 8, 64)), track(new MeshStandardMaterial({
		color: 13206574,
		metalness: .7,
		roughness: .3,
		emissive: 15245882,
		emissiveIntensity: .35
	})));
	keel.rotation.x = Math.PI / 2;
	scene.add(keel);
	const turretGeo = track(new BoxGeometry(.16, .42, .16));
	const turretMat = track(new MeshStandardMaterial({
		color: 2761756,
		metalness: .8,
		roughness: .3
	}));
	const turrets = new InstancedMesh(turretGeo, turretMat, 12);
	turrets.frustumCulled = false;
	scene.add(turrets);
	const plateRing = new Mesh(track(new TorusGeometry(1.42, .02, 6, 72)), track(new MeshBasicMaterial({
		color: 16765562,
		transparent: true,
		opacity: .55
	})));
	plateRing.rotation.x = Math.PI / 2.4;
	scene.add(plateRing);
	const deck = new Mesh(track(new CylinderGeometry(1, 1.08, .16, 40)), track(new MeshStandardMaterial({
		color: 1315342,
		metalness: .55,
		roughness: .62
	})));
	scene.add(deck);
	const crystalMat = track(new MeshStandardMaterial({
		color: 16765562,
		emissive: 15245882,
		emissiveIntensity: .7,
		metalness: .2,
		roughness: .18
	}));
	const crystal = new Mesh(track(new OctahedronGeometry(.28, 0)), crystalMat);
	scene.add(crystal);
	const spout = new Mesh(track(new CylinderGeometry(.12, .18, .55, 8)), track(new MeshStandardMaterial({
		color: 3813928,
		metalness: .6,
		roughness: .4
	})));
	scene.add(spout);
	const ingotGeo = track(new BoxGeometry(.22, .12, .22));
	const ingotMat = track(new MeshStandardMaterial({
		color: 15245882,
		emissive: 15245882,
		emissiveIntensity: .45,
		metalness: .4,
		roughness: .35
	}));
	const ingots = new InstancedMesh(ingotGeo, ingotMat, 6);
	ingots.frustumCulled = false;
	scene.add(ingots);
	const spire = new Group();
	scene.add(spire);
	const spireMat = track(new MeshStandardMaterial({
		color: 16765562,
		emissive: 15245882,
		emissiveIntensity: .55,
		metalness: .35,
		roughness: .2
	}));
	for (let i = 0; i < 3; i += 1) {
		const piece = new Mesh(track(new OctahedronGeometry(.34 - i * .06, 0)), spireMat);
		piece.position.y = .45 + i * .55;
		spire.add(piece);
	}
	const lance = new Group();
	scene.add(lance);
	const prismMat = track(new MeshStandardMaterial({
		color: 16765562,
		emissive: 16765562,
		emissiveIntensity: .9,
		metalness: .15,
		roughness: .12
	}));
	for (let i = 0; i < 3; i += 1) {
		const prism = new Mesh(track(new OctahedronGeometry(.16, 0)), prismMat);
		const angle = i / 3 * Math.PI * 2;
		prism.position.set(.2, Math.cos(angle) * .28, Math.sin(angle) * .28);
		lance.add(prism);
	}
	const beam = new Mesh(track(new CylinderGeometry(.035, .09, 1, 8, 1, true)), track(new MeshBasicMaterial({
		color: 16765562,
		transparent: true,
		opacity: .55,
		blending: 2,
		depthWrite: false,
		side: 2
	})));
	beam.rotation.z = -Math.PI / 2;
	beam.position.x = 2.4;
	lance.add(beam);
	const crown = new Group();
	scene.add(crown);
	for (let i = 0; i < 8; i += 1) {
		const lamp = new Mesh(track(new SphereGeometry(.08, 10, 8)), prismMat);
		const angle = i / 8 * Math.PI * 2;
		lamp.position.set(Math.cos(angle) * 1.05, .72, Math.sin(angle) * 1.05);
		crown.add(lamp);
	}
	const craftRoot = new Group();
	const craftBank = new Group();
	craftRoot.add(craftBank);
	scene.add(craftRoot);
	const hullMat = track(new MeshStandardMaterial({
		color: 2367256,
		metalness: .82,
		roughness: .26
	}));
	const engineMat = track(new MeshStandardMaterial({
		color: 16765562,
		emissive: 15245882,
		emissiveIntensity: 1.1,
		metalness: .2,
		roughness: .3
	}));
	const noseGeo = track(new ConeGeometry(.26, 1.2, 4));
	noseGeo.rotateX(Math.PI / 2);
	craftBank.add(new Mesh(noseGeo, hullMat));
	const wing = new Mesh(track(new BoxGeometry(1.25, .045, .34)), hullMat);
	wing.position.set(0, 0, -.08);
	craftBank.add(wing);
	const fin = new Mesh(track(new BoxGeometry(.06, .32, .2)), hullMat);
	fin.position.set(0, .14, -.42);
	craftBank.add(fin);
	const engine = new Mesh(track(new SphereGeometry(.11, 12, 8)), engineMat);
	engine.position.set(0, 0, -.58);
	craftBank.add(engine);
	const raiderGeo = track(new IcosahedronGeometry(.42, 0));
	const raiderMat = track(new MeshStandardMaterial({
		color: 11037234,
		emissive: 15245882,
		emissiveIntensity: .35,
		metalness: .45,
		roughness: .4
	}));
	const raiderMeshes = RAIDERS.map(() => {
		const mesh = new Mesh(raiderGeo, raiderMat);
		scene.add(mesh);
		return mesh;
	});
	const shotGeo = track(new SphereGeometry(.09, 8, 6));
	const shotMat = track(new MeshBasicMaterial({
		color: 16765562,
		transparent: true,
		opacity: .95,
		blending: 2,
		depthWrite: false
	}));
	const shotMesh = new InstancedMesh(shotGeo, shotMat, SHOTS.length);
	shotMesh.frustumCulled = false;
	scene.add(shotMesh);
	const dummy = new Object3D();
	const color = new Color();
	const look = new Vector3();
	const up = new Vector3(0, 1, 0);
	const normal = new Vector3();
	const desiredCam = new Vector3(10, 5, 12);
	const camPos = desiredCam.clone();
	const lookTarget = new Vector3(0, .2, 0);
	const desiredLook = lookTarget.clone();
	let radius = 1.15;
	let orbit = .6;
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
	const onPointerDown = (event) => {
		dragging = true;
		pointerX = event.clientX;
		pointerY = event.clientY;
		moved = 0;
		canvas.setPointerCapture?.(event.pointerId);
	};
	const onPointerMove = (event) => {
		if (!dragging) return;
		const dx = event.clientX - pointerX;
		const dy = event.clientY - pointerY;
		pointerX = event.clientX;
		pointerY = event.clientY;
		moved += Math.abs(dx) + Math.abs(dy);
		if (sim.mode === "sortie") return;
		orbit -= dx * .005;
		lift = Math.max(-2, Math.min(7, lift + dy * .012));
	};
	const onPointerUp = () => {
		if (!dragging) return;
		dragging = false;
		if (sim.mode === "sortie" && moved < 14) tapFire();
	};
	const onWheel = (event) => {
		if (sim.mode === "sortie") return;
		event.preventDefault();
		zoom = Math.max(.72, Math.min(1.55, zoom + Math.sign(event.deltaY) * .06));
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
		if (!dragging && sim.mode !== "sortie") orbit += dt * (reducedMotion ? 0 : .16);
		belt.rotation.y = sim.time * (reducedMotion ? 0 : .03);
		core.scale.setScalar(radius);
		wire.scale.setScalar(radius);
		coreMat.emissiveIntensity = (has("reactor") ? .22 : .03) + sim.pulse * .4 + Math.sin(sim.time * 2) * .02;
		coreLight.intensity = 1.4 + (has("reactor") ? 3.2 : 0) + sim.pulse * 2 + Math.sin(sim.time * 3) * .15;
		coreLight.position.set(0, 0, 0);
		const litCount = Math.floor(PANEL_COUNT * Math.min(1, .07 + progress * 1.08));
		const plate = has("shell") ? .34 : .2;
		for (let i = 0; i < PANEL_COUNT; i += 1) {
			const phi = Math.acos(1 - 2 * (i + .5) / PANEL_COUNT);
			const theta = Math.PI * (1 + Math.sqrt(5)) * i;
			const nx = Math.sin(phi) * Math.cos(theta);
			const ny = Math.cos(phi);
			const nz = Math.sin(phi) * Math.sin(theta);
			const lit = i < litCount;
			normal.set(nx, ny, nz);
			dummy.position.copy(normal).multiplyScalar(radius * 1.03);
			dummy.quaternion.setFromUnitVectors(up, normal);
			const size = lit ? plate : plate * .62;
			dummy.scale.set(size, lit ? .07 : .045, size * .72);
			dummy.updateMatrix();
			panels.setMatrixAt(i, dummy.matrix);
			color.set(lit ? i % 9 === 0 ? 16765562 : 15245882 : 2762271);
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
				const angle = i / 12 * Math.PI * 2;
				dummy.position.set(Math.cos(angle) * radius * 1.16, 0, Math.sin(angle) * radius * 1.16);
				dummy.rotation.set(0, -angle, 0);
				dummy.scale.set(1, 1, 1);
				dummy.updateMatrix();
				turrets.setMatrixAt(i, dummy.matrix);
			}
			turrets.instanceMatrix.needsUpdate = true;
		}
		const deckY = -radius * .82;
		const deckRadius = radius * 1.25 + 1.35;
		deck.position.y = deckY;
		deck.scale.set(deckRadius, 1, deckRadius);
		const fill = has("siphon") ? .7 : Math.min(1, sim.vault / Math.max(1, vaultCap()));
		crystal.position.set(0, deckY + .42 + fill * .15, 0);
		crystal.scale.setScalar(.35 + fill * 1.15);
		crystal.rotation.y = sim.time * .6;
		crystalMat.emissiveIntensity = .35 + fill * 1.3;
		const showDrop = has("dropper");
		spout.visible = showDrop;
		ingots.visible = showDrop;
		if (showDrop) {
			spout.position.set(deckRadius * .62, deckY + .45, deckRadius * .15);
			const flow = .28 + Math.min(1.4, incomePerSec() / 70);
			for (let i = 0; i < 6; i += 1) {
				const t = (sim.time * flow + i / 6) % 1;
				dummy.position.set(deckRadius * .62 * (1 - t), deckY + .32, deckRadius * .15 * (1 - t * .4));
				dummy.rotation.set(sim.time + i, 0, 0);
				dummy.scale.setScalar(1);
				dummy.updateMatrix();
				ingots.setMatrixAt(i, dummy.matrix);
			}
			ingots.instanceMatrix.needsUpdate = true;
		}
		spire.visible = has("spire");
		spire.position.y = radius * .92;
		spire.scale.setScalar(.85 + radius * .18);
		lance.visible = has("lance");
		lance.position.set(radius * .92, .15, 0);
		const beamPulse = 3.2 + Math.sin(sim.time * 4) * .45;
		beam.scale.set(1, beamPulse, 1);
		beam.position.x = .45 + beamPulse * .5;
		crown.visible = has("crown");
		crown.scale.setScalar(radius);
		for (let i = 0; i < raiderMeshes.length; i += 1) {
			const mesh = raiderMeshes[i];
			const raider = RAIDERS[i];
			mesh.visible = raider.alive && (sim.mode === "sortie" ? i < sim.wave : i < 7);
			if (!mesh.visible) continue;
			mesh.position.set(raider.x, raider.y, raider.z);
			mesh.rotation.y = sim.time + raider.seed;
			mesh.rotation.x = sim.time * .4;
		}
		for (let i = 0; i < SHOTS.length; i += 1) {
			const shot = SHOTS[i];
			if (shot.life <= 0) {
				dummy.position.set(0, -50, 0);
				dummy.scale.setScalar(.001);
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
			craftBank.rotation.z = craft.steer * .55;
			const glow = .7 + Math.min(1.2, Math.abs(craft.speed) / 20);
			engine.scale.setScalar(glow);
			desiredCam.set(craft.x - fx * 8.6, craft.y + 3.15, craft.z - fz * 8.6);
			desiredLook.set(craft.x + fx * 7, craft.y + .35, craft.z + fz * 7);
		} else {
			const parkY = deckY + .46;
			craftRoot.position.set(deckRadius * .48, parkY, deckRadius * .42);
			look.set(craftRoot.position.x + 2, parkY, craftRoot.position.z - 2);
			craftRoot.lookAt(look);
			craftBank.rotation.z = Math.sin(sim.time * .8) * .04;
			engine.scale.setScalar(.75);
			const dist = (10.5 + radius * 2.5) * zoom;
			desiredCam.set(Math.sin(orbit) * dist, 3.1 + radius * .9 + lift, Math.cos(orbit) * dist);
			desiredLook.set(0, .15, 0);
		}
		const blend = 1 - Math.exp(-4.2 * dt);
		camPos.lerp(desiredCam, reducedMotion ? 1 : blend);
		lookTarget.lerp(desiredLook, reducedMotion ? 1 : blend);
		camera.position.copy(camPos);
		if (!reducedMotion && sim.shake > .03) {
			camera.position.x += (Math.random() - .5) * sim.shake * .45;
			camera.position.y += (Math.random() - .5) * sim.shake * .28;
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
//#endregion
export { mountScene };
