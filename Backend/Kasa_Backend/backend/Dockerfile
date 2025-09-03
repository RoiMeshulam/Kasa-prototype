FROM node:16

WORKDIR /app

ARG NODE_ENV=production

# Copy everything first to see the structure
COPY . .

# Navigate to the correct directory for package files
RUN find . -name "package.json" -type f

# Install dependencies from the correct location
RUN cd Backend/Kasa_Backend/backend && npm ci || npm install

# Move to the app directory
RUN cp -r Backend/Kasa_Backend/backend/* . && rm -rf Backend

ENV NODE_ENV=${NODE_ENV}
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
