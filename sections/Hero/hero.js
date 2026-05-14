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

// ── 3D CONFETTI PARTICLE SYSTEM ───────────────────────────
(function confetti3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Renderer ──────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // ── Scene / Camera ────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.z = 30;

  // ── Palette – matches reference: violet, indigo, cyan, rose, amber, sky ──
  const COLORS = [
    0x6366F1,  // indigo / violet
    0x8B5CF6,  // purple
    0x06B6D4,  // cyan
    0xF43F5E,  // rose / red
    0xF59E0B,  // amber / yellow
    0xEC4899,  // pink
    0x3B82F6,  // blue
    0x10B981,  // emerald
  ];

  // ── Particle data ─────────────────────────────────────
  const COUNT = 260;
  const particles = [];

  // Reusable box geometry (pill-like flat rect)
  const GEO = new THREE.BoxGeometry(0.55, 0.22, 0.06);

  function rand(min, max) { return min + Math.random() * (max - min); }

  for (let i = 0; i < COUNT; i++) {
    const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    const mat    = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: rand(0.55, 0.9) });
    const mesh   = new THREE.Mesh(GEO, mat);

    // Scatter across a wide volume in front of camera
    mesh.position.set(rand(-38, 38), rand(-22, 22), rand(-18, 12));
    mesh.rotation.set(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2));

    // Per-particle motion
    const p = {
      mesh,
      vy:   rand(-0.018, -0.006),       // drift downward
      vx:   rand(-0.008,  0.008),       // slight horizontal drift
      vz:   rand(-0.004,  0.004),       // depth oscillation
      rx:   rand(0.005,  0.022),        // tumble speed X
      ry:   rand(0.005,  0.018),        // tumble speed Y
      rz:   rand(0.003,  0.012),        // tumble speed Z
      resetY: rand(-22, -16),           // where to reset when fallen below
    };

    scene.add(mesh);
    particles.push(p);
  }

  // ── Mouse parallax ────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize ────────────────────────────────────────────
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
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    // Subtle camera parallax from mouse
    camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    particles.forEach(p => {
      const m = p.mesh;

      // Drift
      m.position.y += p.vy;
      m.position.x += p.vx;
      m.position.z += Math.sin(frame * 0.01 + m.position.x) * 0.005;

      // Tumble
      m.rotation.x += p.rx;
      m.rotation.y += p.ry;
      m.rotation.z += p.rz;

      // Reset when drifted below view
      if (m.position.y < -26) {
        m.position.y = 26;
        m.position.x = rand(-38, 38);
        m.position.z = rand(-18, 12);
      }
    });

    renderer.render(scene, camera);
  }
  animate();
})();
