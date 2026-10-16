# SPECTRA Writer · Studio Prism

Le traitement de texte de la **gamme SPECTRA** (Writer, Calc, Slide) : simple comme Canva, plus puissant que Word.
Même compte que le site Studio Prism, ARCHIPLAN et Archi Vision.

**En ligne :** https://groupestudioprism.github.io/SpectraWriter/
**Démo autonome** (comptes et documents dans le navigateur) : `dist/spectrawriter-demo.html`

## Ce que fait l'app

**Connexion** — compte Studio Prism (Firebase `archivision-studioprism`, comme ARCHIPLAN) : connexion, création de compte, fiche client, code PIN du compte (haché), empreinte / visage facultatifs, clé de licence, suppression du compte via le site. Écran au style SPECTRA (panneau prismatique).

**Accueil façon Word** — Accueil (nouveau document, modèles mis en avant, favoris, récents avec recherche, tri, vignettes ou liste), Modèles (par catégorie, + mes modèles), Mes documents (dossiers), Partagés avec moi. Glisser un fichier sur l'accueil l'importe. Aperçus vivants des pages (avec le thème du document).

**Éditeur**
- Pages réelles A4 / A5 / A3 / Lettre / Légal, portrait ou paysage, marges, saut de page automatique et manuel, en-tête, pied de page, numéros de page, couleur des pages, filigrane.
- Barre d'outils unique (pas de rubans) : styles de paragraphe, polices, taille, gras/italique/souligné/barré, couleurs (dont couleurs du thème), surlignage, alignements, listes, listes de tâches, retraits, interligne, liens, images, tableaux.
- **Façon Canva** : 13 thèmes appliqués à tout le document en un clic (couleurs + paire de polices, personnalisables), 35 blocs prêts à glisser (couvertures, bandeaux, encadrés, colonnes, chiffres clés, chronologie, étapes, tarifs, signatures…), éléments (émojis, étiquettes, symboles, formes), 14 modèles.
- **Puissance** : commande « / » (insérer n'importe quoi au clavier), raccourcis Markdown (`#`, `-`, `1.`, `[]`, `>`, `---`), sommaire automatique avec numéros de page, plan du document, poignée de bloc (déplacer, dupliquer, transformer), barre flottante sur la sélection, outils d'image (taille, habillage, style, légende, redimensionnement à la souris) et de tableau, rechercher / remplacer, typographie française automatique (espaces insécables, « guillemets », ’), statistiques, mode concentration, zoom, titre automatique, historique annuler / rétablir.
- **Exports** : PDF (pages fidèles), Word **.docx** (vrai fichier Word), page web, Markdown, texte, sauvegarde `.spectra`. **Import** : Word .docx, Markdown, texte, HTML, `.spectra`.
- Enregistrement automatique, partage par email ou par lien (lecture / modification, mot de passe), dossiers partagés, quotas.

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
| `src/js/` | Compte Studio Prism et code PIN (`auth.js`, repris d'ARCHIPLAN), cloud et accueil (`cloud.js`), menu du compte (`auth-end.js`) |
| `tools/build.py` | `python3 tools/build.py` → `index.html` (en ligne) et `dist/spectrawriter-demo.html` |
| `firebase/firestore.rules` | Règles Firestore complètes (site + SPECTRA Writer), à coller telles quelles dans la console |
| `firebase/firestore-spectrawriter.rules` | Le seul bloc SPECTRA Writer (pour mémoire) |
| `assets/` | Logos (tirés de la planche « Gamme SPECTRA »), favicon |

On modifie `src/`, on lance `python3 tools/build.py`, on enregistre sur `main` : GitHub Pages publie en une minute.

## À faire côté Firebase (une fois)

1. Copier **tout** le fichier `firebase/firestore.rules` (règles du site Studio Prism + bloc SPECTRA Writer déjà inséré) dans Firebase → Firestore → Règles, en remplaçant l'existant, puis Publier. Mettre aussi ce fichier dans le dépôt **Studio-Prism** (référence des règles). `firestore-spectrawriter.rules` n'est que le morceau ajouté : il ne se colle pas seul.
2. Créer le produit `spectrawriter` (nom « SPECTRA Writer ») dans l'administration du site, pour attribuer licences et clés.

Tant que les règles ne sont pas publiées, l'app fonctionne quand même : les documents sont enregistrés **sur l'appareil**, rattachés au compte, et un bandeau le signale.

La configuration Firebase écrite dans `index.html` est publique par conception ; la sécurité repose sur les règles. **Ne jamais ajouter de clé privée dans ce dépôt.**
