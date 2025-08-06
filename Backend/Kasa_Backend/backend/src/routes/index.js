const express = require('express');
const scansRoutes = require('./scansRoutes');
const userRoutes = require("./userRoutes");
const mechinesRoutes = require("./mechinesRoutes");
const bottlesRoutes = require("./bottlesRoutes");

const router = express.Router();

// all routes
// router.use('/scans', scansRoutes);
router.use("/users",userRoutes);
router.use("/mechines",mechinesRoutes);
router.use("/bottles",bottlesRoutes);

module.exports = router;