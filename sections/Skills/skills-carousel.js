// ── SKILLS CAROUSEL — 3D SCROLL + DROPDOWN ───────────────────
(function () {
  const track    = document.getElementById('sk-track');
  if (!track) return;

  const cards    = Array.from(track.querySelectorAll('.skill-category'));
  const dots     = document.querySelectorAll('#sk-dots .sk-dot');
  const prevBtn  = document.getElementById('sk-prev');
  const nextBtn  = document.getElementById('sk-next');
  const dropBtn  = document.getElementById('sk-dropdown-btn');
  const dropMenu = document.getElementById('sk-dropdown-menu');

  // ── 3D PERSPECTIVE EFFECT ──────────────────────────────────
  function update3D() {
    const trackW = track.clientWidth;
    const center = track.scrollLeft + trackW / 2;

    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const raw     = (cardCenter - center) / (trackW * 0.55);
      const clamped = Math.max(-1.6, Math.min(1.6, raw));

      card.style.transform =
        `perspective(1100px) rotateY(${clamped * 22}deg) scale(${1 - Math.abs(clamped) * 0.07})`;
      card.style.opacity = Math.max(0.18, 1 - Math.abs(clamped) * 0.38).toString();
    });

    updateDots();
  }

  track.addEventListener('scroll', update3D, { passive: true });

  // ── ARROW NAVIGATION ──────────────────────────────────────
  const step = () => (cards[0]?.offsetWidth || 320) + 32;

  if (prevBtn) prevBtn.addEventListener('click', () =>
    track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () =>
    track.scrollBy({ left:  step(), behavior: 'smooth' }));

  // ── DOTS ─────────────────────────────────────────────────
  function updateDots() {
    const center = track.scrollLeft + track.clientWidth / 2;
    let closestIdx = 0, closestDist = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (d < closestDist) { closestDist = d; closestIdx = i; }
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIdx));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () =>
    track.scrollTo({ left: cards[i].offsetLeft - 24, behavior: 'smooth' })));

  // ── DROPDOWN ─────────────────────────────────────────────
  if (dropBtn && dropMenu) {
    dropBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = dropMenu.classList.toggle('open');
      dropBtn.classList.toggle('active', open);
    });

    document.addEventListener('click', () => {
      dropMenu.classList.remove('open');
      dropBtn.classList.remove('active');
    });

    dropMenu.querySelectorAll('a[data-sk-index]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const idx = parseInt(link.dataset.skIndex, 10);
        if (cards[idx])
          track.scrollTo({ left: cards[idx].offsetLeft - 24, behavior: 'smooth' });
        dropMenu.classList.remove('open');
        dropBtn.classList.remove('active');
      });
    });
  }

  // ── INIT ─────────────────────────────────────────────────
  requestAnimationFrame(update3D);
})();
