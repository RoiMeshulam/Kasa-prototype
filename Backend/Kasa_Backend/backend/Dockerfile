FROM node:16

WORKDIR /app

ARG NODE_ENV=production

# Copy package files from current directory (build context is already Backend/Kasa_Backend/backend)
COPY package*.json ./
RUN npm ci || npm install

COPY . .

ENV NODE_ENV=${NODE_ENV}
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
