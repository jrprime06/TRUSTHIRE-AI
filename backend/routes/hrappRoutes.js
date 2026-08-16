const express = require("express");
const router = express.Router();

const {
    getAllJobs,
    getJobApplications,
    viewResumePDF,
    getTechnicalInterview,
    updateApplicationStatus
} = require("../controllers/hrappController");


// Get all job posts
router.get(
    "/jobs",
    getAllJobs
);


// Test HR application route
router.get(
    "/test",
    (req, res) => {
        res.send("HR App Route Working");
    }
);


// Get all applications for a specific job
// GET /api/hr/jobs/:jobId/applications
router.get(
    "/jobs/:jobId/applications",
    getJobApplications
);


// Update application status
// PUT /api/hr/applications/:resumeId/status
router.put(
    "/applications/:resumeId/status",
    updateApplicationStatus
);


// View Resume PDF
// GET /api/hr/:id/pdf
router.get(
    "/:id/pdf",
    viewResumePDF
);


// Get Technical Interview
// GET /api/hr/technical/:resumeId
router.get(
    "/technical/:resumeId",
    getTechnicalInterview
);


module.exports = router;