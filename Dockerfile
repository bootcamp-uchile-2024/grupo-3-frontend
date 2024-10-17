FROM node:18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM nginx:alpine

COPY --from=build /usr/app/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 80


