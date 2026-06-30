/* =====================================================================
   THOIRAS-CORBÈS — contenu éditable (actualités + bandeau d'alerte)
   Lit assets/data/news.json et assets/data/site.json (édités via /admin)
   et injecte le contenu dans la page. En cas d'échec (ouverture en
   local sans serveur, JSON cassé…), le contenu statique de la page
   reste affiché : aucune page blanche.
   ===================================================================== */

(function () {
  'use strict';

  /* Échappe le texte saisi par la mairie (sécurité + mise en page) */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* "2026-06-01" -> { datetime: "2026-06", label: "Juin 2026" } */
  function frenchDate(value) {
    const d = new Date(value);
    if (isNaN(d)) return { datetime: '', label: '' };
    const datetime = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    let label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(d);
    label = label.charAt(0).toUpperCase() + label.slice(1);
    return { datetime, label };
  }

  function newsCard(item) {
    const alerte = !!item.alerte;
    const cat = esc(item.categorie || 'Information');
    const { datetime, label } = frenchDate(item.date);
    const linkLabel = item.lien_label ? esc(item.lien_label) : '';
    const linkUrl = esc(item.lien_url || '#contact');
    return (
      '<article class="news-card' + (alerte ? ' news-card--alert' : '') + ' reveal">' +
        '<div class="news-top">' +
          '<span class="news-cat' + (alerte ? ' news-cat--alert' : '') + '">' + cat + '</span>' +
          '<time datetime="' + esc(datetime) + '">' + esc(label) + '</time>' +
        '</div>' +
        '<h3>' + esc(item.titre || '') + '</h3>' +
        '<p>' + esc(item.texte || '') + '</p>' +
        (linkLabel ? '<a class="news-link" href="' + linkUrl + '">' + linkLabel + '</a>' : '') +
      '</article>'
    );
  }

  async function loadNews() {
    const res = await fetch('assets/data/news.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('news.json introuvable');
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    const grid = document.querySelector('.news-grid');
    if (!grid || !items.length) return;
    grid.innerHTML = items.map(newsCard).join('');
  }

  async function loadAlert() {
    const res = await fetch('assets/data/site.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('site.json introuvable');
    const s = await res.json();
    const bar = document.querySelector('.alert-bar');
    if (!bar) return;

    if (s.alerte_active === false) {
      bar.classList.add('is-hidden');
      return;
    }
    bar.classList.remove('is-hidden');

    const tagEl = bar.querySelector('.alert-tag');
    if (tagEl && s.alerte_tag) {
      const svg = tagEl.querySelector('svg');
      tagEl.innerHTML = (svg ? svg.outerHTML : '') + ' ' + esc(s.alerte_tag);
    }

    const p = bar.querySelector('.alert-inner > p');
    if (p && s.alerte_texte) {
      const linkLabel = s.alerte_lien_label ? esc(s.alerte_lien_label) : '';
      const linkUrl = esc(s.alerte_lien_url || '#actualites');
      p.innerHTML = esc(s.alerte_texte) +
        (linkLabel ? ' <a href="' + linkUrl + '">' + linkLabel + '</a>' : '');
    }
  }

  /* main.js attend cette promesse avant d'initialiser les révélations,
     pour que les cartes injectées soient bien animées. allSettled :
     ne rejette jamais -> un fichier manquant n'empêche pas le reste. */
  window.contentReady = Promise.allSettled([loadNews(), loadAlert()]);
})();
