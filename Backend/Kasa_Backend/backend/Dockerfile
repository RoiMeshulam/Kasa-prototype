FROM node:20-slim

WORKDIR /app

# התקנת תלויות (מנצל קאש טוב)
COPY Backend/Kasa_Backend/backend/package*.json ./
# אם יש לך package-lock.json עדיף ci; אחרת השאר install
RUN npm ci --omit=dev || npm install --omit=dev

# העתקת קוד
COPY Backend/Kasa_Backend/backend/ ./

ENV NODE_ENV=production
# אל תכריח PORT; Cloud Run מספק PORT
EXPOSE 8080

# ריצה כמשתמש לא-פריבילגי
USER node

CMD ["npm", "start"]
