/* =============================================
   WARN Nepal – gallery.js  (gallery.html only)
   Works with file:// — no server needed.
   All image paths are hardcoded here.
   ============================================= */
'use strict';

/* ─────────────────────────────────────────────
   GALLERY IMAGE LIST
   Add the full path of every image in images/gallery/.
   Caption = filename without extension, auto-formatted.
   ───────────────────────────────────────────── */
const GALLERY_IMAGES = [
  'images/gallery/awareness.jpg',
  'images/gallery/chitwan-camp.jpg',
  'images/gallery/flood-relief.jpg',
  'images/gallery/flood-relief-camp.jpeg',
  'images/gallery/handover-of-goods.jpg',
  'images/gallery/health-camp-chitwan.jpg',
  'images/gallery/health-camp-chitwan-2.jpg',
  'images/gallery/health-camp-chitwan-3.jpg',
  'images/gallery/lele-relief.jpg',
  'images/gallery/items-donated.jpg',
  'images/gallery/scholarship.jpg',
  'images/gallery/community-1.jpg',
  'images/gallery/community-2.jpg',
  'images/gallery/community-3.jpg'
];

/* ─────────────────────────────────────────────
   UTILITY
   ───────────────────────────────────────────── */
function fileToCaption(path) {
  return path.split('/').pop()
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* Build slide data array */
const slides = GALLERY_IMAGES.map(src => ({ src, caption: fileToCaption(src) }));

/* ─────────────────────────────────────────────
   STATE
   ───────────────────────────────────────────── */
let current  = 0;
let autoTimer = null;
const AUTO_MS = 4500;

/* ─────────────────────────────────────────────
   SLIDESHOW
   ───────────────────────────────────────────── */
function buildSlideshow() {
  const track = document.getElementById('slideshowTrack');
  const dots  = document.getElementById('slideDots');
  if (!track) return;

  track.innerHTML = '';
  dots.innerHTML  = '';

  if (slides.length === 0) {
    track.innerHTML = `
      <div class="slide active">
        <div class="slide-img-placeholder">
          <i class="fa-solid fa-folder-open"></i>
          <p>Add image paths to <strong>GALLERY_IMAGES</strong> in js/gallery.js</p>
        </div>
      </div>`;
    const bar = document.getElementById('slideCaptionBar');
    if (bar) bar.style.display = 'none';
    return;
  }

  slides.forEach((s, i) => {
    /* slide */
    const div = document.createElement('div');
    div.className = 'slide' + (i === 0 ? ' active' : '');
    div.setAttribute('role', 'tabpanel');
    div.setAttribute('aria-label', s.caption);

    const img   = document.createElement('img');
    img.src     = s.src;
    img.alt     = s.caption;
    img.loading = i === 0 ? 'eager' : 'lazy';
    /* Make image fill the slide area properly */
    img.style.width      = '100%';
    img.style.height     = '100%';
    img.style.objectFit  = 'cover';   /* fill — crops slightly */
    img.style.display    = 'block';
    div.appendChild(img);
    track.appendChild(div);

    /* dot */
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}: ${s.caption}`);
    dot.setAttribute('aria-selected', String(i === 0));
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  updateCaption();
  if (slides.length > 1) startAuto();
}

function goTo(n) {
  const divs = document.querySelectorAll('#slideshowTrack .slide');
  const dots  = document.querySelectorAll('#slideDots .slide-dot');
  if (!divs.length) return;

  divs[current].classList.remove('active');
  if (dots[current]) { dots[current].classList.remove('active'); dots[current].setAttribute('aria-selected', 'false'); }

  current = ((n % slides.length) + slides.length) % slides.length;

  divs[current].classList.add('active');
  if (dots[current]) { dots[current].classList.add('active'); dots[current].setAttribute('aria-selected', 'true'); }

  updateCaption();
  resetAuto();
}

function updateCaption() {
  const capEl = document.getElementById('slideCaptionText');
  const cntEl = document.getElementById('slideCounter');
  if (!capEl || !slides.length) return;
  capEl.textContent = slides[current].caption;
  if (cntEl) cntEl.textContent = `${current + 1} / ${slides.length}`;
}

function startAuto() { autoTimer = setInterval(() => goTo(current + 1), AUTO_MS); }
function resetAuto()  { clearInterval(autoTimer); startAuto(); }
function stopAuto()   { clearInterval(autoTimer); }

/* Controls */
document.getElementById('slidePrev')?.addEventListener('click', () => goTo(current - 1));
document.getElementById('slideNext')?.addEventListener('click', () => goTo(current + 1));

/* Keyboard (only when lightbox is closed) */
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (lb && !lb.hidden) return;
  if (e.key === 'ArrowLeft')  goTo(current - 1);
  if (e.key === 'ArrowRight') goTo(current + 1);
});

/* Touch swipe */
(function() {
  const track = document.getElementById('slideshowTrack');
  if (!track) return;
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    else if (slides.length > 1) startAuto();
  }, { passive: true });
})();

/* Pause on hover */
(function() {
  const wrap = document.querySelector('.slideshow-wrap');
  if (!wrap) return;
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', () => { if (slides.length > 1) startAuto(); });
})();

/* ─────────────────────────────────────────────
   FULL GRID
   ───────────────────────────────────────────── */
const gridFadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); gridFadeObs.unobserve(e.target); }
  });
}, { threshold: 0.08 });

function buildFullGrid() {
  const grid = document.getElementById('galleryFullGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (slides.length === 0) {
    grid.innerHTML = `
      <div class="gf-placeholder no-images">
        <i class="fa-solid fa-folder-open"></i>
        <p>No images found.<br>Add paths to <strong>GALLERY_IMAGES</strong> in js/gallery.js</p>
      </div>`;
    return;
  }

  slides.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'gf-item fade-up';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Open ${s.caption}`);

    const img   = document.createElement('img');
    img.src     = s.src;
    img.alt     = s.caption;
    img.loading = 'lazy';

    const cap   = document.createElement('div');
    cap.className   = 'gf-caption';
    cap.textContent = s.caption;

    item.appendChild(img);
    item.appendChild(cap);

    const open = () => openLightbox(i);
    item.addEventListener('click', open);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });

    grid.appendChild(item);
    gridFadeObs.observe(item);
  });
}

/* ─────────────────────────────────────────────
   LIGHTBOX
   ───────────────────────────────────────────── */
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  const lb       = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  lb.hidden = false;
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').hidden = true;
  document.getElementById('lightboxBackdrop').classList.remove('active');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const s   = slides[lbIndex];
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  img.src         = s.src;
  img.alt         = s.caption;
  cap.textContent = `${s.caption}  (${lbIndex + 1} / ${slides.length})`;
}

document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
document.getElementById('lightboxBackdrop')?.addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev')?.addEventListener('click', () => {
  lbIndex = ((lbIndex - 1) + slides.length) % slides.length;
  renderLightbox();
});
document.getElementById('lightboxNext')?.addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % slides.length;
  renderLightbox();
});

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.hidden) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  { lbIndex = ((lbIndex - 1) + slides.length) % slides.length; renderLightbox(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % slides.length; renderLightbox(); }
});

/* ─────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────── */
buildSlideshow();
buildFullGrid();
