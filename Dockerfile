ARG IMAGEN
ARG VITE_API_URL
ARG VITE_URL_ENDPOINT_BACKEND

FROM node:18-alpine AS build

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_URL_ENDPOINT_BACKEND=${VITE_URL_ENDPOINT_BACKEND}

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80







