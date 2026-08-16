const express = require("express");

const router = express.Router();

const {
    generateTrustReport
} = require("../controllers/trustReportController");

// Generate AI Report
router.get(
    "/generate/:resumeId",
    generateTrustReport
);

module.exports = router;