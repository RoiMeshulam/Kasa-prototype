// backend/src/services/websocket.js
const { Server } = require('socket.io');
const { persistAndCloseSession } = require('./sessionStore.service');
const axios = require('axios');

// ✅ לייבא את המפות מהסינגלטון
const {
  machineSockets,
  userSockets,
  activeSessions,
  lastScanTs,
} = require('./sessionMemory');

let io;

const API_BASE = process.env.SERVER_URL || process.env.INTERNAL_API_BASE || 'http://localhost:8080';
const SCAN_COOLDOWN_MS = 1200;

function toBottleArray(session) {
  return Array.from(session.bottles.values());
}

const initWebSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    socket.on('machine_connected', (machineId) => {
      machineSockets.set(machineId, socket.id);
      console.log(`🤖 Machine ${machineId} connected`);
      console.log(socket.id);
    });

    socket.on('user_connected', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`📱 User ${userId} connected`);
      console.log(socket.id);
    });

    socket.on('start_session', ({ sessionId, machineId, userId }) => {
      if (activeSessions.has(sessionId)) {
        console.warn(`⚠️ Session ${sessionId} already exists`);
        return;
      }
      activeSessions.set(sessionId, {
        machineId,
        userId,
        bottles: new Map(),
        balance: 0,
        currentBottleId: null,
        createdAt: Date.now(), // נחמד שיהיה
      });

      const uSock = userSockets.get(userId);
      const mSock = machineSockets.get(machineId);
      console.log(machineId);
      console.log({uSock,mSock});
      console.log({machineSockets:machineSockets});

      if (uSock) io.to(uSock).emit('session_started', { sessionId, machineId });
      if (mSock) io.to(mSock).emit('session_started', { sessionId, userId });

      console.log('🤝 Session started:', { sessionId, userId, machineId });
    });

    socket.on('bottle_scanned', async ({ sessionId, barcode }) => {
      const session = activeSessions.get(sessionId);
      console.log({session: session});
      if (!session) return;

      if (!session.bottles || !(session.bottles instanceof Map)) session.bottles = new Map();
      if (typeof session.balance !== 'number') session.balance = 0;

      const now = Date.now();
      const last = lastScanTs.get(sessionId) || 0;
      if (now - last < SCAN_COOLDOWN_MS) return;
      lastScanTs.set(sessionId, now);

      console.log(`📤 Bottle scanned on session ${sessionId} with barcode ${barcode}`);

      try {
        const resp = await axios.get(`${API_BASE}/api/bottles/${encodeURIComponent(String(barcode))}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        
        const bottleData = resp.data;
        const normalized = {
          id: bottleData.id || String(barcode),
          name: bottleData.name ?? 'לא ידוע',
          price: Number(bottleData.price ?? 0),
        };

        session.currentBottleId = normalized.id;

        if (!session.bottles.has(normalized.id)) {
          session.bottles.set(normalized.id, {
            id: normalized.id,
            name: normalized.name,
            price: normalized.price,
            quantity: 0,
          });
        }

        const uSock = userSockets.get(session.userId);
        const mSock = machineSockets.get(session.machineId);
        console.log({uSock,mSock});
        const payload = { bottle: normalized };

        if (uSock) io.to(uSock).emit('bottle_data', payload);
        if (mSock) io.to(mSock).emit('bottle_data', payload);

        console.log(`📬 Bottle ready -> ${normalized.name} (${normalized.id})`);
      } catch (err) {
        console.error('❌ Failed to fetch bottle data:', err);
        const uSock = userSockets.get(session.userId);
        if (uSock) {
          const errorMessage = err.response?.status === 404 
            ? 'בקבוק לא נמצא במסד הנתונים' 
            : 'שגיאה בטעינת נתוני הבקבוק';
          io.to(uSock).emit('bottle_error', { message: errorMessage });
        }
      }
    });

    socket.on('bottle_inserted', ({ sessionId }) => {
      const session = activeSessions.get(sessionId);
      if (!session || !session.currentBottleId) return;

      const item = session.bottles.get(session.currentBottleId);
      if (!item) return;

      item.quantity += 1;
      session.balance += Number(item.price || 0);
      session.bottles.set(item.id, item);

      const uSock = userSockets.get(session.userId);
      const mSock = machineSockets.get(session.machineId);
      const payload = { bottle: item, bottles: toBottleArray(session), balance: session.balance };

      if (uSock) io.to(uSock).emit('bottle_progress', payload);
      if (mSock) io.to(mSock).emit('bottle_progress', payload);

      console.log(`➕ Inserted 1: ${item.name} (x${item.quantity}) | balance=₪${session.balance.toFixed(2)}`);
    });

    socket.on('end_session', async ({ sessionId }) => {
      try {
        const payload = await persistAndCloseSession(sessionId);
        const uSock = userSockets.get(payload.userId);
        const mSock = machineSockets.get(payload.machineId);
        if (uSock) io.to(uSock).emit('session_closed');
        if (mSock) io.to(mSock).emit('session_closed');
        console.log(`🛑 Session ${sessionId} closed & persisted (₪${payload.balance})`);
      } catch (err) {
        console.error('end_session persist failed:', err);
      }
    });

    socket.on('await_bottle', ({ sessionId }) => {
      const session = activeSessions.get(sessionId);
      if (!session) return;
      const machineSocketId = machineSockets.get(session.machineId);
      if (machineSocketId) io.to(machineSocketId).emit('await_bottle');
    });

    socket.on('disconnect', () => {
      let disconnectedMachineId = null;
      for (const [qrId, id] of machineSockets.entries()) {
        if (id === socket.id) {
          machineSockets.delete(qrId);
          disconnectedMachineId = qrId;
          console.log(`🔌 Machine ${qrId} disconnected`);
          break;
        }
      }

      let disconnectedUserId = null;
      for (const [userId, id] of userSockets.entries()) {
        if (id === socket.id) {
          userSockets.delete(userId);
          disconnectedUserId = userId;
          console.log(`🔌 User ${userId} disconnected`);
          break;
        }
      }

      for (const [sid, session] of activeSessions.entries()) {
        if (session.machineId === disconnectedMachineId || session.userId === disconnectedUserId) {
          const uSock = userSockets.get(session.userId);
          const mSock = machineSockets.get(session.machineId);
          if (uSock) io.to(uSock).emit('session_closed');
          if (mSock) io.to(mSock).emit('session_closed');
          activeSessions.delete(sid);
          lastScanTs.delete(sid);
          console.log(`🛑 Session ${sid} closed due to disconnect`);
        }
      }
    });
  });
};

module.exports = {
  initWebSocket,
  getIO: () => io,
  getMachineSockets: () => machineSockets,
  getUserSockets: () => userSockets,
  getActiveSessions: () => activeSessions,
};
