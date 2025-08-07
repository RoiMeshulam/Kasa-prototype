const {
    getIO,
    getMachineSockets,
    getUserSockets,
    getActiveSessions,
  } = require("../services/websocket");
  
  exports.createSession = async (req, res) => {
    const { qrId, userId, bottleCount = 1 } = req.body;
  
    const io = getIO();
    const machineSockets = getMachineSockets();
    const userSockets = getUserSockets();
    const activeSessions = getActiveSessions();
  
    const machineSocketId = machineSockets.get(qrId);
    const userSocketId = userSockets.get(userId);
  
    if (!machineSocketId || !userSocketId) {
      return res.status(400).json({ error: "User or machine not connected" });
    }
  
    const sessionId = `session_${Date.now()}`;
    activeSessions.set(sessionId, {
      machineId: qrId,
      userId,
      bottleCount,
    });
  
    io.to(machineSocketId).emit("session_started", { sessionId, userId });
    io.to(userSocketId).emit("session_started", { sessionId, machineId: qrId });
  
    res.json({ sessionId });
  };
  