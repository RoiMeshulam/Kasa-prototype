const { firestoreDb } = require("../firebase");

// Get all bottles
const getBottles = async (req, res) => {
  try {
    const bottlesSnapshot = await firestoreDb.collection("bottles").get();
    if (bottlesSnapshot.empty) {
      return res.status(404).json({ message: "No bottles found" });
    }

    const bottles = bottlesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(bottles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get bottle by ID (barcode)
const getBottleById = async (req, res) => {
  const { bottleId } = req.params;
  try {
    const bottleDoc = await firestoreDb.collection("bottles").doc(bottleId).get();

    if (!bottleDoc.exists) {
      return res.status(404).json({ message: "Bottle not found" });
    }

    return res.status(200).json({ id: bottleDoc.id, ...bottleDoc.data() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new bottle (with barcode as ID)
const createBottle = async (req, res) => {
  const { id, type, name, price } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Bottle ID (barcode) is required" });
    }

    const bottleRef = firestoreDb.collection("bottles").doc(id);
    const bottleDoc = await bottleRef.get();

    if (bottleDoc.exists) {
      return res.status(400).json({ message: "Bottle with this ID already exists" });
    }

    await bottleRef.set({ type, name, price });

    return res.status(201).json({ message: "Bottle created successfully", id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update bottle
const updateBottle = async (req, res) => {
  const { bottleId } = req.params;
  const { type, name, price } = req.body;

  try {
    const bottleRef = firestoreDb.collection("bottles").doc(bottleId);
    const bottleDoc = await bottleRef.get();

    if (!bottleDoc.exists) {
      return res.status(404).json({ message: "Bottle not found" });
    }

    await bottleRef.update({ type, name, price });

    return res.status(200).json({ message: "Bottle updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete bottle
const deleteBottle = async (req, res) => {
  const { bottleId } = req.params;

  try {
    const bottleRef = firestoreDb.collection("bottles").doc(bottleId);
    const bottleDoc = await bottleRef.get();

    if (!bottleDoc.exists) {
      return res.status(404).json({ message: "Bottle not found" });
    }

    await bottleRef.delete();

    return res.status(200).json({ message: "Bottle deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBottles,
  getBottleById,
  createBottle,
  updateBottle,
  deleteBottle,
};
