// backend/src/controllers/sessions.controller.js
const {
  getIO,
  getMachineSockets,
  getUserSockets,
  getActiveSessions,
} = require('../services/websocket');

const {
  persistAndCloseSession,
  getPersistedSession,
  listPersistedSessions,
  listSessionsByUser,
  monthlySummaryByUser,
} = require('../services/sessionStore.service');

const { rtdb, firestoreDb } = require('../firebase');

// --- helpers ---
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const toISO = (ts) => (ts ? new Date(ts).toISOString() : null);

const serializeActiveSession = (sessionId, session) => {
  const bottlesArr = Array.from(session.bottles?.values?.() || []);
  const totalQuantity = bottlesArr.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const bottlesObj = bottlesArr.reduce((acc, b) => {
    acc[b.id] = {
      id: b.id,
      name: b.name,
      price: round2(b.price),
      quantity: b.quantity || 0,
    };
    return acc;
  }, {});
  const createdAtMs = session.createdAt || Date.now();

  return {
    sessionId,
    machineId: session.machineId,
    qrId: session.qrId,
    machineName: session.machineName,
    userId: session.userId,
    balance: round2(session.balance || 0),
    totalQuantity,
    bottles: bottlesObj,
    createdAtMs,
    createdAtISO: toISO(createdAtMs),
    status: session.status || 'active',
  };
};


// --- Controllers ---

exports.createSession = async (req, res) => {
  try {
    const { qrId, userId } = req.body;
    if (!qrId || !userId) return res.status(400).json({ error: 'qrId and userId are required' });

    const io = getIO();
    const machineSockets = getMachineSockets();
    const userSockets = getUserSockets();
    const activeSessions = getActiveSessions();

    const machineQuery = await firestoreDb
      .collection('machines')
      .where('qr_id', '==', qrId)
      .limit(1)
      .get();

    if (machineQuery.empty) return res.status(404).json({ error: 'Machine not found' });

    const machineDoc = machineQuery.docs[0];
    const machineData = machineDoc.data();
    const machineId = machineDoc.id;
    const machineName = machineData.name || qrId;

    const machineSocketId = machineSockets.get(machineId);
    const userSocketId = userSockets.get(userId);

    console.log('machineId from Firestore:', machineId);
    console.log('machineSockets keys:', Array.from(machineSockets.keys()));
    console.log('machineSocketId:', machineSocketId);


    if (!machineSocketId || !userSocketId) {
      return res.status(400).json({ error: 'User or machine not connected' });
    }





    console.log("createSessioninServer", machineId)

    const sessionId = `session_${Date.now()}`;
    activeSessions.set(sessionId, {
      machineId,
      qrId,
      machineName,
      userId,
      bottles: new Map(),
      balance: 0,
      currentBottleId: null,
      createdAt: Date.now(),
      status: 'active',
    });

    io.to(machineSocketId).emit('session_started', { sessionId, userId, machineName });
    io.to(userSocketId).emit('session_started', { sessionId, machineId, machineName });

    return res.json({ sessionId, machineId, machineName });
  } catch (err) {
    console.error('createSession failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const activeSessions = getActiveSessions();
    const session = activeSessions.get(sessionId);

    if (session) return res.json(serializeActiveSession(sessionId, session));

    const persisted = await getPersistedSession(sessionId);
    if (persisted) return res.json(persisted);

    return res.status(404).json({ error: 'session not found' });
  } catch (err) {
    console.error('getSession failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const { currentBottleId } = req.body;

    const activeSessions = getActiveSessions();
    const session = activeSessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'session not found or already closed' });

    if (typeof currentBottleId === 'string') session.currentBottleId = currentBottleId;

    activeSessions.set(sessionId, session);
    return res.json({ ok: true });
  } catch (err) {
    console.error('updateSession failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

exports.endSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const io = getIO();
    const activeSessions = getActiveSessions();
    const session = activeSessions.get(sessionId);

    if (!session) {
      const persisted = await getPersistedSession(sessionId);
      if (persisted) return res.json({ ok: true, persisted: true });
      return res.status(404).json({ error: 'session not found' });
    }

    const payload = await persistAndCloseSession(sessionId);

    const machineSockets = getMachineSockets();
    const userSockets = getUserSockets();
    const uSock = userSockets.get(session.userId);
    const mSock = machineSockets.get(session.machineId);
    if (uSock) io.to(uSock).emit('session_closed', { sessionId });
    if (mSock) io.to(mSock).emit('session_closed', { sessionId });

    return res.json({ ok: true, session: payload });
  } catch (err) {
    console.error('endSession failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

exports.listSessions = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 500));
    const sessions = await listPersistedSessions(limit);
    return res.json(sessions);
  } catch (err) {
    console.error('listSessions failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

exports.listUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 200, 2000));

    let fromMs = req.query.fromMs ? Number(req.query.fromMs) : undefined;
    let toMs = req.query.toMs ? Number(req.query.toMs) : undefined;

    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;
    if (year && month && !fromMs && !toMs) {
      const start = Date.UTC(year, month - 1, 1, 0, 0, 0, 0);
      const end = Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1, 0, 0, 0, 0) - 1;
      fromMs = start;
      toMs = end;
    }

    const sessions = await listSessionsByUser(userId, { fromMs, toMs, limit, sortDesc: true });
    return res.json(sessions);
  } catch (err) {
    console.error('listUserSessions failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};


async function totalBottlesAllTime(userId) {
  // limit=0 = אין הגבלה, נקבל את כל הסשנים
  const sessions = await listSessionsByUser(userId, { limit: 0, sortDesc: false });

  const total = sessions.reduce((acc, s) => {
    acc.bottlesCount += Number(s.totalQuantity || 0);
    return acc;
  }, { bottlesCount: 0 });

  return total.bottlesCount;
}

exports.userMonthlySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;

    // סיכום החודש
    const summary = await monthlySummaryByUser(userId, { year, month });

    // סך כל הבקבוקים של המשתמש לכל הזמנים
    const allTimeBottlesCount = await totalBottlesAllTime(userId);

    // מחזיר את זה יחד
    return res.json({
      ...summary,
      allTimeBottlesCount, // כאן הסה"כ של כל הבקבוקים
    });
  } catch (err) {
    console.error('userMonthlySummary failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    await rtdb.ref(`/sessions/${sessionId}`).remove();
    return res.json({ ok: true });
  } catch (err) {
    console.error('deleteSession failed:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
};
