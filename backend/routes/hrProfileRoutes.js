const express = require("express");

const router = express.Router();

const {
    getHRProfile,
    changeHRPassword
} = require("../controllers/hrProfileController");


// Get HR profile
router.get(
    "/",
    getHRProfile
);


// Change HR password
router.put(
    "/password",
    changeHRPassword
);


module.exports = router;