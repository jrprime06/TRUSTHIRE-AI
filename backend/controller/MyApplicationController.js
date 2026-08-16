const db = require("../config/db");


/* =====================================================
   GET MY APPLICATIONS

   Flow:

   user_id
      ↓
   candidates
      ↓
   candidate_id
      ↓
   resumes
      ↓
   job_posts
      ↓
   technical_questions

   Returns:
   - Resume/application information
   - Company name
   - Job title
   - Technical questions
   - Candidate answers
===================================================== */

const getMyApplications = (req, res) => {

    const { user_id } = req.params;


    console.log("====================================");
    console.log("MY APPLICATIONS REQUEST");
    console.log("User ID:", user_id);
    console.log("====================================");


    /* =====================================================
       VALIDATE USER ID
    ===================================================== */

    if (!user_id) {

        return res.status(400).json({

            success: false,

            message: "User ID is required."

        });

    }


    /* =====================================================
       STEP 1
       FIND CANDIDATE ID FROM USER ID
    ===================================================== */

    const candidateSql = `

        SELECT
            candidate_id

        FROM candidates

        WHERE user_id = ?

        LIMIT 1

    `;


    db.query(

        candidateSql,

        [user_id],

        (candidateErr, candidateResult) => {


            /* =================================================
               CANDIDATE QUERY ERROR
            ================================================= */

            if (candidateErr) {

                console.error(
                    "Candidate lookup error:",
                    candidateErr
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to find candidate.",

                    error:
                        candidateErr.message

                });

            }


            /* =================================================
               CANDIDATE NOT FOUND
            ================================================= */

            if (
                !candidateResult ||
                candidateResult.length === 0
            ) {

                console.log(
                    "No candidate found for user ID:",
                    user_id
                );

                return res.status(200).json({

                    success: true,

                    user_id:
                        Number(user_id),

                    candidate_id:
                        null,

                    applications: []

                });

            }


            /* =================================================
               GET CANDIDATE ID
            ================================================= */

            const candidate_id =
                candidateResult[0].candidate_id;


            console.log(
                "Resolved Candidate ID:",
                candidate_id
            );


            /* =====================================================
               STEP 2
               GET RESUMES + JOB DETAILS

               resumes.job_id
                      ↓
               job_posts.job_id

               We use LEFT JOIN so that the application
               is still returned even if job information
               is missing.
            ===================================================== */

            const resumeSql = `

                SELECT

                    /* ==========================
                       RESUME DATA
                    ========================== */

                    r.resume_id,

                    r.candidate_id,

                    r.job_id,

                    r.full_name,

                    r.email,

                    r.mobile,

                    r.experience,

                    r.location,

                    r.resume_name,

                    r.file_type,

                    r.file_size,

                    r.upload_date,

                    r.status,


                    /* ==========================
                       JOB DATA
                    ========================== */

                    jp.company_name,

                    jp.job_title


                FROM resumes r


                /* ==========================
                   JOIN JOB POSTS
                ========================== */

                LEFT JOIN job_posts jp

                    ON r.job_id = jp.job_id


                /* ==========================
                   CANDIDATE FILTER
                ========================== */

                WHERE r.candidate_id = ?


                /* ==========================
                   LATEST APPLICATION FIRST
                ========================== */

                ORDER BY r.upload_date DESC

            `;


            db.query(

                resumeSql,

                [candidate_id],

                (resumeErr, applications) => {


                    /* =========================================
                       RESUME QUERY ERROR
                    ========================================= */

                    if (resumeErr) {

                        console.error(
                            "Get applications error:",
                            resumeErr
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Failed to fetch applications.",

                            error:
                                resumeErr.message

                        });

                    }


                    /* =========================================
                       NO APPLICATIONS
                    ========================================= */

                    if (
                        !applications ||
                        applications.length === 0
                    ) {

                        console.log(
                            "No applications found for candidate:",
                            candidate_id
                        );

                        return res.status(200).json({

                            success: true,

                            user_id:
                                Number(user_id),

                            candidate_id:
                                candidate_id,

                            applications: []

                        });

                    }


                    console.log(
                        "Applications found:",
                        applications.length
                    );


                    /* =================================================
                       DEBUG JOB DETAILS
                    ================================================= */

                    applications.forEach(
                        (application) => {

                            console.log(
                                "------------------------------------"
                            );

                            console.log(
                                "Resume ID:",
                                application.resume_id
                            );

                            console.log(
                                "Job ID:",
                                application.job_id
                            );

                            console.log(
                                "Company:",
                                application.company_name
                            );

                            console.log(
                                "Job Title:",
                                application.job_title
                            );

                        }
                    );


                    /* =================================================
                       STEP 3
                       GET QUESTIONS FOR EACH RESUME
                    ================================================= */

                    let completed = 0;


                    applications.forEach(

                        (application) => {


                            const questionSql = `

                                SELECT

                                    question_id,

                                    resume_id,

                                    question,

                                    answer

                                FROM technical_questions

                                WHERE resume_id = ?

                                ORDER BY question_id ASC

                            `;


                            db.query(

                                questionSql,

                                [
                                    application.resume_id
                                ],

                                (
                                    questionErr,
                                    questions
                                ) => {


                                    /* =========================
                                       QUESTION QUERY ERROR
                                    ========================= */

                                    if (questionErr) {

                                        console.error(
                                            "Questions fetch error:",
                                            questionErr
                                        );

                                        application.questions =
                                            [];

                                    }


                                    /* =========================
                                       QUESTIONS FOUND
                                    ========================= */

                                    else {

                                        application.questions =
                                            questions || [];

                                    }


                                    /* =========================
                                       COUNT COMPLETED
                                    ========================= */

                                    completed++;


                                    /* =========================
                                       ALL APPLICATIONS COMPLETE
                                    ========================= */

                                    if (
                                        completed ===
                                        applications.length
                                    ) {

                                        console.log(
                                            "===================================="
                                        );

                                        console.log(
                                            "FINAL APPLICATION DATA"
                                        );

                                        console.log(
                                            "User ID:",
                                            user_id
                                        );

                                        console.log(
                                            "Candidate ID:",
                                            candidate_id
                                        );

                                        console.log(
                                            "Applications:",
                                            applications.length
                                        );

                                        console.log(
                                            "===================================="
                                        );


                                        return res.status(200).json({

                                            success: true,

                                            user_id:
                                                Number(user_id),

                                            candidate_id:
                                                candidate_id,

                                            applications:
                                                applications

                                        });

                                    }

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};


/* =====================================================
   VIEW RESUME PDF

   GET:
   /api/my-applications/resume/:resume_id
===================================================== */

const viewResume = (req, res) => {

    const { resume_id } = req.params;


    console.log(
        "View Resume ID:",
        resume_id
    );


    /* =====================================================
       VALIDATE RESUME ID
    ===================================================== */

    if (!resume_id) {

        return res.status(400).send(
            "Resume ID is required."
        );

    }


    /* =====================================================
       GET RESUME FILE
    ===================================================== */

    const sql = `

        SELECT

            resume_file,

            resume_name,

            file_type

        FROM resumes

        WHERE resume_id = ?

        LIMIT 1

    `;


    db.query(

        sql,

        [resume_id],

        (err, result) => {


            /* ================================================
               DATABASE ERROR
            ================================================ */

            if (err) {

                console.error(
                    "Resume fetch error:",
                    err
                );

                return res.status(500).send(
                    "Failed to fetch resume."
                );

            }


            /* ================================================
               RESUME NOT FOUND
            ================================================ */

            if (
                !result ||
                result.length === 0
            ) {

                return res.status(404).send(
                    "Resume not found."
                );

            }


            const resume =
                result[0];


            /* ================================================
               CONTENT TYPE
            ================================================ */

            res.setHeader(

                "Content-Type",

                resume.file_type ||
                "application/pdf"

            );


            /* ================================================
               DISPLAY PDF IN BROWSER
            ================================================ */

            res.setHeader(

                "Content-Disposition",

                `inline; filename="${resume.resume_name}"`

            );


            /* ================================================
               SEND RESUME BLOB
            ================================================ */

            return res.send(
                resume.resume_file
            );

        }

    );

};


/* =====================================================
   EXPORT
===================================================== */

module.exports = {

    getMyApplications,

    viewResume

};