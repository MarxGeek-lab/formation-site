# Installation de QPDF pour le cryptage des PDFs

## 🔐 Pourquoi QPDF ?

Le script d'import des ebooks utilise `qpdf` pour crypter les PDFs preview avec un mot de passe AES-256 fort. Sans `qpdf`, les PDFs seront créés mais **non cryptés**.

## 📦 Installation

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install -y qpdf
```

### macOS

```bash
brew install qpdf
```

### Windows

Téléchargez depuis : https://github.com/qpdf/qpdf/releases

Ou avec Chocolatey :
```bash
choco install qpdf
```

## ✅ Vérification

```bash
qpdf --version
```

Vous devriez voir quelque chose comme :
```
qpdf version 11.x.x
```

## 🚀 Utilisation

Une fois `qpdf` installé, relancez le script d'import :

```bash
cd api
node scripts/importEbooks.js
```

Les PDFs seront automatiquement cryptés avec un mot de passe généré aléatoirement.

## 🔍 Vérifier le cryptage

Pour vérifier qu'un PDF est bien crypté :

```bash
node scripts/testPdfEncrypt.js
```

Puis essayez d'ouvrir le fichier généré dans `api/uploads/test/test_encrypted.pdf`

## 📝 Note

Si `qpdf` n'est pas disponible, le script continuera à fonctionner mais les PDFs preview ne seront **pas cryptés**. Le mot de passe sera quand même stocké dans la base de données et pourra être utilisé pour une vérification côté application.
