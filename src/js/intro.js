/* SPECTRA Writer · intro : la frappe. Insérée juste après le bloc #splash ; la scène est en CSS (splash.css), ce code ne fait que
   découper le nom en caractères (délais déterministes), gérer « Passer », la session et la fermeture. Pas de son, pas de rAF. */
(function(){
  'use strict';
  var sp = document.getElementById('splash'); if (!sp) return;
  var KEY = 'prism-intro-writer', END = 2900, t0 = performance.now();
  var reduce = false, force = false, seen = false, released = false, over = false, closed = false, timer = 0;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { force = /[?&]intro=1(?:&|#|$)/.test(location.search); } catch (e) {}
  try { seen = !force && sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  try { sessionStorage.setItem(KEY, '1'); } catch (e) {}

  function tryClose(){
    if (closed || !released || !over) return;
    closed = true;
    document.removeEventListener('keydown', onKey, true);
    try { if (sp.contains(document.activeElement)) document.activeElement.blur(); } catch (e) {}   // le focus ne reste pas sur le bouton « Passer »
    sp.classList.add('done');                                    // contenu 200 ms, puis fond 350 ms (voir splash.css)
    setTimeout(function(){ sp.remove(); dropBg(); }, 600);
  }
  function dropBg(){ var b = document.getElementById('spBg'); if (b) b.remove(); }   // fond sombre posé sur <html> dès le <head> (pas d'écran blanc)
  function finishScene(){ if (over) return; over = true; clearTimeout(timer); sp.classList.add('sp-over'); tryClose(); }
  function skip(){ if (over) return; sp.classList.add('sp-skipped'); finishScene(); }
  function onKey(e){
    if (over || closed) return;
    if (e.key === 'Escape' || (e.key === 'Enter' && (e.target === document.body || sp.contains(e.target)))) { e.preventDefault(); skip(); }
  }
  window.__spRelease = function(){ released = true; tryClose(); };
  setTimeout(function(){ released = true; tryClose(); }, 20000);   // garde-fou : jamais d'intro bloquée si l'auth ne répond pas

  var btn = sp.querySelector('.sp-skip');
  if (btn) btn.addEventListener('click', skip);
  document.addEventListener('keydown', onKey, true);

  if (reduce || seen) {                 // pas de scène : logo immédiat (fondu 120 ms), même sortie
    sp.classList.add('sp-static', 'sp-over'); if (reduce) sp.classList.add('sp-reduce');
    timer = setTimeout(finishScene, 600);
    return;
  }
  try {
    /* Rythme de frappe : intervalles (ms) avant chaque caractère, fixes (aucun hasard) ; respiration plus longue avant « Writer ». */
    var GAP = [0, 70, 60, 86, 64, 78, 66, 92, 150, 72, 62, 88, 68, 80], START = 780, k = 0;
    var words = sp.querySelectorAll('[data-t]');
    function caret(cls){ var c = document.createElement('i'); c.className = 'sp-cr ' + (cls || ''); c.setAttribute('aria-hidden', 'true'); return c; }
    var items = [];                       // { host, node } dans l'ordre d'écriture
    Array.prototype.forEach.call(words, function(w, wi){
      var txt = w.textContent; w.textContent = '';
      if (wi === 1) { var pv = w.previousSibling; if (pv && pv.nodeType === 3) pv.parentNode.removeChild(pv); items.push({ host: w.parentNode, before: w, space: true }); }
      for (var i = 0; i < txt.length; i++) items.push({ host: w, ch: txt.charAt(i) });
    });
    // le premier curseur (clignotant) précède le premier caractère ; chaque caractère est suivi de son propre curseur (largeur nulle, en ligne)
    var first = caret('sp-cr0'); words[0].insertBefore(first, null);
    var prevCaret = null, prevT = 0;
    items.forEach(function(it, n){
      k += GAP[Math.min(n, GAP.length - 1)] || 0;
      var t = START + k, g = document.createElement('span'); g.className = 'sp-g'; g.style.setProperty('--d', t + 'ms');
      var c = caret();
      if (it.space) {                     // l'espace entre les deux mots est un vrai caractère : le curseur le franchit
        g.className += ' sp-sp'; it.host.insertBefore(g, it.before); it.host.insertBefore(c, it.before);
      } else { g.textContent = it.ch; it.host.appendChild(g); it.host.appendChild(c); }
      if (prevCaret) prevCaret.style.setProperty('--l', (t - prevT) + 'ms');
      c.style.setProperty('--d', t + 'ms'); prevCaret = c; prevT = t;
    });
    if (prevCaret) prevCaret.style.setProperty('--l', '520ms');
    prevCaret.classList.add('sp-crend');
  } catch (e) { sp.classList.add('sp-static'); }
  /* Police du nom : si Bricolage Grotesque n'est pas arrivée à l'instant où la frappe commence, tout le nom reste en police système
     pour la durée de la scène (aucun changement de largeur en cours de frappe, curseur toujours exact) ; on n'attend jamais la police. */
  setTimeout(function(){
    var ok = false;
    try { document.fonts.forEach(function(f){ if (/Bricolage/.test(f.family) && f.status === 'loaded') ok = true; }); } catch (e) {}
    if (!ok) sp.classList.add('sp-sys');
  }, START - 40);
  timer = setTimeout(finishScene, Math.max(0, END - (performance.now() - t0)));
})();
