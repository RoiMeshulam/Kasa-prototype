FROM node:16

WORKDIR /app

ARG NODE_ENV=production

# Copy everything first to understand structure
COPY . .

# Move to correct directory and install
WORKDIR /app/Backend/Kasa_Backend/backend
RUN npm ci || npm install

# Move files to app root
RUN cp -r /app/Backend/Kasa_Backend/backend/* /app/ && \
    rm -rf /app/Backend

WORKDIR /app

ENV NODE_ENV=${NODE_ENV}
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
