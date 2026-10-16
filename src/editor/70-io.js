/* ---------- Import / export : PDF (impression), Word .docx, page web, Markdown, texte, sauvegarde .spectra ---------- */
const LIB_DOCX = 'https://cdn.jsdelivr.net/npm/docx@9.11.0/+esm';
const LIB_MAMMOTH = 'https://cdn.jsdelivr.net/npm/mammoth@1.13.0/mammoth.browser.min.js';
function loadScriptOnce(src){ return new Promise((res, rej) => { if ($$('script').some(s => s.src === src)) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Bibliothèque indisponible : vérifiez votre connexion.')); document.head.appendChild(s); }); }

/* HTML propre du document (sans repères de pagination ni éléments d'interface) */
function cleanClone(){
  const c = sheet().cloneNode(true);
  c.querySelectorAll('.sw-pbs').forEach(x => x.remove());
  c.querySelectorAll('[data-swpb]').forEach(el => { const o = el.dataset.swpb; el.style.marginTop = o === '-' ? '' : o; if (!el.getAttribute('style')) el.removeAttribute('style'); el.removeAttribute('data-swpb'); });
  c.querySelectorAll('.ph-cur,.sw-sel').forEach(el => { el.classList.remove('ph-cur', 'sw-sel'); if (!el.className) el.removeAttribute('class'); });
  const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let t; const zw = []; while ((t = w.nextNode())) if (t.data.includes('​')) zw.push(t);
  zw.forEach(t => { t.data = t.data.replace(/​/g, ''); });
  c.querySelectorAll('span').forEach(s => { if (!s.attributes.length){ const p = s.parentNode; while (s.firstChild) p.insertBefore(s.firstChild, s); s.remove(); } });
  return c;
}
function cleanHtml(){ return cleanClone().innerHTML; }

/* Variables de thème → valeurs fixes (pour les logiciels qui ne lisent pas les variables CSS) */
function themeMap(){
  const v = themeVals(E.doc.theme), g = E.geo || geometry();
  return {ac:v.ac, ac2:v.ac2, ac3:v.ac3, ink:v.ink, mut:v.mut, soft:v.soft, line:v.line, fh:fontStack(v.fh), fb:fontStack(v.fb), hw:String(v.hw), fs:v.fs + 'px', lh:String(v.lh), grad:v.grad,
    mt:g.mt + 'px', mr:g.mr + 'px', mb:g.mb + 'px', ml:g.ml + 'px', ph:g.ph + 'px', pw:g.pw + 'px', n:'2'};
}
function resolveVars(css, map = themeMap()){ let out = css; for (let i = 0; i < 3; i++) out = out.replace(/var\(--([\w-]+)(?:\s*,\s*([^()]*))?\)/g, (m, k, fb) => map[k] ?? fb ?? ''); return out; }
function colorHex(c, map){
  c = String(c || '').trim(); if (!c || c === 'inherit' || c === 'transparent') return null;
  const vm = c.match(/^var\(--([\w-]+)/); if (vm) c = map[vm[1]] || '';
  if (/^#[0-9a-f]{3,8}$/i.test(c)){ let h = c.slice(1); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return h.slice(0, 6).toUpperCase(); }
  const m = c.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/); if (m) return [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('').toUpperCase();
  return null;
}
function fontsLinks(){ const v = themeVals(E.doc.theme); const fams = [...new Set([v.fh, v.fb, ...$$('[style*="font-family"]', sheet()).map(e => e.style.fontFamily.split(',')[0].replace(/["']/g, '').trim())])].filter(f => FONT_Q[f]);
  return fams.map(f => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}:${FONT_Q[f]}&display=swap">`).join(''); }

/* Page web autonome */
function exportHTML(){
  const g = E.geo;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escH(E.doc.title)}</title><meta name="generator" content="SPECTRA Writer · Studio Prism">${fontsLinks()}
<style>body{margin:0;background:#EEEDF4}main{max-width:${Math.round(g.pw)}px;margin:32px auto;background:${E.doc.page.bg || '#fff'};box-shadow:0 10px 40px rgb(20 16 40 / .14);padding:${g.mt}px ${g.mr}px ${g.mb}px ${g.ml}px;box-sizing:border-box;overflow:hidden}
.swdoc{${themeCss(E.doc.theme)};--mt:${g.mt}px;--mr:${g.mr}px;--mb:${g.mb}px;--ml:${g.ml}px;--ph:${g.ph}px}.swdoc .sw-pagebreak{height:0;border-top:1px dashed #ccc;margin:2em 0}.swdoc .sw-toc a i{display:none}
@media (max-width:${Math.round(g.pw)}px){main{margin:0;padding:24px 18px}}${DOC_CSS}</style></head><body><main class="swdoc">${cleanHtml()}</main></body></html>`;
}

/* Markdown */
function toMarkdown(root){
  const inl = n => { if (n.nodeType === 3) return n.data.replace(/ | /g, ' ').replace(/([*_`\\])/g, '\\$1'); if (n.nodeType !== 1) return '';
    const c = [...n.childNodes].map(inl).join(''), t = n.tagName;
    if (t === 'B' || t === 'STRONG') return c.trim() ? `**${c}**` + (n.parentElement?.closest('.sw-callout') && n === n.parentElement.firstChild ? ' — ' : '') : c; if (t === 'I' || t === 'EM') return c.trim() ? `*${c}*` : c; if (t === 'S' || t === 'DEL' || t === 'STRIKE') return `~~${c}~~`;
    if (t === 'CODE') return '`' + n.textContent + '`'; if (t === 'A') return `[${c}](${n.getAttribute('href') || ''})`; if (t === 'BR') return '  \n'; if (t === 'IMG') return `![${n.alt || ''}](image)`;
    return c; };
  const out = [];
  const blk = (n, depth = 0, ol = null) => {
    if (n.nodeType === 3){ if (n.data.trim()) out.push(n.data.trim()); return; } if (n.nodeType !== 1) return;
    const t = n.tagName;
    if (/^H[1-6]$/.test(t)) out.push('#'.repeat(+t[1]) + ' ' + inl(n).trim());
    else if (t === 'P') { const s = inl(n).trim(); if (s) out.push(s); }
    else if (t === 'BLOCKQUOTE') out.push(inl(n).trim().split('\n').map(l => '> ' + l).join('\n'));
    else if (t === 'PRE') out.push('```\n' + n.textContent + '\n```');
    else if (t === 'HR') out.push('---');
    else if (t === 'UL' || t === 'OL'){ const items = [...n.children].filter(x => x.tagName === 'LI'); const lines = [];
      items.forEach((li, i) => { const sub = [...li.children].filter(x => x.tagName === 'UL' || x.tagName === 'OL'); const clone = li.cloneNode(true); clone.querySelectorAll('ul,ol').forEach(x => x.remove());
        const mark = t === 'OL' ? `${i + 1}.` : n.classList.contains('sw-check') ? (li.hasAttribute('data-done') ? '- [x]' : '- [ ]') : '-';
        lines.push('  '.repeat(depth) + mark + ' ' + inl(clone).trim()); sub.forEach(s => { const save = out.length; blk(s, depth + 1); lines.push(...out.splice(save)); }); });
      out.push(lines.join('\n')); }
    else if (t === 'TABLE'){ const rows = [...n.rows].map(r => [...r.cells].map(c => inl(c).replace(/\|/g, '\\|').replace(/\n/g, ' ').trim())); if (rows.length){ const w = Math.max(...rows.map(r => r.length)); rows.forEach(r => { while (r.length < w) r.push(''); });
      out.push(['| ' + rows[0].join(' | ') + ' |', '| ' + rows[0].map(() => '---').join(' | ') + ' |', ...rows.slice(1).map(r => '| ' + r.join(' | ') + ' |')].join('\n')); } }
    else if (t === 'FIGURE'){ const img = n.querySelector('img'), cap = n.querySelector('figcaption'); out.push(`![${escH(cap?.textContent || img?.alt || 'image')}](image)`); }
    else if (n.dataset?.sw === 'pagebreak') out.push('\n---\n');
    else [...n.childNodes].forEach(x => blk(x, depth));
  };
  [...root.childNodes].forEach(n => blk(n));
  return (root.querySelector('h1') ? '' : `# ${E.doc.title}\n\n`) + out.join('\n\n') + '\n';
}
function fromMarkdown(md){
  const lines = md.replace(/\r/g, '').split('\n'), out = []; let i = 0, title = '';
  const inl = s => escH(s).replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}">${t}</a>`).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/__([^_]+)__/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<i>$2</i>').replace(/~~([^~]+)~~/g, '<s>$1</s>').replace(/`([^`]+)`/g, '<code>$1</code>');
  while (i < lines.length){
    const l = lines[i];
    if (/^```/.test(l)){ const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<pre><code>${escH(buf.join('\n'))}</code></pre>`); continue; }
    let m;
    if ((m = l.match(/^(#{1,6})\s+(.*)$/))){ const lv = m[1].length; if (lv === 1 && !title) title = m[2]; out.push(`<h${lv}>${inl(m[2])}</h${lv}>`); i++; continue; }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)){ out.push('<hr>'); i++; continue; }
    if (/^>\s?/.test(l)){ const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, '')); out.push(`<blockquote>${inl(buf.join(' '))}</blockquote>`); continue; }
    if (/^\s*([-*+]|\d+[.)])\s+/.test(l)){ const ordered = /^\s*\d/.test(l); const buf = []; let check = false;
      while (i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i])){ let t = lines[i++].replace(/^\s*([-*+]|\d+[.)])\s+/, ''); const c = t.match(/^\[( |x|X)\]\s*/); if (c){ check = true; t = t.slice(c[0].length); buf.push(`<li${c[1] !== ' ' ? ' data-done="1"' : ''}>${inl(t)}</li>`); } else buf.push(`<li>${inl(t)}</li>`); }
      out.push(ordered ? `<ol>${buf.join('')}</ol>` : `<ul${check ? ' class="sw-check"' : ''}>${buf.join('')}</ul>`); continue; }
    if (/^\|.*\|\s*$/.test(l)){ const rows = []; while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) rows.push(lines[i++]); const cells = r => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => inl(c.trim()));
      const body = rows.filter((r, k) => !(k === 1 && /^[\s|:-]+$/.test(r))); out.push(`<table class="sw-table"><thead><tr>${cells(body[0]).map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body.slice(1).map(r => `<tr>${cells(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`); continue; }
    if (!l.trim()){ i++; continue; }
    const buf = []; while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|```|\s*([-*+]|\d+[.)])\s|\|)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inl(buf.join(' '))}</p>`);
  }
  return {html:out.join(''), title};
}
function fromText(t){ const paras = t.replace(/\r/g, '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean); return paras.map(p => `<p>${escH(p).replace(/\n/g, '<br>')}</p>`).join('') || '<p><br></p>'; }

/* Import d'un fichier → JSON de document */
async function importFile(f){
  const name = f.name.replace(/\.[^.]+$/, ''), ext = (f.name.match(/\.([^.]+)$/) || [])[1]?.toLowerCase() || '';
  if (f.size > 25e6) throw new Error('Fichier trop volumineux (25 Mo maximum).');
  const mk = (html, title, theme, page) => JSON.stringify({v:1, app:'spectrawriter', title:(title || name).slice(0, 120), html:SAN(html), theme:theme || {id:'spectra'}, page:{...DEF_PAGE, ...(page || {})}});
  if (ext === 'spectra' || ext === 'json'){ const j = JSON.parse(await f.text()); if (typeof j.html !== 'string') throw new Error('Ce fichier n\'est pas un document SPECTRA Writer.'); return mk(j.html, j.title, j.theme, j.page); }
  if (ext === 'docx'){
    await loadScriptOnce(LIB_MAMMOTH);
    const r = await window.mammoth.convertToHtml({arrayBuffer:await f.arrayBuffer()}, {convertImage:window.mammoth.images.imgElement(async img => {
      const b64 = await img.read('base64'); const type = img.contentType || 'image/png';
      if (!/^image\/(png|jpe?g|gif|webp)$/.test(type)) return {src:''};
      try { const blob = await (await fetch(`data:${type};base64,${b64}`)).blob(); return {src:await readImage(new File([blob], 'img', {type}), 1400)}; } catch(e){ return {src:''}; }
    })});
    let html = r.value.replace(/<table>/g, '<table class="sw-table t-grid">').replace(/<img ([^>]*)>/g, '<figure class="sw-img" data-align="center" style="width:80%"><img $1></figure>');
    const title = (html.match(/<h1>(.*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '');
    return mk(html, title || name);
  }
  if (ext === 'html' || ext === 'htm'){ const t = await f.text(); const d = new DOMParser().parseFromString(t, 'text/html'); const art = d.querySelector('main.swdoc, article, main') || d.body; return mk(art.innerHTML, d.title || name); }
  if (ext === 'md' || ext === 'markdown'){ const r = fromMarkdown(await f.text()); return mk(r.html, r.title || name); }
  if (ext === 'txt' || f.type.startsWith('text/')) return mk(fromText(await f.text()), name);
  if (ext === 'doc') throw new Error('Ancien format Word (.doc) : ouvrez-le dans Word ou LibreOffice et enregistrez-le en .docx, puis importez-le.');
  if (ext === 'odt') throw new Error('Format OpenDocument (.odt) : enregistrez-le en .docx depuis LibreOffice, puis importez-le.');
  if (ext === 'pdf') throw new Error('Les PDF ne sont pas modifiables : importez plutôt le fichier Word ou texte d\'origine.');
  throw new Error('Format non pris en charge. Formats acceptés : .docx, .spectra, .html, .md, .txt');
}
/* Insérer le contenu d'un fichier dans le document ouvert, au curseur */
async function insertFileHere(f){ try { const j = JSON.parse(await importFile(f)); insertHTMLBlock(j.html); toast('Contenu inséré'); } catch(e){ toast(e.message || 'Import impossible'); } }

/* ---------- Word (.docx) : conversion du document en vrai fichier Word (bibliothèque docx) ---------- */
async function imgForDocx(src){
  return new Promise(res => { const im = new Image(); im.onload = () => {
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d');
    const isPng = /^data:image\/(png|webp|gif)/.test(src); if (!isPng){ x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
    x.drawImage(im, 0, 0); const url = c.toDataURL(isPng ? 'image/png' : 'image/jpeg', .9);
    const bin = atob(url.split(',')[1]); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    res({data:u8, type:isPng ? 'png' : 'jpg', w:im.naturalWidth, h:im.naturalHeight}); }; im.onerror = () => res(null); im.crossOrigin = 'anonymous'; im.src = src; });
}
async function buildDocx(D, root, opt){
  const map = opt.map, v = opt.theme, g = opt.geo;
  const TW = 1440 / 96; // twips par pixel
  const contentPx = g.pw - g.ml - g.mr;
  const halfPt = px => Math.round(px * .75 * 2);
  const baseHalf = halfPt(v.fs);
  let olInstance = 0;
  const runsOf = (node, st = {}) => {
    const out = [];
    const walk = (n, s) => {
      if (n.nodeType === 3){ const t = n.data.replace(/​/g, ''); if (t) out.push(new D.TextRun({text:t, bold:s.b, italics:s.i, underline:s.u ? {} : undefined, strike:s.s, color:s.color, size:s.size, font:s.font, superScript:s.sup, subScript:s.sub, shading:s.bg ? {type:D.ShadingType.CLEAR, fill:s.bg, color:'auto'} : undefined, allCaps:s.caps})); return; }
      if (n.nodeType !== 1) return;
      const t = n.tagName, ns = {...s};
      if (t === 'BR'){ out.push(new D.TextRun({break:1})); return; }
      if (t === 'B' || t === 'STRONG') ns.b = true; if (t === 'I' || t === 'EM' || t === 'CITE') ns.i = true; if (t === 'U' || t === 'INS') ns.u = true; if (t === 'S' || t === 'DEL' || t === 'STRIKE') ns.s = true;
      if (t === 'SUP') ns.sup = true; if (t === 'SUB') ns.sub = true; if (t === 'CODE') ns.font = 'Courier New'; if (t === 'MARK') ns.bg = 'FFF1A8';
      if (n.style){ const c = colorHex(n.style.color, map); if (c) ns.color = c; const bg = colorHex(n.style.backgroundColor, map); if (bg) ns.bg = bg;
        if (n.style.fontSize){ const fsz = n.style.fontSize; const px = fsz.endsWith('pt') ? parseFloat(fsz) / .75 : fsz.endsWith('px') ? parseFloat(fsz) : fsz.endsWith('em') ? parseFloat(fsz) * v.fs : 0; if (px) ns.size = halfPt(px); }
        if (n.style.fontFamily) ns.font = n.style.fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (/^(bold|[6-9]00)$/.test(n.style.fontWeight)) ns.b = true; if (n.style.fontStyle === 'italic') ns.i = true; }
      if (n.classList?.contains('sw-tag')){ ns.bg = colorHex(map.soft, map); ns.color = colorHex(map.ac, map); ns.b = true; }
      if (t === 'A' && n.getAttribute('href') && /^(https?:|mailto:|tel:)/.test(n.getAttribute('href'))){ const sub = []; const save = out.length; [...n.childNodes].forEach(c => walk(c, {...ns, u:true, color:colorHex(map.ac, map)})); sub.push(...out.splice(save));
        out.push(new D.ExternalHyperlink({link:n.getAttribute('href'), children:sub.length ? sub : [new D.TextRun({text:n.getAttribute('href'), style:'Hyperlink'})]})); return; }
      if (t === 'IMG') return;
      [...n.childNodes].forEach(c => walk(c, ns));
    };
    [...node.childNodes].forEach(c => walk(c, st));
    return out;
  };
  const align = el => { const a = el.style?.textAlign || (el.classList?.contains('sw-center') ? 'center' : el.classList?.contains('sw-right') ? 'right' : ''); return a === 'center' ? D.AlignmentType.CENTER : a === 'right' ? D.AlignmentType.RIGHT : a === 'justify' ? D.AlignmentType.JUSTIFIED : undefined; };
  const para = (el, extra = {}, st = {}) => new D.Paragraph({children:runsOf(el, st), alignment:align(el), spacing:{after:120, ...(extra.spacing || {})}, ...extra});
  const blocks = [];
  const ctx = {white:false};
  const H = {H1:D.HeadingLevel.HEADING_1, H2:D.HeadingLevel.HEADING_2, H3:D.HeadingLevel.HEADING_3, H4:D.HeadingLevel.HEADING_4, H5:D.HeadingLevel.HEADING_5, H6:D.HeadingLevel.HEADING_6};
  const listItems = (list, level, out) => {
    const ordered = list.tagName === 'OL', check = list.classList.contains('sw-check'); if (ordered) olInstance++; const inst = olInstance;
    [...list.children].filter(x => x.tagName === 'LI').forEach(li => {
      const clone = li.cloneNode(true); clone.querySelectorAll('ul,ol').forEach(x => x.remove());
      const runs = runsOf(clone, ctx.white ? {color:'FFFFFF'} : {}); if (check) runs.unshift(new D.TextRun({text:li.hasAttribute('data-done') ? '☑  ' : '☐  '}));
      out.push(new D.Paragraph({children:runs, spacing:{after:60}, ...(check ? {indent:{left:360 * (level + 1)}} : ordered ? {numbering:{reference:'sw-num', level:Math.min(level, 2), instance:inst}} : {bullet:{level:Math.min(level, 2)}})}));
      [...li.children].filter(x => x.tagName === 'UL' || x.tagName === 'OL').forEach(s => listItems(s, level + 1, out));
    });
  };
  const tableFrom = async (tbl) => {
    const rows = [];
    for (const tr of tbl.rows){ const cells = [];
      for (const td of tr.cells){ const head = td.tagName === 'TH' && (tr.parentNode.tagName === 'THEAD' || tr.classList.contains('h')) && tbl.classList.contains('sw-table') && !tbl.classList.contains('t-soft');
        const kids = []; await flow(td, kids, head ? {color:'FFFFFF', b:true} : td.tagName === 'TH' ? {b:true} : {}); if (!kids.length) kids.push(new D.Paragraph({children:[]}));
        cells.push(new D.TableCell({children:kids, columnSpan:td.colSpan > 1 ? td.colSpan : undefined, shading:head ? {type:D.ShadingType.CLEAR, fill:colorHex(map.ac, map), color:'auto'} : (tbl.classList.contains('t-zebra') && tr.rowIndex % 2 === 0 && tr.parentNode.tagName === 'TBODY') ? {type:D.ShadingType.CLEAR, fill:colorHex(map.soft, map), color:'auto'} : undefined,
          margins:{top:60, bottom:60, left:100, right:100}})); }
      rows.push(new D.TableRow({children:cells, tableHeader:tr.parentNode.tagName === 'THEAD'})); }
    const bc = colorHex(map.line, map) || 'DDDDDD', b = {style:D.BorderStyle.SINGLE, size:4, color:bc};
    return new D.Table({rows, width:{size:100, type:D.WidthType.PERCENTAGE}, borders:{top:b, bottom:b, left:tbl.classList.contains('t-grid') ? b : {style:D.BorderStyle.NONE, size:0, color:'FFFFFF'}, right:tbl.classList.contains('t-grid') ? b : {style:D.BorderStyle.NONE, size:0, color:'FFFFFF'}, insideHorizontal:b, insideVertical:tbl.classList.contains('t-grid') ? b : {style:D.BorderStyle.NONE, size:0, color:'FFFFFF'}}});
  };
  const gridFrom = async (el, kids) => {
    const cells = []; const none = {style:D.BorderStyle.NONE, size:0, color:'FFFFFF'};
    for (const k of kids){ const out = []; await flow(k, out, {}, true); if (!out.length) out.push(new D.Paragraph({children:[]}));
      const tint = k.classList.contains('tint') || k.classList.contains('sw-stat') || k.classList.contains('hot');
      cells.push(new D.TableCell({children:out, shading:tint ? {type:D.ShadingType.CLEAR, fill:colorHex(map.soft, map), color:'auto'} : undefined, margins:{top:100, bottom:100, left:140, right:140}})); }
    return new D.Table({rows:[new D.TableRow({children:cells})], width:{size:100, type:D.WidthType.PERCENTAGE}, borders:{top:none, bottom:none, left:none, right:none, insideHorizontal:none, insideVertical:none}});
  };
  async function flow(container, out, st = {}, inCell = false){
    for (const n of [...container.childNodes]){
      if (n.nodeType === 3){ if (n.data.trim()) out.push(new D.Paragraph({children:[new D.TextRun({text:n.data.trim(), color:st.color, bold:st.b})]})); continue; }
      if (n.nodeType !== 1) continue;
      const t = n.tagName, cls = n.classList;
      const st2 = {...st}; if (ctx.white) st2.color = 'FFFFFF';
      if (H[t]) out.push(para(n, {heading:H[t], spacing:{before:t === 'H1' ? 240 : 180, after:120}}, ctx.white ? {color:'FFFFFF'} : {}));
      else if (t === 'P' || t === 'SPAN' || t === 'B' || t === 'STRONG' || t === 'LABEL' || t === 'TIME'){
        if (t !== 'P'){ out.push(new D.Paragraph({children:runsOf({childNodes:[n]}, st2)})); continue; }
        const extra = {}; const s3 = {...st2};
        if (cls.contains('sw-lead')){ s3.size = halfPt(v.fs * 1.2); s3.color = s3.color || colorHex(map.mut, map); }
        if (cls.contains('sw-kicker')){ s3.b = true; s3.caps = true; s3.size = halfPt(v.fs * .8); s3.color = s3.color || colorHex(map.ac, map); }
        if (cls.contains('sw-small')){ s3.size = halfPt(v.fs * .85); s3.color = s3.color || colorHex(map.mut, map); }
        if (n.style.marginLeft) extra.indent = {left:Math.round(parseFloat(n.style.marginLeft) * v.fs * TW)};
        out.push(para(n, extra, s3));
      }
      else if (t === 'BLOCKQUOTE') out.push(para(n, {indent:{left:400}, border:{left:{style:D.BorderStyle.SINGLE, size:18, color:colorHex(map.ac, map), space:10}}}, {i:true, color:colorHex(map.mut, map)}));
      else if (t === 'PRE') n.textContent.split('\n').forEach(l => out.push(new D.Paragraph({children:[new D.TextRun({text:l || ' ', font:'Courier New', size:halfPt(13)})], shading:{type:D.ShadingType.CLEAR, fill:'F6F5FB', color:'auto'}, spacing:{after:0}})));
      else if (t === 'UL' || t === 'OL') listItems(n, 0, out);
      else if (t === 'HR') out.push(new D.Paragraph({children:[], border:{bottom:{style:D.BorderStyle.SINGLE, size:cls.contains('sw-divider') ? 18 : 6, color:colorHex(cls.contains('sw-divider') ? map.ac : map.line, map), space:1}}, spacing:{before:200, after:200}}));
      else if (t === 'TABLE') { out.push(await tableFrom(n)); out.push(new D.Paragraph({children:[], spacing:{after:80}})); }
      else if (t === 'FIGURE'){ const img = n.querySelector('img'); if (img){ const im = await opt.img(img.getAttribute('src'));
          if (im){ const pct = parseFloat(n.style.width) || 100, w = Math.min(contentPx, contentPx * pct / 100), h = w * im.h / im.w;
            out.push(new D.Paragraph({children:[new D.ImageRun({type:im.type, data:im.data, transformation:{width:Math.round(w * .75 / .75), height:Math.round(h)}})], alignment:n.dataset.align === 'right' ? D.AlignmentType.RIGHT : n.dataset.align === 'left' ? D.AlignmentType.LEFT : D.AlignmentType.CENTER})); } }
        const cap = n.querySelector('figcaption'); if (cap) out.push(para(cap, {alignment:D.AlignmentType.CENTER}, {i:true, size:halfPt(v.fs * .82), color:colorHex(map.mut, map)})); }
      else if (n.dataset?.sw === 'pagebreak') out.push(new D.Paragraph({children:[new D.PageBreak()]}));
      else if (n.dataset?.sw === 'toc'){ out.push(new D.Paragraph({children:[new D.TextRun({text:'Sommaire', bold:true, size:halfPt(v.fs * 1.2), font:v.fh})], spacing:{after:120}}));
        $$('a', n).forEach(a => { const lv = a.classList.contains('l3') ? 2 : a.classList.contains('l2') ? 1 : 0; out.push(new D.Paragraph({children:[new D.TextRun({text:a.childNodes[0]?.textContent || a.textContent}), new D.TextRun({children:[new D.Tab(), a.querySelector('em')?.textContent || '']})], tabStops:[{type:D.TabStopType.RIGHT, position:Math.round(contentPx * TW), leader:'dot'}], indent:{left:lv * 360}, spacing:{after:40}})); }); }
      else if (cls?.contains('sw-cols') || cls?.contains('sw-stats') || cls?.contains('sw-prices') || cls?.contains('sw-sign')){ if (inCell) await flow(n, out, st, inCell); else { out.push(await gridFrom(n, [...n.children])); out.push(new D.Paragraph({children:[], spacing:{after:80}})); } }
      else if (cls?.contains('sw-cover') || cls?.contains('sw-band') || cls?.contains('sw-banner')){
        const light = cls.contains('light'); const prev = ctx.white; ctx.white = !light; const sub = []; await flow(n, sub, light ? {} : {color:'FFFFFF'});
        ctx.white = prev; const fill = light ? colorHex(map.soft, map) : colorHex(map.ac, map);
        const none = {style:D.BorderStyle.NONE, size:0, color:'FFFFFF'};
        out.push(new D.Table({rows:[new D.TableRow({children:[new D.TableCell({children:sub.length ? sub : [new D.Paragraph({children:[]})], shading:{type:D.ShadingType.CLEAR, fill, color:'auto'}, margins:{top:cls.contains('sw-cover') ? 2400 : 300, bottom:400, left:300, right:300}})], height:cls.contains('sw-cover') ? {value:Math.round((g.ph - g.mt - g.mb) * TW * .92), rule:'atLeast'} : undefined})], width:{size:100, type:D.WidthType.PERCENTAGE}, borders:{top:none, bottom:none, left:none, right:none, insideHorizontal:none, insideVertical:none}}));
        if (cls.contains('sw-cover')) out.push(new D.Paragraph({children:[new D.PageBreak()]})); else out.push(new D.Paragraph({children:[], spacing:{after:120}}));
      }
      else if (cls?.contains('sw-callout') || cls?.contains('sw-toc') || cls?.contains('sw-card')){
        const sub = []; await flow(n, sub, st); const kind = n.dataset?.swKind; const fills = {info:'EAF4FF', tip:'F3EEFF', warn:'FFF6E6', ok:'EAF8F0', danger:'FDEDED'};
        const bl = {info:'2F80ED', tip:'7C4DFF', warn:'F2A100', ok:'1E9E5A', danger:'D93636'}[kind] || colorHex(map.ac, map), none = {style:D.BorderStyle.NONE, size:0, color:'FFFFFF'};
        out.push(new D.Table({rows:[new D.TableRow({children:[new D.TableCell({children:sub.length ? sub : [new D.Paragraph({children:[]})], shading:{type:D.ShadingType.CLEAR, fill:fills[kind] || colorHex(map.soft, map), color:'auto'}, margins:{top:120, bottom:120, left:200, right:200},
          borders:{left:cls.contains('sw-card') ? none : {style:D.BorderStyle.SINGLE, size:24, color:bl}, top:none, bottom:none, right:none}})]})], width:{size:100, type:D.WidthType.PERCENTAGE}}));
        out.push(new D.Paragraph({children:[], spacing:{after:80}}));
      }
      else if (cls?.contains('sw-quote')){ out.push(para({childNodes:[...n.childNodes].filter(x => x.tagName !== 'CITE'), style:{textAlign:'center'}, classList:{contains:() => true}}, {alignment:D.AlignmentType.CENTER, spacing:{before:200, after:80}}, {i:true, size:halfPt(v.fs * 1.4)}));
        const c = n.querySelector('cite'); if (c) out.push(new D.Paragraph({children:[new D.TextRun({text:c.textContent, color:colorHex(map.mut, map), size:halfPt(v.fs * .85)})], alignment:D.AlignmentType.CENTER, spacing:{after:200}})); }
      else if (cls?.contains('sw-progress')){ const p = n.querySelector('p'); const bar = n.querySelector('.sw-bar i'); const pct = parseFloat(bar?.style.width) || 0;
        if (p) out.push(new D.Paragraph({children:runsOf(p), spacing:{after:40}}));
        out.push(new D.Paragraph({children:[new D.TextRun({text:'█'.repeat(Math.round(pct / 5)), color:colorHex(map.ac, map)}), new D.TextRun({text:'█'.repeat(20 - Math.round(pct / 5)), color:colorHex(map.soft, map)})], spacing:{after:120}})); }
      else if (cls?.contains('sw-space')) out.push(new D.Paragraph({children:[], spacing:{after:400}}));
      else if (cls?.contains('sw-shape')) continue;
      else await flow(n, out, st, inCell);
    }
  }
  await flow(root, blocks);
  const ph = opt.page, tok = (s) => String(s || '').replace(/\{titre\}/g, opt.title).replace(/\{date\}/g, today());
  const hfRuns = (s, num) => { const parts = []; const txt = tok(s);
    const pieces = txt.split(/(\{page\}|\{pages\})/); pieces.forEach(p => { if (p === '{page}') parts.push(new D.TextRun({children:[D.PageNumber.CURRENT], color:'888888', size:18})); else if (p === '{pages}') parts.push(new D.TextRun({children:[D.PageNumber.TOTAL_PAGES], color:'888888', size:18})); else if (p) parts.push(new D.TextRun({text:p, color:'888888', size:18})); });
    if (num){ if (parts.length) parts.push(new D.TextRun({children:[new D.Tab()]})); parts.push(new D.TextRun({children:ph.numStyle === 'np' ? ['Page ', D.PageNumber.CURRENT, ' / ', D.PageNumber.TOTAL_PAGES] : [D.PageNumber.CURRENT], color:'888888', size:18})); }
    return parts; };
  const footerP = ph.footer || ph.numbers ? new D.Footer({children:[new D.Paragraph({children:hfRuns(ph.footer, ph.numbers), alignment:ph.footer ? undefined : ph.numPos === 'r' ? D.AlignmentType.RIGHT : D.AlignmentType.CENTER, tabStops:[{type:D.TabStopType.RIGHT, position:Math.round(contentPx * TW)}]})]}) : undefined;
  const headerP = ph.header ? new D.Header({children:[new D.Paragraph({children:hfRuns(ph.header, false)})]}) : undefined;
  const hx = c => colorHex(c, map);
  return new D.Document({
    creator:'SPECTRA Writer · Studio Prism', title:opt.title, description:'Créé avec SPECTRA Writer',
    styles:{default:{document:{run:{font:v.fb, size:baseHalf, color:hx(v.ink)}, paragraph:{spacing:{line:Math.round(240 * v.lh / 1.15)}}},
      heading1:{run:{font:v.fh, size:Math.round(baseHalf * 2.15), bold:v.hw >= 600, color:hx(v.ink)}}, heading2:{run:{font:v.fh, size:Math.round(baseHalf * 1.5), bold:v.hw >= 600, color:hx(v.ac)}},
      heading3:{run:{font:v.fh, size:Math.round(baseHalf * 1.18), bold:v.hw >= 600, color:hx(v.ink)}}, heading4:{run:{font:v.fh, size:baseHalf, bold:true, allCaps:true, color:hx(v.mut)}}},
      characterStyles:[{id:'Hyperlink', name:'Hyperlink', run:{color:hx(v.ac), underline:{}}}]},
    numbering:{config:[{reference:'sw-num', levels:[0, 1, 2].map(l => ({level:l, format:[D.LevelFormat.DECIMAL, D.LevelFormat.LOWER_LETTER, D.LevelFormat.LOWER_ROMAN][l], text:`%${l + 1}.`, alignment:D.AlignmentType.START, style:{paragraph:{indent:{left:720 * (l + 1), hanging:360}}}}))}]},
    sections:[{properties:{page:{size:{width:Math.round(g.pw * TW), height:Math.round(g.ph * TW), orientation:ph.orient === 'l' ? D.PageOrientation.LANDSCAPE : D.PageOrientation.PORTRAIT},
      margin:{top:Math.round(Math.max(g.mt, 24) * TW), right:Math.round(Math.max(g.mr, 24) * TW), bottom:Math.round(Math.max(g.mb, 24) * TW), left:Math.round(Math.max(g.ml, 24) * TW)}}},
      headers:headerP ? {default:headerP} : undefined, footers:footerP ? {default:footerP} : undefined, children:blocks.length ? blocks : [new D.Paragraph({children:[]})]}],
  });
}
async function exportDocx(){
  const D = await import(LIB_DOCX);
  const doc = await buildDocx(D, cleanClone(), {map:themeMap(), theme:themeVals(E.doc.theme), geo:E.geo, page:E.doc.page, title:E.doc.title, img:imgForDocx});
  return D.Packer.toBlob(doc);
}
window.__swBuildDocx = buildDocx; // tests

/* PDF : impression du document paginé (Enregistrer au format PDF) */
function printDoc(){
  const done = () => { E.printing = false; document.body.classList.remove('printing'); applyGeometry(); sizeStage(); paginate(); window.removeEventListener('afterprint', done); };
  E.printing = true; document.body.classList.add('printing'); closePop();
  const z = E.zoom; E.zoom = 1; E.canvas.style.transform = 'none';
  applyGeometry(); layout(); E.zoom = z;
  window.addEventListener('afterprint', done);
  setTimeout(() => { window.print(); setTimeout(() => { if (E.printing) done(); }, 1500); }, 120);
}

async function doExport(kind){
  closePop();
  const name = SWSafeName(E.doc.title || 'document');
  const free = kind === 'pdf' || kind === 'txt';
  if (!free && window.SWHome && !SWHome.canExport()) return SWHome.licence('export');
  try {
    if (kind === 'pdf') return printDoc();
    if (kind === 'txt'){ const t = cleanClone(); t.querySelectorAll('[data-sw="toc"]').forEach(x => x.remove()); t.style.cssText += ';position:fixed;left:-99999px;top:0'; document.body.appendChild(t); const txt = t.innerText; t.remove(); return SWDownload(name + '.txt', new Blob([E.doc.title + '\n\n' + txt.replace(/\n{3,}/g, '\n\n')], {type:'text/plain;charset=utf-8'})); }
    if (kind === 'html') return SWDownload(name + '.html', new Blob([exportHTML()], {type:'text/html;charset=utf-8'}));
    if (kind === 'md') return SWDownload(name + '.md', new Blob([toMarkdown(cleanClone())], {type:'text/markdown;charset=utf-8'}));
    if (kind === 'spectra') return SWDownload(name + '.spectra', new Blob([getJSON()], {type:'application/json'}));
    if (kind === 'docx'){ toast('Création du fichier Word…'); const b = await exportDocx(); await SWDownload(name + '.docx', b); toast('Fichier Word téléchargé'); }
  } catch(e){ console.error(e); toast(e.message ? 'Export impossible : ' + e.message : 'Export impossible'); }
}
function exportPop(anchor){
  const lic = !window.SWHome || SWHome.canExport();
  const it = (k, t, s, free) => `<button type="button" data-x="${k}"><b>${t}${!free && !lic ? ' <span class="lk">Licence</span>' : ''}</b><span>${s}</span></button>`;
  openPop(anchor, `<div class="pop-menu">${it('pdf', 'PDF', 'Impression ou « Enregistrer au format PDF », pages fidèles', true)}${it('docx', 'Word (.docx)', 'S\'ouvre dans Word, LibreOffice, Google Docs')}${it('html', 'Page web (.html)', 'Une page autonome, à publier ou envoyer')}${it('md', 'Markdown (.md)', 'Texte structuré pour le web et les wikis')}${it('txt', 'Texte brut (.txt)', 'Le texte seul, sans mise en forme', true)}<hr>${it('spectra', 'Sauvegarde SPECTRA', 'Fichier .spectra, à réimporter tel quel')}</div>`, p => {
    p.onclick = e => { const b = e.target.closest('[data-x]'); if (b) doExport(b.dataset.x); };
  }, 'menu');
}
