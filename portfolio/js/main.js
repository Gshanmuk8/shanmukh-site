/* =========================================================================
   SHANMUKH SRIRAM — Collected Works
   A living but composed volume: an opening, a painted frontispiece,
   reveals, reading progress, section placard, page turns.
   Refined, not restless — creative execution held to a professional finish.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = matchMedia('(pointer: fine)').matches;

  /* ---- Nav scroll state ---- */
  const nav = document.querySelector('.site-nav');
  if (nav){
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Highlight the current page in the nav ---- */
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

  /* ---- Sections settle in as they enter the viewport ---- */
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
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Press date — this copy was impressed for this reader ---- */
  document.querySelectorAll('[data-printed]').forEach(el => {
    const stamp = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date());
    el.textContent = stamp.replace(' at ', ' · ').replace(', ', ' · ');
  });

  /* ---- Bookmark ribbon — lengthens as the reader progresses ---- */
  const ribbon = document.createElement('div');
  ribbon.className = 'bookmark-ribbon';
  ribbon.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ribbon);
  let ribbonTick = false;
  const setRibbon = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    ribbon.style.height = Math.max(34, p * window.innerHeight) + 'px';
    ribbonTick = false;
  };
  setRibbon();
  window.addEventListener('scroll', () => {
    if (!ribbonTick){ requestAnimationFrame(setRibbon); ribbonTick = true; }
  }, { passive: true });
  window.addEventListener('resize', setRibbon);

  /* ---- Exhibit placard — names the section currently under glass ---- */
  const placard = document.createElement('div');
  placard.className = 'page-placard';
  placard.setAttribute('aria-hidden', 'true');
  document.body.appendChild(placard);
  const placardTargets = [];
  document.querySelectorAll('section, article.folio').forEach(el => {
    let text = '';
    if (el.matches('.folio')){
      const no = el.querySelector('.folio-no');
      const h = el.querySelector('h3');
      if (no && h) text = no.textContent.trim().replace(/\.$/, '') + ' — ' + h.textContent.trim();
    } else {
      const label = el.querySelector('.label');
      if (label){
        const num = label.querySelector('.num');
        const title = label.textContent.replace(num ? num.textContent : '', '').trim();
        text = (num ? '§ ' + num.textContent.trim() + ' — ' : '') + title;
      }
    }
    if (text) placardTargets.push({ el, text });
  });
  if (placardTargets.length && 'IntersectionObserver' in window){
    const pio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const hit = placardTargets.find(t => t.el === entry.target);
        if (hit){
          placard.textContent = hit.text;
          placard.classList.add('is-shown');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    placardTargets.forEach(t => pio.observe(t.el));
  }

  /* ---- Turning the leaf — a sheet is drawn over the page between chapters ---- */
  const leaf = document.createElement('div');
  leaf.className = 'page-leaf';
  const leafLabel = document.createElement('span');
  leafLabel.className = 'leaf-label';
  leaf.appendChild(leafLabel);
  document.body.appendChild(leaf);
  const chapterOf = {
    'index.html':    'Frontispiece',
    'about.html':    'Chapter I — The Author',
    'projects.html': 'Chapter II — The Plates',
    'blog.html':     'Chapter III — Fields of Inquiry',
    'contact.html':  'Chapter IV — Correspondence'
  };
  if (!reduceMotion){
    document.querySelectorAll('a[href$=".html"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        leafLabel.textContent = chapterOf[href.split('/').pop()] || 'Turning…';
        leaf.classList.add('is-covering');
        setTimeout(() => { location.href = href; }, 430);
      });
    });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Correspondence — make "email" reliably open a composer ----------
     mailto: only fires if the visitor has a desktop mail client set as the
     default handler; on many desktops that is unset, so the click does
     nothing. On desktop we open Gmail's web compose in a new tab instead;
     on touch devices we leave the native mailto: alone (it opens the app). */
  const coarsePointer = matchMedia('(pointer: coarse)').matches;
  if (!coarsePointer){
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        const raw = a.getAttribute('href').slice('mailto:'.length);
        const [addr, query = ''] = raw.split('?');
        const params = new URLSearchParams(query);
        const gmail = new URL('https://mail.google.com/mail/');
        gmail.searchParams.set('view', 'cm');
        gmail.searchParams.set('fs', '1');
        if (addr) gmail.searchParams.set('to', decodeURIComponent(addr));
        if (params.get('subject')) gmail.searchParams.set('su', params.get('subject'));
        if (params.get('body'))    gmail.searchParams.set('body', params.get('body'));
        if (params.get('cc'))      gmail.searchParams.set('cc', params.get('cc'));
        if (params.get('bcc'))     gmail.searchParams.set('bcc', params.get('bcc'));
        e.preventDefault();
        window.open(gmail.toString(), '_blank', 'noopener');
      });
    });
  }

  /* =======================================================================
     THE LIVING VOLUME
     ===================================================================== */

  /* ---- I. The opening of the volume — a composed first load ----------- */
  if (!reduceMotion && !sessionStorage.getItem('sk-opened')){
    try { sessionStorage.setItem('sk-opened', '1'); } catch (e) {}
    const ov = document.createElement('div');
    ov.id = 'opening';
    ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML =
      '<svg class="op-seal" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" stroke-width="1"/>' +
        '<g class="op-ring">' +
          '<path id="op-arc" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" fill="none"/>' +
          '<text font-size="8" letter-spacing="1.1"><textPath href="#op-arc">COLLECTED WORKS · SHANMUKH SRIRAM · MMXXVI · </textPath></text>' +
        '</g>' +
        '<text class="op-s" x="60" y="61" text-anchor="middle" dominant-baseline="central" font-size="36" fill="currentColor">S</text>' +
      '</svg>' +
      '<div class="op-title">Collected Works</div>' +
      '<div class="op-sub">Shanmukh Sriram · First Edition</div>' +
      '<div class="op-rule"></div>';
    document.body.appendChild(ov);
    document.documentElement.classList.add('is-opening');
    requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('is-ready')));
    setTimeout(() => {
      ov.classList.add('is-lifting');
      document.documentElement.classList.remove('is-opening');
    }, 1500);
    ov.addEventListener('transitionend', e => {
      if (e.propertyName === 'transform' && ov.classList.contains('is-lifting')) ov.remove();
    });
  }

  /* ---- II. Depth — the frontispiece breathes with pointer + scroll ---- */
  const hero = document.querySelector('.hero');
  const orn  = document.querySelector('[data-parallax]');
  const heroTitle = hero ? hero.querySelector('h1') : null;
  if (hero && !reduceMotion){
    let tX = 0, tY = 0, cX = 0, cY = 0, sc = window.scrollY;
    if (finePointer){
      window.addEventListener('pointermove', e => {
        tX = e.clientX / innerWidth  - 0.5;
        tY = e.clientY / innerHeight - 0.5;
      }, { passive: true });
    }
    window.addEventListener('scroll', () => { sc = window.scrollY; }, { passive: true });
    const depthLoop = () => {
      cX += (tX - cX) * 0.05;
      cY += (tY - cY) * 0.05;
      if (orn){
        orn.style.transform =
          'translate(' + (cX * -30).toFixed(1) + 'px,' + (cY * -22 + sc * 0.10).toFixed(1) + 'px)';
      }
      if (heroTitle){
        heroTitle.style.transform =
          'translate(' + (cX * 8).toFixed(1) + 'px,' + (cY * 6).toFixed(1) + 'px)';
      }
      requestAnimationFrame(depthLoop);
    };
    requestAnimationFrame(depthLoop);
  }

  /* ---- III. The living volume — a site-wide marbled pigment field ------ */
  /* The whole codex breathes: a slow wet-pigment current drifts behind      */
  /* every page, tinted toward the pigment of the chapter being read, and    */
  /* stirred a little as the reader turns down through the volume. A central */
  /* celadon veil (in CSS) calms the paint behind the text, leaving the      */
  /* margins illuminated — the logic of a real illuminated manuscript.       */
  if (!reduceMotion){
    const canvas = document.createElement('canvas');
    canvas.id = 'pigment-field';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const veil = document.createElement('div');
    veil.className = 'field-veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.prepend(veil);

    const ctx = canvas.getContext('2d');

    // the European pigment cabinet — orchestrated, never scattered
    const CABINET = {
      lapis:     [31, 58, 147],   // IT · oltremare
      deeplapis: [26, 47, 116],
      malachite: [30, 107, 87],   // RU · malachite
      verdigris: [78, 107, 93],
      cochineal: [151, 36, 63],   // ES · carmín
      tyrian:    [92, 42, 80],    // imperial purple
      ochre:     [178, 122, 40],  // ES · Spanish ochre
      vermilion: [198, 54, 43]    // RU/IT · cinnabar
    };
    const GOLD = [176, 138, 62];
    const VEIL = 'rgba(207,230,221,0.015)';

    // each chapter is illuminated in its own pigment; the first is dominant
    const CHAPTER = {
      'index.html':    ['lapis', 'deeplapis', 'malachite', 'ochre', 'tyrian'],
      'about.html':    ['malachite', 'verdigris', 'lapis', 'ochre'],
      'projects.html': ['lapis', 'vermilion', 'malachite', 'ochre', 'tyrian'],
      'blog.html':     ['ochre', 'malachite', 'lapis', 'cochineal'],
      'contact.html':  ['cochineal', 'tyrian', 'vermilion', 'lapis']
    };
    const keys = CHAPTER[location.pathname.split('/').pop()] || CHAPTER['index.html'];
    // weight the chapter's own pigment most heavily, the rest as accents
    const POOL = [];
    keys.forEach((k, i) => {
      const n = i === 0 ? 5 : (i === 1 ? 3 : 2);
      for (let j = 0; j < n; j++) POOL.push(CABINET[k]);
    });

    let W = 0, H = 0, DPR = 1, particles = [];
    let shift = 0, targetShift = 0;              // scroll gently stirs the current
    const mouse = { x: -9999, y: -9999, active: false };

    const spawn = (x, y) => {
      const gold = Math.random() < 0.12;
      const col = gold ? GOLD : POOL[(Math.random() * POOL.length) | 0];
      return {
        x: x == null ? Math.random() * W : x,
        y: y == null ? Math.random() * H : y,
        px: x || 0, py: y || 0,
        life: 300 + Math.random() * 460,
        w: gold ? 0.5 + Math.random() * 0.7 : 0.7 + Math.random() * 1.5,
        a: gold ? 0.06 : 0.038,
        col
      };
    };

    // a broad, gentle current — long sweeping arcs rather than tight curls
    const flow = (x, y, t) =>
      (Math.sin(x * 0.0016 + t * 0.00018) +
       Math.cos(y * 0.0018 - t * 0.00015) +
       Math.sin((x + y) * 0.0009 + t * 0.00022 + shift)) * 0.85;

    const resize = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.fillStyle = '#CFE6DD';
      ctx.fillRect(0, 0, W, H);
      const target = Math.min(760, Math.round(W * H / 2100));
      particles = [];
      for (let i = 0; i < target; i++) particles.push(spawn());
    };

    const frame = ts => {
      shift += (targetShift - shift) * 0.04;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = VEIL;
      ctx.fillRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (const p of particles){
        p.px = p.x; p.py = p.y;
        const ang = flow(p.x, p.y, ts);
        let vx = Math.cos(ang) * 0.62, vy = Math.sin(ang) * 0.62;
        if (mouse.active){
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const R = 150, d2 = dx * dx + dy * dy;
          if (d2 < R * R){
            const d = Math.sqrt(d2) || 1, f = 1 - d / R;
            vx += (-dy / d) * f * 2.4 + (dx / d) * f * 0.8;   // gentle swirl
            vy += ( dx / d) * f * 2.4 + (dy / d) * f * 0.8;
          }
        }
        p.x += vx; p.y += vy; p.life--;
        ctx.strokeStyle = 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',' + p.a + ')';
        ctx.lineWidth = p.w;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        if (p.life <= 0 || p.x < -24 || p.x > W + 24 || p.y < -24 || p.y > H + 24){
          Object.assign(p, spawn());
        }
      }
      requestAnimationFrame(frame);
    };

    // the field is fixed to the viewport, so pointer coords map directly
    const track = e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    if (finePointer) window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('blur', () => { mouse.active = false; });
    window.addEventListener('scroll', () => { targetShift = window.scrollY * 0.0006; }, { passive: true });

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  }

  /* ---- IV. The plates lift and take their pigment as you approach ----- */
  if (finePointer){
    document.querySelectorAll('.folio').forEach(f => {
      f.addEventListener('pointermove', e => {
        const r = f.getBoundingClientRect();
        f.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        f.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      }, { passive: true });
    });
  }

});
