/* =====================================================================
   THOIRAS-CORBÈS — moteur d'animation
   GSAP 3.15 · ScrollTrigger · ScrollToPlugin
   Skills : gsap-core · gsap-timeline · gsap-scrolltrigger
            gsap-plugins · gsap-performance
   ===================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
document.body.classList.add('is-ready');

/* ─── ANIMATIONS DÉCORATIVES (sous garde reduced-motion) ─── */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', async () => {

  /* HERO — entrée orchestrée */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
  heroTL
    .from('.gov-bar', { y: -20, opacity: 0, duration: 0.5 })
    .from('#navbar', { y: -24, opacity: 0, duration: 0.55 }, '-=0.3')
    .from('.alert-bar', { y: -16, opacity: 0, duration: 0.45 }, '-=0.35')
    .from('.hero-eyebrow', { opacity: 0, y: 18, duration: 0.5 }, '-=0.1')
    .from('.ht-line', { opacity: 0, yPercent: 60, rotationX: -35, transformOrigin: '50% 100%', stagger: 0.12, duration: 0.85, ease: 'back.out(1.4)' }, '-=0.2')
    .from('.ht-amp', { opacity: 0, scale: 0.4, rotate: -40, duration: 0.6, ease: 'back.out(2)' }, '-=0.55')
    .from('.hero-sub', { opacity: 0, y: 18, duration: 0.55 }, '-=0.4')
    .from('.hero-actions .btn', { opacity: 0, y: 16, stagger: 0.1, duration: 0.45 }, '-=0.3')
    .from('.hero-facts > div', { opacity: 0, y: 14, stagger: 0.08, duration: 0.45 }, '-=0.25')
    .from('.hero-scroll', { opacity: 0, duration: 0.4 }, '-=0.1');

  /* Tracé progressif des lignes de niveau (signature cartographique) */
  document.querySelectorAll('.hero-contours .ctr').forEach((path, i) => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, duration: 2.4, delay: 0.4 + i * 0.12, ease: 'power2.inOut' });
  });

  /* Parallaxe douce des contours au scroll */
  gsap.to('.hero-contours', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* Attendre l'injection du contenu éditable (actualités, alerte)
     pour que les cartes générées soient bien révélées au scroll. */
  if (window.contentReady) { try { await window.contentReady; } catch (e) {} }

  /* Révélations génériques au scroll */
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  /* En-têtes de section : eyebrow + titre + lead */
  gsap.utils.toArray('.section-head').forEach(head => {
    const items = head.querySelectorAll('.eyebrow, .display, .section-lead, h2, p');
    gsap.from(items, {
      opacity: 0, y: 22, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: head, start: 'top 82%' }
    });
  });

  /* Grilles : stagger groupé via batch (performant) */
  ['.service-grid', '.news-grid', '.tour-grid'].forEach(sel => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    ScrollTrigger.batch(grid.children, {
      start: 'top 88%', once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: { amount: 0.35 }, duration: 0.7, ease: 'power3.out' })
    });
  });

  /* Diptyque villages : convergence depuis les côtés */
  const villages = gsap.utils.toArray('.village');
  if (villages.length === 2) {
    gsap.timeline({ scrollTrigger: { trigger: '.village-diptych', start: 'top 78%' } })
      .to(villages[0], { opacity: 1, y: 0, x: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo(villages[1], { opacity: 0, x: 40, y: 26 }, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo('.vl-river', { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.4');
  }

  /* Légère parallaxe des contours du bloc tourisme */
  gsap.to('.tour-contours', {
    yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: '#tourisme', start: 'top bottom', end: 'bottom top', scrub: 1.4 }
  });

  ScrollTrigger.refresh();
  return () => {};
});

/* ─── INTERACTIONS PERMANENTES ─── */

/* Navbar : état "scrolled" */
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
  start: 'top -60',
  onUpdate: self => navbar.classList.toggle('scrolled', self.scroll() > 60)
});
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* Menu mobile */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
hamburger?.addEventListener('click', () => {
  const open = !hamburger.classList.contains('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    gsap.fromTo(mobileMenu.querySelectorAll('a'),
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out', delay: 0.1 });
  }
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* Fermeture de l'alerte */
const alertBar = document.querySelector('.alert-bar');
document.querySelector('.alert-close')?.addEventListener('click', () => {
  gsap.to(alertBar, {
    height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut',
    onComplete: () => { alertBar.classList.add('is-hidden'); ScrollTrigger.refresh(); }
  });
});

/* Contraste renforcé (accessibilité) — mémorisé */
const contrastBtn = document.querySelector('.contrast-toggle');
const applyContrast = on => {
  document.body.classList.toggle('hc', on);
  contrastBtn.setAttribute('aria-pressed', String(on));
};
if (localStorage.getItem('tc-contrast') === '1') applyContrast(true);
contrastBtn?.addEventListener('click', () => {
  const on = !document.body.classList.contains('hc');
  applyContrast(on);
  localStorage.setItem('tc-contrast', on ? '1' : '0');
});

/* Smooth scroll sur les ancres */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { duration: 0.9, scrollTo: { y: target, offsetY: 84 }, ease: 'power3.inOut' });
  });
});
