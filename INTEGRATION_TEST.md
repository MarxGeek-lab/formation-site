# Test d'intégration - Système d'abonnements

## Structure des données

### 1. Frontend → Backend (PaymentModal.tsx)
```javascript
{
  email: "user@example.com",
  phoneNumber: "12345678",
  items: [{
    id: "696175c6c3ce55c3bafbb249",  // ID MongoDB du plan
    name: "Basic",                     // Nom du plan
    price: 10000,                      // Prix en XOF
    quantity: 1,
    type: "abonnement",
    subscription: "{\"title\":\"Basic\",\"duration\":365,\"products\":[\"HTML\",\"CSS\",\"JavaScript\"]}"
  }],
  totalAmount: 10000,
  typeOrder: "abonnement",
  paymentMethod: "fedapay",
  paymentStatus: "paid",
  fedapayTransaction: {...}
}
```

### 2. Backend Processing (orderController.js)

#### Étape 1: Validation du plan
```javascript
// Ligne 111-115
subscriptionPlan = await Subscription.findById(item.id);
if (!subscriptionPlan) {
  return res.status(404).json({ message: 'Plan d\'abonnement introuvable' });
}
```

#### Étape 2: Construction de l'objet subscription
```javascript
// Ligne 128-134
subscriptionObject = {
  title: subscriptionPlan.title,      // "Basic"
  duration: subscriptionPlan.duration, // 365
  products: subscriptionPlan.products  // ["HTML", "CSS", "JavaScript"]
};
```

#### Étape 3: Création de l'item pour la commande
```javascript
// Ligne 141-152
productItems.push({
  product: null,                              // Pas de Product ref pour abonnements
  subscriptionPlan: subscriptionPlan._id,     // Ref vers Subscription
  quantity: 1,
  price: 10000,
  category: "Abonnement",
  subscription: subscriptionObject,            // Objet avec title, duration, products
  nameSubs: "Basic",                          // Nom du plan
  productList: "[\"HTML\",\"CSS\",\"JavaScript\"]", // Liste stringify
  type: "abonnement"
})
```

#### Étape 4: Calcul de la date d'expiration
```javascript
// Ligne 156-160
const duration = 365; // Depuis subscriptionPlanData
expiredAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
```

### 3. Structure de la commande enregistrée (Order)
```javascript
{
  _id: ObjectId("..."),
  customer: ObjectId("..."),
  items: [{
    subscriptionPlan: ObjectId("696175c6c3ce55c3bafbb249"),  // REF to Subscription
    product: null,
    quantity: 1,
    price: 10000,
    category: "Abonnement",
    type: "abonnement",
    nameSubs: "Basic",
    subscription: {
      title: "Basic",
      duration: 365,
      products: ["HTML", "CSS", "JavaScript"]
    },
    productList: "[\"HTML\",\"CSS\",\"JavaScript\"]"
  }],
  totalAmount: 10000,
  typeOrder: "abonnement",
  subscriptionExpiredAt: Date("2027-01-09"),
  paymentStatus: "paid",
  paymentMethod: "fedapay",
  fedapayTransaction: {...},
  email: "user@example.com",
  phoneNumber: "12345678",
  createdAt: Date("2026-01-09"),
  status: "confirmed"
}
```

### 4. Email envoyé (sendSubscriptionEmailConfirmation)
```javascript
// Ligne 621-622
const subscriptionName = "Basic";  // order.items[0].nameSubs
const WHATSAPP_LINK = "https://wa.me/+2290169816413?text=..."

// Email contient:
- Nom de l'abonnement: "Basic"
- Numéro de commande: "ORD-69617..."
- Montant: "10 000 FCFA"
- Liste des formations incluses:
  ✓ HTML
  ✓ CSS
  ✓ JavaScript
- Bouton WhatsApp avec lien pré-rempli
- Instructions en 4 étapes
```

## Avantages de cette structure

### ✅ Traçabilité complète
- `subscriptionPlan` référence directe au plan dans la BDD
- Possibilité de populate pour obtenir toutes les infos du plan
- Historique des plans même si modifiés plus tard

### ✅ Données embarquées
- `subscription` object contient un snapshot des données au moment de l'achat
- Garantit que l'utilisateur garde ce qui était promis même si le plan change

### ✅ Recherche facilitée
- `nameSubs` permet de filtrer/rechercher par nom de plan
- `type: "abonnement"` permet de distinguer des achats de formations
- `category: "Abonnement"` pour regroupement

### ✅ Flexibilité
- Peut gérer des plans qui n'existent plus dans la BDD (via subscription object)
- Peut gérer des plans personnalisés (en envoyant subscription sans id)
- Compatible avec l'ancien système (fallback si pas d'id)

## Points de vérification

### ✓ Modèle Order.js
- Champ `subscriptionPlan` ajouté (ref Subscription)
- Champ `nameSubs` ajouté (String)
- Champ `category` ajouté (String)
- Champ `type` ajouté (enum: achat/abonnement)
- Champ `subscription` existe déjà (Object)

### ✓ orderController.js
- Import du modèle Subscription
- Validation du plan avec Subscription.findById()
- Construction correcte de subscriptionObject
- Calcul de expiredAt depuis subscriptionPlanData.duration
- Remplissage de tous les champs items

### ✓ Email d'abonnement
- Utilise `order.items[0].nameSubs`
- Utilise `order.items[0].subscription.products`
- Affiche la liste des formations incluses
- Lien WhatsApp avec nom de plan encodé

## Test manuel

1. Aller sur le site → Section Tarification
2. Cliquer sur "Choisir ce plan" (plan Basic)
3. Remplir email/téléphone
4. Cliquer "Payer 10 000 XOF"
5. Compléter le paiement FedaPay (mode test: 100 FCFA)
6. Vérifier la confirmation à l'écran
7. Vérifier l'email reçu
8. Vérifier dans la BDD:
   ```javascript
   db.orders.findOne({typeOrder: "abonnement"}).pretty()
   ```

## Résultat attendu

- ✅ Commande créée avec subscriptionPlan référence
- ✅ Email envoyé avec liste des formations
- ✅ subscriptionExpiredAt = Date actuelle + 365 jours
- ✅ Bouton WhatsApp fonctionne avec message pré-rempli
- ✅ Pas de fichier ZIP créé ni envoyé
- ✅ Status = "confirmed" car payé
