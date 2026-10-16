/* ---------- Cœur de l'éditeur : document paginé, mise en forme, historique, sélection ---------- */
const PAGE_SIZES = {A4:[210, 297], A5:[148, 210], A3:[297, 420], Letter:[215.9, 279.4], Legal:[215.9, 355.6]};
const PAGE_LABEL = {A4:'A4 · 21 × 29,7 cm', A5:'A5 · 14,8 × 21 cm', A3:'A3 · 29,7 × 42 cm', Letter:'Lettre US', Legal:'Légal US'};
const MARGINS = {normal:[25, 25, 25, 25], narrow:[12.7, 12.7, 12.7, 12.7], wide:[25.4, 38, 25.4, 38], none:[0, 0, 0, 0]};
const MARGIN_LABEL = {normal:'Normales · 2,5 cm', narrow:'Étroites · 1,27 cm', wide:'Larges · 3,8 cm', none:'Aucune (pleine page)'};
const DEF_PAGE = {size:'A4', orient:'p', margins:'normal', numbers:false, numStyle:'n', numPos:'c', header:'', footer:'', bg:'#ffffff', watermark:''};
const GAP = 28;
const E = {
  sheet:null, canvas:null, scroll:null, stage:null, deco:null, over:null,
  doc:{title:'Document sans titre', theme:{id:'spectra'}, page:{...DEF_PAGE}},
  ro:false, zoom:1, fit:true, geo:null, pages:1, hist:[], hi:-1, range:null, userLib:{}, printing:false, frTypo:lsGet('sw.frTypo') !== false,
};
const sheet = () => E.sheet;

/* --- géométrie de la page --- */
function geometry(){
  const p = E.doc.page, s = PAGE_SIZES[p.size] || PAGE_SIZES.A4, m = MARGINS[p.margins] || MARGINS.normal;
  const [w, h] = p.orient === 'l' ? [s[1], s[0]] : s;
  return {pw:w * MM, ph:h * MM, mt:m[0] * MM, mr:m[1] * MM, mb:m[2] * MM, ml:m[3] * MM, G:E.printing ? 0 : GAP};
}
function applyGeometry(){
  const g = E.geo = geometry(), S = sheet();
  S.style.cssText = themeCss(E.doc.theme) + `;--mt:${g.mt}px;--mr:${g.mr}px;--mb:${g.mb}px;--ml:${g.ml}px;--ph:${g.ph}px;--pw:${g.pw}px;width:${g.pw}px;padding:${g.mt}px ${g.mr}px 0 ${g.ml}px`;
  E.canvas.style.width = g.pw + 'px';
  E.deco.style.cssText = themeCss(E.doc.theme);
  document.documentElement.style.setProperty('--sw-print-w', (g.pw / MM) + 'mm');
  document.documentElement.style.setProperty('--sw-print-h', (g.ph / MM) + 'mm');
  let ps = $('#swPrintPage'); if (!ps){ ps = document.createElement('style'); ps.id = 'swPrintPage'; document.head.appendChild(ps); }
  ps.textContent = `@page{size:${(g.pw / MM).toFixed(2)}mm ${(g.ph / MM).toFixed(2)}mm;margin:0}`;
}

/* --- pagination : un bloc qui ne tient pas en bas de page passe à la page suivante (sauts de page automatiques) --- */
function relTop(el){ const S = sheet(); return (el.getBoundingClientRect().top - S.getBoundingClientRect().top) / E.zoom; }
function units(){
  const out = [];
  for (const el of sheet().children){
    if (el.classList.contains('sw-pbs')) continue;
    if ((el.tagName === 'UL' || el.tagName === 'OL') && el.children.length > 1){ for (const li of el.children) if (!li.classList.contains('sw-pbs')) out.push(li); }
    else out.push(el);
  }
  return out;
}
/* Les repères sont de vrais blocs vides (pas des marges) : à l'impression, une marge en haut de page est supprimée par le navigateur, une hauteur non. */
function clearPushes(){
  sheet().querySelectorAll('.sw-pbs').forEach(x => x.remove());
  sheet().querySelectorAll('[data-swpb]').forEach(el => { const o = el.dataset.swpb; el.style.marginTop = o === '-' ? '' : o; if (!el.getAttribute('style')) el.removeAttribute('style'); delete el.dataset.swpb; });
}
function push(el, target){
  const t0 = relTop(el), sp = document.createElement(el.tagName === 'LI' ? 'li' : 'div');
  sp.className = 'sw-pbs'; sp.contentEditable = 'false'; sp.setAttribute('aria-hidden', 'true');
  let h = Math.max(0, target - t0); sp.style.height = h + 'px'; el.before(sp);
  for (let i = 0; i < 3; i++){ const d = target - relTop(el); if (Math.abs(d) < .5) break; h = Math.max(0, h + d); sp.style.height = h + 'px'; }
}
function layout(){
  const S = sheet(); if (!S) return;
  const g = E.geo || geometry(), step = g.ph + g.G, inner = g.ph - g.mt - g.mb;
  clearPushes();
  let force = -1;
  for (const u of units()){
    if (u.dataset?.sw === 'pagebreak'){ force = Math.floor(relTop(u) / step) + 1; continue; }
    const top = relTop(u), h = u.offsetHeight, k = Math.max(0, Math.floor(top / step)), pTop = k * step, cTop = pTop + g.mt, cBot = pTop + g.ph - g.mb;
    const cover = u.classList?.contains('sw-cover');
    let target = null;
    if (force >= 0){ const t = force * step + (cover ? 0 : g.mt); if (top < t - .5) target = t; force = -1; }
    else if (cover){ if (Math.abs(top - pTop) > 1) target = (top > pTop + g.mt + 1 ? (k + 1) * step : pTop); if (target !== null && target < top) target = null; }
    else if (top > cBot - 2) target = (k + 1) * step + g.mt;
    else if (h > 4 && top + h > cBot + 1 && h <= inner && top > cTop + 2) target = (k + 1) * step + g.mt;
    if (target !== null) push(u, target);
  }
  const last = S.lastElementChild; let bottom = g.mt;
  if (last){ const r = last.getBoundingClientRect(), s0 = S.getBoundingClientRect(); bottom = (r.bottom - s0.top) / E.zoom + (parseFloat(getComputedStyle(last).marginBottom) || 0) * 0; }
  E.pages = Math.max(1, Math.floor((bottom - 1) / step) + 1);
  S.style.minHeight = (E.pages * step - g.G) + 'px';
  renderDeco();
  sizeStage();
}
let tocSig = '';
function updateTOC(){
  const tocs = $$('[data-sw="toc"]', sheet()); if (!tocs.length) return false;
  const g = E.geo, step = g.ph + g.G;
  const hs = $$('h1, h2, h3', sheet()).filter(h => !h.closest('.sw-cover, .sw-toc, .sw-band, .sw-hero') && h.textContent.trim());
  const items = hs.map(h => { if (!h.dataset.swId) h.dataset.swId = 'h' + uidS(); return {id:h.dataset.swId, t:h.textContent.trim(), l:+h.tagName[1], p:Math.floor(relTop(h) / step) + 1}; });
  const minL = Math.min(...items.map(i => i.l), 3);
  const sig = JSON.stringify(items);
  if (sig === tocSig && tocs.every(t => t.dataset.swSig === sig)) return false;
  tocSig = sig;
  tocs.forEach(t => { t.dataset.swSig = sig; t.innerHTML = `<b>Sommaire</b>${items.length ? items.map(i => `<a href="#${i.id}" class="l${i.l - minL + 1}" data-sw-to="${i.id}">${escH(i.t)}<i></i><em>${i.p}</em></a>`).join('') : '<span class="sw-small">Ajoutez des titres (Titre 1, 2 ou 3) : ils apparaîtront ici avec leur numéro de page.</span>'}`; });
  return true;
}
function paginate(){ if (!sheet()) return; layout(); if (updateTOC()) layout(); updateStatus(); outlineRefresh(); }
const paginateSoon = debounce(() => requestAnimationFrame(paginate), 90);
function tokens(s, i){ return String(s || '').replace(/\{page\}/g, i + 1).replace(/\{pages\}/g, E.pages).replace(/\{titre\}/g, escH(E.doc.title)).replace(/\{date\}/g, today()); }
function renderDeco(){
  const g = E.geo, p = E.doc.page, step = g.ph + g.G; let h = '';
  for (let i = 0; i < E.pages; i++){
    const num = p.numbers ? (p.numStyle === 'np' ? `Page ${i + 1} / ${E.pages}` : String(i + 1)) : '';
    const coverFirst = i === 0 && sheet().firstElementChild?.classList.contains('sw-cover');
    h += `<div class="pg" style="top:${i * step}px;height:${g.ph}px;width:${g.pw}px;background:${escH(p.bg || '#fff')}">`
      + (p.watermark ? `<div class="pg-wm">${escH(p.watermark)}</div>` : '')
      + (p.header && !coverFirst ? `<div class="pg-h" style="top:${Math.max(10, g.mt * .38)}px;left:${Math.max(18, g.ml)}px;right:${Math.max(18, g.mr)}px">${tokens(escH(p.header), i)}</div>` : '')
      + ((p.footer || num) && !coverFirst ? `<div class="pg-f" style="bottom:${Math.max(10, g.mb * .38)}px;left:${Math.max(18, g.ml)}px;right:${Math.max(18, g.mr)}px"><span>${tokens(escH(p.footer), i)}</span><span class="pg-n ${p.numPos === 'r' ? 'r' : ''}">${num}</span></div>` : '')
      + '</div>';
  }
  E.deco.innerHTML = h;
  E.deco.style.height = (E.pages * step - g.G) + 'px';
}
function sizeStage(){
  const g = E.geo, H = E.pages * (g.ph + g.G) - g.G, pad = innerWidth < 700 ? 12 : 36;
  if (E.fit){ const avail = E.scroll.clientWidth - pad * 2 - (innerWidth > 760 ? 56 : 0); E.zoom = clamp(Math.min(1, avail / g.pw), .3, 1); }
  E.canvas.style.transform = `scale(${E.zoom})`;
  E.stage.style.width = (g.pw * E.zoom) + 'px';
  E.stage.style.height = (H * E.zoom + pad + 130) + 'px';   // de la place sous la dernière page pour la barre Prisme
  E.stage.style.paddingTop = pad + 'px';
  const zl = $('#zoomVal'); if (zl) zl.textContent = Math.round(E.zoom * 100) + ' %';
  const zr = $('#zoomRange'); if (zr) zr.value = Math.round(E.zoom * 100);
}
function setZoom(z, fit){ E.fit = !!fit; if (!fit) E.zoom = clamp(z, .3, 2); sizeStage(); placeTools(); }

/* --- sélection (chemins de nœuds, pour l'historique) --- */
function pathOf(node, off){ const path = []; let n = node; const S = sheet(); while (n && n !== S){ const p = n.parentNode; if (!p) return null; path.unshift([...p.childNodes].indexOf(n)); n = p; } return n === S ? {path, off} : null; }
function nodeAt(pp){ let n = sheet(); for (const i of pp.path){ if (!n.childNodes[i]) return null; n = n.childNodes[i]; } return n; }
function selPaths(){ const s = getSelection(); if (!s.rangeCount) return null; const r = s.getRangeAt(0); if (!sheet().contains(r.startContainer)) return null;
  const a = pathOf(r.startContainer, r.startOffset), b = pathOf(r.endContainer, r.endOffset); return a && b ? {a, b} : null; }
function setSelPaths(sp){ if (!sp) return; try { const a = nodeAt(sp.a), b = nodeAt(sp.b); if (!a || !b) return; const r = document.createRange();
  r.setStart(a, Math.min(sp.a.off, a.nodeType === 3 ? a.length : a.childNodes.length)); r.setEnd(b, Math.min(sp.b.off, b.nodeType === 3 ? b.length : b.childNodes.length));
  const s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch(e){} }
function inSheet(){ const s = getSelection(); return s.rangeCount && sheet().contains(s.getRangeAt(0).commonAncestorContainer); }
function saveSel(){ if (inSheet()) E.range = getSelection().getRangeAt(0).cloneRange(); }
function restoreSel(){ if (!E.range) return; if (document.activeElement !== sheet()) sheet().focus({preventScroll:true}); const s = getSelection(); s.removeAllRanges(); s.addRange(E.range); }
function caretToEnd(el){ const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
function caretToStart(el){ const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const t = w.nextNode(); const r = document.createRange(); if (t) r.setStart(t, 0); else r.setStart(el, 0); r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
const BLOCK_RE = /^(P|H[1-6]|LI|BLOCKQUOTE|PRE|DIV|FIGURE|TD|TH|FIGCAPTION|UL|OL|TABLE|HR|SECTION)$/;
function blockOf(n){ while (n && n !== sheet()){ if (n.nodeType === 1 && /^(P|H[1-6]|LI|BLOCKQUOTE|PRE|FIGCAPTION|TD|TH)$/.test(n.tagName)) return n; n = n.parentNode; } return null; }
function topOf(n){ while (n && n.parentNode !== sheet()){ n = n.parentNode; if (!n) return null; } return n && n !== sheet() ? n : null; }
function selBlocks(){
  const s = getSelection(); if (!s.rangeCount || !inSheet()) return [];
  const r = s.getRangeAt(0), a = blockOf(r.startContainer), b = blockOf(r.endContainer);
  if (!a) return []; if (a === b) return [a];
  const all = $$('p,h1,h2,h3,h4,h5,h6,li,blockquote,pre', sheet()).filter(el => r.intersectsNode(el) && !el.querySelector('p,h1,h2,h3,h4,h5,h6,li,blockquote,pre'));
  return all.length ? all : [a];
}

/* --- historique (annuler / rétablir) : instantanés du document --- */
function snapshot(){ return {html:sheet().innerHTML, sel:selPaths(), doc:JSON.stringify({t:E.doc.theme, p:E.doc.page})}; }
function record(){
  const s = snapshot(), cur = E.hist[E.hi];
  if (cur && cur.html === s.html && cur.doc === s.doc){ cur.sel = s.sel; return; }
  E.hist = E.hist.slice(0, E.hi + 1); E.hist.push(s); if (E.hist.length > 150) E.hist.shift(); E.hi = E.hist.length - 1; updUndo();
}
const recordSoon = debounce(record, 450);
function restore(s){
  sheet().innerHTML = s.html; const d = JSON.parse(s.doc); E.doc.theme = d.t; E.doc.page = d.p;
  setSelPaths(s.sel); applyGeometry(); paginate(); emitChange(true); updUndo(); panelRefresh();
}
function undo(){ recordSoon.flush?.(); flushRecord(); if (E.hi <= 0) return; E.hi--; restore(E.hist[E.hi]); }
function redo(){ if (E.hi >= E.hist.length - 1) return; E.hi++; restore(E.hist[E.hi]); }
let recPending = false;
function flushRecord(){ if (recPending){ recPending = false; record(); } }
function updUndo(){ const u = $('#undoBtn'), r = $('#redoBtn'); if (u) u.disabled = E.hi <= 0; if (r) r.disabled = E.hi >= E.hist.length - 1; }

/* --- changements --- */
const emitSoon = debounce(() => window.dispatchEvent(new CustomEvent('sw:changed')), 250);
function emitChange(now){ if (E.ro) return; now ? window.dispatchEvent(new CustomEvent('sw:changed')) : emitSoon(); }
function changed(opts = {}){
  if (opts.record) { flushRecord(); record(); } else { recPending = true; recordLater(); }
  paginateSoon(); emitChange(); statusSoon(); autoTitleSoon();
}
/* Titre automatique : tant que le document n'a pas été renommé, il prend le texte de son premier grand titre */
const DEFAULT_TITLE = 'Document sans titre';
const autoTitleSoon = debounce(() => {
  if (E.ro || !(E.doc.title === DEFAULT_TITLE || E.autoTitle)) return;
  const h = sheet().querySelector('h1'); const t = (h?.textContent || '').replace(/\u200B/g, '').trim().slice(0, 120);
  if (!t || t === E.doc.title) return;
  E.doc.title = t; E.autoTitle = true; const ti = $('#docTitle'); if (ti && document.activeElement !== ti) ti.value = t; emitChange();
}, 600);
const recordLater = debounce(() => flushRecord(), 450);

/* --- commandes de mise en forme --- */
function cmd(name, val, css = false){
  if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record();
  try { document.execCommand('styleWithCSS', false, css); } catch(e){}
  document.execCommand(name, false, val ?? null);
  changed({record:true}); refreshToolbar();
}
function restoreSelIfNeeded(){ if (!inSheet()) restoreSel(); }
const MARK = '#fe0102', MARK_RGB = 'rgb(254, 1, 2)';
/* style en ligne (police, taille, couleur du thème…) : appliqué via une couleur repère, puis remplacé par le vrai style */
function inlineStyle(prop, value, back){
  if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record();
  const s = getSelection(); if (!s.rangeCount) return;
  if (s.getRangeAt(0).collapsed){
    const span = document.createElement('span'); span.style.setProperty(prop, value); span.textContent = '​';
    const r = s.getRangeAt(0); r.insertNode(span); const r2 = document.createRange(); r2.setStart(span.firstChild, 1); r2.collapse(true); s.removeAllRanges(); s.addRange(r2);
    changed({record:true}); return;
  }
  try { document.execCommand('styleWithCSS', false, true); } catch(e){}
  document.execCommand(back ? 'hiliteColor' : 'foreColor', false, MARK);
  const key = back ? 'background-color' : 'color';
  $$('span[style], font[color]', sheet()).forEach(el => {
    const hit = el.tagName === 'FONT' ? (el.getAttribute('color') || '').toLowerCase() === MARK : el.style.getPropertyValue(key) === MARK_RGB;
    if (!hit) return;
    let sp = el; if (el.tagName === 'FONT'){ sp = document.createElement('span'); while (el.firstChild) sp.appendChild(el.firstChild); el.replaceWith(sp); }
    sp.style.removeProperty(key);
    if (value === 'inherit' || value === 'transparent'){ sp.style.removeProperty(prop); } else sp.style.setProperty(prop, value);
    if (prop === 'font-size') $$('[style*="font-size"]', sp).forEach(x => x.style.removeProperty('font-size'));
    if (prop === 'font-family') $$('[style*="font-family"]', sp).forEach(x => x.style.removeProperty('font-family'));
    if (!sp.getAttribute('style')){ const p = sp.parentNode; while (sp.firstChild) p.insertBefore(sp.firstChild, sp); sp.remove(); }
  });
  changed({record:true}); refreshToolbar();
}
/* style de paragraphe */
const STYLES = [
  ['p', '', 'Texte normal'], ['h1', '', 'Titre 1'], ['h2', '', 'Titre 2'], ['h3', '', 'Titre 3'], ['h4', '', 'Titre 4'],
  ['p', 'sw-lead', 'Chapeau'], ['p', 'sw-kicker', 'Sur-titre'], ['p', 'sw-small', 'Petit texte'], ['blockquote', '', 'Citation'], ['pre', '', 'Code'],
];
function setBlock(tag, cls = ''){
  if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record();
  const sp = selPaths();
  let blocks = selBlocks(); if (!blocks.length){ const t = topOf(getSelection().anchorNode); if (t) blocks = [t]; }
  blocks.forEach(b => {
    if (b.tagName === 'LI' || b.tagName === 'TD' || b.tagName === 'TH' || b.tagName === 'FIGCAPTION'){ return; }
    const n = document.createElement(tag);
    [...b.attributes].forEach(a => { if (a.name !== 'class' && a.name !== 'data-sw-id') n.setAttribute(a.name, a.value); });
    if (cls) n.className = cls;
    while (b.firstChild) n.appendChild(b.firstChild);
    if (!n.textContent && !n.querySelector('br,img,svg')){ n.textContent = ''; n.appendChild(document.createElement('br')); }
    b.replaceWith(n);
  });
  setSelPaths(sp); changed({record:true}); refreshToolbar();
}
function blockStyleOf(b){ if (!b) return 0; const t = b.tagName.toLowerCase(); const c = b.className || '';
  const i = STYLES.findIndex(([tg, cl]) => tg === t && (cl ? c.split(/\s+/).includes(cl) : !/sw-(lead|kicker|small)/.test(c))); return i < 0 ? 0 : i; }
function setLineHeight(v){ if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record(); selBlocks().forEach(b => { if (v) b.style.lineHeight = v; else b.style.removeProperty('line-height'); if (!b.getAttribute('style')) b.removeAttribute('style'); }); changed({record:true}); }
function setSpaceAfter(v){ if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record(); selBlocks().forEach(b => { if (v != null) b.style.marginBottom = v + 'em'; else b.style.removeProperty('margin-bottom'); if (!b.getAttribute('style')) b.removeAttribute('style'); }); changed({record:true}); }
function indent(dir){
  if (E.ro) return; restoreSelIfNeeded();
  const bl = selBlocks();
  if (bl.some(b => b.tagName === 'LI')) return cmd(dir > 0 ? 'indent' : 'outdent');
  flushRecord(); record();
  bl.forEach(b => { const cur = parseFloat(b.style.marginLeft) || 0; const v = Math.max(0, cur + dir * 1.25); if (v) b.style.marginLeft = v + 'em'; else b.style.removeProperty('margin-left'); if (!b.getAttribute('style')) b.removeAttribute('style'); });
  changed({record:true});
}
function toggleChecklist(){
  if (E.ro) return; restoreSelIfNeeded();
  const li = blockOf(getSelection().anchorNode); const ul = li?.closest('ul');
  if (ul && sheet().contains(ul)){ flushRecord(); record(); ul.classList.toggle('sw-check'); if (!ul.className) ul.removeAttribute('class'); changed({record:true}); return refreshToolbar(); }
  cmd('insertUnorderedList');
  const li2 = blockOf(getSelection().anchorNode), ul2 = li2?.closest('ul'); if (ul2){ ul2.classList.add('sw-check'); changed({record:true}); }
}
function clearFormat(){ cmd('removeFormat'); const bl = selBlocks(); if (bl.length && bl.some(b => b.tagName !== 'P' || b.className)) setBlock('p'); }

/* --- insertion de blocs --- */
function isEmptyBlock(el){ return el && /^(P|H[1-6])$/.test(el.tagName) && !el.textContent.replace(/​/g, '').trim() && !el.querySelector('img,svg,table'); }
function insertHTMLBlock(html, ref, where){
  if (E.ro) return null;
  flushRecord(); record();
  const tpl = document.createElement('template'); tpl.innerHTML = SAN(html);
  const nodes = [...tpl.content.childNodes].filter(n => n.nodeType === 1 || n.textContent.trim());
  let anchor = ref || (inSheet() ? topOf(getSelection().anchorNode) : null) || (E.range && sheet().contains(E.range.startContainer) ? topOf(E.range.startContainer) : null);
  const S = sheet();
  if (anchor && !ref && isEmptyBlock(anchor)){ nodes.forEach(n => S.insertBefore(n, anchor)); anchor.remove(); }
  else if (anchor){ const before = where === 'before'; let at = before ? anchor : anchor.nextSibling; nodes.forEach(n => S.insertBefore(n, at)); }
  else nodes.forEach(n => S.appendChild(n));
  const last = nodes[nodes.length - 1];
  // toujours un paragraphe après un bloc final, pour continuer à écrire
  if (last && !last.nextElementSibling && !/^(P|H[1-6])$/.test(last.tagName)){ const p = document.createElement('p'); p.innerHTML = '<br>'; S.appendChild(p); }
  const first = nodes.find(n => n.nodeType === 1);
  if (first){ const ed = first.matches('[contenteditable="false"]') ? first.nextElementSibling : first; if (ed){ sheet().focus({preventScroll:true});
      const cell = ed.querySelector('th,td'); if (cell && ed.tagName === 'TABLE'){ const r = document.createRange(); r.selectNodeContents(cell); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } else caretToStart(ed); } first.scrollIntoView?.({block:'nearest', behavior:'smooth'}); }
  changed({record:true}); paginate(); return first;
}
function insertInline(text){ restoreSelIfNeeded(); if (!inSheet()){ sheet().focus(); caretToEnd(sheet().lastElementChild || sheet()); } flushRecord(); record(); document.execCommand('insertText', false, text); changed({record:true}); }
function insertBlockById(id, ref, where){ const b = BLOCKS.find(x => x.id === id); if (!b) return; if (b.inline) return insertInline(b.html()); insertHTMLBlock(b.html(), ref, where); toast(`${b.name} ajouté`); }

/* --- tableaux --- */
function curCell(){ const s = getSelection(); if (!s.rangeCount) return null; let n = s.anchorNode; while (n && n !== sheet()){ if (n.nodeType === 1 && (n.tagName === 'TD' || n.tagName === 'TH')) return n; n = n.parentNode; } return null; }
function tableOp(op){
  const cell = curCell() || E.lastCell; if (!cell || !sheet().contains(cell)) return; const tr = cell.parentNode, table = cell.closest('table');
  flushRecord(); record();
  const idx = [...tr.children].indexOf(cell), rows = [...table.rows];
  const mkRow = like => { const r = document.createElement('tr'); [...like.children].forEach(c => { const d = document.createElement(c.tagName === 'TH' && like.parentNode.tagName === 'THEAD' ? 'td' : c.tagName.toLowerCase()); if (c.colSpan > 1) d.colSpan = c.colSpan; d.innerHTML = '<br>'; r.appendChild(d); }); return r; };
  if (op === 'rowAfter' || op === 'rowBefore'){ let like = tr; if (tr.parentNode.tagName === 'THEAD'){ const b = table.tBodies[0] || table.createTBody(); const r = mkRow(like); [...r.children].forEach(c => { const d = document.createElement('td'); d.innerHTML = '<br>'; c.replaceWith(d); }); b.insertBefore(r, b.firstChild); }
    else { const r = mkRow(like); tr.parentNode.insertBefore(r, op === 'rowAfter' ? tr.nextSibling : tr); } }
  else if (op === 'colAfter' || op === 'colBefore'){ rows.forEach(r => { const ref = r.children[Math.min(idx, r.children.length - 1)]; const c = document.createElement(ref && ref.tagName === 'TH' ? 'th' : 'td'); c.innerHTML = ref && ref.tagName === 'TH' ? 'Colonne' : '<br>'; if (!ref) r.appendChild(c); else r.insertBefore(c, op === 'colAfter' ? ref.nextSibling : ref); }); }
  else if (op === 'delRow'){ if (table.rows.length <= 1) return delTable(table); tr.remove(); }
  else if (op === 'delCol'){ if (tr.children.length <= 1) return delTable(table); rows.forEach(r => { const c = r.children[idx]; if (c) c.remove(); }); }
  else if (op === 'head'){ if (table.tHead){ const h = table.tHead; const b = table.tBodies[0] || table.createTBody(); [...h.rows].reverse().forEach(r => { [...r.children].forEach(c => { const d = document.createElement('td'); d.innerHTML = c.innerHTML; c.replaceWith(d); }); b.insertBefore(r, b.firstChild); }); h.remove(); }
    else { const first = table.rows[0]; const h = table.createTHead(); [...first.children].forEach(c => { const d = document.createElement('th'); d.innerHTML = c.innerHTML; c.replaceWith(d); }); h.appendChild(first); } }
  else if (op === 'style'){ const seq = ['sw-table', 'sw-table t-zebra', 'sw-table t-grid', 'sw-table t-soft', '']; const cur = seq.indexOf(table.className.trim()); table.className = seq[(cur + 1) % seq.length]; if (!table.className) table.removeAttribute('class'); toast('Style du tableau : ' + (['Accent', 'Rayé', 'Grille', 'Doux', 'Simple'][(cur + 1) % seq.length])); }
  else if (op === 'right'){ rows.forEach(r => { const c = r.children[idx]; if (c) c.classList.toggle('r'); }); }
  else if (op === 'del') return delTable(table);
  changed({record:true}); paginate(); placeTools();
}
function delTable(t){ const p = document.createElement('p'); p.innerHTML = '<br>'; t.replaceWith(p); caretToStart(p); changed({record:true}); hideTool('#tblBar'); }

/* --- images : compressées dans le navigateur (le document reste léger pour le cloud) --- */
function readImage(file, maxW = 1600){
  return new Promise((res, rej) => {
    if (!/^image\/(png|jpe?g|gif|webp)$/.test(file.type)) return rej(new Error('Format d\'image non pris en charge (PNG, JPEG, GIF ou WebP).'));
    const fr = new FileReader(); fr.onerror = () => rej(new Error('Lecture de l\'image impossible.'));
    fr.onload = () => { const img = new Image(); img.onload = () => {
      if (file.type === 'image/gif' && file.size < 400e3) return res(fr.result);
      const sc = Math.min(1, maxW / img.width), w = Math.round(img.width * sc), h = Math.round(img.height * sc);
      const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
      const alpha = file.type === 'image/png' || file.type === 'image/webp';
      if (!alpha){ x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); }
      x.drawImage(img, 0, 0, w, h);
      let out = c.toDataURL('image/webp', .82); if (!out.startsWith('data:image/webp')) out = c.toDataURL(alpha ? 'image/png' : 'image/jpeg', .82);
      if (out.length > 420e3){ const c2 = document.createElement('canvas'); const s2 = Math.sqrt(380e3 / out.length); c2.width = Math.round(w * s2); c2.height = Math.round(h * s2); c2.getContext('2d').drawImage(c, 0, 0, c2.width, c2.height); out = c2.toDataURL('image/webp', .78); if (!out.startsWith('data:image/webp')) out = c2.toDataURL('image/jpeg', .78); }
      res(out); }; img.onerror = () => rej(new Error('Image illisible.')); img.src = fr.result; };
    fr.readAsDataURL(file);
  });
}
async function insertImageFile(file, ref, where){
  try { const src = await readImage(file); insertHTMLBlock(`<figure class="sw-img" data-align="center" style="width:70%"><img src="${src}" alt=""></figure>`, ref, where); toast('Image ajoutée'); }
  catch(e){ toast(e.message || 'Image refusée'); }
}
let selFig = null;
function selectFigure(fig){
  if (selFig && selFig !== fig) selFig.classList.remove('sw-sel');
  selFig = fig; if (fig){ fig.classList.add('sw-sel'); showTool('#imgBar'); } else hideTool('#imgBar');
  placeTools();
}
function figOp(op, v){
  const f = selFig; if (!f || !sheet().contains(f)) return; flushRecord(); record();
  if (op === 'w'){ f.style.width = v + '%'; }
  else if (op === 'align'){ f.dataset.align = v; }
  else if (op === 'style'){ ['rounded', 'shadow', 'frame', 'circle'].forEach(c => f.classList.remove(c)); if (v) f.classList.add(v); }
  else if (op === 'caption'){ const c = f.querySelector('figcaption'); if (c) c.remove(); else { const fc = document.createElement('figcaption'); fc.textContent = 'Légende'; f.appendChild(fc); const r = document.createRange(); r.selectNodeContents(fc); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
  else if (op === 'del'){ const p = f.nextElementSibling; f.remove(); selectFigure(null); if (p) caretToStart(p); }
  else if (op === 'alt'){ const img = f.querySelector('img'); if (img) img.alt = v; }
  changed({record:true}); paginate(); placeTools();
}

/* --- barres flottantes (sélection, image, tableau) --- */
function showTool(sel){ const t = $(sel); if (t) t.hidden = false; }
function hideTool(sel){ const t = $(sel); if (t) t.hidden = true; }
function overlayPos(rect){ const c = E.canvas.getBoundingClientRect(); return {x:(rect.left - c.left) / E.zoom, y:(rect.top - c.top) / E.zoom, w:rect.width / E.zoom, h:rect.height / E.zoom}; }
function placeTools(){
  const ib = $('#imgBar'), tb = $('#tblBar'), sc = E.scroll.getBoundingClientRect();
  const placeFixed = (el, r) => { el.style.left = clamp(r.left + r.width / 2 - el.offsetWidth / 2, sc.left + 8, sc.right - el.offsetWidth - 8) + 'px';
    let y = r.top - el.offsetHeight - 10; if (y < sc.top + 6) y = Math.min(r.bottom + 10, sc.bottom - el.offsetHeight - 8); el.style.top = y + 'px'; };
  if (ib && !ib.hidden && selFig && sheet().contains(selFig)){ placeFixed(ib, selFig.getBoundingClientRect()); const hdl = $('#imgHandle'); const p = overlayPos(selFig.querySelector('img')?.getBoundingClientRect() || selFig.getBoundingClientRect()); hdl.hidden = E.ro; hdl.style.left = (p.x + p.w - 7) + 'px'; hdl.style.top = (p.y + p.h - 7) + 'px'; }
  else { if (ib) ib.hidden = true; const hdl = $('#imgHandle'); if (hdl) hdl.hidden = true; }
  const cell = curCell(); if (cell) E.lastCell = cell;
  if (tb && cell && !E.ro){ tb.hidden = false; placeFixed(tb, cell.closest('table').getBoundingClientRect()); } else if (tb) tb.hidden = true;
}
function placeFloat(){
  const fb = $('#floatBar'); if (!fb) return;
  const s = getSelection();
  if (E.ro || !s.rangeCount || s.isCollapsed || !inSheet() || selFig){ fb.hidden = true; return; }
  const r = s.getRangeAt(0).getBoundingClientRect(); if (!r.width && !r.height){ fb.hidden = true; return; }
  fb.hidden = false; const sc = E.scroll.getBoundingClientRect();
  fb.style.left = clamp(r.left + r.width / 2 - fb.offsetWidth / 2, sc.left + 8, sc.right - fb.offsetWidth - 8) + 'px';
  let y = r.top - fb.offsetHeight - 10; if (y < sc.top + 4) y = r.bottom + 10; fb.style.top = y + 'px';
  $$('[data-fc]', fb).forEach(b => b.classList.toggle('on', safeState(b.dataset.fc)));
}
function safeState(c){ try { return document.queryCommandState(c); } catch(e){ return false; } }

/* --- barre d'outils : état courant --- */
function refreshToolbar(){
  if (!inSheet()) return;
  const s = getSelection(), n = s.anchorNode, el = n?.nodeType === 3 ? n.parentElement : n, b = blockOf(n) || topOf(n);
  const st = $('#fStyle'); if (st) st.value = String(blockStyleOf(b && b.tagName !== 'LI' ? b : null));
  ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'].forEach(c => { const x = $(`[data-cmd="${c}"]`, $('#edBar')); if (x) x.classList.toggle('on', safeState(c)); });
  const chk = $('[data-act="check"]', $('#edBar')); if (chk) chk.classList.toggle('on', !!el?.closest?.('ul.sw-check'));
  if (el && sheet().contains(el)){
    const cs = getComputedStyle(el); const pt = Math.round(parseFloat(cs.fontSize) * .75 * 2) / 2;
    const fs = $('#fSize'); if (fs && document.activeElement !== fs) fs.value = String(pt).replace('.', ',');
    const fam = (cs.fontFamily.split(',')[0] || '').replace(/["']/g, '').trim(); const ff = $('#fFont'); if (ff && document.activeElement !== ff){ ff.value = FONTS.some(f => f[0] === fam) ? fam : ''; ff.title = fam; }
    const col = $('#fColorBar'); if (col) col.style.background = cs.color;
  }
  // repère « tapez / » sur le paragraphe vide courant
  $$('.ph-cur', sheet()).forEach(x => x.classList.remove('ph-cur'));
  if (b && isEmptyBlock(b) && b.parentNode === sheet() && s.isCollapsed) b.classList.add('ph-cur');
}
const refreshSoon = debounce(refreshToolbar, 60);

/* --- statistiques --- */
function countWords(t){ return (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu) || []).length; }
function updateStatus(){
  const st = $('#edStats'); if (!st || !sheet()) return;
  const t = sheet().innerText.replace(/​/g, ''), w = countWords(t), c = t.replace(/\s/g, '').length, min = Math.max(1, Math.round(w / 230));
  E.words = w;
  let cur = 1; if (inSheet()){ try { const r = getSelection().getRangeAt(0).getBoundingClientRect(); if (r.top || r.bottom) cur = clamp(Math.floor(((r.top - sheet().getBoundingClientRect().top) / E.zoom) / (E.geo.ph + E.geo.G)) + 1, 1, E.pages); } catch(e){} }
  const goal = +E.doc.page.goal || 0;
  st.innerHTML = `<span>Page ${cur} sur ${E.pages}</span><span>${w.toLocaleString('fr-FR')} mot${w > 1 ? 's' : ''}${goal ? ` sur ${goal.toLocaleString('fr-FR')}` : ''}</span>${goal ? `<i class="goal"><b style="width:${Math.min(100, w / goal * 100).toFixed(1)}%"></b></i>` : ''}`;
}
const statusSoon = debounce(updateStatus, 300);
