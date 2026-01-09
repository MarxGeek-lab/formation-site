# 📚 Script d'Import des Ebooks

## Description

Ce script permet d'importer automatiquement des ebooks dans la base de données MongoDB avec les fonctionnalités suivantes :

- ✅ Copie des fichiers PDF et couvertures dans le dossier `uploads`
- 🔐 Génération de PDFs preview cryptés avec mot de passe
- 📄 Création de pages de garde professionnelles
- 🔗 Génération de liens de téléchargement
- 💾 Insertion dans la base de données MongoDB

## Prérequis

```bash
npm install pdf-lib
```

## Structure des Dossiers

```
api/
├── uploads/
│   ├── ebooks/           # Fichiers PDF originaux
│   ├── ebook-previews/   # PDFs preview cryptés
│   └── covers/           # Images de couverture
└── scripts/
    └── importEbooks.js   # Script d'import
```

## Utilisation

```bash
cd api
node scripts/importEbooks.js
```

## Fonctionnalités

### 1. Copie des Fichiers

Le script copie automatiquement :
- Les fichiers PDF depuis `/ebook/` vers `/api/uploads/ebooks/`
- Les images de couverture vers `/api/uploads/covers/`

### 2. Génération de PDF Preview

Pour chaque ebook, un PDF de 2 pages est généré :

**Page 1 - Couverture :**
- Design professionnel avec couleurs #FA003F et #C70032
- Titre du produit
- Badge "APERÇU"
- Footer avec copyright

**Page 2 - Lien de Téléchargement :**
- Instructions claires
- Lien de téléchargement du fichier complet
- Informations de support

### 3. Cryptage du PDF

Le PDF preview est crypté avec :
- Un mot de passe unique généré automatiquement (8 caractères)
- Permissions limitées (pas de copie, modification, etc.)
- Lecture seule avec mot de passe

### 4. Insertion en Base de Données

Chaque produit est créé avec :
- Informations complètes (nom, description, prix)
- Descriptions enrichies avec emojis
- Avantages en français et anglais
- Lien vers les fichiers (ebook, preview, cover)
- Mot de passe de déverrouillage

## Modèle de Données

Le script ajoute ces champs au modèle `Product` :

```javascript
{
  ebookFile: String,      // Chemin vers le fichier PDF original
  ebookPreview: String,   // Chemin vers le PDF preview crypté
  ebookPassword: String,  // Mot de passe pour ouvrir le preview
  downloadLink: String    // URL de téléchargement du fichier complet
}
```

## Ebooks Importés

Le script importe automatiquement :

1. 📘 Guide de Démarrage - Programmation Web (2500 FCFA)
2. 🌐 Formation HTML Complète (4000 FCFA)
3. 🎨 Formation CSS Enrichie (5000 FCFA)
4. ⚡ Formation JavaScript Enrichie (6000 FCFA)
5. 🔗 Intégration HTML-CSS-JS (7500 FCFA)
6. 🎯 10 Projets Pratiques - Portfolio Complet (9000 FCFA)
7. ⚛️ React Débutant - Partie 1 (6000 FCFA)
8. ⚛️ React Débutant - Partie 2 (6000 FCFA)
9. ⚛️ React Intermédiaire - Partie 1 (7500 FCFA)
10. ⚛️ React Intermédiaire - Partie 2 (7500 FCFA)
11. 💪 React Exercices - Partie 1 (4000 FCFA)
12. 💪 React Exercices - Partie 2 (5000 FCFA)

## Exemple de Sortie

```
🚀 Démarrage de l'import des ebooks...

✅ Connecté à MongoDB

✅ Catégorie trouvée : Formation

📚 Traitement : 📘 Guide de Démarrage - Programmation Web
────────────────────────────────────────────────────────────
✅ Fichier copié : ebook_1234567890_0-Guide-Demarrage.pdf
✅ Fichier copié : cover_1234567890_0-Guide-Demarrage.png
🔑 Mot de passe généré : A7F3B2E1
✅ PDF preview créé : /api/uploads/ebook-previews/preview_1234567890_0-Guide-Demarrage.pdf
✅ Produit créé dans la base de données
   ID : 64f8a1b2c3d4e5f6g7h8i9j0
   Mot de passe : A7F3B2E1

... (pour chaque ebook)

============================================================
🎉 Import terminé !
   12 ebooks importés avec succès
   Catégorie "Formation" mise à jour (12 produits)
============================================================

✅ Déconnexion de MongoDB
```

## Variables d'Environnement

Le script utilise :
- `MONGODB_URI` : URL de connexion MongoDB (défaut: `mongodb://localhost:27017/marxgeek`)

## Sécurité

- ✅ PDFs cryptés avec mot de passe unique
- ✅ Permissions de lecture seule
- ✅ Pas de copie/modification autorisée
- ✅ Mots de passe stockés en base de données
- ✅ Fichiers originaux protégés dans `/uploads/ebooks/`

## Support

Pour toute question : support@academy.marxgeek.com.me

---

© MarxGeek Academy.me - Tous droits réservés
