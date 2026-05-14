// ── TYPEWRITER ────────────────────────────────────────────
(function typewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    'CS Undergraduate',
    'Problem Solver',
    'AI/ML Enthusiast',
    'Competitive Programmer',
    'Full-Stack Developer',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
})();

// ── ANTIGRAVITY-STYLE PARTICLE FIELD ─────────────────────
// Matches antigravity.google: small blue dash particles
// scattered across a light background, drifting in 3D space
// with mouse-parallax depth.
(function antigravityParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer ──────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Scene / Camera ────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300);
  camera.position.z = 50;

  // ── Color palette — matches site palette (indigo, cyan, violet) ──
  // Antigravity uses a single monochromatic blue; we adapt to
  // the site's indigo/cyan scheme while keeping it subtle
  const COLORS = [
    new THREE.Color(0x4F6ADB),  // indigo-blue (primary)
    new THREE.Color(0x6366F1),  // violet
    new THREE.Color(0x0891B2),  // cyan
    new THREE.Color(0x818CF8),  // light indigo
    new THREE.Color(0x38BDF8),  // sky
  ];

  // ── Build particles ───────────────────────────────────
  const COUNT = 500;

  // Geometry: flat elongated rectangle (dash), matching antigravity
  const GEO = new THREE.BoxGeometry(0.7, 0.18, 0.05);

  const rand = (a, b) => a + Math.random() * (b - a);

  // We scatter particles in a large sphere-ish volume,
  // denser toward edges (inverse of uniform — bias to perimeter)
  const particles = [];

  for (let i = 0; i < COUNT; i++) {
    // Biased distribution: more particles near edges using cube-root sampling
    const r   = Math.cbrt(Math.random()) * 55;      // cube-root biases outward
    const theta = rand(0, Math.PI * 2);
    const phi   = Math.acos(rand(-1, 1));

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = rand(-30, 10);

    const col = COLORS[Math.floor(Math.random() * COLORS.length)].clone();
    // Vary opacity per particle via color alpha trick using material
    const opacity = rand(0.25, 0.75);

    const mat = new THREE.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity,
    });
    const mesh = new THREE.Mesh(GEO, mat);

    mesh.position.set(x, y, z);
    mesh.rotation.set(
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2)
    );

    scene.add(mesh);

    particles.push({
      mesh,
      // Lively drift — antigravity feel with visible motion
      vx: rand(-0.016, 0.016),
      vy: rand(-0.012, 0.012),
      vz: rand(-0.008, 0.008),
      // Medium tumble speed
      rx: rand(0.004, 0.014),
      ry: rand(0.003, 0.012),
      rz: rand(0.002, 0.008),
      // Phase for sinusoidal bob
      phase: rand(0, Math.PI * 2),
      baseX: x,
      baseY: y,
    });
  }

  // ── Mouse parallax ────────────────────────────────────
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  window.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 18;
    targetY = (e.clientY / window.innerHeight - 0.5) * 12;
  });

  // ── Resize handler ────────────────────────────────────
  function resize() {
    const w = canvas.parentElement.offsetWidth  || window.innerWidth;
    const h = canvas.parentElement.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Animation loop ────────────────────────────────────
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.014;

    // Smooth camera parallax — matches antigravity.google feel
    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;
    camera.position.x = currentX;
    camera.position.y = -currentY;
    camera.lookAt(0, 0, 0);

    // Update each particle
    particles.forEach(p => {
      const m = p.mesh;

      // Lively sinusoidal float (anti-gravity feel)
      m.position.x = p.baseX + Math.sin(t + p.phase) * 2.2 + p.vx * t * 60;
      m.position.y = p.baseY + Math.cos(t * 0.7 + p.phase) * 1.6 + p.vy * t * 60;
      m.position.z += p.vz;

      // Slow tumble
      m.rotation.x += p.rx;
      m.rotation.y += p.ry;
      m.rotation.z += p.rz;

      // Wrap z depth
      if (m.position.z > 20)  m.position.z = -30;
      if (m.position.z < -30) m.position.z =  20;
    });

    renderer.render(scene, camera);
  }
  animate();
})();
