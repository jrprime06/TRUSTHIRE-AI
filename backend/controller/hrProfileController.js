const db = require("../config/db");
const bcrypt = require("bcryptjs");


// ======================================================
// GET HR PROFILE
// ======================================================
const getHRProfile = (req, res) => {

    const email = req.query.email;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    const sql = `
        SELECT
            h.hr_id,
            h.email,
            h.user_id,
            h.company_name,
            h.designation
        FROM hr h
        WHERE h.email = ?
        LIMIT 1
    `;

    db.query(sql, [email], (err, results) => {

        if (err) {
            console.error("GET HR PROFILE ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "HR profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            hr: results[0]
        });
    });
};


// ======================================================
// CHANGE HR PASSWORD
// ======================================================
const changeHRPassword = async (req, res) => {

    try {

        const {
            email,
            currentPassword,
            newPassword
        } = req.body;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }


        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 6 characters"
            });
        }


        // -------------------------------
        // GET USER
        // -------------------------------

        const userSql = `
            SELECT
                user_id,
                email,
                password
            FROM users
            WHERE email = ?
            LIMIT 1
        `;


        db.query(userSql, [email], async (err, results) => {

            if (err) {
                console.error("GET USER PASSWORD ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }


            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User account not found"
                });

            }


            const user = results[0];


            // -------------------------------
            // CHECK CURRENT PASSWORD
            // -------------------------------

            const passwordMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );


            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });

            }


            // -------------------------------
            // HASH NEW PASSWORD
            // -------------------------------

            const hashedPassword = await bcrypt.hash(
                newPassword,
                10
            );


            // -------------------------------
            // UPDATE PASSWORD
            // -------------------------------

            const updateSql = `
                UPDATE users
                SET password = ?
                WHERE user_id = ?
            `;


            db.query(
                updateSql,
                [hashedPassword, user.user_id],
                (updateErr, updateResult) => {

                    if (updateErr) {

                        console.error(
                            "UPDATE PASSWORD ERROR:",
                            updateErr
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Failed to update password"
                        });

                    }


                    return res.status(200).json({
                        success: true,
                        message: "Password changed successfully"
                    });

                }
            );

        });

    } catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};


module.exports = {
    getHRProfile,
    changeHRPassword
};