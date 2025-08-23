# ♻️ Kasa – Smart Recycling System

> Mobile + Machine apps with a Node.js backend for real-time bottle recycling, wallet balance, and session control.

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Architecture](#-architecture)
- [Data Model](#-data-model)
- [API Examples](#-api-examples)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Repositories](#-repositories)
- [Roadmap](#-roadmap)
- [License](#-license)

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
- **Authentication** with **Firebase Auth** (email/password; phone optional)  
- **Cross-platform** apps (Android & iOS) with **Expo**  

---

## 🛠 Technologies Used

### Backend
- **Node.js + Express** – REST API (users, sessions, bottles, machines)  
- **Socket.IO** – WebSocket server (user ↔ machine)  
- **Firebase Authentication** – secure sign-in (email/phone)  
- **Firebase Realtime Database / Firestore** – session feed, history & profiles  
- **(Optional) PostgreSQL** – structured reporting & analytics  
- **JWT / Sessions** – authenticated API & WS  

### Mobile Apps
- **React Native (Expo)**  
- **expo-barcode-scanner / expo-camera** – QR & barcode  
- **React Navigation**  
- **Context API / hooks** – global state (user, sessions, balance)  

---

## 🧭 Architecture

```mermaid
flowchart LR
  subgraph Cloud[GCP / Azure]
    BE[Backend (Node.js + Express)\n• REST API\n• Socket.IO\n• Session memory\n• Firebase integrations]
    FB[(Firebase\n• Auth\n• RTDB (sessions feed)\n• Firestore (profiles/history))]
    PG[(PostgreSQL - optional)]
  end

  UA[User App (React Native · Expo)\n• Scan QR (machine)\n• Scan barcodes (bottles)\n• Wallet & history]
  MA[Machine App (React Native · Expo)\n• Waits for handshake\n• Receives bottle details\n• Confirms insertion]

  UA -- HTTPS (REST) --> BE
  BE -- HTTPS (REST) --> UA

  MA <--> BE:::ws
  UA <--> BE:::ws

  BE <--> FB
  BE <--> PG

  classDef ws stroke-dasharray: 4 3;
