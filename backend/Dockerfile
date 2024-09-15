# Use an official Node.js image as the base
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /usr/src/app/api

ENV NODE_ENV=production

# Set a placeholder DATABASE_URL for build-time, we'll replace this later
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public"

COPY api/package*.json ./
RUN npm install

COPY api/src/database/prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]