/* ---------- Barre des objets : forme, graphique, schéma, carte, encadré… remplissage, dégradé, contour, ombre, arrondi, taille ---------- */
const OBJ_SEL = '[data-sw-gfx], .sw-card, .sw-callout, .sw-banner, .sw-band, .sw-quote, .sw-price, .sw-stat, .sw-tcols, .sw-textbox, .sw-sign, .sw-faq, .sw-hero';
const gfxOf = o => o?.dataset?.swGfx || '';
const specOf = o => { try { return JSON.parse(o.dataset.swSpec || '{}'); } catch(e){ return {}; } };
function setSpec(o, patch){ const sp = {...specOf(o), ...patch}; o.dataset.swSpec = JSON.stringify(sp); renderObj(o); changed(); }
function bstyle(o, props){ for (const k in props){ const v = props[k]; if (v === null || v === '') o.style.removeProperty(k); else o.style.setProperty(k, v); } if (!o.getAttribute('style')) o.removeAttribute('style'); changed(); }
const swatches = (k, cur, extra = '') => `<div class="op-sw" data-k="${k}">${extra}${SWATCH.map(c => `<button type="button" data-c="${c}" style="background:${c}" aria-label="${c}" class="${String(cur).toLowerCase() === c.toLowerCase() ? 'on' : ''}"></button>`).join('')}<label class="op-cust" title="Autre couleur"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(cur) ? cur : '#7B3FF2'}"></label></div>`;
const rng = (k, label, min, max, val, unit = '', step = 1) => `<label class="op-rng"><span>${label} <output>${val}${unit}</output></span><input type="range" data-r="${k}" min="${min}" max="${max}" step="${step}" value="${val}" data-u="${unit}"></label>`;
function popWire(p, handler){
  // handler(key, value) : appelé en direct pour les couleurs, curseurs et boutons à valeur
  flushRecord(); record();
  p.addEventListener('mousedown', e => { if (!e.target.closest('input')) e.preventDefault(); });
  p.addEventListener('click', e => { const c = e.target.closest('.op-sw [data-c]'); if (c){ const k = c.closest('.op-sw').dataset.k; $$('.op-sw[data-k="' + k + '"] [data-c]', p).forEach(x => x.classList.toggle('on', x === c)); handler(k, c.dataset.c); return; }
    const v = e.target.closest('[data-set]'); if (v){ $$('[data-set]', v.parentElement).forEach(x => x.classList.toggle('on', x === v)); handler(v.dataset.set, v.dataset.v); } });
  p.addEventListener('input', e => { const i = e.target; if (i.matches('.op-cust input')) handler(i.closest('.op-sw').dataset.k, i.value);
    else if (i.matches('[data-r]')){ const o = i.parentElement.querySelector('output'); if (o) o.textContent = i.value + (i.dataset.u || ''); handler(i.dataset.r, +i.value); } });
  p.addEventListener('change', () => { flushRecord(); record(); });
}
const bg2css = (c1, c2, a) => c2 && c2 !== c1 ? `linear-gradient(${a}deg, ${c1}, ${c2})` : c1;
const gradBtns = () => `<div class="op-grads">${GRADS.map(([a, b], i) => `<button type="button" data-set="grad" data-v="${i}" style="background:linear-gradient(135deg,${a},${b})" aria-label="Dégradé ${i + 1}"></button>`).join('')}</div>`;

/* ----- contenu des fenêtres de réglage ----- */
const OP = {
  fill:{t:'Remplir', build(o){
    if (gfxOf(o) === 'shape'){ const sp = {...SHAPE_DEF, ...specOf(o)}; return `<p class="pop-h">Couleur</p>${swatches('f1', sp.f1)}<p class="pop-h">Dégradé</p>${gradBtns()}<p class="pop-h">Seconde couleur</p>${swatches('f2', sp.f2, '<button type="button" data-c="" class="op-none" title="Aucune">∅</button>')}${rng('ang', 'Angle', 0, 360, sp.ang, '°')}`; }
    const [c1, c2, a] = (o.dataset.swBg || '||135').split('|'); return `<p class="pop-h">Couleur de fond</p>${swatches('f1', c1, '<button type="button" data-c="" class="op-none" title="Sans fond">∅</button>')}<p class="pop-h">Dégradé</p>${gradBtns()}<p class="pop-h">Seconde couleur</p>${swatches('f2', c2, '<button type="button" data-c="" class="op-none" title="Aucune">∅</button>')}${rng('ang', 'Angle', 0, 360, a || 135, '°')}`; },
    wire(p, o){
      const shape = gfxOf(o) === 'shape';
      popWire(p, (k, v) => {
        if (k === 'grad'){ const [a, b] = GRADS[+v]; return shape ? setSpec(o, {f1:a, f2:b}) : blockBg(o, {c1:a, c2:b}); }
        if (shape) setSpec(o, {[k]:v}); else blockBg(o, k === 'ang' ? {a:v} : k === 'f1' ? {c1:v} : {c2:v}); });
    }},
  stroke:{t:'Contour', build(o){
    if (gfxOf(o) === 'shape'){ const sp = {...SHAPE_DEF, ...specOf(o)}; return `<p class="pop-h">Couleur du trait</p>${swatches('sc', sp.sc)}${rng('sw', 'Épaisseur', 0, 24, sp.sw, ' px')}<p class="pop-h">Style</p><div class="op-seg">${[['', 'Plein'], ['dash', 'Tirets'], ['dot', 'Points']].map(([v, t]) => `<button type="button" data-set="da" data-v="${v}" class="${sp.da === v ? 'on' : ''}">${t}</button>`).join('')}</div>`; }
    const [w, st, c, sides] = (o.dataset.swBd || '0|solid|#7B3FF2|all').split('|');
    return `<p class="pop-h">Couleur</p>${swatches('c', c)}${rng('w', 'Épaisseur', 0, 12, w, ' px')}<p class="pop-h">Style</p><div class="op-seg">${[['solid', 'Plein'], ['dashed', 'Tirets'], ['dotted', 'Points'], ['double', 'Double']].map(([v, t]) => `<button type="button" data-set="st" data-v="${v}" class="${st === v ? 'on' : ''}">${t}</button>`).join('')}</div><p class="pop-h">Côtés</p><div class="op-seg">${[['all', 'Tous'], ['left', 'Gauche'], ['top', 'Haut'], ['bottom', 'Bas'], ['tb', 'Haut + bas']].map(([v, t]) => `<button type="button" data-set="sides" data-v="${v}" class="${sides === v ? 'on' : ''}">${t}</button>`).join('')}</div>`; },
    wire(p, o){ if (gfxOf(o) === 'shape') return popWire(p, (k, v) => setSpec(o, {[k]:v}));
      popWire(p, (k, v) => blockBorder(o, k === 'c' ? {c:v} : k === 'w' ? {w:v} : k === 'st' ? {st:v} : {sides:v})); }},
  shadow:{t:'Ombre', build(o){
    const sp = gfxOf(o) ? specOf(o) : null, [k0, c0] = sp ? [sp.sd || '', sp.sdc || '#7B3FF2'] : (o.dataset.swSh || '|#7B3FF2').split('|');
    return `<p class="pop-h">Effet</p><div class="op-shadows">${SHADOWS.map(([k, n]) => `<button type="button" data-set="sd" data-v="${k}" class="${k0 === k ? 'on' : ''}"><i style="box-shadow:${shadowCss(k, c0) || 'none'}"></i>${n}</button>`).join('')}</div><p class="pop-h">Couleur <small>(colorée, néon, décalée)</small></p>${swatches('sdc', c0)}`; },
    wire(p, o){ popWire(p, (k, v) => { if (gfxOf(o)) return setSpec(o, {[k]:v}); const [k0, c0] = (o.dataset.swSh || '|#7B3FF2').split('|'); const nk = k === 'sd' ? v : k0, nc = k === 'sdc' ? v : c0; o.dataset.swSh = nk + '|' + nc; bstyle(o, {'box-shadow':shadowCss(nk, nc)}); }); }},
  fx:{t:'Effets', build(o){
    if (gfxOf(o) === 'shape'){ const sp = {...SHAPE_DEF, ...specOf(o)}; return `${rng('op', 'Opacité', 10, 100, sp.op, ' %')}${rng('rot', 'Rotation', -180, 180, sp.rot, '°')}${rng('ar', 'Proportions (hauteur / largeur)', .05, 2, sp.ar, '', .05)}<p class="pop-h">Miroir</p><div class="op-seg"><button type="button" data-set="fl" data-v="1">Horizontal</button><button type="button" data-set="fl" data-v="2">Vertical</button><button type="button" data-set="fl" data-v="0">Normal</button></div>`; }
    if (gfxOf(o)) return `<p class="pop-hint pn-hint">Utilisez « Modifier » pour changer les données.</p>`;
    const cs = getComputedStyle(o); return `${rng('rad', 'Arrondi', 0, 60, parseInt(cs.borderTopLeftRadius) || 0, ' px')}${rng('pad', 'Marges intérieures', 0, 70, parseInt(cs.paddingTop) || 0, ' px')}${rng('op', 'Opacité', 10, 100, Math.round((parseFloat(cs.opacity) || 1) * 100), ' %')}`; },
    wire(p, o){ if (gfxOf(o) === 'shape') return popWire(p, (k, v) => setSpec(o, {[k]:+v}));
      popWire(p, (k, v) => bstyle(o, k === 'rad' ? {'border-radius':v + 'px'} : k === 'pad' ? {padding:v + 'px'} : {opacity:v >= 100 ? '' : String(v / 100)})); }},
  size:{t:'Taille', build(o){ const w = parseFloat(o.style.width) || 100, al = o.dataset.swAlign || '';
    return `${rng('w', 'Largeur', 10, 100, Math.round(w), ' %')}<p class="pop-h">Position et habillage</p><div class="op-seg">${[['floatl', 'Gauche + texte'], ['left', 'Gauche'], ['center', 'Centré'], ['right', 'Droite'], ['floatr', 'Droite + texte']].map(([v, t]) => `<button type="button" data-set="al" data-v="${v}" class="${al === v ? 'on' : ''}">${t}</button>`).join('')}</div>`; },
    wire(p, o){ popWire(p, (k, v) => { if (k === 'w'){ o.style.width = v + '%'; changed(); } else { o.dataset.swAlign = v; changed(); } paginateSoon(); }); }},
};
function blockBg(o, patch){ const [c1, c2, a] = (o.dataset.swBg || '||135').split('|'); const n = {c1, c2, a, ...patch}; o.dataset.swBg = [n.c1, n.c2, n.a].join('|');
  const css = n.c1 ? bg2css(n.c1, n.c2, n.a) : (n.c2 ? bg2css('#ffffff', n.c2, n.a) : ''); bstyle(o, {background:css, 'background-image':''}); if (!css) o.removeAttribute('data-sw-bg'); }
function blockBorder(o, patch){ const [w, st, c, sides] = (o.dataset.swBd || '0|solid|#7B3FF2|all').split('|'); const n = {w, st, c, sides, ...patch}; o.dataset.swBd = [n.w, n.st, n.c, n.sides].join('|');
  const b = `${n.w}px ${n.st} ${n.c}`, none = '0 none';
  const pr = {'border-top':none, 'border-right':none, 'border-bottom':none, 'border-left':none};
  if (+n.w > 0){ if (n.sides === 'all') for (const k in pr) pr[k] = b; else if (n.sides === 'tb'){ pr['border-top'] = b; pr['border-bottom'] = b; } else pr['border-' + n.sides] = b; }
  bstyle(o, pr); }

function objButtons(o){
  const g = gfxOf(o), btn = (id, t) => `<button type="button" class="tb tb-txt" data-ob="${id}">${t}</button>`;
  const common = `<span class="fsep"></span><button type="button" class="tb" data-ob="dup" title="Dupliquer">${IC.copy || '⧉'}</button><button type="button" class="tb danger" data-ob="del" title="Supprimer">${IC.trash}</button>`;
  if (g === 'shape') return btn('fill', 'Remplir') + btn('stroke', 'Contour') + btn('shadow', 'Ombre') + btn('fx', 'Effets') + btn('size', 'Taille') + common;
  if (g) return btn('edit', 'Modifier') + btn('shadow', 'Ombre') + btn('size', 'Taille') + common;
  return btn('fill', 'Fond') + btn('stroke', 'Bordure') + btn('shadow', 'Ombre') + btn('fx', 'Arrondi') + btn('size', 'Taille') + common;
}
function placeObjBar(placeFixed){
  let b = $('#objBar'); if (!b) return;
  const o = E.objSel; if (!o || !o.isConnected || !sheet().contains(o) || E.ro || (typeof selFig !== 'undefined' && selFig) || !$('#tblBar').hidden){ b.hidden = true; return; }
  if (b._for !== o){ b._for = o; b.innerHTML = objButtons(o); }
  b.hidden = false; placeFixed(b, o.getBoundingClientRect());
}
function selectObj(o){ E.objSel = o || null; $('#objBar') && ($('#objBar')._for = null); $$('.sw-objsel', sheet()).forEach(x => x.classList.remove('sw-objsel')); if (o) o.classList.add('sw-objsel'); placeTools(); if (typeof stylePanelObjChanged === 'function') stylePanelObjChanged(); }
function objClick(e){
  const o = e.target.closest(OBJ_SEL); if (o && sheet().contains(o) && o !== E.objSel) selectObj(o); else if (!o && E.objSel) selectObj(null);
}
function objDelete(o){ flushRecord(); record(); const n = o.nextElementSibling || o.previousElementSibling; o.remove(); selectObj(null); if (n) caretToStart(n); changed({record:true}); paginate(); }
function objDuplicate(o){ flushRecord(); record(); const c = o.cloneNode(true); c.classList.remove('sw-objsel'); o.after(c); if (c.dataset.swGfx) renderObj(c); selectObj(c); changed({record:true}); paginate(); }
function objOpen(kind, anchor, o){
  if (!OP[kind]) return; const d = OP[kind];
  openPop(anchor, `<p class="pop-h">${d.t}</p>${d.build(o)}`, p => d.wire(p, o), 'objpop');
}
function objEdit(o){ const g = gfxOf(o); if (g === 'chart') chartDlg(o); else if (g === 'smart') smartDlg(o); }
function proObjInit(){
  const bar = document.createElement('div'); bar.className = 'ctx-bar'; bar.id = 'objBar'; bar.hidden = true; $('#tblBar').after(bar);
  bar.addEventListener('mousedown', e => e.preventDefault());
  bar.addEventListener('click', e => { const b = e.target.closest('[data-ob]'); const o = E.objSel; if (!b || !o) return; const k = b.dataset.ob;
    if (k === 'del') return objDelete(o); if (k === 'dup') return objDuplicate(o); if (k === 'edit') return objEdit(o); objOpen(k, b, o); });
  const tb = $('#tblBar'); tb.insertAdjacentHTML('afterbegin', '<button type="button" class="tb tb-txt" data-t="cell">Cellule…</button><span class="fsep"></span>');
  tb.addEventListener('click', e => { const b = e.target.closest('[data-t="cell"]'); if (b) tblPop(b); }, true);
  sheet().addEventListener('click', objClick);
  sheet().addEventListener('dblclick', e => { const o = e.target.closest('[data-sw-gfx]'); if (o && gfxOf(o) !== 'shape' && !E.ro) objEdit(o); });
}

/* ----- tableaux : fond de cellule, bordures, fusion, alignement ----- */
function tblCells(){ const sel = getSelection(), c = curCell() || E.lastCell; if (!c) return []; const t = c.closest('table');
  if (sel.rangeCount && !sel.isCollapsed){ const r = sel.getRangeAt(0), all = [...t.querySelectorAll('th,td')].filter(x => r.intersectsNode(x)); if (all.length) return all; } return [c]; }
function tblPop(anchor){
  const cells = tblCells(); if (!cells.length) return; const t = cells[0].closest('table');
  openPop(anchor, `<p class="pop-h">Cellule${cells.length > 1 ? 's (' + cells.length + ')' : ''}</p>${swatches('bg', '', '<button type="button" data-c="" class="op-none" title="Sans fond">∅</button>')}
    <p class="pop-h">Alignement</p><div class="op-seg">${[['left', 'Gauche'], ['center', 'Centre'], ['right', 'Droite']].map(([v, n]) => `<button type="button" data-set="ha" data-v="${v}">${n}</button>`).join('')}${[['top', 'Haut'], ['middle', 'Milieu'], ['bottom', 'Bas']].map(([v, n]) => `<button type="button" data-set="va" data-v="${v}">${n}</button>`).join('')}</div>
    <p class="pop-h">Fusion</p><div class="op-seg"><button type="button" data-set="mg" data-v="right">Fusionner à droite</button><button type="button" data-set="mg" data-v="down">Fusionner en bas</button><button type="button" data-set="mg" data-v="split">Scinder</button></div>
    <p class="pop-h">Bordures du tableau</p>${swatches('bc', '')}${rng('bw', 'Épaisseur', 0, 6, parseFloat(t.dataset.swBw) || 1, ' px')}<div class="op-seg"><button type="button" data-set="bs" data-v="all">Toutes</button><button type="button" data-set="bs" data-v="h">Horizontales</button><button type="button" data-set="bs" data-v="out">Extérieur</button><button type="button" data-set="bs" data-v="none">Aucune</button></div>`, p => {
    let bc = '#CBD5E1', bw = parseFloat(t.dataset.swBw) || 1;
    const applyB = mode => { const b = `${bw}px solid ${bc}`; t.dataset.swBw = bw; t.querySelectorAll('th,td').forEach(c => { ['top', 'right', 'bottom', 'left'].forEach(s => c.style.removeProperty('border-' + s)); });
      const rows = [...t.rows]; t.querySelectorAll('th,td').forEach(c => { const set = (s, v) => c.style.setProperty('border-' + s, v);
        if (mode === 'all'){ ['top', 'right', 'bottom', 'left'].forEach(s => set(s, b)); } else if (mode === 'h'){ set('top', b); set('bottom', b); set('left', '0 none'); set('right', '0 none'); }
        else if (mode === 'out'){ const tr = c.parentElement, first = rows[0] === tr, last = rows[rows.length - 1] === tr, fc = tr.firstElementChild === c, lc = tr.lastElementChild === c; first && set('top', b); last && set('bottom', b); fc && set('left', b); lc && set('right', b); }
        else ['top', 'right', 'bottom', 'left'].forEach(s => set(s, '0 none')); }); t.style.borderCollapse = 'collapse'; changed(); };
    popWire(p, (k, v) => {
      if (k === 'bg'){ cells.forEach(c => v ? c.style.setProperty('background-color', v) : c.style.removeProperty('background-color')); changed(); }
      else if (k === 'ha'){ cells.forEach(c => c.style.textAlign = v); changed(); } else if (k === 'va'){ cells.forEach(c => c.style.verticalAlign = v); changed(); }
      else if (k === 'bc'){ bc = v; } else if (k === 'bw'){ bw = v; } else if (k === 'bs') applyB(v);
      else if (k === 'mg'){ const c = cells[0], tr = c.parentElement;
        if (v === 'right'){ const n = c.nextElementSibling; if (n){ c.colSpan = (c.colSpan || 1) + (n.colSpan || 1); c.innerHTML = (c.textContent.trim() ? c.innerHTML + ' ' : '') + (n.textContent.trim() ? n.innerHTML : ''); n.remove(); } }
        else if (v === 'down'){ const nr = tr.nextElementSibling; if (nr){ const i = [...tr.children].indexOf(c), n = nr.children[i]; if (n){ c.rowSpan = (c.rowSpan || 1) + (n.rowSpan || 1); n.remove(); } } }
        else { const cs = c.colSpan || 1; c.colSpan = 1; c.rowSpan = 1; c.removeAttribute('colspan'); c.removeAttribute('rowspan'); for (let i = 1; i < cs; i++){ const n = document.createElement(c.tagName); n.innerHTML = '<br>'; c.after(n); } }
        changed({record:true}); paginate(); }
    });
  }, 'objpop');
}
