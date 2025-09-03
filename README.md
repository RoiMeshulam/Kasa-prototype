# ♻️ Kasa – Smart Recycling System

> Mobile + Machine apps with a Node.js backend for real-time bottle recycling, wallet balance, and session control.

---

## 📌 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [API Examples](#api-examples)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Repositories](#repositories)
- [Roadmap](#roadmap)
- [License](#license)

---

## 📌 Overview

**Kasa** is a smart recycling platform:
- Users scan a **machine QR** to open a session, scan bottle **barcodes**, insert bottles, and watch their **wallet** update in real time.  
- Machines receive session updates and confirm insertions.  
- Backend orchestrates **sessions**, balances, and **real-time** communication.  

---

## ✅ Features

- **QR/Barcode scanning** (machine hand-shake, bottle scans)  
- **Realtime sync** via **Socket.IO**  
- **User wallet** with instant balance updates  
- **Session lifecycle** (open → bottle scans → close + persist)  
- **History** of sessions and bottles  
- **Authentication** with **Firebase Auth** (email/password; google optional)  
- **Cross-platform** apps (Android & iOS) with **Expo**  

---

## 🛠 Technologies Used

### Backend
- **Node.js + Express** – REST API (users, sessions, bottles, machines)  
- **Socket.IO** – WebSocket server (user ↔ machine)  
- **Firebase Authentication** – secure sign-in (email/phone)  
- **Firebase Realtime Database / Firestore** – session feed, history & profiles  
- **JWT / Sessions** – authenticated API & WS  

### Mobile Apps
- **React Native (Expo)**  
- **expo-camera** – QR & barcode  
- **React Navigation**  
- **Context API / hooks** – global state (user, sessions, balance)  

---

## 🧭 Architecture


## 📦 Data Model

**Session**
```json
{
  "sessionId": "sessionId-123",
  "machineId": "machine-123",
  "userId": "user-123",
  "status": "active | closed",
  "bottles": {
    "ID123": { "id": "ID123", "name": "Coke 500ml", "price": 0.30, "quantity": 2 }
  },
  "balance": 1.5,
  "startedAtISO": "2025-08-01T12:34:56.000Z",
  "endedAtISO": "2025-08-01T12:34:58.000Z"
}
```

**User**
```json
{
  "uid": "user-123",
  "email": "user@example.com",
  "name": "Roi",
  "phoneNumber": "05020202021",
  "balance": "123.30"
}
```

**Machine**
```json
{
  "id": "machine-123",
  "name": "Kasa TLV #1",
  "location": { "lat": 32.07, "lng": 34.78 },
  "last_maintaince": "2025-06-10",
  "qr_id":"qr-machine-009-PTK-EmHaMoshavot",
  "status": "available"
}
```

---

**Bottle**
```json
{
  "id": "bottle-123",
  "name": "קוקה קולה",
  "price": "0.30",
  "type": "plastic",
}
```

---

## 🔌 API Examples

**Start session (QR handshake)**
```http
POST /api/sessions/start
Content-Type: application/json

{ "machineId": "machine-123" }
```
_Response_
```json
{ "sessionId": "uuid", "status": "active" }
```

**Scan bottle**
```http
POST /api/sessions/:sessionId/bottles
Content-Type: application/json

{ "barcode": "7290001234567" }
```
_Response_
```json
{
  "added": { "id": "ID123", "name": "Coke 500ml", "price": 0.25, "quantity": 1 },
  "balance": 0.25
}
```

**End session**
```http
POST /api/sessions/:sessionId/end
```
_Response_
```json
{ "sessionId": "uuid", "status": "closed", "total": 1.5 }
```

**User history**
```http
GET /api/users/me/sessions?limit=20
```

---

## ⚙️ Installation

### Backend
```bash
git clone <backend-repo-url>
cd backend
npm install
# create .env (see below)
npm run dev   # or: npm start
```

### User App (Expo)
```bash
git clone <user-app-repo-url>
cd kasa-user-app
npm install
npx expo start
```

### Machine App (Expo)
```bash
git clone <machine-app-repo-url>
cd kasa-machine-app
npm install
npx expo start
```

---

## 🔐 Environment Variables (Quick copy-paste)

**Backend – Production (`.env`)**
~~~dotenv
NODE_ENV=production
PORT=8080
SERVER_URL=https://<public-prod-url>
INTERNAL_API_BASE=http://localhost:8080

# Firebase (PROD service account)
FIREBASE_PROJECT_ID=<prod-id>
FIREBASE_CLIENT_EMAIL=<svc-account@prod-project.iam.gserviceaccount.com>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional DB
DATABASE_URL=postgres://user:pass@host:5432/kasa
JWT_SECRET=<random-strong-secret>
~~~

**Backend – Test (`.env.test`)**
~~~dotenv
NODE_ENV=test
PORT=8080
SERVER_URL=https://<public-test-url>
INTERNAL_API_BASE=http://localhost:8080

# Firebase (TEST service account)
FIREBASE_PROJECT_ID=<test-id>
FIREBASE_CLIENT_EMAIL=<svc-account@test-project.iam.gserviceaccount.com>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

JWT_SECRET=<random-strong-secret-for-test>
~~~

**Mobile apps – Test (`.env.test`)**
~~~dotenv
EXPO_PUBLIC_ENVIRONMENT=test
EXPO_PUBLIC_BACKEND_URL="https://test-backend-393925206417.europe-west1.run.app"
EXPO_PUBLIC_WS_BASE="wss://test-backend-393925206417.europe-west1.run.app"
~~~

**Mobile apps – Production (`.env.production`)**
~~~dotenv
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_BACKEND_URL="https://backend-393925206417.europe-west1.run.app"
EXPO_PUBLIC_WS_BASE="wss://https://backend-393925206417.europe-west1.run.app"
~~~
---
## ▶️ Usage

### User App
- Scan **machine QR** → session opens  
- Scan **bottle barcode** → item appears with value  
- Insert bottle → machine confirms → **wallet** updates  
- End session → summary screen  

### Machine App
- Waits for **handshake**  
- Displays **bottles list** and **status**  
- Confirms insertions  
- Closes session on user finish  

---

## 📂 Repositories

- **Backend (Node.js + Express + Socket.IO + Firebase)** → `<link-here>`  
- **User App (React Native · Expo)** → `<link-here>`  
- **Machine App (React Native · Expo)** → `<link-here>`  

---


## 📄 License

MIT © 2025 Roi Meshulam , Naor Meshulam
