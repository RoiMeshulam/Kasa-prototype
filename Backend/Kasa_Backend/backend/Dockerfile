FROM node:16

WORKDIR /app

COPY Backend/Kasa_Backend/backend/package*.json ./

RUN npm install

COPY Backend/Kasa_Backend/backend/ .

EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

CMD ["npm", "start"]