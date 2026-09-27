/* =============================================
   WARN Nepal – main.js
   Works with file:// (no server needed).
   All image paths are hardcoded — no probing.
   ============================================= */
'use strict';

/* ─────────────────────────────────────────────
   IMAGE MANIFEST
   Update these paths when you add/change images.
   Use the exact filename including extension.
   ───────────────────────────────────────────── */
const IMAGES = {
  /* Drop your logo in images/logo/ using any of these names.
     The first file that loads is used for the navbar, footer AND favicon. */
  logoCandidates: [
    'images/logo/logo.png',
    'images/logo/logo.jpg',
    'images/logo/logo.jpeg',
    'images/logo/logo.webp',
    'images/logo/logo.svg'
  ],
  landing: 'images/landing/landing.jpg',

  /* Team photos — found automatically as images/team/<data-photo slug>.<ext>
     e.g. images/team/kamala-pandey.jpg. Missing photos keep the icon. */
  teamDir: 'images/team/',
  teamExts: ['jpg', 'jpeg', 'png', 'webp'],

  /* Biodata files — filename (without extension) must match data-biodata slug.
     Put files in biodata/  e.g. biodata/narayani-tiwari.pdf */
  biodata: {
    'narayani-tiwari':        'biodata/narayani-tiwari.pdf',
    'timila-yami':            'biodata/timila-yami.pdf',
    'jamuna-tamrakar-sayami': 'biodata/jamuna-tamrakar-sayami.pdf',
    'pragya-acharya-gautam':  'biodata/pragya-acharya-gautam.pdf',
    'shila-yogi':             'biodata/shila-yogi.pdf',
    'parvati-kattel':         'biodata/parvati-kattel.pdf',
    'shiva-laxmi-upadhyay':   null,
    'renuka-kattel':          'biodata/renuka-kattel.pdf',
    'narmada-thapa':          'biodata/narmada-thapa.pdf',
    'sabita-kandel':          'biodata/sabita-kandel.pdf',
    'jyoti-panta':            null,
    'kamala-pandey':          null
  },

  /* Gallery — comes from js/gallery-images.js, which is regenerated
     by update-gallery.bat so every file in images/gallery/ shows up.
     Caption is derived from the filename automatically. */
  gallery: window.GALLERY_FILES || []
};

/* ─────────────────────────────────────────────
   UTILITY: filename → pretty caption
   "community-program.png" → "Community Program"
   ───────────────────────────────────────────── */
function fileToCaption(path) {
  return path.split('/').pop()
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* ─────────────────────────────────────────────
   LOGO + FAVICON
   Tries each candidate path in order. The first one
   that actually loads is placed in the navbar/footer
   and reused as the favicon. If none load, the "W"
   letter badge already in the HTML stays put.
   ───────────────────────────────────────────── */
function setFavicon(src) {
  document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(l => l.remove());
  ['icon', 'apple-touch-icon'].forEach(rel => {
    const link = document.createElement('link');
    link.rel  = rel;
    link.href = src;
    document.head.appendChild(link);
  });
}

function applyLogo(src) {
  document.querySelectorAll('.logo-img-wrap').forEach(wrap => {
    wrap.innerHTML = '';
    const img     = document.createElement('img');
    img.src       = src;
    img.alt       = 'WARN Nepal logo';
    img.className = 'logo-img';
    wrap.appendChild(img);
  });
  setFavicon(src);
}

function initLogo() {
  const candidates = IMAGES.logoCandidates || [];

  (function tryNext(i) {
    if (i >= candidates.length) return;  /* keep the "W" badge fallback */
    const probe = new Image();
    probe.onload  = () => applyLogo(candidates[i]);
    probe.onerror = () => tryNext(i + 1);
    probe.src     = candidates[i];
  })(0);
}

/* ─────────────────────────────────────────────
   LANDING / HERO BACKGROUND
   ───────────────────────────────────────────── */
function initLandingImage() {
  const hero = document.getElementById('home');
  if (!hero || !IMAGES.landing) return;

  /* Sizing lives in CSS (.hero::before / ::after). The URL is made absolute
     because a relative url() inside a custom property may be resolved
     against the stylesheet's folder instead of the page. */
  const src = new URL(IMAGES.landing, document.baseURI).href;
  hero.style.setProperty('--hero-img', `url('${src}')`);
  hero.classList.add('has-bg-image');

  /* Use the photo's real shape so a replacement image is never stretched */
  const probe  = new Image();
  probe.onload = () => {
    if (probe.naturalWidth && probe.naturalHeight) {
      hero.style.setProperty('--hero-img-ratio', `${probe.naturalWidth} / ${probe.naturalHeight}`);
    }
  };
  probe.src = src;
}

/* ─────────────────────────────────────────────
   TEAM PHOTOS
   ───────────────────────────────────────────── */
function initTeamPhotos() {
  document.querySelectorAll('.team-avatar[data-photo]').forEach(avatar => {
    const slug = avatar.getAttribute('data-photo');
    const name = avatar.closest('.team-card')?.querySelector('h4')?.textContent.trim() || slug;

    (function tryNext(i) {
      if (i >= IMAGES.teamExts.length) return;  /* keep icon fallback */
      const img   = new Image();
      img.onload  = () => {
        img.alt = name;
        avatar.innerHTML = '';
        avatar.appendChild(img);
        avatar.classList.add('has-photo');
      };
      img.onerror = () => tryNext(i + 1);
      img.src     = IMAGES.teamDir + slug + '.' + IMAGES.teamExts[i];
    })(0);
  });
}

/* ─────────────────────────────────────────────
   BIODATA DOWNLOAD LINKS
   Matches data-biodata slug → biodata/<slug>.pdf
   ───────────────────────────────────────────── */
function initBiodataLinks() {
  document.querySelectorAll('[data-biodata]').forEach(link => {
    const slug = link.getAttribute('data-biodata');
    const src  = IMAGES.biodata[slug];
    if (!src) {
      link.classList.add('is-missing');
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', e => e.preventDefault());
      return;
    }
    link.href = src;
    link.setAttribute('download', `${slug}-biodata.pdf`);
    link.setAttribute('aria-label', 'Download biodata');
  });
}

/* ─────────────────────────────────────────────
   GALLERY PREVIEW (index.html)
   Shows up to 5 thumbnails, pads with placeholders
   ───────────────────────────────────────────── */
function initGalleryPreview() {
  const grid = document.getElementById('galleryPreviewGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const SLOTS = Math.min(5, IMAGES.gallery.length || 5);

  for (let i = 0; i < SLOTS; i++) {
    const src  = IMAGES.gallery[i];
    const item = document.createElement('a');
    item.href      = 'gallery.html';
    item.className = 'gp-item';
    item.setAttribute('aria-label', src ? fileToCaption(src) : 'View gallery');

    if (src) {
      const caption = fileToCaption(src);
      item.innerHTML = `
        <img src="${src}" alt="${caption}" loading="lazy" />
        <div class="gp-caption">${caption}</div>`;
    } else {
      item.innerHTML = `
        <div class="gp-placeholder">
          <i class="fa-solid fa-image"></i>
          <span>Add photos to images/gallery/ then run update-gallery.bat</span>
        </div>`;
    }
    grid.appendChild(item);
  }
}

/* ─────────────────────────────────────────────
   LANGUAGE
   ───────────────────────────────────────────── */
let currentLang = localStorage.getItem('warn_lang') || 'en';

window.setLang = function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('warn_lang', lang);

  const btnEN = document.getElementById('langEN');
  const btnNP = document.getElementById('langNP');
  if (btnEN) btnEN.classList.toggle('active', lang === 'en');
  if (btnNP) btnNP.classList.toggle('active', lang === 'np');

  document.body.classList.toggle('lang-np', lang === 'np');

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (!text) return;
    if (el.tagName === 'H1' || el.classList.contains('hero-title')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  document.documentElement.lang = lang === 'np' ? 'ne' : 'en';
};


/* ─────────────────────────────────────────────
   NAVBAR scroll behaviour
   ───────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

function handleScroll() {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  const btt = document.getElementById('backToTop');
  if (btt) btt.classList.toggle('visible', window.scrollY > 300);
  if (!window.location.pathname.endsWith('gallery.html')) updateActiveNav();
}
window.addEventListener('scroll', handleScroll, { passive: true });

const NAV_SECTIONS = ['home', 'about', 'gallery', 'purpose', 'programs', 'team', 'contact'];
function updateActiveNav() {
  let current = 'home';
  NAV_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 80) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').replace('index.html', '');
    link.classList.toggle('active', href === '#' + current);
  });
}

/* ─────────────────────────────────────────────
   HAMBURGER
   ───────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

/* ─────────────────────────────────────────────
   BACK TO TOP
   ───────────────────────────────────────────── */
const bttBtn = document.getElementById('backToTop');
if (bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─────────────────────────────────────────────
   SMOOTH SCROLL for same-page anchors
   ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      ) || 68;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  });
});

/* ─────────────────────────────────────────────
   FADE-UP INTERSECTION OBSERVER
   ───────────────────────────────────────────── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.purpose-card, .team-card, .focus-item, .stat-item').forEach(el => {
  el.classList.add('fade-up');
  fadeObs.observe(el);
});

/* ─────────────────────────────────────────────
   INIT  — runs on every page
   ───────────────────────────────────────────── */
(function init() {
  setLang(currentLang);
  handleScroll();
  initLogo();
  initLandingImage();
  initTeamPhotos();
  initBiodataLinks();
  initGalleryPreview();
})();
