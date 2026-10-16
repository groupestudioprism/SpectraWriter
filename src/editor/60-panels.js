/* ---------- Barre Prisme : les rayons (Insérer, Thème, Page, Plan, Modèles) ouvrent un tiroir au-dessus de la barre ---------- */
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
let panel = '';
const PANELS = {
  insert:{t:'Insérer', sub:'Cliquez pour ajouter sous le curseur, ou glissez sur la page.', c:'#7B3FF2', ic:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'},
  theme:{t:'Thème', sub:'Les couleurs et les polices de tout le document, en un geste.', c:'#12B5E5', ic:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/></svg>'},
  page:{t:'Page', sub:'Format, marges, en-tête, numéros : appliqué tout de suite.', c:'#2FBF71', ic:'<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/></svg>'},
  outline:{t:'Plan', sub:'La structure du document, ses chiffres et votre objectif.', c:'#F5B82E', ic:'<svg viewBox="0 0 24 24"><path d="M4 6h16M8 12h12M8 18h12"/></svg>'},
  templates:{t:'Modèles', sub:'Repartir d\'un modèle : dans un nouveau document, ou à la place de celui-ci.', c:'#FF7A2F', ic:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="9" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.5"/><rect x="3.5" y="15.5" width="7" height="5" rx="1.5"/></svg>'},
};
function renderRail(){
  $('#edRail').innerHTML = Object.entries(PANELS).map(([k, p]) => `<button type="button" class="ray" data-panel="${k}" aria-pressed="${panel === k}" style="--ray:${p.c}" title="${p.t}">${p.ic}<span>${p.t}</span></button>`).join('');
}
function openPanel(k){
  panel = panel === k ? '' : k; renderRail();
  const P = $('#edPanel'); P.hidden = !panel; document.body.classList.toggle('panel-open', !!panel);
  if (panel){ P.style.setProperty('--ray', PANELS[panel].c); renderPanel(); $('#edPanelBody').scrollTop = 0; }
  setTimeout(() => { placeTools(); }, 0);
}
function panelRefresh(){ if (['theme', 'outline', 'page'].includes(panel)) renderPanel(); }
let blockQ = '', blockCat = 'Tout';
function miniBlock(html){ return `<div class="bmini"><div class="bmini-in swdoc" style="${themeCss(E.doc.theme)};--mt:20px;--mr:20px;--ml:20px;--mb:20px;--ph:300px">${SAN(html)}</div></div>`; }
const seg = (name, cur, opts) => `<div class="seg" role="radiogroup" data-seg="${name}">${opts.map(([v, t]) => `<button type="button" role="radio" data-v="${escH(v)}" aria-checked="${String(cur) === String(v)}">${t}</button>`).join('')}</div>`;
function renderPanel(){
  const P = $('#edPanelBody'); $('#edPanelTitle').textContent = PANELS[panel]?.t || ''; $('#edPanelSub').textContent = PANELS[panel]?.sub || '';
  if (panel === 'insert'){
    const cats = ['Tout', ...new Set(BLOCKS.map(b => b.cat)), 'Images', 'Éléments'];
    const q = norm(blockQ);
    const list = BLOCKS.filter(b => (blockCat === 'Tout' || b.cat === blockCat) && (!q || norm(b.name + ' ' + b.kw + ' ' + b.cat).includes(q)));
    const imgs = $$('figure.sw-img img', sheet());
    const showBlocks = blockCat !== 'Images' && blockCat !== 'Éléments';
    const showImg = blockCat === 'Images' || (blockCat === 'Tout' && !q);
    const showEl = blockCat === 'Éléments' || (blockCat === 'Tout' && !q);
    P.innerHTML = `<div class="dr-top"><label class="pn-search">${IC.search}<input id="pnBlockQ" placeholder="Rechercher : tableau, encadré, couverture…" value="${escH(blockQ)}"></label>
      <div class="pn-chips">${cats.map(c => `<button type="button" data-bcat="${escH(c)}" aria-pressed="${c === blockCat}">${escH(c)}</button>`).join('')}</div></div>
      ${showBlocks ? `<div class="pn-blocks">${list.map(b => `<button type="button" class="pn-block" data-block="${b.id}" draggable="true"><span class="pn-bprev">${b.inline ? `<span class="bmini-txt">${escH(b.html())}</span>` : miniBlock(b.html())}</span><b>${escH(b.name)}</b></button>`).join('') || '<p class="pn-hint">Aucun bloc ne correspond. Essayez un autre mot.</p>'}</div>` : ''}
      ${showImg ? `<h4 class="pn-h">Images</h4><div class="pn-imgrow"><button type="button" class="pn-drop" data-act="img-upload">${IC.img}<b>Ajouter une image</b><span>ou glissez-la sur la page</span></button>${imgs.map((im, i) => `<button type="button" class="pn-imgthumb" data-goimg="${i}" title="Aller à l'image"><img src="${im.src}" alt=""></button>`).join('')}</div>` : ''}
      ${showEl ? `<h4 class="pn-h">Émojis <small>ou tapez « : » dans le texte</small></h4><div class="pn-emo">${EMOJIS.map(e => `<button type="button" data-ins="${e}">${e}</button>`).join('')}</div>
      <h4 class="pn-h">Étiquettes</h4><div class="pn-tags">${TAGS.map(t => `<button type="button" data-tag="${escH(t)}" class="swdoc" style="${themeCss(E.doc.theme)}"><span class="sw-tag">${escH(t)}</span></button>`).join('')}</div>
      <h4 class="pn-h">Symboles</h4><div class="pn-emo sym">${SYMBOLS.map(e => `<button type="button" data-ins="${escH(e)}">${escH(e)}</button>`).join('')}</div>
      <h4 class="pn-h">Formes</h4><div class="pn-shapes">${SHAPES.map(s => `<button type="button" data-shape="${s.id}" draggable="true" class="swdoc" style="${themeCss(E.doc.theme)}" title="${escH(s.name)}">${s.svg}</button>`).join('')}</div>` : ''}`;
    requestAnimationFrame(() => $$('.bmini', P).forEach(m => m.style.setProperty('--bs', m.clientWidth / 600)));
    const qi = $('#pnBlockQ'); if (qi && blockQ){ qi.focus(); qi.setSelectionRange(blockQ.length, blockQ.length); }
  } else if (panel === 'theme'){
    const v = themeVals(E.doc.theme);
    P.innerHTML = `<div class="th-row">${THEMES.map(t => { ensureFont(t.fh); return `<button type="button" class="pn-theme${E.doc.theme.id === t.id ? ' on' : ''}" data-thm="${t.id}" aria-pressed="${E.doc.theme.id === t.id}">
        <span class="th-card" style="background:#fff"><span class="th-band" style="background:${t.grad}"></span><span class="th-aa" style="font-family:${fontStack(t.fh)};color:${t.ink};font-weight:${t.hw}">Aa</span><span class="th-line" style="background:${t.ac}"></span><span class="th-line s" style="background:${t.line}"></span></span>
        <b>${escH(t.name)}</b><small>${escH(t.fh)}</small></button>`; }).join('')}</div>
      <div class="th-custom">
        <label>Couleur principale<span class="pn-color"><input type="color" id="thAc" value="${v.ac}"><code>${v.ac}</code></span></label>
        <label>Couleur d'accompagnement<span class="pn-color"><input type="color" id="thAc2" value="${v.ac2}"><code>${v.ac2}</code></span></label>
        <label>Police des titres<select id="thFh">${FONTS.map(f => `<option${f[0] === v.fh ? ' selected' : ''}>${f[0]}</option>`).join('')}</select></label>
        <label>Police du texte<select id="thFb">${FONTS.map(f => `<option${f[0] === v.fb ? ' selected' : ''}>${f[0]}</option>`).join('')}</select></label>
        <label>Taille du texte <output id="thFsO">${Math.round(v.fs * .75 * 2) / 2} pt</output><input type="range" id="thFs" min="11" max="22" step="0.5" value="${v.fs}"></label>
        <label>Interligne <output id="thLhO">${String(v.lh).replace('.', ',')}</output><input type="range" id="thLh" min="1.1" max="2.2" step="0.05" value="${v.lh}"></label>
        <button type="button" class="pn-wide alt" data-act="theme-reset">Revenir au thème d'origine</button>
      </div>`;
  } else if (panel === 'page'){
    const p = E.doc.page;
    P.innerHTML = `<div class="pg-grid">
      <div class="pgf"><span>Format</span>${seg('size', p.size, Object.keys(PAGE_SIZES).map(k => [k, k === 'Letter' ? 'Lettre US' : k === 'Legal' ? 'Légal US' : k]))}</div>
      <div class="pgf"><span>Orientation</span>${seg('orient', p.orient || 'p', [['p', 'Portrait'], ['l', 'Paysage']])}</div>
      <div class="pgf"><span>Marges</span>${seg('margins', p.margins, [['normal', 'Normales'], ['narrow', 'Étroites'], ['wide', 'Larges'], ['none', 'Aucune']])}</div>
      <div class="pgf"><span>Numéros de page</span>${seg('num', p.numbers ? (p.numStyle === 'np' ? 'np' : 'n') : '', [['', 'Aucun'], ['n', '1, 2, 3'], ['np', 'Page 1 sur 5']])}</div>
      <div class="pgf"><span>Position des numéros</span>${seg('numPos', p.numPos === 'r' ? 'r' : 'c', [['c', 'Au centre'], ['r', 'À droite']])}</div>
      <div class="pgf"><span>Couleur des pages</span><div class="pg-bg">${['#ffffff', '#FBFAF7', '#F6F8FB', '#FFF8F1', '#F4F9F4', '#F7F4FC', '#16141F'].map(c => `<button type="button" data-pgbg="${c}" style="background:${c}" aria-pressed="${(p.bg || '#ffffff').toLowerCase() === c.toLowerCase()}" title="${c}"></button>`).join('')}<input type="color" class="pg-cc" id="pgBgC" value="${escH(p.bg || '#ffffff')}" title="Autre couleur" aria-label="Autre couleur"></div></div>
      <label class="pgf wide"><span>En-tête <small>vous pouvez écrire {titre}, {date}, {page}, {pages}</small></span><input id="pgHdr" value="${escH(p.header)}" placeholder="Par exemple : {titre}"></label>
      <label class="pgf wide"><span>Pied de page</span><input id="pgFtr" value="${escH(p.footer)}" placeholder="Par exemple : Ma société, document confidentiel"></label>
      <label class="pgf"><span>Filigrane</span><input id="pgWm" list="pgWL" value="${escH(p.watermark)}" placeholder="Aucun"><datalist id="pgWL"><option>BROUILLON</option><option>CONFIDENTIEL</option><option>COPIE</option><option>EXEMPLE</option></datalist></label>
    </div>`;
  } else if (panel === 'outline'){
    renderOutline();
  } else if (panel === 'templates'){
    const list = [...(E.userLib.templates || []), ...SW_TEMPLATES];
    P.innerHTML = `<div class="pn-tpls">${list.map(t => `<button type="button" class="pn-tpl" data-tpl="${escH(t.id)}" title="${escH(t.desc || '')}"><div class="tthumb">${t.id === 'blank' ? '<div class="mini"><div class="mini-page swdoc blank"><span class="plus">+</span></div></div>' : `<div class="mini"><div class="mini-page swdoc" style="${themeCss(t.theme)}">${SAN(t.html.replace(/\{\{[^}]+\}\}/g, ''), {preview:true})}</div></div>`}</div><b>${escH(t.name)}</b></button>`).join('')}</div>
      <button type="button" class="pn-wide" data-act="save-tpl">${IC.plus}<span>Enregistrer ce document comme modèle</span></button>`;
    scaleMinis(P);
  }
}
function renderOutline(){
  const P = $('#edPanelBody'); if (panel !== 'outline' || !P) return;
  const step = E.geo.ph + E.geo.G;
  const hs = $$('h1, h2, h3', sheet()).filter(h => h.textContent.trim() && !h.closest('.sw-toc'));
  const t = sheet().innerText.replace(/​/g, ''), w = countWords(t), goal = +E.doc.page.goal || 0, pct = goal ? Math.min(100, Math.round(w / goal * 100)) : 0;
  P.innerHTML = `<div class="ol-wrap"><div class="ol-list">${hs.length ? `<nav class="pn-outline">${hs.map((h, i) => `<button type="button" data-go="${i}" class="l${h.tagName[1]}"><span>${escH(h.textContent.trim())}</span><em>p. ${Math.floor(relTop(h) / step) + 1}</em></button>`).join('')}</nav>`
    : '<p class="pn-hint">Le plan se construit tout seul avec les titres du document. Choisissez « Titre 1, 2 ou 3 » dans la barre, ou tapez # suivi d\'un espace.</p>'}</div>
    <aside class="ol-side"><div class="ol-stats"><div><b>${w.toLocaleString('fr-FR')}</b><span>mots</span></div><div><b>${E.pages}</b><span>page${E.pages > 1 ? 's' : ''}</span></div><div><b>${Math.max(1, Math.round(w / 230))} min</b><span>de lecture</span></div><div><b>${t.replace(/\s/g, '').length.toLocaleString('fr-FR')}</b><span>caractères</span></div></div>
    <label class="ol-goal"><span>Objectif de mots</span><input id="olGoal" type="number" min="0" step="50" value="${goal || ''}" placeholder="Par exemple : 1000"></label>
    ${goal ? `<div class="ol-bar"><i style="width:${pct}%"></i></div><p class="pn-hint">${pct >= 100 ? 'Objectif atteint, bravo.' : `Encore ${(goal - w).toLocaleString('fr-FR')} mots.`}</p>` : ''}</aside></div>`;
  P.dataset.n = hs.length;
}
const outlineRefresh = debounce(() => { if (panel === 'outline' && !$('#edPanelBody').contains(document.activeElement)) renderOutline(); renderThread(); }, 400);
function scaleMinis(root){ requestAnimationFrame(() => $$('.mini', root).forEach(m => { const w = m.clientWidth; if (w) m.style.setProperty('--s', w / (m.classList.contains('land') ? 1123 : 794)); })); }
window.SWScaleMinis = scaleMinis;
function applyTheme(t){ flushRecord(); record(); E.doc.theme = t; applyGeometry(); paginate(); emitChange(true); record(); }
function setPage(patch){ flushRecord(); record(); E.doc.page = {...E.doc.page, ...patch}; applyGeometry(); paginate(); emitChange(true); recPending = true; recordLater(); }

/* --- Fil du document : un repère par titre, à droite de la zone de travail --- */
function renderThread(){
  const th = $('#edThread'); if (!th || !sheet()) return;
  const total = sheet().offsetHeight || 1;
  const hs = $$('h1, h2, h3', sheet()).filter(h => h.textContent.trim() && !h.closest('.sw-toc, .sw-cover'));
  th.innerHTML = hs.map((h, i) => `<button type="button" class="tk l${h.tagName[1]}" data-tk="${i}" style="top:${(relTop(h) / total * 100).toFixed(2)}%"><span>${escH(h.textContent.trim().slice(0, 60))}</span></button>`).join('');
  th.hidden = hs.length < 2;
}

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
function pageDlg(){ if (panel !== 'page') openPanel('page'); }

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
  const before = n.data.slice(0, s.anchorOffset);
  const em = before.match(/(?:^|[\s\u00A0(]):([a-zà-ÿ]{2,16})$/i);
  if (em){ const q = norm(em[1]); const items = EMOJI_KW.filter(([e, k]) => norm(k).split(' ').some(w => w.startsWith(q))).slice(0, 12);
    if (items.length){ SL.node = n; SL.start = s.anchorOffset - em[1].length - 1; SL.items = items.map(([e, k]) => ({t:k.split(' ')[0], k, ic:e, run:() => insertInline(e)})); SL.emoji = true; return drawSlash('', s); } }
  SL.emoji = false;
  const m = before.match(/(?:^|[\s ])\/([\wÀ-ÿ -]{0,24})$/);
  if (!m || /\s{2}/.test(m[1])) return slashClose();
  const q = norm(m[1]); SL.node = n; SL.start = s.anchorOffset - m[1].length - 1;
  SL.items = SLASH().filter(it => !q || norm(it.t + ' ' + it.k).includes(q)).slice(0, 40);
  if (!SL.items.length) return slashClose();
  drawSlash(q, s);
}
function drawSlash(q, s){
  SL.open = true; SL.i = Math.min(SL.i, SL.items.length - 1);
  const box = $('#slashMenu'); box.hidden = false; box.classList.toggle('emo', !!SL.emoji);
  box.innerHTML = `<p class="sl-h">${SL.emoji ? 'Émojis' : q ? 'Résultats' : 'Insérer'}</p>` + SL.items.map((it, i) => `<button type="button" data-sl="${i}" class="${i === SL.i ? 'on' : ''}"><i>${it.ic}</i><span>${escH(it.t)}${it.cat ? `<small>${escH(it.cat)}</small>` : ''}</span></button>`).join('');
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

/* --- émojis par mot-clé (« : » dans le texte) --- */
const EMOJI_KW = [['✅', 'valide ok fait check'], ['❌', 'non croix erreur'], ['⚠️', 'attention alerte'], ['💡', 'idee astuce ampoule'], ['📌', 'epingle important'], ['📅', 'date calendrier agenda'], ['⏰', 'heure reveil delai'],
  ['📞', 'telephone appel'], ['✉️', 'mail email courrier'], ['📍', 'lieu adresse'], ['🏠', 'maison accueil'], ['🏗️', 'chantier construction'], ['📐', 'plan equerre architecture'], ['🔧', 'outil reglage'], ['🌳', 'arbre nature'],
  ['☀️', 'soleil ete'], ['⭐', 'etoile favori'], ['✨', 'brillant nouveau magie'], ['🔥', 'feu urgent top'], ['⚡', 'eclair rapide energie'], ['🎯', 'objectif cible'], ['🚀', 'fusee lancement'], ['📈', 'hausse croissance graphique'],
  ['📉', 'baisse'], ['💰', 'argent budget'], ['💶', 'euro prix'], ['🧾', 'facture recu'], ['📊', 'statistiques donnees'], ['📝', 'note ecrire'], ['📚', 'livres cours'], ['🎓', 'diplome ecole etudes'], ['💬', 'message discussion'],
  ['👍', 'pouce bien bravo'], ['👏', 'applaudir bravo'], ['🙌', 'bravo merci'], ['🤝', 'accord partenariat'], ['❤️', 'coeur amour'], ['😊', 'sourire content'], ['😉', 'clin oeil'], ['😂', 'rire'], ['🎉', 'fete bravo celebration'],
  ['🎁', 'cadeau'], ['☕', 'cafe pause'], ['🍽️', 'repas restaurant'], ['🚗', 'voiture trajet'], ['✈️', 'avion voyage'], ['🔒', 'cadenas securite prive'], ['🔗', 'lien'], ['📎', 'piece jointe trombone'], ['🧠', 'cerveau reflexion'], ['👉', 'doigt voir'],
  ['➡️', 'fleche droite suite'], ['❓', 'question'], ['❗', 'exclamation important'], ['🟢', 'vert ok'], ['🟠', 'orange moyen'], ['🔴', 'rouge stop']];

/* --- Le Spectre : chercher et lancer n'importe quelle action (Ctrl + K) --- */
const SPX = {items:[], all:[], i:0};
function spectreActions(){
  const A = [], add = (g, t, run, k = '') => A.push({g, t, run, k});
  STYLES.forEach(([tag, cls, n]) => add('Écrire', n, () => setBlock(tag, cls), 'style paragraphe ' + tag));
  [['bold', 'Gras', 'Ctrl B'], ['italic', 'Italique', 'Ctrl I'], ['underline', 'Souligné', 'Ctrl U'], ['strikeThrough', 'Barré', '']].forEach(([c, n, kb]) => add('Écrire', n, () => cmd(c), kb));
  add('Écrire', 'Liste à puces', () => cmd('insertUnorderedList')); add('Écrire', 'Liste numérotée', () => cmd('insertOrderedList')); add('Écrire', 'Liste de tâches', toggleChecklist, 'checklist cases');
  [['justifyLeft', 'Aligner à gauche'], ['justifyCenter', 'Centrer'], ['justifyRight', 'Aligner à droite'], ['justifyFull', 'Justifier']].forEach(([c, n]) => add('Écrire', n, () => cmd(c)));
  add('Écrire', 'Effacer la mise en forme', clearFormat); add('Écrire', 'Lien', linkDlg, 'url Ctrl K'); add('Écrire', 'Augmenter le retrait', () => indent(1)); add('Écrire', 'Diminuer le retrait', () => indent(-1));
  add('Insérer', 'Image', () => $('#edImgFile').click(), 'photo'); add('Insérer', 'Tableau 3 × 3', () => insertHTMLBlock(tableHtml(3, 3, 'sw-table')), 'table');
  BLOCKS.forEach(b => add('Insérer', b.name, () => insertBlockById(b.id), b.kw + ' ' + b.cat));
  THEMES.forEach(t => add('Thème', 'Thème ' + t.name, () => { applyTheme({id:t.id, fs:E.doc.theme.fs, lh:E.doc.theme.lh}); toast('Thème ' + t.name + ' appliqué'); }, t.fh + ' ' + t.fb + ' couleur'));
  Object.keys(PAGE_SIZES).forEach(k => add('Page', 'Format ' + k, () => setPage({size:k}), 'taille papier'));
  add('Page', 'Orientation paysage', () => setPage({orient:'l'})); add('Page', 'Orientation portrait', () => setPage({orient:'p'}));
  [['normal', 'normales'], ['narrow', 'étroites'], ['wide', 'larges'], ['none', 'aucune']].forEach(([k, n]) => add('Page', 'Marges ' + n, () => setPage({margins:k})));
  add('Page', E.doc.page.numbers ? 'Retirer les numéros de page' : 'Ajouter les numéros de page', () => setPage({numbers:!E.doc.page.numbers}), 'pagination');
  add('Page', 'Filigrane Brouillon', () => setPage({watermark:'BROUILLON'})); add('Page', 'Retirer le filigrane', () => setPage({watermark:''}));
  add('Page', 'Saut de page', () => insertHTMLBlock(PAGEBREAK + '<p><br></p>'), 'nouvelle page Ctrl Entrée');
  [['pdf', 'Exporter en PDF'], ['docx', 'Exporter en Word (.docx)'], ['html', 'Exporter en page web'], ['md', 'Exporter en Markdown'], ['txt', 'Exporter en texte'], ['spectra', 'Télécharger une sauvegarde']].forEach(([k, n]) => add('Exporter', n, () => doExport(k), 'telecharger fichier'));
  add('Document', 'Rechercher', () => openFind(false), 'Ctrl F'); add('Document', 'Remplacer', () => openFind(true), 'Ctrl H');
  add('Document', 'Typographie française', frenchTypo, 'espaces insecables guillemets'); add('Document', 'Historique des versions', historyDlg, 'restaurer revenir ancienne version');
  add('Document', 'Mode concentration', () => toggleFocus(true), 'focus'); add('Document', 'Informations et statistiques', infoDlg, 'mots compte'); add('Document', 'Raccourcis clavier', shortcutsDlg, 'aide');
  add('Document', 'Imprimer', printDoc, 'Ctrl P'); add('Document', 'Partager', () => window.SWShareCurrent?.(), 'email lien'); add('Document', 'Dupliquer', () => window.SWHome?.duplicateCurrent(), 'copie');
  add('Document', 'Enregistrer comme modèle', saveTplDlg); add('Document', 'Insérer le contenu d\'un fichier', () => $('#edInsFile').click(), 'importer word');
  add('Aller', 'Nouveau document', () => window.SWHome?.show('templates')); add('Aller', 'Accueil', () => window.SWHome?.show('home'));
  add('Aller', 'Interface claire ou sombre', () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; lsSet('sw.theme', t); }, 'theme sombre nuit');
  $$('h1, h2, h3', sheet()).filter(h => h.textContent.trim() && !h.closest('.sw-toc')).forEach(h => add('Dans le document', h.textContent.trim().slice(0, 80), () => h.scrollIntoView({behavior:'smooth', block:'start'}), 'titre aller'));
  return A;
}
const SP_START = ['Titre 1', 'Titre 2', 'Image', 'Tableau 3 × 3', 'Lien', 'Rechercher', 'Exporter en PDF', 'Exporter en Word (.docx)', 'Historique des versions', 'Mode concentration'];
function openSpectre(){ saveSel(); closePop(); $('#spectre').hidden = false; const q = $('#spQ'); q.value = ''; SPX.all = spectreActions(); SPX.i = 0; drawSpectre(); setTimeout(() => q.focus(), 10); }
function closeSpectre(){ $('#spectre').hidden = true; }
function drawSpectre(){
  const q = norm($('#spQ').value.trim()), words = q.split(/\s+/).filter(Boolean);
  let l;
  if (words.length) l = SPX.all.map(a => { const hay = norm(a.t + ' ' + a.g + ' ' + a.k); if (!words.every(w => hay.includes(w))) return null; const tt = norm(a.t); return {...a, sc:tt.startsWith(words[0]) ? 0 : tt.includes(words[0]) ? 1 : 2}; }).filter(Boolean).sort((a, b) => a.sc - b.sc);
  else l = SP_START.map(t => SPX.all.find(a => a.t === t)).filter(Boolean);
  SPX.items = l.slice(0, 60); SPX.i = clamp(SPX.i, 0, Math.max(0, SPX.items.length - 1));
  $('#spList').innerHTML = (words.length ? '' : '<p class="sp-h">Suggestions</p>') + (SPX.items.length ? SPX.items.map((a, i) => `<button type="button" data-sp="${i}" class="${i === SPX.i ? 'on' : ''}" role="option"><span>${escH(a.t)}</span><small>${escH(a.g)}</small></button>`).join('')
    : '<p class="sp-none">Rien ne correspond. Essayez « tableau », « titre », « export » ou « thème ».</p>');
  $('#spList .on')?.scrollIntoView({block:'nearest'});
}
function runSpectre(i){ const a = SPX.items[i]; if (!a) return; closeSpectre(); restoreSel(); setTimeout(() => a.run(), 10); }

/* --- Historique des versions (gardé sur cet appareil, par document) --- */
const VER = {key:'', last:0, lastHtml:''};
const verKey = () => VER.key ? 'sw.ver.' + VER.key : '';
const verList = () => (verKey() && lsGet(verKey())) || [];
function verSnap(force){
  if (!verKey() || E.ro) return; const now = Date.now();
  if (!force && now - VER.last < 5 * 60e3) return;
  const h = cleanHtml(); if (h === VER.lastHtml) return;
  VER.last = now; VER.lastHtml = h;
  let l = verList(); l.unshift({at:now, words:countWords(sheet().innerText), data:getJSON()}); l = l.slice(0, 25);
  for (let n = l.length; n >= 1; n--){ try { localStorage.setItem(verKey(), JSON.stringify(l.slice(0, n))); return; } catch(e){} }
}
function historyDlg(){
  verSnap(true); const l = verList();
  const fmt = t => new Date(t).toLocaleString('fr-FR', {weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit'});
  SWDlg.open(`<h3>Historique des versions</h3><p class="dlg-p">Une version est gardée sur cet appareil à chaque ouverture, puis toutes les cinq minutes de travail. Restaurer remplace le contenu actuel ; Ctrl + Z permet de revenir en arrière.</p>
    <div class="ver-list">${l.length ? l.map((v, i) => `<div class="ver"><div><b>${i === 0 ? 'Version actuelle' : fmt(v.at)}</b><span>${v.words.toLocaleString('fr-FR')} mots</span></div>${i ? `<button type="button" class="ap-btn alt" data-ver="${i}">Restaurer</button>` : ''}</div>`).join('') : '<p class="pn-hint">Aucune version pour l\'instant.</p>'}</div>
    <div class="dlg-acts"><button type="button" class="ap-btn" data-dlg="close">Fermer</button></div>`, d => {
    d.querySelectorAll('[data-ver]').forEach(b => b.onclick = () => { const j = parseDoc(l[+b.dataset.ver].data); SWDlg.close(); flushRecord(); record();
      sheet().innerHTML = j.html; E.doc.theme = j.theme; E.doc.page = j.page; applyGeometry(); paginate(); changed({record:true}); toast('Version restaurée. Ctrl + Z pour revenir en arrière.'); });
  }, 'wide');
}
setInterval(() => { if (!$('#app').hidden) verSnap(false); }, 60e3);
