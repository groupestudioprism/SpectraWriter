/* ---------- Panneaux (modèles, blocs, thèmes, éléments, images, plan), menus, commande « / », glisser-déposer ---------- */
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
let panel = '';
const PANELS = {
  templates:{t:'Modèles', ic:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="10" rx="2"/><rect x="13" y="3" width="8" height="6" rx="2"/><rect x="13" y="11" width="8" height="10" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/></svg>'},
  blocks:{t:'Blocs', ic:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="8" height="6" rx="2"/><rect x="13" y="14" width="8" height="6" rx="2"/></svg>'},
  themes:{t:'Thèmes', ic:'<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.6 0-.5-.2-.8-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.3"/><circle cx="10.5" cy="7" r="1.3"/><circle cx="15" cy="7.5" r="1.3"/></svg>'},
  elements:{t:'Éléments', ic:'<svg viewBox="0 0 24 24"><circle cx="7.5" cy="7.5" r="4"/><rect x="13" y="3.5" width="8" height="8" rx="2"/><path d="m7.5 13.5 4.5 7.5H3zM13 17h8M17 13v8"/></svg>'},
  images:{t:'Images', ic:IC.img},
  outline:{t:'Plan', ic:'<svg viewBox="0 0 24 24"><path d="M4 5h16M8 10h12M8 15h12M4 20h16"/></svg>'},
};
function renderRail(){
  $('#edRail').innerHTML = Object.entries(PANELS).map(([k, p]) => `<button type="button" data-panel="${k}" aria-pressed="${panel === k}" title="${p.t}">${p.ic}<span>${p.t}</span></button>`).join('');
}
function openPanel(k){
  panel = panel === k ? '' : k; renderRail();
  const P = $('#edPanel'); P.hidden = !panel; document.body.classList.toggle('panel-open', !!panel);
  if (panel) renderPanel();
  setTimeout(() => { sizeStage(); placeTools(); }, 0);
}
function panelRefresh(){ if (panel === 'themes' || panel === 'outline') renderPanel(); }
let blockQ = '', blockCat = 'Tous';
function miniBlock(html){ return `<div class="bmini"><div class="bmini-in swdoc" style="${themeCss(E.doc.theme)};--mt:20px;--mr:20px;--ml:20px;--mb:20px;--ph:300px">${SAN(html)}</div></div>`; }
function renderPanel(){
  const P = $('#edPanelBody'); $('#edPanelTitle').textContent = PANELS[panel]?.t || '';
  if (panel === 'templates'){
    const list = [...(E.userLib.templates || []), ...SW_TEMPLATES];
    P.innerHTML = `<p class="pn-hint">Partez d'un modèle : il s'ouvre dans un nouveau document, ou remplace celui-ci.</p><div class="pn-tpls">${list.map(t => `<button type="button" class="pn-tpl" data-tpl="${escH(t.id)}" title="${escH(t.desc || '')}"><div class="tthumb">${t.id === 'blank' ? '<div class="mini"><div class="mini-page swdoc blank"><span class="plus">+</span></div></div>' : `<div class="mini"><div class="mini-page swdoc" style="${themeCss(t.theme)}">${SAN(t.html.replace(/\{\{[^}]+\}\}/g, ''), {preview:true})}</div></div>`}</div><b>${escH(t.name)}</b></button>`).join('')}</div>
      <button type="button" class="pn-wide" data-act="save-tpl">${IC.plus}<span>Enregistrer ce document comme modèle</span></button>`;
    scaleMinis(P);
  } else if (panel === 'blocks'){
    const cats = ['Tous', ...new Set(BLOCKS.map(b => b.cat))];
    const list = BLOCKS.filter(b => (blockCat === 'Tous' || b.cat === blockCat) && (!blockQ || norm(b.name + ' ' + b.kw).includes(norm(blockQ))));
    P.innerHTML = `<label class="pn-search">${IC.search}<input id="pnBlockQ" placeholder="Rechercher un bloc" value="${escH(blockQ)}"></label>
      <div class="pn-chips">${cats.map(c => `<button type="button" data-bcat="${escH(c)}" aria-pressed="${c === blockCat}">${escH(c)}</button>`).join('')}</div>
      <p class="pn-hint">Cliquez pour insérer sous le curseur, ou glissez le bloc à l'endroit voulu.</p>
      <div class="pn-blocks">${list.map(b => `<button type="button" class="pn-block" data-block="${b.id}" draggable="true"><span class="pn-bprev">${b.inline ? `<span class="bmini-txt">${escH(b.html())}</span>` : miniBlock(b.html())}</span><b>${escH(b.name)}</b></button>`).join('') || '<p class="pn-hint">Aucun bloc ne correspond.</p>'}</div>`;
    const q = $('#pnBlockQ'); if (q && document.activeElement?.id !== 'pnBlockQ' && blockQ){ q.focus(); q.setSelectionRange(blockQ.length, blockQ.length); }
  } else if (panel === 'themes'){
    const v = themeVals(E.doc.theme);
    P.innerHTML = `<div class="pn-themes">${THEMES.map(t => { ensureFont(t.fh); return `<button type="button" class="pn-theme${E.doc.theme.id === t.id ? ' on' : ''}" data-theme="${t.id}"><span class="th-grad" style="background:${t.grad}"></span><span class="th-aa" style="font-family:${fontStack(t.fh)};color:${t.ink}">Aa</span><span class="th-sw"><i style="background:${t.ac}"></i><i style="background:${t.ac2}"></i><i style="background:${t.ac3}"></i></span><b>${escH(t.name)}</b><small>${escH(t.fh)}${t.fb !== t.fh ? ' · ' + escH(t.fb) : ''}</small></button>`; }).join('')}</div>
      <h4 class="pn-h">Personnaliser</h4>
      <div class="pn-form">
        <label>Couleur principale<span class="pn-color"><input type="color" id="thAc" value="${v.ac}"><code>${v.ac}</code></span></label>
        <label>Couleur secondaire<span class="pn-color"><input type="color" id="thAc2" value="${v.ac2}"><code>${v.ac2}</code></span></label>
        <label>Police des titres<select id="thFh">${FONTS.map(f => `<option${f[0] === v.fh ? ' selected' : ''}>${f[0]}</option>`).join('')}</select></label>
        <label>Police du texte<select id="thFb">${FONTS.map(f => `<option${f[0] === v.fb ? ' selected' : ''}>${f[0]}</option>`).join('')}</select></label>
        <label>Taille du texte <output id="thFsO">${Math.round(v.fs * .75 * 2) / 2} pt</output><input type="range" id="thFs" min="11" max="22" step="0.5" value="${v.fs}"></label>
        <label>Interligne <output id="thLhO">${String(v.lh).replace('.', ',')}</output><input type="range" id="thLh" min="1.1" max="2.2" step="0.05" value="${v.lh}"></label>
        <button type="button" class="pn-wide alt" data-act="theme-reset">Revenir au thème d'origine</button>
      </div>`;
  } else if (panel === 'elements'){
    P.innerHTML = `<h4 class="pn-h">Émojis</h4><div class="pn-emo">${EMOJIS.map(e => `<button type="button" data-ins="${e}">${e}</button>`).join('')}</div>
      <h4 class="pn-h">Étiquettes</h4><div class="pn-tags">${TAGS.map(t => `<button type="button" data-tag="${escH(t)}" class="swdoc" style="${themeCss(E.doc.theme)}"><span class="sw-tag">${escH(t)}</span></button>`).join('')}</div>
      <h4 class="pn-h">Symboles</h4><div class="pn-emo sym">${SYMBOLS.map(e => `<button type="button" data-ins="${escH(e)}">${escH(e)}</button>`).join('')}</div>
      <h4 class="pn-h">Formes décoratives</h4><div class="pn-shapes">${SHAPES.map(s => `<button type="button" data-shape="${s.id}" draggable="true" class="swdoc" style="${themeCss(E.doc.theme)}" title="${escH(s.name)}">${s.svg}</button>`).join('')}</div>`;
  } else if (panel === 'images'){
    const imgs = $$('figure.sw-img img', sheet());
    P.innerHTML = `<button type="button" class="pn-drop" data-act="img-upload">${IC.img}<b>Importer une image</b><span>ou glissez-la directement sur la page · PNG, JPEG, WebP</span></button>
      <p class="pn-hint">Les images sont optimisées automatiquement pour garder le document léger. Cliquez sur une image de la page pour la redimensionner, l'aligner ou l'habiller.</p>
      <button type="button" class="pn-wide alt" data-block-ins="imgtext">Bloc image + texte</button>
      ${imgs.length ? `<h4 class="pn-h">Dans ce document</h4><div class="pn-imgs">${imgs.map((im, i) => `<button type="button" data-goimg="${i}"><img src="${im.src}" alt=""></button>`).join('')}</div>` : ''}`;
  } else if (panel === 'outline') renderOutline();
}
function renderOutline(){
  const P = $('#edPanelBody'); if (panel !== 'outline' || !P) return;
  const step = E.geo.ph + E.geo.G;
  const hs = $$('h1, h2, h3', sheet()).filter(h => h.textContent.trim() && !h.closest('.sw-toc'));
  P.innerHTML = hs.length ? `<nav class="pn-outline">${hs.map((h, i) => `<button type="button" data-go="${i}" class="l${h.tagName[1]}"><span>${escH(h.textContent.trim())}</span><em>${Math.floor(relTop(h) / step) + 1}</em></button>`).join('')}</nav>`
    : '<p class="pn-hint">Le plan se construit tout seul à partir des titres (Titre 1, 2 et 3) du document.</p>';
  P.dataset.n = hs.length;
}
const outlineRefresh = debounce(() => { if (panel === 'outline') renderOutline(); }, 400);
function scaleMinis(root){ requestAnimationFrame(() => $$('.mini', root).forEach(m => { const w = m.clientWidth; if (w) m.style.setProperty('--s', w / 794); })); }
window.SWScaleMinis = scaleMinis;
function applyTheme(t){ flushRecord(); record(); E.doc.theme = t; applyGeometry(); paginate(); emitChange(true); record(); }

/* --- cadres contextuels (popovers) --- */
let popClose = null;
function openPop(anchor, html, wire, cls = ''){
  closePop(); const p = $('#edPop'); p.className = 'pop ' + cls; p.innerHTML = html; p.hidden = false;
  const r = anchor.getBoundingClientRect(); const w = p.offsetWidth, h = p.offsetHeight;
  p.style.left = clamp(r.left, 8, innerWidth - w - 8) + 'px'; p.style.top = (r.bottom + h + 8 > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6) + 'px';
  wire && wire(p);
  popClose = e => { if (!p.contains(e.target) && !anchor.contains(e.target)) closePop(); };
  setTimeout(() => document.addEventListener('mousedown', popClose), 0);
}
function closePop(){ const p = $('#edPop'); if (p) p.hidden = true; if (popClose) document.removeEventListener('mousedown', popClose); popClose = null; }
const STD_COLORS = ['#000000', '#3F3F46', '#71717A', '#B91C1C', '#EA580C', '#CA8A04', '#16A34A', '#0D9488', '#2563EB', '#4F46E5', '#9333EA', '#DB2777'];
const HL_COLORS = ['#FFF1A8', '#FFE0B2', '#FFD1DC', '#E9D5FF', '#D6E4FF', '#CFF5E7', '#E2E8F0'];
function colorPop(anchor, back){
  const v = themeVals(E.doc.theme);
  const themeC = back ? [] : [['var(--ac)', v.ac, 'Principale'], ['var(--ac2)', v.ac2, 'Secondaire'], ['var(--ac3)', v.ac3, 'Tertiaire'], ['var(--ink)', v.ink, 'Texte'], ['var(--mut)', v.mut, 'Discret']];
  openPop(anchor, `${back ? '' : `<p class="pop-h">Couleurs du thème <small>suivent le thème</small></p><div class="pop-sw">${themeC.map(([k, c, n]) => `<button type="button" data-c="${k}" title="${n}" style="background:${c}"></button>`).join('')}</div>`}
    <p class="pop-h">${back ? 'Surligner' : 'Couleurs'}</p><div class="pop-sw">${(back ? HL_COLORS : STD_COLORS).map(c => `<button type="button" data-c="${c}" style="background:${c}"></button>`).join('')}</div>
    <div class="pop-row"><label class="pop-custom"><input type="color" id="popCol" value="${back ? '#fff1a8' : '#6d3bff'}"><span>Personnalisée</span></label><button type="button" class="pop-link" data-c="${back ? 'transparent' : 'inherit'}">${back ? 'Aucun' : 'Automatique'}</button></div>`, p => {
    p.onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; closePop(); inlineStyle(back ? 'background-color' : 'color', b.dataset.c, back); };
    $('#popCol', p).onchange = e => { closePop(); inlineStyle(back ? 'background-color' : 'color', e.target.value, back); };
  });
}
function tablePop(anchor){
  openPop(anchor, `<p class="pop-h">Insérer un tableau <small id="tpN">3 × 3</small></p><div class="pop-grid">${Array.from({length:64}, (_, i) => `<i data-r="${Math.floor(i / 8) + 1}" data-c="${i % 8 + 1}"></i>`).join('')}</div>`, p => {
    const g = $('.pop-grid', p);
    g.onmouseover = e => { const t = e.target.closest('i'); if (!t) return; const r = +t.dataset.r, c = +t.dataset.c; $$('i', g).forEach(x => x.classList.toggle('on', +x.dataset.r <= r && +x.dataset.c <= c)); $('#tpN', p).textContent = `${c} × ${r}`; };
    g.onclick = e => { const t = e.target.closest('i'); if (!t) return; closePop(); restoreSel(); insertHTMLBlock(tableHtml(+t.dataset.r + 1, +t.dataset.c, 'sw-table')); };
  });
}
function spacingPop(anchor){
  openPop(anchor, `<p class="pop-h">Interligne</p><div class="pop-list">${[['', 'Selon le thème'], ['1', 'Simple · 1,0'], ['1.15', '1,15'], ['1.5', '1,5'], ['2', 'Double · 2,0']].map(([v, t]) => `<button type="button" data-lh="${v}">${t}</button>`).join('')}</div>
    <p class="pop-h">Espace après le paragraphe</p><div class="pop-list">${[[null, 'Par défaut'], [0, 'Aucun'], [0.5, 'Petit'], [1.2, 'Grand']].map(([v, t]) => `<button type="button" data-sa="${v}">${t}</button>`).join('')}</div>`, p => {
    p.onclick = e => { const a = e.target.closest('[data-lh]'), b = e.target.closest('[data-sa]'); if (a){ closePop(); setLineHeight(a.dataset.lh); } if (b){ closePop(); setSpaceAfter(b.dataset.sa === 'null' ? null : +b.dataset.sa); } };
  });
}
function insertPop(anchor){
  openPop(anchor, `<div class="pop-list ins">
    <button type="button" data-i="img">${IC.img}<span>Image</span></button><button type="button" data-i="table">${IC.table}<span>Tableau…</span></button>
    <button type="button" data-i="link">${IC.link}<span>Lien</span></button><button type="button" data-i="pagebreak">${IC.page}<span>Saut de page</span></button>
    <button type="button" data-i="div-grad"><svg viewBox="0 0 24 24"><path d="M3 12h18"/></svg><span>Séparateur</span></button><button type="button" data-i="toc"><svg viewBox="0 0 24 24"><path d="M4 6h10M4 12h14M4 18h8M18 6h2M20 18h0"/></svg><span>Sommaire</span></button>
    <button type="button" data-i="cols2"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="8" height="16" rx="2"/><rect x="13" y="4" width="8" height="16" rx="2"/></svg><span>Colonnes</span></button><button type="button" data-i="info"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M12 9v.01M12 12v4"/></svg><span>Encadré</span></button>
    <button type="button" data-i="date"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><span>Date du jour</span></button><button type="button" data-i="sign"><svg viewBox="0 0 24 24"><path d="M3 17c3-6 5-9 7-9s0 7 2 7 3-4 5-4 1 3 4 3M3 21h18"/></svg><span>Signatures</span></button>
    <button type="button" data-i="elements"><span class="emo">Ω</span><span>Caractère spécial</span></button><button type="button" data-i="blocks">${IC.sparkle}<span>Tous les blocs…</span></button></div>`, p => {
    p.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const k = b.dataset.i; if (k === 'table') return tablePop(anchor); closePop(); restoreSel();
      if (k === 'img') return $('#edImgFile').click(); if (k === 'link') return linkDlg(); if (k === 'elements' || k === 'blocks') return openPanel(k) ;
      insertBlockById(k); };
  }, 'wide');
}

/* --- lien --- */
function linkDlg(){
  saveSel(); const s = getSelection(); const a = s.anchorNode && (s.anchorNode.nodeType === 3 ? s.anchorNode.parentElement : s.anchorNode).closest?.('a');
  const txt = a ? a.textContent : (s.rangeCount ? s.toString() : '');
  SWDlg.open(`<h3>${a ? 'Modifier le lien' : 'Insérer un lien'}</h3><form id="lkF"><label class="ap-field"><span>Adresse (URL, email…)</span><span class="ap-in"><input id="lkU" value="${escH(a?.getAttribute('href') || '')}" placeholder="https://exemple.fr" autocomplete="off"></span></label>
    ${!txt ? '<label class="ap-field"><span>Texte affiché</span><span class="ap-in"><input id="lkT" placeholder="Texte du lien"></span></label>' : ''}<p class="ap-err" id="lkE"></p>
    <div class="dlg-acts">${a ? '<button type="button" class="ap-btn alt" id="lkRm">Retirer le lien</button>' : ''}<button type="button" class="ap-btn alt" data-dlg="close">Annuler</button><button class="ap-btn" type="submit">${a ? 'Enregistrer' : 'Insérer'}</button></div></form>`, d => {
    if (a) $('#lkRm', d).onclick = () => { SWDlg.close(); const r = document.createRange(); r.selectNodeContents(a); restoreSel(); getSelection().removeAllRanges(); getSelection().addRange(r); cmd('unlink'); };
    $('#lkF', d).onsubmit = e => { e.preventDefault(); let u = $('#lkU', d).value.trim(); if (!u) return $('#lkE', d).textContent = 'Indiquez une adresse.';
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u)) u = 'mailto:' + u; else if (/^\+?[\d\s.]{8,}$/.test(u)) u = 'tel:' + u.replace(/\s/g, ''); else if (!/^(https?:|mailto:|tel:|#)/i.test(u)) u = 'https://' + u;
      SWDlg.close(); restoreSel();
      if (a){ flushRecord(); record(); a.setAttribute('href', u); if (!u.startsWith('#')){ a.target = '_blank'; a.rel = 'noopener noreferrer'; } changed({record:true}); return; }
      const t = $('#lkT', d)?.value.trim();
      if (t || getSelection().isCollapsed){ insertHTMLInline(`<a href="${escH(u)}" target="_blank" rel="noopener noreferrer">${escH(t || u)}</a>`); }
      else { cmd('createLink', u); $$('a[href]', sheet()).forEach(x => { if (x.getAttribute('href') === u && !u.startsWith('#')){ x.target = '_blank'; x.rel = 'noopener noreferrer'; } }); }
    };
  });
}
function insertHTMLInline(html){ restoreSelIfNeeded(); flushRecord(); record(); document.execCommand('insertHTML', false, SAN(html)); changed({record:true}); }

/* --- mise en page --- */
function pageDlg(){
  const p = E.doc.page;
  SWDlg.open(`<h3>Mise en page</h3><form id="pgF" class="pg-form">
    <div class="ap-grid2"><label class="ap-field"><span>Format</span><span class="ap-in"><select id="pgS">${Object.keys(PAGE_SIZES).map(k => `<option value="${k}"${p.size === k ? ' selected' : ''}>${PAGE_LABEL[k]}</option>`).join('')}</select></span></label>
    <label class="ap-field"><span>Orientation</span><span class="ap-in"><select id="pgO"><option value="p"${p.orient !== 'l' ? ' selected' : ''}>Portrait</option><option value="l"${p.orient === 'l' ? ' selected' : ''}>Paysage</option></select></span></label></div>
    <label class="ap-field"><span>Marges</span><span class="ap-in"><select id="pgM">${Object.keys(MARGINS).map(k => `<option value="${k}"${p.margins === k ? ' selected' : ''}>${MARGIN_LABEL[k]}</option>`).join('')}</select></span></label>
    <div class="ap-grid2"><label class="ap-field"><span>Numéros de page</span><span class="ap-in"><select id="pgN"><option value="">Aucun</option><option value="n"${p.numbers && p.numStyle !== 'np' ? ' selected' : ''}>1, 2, 3…</option><option value="np"${p.numbers && p.numStyle === 'np' ? ' selected' : ''}>Page 1 / 5</option></select></span></label>
    <label class="ap-field"><span>Position</span><span class="ap-in"><select id="pgNP"><option value="c"${p.numPos !== 'r' ? ' selected' : ''}>En bas, au centre</option><option value="r"${p.numPos === 'r' ? ' selected' : ''}>En bas, à droite</option></select></span></label></div>
    <label class="ap-field"><span>En-tête <small>· {titre} {date} {page} {pages}</small></span><span class="ap-in"><input id="pgH" value="${escH(p.header)}" placeholder="Ex. : {titre}"></span></label>
    <label class="ap-field"><span>Pied de page</span><span class="ap-in"><input id="pgFt" value="${escH(p.footer)}" placeholder="Ex. : Société · Confidentiel"></span></label>
    <div class="ap-grid2"><label class="ap-field"><span>Couleur des pages</span><span class="ap-in pn-color"><input type="color" id="pgBg" value="${escH(p.bg || '#ffffff')}"></span></label>
    <label class="ap-field"><span>Filigrane</span><span class="ap-in"><input id="pgW" list="pgWL" value="${escH(p.watermark)}" placeholder="Aucun"><datalist id="pgWL"><option>BROUILLON</option><option>CONFIDENTIEL</option><option>COPIE</option><option>EXEMPLE</option></datalist></span></label></div>
    <div class="dlg-acts"><button type="button" class="ap-btn alt" data-dlg="close">Annuler</button><button class="ap-btn" type="submit">Appliquer</button></div></form>`, d => {
    $('#pgF', d).onsubmit = e => { e.preventDefault(); flushRecord(); record();
      const n = $('#pgN', d).value;
      E.doc.page = {...p, size:$('#pgS', d).value, orient:$('#pgO', d).value, margins:$('#pgM', d).value, numbers:!!n, numStyle:n || 'n', numPos:$('#pgNP', d).value, header:$('#pgH', d).value.slice(0, 120), footer:$('#pgFt', d).value.slice(0, 120), bg:$('#pgBg', d).value, watermark:$('#pgW', d).value.slice(0, 24)};
      SWDlg.close(); applyGeometry(); paginate(); record(); emitChange(true); toast('Mise en page appliquée'); };
  }, 'wide');
}

/* --- rechercher / remplacer --- */
const FR = {hits:[], i:-1};
function frSearch(){
  const q = $('#frQ').value, cs = $('#frCase').checked; FR.hits = []; FR.i = -1;
  if (CSS.highlights) CSS.highlights.delete('sw-find');
  if (q){
    const w = document.createTreeWalker(sheet(), NodeFilter.SHOW_TEXT); let n; const qq = cs ? q : q.toLowerCase();
    while ((n = w.nextNode())){ const t = cs ? n.data : n.data.toLowerCase(); let i = 0; while ((i = t.indexOf(qq, i)) >= 0){ const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + q.length); FR.hits.push(r); i += q.length; } }
    if (CSS.highlights && FR.hits.length) CSS.highlights.set('sw-find', new Highlight(...FR.hits));
  }
  $('#frN').textContent = q ? (FR.hits.length ? `0 / ${FR.hits.length}` : 'aucun') : '';
}
function frGo(d){ if (!FR.hits.length) return; FR.i = (FR.i + d + FR.hits.length) % FR.hits.length; const r = FR.hits[FR.i]; const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  if (CSS.highlights) CSS.highlights.set('sw-find-cur', new Highlight(r)); r.startContainer.parentElement?.scrollIntoView({block:'center', behavior:'smooth'}); $('#frN').textContent = `${FR.i + 1} / ${FR.hits.length}`; }
function frReplace(all){
  if (E.ro || !FR.hits.length) return; flushRecord(); record(); const rep = $('#frR').value;
  const list = all ? [...FR.hits].reverse() : [FR.hits[FR.i < 0 ? 0 : FR.i]];
  list.forEach(r => { r.deleteContents(); r.insertNode(document.createTextNode(rep)); });
  sheet().normalize(); changed({record:true}); toast(all ? `${list.length} remplacement${list.length > 1 ? 's' : ''}` : 'Remplacé'); frSearch(); if (!all) frGo(1);
}
function openFind(replace){ const b = $('#findBar'); b.hidden = false; b.classList.toggle('rep', !!replace || b.classList.contains('rep')); const q = $('#frQ'); const s = getSelection().toString(); if (s && s.length < 60) q.value = s; q.focus(); q.select(); frSearch(); }
function closeFind(){ $('#findBar').hidden = true; if (CSS.highlights){ CSS.highlights.delete('sw-find'); CSS.highlights.delete('sw-find-cur'); } }

/* --- typographie française : espaces insécables, guillemets, apostrophes, points de suspension --- */
function frenchTypo(){
  if (E.ro) return; flushRecord(); record(); let n = 0;
  const w = document.createTreeWalker(sheet(), NodeFilter.SHOW_TEXT, {acceptNode:x => x.parentElement.closest('pre,code') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
  let t; while ((t = w.nextNode())){
    const o = t.data;
    let v = o.replace(/ {2,}/g, ' ').replace(/\.\.\./g, '…').replace(/(\w)'(\w)/g, '$1’$2')
      .replace(/"([^"]*)"/g, '« $1 »').replace(/«\s*/g, '« ').replace(/\s*»/g, ' »')
      .replace(/(\S)\s*([;!?])(?=\s|$)/g, (m, a, b) => /[  ]/.test(a) ? m : a + ' ' + b)
      .replace(/(\S) ?:(?=\s|$)/g, '$1 :');
    v = v.replace(/  /g, ' ');
    if (v !== o){ t.data = v; n++; }
  }
  changed({record:true}); toast(n ? 'Typographie française appliquée' : 'Rien à corriger');
}

/* --- commande « / » --- */
const SLASH_BASE = [
  {t:'Texte', k:'texte paragraphe normal', ic:'¶', run:() => setBlock('p')},
  {t:'Titre 1', k:'titre h1 grand', ic:'H1', run:() => setBlock('h1')}, {t:'Titre 2', k:'titre h2', ic:'H2', run:() => setBlock('h2')}, {t:'Titre 3', k:'titre h3', ic:'H3', run:() => setBlock('h3')},
  {t:'Liste à puces', k:'liste puces', ic:'•', run:() => cmd('insertUnorderedList')}, {t:'Liste numérotée', k:'liste numerotee nombres', ic:'1.', run:() => cmd('insertOrderedList')},
  {t:'Liste de tâches', k:'taches checklist cases', ic:'☑', run:() => toggleChecklist()}, {t:'Citation', k:'citation quote', ic:'❝', run:() => setBlock('blockquote')},
  {t:'Image', k:'image photo', ic:'▣', run:() => $('#edImgFile').click()}, {t:'Tableau 3 × 3', k:'tableau table', ic:'▦', run:() => insertHTMLBlock(tableHtml(3, 3, 'sw-table'))},
  {t:'Lien', k:'lien url', ic:'🔗', run:() => linkDlg()},
];
const SLASH = () => [...SLASH_BASE, ...BLOCKS.filter(b => !['table'].includes(b.id)).map(b => ({t:b.name, k:b.kw + ' ' + b.cat, ic:'✦', cat:b.cat, run:() => insertBlockById(b.id)}))];
const SL = {open:false, items:[], i:0, node:null, start:0};
function slashCheck(){
  const s = getSelection(); if (!s.rangeCount || !s.isCollapsed || E.ro) return slashClose();
  const n = s.anchorNode; if (!n || n.nodeType !== 3 || !sheet().contains(n)) return slashClose();
  const before = n.data.slice(0, s.anchorOffset), m = before.match(/(?:^|[\s ])\/([\wÀ-ÿ -]{0,24})$/);
  if (!m || /\s{2}/.test(m[1])) return slashClose();
  const q = norm(m[1]); SL.node = n; SL.start = s.anchorOffset - m[1].length - 1;
  SL.items = SLASH().filter(it => !q || norm(it.t + ' ' + it.k).includes(q)).slice(0, 40);
  if (!SL.items.length) return slashClose();
  SL.open = true; SL.i = Math.min(SL.i, SL.items.length - 1);
  const box = $('#slashMenu'); box.hidden = false;
  box.innerHTML = `<p class="sl-h">${q ? 'Résultats' : 'Insérer'}</p>` + SL.items.map((it, i) => `<button type="button" data-sl="${i}" class="${i === SL.i ? 'on' : ''}"><i>${it.ic}</i><span>${escH(it.t)}${it.cat ? `<small>${escH(it.cat)}</small>` : ''}</span></button>`).join('');
  const r = s.getRangeAt(0).getBoundingClientRect(); const h = box.offsetHeight;
  box.style.left = clamp(r.left, 8, innerWidth - box.offsetWidth - 8) + 'px'; box.style.top = (r.bottom + h + 8 > innerHeight ? r.top - h - 6 : r.bottom + 6) + 'px';
  box.querySelector('.on')?.scrollIntoView({block:'nearest'});
}
function slashClose(){ SL.open = false; SL.i = 0; const b = $('#slashMenu'); if (b) b.hidden = true; }
function slashRun(i){
  const it = SL.items[i]; if (!it) return; const n = SL.node, s = getSelection();
  if (n && n.isConnected){ const r = document.createRange(); r.setStart(n, Math.max(0, SL.start)); r.setEnd(n, Math.min(n.length, s.anchorOffset >= SL.start ? s.anchorOffset : n.length)); r.deleteContents(); s.removeAllRanges(); const r2 = document.createRange(); r2.setStart(n, Math.max(0, SL.start)); r2.collapse(true); s.addRange(r2); }
  slashClose(); saveSel(); it.run();
}

/* --- poignée de bloc : déplacer, dupliquer, supprimer, transformer --- */
let hoverBlock = null, dragBlock = null;
function placeHandle(el){
  const h = $('#blkHandle'); if (!el || E.ro || innerWidth < 760){ h.hidden = true; hoverBlock = null; return; }
  hoverBlock = el; h.hidden = false;
  const p = overlayPos(el.getBoundingClientRect());
  h.style.top = (p.y + Math.min(4, p.h / 2 - 12)) + 'px'; h.style.left = Math.max(4, E.geo.ml - 58) + 'px';
}
function blockMenu(anchor, el){
  const conv = [['p', '', 'Texte'], ['h1', '', 'Titre 1'], ['h2', '', 'Titre 2'], ['h3', '', 'Titre 3'], ['blockquote', '', 'Citation']];
  const textual = /^(P|H[1-6]|BLOCKQUOTE)$/.test(el.tagName);
  openPop(anchor, `<div class="pop-list">
    <button type="button" data-b="up">${IC.up}<span>Monter</span></button><button type="button" data-b="down">${IC.down}<span>Descendre</span></button>
    <button type="button" data-b="dup">${IC.copy}<span>Dupliquer</span></button><button type="button" data-b="add">${IC.plus}<span>Insérer un bloc dessous</span></button>
    <button type="button" data-b="break">${IC.page}<span>Commencer sur une nouvelle page</span></button>
    ${textual ? `<hr><p class="pop-h">Transformer en</p>${conv.map(([t, c, n]) => `<button type="button" data-conv="${t}">${n}</button>`).join('')}` : ''}
    <hr><button type="button" data-b="del" class="danger">${IC.trash}<span>Supprimer</span></button></div>`, p => {
    p.onclick = e => {
      const b = e.target.closest('[data-b],[data-conv]'); if (!b) return; closePop();
      if (b.dataset.conv){ caretToStart(el); return setBlock(b.dataset.conv); }
      flushRecord(); record(); const k = b.dataset.b;
      if (k === 'up' && el.previousElementSibling) el.parentNode.insertBefore(el, el.previousElementSibling);
      else if (k === 'down' && el.nextElementSibling) el.parentNode.insertBefore(el.nextElementSibling, el);
      else if (k === 'dup'){ const c = el.cloneNode(true); c.removeAttribute('data-sw-id'); $$('[data-sw-id]', c).forEach(x => x.removeAttribute('data-sw-id')); el.after(c); }
      else if (k === 'del'){ const nx = el.nextElementSibling || el.previousElementSibling; el.remove(); if (!sheet().children.length) sheet().innerHTML = '<p><br></p>'; if (nx) caretToStart(nx); }
      else if (k === 'break'){ const prev = el.previousElementSibling; if (!(prev && prev.dataset.sw === 'pagebreak')){ const t = document.createElement('template'); t.innerHTML = PAGEBREAK; el.before(t.content.firstChild); } }
      else if (k === 'add'){ caretToEnd(el); saveSel(); return addMenu(anchor, el); }
      changed({record:true}); paginate(); placeHandle(null);
    };
  });
}
function addMenu(anchor, el){
  openPop(anchor, `<label class="pn-search">${IC.search}<input id="amQ" placeholder="Rechercher un bloc…"></label><div class="pop-list am" id="amL"></div>`, p => {
    const draw = q => { const l = SLASH().filter(it => !q || norm(it.t + ' ' + it.k).includes(norm(q))).slice(0, 30); $('#amL', p).innerHTML = l.map((it, i) => `<button type="button" data-am="${i}"><i class="am-ic">${it.ic}</i><span>${escH(it.t)}</span></button>`).join(''); p._l = l; };
    draw(''); $('#amQ', p).oninput = e => draw(e.target.value); setTimeout(() => $('#amQ', p).focus(), 30);
    p.onclick = e => { const b = e.target.closest('[data-am]'); if (!b) return; closePop(); const it = p._l[+b.dataset.am];
      const np = document.createElement('p'); np.innerHTML = '<br>'; el.after(np); caretToStart(np); saveSel(); it.run(); };
  }, 'wide');
}
function dropTarget(e){
  const S = sheet(); let best = null, where = 'after';
  for (const el of S.children){ const r = el.getBoundingClientRect(); if (e.clientY < r.top + r.height / 2){ best = el; where = 'before'; break; } best = el; where = 'after'; }
  return {el:best, where};
}
function showDropLine(t){
  const l = $('#dropLine'); if (!t.el){ l.hidden = true; return; }
  const p = overlayPos(t.el.getBoundingClientRect()); l.hidden = false; l.style.top = (t.where === 'before' ? p.y - 4 : p.y + p.h + 2) + 'px'; l.style.left = E.geo.ml + 'px'; l.style.width = (E.geo.pw - E.geo.ml - E.geo.mr) + 'px';
}
