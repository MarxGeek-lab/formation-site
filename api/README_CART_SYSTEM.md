# Système de Gestion de Paniers - MarxGeek Academy

## Vue d'ensemble

Ce système complet de gestion de paniers pour e-commerce permet de :
- Gérer les paniers d'utilisateurs connectés et non connectés
- Détecter et traiter les paniers abandonnés
- Envoyer des emails de relance automatiques
- Suivre les conversions et statistiques

## Architecture

```
api/
├── models/Cart.js                    # Modèle MongoDB pour les paniers
├── controllers/cartController.js     # Contrôleur avec toutes les méthodes CRUD
├── routes/cartRoutes.js             # Routes API REST
├── crons/cartAbandonmentCron.js     # Tâches cron pour paniers abandonnés
├── services/emailService.js        # Service d'envoi d'emails
├── config/cartConfig.js             # Configuration du système
└── examples/cartUsageExample.js     # Exemples d'utilisation
```

## Installation et Configuration

### 1. Dépendances

Les dépendances suivantes sont déjà incluses dans votre `package.json` :
- `mongoose` : ODM MongoDB
- `node-cron` : Tâches planifiées
- `uuid` : Génération d'identifiants uniques
- `nodemailer` : Envoi d'emails

### 2. Variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/rafly

# Configuration email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_FROM=noreply@rafly.com

# URLs
FRONTEND_URL=https://rafly.com

# Environnement
NODE_ENV=production
```

### 3. Intégration dans votre application

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cartAbandonmentCron = require('./crons/cartAbandonmentCron');

const app = express();

// Middleware
app.use(express.json());

// Routes de panier
app.use('/api/cart', require('./routes/cartRoutes'));

// Démarrer les tâches cron
cartAbandonmentCron.start();

// Connexion MongoDB et démarrage serveur
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log('Serveur démarré avec système de paniers');
    });
  });
```

## Utilisation des API

### Créer/Récupérer un panier

```javascript
POST /api/cart
{
  "sessionId": "unique-session-id",
  "email": "user@example.com" // optionnel
}
```

### Ajouter un produit

```javascript
POST /api/cart/items
{
  "sessionId": "unique-session-id",
  "productId": "64f123456789abcdef123456",
  "name": "Formation React",
  "price": 199,
  "quantity": 1,
  "image": "https://example.com/image.jpg",
  "category": "Formation",
  "options": { "size": "L", "color": "blue" }
}
```

### Récupérer un panier

```javascript
GET /api/cart?sessionId=unique-session-id
// ou pour utilisateur connecté
GET /api/cart (avec token Authorization)
```

### Modifier la quantité

```javascript
PUT /api/cart/items/64f123456789abcdef123456
{
  "sessionId": "unique-session-id",
  "quantity": 3
}
```

### Supprimer un produit

```javascript
DELETE /api/cart/items/64f123456789abcdef123456?sessionId=unique-session-id
```

### Marquer comme converti (après commande)

```javascript
POST /api/cart/convert
{
  "sessionId": "unique-session-id",
  "orderId": "64f123456789abcdef654321",
  "email": "user@example.com"
}
```

### Associer à un utilisateur (lors de la connexion)

```javascript
POST /api/cart/associate
Authorization: Bearer YOUR_JWT_TOKEN
{
  "sessionId": "unique-session-id"
}
```

## Fonctionnalités Avancées

### Gestion des Paniers Abandonnés

Le système détecte automatiquement les paniers abandonnés (inactifs depuis 12h par défaut) et :
1. Les marque comme `abandoned`
2. Envoie un email de relance si une adresse email est disponible
3. Peut envoyer des emails de suivi

### Tâches Cron Automatiques

- **Détection des abandons** : Toutes les heures
- **Envoi d'emails** : Toutes les 4 heures  
- **Nettoyage** : Tous les jours à 2h du matin

### Statistiques et Monitoring

```javascript
GET /api/cart/stats
Authorization: Bearer ADMIN_TOKEN

// Retourne :
{
  "activeCarts": 150,
  "abandonedCarts": 45,
  "convertedCarts": 230,
  "averageCartValue": 156.50,
  "topCarts": [...]
}
```

## Statuts des Paniers

- **`active`** : Panier en cours d'utilisation
- **`abandoned`** : Panier inactif depuis plus de 12h
- **`converted`** : Panier transformé en commande

## Emails de Relance

Le système génère automatiquement des emails HTML responsive avec :
- Liste des produits abandonnés
- Images et descriptions
- Bouton de retour au panier
- Lien de désabonnement

### Personnalisation des Templates

Modifiez la fonction `generateAbandonedCartEmailHTML()` dans `services/emailService.js` pour personnaliser l'apparence des emails.

## Sécurité

- Validation des données d'entrée
- Limitation du taux de requêtes
- Support de l'authentification optionnelle
- Chiffrement des données sensibles (configurable)

## Performance

- Index MongoDB optimisés
- Requêtes agrégées pour les statistiques
- Pagination automatique
- Pool de connexions configuré

## Exemples d'Intégration Frontend

### React/Next.js

```javascript
// hooks/useCart.js
import { useState, useEffect } from 'react';

export function useCart() {
  const [cart, setCart] = useState(null);
  const sessionId = localStorage.getItem('sessionId') || generateSessionId();

  const addToCart = async (product) => {
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        ...product
      })
    });
    const result = await response.json();
    setCart(result.data);
  };

  const getCart = async () => {
    const response = await fetch(`/api/cart?sessionId=${sessionId}`);
    const result = await response.json();
    if (result.success) setCart(result.data);
  };

  useEffect(() => {
    getCart();
  }, []);

  return { cart, addToCart, getCart };
}
```

### Vue.js

```javascript
// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,
    sessionId: localStorage.getItem('sessionId') || generateSessionId()
  }),
  
  actions: {
    async addItem(product) {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          ...product
        })
      });
      const result = await response.json();
      this.cart = result.data;
    }
  }
});
```

## Tests

### Test Manuel

Exécutez le fichier de démonstration :

```bash
node api/examples/cartUsageExample.js
```

Puis visitez `http://localhost:3000/demo` pour voir une démonstration complète.

### Exécution Manuelle des Tâches Cron

```javascript
const cartAbandonmentCron = require('./crons/cartAbandonmentCron');

// Détecter les paniers abandonnés
await cartAbandonmentCron.runManual({
  detectAbandoned: true,
  sendEmails: true,
  hoursThreshold: 12
});

// Obtenir les statistiques
const stats = await cartAbandonmentCron.getStats();
console.log(stats);
```

## Configuration Avancée

Modifiez `config/cartConfig.js` pour personnaliser :
- Seuils d'abandon
- Fréquence des tâches cron
- Templates d'emails
- Limites de sécurité
- URLs et liens

## Monitoring et Logs

Le système génère des logs détaillés pour :
- Opérations sur les paniers
- Envois d'emails
- Exécution des tâches cron
- Erreurs et exceptions

## Support et Maintenance

- Nettoyage automatique des anciens paniers
- Gestion des erreurs robuste
- Métriques de performance intégrées
- Compatible avec les systèmes de monitoring existants

---

## Démarrage Rapide

1. Copiez les fichiers dans votre projet API
2. Ajoutez les variables d'environnement
3. Intégrez les routes dans votre app Express
4. Démarrez les tâches cron
5. Testez avec `/demo`

Le système est maintenant prêt à gérer vos paniers e-commerce ! 🛒
