# Étape 1 : Construire l'application Angular avec la version 18 de node.
FROM node:18 AS build-stage

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .	

# Construire l'application pour l'environnement de production
RUN npm run build --prod

# Étape 2 : Servir l'application
FROM nginx:alpine AS production-stage

# Copier les fichiers construits vers le répertoire par défaut de NGINX
COPY --from=build-stage /app/dist/ensitech-groupe3 /usr/share/nginx/html	

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
