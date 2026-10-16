/* ---------- Modèles supplémentaires : courriers, RH et juridique, études, BTP, événements, vie perso ---------- */
SW_TEMPLATES.push(
  {id:'lettre-motivation', name:'Lettre de motivation', cat:'Essentiels', desc:'Accroche, parcours, motivation, disponibilité', featured:true, theme:{id:'elegant'}, page:{}, title:'Lettre de motivation',
    html:`<div class="sw-head"><div><b>Prénom Nom</b><br>12 rue de l'Exemple, 59000 Lille<br>06 00 00 00 00<br>prenom.nom@email.fr</div><div class="sw-right"><br><b>Nom de l'entreprise</b><br>À l'attention de [Nom du recruteur]<br>Adresse<br>Code postal Ville</div></div>
<p class="sw-right">Lille, le {{date}}</p>
<p><b>Objet : </b>candidature au poste de [intitulé du poste] · réf. [référence de l'annonce]</p>
<p>Madame, Monsieur,</p>
<p>Votre annonce pour le poste de [intitulé] a retenu toute mon attention : [ce qui vous attire dans l'entreprise, en une phrase précise et sincère].</p>
<p>Fort(e) de [nombre] ans d'expérience en [domaine], j'ai notamment [réalisation chiffrée : projet mené, résultat obtenu]. Cette expérience m'a permis de développer [deux ou trois compétences clés en lien avec le poste].</p>
<p>Rejoindre [nom de l'entreprise], c'est pour moi l'occasion de [ce que vous apporterez et ce que vous recherchez]. Je suis convaincu(e) que [une qualité] et [une autre qualité] seront des atouts pour votre équipe.</p>
<p>Disponible à partir du [date], je serais heureux(se) de vous présenter ma motivation lors d'un entretien.</p>
<p>Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.</p>
<p class="sw-right" style="margin-top:2.5em">Prénom Nom</p>`},

  {id:'cv-classique', name:'CV classique', cat:'Professionnel', desc:'Une colonne sobre, idéal pour les recruteurs', theme:{id:'classique'}, page:{}, title:'CV',
    html:`<h1 class="sw-center" style="margin-bottom:.1em">Prénom Nom</h1><p class="sw-center sw-kicker">Comptable confirmé(e)</p><p class="sw-center sw-small">Lille · 06 00 00 00 00 · prenom.nom@email.fr · linkedin.com/in/prenom</p><hr class="sw-divider">
<p class="sw-lead">Comptable rigoureux(se) avec 8 ans d'expérience en cabinet et en entreprise. Spécialiste des clôtures, de la fiscalité des PME et de la dématérialisation.</p>
<h2>Expérience professionnelle</h2>
<h4>Responsable comptable · Entreprise · 2021 — aujourd'hui</h4><ul><li>Clôtures mensuelles et annuelles d'un groupe de 3 sociétés</li><li>Mise en place de la facturation électronique, -30 % de temps de saisie</li><li>Encadrement de 2 assistants comptables</li></ul>
<h4>Comptable · Cabinet d'expertise · 2016 — 2021</h4><ul><li>Portefeuille de 45 clients (TPE, artisans, professions libérales)</li><li>Liasses fiscales, déclarations de TVA, bilans</li></ul>
<h2>Formation</h2><p><b>2016 · DCG</b> — Diplôme de comptabilité et de gestion, Lille<br><b>2013 · BTS Comptabilité et gestion</b> — Lycée, Lille</p>
<h2>Compétences</h2><div class="sw-cols"><div class="sw-col"><ul><li>Comptabilité générale et analytique</li><li>Fiscalité des entreprises</li><li>Consolidation</li></ul></div><div class="sw-col"><ul><li>Sage, Cegid, Pennylane</li><li>Excel avancé, SPECTRA Calc</li><li>Anglais professionnel</li></ul></div></div>
<h2>Centres d'intérêt</h2><p>Course à pied (semi-marathon), trésorier d'une association sportive, photographie.</p>`},

  {id:'attestation', name:'Attestation sur l\'honneur', cat:'Juridique & RH', desc:'Déclarant, déclaration, date et signature', theme:{id:'ardoise'}, page:{}, title:'Attestation sur l\'honneur',
    html:`<h1 class="sw-center" style="margin-top:1.5em">Attestation sur l'honneur</h1><hr class="sw-divider dots">
<p>Je soussigné(e), <b>[Prénom Nom]</b>,<br>né(e) le [date de naissance] à [lieu de naissance],<br>demeurant [adresse complète],</p>
<p>atteste sur l'honneur que [objet précis de l'attestation : par exemple, « j'héberge à titre gratuit Madame X à mon domicile depuis le 1er janvier {{annee}} »].</p>
<p>Je déclare avoir connaissance que l'établissement d'une attestation faisant état de faits matériellement inexacts m'expose à des sanctions pénales.</p>
<p>Fait pour servir et valoir ce que de droit.</p>
<p class="sw-right" style="margin-top:2em">Fait à [ville], le {{date}}</p>
<p class="sw-right" style="margin-top:1em">Signature<br><br><br></p>
<div class="sw-callout" data-sw-kind="info"><p><b>À joindre</b>Une copie de votre pièce d'identité. Supprimez cet encadré avant d'imprimer.</p></div>`},

  {id:'contrat-prestation', name:'Contrat de prestation', cat:'Juridique & RH', desc:'Parties, objet, prix, durée, signatures', theme:{id:'classique'}, page:{numbers:true, numStyle:'np', footer:'Paraphes : ____ / ____'}, title:'Contrat de prestation de services',
    html:`<h1 class="sw-center">Contrat de prestation de services</h1><p class="sw-center sw-small">Contrat n° [000] · établi le {{date}}</p>
<h2>Entre les soussignés</h2><div class="sw-cols"><div class="sw-card tint"><p class="sw-kicker">Le prestataire</p><p><b>[Raison sociale]</b><br>[Forme juridique], au capital de [montant] €<br>SIRET [numéro]<br>[Adresse]<br>Représenté par [Prénom Nom], [fonction]</p></div><div class="sw-card"><p class="sw-kicker">Le client</p><p><b>[Raison sociale ou nom]</b><br>[Forme juridique]<br>SIRET [numéro]<br>[Adresse]<br>Représenté par [Prénom Nom], [fonction]</p></div></div>
<h2>Article 1 · Objet</h2><p>Le présent contrat a pour objet de définir les conditions dans lesquelles le prestataire réalise pour le client la mission suivante : [description précise de la prestation].</p>
<h2>Article 2 · Durée</h2><p>Le contrat prend effet le [date] pour une durée de [durée]. Il pourra être renouvelé par accord écrit des parties.</p>
<h2>Article 3 · Obligations du prestataire</h2><p>Le prestataire s'engage à exécuter la mission avec soin, selon les règles de l'art, et à informer le client de toute difficulté rencontrée.</p>
<h2>Article 4 · Obligations du client</h2><p>Le client s'engage à fournir au prestataire les informations et documents nécessaires à la bonne exécution de la mission, et à régler le prix convenu.</p>
<h2>Article 5 · Prix et paiement</h2><table class="sw-table"><thead><tr><th>Élément</th><th class="r">Montant HT</th></tr></thead><tbody>${T_ROWS([['Prestation forfaitaire', '[0,00 €]'], ['Frais annexes', '[0,00 €]']])}</tbody></table><p>Les factures sont payables à [30] jours à compter de leur émission, par virement bancaire.</p>
<h2>Article 6 · Confidentialité</h2><p>Chaque partie s'engage à garder confidentielles les informations reçues de l'autre partie pendant la durée du contrat et [deux] ans après son terme.</p>
<h2>Article 7 · Résiliation</h2><p>En cas de manquement grave de l'une des parties, l'autre partie pourra résilier le contrat par lettre recommandée avec accusé de réception, après une mise en demeure restée sans effet pendant [15] jours.</p>
<h2>Article 8 · Litiges</h2><p>Le présent contrat est soumis au droit français. Tout litige sera, à défaut d'accord amiable, porté devant les tribunaux compétents de [ville].</p>
<p>Fait à [ville], le {{date}}, en deux exemplaires originaux.</p>
<div class="sw-sign"><div><b>Le prestataire</b>« Lu et approuvé », date et signature</div><div><b>Le client</b>« Lu et approuvé », date et signature</div></div>
<div class="sw-callout" data-sw-kind="warn"><p><b>Modèle indicatif</b>Faites relire ce contrat par un professionnel du droit avant signature. Supprimez cet encadré.</p></div>`},

  {id:'note-service', name:'Note de service', cat:'Juridique & RH', desc:'Destinataires, objet, consignes, date d\'effet', theme:{id:'studio'}, page:{}, title:'Note de service',
    html:`<div class="sw-head"><div><div class="sw-logo">Votre entreprise</div></div><div class="sw-right"><h2 style="margin:0">Note de service</h2><p class="sw-small">N° NS-{{annee}}-[00]<br>{{date}}</p></div></div>
<table class="sw-table t-grid"><tbody>${T_ROWS([['<b>De</b>', '[Prénom Nom, fonction]'], ['<b>À</b>', '[Ensemble du personnel / service concerné]'], ['<b>Objet</b>', '[Objet de la note]'], ['<b>Date d\'effet</b>', '[date]']])}</tbody></table>
<p>Madame, Monsieur,</p>
<p>[Contexte en une ou deux phrases : pourquoi cette note.]</p>
<h3>Ce qui change</h3><ul><li>[Consigne 1]</li><li>[Consigne 2]</li><li>[Consigne 3]</li></ul>
<div class="sw-callout" data-sw-kind="info"><p><b>Contact</b>Pour toute question : [Prénom Nom], [email], poste [000].</p></div>
<p>Merci à chacun pour sa bonne application de ces consignes.</p>
<p class="sw-right" style="margin-top:2em">[Prénom Nom]<br><span class="sw-small">[Fonction]</span></p>`},

  {id:'fiche-poste', name:'Fiche de poste', cat:'Juridique & RH', desc:'Missions, compétences, conditions, rattachement', theme:{id:'moderne'}, page:{}, title:'Fiche de poste',
    html:`<div class="sw-band top"><p class="sw-kicker">Fiche de poste · {{annee}}</p><h1>Chargé(e) de communication</h1><p>Service Marketing · CDI · Temps plein · Lille</p></div>
<div class="sw-stats"><div class="sw-stat"><b>Cadre</b><span>Statut</span></div><div class="sw-stat"><b>35 h</b><span>Par semaine</span></div><div class="sw-stat"><b>2 j</b><span>Télétravail</span></div><div class="sw-stat"><b>[00] k€</b><span>Brut annuel</span></div></div>
<h2>Raison d'être du poste</h2><p class="sw-lead">Faire connaître l'entreprise et ses offres, en ligne et hors ligne, avec une image cohérente et vivante.</p>
<h2>Missions principales</h2><ol class="sw-steps"><li><b>Contenus</b>Rédiger les articles, posts, newsletters et supports commerciaux.</li><li><b>Réseaux sociaux</b>Animer les comptes, suivre les statistiques, proposer des campagnes.</li><li><b>Événements</b>Organiser salons, inaugurations et rencontres clients.</li><li><b>Relations presse</b>Rédiger les communiqués et entretenir le fichier presse.</li></ol>
<h2>Compétences attendues</h2><div class="sw-cols"><div class="sw-card tint"><h3 style="margin-top:0">Savoir-faire</h3><ul><li>Rédaction impeccable</li><li>Outils de PAO et de montage</li><li>Gestion de projet</li></ul></div><div class="sw-card"><h3 style="margin-top:0">Savoir-être</h3><ul><li>Curiosité et créativité</li><li>Sens de l'organisation</li><li>Aisance relationnelle</li></ul></div></div>
<h2>Rattachement et relations</h2><p>Rattaché(e) à la direction marketing. Travaille avec les équipes commerciales, la direction et les prestataires (agence, imprimeur, photographe).</p>`},

  {id:'ordre-du-jour', name:'Ordre du jour', cat:'Professionnel', desc:'Horaires, sujets, intervenants, préparation', theme:{id:'spectra'}, page:{}, title:'Ordre du jour',
    html:`<p class="sw-kicker">Réunion d'équipe · {{date}}</p><h1>Ordre du jour</h1><p class="sw-lead">Salle Lumière (ou en visio : [lien]) · 9 h 30 — 11 h 00</p>
<table class="sw-table t-zebra"><thead><tr><th>Horaire</th><th>Sujet</th><th>Intervenant</th><th class="r">Durée</th></tr></thead><tbody>${T_ROWS([['9 h 30', 'Accueil et tour de table', 'Animateur', '10 min'], ['9 h 40', 'Point sur les projets en cours', 'Chefs de projet', '30 min'], ['10 h 10', 'Budget du trimestre', 'Direction', '20 min'], ['10 h 30', 'Questions diverses', 'Tous', '20 min'], ['10 h 50', 'Décisions et prochaines étapes', 'Animateur', '10 min']])}</tbody></table>
<h2>À préparer</h2><ul class="sw-check"><li>Relire le compte rendu de la dernière réunion</li><li>Mettre à jour l'avancement de vos projets</li><li>Envoyer vos questions avant la veille au soir</li></ul>
<div class="sw-callout" data-sw-kind="tip"><p><b>Participants</b>[Prénom Nom], [Prénom Nom], [Prénom Nom]</p></div>`},

  {id:'guide-accueil', name:'Guide d\'accueil', cat:'Professionnel', desc:'Bienvenue, équipe, outils, premières semaines', theme:{id:'corail'}, page:{numbers:true}, title:'Guide d\'accueil',
    html:`<div class="sw-hero"><p class="sw-kicker">Bienvenue chez [Entreprise]</p><h1>Votre guide d'accueil</h1><p class="sw-lead">Tout ce qu'il faut savoir pour bien démarrer, réuni en quelques pages.</p></div>
<h2 class="sw-secnum"><span>01</span>Qui sommes-nous ?</h2><p>[Histoire, mission et valeurs de l'entreprise en quelques lignes.]</p>
<div class="sw-stats"><div class="sw-stat"><b>[2009]</b><span>Création</span></div><div class="sw-stat"><b>[45]</b><span>Collaborateurs</span></div><div class="sw-stat"><b>[3]</b><span>Sites</span></div></div>
<h2 class="sw-secnum"><span>02</span>Votre équipe</h2><div class="sw-cols" data-cols="3"><div class="sw-card tint"><h3 style="margin-top:0">Manager</h3><p>[Prénom Nom]<br>[email]</p></div><div class="sw-card tint"><h3 style="margin-top:0">Parrain / marraine</h3><p>[Prénom Nom]<br>[email]</p></div><div class="sw-card tint"><h3 style="margin-top:0">RH</h3><p>[Prénom Nom]<br>[email]</p></div></div>
<h2 class="sw-secnum"><span>03</span>Vos premières semaines</h2><ul class="sw-timeline"><li><b>Jour 1</b>Accueil, remise du matériel, visite des locaux</li><li><b>Semaine 1</b>Rencontres avec chaque service, formation aux outils</li><li><b>Mois 1</b>Premier projet en binôme, point d'étape avec votre manager</li><li><b>Mois 3</b>Bilan de fin de période d'essai</li></ul>
<h2 class="sw-secnum"><span>04</span>Outils et infos pratiques</h2><div class="sw-faq"><div><b>Où trouver mes documents ?</b><p>Dans SPECTRA Writer, onglet « Partagés avec moi ».</p></div><div><b>Quels sont les horaires ?</b><p>[Horaires, badge, télétravail.]</p></div><div><b>Qui contacter en cas de souci informatique ?</b><p>[Contact support.]</p></div></div>`},

  {id:'pv-ag', name:'Procès-verbal d\'assemblée générale', cat:'Associations', desc:'Quorum, résolutions votées, signatures', theme:{id:'ardoise'}, page:{numbers:true}, title:'Procès-verbal d\'assemblée générale',
    html:`<p class="sw-kicker sw-center">Association [Nom de l'association] · loi 1901</p><h1 class="sw-center">Procès-verbal de l'assemblée générale ordinaire</h1><p class="sw-center sw-small">Siège social : [adresse] · RNA [W000000000]</p><hr class="sw-divider">
<p>Le [date], à [heure], les membres de l'association se sont réunis en assemblée générale ordinaire à [lieu], sur convocation du [président / conseil d'administration] en date du [date].</p>
<p>L'assemblée est présidée par [Prénom Nom], président(e). Le secrétariat de séance est assuré par [Prénom Nom].</p>
<div class="sw-stats"><div class="sw-stat"><b>[48]</b><span>Membres</span></div><div class="sw-stat"><b>[31]</b><span>Présents ou représentés</span></div><div class="sw-stat"><b>Atteint</b><span>Quorum</span></div></div>
<h2>Ordre du jour</h2><ol><li>Rapport moral du président</li><li>Rapport financier et approbation des comptes de l'exercice {{annee-1}}</li><li>Vote du budget prévisionnel {{annee}}</li><li>Renouvellement du conseil d'administration</li><li>Questions diverses</li></ol>
<h2>Résolutions</h2><table class="sw-table t-grid"><thead><tr><th>Résolution</th><th class="r">Pour</th><th class="r">Contre</th><th class="r">Abstention</th><th>Résultat</th></tr></thead><tbody>${T_ROWS([['1. Approbation du rapport moral', '31', '0', '0', 'Adoptée'], ['2. Approbation des comptes', '29', '0', '2', 'Adoptée'], ['3. Budget prévisionnel', '30', '1', '0', 'Adoptée'], ['4. Élection de [Prénom Nom]', '28', '2', '1', 'Adoptée']])}</tbody></table>
<p>L'ordre du jour étant épuisé, la séance est levée à [heure].</p>
<div class="sw-sign"><div><b>Le/la président(e)</b>[Prénom Nom]</div><div><b>Le/la secrétaire</b>[Prénom Nom]</div></div>`},

  {id:'compte-rendu-chantier', name:'Compte rendu de chantier', cat:'BTP & architecture', desc:'Présents, avancement par lot, observations', theme:{id:'studio'}, page:{numbers:true, header:'{titre}'}, title:'Compte rendu de chantier n° 01',
    html:`<div class="sw-head"><div><div class="sw-logo">Studio Prism</div><p class="sw-small">Maîtrise d'œuvre</p></div><div class="sw-right"><h2 style="margin:0">Compte rendu de chantier n° 01</h2><p class="sw-small">Réunion du {{date}}<br>Prochaine réunion : [date]</p></div></div>
<div class="sw-callout" data-sw-kind="info"><p><b>Opération</b>[Nom de l'opération] · [adresse du chantier] · Maître d'ouvrage : [nom]</p></div>
<h2>Présents</h2><table class="sw-table t-zebra"><thead><tr><th>Lot</th><th>Entreprise</th><th>Représentant</th><th>Présence</th></tr></thead><tbody>${T_ROWS([['01 Gros œuvre', '[Entreprise]', '[Nom]', 'Présent'], ['02 Charpente', '[Entreprise]', '[Nom]', 'Excusé'], ['03 Menuiseries', '[Entreprise]', '[Nom]', 'Présent'], ['04 Électricité', '[Entreprise]', '[Nom]', 'Absent']])}</tbody></table>
<h2>Avancement</h2><div class="sw-progress"><p><span>Gros œuvre</span><span>80 %</span></p><div class="sw-bar"><i style="width:80%"></i></div></div><div class="sw-progress"><p><span>Charpente</span><span>40 %</span></p><div class="sw-bar"><i style="width:40%"></i></div></div><div class="sw-progress"><p><span>Menuiseries</span><span>10 %</span></p><div class="sw-bar"><i style="width:10%"></i></div></div>
<h2>Observations et actions</h2><table class="sw-table t-grid"><thead><tr><th>N°</th><th>Observation</th><th>Qui</th><th>Pour le</th></tr></thead><tbody>${T_ROWS([['1', 'Fournir les plans d\'exécution des réservations', 'Lot 01', '[date]'], ['2', 'Valider les échantillons de menuiseries', 'MOA', '[date]'], ['3', 'Nettoyer les abords du chantier', 'Lot 01', 'Immédiat']])}</tbody></table>
<div class="sw-callout" data-sw-kind="warn"><p><b>Sécurité</b>Port du casque et des chaussures de sécurité obligatoire sur tout le chantier.</p></div>
<p class="sw-small">Sauf observation écrite sous 8 jours, ce compte rendu est réputé accepté par tous les destinataires.</p>`},

  {id:'pv-reception', name:'PV de réception de travaux', cat:'BTP & architecture', desc:'Réception avec ou sans réserves, signatures', theme:{id:'ardoise'}, page:{}, title:'Procès-verbal de réception de travaux',
    html:`<h1 class="sw-center">Procès-verbal de réception de travaux</h1><p class="sw-center sw-small">Opération : [nom] · Marché n° [000] · Lot [00 — intitulé]</p><hr class="sw-divider dots">
<div class="sw-cols"><div class="sw-card tint"><p class="sw-kicker">Maître d'ouvrage</p><p><b>[Nom]</b><br>[Adresse]</p></div><div class="sw-card"><p class="sw-kicker">Entreprise</p><p><b>[Raison sociale]</b><br>[Adresse]<br>SIRET [numéro]</p></div></div>
<p>Après visite contradictoire des travaux effectuée le [date], en présence de [maître d'œuvre, entreprise, maître d'ouvrage], le maître d'ouvrage déclare :</p>
<ul class="sw-check"><li>prononcer la réception <b>sans réserve</b></li><li>prononcer la réception <b>avec les réserves</b> listées ci-dessous</li><li><b>refuser</b> la réception pour les motifs suivants : [motifs]</li></ul>
<p>La réception prend effet à la date du <b>[date]</b>. Elle fait courir les garanties de parfait achèvement (1 an), biennale (2 ans) et décennale (10 ans).</p>
<h2>Réserves</h2><table class="sw-table t-grid"><thead><tr><th>N°</th><th>Localisation</th><th>Nature de la réserve</th><th>Délai de levée</th></tr></thead><tbody>${T_ROWS([['1', '[Pièce / façade]', '[Description]', '[date]'], ['2', '[Pièce / façade]', '[Description]', '[date]'], ['3', '', '', '']])}</tbody></table>
<p>Fait à [ville], le {{date}}, en [trois] exemplaires.</p>
<div class="sw-sign"><div><b>Le maître d'ouvrage</b>Date et signature</div><div><b>L'entreprise</b>Date et signature</div></div>`},

  {id:'cctp', name:'CCTP', cat:'BTP & architecture', desc:'Cahier des clauses techniques particulières par lot', theme:{id:'studio'}, page:{numbers:true, numStyle:'np', header:'CCTP · Lot [00]'}, title:'CCTP',
    html:`<div class="sw-cover light"><p class="sw-kicker">Dossier de consultation des entreprises</p><h1>CCTP · Lot [00] [Intitulé du lot]</h1><p class="sw-lead">Cahier des clauses techniques particulières</p><div class="sw-cover-meta"><span><b>Opération</b><br>[Nom de l'opération]</span><span><b>Maître d'œuvre</b><br>Studio Prism</span><span><b>Indice</b><br>A · {{date}}</span></div></div>
<div class="sw-toc" contenteditable="false" data-sw="toc"></div>
<h2>1. Généralités</h2><h3>1.1 Objet du présent CCTP</h3><p>Le présent document définit les prescriptions techniques applicables aux travaux du lot [00].</p><h3>1.2 Documents de référence</h3><ul><li>Documents techniques unifiés (DTU) en vigueur</li><li>Normes NF et Eurocodes applicables</li><li>Réglementation environnementale RE2020</li></ul><h3>1.3 Limites de prestations</h3><p>[Ce qui est dû par le lot, ce qui relève des autres lots.]</p>
<h2>2. Description des ouvrages</h2><h3>2.1 [Ouvrage]</h3><p><b>Localisation :</b> [lieux]<br><b>Matériaux :</b> [références, performances]<br><b>Mise en œuvre :</b> [prescriptions]</p><h3>2.2 [Ouvrage]</h3><p>[Description.]</p>
<h2>3. Essais, contrôles et réception</h2><p>[Autocontrôles, essais exigés, documents à fournir (DOE, fiches techniques, PV d'essais).]</p>
<div class="sw-callout" data-sw-kind="tip"><p><b>Astuce</b>Chaque titre alimente le sommaire. Le numéro de lot de l'en-tête se change dans le tiroir « Page ».</p></div>`},

  {id:'devis-service', name:'Devis de prestation', cat:'Commercial', desc:'Prestations, options, conditions, bon pour accord', theme:{id:'moderne'}, page:{}, title:'Devis',
    html:`<div class="sw-head"><div><div class="sw-logo">Votre entreprise</div><p class="sw-small">12 rue de l'Exemple, 59000 Lille<br>SIRET 000 000 000 00000<br>contact@entreprise.fr</p></div><div class="sw-right"><h1 style="margin:0">DEVIS</h1><p class="sw-small">N° D-{{annee}}-001<br>Date : {{date}}<br>Valable 30 jours</p></div></div>
<div class="sw-card tint"><p class="sw-kicker">Pour</p><p><b>[Nom du client]</b> · [Adresse] · [Email]</p></div>
<h2>Prestations</h2><table class="sw-table"><thead><tr><th>Description</th><th class="r">Jours</th><th class="r">Tarif / jour HT</th><th class="r">Total HT</th></tr></thead><tbody>${T_ROWS([['Atelier de cadrage', '1', '650,00 €', '650,00 €'], ['Conception et réalisation', '6', '550,00 €', '3 300,00 €'], ['Formation des équipes', '1', '600,00 €', '600,00 €']])}</tbody></table>
<table class="sw-total"><tbody><tr><td>Total HT</td><td class="r">4 550,00 €</td></tr><tr><td>TVA 20 %</td><td class="r">910,00 €</td></tr><tr><td>Total TTC</td><td class="r">5 460,00 €</td></tr></tbody></table>
<h3>Options</h3><ul><li>Maintenance mensuelle : 180 € HT / mois</li><li>Journée supplémentaire : 550 € HT</li></ul>
<h3>Conditions</h3><p class="sw-small">Acompte de 30 % à la signature, solde à la livraison. Paiement à 30 jours par virement. Toute prestation non prévue fera l'objet d'un avenant.</p>
<div class="sw-sign"><div><b>Le prestataire</b>Date et signature</div><div><b>Le client</b>« Bon pour accord », date et signature</div></div>`},

  {id:'bon-commande', name:'Bon de commande', cat:'Commercial', desc:'Fournisseur, articles, livraison, validation', theme:{id:'spectra'}, page:{}, title:'Bon de commande',
    html:`<div class="sw-head"><div><div class="sw-logo">Votre entreprise</div><p class="sw-small">Service achats · achats@entreprise.fr</p></div><div class="sw-right"><h1 style="margin:0">BON DE COMMANDE</h1><p class="sw-small">N° BC-{{annee}}-001<br>Date : {{date}}</p></div></div>
<div class="sw-cols"><div class="sw-card tint"><p class="sw-kicker">Fournisseur</p><p><b>[Raison sociale]</b><br>[Adresse]<br>[Contact]</p></div><div class="sw-card"><p class="sw-kicker">Livraison</p><p><b>[Adresse de livraison]</b><br>Date souhaitée : [date]<br>Contact sur place : [nom, téléphone]</p></div></div>
<table class="sw-table t-zebra"><thead><tr><th>Réf.</th><th>Article</th><th class="r">Qté</th><th class="r">PU HT</th><th class="r">Total HT</th></tr></thead><tbody>${T_ROWS([['A-102', 'Article 1', '10', '12,50 €', '125,00 €'], ['B-220', 'Article 2', '4', '89,00 €', '356,00 €'], ['C-005', 'Article 3', '1', '240,00 €', '240,00 €']])}</tbody></table>
<table class="sw-total"><tbody><tr><td>Total HT</td><td class="r">721,00 €</td></tr><tr><td>TVA 20 %</td><td class="r">144,20 €</td></tr><tr><td>Total TTC</td><td class="r">865,20 €</td></tr></tbody></table>
<p class="sw-small">Merci de rappeler le numéro de commande sur votre bon de livraison et votre facture.</p>
<div class="sw-sign"><div><b>Demandé par</b>[Prénom Nom]</div><div><b>Validé par</b>[Prénom Nom], date et signature</div></div>`},

  {id:'communique', name:'Communiqué de presse', cat:'Commercial', desc:'Titre, chapô, citation, à propos, contact presse', theme:{id:'editorial'}, page:{}, title:'Communiqué de presse',
    html:`<p class="sw-kicker">Communiqué de presse · Lille, le {{date}}</p><h1>[Entreprise] lance [nouveauté] pour [bénéfice principal]</h1>
<p class="sw-lead">Le chapô résume l'information en deux ou trois phrases : qui, quoi, quand, où, pourquoi. C'est souvent la seule partie lue en entier.</p>
<p>Le premier paragraphe développe l'annonce avec des faits précis et des chiffres. Le deuxième donne le contexte : le marché, le besoin, ce qui rend l'annonce nouvelle.</p>
<div class="sw-quote">« Une citation forte d'un dirigeant ou d'un partenaire, qui donne de la chair à l'annonce. »<cite>— Prénom Nom, fonction, Entreprise</cite></div>
<h3>En chiffres</h3><div class="sw-stats"><div class="sw-stat"><b>[3]</b><span>ans de développement</span></div><div class="sw-stat"><b>[12 000]</b><span>utilisateurs attendus</span></div><div class="sw-stat"><b>[15]</b><span>emplois créés</span></div></div>
<h3>Disponibilité</h3><p>[Date de lancement, prix, où le trouver.]</p>
<hr class="sw-divider">
<p class="sw-small"><b>À propos de [Entreprise]</b> — Créée en [année] à [ville], [Entreprise] [activité en une phrase]. [Chiffre clé.] Plus d'informations : [site].</p>
<div class="sw-card tint"><p><b>Contact presse</b><br>[Prénom Nom] · [téléphone] · [email]</p></div>`},

  {id:'business-plan', name:'Business plan', cat:'Commercial', desc:'Projet, marché, stratégie, prévisionnel', theme:{id:'spectra'}, page:{numbers:true, footer:'{titre} · Confidentiel'}, title:'Business plan',
    html:`<div class="sw-cover"><p class="sw-kicker">Business plan · {{annee}}</p><h1>[Nom du projet]</h1><p class="sw-lead">[Votre proposition de valeur en une phrase.]</p><div class="sw-cover-meta"><span><b>Porteur(s)</b><br>[Prénom Nom]</span><span><b>Besoin</b><br>[000 k€]</span><span><b>Contact</b><br>[email]</span></div></div>
<div class="sw-toc" contenteditable="false" data-sw="toc"></div>
<h2>1. Résumé</h2><p class="sw-lead">Le projet en dix lignes : problème, solution, marché, modèle économique, équipe, besoin de financement.</p>
<h2>2. Le marché</h2><div class="sw-stats"><div class="sw-stat"><b>[2,4 Md€]</b><span>Marché total</span></div><div class="sw-stat"><b>[+8 %]</b><span>Croissance par an</span></div><div class="sw-stat"><b>[120 k]</b><span>Clients cibles</span></div></div><p>Analyse de la demande, des tendances et de la concurrence.</p>
<table class="sw-table t-zebra"><thead><tr><th>Concurrent</th><th>Forces</th><th>Faiblesses</th><th>Prix</th></tr></thead><tbody>${T_ROWS([['[Concurrent A]', '[…]', '[…]', '[…]'], ['[Concurrent B]', '[…]', '[…]', '[…]']])}</tbody></table>
<h2>3. Stratégie</h2><div class="sw-cols" data-cols="3"><div class="sw-card tint"><h3 style="margin-top:0">Offre</h3><p>Produits, services, prix.</p></div><div class="sw-card tint"><h3 style="margin-top:0">Distribution</h3><p>Canaux de vente.</p></div><div class="sw-card tint"><h3 style="margin-top:0">Communication</h3><p>Comment vous faire connaître.</p></div></div>
<h2>4. Prévisionnel financier</h2><table class="sw-table"><thead><tr><th>En k€</th><th class="r">Année 1</th><th class="r">Année 2</th><th class="r">Année 3</th></tr></thead><tbody>${T_ROWS([['Chiffre d\'affaires', '120', '260', '480'], ['Charges', '150', '220', '360'], ['Résultat', '-30', '40', '120']])}</tbody></table>
<h2>5. L'équipe</h2><p>Parcours et rôle de chaque associé.</p>
<h2>6. Financement</h2><p>Montant recherché, utilisation des fonds, apports déjà réunis.</p>`},

  {id:'flyer', name:'Flyer promotionnel', cat:'Commercial', desc:'Offre, avantages, prix, appel à l\'action', theme:{id:'corail'}, page:{margins:'narrow'}, title:'Flyer',
    html:`<div class="sw-band top"><p class="sw-kicker">Offre de lancement · jusqu'au [date]</p><h1 style="font-size:3em">-20 % sur votre premier projet</h1><p>Architecture d'intérieur, rénovation, plans 3D.</p></div>
<div class="sw-cols" data-cols="3"><div class="sw-card tint"><h3 style="margin-top:0">✨ Sur mesure</h3><p>Un projet pensé pour votre façon de vivre.</p></div><div class="sw-card tint"><h3 style="margin-top:0">📐 En 3D</h3><p>Visitez votre futur intérieur avant les travaux.</p></div><div class="sw-card tint"><h3 style="margin-top:0">🤝 Clé en main</h3><p>Un seul interlocuteur, du plan à la livraison.</p></div></div>
<div class="sw-prices"><div class="sw-price"><p>Conseil</p><b>190 €</b><p>Visite et recommandations</p></div><div class="sw-price hot"><p>Projet 3D</p><b>790 €</b><p>Plans et visite virtuelle</p></div><div class="sw-price"><p>Clé en main</p><b>Sur devis</b><p>Suivi complet des travaux</p></div></div>
<p class="sw-center" style="margin-top:1.5em"><a class="sw-btn" href="https://">Réserver un rendez-vous</a></p>
<p class="sw-center sw-small">Studio [Nom] · 03 00 00 00 00 · contact@exemple.fr</p>`},

  {id:'rapport-stage', name:'Rapport de stage', cat:'Études', desc:'Couverture, remerciements, sommaire, missions', theme:{id:'moderne'}, page:{numbers:true}, title:'Rapport de stage',
    html:`<div class="sw-cover light"><p class="sw-kicker">Rapport de stage · [Formation] · {{annee}}</p><h1>[Intitulé du stage]</h1><p class="sw-lead">Stage effectué du [date] au [date] chez [Entreprise], [ville]</p><div class="sw-cover-meta"><span><b>Étudiant(e)</b><br>[Prénom Nom]</span><span><b>Tuteur entreprise</b><br>[Prénom Nom]</span><span><b>Enseignant référent</b><br>[Prénom Nom]</span></div></div>
<h2>Remerciements</h2><p>Je tiens à remercier [Prénom Nom], mon tuteur, pour […], ainsi que toute l'équipe de [service] pour son accueil.</p>
<div class="sw-toc" contenteditable="false" data-sw="toc"></div>
<h2>Introduction</h2><p>Présentez le contexte du stage, vos objectifs et le plan du rapport.</p>
<h2>1. Présentation de l'entreprise</h2><h3>1.1 Activité et chiffres clés</h3><div class="sw-stats"><div class="sw-stat"><b>[Année]</b><span>Création</span></div><div class="sw-stat"><b>[00]</b><span>Salariés</span></div><div class="sw-stat"><b>[0 M€]</b><span>Chiffre d'affaires</span></div></div><h3>1.2 Organisation et service d'accueil</h3><p>[…]</p>
<h2>2. Missions réalisées</h2><ol class="sw-steps"><li><b>Mission 1</b>Objectif, démarche, outils, résultat.</li><li><b>Mission 2</b>Objectif, démarche, outils, résultat.</li></ol>
<h2>3. Bilan</h2><div class="sw-cols"><div class="sw-card tint"><h3 style="margin-top:0">Compétences acquises</h3><ul><li>[…]</li><li>[…]</li></ul></div><div class="sw-card"><h3 style="margin-top:0">Difficultés et solutions</h3><ul><li>[…]</li><li>[…]</li></ul></div></div>
<h2>Conclusion</h2><p>Ce que ce stage vous a apporté et vos perspectives.</p>
<h2>Annexes</h2><p>[Documents utiles.]</p>`},

  {id:'memoire', name:'Mémoire', cat:'Études', desc:'Page de garde, sommaire, chapitres, bibliographie', theme:{id:'classique'}, page:{numbers:true, margins:'wide', header:'{titre}'}, title:'Mémoire',
    html:`<div class="sw-cover light"><p class="sw-kicker">[Université] · [Diplôme] · Année {{annee-1}}-{{annee}}</p><h1>[Titre du mémoire]</h1><p class="sw-lead">[Sous-titre : la problématique en une ligne]</p><div class="sw-cover-meta"><span><b>Présenté par</b><br>[Prénom Nom]</span><span><b>Sous la direction de</b><br>[Prénom Nom]</span><span><b>Soutenu le</b><br>[date]</span></div></div>
<h2>Résumé</h2><p>Résumé de 10 à 15 lignes. <b>Mots-clés :</b> [mot 1], [mot 2], [mot 3].</p>
<div class="sw-toc" contenteditable="false" data-sw="toc"></div>
<h2>Introduction</h2><p>Contexte, problématique, hypothèses, méthode, annonce du plan.</p>
<h2>Chapitre 1 · État de l'art</h2><h3>1.1 [Section]</h3><p>[…]</p><blockquote>Une citation d'auteur, avec sa référence entre parenthèses (Auteur, année, p. 00).</blockquote><h3>1.2 [Section]</h3><p>[…]</p>
<h2>Chapitre 2 · Méthodologie</h2><p>[Terrain, échantillon, outils d'analyse.]</p>
<h2>Chapitre 3 · Résultats et discussion</h2><table class="sw-table t-zebra"><thead><tr><th>Variable</th><th class="r">Groupe A</th><th class="r">Groupe B</th></tr></thead><tbody>${T_ROWS([['[…]', '[00]', '[00]'], ['[…]', '[00]', '[00]']])}</tbody></table><p class="sw-small sw-center">Tableau 1 · [Légende]</p>
<h2>Conclusion</h2><p>Réponse à la problématique, limites, perspectives.</p>
<h2>Bibliographie</h2><p class="sw-small">NOM, Prénom. <i>Titre de l'ouvrage</i>. Éditeur, année.<br>NOM, Prénom. « Titre de l'article ». <i>Revue</i>, vol. 0, n° 0, année, p. 00-00.</p>`},

  {id:'fiche-revision', name:'Fiche de révision', cat:'Études', desc:'L\'essentiel d\'un chapitre sur une page', theme:{id:'pastel'}, page:{margins:'narrow'}, title:'Fiche de révision',
    html:`<div class="sw-band top"><p class="sw-kicker">Fiche de révision · [Matière]</p><h1>[Titre du chapitre]</h1><p>À connaître pour le [date de l'examen]</p></div>
<div class="sw-cols"><div class="sw-col"><div class="sw-callout" data-sw-kind="info"><p><b>Définitions</b>[Notion 1] : […]<br>[Notion 2] : […]</p></div><h3>Les dates clés</h3><ul class="sw-timeline"><li><b>[Date]</b>[Événement]</li><li><b>[Date]</b>[Événement]</li><li><b>[Date]</b>[Événement]</li></ul></div>
<div class="sw-col"><h3>Les formules / règles</h3><pre><code>[formule ou règle à retenir]</code></pre><div class="sw-callout" data-sw-kind="warn"><p><b>Pièges</b>[L'erreur classique à éviter.]</p></div><h3>Méthode</h3><ol class="sw-steps"><li><b>1</b>[Étape]</li><li><b>2</b>[Étape]</li><li><b>3</b>[Étape]</li></ol></div></div>
<h3>Je vérifie que je sais…</h3><ul class="sw-check"><li>[Compétence 1]</li><li>[Compétence 2]</li><li>[Compétence 3]</li></ul>`},

  {id:'menu', name:'Menu de restaurant', cat:'Événements & loisirs', desc:'Entrées, plats, desserts, prix alignés', theme:{id:'elegant'}, page:{margins:'wide'}, title:'Menu',
    html:`<p class="sw-center sw-kicker" style="margin-top:1em">Maison [Nom] · Cuisine de saison</p><h1 class="sw-center" style="font-size:3em">La carte</h1><hr class="sw-divider dots">
<h2 class="sw-center">Entrées</h2><div class="sw-menu"><p><b>Velouté de potimarron</b><span>9 €</span><small>noisettes torréfiées, crème crue</small></p><p><b>Œuf parfait</b><span>12 €</span><small>champignons des bois, émulsion au lard</small></p><p><b>Tartare de truite</b><span>13 €</span><small>pomme verte, aneth, citron vert</small></p></div>
<h2 class="sw-center">Plats</h2><div class="sw-menu"><p><b>Suprême de volaille fermière</b><span>22 €</span><small>purée maison, jus corsé</small></p><p><b>Dos de cabillaud</b><span>24 €</span><small>poireaux fondants, beurre blanc</small></p><p><b>Risotto aux cèpes</b><span>19 €</span><small>parmesan affiné 24 mois</small></p></div>
<h2 class="sw-center">Desserts</h2><div class="sw-menu"><p><b>Tarte fine aux pommes</b><span>9 €</span><small>glace vanille de Madagascar</small></p><p><b>Mi-cuit au chocolat</b><span>10 €</span><small>cœur coulant, crème anglaise</small></p></div>
<p class="sw-center sw-small" style="margin-top:2em">Prix nets, service compris. Allergènes : liste disponible sur demande.</p>`},

  {id:'programme', name:'Programme d\'événement', cat:'Événements & loisirs', desc:'Horaires, intervenants, infos pratiques', theme:{id:'minuit'}, page:{}, title:'Programme',
    html:`<div class="sw-hero"><p class="sw-kicker">[Date] · [Lieu]</p><h1>[Nom de l'événement]</h1><p class="sw-lead">[Une phrase qui donne envie de venir.]</p></div>
<ul class="sw-timeline"><li><b>9 h 00</b><strong>Accueil café</strong><br>Retrait des badges, rencontres</li><li><b>9 h 30</b><strong>Ouverture</strong><br>[Prénom Nom], [fonction]</li><li><b>10 h 00</b><strong>Conférence : [titre]</strong><br>[Intervenant]</li><li><b>11 h 30</b><strong>Ateliers en parallèle</strong><br>Salle A : [thème] · Salle B : [thème]</li><li><b>12 h 30</b><strong>Déjeuner</strong></li><li><b>14 h 00</b><strong>Table ronde : [sujet]</strong><br>[Intervenants]</li><li><b>16 h 00</b><strong>Clôture et cocktail</strong></li></ul>
<div class="sw-cols"><div class="sw-card tint"><h3 style="margin-top:0">📍 Accès</h3><p>[Adresse]<br>Métro [ligne], parking [nom]</p></div><div class="sw-card tint"><h3 style="margin-top:0">🎟️ Inscription</h3><p>Gratuite, sur [site] avant le [date]</p></div></div>`},

  {id:'certificat', name:'Certificat', cat:'Événements & loisirs', desc:'Format paysage, nom en grand, signatures', theme:{id:'elegant'}, page:{orient:'l', margins:'wide'}, title:'Certificat',
    html:`<p class="sw-center sw-kicker" style="margin-top:2.5em">[Organisme]</p><h1 class="sw-center" style="font-size:3.6em;margin:.2em 0">Certificat de réussite</h1><p class="sw-center">est décerné à</p><p class="sw-center sw-grad-text" style="font-size:2.6em;font-weight:800;margin:.3em 0">[Prénom Nom]</p><p class="sw-center sw-lead">pour avoir suivi avec succès la formation « [Intitulé] » ([durée]).</p><hr class="sw-divider dots">
<div class="sw-sign"><div><b>[Prénom Nom]</b>[Fonction] · le {{date}}</div><div><b>[Prénom Nom]</b>[Fonction]</div></div>`},

  {id:'faire-part', name:'Faire-part', cat:'Événements & loisirs', desc:'Naissance, mariage, anniversaire : centré et élégant', theme:{id:'pastel'}, page:{size:'A5', margins:'wide'}, title:'Faire-part',
    html:`<p class="sw-center" style="margin-top:3em;font-size:2.2em">🌿</p><p class="sw-center sw-kicker">Nous avons la joie de vous annoncer</p><h1 class="sw-center" style="font-size:2.8em">[Prénom] &amp; [Prénom]</h1><p class="sw-center sw-lead">se marient le [samedi 12 juin {{annee}}]</p><hr class="sw-divider dots"><p class="sw-center">La cérémonie aura lieu à [heure]<br>[Lieu], [ville]</p><p class="sw-center">Elle sera suivie d'un dîner à [lieu de réception].</p><p class="sw-center sw-small" style="margin-top:2em">Réponse souhaitée avant le [date]<br>[téléphone] · [email]</p>`},

  {id:'recette', name:'Fiche recette', cat:'Vie perso', desc:'Ingrédients, étapes, temps, astuces', theme:{id:'nature'}, page:{}, title:'Recette',
    html:`<p class="sw-kicker">Recette · Plat</p><h1>Tarte aux poireaux et au chèvre</h1><p class="sw-lead">Une tarte fondante, prête en moins d'une heure.</p>
<div class="sw-stats"><div class="sw-stat"><b>6</b><span>Personnes</span></div><div class="sw-stat"><b>20 min</b><span>Préparation</span></div><div class="sw-stat"><b>35 min</b><span>Cuisson</span></div><div class="sw-stat"><b>Facile</b><span>Difficulté</span></div></div>
<div class="sw-cols" data-cols="1-2"><div class="sw-col"><h3 style="margin-top:0">Ingrédients</h3><ul class="sw-check"><li>1 pâte brisée</li><li>3 poireaux</li><li>150 g de bûche de chèvre</li><li>3 œufs</li><li>20 cl de crème</li><li>1 noix de beurre</li><li>Sel, poivre, muscade</li></ul></div>
<div class="sw-col"><h3 style="margin-top:0">Préparation</h3><ol class="sw-steps"><li><b>Les poireaux</b>Émincez-les et faites-les fondre 15 min au beurre, à feu doux.</li><li><b>L'appareil</b>Battez les œufs avec la crème, salez, poivrez, ajoutez un peu de muscade.</li><li><b>Le montage</b>Étalez les poireaux sur la pâte, versez l'appareil, ajoutez le chèvre en rondelles.</li><li><b>La cuisson</b>35 min à 180 °C, jusqu'à ce que la tarte soit dorée.</li></ol></div></div>
<div class="sw-callout" data-sw-kind="tip"><p><b>Astuce</b>Ajoutez une poignée de noix concassées au moment d'enfourner.</p></div>`},

  {id:'planning-semaine', name:'Planning de la semaine', cat:'Vie perso', desc:'Format paysage, du lundi au dimanche', theme:{id:'spectra'}, page:{orient:'l', margins:'narrow'}, title:'Planning de la semaine',
    html:`<div class="sw-head"><div><h1 style="margin:0">Planning de la semaine</h1></div><div class="sw-right"><p class="sw-kicker">Semaine du [date]</p></div></div>
<table class="sw-table t-grid"><thead><tr><th></th><th>Lundi</th><th>Mardi</th><th>Mercredi</th><th>Jeudi</th><th>Vendredi</th><th>Samedi</th><th>Dimanche</th></tr></thead><tbody>${T_ROWS([['<b>Matin</b>', '', '', '', '', '', '', ''], ['<b>Midi</b>', '', '', '', '', '', '', ''], ['<b>Après-midi</b>', '', '', '', '', '', '', ''], ['<b>Soir</b>', '', '', '', '', '', '', '']])}</tbody></table>
<div class="sw-cols" data-cols="3"><div class="sw-card tint"><h3 style="margin-top:0">🎯 Priorités</h3><ul class="sw-check"><li>[…]</li><li>[…]</li><li>[…]</li></ul></div><div class="sw-card tint"><h3 style="margin-top:0">🛒 Courses</h3><ul class="sw-check"><li>[…]</li><li>[…]</li></ul></div><div class="sw-card tint"><h3 style="margin-top:0">📝 Notes</h3><p>[…]</p></div></div>`},

  {id:'carnet-voyage', name:'Carnet de voyage', cat:'Vie perso', desc:'Itinéraire jour par jour, budget, valise', theme:{id:'ocean'}, page:{}, title:'Carnet de voyage',
    html:`<div class="sw-hero"><p class="sw-kicker">Carnet de voyage · [mois] {{annee}}</p><h1>[Destination]</h1><p class="sw-lead">[Nombre] jours entre [ville] et [ville].</p></div>
<div class="sw-stats"><div class="sw-stat"><b>[10]</b><span>Jours</span></div><div class="sw-stat"><b>[4]</b><span>Étapes</span></div><div class="sw-stat"><b>[1 800 €]</b><span>Budget</span></div></div>
<h2>Itinéraire</h2><ul class="sw-timeline"><li><b>Jour 1</b><strong>Arrivée à [ville]</strong><br>[Hébergement, première balade]</li><li><b>Jours 2-3</b><strong>[Étape]</strong><br>[À voir, à faire]</li><li><b>Jours 4-6</b><strong>[Étape]</strong><br>[À voir, à faire]</li><li><b>Jour 10</b><strong>Retour</strong></li></ul>
<h2>Budget</h2><table class="sw-table t-zebra"><thead><tr><th>Poste</th><th class="r">Prévu</th><th class="r">Dépensé</th></tr></thead><tbody>${T_ROWS([['Transport', '[0 €]', ''], ['Hébergement', '[0 €]', ''], ['Repas', '[0 €]', ''], ['Activités', '[0 €]', '']])}</tbody></table>
<div class="sw-cols"><div class="sw-card tint"><h3 style="margin-top:0">🧳 Dans la valise</h3><ul class="sw-check"><li>Passeport / carte d'identité</li><li>Chargeurs et adaptateur</li><li>Trousse de secours</li></ul></div><div class="sw-card tint"><h3 style="margin-top:0">📞 Utile</h3><p>Urgences : [numéro]<br>Hébergement : [contact]<br>Assurance : [contrat]</p></div></div>`},

  {id:'resiliation', name:'Lettre de résiliation', cat:'Essentiels', desc:'Abonnement, assurance, contrat : en recommandé', theme:{id:'ardoise'}, page:{}, title:'Lettre de résiliation',
    html:`<div class="sw-head"><div><b>Prénom Nom</b><br>12 rue de l'Exemple<br>59000 Lille<br>N° de client / contrat : [000000]</div><div class="sw-right"><br><br><b>[Nom de la société]</b><br>Service résiliations<br>Adresse<br>Code postal Ville</div></div>
<p class="sw-right">Lille, le {{date}}</p>
<p><b>Objet : </b>résiliation du contrat n° [000000]</p><p><b>Lettre recommandée avec accusé de réception</b></p>
<p>Madame, Monsieur,</p>
<p>Par la présente, je vous informe de ma décision de résilier le contrat [type de contrat] n° [000000], souscrit le [date].</p>
<p>Conformément [aux conditions générales du contrat / à l'article L. 113-15-2 du Code des assurances / à la loi applicable], cette résiliation prendra effet [à l'échéance du / un mois après réception de ce courrier].</p>
<p>Je vous remercie de bien vouloir me confirmer la prise en compte de cette demande et de m'adresser le solde de tout compte.</p>
<p>Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.</p>
<p class="sw-right" style="margin-top:2.5em">Prénom Nom<br><span class="sw-small">Signature</span></p>`},
);
