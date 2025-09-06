// controllers/userController.js
const { auth, rtdb, admin } = require("../firebase");

// עוזר: בונה אובייקט משתמש דיפולטי
function buildDefaultUser({ uid, authUser, decodedToken }) {
  const provider =
    (authUser.providerData && authUser.providerData[0] && authUser.providerData[0].providerId) ||
    (decodedToken.firebase && decodedToken.firebase.sign_in_provider) ||
    'password';

  return {
    uid,
    email: authUser.email || decodedToken.email || null,
    emailVerified: !!authUser.emailVerified,
    name: authUser.displayName || null,
    phoneNumber: authUser.phoneNumber || null,
    photoURL: authUser.photoURL || null,
    provider,
    balance: 0,
    onboarding: { completed: false },
    status: 'active',
    createdAt: admin.database.ServerValue.TIMESTAMP,
    lastLoginAt: admin.database.ServerValue.TIMESTAMP,
  };
}

// עוזר: מאמת טוקן ומחזיר { uid, decodedToken, authUser }
async function verifyAndGetAuthUser(token) {
  const decodedToken = await admin.auth().verifyIdToken(token);
  const uid = decodedToken.uid;
  const authUser = await admin.auth().getUser(uid);
  return { uid, decodedToken, authUser };
}

// עוזר: upsert ב-RTDB (transaction כדי למנוע דריסה במקביל)
async function upsertUserInRTDB({ uid, authUser, decodedToken }) {
  const ref = rtdb.ref(`users/${uid}`);
  await ref.transaction((current) => {
    if (current) {
      // מעדכנים רק lastLoginAt כדי לא לדרוס מידע קיים
      return {
        ...current,
        lastLoginAt: admin.database.ServerValue.TIMESTAMP,
      };
    }
    // משתמש חדש
    return buildDefaultUser({ uid, authUser, decodedToken });
  }, { applyLocally: false });

  const snapshot = await ref.once("value");
  return snapshot.val();
}

// ------------------ Controllers ------------------ //

const signIn = async (req, res) => {
  try {
    const token = req.body?.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(400).json({ error: "Missing authentication token" });

    const { uid, decodedToken, authUser } = await verifyAndGetAuthUser(token);
    console.log(`🔑 User authenticated: ${uid}`);

    const userData = await upsertUserInRTDB({ uid, authUser, decodedToken });
    console.log("✅ User data upserted in RTDB");
    console.log("userData:", userData);

    return res.status(200).json({
      uid,
      email: userData.email || null,
      name: userData.name || null,
      phoneNumber: userData.phoneNumber || null,
      balance: userData.balance ?? 0,
      photoURL: userData.photoURL || null,
      onboarding: userData.onboarding || { completed: false },
      status: userData.status || 'active',
    });
  } catch (error) {
    console.error("❌ signIn error:", error);
    // Invalid token / expired / project mismatch
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// נשמור כאן את ההתנהגות כ-upsert (כדי לא לחטוף 404 ב-App Launch)
const validateToken = async (req, res) => {
  try {
    const token = req.body?.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(400).json({ error: "Missing authentication token" });

    const { uid, decodedToken, authUser } = await verifyAndGetAuthUser(token);
    console.log(`🔑 Token validated for user: ${uid}`);

    const userData = await upsertUserInRTDB({ uid, authUser, decodedToken });

    return res.status(200).json({
      uid,
      email: userData.email || null,
      name: userData.name || null,
      phoneNumber: userData.phoneNumber || null,
      balance: userData.balance ?? 0,
      photoURL: userData.photoURL || null,
      onboarding: userData.onboarding || { completed: false },
      status: userData.status || 'active',
    });
  } catch (error) {
    console.error("❌ validateToken error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const signUp = async (req, res) => {
  console.log("signUp func");
  const { email, password, name, phoneNumber } = req.body;

  try {
    // יצירת יוזר ב-Auth
    const userRecord = await auth.createUser({ email, password });

    // יצירת רשומה ב-RTDB
    const userRef = rtdb.ref(`users/${userRecord.uid}`);
    await userRef.set({
      uid: userRecord.uid,
      email,
      name: name || null,
      phoneNumber: phoneNumber || null,
      balance: 0,
      onboarding: { completed: false },
      status: 'active',
      createdAt: admin.database.ServerValue.TIMESTAMP,
      lastLoginAt: admin.database.ServerValue.TIMESTAMP,
    });

    const userData = (await userRef.once("value")).val();

    res.status(201).json({
      message: "User registered successfully",
      ...userData,
    });
  } catch (error) {
    console.error('signUp error:', error);
    res.status(400).json({ error: error.message || 'Sign up failed' });
  }
};

const updateUser = async (req, res) => {
  const { uid } = req.params;
  const token = req.body?.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const { name, phoneNumber, email } = req.body;

  if (!uid) return res.status(400).json({ error: "Missing uid" });
  if (!token) return res.status(401).json({ error: "Missing auth token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const requesterUid = decoded.uid;

    // רק המשתמש עצמו (או הרחב כאן ל-role admin)
    if (requesterUid !== uid) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const userRef = rtdb.ref(`users/${uid}`);
    const snapshot = await userRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (email !== undefined) updates.email = email;

    await userRef.update(updates);
    const updatedUser = (await userRef.once("value")).val();

    return res.status(200).json({
      message: "User updated successfully",
      uid,
      ...updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signIn, signUp, updateUser, validateToken };
