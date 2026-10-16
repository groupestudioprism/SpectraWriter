/* ---------- Modèles prêts à l'emploi ({{date}}, {{annee}} remplacés à la création) ---------- */
const T_ROWS = (rows) => rows.map(r => `<tr>${r.map((c, i) => `<td${i && /^[+\d\s.,€%-]+(pts)?$/.test(c) ? ' class="r"' : ''}>${c}</td>`).join('')}</tr>`).join('');
const SW_TEMPLATES = [
  {id:'blank', name:'Document vierge', cat:'Essentiels', desc:'Une page blanche, tous les outils', featured:true, theme:{id:'spectra'}, page:{}, title:'Document sans titre',
    html:'<h1><br></h1><p><br></p>'},

  {id:'rapport', name:'Rapport', cat:'Professionnel', desc:'Couverture, sommaire automatique, chiffres clés', featured:true, theme:{id:'spectra'}, page:{numbers:true, footer:'{titre}'}, title:'Rapport annuel',
    html:`<div class="sw-cover"><p class="sw-kicker">Rapport · {{annee}}</p><h1>Rapport annuel d'activité</h1><p class="sw-lead">Bilan, résultats et perspectives de l'année écoulée, en quelques pages claires.</p><div class="sw-cover-meta"><span><b>Rédigé par</b><br>Votre nom</span><span><b>Date</b><br>{{date}}</span><span><b>Diffusion</b><br>Interne</span></div></div>
<div class="sw-toc" contenteditable="false" data-sw="toc"></div>
<h2>1. Synthèse</h2><p class="sw-lead">L'essentiel en un paragraphe : ce qui a été accompli, ce qui a changé, et ce qui vient ensuite.</p>
<div class="sw-stats"><div class="sw-stat"><b>+38 %</b><span>Chiffre d'affaires</span></div><div class="sw-stat"><b>1 240</b><span>Clients actifs</span></div><div class="sw-stat"><b>96 %</b><span>Satisfaction</span></div><div class="sw-stat"><b>12</b><span>Nouveaux projets</span></div></div>
<p>Remplacez ce texte par votre analyse. Chaque titre de section alimente automatiquement le sommaire ci-dessus, avec ses numéros de page.</p>
<div class="sw-callout" data-sw-kind="tip"><p><b>À retenir</b>Cliquez sur l'onglet « Thèmes » à gauche : tout le rapport change de couleurs et de polices en un clic.</p></div>
<h2>2. Résultats</h2><p>Présentez vos résultats chiffrés. Un tableau se modifie comme dans un tableur : survolez-le pour ajouter des lignes ou des colonnes.</p>
<table class="sw-table t-zebra"><thead><tr><th>Indicateur</th><th class="r">{{annee-1}}</th><th class="r">{{annee}}</th><th class="r">Évolution</th></tr></thead><tbody>${T_ROWS([['Chiffre d\'affaires', '1,2 M€', '1,66 M€', '+38 %'], ['Marge brute', '41 %', '44 %', '+3 pts'], ['Effectif', '18', '24', '+6'], ['Projets livrés', '31', '43', '+12']])}</tbody></table>
<h3>Points forts</h3><ul><li>Lancement de deux nouvelles offres</li><li>Ouverture d'une agence à Lille</li><li>Réduction des délais de livraison de 20 %</li></ul>
<h2>3. Perspectives</h2><ol class="sw-steps"><li><b>Consolider</b>Fidéliser les clients existants et automatiser le suivi.</li><li><b>Développer</b>Ouvrir deux nouveaux marchés régionaux.</li><li><b>Innover</b>Lancer la gamme SPECTRA dans toute l'entreprise.</li></ol>
<p>En conclusion, rédigez ici votre message de fin.</p>`},

  {id:'compte-rendu', name:'Compte rendu de réunion', cat:'Professionnel', desc:'Participants, décisions, actions à suivre', featured:true, theme:{id:'studio'}, page:{numbers:true}, title:'Compte rendu de réunion',
    html:`<div class="sw-band top"><p class="sw-kicker">Compte rendu</p><h1>Réunion de chantier n° 12</h1><p>{{date}} · 9 h 30 – 11 h 00 · Salle de réunion / visioconférence</p></div>
<table class="sw-table t-soft"><thead><tr><th>Participants</th><th>Société</th><th>Rôle</th></tr></thead><tbody>${T_ROWS([['Prénom Nom', 'Studio Prism', 'Animateur'], ['Prénom Nom', 'Client', 'Maître d\'ouvrage'], ['Prénom Nom', 'Entreprise', 'Conducteur de travaux']])}</tbody></table>
<h2>Ordre du jour</h2><ol><li>Avancement depuis la dernière réunion</li><li>Points techniques</li><li>Planning et prochaines étapes</li></ol>
<h2>Points abordés</h2><h3>1. Avancement</h3><p>Résumé des échanges…</p><h3>2. Points techniques</h3><p>Résumé des échanges…</p>
<div class="sw-callout" data-sw-kind="ok"><p><b>Décisions prises</b>Validation du choix des menuiseries ; report de la livraison au 15 du mois prochain.</p></div>
<h2>Actions à suivre</h2><ul class="sw-check"><li>Envoyer les plans mis à jour — <i>Prénom Nom, vendredi</i></li><li>Commander les échantillons — <i>Prénom Nom, sous 8 jours</i></li><li data-done="1">Confirmer la date de la prochaine réunion</li></ul>
<p class="sw-small">Prochaine réunion : à définir. Merci de signaler toute remarque sous 48 heures.</p>`},

  {id:'cv', name:'CV moderne', cat:'Professionnel', desc:'Deux colonnes, compétences en barres', featured:true, theme:{id:'moderne'}, page:{margins:'narrow'}, title:'CV',
    html:`<div class="sw-cols" data-cols="1-2"><div class="sw-col"><div class="sw-avatar">AB</div><p></p><h4>Contact</h4><p class="sw-small">prenom.nom@email.fr<br>06 00 00 00 00<br>Lille, France<br>linkedin.com/in/prenom</p>
<h4>Compétences</h4><div class="sw-progress"><p><span>Gestion de projet</span><span>90 %</span></p><div class="sw-bar"><i style="width:90%"></i></div></div><div class="sw-progress"><p><span>Rédaction</span><span>85 %</span></p><div class="sw-bar"><i style="width:85%"></i></div></div><div class="sw-progress"><p><span>Design</span><span>70 %</span></p><div class="sw-bar"><i style="width:70%"></i></div></div>
<h4>Langues</h4><p class="sw-small">Français — langue maternelle<br>Anglais — courant (C1)<br>Espagnol — intermédiaire</p>
<h4>Centres d'intérêt</h4><p><span class="sw-tag">Photographie</span> <span class="sw-tag">Randonnée</span> <span class="sw-tag">Architecture</span></p></div>
<div class="sw-col"><h1 style="margin-top:0">Prénom Nom</h1><p class="sw-kicker">Chef de projet</p><p class="sw-lead">Deux phrases qui résument votre parcours, vos forces et ce que vous recherchez.</p>
<h2>Expérience</h2><ul class="sw-timeline"><li><b>2022 — aujourd'hui</b><strong>Chef de projet · Entreprise</strong><br>Pilotage de projets de A à Z, équipe de 6 personnes, budget de 2 M€.</li><li><b>2019 — 2022</b><strong>Chargé de mission · Entreprise</strong><br>Mise en place d'outils de suivi, +25 % de productivité.</li><li><b>2017 — 2019</b><strong>Assistant · Entreprise</strong><br>Coordination des plannings et des fournisseurs.</li></ul>
<h2>Formation</h2><ul class="sw-timeline"><li><b>2017</b><strong>Master Management de projet</strong><br>Université, ville</li><li><b>2015</b><strong>Licence</strong><br>Université, ville</li></ul></div></div>`},

  {id:'lettre', name:'Lettre formelle', cat:'Essentiels', desc:'Expéditeur, destinataire, objet, signature', featured:true, theme:{id:'ardoise'}, page:{}, title:'Lettre',
    html:`<div class="sw-head"><div><b>Prénom Nom</b><br>12 rue de l'Exemple<br>59000 Lille<br>06 00 00 00 00 · prenom.nom@email.fr</div><div class="sw-right"><br><br><b>Destinataire</b><br>Service concerné<br>Adresse<br>Code postal Ville</div></div>
<p class="sw-right">Lille, le {{date}}</p>
<p><b>Objet : </b>votre objet ici</p><p><b>Lettre recommandée avec accusé de réception</b></p>
<p>Madame, Monsieur,</p>
<p>Je me permets de vous écrire au sujet de… Exposez ici la situation, en une ou deux phrases claires.</p>
<p>Développez votre demande : les faits, les dates, les références utiles (numéro de dossier, de contrat…).</p>
<p>Je vous remercie par avance de l'attention que vous porterez à ma demande et reste à votre disposition pour tout renseignement complémentaire.</p>
<p>Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.</p>
<p class="sw-right" style="margin-top:2.5em">Prénom Nom<br><span class="sw-small">Signature</span></p>`},

  {id:'facture', name:'Facture', cat:'Commercial', desc:'Lignes, totaux HT/TVA/TTC, mentions légales', featured:true, theme:{id:'spectra'}, page:{}, title:'Facture',
    html:`<div class="sw-head"><div><div class="sw-logo">Votre entreprise</div><p class="sw-small">12 rue de l'Exemple, 59000 Lille<br>SIRET 000 000 000 00000 · TVA FR00000000000<br>contact@entreprise.fr · 03 00 00 00 00</p></div><div class="sw-right"><h1 style="margin:0">FACTURE</h1><p class="sw-small">N° F-{{annee}}-001<br>Date : {{date}}<br>Échéance : à 30 jours</p></div></div>
<div class="sw-cols"><div class="sw-card tint"><p class="sw-kicker">Facturé à</p><p><b>Nom du client</b><br>Adresse du client<br>Code postal Ville</p></div><div class="sw-card"><p class="sw-kicker">Objet</p><p>Description de la mission ou de la commande.</p></div></div>
<table class="sw-table"><thead><tr><th>Désignation</th><th class="r">Qté</th><th class="r">Prix unitaire HT</th><th class="r">Total HT</th></tr></thead><tbody>${T_ROWS([['Prestation 1', '1', '800,00 €', '800,00 €'], ['Prestation 2', '3', '150,00 €', '450,00 €'], ['Fournitures', '1', '120,00 €', '120,00 €']])}</tbody></table>
<table class="sw-total"><tbody><tr><td>Total HT</td><td class="r">1 370,00 €</td></tr><tr><td>TVA 20 %</td><td class="r">274,00 €</td></tr><tr><td>Total TTC</td><td class="r">1 644,00 €</td></tr></tbody></table>
<div class="sw-callout"><p><b>Règlement</b>Par virement : IBAN FR76 0000 0000 0000 0000 0000 000 · BIC XXXXXXXX</p></div>
<p class="sw-small">En cas de retard de paiement, des pénalités au taux de trois fois le taux d'intérêt légal sont exigibles, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement. Pas d'escompte pour paiement anticipé.</p>`},

  {id:'devis', name:'Devis de travaux', cat:'BTP & architecture', desc:'Lots, quantités, totaux, bon pour accord', theme:{id:'studio'}, page:{numbers:true}, title:'Devis',
    html:`<div class="sw-head"><div><div class="sw-logo">Votre entreprise</div><p class="sw-small">Adresse · SIRET · Assurance décennale n° 000000<br>contact@entreprise.fr · 03 00 00 00 00</p></div><div class="sw-right"><h1 style="margin:0">DEVIS</h1><p class="sw-small">N° D-{{annee}}-014<br>Date : {{date}}<br>Valable 3 mois</p></div></div>
<div class="sw-cols"><div class="sw-card tint"><p class="sw-kicker">Client</p><p><b>Nom du client</b><br>Adresse du chantier<br>Code postal Ville</p></div><div class="sw-card"><p class="sw-kicker">Chantier</p><p>Rénovation d'une maison individuelle : isolation, menuiseries et finitions.</p></div></div>
<table class="sw-table t-grid"><thead><tr><th>Lot · désignation</th><th>Unité</th><th class="r">Qté</th><th class="r">PU HT</th><th class="r">Total HT</th></tr></thead><tbody>
<tr class="h"><th colspan="5">01 · Isolation</th></tr>${T_ROWS([['Isolation des combles, laine soufflée R = 7', 'm²', '85', '32,00 €', '2 720,00 €'], ['Isolation des murs par l\'intérieur', 'm²', '64', '58,00 €', '3 712,00 €']])}
<tr class="h"><th colspan="5">02 · Menuiseries extérieures</th></tr>${T_ROWS([['Fenêtre PVC double vitrage 120 × 135', 'u', '6', '620,00 €', '3 720,00 €'], ['Porte d\'entrée aluminium', 'u', '1', '2 150,00 €', '2 150,00 €']])}
<tr class="h"><th colspan="5">03 · Finitions</th></tr>${T_ROWS([['Peinture murs et plafonds', 'm²', '210', '18,00 €', '3 780,00 €']])}</tbody></table>
<table class="sw-total"><tbody><tr><td>Total HT</td><td class="r">16 082,00 €</td></tr><tr><td>TVA 5,5 % (rénovation énergétique)</td><td class="r">884,51 €</td></tr><tr><td>Total TTC</td><td class="r">16 966,51 €</td></tr></tbody></table>
<p class="sw-small">Acompte de 30 % à la signature. Le solde à la réception des travaux. Délai d'exécution : 6 semaines après accord.</p>
<div class="sw-sign"><div><b>L'entreprise</b>Date et signature</div><div><b>Le client</b>Mention « Bon pour accord », date et signature</div></div>`},

  {id:'proposition', name:'Proposition commerciale', cat:'Commercial', desc:'Couverture, offre, tarifs, planning', theme:{id:'corail'}, page:{numbers:true, footer:'{titre} · Confidentiel'}, title:'Proposition commerciale',
    html:`<div class="sw-cover light"><p class="sw-kicker">Proposition commerciale</p><h1>Un projet pensé pour vous</h1><p class="sw-lead">Nom du client · {{date}}</p><div class="sw-cover-meta"><span><b>Préparée par</b><br>Votre nom</span><span><b>Contact</b><br>vous@entreprise.fr</span></div></div>
<h2>Votre besoin</h2><p class="sw-lead">Reformulez en deux phrases ce que le client cherche à accomplir.</p><p>Contexte, enjeux, contraintes et objectifs mesurables.</p>
<h2>Notre solution</h2><div class="sw-cols" data-cols="3"><div class="sw-card tint"><h3 style="margin-top:0">Analyse</h3><p>Audit de l'existant et ateliers avec vos équipes.</p></div><div class="sw-card tint"><h3 style="margin-top:0">Conception</h3><p>Propositions, maquettes et validation pas à pas.</p></div><div class="sw-card tint"><h3 style="margin-top:0">Déploiement</h3><p>Mise en place, formation et suivi.</p></div></div>
<h2>Nos offres</h2><div class="sw-prices"><div class="sw-price"><p>Essentiel</p><b>2 400 €</b><p>Analyse + recommandations</p></div><div class="sw-price hot"><p>Recommandé</p><b>5 900 €</b><p>Analyse, conception et déploiement</p></div><div class="sw-price"><p>Sur mesure</p><b>Sur devis</b><p>Accompagnement complet</p></div></div>
<h2>Planning</h2><ul class="sw-timeline"><li><b>Semaine 1</b>Lancement et ateliers</li><li><b>Semaines 2 à 4</b>Conception et validations</li><li><b>Semaines 5 et 6</b>Déploiement et formation</li></ul>
<div class="sw-banner"><h3>Prochaine étape</h3><p>Validez l'offre de votre choix : nous démarrons sous 10 jours.</p></div>
<div class="sw-sign"><div><b>Pour l'entreprise</b>Nom, date, signature</div><div><b>Pour le client</b>Bon pour accord, date, signature</div></div>`},

  {id:'newsletter', name:'Lettre d\'information', cat:'Créatif', desc:'Bandeau, articles en colonnes, agenda', featured:true, theme:{id:'ocean'}, page:{margins:'narrow'}, title:'Lettre d\'information',
    html:`<div class="sw-band top"><p class="sw-kicker">N° 07 · {{date}}</p><h1>Les nouvelles du mois</h1><p>Actualités, projets et rendez-vous de l'équipe.</p></div>
<div class="sw-cols" data-cols="2-1"><div class="sw-col"><h2 style="margin-top:0">À la une : un nouveau projet</h2><p class="sw-lead">Une accroche de deux lignes qui donne envie de lire la suite.</p><p>Le corps de l'article. Racontez l'histoire, citez les personnes, donnez des chiffres. Ajoutez une image depuis l'onglet « Images ».</p>
<div class="sw-quote">Une phrase forte, mise en avant au cœur de l'article.<cite>— Prénom Nom, fonction</cite></div></div>
<div class="sw-col"><div class="sw-card tint"><h3 style="margin-top:0">Agenda</h3><ul class="sw-timeline"><li><b>12 mars</b>Portes ouvertes</li><li><b>24 mars</b>Atelier découverte</li><li><b>3 avril</b>Conférence</li></ul></div><p></p><div class="sw-card"><h3 style="margin-top:0">En chiffres</h3><div class="sw-stat"><b>2 500</b><span>abonnés</span></div></div></div></div>
<hr class="sw-divider">
<div class="sw-cols"><div class="sw-col"><h3>Brève n° 1</h3><p>Quelques lignes sur un sujet secondaire.</p></div><div class="sw-col"><h3>Brève n° 2</h3><p>Quelques lignes sur un autre sujet.</p></div></div>
<div class="sw-banner"><h3>Vous aimez cette lettre ?</h3><p>Transférez-la à vos collègues. Pour nous écrire : contact@entreprise.fr</p></div>`},

  {id:'affiche', name:'Affiche d\'événement', cat:'Créatif', desc:'Une page pleine, grand titre, infos pratiques', theme:{id:'spectra'}, page:{}, title:'Affiche',
    html:`<div class="sw-cover"><p class="sw-kicker">Samedi 14 juin · 18 h</p><h1 style="font-size:4.4em;line-height:1">La grande soirée de l'été</h1><p class="sw-lead" style="font-size:1.5em">Concerts, ateliers, food-trucks et surprises pour toute la famille.</p><div class="sw-cover-meta"><span><b>Lieu</b><br>Parc de la Citadelle, Lille</span><span><b>Entrée</b><br>Gratuite</span><span><b>Infos</b><br>evenement.fr</span></div></div>`},

  {id:'fiche-projet', name:'Fiche projet', cat:'BTP & architecture', desc:'Chiffres clés, intervenants, phases', theme:{id:'studio'}, page:{numbers:true}, title:'Fiche projet',
    html:`<div class="sw-band top"><p class="sw-kicker">Fiche projet · Studio Prism</p><h1>Maison passive, Marcq-en-Barœul</h1><p>Construction neuve · Logement individuel · {{annee}}</p></div>
<div class="sw-stats"><div class="sw-stat"><b>148 m²</b><span>Surface de plancher</span></div><div class="sw-stat"><b>385 k€</b><span>Budget travaux HT</span></div><div class="sw-stat"><b>14 mois</b><span>Durée des travaux</span></div><div class="sw-stat"><b>RE2020</b><span>Réglementation</span></div></div>
<h2>Le projet</h2><p class="sw-lead">Une maison compacte, lumineuse et sobre en énergie, ouverte sur le jardin.</p><p>Description : implantation, volumes, matériaux, choix techniques (ossature bois, isolation biosourcée, ventilation double flux…).</p>
<h2>Intervenants</h2><table class="sw-table t-zebra"><thead><tr><th>Rôle</th><th>Société</th><th>Contact</th></tr></thead><tbody>${T_ROWS([['Maître d\'ouvrage', 'Client', 'Prénom Nom'], ['Maître d\'œuvre', 'Studio Prism', 'Prénom Nom'], ['Bureau d\'études structure', 'BET', 'Prénom Nom'], ['Bureau d\'études thermique', 'BET', 'Prénom Nom']])}</tbody></table>
<h2>Phases</h2><ul class="sw-timeline"><li><b>ESQ · APS</b>Esquisse et avant-projet sommaire</li><li><b>APD · PC</b>Avant-projet définitif, dépôt du permis de construire</li><li><b>PRO · DCE</b>Projet et dossier de consultation des entreprises</li><li><b>ACT · DET</b>Choix des entreprises, direction de l'exécution des travaux</li><li><b>AOR</b>Assistance aux opérations de réception</li></ul>
<div class="sw-callout" data-sw-kind="info"><p><b>Maquette 3D</b>La maquette du projet est disponible dans ARCHIPLAN et se visite en réalité augmentée avec Archi Vision.</p></div>`},

  {id:'cahier', name:'Cahier des charges', cat:'Professionnel', desc:'Sommaire, exigences, planning, budget', theme:{id:'moderne'}, page:{numbers:true, header:'{titre}'}, title:'Cahier des charges',
    html:`<div class="sw-cover light"><p class="sw-kicker">Cahier des charges</p><h1>Nom du projet</h1><p class="sw-lead">Version 1.0 · {{date}}</p></div>
<div class="sw-toc" contenteditable="false" data-sw="toc"></div>
<h2>1. Contexte et objectifs</h2><p>Présentation de l'organisation, du besoin et des objectifs attendus.</p>
<h2>2. Périmètre</h2><div class="sw-cols"><div class="sw-card tint"><h3 style="margin-top:0">Inclus</h3><ul><li>Élément 1</li><li>Élément 2</li></ul></div><div class="sw-card"><h3 style="margin-top:0">Exclu</h3><ul><li>Élément 3</li><li>Élément 4</li></ul></div></div>
<h2>3. Exigences</h2><table class="sw-table t-grid"><thead><tr><th>N°</th><th>Exigence</th><th>Priorité</th></tr></thead><tbody>${T_ROWS([['E1', 'Description de l\'exigence', 'Haute'], ['E2', 'Description de l\'exigence', 'Moyenne'], ['E3', 'Description de l\'exigence', 'Basse']])}</tbody></table>
<h2>4. Planning</h2><ol class="sw-steps"><li><b>Cadrage</b>2 semaines</li><li><b>Réalisation</b>8 semaines</li><li><b>Recette et mise en service</b>2 semaines</li></ol>
<h2>5. Budget et modalités</h2><p>Enveloppe prévisionnelle, conditions de paiement, critères de choix du prestataire.</p>`},

  {id:'notes', name:'Notes de cours', cat:'Études', desc:'Définitions, encadrés, liste de révision', featured:false, theme:{id:'manuscrit'}, page:{}, title:'Notes de cours',
    html:`<p class="sw-kicker">Chapitre 3 · {{date}}</p><h1>Titre du cours</h1><p class="sw-lead">Ce qu'il faut comprendre en une phrase.</p>
<div class="sw-callout" data-sw-kind="info"><p><b>Définition</b>Écrivez ici la définition à connaître par cœur.</p></div>
<h2>1. Notion principale</h2><p>Vos notes… Tapez « / » pour insérer rapidement un encadré, un tableau ou une liste.</p>
<div class="sw-callout" data-sw-kind="warn"><p><b>Attention</b>Le piège classique à éviter le jour de l'examen.</p></div>
<h2>2. Exemple</h2><p>Un exemple concret, pas à pas.</p><ol class="sw-steps"><li><b>Étape 1</b>…</li><li><b>Étape 2</b>…</li></ol>
<h2>À réviser</h2><ul class="sw-check"><li>Connaître la définition</li><li>Savoir refaire l'exemple</li><li>Faire les exercices 4 à 7</li></ul>`},

  {id:'invitation', name:'Invitation', cat:'Créatif', desc:'Élégante, centrée, prête à imprimer', theme:{id:'elegant'}, page:{margins:'wide'}, title:'Invitation',
    html:`<p></p><p class="sw-center sw-kicker" style="margin-top:3em">Vous êtes cordialement invités</p><h1 class="sw-center" style="font-size:3.2em">Inauguration de nos nouveaux locaux</h1><hr class="sw-divider dots"><p class="sw-center sw-lead">Jeudi 18 septembre à 18 h 30</p><p class="sw-center">12 rue de l'Exemple · 59000 Lille</p><p class="sw-center" style="margin-top:2em">Cocktail et visite des ateliers.<br>Réponse souhaitée avant le 10 septembre.</p><p class="sw-center sw-small" style="margin-top:3em">contact@entreprise.fr · 03 00 00 00 00</p>`},
];
window.SW_TEMPLATES = SW_TEMPLATES;
