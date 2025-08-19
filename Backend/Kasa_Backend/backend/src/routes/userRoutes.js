const express = require("express");
const { signIn, signUp, updateUser } = require("../controllers/usersController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signUp); // User Registration
router.post("/signin", signIn); // User Login
router.put("/updateUser/:uid", updateUser);
// router.get("/users",authenticateToken, getUsers); // Get all users from Firebase Realtime Database 

module.exports = router;
