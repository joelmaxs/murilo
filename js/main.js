/* Murilo Zennaro — scripts do site
   Os projetos vêm de data/projetos.json (editado pelo painel do Pages CMS).
   Nada é obrigatório além do nome e da capa: campos vazios simplesmente não aparecem. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var LL = function (pt, en) { pt = pt || ''; en = en || pt; return pt === en ? esc(pt) : '<span data-l="pt">' + esc(pt) + '</span><span data-l="en">' + esc(en) + '</span>'; };
  var arr = function (v) { return Array.isArray(v) ? v : (v ? [v] : []); };
  var urlOk = function (u) { u = String(u || '').trim(); if (!u) return ''; if (/^(https?:|mailto:)/i.test(u)) return u; if (/^[\w.-]+\.[a-z]{2,}/i.test(u)) return 'https://' + u; return ''; };

  /* ano */
  $$('.mz-year').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* idioma PT / EN (lembra a escolha) */
  var setL = function (l) {
    root.classList.toggle('en', l === 'en'); root.lang = l === 'en' ? 'en' : 'pt-BR';
    try { localStorage.setItem('mz-lang', l); } catch (e) {}
  };
  var saved = null; try { saved = localStorage.getItem('mz-lang'); } catch (e) {}
  setL(saved || 'pt');

  /* hero: troca as fotos a cada 10s */
  var k = 0, hi = $$('.hs-im img');
  if (hi.length > 1) setInterval(function () {
    hi[k].classList.remove('on'); k = (k + 1) % hi.length; hi[k].classList.add('on');
    var n = $('.hs-n'); if (n) n.textContent = pad(k + 1);
    var bar = $('.hf .cn i'); if (bar) { bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = ''; }
  }, 10000);

  /* entrada das seções ao rolar */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 }) : null;
  var watch = function (els) { els.forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); }); };
  watch($$('[data-rv]'));

  /* ---------- projetos ---------- */
  var P = [];
  var norm = function (p) {
    p = p || {};
    var imgs = arr(p.imagens).map(function (x) { return typeof x === 'string' ? x : (x && (x.imagem || x.src)) || ''; }).filter(Boolean);
    var capa = p.capa || imgs[0] || '';
    return {
      on: p.publicado !== false,
      t: p.titulo || '', te: p.titulo_en || '',
      c: p.categoria || '', ce: p.categoria_en || '',
      d: p.descricao || '', de: p.descricao_en || '',
      capa: capa,
      imgs: p.mostrar_capa_na_galeria === false ? imgs.filter(function (x) { return x !== capa; }) : [capa].concat(imgs.filter(function (x) { return x !== capa; })).filter(Boolean),
      one: /uma/i.test(p.galeria || ''),
      info: arr(p.informacoes).filter(function (x) { return x && x.valor; }),
      links: arr(p.links).map(function (x) { return { u: urlOk(x && x.url), t: (x && x.texto) || '', te: (x && x.texto_en) || '' }; }).filter(function (x) { return x.u; })
    };
  };
  var GO = '<span class="go" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 4H20V18H16V10.8L6.4 20.4 3.6 17.6 13.2 8H6Z" fill="currentColor"/></svg></span>';
  var grid = $('#mz-grid');
  function renderGrid() {
    if (!grid) return;
    if (!P.length) { grid.innerHTML = '<p class="mono mu mz-empty">' + LL('Projetos em breve.', 'Projects coming soon.') + '</p>'; return; }
    grid.innerHTML = P.map(function (p, i) {
      return '<a class="it" data-rv href="#trabalhos" data-i="' + i + '" role="button" aria-haspopup="dialog" style="--d:' + (i % 4) * 0.09 + 's">' +
        '<div class="cp"><h3>' + LL(p.t, p.te) + '</h3><span class="mono bl">' + pad(i + 1) + '</span></div>' +
        '<div class="im">' + (p.capa ? '<img src="' + esc(p.capa) + '" alt="' + esc(p.t) + '" loading="lazy">' : '') + GO + '</div>' +
        (p.c ? '<span class="mono mu">' + LL(p.c, p.ce) + '</span>' : '') + '</a>';
    }).join('');
    watch($$('.it', grid));
  }

  /* detalhe do projeto */
  var pv = $('.pv'), bd = $('.pv-bd'), cur = 0, outT = 0;
  function body(p) {
    var h = '<div class="pv-info"><div class="in">';
    if (p.c) h += '<span class="mono bl">' + LL(p.c, p.ce) + '</span>';
    h += '<h2 class="pv-t" id="pv-t">' + LL(p.t, p.te) + '</h2>';
    if (p.d || p.de) h += '<div class="pv-d">' + (p.d && p.de ? '<div data-l="pt">' + txt(p.d) + '</div><div data-l="en">' + txt(p.de) + '</div>' : txt(p.d || p.de)) + '</div>';
    if (p.info.length) h += '<dl class="pv-dl mono">' + p.info.map(function (x) { return '<div><dt class="mu">' + LL(x.rotulo, x.rotulo_en) + '</dt><dd>' + LL(x.valor, x.valor_en) + '</dd></div>'; }).join('') + '</dl>';
    if (p.links.length) h += '<div class="pv-lks">' + p.links.map(function (l) {
      var host = ''; try { host = new URL(l.u).hostname.replace(/^www\./, ''); } catch (e) {}
      return '<a class="pv-bh mono" href="' + esc(l.u) + '" target="_blank" rel="noopener noreferrer"><span>' + (l.t ? LL(l.t, l.te) : LL('Ver projeto', 'View project') + (host ? ' — ' + esc(host) : '')) + '</span><span>↗</span></a>';
    }).join('') + '</div>';
    h += '</div></div><div class="pv-g' + (p.one ? ' one' : '') + '">' +
      p.imgs.map(function (src, j) { return '<figure><img src="' + esc(src) + '" alt="' + esc(p.t) + ' — ' + (j + 1) + '"' + (j > 1 ? ' loading="lazy"' : '') + '></figure>'; }).join('') + '</div>';
    return h;
  }
  function txt(s) { return esc(s).split(/\n{2,}/).map(function (x) { return '<p>' + x.replace(/\n/g, '<br>') + '</p>'; }).join(''); }
  function show(i) {
    if (!pv || !P.length) return;
    cur = (i + P.length) % P.length; var p = P[cur];
    clearTimeout(outT); pv.classList.remove('out');
    bd.innerHTML = body(p);
    bd.classList.remove('go'); void bd.offsetWidth; bd.classList.add('go');
    $$('.pv-g img', bd).forEach(function (m) { var d = function () { m.classList.add('ld'); }; if (m.complete) setTimeout(d, 30); else { m.addEventListener('load', d); m.addEventListener('error', d); } });
    $('.pv-n').textContent = pad(cur + 1); $('.pv-tot').textContent = pad(P.length);
    var pr = P[(cur - 1 + P.length) % P.length], nx = P[(cur + 1) % P.length];
    $('.pv-pn').innerHTML = LL(pr.t, pr.te); $('.pv-nn').innerHTML = LL(nx.t, nx.te);
    $('.pv-nav').hidden = P.length < 2;
    pv.scrollTop = 0; pv.classList.add('on'); pv.setAttribute('aria-hidden', 'false'); root.style.overflow = 'hidden';
  }
  function hide() {
    if (!pv || !pv.classList.contains('on')) return;
    pv.classList.add('out'); pv.setAttribute('aria-hidden', 'true');
    outT = setTimeout(function () { pv.classList.remove('on', 'out'); bd.classList.remove('go'); root.style.overflow = '';
      var b = grid && grid.querySelector('[data-i="' + cur + '"]'); if (b) b.focus({ preventScroll: true }); }, 820);
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    var b = t.closest('[data-set]'); if (b) { setL(b.getAttribute('data-set')); return; }
    var it = t.closest('.it[data-i]'); if (it) { e.preventDefault(); show(+it.getAttribute('data-i')); return; }
    var a = t.closest('[data-pv]'); if (a) { var x = a.getAttribute('data-pv'); if (x === 'close') hide(); else show(cur + (x === 'next' ? 1 : -1)); }
  });
  document.addEventListener('keydown', function (e) {
    if (!pv || !pv.classList.contains('on')) return;
    if (e.key === 'Escape') hide(); else if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1);
  });

  /* carrega os projetos (no computador, sem servidor, usa a cópia embutida) */
  var use = function (d) { var list = Array.isArray(d) ? d : (d && d.projetos) || []; P = list.map(norm).filter(function (p) { return p.on && (p.t || p.capa); }); renderGrid(); };
  var local = function () { var s = $('#mz-data'); try { use(JSON.parse(s.textContent)); } catch (e) { use([]); } };
  if (location.protocol === 'file:') local();
  else fetch('data/projetos.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(use).catch(local);
})();
