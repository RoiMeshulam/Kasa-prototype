const { Server } = require("socket.io");

let io;
const machineSockets = new Map();  // qrId → socketId
const userSockets = new Map();     // userId → socketId
const activeSessions = new Map();  // sessionId → { machineId, userId, bottleCount }

const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    socket.on("machine_connected", (qrId) => {
      machineSockets.set(qrId, socket.id);
      console.log(`🤖 Machine ${qrId} connected`);
    });

    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`📱 User ${userId} connected`);
    });

    socket.on("bottle_inserted", ({ sessionId }) => {
      const session = activeSessions.get(sessionId);
      if (!session) return;

      session.bottleCount -= 1;

      const userSocketId = userSockets.get(session.userId);
      if (userSocketId) {
        io.to(userSocketId).emit("bottle_inserted", {
          remaining: session.bottleCount,
        });
      }

      if (session.bottleCount <= 0) {
        const machineSocketId = machineSockets.get(session.machineId);
        if (machineSocketId) {
          io.to(machineSocketId).emit("session_closed");
        }
        if (userSocketId) {
          io.to(userSocketId).emit("session_closed");
        }

        activeSessions.delete(sessionId);
      }
    });

    socket.on("disconnect", () => {
      for (const [qr, id] of machineSockets.entries()) {
        if (id === socket.id) machineSockets.delete(qr);
      }
      for (const [uid, id] of userSockets.entries()) {
        if (id === socket.id) userSockets.delete(uid);
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
