# Stage 1: Build Angular App
FROM node:20 AS build
WORKDIR /app

# Copiază doar fișierele necesare pentru instalarea dependențelor
COPY package.json package-lock.json ./

# Instalează dependențele (evită probleme de compatibilitate)
RUN npm install

# Copiază restul codului sursă
COPY . .

# Construiește aplicația pentru producție
RUN npm run build

# Stage 2: Serve App with Nginx
FROM nginx:1.25
COPY --from=build /app/dist/owasp-fe/browser /usr/share/nginx/html

# Copiază configurația Nginx optimizată pentru Angular SPA
COPY ./nginx.conf /etc/nginx/conf.d/default.conf