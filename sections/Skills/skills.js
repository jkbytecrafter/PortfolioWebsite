// ── SKILL TAG GLOW BURST ──────────────────────────────────
const colorMap = { coral: '#5B23FF', cyan: '#008BFF', purple: '#E4FF30', yellow: '#a09cc0' };
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    const c = colorMap[tag.dataset.color] || '#fff';
    tag.style.boxShadow = `0 0 16px ${c}66`;
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.boxShadow = '';
  });
});
