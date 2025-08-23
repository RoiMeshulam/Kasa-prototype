const express = require("express");
const router = express.Router();
const machinesController = require("../controllers/machinesController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, machinesController.getMachines);
router.get("/:machineUID", authenticateToken, machinesController.getMachineById);
router.post("/", authenticateToken, machinesController.createMachine);
router.put("/:machineUID", authenticateToken, machinesController.updateMachine);
router.delete("/:machineUID", authenticateToken, machinesController.deleteMachine);
router.get("/getIdByQr/:qrId", machinesController.getIdByQr);

module.exports = router;
