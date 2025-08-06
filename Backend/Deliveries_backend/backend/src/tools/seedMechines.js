// tools/seedMechines.js

const { firestoreDb } = require("../firebase"); // adjust path if needed

const machines = [
  {
    id_machine: "001",
    name: "תל אביב – קניון עזריאלי",
    status: "פנויה",
    maintenance_last: "2025-07-12",
    latitude: 32.068002,
    longitude: 34.783223,
    qr_code: "qr-machine-001-TLV-Azrieli",
  },
  {
    id_machine: "002",
    name: "חיפה – מרכז חורב",
    status: "מלאה",
    maintenance_last: "2025-06-25",
    latitude: 32.794,
    longitude: 34.9896,
    qr_code: "qr-machine-002-HFA-Horev",
  },
  // ... rest of the machines
];

(async () => {
  try {
    const batch = firestoreDb.batch();

    machines.forEach((machine) => {
      const ref = firestoreDb.collection("mechines").doc(); // Auto-generated ID
      batch.set(ref, {
        name: machine.name,
        status: machine.status,
        last_maintaince: machine.maintenance_last,
        location: [machine.latitude, machine.longitude],
        qr_id: machine.qr_code,
      });
    });

    await batch.commit();
    console.log("✅ All machines added successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to add machines:", err);
    process.exit(1);
  }
})();
