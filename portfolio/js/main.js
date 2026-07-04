/* =========================================================================
   SHANMUKH SRIRAM — shared interactions
   Principle: motion clarifies hierarchy; it never performs.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav scroll state ---- */
  const nav = document.querySelector('.site-nav');
  if (nav){
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Highlight active nav link ---- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('is-active');
  });

  /* ---- Mobile menu ---- */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu-close');
  if (burger && mobileMenu){
    burger.addEventListener('click', () => mobileMenu.classList.add('is-open'));
    closeBtn && closeBtn.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('is-open')));
  }

  /* ---- Editorial reveal on scroll ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 0.1 + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Gentle parallax on hero ornament ---- */
  const orn = document.querySelector('[data-parallax]');
  if (orn && !reduceMotion){
    window.addEventListener('scroll', () => {
      orn.style.transform = 'translateY(' + window.scrollY * 0.12 + 'px)';
    }, { passive: true });
  }

  /* ---- Soft page transitions between internal pages ---- */
  if (!reduceMotion){
    document.querySelectorAll('a[href$=".html"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        document.body.classList.add('is-leaving');
        setTimeout(() => { location.href = href; }, 320);
      });
    });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
