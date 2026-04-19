// ── CONTACT EMAIL COPY ────────────────────────────────────
document.getElementById('email-card')?.addEventListener('click', e => {
  e.preventDefault();
  navigator.clipboard.writeText('jatinkumar15002@gmail.com').then(() => {
    const orig = e.currentTarget.querySelector('span').textContent;
    e.currentTarget.querySelector('span').textContent = '✓ Email copied!';
    setTimeout(() => { e.currentTarget.querySelector('span').textContent = orig; }, 2000);
  });
});
