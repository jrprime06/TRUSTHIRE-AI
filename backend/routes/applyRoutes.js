const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
    applyJob,
    getAppliedJobs,
    generateQuestions,
    submitAnswers
} = require("../controllers/applyController");


// ==========================================
// MULTER STORAGE
// Store uploaded resume in memory
// Then save it into MySQL LONGBLOB
// ==========================================

const storage = multer.memoryStorage();

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    }

});


// ==========================================
// APPLY FOR JOB
// ==========================================

router.post(
    "/apply",
    upload.single("resume"),
    applyJob
);


// ==========================================
// GET ALREADY APPLIED JOBS
// ==========================================

router.get(
    "/applied-jobs/:candidate_id",
    getAppliedJobs
);


// ==========================================
// GENERATE AI QUESTIONS
// ==========================================

router.post(
    "/generate-questions",
    generateQuestions
);


// ==========================================
// SUBMIT INTERVIEW ANSWERS
// ==========================================

router.post(
    "/submit-answers",
    submitAnswers
);


module.exports = router;