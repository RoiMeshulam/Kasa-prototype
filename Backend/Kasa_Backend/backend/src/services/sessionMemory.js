// מחזיק את ה-Maps כסינגלטון
const machineSockets = new Map(); // qrId -> socketId
const userSockets = new Map();    // userId -> socketId
const activeSessions = new Map(); // sessionId -> session
const lastScanTs = new Map();     // sessionId -> ts

module.exports = {
  machineSockets,
  userSockets,
  activeSessions,
  lastScanTs,
};
