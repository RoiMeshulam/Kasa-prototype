const { Server } = require("socket.io");

let io;
const activeSessions = new Map(); // sessionId -> { userId, machineId, clientSocketId, machineSocketId }

const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { userId, machineId, role } = socket.handshake.query;

    if (role === "client") {
      console.log(`📱 Client connected: ${userId}`);
      socket.on("startSession", ({ machineId }) => {
        const sessionId = `${userId}-${Date.now()}`;
        activeSessions.set(sessionId, {
          userId,
          machineId,
          clientSocketId: socket.id,
          machineSocketId: null,
        });

        socket.join(sessionId);
        socket.emit("sessionStarted", { sessionId });
      });
    }

    if (role === "machine") {
      console.log(`🤖 Machine connected: ${machineId}`);
      for (const [sessionId, session] of activeSessions.entries()) {
        if (session.machineId === machineId) {
          session.machineSocketId = socket.id;
          socket.join(sessionId);
          io.to(sessionId).emit("machineReady");
        }
      }
    }

    socket.on("scanBottle", ({ sessionId, barcode }) => {
      // simulate bottle info
      const bottleInfo = {
        barcode,
        type: "PET",
        price: 0.30,
      };
      io.to(sessionId).emit("bottleScanned", bottleInfo);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initWebSocket };
