const db = require("../config/db");
const bcrypt = require("bcrypt");


// =====================================================
// GET CANDIDATE PROFILE
// =====================================================

const getCandidateProfile = (req, res) => {

    const { email } = req.query;

    console.log("PROFILE EMAIL:", email);

    if (!email) {

        return res.status(400).json({
            success: false,
            message: "Email is required"
        });

    }

    const sql = `
        SELECT
            candidate_id,
            email,
            user_id,
            first_name,
            last_name,
            mobile,
            dob,
            gender,
            created_at,
            job_role,
            status
        FROM candidates
        WHERE email = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [email],
        (err, result) => {

            if (err) {

                console.error(
                    "GET CANDIDATE PROFILE ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Candidate profile not found"
                });

            }

            return res.status(200).json({

                success: true,

                candidate: result[0]

            });

        }
    );
};


// =====================================================
// UPDATE CANDIDATE PROFILE
// =====================================================

const updateCandidateProfile = (req, res) => {

    const {
        email,
        first_name,
        last_name,
        mobile,
        dob,
        gender,
        job_role
    } = req.body;


    console.log(
        "UPDATE PROFILE EMAIL:",
        email
    );


    if (!email) {

        return res.status(400).json({
            success: false,
            message: "Email is required"
        });

    }


    const sql = `
        UPDATE candidates
        SET
            first_name = ?,
            last_name = ?,
            mobile = ?,
            dob = ?,
            gender = ?,
            job_role = ?
        WHERE email = ?
    `;


    db.query(
        sql,
        [
            first_name || null,
            last_name || null,
            mobile || null,
            dob || null,
            gender || null,
            job_role || null,
            email
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "UPDATE PROFILE ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to update profile"
                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Profile updated successfully"

            });

        }
    );
};


// =====================================================
// CHANGE CANDIDATE PASSWORD
// =====================================================

const changeCandidatePassword = async (
    req,
    res
) => {

    const {
        email,
        currentPassword,
        newPassword
    } = req.body;


    console.log(
        "CHANGE PASSWORD EMAIL:",
        email
    );


    if (
        !email ||
        !currentPassword ||
        !newPassword
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Email, current password and new password are required"

        });

    }


    // Password length validation

    if (newPassword.length < 8) {

        return res.status(400).json({

            success: false,

            message:
                "New password must be at least 8 characters"

        });

    }


    try {

        // =============================================
        // GET USER
        // =============================================

        const findUserSQL = `
            SELECT
                user_id,
                password
            FROM users
            WHERE email = ?
            LIMIT 1
        `;


        db.query(
            findUserSQL,
            [email],
            async (err, result) => {

                if (err) {

                    console.error(
                        "FIND USER ERROR:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database error"

                    });

                }


                if (result.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "User not found"

                    });

                }


                const user = result[0];


                // =====================================
                // CHECK CURRENT PASSWORD
                // =====================================

                const passwordMatch =
                    await bcrypt.compare(
                        currentPassword,
                        user.password
                    );


                if (!passwordMatch) {

                    return res.status(401).json({

                        success: false,

                        message:
                            "Current password is incorrect"

                    });

                }


                // =====================================
                // HASH NEW PASSWORD
                // =====================================

                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        12
                    );


                // =====================================
                // UPDATE PASSWORD
                // =====================================

                const updatePasswordSQL = `
                    UPDATE users
                    SET password = ?
                    WHERE user_id = ?
                `;


                db.query(
                    updatePasswordSQL,
                    [
                        hashedPassword,
                        user.user_id
                    ],
                    (updateErr) => {

                        if (updateErr) {

                            console.error(
                                "UPDATE PASSWORD ERROR:",
                                updateErr
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Unable to change password"

                            });

                        }


                        return res.status(200).json({

                            success: true,

                            message:
                                "Password changed successfully"

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getCandidateProfile,

    updateCandidateProfile,

    changeCandidatePassword

};