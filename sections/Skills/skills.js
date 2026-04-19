// ── SKILL TAG GLOW BURST ──────────────────────────────────
const colorMap = { coral: '#6366F1', cyan: '#06B6D4', purple: '#EC4899', yellow: '#F59E0B' };
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    const c = colorMap[tag.dataset.color] || '#fff';
    tag.style.boxShadow = `0 0 16px ${c}66`;
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.boxShadow = '';
  });
});
