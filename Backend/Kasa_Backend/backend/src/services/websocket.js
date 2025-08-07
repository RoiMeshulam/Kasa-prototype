const { Server } = require('socket.io');

let io;
const machineSockets = new Map();    // qrId → socketId
const userSockets = new Map();       // userId → socketId
const activeSessions = new Map();    // sessionId → { machineId, userId, bottleCount }

const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    // 🤖 מכונה מתחברת
    socket.on('machine_connected', (qrId) => {
      machineSockets.set(qrId, socket.id);
      console.log(`🤖 Machine ${qrId} connected`);
    });

    // 📱 משתמש מתחבר
    socket.on('user_connected', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`📱 User ${userId} connected`);
    });

    // 🧾 התחלת סשן - נקרא מה-API
    socket.on('start_session', ({ sessionId, machineId, userId, bottleCount }) => {
      // אם כבר יש סשן - לא ניצור שוב
      if (activeSessions.has(sessionId)) {
        console.warn(`⚠️ Session ${sessionId} already exists`);
        return;
      }

      activeSessions.set(sessionId, { machineId, userId, bottleCount });

      const userSocketId = userSockets.get(userId);
      const machineSocketId = machineSockets.get(machineId);

      if (userSocketId) {
        io.to(userSocketId).emit('session_started', { sessionId, machineId });
      }

      if (machineSocketId) {
        io.to(machineSocketId).emit('session_started', { sessionId, userId });
      }

      console.log(`🤝 Session started:`, { sessionId, userId, machineId });
    });

    socket.on('bottle_scanned', async ({ sessionId, barcode }) => {
      const session = activeSessions.get(sessionId);
      if (!session) {
        console.warn(`❌ No session found for: ${sessionId}`);
        return;
      }
    
      console.log(`📤 Bottle scanned on session ${sessionId} with barcode ${barcode}`);
    
      try {
        // קריאה לשרת שלך כדי להביא פרטים על הבקבוק
        const response = await fetch(`http://localhost:8080/api/bottles/${barcode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
       
        });
    
        const bottleData = await response.json();
    
        // שליחת פרטי בקבוק ללקוח
        const userSocketId = userSockets.get(session.userId);
        if (userSocketId) {
          io.to(userSocketId).emit('bottle_data', {
            bottle: bottleData,
            remaining: session.bottleCount,
          });
        }
    
        // שליחת פרטי בקבוק גם למכונה אם צריך
        const machineSocketId = machineSockets.get(session.machineId);
        if (machineSocketId) {
          io.to(machineSocketId).emit('bottle_data', {
            bottle: bottleData,
            remaining: session.bottleCount,
          });
        }
    
        console.log(`📬 Bottle data sent to both user and machine`);
      } catch (err) {
        console.error('❌ Failed to fetch bottle data:', err);
      }
    });



    // 🍾 בקבוק נכנס למכונה
    socket.on('bottle_inserted', ({ sessionId }) => {
      const session = activeSessions.get(sessionId);
      if (!session) {
        console.warn(`❌ No session found for: ${sessionId}`);
        return;
      }

      session.bottleCount -= 1;
      console.log(`➖ Bottle inserted. Remaining: ${session.bottleCount}`);

      const userSocketId = userSockets.get(session.userId);
      if (userSocketId) {
        io.to(userSocketId).emit('bottle_data', {
          remaining: session.bottleCount,
        });
      }

      // אם נגמרו בקבוקים - סגור סשן
      if (session.bottleCount <= 0) {
        const machineSocketId = machineSockets.get(session.machineId);
        if (machineSocketId) {
          io.to(machineSocketId).emit('session_closed');
        }
        if (userSocketId) {
          io.to(userSocketId).emit('session_closed');
        }

        activeSessions.delete(sessionId);
        console.log(`🛑 Session ${sessionId} closed`);
      }
    });

    // ❌ ניתוק סוקט
    socket.on('disconnect', () => {
      for (const [qrId, id] of machineSockets.entries()) {
        if (id === socket.id) {
          machineSockets.delete(qrId);
          console.log(`🔌 Machine ${qrId} disconnected`);
        }
      }
      for (const [userId, id] of userSockets.entries()) {
        if (id === socket.id) {
          userSockets.delete(userId);
          console.log(`🔌 User ${userId} disconnected`);
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
