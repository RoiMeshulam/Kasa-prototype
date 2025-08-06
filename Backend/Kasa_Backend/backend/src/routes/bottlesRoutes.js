const express = require("express");
const router = express.Router();
const bottlesController = require("../controllers/bottlesController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, bottlesController.getBottles);
router.get("/:bottleId", authenticateToken, bottlesController.getBottleById);
router.post("/", authenticateToken, bottlesController.createBottle);
router.put("/:bottleId", authenticateToken, bottlesController.updateBottle);
router.delete("/:bottleId", authenticateToken, bottlesController.deleteBottle);

module.exports = router;
