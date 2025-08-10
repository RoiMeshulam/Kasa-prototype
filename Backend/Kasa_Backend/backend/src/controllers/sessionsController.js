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

const { rtdb } = require('../firebase');

// --- helpers ---
function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}
function toISO(ts) {
  return ts ? new Date(ts).toISOString() : null;
}
/** המרת סשן פעיל (Map) לפורמט JSON נוח ללקוח – ללא endedAt/status: 'closed' */
function serializeActiveSession(sessionId, session) {
  const bottlesArr = Array.from(session.bottles?.values?.() || []);
  const totalQuantity = bottlesArr.reduce((sum, b) => sum + (b.quantity || 0), 0);
  const bottlesObj = bottlesArr.reduce((acc, b) => {
    acc[b.id] = { id: b.id, name: b.name, price: round2(b.price), quantity: b.quantity || 0 };
    return acc;
  }, {});
  const createdAtMs = session.createdAt || Date.now();
  return {
    sessionId,
    machineId: session.machineId,
    userId: session.userId,
    balance: round2(session.balance || 0),
    totalQuantity,
    bottles: bottlesObj,
    createdAtMs,
    createdAtISO: toISO(createdAtMs),
    status: 'active',
  };
}

/**
 * POST /api/sessions
 * body: { qrId, userId }
 */
exports.createSession = async (req, res) => {
  try {
    const { qrId, userId } = req.body;
    if (!qrId || !userId) return res.status(400).json({ error: 'qrId and userId are required' });

    const io = getIO();
    const machineSockets = getMachineSockets();
    const userSockets = getUserSockets();
    const activeSessions = getActiveSessions();

    const machineSocketId = machineSockets.get(qrId);
    const userSocketId = userSockets.get(userId);
    if (!machineSocketId || !userSocketId) {
      return res.status(400).json({ error: 'User or machine not connected' });
    }

    const sessionId = `session_${Date.now()}`;
    activeSessions.set(sessionId, {
      machineId: qrId,
      userId,
      bottles: new Map(),
      balance: 0,
      currentBottleId: null,
      createdAt: Date.now(),
      status: 'active',
    });

    io.to(machineSocketId).emit('session_started', { sessionId, userId });
    io.to(userSocketId).emit('session_started', { sessionId, machineId: qrId });

    res.json({ sessionId });
  } catch (e) {
    console.error('createSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * GET /api/sessions/:id
 * אם הסשן פעיל – החזרה מהזיכרון; אחרת – מ־RTDB אם קיים.
 */
exports.getSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const activeSessions = getActiveSessions();
    const session = activeSessions.get(sessionId);

    if (session) {
      return res.json(serializeActiveSession(sessionId, session));
    }

    const persisted = await getPersistedSession(sessionId);
    if (persisted) return res.json(persisted);

    res.status(404).json({ error: 'session not found' });
  } catch (e) {
    console.error('getSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * PATCH /api/sessions/:id
 * body: { currentBottleId? }
 */
exports.updateSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const { currentBottleId } = req.body;

    const activeSessions = getActiveSessions();
    const session = activeSessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'session not found or already closed' });

    if (typeof currentBottleId === 'string') {
      session.currentBottleId = currentBottleId;
    }

    activeSessions.set(sessionId, session);
    res.json({ ok: true });
  } catch (e) {
    console.error('updateSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * POST /api/sessions/:id/end
 * סוגר ומPersist-א את הסשן, מעדכן יתרה, ומשדר session_closed.
 */
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
    if (uSock) io.to(uSock).emit('session_closed');
    if (mSock) io.to(mSock).emit('session_closed');

    res.json({ ok: true, session: payload });
  } catch (e) {
    console.error('endSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * GET /api/sessions
 * query: ?limit=50
 * רשימת סשנים אחרונים (סגורים) מכלל המערכת
 */
exports.listSessions = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 500));
    const list = await listPersistedSessions(limit);
    res.json(list);
  } catch (e) {
    console.error('listSessions failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * GET /api/sessions/user/:userId
 * query: ?limit=200&fromMs=...&toMs=... או ?year=YYYY&month=1..12
 */
exports.listUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 200, 2000));

    let fromMs = req.query.fromMs ? Number(req.query.fromMs) : undefined;
    let toMs = req.query.toMs ? Number(req.query.toMs) : undefined;

    // אם יש year+month ואין טווח מפורש—נגזור טווח חודשי (UTC)
    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;
    if (year && month && !fromMs && !toMs) {
      const start = Date.UTC(year, month - 1, 1, 0, 0, 0, 0);
      const end = Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1, 0, 0, 0, 0) - 1;
      fromMs = start;
      toMs = end;
    }

    const sessions = await listSessionsByUser(userId, { fromMs, toMs, limit, sortDesc: true });
    res.json(sessions);
  } catch (e) {
    console.error('listUserSessions failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * GET /api/sessions/user/:userId/summary
 * query: ?year=YYYY&month=1..12
 */
exports.userMonthlySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;

    const summary = await monthlySummaryByUser(userId, { year, month });
    res.json(summary);
  } catch (e) {
    console.error('userMonthlySummary failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * DELETE /api/sessions/:id
 * מוחק סשן מ־RTDB (לא סוגר סשן פעיל; לשם כך יש /end)
 */
exports.deleteSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    await rtdb.ref(`/sessions/${sessionId}`).remove();
    // אופציונלי: מחיקת מצביעים ב-users/<uid>/sessions וב-machines/<id>/sessions
    res.json({ ok: true });
  } catch (e) {
    console.error('deleteSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};
