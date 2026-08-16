const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/adminController");

// Dashboard Statistics
router.get("/dashboard", getDashboard);

module.exports = router;