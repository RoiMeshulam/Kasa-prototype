const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessionsController");
const authenticateToken = require("../middlewares/authMiddleware");


router.post('/', sessionsController.createSession);          // POST /api/sessions
router.get('/', sessionsController.listSessions);            // GET  /api/sessions
router.get('/:id', sessionsController.getSession);           // GET  /api/sessions/:id
router.patch('/:id', sessionsController.updateSession);      // PATCH /api/sessions/:id
router.post('/:id/end', sessionsController.endSession);      // POST /api/sessions/:id/end
router.delete('/:id', sessionsController.deleteSession);


module.exports = router;
