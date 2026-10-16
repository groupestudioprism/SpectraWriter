# SPECTRA Writer · Studio Prism

Le traitement de texte de la **gamme SPECTRA** (Writer, Calc, Slide) : simple comme Canva, plus puissant que Word.
Même compte que le site Studio Prism, ARCHIPLAN et Archi Vision.

**En ligne :** https://groupestudioprism.github.io/SpectraWriter/
**Démo autonome** (comptes et documents dans le navigateur) : `dist/spectrawriter-demo.html`

## Ce que fait l'app

**Connexion** — compte Studio Prism (Firebase `archivision-studioprism`, comme ARCHIPLAN) : connexion, création de compte, fiche client, code PIN du compte (haché), empreinte / visage facultatifs, clé de licence, suppression du compte via le site. Écran au style SPECTRA (panneau prismatique).

**Modèles** — 42 modèles Studio Prism (courriers, CV, RH et juridique, commercial, BTP, études, événements, vie perso), vos modèles personnels, et la **Communauté** : chacun peut publier un document comme modèle public (Fichier → Publier dans la Communauté). Chaque modèle est vérifié avant sa mise en ligne : onglet **Modération** pour les administrateurs (aperçu, analyse IA, publier, refuser avec motif). Les membres peuvent signaler un modèle publié ; il revient alors en modération (masqué après 3 signalements).

**Accueil** — « Que voulez-vous écrire ? » : tapez « facture », « cv », « compte rendu »… et le bon modèle est proposé, ou un document existant. Étagère de modèles, documents récents en vraies pages (vignettes ou liste, recherche, tri, favoris), onglets Mes documents (dossiers), Partagés avec moi, Modèles. Glisser un fichier sur l'accueil l'ouvre.

**Éditeur : l'interface Prisme**
- La page au centre, une seule barre en bas : la **barre Prisme**. À gauche l'écriture (style, police et taille, gras, couleurs, listes, alignement, lien), à droite cinq rayons colorés qui ouvrent un tiroir : **Insérer** (blocs, images, émojis, symboles, formes), **Thème** (13 thèmes + couleurs, polices, taille, interligne), **Page** (format, orientation, marges, numéros, en-tête, pied de page, couleur, filigrane, appliqués en direct), **Plan** (titres avec numéros de page, statistiques, objectif de mots), **Modèles**.
- **Le Spectre** (Ctrl + K, ⌘ K) : on écrit ce qu'on veut faire, en français.
  - Les ordres simples sont compris sur place, instantanément et hors ligne : « tableau de 4 lignes et 3 colonnes », « mets ce paragraphe en rouge », « remplace chantier par projet », « passe en paysage puis ajoute les numéros de page », « thème océan », « filigrane confidentiel », « va à la page 3 », « exporte en PDF »…
  - Le reste part à **l'IA** (Gemini via Firebase AI Logic) : rédiger, résumer, corriger, traduire, reformuler, transformer en tableau, créer un document complet mis en page. On voit un aperçu, puis on insère, remplace ou annule (Ctrl + Z). Depuis l'accueil, « Créer avec l'IA » rédige tout un document. Limite : 25 demandes par jour (gratuit), 300 (licence), 1 000 (admin).
- **Le fil du document** : un repère par titre sur le bord droit, pour sauter d'une partie à l'autre.
- Commande « / », raccourcis Markdown, émojis avec « : » (`:idee`, `:ok`…), poignée de bloc, barres d'image et de tableau, sommaire automatique avec numéros de page, rechercher / remplacer, typographie française automatique, **historique des versions** (sur l'appareil), mode concentration, interface claire ou sombre.
- Pages réelles A4 / A5 / A3 / Lettre / Légal, sauts de page automatiques, impression et PDF fidèles.
- **Exports** : PDF, Word **.docx**, page web, Markdown, texte, sauvegarde `.spectra`. **Import** : Word .docx, Markdown, texte, HTML, `.spectra`.
- Enregistrement automatique, partage par email ou par lien, dossiers partagés, quotas. L'app s'installe comme une application (service worker).

## Offres

| Offre | Cloud | Dossiers | Exports |
| --- | --- | --- | --- |
| Gratuite | 10 Mo | 5 privés + 3 partagés | PDF et texte |
| Licence SPECTRA Writer (`licenses/{uid}_spectrawriter`) | 50 Mo | 5 + 3 | Tous |
| Administrateur | 1 Go | 5 + 3 | Tous |

## Contenu du dépôt

| Fichier | Rôle |
| --- | --- |
| `src/parts/` | En-tête et structure de la page (intro, compte, accueil, éditeur) |
| `src/css/` | Charte SPECTRA : `base`, `splash`, `auth`, `home`, `editor` (+ impression) |
| `src/editor/` | Éditeur : assainissement, thèmes, modèles, blocs, cœur (pagination, mise en forme, historique), panneaux, import/export, démarrage |
| `src/js/` | Compte Studio Prism et code PIN (`auth.js`, repris d'ARCHIPLAN), cloud et accueil (`cloud.js`), Communauté et modération (`community.js`), IA (`ai.js`), menu du compte (`auth-end.js`) |
| `tools/build.py` | `python3 tools/build.py` → `index.html` (en ligne) et `dist/spectrawriter-demo.html` |
| `firebase/firestore.rules` | Règles Firestore complètes (site + SPECTRA Writer), à coller telles quelles dans la console |
| `firebase/firestore-spectrawriter.rules` | Le seul bloc SPECTRA Writer (pour mémoire) |
| `assets/` | Logos (tirés de la planche « Gamme SPECTRA »), favicon |

On modifie `src/`, on lance `python3 tools/build.py`, on enregistre sur `main` : GitHub Pages publie en une minute.

## À faire côté Firebase (une fois)

1. Copier **tout** le fichier `firebase/firestore.rules` (règles du site Studio Prism + bloc SPECTRA Writer déjà inséré) dans Firebase → Firestore → Règles, en remplaçant l'existant, puis Publier. Mettre aussi ce fichier dans le dépôt **Studio-Prism** (référence des règles). `firestore-spectrawriter.rules` n'est que le morceau ajouté : il ne se colle pas seul.
2. Activer l'IA : Firebase → **AI Logic** → Commencer → « Gemini Developer API » (https://console.firebase.google.com/project/archivision-studioprism/ailogic). Conseillé ensuite : App Check et un quota par utilisateur dans la console.
3. Créer le produit `spectrawriter` (nom « SPECTRA Writer ») dans l'administration du site, pour attribuer licences et clés.

Tant que les règles ne sont pas publiées, l'app fonctionne quand même : les documents sont enregistrés **sur l'appareil**, rattachés au compte, et un bandeau le signale.

La configuration Firebase écrite dans `index.html` est publique par conception ; la sécurité repose sur les règles. **Ne jamais ajouter de clé privée dans ce dépôt.**
