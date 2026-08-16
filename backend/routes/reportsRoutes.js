const express = require("express");

const router = express.Router();

const {
  getReports
} = require("../controllers/reportsController");

// GET HR reports
router.get("/", getReports);

module.exports = router;