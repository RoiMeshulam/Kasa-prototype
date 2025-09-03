FROM node:16

WORKDIR /app

ARG NODE_ENV=production

COPY Backend/Kasa_Backend/backend/package*.json ./

RUN npm install

COPY Backend/Kasa_Backend/backend/ .

ENV NODE_ENV=${NODE_ENV}

EXPOSE 8080

ENV PORT=8080

CMD ["npm", "start"]