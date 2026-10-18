(() => {
  const body = document.body;
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.side-panel');
  const scrim = document.querySelector('.scrim');
  const close = document.querySelector('.close-menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
    if (panel) panel.setAttribute('aria-hidden', String(!open));
    if (toggle) toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  toggle?.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  close?.addEventListener('click', () => setMenu(false));
  scrim?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((el, i) => { el.style.setProperty('--reveal-delay', `${(i % 4) * 80}ms`); observer.observe(el); });
  } else revealItems.forEach(el => el.classList.add('is-visible'));

  // Gentle cursor-reactive parallax for the ambient background.
  let raf = 0;
  window.addEventListener('pointermove', e => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || raf) return;
    raf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--pointer-x', `${(e.clientX / window.innerWidth - .5) * 18}px`);
      document.documentElement.style.setProperty('--pointer-y', `${(e.clientY / window.innerHeight - .5) * 18}px`);
      raf = 0;
    });
  }, { passive: true });

  document.querySelectorAll('.newsletter-form, .contact-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const feedback = form.querySelector('.form-feedback');
      if (!feedback) return;
      if (form.classList.contains('newsletter-form')) {
        feedback.textContent = 'Thanks for your interest — connect this form to your mailing list before launch.';
      } else {
        feedback.textContent = 'Thanks for reaching out. This demo form is not connected yet; add a backend to receive submissions.';
      }
      feedback.classList.add('show');
    });
  });
})();
