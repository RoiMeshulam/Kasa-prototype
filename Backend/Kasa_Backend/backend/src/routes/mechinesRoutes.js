const express = require("express");
const router = express.Router();
const mechinesController = require("../controllers/mechinesController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", mechinesController.getMechines);
router.get("/:mechineUID", mechinesController.getMechineById);
router.post("/", mechinesController.createMechine);
router.put("/:mechineUID", mechinesController.updateMechine);
router.delete("/:mechineUID", mechinesController.deleteMechine);

module.exports = router;
