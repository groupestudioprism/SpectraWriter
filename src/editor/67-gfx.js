/* ---------- Objets graphiques : formes (50), graphiques, schémas (SmartArt), mis en forme comme dans Canva ----------
   Chaque objet garde sa description (data-sw-spec) : on peut le modifier à tout moment, il se redessine en SVG. */
const GPALS = {
  theme:() => { const v = themeVals(E.doc.theme); return [v.ac, v.ac2, v.ac3, '#22D39A', '#F5B82E', '#FF7A2F', '#EF476F', '#8B5CF6']; },
  vif:() => ['#7B3FF2', '#2D6BFF', '#12B5E5', '#22D39A', '#F5B82E', '#FF7A2F', '#EF476F', '#111827'],
  pastel:() => ['#B8A5F5', '#A5C4FF', '#A5E4F5', '#A8EBCF', '#FBE3A0', '#FFC7A3', '#F9B3C4', '#CBD5E1'],
  mono:() => { const a = themeVals(E.doc.theme).ac, [r, g, b] = hexRgb(a); return [.0, .18, .34, .5, .64, .76, .86, .93].map(t => rgbHex(r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t)); },
  terre:() => ['#B45309', '#65A30D', '#0F766E', '#9A3412', '#CA8A04', '#4D7C0F', '#7C2D12', '#57534E'],
  nuit:() => ['#22D3EE', '#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#60A5FA', '#FB7185', '#94A3B8'],
};
const GPAL_NAMES = {theme:'Thème', vif:'Vif', pastel:'Pastel', mono:'Camaïeu', terre:'Terre', nuit:'Néon'};
const GRADS = [['#7B3FF2', '#12B5E5'], ['#FF7A2F', '#EF476F'], ['#22D39A', '#12B5E5'], ['#F5B82E', '#FF7A2F'], ['#2D6BFF', '#8B5CF6'], ['#EF476F', '#8B5CF6'], ['#111827', '#4B5563'], ['#0F766E', '#84CC16'], ['#FDE68A', '#FCA5A5'], ['#A5F3FC', '#C4B5FD'], ['#FBCFE8', '#FDE68A'], ['#0EA5E9', '#1E3A8A']];
const SWATCH = ['#FFFFFF', '#F1F5F9', '#CBD5E1', '#64748B', '#111827', '#EF476F', '#FF7A2F', '#F5B82E', '#22D39A', '#12B5E5', '#2D6BFF', '#7B3FF2', '#FDE68A', '#FBCFE8', '#BAE6FD', '#BBF7D0'];
const starPts = (n, ri, ro = 50) => Array.from({length:n * 2}, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? ro * ri : ro; return (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1); });
const starD = (n, ri) => 'M' + starPts(n, ri).join('L') + 'Z';
const SHAPES2 = [
  // [id, nom, chemin, groupe, ouvert?, ratio hauteur/largeur par défaut]
  ['rect', 'Rectangle', 'M0 0H100V100H0Z', 'Base', 0, .6], ['round', 'Rectangle arrondi', 'M16 0H84Q100 0 100 16V84Q100 100 84 100H16Q0 100 0 84V16Q0 0 16 0Z', 'Base', 0, .6],
  ['circle', 'Ellipse', 'M0 50A50 50 0 1 0 100 50A50 50 0 1 0 0 50Z', 'Base', 0, 1], ['tri', 'Triangle', 'M50 0L100 100H0Z', 'Base', 0, .85], ['rtri', 'Triangle rectangle', 'M0 0L100 100H0Z', 'Base', 0, .85],
  ['diamond', 'Losange', 'M50 0L100 50L50 100L0 50Z', 'Base', 0, .8], ['para', 'Parallélogramme', 'M25 0H100L75 100H0Z', 'Base', 0, .5], ['trap', 'Trapèze', 'M20 0H80L100 100H0Z', 'Base', 0, .6],
  ['pent', 'Pentagone', 'M50 0L100 38L81 100H19L0 38Z', 'Base', 0, 1], ['hex', 'Hexagone', 'M25 0H75L100 50L75 100H25L0 50Z', 'Base', 0, .9], ['oct', 'Octogone', 'M30 0H70L100 30V70L70 100H30L0 70V30Z', 'Base', 0, 1],
  ['semi', 'Demi-disque', 'M0 100C0 45 22 0 50 0C78 0 100 45 100 100Z', 'Base', 0, .55], ['pie', 'Camembert', 'M50 50L50 0A50 50 0 1 1 0 50Z', 'Base', 0, 1],
  ['ring', 'Anneau', 'M0 50A50 50 0 1 0 100 50A50 50 0 1 0 0 50ZM24 50A26 26 0 1 1 76 50A26 26 0 1 1 24 50Z', 'Base', 0, 1], ['frame', 'Cadre', 'M0 0H100V100H0ZM12 12V88H88V12Z', 'Base', 0, .7],
  ['cyl', 'Cylindre', 'M0 14C0 -5 100 -5 100 14V86C100 105 0 105 0 86Z', 'Base', 0, .8], ['plus', 'Croix', 'M34 0H66V34H100V66H66V100H34V66H0V34H34Z', 'Base', 0, 1],
  ['star4', 'Étoile 4 branches', starD(4, .38), 'Étoiles', 0, 1], ['star5', 'Étoile', starD(5, .42), 'Étoiles', 0, 1], ['star6', 'Étoile 6 branches', starD(6, .55), 'Étoiles', 0, 1],
  ['star8', 'Étoile 8 branches', starD(8, .6), 'Étoiles', 0, 1], ['burst', 'Explosion', starD(14, .78), 'Étoiles', 0, 1], ['seal', 'Sceau', starD(24, .9), 'Étoiles', 0, 1],
  ['arrowr', 'Flèche droite', 'M0 30H60V0L100 50L60 100V70H0Z', 'Flèches', 0, .5], ['arrowl', 'Flèche gauche', 'M100 30H40V0L0 50L40 100V70H100Z', 'Flèches', 0, .5],
  ['arrowu', 'Flèche haut', 'M30 100V40H0L50 0L100 40H70V100Z', 'Flèches', 0, 1], ['arrowd', 'Flèche bas', 'M30 0H70V60H100L50 100L0 60H30Z', 'Flèches', 0, 1],
  ['arrowlr', 'Double flèche', 'M0 50L30 15V35H70V15L100 50L70 85V65H30V85Z', 'Flèches', 0, .45], ['chevron', 'Chevron', 'M0 0H60L100 50L60 100H0L40 50Z', 'Flèches', 0, .5],
  ['home', 'Pentagone fléché', 'M0 10H68L100 50L68 90H0Z', 'Flèches', 0, .45], ['bent', 'Flèche coudée', 'M0 100V45Q0 25 20 25H58V0L100 34L58 68V46H30V100Z', 'Flèches', 0, .8],
  ['speech', 'Bulle rectangle', 'M0 0H100V76H38L16 100L22 76H0Z', 'Bulles', 0, .65], ['bubble', 'Bulle ronde', 'M50 0C78 0 100 16 100 38C100 60 78 76 50 76C44 76 38 75 33 74L10 98L16 68C6 60 0 50 0 38C0 16 22 0 50 0Z', 'Bulles', 0, .7],
  ['heart', 'Cœur', 'M50 100C8 66 0 42 0 27C0 10 12 0 27 0C38 0 46 7 50 16C54 7 62 0 73 0C88 0 100 10 100 27C100 42 92 66 50 100Z', 'Symboles', 0, .9],
  ['cloud', 'Nuage', 'M25 90C10 90 0 80 0 66C0 54 8 45 20 43C20 22 36 8 54 8C70 8 82 18 86 32C95 34 100 43 100 56C100 74 88 90 72 90Z', 'Symboles', 0, .65],
  ['moon', 'Croissant', 'M65 3C30 8 8 30 8 55C8 80 30 97 62 97C42 90 30 72 30 52C30 32 42 12 65 3Z', 'Symboles', 0, 1], ['bolt', 'Éclair', 'M60 0L15 55H45L35 100L88 40H55Z', 'Symboles', 0, 1.1],
  ['drop', 'Goutte', 'M50 0C50 0 90 45 90 65A40 40 0 0 1 10 65C10 45 50 0 50 0Z', 'Symboles', 0, 1.2], ['shield', 'Bouclier', 'M50 0L95 15V50C95 78 75 92 50 100C25 92 5 78 5 50V15Z', 'Symboles', 0, 1.1],
  ['leaf', 'Feuille', 'M0 100C0 40 40 0 100 0C100 60 60 100 0 100Z', 'Symboles', 0, 1], ['check', 'Coche', 'M5 55L20 40L40 60L80 10L95 25L40 90Z', 'Symboles', 0, .9],
  ['cross', 'Croix X', 'M20 0L50 30L80 0L100 20L70 50L100 80L80 100L50 70L20 100L0 80L30 50L0 20Z', 'Symboles', 0, 1], ['flag', 'Drapeau', 'M8 0H16V100H8ZM16 6H92L74 28L92 50H16Z', 'Symboles', 0, .9],
  ['ribbon', 'Bandeau', 'M0 15H100L90 50L100 85H0L10 50Z', 'Symboles', 0, .35], ['blob', 'Forme libre', 'M20 20C45-10 90 5 98 40S85 95 50 98 -8 70 5 40Z', 'Symboles', 0, .8],
  ['wave', 'Vague', 'M0 30C25 0 25 0 50 30S75 60 100 30V80C75 110 75 110 50 80S25 50 0 80Z', 'Symboles', 0, .3],
  ['line', 'Ligne', 'M0 50H100', 'Lignes', 1, .06], ['arrow', 'Ligne fléchée', 'M0 50H92M78 34L96 50L78 66', 'Lignes', 1, .1], ['curve', 'Courbe', 'M0 80C30 -20 70 120 100 20', 'Lignes', 1, .4],
  ['brace', 'Accolade', 'M40 0Q20 0 20 20V38Q20 50 0 50Q20 50 20 62V80Q20 100 40 100', 'Lignes', 1, 1.2], ['zig', 'Zigzag', 'M0 70L17 30L33 70L50 30L67 70L83 30L100 70', 'Lignes', 1, .3],
];
const SHAPE_GROUPS = ['Base', 'Étoiles', 'Flèches', 'Bulles', 'Symboles', 'Lignes'];
const SHADOWS = [['', 'Aucune'], ['soft', 'Douce'], ['med', 'Moyenne'], ['hard', 'Forte'], ['color', 'Colorée'], ['neon', 'Néon'], ['offset', 'Décalée'], ['inner', 'Intérieure']];
const shadowCss = (k, c, drop) => {
  if (!k) return ''; c = c || '#7B3FF2';
  const m = {soft:['0 4px 14px rgb(20 16 40 / .14)', '0 3px 8px rgb(20 16 40 / .22)'], med:['0 10px 30px rgb(20 16 40 / .2)', '0 8px 14px rgb(20 16 40 / .3)'], hard:['0 18px 48px rgb(20 16 40 / .32)', '0 14px 22px rgb(20 16 40 / .42)'],
    color:[`0 12px 32px ${c}77`, `0 10px 18px ${c}99`], neon:[`0 0 0 2px ${c}, 0 0 24px ${c}`, `0 0 4px ${c}) drop-shadow(0 0 14px ${c}`], offset:[`9px 9px 0 ${c}`, `7px 7px 0 ${c}`], inner:['inset 0 3px 14px rgb(20 16 40 / .3)', '0 2px 6px rgb(20 16 40 / .3)']}[k];
  return m ? m[drop ? 1 : 0] : '';
};
const wrapTxt = (t, n) => { const out = []; let cur = ''; String(t).split(/\s+/).forEach(w => { if ((cur + ' ' + w).trim().length > n && cur){ out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) out.push(cur); return out; };
const svgTxt = (lines, x, y, size, fill, extra = '') => { const lh = size * 1.18, y0 = y - (lines.length - 1) * lh / 2; return `<text x="${x.toFixed(1)}" y="${y0.toFixed(1)}" font-size="${size}" fill="${fill}" text-anchor="middle" dominant-baseline="central"${extra}>${lines.map((l, i) => `<tspan x="${x.toFixed(1)}" dy="${i ? lh.toFixed(1) : 0}">${escH(l)}</tspan>`).join('')}</text>`; };
const inkOn = hex => { try { const [r, g, b] = hexRgb(hex); return (r * .299 + g * .587 + b * .114) > 165 ? '#111827' : '#FFFFFF'; } catch(e){ return '#111827'; } };

/* ----- formes ----- */
function shapeSvg(sp){
  const d = SHAPES2.find(s => s[0] === sp.sh) || SHAPES2[0], open = !!d[4], id = 'g' + uidS();
  const f1 = sp.f1 || '#7B3FF2', f2 = sp.f2 && sp.f2 !== f1 ? sp.f2 : '';
  const a = ((sp.ang ?? 135) - 90) * Math.PI / 180, dx = Math.cos(a) / 2, dy = Math.sin(a) / 2;
  const defs = f2 && !open ? `<defs><linearGradient id="${id}" x1="${(.5 - dx).toFixed(3)}" y1="${(.5 - dy).toFixed(3)}" x2="${(.5 + dx).toFixed(3)}" y2="${(.5 + dy).toFixed(3)}"><stop offset="0" stop-color="${f1}"/><stop offset="1" stop-color="${f2}"/></linearGradient></defs>` : '';
  const fill = open ? 'none' : sp.nf ? 'none' : f2 ? `url(#${id})` : f1;
  const sw = open ? Math.max(sp.sw || 4, 1) : (sp.sw || 0), sc = open ? (sp.sc || f1) : (sp.sc || '#111827');
  const dash = {dash:'10 7', dot:'1 8'}[sp.da] || '';
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${defs}<path d="${d[2]}" fill="${fill}" fill-rule="evenodd"${sw ? ` stroke="${sc}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"${dash ? ` stroke-dasharray="${dash}"` : ''}` : ''}/></svg>`;
}
const SHAPE_DEF = {sh:'round', f1:'#7B3FF2', f2:'', ang:135, sw:0, sc:'#111827', da:'', op:100, sd:'', sdc:'#7B3FF2', rot:0, fl:0, ar:.6};
function renderObj(el){
  let sp; try { sp = JSON.parse(el.dataset.swSpec || '{}'); } catch(e){ sp = {}; }
  const kind = el.dataset.swGfx;
  if (kind === 'shape'){
    sp = {...SHAPE_DEF, ...sp}; const d = SHAPES2.find(s => s[0] === sp.sh) || SHAPES2[0];
    el.dataset.swSpec = JSON.stringify(sp);
    let s = el.querySelector(':scope > .sw-obj-s'); if (!s){ s = document.createElement('div'); s.className = 'sw-obj-s'; s.setAttribute('contenteditable', 'false'); el.prepend(s); }
    s.innerHTML = shapeSvg(sp);
    const tr = [sp.rot ? `rotate(${sp.rot}deg)` : '', sp.fl & 1 ? 'scaleX(-1)' : '', sp.fl & 2 ? 'scaleY(-1)' : ''].filter(Boolean).join(' ');
    s.style.cssText = `${tr ? `transform:${tr};` : ''}${sp.sd ? `filter:drop-shadow(${shadowCss(sp.sd, sp.sdc, true)});` : ''}${sp.op < 100 ? `opacity:${sp.op / 100};` : ''}`;
    el.style.aspectRatio = '1 / ' + (sp.ar || d[5]);
    const t = el.querySelector(':scope > .sw-obj-t'); if (d[4] && t) t.remove();
    if (t && !t.dataset.swInkLock) t.style.color = inkOn(sp.f2 && !d[4] ? sp.f1 : sp.f1 || '#7B3FF2');
  } else if (kind === 'chart'){ el.innerHTML = chartSvg(sp); el.style.removeProperty('aspect-ratio'); }
  else if (kind === 'smart'){ el.innerHTML = smartSvg(sp); }
  if (kind !== 'shape'){ const sd = sp.sd; el.style.filter = sd ? `drop-shadow(${shadowCss(sd, sp.sdc, true)})` : ''; if (!el.getAttribute('style')) el.removeAttribute('style'); }
}
function newShapeHtml(id, over = {}){
  const d = SHAPES2.find(s => s[0] === id) || SHAPES2[1], v = themeVals(E.doc.theme);
  const sp = {...SHAPE_DEF, sh:d[0], f1:v.ac, ar:d[5], ...over};
  const el = document.createElement('div'); el.className = 'sw-obj'; el.dataset.swGfx = 'shape'; el.dataset.swSpec = JSON.stringify(sp); el.dataset.swAlign = 'center'; el.style.width = d[5] > .9 ? '30%' : '48%';
  if (!d[4]) el.innerHTML = '<div class="sw-obj-t"><p>Texte</p></div>';
  renderObj(el); return el.outerHTML;
}
const insertShape = id => { restoreSel(); const f = insertHTMLBlock(newShapeHtml(id)); if (f){ E.objSel = f; placeTools(); } };

/* ----- graphiques ----- */
const nf = n => Number.isInteger(n) ? n.toLocaleString('fr-FR') : (Math.round(n * 100) / 100).toLocaleString('fr-FR');
function niceMax(m){ if (m <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(m))), f = m / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }
const CH_DEF = {type:'bar', title:'Titre du graphique', labels:['T1', 'T2', 'T3', 'T4'], series:[{n:'2024', v:[12, 19, 8, 15]}, {n:'2025', v:[16, 14, 21, 24]}], pal:'theme', legend:1, vals:1, grid:1};
function chartSvg(sp){
  sp = {...CH_DEF, ...sp}; const W = 600, cols = (GPALS[sp.pal] || GPALS.theme)(), S = sp.series.filter(s => s.v?.length), L = sp.labels, nL = Math.max(L.length, ...S.map(s => s.v.length), 1);
  const top = sp.title ? 40 : 16, legendH = sp.legend && (S.length > 1 || /pie|donut/.test(sp.type)) ? 30 : 0;
  const pie = /^(pie|donut)$/.test(sp.type), H = pie ? 340 : 360;
  let o = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-size="11" font-family="Inter, Arial, sans-serif">`;
  if (sp.title) o += `<text x="${W / 2}" y="24" font-size="16" font-weight="700" text-anchor="middle" fill="#111827">${escH(sp.title)}</text>`;
  const leg = items => { let x = 20; return items.map(([n, c]) => { const w = 22 + n.length * 6.3; const s = `<rect x="${x}" y="${H - 20}" width="11" height="11" rx="3" fill="${c}"/><text x="${x + 16}" y="${H - 11}" fill="#475569" dominant-baseline="central">${escH(n)}</text>`; x += w + 12; return s; }).join(''); };
  if (pie){
    const s = S[0] || {v:[]}, tot = s.v.reduce((a, b) => a + Math.max(0, b), 0) || 1, cx = 210, cy = top + (H - top - 24) / 2, R = Math.min(130, (H - top - 30) / 2), r0 = sp.type === 'donut' ? R * .56 : 0; let ang = -Math.PI / 2;
    s.v.forEach((v, i) => { v = Math.max(0, v); if (!v) return; const a2 = ang + v / tot * Math.PI * 2, big = a2 - ang > Math.PI ? 1 : 0, c = cols[i % cols.length], P = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
      const full = v / tot > .9999;
      o += full ? (r0 ? `<path fill-rule="evenodd" d="M${cx - R} ${cy}A${R} ${R} 0 1 0 ${cx + R} ${cy}A${R} ${R} 0 1 0 ${cx - R} ${cy}ZM${cx - r0} ${cy}A${r0} ${r0} 0 1 1 ${cx + r0} ${cy}A${r0} ${r0} 0 1 1 ${cx - r0} ${cy}Z" fill="${c}"/>` : `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${c}"/>`)
        : `<path d="M${P(R, ang)}A${R} ${R} 0 ${big} 1 ${P(R, a2)}${r0 ? `L${P(r0, a2)}A${r0} ${r0} 0 ${big} 0 ${P(r0, ang)}Z` : `L${cx} ${cy}Z`}" fill="${c}" stroke="#fff" stroke-width="2"/>`;
      if (sp.vals && v / tot > .04){ const m = (ang + a2) / 2, rr = r0 ? (R + r0) / 2 : R * .68; o += `<text x="${(cx + rr * Math.cos(m)).toFixed(1)}" y="${(cy + rr * Math.sin(m)).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-weight="700" fill="${inkOn(c)}">${Math.round(v / tot * 100)} %</text>`; }
      ang = a2; });
    const lx = 390; L.forEach((l, i) => { const y = cy - L.length * 11 + i * 22; o += `<rect x="${lx}" y="${y - 6}" width="12" height="12" rx="3" fill="${cols[i % cols.length]}"/><text x="${lx + 19}" y="${y}" dominant-baseline="central" fill="#334155" font-size="12">${escH(l)}${sp.vals && s.v[i] != null ? ` · ${nf(s.v[i])}` : ''}</text>`; });
    return o + '</svg>';
  }
  const hb = sp.type === 'hbar', ml = hb ? Math.min(120, 14 + Math.max(...L.map(l => l.length), 3) * 6.2) : 46, mr = 16, mb = hb ? 28 + legendH : 34 + legendH, mt = top;
  const stack = sp.type === 'stack', maxV = Math.max(...(stack ? Array.from({length:nL}, (_, i) => S.reduce((a, s) => a + Math.max(0, s.v[i] || 0), 0)) : S.flatMap(s => s.v)), 1), mx = niceMax(maxV);
  const pw = W - ml - mr, ph = H - mt - mb, ticks = 5;
  for (let i = 0; i <= ticks; i++){
    const val = mx * i / ticks;
    if (hb){ const x = ml + pw * i / ticks; if (sp.grid) o += `<line x1="${x}" y1="${mt}" x2="${x}" y2="${mt + ph}" stroke="#E2E8F0"/>`; o += `<text x="${x}" y="${mt + ph + 14}" text-anchor="middle" fill="#64748B">${nf(val)}</text>`; }
    else { const y = mt + ph - ph * i / ticks; if (sp.grid || i === 0) o += `<line x1="${ml}" y1="${y}" x2="${ml + pw}" y2="${y}" stroke="${i ? '#E2E8F0' : '#94A3B8'}"/>`; o += `<text x="${ml - 8}" y="${y}" text-anchor="end" dominant-baseline="central" fill="#64748B">${nf(val)}</text>`; }
  }
  const gw = (hb ? ph : pw) / nL;
  for (let i = 0; i < nL; i++){
    const c = (hb ? mt : ml) + gw * (i + .5);
    o += hb ? `<text x="${ml - 8}" y="${c}" text-anchor="end" dominant-baseline="central" fill="#334155">${escH(L[i] || '')}</text>` : `<text x="${c}" y="${mt + ph + 16}" text-anchor="middle" fill="#334155">${escH(L[i] || '')}</text>`;
  }
  if (/^(bar|hbar|stack)$/.test(sp.type)){
    const k = stack ? 1 : S.length, bw = Math.min(46, gw * .78 / k);
    for (let i = 0; i < nL; i++){ let acc = 0;
      S.forEach((s, j) => { const v = Math.max(0, s.v[i] || 0), len = (hb ? pw : ph) * v / mx, off = stack ? 0 : (j - (k - 1) / 2) * bw, cc = (hb ? mt : ml) + gw * (i + .5) + off - bw / 2, col = cols[j % cols.length];
        if (hb){ const x = ml + (stack ? acc : 0); o += `<rect x="${x.toFixed(1)}" y="${cc.toFixed(1)}" width="${len.toFixed(1)}" height="${bw.toFixed(1)}" rx="${stack ? 0 : 4}" fill="${col}"/>`; if (sp.vals && v && len > 22) o += `<text x="${(x + len + (stack ? -len / 2 : 5)).toFixed(1)}" y="${(cc + bw / 2).toFixed(1)}" dominant-baseline="central" ${stack ? `text-anchor="middle" fill="${inkOn(col)}"` : 'fill="#334155"'} font-weight="600">${nf(v)}</text>`; }
        else { const y = mt + ph - acc - len; o += `<rect x="${cc.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${len.toFixed(1)}" rx="${stack ? 0 : 4}" fill="${col}"/>`; if (sp.vals && v && (!stack || len > 16)) o += `<text x="${(cc + bw / 2).toFixed(1)}" y="${(stack ? y + len / 2 : y - 7).toFixed(1)}" text-anchor="middle" dominant-baseline="central" ${stack ? `fill="${inkOn(col)}"` : 'fill="#334155"'} font-weight="600">${nf(v)}</text>`; }
        if (stack) acc += len; });
    }
  } else {
    S.forEach((s, j) => { const col = cols[j % cols.length], pts = s.v.map((v, i) => [ml + gw * (i + .5), mt + ph - ph * Math.max(0, v) / mx]);
      if (!pts.length) return; const line = pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
      if (sp.type === 'area') o += `<path d="M${pts[0][0]} ${mt + ph}L${line}L${pts[pts.length - 1][0]} ${mt + ph}Z" fill="${col}" fill-opacity=".22"/>`;
      o += `<path d="M${line}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` + pts.map((p, i) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5" fill="#fff" stroke="${col}" stroke-width="2.5"/>${sp.vals ? `<text x="${p[0].toFixed(1)}" y="${(p[1] - 11).toFixed(1)}" text-anchor="middle" fill="#334155" font-weight="600">${nf(s.v[i])}</text>` : ''}`).join(''); });
  }
  if (legendH) o += leg(S.map((s, j) => [s.n || 'Série ' + (j + 1), cols[j % cols.length]]));
  return o + '</svg>';
}
function chartCsv(sp){ sp = {...CH_DEF, ...sp}; return [['', ...sp.series.map(s => s.n)].join(';'), ...sp.labels.map((l, i) => [l, ...sp.series.map(s => s.v[i] ?? '')].join(';'))].join('\n'); }
function parseChartCsv(t){
  const rows = t.split(/\n/).map(r => r.split(/[;\t]/).map(c => c.trim())).filter(r => r.some(Boolean)); if (rows.length < 2) return null;
  const head = rows[0], body = rows.slice(1), num = v => { const n = parseFloat(String(v).replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
  return {labels:body.map(r => r[0] || ''), series:head.slice(1).map((n, j) => ({n:n || 'Série ' + (j + 1), v:body.map(r => num(r[j + 1]))}))};
}
const CH_TYPES = [['bar', 'Barres'], ['hbar', 'Barres horizontales'], ['stack', 'Barres empilées'], ['line', 'Courbes'], ['area', 'Aires'], ['pie', 'Camembert'], ['donut', 'Anneau']];
function chartDlg(el){
  let sp = el ? JSON.parse(el.dataset.swSpec || '{}') : {}; sp = {...CH_DEF, ...sp}; const isNew = !el;
  SWDlg.open(`<h3>${isNew ? 'Insérer un graphique' : 'Modifier le graphique'}</h3><form id="chF" class="gfx-dlg">
    <div class="gd-types">${CH_TYPES.map(([k, n]) => `<button type="button" data-ct="${k}" aria-pressed="${sp.type === k}">${n}</button>`).join('')}</div>
    <label class="ap-field"><span>Titre</span><span class="ap-in"><input id="chT" value="${escH(sp.title)}" maxlength="80"></span></label>
    <label class="ap-field"><span>Données <small>première ligne : noms des séries · une ligne par catégorie · séparateur « ; » ou tabulation</small></span><textarea id="chD" rows="7" spellcheck="false">${escH(chartCsv(sp))}</textarea></label>
    <div class="gd-row"><label>Couleurs <select id="chP">${Object.entries(GPAL_NAMES).map(([k, n]) => `<option value="${k}"${sp.pal === k ? ' selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="gd-ck"><input type="checkbox" id="chV"${sp.vals ? ' checked' : ''}> Valeurs</label><label class="gd-ck"><input type="checkbox" id="chL"${sp.legend ? ' checked' : ''}> Légende</label><label class="gd-ck"><input type="checkbox" id="chG"${sp.grid ? ' checked' : ''}> Grille</label></div>
    <div class="gd-prev" id="chPrev"></div><p class="ap-err" id="chE"></p>
    <div class="dlg-acts"><button type="button" class="ap-btn alt" data-dlg="close">Annuler</button><button class="ap-btn" type="submit">${isNew ? 'Insérer' : 'Enregistrer'}</button></div></form>`, d => {
    const cur = () => { const p = parseChartCsv($('#chD', d).value); if (!p) return null; return {...sp, ...p, type:sp.type, title:$('#chT', d).value, pal:$('#chP', d).value, vals:$('#chV', d).checked ? 1 : 0, legend:$('#chL', d).checked ? 1 : 0, grid:$('#chG', d).checked ? 1 : 0}; };
    const prev = () => { const c = cur(); $('#chPrev', d).innerHTML = c ? chartSvg(c) : '<p class="pn-hint">Ajoutez au moins une ligne de données.</p>'; };
    d.querySelectorAll('[data-ct]').forEach(b => b.onclick = () => { sp.type = b.dataset.ct; d.querySelectorAll('[data-ct]').forEach(x => x.setAttribute('aria-pressed', x === b)); prev(); });
    d.querySelectorAll('input,select,textarea').forEach(i => i.addEventListener('input', prev)); prev();
    $('#chF', d).onsubmit = e => { e.preventDefault(); const c = cur(); if (!c) return $('#chE', d).textContent = 'Ajoutez une ligne de titres puis au moins une ligne de données.';
      SWDlg.close(); flushRecord(); record();
      if (el && sheet().contains(el)){ el.dataset.swSpec = JSON.stringify(c); renderObj(el); changed({record:true}); paginate(); }
      else { const h = document.createElement('div'); h.className = 'sw-obj'; h.dataset.swGfx = 'chart'; h.dataset.swAlign = 'center'; h.style.width = '100%'; h.dataset.swSpec = JSON.stringify(c); renderObj(h); const f = insertHTMLBlock(h.outerHTML); if (f){ E.objSel = f; placeTools(); } } };
  }, 'wide');
}

/* ----- schémas (SmartArt) ----- */
const SMART_KINDS = [['process', 'Processus'], ['steps', 'Étapes numérotées'], ['cycle', 'Cycle'], ['pyramid', 'Pyramide'], ['funnel', 'Entonnoir'], ['hier', 'Hiérarchie'], ['matrix', 'Matrice 2 × 2'], ['venn', 'Diagramme de Venn'], ['list', 'Liste verticale'], ['timeline', 'Chronologie'], ['target', 'Cibles'], ['compare', 'Comparaison']];
const SM_DEF = {kind:'process', items:['Idée', 'Étude', 'Conception', 'Réalisation', 'Livraison'], pal:'theme'};
function smartSvg(sp){
  sp = {...SM_DEF, ...sp}; const it = (sp.items || []).filter(Boolean).slice(0, 12), n = it.length || 1, cols = (GPALS[sp.pal] || GPALS.theme)(), W = 600, col = i => cols[i % cols.length];
  let H = 200, o = '';
  const box = (x, y, w, h, i, t, r = 10, sz = 14) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${r}" fill="${col(i)}"/>` + svgTxt(wrapTxt(t, Math.max(6, Math.floor(w / (sz * .56)))), x + w / 2, y + h / 2, sz, inkOn(col(i)), ' font-weight="600"');
  switch (sp.kind){
    case 'process': { H = 150; const w = W / n; it.forEach((t, i) => { const x = i * w; o += `<path d="M${x} 20H${x + w - 18}L${x + w} 75L${x + w - 18} 130H${x}${i ? `L${x + 18} 75Z` : 'Z'}" fill="${col(i)}" stroke="#fff" stroke-width="3"/>` + svgTxt(wrapTxt(t, Math.max(5, Math.floor((w - 30) / 8))), x + w / 2 + (i ? 6 : -4), 75, 14, inkOn(col(i)), ' font-weight="600"'); }); break; }
    case 'steps': { H = 190; const w = W / n; it.forEach((t, i) => { const cx = w * (i + .5); if (i) o += `<line x1="${cx - w}" y1="50" x2="${cx}" y2="50" stroke="#CBD5E1" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>`; o += `<circle cx="${cx}" cy="50" r="32" fill="${col(i)}"/><text x="${cx}" y="50" text-anchor="middle" dominant-baseline="central" font-size="26" font-weight="800" fill="${inkOn(col(i))}">${i + 1}</text>` + svgTxt(wrapTxt(t, Math.max(6, Math.floor(w / 8))), cx, 115, 14, '#1F2937', ' font-weight="600"'); }); break; }
    case 'cycle': { H = 380; const cx = 300, cy = 190, R = 130, r = n > 7 ? 38 : 48; it.forEach((t, i) => { const a = -Math.PI / 2 + i / n * Math.PI * 2, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a), a2 = -Math.PI / 2 + (i + 1) / n * Math.PI * 2, g = r / R + .05;
        if (n > 1) o += `<path d="M${(cx + R * Math.cos(a + g)).toFixed(1)} ${(cy + R * Math.sin(a + g)).toFixed(1)}A${R} ${R} 0 0 1 ${(cx + R * Math.cos(a2 - g)).toFixed(1)} ${(cy + R * Math.sin(a2 - g)).toFixed(1)}" fill="none" stroke="#CBD5E1" stroke-width="4" stroke-linecap="round"/>`;
        o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${col(i)}"/>` + svgTxt(wrapTxt(t, 9), x, y, 12, inkOn(col(i)), ' font-weight="600"'); }); break; }
    case 'pyramid': { H = 40 + n * 54; it.forEach((t, i) => { const y = 20 + i * 54, w0 = 20 + 560 * i / n, w1 = 20 + 560 * (i + 1) / n; o += `<path d="M${300 - w0 / 2} ${y}H${300 + w0 / 2}L${300 + w1 / 2} ${y + 50}H${300 - w1 / 2}Z" fill="${col(i)}" stroke="#fff" stroke-width="2"/>` + svgTxt([t], 300, y + 25, 14, inkOn(col(i)), ' font-weight="600"'); }); break; }
    case 'funnel': { H = 40 + n * 54; it.forEach((t, i) => { const y = 20 + i * 54, w0 = 580 - 480 * i / n, w1 = 580 - 480 * (i + 1) / n; o += `<path d="M${300 - w0 / 2} ${y}H${300 + w0 / 2}L${300 + w1 / 2} ${y + 50}H${300 - w1 / 2}Z" fill="${col(i)}" stroke="#fff" stroke-width="2"/>` + svgTxt([t], 300, y + 25, 14, inkOn(col(i)), ' font-weight="600"'); }); break; }
    case 'hier': { H = 230; const kids = it.slice(1), k = Math.max(kids.length, 1), w = Math.min(150, 560 / k - 12); o += `<path d="M300 78V110M${300 - (k - 1) * (w + 12) / 2} 110H${300 + (k - 1) * (w + 12) / 2}" stroke="#94A3B8" stroke-width="2" fill="none"/>` + box(220, 20, 160, 58, 0, it[0] || '', 12, 15);
      kids.forEach((t, i) => { const x = 300 + (i - (k - 1) / 2) * (w + 12); o += `<path d="M${x} 110V132" stroke="#94A3B8" stroke-width="2"/>` + box(x - w / 2, 132, w, 62, i + 1, t, 10, 13); }); break; }
    case 'matrix': { H = 320; const q = [0, 1, 2, 3].map(i => it[i] || ''); q.forEach((t, i) => { o += box(20 + (i % 2) * 290, 10 + Math.floor(i / 2) * 150, 270, 140, i, t, 16, 17); }); break; }
    case 'venn': { H = 300; const m = Math.min(Math.max(n, 2), 3), pos = m === 2 ? [[210, 150], [390, 150]] : [[230, 120], [370, 120], [300, 210]]; for (let i = 0; i < m; i++) o += `<circle cx="${pos[i][0]}" cy="${pos[i][1]}" r="${m === 2 ? 125 : 100}" fill="${col(i)}" fill-opacity=".55" stroke="${col(i)}" stroke-width="2"/>`;
      for (let i = 0; i < m; i++){ const dx = (pos[i][0] - 300) * (m === 2 ? .55 : .5), dy = (pos[i][1] - (m === 2 ? 150 : 150)) * .5; o += svgTxt(wrapTxt(it[i] || '', 12), pos[i][0] + dx * .35, pos[i][1] + dy * .6, 15, '#111827', ' font-weight="700"'); } break; }
    case 'list': { const h = 54; H = 12 + n * (h + 10); it.forEach((t, i) => { const y = 8 + i * (h + 10); o += `<rect x="8" y="${y}" width="584" height="${h}" rx="12" fill="${col(i)}" fill-opacity=".14"/><rect x="8" y="${y}" width="62" height="${h}" rx="12" fill="${col(i)}"/><text x="39" y="${y + h / 2}" text-anchor="middle" dominant-baseline="central" font-size="22" font-weight="800" fill="${inkOn(col(i))}">${i + 1}</text><text x="88" y="${y + h / 2}" dominant-baseline="central" font-size="16" font-weight="600" fill="#1F2937">${escH(t.slice(0, 60))}</text>`; }); break; }
    case 'timeline': { H = 230; const w = 560 / n; o += `<line x1="20" y1="115" x2="580" y2="115" stroke="#CBD5E1" stroke-width="4" stroke-linecap="round"/>`; it.forEach((t, i) => { const x = 20 + w * (i + .5), up = i % 2 === 0; o += `<line x1="${x}" y1="115" x2="${x}" y2="${up ? 75 : 155}" stroke="${col(i)}" stroke-width="3"/><circle cx="${x}" cy="115" r="9" fill="#fff" stroke="${col(i)}" stroke-width="4"/>` + svgTxt(wrapTxt(t, Math.max(8, Math.floor(w * 1.6 / 8))), x, up ? 52 : 180, 14, '#1F2937', ' font-weight="600"'); }); break; }
    case 'target': { H = 340; const R = 160; it.slice(0, 6).forEach((t, i) => { const r = R * (1 - i / Math.min(n, 6) * .85); o += `<circle cx="180" cy="170" r="${r.toFixed(1)}" fill="${col(i)}" fill-opacity=".85" stroke="#fff" stroke-width="3"/>`; const y = 170 - r + 14; o += `<line x1="180" y1="${y.toFixed(1)}" x2="360" y2="${(40 + i * 48).toFixed(1)}" stroke="#94A3B8" stroke-width="1.5"/><text x="366" y="${(40 + i * 48).toFixed(1)}" dominant-baseline="central" font-size="15" font-weight="600" fill="#1F2937">${escH(t.slice(0, 34))}</text>`; }); break; }
    case 'compare': { H = 60 + Math.max(2, Math.ceil((n - 2) / 2) + 1) * 40; const heads = [it[0] || '', it[1] || '']; heads.forEach((h, i) => { o += box(10 + i * 300, 8, 280, 46, i, h, 12, 17); }); it.slice(2).forEach((t, i) => { const c = i % 2, r = Math.floor(i / 2); o += `<rect x="${10 + c * 300}" y="${64 + r * 40}" width="280" height="34" rx="9" fill="${col(c)}" fill-opacity=".14"/>` + `<text x="${24 + c * 300}" y="${81 + r * 40}" dominant-baseline="central" font-size="14" fill="#1F2937">${escH(t.slice(0, 40))}</text>`; }); H = 72 + Math.ceil(Math.max(it.length - 2, 1) / 2) * 40; break; }
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, Arial, sans-serif">${o}</svg>`;
}
function smartDlg(el){
  let sp = el ? {...SM_DEF, ...JSON.parse(el.dataset.swSpec || '{}')} : {...SM_DEF};
  SWDlg.open(`<h3>${el ? 'Modifier le schéma' : 'Insérer un schéma'}</h3><form id="smF" class="gfx-dlg">
    <div class="gd-types">${SMART_KINDS.map(([k, n]) => `<button type="button" data-sk="${k}" aria-pressed="${sp.kind === k}">${n}</button>`).join('')}</div>
    <label class="ap-field"><span>Éléments <small>un par ligne (2 à 12)</small></span><textarea id="smI" rows="5" spellcheck="false">${escH(sp.items.join('\n'))}</textarea></label>
    <div class="gd-row"><label>Couleurs <select id="smP">${Object.entries(GPAL_NAMES).map(([k, n]) => `<option value="${k}"${sp.pal === k ? ' selected' : ''}>${n}</option>`).join('')}</select></label></div>
    <div class="gd-prev" id="smPrev"></div>
    <div class="dlg-acts"><button type="button" class="ap-btn alt" data-dlg="close">Annuler</button><button class="ap-btn" type="submit">${el ? 'Enregistrer' : 'Insérer'}</button></div></form>`, d => {
    const cur = () => ({...sp, items:$('#smI', d).value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 12), pal:$('#smP', d).value});
    const prev = () => { $('#smPrev', d).innerHTML = smartSvg(cur()); };
    d.querySelectorAll('[data-sk]').forEach(b => b.onclick = () => { sp.kind = b.dataset.sk; d.querySelectorAll('[data-sk]').forEach(x => x.setAttribute('aria-pressed', x === b)); prev(); });
    d.querySelectorAll('input,select,textarea').forEach(i => i.addEventListener('input', prev)); prev();
    $('#smF', d).onsubmit = e => { e.preventDefault(); const c = cur(); SWDlg.close(); flushRecord(); record();
      if (el && sheet().contains(el)){ el.dataset.swSpec = JSON.stringify(c); renderObj(el); changed({record:true}); paginate(); }
      else { const h = document.createElement('div'); h.className = 'sw-obj'; h.dataset.swGfx = 'smart'; h.dataset.swAlign = 'center'; h.style.width = '100%'; h.dataset.swSpec = JSON.stringify(c); renderObj(h); const f = insertHTMLBlock(h.outerHTML); if (f){ E.objSel = f; placeTools(); } } };
  }, 'wide');
}

/* ----- sélecteur de formes ----- */
function shapesDlg(){
  SWDlg.open(`<h3>Formes</h3><p class="dlg-p">Cliquez sur une forme pour l'insérer. Ensuite : couleurs, dégradé, contour, ombre, rotation et texte depuis la barre au-dessus de la forme.</p>
    <div class="shape-lib">${SHAPE_GROUPS.map(g => `<h4 class="pn-h">${g}</h4><div class="shape-grid">${SHAPES2.filter(s => s[3] === g).map(s => `<button type="button" data-sh="${s[0]}" title="${escH(s[1])}" aria-label="${escH(s[1])}">${shapeSvg({sh:s[0], f1:'#7B3FF2', f2:s[4] ? '' : '#12B5E5', sw:s[4] ? 5 : 0})}</button>`).join('')}</div>`).join('')}</div>`, d => {
    d.querySelectorAll('[data-sh]').forEach(b => b.onclick = () => { SWDlg.close(); insertShape(b.dataset.sh); });
  }, 'wide');
}

/* SVG -> PNG (export Word) */
function svgToPng(svg, wpx){
  return new Promise(res => {
    try {
      const c = svg.cloneNode(true), vb = (c.getAttribute('viewBox') || '0 0 100 100').split(/\s+/).map(Number), ratio = vb[3] / vb[2]; const W = wpx, H = Math.max(2, Math.round(wpx * ratio));
      c.setAttribute('width', W); c.setAttribute('height', H); c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.removeAttribute('style'); c.setAttribute('preserveAspectRatio', 'none');
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(c)], {type:'image/svg+xml;charset=utf-8'})), im = new Image();
      im.onload = () => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; cv.getContext('2d').drawImage(im, 0, 0, W, H); URL.revokeObjectURL(url);
        const b = atob(cv.toDataURL('image/png').split(',')[1]), u8 = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u8[i] = b.charCodeAt(i); res({data:u8, w:W, h:H}); };
      im.onerror = () => { URL.revokeObjectURL(url); res(null); }; im.src = url;
    } catch(e){ res(null); }
  });
}
