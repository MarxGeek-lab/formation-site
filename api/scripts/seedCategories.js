const mongoose = require('mongoose');
const Category = require('../models/Categories');

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marxgeek_academy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('📌 Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Liste des catégories
const categories = [
  // 1. Fondamentaux
  { nameFr: "HTML", nameEn: "HTML" },
  { nameFr: "CSS", nameEn: "CSS" },
  { nameFr: "JavaScript (Débutant)", nameEn: "JavaScript Basics" },
  { nameFr: "Git & GitHub", nameEn: "Git & GitHub" },
  { nameFr: "Terminal & Commandes", nameEn: "Terminal & Commands" },

  // 2. Frontend
  { nameFr: "JavaScript Avancé", nameEn: "Advanced JavaScript" },
  { nameFr: "TypeScript", nameEn: "TypeScript" },
  { nameFr: "React.js", nameEn: "React.js" },
  { nameFr: "Next.js", nameEn: "Next.js" },
  { nameFr: "Vue.js", nameEn: "Vue.js" },
  { nameFr: "Nuxt.js", nameEn: "Nuxt.js" },
  { nameFr: "Angular", nameEn: "Angular" },
  { nameFr: "Tailwind CSS", nameEn: "Tailwind CSS" },
  { nameFr: "Animations Web (GSAP, Framer Motion)", nameEn: "Web Animations" },

  // 3. Backend
  { nameFr: "Node.js", nameEn: "Node.js" },
  { nameFr: "Express.js", nameEn: "Express.js" },
  { nameFr: "AdonisJS", nameEn: "AdonisJS" },
  { nameFr: "NestJS", nameEn: "NestJS" },
  { nameFr: "PHP & Laravel", nameEn: "Laravel" },
  { nameFr: "APIs REST & GraphQL", nameEn: "API Development" },
  { nameFr: "Sécurité Backend", nameEn: "Backend Security" },

  // 4. Bases de données
  { nameFr: "MongoDB", nameEn: "MongoDB" },
  { nameFr: "MySQL & SQL", nameEn: "SQL / MySQL" },
  { nameFr: "PostgreSQL", nameEn: "PostgreSQL" },
  { nameFr: "Redis", nameEn: "Redis" },
  { nameFr: "ORMs (Prisma, Sequelize, Mongoose)", nameEn: "ORM Tools" },

  // 5. Mobile
  { nameFr: "React Native", nameEn: "React Native" },
  { nameFr: "Expo", nameEn: "Expo" },
  { nameFr: "Flutter", nameEn: "Flutter" },

  // 6. DevOps
  { nameFr: "Linux & Ubuntu", nameEn: "Linux & Ubuntu" },
  { nameFr: "Docker", nameEn: "Docker" },
  { nameFr: "Nginx & Serveurs", nameEn: "Nginx & Servers" },
  { nameFr: "CI/CD (GitHub Actions)", nameEn: "CI/CD" },
  { nameFr: "Sécurité Serveur", nameEn: "Server Security" },

  // 7. Business & Carrière
  { nameFr: "Portfolio Développeur", nameEn: "Developer Portfolio" },
  { nameFr: "Freelancing & Clients", nameEn: "Freelancing" },
  { nameFr: "Soft Skills pour Développeurs", nameEn: "Soft Skills" },

  // 8. Projets pratiques
  { nameFr: "Projets Pratiques Web", nameEn: "Web Projects" },
  { nameFr: "Apps Mobiles Complètes", nameEn: "Mobile Apps" },
  { nameFr: "Clones de Sites", nameEn: "Website Clones" },
];

// Fonction de seed
async function seedCategories() {
  try {
    console.log("🗑 Suppression des anciennes catégories...");
    await Category.deleteMany({});

    console.log("📥 Insertion des nouvelles catégories...");
    await Category.insertMany(categories);

    console.log("✅ Catégories ajoutées avec succès !");
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
  } finally {
    mongoose.connection.close();
  }
}

seedCategories();
