export const durationOptions = {
  hour: "Heure",
  day: "Jour",
  week: "Semaine",
  month: "Mois",
  year: "Année",
  fixed: "Prix fixe"
}

export const vehicleBrands = {
  cars: [
    "Toyota", "Honda", "Ford", "Chevrolet", "Mercedes-Benz", "BMW", "Audi", "Volkswagen", 
    "Nissan", "Hyundai", "Kia", "Peugeot", "Renault", "Citroën", "Mazda", "Subaru", 
    "Volvo", "Jaguar", "Land Rover", "Porsche", "Tesla", "Fiat", "Jeep", "Dodge", 
    "Lexus", "Mitsubishi", "Suzuki", "Alfa Romeo", "Chrysler", "Acura", "Infiniti",
    "Opel", "Skoda", "Bentley", "Ferrari", "Lamborghini", "Maserati", "Bugatti", 
    "Rolls-Royce", "Genesis", "Seat", "Dacia", "Tata Motors"
  ],
  motorcycles: [
    "Yamaha", "Honda", "Kawasaki", "Suzuki", "Ducati", "Harley-Davidson", "BMW Motorrad",
    "KTM", "Triumph", "Aprilia", "Royal Enfield", "Bajaj", "TVS", "Hero", "Benelli",
    "Husqvarna", "Moto Guzzi", "MV Agusta", "Indian Motorcycle", "Vespa", "Piaggio",
    "CFMoto", "Zero Motorcycles", "Norton", "Buell", "Fantic", "Zontes", "Lifan", "SYM"
  ],
  buses: [
    "Mercedes-Benz", "Volvo", "Scania", "MAN", "Iveco", "Renault", "Tata Motors", "Ashok Leyland",
    "Hino", "Hyundai", "DAF", "Ford", "BYD", "Blue Bird", "Setra", "Van Hool", "Gillig", 
    "Yutong", "Neoplan", "Alexander Dennis", "New Flyer", "Thomas Built Buses", "Irizar"
  ],
  trucks: [
    "Mercedes-Benz", "Volvo", "Scania", "MAN", "Iveco", "DAF", "Mack", "Kenworth",
    "Peterbilt", "Freightliner", "Western Star", "Ford Trucks", "Tata Motors", 
    "Ashok Leyland", "Hino", "Isuzu", "Hyundai", "Dongfeng", "FAW", "Foton", "SINOTRUK",
    "Kamaz", "Mahindra", "Navistar", "GMC", "Chevrolet Trucks", "Ram Trucks"
  ]
};

export const vehicleModels = {
  cars: {
    Toyota: ["Corolla", "Camry", "RAV4", "Land Cruiser", "Yaris", "Hilux", "Highlander", "Prius"],
    Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Odyssey", "Fit", "Ridgeline"],
    Ford: ["Focus", "Mustang", "Fiesta", "Explorer", "F-150", "Edge", "Bronco", "Escape"],
    Chevrolet: ["Malibu", "Impala", "Equinox", "Tahoe", "Silverado", "Camaro", "Traverse"],
    "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "G-Wagon"],
    BMW: ["1 Series", "3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "M3"],
    Audi: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "R8"],
    Volkswagen: ["Golf", "Passat", "Polo", "Tiguan", "Jetta", "Touareg", "Arteon"],
    Nissan: ["Micra", "Sentra", "Altima", "Maxima", "Qashqai", "X-Trail", "GT-R"],
    Hyundai: ["i10", "i20", "Elantra", "Tucson", "Santa Fe", "Palisade", "Kona"],
    Kia: ["Rio", "Cerato", "Sportage", "Sorento", "Seltos", "Telluride", "Stinger"],
    Peugeot: ["208", "308", "508", "2008", "3008", "5008", "Rifter"],
    Renault: ["Clio", "Megane", "Kadjar", "Captur", "Talisman", "Scenic", "Koleos"]
  },
  motorcycles: {
    Yamaha: ["YZF-R1", "YZF-R6", "MT-07", "MT-09", "XSR700", "XSR900", "FZ-09", "Tenere 700"],
    Honda: ["CBR1000RR", "CBR500R", "Africa Twin", "Rebel 500", "Gold Wing", "CB500F"],
    Kawasaki: ["Ninja 400", "Ninja 650", "Ninja ZX-10R", "Z900", "Z1000", "Versys 1000"],
    Suzuki: ["GSX-R1000", "GSX-R750", "V-Strom 650", "V-Strom 1050", "SV650", "Burgman 400"],
    Ducati: ["Panigale V4", "Multistrada V4", "Monster 821", "Diavel", "Scrambler 1100"],
    "Harley-Davidson": ["Iron 883", "Sportster S", "Street Glide", "Road King", "Fat Boy"],
    KTM: ["Duke 390", "Duke 790", "1290 Super Duke", "RC 390", "Adventure 890"],
    Triumph: ["Street Triple", "Bonneville T100", "Tiger 900", "Speed Twin"],
    "Royal Enfield": ["Classic 350", "Meteor 350", "Interceptor 650", "Himalayan"]
  },
  buses: {
    "Mercedes-Benz": ["Citaro", "Tourismo", "Sprinter City", "Intouro"],
    Volvo: ["7900 Electric", "9700", "9900", "B11R"],
    Scania: ["Citywide", "Omnilink", "Interlink", "Touring"],
    MAN: ["Lion's Coach", "Lion's City", "Neoplan Skyliner"],
    Iveco: ["Crossway", "Daily Minibus", "Evadys"],
    "Tata Motors": ["Starbus", "Marcopolo", "Ultra"],
    Hino: ["Poncho", "Blue Ribbon", "S'elega"],
    Hyundai: ["Universe", "County", "Super Aero City"]
  },
  trucks: {
    "Mercedes-Benz": ["Actros", "Arocs", "Econic"],
    Volvo: ["FH16", "FMX", "FE", "FL"],
    Scania: ["R-Series", "S-Series", "P-Series"],
    MAN: ["TGX", "TGM", "TGL"],
    Iveco: ["Stralis", "Eurocargo", "Daily Van"],
    DAF: ["XF", "CF", "LF"],
    Mack: ["Anthem", "Pinnacle", "Granite"],
    Kenworth: ["T680", "T800", "W900"],
    Peterbilt: ["579", "389", "567"],
    Freightliner: ["Cascadia", "M2 106", "Argosy"],
    Isuzu: ["N-Series", "F-Series", "Giga"],
    TataMotors: ["Prima", "Signa", "Ultra"]
  }
};

export const fuelTypes = ["Essence", "Diesel", "Électrique", "Hybride", "GPL", "Hydrogène"];
export const years = Array.from({ length: 2025 - 1995 + 1 }, (_, i) => 1995 + i);

export const categories = [
  { label: "Chambre à louer", value: "Chambre à louer" },
  { label: "Appartements", value: "Appartements" },
  { label: "Studio", value: "Studio" },
  { label: "Maison", value: "Maison" },
  { label: "Villa", value: "Villa" },
  { label: "Hôtel", value: "Hôtel" },
  { label: "Salle de conférence", value: "Salle de conférence" },
  { label: "Salle de fête", value: "Salle de fête" },
  { label: "Bureau", value: "Bureau" },
  { label: "Local commercial", value: "Local commercial" },
  { label: "Magasin", value: "Magasin" },
  { label: "Parcelle", value: "Parcelle" },
  
  // Véhicules
  { label: "Voiture", value: "Voiture" },
  { label: "Moto", value: "Moto" },
  { label: "Camion", value: "Camion" },
  { label: "Bus", value: "Bus" },

  // Matériels et équipements spécifiques
  { label: "Meubles", value: "Meubles" },
  { label: "Équipements de bureau", value: "Équipements de bureau" },
  { label: "Équipements électroménagers", value: "Équipements électroménagers" },
  { label: "Équipements industriels", value: "Équipements industriels" },
  { label: "Matériel de construction", value: "Matériel de construction" },
  { label: "Matériel agricole", value: "Matériel agricole" }
];


export const amenitiesByCategory = [
  {
    category: "Logements",
    types: ["Chambre à louer", "Appartements", "Villa", "Studio", "Hôtel", "Maison"],
    amenities: [
      "Télévision", "Wi-Fi", "Climatiseur", "Réfrigérateur", "Machine à laver",
      "Micro-ondes", "Plaque de cuisson", "Four", "Cafetière", "Chauffe-eau",
      "Détecteur de fumée", "Extincteur", "Fer à repasser", "Sèche-cheveux",
      "Balcon", "Piscine", "Parking", "Caméra de surveillance", "Gardiennage",
      "Générateur de secours", "Ascenseur"
    ]
  },
  {
    category: "Salle de fête & Salle de conférence",
    types: ["Salle de fête", "Salle de conférence"],
    amenities: [
      "Sonorisation incluse", "Projecteur", "Écran géant", "Éclairage LED",
      "Climatisation", "Microphones", "Scène", "Cuisine équipée", "Tables et chaises",
      "Parking privé", "Sécurité et surveillance"
    ]
  },
  {
    category: "Espaces commerciaux",
    types: ["Bureau", "Magasin", "Local commercial"],
    amenities: [
      "Espace climatisé", "Connexion Internet", "Système de sécurité", "Bureau et chaises",
      "Réception", "Salle de réunion", "Accès 24/7", "Parking réservé", "Ascenseur"
    ]
  },
  {
    category: "Véhicules",
    types: ["Voiture", "Moto"],
    amenities: [
      "Climatisation", "Système audio", "GPS intégré", "Caméra de recul", "Sièges en cuir",
      "Boîte automatique / manuelle", "Toit ouvrant", "Capteurs de stationnement",
      "Système antivol"
    ]
  },
  {
    category: "Équipements & Meubles",
    types: ["Équipements", "Meubles"],
    amenities: [
      "Canapé-lit", "Lit bébé", "Bureau", "Chaise ergonomique", "Table de salon",
      "Armoire", "Bibliothèque", "Lampe de chevet"
    ]
  }
];

export const eventTypes = ['Mariage', 'Conférence', 'Séminaire', 'Fête d\'entreprise', 'Anniversaire'];

export const statePropertys = {
  new: 'Nouveau',
  renovated: 'Rénové',
  old: 'Ancien'
}

export const statusValidateTab = [
  { title: 'Tout', color: 'warning', value: 'tout' },
  { title: 'En attente', color: 'warning', value: 'pending' },
  { title: 'Terminé', color: 'success', value: 'completed' },
  { title: 'En cours', color: 'success', value: 'progress' },
  { title: 'Annulé', color: 'error', value: 'cancelled' }
]

export const statusPayObj = {
  pending: { text: 'En cours', color: 'warning' },
  unpaid: { text: 'En cours', color: 'warning' },
  completed: { text: 'Succès', color: 'success' },
  success: { text: 'Succès', color: 'success' },
  refunded: { text: 'Remboursé', color: 'secondary' },
  failed: { text: 'Echoué', color: 'error'},
  approved: { text: 'Approuvé', color: 'primary' },
  rejected: { text: 'Rejeté', color: 'error'},
  paid: { text: 'Payé', color: 'success' }
}

export const statusPayTab = [
  { text: 'Tout', color: 'warning', value: 'tout' },
  { text: 'En cours', color: 'warning', value: 'pending' },
  { text: 'Succès', color: 'success', value: 'success' },
  { text: 'Remboursé', color: 'secondary', value: 'refunded' },
  { text: 'Echoué', color: 'error', value: 'failed'},
]

export const statusPayTab2 = [
  { text: 'Tout les statuts', color: 'warning', value: 'tout' },
  { text: 'En attente', color: 'warning', value: 'pending' },
  { text: 'rejeté', color: 'success', value: 'rejected' },
  { text: 'approuvé', color: 'secondary', value: 'approved' },
  { text: 'payé', color: 'error', value: 'paid'},
]

export const statusLocObj = {
  pending: { text: 'En cours', color: 'warning' },
  completed: { text: 'Terminé', color: 'success' },
  confirmed: { text: 'Confirmé', color: 'success' },
  progress: { text: 'En cours', color: 'warning' },
  cancelled: { text: 'Annulé', color: 'error'},
}

export const statusLocTab = [
  { text: 'En cours', color: 'warning', value: 'pending' },
  { text: 'Terminé', color: 'success', value: 'completed' },
  { text: 'En cours', color: 'warning', value: 'progress' },
  { text: 'Annulé', color: 'error', value: 'cancelled'},
]

export const typeTab = [
  { title: "Location", color: "warning", value: 'forRent'},
  { title: "Réservation", color: "primary", value: 'forRent'},
  { title: "Vente", color: "primary", value: 'sale'},
]

export const statesProperty = {
  "renovated": "Rénové",
  "new": "Nouveau",
  "old": "Ancien",
}

export const categories2 = [
  {
    name: "Hébergements",
    subcategories: [
      "Hôtel",
      "Appartements",
      "Salle de conférence",
      "Chambre à louer",
      "Autres"
    ]
  },
  {
    name: "Transports",
    subcategories: [
      "Voitures",
      "Motos",
      "Tricycles",
      "Camions",
      "Bus",
      "Autres"
    ]
  },
  {
    name: "Électroménagers",
    subcategories: [
      "TV plasma",
      "Woofer",
      "Réfrigérateur",
      "Congélateur",
      "Ordinateur",
      "Imprimante"
    ]
  },
  {
    name: "Restaurations",
    subcategories: [
      "À venir…" // tu pourras compléter plus tard
    ]
  },
  {
    name: "Événementiels",
    subcategories: [
      "Sonorisations",
      "Bâches",
      "Maître de Cérémonie",
      "Chaises et Tables",
      "Buffet",
      "Autres"
    ]
  },
  {
    name: "Autres",
    subcategories: [
      "Création personnalisée par l'utilisateur"
    ],
    allowCustom: true // indique que l'utilisateur peut ajouter ici
  }
];

export const permissionsArray2 = [ 
  { value: 'dashboard', label: 'Vue générale' },
  { value: 'all', label: 'Tous les accès' },
  { value: 'view_products', label: 'Voir les produits' },
  { value: 'add_products', label: 'Ajouter des produits' },
  { value: 'users', label: 'Gérer les utilisateurs' },
  { value: 'customer', label: 'Gérer les clients' },
  { value: 'statistics', label: 'Voir les statistiques' },
  { value: 'orders', label: 'Gérer les commandes' },
  { value: 'categories', label: 'Gérer les catégories' },
  { value: 'settings', label: 'Gérer les paramètres' },
  { value: 'subscriptions', label: 'Gérer les abonnements' },
  { value: 'payments', label: 'Gérer les paiements' },
  { value: 'newsletter', label: 'Gérer la newsletter' },
  { value: 'reviews', label: 'Gérer les avis' },
  { value: 'codePromo', label: 'Gérer les codes promo' },
  { value: 'admin', label: 'Gérer les administrateurs' },
  { value: 'tracking', label: 'Gérer les traçages' },
  { value: 'cart', label: 'Gérer les paniers abandonnés' },
  { value: 'admin_order_creation', label: 'Créer des commandes' },
];

export const colors = {
  "rouge": { name: 'Rouge', value: 'rouge', color: '#f44336' },
  "bleu": { name: 'Bleu', value: 'bleu', color: '#2196f3' },
  "vert": { name: 'Vert', value: 'vert', color: '#4caf50' },
  "jaune": { name: 'Jaune', value: 'jaune', color: '#ffeb3b' },
  "orange": { name: 'Orange', value: 'orange', color: '#ff9800' },
  "violet": { name: 'Violet', value: 'violet', color: '#9c27b0' },
  "rose": { name: 'Rose', value: 'rose', color: '#e91e63' },
  "noir": { name: 'Noir', value: 'noir', color: '#000000' },
  "blanc": { name: 'Blanc', value: 'blanc', color: '#ffffff' },
  "gris": { name: 'Gris', value: 'gris', color: '#9e9e9e' },
  "marron": { name: 'Marron', value: 'marron', color: '#795548' },
  "beige": { name: 'Beige', value: 'beige', color: '#f5f5dc' }
}