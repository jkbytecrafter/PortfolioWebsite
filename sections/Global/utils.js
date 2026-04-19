/* ============================
   JATIN KUMAR – PORTFOLIO JS
   ============================ */

// ── THREE.JS HERO ─────────────────────────────────────────
// Temporarily removed the 3D design
function initHero_disabled() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 18);

  /* -- Tech Core (main centrepiece) -- */
  const mainGeo = new THREE.IcosahedronGeometry(6, 1);
  const mainMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x06B6D4,
    emissiveIntensity: 0.05,
    metalness: 0.9,
    roughness: 0.1,
    wireframe: false,
    transparent: true,
    opacity: 0.35,
  });
  const mainObject = new THREE.Mesh(mainGeo, mainMat);
  scene.add(mainObject);

  /* -- Wireframe overlay -- */
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xEC4899, wireframe: true, transparent: true, opacity: 0.12 });
  const wire = new THREE.Mesh(mainGeo, wireMat);
  scene.add(wire);

  /* -- Particle field -- */
  const PARTICLES = 1800;
  const pPositions = new Float32Array(PARTICLES * 3);
  for (let i = 0; i < PARTICLES; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 80;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x94A3B8, size: 0.09, transparent: true, opacity: 0.35 });
  scene.add(new THREE.Points(pGeo, pMat));

  /* -- Lights -- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const pointA = new THREE.PointLight(0x06B6D4, 2.5, 60);
  pointA.position.set(10, 10, 10);
  scene.add(pointA);
  const pointB = new THREE.PointLight(0xEC4899, 1.2, 60);
  pointB.position.set(-10, -8, -5);
  scene.add(pointB);
  const pointC = new THREE.PointLight(0x6366F1, 2, 60);
  pointC.position.set(0, -12, 8);
  scene.add(pointC);

  /* -- Mouse parallax -- */
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  /* -- Animate -- */
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();
    mainObject.rotation.x = 0.3 * t + targetY * 0.5;
    mainObject.rotation.y = 0.2 * t + targetX * 0.5;
    wire.rotation.x = mainObject.rotation.x;
    wire.rotation.y = mainObject.rotation.y;

    // Pulsing emissive
    mainMat.emissiveIntensity = 0.05 + 0.03 * Math.sin(t * 2);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

// ── INTERSECTION OBSERVER for reveal ──────────────────────
const revealEls = document.querySelectorAll('.reveal, .timeline-item, .edu-card');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCounter(el, target, duration = 1400, suffix = '') {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── SVG RING ANIMATION ────────────────────────────────────
function animateRingSVG(id, percent) {
  const circ = 2 * Math.PI * 50; // r=50 → ~314
  const offset = circ * (1 - Math.min(percent, 1));
  const el = document.getElementById(id);
  if (el) {
    setTimeout(() => { el.style.strokeDashoffset = offset; }, 300);
  }
}

// ── DIFF BARS ─────────────────────────────────────────────
function animateBar(id, percent) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => { el.style.width = Math.min(percent * 100, 100) + '%'; }, 400);
}
