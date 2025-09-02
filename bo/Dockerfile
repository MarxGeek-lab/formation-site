# Étape 1 : Utilisation de l'image Node.js
FROM node:18-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY package.json package-lock.json ./ 

COPY src/assets/iconify-icons /app/src/assets/iconify-icons

# Installation des dépendances
RUN npm install && npm run build:icons
RUN ls -la /app/src/assets/iconify-icons/


# Copie ddu reste de l'application
COPY . .

# Construction de l'application Next.js
RUN npm run build

# Étape 2 : Création d'une image plus légère pour exécuter l'application
FROM node:18-alpine

WORKDIR /app


# Copie du dossier `.next` et des fichiers nécessaires depuis le builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json .

# Définition du port d'écoute
EXPOSE 3000



# Lancement de l'application
CMD ["npm", "start"]
