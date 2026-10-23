/* ============ Menu clic droit (appui long au doigt) ============
   1) NOYAU COMMUN « PrismCtx » : identique dans toutes les apps Studio Prism (SPECTRA, ARCHIPLAN, ARCHITRAFIC, Nexus…).
      Il ne connaît rien de l'app : on lui donne une liste d'actions { label, hint, checked, danger, disabled, onClick, sub:[…] }.
   2) ACTIONS DE SPECTRA WRITER : selon ce qu'on vise (image, cellule de tableau, lien, texte sélectionné, paragraphe).
   Maj + clic droit = menu du navigateur (correcteur orthographique, dictionnaire…). */

/* ---------- 1) noyau commun ---------- */
const PrismCtx = window.PrismCtx || (window.PrismCtx = (() => {
  let menus = [], prevFocus = null, armed = false;
  const mk = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const close = () => {
    for (const m of menus) m.remove(); menus = [];
    if (armed){ armed = false; for (const [t, f, o] of LISTEN) window.removeEventListener(t, f, o); }
    if (prevFocus?.isConnected) try { prevFocus.focus({preventScroll:true}); } catch(_){ } prevFocus = null;
  };
  const isOpen = () => menus.length > 0;
  const place = (m, x, y, anchor) => {
    m.style.left = '0px'; m.style.top = '0px'; m.style.visibility = 'hidden'; document.body.appendChild(m);
    const w = m.offsetWidth, h = m.offsetHeight, W = innerWidth, H = innerHeight, g = 6;
    let l = x, t = y;
    if (anchor){ l = anchor.right - 3; if (l + w > W - g) l = Math.max(g, anchor.left - w + 3); t = anchor.top - 6; }
    else if (l + w > W - g) l = x - w;                 // pas la place à droite du curseur : le menu s'ouvre vers la gauche
    if (t + h > H - g) t = anchor ? H - g - h : y - h;  // pas la place en bas : vers le haut
    m.style.left = Math.max(g, Math.min(l, W - w - g)) + 'px'; m.style.top = Math.max(g, Math.min(t, H - h - g)) + 'px'; m.style.visibility = '';
  };
  const closeFrom = depth => { while (menus.length > depth){ menus.pop().remove(); } };
  function build(items, depth, title){
    const m = mk('div', 'pctx'); m.setAttribute('role', 'menu'); m.tabIndex = -1; m.dataset.depth = depth;
    if (title) m.appendChild(mk('div', 'pctx-h', title));
    let any = false;
    for (const it of items){
      if (!it) continue;
      if (it.sep){ if (any) m.appendChild(Object.assign(mk('div', 'pctx-sep'), {role:'separator'})); continue; }
      if (it.header){ m.appendChild(mk('div', 'pctx-h', it.header)); continue; }
      any = true;
      const b = mk('button', 'pctx-i' + (it.danger ? ' danger' : '')); b.type = 'button'; b.disabled = !!it.disabled;
      b.setAttribute('role', it.checked != null ? 'menuitemradio' : 'menuitem'); if (it.checked != null) b.setAttribute('aria-checked', String(!!it.checked));
      b.append(mk('span', 'pctx-ic', it.checked ? '✓' : (it.icon || '')), mk('span', 'pctx-t', it.label));
      if (it.hint) b.appendChild(mk('kbd', 'pctx-k', it.hint));
      if (it.sub){ b.appendChild(mk('span', 'pctx-ar', '›')); b.setAttribute('aria-haspopup', 'true'); }
      const openSub = focus => { closeFrom(depth + 1); for (const x of m.querySelectorAll('.open')) x.classList.remove('open'); b.classList.add('open');
        const s = build(it.sub, depth + 1); menus.push(s); place(s, 0, 0, b.getBoundingClientRect()); if (focus) s.querySelector('.pctx-i:not(:disabled)')?.focus(); };
      b.addEventListener('pointerenter', () => { if (b.disabled) return; if (it.sub) openSub(false); else { closeFrom(depth + 1); m.querySelectorAll('.open').forEach(x => x.classList.remove('open')); } });
      b.addEventListener('click', ev => { ev.stopPropagation(); if (b.disabled) return; if (it.sub){ openSub(true); return; }
        close(); try { it.onClick?.(); } catch(err){ console.warn('menu contextuel', err); } });
      b.addEventListener('keydown', ev => { if (it.sub && ev.key === 'ArrowRight' && !b.disabled){ ev.preventDefault(); openSub(true); } });
      m.appendChild(b);
    }
    m.addEventListener('keydown', ev => {
      const bs = [...m.querySelectorAll(':scope > .pctx-i:not(:disabled)')], i = bs.indexOf(document.activeElement);
      if (ev.key === 'ArrowDown'){ ev.preventDefault(); bs[(i + 1) % bs.length]?.focus(); }
      else if (ev.key === 'ArrowUp'){ ev.preventDefault(); bs[(i - 1 + bs.length) % bs.length]?.focus(); }
      else if (ev.key === 'Home'){ ev.preventDefault(); bs[0]?.focus(); } else if (ev.key === 'End'){ ev.preventDefault(); bs.at(-1)?.focus(); }
      else if (ev.key === 'ArrowLeft' && depth){ ev.preventDefault(); const p = menus[depth - 1]; closeFrom(depth); p?.querySelector('.pctx-i.open')?.focus(); }
    });
    return m;
  }
  /* fermeture : clic ailleurs, Échap, défilement, redimensionnement, changement de fenêtre */
  const away = ev => { if (ev.type === 'keydown'){ if (ev.key === 'Escape'){ ev.preventDefault(); ev.stopPropagation(); if (menus.length > 1) closeFrom(menus.length - 1); else close(); } return; }
    if (ev.type === 'blur' || ev.type === 'resize') return close();
    if (!menus.some(m => m.contains(ev.target))) close(); };
  const LISTEN = [['pointerdown', away, true], ['wheel', away, {capture:true, passive:true}], ['keydown', away, true], ['resize', away, false], ['blur', away, false]];
  function open(x, y, items, title){
    close(); if (!items?.some(i => i && !i.sep && !i.header)) return false;
    prevFocus = document.activeElement; const m = build(items, 0, title); menus = [m]; place(m, x, y);
    armed = true; for (const [t, f, o] of LISTEN) window.addEventListener(t, f, o);
    m.focus({preventScroll:true}); return true;
  }
  /* branche le menu sur un élément : clic droit sans glisser, appui long au doigt ; getItems(ev) → {items, title} | tableau | null
     (ev porte clientX/clientY ; renvoyer null laisse le comportement par défaut du navigateur) */
  function attach(target, getItems, o = {}){
    const LP = o.longPress ?? 520, TOL = 6; let rt = null, tp = null, lastRight = -1e9;
    const show = (ev, x, y) => { const r = getItems(ev, x, y); const items = Array.isArray(r) ? r : r?.items; return !!items?.length && open(x, y, items, r?.title); };
    const stopLP = () => { if (tp){ clearTimeout(tp.t); tp = null; } };
    target.addEventListener('pointerdown', ev => {
      if (ev.pointerType === 'mouse'){ if (ev.button === 2){ rt = {x:ev.clientX, y:ev.clientY, at:performance.now()}; lastRight = rt.at; } return; }
      if (!ev.isPrimary){ stopLP(); return; }
      stopLP(); const d = {x:ev.clientX, y:ev.clientY, clientX:ev.clientX, clientY:ev.clientY, target:ev.target, pointerType:ev.pointerType};
      tp = {x:d.x, y:d.y, t:setTimeout(() => { tp = null; if (show(d, d.x, d.y)) o.onLongPress?.(); }, LP)};
    });
    target.addEventListener('pointermove', ev => { if (tp && Math.hypot(ev.clientX - tp.x, ev.clientY - tp.y) > 8) stopLP(); });
    for (const t of ['pointerup', 'pointercancel']) target.addEventListener(t, ev => {
      stopLP(); if (!rt) return; const r = rt; rt = null;
      if (t === 'pointerup' && ev.button === 2 && Math.hypot(ev.clientX - r.x, ev.clientY - r.y) <= TOL && performance.now() - r.at < 600) show(ev, ev.clientX, ev.clientY);
    });
    target.addEventListener('contextmenu', ev => { ev.preventDefault();
      if (performance.now() - lastRight < 800) return;               // clic droit souris : déjà traité au relâchement
      if (ev.pointerType === 'touch' || ev.pointerType === 'pen') return;   // appui long : déjà traité par le minuteur
      show(ev, ev.clientX, ev.clientY); });                          // Ctrl+clic (Mac), touche Menu du clavier
  }
  return {open, close, isOpen, attach};
})());

/* ---------- 2) actions de SPECTRA Writer ---------- */
const CTX_ALIGN = [['justifyLeft', 'À gauche'], ['justifyCenter', 'Centré'], ['justifyRight', 'À droite'], ['justifyFull', 'Justifié']];
const ctxAI = (label, prompt) => ({label, onClick:() => aiAsk(prompt)});
function ctxFigureItems(fig){
  selectFigure(fig); const ro = E.ro, cap = !!fig.querySelector('figcaption');
  return {title:'Image', items:[
    {label:'Taille', disabled:ro, sub:[[33, '33 %'], [50, '50 %'], [75, '75 %'], [100, 'Pleine largeur']].map(([v, t]) => ({label:t, onClick:() => figOp('w', v)}))},
    {label:'Alignement', disabled:ro, sub:[['left', 'À gauche, texte autour'], ['center', 'Centrée'], ['right', 'À droite, texte autour']].map(([v, t]) => ({label:t, checked:(fig.dataset.align || 'center') === v, onClick:() => figOp('align', v)}))},
    {label:'Style', disabled:ro, sub:[['', 'Aucun'], ['rounded', 'Coins arrondis'], ['shadow', 'Ombre portée'], ['frame', 'Cadre photo'], ['circle', 'Cercle']].map(([v, t]) => ({label:t, onClick:() => figOp('style', v)}))},
    {label:cap ? 'Retirer la légende' : 'Ajouter une légende', disabled:ro, onClick:() => figOp('caption')},
    {label:'Texte alternatif…', disabled:ro, onClick:() => SWAsk('Texte alternatif', "Description de l'image (accessibilité)", fig.querySelector('img')?.alt || '', 'Enregistrer', async v => figOp('alt', v))},
    {label:"Remplacer l'image…", disabled:ro, onClick:() => { E.replaceFig = fig; $('#edImgFile').click(); }},
    {sep:true}, {label:"Supprimer l'image", danger:true, disabled:ro, hint:'Suppr', onClick:() => figOp('del')}]};
}
function ctxTableItems(cell){
  E.lastCell = cell; if (curCell() !== cell) caretToStart(cell);
  const ro = E.ro, op = (t, k) => ({label:t, disabled:ro, onClick:() => tableOp(k)}), table = cell.closest('table');
  return {title:'Tableau', items:[
    op('Insérer une ligne au-dessus', 'rowBefore'), op('Insérer une ligne en dessous', 'rowAfter'), op('Insérer une colonne à gauche', 'colBefore'), op('Insérer une colonne à droite', 'colAfter'),
    {sep:true}, op('Supprimer la ligne', 'delRow'), op('Supprimer la colonne', 'delCol'),
    {sep:true}, {label:table.tHead ? 'Retirer la ligne d\'en-tête' : 'Première ligne en en-tête', disabled:ro, onClick:() => tableOp('head')},
    op('Changer le style du tableau', 'style'), {label:'Aligner la colonne à droite (chiffres)', checked:cell.classList.contains('r') || undefined, disabled:ro, onClick:() => tableOp('right')},
    {sep:true}, {label:'Supprimer le tableau', danger:true, disabled:ro, onClick:() => tableOp('del')}]};
}
function ctxLinkItems(a){
  const href = a.getAttribute('href') || '', select = () => { const r = document.createRange(); r.selectNodeContents(a); const s = getSelection(); s.removeAllRanges(); s.addRange(r); saveSel(); };
  return {title:'Lien', items:[
    {label:'Ouvrir le lien', disabled:!href, onClick:() => { if (href.startsWith('#')) a.scrollIntoView({behavior:'smooth', block:'center'}); else window.open(a.href, '_blank', 'noopener'); }},
    {label:'Modifier le lien…', disabled:E.ro, onClick:() => { select(); linkDlg(); }},
    {label:'Copier l\'adresse', onClick:() => { navigator.clipboard?.writeText(a.href).then(() => toast('Adresse copiée'), () => toast('Copie impossible : utilisez Ctrl + C sur le lien')); }},
    {sep:true}, {label:'Retirer le lien', disabled:E.ro, onClick:() => { select(); cmd('unlink'); }}]};
}
function ctxTextItems(sel){
  const ro = E.ro, items = [], has = sel.has, ai = typeof aiOk === 'function' && aiOk();
  if (has) items.push({label:'Couper', hint:'Ctrl X', disabled:ro, onClick:() => { restoreSel(); document.execCommand('cut') || toast('Utilisez Ctrl + X'); }}, {label:'Copier', hint:'Ctrl C', onClick:() => { restoreSel(); document.execCommand('copy') || toast('Utilisez Ctrl + C'); }});
  items.push({label:has ? 'Coller (texte seul)' : 'Coller', hint:'Ctrl V', disabled:ro, onClick:() => { restoreSel(); navigator.clipboard?.readText?.().then(t => t && cmd('insertText', t)).catch(() => toast('Utilisez Ctrl + V pour coller')) || toast('Utilisez Ctrl + V pour coller'); }});
  if (ro) return {title:'', items};
  items.push({sep:true});
  if (has) items.push({label:'Gras', hint:'Ctrl B', onClick:() => cmd('bold')}, {label:'Italique', hint:'Ctrl I', onClick:() => cmd('italic')}, {label:'Souligné', hint:'Ctrl U', onClick:() => cmd('underline')}, {label:'Lien…', hint:'Ctrl K', onClick:linkDlg}, {sep:true});
  items.push({label:'Style de paragraphe', sub:STYLES.map(([tag, cls, n]) => ({label:n, onClick:() => setBlock(tag, cls)}))},
    {label:'Listes', sub:[{label:'Liste à puces', onClick:() => cmd('insertUnorderedList')}, {label:'Liste numérotée', onClick:() => cmd('insertOrderedList')}, {label:'Liste de tâches', onClick:toggleChecklist}, {sep:true}, {label:'Augmenter le retrait', onClick:() => indent(1)}, {label:'Diminuer le retrait', onClick:() => indent(-1)}]},
    {label:'Alignement', sub:CTX_ALIGN.map(([c, n]) => ({label:n, onClick:() => cmd(c)}))},
    {label:'Effacer la mise en forme', onClick:clearFormat});
  items.push({sep:true}, {label:'Insérer', sub:[{label:'Image…', onClick:() => $('#edImgFile').click()}, {label:'Tableau 3 × 3', onClick:() => insertHTMLBlock(tableHtml(3, 3, 'sw-table'))}, {label:'Saut de page', onClick:() => insertHTMLBlock(PAGEBREAK)}, {sep:true}, {label:'Tous les blocs…', onClick:openSpectre}]});
  if (ai){
    items.push({sep:true}, {header:'Spectra IA'});
    if (has) items.push(ctxAI('Reformuler la sélection', 'Reformule la sélection pour la rendre plus claire, sans changer le sens ni la mise en forme.'), ctxAI("Corriger l'orthographe et la grammaire", "Corrige l'orthographe et la grammaire de la sélection sans rien changer d'autre."), ctxAI('Raccourcir', 'Raccourcis la sélection en gardant l\'essentiel.'), ctxAI('Développer', 'Développe la sélection avec plus de détails, dans le même ton.'), ctxAI('Traduire en anglais', 'Traduis la sélection en anglais.'));
    else items.push({label:'Demander à Spectra…', onClick:openSpectre});
  }
  items.push({sep:true}, {label:'Rechercher…', hint:'Ctrl F', onClick:() => openFind(false)});
  return {title:'', items};
}

(function ctxInstall(){
  const build = ev => {
    const t = ev.target; if (!(t instanceof Element) || ev.shiftKey || !E.sheet || !E.sheet.contains(t)) return null;
    saveSel();
    const fig = t.closest('figure.sw-img'); if (fig) return ctxFigureItems(fig);
    const cell = t.closest('td, th'), inCell = cell && E.sheet.contains(cell) && !E.ro ? cell : null, sel = selInfo();
    if (inCell && !sel.has) return ctxTableItems(inCell);          // clic droit dans une cellule : actions du tableau
    const a = t.closest('a[href]'); if (a && E.sheet.contains(a) && !sel.has) return ctxLinkItems(a);
    const r = ctxTextItems(sel);
    if (inCell) r.items.splice(r.items.findIndex(i => i.label === 'Insérer'), 0, {label:'Tableau', sub:ctxTableItems(inCell).items});   // texte sélectionné dans une cellule : le tableau reste accessible
    return r;
  };
  document.addEventListener('contextmenu', ev => { const r = build(ev); if (!r) return; ev.preventDefault(); PrismCtx.open(ev.clientX, ev.clientY, r.items, r.title || undefined); });
  /* appui long au doigt : le navigateur du téléphone propose déjà sa propre sélection de texte, on ne s'en mêle que sur les images, tableaux et liens */
  let tp = null; const stop = () => { if (tp){ clearTimeout(tp.t); tp = null; } };
  document.addEventListener('pointerdown', ev => { if (ev.pointerType !== 'touch' || !ev.isPrimary || !E.sheet?.contains(ev.target)) return; stop();
    const d = {target:ev.target, clientX:ev.clientX, clientY:ev.clientY, shiftKey:false};
    if (!d.target.closest?.('figure.sw-img, td, th, a[href]')) return;
    tp = {x:ev.clientX, y:ev.clientY, t:setTimeout(() => { tp = null; const r = build(d); if (r) PrismCtx.open(d.clientX, d.clientY, r.items, r.title || undefined); }, 560)}; }, {passive:true});
  document.addEventListener('pointermove', ev => { if (tp && Math.hypot(ev.clientX - tp.x, ev.clientY - tp.y) > 8) stop(); }, {passive:true});
  for (const t of ['pointerup', 'pointercancel']) document.addEventListener(t, stop, {passive:true});
})();
