/* ---------- Style : effets de texte (WordArt / Canva), typographie, paragraphes, listes, colonnes, équations, notes, commentaires ---------- */
const ST = {tab:'', pc:null, sec:{fx:true, typo:false, para:false, list:false, obj:true}};
const acHex = () => themeVals(E.doc.theme).ac;
const FX = [
  {id:'none', n:'Aucun', p:{}},
  {id:'shadow', n:'Ombre', p:{'text-shadow':'2px 3px 6px rgb(0 0 0 / .35)'}},
  {id:'hard', n:'Ombre dure', p:{'text-shadow':'3px 3px 0 rgb(0 0 0 / .28)'}},
  {id:'lift', n:'Flottant', p:{'text-shadow':'0 10px 14px rgb(0 0 0 / .28)'}},
  {id:'neon', n:'Néon', c:1, p:{color:'#FFFFFF', 'text-shadow':'0 0 4px #fff, 0 0 12px #ff2bd6, 0 0 26px #ff2bd6, 0 0 48px #ff2bd6', 'background-color':'#12091F', padding:'.05em .3em', 'border-radius':'.2em', 'box-decoration-break':'clone', '-webkit-box-decoration-break':'clone'}},
  {id:'neonb', n:'Néon bleu', c:1, p:{color:'#E0F7FF', 'text-shadow':'0 0 4px #fff, 0 0 12px #12B5E5, 0 0 28px #12B5E5, 0 0 50px #2D6BFF', 'background-color':'#07101F', padding:'.05em .3em', 'border-radius':'.2em', 'box-decoration-break':'clone', '-webkit-box-decoration-break':'clone'}},
  {id:'emboss', n:'Relief', c:1, p:{color:'#9A98A8', 'text-shadow':'0 1px 0 #fff, 0 -1px 0 rgb(0 0 0 / .3)'}},
  {id:'engrave', n:'Gravé', c:1, p:{color:'#6B6A78', 'text-shadow':'0 1px 1px rgb(255 255 255 / .9), 0 -1px 0 rgb(0 0 0 / .25)'}},
  {id:'outline', n:'Contour', c:1, p:{color:'transparent', '-webkit-text-stroke':'1.5px #111827'}},
  {id:'outlinec', n:'Contour couleur', c:1, p:{color:'transparent', '-webkit-text-stroke':'1.5px #7B3FF2'}},
  {id:'retro', n:'Rétro 3D', c:1, p:{color:'#FFE066', 'text-shadow':'1px 1px 0 #7B3FF2, 2px 2px 0 #7B3FF2, 3px 3px 0 #7B3FF2, 4px 4px 0 #7B3FF2, 5px 5px 0 #5B21B6'}},
  {id:'echo', n:'Écho', c:1, p:{'text-shadow':'4px 4px 0 rgb(123 63 242 / .5), 8px 8px 0 rgb(123 63 242 / .25)'}},
  {id:'glitch', n:'Glitch', p:{'text-shadow':'2px 0 #ff2d6f, -2px 0 #00e5ff'}},
  {id:'g1', n:'Dégradé prisme', c:1, g:['#7B3FF2', '#12B5E5']}, {id:'g2', n:'Dégradé feu', c:1, g:['#FF7A2F', '#EF476F']}, {id:'g3', n:'Dégradé lagon', c:1, g:['#22D39A', '#12B5E5']},
  {id:'g4', n:'Dégradé soleil', c:1, g:['#F5B82E', '#FF7A2F']}, {id:'g5', n:'Dégradé nuit', c:1, g:['#2D6BFF', '#8B5CF6']}, {id:'g6', n:'Dégradé rose', c:1, g:['#EF476F', '#8B5CF6']},
  {id:'g7', n:'Arc-en-ciel', c:1, g:['#EF476F', '#F5B82E', '#22D39A', '#12B5E5', '#7B3FF2']}, {id:'g8', n:'Métal', c:1, g:['#6B7280', '#E5E7EB', '#6B7280']},
  {id:'marker', n:'Surligneur', p:{'background-image':'linear-gradient(transparent 55%, #FFE066 55%)', padding:'0 .12em'}},
  {id:'markerp', n:'Surligneur rose', p:{'background-image':'linear-gradient(transparent 55%, #FBCFE8 55%)', padding:'0 .12em'}},
  {id:'markerb', n:'Surligneur bleu', p:{'background-image':'linear-gradient(transparent 55%, #BAE6FD 55%)', padding:'0 .12em'}},
  {id:'wavy', n:'Ondulé', p:{'text-decoration':'underline wavy #EF476F', 'text-underline-offset':'.2em'}},
  {id:'pill', n:'Pastille', c:1, p:{color:'#FFFFFF', 'background-color':'#7B3FF2', padding:'.05em .55em', 'border-radius':'999px', 'box-decoration-break':'clone', '-webkit-box-decoration-break':'clone'}},
  {id:'tag', n:'Étiquette claire', c:1, p:{color:'#5B21B6', 'background-color':'#EDE9FE', padding:'.05em .45em', 'border-radius':'.35em', 'box-decoration-break':'clone', '-webkit-box-decoration-break':'clone'}},
  {id:'stamp', n:'Tampon', c:1, p:{color:'#DC2626', border:'2px solid #DC2626', padding:'0 .4em', 'border-radius':'.2em', 'text-transform':'uppercase', 'letter-spacing':'.08em', 'font-weight':'800'}},
];
FX.forEach(f => { if (f.g){ f.p = {'background-image':`linear-gradient(90deg, ${f.g.join(', ')})`, '-webkit-background-clip':'text', 'background-clip':'text', 'color':'transparent', '-webkit-text-fill-color':'transparent'}; } });
const FX_KEYS = ['text-shadow', '-webkit-text-stroke', 'background-image', '-webkit-background-clip', 'background-clip', '-webkit-text-fill-color', 'padding', 'border-radius', 'text-decoration', 'text-underline-offset', 'box-decoration-break', '-webkit-box-decoration-break', 'border', 'background-color'];
const fxPreview = f => Object.entries(f.p).map(([k, v]) => `${k}:${v}`).join(';');

/* applique des propriétés CSS au texte sélectionné (ou au mot sous le curseur) */
function inlineProps(props, fxId){
  if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record();
  const s = getSelection(); if (!s.rangeCount || !inSheet()) return;
  if (s.getRangeAt(0).collapsed){ try { s.modify('move', 'backward', 'word'); s.modify('extend', 'forward', 'word'); } catch(e){} }
  const put = (el, reset) => { if (reset) FX_KEYS.forEach(k => el.style.removeProperty(k)); for (const k in props){ const v = props[k]; if (v === null) el.style.removeProperty(k); else el.style.setProperty(k, v); } };
  if (s.getRangeAt(0).collapsed){
    const span = document.createElement('span'); put(span, !!fxId); span.textContent = '​'; if (fxId && fxId !== 'none') span.dataset.swFx = fxId;
    const r = s.getRangeAt(0); r.insertNode(span); const r2 = document.createRange(); r2.setStart(span.firstChild, 1); r2.collapse(true); s.removeAllRanges(); s.addRange(r2); changed({record:true}); return;
  }
  try { document.execCommand('styleWithCSS', false, true); } catch(e){}
  document.execCommand('hiliteColor', false, MARK);
  $$('span[style]', sheet()).forEach(el => {
    if (el.style.getPropertyValue('background-color') !== MARK_RGB) return;
    const prev = FX.find(f => f.id === el.dataset.swFx); if (prev?.c && fxId) el.style.removeProperty('color');
    el.style.removeProperty('background-color'); put(el, !!fxId); if (fxId){ if (fxId === 'none') el.removeAttribute('data-sw-fx'); else el.dataset.swFx = fxId; }
    if (!el.getAttribute('style')){ const p = el.parentNode; while (el.firstChild) p.insertBefore(el.firstChild, el); el.remove(); }
  });
  changed({record:true}); refreshToolbar();
}
function blockProps(props){
  if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record();
  let bl = selBlocks(); if (!bl.length){ const t = topOf(getSelection().anchorNode); if (t) bl = [t]; }
  bl.forEach(b => { for (const k in props){ if (props[k] === null || props[k] === '') b.style.removeProperty(k); else b.style.setProperty(k, props[k]); } if (!b.getAttribute('style')) b.removeAttribute('style'); });
  changed({record:true});
}
const PARA = {
  none:{'border-top':null, 'border-right':null, 'border-bottom':null, 'border-left':null, background:null, 'background-color':null, padding:null, 'border-radius':null},
  bar:c => ({'border-left':`4px solid ${c}`, padding:'.2em 0 .2em .9em'}), top:c => ({'border-top':`2px solid ${c}`, padding:'.5em 0 0'}), bottom:c => ({'border-bottom':`2px solid ${c}`, padding:'0 0 .5em'}),
  box:c => ({border:`1.5px solid ${c}`, padding:'.6em .9em', 'border-radius':'8px'}), tint:c => ({'background-color':c + '22', padding:'.6em .9em', 'border-radius':'8px'}), dbl:c => ({'border-top':`3px double ${c}`, 'border-bottom':`3px double ${c}`, padding:'.5em 0'}),
  dash:c => ({border:`1.5px dashed ${c}`, padding:'.6em .9em', 'border-radius':'6px'}), shadow:c => ({'background-color':'#fff', 'box-shadow':`0 6px 18px ${c}33`, border:`1px solid ${c}33`, padding:'.7em 1em', 'border-radius':'10px'}),
};
function paraPreset(k){ const c = ST.pc || acHex(); const base = {...PARA.none, 'box-shadow':null, border:null}; blockProps(k === 'none' ? base : {...base, ...PARA[k](c)}); }

/* listes : styles de puces / numéros, multiniveaux */
const LISTS = {
  disc:{t:'ul', n:'• ○ ▪', lv:['disc', 'circle', 'square']}, arrow:{t:'ul', n:'➤ ▸ –', lv:['"➤  "', '"▸  "', '"–  "']}, check:{t:'ul', n:'✓ ✓ ✓', lv:['"✓  "']}, star:{t:'ul', n:'★ ☆ •', lv:['"★  "', '"☆  "', '"•  "']},
  dash:{t:'ul', n:'– – –', lv:['"–  "']}, square:{t:'ul', n:'■ □ ▪', lv:['square', '"□  "', 'disc']},
  num:{t:'ol', n:'1. a. i.', lv:['decimal', 'lower-alpha', 'lower-roman']}, alpha:{t:'ol', n:'A. 1. i.', lv:['upper-alpha', 'decimal', 'lower-roman']}, roman:{t:'ol', n:'I. A. 1.', lv:['upper-roman', 'upper-alpha', 'decimal']},
  zero:{t:'ol', n:'01 02 03', lv:['decimal-leading-zero', 'lower-alpha']}, legal:{t:'ol', n:'1.1.1', lv:['legal']},
};
function listStyle(kind){
  if (E.ro) return; restoreSelIfNeeded(); const L = LISTS[kind]; if (!L) return;
  let li = blockOf(getSelection().anchorNode); let list = li?.closest?.('ul,ol');
  if (!list || !sheet().contains(list)){ cmd(L.t === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'); fixLists(); li = blockOf(getSelection().anchorNode); list = li?.closest?.('ul,ol'); if (!list) return; }
  flushRecord(); record();
  while (list.parentElement?.closest('ul,ol') && sheet().contains(list.parentElement.closest('ul,ol'))) list = list.parentElement.closest('ul,ol');   // la liste racine
  if (list.tagName.toLowerCase() !== L.t){ const n = document.createElement(L.t); [...list.attributes].forEach(a => n.setAttribute(a.name, a.value)); while (list.firstChild) n.appendChild(list.firstChild); list.replaceWith(n); list = n; }
  list.classList.remove('sw-check'); $$('li[data-done]', list).forEach(x => x.removeAttribute('data-done'));
  const depth = (el, root) => { let d = 0, p = el.parentElement; while (p && p !== root.parentElement){ if (/^(UL|OL)$/.test(p.tagName)) d++; p = p.parentElement; } return d; };
  [list, ...$$('ul,ol', list)].forEach(l => { const d = l === list ? 0 : depth(l, list); l.classList.toggle('sw-legal', kind === 'legal');
    if (kind === 'legal') l.style.removeProperty('list-style-type'); else l.style.listStyleType = L.lv[d % L.lv.length];
    if (!l.getAttribute('class')) l.removeAttribute('class'); });
  changed({record:true});
}
function listStart(n){ restoreSelIfNeeded(); const ol = blockOf(getSelection().anchorNode)?.closest?.('ol'); if (!ol) return toast('Placez le curseur dans une liste numérotée'); flushRecord(); record(); n > 1 ? ol.setAttribute('start', n) : ol.removeAttribute('start'); changed({record:true}); }

/* colonnes de texte (Word : Mise en page > Colonnes) */
function textColumns(n, rule){
  if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record();
  let w = blockOf(getSelection().anchorNode)?.closest?.('.sw-tcols');
  if (!w){ if (n < 2) return; const bl = selBlocks().map(b => topOf(b)).filter((x, i, a) => x && a.indexOf(x) === i); const first = bl[0] || topOf(getSelection().anchorNode); if (!first || first.matches('table,.sw-toc,.sw-notes')) return toast('Placez le curseur dans le texte à mettre en colonnes');
    w = document.createElement('div'); w.className = 'sw-tcols'; first.before(w); (bl.length ? bl : [first]).forEach(b => w.appendChild(b)); }
  if (n < 2){ const p = w.parentNode; while (w.firstChild) p.insertBefore(w.firstChild, w); w.remove(); }
  else { w.style.columnCount = n; if (rule !== undefined) w.style.columnRule = rule ? '1px solid #CBD5E1' : ''; if (!w.style.columnGap) w.style.columnGap = '28px'; w.dataset.swCols = n; }
  changed({record:true}); paginate();
}
function dropCap(){ restoreSelIfNeeded(); const b = selBlocks()[0]; if (!b || b.tagName !== 'P') return toast('Placez le curseur dans un paragraphe de texte'); flushRecord(); record(); b.classList.toggle('sw-dropcap'); if (!b.getAttribute('class')) b.removeAttribute('class'); changed({record:true}); }

/* ----- équations ----- */
const EQ_SYM = {alpha:'α', beta:'β', gamma:'γ', delta:'δ', epsilon:'ε', theta:'θ', lambda:'λ', mu:'μ', pi:'π', rho:'ρ', sigma:'σ', tau:'τ', phi:'φ', omega:'ω', Gamma:'Γ', Delta:'Δ', Theta:'Θ', Lambda:'Λ', Sigma:'Σ', Phi:'Φ', Omega:'Ω', Pi:'Π',
  times:'×', cdot:'·', pm:'±', mp:'∓', div:'÷', leq:'≤', geq:'≥', neq:'≠', approx:'≈', equiv:'≡', infty:'∞', to:'→', rightarrow:'→', leftarrow:'←', Rightarrow:'⇒', Leftrightarrow:'⇔', partial:'∂', nabla:'∇', in:'∈', notin:'∉', subset:'⊂', cup:'∪', cap:'∩', forall:'∀', exists:'∃', ldots:'…', degree:'°', angle:'∠', perp:'⊥', parallel:'∥', sqrt3:'∛', hbar:'ħ', prime:'′', propto:'∝', ell:'ℓ'};
const EQ_FN = new Set('sin cos tan cot log ln exp lim max min det dim arcsin arccos arctan sinh cosh tanh'.split(' '));
function eqHtml(src){
  let i = 0; const s = String(src);
  const arg = () => { while (s[i] === ' ') i++; if (s[i] === '{'){ i++; const r = seq('}'); i++; return r; } return atom(true); };
  function atom(noScript){
    const c = s[i++]; let h = '';
    if (c === '{'){ h = seq('}'); i++; }
    else if (c === '\\'){ let m = /^[a-zA-Z]+/.exec(s.slice(i)); let name = m ? m[0] : s[i]; i += name.length;
      if (name === 'frac'){ const a = arg(), b = arg(); h = `<span class="eq-f"><span>${a}</span><span>${b}</span></span>`; }
      else if (name === 'sqrt'){ let n = ''; if (s[i] === '['){ const j = s.indexOf(']', i); n = s.slice(i + 1, j); i = j + 1; } const a = arg(); h = `<span class="eq-r">${n ? `<sup class="eq-n">${escH(n)}</sup>` : ''}<svg class="eq-rs" viewBox="0 0 10 20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 12L2 10.5L5 19L10 0.6" fill="none" stroke="currentColor" stroke-width="1.3" vector-effect="non-scaling-stroke"/></svg><span class="eq-rb">${a}</span></span>`; }
      else if (name === 'text' || name === 'mathrm' || name === 'mbox'){ const a = arg(); h = `<span class="eq-t">${a.replace(/<\/?i>/g, '')}</span>`; }
      else if (name === 'vec' || name === 'bar' || name === 'hat' || name === 'overline'){ const a = arg(); h = `<span class="eq-o eq-${name === 'overline' ? 'bar' : name}">${a}</span>`; }
      else if (name === 'sum' || name === 'prod' || name === 'int' || name === 'oint' || name === 'lim'){
        const sym = {sum:'∑', prod:'∏', int:'∫', oint:'∮', lim:'lim'}[name]; let lo = '', up = '';
        for (let k = 0; k < 2; k++){ if (s[i] === '_'){ i++; lo = arg(); } else if (s[i] === '^'){ i++; up = arg(); } }
        h = name === 'lim' ? `<span class="eq-big eq-lim"><span>lim</span><span>${lo}</span></span>` : `<span class="eq-big${name === 'int' || name === 'oint' ? ' eq-int' : ''}"><span>${up}</span><span class="eq-sym">${sym}</span><span>${lo}</span></span>`; return h;
      }
      else if (name === 'left' || name === 'right'){ h = s[i] === '.' ? (i++, '') : escH(s[i++] || ''); return h; }
      else if (name === 'quad'){ h = '<span class="eq-sp"></span>'; } else if (name === ',' || name === ';' || name === ' ') h = '&nbsp;';
      else if (EQ_FN.has(name)) h = `<span class="eq-t">${name}</span>`;
      else h = EQ_SYM[name] || escH(name);
    }
    else if (/[a-zA-Zα-ωΑ-Ω]/.test(c)) h = `<i>${escH(c)}</i>`;
    else h = escH(c === '*' ? '×' : c === '-' ? '−' : c);
    if (noScript) return h;
    let sup = '', sub = '';
    while (s[i] === '^' || s[i] === '_'){ const k = s[i++]; const a = arg(); if (k === '^') sup = a; else sub = a; }
    if (sup || sub) h += sup && sub ? `<span class="eq-ss"><sup>${sup}</sup><sub>${sub}</sub></span>` : sup ? `<sup>${sup}</sup>` : `<sub>${sub}</sub>`;
    return h;
  }
  function seq(stop){ let h = ''; while (i < s.length && s[i] !== stop){ if (s[i] === '\n'){ i++; h += '<br>'; continue; } h += atom(); } return h; }
  return seq('');
}
function eqPlain(src){
  const SUP = {'0':'⁰', '1':'¹', '2':'²', '3':'³', '4':'⁴', '5':'⁵', '6':'⁶', '7':'⁷', '8':'⁸', '9':'⁹', 'n':'ⁿ', '+':'⁺', '-':'⁻'};
  let s = String(src).replace(/\\([a-zA-Z]+)/g, (m, n) => EQ_SYM[n] || (/^(frac|sqrt|text|mathrm|mbox)$/.test(n) ? m : n));
  for (let k = 0; k < 8; k++) s = s.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/\\sqrt\{([^{}]*)\}/g, '√($1)').replace(/\\(?:text|mathrm|mbox)\{([^{}]*)\}/g, '$1').replace(/\^\{([^{}]*)\}/g, (m, a) => [...a].map(c => SUP[c] || c).join('')).replace(/_\{([^{}]*)\}/g, '_($1)');
  return s.replace(/\^(\w)/g, (m, a) => SUP[a] || '^' + a).replace(/[{}\\]/g, '').replace(/\s+/g, ' ').trim();
}
const EQ_TPL = [['Fraction', '\\frac{a}{b}'], ['Racine', '\\sqrt{x}'], ['Puissance', 'x^{2}'], ['Indice', 'x_{n}'], ['Somme', '\\sum_{i=1}^{n} i'], ['Intégrale', '\\int_{0}^{1} f(x)\\,dx'], ['Limite', '\\lim_{x \\to 0} \\frac{\\sin x}{x}'], ['Quadratique', 'x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}'], ['Pythagore', 'a^{2} + b^{2} = c^{2}'], ['Euler', 'e^{i\\pi} + 1 = 0']];
function eqSpan(src, block){ return `<span class="sw-eq${block ? ' blk' : ''}" contenteditable="false" data-sw-eq="${escH(src)}">${eqHtml(src)}</span>`; }
function eqDlg(el){
  const src0 = el?.dataset.swEq || 'x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}', blk0 = el?.classList.contains('blk') ?? true;
  SWDlg.open(`<h3>${el ? 'Modifier l\'équation' : 'Insérer une équation'}</h3><form id="eqF" class="gfx-dlg">
    <div class="gd-types">${EQ_TPL.map(([n, v], i) => `<button type="button" data-eq="${i}">${n}</button>`).join('')}</div>
    <label class="ap-field"><span>Formule <small>écriture LaTeX simplifiée : \\frac{a}{b}, \\sqrt{x}, x^{2}, x_{i}, \\sum, \\int, \\alpha, \\pi, \\leq…</small></span><textarea id="eqS" rows="3" spellcheck="false">${escH(src0)}</textarea></label>
    <label class="gd-ck"><input type="checkbox" id="eqB"${blk0 ? ' checked' : ''}> Équation centrée sur sa propre ligne</label><div class="gd-prev eq-prev swdoc" id="eqP" style="${themeCss(E.doc.theme)}"></div>
    <div class="dlg-acts">${el ? '<button type="button" class="ap-btn alt" id="eqDel">Supprimer</button>' : ''}<button type="button" class="ap-btn alt" data-dlg="close">Annuler</button><button class="ap-btn" type="submit">${el ? 'Enregistrer' : 'Insérer'}</button></div></form>`, d => {
    const prev = () => { $('#eqP', d).innerHTML = `<span class="sw-eq blk">${eqHtml($('#eqS', d).value) || '<small style="color:#94a3b8">Aperçu</small>'}</span>`; };
    d.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { const t = $('#eqS', d); t.value = EQ_TPL[+b.dataset.eq][1]; prev(); }); $('#eqS', d).addEventListener('input', prev); prev();
    if (el) $('#eqDel', d).onclick = () => { SWDlg.close(); flushRecord(); record(); const p = el.parentElement; el.remove(); if (p && !p.textContent.trim() && !p.querySelector('img,svg') && p.tagName === 'P' && p.children.length === 0) p.innerHTML = '<br>'; changed({record:true}); };
    $('#eqF', d).onsubmit = e => { e.preventDefault(); const v = $('#eqS', d).value.trim(); if (!v) return; const blk = $('#eqB', d).checked; SWDlg.close();
      if (el && sheet().contains(el)){ flushRecord(); record(); el.dataset.swEq = v; el.innerHTML = eqHtml(v); el.classList.toggle('blk', blk); changed({record:true}); }
      else if (blk) insertHTMLBlock(`<p style="text-align:center">${eqSpan(v, true)}</p>`); else insertInlineHtml(eqSpan(v, false) + '&nbsp;'); };
  }, 'wide');
}

/* ----- notes de bas de page (regroupées en fin de document, numérotées automatiquement) ----- */
function fnDlg(el){
  SWDlg.open(`<h3>${el ? 'Modifier la note' : 'Note de bas de page'}</h3><form id="fnF"><label class="ap-field"><span>Texte de la note</span><span class="ap-in"><textarea id="fnT" rows="3" maxlength="600">${escH(el?.dataset.swFn || '')}</textarea></span></label>
    <div class="dlg-acts">${el ? '<button type="button" class="ap-btn alt" id="fnDel">Supprimer la note</button>' : ''}<button type="button" class="ap-btn alt" data-dlg="close">Annuler</button><button class="ap-btn" type="submit">${el ? 'Enregistrer' : 'Insérer'}</button></div></form>`, d => {
    if (el) $('#fnDel', d).onclick = () => { SWDlg.close(); flushRecord(); record(); el.remove(); changed({record:true}); };
    $('#fnF', d).onsubmit = e => { e.preventDefault(); const v = $('#fnT', d).value.trim(); if (!v) return; SWDlg.close();
      if (el && sheet().contains(el)){ flushRecord(); record(); el.dataset.swFn = v; el.title = v; changed({record:true}); } else insertInlineHtml(`<sup class="sw-fn" contenteditable="false" data-sw-fn="${escH(v)}" title="${escH(v)}"></sup>&#8203;`); };
  });
}
function updateNotes(){
  const S = sheet(), fns = $$('.sw-fn', S); let blk = S.querySelector(':scope > .sw-notes');
  if (!fns.length){ blk?.remove(); return; }
  const sig = fns.map(f => f.dataset.swFn).join('\u0001');
  if (!blk){ blk = document.createElement('div'); blk.className = 'sw-notes'; blk.setAttribute('contenteditable', 'false'); blk.dataset.sw = 'notes'; S.appendChild(blk); }
  else if (blk.nextElementSibling) S.appendChild(blk);
  if (blk.dataset.swSig !== sig){ blk.dataset.swSig = sig; blk.innerHTML = `<p class="sw-notes-t">Notes</p><ol>${fns.map(f => `<li>${escH(f.dataset.swFn)}</li>`).join('')}</ol>`; }
}

/* ----- commentaires ----- */
const whoAmI = () => ($('#umName')?.textContent || 'Moi').trim().slice(0, 40);
function commentDlg(cm){
  const s = getSelection(); if (!cm && (!s.rangeCount || s.isCollapsed)) return toast('Sélectionnez d\'abord le texte à commenter');
  SWDlg.open(`<h3>${cm ? 'Commentaire' : 'Nouveau commentaire'}</h3>${cm ? `<p class="dlg-p">${escH(cm.dataset.swBy || '')} · ${new Date(cm.dataset.swAt || Date.now()).toLocaleString('fr-FR', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'})}</p>` : ''}
    <form id="cmF"><label class="ap-field"><span>Votre remarque</span><span class="ap-in"><textarea id="cmT" rows="3" maxlength="500">${escH(cm?.dataset.swNote || '')}</textarea></span></label>
    <div class="dlg-acts">${cm ? '<button type="button" class="ap-btn alt" id="cmDel">Supprimer</button><button type="button" class="ap-btn alt" id="cmOk">' + (cm.dataset.swSt === 'done' ? 'Rouvrir' : 'Résoudre') + '</button>' : ''}<button type="button" class="ap-btn alt" data-dlg="close">Annuler</button><button class="ap-btn" type="submit">Enregistrer</button></div></form>`, d => {
    if (cm){ $('#cmDel', d).onclick = () => { SWDlg.close(); cmRemove(cm); }; $('#cmOk', d).onclick = () => { SWDlg.close(); flushRecord(); record(); cm.dataset.swSt = cm.dataset.swSt === 'done' ? 'open' : 'done'; changed({record:true}); panelRefresh(); }; }
    $('#cmF', d).onsubmit = e => { e.preventDefault(); const v = $('#cmT', d).value.trim(); if (!v) return; SWDlg.close(); restoreSel(); if (!cm && getSelection().isCollapsed) return toast('Sélectionnez d\'abord le texte à commenter'); flushRecord(); record();
      if (cm){ cm.dataset.swNote = v; cm.title = v; } else { restoreSel(); const sp = document.createElement('span'); sp.className = 'sw-cm'; sp.dataset.swCm = uidS(); sp.dataset.swNote = v; sp.dataset.swBy = whoAmI(); sp.dataset.swAt = new Date().toISOString(); sp.dataset.swSt = 'open'; sp.title = v;
        const r = getSelection().getRangeAt(0); try { r.surroundContents(sp); } catch(x){ document.execCommand('styleWithCSS', false, true); document.execCommand('hiliteColor', false, MARK); $$('span[style]', sheet()).forEach(el => { if (el.style.getPropertyValue('background-color') === MARK_RGB){ el.removeAttribute('style'); el.className = 'sw-cm'; Object.assign(el.dataset, {swCm:uidS(), swNote:v, swBy:whoAmI(), swAt:new Date().toISOString(), swSt:'open'}); el.title = v; } }); } }
      changed({record:true}); panelRefresh(); };
  });
}
function cmRemove(cm){ flushRecord(); record(); const p = cm.parentNode; while (cm.firstChild) p.insertBefore(cm.firstChild, cm); cm.remove(); changed({record:true}); panelRefresh(); }
function commentsHtml(){
  const cms = $$('.sw-cm', sheet()); if (!cms.length) return `<h4 class="pn-h">Commentaires</h4><p class="pn-hint">Sélectionnez du texte puis « Commentaire » (Insérer, Objets) pour laisser une remarque.</p>`;
  return `<h4 class="pn-h">Commentaires <small>${cms.length}</small></h4><div class="cm-list">${cms.map((c, i) => `<div class="cm${c.dataset.swSt === 'done' ? ' done' : ''}"><button type="button" data-cmgo="${i}"><em>« ${escH(c.textContent.slice(0, 50))} »</em><span>${escH(c.dataset.swNote || '')}</span><small>${escH(c.dataset.swBy || '')}${c.dataset.swSt === 'done' ? ' · résolu' : ''}</small></button><button type="button" class="cm-x" data-cmdel="${i}" aria-label="Supprimer">×</button></div>`).join('')}</div>`;
}

/* ----- raccourcis d'objets ----- */
const OBJ_ITEMS = [
  {id:'shapes', n:'Formes', d:'50 formes à colorier', ic:'<svg viewBox="0 0 24 24"><path d="M12 3l3 6 6 1-4.5 4.4L18 21l-6-3-6 3 1.5-6.6L3 10l6-1z"/></svg>', run:shapesDlg},
  {id:'chart', n:'Graphique', d:'Barres, courbes, camembert…', ic:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>', run:() => chartDlg()},
  {id:'smart', n:'Schéma', d:'Processus, cycle, pyramide…', ic:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="4" width="6" height="5" rx="1"/><rect x="9" y="15" width="6" height="5" rx="1"/><path d="M6 9v3h12V9M12 12v3"/></svg>', run:() => smartDlg()},
  {id:'eq', n:'Équation', d:'Fractions, racines, sommes…', ic:'<svg viewBox="0 0 24 24"><path d="M5 9h14M5 15h14M9 4l-3 16"/></svg>', run:() => eqDlg()},
  {id:'fn', n:'Note de bas de page', d:'Numérotée automatiquement', ic:'<svg viewBox="0 0 24 24"><path d="M5 5h10M5 10h14M5 20h8M5 17h14"/></svg>', run:() => fnDlg()},
  {id:'cm', n:'Commentaire', d:'Sur le texte sélectionné', ic:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>', run:() => commentDlg()},
  {id:'drop', n:'Lettrine', d:'Grande initiale', ic:'<svg viewBox="0 0 24 24"><path d="M5 20 9 5l4 15M6.5 15h5M16 8h4M16 13h4M16 18h4"/></svg>', run:dropCap},
  {id:'cols', n:'Colonnes de texte', d:'Texte sur 2 ou 3 colonnes', ic:'<svg viewBox="0 0 24 24"><path d="M4 5h7v14H4zM13 5h7v14h-7z"/></svg>', run:() => textColumns(2, 1)},
  {id:'tbox', n:'Zone de texte', d:'Cadre libre, fond et bordure', ic:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke-dasharray="3 2"/><path d="M8 10h8M8 14h5"/></svg>', run:() => insertHTMLBlock(`<div class="sw-textbox" data-sw-bg="#FFF8E1||135" data-sw-bd="2|dashed|#F5B82E|all" style="background:#FFF8E1;border:2px dashed #F5B82E"><p><b>Zone de texte</b></p><p>Écrivez ici. Fond, bordure, ombre et arrondi se règlent depuis la barre au-dessus.</p></div>`)},
  {id:'icons', n:'Icônes', d:'Pictogrammes à colorier', ic:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 13l3 3 5-6"/></svg>', run:() => iconsDlg()},
];
const ICONS = [['Maison', 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10'], ['Utilisateur', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0'], ['Courrier', 'M3 6h18v12H3zM3 7l9 7 9-7'], ['Téléphone', 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
  ['Localisation', 'M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'], ['Calendrier', 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4'], ['Horloge', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2'], ['Coche', 'M5 12l5 5 9-10'],
  ['Cloche', 'M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4'], ['Cadenas', 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4'], ['Engrenage', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'], ['Ampoule', 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z'],
  ['Cible', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5a.5.5 0 1 0 0 1'], ['Fusée', 'M12 2c4 2 6 6 6 10l-3 3H9l-3-3c0-4 2-8 6-10zM9 15l-3 5 4-2M15 15l3 5-4-2M12 9a1.5 1.5 0 1 0 0 .01'], ['Graphique', 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6'], ['Document', 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5'],
  ['Mondial', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18'], ['Clé', 'M14 10a4 4 0 1 1-1-2.6L21 15v3h-3v-2h-2v-2h-2l-1.4-1.4'], ['Outils', 'M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0-2-2zM17 3v3h3'], ['Bouclier', 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z'],
  ['Cœur', 'M12 20S4 14 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5C20 14 12 20 12 20z'], ['Étoile', 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9z'], ['Soleil', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19'], ['Euro', 'M17 6a7 7 0 1 0 0 12M4 10h10M4 14h10'], ['Chantier', 'M3 21h18M6 21V9l6-6 6 6v12M10 21v-6h4v6'], ['Règle', 'M3 15L15 3l6 6L9 21zM7 11l2 2M10 8l2 2M13 5l2 2'], ['Panneau', 'M12 3l10 18H2zM12 10v5M12 18v.5'], ['Camion', 'M2 6h12v10H2zM14 9h4l3 3v4h-7zM6 18.5a1.5 1.5 0 1 0 0 .01M17 18.5a1.5 1.5 0 1 0 0 .01']];
function iconSvg(d, c = '#7B3FF2', sw = 1.8){ return `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`; }
function iconsDlg(){
  SWDlg.open(`<h3>Icônes</h3><p class="dlg-p">Une icône s'insère dans le texte, à la taille de la ligne. Colorez-la ensuite comme un texte (couleur) ou agrandissez-la (taille).</p><div class="shape-grid icon-grid">${ICONS.map(([n, d], i) => `<button type="button" data-ic="${i}" title="${n}" aria-label="${n}">${iconSvg(d, acHex())}</button>`).join('')}</div>`, d => {
    d.querySelectorAll('[data-ic]').forEach(b => b.onclick = () => { SWDlg.close(); const [n, p] = ICONS[+b.dataset.ic]; insertInlineHtml(`<span class="sw-ico" contenteditable="false" role="img" aria-label="${escH(n)}">${iconSvg(p, acHex())}</span>&nbsp;`); });
  }, 'wide');
}

/* ----- panneau « Style » ----- */
const sec = (k, t, body) => `<details class="st-sec" data-sec="${k}"${ST.sec[k] ? ' open' : ''}><summary>${t}</summary><div class="st-body">${body}</div></details>`;
const stSw = (k, cur) => swatches(k, cur || '');
function renderStylePanel(P){
  const ac = acHex(), pc = ST.pc || ac;
  const fxGrid = `<div class="fx-grid">${FX.map(f => `<button type="button" data-fx="${f.id}" title="${escH(f.n)}"><span class="fx-ab" style="${fxPreview(f)}${f.p.color === '#FFFFFF' || f.p.color === '#E0F7FF' ? '' : ''}">Abc</span><small>${escH(f.n)}</small></button>`).join('')}</div><p class="pn-hint">Sélectionnez du texte (ou placez le curseur dans un mot), puis cliquez sur un effet.</p>`;
  const typo = `<div class="st-row">${[['up', 'MAJUSCULES'], ['low', 'minuscules'], ['cap', 'Initiales'], ['sc', 'Petites caps'], ['none', 'Normal']].map(([k, n]) => `<button type="button" class="st-btn" data-case="${k}">${n}</button>`).join('')}</div>
    <div class="st-row"><button type="button" class="st-btn" data-sup="superscript">x²  Exposant</button><button type="button" class="st-btn" data-sup="subscript">x₂  Indice</button><button type="button" class="st-btn" data-sup="strikeThrough">S̶  Barré</button></div>
    ${rng('ls', 'Espacement des lettres', -3, 40, 0, '', 1)}<p class="pop-h">Soulignement</p><div class="st-row">${[['solid', 'Simple'], ['double', 'Double'], ['dotted', 'Points'], ['dashed', 'Tirets'], ['wavy', 'Ondulé'], ['none', 'Aucun']].map(([k, n]) => `<button type="button" class="st-btn" data-ul="${k}">${n}</button>`).join('')}</div>${stSw('ulc', '')}
    <p class="pop-h">Graisse</p><div class="st-row">${[[300, 'Fin'], [400, 'Normal'], [500, 'Moyen'], [600, 'Demi-gras'], [700, 'Gras'], [800, 'Extra'], [900, 'Noir']].map(([k, n]) => `<button type="button" class="st-btn" data-w="${k}" style="font-weight:${k}">${n}</button>`).join('')}</div>
    ${rng('fsz', 'Échelle de la taille', 50, 300, 100, ' %', 5)}${rng('tr', 'Transparence du texte', 10, 100, 100, ' %', 5)}`;
  const para = `<p class="pop-h">Cadre du paragraphe</p><div class="st-row">${[['none', 'Aucun'], ['bar', 'Barre'], ['top', 'Filet haut'], ['bottom', 'Filet bas'], ['dbl', 'Double filet'], ['box', 'Encadré'], ['dash', 'Pointillé'], ['tint', 'Fond teinté'], ['shadow', 'Carte']].map(([k, n]) => `<button type="button" class="st-btn" data-pp="${k}">${n}</button>`).join('')}</div><p class="pop-h">Couleur du cadre</p>${stSw('pc', pc)}
    <p class="pop-h">Fond du paragraphe</p>${stSw('pbg', '')}
    ${rng('ind1', 'Retrait de première ligne', 0, 30, 0, ' mm')}${rng('indl', 'Retrait gauche', 0, 60, 0, ' mm')}${rng('indr', 'Retrait droit', 0, 60, 0, ' mm')}${rng('spb', 'Espace avant', 0, 60, 0, ' px')}${rng('spa', 'Espace après', 0, 60, 12, ' px')}${rng('lh', 'Interligne', 1, 3, 1.5, '', .05)}
    <p class="pop-h">Alignement</p><div class="st-row">${[['justifyLeft', 'Gauche'], ['justifyCenter', 'Centre'], ['justifyRight', 'Droite'], ['justifyFull', 'Justifié']].map(([k, n]) => `<button type="button" class="st-btn" data-cmd2="${k}">${n}</button>`).join('')}</div>
    <div class="st-row"><button type="button" class="st-btn" data-act2="drop">Lettrine</button><button type="button" class="st-btn" data-act2="hyph">Césure auto</button><button type="button" class="st-btn" data-act2="keep">Garder ensemble</button><button type="button" class="st-btn" data-act2="clr">Effacer le cadre</button></div>
    <p class="pop-h">Colonnes de texte</p><div class="st-row">${[1, 2, 3, 4].map(n => `<button type="button" class="st-btn" data-col="${n}">${n === 1 ? 'Une' : n + ' colonnes'}</button>`).join('')}<button type="button" class="st-btn" data-colr="1">Avec filet</button></div>`;
  const lists = `<div class="st-row lst">${Object.entries(LISTS).map(([k, l]) => `<button type="button" class="st-btn" data-ls="${k}" title="${l.t === 'ul' ? 'Puces' : 'Numéros'}">${l.n}</button>`).join('')}</div>${rng('lstart', 'Commencer à', 1, 50, 1)}<p class="pn-hint">Les niveaux imbriqués (Tab) prennent automatiquement le style suivant : 1. a. i. ou 1.1.1 pour le plan juridique.</p>`;
  const o = E.objSel && E.objSel.isConnected && sheet().contains(E.objSel) ? E.objSel : null;
  const obj = o ? ['fill', 'stroke', 'shadow', 'fx', 'size'].map(k => `<div class="st-obj" data-op="${k}"><p class="pop-h">${OP[k].t}</p>${OP[k].build(o)}</div>`).join('') + (gfxOf(o) && gfxOf(o) !== 'shape' ? '<button type="button" class="pn-wide" data-oedit="1">Modifier les données…</button>' : '') : `<p class="pn-hint">Cliquez sur une forme, un graphique, une carte ou un encadré de la page : ses réglages (fond, dégradé, bordure, ombre, arrondi, taille) s'affichent ici et dans la barre au-dessus.</p>`;
  P.innerHTML = `<div class="st-wrap">${sec('fx', 'Effets de texte', fxGrid)}${sec('typo', 'Typographie', typo)}${sec('para', 'Paragraphe et colonnes', para)}${sec('list', 'Listes à plusieurs niveaux', lists)}${sec('obj', o ? 'Objet sélectionné' : 'Objet (forme, bloc, carte)', obj)}</div>`;
  if (o) $$('.st-obj', P).forEach(w => { OP[w.dataset.op].wire(w, o); });
}
let _lastObjPanel = null;
function stylePanelObjChanged(){ if (panel !== 'style' || E.objSel === _lastObjPanel) return; _lastObjPanel = E.objSel; if (!$('#edPanelBody').contains(document.activeElement)) renderPanel(); }
function stylePanelWire(){
  const PB = $('#edPanelBody');
  PB.addEventListener('mousedown', e => { if (panel === 'style' && !e.target.closest('input,select,textarea,summary')) e.preventDefault(); });
  PB.addEventListener('toggle', e => { const d = e.target.closest?.('.st-sec'); if (d) ST.sec[d.dataset.sec] = d.open; }, true);
  PB.addEventListener('click', e => {
    const t = e.target; if (panel === 'style'){
      let b;
      if ((b = t.closest('[data-fx]'))){ const f = FX.find(x => x.id === b.dataset.fx); return inlineProps(f.p, f.id); }
      if ((b = t.closest('[data-case]'))){ const k = b.dataset.case; return inlineProps({'text-transform':{up:'uppercase', low:'lowercase', cap:'capitalize', none:null, sc:null}[k], 'font-variant':k === 'sc' ? 'small-caps' : null}); }
      if ((b = t.closest('[data-sup]'))){ restoreSel(); return cmd(b.dataset.sup); }
      if ((b = t.closest('[data-ul]'))){ const k = b.dataset.ul; return inlineProps(k === 'none' ? {'text-decoration':null} : {'text-decoration':`underline ${k} ${ST.ulc || 'currentColor'}`, 'text-underline-offset':'.15em'}); }
      if ((b = t.closest('[data-w]'))) return inlineProps({'font-weight':b.dataset.w});
      if ((b = t.closest('[data-pp]'))) return paraPreset(b.dataset.pp);
      if ((b = t.closest('[data-cmd2]'))){ restoreSel(); return cmd(b.dataset.cmd2); }
      if ((b = t.closest('[data-act2]'))){ const k = b.dataset.act2; if (k === 'drop') return dropCap(); if (k === 'hyph') return blockProps({hyphens:'auto', '-webkit-hyphens':'auto', 'text-align':'justify'}); if (k === 'keep') return blockProps({'break-inside':'avoid'}); if (k === 'clr') return paraPreset('none'); }
      if ((b = t.closest('[data-col]'))) return textColumns(+b.dataset.col);
      if ((b = t.closest('[data-colr]'))) return textColumns(2, 1);
      if ((b = t.closest('[data-ls]'))) return listStyle(b.dataset.ls);
      if ((b = t.closest('[data-oedit]'))) return objEdit(E.objSel);
      if ((b = t.closest('.op-sw [data-c]')) && !b.closest('.st-obj')){ const k = b.closest('.op-sw').dataset.k, v = b.dataset.c; if (k === 'pc'){ ST.pc = v; $$('.op-sw[data-k="pc"] [data-c]', PB).forEach(x => x.classList.toggle('on', x === b)); } else if (k === 'pbg') blockProps({'background-color':v, padding:'.4em .7em', 'border-radius':'6px'}); else if (k === 'ulc') ST.ulc = v; return; }
    }
    let c = t.closest('[data-cmgo]'); if (c){ const el = $$('.sw-cm', sheet())[+c.dataset.cmgo]; if (el){ el.scrollIntoView({behavior:'smooth', block:'center'}); commentDlg(el); } return; }
    c = t.closest('[data-cmdel]'); if (c){ const el = $$('.sw-cm', sheet())[+c.dataset.cmdel]; if (el) cmRemove(el); return; }
    c = t.closest('[data-obj]'); if (c){ restoreSel(); OBJ_ITEMS.find(x => x.id === c.dataset.obj)?.run(); return; }
  });
  PB.addEventListener('input', e => {
    if (panel !== 'style') return; const i = e.target, k = i.dataset?.r; if (!k || i.closest('.st-obj')) return; const v = +i.value;
    const o = i.parentElement.querySelector('output'); if (o) o.textContent = v + (i.dataset.u || '');
    if (k === 'ind1') blockProps({'text-indent':v ? v + 'mm' : null}); else if (k === 'indl') blockProps({'margin-left':v ? v + 'mm' : null}); else if (k === 'indr') blockProps({'margin-right':v ? v + 'mm' : null});
    else if (k === 'spb') blockProps({'margin-top':v ? v + 'px' : null}); else if (k === 'spa') blockProps({'margin-bottom':v + 'px'}); else if (k === 'lh') blockProps({'line-height':String(v)}); else if (k === 'lstart') listStart(v);
  });
  PB.addEventListener('change', e => {
    if (panel !== 'style') return; const i = e.target, k = i.dataset?.r; if (!k || i.closest('.st-obj')) return; const v = +i.value;
    if (k === 'ls') inlineProps({'letter-spacing':v ? (v / 100) + 'em' : null}); else if (k === 'fsz') inlineProps({'font-size':v === 100 ? null : v + '%'}); else if (k === 'tr') inlineProps({opacity:v >= 100 ? null : String(v / 100)});
  });
}

/* ----- feuille de style du document pour tous ces éléments (page, PDF, export web) ----- */
DOC_CSS += `
.swdoc .sw-obj{position:relative;margin:1em auto;max-width:100%;box-sizing:border-box}
.swdoc .sw-obj[data-sw-gfx="shape"]{line-height:1.25}
.swdoc .sw-obj-s{position:absolute;inset:0}
.swdoc .sw-obj-s svg{width:100%;height:100%;display:block;overflow:visible}
.swdoc .sw-obj[data-sw-gfx="chart"] svg,.swdoc .sw-obj[data-sw-gfx="smart"] svg{width:100%;height:auto;display:block}
.swdoc .sw-obj-t{position:absolute;inset:9%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;font-weight:600;overflow:visible;z-index:1;min-width:0}
.swdoc .sw-obj-t>*{margin:0;max-width:100%}
.swdoc [data-sw-align="center"]{margin-left:auto;margin-right:auto}
.swdoc [data-sw-align="left"]{margin-left:0;margin-right:auto}
.swdoc [data-sw-align="right"]{margin-left:auto;margin-right:0}
.swdoc [data-sw-align="floatl"]{float:left;margin:.2em 1.4em .8em 0}
.swdoc [data-sw-align="floatr"]{float:right;margin:.2em 0 .8em 1.4em}
.swdoc .sw-textbox{padding:14px 18px;border-radius:12px;margin:1em 0;break-inside:avoid}
.swdoc .sw-textbox>:last-child{margin-bottom:0}
.swdoc .sw-tcols{column-count:2;column-gap:28px;margin:0 0 .75em}
.swdoc .sw-tcols>*{break-inside:avoid-column}
.swdoc .sw-tcols>p{break-inside:auto}
.swdoc .sw-dropcap::first-letter{float:left;font-family:var(--fh);font-weight:800;font-size:3.6em;line-height:.82;padding:.07em .1em 0 0;color:var(--ac)}
.swdoc ol.sw-legal,.swdoc ol.sw-legal ol{list-style:none;counter-reset:lg;padding-left:0}
.swdoc ol.sw-legal ol{padding-left:1.8em}
.swdoc ol.sw-legal li{counter-increment:lg;position:relative;padding-left:2.4em}
.swdoc ol.sw-legal li::before{content:counters(lg,".") ".";position:absolute;left:0;font-weight:700;color:var(--ac)}
.swdoc{counter-reset:swfn}
.swdoc .sw-fn{counter-increment:swfn;font-size:.75em;vertical-align:super;line-height:0;color:var(--ac);font-weight:700;cursor:pointer;padding:0 .1em}
.swdoc .sw-fn::after{content:counter(swfn)}
.swdoc .sw-notes{margin-top:2em;padding-top:.8em;border-top:1px solid var(--line);font-size:.82em;color:var(--mut)}
.swdoc .sw-notes ol{margin:.3em 0 0;padding-left:1.4em}.swdoc .sw-notes-t{font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:.8em;margin:0}
.swdoc .sw-cm{background:rgb(255 214 64 / .38);border-bottom:2px solid #F5B82E;cursor:pointer}
.swdoc .sw-cm[data-sw-st="done"]{background:rgb(120 200 150 / .2);border-bottom-color:#22D39A}
.swdoc .sw-ico{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.25em}
.swdoc .sw-ico svg{width:100%;height:100%;display:block}
.swdoc .sw-eq{font-family:'Cambria Math','STIX Two Math','Latin Modern Math','Times New Roman',serif;font-size:1.12em;white-space:nowrap;display:inline-block;vertical-align:middle;line-height:1.4}
.swdoc .sw-eq.blk{font-size:1.4em}
.swdoc .sw-eq i{font-style:italic}
.swdoc .sw-eq sup,.swdoc .sw-eq sub{font-size:.7em;line-height:0}
.swdoc .eq-f{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;margin:0 .15em}
.swdoc .eq-f>span:first-child{border-bottom:1.5px solid currentColor;padding:0 .2em .08em}.swdoc .eq-f>span:last-child{padding:.08em .2em 0}
.swdoc .eq-r{display:inline-flex;align-items:stretch;vertical-align:middle}.swdoc .eq-rs{width:.75em;height:auto;align-self:stretch;margin-top:.12em;overflow:visible}
.swdoc .eq-rb{border-top:1.4px solid currentColor;padding:0 .15em 0 .05em;margin-top:.12em}.swdoc .eq-n{align-self:flex-start;margin-right:-.4em}
.swdoc .eq-ss{display:inline-grid;grid-template-rows:auto auto;line-height:1}.swdoc .eq-ss sup,.swdoc .eq-ss sub{vertical-align:baseline;display:block}
.swdoc .eq-big{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .2em;font-size:.95em}.swdoc .eq-sym{font-size:1.9em;line-height:1}.swdoc .eq-big>span:not(.eq-sym){font-size:.62em;line-height:1.1}
.swdoc .eq-int .eq-sym{font-size:2.1em}.swdoc .eq-lim>span:first-child{font-size:1em}
.swdoc .eq-t{font-style:normal}.swdoc .eq-sp{display:inline-block;width:1.5em}
.swdoc .eq-bar,.swdoc .eq-vec,.swdoc .eq-hat{display:inline-block;position:relative}.swdoc .eq-bar{border-top:1.2px solid currentColor}.swdoc .eq-vec::before,.swdoc .eq-hat::before{position:absolute;top:-.55em;left:0;right:0;text-align:center;font-size:.8em;line-height:1}.swdoc .eq-vec::before{content:"→"}.swdoc .eq-hat::before{content:"^"}
@media print{.swdoc .sw-cm{background:none!important;border:0!important}}
`;

OBJ_ITEMS.forEach(o => SLASH_BASE.push({t:o.n, k:o.n + ' ' + o.d + ' ' + o.id, ic:'✦', run:o.run}));

/* ----- page : bordures, fonds à motif, marges personnalisées ----- */
const PG_PAT = {
  lines:['repeating-linear-gradient(transparent 0 31px, rgb(120 130 170 / .28) 31px 32px)', ''], grid:['linear-gradient(rgb(120 130 170 / .2) 1px, transparent 1px), linear-gradient(90deg, rgb(120 130 170 / .2) 1px, transparent 1px)', '24px 24px'],
  dots:['radial-gradient(rgb(120 130 170 / .42) 1.3px, transparent 1.6px)', '22px 22px'], g1:['linear-gradient(160deg, #ffffff 30%, #EFE4FF)', ''], g2:['linear-gradient(160deg, #ffffff 40%, #DDF1FF)', ''], g3:['linear-gradient(135deg, #FFF7ED, #FDE9A8)', ''], g4:['linear-gradient(160deg, #ffffff 40%, #D9F8EA)', ''], g5:['linear-gradient(160deg, #FFF1F5 0%, #ffffff 60%)', ''],
};
const PG_BORDERS = [['', 'Aucune'], ['thin', 'Filet'], ['double', 'Double'], ['thick', 'Épaisse'], ['dashed', 'Tirets'], ['dotted', 'Points'], ['round', 'Arrondie'], ['frame', 'Cadre chic']];
function pageBgx(p){ const x = PG_PAT[p.bgx]; return x ? `;background-image:${x[0]};${x[1] ? `background-size:${x[1]}` : ''}` : ''; }
function pageBorder(p){
  const k = p.pb; if (!k) return ''; const c = escH(p.pbc || '#7B3FF2'), inset = Math.max(6, +p.pbi || 10) * MM / 2.5;
  const st = {thin:`1.5px solid ${c}`, double:`4px double ${c}`, thick:`6px solid ${c}`, dashed:`2px dashed ${c}`, dotted:`3px dotted ${c}`, round:`2px solid ${c};border-radius:22px`, frame:`3px double ${c};outline:1.5px solid ${c};outline-offset:5px`}[k];
  return st ? `<div class="pg-bd" style="position:absolute;inset:${inset.toFixed(0)}px;border:${st};pointer-events:none"></div>` : '';
}
function pageExtrasHtml(){
  const p = E.doc.page, mm = p.margins === 'custom' && Array.isArray(p.mm) ? p.mm : MARGINS[p.margins] || MARGINS.normal;
  return `<div class="pg-extra"><div class="pgf"><span>Fond à motif</span><div class="pg-bgx">${[['', 'Aucun', 'none'], ...Object.entries(PG_PAT).map(([k, v]) => [k, k, v])].map(([k, n, v]) => `<button type="button" data-pgx="${k}" aria-pressed="${(p.bgx || '') === k}" title="${{'':'Aucun', lines:'Lignes', grid:'Quadrillé', dots:'Points'}[k] || 'Dégradé'}" style="${v === 'none' ? '' : `background-image:${v[0]};${v[1] ? `background-size:${v[1].split(' ').map(x => (parseInt(x) / 2) + 'px').join(' ')}` : ''}`}">${k === '' ? '∅' : ''}</button>`).join('')}</div></div>
    <div class="pgf"><span>Bordure de page</span>${seg('pb', p.pb || '', PG_BORDERS)}<div class="op-sw" data-k="pbc" style="margin-top:8px">${['#7B3FF2', '#2D6BFF', '#12B5E5', '#22D39A', '#F5B82E', '#FF7A2F', '#EF476F', '#111827'].map(c => `<button type="button" data-c="${c}" style="background:${c}" class="${(p.pbc || '#7B3FF2') === c ? 'on' : ''}"></button>`).join('')}</div></div>
    <div class="pgf"><span>Marges personnalisées <small>haut · droite · bas · gauche, en mm</small></span><div class="pg-mm">${['Haut', 'Droite', 'Bas', 'Gauche'].map((n, i) => `<label>${n}<input type="number" min="0" max="80" step="1" data-mm="${i}" value="${Math.round(mm[i] * 10) / 10}"></label>`).join('')}</div></div></div>`;
}
(function(){
  const PB = () => $('#edPanelBody');
  document.addEventListener('click', e => {
    if (panel !== 'page' || !PB().contains(e.target)) return;
    const x = e.target.closest('[data-pgx]'); if (x){ setPage({bgx:x.dataset.pgx}); renderPanel(); return; }
    const c = e.target.closest('.op-sw[data-k="pbc"] [data-c]'); if (c){ setPage({pbc:c.dataset.c, pb:E.doc.page.pb || 'thin'}); renderPanel(); }
  });
  document.addEventListener('change', e => {
    if (panel !== 'page' || !PB().contains(e.target) || !e.target.dataset.mm) return;
    const mm = [...$$('[data-mm]', PB())].map(i => clamp(parseFloat(i.value) || 0, 0, 80)); setPage({margins:'custom', mm}); renderPanel();
  });
})();

function proClick(e){ if (E.ro) return; const fn = e.target.closest('.sw-fn'); if (fn){ e.preventDefault(); return fnDlg(fn); } const eq = e.target.closest('.sw-eq'); if (eq){ e.preventDefault(); eqDlg(eq); } }
function proDbl(e){ if (E.ro) return; const cm = e.target.closest('.sw-cm'); if (cm) commentDlg(cm); }

function insertInlineHtml(html){
  if (E.ro) return; restoreSelIfNeeded(); flushRecord(); record();
  const s = getSelection(); if (!s.rangeCount || !inSheet()){ sheet().focus({preventScroll:true}); caretToEnd(sheet().lastElementChild || sheet()); }
  const r = getSelection().getRangeAt(0); r.collapse(false);
  if (r.startContainer === sheet()) return insertHTMLInline(html);
  const tpl = document.createElement('template'); tpl.innerHTML = SAN(html); const frag = tpl.content, last = frag.lastChild;
  r.insertNode(frag); const r2 = document.createRange(); r2.setStartAfter(last); r2.collapse(true); s.removeAllRanges(); s.addRange(r2); changed({record:true});
}
