// ── COMPETITIVE CAROUSEL — CIRCULAR (Infinite Loop) ───────────
(function () {
  const track   = document.getElementById('cp-track');
  if (!track) return;

  const realCards = Array.from(track.querySelectorAll('.cp-card'));
  const N         = realCards.length;
  const prevBtn   = document.getElementById('cp-prev');
  const nextBtn   = document.getElementById('cp-next');
  const dropBtn   = document.getElementById('cp-dropdown-btn');
  const dropMenu  = document.getElementById('cp-dropdown-menu');

  // Strip all IDs from a clone so getElementById finds real cards only,
  // but save them in data-clone-id so API updates can sync to clones.
  function stripIds(el) {
    if (el.id) {
      el.dataset.cloneId = el.id;
      el.removeAttribute('id');
    }
    el.querySelectorAll('[id]').forEach(child => {
      child.dataset.cloneId = child.id;
      child.removeAttribute('id');
    });
  }

  // ── CLONE cards at both ends ────────────────────────────────
  realCards.forEach(card => {
    const clone = card.cloneNode(true);
    stripIds(clone);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('carousel-clone');
    track.appendChild(clone);
  });
  realCards.slice().reverse().forEach(card => {
    const clone = card.cloneNode(true);
    stripIds(clone);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('carousel-clone');
    track.prepend(clone);
  });

  const gap    = () => parseFloat(getComputedStyle(track).gap) || 32;
  const cardW  = () => realCards[0].offsetWidth + gap();
  const realStart = () => cardW() * N;

  // ── Init scroll ───────────────────────────────────────────
  function init() {
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = realStart();
    track.style.scrollBehavior = '';
    requestAnimationFrame(update3D);
  }
  window.addEventListener('load', init);
  setTimeout(init, 80);

  // ── CIRCULAR BOUNDARY CHECK ───────────────────────────────
  let isJumping = false;
  function checkBounds() {
    if (isJumping) return;
    const cw    = cardW();
    const total = cw * N;

    if (track.scrollLeft < cw * 0.5) {
      isJumping = true;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft += total;
      track.style.scrollBehavior = '';
      isJumping = false;
    }
    if (track.scrollLeft > cw * (N * 2) - cw * 0.5) {
      isJumping = true;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft -= total;
      track.style.scrollBehavior = '';
      isJumping = false;
    }
  }

  // ── 3D PERSPECTIVE EFFECT ─────────────────────────────────
  const allCards = () => Array.from(track.querySelectorAll('.cp-card'));

  function update3D() {
    const trackW = track.clientWidth;
    const center = track.scrollLeft + trackW / 2;

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

  // ── ARROW NAVIGATION ─────────────────────────────────────
  const step = () => cardW();

  if (prevBtn) prevBtn.addEventListener('click', () =>
    track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () =>
    track.scrollBy({ left:  step(), behavior: 'smooth' }));

  // ── DOTS ─────────────────────────────────────────────────
  function realIndex() {
    const offset = track.scrollLeft - realStart();
    return Math.round(offset / cardW());
  }

  function updateDots() {
    const dots = document.querySelectorAll('#cp-dots .cp-dot');
    const idx  = ((realIndex() % N) + N) % N;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  document.querySelectorAll('#cp-dots .cp-dot').forEach((dot, i) => {
    dot.addEventListener('click', () =>
      track.scrollTo({ left: realStart() + cardW() * i - gap() / 2, behavior: 'smooth' }));
  });

  // ── DROPDOWN ─────────────────────────────────────────────
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
    dropMenu.querySelectorAll('a[data-cp-index]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const idx = parseInt(link.dataset.cpIndex, 10);
        track.scrollTo({ left: realStart() + cardW() * idx - gap() / 2, behavior: 'smooth' });
        dropMenu.classList.remove('open');
        dropBtn.classList.remove('active');
      });
    });
  }
})();
