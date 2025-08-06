const { firestoreDb } = require("../firebase"); // Import Firestore instance

// Get all mechines
const getMechines = async (req, res) => {
  try {
    const mechinesSnapshot = await firestoreDb.collection("mechines").get();
    if (mechinesSnapshot.empty) {
      return res.status(404).json({ message: "No mechines found" });
    }

    const mechines = mechinesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(mechines);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get mechine by ID
const getMechineById = async (req, res) => {
  const { mechineUID } = req.params;
  try {
    const mechineDoc = await firestoreDb.collection("mechines").doc(mechineUID).get();

    if (!mechineDoc.exists) {
      return res.status(404).json({ message: "mechine not found" });
    }

    return res.status(200).json({ id: mechineDoc.id, ...mechineDoc.data() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new mechine
const createMechine = async (req, res) => {
  const { name, qr_id, status, location, last_maintaince } = req.body; // Include owner UID if applicable

  try {
    const newMechine = {
      name,
      qr_id,
      status,
      location,
      last_maintaince
    };

    const mechineRef = await firestoreDb.collection("mechines").add(newMechine);

    return res.status(201).json({ message: "mechine created successfully", id: mechineRef.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update mechine details
const updateMechine = async (req, res) => {
  const { mechineUID } = req.params;
  const { name, status, last_maintaince, location, qr_id } = req.body;

  try {
    const mechinesRef = firestoreDb.collection("mechines").doc(mechineUID);
    const mechinesDoc = await mechinesRef.get();

    if (!mechinesDoc.exists) {
      return res.status(404).json({ message: "mechine not found" });
    }

    await mechinesRef.update({ name, status, last_maintaince, location, qr_id});

    return res.status(200).json({ message: "mechine updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a mechine
const deleteMechine = async (req, res) => {
  const { mechineUID } = req.params;

  try {
    const mechinesRef = firestoreDb.collection("mechines").doc(mechineUID);
    const mechinesDoc = await mechinesRef.get();

    if (!mechinesDoc.exists) {
      return res.status(404).json({ message: "mechine not found" });
    }

    await mechinesRef.delete();

    return res.status(200).json({ message: "mechine deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMechines,
  getMechineById,
  createMechine,
  updateMechine,
  deleteMechine,
};
