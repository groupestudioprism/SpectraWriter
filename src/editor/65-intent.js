/* ---------- Le Spectre comprend des phrases ----------
   1) moteur d'intentions local : « mets le titre en rouge », « tableau de 4 lignes et 3 colonnes », « remplace X par Y », « passe en paysage puis exporte en PDF »…
      instantané, gratuit, hors ligne.
   2) sinon, l'IA (Gemini, via Firebase AI Logic, voir src/js/ai.js) : rédiger, résumer, corriger, traduire, reformuler, créer un document complet… */
const NUMW = {un:1, une:1, deux:2, trois:3, quatre:4, cinq:5, six:6, sept:7, huit:8, neuf:9, dix:10, onze:11, douze:12, treize:13, quatorze:14, quinze:15, seize:16, vingt:20};
const numOf = s => s == null ? NaN : /^\d+$/.test(s) ? +s : (NUMW[s] ?? NaN);
const NUM_RE = '(\\d+|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt)';
const COLOR_WORDS = [['bleu marine', '#1E3A8A'], ['bleu ciel', '#0EA5E9'], ['bleu fonce', '#1E40AF'], ['vert fonce', '#166534'], ['rouge fonce', '#991B1B'], ['gris fonce', '#374151'], ['gris clair', '#9CA3AF'],
  ['rouge', '#D92D20'], ['bleu', '#2563EB'], ['vert', '#16A34A'], ['jaune', '#CA8A04'], ['orange', '#EA580C'], ['violet', '#7C3AED'], ['mauve', '#9333EA'], ['rose', '#DB2777'], ['noir', '#000000'],
  ['gris', '#6B7280'], ['blanc', '#FFFFFF'], ['marron', '#92400E'], ['brun', '#92400E'], ['turquoise', '#0D9488'], ['cyan', '#0891B2'], ['indigo', '#4F46E5'], ['bordeaux', '#7F1D1D'], ['dore', '#B8860B'], ['or', '#B8860B'],
  ['couleur du theme', 'var(--ac)'], ['couleur principale', 'var(--ac)'], ['accent', 'var(--ac)']];
const HL_WORDS = [['jaune', '#FFF1A8'], ['orange', '#FFE0B2'], ['rose', '#FFD1DC'], ['violet', '#E9D5FF'], ['mauve', '#E9D5FF'], ['bleu', '#D6E4FF'], ['vert', '#CFF5E7'], ['gris', '#E2E8F0'], ['rouge', '#FFD1D1'], ['blanc', '#FFFFFF']];
const PAGE_BG = [['creme', '#FBF7EE'], ['beige', '#F5EFE3'], ['ivoire', '#FFFDF5'], ['blanc', '#FFFFFF'], ['gris', '#F3F4F6'], ['bleu', '#EEF4FF'], ['vert', '#EEFAF3'], ['rose', '#FFF0F5'], ['jaune', '#FFFBEA'], ['violet', '#F5F0FF'], ['noir', '#16131F'], ['nuit', '#16131F']];
const wordIn = (n, w) => new RegExp('(^|[^a-z0-9])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z0-9])').test(n);
const colorIn = (n, list) => { for (const [w, c] of list) if (wordIn(n, w)) return [w, c]; return null; };
const unq = s => String(s || '').trim().replace(/^["«“'‘\s]+|["»”'’\s.!]+$/g, '').trim();
const NEG = /\b(retire|retirer|enleve|enlever|supprime|supprimer|sans|cache|cacher|desactive|desactiver|efface|effacer|plus de|pas de|vire|virer)\b/;

/* s'assure qu'il y a une sélection : sinon, prend le paragraphe où se trouve le curseur */
function ensureSel(){
  restoreSel(); if (!inSheet()){ sheet().focus(); caretToEnd(sheet().lastElementChild || sheet()); }
  const s = getSelection(); if (!s.rangeCount) return false;
  if (s.getRangeAt(0).collapsed){ const b = blockOf(s.anchorNode); if (!b) return false; const r = document.createRange(); r.selectNodeContents(b); s.removeAllRanges(); s.addRange(r); }
  E.range = s.getRangeAt(0).cloneRange(); return true;
}
function replaceAllText(find, rep, cs){
  if (!find || E.ro) return 0; flushRecord(); record(); const hits = [];
  const w = document.createTreeWalker(sheet(), NodeFilter.SHOW_TEXT); let n; const qq = cs ? find : find.toLowerCase();
  while ((n = w.nextNode())){ const t = cs ? n.data : n.data.toLowerCase(); let i = 0; while ((i = t.indexOf(qq, i)) >= 0){ const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + find.length); hits.push(r); i += find.length; } }
  hits.reverse().forEach(r => { r.deleteContents(); r.insertNode(document.createTextNode(rep)); });
  sheet().normalize(); if (hits.length) changed({record:true}); return hits.length;
}
function transformSel(fn){
  if (!ensureSel()) return; flushRecord(); record();
  const r = getSelection().getRangeAt(0); const w = document.createTreeWalker(r.commonAncestorContainer.nodeType === 3 ? r.commonAncestorContainer.parentNode : r.commonAncestorContainer, NodeFilter.SHOW_TEXT);
  let n; const list = []; while ((n = w.nextNode())) if (r.intersectsNode(n)) list.push(n);
  list.forEach(t => { const a = t === r.startContainer ? r.startOffset : 0, b = t === r.endContainer ? r.endOffset : t.data.length; t.data = t.data.slice(0, a) + fn(t.data.slice(a, b)) + t.data.slice(b); });
  changed({record:true});
}
function setDocTitle(t){ t = String(t || '').trim().slice(0, 120); if (!t) return; E.doc.title = t; E.autoTitle = false; const ti = $('#docTitle'); if (ti) ti.value = t; emitChange(true); renderDeco(); }
function goPage(n){ const pg = $$('#pageDeco .pg')[n - 1]; if (!pg) return toast(`Le document a ${E.pages} page${E.pages > 1 ? 's' : ''}.`); pg.scrollIntoView({behavior:'smooth', block:'start'}); }
function removeEmpty(){ flushRecord(); record(); let k = 0; $$(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4', sheet()).forEach((p, i, all) => { if (isEmptyBlock(p) && all.length - k > 1){ const nx = p.nextElementSibling; if (nx && isEmptyBlock(nx) || p.previousElementSibling && isEmptyBlock(p.previousElementSibling) || i === 0){ p.remove(); k++; } } }); changed({record:true}); paginate(); return k; }

/* une phrase → une liste d'intentions {t:libellé, run} (null si rien de compris) */
function parseOne(raw){
  let n = norm(raw).replace(/[’']/g, ' ').replace(/[!?.]+$/g, '').replace(/\s+/g, ' ').trim();
  n = n.replace(/^(?:(?:est-ce que |peux|pourrais|pouvez|pourriez)[- ]?(?:tu|vous) |s il (?:te|vous) plait,? |stp,? |svp,? |je (?:veux|voudrais) (?:que tu )?|j aimerais (?:que tu )?|il faut |merci de |fais en sorte que )+/, '').replace(/,? (?:s il (?:te|vous) plait|stp|svp|merci)$/, '').trim();
  const r = raw.trim().replace(/[!?]+$/, '');
  const out = [], add = (t, run) => out.push({t, run});
  const neg = NEG.test(n), selWord = /\b(selection|selectionne|ce texte|le texte|ce paragraphe|ce passage|la phrase|cette phrase|ce mot)\b/.test(n);
  let m;
  /* remplacer partout */
  if ((m = r.match(/^(?:remplacer?|remplacez|changer?|changez|substituer?)\s+(?:partout\s+)?(?:tous les |toutes les |toute |tout )?(.+?)\s+par\s+(.+?)(?:\s+partout)?$/i)) && !/\b(theme|police)\b/.test(n)){
    const a = unq(m[1]), b = unq(m[2]); if (a) return [{t:`Remplacer « ${a} » par « ${b} » partout`, run:() => { const k = replaceAllText(a, b, /[A-Z]/.test(a)); toast(k ? `${k} remplacement${k > 1 ? 's' : ''}` : `« ${a} » n'apparaît pas dans le document`); }}];
  }
  /* renommer */
  if ((m = r.match(/^(?:renomm\w*|appel\w*|intitul\w*|nomm\w*)\s+(?:le\s+|ce\s+)?(?:document|fichier)\s*(?:en|:|comme|«)?\s*(.+)$/i)) || (m = r.match(/^(?:titre du document|nom du document)\s*:?\s*(.+)$/i))){ const t = unq(m[1]); if (t) return [{t:`Renommer le document « ${t} »`, run:() => { setDocTitle(t); toast('Document renommé'); }}]; }
  /* chercher */
  if ((m = r.match(/^(?:cherch\w*|trouv\w*|rechercher?)\s+(?:le mot |l'expression |le texte )?(.+)$/i)) && !/\b(document|fichier|modele)\b/.test(n)){ const q = unq(m[1]); if (q) return [{t:`Chercher « ${q} »`, run:() => { openFind(false); $('#frQ').value = q; frSearch(); frGo(1); }}]; }
  /* annuler / rétablir */
  if (/^(annule|annuler|defais|defaire|ctrl z)( (ca|la derniere action|la derniere modification))?$/.test(n)) return [{t:'Annuler', run:undo}];
  if (/^(retablis|retablir|refais|refaire)( (ca|la derniere action))?$/.test(n)) return [{t:'Rétablir', run:redo}];
  /* tableau */
  if (/\btableaux?\b/.test(n) && !/\b(tableau de bord)\b/.test(n) && !neg){
    let rows = NaN, cols = NaN;
    if ((m = n.match(new RegExp(NUM_RE + '\\s*(?:x|×|\\*|sur|par)\\s*' + NUM_RE)))){ cols = numOf(m[1]); rows = numOf(m[2]); }
    if ((m = n.match(new RegExp(NUM_RE + '\\s*lignes?')))) rows = numOf(m[1]);
    if ((m = n.match(new RegExp(NUM_RE + '\\s*colonnes?')))) cols = numOf(m[1]);
    rows = clamp(rows || 3, 1, 60); cols = clamp(cols || 3, 1, 12);
    const zebra = /\b(raye|rayee|zebre|alterne)\b/.test(n);
    add(`Insérer un tableau de ${rows} ligne${rows > 1 ? 's' : ''} et ${cols} colonne${cols > 1 ? 's' : ''}${zebra ? ' (rayé)' : ''}`, () => insertHTMLBlock(tableHtml(rows, cols, zebra ? 'sw-table t-zebra' : 'sw-table')));
    return out;
  }
  /* page : saut, orientation, format, marges, numéros, filigrane, en-tête, pied, fond, objectif */
  if (/\b(saut de page|nouvelle page|page suivante)\b/.test(n) && !/\bva\b/.test(n)) add('Insérer un saut de page', () => insertHTMLBlock(PAGEBREAK + '<p><br></p>'));
  if (/\bpaysage\b/.test(n)) add('Orientation paysage', () => setPage({orient:'l'}));
  else if (/\bportrait\b/.test(n)) add('Orientation portrait', () => setPage({orient:'p'}));
  if ((m = n.match(/\b(a3|a4|a5|letter|lettre us|legal|format lettre)\b/))){ const k = {a3:'A3', a4:'A4', a5:'A5', letter:'Letter', 'lettre us':'Letter', 'format lettre':'Letter', legal:'Legal'}[m[1]]; add('Format ' + k, () => setPage({size:k})); }
  if (/\bmarges?\b/.test(n)){ const k = /etroit|petit|fin|reduit/.test(n) ? 'narrow' : /larg|grand/.test(n) ? 'wide' : /aucun|sans|zero|pleine/.test(n) || neg ? 'none' : 'normal';
    add('Marges ' + {narrow:'étroites', wide:'larges', none:'aucune', normal:'normales'}[k], () => setPage({margins:k})); }
  if (/\b(numeros? de pages?|numerotation|pagination|numerote)\b/.test(n)) add(neg ? 'Retirer les numéros de page' : 'Ajouter les numéros de page', () => setPage({numbers:!neg, numStyle:/\bsur\b|\/|total/.test(n) ? 'np' : E.doc.page.numStyle}));
  if (/\bfiligrane\b/.test(n)){ if (neg) add('Retirer le filigrane', () => setPage({watermark:''}));
    else { const t = unq((r.match(/filigrane\s*(?:«|"|:|avec(?: le texte)?|indiquant|qui dit|disant)?\s*(.*)$/i) || [])[1] || '') || 'BROUILLON'; add(`Filigrane « ${t.toUpperCase()} »`, () => setPage({watermark:t.toUpperCase().slice(0, 40)})); } }
  else if (/\bconfidentiel\b/.test(n) && /\b(marque|tampon|mention)\b/.test(n)) add('Filigrane « CONFIDENTIEL »', () => setPage({watermark:'CONFIDENTIEL'}));
  for (const [re, key, lab] of [[/en-?t[eê]te/i, 'header', 'En-tête'], [/pied de page/i, 'footer', 'Pied de page']]){
    if (!re.test(r)) continue;
    if (neg){ add(`Retirer ${key === 'header' ? 'l\'en-tête' : 'le pied de page'}`, () => setPage({[key]:''})); continue; }
    const t = unq((r.match(new RegExp(re.source + '\\s*(?::|«|"|avec(?: le texte)?|indiquant|qui dit|disant)?\\s*(.*)$', 'i')) || [])[1] || '');
    add(`${lab} « ${t || (key === 'header' ? '{titre}' : 'Page {page} sur {pages}')} »`, () => setPage({[key]:t || (key === 'header' ? '{titre}' : 'Page {page} sur {pages}')}));
  }
  if (/\bfond\b/.test(n) && /\bpage\b/.test(n)){ const c = colorIn(n, PAGE_BG); if (c) add(`Fond de page ${c[0]}`, () => setPage({bg:c[1]})); else if (neg) add('Fond de page blanc', () => setPage({bg:'#ffffff'})); }
  if ((m = n.match(/objectif (?:de )?(\d[\d ]*) ?mots/))){ const g = +m[1].replace(/\s/g, ''); add(`Objectif de ${g.toLocaleString('fr-FR')} mots`, () => { E.doc.page.goal = g; emitChange(); updateStatus(); openPanel('outline'); }); }
  if (out.length) return out;
  /* thème du document */
  const th = THEMES.find(t => wordIn(n, norm(t.name)) || wordIn(n, t.id));
  if (th && (/\b(theme|style|ambiance|look|apparence|habillage|design)\b/.test(n) || n === norm(th.name) || n === th.id)) return [{t:'Thème ' + th.name, run:() => { applyTheme({id:th.id, ...(E.doc.theme.fs ? {fs:E.doc.theme.fs} : {}), ...(E.doc.theme.lh ? {lh:E.doc.theme.lh} : {})}); toast('Thème ' + th.name + ' appliqué'); }}];
  if (/\b(couleur principale|couleur du theme|couleur d accent|couleurs? du document)\b/.test(n)){ const c = colorIn(n, COLOR_WORDS.filter(x => x[1][0] === '#')); if (c) return [{t:`Couleur principale ${c[0]}`, run:() => applyTheme({...E.doc.theme, ac:c[1]})}]; }
  /* police */
  const font = FONTS.find(([f]) => wordIn(n, norm(f)));
  if (font && (/\b(police|ecri\w*|typo\w*|font|caractere|en)\b/.test(n))){
    if (/\b(document|tout|partout|titres|corps|texte entier)\b/.test(n)){ const k = /\btitres?\b/.test(n) ? 'fh' : /\bcorps\b/.test(n) ? 'fb' : ''; return [{t:`Police ${font[0]} pour ${k === 'fh' ? 'les titres' : k === 'fb' ? 'le texte' : 'tout le document'}`, run:() => applyTheme({...E.doc.theme, ...(k ? {[k]:font[0]} : {fh:font[0], fb:font[0]})})}]; }
    return [{t:`Police ${font[0]} sur la sélection`, run:() => { ensureFont(font[0]); if (ensureSel()) inlineStyle('font-family', fontStack(font[0])); }}];
  }
  /* taille */
  if ((m = n.match(/\b(?:taille|corps|en)\s*(?:de\s*|a\s*)?(\d{1,2}(?:[.,]\d)?)\s*(?:pt|points?|px)?\b/)) && /\b(taille|pt|points?|corps)\b/.test(n)){
    const v = parseFloat(m[1].replace(',', '.')); if (v >= 6 && v <= 96){
      if (/\b(document|tout le texte|texte du document|partout)\b/.test(n)) return [{t:`Texte du document en ${v} pt`, run:() => applyTheme({...E.doc.theme, fs:Math.round(v * 4 / 3)})}];
      return [{t:`Taille ${v} pt sur la sélection`, run:() => { if (ensureSel()) inlineStyle('font-size', v + 'pt'); }}];
    }
  }
  if (/\b(plus grand|agrandi\w*|plus gros)\b/.test(n) && !/\bmarge/.test(n)) add('Agrandir le texte sélectionné', () => { if (ensureSel()) stepSize(1); });
  if (/\b(plus petit|rapetiss\w*|reduis la taille|plus fin)\b/.test(n) && !/\bmarge/.test(n)) add('Réduire le texte sélectionné', () => { if (ensureSel()) stepSize(-1); });
  /* styles de paragraphe */
  if ((m = n.match(/\b(?:titre|title|intertitre)\s*(?:de niveau\s*)?([1-4]|un|deux|trois|quatre)\b/)) && !/\bdocument\b/.test(n)){ const lv = numOf(m[1]); add(`Titre ${lv}`, () => setBlock('h' + lv)); }
  else if (/\b(sous-titre|sous titre)\b/.test(n) && /\b(en|transforme|mets|fais|change)\b/.test(n)) add('Titre 2', () => setBlock('h2'));
  else if (/\b(texte normal|paragraphe normal|corps de texte)\b/.test(n)) add('Texte normal', () => setBlock('p'));
  else if (/\bcitation\b/.test(n) && /\b(en|transforme|mets|fais|change)\b/.test(n)) add('Citation', () => setBlock('blockquote'));
  else if (/\bchapeau\b/.test(n) && /\b(en|transforme|mets|fais|change)\b/.test(n)) add('Chapeau', () => setBlock('p', 'sw-lead'));
  if (/\bliste (a puces|non numerotee|simple)\b/.test(n) || /\b(puces)\b/.test(n)) add('Liste à puces', () => cmd('insertUnorderedList'));
  else if (/\bliste numerotee\b|\bnumerote\w* (la liste|les lignes|ces lignes)\b/.test(n)) add('Liste numérotée', () => cmd('insertOrderedList'));
  else if (/\b(liste de taches|cases a cocher|checklist|todo)\b/.test(n) && !/\b(ajoute|insere)\b/.test(n)) add('Liste de tâches', toggleChecklist);
  /* mise en forme en ligne */
  if (/\bgras\b/.test(n)) add(neg ? 'Retirer le gras' : 'Gras', () => { if (ensureSel()) cmd('bold'); });
  if (/\bitalique\b/.test(n)) add(neg ? 'Retirer l\'italique' : 'Italique', () => { if (ensureSel()) cmd('italic'); });
  if (/\bsouligne\w*\b/.test(n) && !/\bsurligne/.test(n)) add(neg ? 'Retirer le soulignement' : 'Souligné', () => { if (ensureSel()) cmd('underline'); });
  if (/\b(barre|barrer|rature)\b/.test(n)) add('Barré', () => { if (ensureSel()) cmd('strikeThrough'); });
  if (/\b(en majuscules?|tout en capitales?|en capitales?)\b/.test(n)) add('Mettre en majuscules', () => transformSel(s => s.toLocaleUpperCase('fr-FR')));
  else if (/\ben minuscules?\b/.test(n)) add('Mettre en minuscules', () => transformSel(s => s.toLocaleLowerCase('fr-FR')));
  else if (/\b(majuscule au debut|premiere lettre en majuscule|capitalise)\b/.test(n)) add('Majuscule à chaque mot', () => transformSel(s => s.toLocaleLowerCase('fr-FR').replace(/(^|[\s'’(-])(\p{L})/gu, (_, a, b) => a + b.toLocaleUpperCase('fr-FR'))));
  if (/\b(surlign\w*|fluo|stabilo|marque en)\b/.test(n) || (/\bfond\b/.test(n) && !/\bpage\b/.test(n))){
    if (neg) add('Retirer le surlignage', () => { if (ensureSel()) inlineStyle('background-color', 'transparent', true); });
    else { const c = colorIn(n, HL_WORDS) || ['jaune', '#FFF1A8']; add(`Surligner en ${c[0]}`, () => { if (ensureSel()) inlineStyle('background-color', c[1], true); }); }
  } else {
    const c = colorIn(n.replace(/\bfond\b.*$/, ''), COLOR_WORDS);
    if (c && (/\b(en|couleur|colore\w*|texte|ecri\w*|mets|passe|met)\b/.test(n))) add(`Texte en ${c[0]}`, () => { if (ensureSel()) inlineStyle('color', c[1]); });
  }
  if (/\b(centre|centrer|centree?s?|au centre|au milieu)\b/.test(n)) add('Centrer', () => cmd('justifyCenter'));
  else if (/\b(a droite|aligne\w* a droite|ferre a droite)\b/.test(n)) add('Aligner à droite', () => cmd('justifyRight'));
  else if (/\b(a gauche|aligne\w* a gauche)\b/.test(n)) add('Aligner à gauche', () => cmd('justifyLeft'));
  else if (/\bjustifi\w*\b/.test(n)) add('Justifier', () => cmd('justifyFull'));
  if (/\b(efface|enleve|retire|supprime)\w* (la |toute la )?mise en forme\b|\bsans mise en forme\b/.test(n)) add('Effacer la mise en forme', clearFormat);
  if (/\binterligne\b/.test(n) && (m = n.match(/(\d(?:[.,]\d+)?)/))){ const v = m[1].replace(',', '.'); add(`Interligne ${v.replace('.', ',')}`, () => { if (ensureSel()) setLineHeight(v); }); }
  if (out.length) return out;
  /* insérer un bloc */
  if (/^(ajoute|ajouter|insere|inserer|mets|mettre|met|place|placer|cree|creer|fais|faire|rajoute|colle|nouveau|nouvelle|un|une|des|le|la)\b/.test(n) || /\b(bloc|encadre|section)\b/.test(n)){
    if (/\b(image|photo|illustration)\b/.test(n) && !/\b(texte|et)\b/.test(n)) return [{t:'Insérer une image', run:() => $('#edImgFile').click()}];
    if (/\b(date du jour|date d aujourd hui|la date)\b/.test(n)) return [{t:'Insérer la date du jour', run:() => insertInline(today())}];
    if (/\b(sommaire|table des matieres)\b/.test(n)) return [{t:'Insérer un sommaire automatique', run:() => insertBlockById('toc')}];
    const words = n.split(' ').filter(w => w.length > 2 && !/^(ajoute|ajouter|insere|inserer|mets|mettre|place|placer|cree|creer|fais|faire|rajoute|une|des|les|avec|dans|pour|bloc|document|ici|moi)$/.test(w));
    let best = null, bs = 0;
    BLOCKS.forEach(b => { const hay = norm(b.name + ' ' + b.kw); const sc = words.reduce((a, w) => a + (wordIn(hay, w) ? 2 : hay.includes(w.slice(0, 5)) ? 1 : 0), 0) + (n.includes(norm(b.name)) ? 4 : 0); if (sc > bs){ bs = sc; best = b; } });
    if (best && bs >= 2) return [{t:`Insérer : ${best.name}`, run:() => insertBlockById(best.id)}];
    const sh = SHAPES.find(s => n.includes(norm(s.name))); if (sh && /\bforme|decor|vague\b/.test(n)) return [{t:`Insérer la forme ${sh.name}`, run:() => insertHTMLBlock(`<div class="sw-shape" contenteditable="false">${sh.svg}</div>`)}];
  }
  /* exporter, imprimer */
  if (/\b(export\w*|telecharg\w*|enregistre\w* (en|au format|sous)|sauvegarde\w* en|convert\w*|genere\w*)\b/.test(n) || /^(en )?(pdf|docx|word)$/.test(n)){
    const k = /\bpdf\b/.test(n) ? 'pdf' : /\b(word|docx|doc)\b/.test(n) ? 'docx' : /\b(html|page web|site)\b/.test(n) ? 'html' : /\b(markdown|md)\b/.test(n) ? 'md' : /\b(texte brut|txt|texte)\b/.test(n) ? 'txt' : /\b(sauvegarde|spectra)\b/.test(n) ? 'spectra' : '';
    if (k) return [{t:{pdf:'Exporter en PDF', docx:'Exporter en Word (.docx)', html:'Exporter en page web', md:'Exporter en Markdown', txt:'Exporter en texte', spectra:'Télécharger une sauvegarde'}[k], run:() => doExport(k)}];
  }
  if (/^(imprime|imprimer|impression)\b/.test(n)) return [{t:'Imprimer', run:printDoc}];
  /* navigation, affichage */
  if ((m = n.match(new RegExp('\\b(?:va|aller|vas|saute|direction|montre)\\w*\\s*(?:a|vers|sur)?\\s*(?:la\\s*)?page\\s*' + NUM_RE)))) { const p = numOf(m[1]); return [{t:`Aller à la page ${p}`, run:() => goPage(p)}]; }
  if (/\b(debut|haut) du document\b|^(va |aller )?(au )?debut$/.test(n)) return [{t:'Aller au début du document', run:() => { E.scroll.scrollTo({top:0, behavior:'smooth'}); sheet().focus({preventScroll:true}); caretToStart(sheet().firstElementChild || sheet()); }}];
  if (/\b(fin|bas) du document\b|^(va |aller )?(a la )?fin$/.test(n)) return [{t:'Aller à la fin du document', run:() => { E.scroll.scrollTo({top:E.scroll.scrollHeight, behavior:'smooth'}); sheet().focus({preventScroll:true}); caretToEnd(sheet().lastElementChild || sheet()); }}];
  if ((m = n.match(/^(?:va|aller|vas|montre|affiche)\w*\s*(?:a|au|a la|aux|vers)?\s*(?:la section|la partie|le chapitre|au titre)?\s*(.{3,})$/))){
    const q = m[1].trim(), h = $$('h1, h2, h3, h4', sheet()).find(x => norm(x.textContent).includes(q));
    if (h) return [{t:`Aller à « ${h.textContent.trim().slice(0, 60)} »`, run:() => h.scrollIntoView({behavior:'smooth', block:'start'})}];
  }
  if ((m = n.match(/\bzoom\w*\s*(?:a|de)?\s*(\d{2,3})\s*%?/))){ const z = clamp(+m[1], 30, 200); return [{t:`Zoom ${z} %`, run:() => setZoom(z / 100)}]; }
  if (/\b(ajuste|adapte|pleine largeur|zoom auto|taille de l ecran)\b/.test(n)) return [{t:'Ajuster à la largeur', run:() => setZoom(1, true)}];
  if (/\b(mode|interface|ecran|theme)\s*(sombre|nuit|noir|dark)\b/.test(n)) return [{t:'Interface sombre', run:() => { document.documentElement.dataset.theme = 'dark'; lsSet('sw.theme', 'dark'); }}];
  if (/\b(mode|interface|ecran|theme)\s*(clair|jour|light)\b/.test(n)) return [{t:'Interface claire', run:() => { document.documentElement.dataset.theme = 'light'; lsSet('sw.theme', 'light'); }}];
  if (/\b(mode )?(concentration|focus|zen|plein ecran)\b/.test(n)) return [{t:neg ? 'Quitter le mode concentration' : 'Mode concentration', run:() => toggleFocus(!neg)}];
  if (/\b(combien|nombre|compte)\w* (de )?(mots|caracteres|pages|signes)\b|\bstatistiques\b/.test(n)) return [{t:'Statistiques du document', run:infoDlg}];
  if (/\b(typographie|espaces? insecables?|guillemets francais)\b/.test(n)) return [{t:'Typographie française', run:frenchTypo}];
  if (/\b(historique|versions? precedentes?|ancienne version|restaurer)\b/.test(n)) return [{t:'Historique des versions', run:historyDlg}];
  if (/\b(lignes?|paragraphes?) vides?\b/.test(n) && neg) return [{t:'Supprimer les paragraphes vides en trop', run:() => { const k = removeEmpty(); toast(k ? `${k} paragraphe${k > 1 ? 's' : ''} vide${k > 1 ? 's' : ''} supprimé${k > 1 ? 's' : ''}` : 'Aucun paragraphe vide en trop'); }}];
  if (/^(selectionne|selectionner|tout selectionner) (tout|tout le texte|tout le document)$|^tout selectionner$/.test(n)) return [{t:'Tout sélectionner', run:() => { sheet().focus(); document.execCommand('selectAll'); }}];
  if (/\b(vide|efface|supprime)\w* (tout le document|tout le texte|tout le contenu|le document entier|tout)$/.test(n)) return [{t:'Vider le document (Ctrl + Z pour annuler)', run:() => { flushRecord(); record(); sheet().innerHTML = '<h1><br></h1><p><br></p>'; caretToStart(sheet().firstElementChild); changed({record:true}); paginate(); }}];
  if (/\b(nouveau document|nouvelle page blanche|document vierge)\b/.test(n)) return [{t:'Nouveau document', run:() => window.SWHome?.show('templates')}];
  if (/^(accueil|retour|retour a l accueil|quitte|quitter|ferme le document)$/.test(n)) return [{t:'Retour à l\'accueil', run:() => window.SWHome?.show('home')}];
  if (/\b(partage|partager|envoie a|inviter?)\b/.test(n)) return [{t:'Partager le document', run:() => window.SWShareCurrent?.()}];
  if (/\b(duplique|dupliquer|copie du document|fais une copie)\b/.test(n)) return [{t:'Dupliquer le document', run:() => window.SWHome?.duplicateCurrent()}];
  if (/\b(enregistre|sauve|garde)\w* (comme|en) modele\b|\bfais en un modele\b/.test(n)) return [{t:'Enregistrer comme modèle', run:saveTplDlg}];
  if (/\b(publie|publier|partage a la communaute|bibliotheque publique)\b/.test(n)) return [{t:'Publier comme modèle dans la Communauté', run:() => window.SWHome?.publishCurrent?.()}];
  if (/\braccourcis?\b/.test(n)) return [{t:'Raccourcis clavier', run:shortcutsDlg}];
  return out.length ? out : null;
}
/* plusieurs ordres dans une phrase : « passe en paysage puis exporte en PDF », « titre 1, centré et en bleu » */
function parseIntent(raw){
  const s = String(raw || '').trim(); if (s.length < 2) return null;
  const whole = parseOne(s);
  const parts = s.split(/\s*(?:;|\.\s|,?\s+puis\s+|,?\s+ensuite\s+|,?\s+et apr[eè]s\s+|,?\s+et enfin\s+)\s*/i).filter(Boolean);
  if (parts.length > 1){ const all = parts.map(parseOne); if (all.every(Boolean)) return all.flat(); }
  if (whole) return whole;
  const p2 = s.split(/\s*(?:,|\bet\b)\s*/i).filter(x => x.trim().length > 1);
  if (p2.length > 1){ const all = p2.map(parseOne); if (all.every(Boolean)) return all.flat(); }
  return null;
}
function runIntents(list){ restoreSel(); list.forEach((a, i) => setTimeout(() => { try { a.run(); } catch(e){ console.warn(e); } }, 10 + i * 40)); }

/* ---------- l'IA dans le Spectre ---------- */
const AI_QUICK = [
  {t:'Améliorer le style', p:'Améliore le style de la sélection : plus clair, plus fluide, sans changer le sens.', sel:true},
  {t:'Corriger l\'orthographe et la grammaire', p:'Corrige l\'orthographe, la grammaire et la ponctuation de la sélection, sans rien changer d\'autre.', sel:true},
  {t:'Raccourcir', p:'Raccourcis la sélection de moitié en gardant l\'essentiel.', sel:true},
  {t:'Développer', p:'Développe la sélection avec plus de détails et d\'exemples concrets.', sel:true},
  {t:'Ton plus professionnel', p:'Réécris la sélection sur un ton plus professionnel.', sel:true},
  {t:'Traduire en anglais', p:'Traduis la sélection en anglais.', sel:true},
  {t:'Transformer en liste à puces', p:'Transforme la sélection en liste à puces claire.', sel:true},
  {t:'Transformer en tableau', p:'Transforme le contenu de la sélection en tableau SPECTRA bien organisé.', sel:true},
  {t:'Continuer l\'écriture', p:'Continue le texte à partir de l\'endroit où se trouve le curseur, dans le même style, sur un ou deux paragraphes.'},
  {t:'Résumer le document', p:'Écris un résumé du document en 5 points clés, à insérer à l\'endroit du curseur, avec un titre « En bref ».'},
  {t:'Proposer un plan', p:'Propose un plan détaillé (titres et sous-titres, avec une phrase par partie) pour ce document, à insérer à l\'endroit du curseur.'},
  {t:'Relire et corriger tout le document', p:'Corrige l\'orthographe, la grammaire et la typographie de tout le document, sans changer le contenu ni la mise en forme.', doc:true},
];
const AIS = {busy:false, res:null, prompt:'', ctx:null, ctl:0};
const aiOk = () => !!window.SWAI;
function selInfo(){
  const r = E.range && sheet().contains(E.range.commonAncestorContainer) ? E.range : null;
  if (!r || r.collapsed) return {has:false, text:'', html:''};
  const d = document.createElement('div'); d.appendChild(r.cloneContents()); $$('.sw-pbs', d).forEach(x => x.remove());
  return {has:!!d.textContent.trim(), text:d.textContent.trim(), html:d.innerHTML};
}
function aiContext(){
  const s = selInfo(), c = cleanClone(), txt = (c.innerText || c.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
  const at = E.range && sheet().contains(E.range.startContainer) ? topOf(E.range.startContainer) : null;
  return {title:E.doc.title, theme:E.doc.theme.id, page:`${E.doc.page.size} ${E.doc.page.orient === 'l' ? 'paysage' : 'portrait'}`,
    outline:$$('h1, h2, h3', sheet()).filter(h => !h.closest('.sw-toc')).map(h => (h.tagName === 'H1' ? '# ' : h.tagName === 'H2' ? '## ' : '### ') + h.textContent.trim()).filter(x => x.length > 2).slice(0, 60).join('\n'),
    words:countWords(txt), selection:s.has ? s.html.slice(0, 12000) : '', selectionText:s.text.slice(0, 6000), docHtml:c.innerHTML.length < 60000 ? c.innerHTML : '', docText:txt.slice(0, 30000),
    around:at ? (at.previousElementSibling?.textContent || '').slice(-600) + '\n[CURSEUR] ' + at.textContent.slice(0, 600) : '', empty:countWords(txt) < 12,
    themes:THEMES.map(t => t.id).join(', '), blocks:aiCatalogue()};
}
let aiCat = '';
function aiCatalogue(){
  if (aiCat) return aiCat;
  const ids = ['hero', 'secnum', 'band', 'banner', 'cover', 'lead', 'quote', 'info', 'tip', 'warn', 'ok', 'cols2', 'cols3', 'card', 'div-grad', 'table-zebra', 'stats', 'progress', 'timeline', 'steps', 'prices', 'check', 'sign', 'contact', 'faq', 'toc'];
  aiCat = ids.map(id => { const b = BLOCKS.find(x => x.id === id); return b ? `- ${b.name} : ${b.html().replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/\s+/g, ' ').slice(0, 700)}` : ''; }).filter(Boolean).join('\n') + `\n- Saut de page : ${PAGEBREAK}`;
  return aiCat;
}
function spAiItem(q){ return {g:'IA', t:q ? `Demander à l'IA : « ${q.length > 70 ? q.slice(0, 68) + '…' : q} »` : 'Demander à l\'IA', ai:true, run:() => aiAsk(q)}; }
async function aiAsk(prompt, opts = {}){
  prompt = String(prompt || '').trim(); if (!prompt){ $('#spQ').focus(); return; }
  const box = $('#spList'); $('#spectre').hidden = false; $('#spectre').classList.add('ai');
  if (!aiOk() || !window.SWAI.available()){ return aiShow({err:window.SWAI?.why?.() || 'L\'IA de SPECTRA Writer fonctionne sur le site en ligne, avec un compte Studio Prism.'}); }
  AIS.busy = true; AIS.prompt = prompt; AIS.res = null; const ctl = ++AIS.ctl;
  AIS.ctx = aiContext(); if (opts.doc) AIS.ctx.wantDoc = true;
  box.innerHTML = `<div class="ai-view"><p class="ai-q">${escH(prompt)}</p><div class="ai-wait"><i></i><span>Spectra prépare votre demande…</span></div></div>`;
  try {
    const res = await window.SWAI.run(prompt, AIS.ctx, sec => { if (ctl !== AIS.ctl) return; const w = $('#spList .ai-wait span'); if (!w) return; let n = sec;
      const tick = () => { if (ctl !== AIS.ctl || !w.isConnected) return; w.textContent = n > 0 ? `Quota gratuit atteint : nouvel essai automatique dans ${n} s…` : 'Spectra prépare votre demande…'; if (n-- > 0) setTimeout(tick, 1000); }; tick(); });
    if (ctl !== AIS.ctl || $('#spectre').hidden) return;
    AIS.res = res; aiShow(res);
  } catch(e){ if (ctl === AIS.ctl) aiShow({err:e?.message || String(e)}); }
  finally { if (ctl === AIS.ctl) AIS.busy = false; }
}
function aiApplyList(res){
  const l = [];
  if (res.title && res.target === 'document') l.push(`Titre « ${res.title} »`);
  if (res.theme && THEMES.some(t => t.id === res.theme.id)) l.push('Thème ' + THEMES.find(t => t.id === res.theme.id).name + (res.theme.ac ? ' (couleur personnalisée)' : ''));
  if (res.page) Object.entries(res.page).forEach(([k, v]) => { const lab = {size:'Format', orient:'Orientation', margins:'Marges', numbers:'Numéros de page', watermark:'Filigrane', header:'En-tête', footer:'Pied de page', bg:'Fond'}[k]; if (lab) l.push(`${lab} : ${v === true ? 'oui' : v === false ? 'non' : v === 'l' ? 'paysage' : v === 'p' ? 'portrait' : v || 'aucun'}`); });
  (res.replacements || []).forEach(x => l.push(`Remplacer « ${x.find} » par « ${x.replace} »`));
  return l;
}
function aiShow(res){
  const box = $('#spList'); if (!box) return;
  if (res.err){ box.innerHTML = `<div class="ai-view"><p class="ai-q">${escH(AIS.prompt || '')}</p><div class="ai-err"><b>L'IA n'a pas pu répondre</b><p>${escH(res.err)}</p></div><div class="ai-acts"><button type="button" class="ap-btn alt" data-ai="back">Retour</button>${AIS.prompt && aiOk() && window.SWAI.available() ? '<button type="button" class="ap-btn" data-ai="retry">Réessayer</button>' : ''}</div></div>`; return; }
  const html = res.html ? SAN(res.html) : '', acts = aiApplyList(res), s = selInfo();
  const tgt = res.target === 'document' ? 'document' : res.target === 'selection' && s.has ? 'selection' : html ? 'cursor' : 'none';
  const main = tgt === 'document' ? (AIS.ctx?.empty ? 'Créer le document' : 'Remplacer le document') : tgt === 'selection' ? 'Remplacer la sélection' : tgt === 'cursor' ? 'Insérer' : acts.length ? 'Appliquer' : '';
  box.innerHTML = `<div class="ai-view"><p class="ai-q">${escH(AIS.prompt)}</p>${res.reply ? `<p class="ai-reply">${escH(res.reply)}</p>` : ''}
    ${acts.length ? `<ul class="ai-chips">${acts.map(a => `<li>${escH(a)}</li>`).join('')}</ul>` : ''}
    ${html ? `<div class="ai-prev"><div class="ai-prev-in swdoc" style="${themeCss(res.theme?.id ? res.theme : E.doc.theme)}">${html}</div></div>` : ''}
    <div class="ai-acts"><button type="button" class="ap-btn alt" data-ai="back">Retour</button><button type="button" class="ap-btn alt" data-ai="retry">Autre proposition</button>
      ${html && tgt === 'selection' ? '<button type="button" class="ap-btn alt" data-ai="apply" data-tgt="after">Insérer après</button>' : ''}
      ${html && tgt === 'document' && !AIS.ctx?.empty ? '<button type="button" class="ap-btn alt" data-ai="apply" data-tgt="end">Ajouter à la fin</button>' : ''}
      ${main ? `<button type="button" class="ap-btn" data-ai="apply" data-tgt="${tgt}">${main}</button>` : ''}</div>
    <p class="ai-foot">Généré par l'IA : relisez avant de partager. Ctrl + Z annule.</p></div>`;
  [...box.querySelectorAll('[data-ai="apply"]')].pop()?.focus();
}
function aiApply(tgt){
  const res = AIS.res; if (!res) return; closeSpectre(); restoreSel();
  const html = res.html ? SAN(res.html) : '';
  flushRecord(); record();
  if (res.theme && THEMES.some(t => t.id === res.theme.id)) E.doc.theme = {...E.doc.theme, ...res.theme};
  if (res.page){ const p = {}; ['size', 'orient', 'margins', 'numbers', 'watermark', 'header', 'footer', 'bg'].forEach(k => { if (res.page[k] !== undefined) p[k] = res.page[k]; }); if (p.size && !PAGE_SIZES[p.size]) delete p.size; if (p.margins && !MARGINS[p.margins]) delete p.margins; E.doc.page = {...E.doc.page, ...p}; }
  if (res.title && tgt === 'document') setDocTitle(res.title);
  (res.replacements || []).forEach(x => x.find && replaceAllText(x.find, x.replace || '', true));
  if (html){
    if (tgt === 'document'){ sheet().innerHTML = html; if (!/^(P|H[1-6])$/.test(sheet().lastElementChild?.tagName || '')) sheet().insertAdjacentHTML('beforeend', '<p><br></p>'); caretToStart(sheet().firstElementChild || sheet()); E.scroll.scrollTo({top:0}); }
    else if (tgt === 'selection' && E.range && !E.range.collapsed){
      const r = E.range, sb = topOf(r.startContainer), eb = topOf(r.endContainer);
      const tpl = document.createElement('template'); tpl.innerHTML = html;
      const kids = [...tpl.content.children], blocky = kids.some(x => !/^(B|I|U|S|A|SPAN|EM|STRONG|MARK|SUB|SUP|BR|CODE)$/.test(x.tagName));
      const a = document.createRange(); if (sb) a.selectNodeContents(sb); const b = document.createRange(); if (eb) b.selectNodeContents(eb);
      const whole = sb && eb && r.compareBoundaryPoints(Range.START_TO_START, a) <= 0 && r.compareBoundaryPoints(Range.END_TO_END, b) >= 0;
      if (blocky && sb && eb && (whole || sb !== eb || kids.length > 1 || kids[0]?.tagName !== 'P')){
        const S = sheet(); let n = sb; const kill = []; while (n){ kill.push(n); if (n === eb) break; n = n.nextElementSibling; }
        const at = eb.nextSibling; [...tpl.content.childNodes].forEach(x => S.insertBefore(x, at)); kill.forEach(x => x.remove());
      } else { const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('insertHTML', false, kids.length === 1 && kids[0].tagName === 'P' ? kids[0].innerHTML : html); }
    } else if (tgt === 'end'){ const last = sheet().lastElementChild; insertHTMLBlock(html, isEmptyBlock(last) ? undefined : last, 'after'); }
    else if (tgt === 'after' && E.range && sheet().contains(E.range.endContainer)){ insertHTMLBlock(html, topOf(E.range.endContainer), 'after'); }
    else insertHTMLBlock(html);
  }
  applyGeometry(); paginate(); changed({record:true}); emitChange(true); panelRefresh(); toast(res.reply ? res.reply.slice(0, 120) : 'Fait'); AIS.res = null;
}
