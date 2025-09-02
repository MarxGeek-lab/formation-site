// Liste des villes et quartiers du Bénin
export const beninCities = {
  "Cotonou": {
    "quartiers": [
      "Agla", "Akpakpa", "Cadjehoun", "Fidjrossè", "Gbégamey", 
      "Haie Vive", "Houéyiho", "Jéricho", "Maro-militaire", "Missèbo",
      "Patte d'Oie", "PK3", "Sikècodji", "St Jean", "St Michel",
      "Tokplégbé", "Vodjè", "Xwlacodji", "Zongo"
    ]
  },
  "Porto-Novo": {
    "quartiers": [
      "Adjarra", "Akonaboè", "Attakè", "Dowa", "Djassin", 
      "Houinmè", "Louho", "Ouando", "Tokpota"
    ]
  },
  "Parakou": {
    "quartiers": [
      "Albarika", "Banikanni", "Ganhi", "Guema", "Ladji-Farani",
      "Madina", "Titirou", "Wansirou", "Zongo"
    ]
  },
  "Abomey-Calavi": {
    "quartiers": [
      "Agori", "Akassato", "Arconville", "Cococodji", "Godomey",
      "Tankpè", "Togoudo", "Womey", "Zinvié"
    ]
  },
  "Bohicon": {
    "quartiers": [
      "Avogbana", "Ganhi", "Honmèho", "Kouhounou", "Lissèzoun",
      "Passagon", "Saclo", "Sodohomè", "Zongo"
    ]
  },
  "Natitingou": {
    "quartiers": [
      "Kantaborifa", "Kouandata", "Ourbouga", "Perma", "Tampègré",
      "Tigninti", "Yokossi"
    ]
  },
  "Ouidah": {
    "quartiers": [
      "Ahozon", "Djègbadji", "Fonsramè", "Gbèna", "Houakpè-Daho",
      "Pahou", "Savi", "Zomaï", "Zounguè"
    ]
  },
  "Lokossa": {
    "quartiers": [
      "Agamè", "Akodéha", "Anzamè", "Fongba", "Houin",
      "Kodji", "Ouèdèmè", "Tinou"
    ]
  },
  "Djougou": {
    "quartiers": [
      "Algayou", "Baparapei", "Bariénou", "Bassila", "Kolokondé",
      "Partago", "Pélébina", "Sérou"
    ]
  },
  "Abomey": {
    "quartiers": [
      "Agbokpa", "Djègbé", "Hounli", "Vidolé", "Zounzonmè"
    ]
  }
};

// Fonction utilitaire pour obtenir toutes les villes
export const getAllCities = () => Object.keys(beninCities);

// Fonction utilitaire pour obtenir tous les quartiers d'une ville
export const getQuartiersByCity = (cityName) => {
  return beninCities[cityName]?.quartiers || [];
};

// Fonction utilitaire pour vérifier si un quartier existe dans une ville
export const isQuartierInCity = (cityName, quartierName) => {
  return beninCities[cityName]?.quartiers.includes(quartierName) || false;
};
