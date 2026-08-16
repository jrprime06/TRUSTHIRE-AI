const db = require("../config/db");
const bcrypt = require("bcrypt");
const transporter = require("../config/mail");

exports.register = async (req, res) => {

    const {
        firstName,
        lastName,
        dob,
        gender,
        mobile,
        email,
        password
    } = req.body;

    try {

        // Check Email

        db.query(
            "SELECT * FROM users WHERE email=?",
            [email],
            async (err, result) => {

                if (err)
                    return res.status(500).json(err);

                if (result.length > 0) {

                    return res.status(400).json({
                        message: "Email already exists"
                    });

                }

                const hash = await bcrypt.hash(password, 10);

                // Insert into users

                const userSql = `
                INSERT INTO users
                (
                    username,
                    email,
                    password,
                    role,
                    status
                )
                VALUES (?,?,?,?,?)
                `;

                db.query(
                    userSql,
                    [
                        firstName + " " + lastName,
                        email,
                        hash,
                        "candidate",
                        "active"
                    ],
                    (err, userResult) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).json(err);

                        }

                        const userId = userResult.insertId;

                        // Insert into candidates

                      const candidateSql = `
    INSERT INTO candidates
    (
        email,
        user_id,
        first_name,
        last_name,
        mobile,
        dob,
        gender,
        status
    )
    VALUES (?,?,?,?,?,?,?,?)
`;

                        db.query(
                            candidateSql,
                            [
                                email,
                                userId,
                                firstName,
                                lastName,
                                mobile,
                                dob,
                                gender,
                                "Verified"
                            ],
                            (err) => {

                                if (err) {

                                    console.log(err);

                                    return res.status(500).json(err);

                                }

                                const mailOptions = {

    from: "TrustHire AI <trusthireai@gmail.com>",

    to: email,

    subject: "Welcome to TrustHire AI 🎉",

    html: `

        <div style="font-family:Arial;padding:20px">

            <h2>Welcome ${firstName}!</h2>

            <p>
                Thank you for registering with
                <b>TrustHire AI</b>.
            </p>

            <p>
                Your account has been created successfully.
            </p>

            <p>
                You can now login and start applying for jobs.
            </p>

            <br>

            <a
                href="http://localhost:3000/login"
                style="
                    background:#2563EB;
                    color:white;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:5px;
                "
            >
                Login Now
            </a>

            <br><br>

            <p>
                Regards,<br>
                TrustHire AI Team
            </p>

        </div>

    `
};

transporter.sendMail(mailOptions, (err) => {

    if (err) {

        console.log(err);

    }

    res.json({

        success: true,

        message: "Registration Successful"

    });

});

                            }
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};