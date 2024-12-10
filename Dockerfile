ARG IMAGEN
ARG ENDPOINT

FROM node:18-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Usa una imagen de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos generados por Vite a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para el servidor Nginx
EXPOSE 80
