const db = require("../config/db");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { evaluateCandidate } = require("./resumeEvaluationController");


/* ===========================================
   APPLY JOB
=========================================== */

const applyJob = async (req, res) => {

    try {

        const {
            job_id,
            fullName,
            email,
            mobile,
            experience,
            location
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!job_id) {

            return res.status(400).json({
                success: false,
                message: "Job ID is required."
            });

        }


        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required."
            });

        }


        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Resume is required."
            });

        }


        // ==========================================
        // FIND CANDIDATE
        // ==========================================

        db.query(

            `SELECT candidate_id
             FROM candidates
             WHERE email = ?
             LIMIT 1`,

            [email],

            (candidateErr, candidateResult) => {

                if (candidateErr) {

                    console.log(
                        "Candidate lookup error:",
                        candidateErr
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Failed to find candidate."
                    });

                }


                // ==========================================
                // CANDIDATE NOT FOUND
                // ==========================================

                if (candidateResult.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Candidate not found with this email."

                    });

                }


                const candidate_id =
                    candidateResult[0].candidate_id;


                console.log("=================================");
                console.log("APPLICATION");
                console.log("Candidate ID:", candidate_id);
                console.log("Job ID:", job_id);
                console.log("Email:", email);
                console.log("=================================");


                // ==========================================
                // CHECK ALREADY APPLIED
                // ==========================================

                db.query(

                    `SELECT resume_id, status
                     FROM resumes
                     WHERE candidate_id = ?
                     AND job_id = ?
                     LIMIT 1`,

                    [
                        candidate_id,
                        job_id
                    ],

                    (checkErr, existingApplication) => {

                        if (checkErr) {

                            console.log(
                                "Application check error:",
                                checkErr
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Failed to check existing application."

                            });

                        }


                        // ==========================================
                        // ALREADY APPLIED
                        // ==========================================

                        if (existingApplication.length > 0) {

                            console.log(
                                "Candidate already applied for this job."
                            );

                            return res.status(409).json({

                                success: false,

                                alreadyApplied: true,

                                message:
                                    "You have already applied for this job."

                            });

                        }


                        // ==========================================
                        // INSERT RESUME
                        // ==========================================

                        const sql = `

                            INSERT INTO resumes
                            (
                                candidate_id,
                                job_id,
                                full_name,
                                email,
                                mobile,
                                experience,
                                location,
                                resume_name,
                                resume_file,
                                file_type,
                                file_size,
                                status
                            )

                            VALUES
                            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

                        `;


                        db.query(

                            sql,

                            [

                                candidate_id,

                                job_id,

                                fullName,

                                email,

                                mobile,

                                experience,

                                location,

                                req.file.originalname,

                                req.file.buffer,

                                req.file.mimetype,

                                req.file.size,

                                "Uploaded"

                            ],

                            (err, result) => {

                                if (err) {

                                    console.log(
                                        "Resume insert error:",
                                        err
                                    );


                                    // ==========================================
                                    // MYSQL DUPLICATE PROTECTION
                                    // ==========================================

                                    if (
                                        err.code ===
                                        "ER_DUP_ENTRY"
                                    ) {

                                        return res.status(409).json({

                                            success: false,

                                            alreadyApplied: true,

                                            message:
                                                "You have already applied for this job."

                                        });

                                    }


                                    return res.status(500).json({

                                        success: false,

                                        message:
                                            err.sqlMessage ||
                                            err.message

                                    });

                                }


                                console.log(
                                    "Resume inserted successfully."
                                );

                                console.log(
                                    "Resume ID:",
                                    result.insertId
                                );


                                return res.status(200).json({

                                    success: true,

                                    alreadyApplied: false,

                                    message:
                                        "Resume Uploaded",

                                    resume_id:
                                        result.insertId

                                });

                            }

                        );

                    }

                );

            }

        );

    }

    catch (error) {

        console.log(
            "Apply Job Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};



/* ===========================================
   GET APPLIED JOBS
=========================================== */

const getAppliedJobs = async (req, res) => {

    try {

        const {
            candidate_id
        } = req.params;


        if (!candidate_id) {

            return res.status(400).json({

                success: false,

                message:
                    "Candidate ID is required."

            });

        }


        db.query(

            `SELECT job_id
             FROM resumes
             WHERE candidate_id = ?`,

            [candidate_id],

            (err, result) => {

                if (err) {

                    console.log(
                        "Get applied jobs error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to get applied jobs."

                    });

                }


                const appliedJobIds =
                    result.map(
                        row => row.job_id
                    );


                return res.status(200).json({

                    success: true,

                    appliedJobs:
                        appliedJobIds

                });

            }

        );

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};



/* ===========================================
   GENERATE QUESTIONS
=========================================== */

const generateQuestions = async (req, res) => {

    try {

        const {
            resume_id
        } = req.body;


        // ==========================================
        // CHECK RESUME ID
        // ==========================================

        if (!resume_id) {

            return res.status(400).json({

                success: false,

                message:
                    "resume_id is required."

            });

        }


        // ==========================================
        // GET RESUME
        // ==========================================

        db.query(

            `SELECT
                resume_name,
                resume_file,
                file_type,
                file_size,
                status
             FROM resumes
             WHERE resume_id = ?`,

            [resume_id],

            async (err, result) => {

                // ==========================================
                // DATABASE ERROR
                // ==========================================

                if (err) {

                    console.log(
                        "Database error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Database Error"

                    });

                }


                // ==========================================
                // RESUME NOT FOUND
                // ==========================================

                if (result.length === 0) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Resume not found."

                    });

                }


                const resume =
                    result[0];


                // ==========================================
                // CHECK STATUS
                // ==========================================

                if (
                    resume.status ===
                    "Completed"
                ) {

                    return res.status(409).json({

                        success: false,

                        message:
                            "This application has already been completed."

                    });

                }


                // ==========================================
                // RESUME DEBUG
                // ==========================================

                console.log(
                    "\n========== RESUME DEBUG =========="
                );

                console.log(
                    "Resume ID:",
                    resume_id
                );

                console.log(
                    "Resume Name:",
                    resume.resume_name
                );

                console.log(
                    "File Type:",
                    resume.file_type
                );

                console.log(
                    "Database File Size:",
                    resume.file_size
                );

                console.log(
                    "Status:",
                    resume.status
                );

                console.log(
                    "BLOB Exists:",
                    !!resume.resume_file
                );

                console.log(
                    "BLOB Size:",
                    resume.resume_file
                        ? resume.resume_file.length
                        : 0
                );

                console.log(
                    "==================================\n"
                );


                // ==========================================
                // EMPTY BLOB
                // ==========================================

                if (
                    !resume.resume_file ||
                    resume.resume_file.length === 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Resume file is empty in database."

                    });

                }


                // ==========================================
                // CREATE TEMP FOLDER
                // ==========================================

                const tempFolder =
                    path.join(
                        __dirname,
                        "../temp"
                    );


                if (
                    !fs.existsSync(
                        tempFolder
                    )
                ) {

                    fs.mkdirSync(

                        tempFolder,

                        {
                            recursive: true
                        }

                    );

                }


                // ==========================================
                // CREATE TEMP PDF
                // ==========================================

                const pdfPath =
                    path.join(

                        tempFolder,

                        `${resume_id}_resume.pdf`

                    );


                // ==========================================
                // WRITE BLOB
                // ==========================================

                try {

                    fs.writeFileSync(

                        pdfPath,

                        resume.resume_file

                    );

                }

                catch (fileError) {

                    console.log(
                        "Failed to create PDF:",
                        fileError
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to create temporary PDF."

                    });

                }


                // ==========================================
                // VERIFY PDF
                // ==========================================

                console.log(
                    "\n========== PDF DEBUG =========="
                );

                console.log(
                    "PDF Path:",
                    pdfPath
                );

                console.log(
                    "PDF Exists:",
                    fs.existsSync(pdfPath)
                );


                if (
                    fs.existsSync(pdfPath)
                ) {

                    console.log(
                        "PDF Size:",
                        fs.statSync(
                            pdfPath
                        ).size
                    );

                }

                console.log(
                    "===============================\n"
                );


                if (
                    !fs.existsSync(
                        pdfPath
                    )
                ) {

                    return res.status(500).json({

                        success: false,

                        message:
                            "Temporary PDF was not created."

                    });

                }


                // ==========================================
                // SEND TO PYTHON AI
                // ==========================================

                try {

                    console.log(
                        "Sending resume to Python..."
                    );

                    console.log(
                        "Python URL:",
                        "http://127.0.0.1:8000/generate_questions"
                    );

                    console.log(
                        "Resume Path:",
                        pdfPath
                    );


                    const response =
                        await axios.post(

                            "http://127.0.0.1:8000/generate_questions",

                            {
                                resume_path:
                                    pdfPath
                            },

                            {
                                timeout:
                                    120000
                            }

                        );


                    // ==========================================
                    // PYTHON RESPONSE
                    // ==========================================

                    console.log(
                        "\n========== PYTHON RESPONSE =========="
                    );

                    console.log(
                        response.data
                    );

                    console.log(
                        "=====================================\n"
                    );


                    // ==========================================
                    // DELETE TEMP PDF
                    // ==========================================

                    if (
                        fs.existsSync(
                            pdfPath
                        )
                    ) {

                        fs.unlinkSync(
                            pdfPath
                        );

                    }


                    // ==========================================
                    // UPDATE STATUS
                    // Uploaded → Interviewing
                    // ==========================================

                    await new Promise(
                        (resolve, reject) => {

                            db.query(

                                `UPDATE resumes
                                 SET status = ?
                                 WHERE resume_id = ?
                                 AND status != 'Completed'`,

                                [
                                    "Interviewing",
                                    resume_id
                                ],

                                (statusErr) => {

                                    if (statusErr) {

                                        reject(
                                            statusErr
                                        );

                                    }

                                    else {

                                        resolve();

                                    }

                                }

                            );

                        }
                    );


                    // ==========================================
                    // RETURN QUESTIONS
                    // ==========================================

                    return res.status(200).json({

                        success: true,

                        resume_id:
                            resume_id,

                        questions:
                            response.data.questions

                    });

                }

                catch (pythonError) {

                    // ==========================================
                    // DELETE TEMP PDF
                    // ==========================================

                    if (
                        fs.existsSync(
                            pdfPath
                        )
                    ) {

                        fs.unlinkSync(
                            pdfPath
                        );

                    }


                    // ==========================================
                    // DELETE RESUME
                    // AI FAILED
                    // ==========================================

                    try {

                        console.log(
                            "Gemini/Python failed."
                        );

                        console.log(
                            "Deleting resume:",
                            resume_id
                        );


                        await new Promise(
                            (resolve, reject) => {

                                db.query(

                                    `DELETE FROM resumes
                                     WHERE resume_id = ?
                                     AND status != 'Completed'`,

                                    [resume_id],

                                    (deleteErr) => {

                                        if (
                                            deleteErr
                                        ) {

                                            console.log(
                                                "Failed to delete resume:",
                                                deleteErr
                                            );

                                            reject(
                                                deleteErr
                                            );

                                        }

                                        else {

                                            console.log(
                                                "Resume deleted successfully."
                                            );

                                            resolve();

                                        }

                                    }

                                );

                            }
                        );

                    }

                    catch (deleteError) {

                        console.log(
                            "Resume deletion error:",
                            deleteError
                        );

                    }


                    // ==========================================
                    // PYTHON ERROR LOG
                    // ==========================================

                    console.log(
                        "\n========== PYTHON / GEMINI ERROR =========="
                    );

                    console.log(
                        "Message:",
                        pythonError.message
                    );

                    console.log(
                        "Code:",
                        pythonError.code
                    );

                    console.log(
                        "Status:",
                        pythonError.response?.status
                    );

                    console.log(
                        "Response:",
                        pythonError.response?.data
                    );

                    console.log(
                        "===========================================\n"
                    );


                    return res.status(503).json({

                        success: false,

                        resumeDeleted:
                            true,

                        canApplyAgain:
                            true,

                        message:
                            "AI service is currently unavailable. Your application was not saved. Please try again."

                    });

                }

            }

        );

    }

    catch (error) {

        console.log(
            "Generate Questions Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};



/* ===========================================
   SUBMIT ANSWERS
=========================================== */

const submitAnswers = async (req, res) => {

    try {

        const {
            resume_id,
            questions
        } = req.body;


        console.log(
            "================================="
        );

        console.log(
            "SUBMIT ANSWERS"
        );

        console.log(
            "Resume ID:",
            resume_id
        );

        console.log(
            "Questions received:"
        );

        console.dir(
            questions,
            {
                depth: null
            }
        );

        console.log(
            "================================="
        );


        // ==========================================
        // VALIDATE RESUME ID
        // ==========================================

        if (!resume_id) {

            return res.status(400).json({

                success: false,

                message:
                    "resume_id is required"

            });

        }


        // ==========================================
        // VALIDATE QUESTIONS
        // ==========================================

        if (!Array.isArray(questions)) {

            return res.status(400).json({

                success: false,

                message:
                    "questions must be an array"

            });

        }


        if (
            questions.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "No questions received"

            });

        }


        // ==========================================
        // CHECK RESUME
        // ==========================================

        const resumeExists =
            await new Promise(

                (resolve, reject) => {

                    db.query(

                        `SELECT
                            resume_id,
                            status
                         FROM resumes
                         WHERE resume_id = ?
                         LIMIT 1`,

                        [resume_id],

                        (err, result) => {

                            if (err) {

                                reject(
                                    err
                                );

                            }

                            else {

                                resolve(
                                    result
                                );

                            }

                        }

                    );

                }

            );


        if (
            resumeExists.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Resume/application no longer exists."

            });

        }


        const currentStatus =
            resumeExists[0].status;


        // ==========================================
        // PREVENT DUPLICATE SUBMISSION
        // ==========================================

        if (
            currentStatus ===
            "Completed"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Interview has already been submitted."

            });

        }


        // ==========================================
        // DELETE OLD QUESTIONS
        // ==========================================

        await new Promise(

            (resolve, reject) => {

                db.query(

                    `DELETE FROM technical_questions
                     WHERE resume_id = ?`,

                    [resume_id],

                    (err) => {

                        if (err) {

                            reject(
                                err
                            );

                        }

                        else {

                            resolve();

                        }

                    }

                );

            }

        );


        // ==========================================
        // INSERT QUESTIONS + ANSWERS
        // ==========================================

        for (
            let i = 0;
            i < questions.length;
            i++
        ) {

            const item =
                questions[i];


            console.log(
                `\n========== QUESTION ${i + 1} ==========`
            );


            console.log(
                "Raw item:"
            );


            console.dir(

                item,

                {
                    depth: null
                }

            );


            // ==========================================
            // EXTRACT QUESTION
            // ==========================================

            let questionText = "";
            let answerText = "";


            if (
                typeof item.question ===
                "string"
            ) {

                questionText =
                    item.question;

            }

            else if (
                item.question &&
                typeof item.question ===
                "object"
            ) {

                questionText =

                    item.question.question ||

                    item.question.text ||

                    item.question.question_text ||

                    item.question.content ||

                    item.question.title ||

                    "";

            }


            if (
                !questionText &&
                typeof item.text ===
                "string"
            ) {

                questionText =
                    item.text;

            }


            if (
                !questionText &&
                typeof item.question_text ===
                "string"
            ) {

                questionText =
                    item.question_text;

            }


            // ==========================================
            // EXTRACT ANSWER
            // ==========================================

            if (
                typeof item.answer ===
                "string"
            ) {

                answerText =
                    item.answer;

            }

            else if (
                item.answer &&
                typeof item.answer ===
                "object"
            ) {

                answerText =

                    item.answer.answer ||

                    item.answer.text ||

                    item.answer.content ||

                    "";

            }


            // ==========================================
            // CLEAN
            // ==========================================

            questionText =
                String(
                    questionText || ""
                ).trim();


            answerText =
                String(
                    answerText || ""
                ).trim();


            console.log(
                "Final Question:",
                questionText
            );

            console.log(
                "Final Answer:",
                answerText
            );


            // ==========================================
            // INVALID QUESTION
            // ==========================================

            if (!questionText) {

                console.error(
                    `Question ${i + 1} does not contain valid text.`
                );


                return res.status(400).json({

                    success: false,

                    message:
                        `Question ${i + 1} does not contain valid question text.`

                });

            }


            // ==========================================
            // INSERT
            // ==========================================

            await new Promise(

                (resolve, reject) => {

                    db.query(

                        `INSERT INTO technical_questions
                        (
                            resume_id,
                            question,
                            answer
                        )
                        VALUES (?, ?, ?)`,

                        [
                            resume_id,
                            questionText,
                            answerText
                        ],

                        (err, result) => {

                            if (err) {

                                console.error(
                                    "MYSQL INSERT ERROR:"
                                );

                                console.error(
                                    err
                                );

                                reject(
                                    err
                                );

                            }

                            else {

                                console.log(
                                    "Inserted Question ID:",
                                    result.insertId
                                );

                                resolve();

                            }

                        }

                    );

                }

            );

        }


        // ==========================================
        // UPDATE STATUS
        // Interviewing → Completed
        // ==========================================

        await new Promise(

            (resolve, reject) => {

                db.query(

                    `UPDATE resumes
                     SET status = ?
                     WHERE resume_id = ?
                     AND status != 'Completed'`,

                    [
                        "Completed",
                        resume_id
                    ],

                    (err, result) => {

                        if (err) {

                            console.error(
                                "RESUME STATUS UPDATE ERROR:"
                            );

                            console.error(
                                err
                            );

                            reject(
                                err
                            );

                        }

                        else {

                            console.log(
                                "Resume status updated:",
                                result.affectedRows
                            );

                            resolve();

                        }

                    }

                );

            }

        );


        // ==========================================
// AI RESUME EVALUATION
// ==========================================

try {

    console.log("Starting AI Resume Evaluation...");

    await evaluateCandidate(resume_id);

    console.log("AI Resume Evaluation Completed.");

} catch (error) {

    console.error("AI Resume Evaluation Failed:", error.message);

    // Don't stop interview submission if AI fails
}


        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({

            success: true,

            message:
                "Interview Submitted Successfully"

        });

    }

    catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "SUBMIT ANSWERS ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "SQL Message:",
            error.sqlMessage
        );

        console.error(
            "SQL Code:",
            error.code
        );

        console.error(
            "================================="
        );


        return res.status(500).json({

            success: false,

            message:
                error.sqlMessage ||
                error.message ||
                "Failed to Save Answers"

        });

    }

};



/* ===========================================
   ABANDON INTERVIEW
=========================================== */

const abandonInterview = async (req, res) => {

    try {

        const {
            resume_id
        } = req.body;


        console.log(
            "================================="
        );

        console.log(
            "ABANDON INTERVIEW"
        );

        console.log(
            "Resume ID:",
            resume_id
        );

        console.log(
            "================================="
        );


        // ==========================================
        // VALIDATE
        // ==========================================

        if (!resume_id) {

            return res.status(400).json({

                success: false,

                message:
                    "resume_id is required."

            });

        }


        // ==========================================
        // CHECK APPLICATION
        // ==========================================

        db.query(

            `SELECT
                resume_id,
                status
             FROM resumes
             WHERE resume_id = ?
             LIMIT 1`,

            [resume_id],

            (checkErr, result) => {

                if (checkErr) {

                    console.error(
                        "Abandon check error:",
                        checkErr
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Failed to check application."

                    });

                }


                // ==========================================
                // NOT FOUND
                // ==========================================

                if (
                    result.length === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Application not found."

                    });

                }


                const status =
                    result[0].status;


                // ==========================================
                // NEVER DELETE COMPLETED APPLICATION
                // ==========================================

                if (
                    status ===
                    "Completed"
                ) {

                    return res.status(409).json({

                        success: false,

                        message:
                            "Completed application cannot be deleted."

                    });

                }


                // ==========================================
                // DELETE APPLICATION
                // ==========================================

                db.query(

                    `DELETE FROM resumes
                     WHERE resume_id = ?
                     AND status != 'Completed'`,

                    [resume_id],

                    (deleteErr, deleteResult) => {

                        if (deleteErr) {

                            console.error(
                                "Abandon delete error:",
                                deleteErr
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Failed to delete application."

                            });

                        }


                        console.log(
                            "Application deleted."
                        );

                        console.log(
                            "Deleted rows:",
                            deleteResult.affectedRows
                        );


                        return res.status(200).json({

                            success: true,

                            resumeDeleted:
                                deleteResult.affectedRows > 0,

                            message:
                                "Interview abandoned and application removed."

                        });

                    }

                );

            }

        );

    }

    catch (error) {

        console.error(
            "Abandon Interview Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};



/* ===========================================
   EXPORT
=========================================== */

module.exports = {

    applyJob,

    getAppliedJobs,

    generateQuestions,

    submitAnswers,

    abandonInterview

};