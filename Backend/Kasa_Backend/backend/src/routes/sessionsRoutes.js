const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessionsController");
const authenticateToken = require("../middlewares/authMiddleware");


router.post("/", sessionsController.createSession);


module.exports = router;
