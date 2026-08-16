const express = require("express");

const router = express.Router();

const {
    getMyApplications,
    viewResume
} = require("../controllers/MyApplicationController");


/* =====================================================
   GET ALL APPLICATIONS OF LOGGED-IN USER
===================================================== */

router.get(
    "/my-applications/:user_id",
    getMyApplications
);


/* =====================================================
   VIEW / DOWNLOAD RESUME
===================================================== */

router.get(
    "/my-applications/resume/:resume_id",
    viewResume
);


module.exports = router;