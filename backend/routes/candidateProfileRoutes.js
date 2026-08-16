const express = require("express");

const router = express.Router();

const {
    getCandidateProfile,
    updateCandidateProfile,
    changeCandidatePassword
} = require("../controllers/candidateProfileController");


// =====================================================
// GET PROFILE
// =====================================================

router.get(
    "/",
    getCandidateProfile
);


// =====================================================
// UPDATE PROFILE
// =====================================================

router.put(
    "/",
    updateCandidateProfile
);


// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put(
    "/change-password",
    changeCandidatePassword
);


module.exports = router;