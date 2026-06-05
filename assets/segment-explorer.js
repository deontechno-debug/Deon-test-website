/* ============================================================
   Industry Segment Explorer — engine (window.SegmentExplorer)
   Market-agnostic. Renders entirely from a config object; contains
   NO market-specific logic. Adding a market = a config object + a
   <div class="segexp" data-explorer="GLOBAL_NAME"></div>. No edits here.
   See research/2026-06-05-industry-segment-explorer-spec.md
   ============================================================ */
(function () {
  'use strict';

  var ARROW = '<svg class="segexp-prod-arrow" width="20" height="12" viewBox="0 0 24 16" fill="none" aria-hidden="true"><path d="M0 8H21M12 1L21 8L12 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var DL = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function node(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function block(title, inner) {
    return '<div class="segexp-block"><h3 class="segexp-block-title">' + esc(title) + '</h3>' + inner + '</div>';
  }

  function buildTab(seg, market, i) {
    var icon = seg.icon ? '<span class="segexp-tab-icon">' + seg.icon + '</span>' : '';
    return node(
      '<button class="segexp-tab" type="button" role="tab"' +
      ' id="segexp-' + esc(market) + '-tab-' + esc(seg.id) + '"' +
      ' aria-controls="segexp-' + esc(market) + '-panel-' + esc(seg.id) + '"' +
      ' aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-index="' + i + '">' +
      icon + '<span class="segexp-tab-label">' + esc(seg.label) + '</span></button>'
    );
  }

  function buildPanel(seg, market) {
    // Diagrams load eagerly (~4 per market, and they are the visual centrepiece)
    // so switching segments is instant rather than flashing an empty box.
    var img = seg.diagram ?
      '<div class="segexp-visual-media"><img src="' + esc(seg.diagram.src) + '" alt="' +
      esc(seg.diagram.alt || seg.label) + '" decoding="async"></div>' : '';
    var caption = (seg.diagram && seg.diagram.caption) ?
      '<div class="segexp-visual-caption">' + esc(seg.diagram.caption) + '</div>' : '';

    var challenges = (seg.challenges && seg.challenges.length) ?
      block('Manufacturing challenges', '<ul class="segexp-challenges">' +
        seg.challenges.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>') : '';

    var apps = (seg.applications && seg.applications.length) ?
      block('Typical applications', '<ul class="segexp-apps">' +
        seg.applications.map(function (a) {
          return '<li><span class="segexp-app-name">' + esc(a.name) + '</span>' +
            (a.desc ? '<span class="segexp-app-desc">' + esc(a.desc) + '</span>' : '') + '</li>';
        }).join('') + '</ul>') : '';

    var products = (seg.products && seg.products.length) ?
      block('Recommended DEON product families', '<ul class="segexp-products">' +
        seg.products.map(function (p) {
          return '<li><a href="' + esc(p.href || '#') + '"><span class="segexp-prod-family">' +
            esc(p.family) + '</span><span class="segexp-prod-note">' + esc(p.note || '') + '</span>' +
            ARROW + '</a></li>';
        }).join('') + '</ul>') : '';

    var resource = seg.resource ?
      '<a class="segexp-resource" href="' + esc(seg.resource.href || '#') + '">' + DL +
      '<span>' + esc(seg.resource.label) + '</span>' +
      (seg.resource.meta ? '<span class="segexp-resource-meta">' + esc(seg.resource.meta) + '</span>' : '') +
      '</a>' : '';

    return node(
      '<div class="segexp-panel" role="tabpanel" hidden' +
      ' id="segexp-' + esc(market) + '-panel-' + esc(seg.id) + '"' +
      ' aria-labelledby="segexp-' + esc(market) + '-tab-' + esc(seg.id) + '">' +
      '<div class="segexp-visual">' + img + caption + '</div>' +
      '<div class="segexp-content">' +
      (seg.summary ? '<p class="segexp-summary">' + esc(seg.summary) + '</p>' : '') +
      challenges + apps + products + resource +
      '</div></div>'
    );
  }

  function mount(root, config) {
    if (!root || !config || !Array.isArray(config.segments) || !config.segments.length) return;
    var market = config.market || 'market';
    var segs = config.segments;

    root.classList.add('segexp', 'segexp--' + (config.variant || 'rail-top'));
    if (config.accent) root.style.setProperty('--segexp-accent', config.accent);

    var head = node('<div class="segexp-head"></div>');
    if (config.eyebrow) head.appendChild(node('<div class="segexp-eyebrow">' + esc(config.eyebrow) + '</div>'));
    if (config.title) head.appendChild(node('<h2 class="segexp-title">' + esc(config.title) + '</h2>'));
    if (config.intro) head.appendChild(node('<p class="segexp-intro">' + esc(config.intro) + '</p>'));

    var rail = node('<div class="segexp-rail" role="tablist" aria-label="' + esc(config.title || market) + ' segments"></div>');
    var stage = node('<div class="segexp-stage"></div>');

    var tabs = [], panels = [];
    segs.forEach(function (seg, i) {
      var t = buildTab(seg, market, i), p = buildPanel(seg, market);
      tabs.push(t); panels.push(p);
      rail.appendChild(t); stage.appendChild(p);
    });

    root.appendChild(head); root.appendChild(rail); root.appendChild(stage);

    var active = 0;
    function activate(i, focus, pushHash) {
      i = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, j) {
        var on = j === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, j) {
        var on = j === i;
        p.hidden = !on;
        p.classList.toggle('is-active', on);
      });
      active = i;
      if (focus) tabs[i].focus();
      try { localStorage.setItem('segexp:' + market, segs[i].id); } catch (e) {}
      if (pushHash && history.replaceState) history.replaceState(null, '', '#' + market + '=' + segs[i].id);
    }

    rail.addEventListener('click', function (e) {
      var btn = e.target.closest('.segexp-tab');
      if (btn) activate(+btn.dataset.index, false, true);
    });
    rail.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': e.preventDefault(); activate(active + 1, true, true); break;
        case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); activate(active - 1, true, true); break;
        case 'Home': e.preventDefault(); activate(0, true, true); break;
        case 'End': e.preventDefault(); activate(tabs.length - 1, true, true); break;
      }
    });

    // Initial segment: URL hash > stored > first
    var start = 0, want = null;
    var hash = (location.hash || '').replace('#', '');
    if (hash.indexOf(market + '=') === 0) want = hash.slice((market + '=').length);
    if (!want) { try { want = localStorage.getItem('segexp:' + market); } catch (e) {} }
    if (want) {
      var idx = segs.findIndex(function (s) { return s.id === want; });
      if (idx >= 0) start = idx;
    }
    activate(start, false, false);
  }

  function autoInit() {
    document.querySelectorAll('.segexp[data-explorer]').forEach(function (root) {
      if (root.dataset.segexpMounted) return;
      var cfg = window[root.getAttribute('data-explorer')];
      if (cfg) { mount(root, cfg); root.dataset.segexpMounted = '1'; }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit);
  else autoInit();

  window.SegmentExplorer = { mount: mount, init: autoInit };
})();
