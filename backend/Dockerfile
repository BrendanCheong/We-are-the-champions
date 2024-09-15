# Use an official Node.js image as the base
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /usr/src/app/api

COPY api/package*.json ./
RUN npm install

COPY api/src/database/prisma/schema.prisma ./prisma/schema.prisma
COPY api/src/.env.dev .env

RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]