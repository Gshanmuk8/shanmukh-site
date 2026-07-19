/* =========================================================================
   SHANMUKH SRIRAM — Collected Works
   A living but composed volume: an opening, a painted frontispiece,
   reveals, reading progress, section placard, page turns.
   Refined, not restless — creative execution held to a professional finish.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = matchMedia('(pointer: fine)').matches;

  /* ---- Day & night — restore the reader's chosen light ---- */
  const THEME_KEY = 'sk-theme';
  let storedTheme = null;
  try { storedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  document.documentElement.setAttribute('data-theme',
    storedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  /* ---- Skip link — keyboard readers go straight to the text block ---- */
  const landmark = document.querySelector('main') || document.querySelector('.hero');
  if (landmark){
    if (!landmark.id) landmark.id = 'reading';
    landmark.setAttribute('tabindex', '-1');
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#' + landmark.id;
    skip.textContent = 'Begin reading →';
    document.body.prepend(skip);
  }

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

  /* ---- Catchword — the binder's cue at the foot of the gathering -------
     Real manuscripts printed the first word of the NEXT page at the foot
     of each leaf so the binder sewed the volume in order. Here it names
     the next chapter, with a quill swash, and turns the page when taken. */
  const GATHERINGS = ['index.html', 'about.html', 'projects.html', 'blog.html', 'contact.html'];
  const GATHERING_TITLE = {
    'index.html': 'Frontispiece',
    'about.html': 'The Author',
    'projects.html': 'The Plates',
    'blog.html': 'Fields of Inquiry',
    'contact.html': 'Correspondence'
  };
  const siteFooter = document.querySelector('.site-footer');
  if (siteFooter){
    const at = Math.max(0, GATHERINGS.indexOf(path));
    const nextHref = GATHERINGS[(at + 1) % GATHERINGS.length];
    const row = document.createElement('div');
    row.className = 'catchword-row';
    row.innerHTML =
      '<div class="wrap"><a class="catchword" href="' + nextHref + '">' +
        '<small>catchword · next gathering</small>' +
        '<em>' + GATHERING_TITLE[nextHref] + '</em>' +
        '<svg viewBox="0 0 120 26" aria-hidden="true">' +
          '<path d="M3,20 C30,6 52,26 78,15 C94,8 102,17 117,9" pathLength="1"/>' +
        '</svg>' +
      '</a></div>';
    siteFooter.insertAdjacentElement('beforebegin', row);
    if ('IntersectionObserver' in window){
      const cio = new IntersectionObserver(es => {
        es.forEach(en => { if (en.isIntersecting){ row.classList.add('is-shown'); cio.disconnect(); } });
      }, { threshold: 0.4 });
      cio.observe(row);
    } else {
      row.classList.add('is-shown');
    }
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

  /* ---- The wax seal — correspondence closes with cochineal wax ---------
     Letters were sealed before they were sent. The seal on the closing
     plate is pressed wax with the author's die; taking it opens a reply. */
  if (path === 'contact.html'){
    const closingPlate = document.querySelector('.plate.closing');
    const sealWrap = closingPlate && (closingPlate.querySelector(':scope > .wrap') || closingPlate);
    if (sealWrap){
      const seal = document.createElement('a');
      seal.className = 'wax-seal';
      seal.href = 'mailto:gshanmukhasriram3@gmail.com';
      seal.setAttribute('aria-label', 'Seal your reply — email Shanmukh');
      seal.innerHTML =
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
          '<defs><radialGradient id="ws-wax" cx="42%" cy="36%" r="74%">' +
            '<stop offset="0%" stop-color="#C24557"/>' +
            '<stop offset="55%" stop-color="#97243F"/>' +
            '<stop offset="100%" stop-color="#651A2E"/>' +
          '</radialGradient></defs>' +
          '<path fill="url(#ws-wax)" d="M60,7 C80,3 100,14 107,33 C113,49 104,62 108,78 C110,96 92,111 71,112 C56,113 44,116 30,108 C14,99 8,84 12,68 C15,55 8,45 12,31 C18,13 42,10 60,7 Z"/>' +
          '<path fill="rgba(255,230,214,.15)" d="M28,22 C40,12 62,9 78,16 C64,16 40,22 30,34 C26,30 26,26 28,22 Z"/>' +
          '<circle cx="60" cy="60" r="36" fill="none" stroke="rgba(46,8,18,.55)" stroke-width="1.6"/>' +
          '<circle cx="60" cy="60" r="31" fill="none" stroke="rgba(255,220,205,.28)" stroke-width="1" stroke-dasharray="2.4 3.2"/>' +
          '<text x="60" y="62" text-anchor="middle" dominant-baseline="central" font-size="40" font-style="italic" fill="#57101F" stroke="rgba(255,225,210,.3)" stroke-width=".8">S</text>' +
        '</svg>';
      sealWrap.appendChild(seal);
    }
  }

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

    // The pigment cabinet, in both lights: the same pigments by day, and
    // their luminous selves under lamplight — never a mere inversion.
    const CABINETS = {
      light: {
        lapis: [31,58,147],   deeplapis: [26,47,116],  malachite: [30,107,87],
        verdigris: [78,107,93], cochineal: [151,36,63], tyrian: [92,42,80],
        ochre: [178,122,40],  vermilion: [198,54,43],  gold: [176,138,62],
        naples: [224,190,107], rose: [190,110,134],
        paper: '#CFE6DD'
      },
      dark: {
        lapis: [94,127,214],  deeplapis: [70,100,190], malachite: [79,168,140],
        verdigris: [127,163,145], cochineal: [210,100,128], tyrian: [176,115,163],
        ochre: [217,165,78],  vermilion: [224,106,85], gold: [201,164,78],
        naples: [232,204,133], rose: [214,147,168],
        paper: '#0D1826'
      }
    };
    let CAB, GOLD, NAPLES, ROSE;

    // each chapter is illuminated in its own pigment; the first is dominant
    const CHAPTER = {
      'index.html':    ['lapis', 'malachite', 'ochre', 'cochineal', 'tyrian'],
      'about.html':    ['malachite', 'ochre', 'lapis', 'cochineal'],
      'projects.html': ['lapis', 'vermilion', 'malachite', 'ochre', 'tyrian'],
      'blog.html':     ['ochre', 'malachite', 'lapis', 'cochineal'],
      'contact.html':  ['cochineal', 'tyrian', 'vermilion', 'ochre']
    };
    const keys = CHAPTER[location.pathname.split('/').pop()] || CHAPTER['index.html'];
    // weight the chapter's own pigment most heavily, the rest as accents
    let POOL = [];
    const setCabinet = () => {
      CAB = CABINETS[document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'];
      GOLD = CAB.gold; NAPLES = CAB.naples; ROSE = CAB.rose;
      POOL = [];
      keys.forEach((k, i) => {
        const n = i === 0 ? 5 : (i === 1 ? 3 : 2);
        for (let j = 0; j < n; j++) POOL.push(CAB[k]);
      });
    };
    setCabinet();

    let W = 0, H = 0, DPR = 1, particles = [];
    let shift = 0, targetShift = 0;              // scroll gently stirs the current
    let dip = null;                              // the pigment of the plate being read
    const mouse = { x: -9999, y: -9999, active: false };

    /* THE UNDERPAINTING — the painter's first act: broad transparent
       glazes of many pigments laid into the wet ground. Rendered once
       per size into an offscreen sheet; the living strokes swim above
       it, and the veil fades trails back toward this painting, never
       toward flat colour. */
    const ground = document.createElement('canvas');
    const paintGround = () => {
      ground.width = Math.max(1, W); ground.height = Math.max(1, H);
      const g = ground.getContext('2d');
      g.fillStyle = CAB.paper;
      g.fillRect(0, 0, W, H);
      const GLAZES = POOL.concat([NAPLES, ROSE, GOLD]);
      const n = 11;
      for (let i = 0; i < n; i++){
        const col = GLAZES[(Math.random() * GLAZES.length) | 0].join(',');
        const r = (0.16 + Math.random() * 0.30) * Math.max(W, H);
        const x = Math.random() * W, y = Math.random() * H;
        const grad = g.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0,    'rgba(' + col + ',0.07)');
        grad.addColorStop(0.55, 'rgba(' + col + ',0.035)');
        grad.addColorStop(1,    'rgba(' + col + ',0)');
        g.fillStyle = grad;
        g.fillRect(x - r, y - r, r * 2, r * 2);
      }
      /* at night the underpainting is an observatory sky: a scatter of
         stars sunk beneath the paint, the brightest wearing a faint halo */
      if (CAB === CABINETS.dark){
        const nStars = Math.round(W * H / 15000);
        for (let i = 0; i < nStars; i++){
          const x = Math.random() * W, y = Math.random() * H, m = Math.random();
          if (m > 0.93){
            const halo = g.createRadialGradient(x, y, 0, x, y, 7);
            halo.addColorStop(0, 'rgba(205,218,240,.22)');
            halo.addColorStop(1, 'rgba(205,218,240,0)');
            g.fillStyle = halo;
            g.fillRect(x - 7, y - 7, 14, 14);
          }
          g.fillStyle = 'rgba(228,224,206,' + (0.2 + m * 0.5).toFixed(2) + ')';
          g.beginPath();
          g.arc(x, y, m > 0.93 ? 1.1 : 0.4 + m * 0.5, 0, 7);
          g.fill();
        }
      }
    };

    /* Each stroke is laid as paint, not ink: a darker shadow pass under
       the ridge, the pigment body, then a lit crest where the raking
       light catches the impasto. Colours are mixed once, at spawn. */
    const spawn = (x, y) => {
      const gold = Math.random() < 0.11;
      const col = gold ? GOLD
        : (dip && Math.random() < 0.45) ? dip
        : POOL[(Math.random() * POOL.length) | 0];
      const r = col[0], g = col[1], b = col[2];
      const a = gold ? 0.09 : 0.07;
      const lr = (r + (255 - r) * 0.55) | 0,
            lg = (g + (255 - g) * 0.55) | 0,
            lb = (b + (255 - b) * 0.55) | 0;
      /* composition: the paint gathers in the open field to the right,
         and rests where the text is read — density, then quiet */
      const nx = x != null ? x
        : (Math.random() < 0.3 ? Math.random() * W : W * Math.sqrt(Math.random()));
      const ny = y == null ? Math.random() * H : y;
      return {
        x: nx, y: ny, px: nx, py: ny,
        life: 240 + Math.random() * 420,
        w: gold ? 0.6 + Math.random() * 1 : 1 + Math.random() * 2.2,
        s: 0.35 + Math.random() * 0.55,          // hand pressure: each stroke its own speed
        ao: (Math.random() - 0.5) * 0.8,         // each stroke leans its own way
        cs: 'rgba(' + ((r * .5) | 0) + ',' + ((g * .5) | 0) + ',' + ((b * .5) | 0) + ',' + (a * .45).toFixed(3) + ')',
        cb: 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')',
        cl: 'rgba(' + lr + ',' + lg + ',' + lb + ',' + (a * .6).toFixed(3) + ')'
      };
    };

    // a broad, gentle current — long sweeping arcs rather than tight curls
    const flow = (x, y, t) =>
      (Math.sin(x * 0.0011 + t * 0.00018) +
       Math.cos(y * 0.0013 - t * 0.00015) +
       Math.sin((x + y) * 0.0007 + t * 0.00022 + shift)) * 0.6;

    const resize = () => {
      DPR = Math.min(1.75, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      paintGround();
      ctx.drawImage(ground, 0, 0, W, H);
      const target = Math.min(560, Math.round(W * H / 2600));
      particles = [];
      for (let i = 0; i < target; i++) particles.push(spawn());
    };

    const frame = ts => {
      shift += (targetShift - shift) * 0.04;
      ctx.globalCompositeOperation = 'source-over';
      /* the veil: trails settle back into the underpainting, not into flatness */
      ctx.globalAlpha = 0.02;
      ctx.drawImage(ground, 0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.lineCap = 'round';
      for (const p of particles){
        p.px = p.x; p.py = p.y;
        const ang = flow(p.x, p.y, ts) + p.ao;
        let vx = Math.cos(ang) * 1.15 * p.s, vy = Math.sin(ang) * 1.15 * p.s;
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
        /* loaded strokes get the full impasto (shadow, body, lit crest);
           hairline strokes take a single pass — half the draw cost, and
           relief only ever showed on the loaded brush anyway */
        if (p.w > 1.4){
          ctx.strokeStyle = p.cs;
          ctx.lineWidth = p.w + 0.5;
          ctx.beginPath(); ctx.moveTo(p.px + 0.8, p.py + 1); ctx.lineTo(p.x + 0.8, p.y + 1); ctx.stroke();
        }
        ctx.strokeStyle = p.cb;
        ctx.lineWidth = p.w;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        if (p.w > 1.4){
          ctx.strokeStyle = p.cl;
          ctx.lineWidth = Math.max(0.5, p.w * 0.38);
          ctx.beginPath(); ctx.moveTo(p.px - 0.6, p.py - 0.8); ctx.lineTo(p.x - 0.6, p.y - 0.8); ctx.stroke();
        }
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

    /* The dip — as the reader settles on a folio, essay or section, freshly
       spawned strokes take that plate's own pigment, so the field slowly
       re-inks itself in the colour of what is being read. The pigment is
       sampled from the CSS itself (--pig, or the numeral's painted colour). */
    const parseCol = s => {
      if (!s) return null;
      s = s.trim();
      let m = s.match(/^#([0-9a-f]{6})$/i);
      if (m) return [parseInt(m[1].slice(0,2),16), parseInt(m[1].slice(2,4),16), parseInt(m[1].slice(4,6),16)];
      m = s.match(/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      return m ? [+m[1], +m[2], +m[3]] : null;
    };
    const pigOf = el => {
      const own = parseCol(getComputedStyle(el).getPropertyValue('--pig'));
      if (own) return own;
      const n = el.querySelector('.folio-no, .essay-no, .label .num');
      return n ? parseCol(getComputedStyle(n).color) : null;
    };
    if ('IntersectionObserver' in window){
      const dio = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const c = pigOf(entry.target);
          if (c) dip = c;
        });
      }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
      document.querySelectorAll('.folio, .essay, section').forEach(el => dio.observe(el));
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('sk-theme', () => { setCabinet(); resize(); });
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

  /* =======================================================================
     THE GILDED APPARATUS
     The working instruments a true codex carried: the scribe's ruling
     (canon), the illuminator's border vines (rinceaux), the astronomer's
     paper wheel (volvelle). Artwork with a job, never decoration.
     ===================================================================== */
  const NS = 'http://www.w3.org/2000/svg';

  /* a section's own painted pigment, sampled from the CSS itself */
  const samplePigment = el => {
    const v = getComputedStyle(el).getPropertyValue('--pig').trim();
    if (v) return v;
    const n = el.querySelector('.folio-no, .essay-no, .label .num');
    return n ? getComputedStyle(n).color : '';
  };

  /* ---- V. The canon — sinopia ruling beneath the frontispiece ---------
     Before an illuminator painted, the scribe ruled the sheet in red
     chalk: diagonals, gable, text block, compass circle (the canon of
     page construction). It draws itself once, then sinks into the paper
     — the engineering left faintly visible beneath the finished art.   */
  if (hero){
    const canon = document.createElementNS(NS, 'svg');
    canon.setAttribute('class', 'canon');
    canon.setAttribute('viewBox', '0 0 1200 760');
    canon.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    canon.setAttribute('aria-hidden', 'true');
    [
      'M0,0 L1200,760', 'M1200,0 L0,760',                       // diagonals
      'M0,760 L600,0', 'M1200,760 L600,0',                      // the gable
      'M133,84 H1067 V676 H133 Z',                              // text block
      'M600,380 m-172,0 a172,172 0 1,0 344,0 a172,172 0 1,0 -344,0' // compass
    ].forEach((d, i) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('pathLength', '1');
      p.style.transitionDelay = (0.3 + i * 0.26) + 's';
      canon.appendChild(p);
    });
    hero.appendChild(canon);
    if (reduceMotion){
      canon.classList.add('is-drawn', 'is-resting');
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        canon.classList.add('is-drawn');
        setTimeout(() => canon.classList.add('is-resting'), 3600);
      }));
    }
  }

  /* ---- VI. Rinceaux — the illuminator's vine climbs the margin --------
     Border vines were the illuminator's signature work. One climbs the
     outer margin of each chapter section, inked in that section's own
     pigment, its berries in gold, drawing itself as the section is read. */
  const VINE =
    '<svg class="margin-vine" viewBox="0 0 64 480" aria-hidden="true">' +
      '<defs><path id="mv-leaf" d="M0,0 C7,-9 17,-13 27,-12 C19,-4 14,4 11,12 C6,7 3,4 0,0 Z"/></defs>' +
      '<path class="mv-stem" pathLength="1" d="M34,10 C30,2 24,-2 17,0 M34,10 C14,68 54,118 34,178 C14,238 54,288 34,348 C20,394 46,432 34,474"/>' +
      '<use href="#mv-leaf" transform="translate(24,54) scale(-1,1) rotate(12)"/>' +
      '<use href="#mv-leaf" transform="translate(45,110) rotate(6)"/>' +
      '<use href="#mv-leaf" transform="translate(23,222) scale(-1,1) rotate(-4)"/>' +
      '<use href="#mv-leaf" transform="translate(45,280) rotate(14)"/>' +
      '<use href="#mv-leaf" transform="translate(26,400) scale(-1,1) rotate(8)"/>' +
      '<use href="#mv-leaf" transform="translate(41,438) rotate(2)"/>' +
      '<circle class="mv-berry" cx="34" cy="178" r="2.8"/>' +
      '<circle class="mv-berry" cx="34" cy="348" r="2.8"/>' +
      '<circle class="mv-berry" cx="34" cy="474" r="3.2"/>' +
    '</svg>';
  const vines = [];
  document.querySelectorAll('.section').forEach(sec => {
    const wrap = sec.querySelector(':scope > .wrap');
    if (!wrap) return;
    const holder = document.createElement('div');
    holder.innerHTML = VINE;
    const svg = holder.firstElementChild;
    const pig = samplePigment(sec);
    /* on dark plates the CSS gilt treatment governs; elsewhere the vine
       takes the section's own sampled pigment */
    if (pig && !sec.classList.contains('plate')) svg.style.setProperty('--vine', pig);
    wrap.prepend(svg);
    vines.push(svg);
  });
  if (vines.length){
    if (reduceMotion || !('IntersectionObserver' in window)){
      vines.forEach(v => v.classList.add('is-drawn'));
    } else {
      const vio = new IntersectionObserver(es => {
        es.forEach(en => {
          if (en.isIntersecting){ en.target.classList.add('is-drawn'); vio.unobserve(en.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
      vines.forEach(v => vio.observe(v));
    }
  }

  /* ---- VII. The volvelle — now the archive's astronomical clock -------
     Medieval books carried volvelles: layered rotating wheels for
     computing stars and hours. One is engraved at the head of every
     page of the volume; its rings turn at their own slow rates, its
     single hand keeps true time in the old single-handed manner, and
     the hour is inscribed at its centre.                               */
  const pageHeader = document.querySelector('.page-header') || hero;
  if (pageHeader){
    const vol = document.createElementNS(NS, 'svg');
    vol.setAttribute('class', 'volvelle');
    vol.setAttribute('viewBox', '0 0 300 300');
    vol.setAttribute('aria-hidden', 'true');
    vol.innerHTML =
      '<defs><path id="vol-arc" d="M150,150 m-116,0 a116,116 0 1,1 232,0 a116,116 0 1,1 -232,0"/></defs>' +
      '<g class="vol-outer">' +
        '<circle cx="150" cy="150" r="128" class="vol-line"/>' +
        '<circle cx="150" cy="150" r="103" class="vol-ticks"/>' +
        '<text class="vol-text" font-size="10.5" letter-spacing="2.6">' +
          '<textPath href="#vol-arc">ARS · INGENIVM · SCIENTIA · MMXXVI · ARS · INGENIVM · SCIENTIA ·</textPath>' +
        '</text>' +
        '<rect class="vol-stud" x="146" y="18" width="8" height="8" transform="rotate(45 150 22)"/>' +
        '<rect class="vol-stud" x="146" y="274" width="8" height="8" transform="rotate(45 150 278)"/>' +
      '</g>' +
      '<g class="vol-mid">' +
        '<circle cx="150" cy="150" r="88" class="vol-line"/>' +
        '<circle cx="150" cy="150" r="80" class="vol-ticks vol-ticks-fine"/>' +
        '<rect class="vol-stud" x="146" y="58" width="8" height="8" transform="rotate(45 150 62)"/>' +
      '</g>' +
      '<g class="vol-hand">' +
        '<path class="vol-line" d="M150,64 L150,236"/>' +
        '<path class="vol-tip" d="M150,56 L155,66 L150,76 L145,66 Z"/>' +
        '<circle cx="150" cy="150" r="4.5" class="vol-axis"/>' +
      '</g>' +
      '<circle cx="150" cy="150" r="52" class="vol-line"/>' +
      '<text class="vol-time" x="150" y="180" text-anchor="middle" font-size="12">--:--</text>' +
      /* THE NIGHT LAYER — after dark the clock unfolds into an astrolabe:
         declination arcs, a small charted constellation, and the moon's
         true phase this very night, computed, not drawn.               */
      (() => {
        const r = 8.6, syn = 29.530588853;
        const days = ((Date.now() - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % syn;
        const p = days / syn;
        const rx = (Math.abs(Math.cos(p * 2 * Math.PI)) * r).toFixed(2);
        const lit = p < 0.5
          ? 'M0,' + (-r) + ' A' + r + ',' + r + ' 0 0 1 0,' + r + ' A' + rx + ',' + r + ' 0 0 ' + (p < 0.25 ? 0 : 1) + ' 0,' + (-r) + ' Z'
          : 'M0,' + (-r) + ' A' + r + ',' + r + ' 0 0 0 0,' + r + ' A' + rx + ',' + r + ' 0 0 ' + (p > 0.75 ? 0 : 1) + ' 0,' + (-r) + ' Z';
        return '<g class="vol-night">' +
          '<path class="vol-decl" d="M70,190 A92,92 0 0 1 90,86"/>' +
          '<path class="vol-decl" d="M226,182 A96,96 0 0 0 212,96"/>' +
          '<path class="vol-link" d="M84,100 L98,84 L118,92 L108,118"/>' +
          '<path class="vol-link" d="M196,76 L212,90"/>' +
          '<g class="vol-star">' +
            '<circle cx="84" cy="100" r="1.5"/><circle cx="98" cy="84" r="1.9"/>' +
            '<circle cx="118" cy="92" r="1.2"/><circle cx="108" cy="118" r="1.4"/>' +
            '<circle cx="196" cy="76" r="1.7"/><circle cx="212" cy="90" r="1.2"/>' +
            '<circle cx="206" cy="208" r="1.5"/>' +
          '</g>' +
          '<g class="vol-phase" transform="translate(150,109)">' +
            '<circle r="' + r + '" class="ph-dark"/>' +
            '<path class="ph-lit" d="' + lit + '"/>' +
            '<circle r="' + r + '" class="ph-ring"/>' +
          '</g>' +
        '</g>';
      })();
    if (pageHeader === hero) vol.classList.add('volvelle--hero');
    pageHeader.appendChild(vol);
    if (!reduceMotion) vol.classList.add('is-live');
    const hand = vol.querySelector('.vol-hand');
    const timeText = vol.querySelector('.vol-time');
    const setClock = () => {
      const n = new Date();
      const ang = ((n.getHours() % 12) + n.getMinutes() / 60 + n.getSeconds() / 3600) / 12 * 360;
      hand.setAttribute('transform', 'rotate(' + ang.toFixed(2) + ' 150 150)');
      const t = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
      if (timeText.textContent !== t) timeText.textContent = t;
    };
    setClock();
    setInterval(setClock, 1000);
  }

  /* ---- VIII. The heliotrope — sun and moon over the archive -----------
     An engraved sun from a celestial atlas: alternating straight and
     waved rays, as the old astronomers cut them. An engraved moon with
     its seas stippled and a dashed halo. Taking the sun brings night
     down over the archive as an eclipse from that very point; taking
     the moon returns the daylight the same way.                        */
  const navWrap = document.querySelector('.site-nav .wrap');
  if (navWrap){
    const orb = document.createElement('button');
    orb.className = 'theme-orb';
    orb.type = 'button';
    const straight = [0,45,90,135,180,225,270,315].map(a =>
      '<line x1="32" y1="11.5" x2="32" y2="16.5" transform="rotate(' + a + ' 32 32)"/>').join('');
    const waved = [22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(a =>
      '<path d="M32,12.5 C33.5,14.3 30.5,15.5 32,17.8" transform="rotate(' + a + ' 32 32)"/>').join('');
    orb.innerHTML =
      /* THE SUN — a solar instrument mounted into the binding: beveled
         gold housing with its four setting screws, guilloché rosette
         engraved into the burnished core, ray crown, counter-turning
         corona, orbiting calibration motes — and a specular light that
         follows the reader's own lamp across the metal.                 */
      '<svg class="orb-sun" viewBox="0 0 64 64" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="orb-sunc" cx="38%" cy="34%" r="80%">' +
            '<stop offset="0%" stop-color="#FAEDB8"/>' +
            '<stop offset="45%" stop-color="#E3C36B"/>' +
            '<stop offset="100%" stop-color="#96762B"/>' +
          '</radialGradient>' +
          '<linearGradient id="orb-sunrim" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#F0D791"/>' +
            '<stop offset="50%" stop-color="#8A6B24"/>' +
            '<stop offset="100%" stop-color="#E7CB7E"/>' +
          '</linearGradient>' +
          '<clipPath id="orb-suncl"><circle cx="32" cy="32" r="10.2"/></clipPath>' +
        '</defs>' +
        '<circle cx="32" cy="32" r="30" fill="none" stroke="url(#orb-sunrim)" stroke-width="1.6"/>' +
        '<circle cx="32" cy="32" r="27.8" fill="none" stroke="rgba(138,107,36,.4)" stroke-width=".5"/>' +
        '<g fill="#8A6B24" opacity=".8">' +
          '<circle cx="52.3" cy="11.7" r="1"/><circle cx="11.7" cy="11.7" r="1"/>' +
          '<circle cx="52.3" cy="52.3" r="1"/><circle cx="11.7" cy="52.3" r="1"/>' +
        '</g>' +
        /* the artisan's hand: two tiny nicks in the housing, never repeated */
        '<path d="M49.8,13.9 l1.5,1.1 M13.2,49.6 l1.2,1.4" stroke="rgba(90,70,20,.45)" stroke-width=".5" fill="none"/>' +
        '<g class="sun-corona" fill="none" stroke="#C9A84C">' +
          '<circle cx="32" cy="32" r="27" stroke-width=".7" stroke-dasharray="1 4.6" opacity=".5"/>' +
          '<circle cx="32" cy="32" r="23" stroke-width=".9" stroke-dasharray="8 3.4 2 3.4" opacity=".65"/>' +
        '</g>' +
        /* rays with physical depth: each cut ray casts its own fine shadow */
        '<g class="sun-rays" fill="none" stroke-linecap="round">' +
          '<g stroke="#6B5316" stroke-width="1.15" opacity=".4" transform="translate(.6,.8)">' +
            straight + waved +
          '</g>' +
          '<g stroke="#B08A3E" stroke-width="1.15">' +
            straight + waved +
          '</g>' +
        '</g>' +
        '<g class="sun-orbit">' +
          '<circle cx="32" cy="6" r="1.4" fill="#E7CB7E"/>' +
          '<circle cx="32" cy="58" r="1" fill="#E7CB7E" opacity=".75"/>' +
        '</g>' +
        '<circle cx="32" cy="32" r="10.2" fill="url(#orb-sunc)"/>' +
        /* brushed gold: fine concentric tool-lines under the engraving */
        '<g clip-path="url(#orb-suncl)" fill="none">' +
          '<circle cx="32" cy="32" r="5" stroke="rgba(250,237,184,.16)" stroke-width=".35"/>' +
          '<circle cx="32" cy="32" r="6.2" stroke="rgba(122,90,28,.16)" stroke-width=".35"/>' +
          '<circle cx="32" cy="32" r="7.4" stroke="rgba(250,237,184,.13)" stroke-width=".35"/>' +
          '<circle cx="32" cy="32" r="8.6" stroke="rgba(122,90,28,.14)" stroke-width=".35"/>' +
          '<circle cx="32" cy="32" r="9.5" stroke="rgba(250,237,184,.11)" stroke-width=".35"/>' +
        '</g>' +
        '<g clip-path="url(#orb-suncl)" fill="none" stroke="rgba(122,90,28,.3)" stroke-width=".5">' +
          [0,45,90,135,180,225,270,315].map(a =>
            '<circle cx="32" cy="27.5" r="6.5" transform="rotate(' + a + ' 32 32)"/>').join('') +
        '</g>' +
        '<ellipse class="orb-spec" cx="28.5" cy="27.5" rx="4.2" ry="3.2" fill="rgba(255,246,215,.5)"/>' +
        '<ellipse class="orb-spec2" cx="35.5" cy="36.5" rx="2.6" ry="1.8" fill="rgba(255,238,196,.16)"/>' +
        '<circle cx="32" cy="32" r="10.2" fill="none" stroke="#8A6B24" stroke-width=".8"/>' +
        '<circle cx="32" cy="32" r="7.8" fill="none" stroke="rgba(138,107,36,.55)" stroke-width=".5" stroke-dasharray="1 2.1"/>' +
      '</svg>' +
      /* THE MOON — a pearl-and-silver body set in its own silver mount:
         sphere-shaded surface, sculpted craters each lit from the same
         upper-left, its seas, the terminator, a turning halo, breathing
         gold stars — and the same reader's lamp gliding on the pearl.   */
      '<svg class="orb-moon" viewBox="0 0 64 64" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="orb-msurf" cx="38%" cy="32%" r="78%">' +
            '<stop offset="0%" stop-color="#F1F0EE"/>' +
            '<stop offset="35%" stop-color="#D7DCE5"/>' +
            '<stop offset="70%" stop-color="#AEB9C9"/>' +
            '<stop offset="100%" stop-color="#6E7887"/>' +
          '</radialGradient>' +
          '<radialGradient id="orb-mshade" cx="30%" cy="28%" r="85%">' +
            '<stop offset="58%" stop-color="rgba(10,16,26,0)"/>' +
            '<stop offset="100%" stop-color="rgba(10,16,26,.5)"/>' +
          '</radialGradient>' +
          '<linearGradient id="orb-mrim" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#E4E9F1"/>' +
            '<stop offset="50%" stop-color="#5E6878"/>' +
            '<stop offset="100%" stop-color="#C3CCDA"/>' +
          '</linearGradient>' +
          '<clipPath id="orb-mooncl"><circle cx="32" cy="32" r="15.2"/></clipPath>' +
          '<filter id="orb-mrough"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7"/>' +
            '<feColorMatrix type="matrix" values="0 0 0 0 0.36 0 0 0 0 0.4 0 0 0 0 0.47 0 0 0 0.4 -0.18"/></filter>' +
        '</defs>' +
        '<circle cx="32" cy="32" r="30" fill="none" stroke="url(#orb-mrim)" stroke-width="1.6"/>' +
        '<circle cx="32" cy="32" r="27.8" fill="none" stroke="rgba(94,104,120,.4)" stroke-width=".5"/>' +
        '<g fill="#5E6878" opacity=".8">' +
          '<circle cx="52.3" cy="11.7" r="1"/><circle cx="11.7" cy="11.7" r="1"/>' +
          '<circle cx="52.3" cy="52.3" r="1"/><circle cx="11.7" cy="52.3" r="1"/>' +
        '</g>' +
        '<g class="moon-stars" fill="#E7CB7E">' +
          '<circle cx="12" cy="17" r="1"/>' +
          '<circle cx="52" cy="12" r=".8"/>' +
          '<circle cx="53.5" cy="47" r="1.1"/>' +
        '</g>' +
        '<circle class="moon-halo" cx="32" cy="32" r="24" fill="none" stroke="#8E97A6" stroke-width=".6" stroke-dasharray="1 3.6" opacity=".5"/>' +
        '<circle cx="32" cy="32" r="15.2" fill="url(#orb-msurf)"/>' +
        /* the surface's fine roughness, ground into the pearl */
        '<g clip-path="url(#orb-mooncl)"><rect x="16" y="16" width="32" height="32" filter="url(#orb-mrough)" opacity=".35"/></g>' +
        '<ellipse cx="35.5" cy="27.5" rx="4.4" ry="3.2" fill="rgba(100,110,126,.35)"/>' +
        '<ellipse cx="27.5" cy="36.5" rx="3.4" ry="2.6" fill="rgba(100,110,126,.28)"/>' +
        /* sculpted craters: inner shadow toward the light, rim lit away from it */
        '<circle cx="26.6" cy="26.8" r="2.6" fill="rgba(88,98,114,.5)"/>' +
        '<ellipse cx="25.9" cy="26.1" rx="2" ry="1.9" fill="rgba(58,67,82,.45)"/>' +
        '<path d="M28.9,27.9 A2.6,2.6 0 0 1 25.8,29.3" fill="none" stroke="rgba(240,244,250,.5)" stroke-width=".5"/>' +
        '<circle cx="37.4" cy="35.8" r="1.6" fill="rgba(88,98,114,.45)"/>' +
        '<path d="M38.8,36.4 A1.6,1.6 0 0 1 36.9,37.2" fill="none" stroke="rgba(240,244,250,.4)" stroke-width=".4"/>' +
        '<circle cx="31.4" cy="41" r="1.2" fill="rgba(88,98,114,.4)"/>' +
        '<path d="M32.4,41.5 A1.2,1.2 0 0 1 30.9,42" fill="none" stroke="rgba(240,244,250,.35)" stroke-width=".4"/>' +
        '<circle cx="38.6" cy="30" r="1" fill="rgba(88,98,114,.38)"/>' +
        '<ellipse class="orb-spec" cx="27.5" cy="26.5" rx="4.6" ry="3.4" fill="rgba(255,255,250,.35)"/>' +
        '<ellipse class="orb-spec2" cx="36.5" cy="37.5" rx="2.8" ry="1.9" fill="rgba(214,226,244,.14)"/>' +
        '<circle cx="32" cy="32" r="15.2" fill="url(#orb-mshade)"/>' +
        '<circle cx="32" cy="32" r="15.2" fill="none" stroke="#677182" stroke-width=".7"/>' +
      '</svg>';
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
    const labelOrb = () => {
      orb.setAttribute('aria-label', isDark() ? 'Return to daylight' : 'Read by night');
      orb.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
    };
    labelOrb();
    navWrap.insertBefore(orb, navWrap.querySelector('.nav-burger'));
    const applyTheme = t => {
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
      window.dispatchEvent(new CustomEvent('sk-theme'));
      labelOrb();
    };
    /* The celestial event. To night: the sun rises to the centre of the
       sky, the moon crosses it to totality, the corona flares, and the
       eclipse's darkness engulfs the page. To day: the moon hangs alone,
       daylight builds behind its rim, and morning floods outward from it. */
    let eclipsing = false;
    orb.addEventListener('click', () => {
      if (eclipsing) return;
      const target = isDark() ? 'light' : 'dark';
      if (reduceMotion){ applyTheme(target); return; }
      eclipsing = true;
      const ov = document.createElement('div');
      ov.className = 'celestial ' + (target === 'dark' ? 'to-night' : 'to-day');
      ov.innerHTML =
        '<div class="cel-dusk"></div>' +
        '<div class="cel-sky"></div>' +
        (target === 'dark'
          ? '<svg class="cel-disc" viewBox="0 0 200 200" aria-hidden="true">' +
              '<circle class="cel-corona" cx="100" cy="100" r="52"/>' +
              '<circle class="cel-sun" cx="100" cy="100" r="44"/>' +
              '<circle class="cel-shadow" cx="100" cy="100" r="45"/>' +
            '</svg>'
          : '<svg class="cel-disc" viewBox="0 0 200 200" aria-hidden="true">' +
              '<circle class="cel-dawn" cx="100" cy="100" r="52"/>' +
              '<circle class="cel-moonb" cx="100" cy="100" r="44"/>' +
              '<circle cx="86" cy="88" r="7" fill="rgba(88,98,114,.4)"/>' +
              '<circle cx="112" cy="108" r="4.5" fill="rgba(88,98,114,.35)"/>' +
            '</svg>');
      document.body.appendChild(ov);
      /* the passage: the light of the whole world begins to turn first
         (twilight), the crossing happens inside it, then the new sky
         breathes in softly — no hard edges, a day actually ending.     */
      requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add('is-risen')));
      setTimeout(() => ov.classList.add('is-total'),     300);  // the crossing / the kindling
      setTimeout(() => ov.classList.add('is-engulfing'), 1250); // the new sky breathes in
      setTimeout(() => {                                        // under cover, the world turns
        applyTheme(target);
        ov.classList.add('is-clearing');
      }, 2250);
      setTimeout(() => { ov.remove(); eclipsing = false; }, 3100);
    });
  }

  /* ---- IX. Chrysography — gold written in metal, lit like metal --------
     Gold leaf is not a colour; it is a surface that answers the light.
     One slow light source follows the reader's hand across the desk, and
     every gilt letter on the dark plates catches it as it passes.       */
  if (finePointer && !reduceMotion){
    document.documentElement.classList.add('gold-lit');
    let gx = 0.5, gt = 0.5;
    window.addEventListener('pointermove', e => {
      gt = e.clientX / window.innerWidth;
    }, { passive: true });
    const shine = () => {
      gx += (gt - gx) * 0.028;                 // the lamp is heavy; it drifts
      document.documentElement.style.setProperty('--lx', gx.toFixed(4));
      requestAnimationFrame(shine);
    };
    requestAnimationFrame(shine);
  }

});
