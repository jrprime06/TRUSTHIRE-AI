const express = require("express");

const router = express.Router();

const { login } = require("../controllers/login");

const {
    verifyOTP,
    resendOTP
} = require("../controllers/otpController");


// Login - Email + Password
router.post("/login", login);


// Verify OTP
router.post("/verify-otp", verifyOTP);


// Resend OTP
router.post("/resend-otp", resendOTP);


module.exports = router;