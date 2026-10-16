/* ---------- Démarrage de l'éditeur, raccourcis, API window.SWEditor ---------- */
function getJSON(){ return JSON.stringify({v:1, app:'spectrawriter', title:E.doc.title, html:cleanHtml(), theme:E.doc.theme, page:E.doc.page}); }
function parseDoc(data){
  let j = null; try { j = typeof data === 'string' ? JSON.parse(data || '{}') : data; } catch(e){ j = {html:String(data || '')}; }
  if (!j || typeof j !== 'object') j = {};
  return {title:String(j.title || 'Document sans titre').slice(0, 120), html:SAN(j.html || '<p><br></p>') || '<p><br></p>', theme:j.theme && typeof j.theme === 'object' ? j.theme : {id:'spectra'}, page:{...DEF_PAGE, ...(j.page || {})}};
}
function previewHtml(html){
  const t = document.createElement('div'); t.innerHTML = SAN(html, {preview:true}); let out = '', n = 0;
  for (const el of [...t.children]){ const h = el.outerHTML; if (out.length + h.length > 5600) { if (!n) out = (el.textContent || '').slice(0, 500); break; } out += h; n++; if (n > 14) break; }
  return out;
}
function metaOf(json){ const d = parseDoc(json); const tmp = document.createElement('div'); tmp.innerHTML = d.html;
  return {preview:previewHtml(d.html), theme:themeKey(d.theme), words:countWords(tmp.textContent || ''), pageSize:d.page.size + (d.page.orient === 'l' ? '-l' : '')}; }
function fromTemplate(id, lib){
  const t = SW_TEMPLATES.find(x => x.id === id) || (lib?.templates || []).find(x => x.id === id) || SW_TEMPLATES[0];
  const y = new Date().getFullYear();
  const html = String(t.html).replace(/\{\{date\}\}/g, today()).replace(/\{\{annee-1\}\}/g, y - 1).replace(/\{\{annee\}\}/g, y);
  return JSON.stringify({v:1, app:'spectrawriter', title:t.id === 'blank' ? 'Document sans titre' : (t.title || t.name), html, theme:{...t.theme}, page:{...DEF_PAGE, ...(t.page || {})}, tpl:t.id});
}
function load(data, opts = {}){
  const d = parseDoc(data);
  E.doc = {title:d.title, theme:d.theme, page:d.page}; E.autoTitle = false;
  E.ro = !!opts.readOnly; tocSig = '';
  sheet().innerHTML = d.html;
  sheet().contentEditable = E.ro ? 'false' : 'true';
  document.body.classList.toggle('ro', E.ro);
  const ti = $('#docTitle'); ti.value = E.doc.title; ti.readOnly = E.ro || opts.canRename === false; ti.title = ti.readOnly ? '' : 'Renommer le document';
  const sub = $('#docSub'); sub.textContent = opts.owner ? `Partagé par ${opts.owner}${E.ro ? ' · lecture seule' : ''}` : E.ro ? 'Lecture seule' : ''; sub.hidden = !sub.textContent;
  selectFigure(null); closeFind(); slashClose(); closePop();
  E.fit = innerWidth < 1100 || E.fit;
  applyGeometry(); E.hist = []; E.hi = -1;
  requestAnimationFrame(() => { paginate(); record(); E.scroll.scrollTop = 0; if (panel) renderPanel(); document.fonts?.ready.then(() => paginate()); });
  setTimeout(paginate, 700);
}
function setReadOnly(ro){ E.ro = ro; sheet().contentEditable = ro ? 'false' : 'true'; document.body.classList.toggle('ro', ro); }

/* --- construction de l'interface --- */
function buildToolbar(){
  const b = (attrs, ic, title) => `<button type="button" class="tb" ${attrs} title="${title}" aria-label="${title}">${ic}</button>`;
  $('#edBar').innerHTML = `
    <div class="tg">${b('id="undoBtn" data-act="undo"', IC.undo, 'Annuler (Ctrl+Z)')}${b('id="redoBtn" data-act="redo"', IC.redo, 'Rétablir (Ctrl+Y)')}</div>
    <div class="tg"><select id="fStyle" class="tsel w-style" aria-label="Style du paragraphe" title="Style du paragraphe">${STYLES.map((s, i) => `<option value="${i}">${s[2]}</option>`).join('')}</select></div>
    <div class="tg hide-m"><select id="fFont" class="tsel w-font" aria-label="Police" title="Police"><option value="">Police du thème</option>${FONTS.map(f => `<option style="font-family:${fontStack(f[0]).replace(/"/g, '')}">${f[0]}</option>`).join('')}</select>
      <span class="tsize">${b('data-act="size-"', IC.minus, 'Réduire la taille')}<input id="fSize" class="tsz" value="11" inputmode="decimal" aria-label="Taille (pt)" title="Taille (pt)" list="fSizes"><datalist id="fSizes">${[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72].map(s => `<option>${s}</option>`).join('')}</datalist>${b('data-act="size+"', IC.plus, 'Augmenter la taille')}</span></div>
    <div class="tg">${b('data-cmd="bold"', IC.b, 'Gras (Ctrl+B)')}${b('data-cmd="italic"', IC.i, 'Italique (Ctrl+I)')}${b('data-cmd="underline"', IC.u, 'Souligné (Ctrl+U)')}${b('data-cmd="strikeThrough" class="hide-s"', IC.s, 'Barré')}
      <button type="button" class="tb tcol" data-act="color" title="Couleur du texte" aria-label="Couleur du texte">${IC.color}<i id="fColorBar"></i></button>${b('data-act="hl"', IC.hl, 'Surligner')}</div>
    <div class="tg hide-s">${b('data-cmd="justifyLeft"', IC.al, 'Aligner à gauche')}${b('data-cmd="justifyCenter"', IC.ac, 'Centrer')}${b('data-cmd="justifyRight"', IC.ar, 'Aligner à droite')}${b('data-cmd="justifyFull"', IC.aj, 'Justifier')}</div>
    <div class="tg">${b('data-cmd="insertUnorderedList"', IC.ul, 'Liste à puces')}${b('data-cmd="insertOrderedList"', IC.ol, 'Liste numérotée')}${b('data-act="check"', IC.check, 'Liste de tâches')}
      <span class="hide-s">${b('data-act="outdent"', IC.indL, 'Diminuer le retrait')}${b('data-act="indent"', IC.indR, 'Augmenter le retrait')}${b('data-act="spacing"', IC.spacing, 'Interligne et espacement')}</span></div>
    <div class="tg">${b('data-act="link"', IC.link, 'Lien (Ctrl+K)')}${b('data-act="image"', IC.img, 'Image')}${b('data-act="table"', IC.table, 'Tableau')}
      <button type="button" class="tb tb-txt" data-act="insert" title="Insérer" aria-haspopup="true">${IC.plus}<span>Insérer</span></button></div>
    <div class="tg hide-m">${b('data-act="clear"', IC.clear, 'Effacer la mise en forme')}${b('data-act="find"', IC.search, 'Rechercher et remplacer (Ctrl+F)')}${b('data-act="page"', IC.page, 'Mise en page')}
      <button type="button" class="tb tb-txt" data-act="tools" title="Outils" aria-haspopup="true">${IC.sparkle}<span>Outils</span></button></div>`;
  $('#floatBar').innerHTML = `${b('data-fc="bold"', IC.b, 'Gras')}${b('data-fc="italic"', IC.i, 'Italique')}${b('data-fc="underline"', IC.u, 'Souligné')}${b('data-fc="strikeThrough"', IC.s, 'Barré')}<span class="fsep"></span>
    <button type="button" class="tb" data-fa="h1" title="Titre 1">H1</button><button type="button" class="tb" data-fa="h2" title="Titre 2">H2</button><span class="fsep"></span>
    ${b('data-fa="color"', IC.color, 'Couleur')}${b('data-fa="hl"', IC.hl, 'Surligner')}${b('data-fa="link"', IC.link, 'Lien')}${b('data-fa="clear"', IC.clear, 'Effacer la mise en forme')}`;
  $('#imgBar').innerHTML = `<span class="tl">Taille</span>${[33, 50, 75, 100].map(w => `<button type="button" class="tb tb-txt" data-img="w" data-v="${w}">${w === 100 ? 'Pleine' : w + ' %'}</button>`).join('')}<span class="fsep"></span>
    <button type="button" class="tb" data-img="align" data-v="left" title="À gauche, texte autour">${IC.al}</button><button type="button" class="tb" data-img="align" data-v="center" title="Centrée">${IC.ac}</button><button type="button" class="tb" data-img="align" data-v="right" title="À droite, texte autour">${IC.ar}</button><span class="fsep"></span>
    <button type="button" class="tb tb-txt" data-img="stylepop">Style</button><button type="button" class="tb tb-txt" data-img="caption">Légende</button><button type="button" class="tb" data-img="replace" title="Remplacer l'image">${IC.img}</button><button type="button" class="tb danger" data-img="del" title="Supprimer l'image">${IC.trash}</button>`;
  $('#tblBar').innerHTML = `<button type="button" class="tb tb-txt" data-t="rowBefore">+ Ligne au-dessus</button><button type="button" class="tb tb-txt" data-t="rowAfter">+ Ligne</button><button type="button" class="tb tb-txt" data-t="colAfter">+ Colonne</button><span class="fsep"></span>
    <button type="button" class="tb tb-txt" data-t="delRow">− Ligne</button><button type="button" class="tb tb-txt" data-t="delCol">− Colonne</button><span class="fsep"></span>
    <button type="button" class="tb tb-txt" data-t="head">En-tête</button><button type="button" class="tb tb-txt" data-t="style">Style</button><button type="button" class="tb" data-t="right" title="Aligner la colonne à droite (nombres)">${IC.ar}</button><button type="button" class="tb danger" data-t="del" title="Supprimer le tableau">${IC.trash}</button>`;
}
function toolsPop(anchor){
  openPop(anchor, `<div class="pop-menu">
    <button type="button" data-o="typo"><b>Typographie française</b><span>Espaces insécables, « guillemets », apostrophes ’, points de suspension…</span></button>
    <label class="pop-toggle"><input type="checkbox" id="optTypo"${E.frTypo ? ' checked' : ''}><span><b>Typographie automatique pendant la frappe</b><small>' → ’ · " → « » · espace fine avant ; ! ?</small></span></label>
    <button type="button" data-o="find"><b>Rechercher et remplacer</b><span>Ctrl + F · Ctrl + H</span></button>
    <button type="button" data-o="page"><b>Mise en page</b><span>Format, marges, en-tête, pied de page, numéros, filigrane</span></button>
    <button type="button" data-o="focus"><b>Mode concentration</b><span>Seulement vous et votre texte (Échap pour sortir)</span></button>
    <hr><button type="button" data-o="insert-file"><b>Insérer le contenu d'un fichier</b><span>Word, Markdown, texte ou SPECTRA, à l'endroit du curseur</span></button>
    <button type="button" data-o="save-tpl"><b>Enregistrer comme modèle</b><span>Réutilisez ce document comme point de départ</span></button>
    <button type="button" data-o="shortcuts"><b>Raccourcis et astuces</b><span>Commande /, Markdown, clavier</span></button></div>`, p => {
    $('#optTypo', p).onchange = e => { E.frTypo = e.target.checked; lsSet('sw.frTypo', E.frTypo); toast(E.frTypo ? 'Typographie automatique activée' : 'Typographie automatique désactivée'); };
    p.onclick = e => { const b = e.target.closest('[data-o]'); if (!b) return; closePop(); const k = b.dataset.o;
      if (k === 'typo') frenchTypo(); else if (k === 'find') openFind(true); else if (k === 'page') pageDlg(); else if (k === 'focus') toggleFocus(true);
      else if (k === 'insert-file') $('#edInsFile').click(); else if (k === 'save-tpl') saveTplDlg(); else if (k === 'shortcuts') shortcutsDlg(); };
  }, 'menu');
}
function filePop(anchor){
  openPop(anchor, `<div class="pop-menu">
    <button type="button" data-f="new"><b>Nouveau document</b><span>Page blanche ou modèle</span></button>
    <button type="button" data-f="dup"><b>Dupliquer</b><span>Une copie, ouverte tout de suite</span></button>
    <button type="button" data-f="import"><b>Importer un fichier</b><span>Word (.docx), Markdown, texte, SPECTRA → nouveau document</span></button>
    <button type="button" data-f="share"><b>Partager…</b><span>Par email ou par lien, en lecture ou modification</span></button>
    <hr><button type="button" data-f="page"><b>Mise en page</b><span>Format, marges, en-tête et pied de page</span></button>
    <button type="button" data-f="print"><b>Imprimer</b><span>Ctrl + P</span></button>
    <button type="button" data-f="info"><b>Informations</b><span>Statistiques du document</span></button>
    <hr><button type="button" data-f="home"><b>Retour à l'accueil</b><span>Vos documents et modèles</span></button></div>`, p => {
    p.onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return; closePop(); const k = b.dataset.f;
      if (k === 'new') window.SWHome?.show('templates'); else if (k === 'dup') window.SWHome?.duplicateCurrent(); else if (k === 'import') $('#homeFile').click();
      else if (k === 'share') window.SWShareCurrent?.(); else if (k === 'page') pageDlg(); else if (k === 'print') printDoc(); else if (k === 'info') infoDlg(); else if (k === 'home') window.SWHome?.show('home'); };
  }, 'menu');
}
function saveTplDlg(){ SWAsk('Enregistrer comme modèle', 'Nom du modèle', E.doc.title, 'Enregistrer', async v => { await SWHome.saveTemplate(v); }); }
function infoDlg(){
  const t = sheet().innerText.replace(/​/g, ''), w = countWords(t), sent = (t.match(/[^.!?…]+[.!?…]+/g) || []).length || 1;
  const hs = $$('h1,h2,h3', sheet()).length, imgs = $$('img', sheet()).length, tbl = $$('table', sheet()).length, kb = Math.round(new Blob([getJSON()]).size / 1024);
  SWDlg.open(`<h3>${escH(E.doc.title)}</h3><dl class="info-dl"><dt>Pages</dt><dd>${E.pages}</dd><dt>Mots</dt><dd>${w.toLocaleString('fr-FR')}</dd><dt>Caractères (sans espaces)</dt><dd>${t.replace(/\s/g, '').length.toLocaleString('fr-FR')}</dd><dt>Caractères (avec espaces)</dt><dd>${t.length.toLocaleString('fr-FR')}</dd>
    <dt>Temps de lecture</dt><dd>${Math.max(1, Math.round(w / 230))} min</dd><dt>Mots par phrase (moyenne)</dt><dd>${(w / sent).toFixed(1).replace('.', ',')}</dd><dt>Titres · images · tableaux</dt><dd>${hs} · ${imgs} · ${tbl}</dd><dt>Taille du document</dt><dd>${kb.toLocaleString('fr-FR')} Ko</dd>
    <dt>Format</dt><dd>${PAGE_LABEL[E.doc.page.size]} · ${E.doc.page.orient === 'l' ? 'paysage' : 'portrait'}</dd><dt>Thème</dt><dd>${escH(themeVals(E.doc.theme).name)}</dd></dl><div class="dlg-acts"><button type="button" class="ap-btn" data-dlg="close">Fermer</button></div>`);
}
function shortcutsDlg(){
  const k = (a, b) => `<tr><td>${a}</td><td>${b}</td></tr>`;
  SWDlg.open(`<h3>Raccourcis et astuces</h3><div class="sc-wrap"><table class="sc">${k('<kbd>/</kbd> en début de ligne', 'Insérer un bloc, un titre, un tableau…')}${k('<kbd>#</kbd> <kbd>##</kbd> <kbd>###</kbd> + espace', 'Titre 1, 2, 3')}${k('<kbd>-</kbd> ou <kbd>*</kbd> + espace', 'Liste à puces')}${k('<kbd>1.</kbd> + espace', 'Liste numérotée')}${k('<kbd>[]</kbd> + espace', 'Liste de tâches')}${k('<kbd>&gt;</kbd> + espace', 'Citation')}${k('<kbd>---</kbd> + Entrée', 'Séparateur')}
    ${k('<kbd>Ctrl</kbd> <kbd>B</kbd> / <kbd>I</kbd> / <kbd>U</kbd>', 'Gras, italique, souligné')}${k('<kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> · <kbd>0</kbd>', 'Titre 1, 2, 3 · texte normal')}${k('<kbd>Ctrl</kbd> <kbd>K</kbd>', 'Lien')}${k('<kbd>Ctrl</kbd> <kbd>Entrée</kbd>', 'Saut de page')}${k('<kbd>Ctrl</kbd> <kbd>F</kbd> · <kbd>H</kbd>', 'Rechercher · remplacer')}${k('<kbd>Ctrl</kbd> <kbd>Maj</kbd> <kbd>V</kbd>', 'Coller sans mise en forme')}${k('<kbd>Ctrl</kbd> <kbd>P</kbd>', 'Imprimer ou PDF')}${k('<kbd>Ctrl</kbd> <kbd>S</kbd>', 'Enregistrer tout de suite (sinon automatique)')}
    ${k('Poignée <b>⋮⋮</b> à gauche d\'un bloc', 'Glisser pour déplacer, cliquer pour dupliquer, supprimer…')}${k('Glisser une image sur la page', 'Elle s\'insère à cet endroit')}</table></div><div class="dlg-acts"><button type="button" class="ap-btn" data-dlg="close">Compris</button></div>`, null, 'wide');
}
function toggleFocus(on){ document.body.classList.toggle('focus-mode', on ?? !document.body.classList.contains('focus-mode')); setTimeout(() => { sizeStage(); placeTools(); }, 50); if (document.body.classList.contains('focus-mode')) toast('Mode concentration · Échap pour sortir'); }

/* --- événements --- */
function wire(){
  const S = sheet();
  S.addEventListener('input', e => { $$('.ph-cur', S).forEach(x => { if (x.textContent.replace(/\u200B/g, '').trim()) x.classList.remove('ph-cur'); }); changed(); slashCheck(); placeFloat(); });
  S.addEventListener('focus', () => document.body.classList.add('editing'));
  S.addEventListener('blur', () => { saveSel(); document.body.classList.remove('editing'); setTimeout(() => { if (!inSheet()) $('#floatBar').hidden = true; }, 150); });
  document.addEventListener('selectionchange', () => { if (!sheet() || $('#app').hidden) return; if (inSheet()){ saveSel(); refreshSoon(); statusSoon(); if (!SL.open || !getSelection().isCollapsed) slashCheckSoon(); } requestAnimationFrame(() => { placeFloat(); placeTools(); }); });
  S.addEventListener('beforeinput', e => {
    if (E.ro){ e.preventDefault(); return; }
    if (e.inputType === 'historyUndo'){ e.preventDefault(); return undo(); }
    if (e.inputType === 'historyRedo'){ e.preventDefault(); return redo(); }
    if (e.inputType === 'insertText' && E.frTypo && e.data && e.data.length === 1){
      const s = getSelection(); if (!s.isCollapsed) return; const n = s.anchorNode; if (n?.nodeType !== 3 || n.parentElement.closest('pre,code')) return;
      const prev = n.data[s.anchorOffset - 1] || '', c = e.data;
      let rep = null, back = 0;
      if (c === "'" && /[\p{L}\p{N}]/u.test(prev)) rep = '’';
      else if (c === '"'){ rep = !prev || /[\s (\[]/.test(prev) ? '« ' : ' »'; }
      else if (/[;!?]/.test(c) && prev === ' '){ rep = ' ' + c; back = 1; }
      else if (c === ':' && prev === ' '){ rep = ' :'; back = 1; }
      else if (c === '.' && n.data.slice(s.anchorOffset - 2, s.anchorOffset) === '..'){ rep = '…'; back = 2; }
      if (rep !== null){ e.preventDefault(); if (back){ const r = document.createRange(); r.setStart(n, s.anchorOffset - back); r.setEnd(n, s.anchorOffset); s.removeAllRanges(); s.addRange(r); } document.execCommand('insertText', false, rep); }
    }
  });
  S.addEventListener('keydown', onKey);
  S.addEventListener('paste', onPaste);
  S.addEventListener('click', e => {
    const li = e.target.closest('ul.sw-check > li'); if (li && !E.ro){ const r = li.getBoundingClientRect(); if ((e.clientX - r.left) / E.zoom < 26){ flushRecord(); record(); li.toggleAttribute('data-done'); if (li.hasAttribute('data-done')) li.setAttribute('data-done', '1'); changed({record:true}); e.preventDefault(); } }
    const fig = e.target.closest('figure.sw-img'); if (fig && e.target.tagName === 'IMG') selectFigure(fig); else if (!e.target.closest('figure.sw-img')) selectFigure(null);
    const to = e.target.closest('[data-sw-to]'); if (to){ e.preventDefault(); const h = sheet().querySelector(`[data-sw-id="${CSS.escape(to.dataset.swTo)}"]`); h?.scrollIntoView({behavior:'smooth', block:'start'}); }
    const a = e.target.closest('a[href]'); if (a && (e.ctrlKey || e.metaKey || E.ro) && !a.dataset.swTo) window.open(a.href, '_blank', 'noopener');
  });
  S.addEventListener('dblclick', e => { const a = e.target.closest('a[href]'); if (a && !E.ro){ const r = document.createRange(); r.selectNodeContents(a); getSelection().removeAllRanges(); getSelection().addRange(r); linkDlg(); } });
  /* glisser-déposer : blocs du panneau, images, réorganisation */
  const canvas = E.canvas;
  canvas.addEventListener('dragover', e => { const ty = [...(e.dataTransfer?.types || [])]; if (ty.includes('text/sw-block') || ty.includes('text/sw-move') || ty.includes('text/sw-shape') || ty.includes('Files')){ e.preventDefault(); e.stopPropagation(); showDropLine(dropTarget(e)); } });
  canvas.addEventListener('dragleave', e => { if (!canvas.contains(e.relatedTarget)) $('#dropLine').hidden = true; });
  canvas.addEventListener('drop', e => {
    const dt = e.dataTransfer, t = dropTarget(e); $('#dropLine').hidden = true;
    if (dt.types.includes('text/sw-block')){ e.preventDefault(); e.stopPropagation(); insertBlockById(dt.getData('text/sw-block'), t.el, t.where); }
    else if (dt.types.includes('text/sw-shape')){ e.preventDefault(); e.stopPropagation(); const s = SHAPES.find(x => x.id === dt.getData('text/sw-shape')); if (s) insertHTMLBlock(`<div class="sw-shape" contenteditable="false">${s.svg}</div>`, t.el, t.where); }
    else if (dt.types.includes('text/sw-move') && dragBlock){ e.preventDefault(); e.stopPropagation(); if (t.el && t.el !== dragBlock){ flushRecord(); record(); t.where === 'before' ? t.el.before(dragBlock) : t.el.after(dragBlock); changed({record:true}); paginate(); } dragBlock = null; }
    else if (dt.files?.length){ const f = [...dt.files].find(x => x.type.startsWith('image/')); e.preventDefault(); e.stopPropagation(); if (f && !E.ro) insertImageFile(f, t.el, t.where); else if (dt.files[0] && !E.ro) insertFileHere(dt.files[0]); }
  });
  canvas.addEventListener('mousemove', e => { if (dragBlock) return; if (e.target.closest('#blkHandle')) return; const el = e.target.closest('#sheet > *:not(.sw-pbs)'); if (el && el !== hoverBlock) placeHandle(el); else if (!el && !e.target.closest('#sheet')) placeHandle(null); });
  E.scroll.addEventListener('mouseleave', () => setTimeout(() => { if (!$('#blkHandle').matches(':hover')) placeHandle(null); }, 200));
  const hd = $('#blkHandle');
  $('.bh-grip', hd).addEventListener('dragstart', e => { if (!hoverBlock) return e.preventDefault(); dragBlock = hoverBlock; e.dataTransfer.setData('text/sw-move', '1'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setDragImage(hoverBlock, 10, 10); } catch(x){} });
  $('.bh-grip', hd).addEventListener('dragend', () => { dragBlock = null; $('#dropLine').hidden = true; });
  $('.bh-grip', hd).addEventListener('click', e => { if (hoverBlock) blockMenu(e.currentTarget, hoverBlock); });
  $('.bh-add', hd).addEventListener('click', e => { if (hoverBlock) addMenu(e.currentTarget, hoverBlock); });
  /* poignée de redimensionnement des images */
  const ih = $('#imgHandle'); let rs = null;
  ih.addEventListener('pointerdown', e => { if (!selFig) return; e.preventDefault(); ih.setPointerCapture(e.pointerId); flushRecord(); record(); const r = selFig.getBoundingClientRect(); rs = {x:e.clientX, w:r.width, cw:(E.geo.pw - E.geo.ml - E.geo.mr) * E.zoom}; });
  ih.addEventListener('pointermove', e => { if (!rs) return; const w = clamp(rs.w + (e.clientX - rs.x) * (selFig.dataset.align === 'center' ? 2 : 1), 40, rs.cw); selFig.style.width = (w / rs.cw * 100).toFixed(1) + '%'; placeTools(); });
  ih.addEventListener('pointerup', () => { if (rs){ rs = null; changed({record:true}); paginate(); } });
  /* barres */
  const keep = el => el.addEventListener('mousedown', e => { if (!e.target.closest('select,input')) e.preventDefault(); });
  ['#edBar', '#floatBar', '#imgBar', '#tblBar', '#slashMenu'].forEach(s => keep($(s)));
  $('#edBar').addEventListener('click', e => {
    const c = e.target.closest('[data-cmd]'); if (c) return cmd(c.dataset.cmd);
    const a = e.target.closest('[data-act]'); if (!a) return; const k = a.dataset.act; restoreSel();
    ({undo, redo, check:toggleChecklist, indent:() => indent(1), outdent:() => indent(-1), link:linkDlg, image:() => $('#edImgFile').click(), table:() => tablePop(a), insert:() => insertPop(a),
      color:() => colorPop(a, false), hl:() => colorPop(a, true), spacing:() => spacingPop(a), clear:clearFormat, find:() => openFind(false), page:pageDlg, tools:() => toolsPop(a),
      'size-':() => stepSize(-1), 'size+':() => stepSize(1)})[k]?.();
  });
  $('#fStyle').addEventListener('change', e => { const s = STYLES[+e.target.value]; restoreSel(); setBlock(s[0], s[1]); sheet().focus({preventScroll:true}); });
  $('#fFont').addEventListener('change', e => { const f = e.target.value; restoreSel(); if (f){ ensureFont(f); inlineStyle('font-family', fontStack(f)); } else inlineStyle('font-family', 'inherit'); sheet().focus({preventScroll:true}); setTimeout(paginate, 400); });
  const sz = $('#fSize');
  const applySize = () => { const v = parseFloat(String(sz.value).replace(',', '.')); if (!(v >= 4 && v <= 200)) return refreshToolbar(); restoreSel(); inlineStyle('font-size', v + 'pt'); sheet().focus({preventScroll:true}); };
  sz.addEventListener('change', applySize); sz.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); applySize(); } });
  $('#floatBar').addEventListener('click', e => {
    const c = e.target.closest('[data-fc]'); if (c) return cmd(c.dataset.fc);
    const a = e.target.closest('[data-fa]'); if (!a) return; const k = a.dataset.fa;
    if (k === 'h1' || k === 'h2') setBlock(k); else if (k === 'color') colorPop(a, false); else if (k === 'hl') colorPop(a, true); else if (k === 'link') linkDlg(); else if (k === 'clear') clearFormat();
  });
  $('#imgBar').addEventListener('click', e => { const b = e.target.closest('[data-img]'); if (!b) return; const k = b.dataset.img;
    if (k === 'replace'){ E.replaceFig = selFig; return $('#edImgFile').click(); }
    if (k === 'stylepop') return openPop(b, `<div class="pop-list">${[['', 'Aucun'], ['rounded', 'Coins arrondis'], ['shadow', 'Ombre portée'], ['frame', 'Cadre photo'], ['circle', 'Cercle']].map(([v, t]) => `<button type="button" data-st="${v}">${t}</button>`).join('')}<hr><button type="button" data-st="alt">Texte alternatif…</button></div>`, p => {
      p.onclick = ev => { const s = ev.target.closest('[data-st]'); if (!s) return; closePop(); if (s.dataset.st === 'alt') return SWAsk('Texte alternatif', 'Description de l\'image (accessibilité)', selFig?.querySelector('img')?.alt || '', 'Enregistrer', async v => figOp('alt', v)); figOp('style', s.dataset.st); }; });
    figOp(k, b.dataset.v); });
  $('#tblBar').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (b) tableOp(b.dataset.t); });
  $('#slashMenu').addEventListener('click', e => { const b = e.target.closest('[data-sl]'); if (b) slashRun(+b.dataset.sl); });
  $('#edImgFile').addEventListener('change', async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    if (E.replaceFig && sheet().contains(E.replaceFig)){ try { const src = await readImage(f); flushRecord(); record(); E.replaceFig.querySelector('img').src = src; changed({record:true}); toast('Image remplacée'); } catch(x){ toast(x.message); } E.replaceFig = null; return; }
    restoreSel(); insertImageFile(f); });
  $('#edInsFile').addEventListener('change', e => { const f = e.target.files[0]; e.target.value = ''; if (f){ restoreSel(); insertFileHere(f); } });
  /* panneaux */
  $('#edRail').addEventListener('click', e => { const b = e.target.closest('[data-panel]'); if (b) openPanel(b.dataset.panel); });
  $('#edPanelClose').addEventListener('click', () => openPanel(panel));
  const PB = $('#edPanelBody');
  PB.addEventListener('mousedown', e => { if (e.target.closest('[data-block],[data-ins],[data-tag],[data-shape]')) e.preventDefault(); });
  PB.addEventListener('click', e => {
    const t = e.target;
    const bl = t.closest('[data-block]'); if (bl){ restoreSel(); return insertBlockById(bl.dataset.block); }
    const bi = t.closest('[data-block-ins]'); if (bi){ restoreSel(); return insertBlockById(bi.dataset.blockIns); }
    const bc = t.closest('[data-bcat]'); if (bc){ blockCat = bc.dataset.bcat; return renderPanel(); }
    const th = t.closest('[data-theme]'); if (th){ applyTheme({id:th.dataset.theme, fs:E.doc.theme.fs, lh:E.doc.theme.lh}); toast('Thème « ' + themeVals(E.doc.theme).name + ' » appliqué'); return renderPanel(); }
    const ins = t.closest('[data-ins]'); if (ins){ restoreSel(); return insertInline(ins.dataset.ins); }
    const tg = t.closest('[data-tag]'); if (tg){ restoreSel(); insertHTMLInline(`<span class="sw-tag">${escH(tg.dataset.tag)}</span>&nbsp;`); return; }
    const sh = t.closest('[data-shape]'); if (sh){ restoreSel(); const s = SHAPES.find(x => x.id === sh.dataset.shape); return insertHTMLBlock(`<div class="sw-shape" contenteditable="false">${s.svg}</div>`); }
    const tp = t.closest('[data-tpl]'); if (tp) return tplChoice(tp.dataset.tpl);
    const go = t.closest('[data-go]'); if (go){ const hs = $$('h1, h2, h3', sheet()).filter(h => h.textContent.trim() && !h.closest('.sw-toc')); hs[+go.dataset.go]?.scrollIntoView({behavior:'smooth', block:'start'}); return; }
    const gi = t.closest('[data-goimg]'); if (gi){ const f = $$('figure.sw-img', sheet())[+gi.dataset.goimg]; if (f){ f.scrollIntoView({behavior:'smooth', block:'center'}); selectFigure(f); } return; }
    const a = t.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'img-upload') $('#edImgFile').click();
    else if (a.dataset.act === 'save-tpl') saveTplDlg();
    else if (a.dataset.act === 'theme-reset'){ applyTheme({id:E.doc.theme.id}); renderPanel(); }
  });
  PB.addEventListener('dragstart', e => { const b = e.target.closest('[data-block]'); if (b){ e.dataTransfer.setData('text/sw-block', b.dataset.block); e.dataTransfer.effectAllowed = 'copy'; } const s = e.target.closest('[data-shape]'); if (s){ e.dataTransfer.setData('text/sw-shape', s.dataset.shape); } });
  PB.addEventListener('input', e => {
    if (e.target.id === 'pnBlockQ'){ blockQ = e.target.value; renderPanel(); return; }
    const id = e.target.id, th = {...E.doc.theme};
    if (id === 'thAc'){ th.ac = e.target.value; e.target.nextElementSibling.textContent = e.target.value; }
    else if (id === 'thAc2'){ th.ac2 = e.target.value; e.target.nextElementSibling.textContent = e.target.value; }
    else if (id === 'thFs'){ th.fs = +e.target.value; $('#thFsO').textContent = Math.round(th.fs * .75 * 2) / 2 + ' pt'; }
    else if (id === 'thLh'){ th.lh = +e.target.value; $('#thLhO').textContent = String(th.lh).replace('.', ','); }
    else return;
    E.doc.theme = th; applyGeometry(); paginateSoon(); emitChange(); recPending = true; recordLater();
  });
  PB.addEventListener('change', e => { const id = e.target.id; if (id !== 'thFh' && id !== 'thFb') return; applyTheme({...E.doc.theme, [id === 'thFh' ? 'fh' : 'fb']:e.target.value}); setTimeout(paginate, 500); });
  /* barre de recherche */
  $('#frQ').addEventListener('input', frSearch); $('#frCase').addEventListener('change', frSearch);
  $('#frQ').addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); frGo(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') closeFind(); });
  $('#findBar').addEventListener('click', e => { const b = e.target.closest('[data-fr]'); if (!b) return; const k = b.dataset.fr; if (k === 'next') frGo(1); else if (k === 'prev') frGo(-1); else if (k === 'rep') frReplace(false); else if (k === 'all') frReplace(true); else if (k === 'close') closeFind(); else if (k === 'more') $('#findBar').classList.toggle('rep'); });
  /* en-tête de l'éditeur */
  const ti = $('#docTitle');
  ti.addEventListener('input', () => { E.autoTitle = false; E.doc.title = ti.value.trim() || 'Document sans titre'; emitChange(); renderDecoSoon(); });
  ti.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); sheet().focus(); } });
  ti.addEventListener('blur', () => { if (!ti.value.trim()) ti.value = E.doc.title; });
  $('#exportBtn').addEventListener('click', e => exportPop(e.currentTarget));
  $('#fileBtn').addEventListener('click', e => filePop(e.currentTarget));
  $('#shareBtn').addEventListener('click', () => window.SWShareCurrent?.());
  $('#homeBtn').addEventListener('click', () => window.SWHome?.show('home'));
  $('#focusBtn').addEventListener('click', () => toggleFocus());
  $('#zoomOut').addEventListener('click', () => setZoom(E.zoom - .1));
  $('#zoomIn').addEventListener('click', () => setZoom(E.zoom + .1));
  $('#zoomRange').addEventListener('input', e => setZoom(+e.target.value / 100));
  $('#zoomVal').addEventListener('click', () => setZoom(1, true));
  E.scroll.addEventListener('scroll', () => { placeFloat(); placeTools(); if (SL.open) slashClose(); statusSoon(); }, {passive:true});
  addEventListener('resize', debounce(() => { sizeStage(); placeTools(); }, 120));
  addEventListener('keydown', globalKeys);
  addEventListener('beforeprint', () => { if (!E.printing && !$('#app').hidden){ E.printing = true; document.body.classList.add('printing'); const z = E.zoom; E.zoom = 1; E.canvas.style.transform = 'none'; applyGeometry(); layout(); E.zoom = z; } });
  addEventListener('afterprint', () => { if (E.printing){ E.printing = false; document.body.classList.remove('printing'); applyGeometry(); sizeStage(); paginate(); } });
}
const renderDecoSoon = debounce(() => renderDeco(), 300);
const slashCheckSoon = debounce(() => { if (SL.open) slashCheck(); }, 30);
function stepSize(d){ const cur = parseFloat(String($('#fSize').value).replace(',', '.')) || 11; const steps = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];
  const nx = d > 0 ? steps.find(s => s > cur) || cur + 8 : [...steps].reverse().find(s => s < cur) || Math.max(4, cur - 1); $('#fSize').value = nx; restoreSel(); inlineStyle('font-size', nx + 'pt'); }
function tplChoice(id){
  const t = [...(E.userLib.templates || []), ...SW_TEMPLATES].find(x => x.id === id); if (!t) return;
  SWDlg.open(`<h3>${escH(t.name)}</h3><p class="dlg-p">${escH(t.desc || '')}</p><div class="dlg-acts"><button type="button" class="ap-btn alt" id="tcRep"${E.ro ? ' disabled' : ''}>Remplacer ce document</button><button type="button" class="ap-btn" id="tcNew">Nouveau document</button></div>`, d => {
    $('#tcNew', d).onclick = () => { SWDlg.close(); window.SWHome?.newDoc(id); };
    $('#tcRep', d).onclick = () => { SWDlg.close(); flushRecord(); record(); const j = JSON.parse(fromTemplate(id, E.userLib)); sheet().innerHTML = SAN(j.html); E.doc.theme = j.theme; E.doc.page = j.page; applyGeometry(); paginate(); changed({record:true}); toast('Modèle appliqué · Ctrl+Z pour revenir en arrière'); };
  });
}
function onKey(e){
  const mod = e.ctrlKey || e.metaKey, k = e.key;
  if (SL.open){
    if (k === 'ArrowDown'){ e.preventDefault(); SL.i = (SL.i + 1) % SL.items.length; return slashCheck(); }
    if (k === 'ArrowUp'){ e.preventDefault(); SL.i = (SL.i - 1 + SL.items.length) % SL.items.length; return slashCheck(); }
    if (k === 'Enter' || k === 'Tab'){ e.preventDefault(); return slashRun(SL.i); }
    if (k === 'Escape'){ e.preventDefault(); return slashClose(); }
  }
  if (E.ro) return;
  if (mod && !e.altKey){
    const lk = k.toLowerCase();
    if (lk === 'z' && !e.shiftKey){ e.preventDefault(); return undo(); }
    if (lk === 'y' || (lk === 'z' && e.shiftKey)){ e.preventDefault(); return redo(); }
    if (lk === 'b'){ e.preventDefault(); return cmd('bold'); }
    if (lk === 'i'){ e.preventDefault(); return cmd('italic'); }
    if (lk === 'u'){ e.preventDefault(); return cmd('underline'); }
    if (lk === 'k'){ e.preventDefault(); return linkDlg(); }
    if (k === 'Enter'){ e.preventDefault(); return insertHTMLBlock(PAGEBREAK + '<p><br></p>'); }
    if (lk === 'e' && e.shiftKey){ e.preventDefault(); return cmd('justifyCenter'); }
  }
  if (mod && e.altKey && /^[0-4]$/.test(k)){ e.preventDefault(); return k === '0' ? setBlock('p') : setBlock('h' + k); }
  if (k === 'Tab'){
    const cell = curCell();
    if (cell){ e.preventDefault(); const cells = $$('td,th', cell.closest('table')); let i = cells.indexOf(cell) + (e.shiftKey ? -1 : 1); if (i >= cells.length){ tableOp('rowAfter'); i = cells.length; } const nx = $$('td,th', cell.closest('table'))[Math.max(0, i)]; if (nx){ const r = document.createRange(); r.selectNodeContents(nx); getSelection().removeAllRanges(); getSelection().addRange(r); } return; }
    if (blockOf(getSelection().anchorNode)?.tagName === 'LI'){ e.preventDefault(); return cmd(e.shiftKey ? 'outdent' : 'indent'); }
  }
  if (k === ' ' && !mod){ if (mdShortcut()) e.preventDefault(); }
  if (k === 'Enter' && !e.shiftKey && !mod){
    const b = blockOf(getSelection().anchorNode);
    if (b && b.tagName === 'P' && b.textContent.trim() === '---'){ e.preventDefault(); flushRecord(); record(); const hr = document.createElement('hr'); const p = document.createElement('p'); p.innerHTML = '<br>'; b.replaceWith(hr); hr.after(p); caretToStart(p); return changed({record:true}); }
    // Entrée dans un titre : le paragraphe suivant est du texte normal
    if (b && /^H[1-6]$/.test(b.tagName) && getSelection().isCollapsed){ const r = getSelection().getRangeAt(0), tail = document.createRange(); tail.setStart(r.endContainer, r.endOffset); tail.setEnd(b, b.childNodes.length);
      if (!tail.toString().length){ e.preventDefault(); const nx = b.nextElementSibling; if (nx && nx.tagName === 'P' && isEmptyBlock(nx)){ caretToStart(nx); return refreshToolbar(); } flushRecord(); record(); const p = document.createElement('p'); p.innerHTML = '<br>'; b.after(p); caretToStart(p); return changed({record:true}); } }
    // Entrée sur un élément vide de liste de tâches : on sort de la liste
    if (b && b.tagName === 'LI' && !b.textContent.trim() && b.parentNode.classList.contains('sw-check')){ e.preventDefault(); const ul = b.parentNode; flushRecord(); record(); const p = document.createElement('p'); p.innerHTML = '<br>'; b.remove(); ul.after(p); if (!ul.children.length) ul.remove(); caretToStart(p); return changed({record:true}); }
  }
  if ((k === 'Backspace' || k === 'Delete') && selFig && !getSelection().toString()){ e.preventDefault(); return figOp('del'); }
}
function mdShortcut(){
  const s = getSelection(); if (!s.isCollapsed || !s.rangeCount) return false;
  const b = blockOf(s.anchorNode); if (!b || b.tagName !== 'P') return false;
  const pre = document.createRange(); pre.setStart(b, 0); pre.setEnd(s.anchorNode, s.anchorOffset);
  const t = pre.toString(); const map = {'#':['h1'], '##':['h2'], '###':['h3'], '####':['h4'], '>':['blockquote'], '-':['ul'], '*':['ul'], '•':['ul'], '1.':['ol'], '1)':['ol'], '[]':['check'], '[ ]':['check'], '[x]':['check', 1]};
  const m = map[t]; if (!m) return false;
  pre.deleteContents(); if (!b.textContent) b.innerHTML = '<br>'; caretToStart(b);
  if (/^h\d|blockquote$/.test(m[0])) setBlock(m[0]); else if (m[0] === 'ul') cmd('insertUnorderedList'); else if (m[0] === 'ol') cmd('insertOrderedList'); else if (m[0] === 'check'){ toggleChecklist(); if (m[1]){ const li = blockOf(getSelection().anchorNode); li?.setAttribute('data-done', '1'); } }
  return true;
}
function globalKeys(e){
  if ($('#app').hidden || !$('#auth').hidden) return;
  const mod = e.ctrlKey || e.metaKey, lk = e.key.toLowerCase();
  if (e.key === 'Escape'){ if (!$('#edPop').hidden) return closePop(); if (!$('#findBar').hidden) return closeFind(); if (document.body.classList.contains('focus-mode')) return toggleFocus(false); if (selFig) return selectFigure(null); }
  if (!mod) return;
  if (lk === 's'){ e.preventDefault(); window.SWHome?.flush(); toast('Enregistré'); }
  else if (lk === 'p'){ e.preventDefault(); printDoc(); }
  else if (lk === 'f' && !e.shiftKey){ e.preventDefault(); openFind(false); }
  else if (lk === 'h'){ e.preventDefault(); openFind(true); }
}
function onPaste(e){
  if (E.ro) return e.preventDefault();
  const cd = e.clipboardData; if (!cd) return;
  const img = [...(cd.files || [])].find(f => f.type.startsWith('image/')); if (img){ e.preventDefault(); return insertImageFile(img); }
  const html = cd.getData('text/html'), text = cd.getData('text/plain');
  e.preventDefault(); flushRecord(); record();
  if (html && !E.plainNext){
    let h = SAN(html.replace(/<!--[\s\S]*?-->/g, '').replace(/<style[\s\S]*?<\/style>/gi, ''));
    // collage depuis Word / Google Docs : on enlève les styles parasites, on garde la structure et l'essentiel
    const t = document.createElement('div'); t.innerHTML = h;
    t.querySelectorAll('[style]').forEach(el => { const keep = []; const st = el.style; if (/^(bold|[6-9]00)$/.test(st.fontWeight)) keep.push('font-weight:700'); if (st.fontStyle === 'italic') keep.push('font-style:italic'); if (st.textDecoration.includes('underline')) keep.push('text-decoration:underline');
      if (el.tagName !== 'SPAN' && st.textAlign && st.textAlign !== 'start' && st.textAlign !== 'left') keep.push('text-align:' + st.textAlign);
      if (el.tagName === 'FIGURE' || el.tagName === 'IMG') { if (st.width) keep.push('width:' + st.width); }
      keep.length ? el.setAttribute('style', keep.join(';')) : el.removeAttribute('style'); });
    t.querySelectorAll('span:not([class]):not([style])').forEach(s => { const p = s.parentNode; while (s.firstChild) p.insertBefore(s.firstChild, s); s.remove(); });
    t.querySelectorAll('table:not([class])').forEach(x => x.className = 'sw-table t-grid');
    t.querySelectorAll('img').forEach(im => { if (!im.closest('figure')){ const f = document.createElement('figure'); f.className = 'sw-img'; f.dataset.align = 'center'; f.style.width = '70%'; im.replaceWith(f); f.appendChild(im); } });
    document.execCommand('insertHTML', false, t.innerHTML);
  } else if (text){
    const paras = text.replace(/\r/g, '').split(/\n{2,}/);
    if (paras.length > 1) document.execCommand('insertHTML', false, paras.map(p => `<p>${escH(p).replace(/\n/g, '<br>')}</p>`).join(''));
    else document.execCommand('insertText', false, text);
  }
  E.plainNext = false; changed({record:true}); setTimeout(paginate, 50);
}

/* --- démarrage --- */
(function init(){
  const st = document.createElement('style'); st.id = 'swDocCss'; st.textContent = DOC_CSS; document.head.appendChild(st);
  E.sheet = $('#sheet'); E.canvas = $('#edCanvas'); E.scroll = $('#edScroll'); E.stage = $('#edStage'); E.deco = $('#pageDeco'); E.over = $('#edOver');
  buildToolbar(); renderRail(); wire();
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v' && inSheet()) E.plainNext = true; }, true);
  E.sheet.innerHTML = '<p><br></p>'; applyGeometry(); layout();
  const ro = new ResizeObserver(debounce(() => { if (!$('#app').hidden){ sizeStage(); } }, 100)); ro.observe(E.scroll);
  window.SWEditor = {
    load, get:getJSON, title:() => E.doc.title, meta:() => ({preview:previewHtml(cleanHtml()), theme:themeKey(E.doc.theme), words:E.words ?? countWords(sheet().innerText), pageSize:E.doc.page.size + (E.doc.page.orient === 'l' ? '-l' : '')}),
    metaOf, fromTemplate, importFile, setReadOnly, restoreSel, setUserLib(l){ E.userLib = l || {}; if (panel === 'templates') renderPanel(); },
    focusTitle(blank){ if (blank){ const h = sheet().querySelector('h1'); if (h){ sheet().focus(); caretToStart(h); return; } } sheet().focus({preventScroll:true}); },
    paginate, doExport,
  };
  window.__swReady = true;
  window.dispatchEvent(new Event('sw:ready'));
})();
