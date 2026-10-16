/* =====================================================================
   IA de SPECTRA Writer : Gemini via Firebase AI Logic (projet Studio Prism), sans serveur.
   À activer une fois dans la console Firebase : AI Logic → Commencer → « Gemini Developer API ».
   Le SDK modulaire est chargé à la première demande seulement (aucun coût au démarrage).
   Limite quotidienne par compte (gratuit / licence), en plus des quotas configurables dans la console.
   ===================================================================== */
const AI_SDK = '13.0.0';
/* gemini-3.6-flash d'abord ; gemini-3.8-flash prend le relais quand le premier est saturé (quotas séparés) */
const AI_MODELS = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash'];
const AI_DAY = {free:25, pro:300, admin:1000};
let aiInit = null, aiBlocked = '', aiBlockedAt = 0;
const aiGone = new Set();   // modèles introuvables pour ce projet
const aiDayKey = () => `sw.ai.${me?.uid || 'x'}.${new Date().toISOString().slice(0, 10)}`;
const aiUsed = () => +store.get(aiDayKey()) || 0;
const aiLimit = () => AI_DAY[planKey()] || AI_DAY.free;
function aiWhy(){
  if (!FIREBASE_CONFIG) return 'Cette version de démonstration n\'a pas d\'IA : elle fonctionne sur le site en ligne de SPECTRA Writer, avec votre compte Studio Prism. Les commandes simples (« tableau 4 × 3 », « mets en rouge »…) marchent partout.';
  if (!me) return 'Connectez-vous pour utiliser l\'IA.';
  if (aiBlocked && Date.now() - aiBlockedAt < 30000) return aiBlocked;   // on retente après 30 s : un réglage corrigé dans la console marche sans recharger
  if (aiUsed() >= aiLimit()) return `Vous avez utilisé vos ${aiLimit()} demandes à l'IA du jour${planKey() === 'free' ? ' (offre gratuite). Une licence SPECTRA Writer en donne bien plus.' : '.'} Le compteur repart demain.`;
  return '';
}
async function aiModel(sys = AI_SYSTEM, name = AI_MODELS[0]){
  if (!aiInit) aiInit = (async () => {
    const base = `https://www.gstatic.com/firebasejs/${AI_SDK}/`;
    const [A, I] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-ai.js')]);
    const app = A.getApps().find(x => x.name === 'sw-ai') || A.initializeApp(FIREBASE_CONFIG, 'sw-ai');
    return {I, ai:I.getAI(app, {backend:new I.GoogleAIBackend()})};
  })().catch(e => { aiInit = null; throw e; });
  const {I, ai} = await aiInit;
  return I.getGenerativeModel(ai, {model:name, systemInstruction:sys,
    generationConfig:{responseMimeType:'application/json', temperature:.7, maxOutputTokens:16384}});
}
const AI_SYSTEM = `Tu es Spectra, l'assistant intégré à SPECTRA Writer, le traitement de texte de Studio Prism. Tu réponds en français (sauf si on te demande une autre langue pour le contenu).
Tu reçois une demande de l'utilisateur et le contexte de son document. Tu réponds UNIQUEMENT par un objet JSON valide, sans texte autour, de la forme :
{"reply":"…","target":"selection|cursor|document|none","html":"…","title":"…","theme":{"id":"…","ac":"#RRGGBB"},"page":{"size":"A4","orient":"p","margins":"normal","numbers":true,"watermark":"","header":"","footer":"","bg":"#ffffff"},"replacements":[{"find":"…","replace":"…"}]}
Tous les champs sauf "reply" et "target" sont facultatifs : n'inclus que ce qui est utile.
- "reply" : une phrase courte qui dit ce que tu proposes (ou répond à une question).
- "target" : "selection" pour remplacer le texte sélectionné (corriger, reformuler, traduire, raccourcir, transformer…) ; "cursor" pour insérer du nouveau contenu à l'endroit du curseur ; "document" pour (re)créer tout le document ; "none" si tu réponds seulement à une question ou ne changes que le thème, la page ou des remplacements.
- "html" : le contenu à insérer, en HTML simple et propre. Balises permises : p, h1, h2, h3, h4, ul, ol, li, blockquote, pre, code, table, thead, tbody, tr, th, td, b, strong, i, em, u, s, a, br, hr, span, div, cite, small, sup, sub. Pas de <html>, <body>, <style>, <script>, ni d'images, ni de styles inline sauf color/background-color/text-align.
  Utilise les composants SPECTRA ci-dessous (mêmes classes, même structure) pour des documents beaux et structurés : grand titre, sections numérotées, encadrés, chiffres clés, chronologie, étapes, cartes, tableaux "sw-table t-zebra", etc. Un document complet commence en général par un grand titre ou une couverture, puis des sections avec des titres h2.
  Quand tu remplaces une sélection, garde sa structure et sa mise en forme, et ne renvoie que le passage remplacé.
- "theme" : seulement si on te demande un style, une ambiance ou des couleurs, ou pour un nouveau document. "id" parmi la liste fournie, "ac" (couleur principale) facultatif.
- "page" : seulement si la demande touche la mise en page. size: A4|A5|A3|Letter|Legal, orient: p|l, margins: normal|narrow|wide|none.
- "title" : le titre du document quand target = "document".
- "replacements" : pour des remplacements précis dans tout le document.
Écris un contenu concret, utile et réaliste (pas de lorem ipsum). Mets des éléments à compléter entre crochets, par exemple [Nom du client].
Refuse poliment (target "none", reply qui explique) toute demande haineuse, violente, sexuelle, illégale ou dangereuse.`;
function aiPrompt(q, c){
  const parts = [`Demande : ${q}`, `Document : « ${c.title} » · thème ${c.theme} · page ${c.page} · ${c.words} mots${c.empty ? ' (document presque vide)' : ''}`,
    `Thèmes disponibles : ${c.themes}`];
  if (c.wantDoc) parts.push('Cette demande porte sur tout le document : renvoie le document complet corrigé (target "document").');
  if (c.selection) parts.push(`Sélection (HTML) :\n${c.selection}`);
  else if (c.around) parts.push(`Autour du curseur :\n${c.around}`);
  if (c.outline) parts.push(`Plan actuel :\n${c.outline}`);
  if (c.wantDoc && c.docHtml) parts.push(`Document complet (HTML) :\n${c.docHtml}`);
  else if (c.docText && !c.empty) parts.push(`Texte du document :\n${c.docText}`);
  parts.push(`Composants SPECTRA :\n${c.blocks}`);
  return parts.join('\n\n');
}
function aiParse(t){
  t = String(t || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return JSON.parse(t); } catch(e){}
  const a = t.indexOf('{'), b = t.lastIndexOf('}'); if (a >= 0 && b > a){ try { return JSON.parse(t.slice(a, b + 1)); } catch(e){} }
  return {reply:'', target:'cursor', html:t.startsWith('<') ? t : t.split(/\n{2,}/).map(p => `<p>${esc(p)}</p>`).join('')};
}
function aiErr(e){
  const m = String(e?.message || e || ''), code = String(e?.code || '');
  if (/Template-Only Mode/i.test(m))
    return {fatal:true, msg:'Le projet Firebase est en « mode modèles uniquement » : il refuse les demandes libres de SPECTRA Writer. Dans la console Firebase : AI Logic → onglet Paramètres → « Modèle » → désactiver « Appliquer le mode modèles uniquement » (Enforce template-only mode), puis Confirmer.'};
  if (/api-not-enabled|has not been used|SERVICE_DISABLED|requires the Firebase AI API/i.test(m + ' ' + code))
    return {fatal:true, msg:'L\'IA n\'est pas encore activée sur le projet Studio Prism. Un administrateur doit cliquer sur « Commencer » dans la console Firebase (AI Logic) : console.firebase.google.com/project/archivision-studioprism/ailogic. Si c\'est fait, patientez quelques minutes.'};
  if (/app.?check/i.test(m)) return {msg:'La demande a été refusée par App Check (protection du projet Firebase). Vérifiez la configuration App Check d\'AI Logic dans la console.'};
  if (/API key|API_KEY|referer|referrer/i.test(m)) return {msg:'La clé du projet Firebase refuse cette demande (restriction de la clé API). Autorisez l\'API « Firebase AI Logic » pour cette clé dans Google Cloud → Identifiants.'};
  if (/403|PERMISSION_DENIED/i.test(m)) return {msg:'Le projet Firebase a refusé la demande (403) : ' + (m.match(/\[403[^\]]*\]\s*([^(]{0,220})/) || [, m.slice(0, 220)])[1].trim()};
  if (/404|not found|is not supported|unknown model/i.test(m)) return {model:true, msg:'Modèle indisponible.'};
  if (/\b429\b|RESOURCE_EXHAUSTED|exceeded your current quota/i.test(m)){
    const wait = Math.ceil(parseFloat((m.match(/retry in ([\d.]+)s/i) || [])[1]) || 60), day = /per.?day|daily/i.test(m);
    return {busy:true, wait:day ? 0 : wait, msg:day ? 'Le quota gratuit du jour de l\'IA (Google) est épuisé pour tout le projet Studio Prism. Il repart demain, ou tout de suite en passant le projet Firebase au forfait Blaze.'
      : `Le quota gratuit de l'IA (quelques demandes par minute pour tout le projet Studio Prism) est atteint. Réessayez dans ${wait} s.`};
  }
  if (/\b(500|503)\b|high demand|overloaded|UNAVAILABLE/i.test(m)) return {busy:true, wait:3, msg:'Les serveurs de Google sont très sollicités en ce moment. Réessayez dans quelques secondes.'};
  if (/blocked|SAFETY|finishReason/i.test(m)) return {msg:'L\'IA a refusé cette demande. Reformulez-la autrement.'};
  if (/Failed to fetch|NetworkError|network|import/i.test(m)) return {msg:'Impossible de joindre l\'IA. Vérifiez votre connexion internet.'};
  return {msg:'Erreur de l\'IA : ' + m.slice(0, 220)};
}
async function aiCall(sys, prompt, onWait){
  const why = aiWhy(); if (why) throw new Error(why);
  const list = AI_MODELS.filter(n => !aiGone.has(n)); let last = null, waited = false;
  for (let i = 0; i < list.length; i++){
    try {
      const model = await aiModel(sys, list[i]);
      const r = await withTimeout(model.generateContent(prompt), 90000, 'ai/timeout');
      store.set(aiDayKey(), aiUsed() + 1);
      return aiParse(r.response.text());
    } catch(e){
      if (e?.code === 'ai/timeout') throw new Error('L\'IA a mis trop de temps à répondre. Réessayez avec une demande plus courte.');
      const x = aiErr(e); console.warn('[SPECTRA Writer] IA', list[i], e); last = x;
      if (x.model){ aiGone.add(list[i]); continue; }
      if (x.busy){
        if (i < list.length - 1) continue;                       // un autre modèle, avec son propre quota
        if (!waited && x.wait && x.wait <= 30){                  // dernier recours : on patiente une fois, puis on recommence
          waited = true; onWait?.(x.wait); await sleep(x.wait * 1000 + 300); i = -1; continue;
        }
      }
      if (x.fatal){ aiBlocked = x.msg; aiBlockedAt = Date.now(); }
      throw new Error(x.msg);
    }
  }
  throw new Error(last?.msg || 'Aucun modèle d\'IA disponible pour le moment.');
}
async function aiRun(q, ctx, onWait){
  const out = await aiCall(AI_SYSTEM, aiPrompt(q, ctx), onWait);
  if (!out.reply && !out.html && !out.theme && !out.page && !out.replacements) throw new Error('L\'IA a renvoyé une réponse vide. Reformulez votre demande.');
  return out;
}
const AI_MOD = `Tu es le modérateur de la bibliothèque publique de modèles de SPECTRA Writer (Studio Prism). On te donne le titre, la description et le texte d'un modèle de document proposé par un utilisateur.
Réponds UNIQUEMENT par un objet JSON : {"ok":true,"summary":"une phrase en français qui résume le modèle et ton avis","reasons":["…"]}.
"ok" vaut false si le contenu est haineux, violent, sexuel, discriminatoire, illégal, dangereux, trompeur (arnaque, faux document officiel, usurpation), du spam ou de la publicité agressive, s'il contient des données personnelles réelles apparentes (nom complet avec adresse, téléphone, email, IBAN ou numéro d'identité qui semblent réels), ou s'il est vide, absurde ou sans intérêt comme modèle.
Les zones à compléter entre crochets, les coordonnées d'exemple (06 00 00 00 00, contact@exemple.fr…) et les personnes fictives sont normales. "reasons" liste les problèmes trouvés (vide si aucun).`;
async function aiModerate(text){ const r = await aiCall(AI_MOD, text); return {ok:r.ok !== false, summary:String(r.summary || r.reply || ''), reasons:Array.isArray(r.reasons) ? r.reasons.map(String).slice(0, 6) : []}; }
window.SWAI = {available:() => !aiWhy(), why:aiWhy, run:aiRun, moderate:aiModerate, left:() => Math.max(0, aiLimit() - aiUsed()), limit:aiLimit};
