const express = require("express");
const router = express.Router();

// שים לב לשם הקובץ: sessions.controller.js
const sessionsController = require("../controllers/sessionsController");
// אם תרצה להגן: const authenticateToken = require("../middlewares/authMiddleware");

// ✔ חדש: הכל תחת /api/sessions
router.get("/user/:userId", sessionsController.listUserSessions);
// דוגמה: /api/sessions/user/<userId>?year=2025&month=9  או  ?fromMs=...&toMs=...

router.get("/user/:userId/summary", sessionsController.userMonthlySummary);
// דוגמה: /api/sessions/user/<userId>/summary?year=2025&month=9

// CRUD בסיסי
router.post("/", sessionsController.createSession);           // POST  /api/sessions
router.get("/", sessionsController.listSessions);             // GET   /api/sessions
router.get("/:id", sessionsController.getSession);            // GET   /api/sessions/:id
router.patch("/:id", sessionsController.updateSession);       // PATCH /api/sessions/:id
router.post("/:id/end", sessionsController.endSession);       // POST  /api/sessions/:id/end
router.delete("/:id", sessionsController.deleteSession);      // DELETE /api/sessions/:id



module.exports = router;
