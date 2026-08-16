const db = require("../config/db");
const bcrypt = require("bcrypt");
const transporter = require("../config/mail");


exports.getAllHR = (req, res) => {

    const sql = `
    SELECT
        hr.hr_id,
        users.user_id,
        users.username,
        users.email,
        users.status,
        hr.company_name,
        hr.designation,
        users.created_at
    FROM hr
    INNER JOIN users
        ON hr.user_id = users.user_id
    ORDER BY hr.hr_id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });

    });

};

// update hr

exports.updateHR = (req, res) => {

    const hr_id = req.params.id;

    const {
        username,
        email,
        company_name,
        designation,
        status
    } = req.body;

    db.query(
        "SELECT user_id FROM hr WHERE hr_id=?",
        [hr_id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "HR not found"
                });
            }

            const user_id = result[0].user_id;

            const userSql = `
            UPDATE users
            SET username=?,
                email=?,
                status=?
            WHERE user_id=?
            `;

            db.query(
                userSql,
                [
                    username,
                    email,
                    status,
                    user_id
                ],
                (err2) => {

                    if (err2)
                        return res.status(500).json(err2);

                    const hrSql = `
                    UPDATE hr
                    SET
                        email=?,
                        company_name=?,
                        designation=?
                    WHERE hr_id=?
                    `;

                    db.query(
                        hrSql,
                        [
                            email,
                            company_name,
                            designation,
                            hr_id
                        ],
                        (err3) => {

                            if (err3)
                                return res.status(500).json(err3);

                            res.json({
                                success: true,
                                message: "HR Updated Successfully"
                            });

                        }
                    );

                }
            );

        }
    );

};

// detele hr

exports.deleteHR = (req, res) => {

    const hr_id = req.params.id;

    db.query(
        "SELECT user_id FROM hr WHERE hr_id=?",
        [hr_id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0) {
                return res.json({
                    success: false,
                    message: "HR not found"
                });
            }

            const user_id = result[0].user_id;

            db.query(
                "DELETE FROM job_posts WHERE hr_id=?",
                [hr_id],
                (err1) => {

                    if (err1)
                        return res.status(500).json(err1);

                    db.query(
                        "DELETE FROM hr WHERE hr_id=?",
                        [hr_id],
                        (err2) => {

                            if (err2)
                                return res.status(500).json(err2);

                            db.query(
                                "DELETE FROM users WHERE user_id=?",
                                [user_id],
                                (err3) => {

                                    if (err3)
                                        return res.status(500).json(err3);

                                    res.json({
                                        success: true,
                                        message: "HR Deleted Successfully"
                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};


// recent hr


exports.getRecentHR = (req, res) => {

    const sql = `
        SELECT
            hr.hr_id,
            users.user_id,
            users.username,
            users.email,
            users.status,
            hr.company_name,
            hr.designation,
            users.created_at
        FROM hr
        INNER JOIN users
            ON hr.user_id = users.user_id
        ORDER BY users.created_at DESC
        LIMIT 5
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });

    });

};


// Generate Random Password
const generatePassword = (length = 10) => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return password;
};

exports.addHR = async (req, res) => {

    const {
        username,
        email,
        company_name,
        designation
    } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            success: false,
            message: "Username and Email are required"
        });
    }

    try {

        // Check Email Exists

        db.query(
            "SELECT * FROM users WHERE email=?",
            [email],
            async (err, result) => {

                if (err)
                    return res.status(500).json(err);

                if (result.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }

                // Generate Password

                const randomPassword = generatePassword();

                // Send Email FIRST

                const mailOptions = {

                    from: "TrustHire AI <trusthireai@gmail.com>",

                    to: email,

                    subject: "Your HR Account Created",

                    html: `
                    <div style="font-family:Arial;padding:20px">

                    <h2>Welcome to TrustHire AI</h2>

                    <p>Your HR Account has been created.</p>

                    <table>

                    <tr>
                    <td><b>Username</b></td>
                    <td>${username}</td>
                    </tr>

                    <tr>
                    <td><b>Email</b></td>
                    <td>${email}</td>
                    </tr>

                    <tr>
                    <td><b>Password</b></td>
                    <td>${randomPassword}</td>
                    </tr>

                    </table>

                    <br>

                    <p>Please login and change your password immediately.</p>

                    </div>
                    `
                };

                transporter.sendMail(mailOptions, async (mailErr) => {

                    if (mailErr) {

                        return res.status(500).json({
                            success: false,
                            message: "Unable to send email"
                        });

                    }

                    // Hash Password

                    const hashedPassword = await bcrypt.hash(randomPassword, 10);

                    // Insert User

                    const userSql = `
                    INSERT INTO users
                    (username,email,password,role,status)
                    VALUES(?,?,?,?,?)
                    `;

                    db.query(
                        userSql,
                        [
                            username,
                            email,
                            hashedPassword,
                            "hr",
                            "active"
                        ],
                        (err2, userResult) => {

                            if (err2)
                                return res.status(500).json(err2);

                            const user_id = userResult.insertId;

                            // Insert HR

                            const hrSql = `
                            INSERT INTO hr
                            (email,user_id,company_name,designation)
                            VALUES(?,?,?,?)
                            `;

                            db.query(
                                hrSql,
                                [
                                    email,
                                    user_id,
                                    company_name,
                                    designation
                                ],
                                (err3) => {

                                    if (err3)
                                        return res.status(500).json(err3);

                                    return res.json({
                                        success: true,
                                        message: "HR Added Successfully"
                                    });

                                }
                            );

                        }
                    );

                });

            }
        );

    } catch (error) {

        res.status(500).json(error);

    }

};