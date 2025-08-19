// ... קיים אצלך למעלה
const { rtdb } = require('../firebase');
const { activeSessions } = require('./sessionMemory');

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function toISO(ts) {
  return ts ? new Date(ts).toISOString() : null;
}

// עוזר: חיתוך לפי טווח
function inRange(ms, fromMs, toMs) {
  if (fromMs != null && ms < fromMs) return false;
  if (toMs != null && ms > toMs) return false;
  return true;
}

// עוזר: חישוב טווח חודש (UTC)
function monthRangeUTC(year, month /* 1..12 */) {
  const start = Date.UTC(year, month - 1, 1, 0, 0, 0, 0);
  const end = Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1, 0, 0, 0, 0) - 1;
  return { fromMs: start, toMs: end };
}

function serializeSession(sessionId, session) {
  const bottlesArr = Array.from(session.bottles?.values?.() || []);
  const totalQuantity = bottlesArr.reduce((sum, b) => sum + (b.quantity || 0), 0);

  const bottlesObj = bottlesArr.reduce((acc, b) => {
    acc[b.id] = { id: b.id, name: b.name, price: round2(b.price), quantity: b.quantity || 0 };
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
    createdAtMs,
    createdAtISO: toISO(createdAtMs),
    endedAtMs,
    endedAtISO: toISO(endedAtMs),
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
    return round2(curr + Number(session.balance || 0));
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

/**
 * כל הסשנים של משתמש (סגורים) עם אופציות:
 *  - fromMs / toMs  (טווח זמן לפי createdAtMs)
 *  - limit          (ברירת מחדל 200)
 *  - sortDesc       (ברירת מחדל true – מהחדש לישן)
 *
 * ⚠️ כדי לעבוד עם orderByChild('userId'), ודא שיש אינדוקס בכללי RTDB rules:
 * {
 *   "rules": {
 *     "sessions": {
 *       ".indexOn": ["userId", "createdAtMs"]
 *     }
 *   }
 * }
 */
async function listSessionsByUser(userId, { fromMs, toMs, limit = 200, sortDesc = true } = {}) {
  const snap = await rtdb.ref('/sessions')
    .orderByChild('userId')
    .equalTo(userId)
    .get();

  if (!snap.exists()) return [];

  let arr = Object.values(snap.val());
  // חיתוך טווח
  arr = arr.filter(s => inRange(Number(s.createdAtMs || 0), fromMs, toMs));
  // מיון
  arr.sort((a, b) => Number(a.createdAtMs || 0) - Number(b.createdAtMs || 0));
  if (sortDesc) arr.reverse();
  // הגבלת כמות
  if (limit && limit > 0) arr = arr.slice(0, limit);

  return arr;
}

/**
 * סיכום חודשי למשתמש:
 *  - כמה בקבוקים מוחזרו (sum totalQuantity)
 *  - כמה סשנים
 *  - סה״כ מאזן חודשי (sum balance)
 *  - מחזיר גם fromMs/toMs לחודש הזה
 */



async function monthlySummaryByUser(userId, { year, month /*1..12*/ } = {}) {
  const now = new Date();
  const y = year || now.getUTCFullYear();
  const m = month || (now.getUTCMonth() + 1);

  const { fromMs, toMs } = monthRangeUTC(y, m);
  const sessions = await listSessionsByUser(userId, { fromMs, toMs, limit: 2000, sortDesc: false });

  const summary = sessions.reduce((acc, s) => {
    acc.sessionsCount += 1;
    acc.bottlesCount += Number(s.totalQuantity || 0);
    acc.totalBalance = round2(acc.totalBalance + Number(s.balance || 0));
    return acc;
  }, { sessionsCount: 0, bottlesCount: 0, totalBalance: 0 });

  return {
    userId,
    year: y,
    month: m,
    fromMs,
    toMs,
    ...summary,
  };
}

module.exports = {
  persistAndCloseSession,
  getPersistedSession,
  listPersistedSessions,
  serializeSession,
  listSessionsByUser,
  monthlySummaryByUser,
};
