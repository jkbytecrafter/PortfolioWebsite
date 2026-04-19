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
