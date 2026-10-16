/* ---------- Blocs prêts à glisser (façon Canva) : ils prennent les couleurs et les polices du thème du document ---------- */
const BLOCKS = [
  // Titres
  {id:'hero', cat:'Titres', name:'Grand titre', kw:'titre hero accroche', html:() => '<div class="sw-hero"><p class="sw-kicker">Sur-titre</p><h1>Un titre qui donne envie</h1><p class="sw-lead">Une phrase d\'accroche pour présenter la suite.</p></div>'},
  {id:'secnum', cat:'Titres', name:'Section numérotée', kw:'section numero chapitre', html:() => '<h2 class="sw-secnum"><span>01</span>Titre de la section</h2>'},
  {id:'band', cat:'Titres', name:'Bandeau pleine largeur', kw:'bandeau entete header degrade', html:() => '<div class="sw-band"><p class="sw-kicker">Rubrique</p><h2>Titre du bandeau</h2><p>Un court texte de présentation.</p></div>'},
  {id:'banner', cat:'Titres', name:'Bannière dégradé', kw:'banniere encart degrade', html:() => '<div class="sw-banner"><h3>Message important</h3><p>Mettez en avant une information ou un appel à l\'action.</p></div>'},
  {id:'cover', cat:'Titres', name:'Page de couverture', kw:'couverture page garde cover', html:() => `<div class="sw-cover"><p class="sw-kicker">Document · ${new Date().getFullYear()}</p><h1>Titre du document</h1><p class="sw-lead">Sous-titre ou description courte.</p><div class="sw-cover-meta"><span><b>Auteur</b><br>Votre nom</span><span><b>Date</b><br>${today()}</span></div></div>`},
  {id:'cover-light', cat:'Titres', name:'Couverture claire', kw:'couverture claire minimaliste', html:() => `<div class="sw-cover light"><p class="sw-kicker">Document</p><h1>Titre du document</h1><p class="sw-lead">${today()}</p></div>`},
  // Texte
  {id:'lead', cat:'Texte', name:'Chapeau', kw:'intro chapeau lead', html:() => '<p class="sw-lead">Un paragraphe d\'introduction, plus grand, qui résume l\'essentiel.</p>'},
  {id:'quote', cat:'Texte', name:'Citation mise en avant', kw:'citation quote', html:() => '<div class="sw-quote">Une phrase forte, mise en avant.<cite>— Prénom Nom, fonction</cite></div>'},
  {id:'info', cat:'Texte', name:'Encadré info', kw:'encadre info note callout', html:() => '<div class="sw-callout" data-sw-kind="info"><p><b>Bon à savoir</b>Une information utile pour le lecteur.</p></div>'},
  {id:'tip', cat:'Texte', name:'Encadré astuce', kw:'encadre astuce conseil', html:() => '<div class="sw-callout" data-sw-kind="tip"><p><b>Astuce</b>Un conseil pratique.</p></div>'},
  {id:'warn', cat:'Texte', name:'Encadré attention', kw:'encadre attention alerte', html:() => '<div class="sw-callout" data-sw-kind="warn"><p><b>Attention</b>Un point de vigilance.</p></div>'},
  {id:'ok', cat:'Texte', name:'Encadré validé', kw:'encadre succes valide decision', html:() => '<div class="sw-callout" data-sw-kind="ok"><p><b>Validé</b>Une décision ou un résultat.</p></div>'},
  {id:'code', cat:'Texte', name:'Bloc de code', kw:'code programme', html:() => '<pre><code>// votre code ici</code></pre>'},
  // Mise en page
  {id:'cols2', cat:'Mise en page', name:'Deux colonnes', kw:'colonnes deux', html:() => '<div class="sw-cols"><div class="sw-col"><h3>Colonne 1</h3><p>Texte de la première colonne.</p></div><div class="sw-col"><h3>Colonne 2</h3><p>Texte de la seconde colonne.</p></div></div>'},
  {id:'cols3', cat:'Mise en page', name:'Trois cartes', kw:'colonnes trois cartes', html:() => '<div class="sw-cols" data-cols="3"><div class="sw-card tint"><h3 style="margin-top:0">Atout 1</h3><p>Description courte.</p></div><div class="sw-card tint"><h3 style="margin-top:0">Atout 2</h3><p>Description courte.</p></div><div class="sw-card tint"><h3 style="margin-top:0">Atout 3</h3><p>Description courte.</p></div></div>'},
  {id:'imgtext', cat:'Mise en page', name:'Image et texte', kw:'image texte photo', html:() => `<div class="sw-cols" data-cols="2"><div class="sw-col">${PH_IMG}</div><div class="sw-col"><h3 style="margin-top:0">Titre</h3><p>Un texte qui accompagne l'image. Cliquez sur l'image pour la remplacer.</p></div></div>`},
  {id:'card', cat:'Mise en page', name:'Carte', kw:'carte encadre bordure', html:() => '<div class="sw-card"><h3 style="margin-top:0">Titre de la carte</h3><p>Contenu de la carte.</p></div>'},
  {id:'div-grad', cat:'Mise en page', name:'Séparateur dégradé', kw:'separateur ligne', html:() => '<hr class="sw-divider">'},
  {id:'div-dots', cat:'Mise en page', name:'Séparateur à points', kw:'separateur points', html:() => '<hr class="sw-divider dots">'},
  {id:'space', cat:'Mise en page', name:'Espace', kw:'espace vide marge', html:() => '<div class="sw-space" contenteditable="false"></div>'},
  {id:'pagebreak', cat:'Mise en page', name:'Saut de page', kw:'saut page nouvelle', html:() => PAGEBREAK},
  // Données
  {id:'table', cat:'Données', name:'Tableau', kw:'tableau table', html:() => tableHtml(3, 3, 'sw-table')},
  {id:'table-zebra', cat:'Données', name:'Tableau rayé', kw:'tableau raye zebre', html:() => tableHtml(4, 3, 'sw-table t-zebra')},
  {id:'stats', cat:'Données', name:'Chiffres clés', kw:'chiffres stats kpi nombres', html:() => '<div class="sw-stats"><div class="sw-stat"><b>+24 %</b><span>Croissance</span></div><div class="sw-stat"><b>1 200</b><span>Clients</span></div><div class="sw-stat"><b>98 %</b><span>Satisfaction</span></div></div>'},
  {id:'progress', cat:'Données', name:'Barres de progression', kw:'progression barres competences', html:() => '<div class="sw-progress"><p><span>Objectif A</span><span>80 %</span></p><div class="sw-bar"><i style="width:80%"></i></div></div><div class="sw-progress"><p><span>Objectif B</span><span>55 %</span></p><div class="sw-bar"><i style="width:55%"></i></div></div>'},
  {id:'timeline', cat:'Données', name:'Chronologie', kw:'chronologie timeline planning dates', html:() => '<ul class="sw-timeline"><li><b>Janvier</b>Première étape</li><li><b>Mars</b>Deuxième étape</li><li><b>Juin</b>Livraison</li></ul>'},
  {id:'steps', cat:'Données', name:'Étapes numérotées', kw:'etapes procedure methode', html:() => '<ol class="sw-steps"><li><b>Étape 1</b>Ce qu\'il faut faire.</li><li><b>Étape 2</b>Ce qu\'il faut faire.</li><li><b>Étape 3</b>Ce qu\'il faut faire.</li></ol>'},
  {id:'prices', cat:'Données', name:'Tarifs', kw:'tarifs prix offres', html:() => '<div class="sw-prices"><div class="sw-price"><p>Essentiel</p><b>19 €</b><p>par mois</p></div><div class="sw-price hot"><p>Pro</p><b>49 €</b><p>par mois</p></div><div class="sw-price"><p>Entreprise</p><b>Sur devis</b><p>sur mesure</p></div></div>'},
  // Pratique
  {id:'toc', cat:'Pratique', name:'Sommaire automatique', kw:'sommaire table matieres toc', html:() => '<div class="sw-toc" contenteditable="false" data-sw="toc"></div>'},
  {id:'check', cat:'Pratique', name:'Liste de tâches', kw:'taches checklist cases a cocher todo', html:() => '<ul class="sw-check"><li>Première tâche</li><li>Deuxième tâche</li></ul>'},
  {id:'sign', cat:'Pratique', name:'Signatures', kw:'signature accord', html:() => '<div class="sw-sign"><div><b>Partie 1</b>Date et signature</div><div><b>Partie 2</b>Date et signature</div></div>'},
  {id:'contact', cat:'Pratique', name:'Coordonnées', kw:'contact coordonnees adresse', html:() => '<p class="sw-contact"><span><b>Email</b> contact@exemple.fr</span><span><b>Tél.</b> 03 00 00 00 00</span><span><b>Web</b> exemple.fr</span></p>'},
  {id:'button', cat:'Pratique', name:'Bouton lien', kw:'bouton lien cta', html:() => '<p><a class="sw-btn" href="https://">Texte du bouton</a></p>'},
  {id:'faq', cat:'Pratique', name:'Questions-réponses', kw:'faq questions reponses', html:() => '<div class="sw-faq"><div><b>Une question fréquente ?</b><p>La réponse, en une ou deux phrases.</p></div><div><b>Une autre question ?</b><p>La réponse.</p></div></div>'},
  {id:'date', cat:'Pratique', name:'Date du jour', kw:'date aujourd hui', inline:true, html:() => today()},
];
const PAGEBREAK = '<div class="sw-pagebreak" contenteditable="false" data-sw="pagebreak"></div>';
const PH_IMG = `<figure class="sw-img rounded" data-align="center" style="width:100%"><img alt="" src="data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#EEEAF8"/><path d="M0 200l90-70 70 50 90-90 150 110v60H0z" fill="#D8D0F2"/><circle cx="300" cy="70" r="26" fill="#D8D0F2"/></svg>')}"></figure>`;
function tableHtml(r, c, cls){
  const head = '<thead><tr>' + Array.from({length:c}, (_, i) => `<th>Colonne ${i + 1}</th>`).join('') + '</tr></thead>';
  const body = '<tbody>' + Array.from({length:r - 1}, () => '<tr>' + '<td><br></td>'.repeat(c) + '</tr>').join('') + '</tbody>';
  return `<table class="${cls}">${head}${body}</table>`;
}
/* Éléments : émojis, étiquettes, symboles, formes décoratives */
const EMOJIS = '✅ ✔️ ❌ ⚠️ 💡 📌 📎 📅 ⏰ 📞 ✉️ 📍 🏠 🏗️ 📐 📏 🧱 🔧 🔨 🪟 🚪 🌳 ☀️ 🌙 ⭐ ✨ 🔥 💧 ⚡ 🎯 🚀 📈 📉 💰 💶 🧾 📊 📝 📚 🎓 🧠 💬 👍 👏 🙌 🤝 ❤️ 😊 😉 🎉 🎁 🍽️ ☕'.split(' ');
const SYMBOLS = ['→', '←', '↑', '↓', '⇒', '•', '·', '–', '—', '…', '«', '»', '€', '£', '$', '©', '®', '™', '§', '¶', '°', '±', '×', '÷', '≈', '≠', '≤', '≥', '½', '¼', '¾', '²', '³', 'ⁿ', 'µ', 'Ω', 'α', 'β', 'π', 'Σ', '∞', '✓', '✗', '★', '☆', '♥', '☐', '☑'];
const TAGS = ['Nouveau', 'Important', 'À faire', 'En cours', 'Terminé', 'Urgent', 'Brouillon', 'Validé'];
const SHAPES = [
  {id:'wave', name:'Vague', svg:'<svg viewBox="0 0 600 70" preserveAspectRatio="none"><path d="M0 40C100 0 200 70 300 40S500 0 600 30V70H0z" style="fill:var(--ac)"/><path d="M0 52C120 22 220 74 320 50S520 20 600 44V70H0z" style="fill:var(--ac2);opacity:.6"/></svg>'},
  {id:'prism', name:'Prisme', svg:'<svg viewBox="0 0 600 24" preserveAspectRatio="none"><rect width="86" height="24" fill="#7B2FF7"/><rect x="86" width="86" height="24" fill="#2D6BFF"/><rect x="172" width="86" height="24" fill="#00C2FF"/><rect x="258" width="86" height="24" fill="#22D39A"/><rect x="344" width="86" height="24" fill="#FFC83D"/><rect x="430" width="86" height="24" fill="#FF8A3D"/><rect x="516" width="84" height="24" fill="#FF3D7F"/></svg>'},
  {id:'dots', name:'Pointillés', svg:'<svg viewBox="0 0 600 30"><g style="fill:var(--ac)"><circle cx="15" cy="15" r="5"/><circle cx="45" cy="15" r="5" opacity=".8"/><circle cx="75" cy="15" r="5" opacity=".6"/><circle cx="105" cy="15" r="5" opacity=".4"/><circle cx="135" cy="15" r="5" opacity=".2"/></g></svg>'},
  {id:'circles', name:'Cercles', svg:'<svg viewBox="0 0 600 120"><circle cx="80" cy="60" r="56" style="fill:var(--ac);opacity:.9"/><circle cx="160" cy="60" r="56" style="fill:var(--ac2);opacity:.7"/><circle cx="240" cy="60" r="56" style="fill:var(--ac3);opacity:.6"/></svg>'},
  {id:'arrow', name:'Flèche', svg:'<svg viewBox="0 0 600 60"><path d="M10 30h540" style="stroke:var(--ac)" stroke-width="6" stroke-linecap="round"/><path d="m530 10 30 20-30 20" fill="none" style="stroke:var(--ac)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'},
  {id:'blob', name:'Forme libre', svg:'<svg viewBox="0 0 600 160"><path d="M120 20c60-20 130 10 160 50s10 80-50 90-150 10-190-30S60 40 120 20z" style="fill:var(--soft)"/><path d="M420 30c50-10 120 20 130 70s-60 60-120 50-90-30-80-70 20-40 70-50z" style="fill:var(--ac);opacity:.25"/></svg>'},
];
