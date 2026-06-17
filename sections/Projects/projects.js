// ── PROJECTS CAROUSEL — 3D SCROLL + DROPDOWN ─────────────────
(function () {
  const track = document.getElementById('proj-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.flip-card'));
  const dotsContainer = document.getElementById('proj-dots');
  const prevBtn = document.getElementById('proj-prev');
  const nextBtn = document.getElementById('proj-next');
  const dropBtn = document.getElementById('proj-dropdown-btn');
  const dropMenu = document.getElementById('proj-dropdown-menu');

  // ── 3D PERSPECTIVE EFFECT ──────────────────────────────────
  function update3D() {
    const trackW = track.clientWidth;
    const scrollLeft = track.scrollLeft;
    const center = scrollLeft + trackW / 2;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const raw = (cardCenter - center) / (trackW * 0.55);
      const clamped = Math.max(-1.6, Math.min(1.6, raw));

      const rotateY = clamped * 24;           // up to ±24°
      const scale   = 1 - Math.abs(clamped) * 0.07;
      const opacity = 1 - Math.abs(clamped) * 0.38;

      card.style.transform =
        `perspective(1100px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = Math.max(0.18, opacity).toString();
    });

    updateDots();
  }

  track.addEventListener('scroll', update3D, { passive: true });

  // Reset 3D on hover so the flip works cleanly, restore on leave
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'perspective(1100px) rotateY(0deg) scale(1)';
      card.style.opacity   = '1';
    });
    card.addEventListener('mouseleave', () => update3D());
  });

  // ── ARROW NAVIGATION ──────────────────────────────────────
  function cardStep() {
    const firstCard = cards[0];
    return firstCard ? firstCard.offsetWidth + 32 : 380; // card + gap
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });
  }

  // ── DOTS ─────────────────────────────────────────────────
  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.proj-dot');
    const trackW    = track.clientWidth;
    const scrollLeft = track.scrollLeft;
    const center    = scrollLeft + trackW / 2;

    let closestIdx = 0;
    let closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < closestDist) { closestDist = dist; closestIdx = i; }
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIdx));
  }

  // Dot click → scroll to card
  if (dotsContainer) {
    dotsContainer.querySelectorAll('.proj-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (cards[i]) {
          track.scrollTo({ left: cards[i].offsetLeft - 24, behavior: 'smooth' });
        }
      });
    });
  }

  // ── DROPDOWN ─────────────────────────────────────────────
  if (dropBtn && dropMenu) {
    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropMenu.classList.toggle('open');
      dropBtn.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', () => {
      dropMenu.classList.remove('open');
      dropBtn.classList.remove('active');
    });

    dropMenu.querySelectorAll('a[data-proj-index]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(link.dataset.projIndex, 10);
        if (cards[idx]) {
          track.scrollTo({ left: cards[idx].offsetLeft - 24, behavior: 'smooth' });
        }
        dropMenu.classList.remove('open');
        dropBtn.classList.remove('active');
      });
    });
  }

  // ── INIT ─────────────────────────────────────────────────
  requestAnimationFrame(update3D);
})();
