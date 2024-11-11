# Etapa 1: Construcción de la aplicación
FROM node:18 AS build

ARG VITE_URL_ENDPOINT_BACKEND
ENV VITE_URL_ENDPOINT_BACKEND=$VITE_URL_ENDPOINT_BACKEND

WORKDIR /usr/src/app

# Instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto de los archivos y construimos la aplicación
COPY . .
RUN npm run build  # Este comando generará la carpeta "build"

# Etapa 2: Configuración de Nginx para servir la aplicación
FROM nginx:alpine

# Copiamos los archivos generados por la etapa de construcción a la carpeta de Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Exponemos el puerto 80 para Nginx
EXPOSE 80

# Comando de inicio de Nginx
CMD ["nginx", "-g", "daemon off;"]
