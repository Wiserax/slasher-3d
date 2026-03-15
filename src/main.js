import * as THREE from 'three';

// ─── SCENE SETUP ───
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x88aacc, 0.012);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// ─── SOUND (Web Audio API — procedural) ───
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);

  if (type === 'slash') {
    // Quick high-freq swoosh
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.12);
  } else if (type === 'hit') {
    // Impact thud
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.15);
    // Noise burst
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.06, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;
    const ng = audioCtx.createGain();
    ng.gain.setValueAtTime(0.2, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    noise.connect(ng); ng.connect(audioCtx.destination);
    noise.start(now); noise.stop(now + 0.06);
  } else if (type === 'heavy') {
    // Deep swoosh + bass
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.25);
  } else if (type === 'slam') {
    // Big boom
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'parry') {
    // Metallic clang
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.15);
  } else if (type === 'enemyHit') {
    // Dull thump
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'projectile') {
    // Magical whoosh
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.2);
  } else if (type === 'death') {
    // Death crunch
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buf;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(gain); noise.start(now); noise.stop(now + 0.15);
  } else if (type === 'playerHit') {
    // Sharp pain sound
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain); osc.start(now); osc.stop(now + 0.15);
  }
}

// ─── SKY ───
const skyGeo = new THREE.SphereGeometry(150, 32, 16);
const skyCanvas = document.createElement('canvas');
skyCanvas.width = 512; skyCanvas.height = 512;
const skyCtx = skyCanvas.getContext('2d');
const grad = skyCtx.createLinearGradient(0, 0, 0, 512);
grad.addColorStop(0, '#0a0a2e');
grad.addColorStop(0.3, '#1a2a5e');
grad.addColorStop(0.5, '#4466aa');
grad.addColorStop(0.7, '#88aacc');
grad.addColorStop(0.85, '#ddaa77');
grad.addColorStop(1, '#ff8844');
skyCtx.fillStyle = grad;
skyCtx.fillRect(0, 0, 512, 512);
// Stars in upper half
for (let i = 0; i < 200; i++) {
  skyCtx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
  skyCtx.fillRect(Math.random() * 512, Math.random() * 256, 1 + Math.random(), 1 + Math.random());
}
const skyTex = new THREE.CanvasTexture(skyCanvas);
const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide });
const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

// ─── LIGHTS — sunset/dusk feel ───
scene.add(new THREE.AmbientLight(0x556688, 0.7));
// Sun (warm, from south/low)
const sunLight = new THREE.DirectionalLight(0xffddaa, 1.5);
sunLight.position.set(0, 12, -50);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
sunLight.shadow.camera.far = 120;
scene.add(sunLight);
// Cool fill from north
const fillLight = new THREE.DirectionalLight(0x4466cc, 0.5);
fillLight.position.set(0, 8, 50);
scene.add(fillLight);
// Hemisphere (sky/ground bounce)
scene.add(new THREE.HemisphereLight(0x6688bb, 0x443322, 0.4));

// ─── ARENA ───
const ARENA_RADIUS = 50;

// ─── FLOOR — 4 biome quadrants ───
// +Z = North (ice), -Z = South (desert), -X = West (forest), +X = East (volcanic)
const floorSize = ARENA_RADIUS * 2 + 10;
const floorSegs = 60;
const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize, floorSegs, floorSegs);
const posAttr = floorGeo.attributes.position;
const floorColors = [];
for (let i = 0; i < posAttr.count; i++) {
  const fx = posAttr.getX(i);
  const fy = posAttr.getY(i);
  const noise = Math.sin(fx * 0.2) * Math.cos(fy * 0.2) * 0.25 +
                Math.sin(fx * 0.5 + 1) * Math.cos(fy * 0.4 + 2) * 0.1;
  posAttr.setZ(i, noise);
  // Biome color by position
  const nx = fx / ARENA_RADIUS; // -1 to 1
  const nz = fy / ARENA_RADIUS;
  let r, g, b;
  if (nz > 0.3) { // North — ice/snow
    r = 0.75 + nz * 0.15; g = 0.8 + nz * 0.1; b = 0.9;
  } else if (nz < -0.3) { // South — desert/sand
    r = 0.7 + Math.abs(nz) * 0.2; g = 0.55 + Math.abs(nz) * 0.1; b = 0.3;
  } else if (nx < -0.3) { // West — forest
    r = 0.15; g = 0.35 + Math.abs(nx) * 0.15; b = 0.1;
  } else if (nx > 0.3) { // East — volcanic
    r = 0.2 + nx * 0.15; g = 0.1; b = 0.08;
  } else { // Center — neutral stone
    r = 0.2; g = 0.22; b = 0.18;
  }
  floorColors.push(r, g, b);
}
floorGeo.setAttribute('color', new THREE.Float32BufferAttribute(floorColors, 3));
floorGeo.computeVertexNormals();
const floorMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0.05 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// ─── ARENA WALLS — themed by direction ───
const wallSegments = 64;
for (let i = 0; i < wallSegments; i++) {
  const angle = (i / wallSegments) * Math.PI * 2;
  const wallW = (2 * Math.PI * ARENA_RADIUS) / wallSegments + 0.5;
  const wallH = 5 + Math.random() * 4;
  const wx = Math.cos(angle) * ARENA_RADIUS;
  const wz = Math.sin(angle) * ARENA_RADIUS;
  // Color by biome
  let wallColor;
  if (wz > ARENA_RADIUS * 0.3) wallColor = new THREE.Color(0.6, 0.65, 0.75); // north ice
  else if (wz < -ARENA_RADIUS * 0.3) wallColor = new THREE.Color(0.5, 0.35, 0.2); // south sand
  else if (wx < -ARENA_RADIUS * 0.3) wallColor = new THREE.Color(0.15, 0.25, 0.1); // west forest
  else if (wx > ARENA_RADIUS * 0.3) wallColor = new THREE.Color(0.25, 0.08, 0.05); // east volcano
  else wallColor = new THREE.Color(0.18, 0.18, 0.16);
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(wallW, wallH, 1.5),
    new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.9, metalness: 0.05 })
  );
  wall.position.set(wx, wallH / 2, wz);
  wall.rotation.y = -angle + Math.PI / 2;
  wall.castShadow = true; wall.receiveShadow = true;
  scene.add(wall);
}

function clampToArena(pos) {
  const d = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
  if (d > ARENA_RADIUS - 2) { const n = (ARENA_RADIUS - 2) / d; pos.x *= n; pos.z *= n; }
}

// ─── BIOME: NORTH (Ice) — z > 15 ───
for (let i = 0; i < 20; i++) {
  const x = (Math.random() - 0.5) * 40;
  const z = 18 + Math.random() * 25;
  // Ice crystal
  const h = 1 + Math.random() * 3;
  const crystal = new THREE.Mesh(
    new THREE.ConeGeometry(0.3 + Math.random() * 0.5, h, 5),
    new THREE.MeshStandardMaterial({ color: 0x88ccee, metalness: 0.6, roughness: 0.1, transparent: true, opacity: 0.7 })
  );
  crystal.position.set(x, h / 2, z);
  crystal.castShadow = true;
  scene.add(crystal);
}
// Snow mounds
for (let i = 0; i < 15; i++) {
  const x = (Math.random() - 0.5) * 50;
  const z = 15 + Math.random() * 30;
  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(1 + Math.random() * 2, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xddeeff, roughness: 0.95 })
  );
  mound.position.set(x, 0.3, z);
  mound.scale.y = 0.3;
  scene.add(mound);
}

// ─── BIOME: SOUTH (Desert) — z < -15 ───
for (let i = 0; i < 15; i++) {
  const x = (Math.random() - 0.5) * 40;
  const z = -18 - Math.random() * 25;
  // Cactus
  const cGroup = new THREE.Group();
  const cH = 1.5 + Math.random() * 2;
  const cactMat = new THREE.MeshStandardMaterial({ color: 0x337733, roughness: 0.8 });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, cH, 6), cactMat);
  trunk.position.y = cH / 2;
  cGroup.add(trunk);
  if (Math.random() > 0.4) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.8, 6), cactMat);
    arm.position.set(0.3, cH * 0.6, 0);
    arm.rotation.z = -1.2;
    cGroup.add(arm);
  }
  cGroup.position.set(x, 0, z);
  cGroup.castShadow = true;
  scene.add(cGroup);
}
// Sand dunes
for (let i = 0; i < 10; i++) {
  const x = (Math.random() - 0.5) * 50;
  const z = -15 - Math.random() * 30;
  const dune = new THREE.Mesh(
    new THREE.SphereGeometry(2 + Math.random() * 3, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xccaa66, roughness: 0.95 })
  );
  dune.position.set(x, 0.2, z); dune.scale.y = 0.25;
  scene.add(dune);
}

// ─── BIOME: WEST (Forest) — x < -15 ───
for (let i = 0; i < 20; i++) {
  const x = -18 - Math.random() * 25;
  const z = (Math.random() - 0.5) * 40;
  const tGroup = new THREE.Group();
  const tH = 3 + Math.random() * 4;
  const tMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.95 });
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, tH, 6), tMat);
  t.position.y = tH / 2; t.castShadow = true;
  tGroup.add(t);
  // Green canopy
  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(1 + Math.random() * 1.5, 8, 6),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(0.1, 0.3 + Math.random() * 0.2, 0.08), roughness: 0.9 })
  );
  canopy.position.y = tH - 0.5;
  canopy.scale.y = 0.7;
  canopy.castShadow = true;
  tGroup.add(canopy);
  tGroup.position.set(x, 0, z);
  scene.add(tGroup);
}
// Forest floor grass (dense)
for (let i = 0; i < 60; i++) {
  const x = -10 - Math.random() * 35;
  const z = (Math.random() - 0.5) * 50;
  const gGroup = new THREE.Group();
  for (let j = 0; j < 6; j++) {
    const h = 0.3 + Math.random() * 0.5;
    const blade = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, h),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(0.1, 0.25 + Math.random() * 0.3, 0.05), side: THREE.DoubleSide, roughness: 0.9 })
    );
    blade.position.set((Math.random() - 0.5) * 0.4, h / 2, (Math.random() - 0.5) * 0.4);
    blade.rotation.y = Math.random() * Math.PI;
    gGroup.add(blade);
  }
  gGroup.position.set(x, 0, z);
  scene.add(gGroup);
}

// ─── BIOME: EAST (Volcanic) — x > 15 ───
for (let i = 0; i < 12; i++) {
  const x = 18 + Math.random() * 25;
  const z = (Math.random() - 0.5) * 40;
  // Lava rock
  const rScale = 0.5 + Math.random() * 2;
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(rScale, 1),
    new THREE.MeshStandardMaterial({ color: 0x1a0a0a, roughness: 0.9, metalness: 0.1 })
  );
  rock.position.set(x, rScale * 0.4, z);
  rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  rock.castShadow = true;
  scene.add(rock);
}
// Lava pools (glowing)
for (let i = 0; i < 6; i++) {
  const x = 20 + Math.random() * 20;
  const z = (Math.random() - 0.5) * 35;
  const pool = new THREE.Mesh(
    new THREE.CircleGeometry(1 + Math.random() * 1.5, 16),
    new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.7 })
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(x, 0.05, z);
  scene.add(pool);
  const lavaLight = new THREE.PointLight(0xff4400, 0.6, 6);
  lavaLight.position.set(x, 0.5, z);
  scene.add(lavaLight);
}
// Volcanic vents (particle-like cones)
for (let i = 0; i < 5; i++) {
  const x = 15 + Math.random() * 28;
  const z = (Math.random() - 0.5) * 35;
  const vent = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 1.5 + Math.random(), 6),
    new THREE.MeshStandardMaterial({ color: 0x2a0a0a, roughness: 0.95 })
  );
  vent.position.set(x, 0.5, z);
  scene.add(vent);
}

// ─── CENTER — scattered rocks + mushrooms ───
for (let i = 0; i < 25; i++) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 3 + Math.random() * 14;
  const rScale = 0.3 + Math.random() * 1;
  const shade = 0.25 + Math.random() * 0.2;
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(rScale, 1),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(shade, shade, shade * 0.9), roughness: 0.95 })
  );
  rock.position.set(Math.cos(angle) * dist, rScale * 0.3, Math.sin(angle) * dist);
  rock.rotation.set(Math.random() * 2, Math.random() * 2, 0);
  rock.castShadow = true;
  scene.add(rock);
}
for (let i = 0; i < 15; i++) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 5 + Math.random() * 20;
  const mGroup = new THREE.Group();
  const glowColor = [0x44ffaa, 0xaa44ff, 0xff88aa][Math.floor(Math.random() * 3)];
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.3, 6), new THREE.MeshStandardMaterial({ color: 0x886688 }));
  stem.position.y = 0.15;
  mGroup.add(stem);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: glowColor, emissive: glowColor, emissiveIntensity: 0.5 })
  );
  cap.position.y = 0.3;
  mGroup.add(cap);
  mGroup.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
  scene.add(mGroup);
}

// ─── CAVES ───
const caves = [];

function createCave(x, z) {
  const caveGroup = new THREE.Group();
  // Cave entrance — arch made of rocks
  const archMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.95, metalness: 0.05 });
  // Left wall
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4, 2), archMat);
  wallL.position.set(-1.5, 2, 0); wallL.castShadow = true;
  caveGroup.add(wallL);
  // Right wall
  const wallR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4, 2), archMat);
  wallR.position.set(1.5, 2, 0); wallR.castShadow = true;
  caveGroup.add(wallR);
  // Top arch
  const arch = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 2), archMat);
  arch.position.set(0, 4.2, 0); arch.castShadow = true;
  caveGroup.add(arch);
  // Back wall (dark)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 })
  );
  backWall.position.set(0, 2, -1);
  caveGroup.add(backWall);
  // Floor (dark stone)
  const cFloor = new THREE.Mesh(new THREE.PlaneGeometry(3, 3),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95 })
  );
  cFloor.rotation.x = -Math.PI / 2; cFloor.position.y = 0.02;
  caveGroup.add(cFloor);
  // Glowing crystal inside
  const crystalColor = [0x44ffaa, 0xaa44ff, 0xff4488][Math.floor(Math.random() * 3)];
  const crystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.3, 0),
    new THREE.MeshStandardMaterial({ color: crystalColor, emissive: crystalColor, emissiveIntensity: 1, transparent: true, opacity: 0.8 })
  );
  crystal.position.set(0, 1, -0.3);
  caveGroup.add(crystal);
  const cLight = new THREE.PointLight(crystalColor, 1, 8);
  cLight.position.set(0, 2, 0);
  caveGroup.add(cLight);

  // Face center of arena
  caveGroup.position.set(x, 0, z);
  caveGroup.lookAt(0, 0, 0);

  caveGroup.userData = {
    crystal,
    hasLoot: true,
    guardSpawned: false,
    guardDead: false,
    looted: false,
    lootBox: null,
    guards: [],
  };

  // Cave relic — special upgrade (not random lootbox)
  const relicGeo = new THREE.OctahedronGeometry(0.35, 0);
  const relicMat = new THREE.MeshStandardMaterial({
    color: 0xffdd00, emissive: 0xffaa00, emissiveIntensity: 0.8, metalness: 0.8, roughness: 0.1,
  });
  const relic = new THREE.Mesh(relicGeo, relicMat);
  relic.position.set(0, 0.8, -0.3);
  caveGroup.add(relic);
  const relicLight = new THREE.PointLight(0xffaa00, 0.5, 4);
  relicLight.position.set(0, 1.2, -0.3);
  caveGroup.add(relicLight);
  caveGroup.userData.relic = relic;
  caveGroup.userData.relicLight = relicLight;

  scene.add(caveGroup);
  caves.push(caveGroup);
  return caveGroup;
}

// Spawn 4 caves around the arena edge
for (let i = 0; i < 4; i++) {
  const angle = (i / 4) * Math.PI * 2 + 0.4;
  const dist = ARENA_RADIUS - 5;
  createCave(Math.cos(angle) * dist, Math.sin(angle) * dist);
}

function createCaveGuard(cave) {
  const worldPos = new THREE.Vector3();
  cave.getWorldPosition(worldPos);
  const g = createEnemy(worldPos.x + (Math.random() - 0.5) * 4, worldPos.z + (Math.random() - 0.5) * 4);
  g.scale.set(1.5, 1.5, 1.5);
  g.userData.maxHp = Math.round(g.userData.maxHp * 2.5);
  g.userData.hp = g.userData.maxHp;
  g.userData.damage = Math.round(g.userData.damage * 1.5);
  g.userData.speed *= 0.8;
  g.userData.name = 'Cave Guardian';
  g.userData.isElite = true;
  g.userData.mesh.material.color.set(0x6622aa);
  g.userData.mesh.material.emissive.set(0x330066);
  g.userData.mesh.material.emissiveIntensity = 0.3;
  enemies.push(g);
  scene.add(g);
  cave.userData.guards.push(g);
  return g;
}

function updateCaves() {
  caves.forEach(cave => {
    if (cave.userData.looted) return;

    const worldPos = new THREE.Vector3();
    cave.getWorldPosition(worldPos);
    const dist = playerGroup.position.distanceTo(worldPos);

    // Crystal bob
    if (cave.userData.crystal) {
      cave.userData.crystal.rotation.y += 0.02;
      cave.userData.crystal.position.y = 1 + Math.sin(Date.now() * 0.002) * 0.2;
    }

    // Spawn guards when player approaches
    if (dist < 8 && !cave.userData.guardSpawned) {
      cave.userData.guardSpawned = true;
      createCaveGuard(cave);
      createCaveGuard(cave);
      showPickupText('CAVE GUARDIANS!', 'dmg');
    }

    // Check if guards are dead
    if (cave.userData.guardSpawned && !cave.userData.guardDead) {
      const allDead = cave.userData.guards.every(g => !g.userData.alive);
      if (allDead) {
        cave.userData.guardDead = true;
        showPickupText('CAVE CLEARED!', 'hp');
      }
    }

    // Relic bob
    if (cave.userData.relic && !cave.userData.looted) {
      cave.userData.relic.rotation.y += 0.03;
      cave.userData.relic.position.y = 0.8 + Math.sin(Date.now() * 0.003) * 0.15;
    }

    // Allow relic pickup only after guards dead
    if (cave.userData.guardDead && !cave.userData.looted) {
      const relicWorld = new THREE.Vector3();
      cave.userData.relic.getWorldPosition(relicWorld);
      const relicDist = playerGroup.position.distanceTo(relicWorld);
      if (relicDist < 2.5) {
        cave.userData.looted = true;
        // Give cave relic reward — strong but not OP
        const rewards = [
          () => { player.bonusHp += 15; player.maxHp = player.baseMaxHp + player.bonusHp; player.hp = player.maxHp; updatePlayerHpBar(); showPickupText('RELIC: +15 Max HP', 'hp'); },
          () => { player.bonusDmg += 8; showPickupText('RELIC: +8% DMG', 'dmg'); updateStatsDisplay(); },
          () => { player.hp = player.maxHp; updatePlayerHpBar(); showPickupText('RELIC: Full Heal', 'hp'); },
        ];
        rewards[Math.floor(Math.random() * rewards.length)]();
        // Hide relic
        cave.userData.relic.visible = false;
        if (cave.userData.relicLight) cave.userData.relicLight.intensity = 0;
        if (cave.userData.crystal) {
          cave.userData.crystal.material.emissiveIntensity = 0.2;
          cave.userData.crystal.material.opacity = 0.3;
        }
      }
    }
  });
}

// ─── PLATFORMS & RAMPS ───
const platforms = [];
const ramps = [];
const platMat = new THREE.MeshStandardMaterial({ color: 0x3a3a4e, roughness: 0.85, metalness: 0.15 });
const pillarMat = new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.9 });
const rampMat = new THREE.MeshStandardMaterial({ color: 0x444460, roughness: 0.8 });

function addPlatform(x, y, z, w, d) {
  const plat = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, d), platMat);
  plat.position.set(x, y, z);
  plat.castShadow = true; plat.receiveShadow = true;
  scene.add(plat);
  platforms.push({ x, y: y + 0.25, z, hw: w / 2, hd: d / 2 });
  // Pillars at corners
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, y, 6), pillarMat);
    p.position.set(x + sx * (w / 2 - 0.3), y / 2, z + sz * (d / 2 - 0.3));
    p.castShadow = true;
    scene.add(p);
  });
  // Glowing edge
  const edge = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.1, 0.06, d + 0.1),
    new THREE.MeshBasicMaterial({ color: 0x446688, transparent: true, opacity: 0.3 })
  );
  edge.position.set(x, y + 0.26, z);
  scene.add(edge);
}

function addRamp(x1, z1, x2, z2, y1, y2, width) {
  // Ramp = sloped box from (x1,y1,z1) to (x2,y2,z2)
  const dx = x2 - x1, dz = z2 - z1, dy = y2 - y1;
  const horizLen = Math.sqrt(dx * dx + dz * dz);
  const totalLen = Math.sqrt(horizLen * horizLen + dy * dy);
  const angle = Math.atan2(dy, horizLen);
  const yawAngle = Math.atan2(dx, dz);

  const ramp = new THREE.Mesh(new THREE.BoxGeometry(width, 0.2, totalLen), rampMat);
  ramp.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
  ramp.rotation.order = 'YXZ';
  ramp.rotation.y = yawAngle;
  ramp.rotation.x = -angle;
  ramp.castShadow = true;
  scene.add(ramp);
  // Store ramp data for collision
  ramps.push({ x1, z1, x2, z2, y1, y2, width: width / 2, horizLen });
}

// Central platform
addPlatform(0, 3, 0, 10, 10);
addRamp(0, 8, 0, 14, 3, 0, 3);   // south ramp down
addRamp(0, -8, 0, -14, 3, 0, 3); // north ramp down
addRamp(8, 0, 14, 0, 3, 0, 3);   // east ramp
addRamp(-8, 0, -14, 0, 3, 0, 3); // west ramp

// Corner platforms
addPlatform(-20, 4, -20, 7, 7);
addRamp(-17, -20, -12, -20, 4, 0, 2.5);
addPlatform(20, 4, 20, 7, 7);
addRamp(17, 20, 12, 20, 4, 0, 2.5);
addPlatform(-22, 5.5, 15, 6, 6);
addRamp(-19, 15, -14, 15, 5.5, 0, 2.5);
addPlatform(22, 5.5, -15, 6, 6);
addRamp(19, -15, 14, -15, 5.5, 0, 2.5);

// ─── PLAYER ── Anime girl model ───
const playerGroup = new THREE.Group();
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffe0c0, metalness: 0.05, roughness: 0.7 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a0a2e, metalness: 0.2, roughness: 0.6 }); // dark purple hair
const clothMat = new THREE.MeshStandardMaterial({ color: 0x222244, metalness: 0.2, roughness: 0.5 }); // dark uniform
const accentMat = new THREE.MeshStandardMaterial({ color: 0xcc2255, metalness: 0.3, roughness: 0.4 }); // pink accents

// Torso — slimmer, feminine
const bodyGeo = new THREE.CapsuleGeometry(0.28, 0.5, 8, 16);
const bodyMat = clothMat;
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 1.45;
body.castShadow = true;
playerGroup.add(body);

// Skirt
const skirtGeo = new THREE.ConeGeometry(0.45, 0.5, 12, 1, true);
const skirt = new THREE.Mesh(skirtGeo, accentMat);
skirt.position.y = 1.05;
skirt.rotation.x = Math.PI;
playerGroup.add(skirt);

// Head — bigger eyes style
const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), skinMat);
head.position.y = 2.05;
head.castShadow = true;
playerGroup.add(head);

// Hair — long, flowing
const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 12), hairMat);
hairTop.position.y = 2.12;
hairTop.scale.set(1.05, 1.1, 1.05);
playerGroup.add(hairTop);
// Side bangs
const bangL = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.3, 6, 8), hairMat);
bangL.position.set(-0.2, 1.9, 0.1);
bangL.rotation.z = 0.2;
playerGroup.add(bangL);
const bangR = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.3, 6, 8), hairMat);
bangR.position.set(0.2, 1.9, 0.1);
bangR.rotation.z = -0.2;
playerGroup.add(bangR);
// Long back hair
const backHair = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.7, 8, 12), hairMat);
backHair.position.set(0, 1.6, 0.18);
playerGroup.add(backHair);
// Hair ribbon
const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.08), accentMat);
ribbon.position.set(0, 2.2, 0.15);
playerGroup.add(ribbon);

// Eyes (anime style — big, shiny)
const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const eyeIrisMat = new THREE.MeshBasicMaterial({ color: 0xcc2266 }); // pink eyes
const eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x110022 });
[-0.09, 0.09].forEach(x => {
  const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeWhiteMat);
  eyeW.position.set(x, 2.07, -0.2);
  eyeW.scale.set(1, 1.3, 0.5);
  playerGroup.add(eyeW);
  const iris = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeIrisMat);
  iris.position.set(x, 2.07, -0.23);
  iris.scale.set(1, 1.2, 0.5);
  playerGroup.add(iris);
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyePupilMat);
  pupil.position.set(x, 2.07, -0.245);
  playerGroup.add(pupil);
  // Eye shine
  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  shine.position.set(x + 0.015, 2.09, -0.25);
  playerGroup.add(shine);
});

// Mouth
const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.01, 0.01), new THREE.MeshBasicMaterial({ color: 0xcc6677 }));
mouth.position.set(0, 1.97, -0.23);
playerGroup.add(mouth);

// "Seirin" text on back
const seirinCanvas = document.createElement('canvas');
seirinCanvas.width = 256; seirinCanvas.height = 128;
const ctx = seirinCanvas.getContext('2d');
ctx.fillStyle = 'rgba(0,0,0,0)';
ctx.fillRect(0, 0, 256, 128);
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 48px Arial Black, Impact, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Seirin', 128, 64);
const seirinTex = new THREE.CanvasTexture(seirinCanvas);
const seirinPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(0.45, 0.2),
  new THREE.MeshBasicMaterial({ map: seirinTex, transparent: true, side: THREE.DoubleSide })
);
seirinPlane.position.set(0, 1.5, 0.3);
seirinPlane.rotation.y = Math.PI;
playerGroup.add(seirinPlane);

// Legs (thigh-highs)
const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.2, roughness: 0.5 }); // dark stockings
const leftLeg = new THREE.Group();
const leftThigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.3, 6, 8), legMat);
leftThigh.position.y = -0.15;
leftLeg.add(leftThigh);
const leftShin = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.3, 6, 8), legMat);
leftShin.position.y = -0.48;
leftLeg.add(leftShin);
// Boot
const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.15), accentMat);
leftBoot.position.y = -0.65;
leftLeg.add(leftBoot);
leftLeg.position.set(-0.12, 0.85, 0);
playerGroup.add(leftLeg);

const rightLeg = new THREE.Group();
const rightThigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.3, 6, 8), legMat);
rightThigh.position.y = -0.15;
rightLeg.add(rightThigh);
const rightShin = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.3, 6, 8), legMat);
rightShin.position.y = -0.48;
rightLeg.add(rightShin);
const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.15), accentMat);
rightBoot.position.y = -0.65;
rightLeg.add(rightBoot);
rightLeg.position.set(0.12, 0.85, 0);
playerGroup.add(rightLeg);

// Sword — detailed katana-style
const swordGroup = new THREE.Group();
// Blade — tapered, longer
const bladeMat = new THREE.MeshStandardMaterial({ color: 0xddeeff, metalness: 0.95, roughness: 0.05, emissive: 0x223344, emissiveIntensity: 0.2 });
const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 0.015), bladeMat);
swordBlade.position.y = 0.75;
swordGroup.add(swordBlade);
// Blade edge glow
const edgeGlow = new THREE.Mesh(
  new THREE.BoxGeometry(0.065, 1.4, 0.003),
  new THREE.MeshBasicMaterial({ color: 0x88bbff, transparent: true, opacity: 0.4 })
);
edgeGlow.position.y = 0.75;
edgeGlow.position.z = 0.01;
swordGroup.add(edgeGlow);
// Blade tip
const tip = new THREE.Mesh(
  new THREE.ConeGeometry(0.035, 0.15, 4),
  bladeMat
);
tip.position.y = 1.52;
swordGroup.add(tip);
// Guard (tsuba)
const guard = new THREE.Mesh(
  new THREE.BoxGeometry(0.25, 0.04, 0.12),
  new THREE.MeshStandardMaterial({ color: 0xaa8833, metalness: 0.7, roughness: 0.3 })
);
swordGroup.add(guard);
// Handle (tsuka)
const handle = new THREE.Mesh(
  new THREE.CylinderGeometry(0.03, 0.035, 0.3, 8),
  new THREE.MeshStandardMaterial({ color: 0x442211, roughness: 0.9 })
);
handle.position.y = -0.18;
swordGroup.add(handle);
// Pommel
const pommel = new THREE.Mesh(
  new THREE.SphereGeometry(0.04, 8, 8),
  new THREE.MeshStandardMaterial({ color: 0xaa8833, metalness: 0.7, roughness: 0.3 })
);
pommel.position.y = -0.35;
swordGroup.add(pommel);

swordGroup.position.set(0.5, 1.5, -0.3);
playerGroup.add(swordGroup);

// Sword trail for slash VFX
const trailMat = new THREE.MeshBasicMaterial({ color: 0x88bbff, transparent: true, opacity: 0, side: THREE.DoubleSide });

// Shield (for parry visual)
const shieldMat = new THREE.MeshStandardMaterial({ color: 0x4466aa, metalness: 0.5, roughness: 0.4 });
const shield = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.4), shieldMat);
shield.position.set(-0.5, 1.5, -0.1);
shield.visible = false;
playerGroup.add(shield);

// Dash trail ghost material
const dashGhostMat = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.3 });

scene.add(playerGroup);

// ─── PLAYER STATE ───
const player = {
  baseMaxHp: 100,
  maxHp: 100,
  hp: 100,
  velocityY: 0,
  grounded: true,
  jumpsLeft: 2,
  alive: true,
  iFrames: 0,
  bonusHp: 0,
  bonusDmg: 0,
  // Shield (parry only, no passive)
  shieldHp: 0,
  shieldMaxHp: 0,
  // Dash
  isDashing: false,
  dashTimer: 0,
  dashCd: 0,
  dashDirX: 0,
  dashDirZ: 0,
  // Parry
  isParrying: false,
  parryTimer: 0,
  parryCd: 0,
  parryWindow: 0.25, // seconds of parry window
  parrySuccess: false,
  // Ground slam
  slamCd: 0,
  isSlamming: false,
};
const GRAVITY = -25;
const JUMP_FORCE = 10;
const DASH_SPEED = 30;
const DASH_DURATION = 0.15;
const DASH_COOLDOWN = 0.8;
const PARRY_COOLDOWN = 1.5;
const SLAM_COOLDOWN = 5;
const SLAM_RANGE = 6;
function getSlamDmg() {
  const s = 1 + waveNum * 0.15;
  return { min: 100 * s, max: 200 * s };
}

// ─── LOOT BOXES ───
const lootBoxes = [];
let lootSpawnTimer = 0;
const LOOT_SPAWN_INTERVAL = 18; // seconds between random map spawns

function createLootBox(x, z, type) {
  const group = new THREE.Group();
  const isHp = type === 'hp';
  const color = isHp ? 0x22cc44 : 0xff6622;
  const emissive = isHp ? 0x22cc44 : 0xff4400;

  // Box body
  const boxGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
  const boxMat = new THREE.MeshStandardMaterial({
    color, metalness: 0.4, roughness: 0.3,
    emissive, emissiveIntensity: 0.3,
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.y = 0.5;
  box.castShadow = true;
  group.add(box);

  // Cross or sword icon on top
  if (isHp) {
    const crossH = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x88ffaa, emissiveIntensity: 1 })
    );
    crossH.position.y = 0.85;
    group.add(crossH);
    const crossV = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.3, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x88ffaa, emissiveIntensity: 1 })
    );
    crossV.position.y = 0.85;
    group.add(crossV);
  } else {
    const swordIcon = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.4, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffaa44, emissiveIntensity: 1 })
    );
    swordIcon.position.y = 0.9;
    swordIcon.rotation.z = 0.3;
    group.add(swordIcon);
  }

  // Glow light
  const light = new THREE.PointLight(color, 0.8, 5);
  light.position.y = 1;
  group.add(light);

  group.position.set(x, 0, z);
  group.userData = { type, box, alive: true };
  return group;
}

function spawnLootAtPosition(x, z) {
  const type = Math.random() < 0.5 ? 'hp' : 'dmg';
  const lb = createLootBox(x, z, type);
  lootBoxes.push(lb);
  scene.add(lb);
}

function spawnRandomMapLoot() {
  const angle = Math.random() * Math.PI * 2;
  const dist = 5 + Math.random() * 20;
  spawnLootAtPosition(
    playerGroup.position.x + Math.cos(angle) * dist,
    playerGroup.position.z + Math.sin(angle) * dist
  );
}

function pickupLoot(lb) {
  const type = lb.userData.type;
  lb.userData.alive = false;
  scene.remove(lb);

  if (type === 'hp') {
    const bonus = 10 + Math.floor(Math.random() * 15);
    player.bonusHp += bonus;
    player.maxHp = player.baseMaxHp + player.bonusHp;
    player.hp = Math.min(player.hp + bonus, player.maxHp);
    showPickupText(`+${bonus} MAX HP`, 'hp');
  } else {
    const bonus = 5 + Math.floor(Math.random() * 10);
    player.bonusDmg += bonus;
    showPickupText(`+${bonus}% DMG`, 'dmg');
  }
  updatePlayerHpBar();
  updateStatsDisplay();
}

function showPickupText(text, type) {
  const el = document.createElement('div');
  el.className = 'pickup-text ' + type;
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

function updateStatsDisplay() {
  document.getElementById('stat-hp').textContent = `+${player.bonusHp} HP`;
  document.getElementById('stat-dmg').textContent = `+${player.bonusDmg}% DMG`;
}

function updateShieldBar() {
  const fill = document.getElementById('shield-fill');
  const label = document.getElementById('shield-label');
  if (player.shieldMaxHp <= 0) {
    fill.style.width = '0%';
    label.textContent = 'SHIELD: --';
    return;
  }
  const pct = (player.shieldHp / player.shieldMaxHp) * 100;
  fill.style.width = pct + '%';
  label.textContent = `SHIELD: ${player.shieldHp} / ${player.shieldMaxHp}`;
}

function grantShield(amount) {
  player.shieldMaxHp += amount;
  player.shieldHp = player.shieldMaxHp;
  updateShieldBar();
}

// ─── LEADERBOARD ───
const LB_KEY = 'slasher3d_leaderboard';

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY)) || [];
  } catch { return []; }
}

function saveRun(kills, wave) {
  const lb = loadLeaderboard();
  lb.push({ kills, wave, date: Date.now() });
  lb.sort((a, b) => b.wave - a.wave || b.kills - a.kills);
  if (lb.length > 10) lb.length = 10;
  localStorage.setItem(LB_KEY, JSON.stringify(lb));
  return lb;
}

function getBestRun() {
  const lb = loadLeaderboard();
  if (lb.length === 0) return null;
  return lb[0];
}

function renderLeaderboard(currentKills, currentWave, isDead) {
  const lb = loadLeaderboard();
  const best = lb[0];
  const bestEl = document.getElementById('lb-best');
  if (best) {
    bestEl.textContent = `BEST: Wave ${best.wave} | ${best.kills} kills`;
  } else {
    bestEl.textContent = 'BEST: --';
  }

  const entriesEl = document.getElementById('lb-entries');
  let html = '';
  // Show top 5
  lb.slice(0, 5).forEach((entry, i) => {
    html += `<div class="lb-entry">${i + 1}. Wave ${entry.wave} — ${entry.kills} kills</div>`;
  });
  if (isDead) {
    html += `<div class="lb-entry current">► Wave ${currentWave} — ${currentKills} kills</div>`;
  }
  entriesEl.innerHTML = html;
}

// Clear old leaderboard data and init display
localStorage.removeItem(LB_KEY);
renderLeaderboard(0, 1, false);

function updateLootBoxes(dt) {
  // Animate loot boxes (bob + rotate)
  lootBoxes.forEach(lb => {
    if (!lb.userData.alive) return;
    lb.userData.box.rotation.y += dt * 2;
    lb.userData.box.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.15;
  });

  // Pickup check
  for (let i = lootBoxes.length - 1; i >= 0; i--) {
    const lb = lootBoxes[i];
    if (!lb.userData.alive) { lootBoxes.splice(i, 1); continue; }
    const dist = playerGroup.position.distanceTo(lb.position);
    if (dist < 1.8) {
      pickupLoot(lb);
      lootBoxes.splice(i, 1);
    }
  }

  // Random map spawns
  lootSpawnTimer += dt;
  if (lootSpawnTimer >= LOOT_SPAWN_INTERVAL) {
    lootSpawnTimer = 0;
    if (lootBoxes.length < 8) { // max 8 on map
      spawnRandomMapLoot();
    }
  }
}

// ─── ENEMIES ───
const enemies = [];
const ENEMY_NAMES = ['Imp', 'Demon', 'Fiend', 'Wraith', 'Ghoul', 'Hellspawn', 'Shade', 'Brute'];
let waveNum = 1;
let killCount = 0;
let enemyIdCounter = 0;

function createEnemy(x, z) {
  const group = new THREE.Group();

  // Visual tier based on wave
  const tier = waveNum <= 3 ? 0 : waveNum <= 6 ? 1 : waveNum <= 10 ? 2 : 3;
  const TIERS = [
    // Tier 0 (wave 1-3): small, green/brown goblins
    { scale: [0.6, 0.8], bodyColor: [0.2, 0.4, 0.15], hornSize: 0.3, eyeColor: 0x88ff44, eyeGlow: 0x44aa22, name: 'Goblin' },
    // Tier 1 (wave 4-6): medium, red/orange demons
    { scale: [0.8, 1.1], bodyColor: [0.7, 0.15, 0.05], hornSize: 0.5, eyeColor: 0xffaa00, eyeGlow: 0xff6600, name: 'Demon' },
    // Tier 2 (wave 7-10): big, purple void walkers
    { scale: [1.0, 1.3], bodyColor: [0.35, 0.1, 0.5], hornSize: 0.7, eyeColor: 0xcc44ff, eyeGlow: 0x8800cc, name: 'Voidwalker' },
    // Tier 3 (wave 11+): huge, black/red infernal knights
    { scale: [1.2, 1.5], bodyColor: [0.15, 0.02, 0.02], hornSize: 0.9, eyeColor: 0xff2200, eyeGlow: 0xff0000, name: 'Infernal' },
  ];
  const t = TIERS[tier];
  const scale = t.scale[0] + Math.random() * (t.scale[1] - t.scale[0]);

  const ebody = new THREE.CapsuleGeometry(0.5 * scale, 1.2 * scale, 8, 16);
  const bc = t.bodyColor;
  const emat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(bc[0] + Math.random() * 0.1, bc[1] + Math.random() * 0.05, bc[2] + Math.random() * 0.1),
    metalness: 0.2 + tier * 0.1, roughness: 0.7 - tier * 0.1,
  });
  if (tier >= 2) { emat.emissive = new THREE.Color(bc[0] * 0.3, bc[1] * 0.3, bc[2] * 0.3); emat.emissiveIntensity = 0.3; }
  const emesh = new THREE.Mesh(ebody, emat);
  emesh.position.y = 1.3 * scale;
  emesh.castShadow = true;
  group.add(emesh);

  // Spikes/armor for higher tiers
  if (tier >= 2) {
    for (let si = 0; si < tier * 2; si++) {
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.06 * scale, 0.25 * scale, 4),
        new THREE.MeshStandardMaterial({ color: tier === 3 ? 0x220000 : 0x330033, metalness: 0.7 })
      );
      const sa = (si / (tier * 2)) * Math.PI * 2;
      spike.position.set(Math.cos(sa) * 0.4 * scale, (1.0 + Math.random() * 0.6) * scale, Math.sin(sa) * 0.4 * scale);
      spike.rotation.set(Math.cos(sa) * 0.5, 0, -Math.sin(sa) * 0.5);
      group.add(spike);
    }
  }

  const hornGeo = new THREE.ConeGeometry(0.1 * scale, t.hornSize * scale, 8);
  const hornMat = new THREE.MeshStandardMaterial({ color: tier >= 2 ? 0x110011 : 0x442222, metalness: tier * 0.15 });
  const hornL = new THREE.Mesh(hornGeo, hornMat);
  hornL.position.set(-0.3 * scale, 2.3 * scale, 0);
  hornL.rotation.z = 0.3;
  group.add(hornL);
  const hornR = new THREE.Mesh(hornGeo, hornMat);
  hornR.position.set(0.3 * scale, 2.3 * scale, 0);
  hornR.rotation.z = -0.3;
  group.add(hornR);

  const eyeGeo = new THREE.SphereGeometry(0.08 * scale, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: t.eyeColor, emissive: t.eyeGlow, emissiveIntensity: 1.5 + tier * 0.5 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.15 * scale, 1.9 * scale, 0.4 * scale);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.15 * scale, 1.9 * scale, 0.4 * scale);
  group.add(eyeR);

  // Arms
  const armMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(bc[0] * 0.8, bc[1] * 0.8, bc[2] * 0.8), metalness: 0.3, roughness: 0.6 });
  // Right arm (weapon arm)
  const rightArm = new THREE.Group();
  const rUpperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08 * scale, 0.35 * scale, 6, 8), armMat);
  rUpperArm.position.y = -0.15 * scale;
  rightArm.add(rUpperArm);
  const rForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06 * scale, 0.3 * scale, 6, 8), armMat);
  rForearm.position.y = -0.4 * scale;
  rightArm.add(rForearm);
  rightArm.position.set(0.55 * scale, 1.6 * scale, 0);
  group.add(rightArm);
  // Left arm
  const leftArm = new THREE.Group();
  const lUpperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.08 * scale, 0.35 * scale, 6, 8), armMat);
  lUpperArm.position.y = -0.15 * scale;
  leftArm.add(lUpperArm);
  const lForearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06 * scale, 0.3 * scale, 6, 8), armMat);
  lForearm.position.y = -0.4 * scale;
  leftArm.add(lForearm);
  leftArm.position.set(-0.55 * scale, 1.6 * scale, 0);
  group.add(leftArm);

  // Weapon on right arm
  const weaponType = Math.floor(Math.random() * 4);
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0, -0.5 * scale, 0.1 * scale);

  if (weaponType === 0) {
    // Axe
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, 0.8 * scale, 6),
      new THREE.MeshStandardMaterial({ color: 0x553311 })
    );
    const headGeo = new THREE.BoxGeometry(0.25 * scale, 0.3 * scale, 0.05 * scale);
    const head = new THREE.Mesh(headGeo,
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 })
    );
    head.position.y = 0.35 * scale;
    weaponGroup.add(handle);
    weaponGroup.add(head);
  } else if (weaponType === 1) {
    // Club/mace
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025 * scale, 0.035 * scale, 0.7 * scale, 6),
      new THREE.MeshStandardMaterial({ color: 0x443322 })
    );
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.12 * scale, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 })
    );
    ball.position.y = 0.35 * scale;
    weaponGroup.add(handle);
    weaponGroup.add(ball);
  } else if (weaponType === 2) {
    // Sword
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.06 * scale, 0.7 * scale, 0.02 * scale),
      new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 0.9, roughness: 0.1 })
    );
    blade.position.y = 0.2 * scale;
    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.2 * scale, 0.04 * scale, 0.04 * scale),
      new THREE.MeshStandardMaterial({ color: 0x664422 })
    );
    guard.position.y = -0.1 * scale;
    weaponGroup.add(blade);
    weaponGroup.add(guard);
  } else {
    // Claws (dual)
    for (let ci = 0; ci < 3; ci++) {
      const c = new THREE.Mesh(
        new THREE.ConeGeometry(0.02 * scale, 0.3 * scale, 4),
        new THREE.MeshStandardMaterial({ color: 0x888866, metalness: 0.7, roughness: 0.3 })
      );
      c.position.set((ci - 1) * 0.06 * scale, 0.2 * scale, 0);
      c.rotation.x = -0.3;
      weaponGroup.add(c);
    }
  }
  rightArm.add(weaponGroup);

  // HP x2: wave1=120, wave5=260, wave10=440
  const hp = Math.round((80 + waveNum * 36) * (0.9 + Math.random() * 0.2));
  const name = t.name;
  // DMG: wave1=6, wave5=14, wave10=24
  const dmg = Math.round((4 + waveNum * 2) * (0.9 + Math.random() * 0.2));
  // Enemy type: melee (70%), ranged (20%), fast (10%)
  const typeRoll = Math.random();
  const enemyType = typeRoll < 0.7 ? 'melee' : typeRoll < 0.9 ? 'ranged' : 'fast';

  if (enemyType === 'ranged') {
    // Distinct look: floating robe, glowing hands, staff
    emesh.material = new THREE.MeshStandardMaterial({
      color: 0x331144, metalness: 0.2, roughness: 0.5,
      emissive: new THREE.Color(0x220033), emissiveIntensity: 0.5,
    });
    // Robe bottom (wide cone)
    const robe = new THREE.Mesh(
      new THREE.ConeGeometry(0.6 * scale, 0.8 * scale, 8, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x220033, roughness: 0.7 })
    );
    robe.position.y = 0.6 * scale;
    robe.rotation.x = Math.PI;
    group.add(robe);
    // Staff in hand
    const staff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, 1.8 * scale, 6),
      new THREE.MeshStandardMaterial({ color: 0x553366, metalness: 0.5 })
    );
    staff.position.set(0.4 * scale, 1.2 * scale, 0.2 * scale);
    group.add(staff);
    // Orb on staff top
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.15 * scale, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xff44aa, transparent: true, opacity: 0.8 })
    );
    orb.position.set(0.4 * scale, 2.1 * scale, 0.2 * scale);
    group.add(orb);
    const orbLight = new THREE.PointLight(0xff44aa, 0.4, 4);
    orbLight.position.copy(orb.position);
    group.add(orbLight);
    // Floating (hover above ground)
    group.userData.floats = true;
  }
  if (enemyType === 'fast') {
    // Lean, spiky, bright accent
    emesh.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.6, 0.6, 0.1), metalness: 0.4, roughness: 0.4,
      emissive: new THREE.Color(0.15, 0.15, 0), emissiveIntensity: 0.3,
    });
    // Tail spikes
    for (let si = 0; si < 3; si++) {
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.05 * scale, 0.4 * scale, 4),
        new THREE.MeshStandardMaterial({ color: 0xaaaa22, metalness: 0.5 })
      );
      spike.position.set(0, (0.8 + si * 0.3) * scale, 0.4 * scale);
      spike.rotation.x = 0.8;
      group.add(spike);
    }
  }

  group.position.set(x, 0, z);
  group.userData = {
    maxHp: enemyType === 'ranged' ? Math.round(hp * 0.6) : enemyType === 'fast' ? Math.round(hp * 0.5) : hp,
    hp: enemyType === 'ranged' ? Math.round(hp * 0.6) : enemyType === 'fast' ? Math.round(hp * 0.5) : hp,
    mesh: emesh,
    weapon: rightArm,
    leftArm,
    scale,
    speed: enemyType === 'fast' ? 4 + Math.random() * 2 : enemyType === 'ranged' ? 1 + Math.random() : 1.5 + Math.random() * 2,
    name: enemyType === 'ranged' ? `${name} Mage` : enemyType === 'fast' ? `${name} Scout` : `${name} Lv.${waveNum}`,
    alive: true,
    enemyType,
    eid: enemyIdCounter++,
    attackCd: 0,
    attackRate: enemyType === 'ranged' ? 2.0 + Math.random() * 0.5 : 1.0 + Math.random() * 0.5,
    damage: dmg,
    attackRange: 1.8,
    isAttacking: false,
    attackTimer: 0,
    attackHit: false,
    hitstun: 0,
    knockVelX: 0,
    knockVelZ: 0,
    dangerZone: null,
    dangerMat: null,
  };
  return group;
}

const BOSS_NAMES = ['Infernal Lord', 'Abyssal Titan', 'Doom Colossus', 'Hell Emperor', 'Chaos Overlord'];

function createBoss(x, z) {
  const group = new THREE.Group();
  const scale = 5;

  // Massive body
  const ebody = new THREE.CapsuleGeometry(0.5 * scale, 1.2 * scale, 8, 16);
  const emat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.5, 0.05, 0.0), metalness: 0.5, roughness: 0.4,
  });
  const emesh = new THREE.Mesh(ebody, emat);
  emesh.position.y = 1.3 * scale;
  emesh.castShadow = true;
  group.add(emesh);

  // Big horns
  const hornGeo = new THREE.ConeGeometry(0.25 * scale, 1.2 * scale, 8);
  const hornMat = new THREE.MeshStandardMaterial({ color: 0x220000, metalness: 0.6, roughness: 0.3 });
  const hornL = new THREE.Mesh(hornGeo, hornMat);
  hornL.position.set(-0.4 * scale, 2.5 * scale, 0);
  hornL.rotation.z = 0.4;
  group.add(hornL);
  const hornR = new THREE.Mesh(hornGeo, hornMat);
  hornR.position.set(0.4 * scale, 2.5 * scale, 0);
  hornR.rotation.z = -0.4;
  group.add(hornR);

  // Glowing eyes (bigger, angrier)
  const eyeGeo = new THREE.SphereGeometry(0.15 * scale, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 3 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.2 * scale, 2.0 * scale, 0.45 * scale);
  group.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.2 * scale, 2.0 * scale, 0.45 * scale);
  group.add(eyeR);

  // Giant claw
  const clawGeo = new THREE.BoxGeometry(0.3 * scale, 1.0 * scale, 0.2 * scale);
  const clawMat = new THREE.MeshStandardMaterial({ color: 0x441100, metalness: 0.6, roughness: 0.4 });
  const claw = new THREE.Mesh(clawGeo, clawMat);
  claw.position.set(0.6 * scale, 1.0 * scale, 0.4 * scale);
  group.add(claw);

  // Boss point light (menacing aura)
  const bossLight = new THREE.PointLight(0xff2200, 2, 20);
  bossLight.position.set(0, 3 * scale, 0);
  group.add(bossLight);

  // Boss = ~8x regular enemy HP
  const hp = Math.round((300 + waveNum * 150));
  const name = BOSS_NAMES[Math.floor(Math.random() * BOSS_NAMES.length)];
  // Boss dmg = ~3x regular
  const dmg = Math.round((12 + waveNum * 5));
  group.position.set(x, 0, z);
  group.userData = {
    maxHp: hp,
    hp,
    mesh: emesh,
    weapon: claw,
    scale,
    speed: 1.2 + Math.random() * 0.5,
    name: `BOSS: ${name}`,
    alive: true,
    isBoss: true,
    attackCd: 0,
    attackRate: 1.5,
    damage: dmg,
    attackRange: 5,
    isAttacking: false,
    attackTimer: 0,
    attackHit: false,
    hitstun: 0,
    knockVelX: 0,
    knockVelZ: 0,
    dangerZone: null,
    dangerMat: null,
  };
  return group;
}

function spawnWave() {
  const isBossWave = waveNum % 5 === 0;

  // Deterministic enemy count: wave 1=3, wave 2=4, wave 3=5, etc., cap at 12
  const baseCount = Math.min(2 + waveNum, 12);

  if (isBossWave) {
    const boss = createBoss(
      playerGroup.position.x + 15,
      playerGroup.position.z
    );
    enemies.push(boss);
    scene.add(boss);

    // Boss wave: fewer minions (half normal)
    const minionCount = Math.floor(baseCount / 2);
    for (let i = 0; i < minionCount; i++) {
      const angle = (i / minionCount) * Math.PI * 2;
      const dist = 12 + i * 2;
      const e = createEnemy(
        playerGroup.position.x + Math.sin(angle) * dist,
        playerGroup.position.z + Math.cos(angle) * dist
      );
      enemies.push(e);
      scene.add(e);
    }

    const banner = document.getElementById('wave-banner');
    banner.textContent = `WAVE ${waveNum} — BOSS!`;
    banner.style.color = '#ff4400';
    banner.classList.add('show');
    setTimeout(() => {
      banner.classList.remove('show');
      banner.style.color = '';
    }, 3000);
  } else {
    const count = baseCount;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const dist = 10 + Math.random() * 10;
      const e = createEnemy(
        playerGroup.position.x + Math.sin(angle) * dist,
        playerGroup.position.z + Math.cos(angle) * dist
      );
      enemies.push(e);
      scene.add(e);
    }

    const banner = document.getElementById('wave-banner');
    banner.textContent = `WAVE ${waveNum}`;
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 2000);
  }
}

spawnWave();

// ─── SKILLS ───
// Skills scale with wave via getSkillDmg()
function getSkillDmg(baseMin, baseMax) {
  const s = 1 + waveNum * 0.15;
  return { min: baseMin * s, max: baseMax * s };
}
const skills = {
  lmb: { name: 'Slash', cd: 0.4, timer: 0, range: 3.5, baseDmgMin: 25, baseDmgMax: 50, critMult: 2.0, cssClass: '', color: 0x4488ff },
  1: { name: 'Frost Nova', cd: 4, timer: 0, range: 6, baseDmgMin: 60, baseDmgMax: 120, critMult: 2.5, cssClass: 'skill-1', color: 0x44ddff },
  2: { name: 'Blood Rend', cd: 8, timer: 0, range: 8, baseDmgMin: 150, baseDmgMax: 300, critMult: 3.0, cssClass: 'skill-2', color: 0xff4444 },
  3: { name: 'Thunder Smite', cd: 5, timer: 0, range: 10, baseDmgMin: 90, baseDmgMax: 180, critMult: 2.8, cssClass: 'skill-3', color: 0xaa66ff },
  4: { name: 'CATACLYSM', cd: 20, timer: 0, range: 12, baseDmgMin: 250, baseDmgMax: 500, critMult: 3.0, cssClass: 'skill-4', color: 0xffaa00 },
};

// ─── VFX ───
const vfxObjects = [];

// 1 — FROST NOVA: expanding ice ring from player, freezes ground, hits ALL in range
function createFrostNovaVFX(position, radius) {
  // Ice ring expanding on ground
  const ringGeo = new THREE.RingGeometry(0.3, radius, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x44ddff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(position); ring.position.y = 0.15;
  ring.rotation.x = -Math.PI / 2;
  ring.scale.set(0.01, 0.01, 0.01);
  scene.add(ring);
  vfxObjects.push({ mesh: ring, timer: 0, duration: 1.0, type: 'ring', targetScale: 1 });

  // Ice spikes popping up
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 1 + Math.random() * (radius - 1);
    const spikeH = 1 + Math.random() * 2;
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, spikeH, 4),
      new THREE.MeshBasicMaterial({ color: 0x88eeff, transparent: true, opacity: 0.7 })
    );
    spike.position.set(
      position.x + Math.cos(angle) * dist,
      0,
      position.z + Math.sin(angle) * dist
    );
    scene.add(spike);
    vfxObjects.push({ mesh: spike, timer: -i * 0.03, duration: 1.2, type: 'iceSpike', maxH: spikeH });
  }

  // Frost mist (flat disc)
  const mistGeo = new THREE.CylinderGeometry(radius, radius, 0.3, 24);
  const mistMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3 });
  const mist = new THREE.Mesh(mistGeo, mistMat);
  mist.position.copy(position); mist.position.y = 0.2;
  scene.add(mist);
  vfxObjects.push({ mesh: mist, timer: 0, duration: 1.5, type: 'fadeOut' });
}

// 2 — BLOOD REND: huge slashing wave projectile forward
function createBloodRendVFX(origin, target) {
  const dir = target.clone().sub(origin);
  dir.y = 0; dir.normalize();

  // Giant red slash arc
  const slashGeo = new THREE.PlaneGeometry(3, 5);
  const slashMat = new THREE.MeshBasicMaterial({ color: 0xff2222, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
  const slash = new THREE.Mesh(slashGeo, slashMat);
  slash.position.copy(origin);
  slash.position.y = 1.5;
  slash.lookAt(target.x, 1.5, target.z);
  slash.rotateY(Math.PI / 2);
  scene.add(slash);
  vfxObjects.push({ mesh: slash, timer: 0, duration: 0.4, type: 'slashWave', dir, origin: origin.clone(), speed: 25 });

  // Blood droplets
  for (let i = 0; i < 8; i++) {
    const drop = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xcc0000, transparent: true, opacity: 0.8 })
    );
    drop.position.copy(origin);
    drop.position.y = 1 + Math.random() * 1.5;
    scene.add(drop);
    const dropDir = dir.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.5, Math.random() * 0.3, (Math.random() - 0.5) * 0.5));
    vfxObjects.push({ mesh: drop, timer: 0, duration: 0.6, type: 'particle', dir: dropDir, speed: 10 + Math.random() * 8 });
  }

  // Screen flash red slightly
  screenShake = 0.06;
}

// 3 — THUNDER SMITE: lightning bolt from sky to target
function createThunderVFX(targetPos) {
  // Build zigzag lightning bolt from sky
  const boltGroup = new THREE.Group();
  const segments = 8;
  const topY = 20;
  let prevX = targetPos.x, prevZ = targetPos.z;
  for (let i = 0; i < segments; i++) {
    const t0 = i / segments;
    const t1 = (i + 1) / segments;
    const y0 = topY * (1 - t0);
    const y1 = topY * (1 - t1);
    const x0 = prevX;
    const z0 = prevZ;
    const x1 = targetPos.x + (Math.random() - 0.5) * 2 * (1 - t1);
    const z1 = targetPos.z + (Math.random() - 0.5) * 2 * (1 - t1);
    prevX = x1; prevZ = z1;

    const len = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2 + (z1 - z0) ** 2);
    const boltSeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, len, 4),
      new THREE.MeshBasicMaterial({ color: 0xddaaff, transparent: true, opacity: 0.9 })
    );
    boltSeg.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    boltSeg.lookAt(x1, y1, z1);
    boltSeg.rotateX(Math.PI / 2);
    boltGroup.add(boltSeg);
  }
  scene.add(boltGroup);
  vfxObjects.push({ mesh: boltGroup, timer: 0, duration: 0.3, type: 'fadeOut' });

  // Bright flash at impact
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
  );
  flash.position.copy(targetPos); flash.position.y = 0.5;
  scene.add(flash);
  vfxObjects.push({ mesh: flash, timer: 0, duration: 0.25, type: 'explosion' });

  // Purple electric sparks
  for (let i = 0; i < 10; i++) {
    const spark = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xaa66ff, transparent: true, opacity: 1 })
    );
    spark.position.copy(targetPos);
    spark.position.y = 0.5 + Math.random();
    scene.add(spark);
    const sDir = new THREE.Vector3((Math.random() - 0.5), Math.random() * 0.5, (Math.random() - 0.5));
    vfxObjects.push({ mesh: spark, timer: 0, duration: 0.5, type: 'particle', dir: sDir, speed: 8 + Math.random() * 6 });
  }

  // Ground scorch ring
  const scorch = new THREE.Mesh(
    new THREE.RingGeometry(0.1, 2, 24),
    new THREE.MeshBasicMaterial({ color: 0x6633aa, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
  );
  scorch.position.copy(targetPos); scorch.position.y = 0.05;
  scorch.rotation.x = -Math.PI / 2;
  scene.add(scorch);
  vfxObjects.push({ mesh: scorch, timer: 0, duration: 1.5, type: 'fadeOut' });

  screenShake = 0.1;
}

// 4 — CATACLYSM: massive meteor + shockwave + fire pillars
function createUltVFX(position) {
  // Giant shockwave ring
  const ringGeo = new THREE.RingGeometry(0.5, 15, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(position); ring.position.y = 0.2;
  ring.rotation.x = -Math.PI / 2;
  ring.scale.set(0.01, 0.01, 0.01);
  scene.add(ring);
  vfxObjects.push({ mesh: ring, timer: 0, duration: 1.5, type: 'ring', targetScale: 1 });

  // Fire pillars in circle
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const r = 5;
    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 1, 15, 6, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    pillar.position.set(position.x + Math.cos(angle) * r, 7, position.z + Math.sin(angle) * r);
    scene.add(pillar);
    vfxObjects.push({ mesh: pillar, timer: -i * 0.05, duration: 1.2, type: 'pillar' });
  }

  // Meteor (falling sphere)
  const meteor = new THREE.Mesh(
    new THREE.SphereGeometry(2, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.9 })
  );
  meteor.position.set(position.x, 25, position.z);
  scene.add(meteor);
  vfxObjects.push({ mesh: meteor, timer: 0, duration: 0.5, type: 'meteor', target: position.clone() });

  // Center explosion (delayed)
  setTimeout(() => {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(3, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.8 })
    );
    sphere.position.copy(position); sphere.position.y = 2;
    scene.add(sphere);
    vfxObjects.push({ mesh: sphere, timer: 0, duration: 1.0, type: 'explosion' });
    screenShake = 0.25;
  }, 450);

  // Embers / fire particles
  for (let i = 0; i < 20; i++) {
    const ember = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 4, 4),
      new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xff8800 : 0xffcc00, transparent: true, opacity: 1 })
    );
    ember.position.copy(position); ember.position.y = 1;
    scene.add(ember);
    const eDir = new THREE.Vector3((Math.random() - 0.5), 0.5 + Math.random(), (Math.random() - 0.5)).normalize();
    vfxObjects.push({ mesh: ember, timer: -0.45 - Math.random() * 0.2, duration: 1.0, type: 'particle', dir: eDir, speed: 5 + Math.random() * 10 });
  }
}

function disposeVFX(vfx) {
  scene.remove(vfx.mesh);
  if (vfx.mesh.geometry) vfx.mesh.geometry.dispose();
  if (vfx.mesh.material) {
    if (vfx.mesh.material.dispose) vfx.mesh.material.dispose();
  }
  // For groups, dispose children
  if (vfx.mesh.children) {
    vfx.mesh.children.forEach(c => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
  }
}

function updateVFX(dt) {
  for (let i = vfxObjects.length - 1; i >= 0; i--) {
    const vfx = vfxObjects[i];
    vfx.timer += dt;
    if (vfx.timer < 0) continue;
    const t = vfx.timer / vfx.duration;
    if (t >= 1) {
      disposeVFX(vfx);
      vfxObjects.splice(i, 1);
      continue;
    }
    if (vfx.type === 'ring') {
      const s = t * vfx.targetScale;
      vfx.mesh.scale.set(s, s, s);
      vfx.mesh.material.opacity = (1 - t) * 0.8;
    } else if (vfx.type === 'pillar') {
      vfx.mesh.material.opacity = (1 - t) * 0.5;
      vfx.mesh.position.y = 5 + t * 3;
    } else if (vfx.type === 'explosion') {
      const s = 1 + t * 4;
      vfx.mesh.scale.set(s, s, s);
      vfx.mesh.material.opacity = (1 - t) * 0.7;
    } else if (vfx.type === 'fadeOut') {
      vfx.mesh.traverse(c => { if (c.material) c.material.opacity = (1 - t) * 0.6; });
    } else if (vfx.type === 'iceSpike') {
      // Pop up then fade
      if (t < 0.3) {
        const rise = t / 0.3;
        vfx.mesh.position.y = rise * vfx.maxH * 0.5;
        vfx.mesh.scale.y = rise;
      } else {
        vfx.mesh.material.opacity = (1 - (t - 0.3) / 0.7) * 0.7;
      }
    } else if (vfx.type === 'slashWave') {
      // Fly forward
      vfx.mesh.position.x += vfx.dir.x * vfx.speed * dt;
      vfx.mesh.position.z += vfx.dir.z * vfx.speed * dt;
      vfx.mesh.material.opacity = (1 - t) * 0.8;
      const s = 1 + t * 0.5;
      vfx.mesh.scale.set(s, s, s);
    } else if (vfx.type === 'particle') {
      vfx.mesh.position.x += vfx.dir.x * vfx.speed * dt;
      vfx.mesh.position.y += vfx.dir.y * vfx.speed * dt - 5 * dt * t;
      vfx.mesh.position.z += vfx.dir.z * vfx.speed * dt;
      vfx.mesh.material.opacity = 1 - t;
    } else if (vfx.type === 'meteor') {
      // Fall from sky to target
      const targetY = 2;
      vfx.mesh.position.y = 25 - t * (25 - targetY);
      vfx.mesh.position.x += (vfx.target.x - vfx.mesh.position.x) * 0.1;
      vfx.mesh.position.z += (vfx.target.z - vfx.mesh.position.z) * 0.1;
      const s = 1 + t * 0.5;
      vfx.mesh.scale.set(s, s, s);
      vfx.mesh.material.opacity = 0.9;
    }
  }
}

// ─── PAUSE ───
let isPaused = false;

function togglePause() {
  if (!player.alive) return;
  isPaused = !isPaused;
  const screen = document.getElementById('pause-screen');
  if (isPaused) {
    screen.classList.add('show');
    document.getElementById('pause-wave').textContent = waveNum;
    document.getElementById('pause-kills').textContent = killCount;
    document.exitPointerLock();
  } else {
    screen.classList.remove('show');
    renderer.domElement.requestPointerLock();
  }
}

function restartGame() {
  isPaused = false;
  document.getElementById('pause-screen').classList.remove('show');
  respawnPlayer();
  renderer.domElement.requestPointerLock();
}

document.getElementById('btn-resume').addEventListener('click', () => togglePause());
document.getElementById('btn-restart').addEventListener('click', () => restartGame());

// ─── REUSABLE VECTORS (avoid per-frame alloc) ───
const _tmpVec = new THREE.Vector3();
const _tmpVec2 = new THREE.Vector3();
const _camOffset = new THREE.Vector3();

// ─── GAME STATE ───
const keys = {};
let yaw = 0, pitch = 0;
let isAttacking = false;
let attackTime = 0;
let hitRegistered = false;
const ATTACK_DURATION = 0.25;
let pointerLocked = false;
let targetEnemy = null;
let screenShake = 0;

// Combo system — 3 hit chain (scales with wave)
let comboCount = 0;
let comboResetTimer = 0;
const COMBO_WINDOW = 0.6;
function getComboScaled() {
  const s = 1 + waveNum * 0.15; // +15% per wave
  return [
    { min: 25 * s, max: 50 * s, critMult: 2.0, range: 3.5 },
    { min: 40 * s, max: 75 * s, critMult: 2.3, range: 3.8 },
    { min: 70 * s, max: 130 * s, critMult: 3.0, range: 4.5 },
  ];
}
const COMBO_SPEEDS = [0.25, 0.2, 0.35]; // duration per hit

// Heavy attack (RMB)
let isHeavyAttacking = false;
let heavyAttackTime = 0;
let heavyHitRegistered = false;
const HEAVY_DURATION = 0.6;
const HEAVY_COOLDOWN = 3;
let heavyCd = 0;
const HEAVY_RANGE = 5;
// Heavy scales too
function getHeavyDmg() {
  const s = 1 + waveNum * 0.15;
  return { min: 120 * s, max: 250 * s };
}

// ─── DAMAGE NUMBERS ───
function spawnDamageNumber(damage, worldPos, isCrit, cssClass) {
  const vec = worldPos.clone().project(camera);
  const x = (vec.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-vec.y * 0.5 + 0.5) * window.innerHeight;

  const el = document.createElement('div');
  let cls = 'damage-number';
  if (cssClass) cls += ' ' + cssClass;
  else if (isCrit) cls += ' crit';
  el.className = cls;

  // Format big numbers with commas
  const dmgText = typeof damage === 'number' ? damage.toLocaleString() : damage;
  el.textContent = isCrit ? `${dmgText}!` : dmgText;

  // Bigger sizes, scale with damage
  const numDmg = typeof damage === 'number' ? damage : 0;
  const size = cssClass === 'skill-4' ? 72 :
               cssClass === 'skill-slam' ? 48 :
               cssClass === 'parry' ? 40 :
               isCrit ? Math.min(80, 42 + numDmg / 60) :
               Math.min(52, 24 + numDmg / 80);
  el.style.fontSize = size + 'px';
  // Spread them more for readability
  const spread = isCrit ? 100 : 70;
  el.style.left = (x + (Math.random() - 0.5) * spread) + 'px';
  el.style.top = (y + (Math.random() - 0.5) * 40) + 'px';
  if (!cssClass && !isCrit) el.style.color = '#ffffff';

  document.body.appendChild(el);

  // Hit freeze — tiny pause for impact feel (only for big hits)
  if (numDmg > 500 || isCrit) {
    screenShake = Math.max(screenShake, 0.05 + numDmg / 20000);
  }

  const duration = cssClass === 'skill-4' ? 1800 :
                   isCrit ? 1500 : 1200;
  setTimeout(() => el.remove(), duration);
}

function damageEnemy(e, baseDmgMin, baseDmgMax, critMult, cssClass) {
  if (!e.userData.alive) return;
  const baseDamage = baseDmgMin + Math.random() * (baseDmgMax - baseDmgMin);
  const isCrit = Math.random() < 0.3;
  const damage = Math.round(isCrit ? baseDamage * critMult : baseDamage);

  // Apply player damage bonus + crit bonus
  const critExtra = isCrit ? (player.critBonus || 0) : 0;
  const totalMult = (1 + player.bonusDmg / 100) * (1 + critExtra);
  const finalDamage = Math.round(damage * totalMult);
  e.userData.hp = Math.max(0, e.userData.hp - finalDamage);

  // Lifesteal
  if (player.lifesteal && player.lifesteal > 0) {
    const heal = Math.round(finalDamage * player.lifesteal);
    player.hp = Math.min(player.maxHp, player.hp + heal);
    updatePlayerHpBar();
  }

  playSound('hit');
  // Flash white
  const mat = e.userData.mesh.material;
  mat.emissive.set(0xffffff);
  mat.emissiveIntensity = 2;
  setTimeout(() => {
    if (e.userData.alive) {
      mat.emissive.set(0x000000);
      mat.emissiveIntensity = 0;
    }
  }, 120);

  // Knockback away from player
  const knockDir = e.position.clone().sub(playerGroup.position);
  knockDir.y = 0;
  const knockDist = knockDir.length();
  if (knockDist > 0.1) {
    knockDir.normalize();
    const knockForce = e.userData.isBoss ? 3 : 8;
    e.userData.knockVelX = knockDir.x * knockForce;
    e.userData.knockVelZ = knockDir.z * knockForce;
  }
  // Hitstun — interrupt attack, brief stagger
  e.userData.hitstun = e.userData.isBoss ? 0.1 : 0.2;
  e.userData.isAttacking = false;
  if (e.userData.weapon) e.userData.weapon.rotation.x = 0;
  if (e.userData.dangerMat) e.userData.dangerMat.opacity = 0;

  // Scale bump on hit (squash & stretch)
  const origScale = e.scale.clone();
  e.scale.set(1.15, 0.85, 1.15);
  setTimeout(() => { if (e.userData.alive) e.scale.copy(origScale); }, 80);

  const pos = new THREE.Vector3();
  e.getWorldPosition(pos);
  pos.y += 2 * e.userData.scale;
  spawnDamageNumber(finalDamage, pos, isCrit, isCrit ? '' : cssClass);

  if (e.userData.hp <= 0) {
    killEnemy(e);
    // 1-5% loot drop
    if (Math.random() < 0.05) {
      spawnLootAtPosition(e.position.x, e.position.z);
    }
  }
}

function damagePlayer(amount, enemyPos) {
  if (!player.alive || player.iFrames > 0) return;

  // Parry check
  if (player.isParrying && player.parryTimer > 0) {
    player.parrySuccess = true;
    playSound('parry');
    player.isParrying = false;
    player.parryTimer = 0;
    player.iFrames = 0.3;
    // Parry flash — gold shield
    shieldMat.emissive.set(0xffdd00);
    shieldMat.emissiveIntensity = 3;
    setTimeout(() => { shield.visible = false; shieldMat.emissiveIntensity = 0; }, 300);
    // Show PARRY text
    const pPos = playerGroup.position.clone();
    pPos.y += 2.8;
    spawnDamageNumber('PARRY', pPos, false, 'parry');
    screenShake = 0.08;
    return;
  }

  playSound('playerHit');
  // No passive shield — damage goes straight to HP
  player.hp = Math.max(0, player.hp - amount);
  player.iFrames = 0.5;

  // Red vignette flash
  const vignette = document.getElementById('hit-vignette');
  vignette.style.opacity = '1';
  setTimeout(() => { vignette.style.opacity = '0'; }, 200);

  // Screen shake
  screenShake = 0.15;

  // Flash player body red
  bodyMat.emissive.set(0xff0000);
  bodyMat.emissiveIntensity = 1;
  setTimeout(() => {
    bodyMat.emissive.set(0x000000);
    bodyMat.emissiveIntensity = 0;
  }, 150);

  // Damage number on player
  const pPos = playerGroup.position.clone();
  pPos.y += 2.5;
  spawnDamageNumber(amount, pPos, false, 'player-hit');

  // Knockback away from enemy
  const knockDir = playerGroup.position.clone().sub(enemyPos);
  knockDir.y = 0;
  knockDir.normalize().multiplyScalar(2);
  playerGroup.position.add(knockDir);

  updatePlayerHpBar();

  if (player.hp <= 0) {
    playerDeath();
  }
}

function updatePlayerHpBar() {
  const pct = (player.hp / player.maxHp) * 100;
  const fill = document.getElementById('player-hp-fill');
  fill.style.width = pct + '%';
  if (pct < 30) fill.classList.add('low');
  else fill.classList.remove('low');
  document.getElementById('player-hp-label').textContent =
    `HP: ${player.hp} / ${player.maxHp}`;
}

function playerDeath() {
  player.alive = false;
  // Save run to leaderboard
  const lb = saveRun(killCount, waveNum);
  const best = lb[0];
  const isNewRecord = best && best.kills === killCount && best.wave === waveNum;

  const ds = document.getElementById('death-screen');
  document.getElementById('death-stats').textContent =
    `Kills: ${killCount} | Wave: ${waveNum}`;

  const recordEl = document.getElementById('death-record');
  if (isNewRecord && lb.length > 1) {
    recordEl.textContent = 'NEW RECORD!';
    recordEl.style.display = 'block';
  } else {
    recordEl.style.display = 'none';
  }

  renderLeaderboard(killCount, waveNum, true);
  ds.classList.add('show');
  document.exitPointerLock();
}

function respawnPlayer() {
  player.hp = player.maxHp;
  player.alive = true;
  player.iFrames = 2;
  player.velocityY = 0;
  player.grounded = true;
  player.jumpsLeft = 2;
  player.shieldHp = 0;
  player.shieldMaxHp = 0;
  player.lifesteal = 0;
  player.bonusDmg = 0;
  player.bonusHp = 0;
  player.maxHp = player.baseMaxHp;
  player.critBonus = 0;
  player.doubleStrike = 0;
  player.dashCdMod = 1;
  player.extraChains = 0;
  player.finisherBoost = false;
  playerGroup.position.set(0, 0, 0);
  updatePlayerHpBar();
  updateShieldBar();
  updateStatsDisplay();
  document.getElementById('death-screen').classList.remove('show');

  // Clear all enemies and loot
  enemies.forEach(e => scene.remove(e));
  enemies.length = 0;
  lootBoxes.forEach(lb => scene.remove(lb));
  lootBoxes.length = 0;
  waveNum = 1;
  killCount = 0;
  document.getElementById('kill-counter').textContent = `KILLS: 0 | WAVE: 1`;
  renderLeaderboard(0, 1, false);
  setTimeout(spawnWave, 500);
}

document.getElementById('respawn-btn').addEventListener('click', () => {
  respawnPlayer();
  renderer.domElement.requestPointerLock();
});

function killEnemy(e) {
  e.userData.alive = false;
  playSound('death');
  killCount++;
  document.getElementById('kill-counter').textContent = `KILLS: ${killCount} | WAVE: ${waveNum}`;

  const deathPos = e.position.clone();
  const eScale = e.userData.scale || 1;

  // ── Slash split — clone body into two halves ──
  const bodyMesh = e.userData.mesh;
  const bodyColor = bodyMesh.material.color.clone();

  // Top half flies up-right
  const topHalf = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5 * eScale, 0.5 * eScale, 6, 8),
    new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.3, roughness: 0.6 })
  );
  topHalf.position.copy(deathPos);
  topHalf.position.y += 1.8 * eScale;
  scene.add(topHalf);

  // Bottom half stays, tips over
  const botHalf = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5 * eScale, 0.5 * eScale, 6, 8),
    new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.3, roughness: 0.6 })
  );
  botHalf.position.copy(deathPos);
  botHalf.position.y += 0.8 * eScale;
  scene.add(botHalf);

  // Slash line between halves (bright flash)
  const slashLine = new THREE.Mesh(
    new THREE.PlaneGeometry(2 * eScale, 0.08),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, side: THREE.DoubleSide })
  );
  slashLine.position.copy(deathPos);
  slashLine.position.y += 1.3 * eScale;
  slashLine.rotation.y = Math.random() * Math.PI;
  slashLine.rotation.z = (Math.random() - 0.5) * 0.5;
  scene.add(slashLine);

  // Blood particles
  const bloodParticles = [];
  for (let i = 0; i < 12; i++) {
    const blood = new THREE.Mesh(
      new THREE.SphereGeometry(0.04 + Math.random() * 0.06, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xaa0000 })
    );
    blood.position.copy(deathPos);
    blood.position.y += 1.3 * eScale;
    blood.userData.vel = new THREE.Vector3(
      (Math.random() - 0.5) * 6,
      2 + Math.random() * 4,
      (Math.random() - 0.5) * 6
    );
    scene.add(blood);
    bloodParticles.push(blood);
  }

  // Blood puddle on ground (grows)
  const puddle = new THREE.Mesh(
    new THREE.CircleGeometry(0.1, 12),
    new THREE.MeshBasicMaterial({ color: 0x880000, transparent: true, opacity: 0.7 })
  );
  puddle.rotation.x = -Math.PI / 2;
  puddle.position.set(deathPos.x, 0.03, deathPos.z);
  scene.add(puddle);

  // Hide original enemy immediately
  e.visible = false;

  const deathStart = performance.now();
  const topVelX = (Math.random() - 0.5) * 3;
  const topVelZ = (Math.random() - 0.5) * 3;
  let topVelY = 4;

  function deathAnim() {
    const elapsed = (performance.now() - deathStart) / 1000; // seconds
    const dt16 = 0.016;

    if (elapsed < 2.5) {
      // ── Phase 1 (0-0.3s): flash + split ──
      if (elapsed < 0.3) {
        slashLine.material.opacity = 1 - elapsed / 0.3;
        const s = 1 + elapsed * 3;
        slashLine.scale.set(s, s, s);
      } else if (slashLine.parent) {
        scene.remove(slashLine);
        slashLine.geometry.dispose(); slashLine.material.dispose();
      }

      // ── Top half flies up then falls ──
      topVelY -= 12 * dt16;
      topHalf.position.x += topVelX * dt16;
      topHalf.position.y += topVelY * dt16;
      topHalf.position.z += topVelZ * dt16;
      topHalf.rotation.x += 3 * dt16;
      topHalf.rotation.z += 2 * dt16;
      if (topHalf.position.y < 0.3) topHalf.position.y = 0.3;

      // ── Bottom half tips over ──
      if (botHalf.rotation.x < 1.5) botHalf.rotation.x += 2 * dt16;
      botHalf.position.y = Math.max(0.3, botHalf.position.y - 1.5 * dt16);

      // ── Blood particles ──
      bloodParticles.forEach(b => {
        if (!b.parent) return;
        b.userData.vel.y -= 10 * dt16;
        b.position.x += b.userData.vel.x * dt16;
        b.position.y += b.userData.vel.y * dt16;
        b.position.z += b.userData.vel.z * dt16;
        if (b.position.y < 0.05) {
          b.position.y = 0.05;
          b.userData.vel.x *= 0.5;
          b.userData.vel.z *= 0.5;
          b.userData.vel.y = 0;
        }
      });

      // ── Puddle grows ──
      const puddleScale = Math.min(eScale * 1.5, elapsed * 3);
      puddle.scale.set(puddleScale, puddleScale, puddleScale);

      // ── Fade out after 1.5s ──
      if (elapsed > 1.5) {
        const fade = 1 - (elapsed - 1.5) / 1.0;
        topHalf.material.opacity = fade;
        topHalf.material.transparent = true;
        botHalf.material.opacity = fade;
        botHalf.material.transparent = true;
        puddle.material.opacity = fade * 0.7;
        bloodParticles.forEach(b => {
          if (b.parent) { b.material.opacity = fade; b.material.transparent = true; }
        });
      }

      requestAnimationFrame(deathAnim);
    } else {
      // ── Cleanup ──
      [topHalf, botHalf, puddle].forEach(m => {
        scene.remove(m);
        if (m.geometry) m.geometry.dispose();
        if (m.material) m.material.dispose();
      });
      bloodParticles.forEach(b => {
        scene.remove(b);
        b.geometry.dispose(); b.material.dispose();
      });
      scene.remove(e);
      const idx = enemies.indexOf(e);
      if (idx !== -1) enemies.splice(idx, 1);
      // Wave check
      const waveEnemiesLeft = enemies.filter(en => en.userData.alive && !en.userData.isElite).length;
      if (waveEnemiesLeft === 0) {
        waveNum++;
        // Small heal between waves (20%, not full)
        player.hp = Math.min(player.maxHp, player.hp + Math.round(player.maxHp * 0.2));
        updatePlayerHpBar();
        document.getElementById('kill-counter').textContent = `KILLS: ${killCount} | WAVE: ${waveNum}`;
        renderLeaderboard(killCount, waveNum, false);
        // Rare lootbox on wave clear (30%)
        if (Math.random() < 0.3) {
          spawnLootAtPosition(
            playerGroup.position.x + (Math.random() - 0.5) * 5,
            playerGroup.position.z + (Math.random() - 0.5) * 5
          );
        }
        setTimeout(spawnWave, 1500);
      }
    }
  }
  deathAnim();
}

// (Upgrade card system removed — upgrades from lootboxes only)

// (All active skills removed — combat is melee-only)

// ─── UI UPDATE ───
function updateTargetBar() {
  const bar = document.getElementById('target-bar');
  let closest = null;
  let closestDist = 20;
  enemies.forEach(e => {
    if (!e.userData.alive) return;
    const d = playerGroup.position.distanceTo(e.position);
    if (d < closestDist) { closestDist = d; closest = e; }
  });
  targetEnemy = closest;
  if (closest) {
    bar.classList.add('visible');
    if (closest.userData.isBoss) bar.classList.add('boss');
    else bar.classList.remove('boss');
    const pct = (closest.userData.hp / closest.userData.maxHp) * 100;
    document.getElementById('target-hp-fill').style.width = pct + '%';
    document.getElementById('target-name').textContent = closest.userData.name;
    document.getElementById('target-hp-text').textContent = `${closest.userData.hp} / ${closest.userData.maxHp}`;
  } else {
    bar.classList.remove('visible');
    bar.classList.remove('boss');
  }
}

function updateSkillBar() {
  // LMB slot
  updateSlotCD('slot-lmb', skills.lmb.timer, skills.lmb.cd);
  // Slam
  updateSlotCD('slot-slam', player.slamCd, SLAM_COOLDOWN);
  // Heavy
  updateSlotCD('slot-heavy', heavyCd, HEAVY_COOLDOWN);
  // Dash
  const dashTotalCd = DASH_COOLDOWN * (player.dashCdMod || 1);
  updateSlotCD('slot-dash', player.dashCd, dashTotalCd);
  // Parry
  updateSlotCD('slot-parry', player.parryCd, PARRY_COOLDOWN);
}
function updateSlotCD(id, timer, maxCd) {
  const slot = document.getElementById(id);
  if (!slot) return;
  const overlay = slot.querySelector('.cooldown-overlay');
  const cdText = slot.querySelector('.cooldown-text');
  if (timer > 0) {
    overlay.style.height = (timer / maxCd) * 100 + '%';
    cdText.textContent = Math.ceil(timer);
    slot.classList.add('on-cd');
    slot.classList.remove('ready');
  } else {
    overlay.style.height = '0%';
    cdText.textContent = '';
    slot.classList.remove('on-cd');
    slot.classList.add('ready');
  }
}

// ─── CONTROLS ───
document.addEventListener('click', () => {
  if (!pointerLocked) renderer.domElement.requestPointerLock();
});
document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === renderer.domElement;
});
document.addEventListener('mousemove', (e) => {
  if (!pointerLocked) return;
  yaw -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch));
});
document.addEventListener('mousedown', (e) => {
  if (!pointerLocked || !player.alive) return;
  if (e.button === 0) {
    // Ground Slam — LMB while airborne
    if (!player.grounded && player.slamCd <= 0 && !player.isSlamming) {
      player.isSlamming = true;
      player.velocityY = -30;
      return;
    }
    // Combo slash
    if (!isAttacking && !isHeavyAttacking && skills.lmb.timer <= 0) {
      isAttacking = true;
      attackTime = 0;
      hitRegistered = false;
      if (comboResetTimer > 0 && comboCount < 2) {
        comboCount++;
      } else {
        comboCount = 0;
      }
      comboResetTimer = COMBO_WINDOW + COMBO_SPEEDS[comboCount];
      skills.lmb.timer = 0.1; // small buffer between clicks
    }
  }
  // RMB — Heavy attack
  if (e.button === 2) {
    e.preventDefault();
    if (!isAttacking && !isHeavyAttacking && heavyCd <= 0) {
      isHeavyAttacking = true;
      heavyAttackTime = 0;
      heavyHitRegistered = false;
      heavyCd = HEAVY_COOLDOWN;
    }
  }
});
// Prevent context menu on RMB
renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (!pointerLocked || !player.alive) return;
  // Pause
  if (e.code === 'Escape') { togglePause(); return; }
  if (isPaused) return;
  // Jump / double jump
  if (e.code === 'Space') {
    if (player.jumpsLeft > 0) {
      player.velocityY = JUMP_FORCE;
      player.grounded = false;
      player.jumpsLeft--;
    }
  }
  // Dash (Shift)
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    if (!player.isDashing && player.dashCd <= 0) {
      player.isDashing = true;
      player.dashTimer = DASH_DURATION;
      player.dashCd = DASH_COOLDOWN * (player.dashCdMod || 1);
      player.iFrames = Math.max(player.iFrames, DASH_DURATION);
      // Dash in movement direction or forward
      const fw = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const rt = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const dashDir = new THREE.Vector3();
      if (keys['KeyW']) dashDir.add(fw);
      if (keys['KeyS']) dashDir.sub(fw);
      if (keys['KeyA']) dashDir.sub(rt);
      if (keys['KeyD']) dashDir.add(rt);
      if (dashDir.length() < 0.1) dashDir.copy(fw); // default forward
      dashDir.normalize();
      player.dashDirX = dashDir.x;
      player.dashDirZ = dashDir.z;
    }
  }
  // Parry (F)
  if (e.code === 'KeyF') {
    if (!player.isParrying && player.parryCd <= 0) {
      player.isParrying = true;
      player.parryTimer = player.parryWindow;
      player.parryCd = PARRY_COOLDOWN;
      player.parrySuccess = false;
      shield.visible = true;
      shieldMat.emissive.set(0x4488ff);
      shieldMat.emissiveIntensity = 1;
    }
  }
});
document.addEventListener('keyup', (e) => { keys[e.code] = false; });

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── GAME LOOP ───
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  if (!player.alive || isPaused) {
    renderer.render(scene, camera);
    return;
  }

  // ── Player iFrames ──
  if (player.iFrames > 0) {
    player.iFrames -= dt;
    // Blink effect
    body.visible = Math.floor(player.iFrames * 15) % 2 === 0;
  } else {
    body.visible = true;
  }

  // ── Dash ──
  player.dashCd -= dt;
  if (player.isDashing) {
    player.dashTimer -= dt;
    playerGroup.position.x += player.dashDirX * DASH_SPEED * dt;
    playerGroup.position.z += player.dashDirZ * DASH_SPEED * dt;
    // Dash animation — body tilts horizontal
    body.rotation.x = -1.3;
    body.position.z = -0.4;
    head.rotation.x = 0.8;
    skirt.rotation.x = Math.PI + 0.5;
    // Spawn trail ghost
    if (Math.random() < 0.5) {
      const ghost = new THREE.Mesh(bodyGeo, dashGhostMat.clone());
      ghost.position.copy(playerGroup.position);
      ghost.position.y += 1.5;
      ghost.rotation.y = yaw;
      scene.add(ghost);
      const gStart = performance.now();
      function fadeGhost() {
        const gt = (performance.now() - gStart) / 300;
        if (gt >= 1) { scene.remove(ghost); ghost.material.dispose(); return; }
        ghost.material.opacity = 0.3 * (1 - gt);
        requestAnimationFrame(fadeGhost);
      }
      fadeGhost();
    }
    if (player.dashTimer <= 0) {
      player.isDashing = false;
      body.rotation.x = 0; body.position.z = 0;
      head.rotation.x = 0;
      skirt.rotation.x = Math.PI;
    }
  }

  // ── Parry timer ──
  player.parryCd -= dt;
  if (player.isParrying) {
    player.parryTimer -= dt;
    if (player.parryTimer <= 0) {
      player.isParrying = false;
      shield.visible = false;
      shieldMat.emissiveIntensity = 0;
    }
  }

  // ── Movement ──
  const speed = player.isDashing ? 0 : 8; // no manual move during dash
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  let isMoving = false;

  if (!player.isDashing) {
    if (keys['KeyW']) { playerGroup.position.addScaledVector(forward, speed * dt); isMoving = true; }
    if (keys['KeyS']) { playerGroup.position.addScaledVector(forward, -speed * dt); isMoving = true; }
    if (keys['KeyA']) { playerGroup.position.addScaledVector(right, -speed * dt); isMoving = true; }
    if (keys['KeyD']) { playerGroup.position.addScaledVector(right, speed * dt); isMoving = true; }
  }

  // ── Leg animation ──
  if (isMoving && player.grounded) {
    const legSwing = Math.sin(Date.now() * 0.01) * 0.6;
    leftLeg.rotation.x = legSwing;
    rightLeg.rotation.x = -legSwing;
  } else if (!player.grounded) {
    // In air — legs tucked
    leftLeg.rotation.x = -0.4;
    rightLeg.rotation.x = -0.2;
  } else {
    // Idle
    leftLeg.rotation.x *= 0.85;
    rightLeg.rotation.x *= 0.85;
  }

  // ── Jump physics ──
  player.velocityY += GRAVITY * dt;
  playerGroup.position.y += player.velocityY * dt;

  // Platform collision
  let onPlatform = false;
  if (player.velocityY <= 0) {
    for (const p of platforms) {
      const dx = Math.abs(playerGroup.position.x - p.x);
      const dz = Math.abs(playerGroup.position.z - p.z);
      if (dx < p.hw && dz < p.hd && playerGroup.position.y <= p.y && playerGroup.position.y > p.y - 2) {
        playerGroup.position.y = p.y;
        player.velocityY = 0;
        player.grounded = true;
        player.jumpsLeft = 2;
        onPlatform = true;
        break;
      }
    }
    // Ramp collision — walk up/down slopes
    if (!onPlatform) {
      for (const r of ramps) {
        const rdx = r.x2 - r.x1, rdz = r.z2 - r.z1;
        const rLen = r.horizLen;
        // Project player pos onto ramp line
        const px = playerGroup.position.x - r.x1, pz = playerGroup.position.z - r.z1;
        const t = (px * rdx + pz * rdz) / (rLen * rLen);
        if (t < -0.05 || t > 1.05) continue;
        // Perpendicular distance
        const projX = r.x1 + rdx * t, projZ = r.z1 + rdz * t;
        const perpDist = Math.sqrt((playerGroup.position.x - projX) ** 2 + (playerGroup.position.z - projZ) ** 2);
        if (perpDist > r.width) continue;
        // Ramp height at this t
        const rampY = r.y1 + (r.y2 - r.y1) * t;
        if (playerGroup.position.y <= rampY + 0.3 && playerGroup.position.y > rampY - 1.5) {
          playerGroup.position.y = rampY;
          player.velocityY = 0;
          player.grounded = true;
          player.jumpsLeft = 2;
          onPlatform = true;
          break;
        }
      }
    }
  }

  player.slamCd -= dt;
  if (playerGroup.position.y <= 0) {
    playerGroup.position.y = 0;
    player.velocityY = 0;
    player.grounded = true;
    player.jumpsLeft = 2;

    // Ground Slam impact
    if (player.isSlamming) {
      player.isSlamming = false;
      player.slamCd = SLAM_COOLDOWN;
      playSound('slam');
      screenShake = 0.2;
      // VFX — shockwave ring + ground crack
      const slamPos = playerGroup.position.clone();
      const slamRing = new THREE.Mesh(
        new THREE.RingGeometry(0.3, SLAM_RANGE, 32),
        new THREE.MeshBasicMaterial({ color: 0xff8800, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
      );
      slamRing.position.copy(slamPos); slamRing.position.y = 0.15;
      slamRing.rotation.x = -Math.PI / 2;
      slamRing.scale.set(0.01, 0.01, 0.01);
      scene.add(slamRing);
      vfxObjects.push({ mesh: slamRing, timer: 0, duration: 0.8, type: 'ring', targetScale: 1 });
      // Ground debris
      for (let i = 0; i < 15; i++) {
        const chunk = new THREE.Mesh(
          new THREE.BoxGeometry(0.2 + Math.random() * 0.3, 0.2, 0.2 + Math.random() * 0.3),
          new THREE.MeshStandardMaterial({ color: 0x3a3a2e, roughness: 0.9 })
        );
        chunk.position.copy(slamPos);
        chunk.position.y = 0.2;
        scene.add(chunk);
        const cDir = new THREE.Vector3((Math.random() - 0.5), 0.5 + Math.random() * 0.5, (Math.random() - 0.5)).normalize();
        vfxObjects.push({ mesh: chunk, timer: 0, duration: 1.0, type: 'particle', dir: cDir, speed: 5 + Math.random() * 8 });
      }
      // Damage all enemies in range
      enemies.forEach(e => {
        if (!e.userData.alive) return;
        const d = slamPos.distanceTo(e.position);
        if (d < SLAM_RANGE) {
          const slD = getSlamDmg();
          damageEnemy(e, slD.min, slD.max, 3, 'skill-slam');
        }
      });
      // Show slam text
      const textPos = slamPos.clone(); textPos.y += 2;
      spawnDamageNumber('SLAM!', textPos, false, 'skill-slam');
    }
  }

  // ── Clamp to arena ──
  clampToArena(playerGroup.position);

  playerGroup.rotation.y = yaw;

  // ── Camera follow ──
  const camOffset = new THREE.Vector3(0, 3, 5);
  camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const desiredCamPos = playerGroup.position.clone().add(camOffset);

  // Screen shake
  if (screenShake > 0) {
    screenShake -= dt;
    const shakeAmt = screenShake * 8;
    desiredCamPos.x += (Math.random() - 0.5) * shakeAmt;
    desiredCamPos.y += (Math.random() - 0.5) * shakeAmt;
    desiredCamPos.z += (Math.random() - 0.5) * shakeAmt;
  }

  camera.position.lerp(desiredCamPos, 0.1);
  const lookTarget = playerGroup.position.clone();
  lookTarget.y += 1.5;
  camera.lookAt(lookTarget);

  // ── Skill cooldowns ──
  for (const skill of Object.values(skills)) {
    if (skill.timer > 0) skill.timer -= dt;
  }

  // ── Combo timer ──
  comboResetTimer -= dt;
  if (comboResetTimer <= 0 && !isAttacking) comboCount = 0;
  heavyCd -= dt;

  // ── Melee combo attack ──
  if (isAttacking) {
    const comboDur = COMBO_SPEEDS[comboCount];
    attackTime += dt;
    const t = attackTime / comboDur;
    const combo = getComboScaled()[comboCount];

    // Different swing per combo hit
    if (comboCount === 0) {
      // Hit 1: horizontal right-to-left slash
      if (t < 0.2) { const wu = t / 0.2; swordGroup.rotation.z = wu * 0.8; swordGroup.rotation.x = wu * 0.3; }
      else if (t < 0.5) { const sl = (t - 0.2) / 0.3; swordGroup.rotation.z = 0.8 - sl * 2.8; edgeGlow.material.opacity = 0.8; }
      else { const ft = (t - 0.5) / 0.5; swordGroup.rotation.z = -2.0 + ft * 2.0; edgeGlow.material.opacity = (1 - ft) * 0.4; }
    } else if (comboCount === 1) {
      // Hit 2: reverse slash left-to-right, faster
      if (t < 0.15) { const wu = t / 0.15; swordGroup.rotation.z = -wu * 0.6; swordGroup.rotation.y = wu * 0.3; }
      else if (t < 0.45) { const sl = (t - 0.15) / 0.3; swordGroup.rotation.z = -0.6 + sl * 2.6; edgeGlow.material.opacity = 0.9; edgeGlow.material.color.set(0xbbddff); }
      else { const ft = (t - 0.45) / 0.55; swordGroup.rotation.z = 2.0 - ft * 2.0; swordGroup.rotation.y = 0.3 - ft * 0.3; edgeGlow.material.opacity = (1 - ft) * 0.4; }
    } else {
      // Hit 3: FINISHER — overhead slam, big wind-up
      if (t < 0.3) { const wu = t / 0.3; swordGroup.rotation.x = wu * 2.0; swordGroup.position.y = 1.5 + wu * 0.3; edgeGlow.material.color.set(0xffaa44); }
      else if (t < 0.55) { const sl = (t - 0.3) / 0.25; swordGroup.rotation.x = 2.0 - sl * 4.5; swordGroup.position.y = 1.8 - sl * 0.5; edgeGlow.material.opacity = 1.0; }
      else { const ft = (t - 0.55) / 0.45; swordGroup.rotation.x = -2.5 + ft * 2.5; swordGroup.position.y = 1.3 + ft * 0.2; edgeGlow.material.opacity = (1 - ft) * 0.4; }
    }

    // Slash arc VFX — big visible arcs
    if (t >= 0.2 && t < 0.45) {
      const arcPhase = (t - 0.2) / 0.25;
      if (arcPhase < 0.1 || Math.random() < 0.4) {
        const isFinisher = comboCount === 2;
        const arcW = isFinisher ? 3.5 : 2.5;
        const arcH = isFinisher ? 0.15 : 0.1;
        const arcColor = isFinisher ? 0xffaa44 : comboCount === 1 ? 0xaaddff : 0x88bbff;
        // Crescent slash arc
        const arcGeo = new THREE.RingGeometry(arcW * 0.3, arcW * 0.5, 16, 1, 0, Math.PI * 0.8);
        const arcMesh = new THREE.Mesh(arcGeo, new THREE.MeshBasicMaterial({
          color: arcColor, transparent: true, opacity: 0.7, side: THREE.DoubleSide,
        }));
        arcMesh.position.copy(playerGroup.position);
        arcMesh.position.y += 1.5;
        // Orient FORWARD from player
        const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
        arcMesh.position.addScaledVector(fwd, 1.0);
        if (comboCount === 0) { arcMesh.rotation.y = yaw + Math.PI / 2; arcMesh.rotation.x = Math.PI / 2; }
        else if (comboCount === 1) { arcMesh.rotation.y = yaw - Math.PI / 2; arcMesh.rotation.x = Math.PI / 2; }
        else { arcMesh.rotation.y = yaw; arcMesh.rotation.x = Math.PI / 2; }
        scene.add(arcMesh);
        vfxObjects.push({ mesh: arcMesh, timer: 0, duration: 0.25, type: 'fadeOut' });
      }
    }

    // Hit registration
    if (t >= 0.35 && !hitRegistered) {
      hitRegistered = true;
      playSound('slash');
      if (comboCount === 2) {
        // Finisher hits all in range (small AoE)
        enemies.forEach(e => {
          if (!e.userData.alive) return;
          const d = playerGroup.position.distanceTo(e.position);
          if (d < combo.range) {
            damageEnemy(e, combo.min, combo.max, combo.critMult, 'combo-finisher');
          }
        });
        screenShake = 0.08;
      } else {
        // Single target
        let closest = null;
        let closestDist = combo.range;
        enemies.forEach(e => {
          if (!e.userData.alive) return;
          const d = playerGroup.position.distanceTo(e.position);
          if (d < closestDist) { closestDist = d; closest = e; }
        });
        if (closest) damageEnemy(closest, combo.min, combo.max, combo.critMult, '');
      }
    }
    if (t >= 1) {
      isAttacking = false;
      swordGroup.rotation.set(0, 0, 0);
      swordGroup.position.set(0.5, 1.5, -0.3);
      edgeGlow.material.opacity = 0.4;
      edgeGlow.material.color.set(0x88bbff);
    }
  }

  // ── Heavy attack (RMB) — spin slash AoE ──
  if (isHeavyAttacking) {
    heavyAttackTime += dt;
    const t = heavyAttackTime / HEAVY_DURATION;

    // Full 360 spin with sword out
    if (t < 0.25) {
      // Wind-up: extend sword, charge glow
      const wu = t / 0.25;
      swordGroup.position.x = 0.5 + wu * 0.3;
      edgeGlow.material.opacity = wu;
      edgeGlow.material.color.set(0xff6644);
    } else if (t < 0.75) {
      // Spin! 360 degrees
      const sp = (t - 0.25) / 0.5;
      playerGroup.rotation.y = yaw + sp * Math.PI * 2;
      swordGroup.rotation.z = -0.5;
      edgeGlow.material.opacity = 1.0;
      // Spawn circular trail
      if (Math.random() < 0.8) {
        const trail = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.08), trailMat.clone());
        trail.material.opacity = 0.7;
        trail.material.color.set(0xff6644);
        const wp = new THREE.Vector3(); swordBlade.getWorldPosition(wp);
        trail.position.copy(wp);
        trail.rotation.y = yaw + sp * Math.PI * 2;
        scene.add(trail);
        vfxObjects.push({ mesh: trail, timer: 0, duration: 0.3, type: 'fadeOut' });
      }
    } else {
      // Follow through
      const ft = (t - 0.75) / 0.25;
      playerGroup.rotation.y = yaw;
      swordGroup.rotation.z = -0.5 + ft * 0.5;
      edgeGlow.material.opacity = (1 - ft) * 0.5;
    }

    // Hit at midpoint of spin
    if (t >= 0.45 && !heavyHitRegistered) {
      heavyHitRegistered = true;
      playSound('heavy');
      const pPos = playerGroup.position;
      enemies.forEach(e => {
        if (!e.userData.alive) return;
        const d = pPos.distanceTo(e.position);
        if (d < HEAVY_RANGE) {
          const hd = getHeavyDmg();
          damageEnemy(e, hd.min, hd.max, 3.0, 'skill-heavy');
          // JUGGLE — launch enemy upward (DMC style)
          if (!e.userData.isBoss) {
            e.userData.juggleVelY = 8 + Math.random() * 4;
            e.userData.isJuggled = true;
            e.userData.hitstun = 1.0; // long stun while airborne
          }
        }
      });
      screenShake = 0.12;
      // Ground ring VFX
      const hRing = new THREE.Mesh(
        new THREE.RingGeometry(0.3, HEAVY_RANGE, 32),
        new THREE.MeshBasicMaterial({ color: 0xff4422, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
      );
      hRing.position.copy(pPos); hRing.position.y = 0.1;
      hRing.rotation.x = -Math.PI / 2;
      scene.add(hRing);
      vfxObjects.push({ mesh: hRing, timer: 0, duration: 0.5, type: 'fadeOut' });
    }

    if (t >= 1) {
      isHeavyAttacking = false;
      playerGroup.rotation.y = yaw;
      swordGroup.rotation.set(0, 0, 0);
      swordGroup.position.set(0.5, 1.5, -0.3);
      edgeGlow.material.opacity = 0.4;
      edgeGlow.material.color.set(0x88bbff);
    }
  }

  // ── Enemy-to-enemy collision separation ──
  for (let i = 0; i < enemies.length; i++) {
    const a = enemies[i];
    if (!a.userData.alive) continue;
    const radiusA = a.userData.scale * 0.8;
    for (let j = i + 1; j < enemies.length; j++) {
      const b = enemies[j];
      if (!b.userData.alive) continue;
      const radiusB = b.userData.scale * 0.8;
      const minDist = radiusA + radiusB;
      const dx = a.position.x - b.position.x;
      const dz = a.position.z - b.position.z;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d < minDist && d > 0.01) {
        const overlap = (minDist - d) * 0.5;
        const nx = dx / d;
        const nz = dz / d;
        a.position.x += nx * overlap;
        a.position.z += nz * overlap;
        b.position.x -= nx * overlap;
        b.position.z -= nz * overlap;
      }
    }
  }

  // ── Enemy AI ──
  enemies.forEach(e => {
    if (!e.userData.alive) return;

    const toPlayer = playerGroup.position.clone().sub(e.position);
    toPlayer.y = 0;
    const dist = toPlayer.length();

    // Movement AI by type
    if (e.userData.enemyType === 'ranged') {
      // Ranged: keep distance 8-12, retreat if too close
      if (dist < 7) {
        toPlayer.normalize();
        e.position.addScaledVector(toPlayer, -e.userData.speed * dt * 1.5); // run away
      } else if (dist > 13) {
        toPlayer.normalize();
        e.position.addScaledVector(toPlayer, e.userData.speed * dt);
      } else {
        // Strafe sideways
        const strafe = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x).normalize();
        e.position.addScaledVector(strafe, e.userData.speed * dt * (Math.sin(Date.now() * 0.002 + (e.userData.eid || 0)) > 0 ? 1 : -1));
      }
    } else if (e.userData.enemyType === 'fast') {
      // Fast: zigzag approach
      if (dist > e.userData.attackRange) {
        toPlayer.normalize();
        const zigzag = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x);
        zigzag.multiplyScalar(Math.sin(Date.now() * 0.005 + e.id * 10) * 0.5);
        toPlayer.add(zigzag).normalize();
        e.position.addScaledVector(toPlayer, e.userData.speed * dt);
      }
    } else {
      // Melee: straight chase
      if (dist > e.userData.attackRange) {
        toPlayer.normalize();
        e.position.addScaledVector(toPlayer, e.userData.speed * dt);
      }
    }
    e.lookAt(playerGroup.position.x, e.position.y, playerGroup.position.z);
    clampToArena(e.position);

    // Hitstun — skip AI while stunned
    if (e.userData.hitstun > 0) {
      e.userData.hitstun -= dt;
      // Knockback slide
      if (e.userData.knockVelX) {
        e.position.x += e.userData.knockVelX * dt;
        e.position.z += e.userData.knockVelZ * dt;
        e.userData.knockVelX *= 0.9;
        e.userData.knockVelZ *= 0.9;
      }
      // Juggle physics
      if (e.userData.isJuggled) {
        e.userData.juggleVelY -= 15 * dt; // gravity
        e.position.y += e.userData.juggleVelY * dt;
        e.rotation.x += dt * 3; // spin while airborne
        if (e.position.y <= 0) {
          e.position.y = 0;
          e.userData.isJuggled = false;
          e.userData.juggleVelY = 0;
          e.rotation.x = 0;
        }
      }
      return;
    }

    // Attack
    e.userData.attackCd -= dt;
    const inAttackRange = e.userData.enemyType === 'ranged' ? dist < 15 : dist <= e.userData.attackRange;
    if (inAttackRange && e.userData.attackCd <= 0) {
      // Ranged: fire projectile instead
      if (e.userData.enemyType === 'ranged') {
        e.userData.attackCd = e.userData.attackRate;
        const projDir = playerGroup.position.clone().sub(e.position);
        projDir.y = 0; projDir.normalize();
        const proj = new THREE.Mesh(
          window._projGeo || new THREE.SphereGeometry(0.2, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xff44aa, transparent: true, opacity: 0.9 })
        );
        proj.position.copy(e.position);
        proj.position.y += 1.5 * (e.userData.scale || 1);
        const projLight = new THREE.PointLight(0xff44aa, 0.5, 4);
        proj.add(projLight);
        scene.add(proj);
        // Track projectile
        if (!window._projectiles) { window._projectiles = []; window._projGeo = new THREE.SphereGeometry(0.2, 6, 6); }
        playSound('projectile');
        window._projectiles.push({
          mesh: proj, dir: projDir, speed: 8, damage: e.userData.damage,
          timer: 0, maxTime: 4,
        });
        return; // skip melee attack
      }
      e.userData.isAttacking = true;
      e.userData.attackTimer = 0;
      e.userData.attackHit = false;
      e.userData.attackCd = e.userData.attackRate;
      // Spawn danger zone indicator
      if (!e.userData.dangerZone) {
        const dzGeo = new THREE.RingGeometry(0.2, e.userData.attackRange + 0.3, 24);
        const dzMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0 });
        const dz = new THREE.Mesh(dzGeo, dzMat);
        dz.rotation.x = -Math.PI / 2;
        dz.position.y = 0.08;
        e.add(dz);
        e.userData.dangerZone = dz;
        e.userData.dangerMat = dzMat;
      }
    }

    // Attack animation — big readable swing
    if (e.userData.isAttacking) {
      e.userData.attackTimer += dt;
      const aDur = 0.5; // slower = more readable
      const at = e.userData.attackTimer / aDur;

      // Ground danger zone
      if (e.userData.dangerMat) {
        if (at < 0.4) {
          e.userData.dangerMat.opacity = (at / 0.4) * 0.35;
          e.userData.dangerMat.color.set(0xff2200);
        } else {
          e.userData.dangerMat.opacity = Math.max(0, (1 - (at - 0.4) / 0.6) * 0.25);
        }
      }

      // Weapon arm animation
      if (e.userData.weapon) {
        if (at < 0.4) {
          const wu = at / 0.4;
          e.userData.weapon.rotation.x = wu * 1.8;
          // Weapon glows red during wind-up
          e.userData.weapon.traverse(c => {
            if (c.material && c.material.emissive) {
              c.material.emissive.set(0xff2200);
              c.material.emissiveIntensity = wu * 0.8;
            }
          });
        } else {
          const sw = (at - 0.4) / 0.6;
          e.userData.weapon.rotation.x = 1.8 - sw * 3.5;
          // Swing arc VFX at hit moment
          if (at >= 0.5 && at < 0.55) {
            const eScale = e.userData.scale || 1;
            const swingArc = new THREE.Mesh(
              new THREE.RingGeometry(0.5 * eScale, (e.userData.attackRange + 0.3) * 0.6, 12, 1, 0, Math.PI * 0.6),
              new THREE.MeshBasicMaterial({ color: 0xff4422, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
            );
            swingArc.position.copy(e.position);
            swingArc.position.y += 1.2 * eScale;
            swingArc.lookAt(playerGroup.position.x, swingArc.position.y, playerGroup.position.z);
            scene.add(swingArc);
            vfxObjects.push({ mesh: swingArc, timer: 0, duration: 0.2, type: 'fadeOut' });
          }
        }
      }

      // Deal damage at peak of swing
      if (at >= 0.55 && !e.userData.attackHit) {
        e.userData.attackHit = true;
        const hitDist = playerGroup.position.distanceTo(e.position);
        const heightDiff = Math.abs(playerGroup.position.y - e.position.y);
        if (hitDist <= e.userData.attackRange + 0.3 && heightDiff < 2.5) {
          damagePlayer(e.userData.damage, e.position);
        }
      }

      if (at >= 1) {
        e.userData.isAttacking = false;
        if (e.userData.weapon) {
          e.userData.weapon.rotation.x = 0;
          e.userData.weapon.traverse(c => {
            if (c.material && c.material.emissive) {
              c.material.emissive.set(0x000000);
              c.material.emissiveIntensity = 0;
            }
          });
        }
        if (e.userData.dangerMat) e.userData.dangerMat.opacity = 0;
      }
    }

    // Idle bob / float
    if (e.userData.mesh) {
      const bobBase = e.userData.floats ? 0.6 : 0; // mages float
      e.userData.mesh.position.y = 1.3 * e.userData.scale +
        Math.sin(Date.now() * 0.003 + (e.userData.eid || 0)) * (e.userData.floats ? 0.25 : 0.1);
      if (e.userData.floats && !e.userData.isJuggled) {
        e.position.y = bobBase + Math.sin(Date.now() * 0.002 + (e.userData.eid || 0)) * 0.15;
      }
    }
  });

  // Projectiles (ranged enemies)
  if (window._projectiles) {
    for (let i = window._projectiles.length - 1; i >= 0; i--) {
      const p = window._projectiles[i];
      p.timer += dt;
      p.mesh.position.x += p.dir.x * p.speed * dt;
      p.mesh.position.z += p.dir.z * p.speed * dt;
      // Bob up/down
      p.mesh.position.y += Math.sin(p.timer * 8) * 0.02;
      // Hit player?
      const pDist = playerGroup.position.distanceTo(p.mesh.position);
      const heightDiff = Math.abs(playerGroup.position.y - p.mesh.position.y + 1.5);
      if (pDist < 1.2 && heightDiff < 2) {
        damagePlayer(p.damage, p.mesh.position);
        scene.remove(p.mesh);
        p.mesh.material.dispose(); // geometry shared, don't dispose
        window._projectiles.splice(i, 1);
        continue;
      }
      // Timeout or out of arena
      if (p.timer > p.maxTime || p.mesh.position.length() > ARENA_RADIUS + 5) {
        scene.remove(p.mesh);
        p.mesh.material.dispose();
        window._projectiles.splice(i, 1);
      }
    }
  }

  // Caves
  updateCaves();

  // Loot boxes
  updateLootBoxes(dt);

  // VFX
  updateVFX(dt);

  // UI
  updateTargetBar();
  updateSkillBar();

  renderer.render(scene, camera);
}

updatePlayerHpBar();
animate();
