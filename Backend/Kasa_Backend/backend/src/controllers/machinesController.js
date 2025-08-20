const { firestoreDb } = require("../firebase"); // Import Firestore instance

// Get all machines
const getMachines = async (req, res) => {
  try {
    const machinesSnapshot = await firestoreDb.collection("machines").get();
    if (machinesSnapshot.empty) {
      return res.status(404).json({ message: "No machines found" });
    }

    const machines = machinesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(machines);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get machine by ID
const getMachineById = async (req, res) => {
  const { machineUID } = req.params;
  try {
    const machineDoc = await firestoreDb.collection("machines").doc(machineUID).get();

    if (!machineDoc.exists) {
      return res.status(404).json({ message: "machine not found" });
    }

    return res.status(200).json({ id: machineDoc.id, ...machineDoc.data() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create a new machine
const createMachine = async (req, res) => {
  const { name, qr_id, status, location, last_maintaince } = req.body; // Include owner UID if applicable

  try {
    const newMachine = {
      name,
      qr_id,
      status,
      location,
      last_maintaince
    };

    const machineRef = await firestoreDb.collection("machines").add(newMachine);

    return res.status(201).json({ message: "machine created successfully", id: machineRef.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update machine details
const updateMachine = async (req, res) => {
  const { machineUID } = req.params;
  const { name, status, last_maintaince, location, qr_id } = req.body;

  try {
    const machinesRef = firestoreDb.collection("machines").doc(machineUID);
    const machinesDoc = await machinesRef.get();

    if (!machinesDoc.exists) {
      return res.status(404).json({ message: "machine not found" });
    }

    await machinesRef.update({ name, status, last_maintaince, location, qr_id});

    return res.status(200).json({ message: "machine updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a machine
const deleteMachine = async (req, res) => {
  const { machineUID } = req.params;

  try {
    const machinesRef = firestoreDb.collection("machines").doc(machineUID);
    const machinesDoc = await machinesRef.get();

    if (!machinesDoc.exists) {
      return res.status(404).json({ message: "machine not found" });
    }

    await machinesRef.delete();

    return res.status(200).json({ message: "machine deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getIdByQr = async (req, res) => {
  try {
    const { qrId } = req.params;
    const machineQuery = await firestoreDb
      .collection("machines")
      .where("qr_id", "==", qrId)
      .limit(1)
      .get();

    if (machineQuery.empty) return res.status(404).json({ error: "Machine not found" });

    const machineDoc = machineQuery.docs[0];
    return res.json({ machineId: machineDoc.id, name: machineDoc.data().name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
};


module.exports = {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  getIdByQr,
  
};
