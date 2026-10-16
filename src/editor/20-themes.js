/* ---------- Thèmes : couleurs + paire de polices, appliqués à tout le document en un clic (variables CSS) ---------- */
const FONT_Q = {
  'Inter':'ital,wght@0,400;0,500;0,600;0,700;0,800;1,400', 'Plus Jakarta Sans':'ital,wght@0,400;0,600;0,700;0,800;1,400',
  'Poppins':'ital,wght@0,400;0,500;0,600;0,700;0,800;1,400', 'Montserrat':'ital,wght@0,400;0,600;0,700;0,800;1,400',
  'DM Sans':'ital,wght@0,400;0,500;0,700;1,400', 'IBM Plex Sans':'ital,wght@0,400;0,500;0,600;0,700;1,400', 'Space Grotesk':'wght@400;500;600;700',
  'Nunito':'ital,wght@0,400;0,600;0,700;0,800;1,400', 'Lora':'ital,wght@0,400;0,600;0,700;1,400', 'Merriweather':'ital,wght@0,400;0,700;1,400',
  'Source Serif 4':'ital,wght@0,400;0,600;0,700;1,400', 'Playfair Display':'ital,wght@0,400;0,600;0,700;0,800;1,400', 'DM Serif Display':'ital@0;1',
  'Libre Baskerville':'ital,wght@0,400;0,700;1,400', 'Caveat':'wght@400;600;700', 'JetBrains Mono':'wght@400;600',
};
const FONTS = [
  ['Inter', 'sans-serif'], ['Plus Jakarta Sans', 'sans-serif'], ['Poppins', 'sans-serif'], ['Montserrat', 'sans-serif'], ['DM Sans', 'sans-serif'],
  ['IBM Plex Sans', 'sans-serif'], ['Space Grotesk', 'sans-serif'], ['Nunito', 'sans-serif'], ['Lora', 'serif'], ['Merriweather', 'serif'],
  ['Source Serif 4', 'serif'], ['Playfair Display', 'serif'], ['DM Serif Display', 'serif'], ['Libre Baskerville', 'serif'], ['Caveat', 'cursive'],
  ['JetBrains Mono', 'monospace'], ['Arial', 'sans-serif'], ['Georgia', 'serif'], ['Times New Roman', 'serif'], ['Verdana', 'sans-serif'], ['Courier New', 'monospace'],
];
const fontStack = n => { const f = FONTS.find(x => x[0] === n); return `'${String(n).replace(/'/g, '')}', ${f ? f[1] : 'sans-serif'}`; };
const loadedFonts = new Set(['Inter', 'Plus Jakarta Sans', 'JetBrains Mono']); // déjà chargées par la page
function ensureFont(name){
  if (!name || loadedFonts.has(name) || !FONT_Q[name]) return; loadedFonts.add(name);
  const l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, '+')}:${FONT_Q[name]}&display=swap`;
  document.head.appendChild(l);
}
const THEMES = [
  {id:'spectra', name:'Spectra', ac:'#6D3BFF', ac2:'#00A6E8', ac3:'#FF4D8D', ink:'#1C1830', mut:'#625D78', soft:'#F2EFFF', line:'#E4E0F2', fh:'Plus Jakarta Sans', fb:'Inter', hw:800,
    grad:'linear-gradient(120deg,#7B2FF7 0%,#2D6BFF 32%,#00C2FF 52%,#22D39A 70%,#FFC83D 85%,#FF5E62 100%)'},
  {id:'studio', name:'Studio Prism', ac:'#0A5E8E', ac2:'#03A2AC', ac3:'#071B55', ink:'#0F1B33', mut:'#4A5570', soft:'#EDF6F8', line:'#DDE5EA', fh:'Montserrat', fb:'Inter', hw:800, grad:'linear-gradient(120deg,#071B55,#0A5E8E 60%,#03A2AC)'},
  {id:'moderne', name:'Moderne', ac:'#4F46E5', ac2:'#06B6D4', ac3:'#F59E0B', ink:'#111827', mut:'#4B5563', soft:'#EEF2FF', line:'#E5E7EB', fh:'Space Grotesk', fb:'DM Sans', hw:700, grad:'linear-gradient(120deg,#4F46E5,#06B6D4)'},
  {id:'classique', name:'Classique', ac:'#1F2937', ac2:'#6B7280', ac3:'#9B2C2C', ink:'#111111', mut:'#555555', soft:'#F5F5F4', line:'#D9D9D6', fh:'Libre Baskerville', fb:'Source Serif 4', hw:700, grad:'linear-gradient(120deg,#1F2937,#4B5563)'},
  {id:'elegant', name:'Élégant', ac:'#9A7B4F', ac2:'#2E2A26', ac3:'#C9A96E', ink:'#2B2622', mut:'#6B6259', soft:'#F7F2EA', line:'#E7DED0', fh:'Playfair Display', fb:'Lora', hw:700, grad:'linear-gradient(120deg,#2E2A26,#9A7B4F)'},
  {id:'nature', name:'Nature', ac:'#2F7D4E', ac2:'#7FB35E', ac3:'#E0A526', ink:'#1E2A22', mut:'#55645A', soft:'#EEF6EF', line:'#DCE8DE', fh:'Nunito', fb:'Nunito', hw:800, grad:'linear-gradient(120deg,#1F5E3A,#2F7D4E 50%,#8BBF6A)'},
  {id:'ocean', name:'Océan', ac:'#0E7490', ac2:'#0EA5C6', ac3:'#F97316', ink:'#0B2530', mut:'#4A6670', soft:'#E9F7FA', line:'#D3E8EE', fh:'Montserrat', fb:'IBM Plex Sans', hw:700, grad:'linear-gradient(120deg,#0B3C5D,#0E7490 55%,#22D3EE)'},
  {id:'corail', name:'Corail', ac:'#E8505B', ac2:'#F28C4B', ac3:'#14B8A6', ink:'#2A1E22', mut:'#6E5A60', soft:'#FFF0EE', line:'#F3DEDA', fh:'Poppins', fb:'Poppins', hw:700, grad:'linear-gradient(120deg,#E8505B,#F9A26C)'},
  {id:'minuit', name:'Minuit', ac:'#7C4DEB', ac2:'#DB3E8F', ac3:'#22D3EE', ink:'#15131F', mut:'#5E5A70', soft:'#F3EEFF', line:'#E3DDF2', fh:'DM Serif Display', fb:'Inter', hw:400, grad:'linear-gradient(120deg,#15131F,#3B1F6E 55%,#8B5CF6)'},
  {id:'ardoise', name:'Ardoise', ac:'#334155', ac2:'#64748B', ac3:'#0EA5E9', ink:'#0F172A', mut:'#475569', soft:'#F1F5F9', line:'#E2E8F0', fh:'IBM Plex Sans', fb:'IBM Plex Sans', hw:700, grad:'linear-gradient(120deg,#0F172A,#334155)'},
  {id:'pastel', name:'Pastel', ac:'#6E5FD8', ac2:'#E58AAE', ac3:'#3FB3A6', ink:'#2D2A3E', mut:'#6C6880', soft:'#F5F3FF', line:'#E8E4F7', fh:'DM Sans', fb:'DM Sans', hw:700, grad:'linear-gradient(120deg,#A79BFF,#F2A7C3 55%,#FFD6A5)'},
  {id:'editorial', name:'Éditorial', ac:'#B42318', ac2:'#1D2939', ac3:'#F79009', ink:'#101828', mut:'#475467', soft:'#FEF3F2', line:'#EAECF0', fh:'DM Serif Display', fb:'Source Serif 4', hw:400, grad:'linear-gradient(120deg,#101828,#B42318)'},
  {id:'manuscrit', name:'Carnet', ac:'#2563EB', ac2:'#F59E0B', ac3:'#DB2777', ink:'#1E293B', mut:'#55607A', soft:'#EFF6FF', line:'#DCE6F5', fh:'Caveat', fb:'Nunito', hw:700, grad:'linear-gradient(120deg,#2563EB,#60A5FA)'},
];
const SWAP = {'#':''};
/* spec : {id, ac, ac2, fh, fb, fs, lh} (objet du document) ou "id|ac|ac2" (vignettes) */
function themeVals(spec){
  if (typeof spec === 'string'){ const [id, ac, ac2] = spec.split('|'); spec = {id, ac, ac2}; }
  spec = spec || {};
  const base = THEMES.find(t => t.id === spec.id) || THEMES[0];
  const v = {...base};
  ['ac', 'ac2', 'ac3', 'fh', 'fb', 'ink'].forEach(k => { if (spec[k]) v[k] = spec[k]; });
  v.fs = +spec.fs || 15; v.lh = +spec.lh || 1.55;
  if (spec.ac && spec.ac !== base.ac){ v.soft = mix(spec.ac, '#ffffff', .91); v.grad = `linear-gradient(120deg,${shade(spec.ac, -.25)},${spec.ac} 55%,${spec.ac2 || base.ac2})`; }
  return v;
}
function themeCss(spec){
  const v = themeVals(spec); ensureFont(v.fh); ensureFont(v.fb);
  return `--ac:${v.ac};--ac2:${v.ac2};--ac3:${v.ac3};--ink:${v.ink};--mut:${v.mut};--soft:${v.soft};--line:${v.line};--fh:${fontStack(v.fh).replace(/"/g, "'")};--fb:${fontStack(v.fb).replace(/"/g, "'")};--hw:${v.hw};--fs:${v.fs}px;--lh:${v.lh};--grad:${v.grad}`;
}
const themeKey = spec => [spec?.id || 'spectra', spec?.ac || '', spec?.ac2 || ''].join('|').slice(0, 40);
function hexRgb(h){ h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgbHex(r, g, b){ return '#' + [r, g, b].map(x => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t){ const A = hexRgb(a), B = hexRgb(b); return rgbHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t); }
function shade(a, t){ return t < 0 ? mix(a, '#000000', -t) : mix(a, '#ffffff', t); }
window.SWThemes = {css:themeCss, vals:themeVals, list:THEMES, key:themeKey};

/* Feuille de style des documents (édition, vignettes ; résolue en valeurs fixes pour les exports Word et page web) */
const DOC_CSS = `
.swdoc{font-family:var(--fb);font-size:var(--fs);line-height:var(--lh);color:var(--ink);word-wrap:break-word;overflow-wrap:break-word}
.swdoc>*:first-child{margin-top:0}
.swdoc p{margin:0 0 .75em}
.swdoc h1,.swdoc h2,.swdoc h3,.swdoc h4{font-family:var(--fh);font-weight:var(--hw);line-height:1.2;margin:1.1em 0 .45em;letter-spacing:-.01em}
.swdoc h1{font-size:2.15em;color:var(--ink)}
.swdoc h2{font-size:1.5em;color:var(--ac)}
.swdoc h3{font-size:1.18em;color:var(--ink)}
.swdoc h4{font-size:1em;color:var(--mut);text-transform:uppercase;letter-spacing:.06em}
.swdoc a{color:var(--ac);text-decoration:underline;text-underline-offset:2px}
.swdoc ul,.swdoc ol{margin:0 0 .8em;padding-left:1.5em}
.swdoc li{margin:.18em 0}
.swdoc li::marker{color:var(--ac)}
.swdoc blockquote{margin:1em 0;padding:.4em 0 .4em 1.1em;border-left:3px solid var(--ac);color:var(--mut);font-style:italic;font-size:1.05em}
.swdoc pre{background:#F6F5FB;border:1px solid var(--line);border-radius:10px;padding:12px 14px;font:13px/1.55 'JetBrains Mono',ui-monospace,monospace;white-space:pre-wrap;color:#262338}
.swdoc code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.9em;background:var(--soft);padding:.1em .35em;border-radius:5px}
.swdoc pre code{background:none;padding:0}
.swdoc hr{border:0;border-top:1px solid var(--line);margin:1.4em 0}
.swdoc mark{background:#FFF1A8;color:inherit;padding:0 .1em;border-radius:3px}
.swdoc img{max-width:100%;height:auto}
.swdoc table{border-collapse:collapse;width:100%;margin:.6em 0 1em;font-size:.95em}
.swdoc th,.swdoc td{padding:8px 10px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line)}
.swdoc th{font-weight:700;color:var(--ink)}
.swdoc table.sw-table thead th,.swdoc table.sw-table tr.h th{background:var(--ac);color:#fff;border-bottom:0}
.swdoc table.sw-table thead th:first-child{border-top-left-radius:8px}.swdoc table.sw-table thead th:last-child{border-top-right-radius:8px}
.swdoc table.t-zebra tbody tr:nth-child(even) td{background:var(--soft)}
.swdoc table.t-grid td,.swdoc table.t-grid th{border:1px solid var(--line)}
.swdoc table.t-soft thead th{background:var(--soft);color:var(--ac)}
.swdoc table .num,.swdoc td.r,.swdoc th.r{text-align:right}
.swdoc table tfoot td{font-weight:700;border-top:2px solid var(--ink);border-bottom:0}
.swdoc figure{margin:1em auto}
.swdoc figure.sw-img{display:block;max-width:100%}
.swdoc figure.sw-img img{display:block;width:100%;border-radius:4px}
.swdoc figure.sw-img[data-align="left"]{float:left;margin:.2em 1.4em .8em 0}
.swdoc figure.sw-img[data-align="right"]{float:right;margin:.2em 0 .8em 1.4em}
.swdoc figure.sw-img[data-align="center"]{margin-left:auto;margin-right:auto}
.swdoc figure.sw-img.rounded img{border-radius:16px}
.swdoc figure.sw-img.shadow img{box-shadow:0 10px 28px rgb(20 16 40 / .22)}
.swdoc figure.sw-img.frame img{border:6px solid #fff;box-shadow:0 0 0 1px var(--line),0 6px 18px rgb(20 16 40 / .14)}
.swdoc figure.sw-img.circle img{border-radius:50%;aspect-ratio:1;object-fit:cover}
.swdoc figcaption{font-size:.82em;color:var(--mut);text-align:center;margin-top:.5em}
.swdoc .sw-clear{clear:both}
.swdoc .sw-kicker{font:700 .78em/1.2 var(--fb);letter-spacing:.14em;text-transform:uppercase;color:var(--ac);margin:0 0 .5em}
.swdoc .sw-lead{font-size:1.2em;line-height:1.5;color:var(--mut)}
.swdoc .sw-small{font-size:.85em;color:var(--mut)}
.swdoc .sw-grad-text{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.swdoc .sw-callout{margin:1em 0;padding:14px 18px;border-radius:14px;background:var(--soft);border-left:4px solid var(--ac)}
.swdoc .sw-callout>*:last-child{margin-bottom:0}
.swdoc .sw-callout[data-sw-kind="info"]{background:#EAF4FF;border-color:#2F80ED}
.swdoc .sw-callout[data-sw-kind="tip"]{background:#F3EEFF;border-color:#7C4DFF}
.swdoc .sw-callout[data-sw-kind="warn"]{background:#FFF6E6;border-color:#F2A100}
.swdoc .sw-callout[data-sw-kind="ok"]{background:#EAF8F0;border-color:#1E9E5A}
.swdoc .sw-callout[data-sw-kind="danger"]{background:#FDEDED;border-color:#D93636}
.swdoc .sw-callout b:first-child{display:block;margin-bottom:.2em}
.swdoc .sw-cols{display:grid;grid-template-columns:repeat(var(--n,2),minmax(0,1fr));gap:22px;margin:.8em 0}
.swdoc .sw-cols[data-cols="3"]{--n:3}.swdoc .sw-cols[data-cols="4"]{--n:4}
.swdoc .sw-cols[data-cols="1-2"]{grid-template-columns:1fr 2fr}.swdoc .sw-cols[data-cols="2-1"]{grid-template-columns:2fr 1fr}
.swdoc .sw-col>*:last-child{margin-bottom:0}
.swdoc .sw-card{border:1px solid var(--line);border-radius:14px;padding:16px 18px;background:#fff}
.swdoc .sw-card.tint{background:var(--soft);border-color:transparent}
.swdoc .sw-cover{margin:calc(-1 * var(--mt,72px)) calc(-1 * var(--mr,72px)) 0 calc(-1 * var(--ml,72px));padding:calc(var(--mt,72px) + 40px) calc(var(--ml,72px) + 8px) var(--mb,72px);height:var(--ph,1123px);box-sizing:border-box;background:var(--grad);color:#fff;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;position:relative}
.swdoc .sw-cover h1,.swdoc .sw-cover h2,.swdoc .sw-cover h3,.swdoc .sw-cover p,.swdoc .sw-cover .sw-kicker{color:#fff}
.swdoc .sw-cover h1{font-size:3.1em;margin:.2em 0 .3em}
.swdoc .sw-cover .sw-lead{color:rgb(255 255 255 / .86)}
.swdoc .sw-cover.light{background:var(--soft);color:var(--ink)}
.swdoc .sw-cover.light h1,.swdoc .sw-cover.light p{color:var(--ink)}.swdoc .sw-cover.light .sw-kicker{color:var(--ac)}.swdoc .sw-cover.light .sw-lead{color:var(--mut)}
.swdoc .sw-cover.light::before{content:"";position:absolute;right:-12%;top:-8%;width:62%;aspect-ratio:1;border-radius:50%;background:var(--grad);opacity:.9}
.swdoc .sw-cover-meta{display:flex;gap:28px;flex-wrap:wrap;margin-top:28px;padding-top:16px;border-top:1px solid rgb(255 255 255 / .35);font-size:.9em}
.swdoc .sw-cover.light .sw-cover-meta{border-color:var(--line)}
.swdoc .sw-band{margin:0 calc(-1 * var(--mr,72px)) 1.2em calc(-1 * var(--ml,72px));padding:30px var(--ml,72px);background:var(--grad);color:#fff}
.swdoc .sw-band.top{margin-top:calc(-1 * var(--mt,72px))}
.swdoc .sw-band h1,.swdoc .sw-band h2,.swdoc .sw-band p,.swdoc .sw-band .sw-kicker{color:#fff;margin-top:0}
.swdoc .sw-band>*:last-child{margin-bottom:0}
.swdoc .sw-banner{border-radius:18px;padding:22px 26px;background:var(--grad);color:#fff;margin:1em 0}
.swdoc .sw-banner h2,.swdoc .sw-banner h3,.swdoc .sw-banner p{color:#fff;margin-top:0}
.swdoc .sw-banner>*:last-child{margin-bottom:0}
.swdoc .sw-hero{margin:.4em 0 1.2em}
.swdoc .sw-hero h1{font-size:2.6em;margin:.1em 0 .25em}
.swdoc .sw-secnum{display:flex;align-items:baseline;gap:14px}
.swdoc .sw-secnum>span{font:var(--hw) 2.2em/1 var(--fh);color:var(--ac);opacity:.35}
.swdoc .sw-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:14px;margin:1em 0}
.swdoc .sw-stat{background:var(--soft);border-radius:14px;padding:14px 16px}
.swdoc .sw-stat b{display:block;font:var(--hw) 2em/1.1 var(--fh);color:var(--ac)}
.swdoc .sw-stat span{font-size:.85em;color:var(--mut)}
.swdoc ol.sw-steps{list-style:none;padding:0;counter-reset:st;margin:1em 0}
.swdoc ol.sw-steps>li{counter-increment:st;position:relative;padding:2px 0 14px 52px;margin:0}
.swdoc ol.sw-steps>li::before{content:counter(st);position:absolute;left:0;top:0;width:34px;height:34px;border-radius:50%;background:var(--ac);color:#fff;display:grid;place-items:center;font:700 .95em/34px var(--fh);text-align:center}
.swdoc ol.sw-steps>li b:first-child{display:block}
.swdoc .sw-timeline{list-style:none;padding:0 0 0 22px;margin:1em 0;border-left:2px solid var(--line)}
.swdoc .sw-timeline>li{position:relative;padding:0 0 14px 14px;margin:0}
.swdoc .sw-timeline>li::before{content:"";position:absolute;left:-30px;top:.35em;width:12px;height:12px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 4px #fff}
.swdoc .sw-timeline>li>b:first-child{display:block;color:var(--ac);font-size:.85em;letter-spacing:.05em;text-transform:uppercase}
.swdoc .sw-progress{margin:.5em 0 .9em}
.swdoc .sw-progress>p{display:flex;justify-content:space-between;margin:0 0 .3em;font-size:.92em}
.swdoc .sw-bar{height:10px;border-radius:99px;background:var(--soft);overflow:hidden}
.swdoc .sw-bar>i{display:block;height:100%;border-radius:99px;background:var(--grad)}
.swdoc ul.sw-check{list-style:none;padding-left:0}
.swdoc ul.sw-check>li{position:relative;padding-left:30px}
.swdoc ul.sw-check>li::before{content:"";position:absolute;left:2px;top:.22em;width:15px;height:15px;border:2px solid var(--ac);border-radius:5px;background:#fff;cursor:pointer}
.swdoc ul.sw-check>li[data-done]{color:var(--mut);text-decoration:line-through}
.swdoc ul.sw-check>li[data-done]::before{background:var(--ac) url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'><path d='m5 12.5 4.5 4.5L19 7.5'/></svg>") center/12px no-repeat}
.swdoc .sw-sign{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin:2em 0 1em}
.swdoc .sw-sign>div{border-top:1px solid var(--ink);padding-top:8px;font-size:.9em;color:var(--mut);min-height:70px}
.swdoc .sw-sign>div b{display:block;color:var(--ink)}
.swdoc .sw-contact{display:flex;flex-wrap:wrap;gap:6px 22px;font-size:.9em;color:var(--mut);margin:.4em 0 1em}
.swdoc .sw-contact b{color:var(--ink)}
.swdoc .sw-btn{display:inline-block;padding:.55em 1.2em;border-radius:99px;background:var(--ac);color:#fff!important;text-decoration:none!important;font-weight:700}
.swdoc .sw-tag{display:inline-block;padding:.12em .65em;border-radius:99px;background:var(--soft);color:var(--ac);font-size:.82em;font-weight:700;line-height:1.5}
.swdoc .sw-faq>div{border-bottom:1px solid var(--line);padding:10px 0}
.swdoc .sw-faq>div>b{display:block;color:var(--ink);margin-bottom:.2em}
.swdoc .sw-faq>div>p{margin:0;color:var(--mut)}
.swdoc .sw-prices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:1em 0}
.swdoc .sw-price{border:1px solid var(--line);border-radius:16px;padding:18px;text-align:center}
.swdoc .sw-price.hot{border:2px solid var(--ac);background:var(--soft)}
.swdoc .sw-price b{display:block;font:var(--hw) 1.9em/1.1 var(--fh);color:var(--ac);margin:.2em 0}
.swdoc .sw-price p{margin:.3em 0;font-size:.9em;color:var(--mut)}
.swdoc .sw-quote{margin:1.4em 0;text-align:center;font:italic 1.45em/1.4 var(--fh);color:var(--ink);padding:0 1em}
.swdoc .sw-quote::before{content:"“";display:block;font:700 2.6em/0.8 var(--fh);color:var(--ac)}
.swdoc .sw-quote cite{display:block;font:600 .55em/1.4 var(--fb);font-style:normal;color:var(--mut);margin-top:.8em;letter-spacing:.04em}
.swdoc .sw-divider{border:0;height:3px;border-radius:3px;background:var(--grad);margin:1.6em 0}
.swdoc .sw-divider.dots{height:auto;background:none;text-align:center;color:var(--ac);letter-spacing:.8em;font-size:1.1em}
.swdoc .sw-divider.dots::before{content:"• • •"}
.swdoc .sw-divider.thin{height:1px;background:var(--line)}
.swdoc .sw-space{height:40px}
.swdoc .sw-toc{margin:1em 0;padding:16px 20px;border-radius:14px;background:var(--soft)}
.swdoc .sw-toc>b{display:block;font-family:var(--fh);font-size:1.1em;margin-bottom:.5em;color:var(--ink)}
.swdoc .sw-toc a{display:flex;align-items:baseline;gap:6px;color:var(--ink);text-decoration:none;padding:3px 0}
.swdoc .sw-toc a i{flex:1;border-bottom:1px dotted var(--mut);opacity:.5;transform:translateY(-4px)}
.swdoc .sw-toc a.l2{padding-left:18px;font-size:.95em;color:var(--mut)}
.swdoc .sw-toc a.l3{padding-left:36px;font-size:.9em;color:var(--mut)}
.swdoc .sw-toc a em{font-style:normal;color:var(--ac);font-weight:700;font-size:.9em}
.swdoc .sw-pagebreak{height:22px;margin:0;position:relative;user-select:none}
.swdoc .sw-shape{margin:1em 0;line-height:0}
.swdoc .sw-shape svg{width:100%;height:auto;display:block}
.swdoc .sw-head{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:1.6em}
.swdoc .sw-head .sw-logo{font:var(--hw) 1.5em/1 var(--fh);color:var(--ac)}
.swdoc .sw-right{text-align:right}
.swdoc .sw-center{text-align:center}
.swdoc .sw-muted{color:var(--mut)}
.swdoc .sw-accent{color:var(--ac)}
.swdoc .sw-big{font-size:1.4em}
.swdoc .sw-total{margin-left:auto;width:min(320px,100%)}
.swdoc .sw-total td{border:0;padding:4px 10px}
.swdoc .sw-total tr:last-child td{border-top:2px solid var(--ac);font-weight:800;color:var(--ac);font-size:1.1em;padding-top:8px}
.swdoc .sw-avatar{width:110px;height:110px;border-radius:50%;background:var(--grad);display:grid;place-items:center;color:#fff;font:var(--hw) 2.4em/1 var(--fh)}
.swdoc .sw-skill{display:flex;justify-content:space-between;font-size:.9em;margin:.4em 0 .15em}
`;
