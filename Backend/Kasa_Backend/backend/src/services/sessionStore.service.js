// backend/src/services/sessionStore.service.js
const { rtdb } = require('../firebase');
const { activeSessions } = require('./sessionMemory');
const { formatInTimeZone } = require('date-fns-tz');

const IL_TZ = 'Asia/Jerusalem';

function toISO_IL(ts) {
  if (!ts) return null;
  // מחזיר ISO עם היסט מקומי (למשל ...+03:00)
  return formatInTimeZone(new Date(ts), IL_TZ, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function serializeSession(sessionId, session) {
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
  const endedAtMs = Date.now();

  return {
    sessionId,
    machineId: session.machineId,
    userId: session.userId,
    balance: round2(session.balance),
    totalQuantity,
    bottles: bottlesObj,

    // 👇 שמירת זמן כפול: millis + ISO בשעון ישראל
    createdAtMs,
    createdAtISO: toISO_IL(createdAtMs),
    endedAtMs,
    endedAtISO: toISO_IL(endedAtMs),

    status: 'closed',
  };
}

async function persistAndCloseSession(sessionId) {
  const session = activeSessions.get(sessionId);
  if (!session) {
    const err = new Error('Session not found in memory');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const payload = serializeSession(sessionId, session);

  await rtdb.ref(`/sessions/${sessionId}`).set(payload);
  await rtdb.ref(`/users/${session.userId}/sessions/${sessionId}`).set(true);

  await rtdb.ref(`/users/${session.userId}/balance`).transaction((current) => {
    const curr = Number(current || 0);
    return curr + Number(session.balance || 0);
  });

  await rtdb.ref(`/machines/${session.machineId}/sessions/${sessionId}`).set(true);

  activeSessions.delete(sessionId);

  return payload;
}

async function getPersistedSession(sessionId) {
  const snap = await rtdb.ref(`/sessions/${sessionId}`).get();
  return snap.exists() ? snap.val() : null;
}

async function listPersistedSessions(limit = 50) {
  const snap = await rtdb.ref(`/sessions`).limitToLast(limit).get();
  if (!snap.exists()) return [];
  const val = snap.val();
  return Object.values(val);
}

module.exports = {
  persistAndCloseSession,
  getPersistedSession,
  listPersistedSessions,
  serializeSession,
};
