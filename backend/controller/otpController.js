const db = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendOTPEmail } = require("../services/emailService");

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOTP = (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required"
        });
    }

    const sql = `
        SELECT
            login_otps.*,
            users.user_id,
            users.username,
            users.email AS user_email,
            users.role,
            users.status
        FROM login_otps
        INNER JOIN users
            ON users.user_id = login_otps.user_id
        WHERE login_otps.email = ?
        AND login_otps.otp = ?
        AND login_otps.verified = 0
        ORDER BY login_otps.created_at DESC
        LIMIT 1
    `;

    db.query(
        sql,
        [email, otp],
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (result.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid OTP"
                });
            }

            const otpRecord = result[0];

            // Check expiration
            const now = new Date();
            const expiry = new Date(
                otpRecord.expires_at
            );

            if (now > expiry) {

                return res.status(401).json({
                    success: false,
                    message: "OTP has expired"
                });
            }

            // Mark OTP as verified
            const updateSQL = `
                UPDATE login_otps
                SET verified = 1
                WHERE otp_id = ?
            `;

            db.query(
                updateSQL,
                [otpRecord.otp_id],
                (updateErr) => {

                    if (updateErr) {

                        console.error(updateErr);

                        return res.status(500).json({
                            success: false,
                            message: "OTP verification failed"
                        });
                    }

                    // ----------------------------------
                    // NOW CREATE JWT
                    // ----------------------------------

                    const token = jwt.sign(
                        {
                            id: otpRecord.user_id,
                            role: otpRecord.role
                        },
                        process.env.JWT_SECRET ||
                        "trusthire_secret",
                        {
                            expiresIn: "1d"
                        }
                    );

                    return res.status(200).json({

                        success: true,

                        message:
                            "OTP verified successfully",

                        token,

                        user: {
                            user_id:
                                otpRecord.user_id,

                            username:
                                otpRecord.username,

                            email:
                                otpRecord.user_email,

                            role:
                                otpRecord.role
                        }

                    });
                }
            );
        }
    );
};


// =====================================================
// RESEND OTP
// =====================================================

const resendOTP = (req, res) => {

    const { email } = req.body;

    if (!email) {

        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    const userSQL = `
        SELECT *
        FROM users
        WHERE email = ?
        AND status = 'active'
        LIMIT 1
    `;

    db.query(
        userSQL,
        [email],
        (err, result) => {

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

            // Generate new OTP
            const otp = crypto
                .randomInt(100000, 1000000)
                .toString();

            const expiresAt = new Date(
                Date.now() + 5 * 60 * 1000
            );

            // Delete old OTP
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
                            message: "Unable to resend OTP"
                        });
                    }

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
                                    message:
                                        "Unable to create new OTP"
                                });
                            }

                            try {

                                await sendOTPEmail(
                                    user.email,
                                    otp
                                );

                                return res.status(200).json({

                                    success: true,

                                    message:
                                        "New OTP sent successfully"

                                });

                            } catch (emailError) {

                                console.error(
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
        }
    );
};

module.exports = {
    verifyOTP,
    resendOTP
};