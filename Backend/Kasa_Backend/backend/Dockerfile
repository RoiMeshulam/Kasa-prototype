FROM node:16

WORKDIR /app

ARG NODE_ENV=production

# Copy package files from the backend directory
COPY Backend/Kasa_Backend/backend/package*.json ./
RUN npm ci || npm install

COPY Backend/Kasa_Backend/backend/ .

ENV NODE_ENV=${NODE_ENV}
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
