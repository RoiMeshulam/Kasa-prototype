const { auth, rtdb, admin } = require("../firebase");

const signIn = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing authentication token" });
  }

  try {
    // 🔹 Verify Firebase Authentication token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    console.log(`🔑 User authenticated: ${uid}`);

    // 🔹 Retrieve user data from Firebase Realtime Database
    const snapshot = await rtdb.ref(`users/${uid}`).once("value");
    const userData = snapshot.val();

    if (!userData) {
      console.warn(`⚠️ User not found: ${uid}`);
      return res.status(404).json({ error: "User not found" });
    }


    // 🔹 Return user data
    return res.status(200).json({
      uid,
      email: userData.email,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      balance:userData.balance
      // fcmToken: fcmToken || userData.fcmToken || null, // Return existing or new token
    });

  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


// Register a new user
const signUp = async (req, res) => {
  console.log("signUp func")
  const { email, password, name, phoneNumber } = req.body;

  try {
    // Create a new user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const balance = 0;

    // Save additional details in Firebase Realtime Database
    await rtdb.ref(`users/${userRecord.uid}`).set({
      name,
      phoneNumber,
      email,
      balance,
    });

    res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
      name,
      email,
      phoneNumber,
      balance,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { uid } = req.params;
  const { name, phoneNumber, email } = req.body;

  if (!uid) return res.status(400).json({ error: "Missing uid" });

  try {
    // 🔹 Verify Firebase Authentication token (אם עוד לא עשית ב-middleware)
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // if (decodedToken.uid !== uid) return res.status(403).json({ error: "Unauthorized" });
    console.log(uid);
    // 🔹 עדכון פרטים ב-RTDB
    const userRef = rtdb.ref(`users/${uid}`);

    const snapshot = await userRef.once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
    if (email !== undefined) {
      updates.email = email;
    }

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

module.exports = { signIn, signUp, updateUser };


