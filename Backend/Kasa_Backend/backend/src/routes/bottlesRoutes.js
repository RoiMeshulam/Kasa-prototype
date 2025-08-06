const express = require("express");
const router = express.Router();
const bottlesController = require("../controllers/bottlesController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/", bottlesController.getBottles);
router.get("/:bottleId", bottlesController.getBottleById);
router.post("/", bottlesController.createBottle);
router.put("/:bottleId", bottlesController.updateBottle);
router.delete("/:bottleId", bottlesController.deleteBottle);

module.exports = router;
