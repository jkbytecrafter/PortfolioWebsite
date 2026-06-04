// ── CUSTOM CURSOR ─────────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = -200, mouseY = -200;
let trailX = -200, trailY = -200;

// Primary dot — snaps to mouse instantly via rAF (no transition lag)
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

// Animation loop: dot snaps, trailing dot follows closely
(function tick() {
  // Snap primary dot
  dot.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;

  // Trail follows with fast lerp — short, clean delay
  trailX += (mouseX - trailX) * 0.18;
  trailY += (mouseY - trailY) * 0.18;
  ring.style.transform = `translate(calc(-50% + ${trailX}px), calc(-50% + ${trailY}px))`;

  requestAnimationFrame(tick);
})();

// Hover state — trailing dot opens into a soft halo
const interactives = 'a, button, .flip-card, .tag, .contact-card, .cp-verify-btn';
document.querySelectorAll(interactives).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Fade out when cursor leaves the page
document.addEventListener('mouseleave', () => {
  dot.style.opacity  = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity  = '1';
  ring.style.opacity = '1';
});
