(() => {
  const body = document.body;
  const loader = document.querySelector('#loader');
  const bar = document.querySelector('#loader-bar');
  const hero = document.querySelector('#hero');
  const menu = document.querySelector('#mobile-menu');
  const toggle = document.querySelector('#menu-toggle');
  const menuLinks = [...document.querySelectorAll('[data-menu-link]')];
  let closeTimer = null;

  const revealHero = () => hero?.classList.add('revealed');
  const finishLoader = () => {
    loader?.classList.add('is-exiting');
    body.classList.remove('loading-active');
    window.setTimeout(revealHero, 140);
    window.setTimeout(() => loader?.remove(), 940);
  };

  if (loader && bar) {
    const started = performance.now();
    let readyAt = null;
    const tick = (now) => {
      const elapsed = now - started;
      const ready = document.readyState === 'complete' || elapsed >= 5000;
      let progress = Math.min(90, (elapsed / 2400) * 90);
      if (elapsed >= 2400 && ready) {
        readyAt ??= now;
        progress = 90 + Math.min(1, (now - readyAt) / 400) * 10;
      }
      bar.style.transform = `scaleX(${progress / 100})`;
      if (progress < 100) requestAnimationFrame(tick);
      else window.setTimeout(finishLoader, 140);
    };
    requestAnimationFrame(tick);
  } else revealHero();

  const setMenu = (open) => {
    if (!menu || !toggle) return;
    if (closeTimer) window.clearTimeout(closeTimer);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'CLOSE' : 'MENU';
    body.classList.toggle('menu-open', open);
    menuLinks.forEach((link, index) => {
      const text = link.querySelector('span');
      if (open) {
        text.style.transform = '';
        text.style.transitionDelay = `${400 + index * 80}ms`;
        link.classList.remove('is-visible');
        window.requestAnimationFrame(() => {
          if (menu.classList.contains('is-open')) link.classList.add('is-visible');
        });
      }
    });
    if (!open) {
      closeTimer = window.setTimeout(() => {
        menuLinks.forEach((link) => {
          link.classList.remove('is-visible');
          const text = link.querySelector('span');
          text.style.transitionDelay = '0ms';
          text.style.transform = 'translateY(110%)';
        });
      }, 520);
    }
  };
  toggle?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const lineElements = [...document.querySelectorAll('[data-reveal-lines]')];
  lineElements.forEach((element) => {
    const parts = element.innerHTML.split('<br>');
    element.innerHTML = parts.map((part) => `<span class="line">${part}</span>`).join('');
  });
  const letterElements = [...document.querySelectorAll('[data-letter-reveal]')];
  letterElements.forEach((element) => {
    const text = element.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    element.innerHTML = '';
    [...text].forEach((char, index) => {
      if (char === '\n') { element.append(document.createElement('br')); return; }
      const span = document.createElement('span');
      span.className = 'letter'; span.textContent = char === ' ' ? '\u00a0' : char; span.style.transitionDelay = `${index * 25}ms`; element.append(span);
    });
  });
  const observer = new IntersectionObserver((entries, obs) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } }), { threshold: .2 });
  [...lineElements, ...letterElements].forEach((element) => observer.observe(element));
})();
