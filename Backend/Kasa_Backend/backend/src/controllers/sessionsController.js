
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
  serializeSession,
} = require('../services/sessionStore.service');

/**
 * POST /api/sessions
 * body: { qrId, userId }
 * יוצר סשן בזיכרון ומשדר session_started לשני הצדדים
 */
exports.createSession = async (req, res) => {
  try {
    const { qrId, userId } = req.body;
    if (!qrId || !userId) {
      return res.status(400).json({ error: 'qrId and userId are required' });
    }

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

    return res.json({ sessionId });
  } catch (e) {
    console.error('createSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * GET /api/sessions/:id
 * מחזיר מצב סשן: אם פעיל – מהזיכרון; אם לא – מ-RTDB (אם קיים)
 */
exports.getSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const activeSessions = getActiveSessions();
    const session = activeSessions.get(sessionId);

    if (session) {
      // serialize (כי bottles זה Map)
      return res.json({
        ...serializeSession(sessionId, { ...session, endedAt: null, status: 'active' }),
      });
    }

    // חפש ב-RTDB אם נסגר כבר
    const persisted = await getPersistedSession(sessionId);
    if (persisted) return res.json(persisted);

    return res.status(404).json({ error: 'session not found' });
  } catch (e) {
    console.error('getSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * PATCH /api/sessions/:id
 * עדכון שדות בסיסיים בסשן הפעיל (לא חובה בדרך כלל, אבל כולל למען ה-CRUD)
 * body יכול להכיל: { currentBottleId }
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
    return res.json({ ok: true });
  } catch (e) {
    console.error('updateSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * POST /api/sessions/:id/end
 * סוגר סשן: שומר ל-RTDB, מעדכן balance למשתמש, משדר session_closed
 */
exports.endSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;

    const io = getIO();
    const activeSessions = getActiveSessions();
    const session = activeSessions.get(sessionId);

    if (!session) {
      // אולי כבר נשמר — נסה להביא מ-RTDB
      const persisted = await getPersistedSession(sessionId);
      if (persisted) return res.json({ ok: true, persisted: true });
      return res.status(404).json({ error: 'session not found' });
    }

    // שמור ל-RTDB ועדכן מאזן
    const payload = await persistAndCloseSession(sessionId);

    // שדר סגירה לצדדים אם מחוברים
    const machineSockets = getMachineSockets();
    const userSockets = getUserSockets();
    const uSock = userSockets.get(session.userId);
    const mSock = machineSockets.get(session.machineId);
    if (uSock) io.to(uSock).emit('session_closed');
    if (mSock) io.to(mSock).emit('session_closed');

    return res.json({ ok: true, session: payload });
  } catch (e) {
    console.error('endSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};

/**
 * GET /api/sessions
 * החזר עד N סשנים אחרונים (סגורים) מתוך RTDB
 * אפשר לצרף query param: ?limit=50
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
 * DELETE /api/sessions/:id
 * מוחק סשן מ-RTDB בלבד (לא סוגר פעיל; לשם כך יש end)
 */
exports.deleteSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    await require('../lib/firebase').rtdb.ref(`/sessions/${sessionId}`).remove();
    // אופציונלי: להסיר גם מצביע מה-user/machine
    res.json({ ok: true });
  } catch (e) {
    console.error('deleteSession failed:', e);
    res.status(500).json({ error: 'internal error' });
  }
};



