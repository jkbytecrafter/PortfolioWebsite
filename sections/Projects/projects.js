// ── 3D TILT ON PROJECT CARDS ──────────────────────────────
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Don't tilt once flipped
    if (!card.querySelector('.flip-card-inner').style.transform) {
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
