const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendOTPEmail } = require("../services/emailService");

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const sql = "SELECT * FROM users WHERE email=? LIMIT 1";

        db.query(sql, [email], async (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = result[0];

            // Check account status
            if (user.status !== "active") {
                return res.status(403).json({
                    success: false,
                    message: "Your account is inactive"
                });
            }

            // Check password
            let isMatch = false;

            if (
                user.password.startsWith("$2a$") ||
                user.password.startsWith("$2b$") ||
                user.password.startsWith("$2y$")
            ) {

                isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

            } else {

                // Existing support for plain text passwords
                isMatch = password === user.password;
            }

            if (!isMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid Password"
                });
            }

            // -----------------------------------------
            // PASSWORD CORRECT
            // GENERATE OTP
            // -----------------------------------------

            const otp = crypto
                .randomInt(100000, 1000000)
                .toString();

            // OTP valid for 5 minutes
            const expiresAt = new Date(
                Date.now() + 5 * 60 * 1000
            );

            // Delete previous OTPs
            const deleteSQL = `
                DELETE FROM login_otps
                WHERE user_id = ?
            `;

            db.query(
                deleteSQL,
                [user.user_id],
                async (deleteErr) => {

                    if (deleteErr) {

                        console.error(deleteErr);

                        return res.status(500).json({
                            success: false,
                            message: "Could not create OTP"
                        });
                    }

                    // Save new OTP
                    const insertSQL = `
                        INSERT INTO login_otps
                        (
                            user_id,
                            email,
                            otp,
                            expires_at,
                            verified
                        )
                        VALUES (?, ?, ?, ?, 0)
                    `;

                    db.query(
                        insertSQL,
                        [
                            user.user_id,
                            user.email,
                            otp,
                            expiresAt
                        ],
                        async (insertErr) => {

                            if (insertErr) {

                                console.error(insertErr);

                                return res.status(500).json({
                                    success: false,
                                    message: "Could not save OTP"
                                });
                            }

                            try {

                                // Send OTP
                                await sendOTPEmail(
                                    user.email,
                                    otp
                                );

                                return res.status(200).json({

                                    success: true,

                                    message:
                                        "OTP sent successfully to your email",

                                    otpRequired: true,

                                    email: user.email

                                });

                            } catch (emailError) {

                                console.error(
                                    "EMAIL ERROR:",
                                    emailError
                                );

                                return res.status(500).json({

                                    success: false,

                                    message:
                                        "Unable to send OTP email"

                                });
                            }
                        }
                    );
                }
            );
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    login
};