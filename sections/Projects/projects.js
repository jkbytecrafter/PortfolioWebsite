// ── PROJECTS CAROUSEL — CIRCULAR (Infinite Loop) ──────────────
(function () {
  const track = document.getElementById('proj-track');
  if (!track) return;

  const realCards   = Array.from(track.querySelectorAll('.flip-card'));
  const N           = realCards.length;
  const dotsContainer = document.getElementById('proj-dots');
  const prevBtn     = document.getElementById('proj-prev');
  const nextBtn     = document.getElementById('proj-next');
  const dropBtn     = document.getElementById('proj-dropdown-btn');
  const dropMenu    = document.getElementById('proj-dropdown-menu');

  // ── CLONE cards at both ends for circular illusion ────────
  realCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('carousel-clone');
    track.appendChild(clone);
  });
  realCards.slice().reverse().forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('carousel-clone');
    track.prepend(clone);
  });

  // All items in DOM order (clones + real + clones)
  const allCards = () => Array.from(track.querySelectorAll('.flip-card'));

  // Gap between cards
  const gap = () => parseFloat(getComputedStyle(track).gap) || 32;
  const cardW = () => realCards[0].offsetWidth + gap();

  // Position of the first real card (after N prepended clones)
  const realStart = () => cardW() * N;

  // ── Initialise scroll to first real card ─────────────────
  function init() {
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = realStart();
    track.style.scrollBehavior = '';
    requestAnimationFrame(update3D);
  }
  // Wait for layout
  window.addEventListener('load', init);
  setTimeout(init, 80);

  // ── CIRCULAR BOUNDARY CHECK ───────────────────────────────
  let isJumping = false;
  function checkBounds() {
    if (isJumping) return;
    const cw    = cardW();
    const total = cw * N;          // width of one full set

    // Scrolled into start-clones (before real cards)
    if (track.scrollLeft < cw * 0.5) {
      isJumping = true;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft += total;
      track.style.scrollBehavior = '';
      isJumping = false;
    }
    // Scrolled into end-clones (after real cards)
    if (track.scrollLeft > cw * (N * 2) - cw * 0.5) {
      isJumping = true;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft -= total;
      track.style.scrollBehavior = '';
      isJumping = false;
    }
  }

  // ── 3D PERSPECTIVE EFFECT ─────────────────────────────────
  function update3D() {
    const trackW  = track.clientWidth;
    const center  = track.scrollLeft + trackW / 2;

    allCards().forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const raw     = (cardCenter - center) / (trackW * 0.55);
      const clamped = Math.max(-1.6, Math.min(1.6, raw));
      card.style.transform =
        `perspective(1100px) rotateY(${clamped * 24}deg) scale(${1 - Math.abs(clamped) * 0.07})`;
      card.style.opacity = Math.max(0.18, 1 - Math.abs(clamped) * 0.38).toString();
    });

    updateDots();
  }

  track.addEventListener('scroll', () => { checkBounds(); update3D(); }, { passive: true });

  // Reset 3D on hover (flip animation)
  realCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'perspective(1100px) rotateY(0deg) scale(1)';
      card.style.opacity   = '1';
    });
    card.addEventListener('mouseleave', update3D);
  });

  // ── ARROW NAVIGATION (wraps automatically) ────────────────
  const step = () => cardW();

  if (prevBtn) prevBtn.addEventListener('click', () =>
    track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () =>
    track.scrollBy({ left:  step(), behavior: 'smooth' }));

  // ── DOTS (map to real cards only) ─────────────────────────
  function realIndex() {
    const cw     = cardW();
    const offset = track.scrollLeft - realStart();
    return Math.round(offset / cw);
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.proj-dot');
    const idx  = ((realIndex() % N) + N) % N;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  if (dotsContainer) {
    dotsContainer.querySelectorAll('.proj-dot').forEach((dot, i) => {
      dot.addEventListener('click', () =>
        track.scrollTo({ left: realStart() + cardW() * i - gap() / 2, behavior: 'smooth' }));
    });
  }

  // ── DROPDOWN ──────────────────────────────────────────────
  if (dropBtn && dropMenu) {
    dropBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropMenu.classList.toggle('open');
      dropBtn.classList.toggle('active', dropMenu.classList.contains('open'));
    });
    document.addEventListener('click', () => {
      dropMenu.classList.remove('open');
      dropBtn.classList.remove('active');
    });
    dropMenu.querySelectorAll('a[data-proj-index]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const idx = parseInt(link.dataset.projIndex, 10);
        track.scrollTo({ left: realStart() + cardW() * idx - gap() / 2, behavior: 'smooth' });
        dropMenu.classList.remove('open');
        dropBtn.classList.remove('active');
      });
    });
  }
})();
