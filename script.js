(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storedTheme = root.dataset.theme;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (!storedTheme) root.dataset.theme = prefersDark ? 'dark' : 'light';

  function updateThemeLabel() {
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
    if (themeMeta) themeMeta.content = dark ? '#111b1a' : '#f6f4ee';
  }
  updateThemeLabel();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('sj-theme', root.dataset.theme); } catch (e) {}
    updateThemeLabel();
  });

  const filterButtons = [...document.querySelectorAll('.filter')];
  const cards = [...document.querySelectorAll('.project-card')];
  const filterStatus = document.getElementById('filter-status');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let shown = 0;
    cards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) shown++;
    });
    filterStatus.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}`;
  }));

  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.getElementById('copy-status');
  copyButton.addEventListener('click', async () => {
    const email = 'joshishreyansh20@gmail.com';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Email copied to clipboard.';
    } catch (e) {
      copyStatus.textContent = `Copy this address: ${email}`;
    }
    clearTimeout(copyButton._statusTimer);
    copyButton._statusTimer = setTimeout(() => { copyStatus.textContent = ''; }, 5500);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  const progress = document.querySelector('.scroll-progress');
  let scheduled = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, window.scrollY / max * 100) : 0}%`;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 35px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('in-view'));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.primary-nav a')];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-30% 0px -58% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }
})();
