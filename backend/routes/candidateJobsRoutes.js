const express = require("express");
const router = express.Router();

const candidateJobsController = require("../controllers/candidateJobs");

router.get("/", candidateJobsController.getAllJobs);
router.get("/:id", candidateJobsController.getJobById);
router.get("/:id/pdf", candidateJobsController.generateJobPDF);

module.exports = router;