const db = require("../config/db");
const axios = require("axios");


// ============================================================
// FASTAPI URL
// ============================================================

const AI_API_URL = "http://127.0.0.1:8000/generate_report";


// ============================================================
// GENERATE TRUST REPORT
// ============================================================

const generateTrustReport = async (req, res) => {

   const { resumeId } = req.params;

const resume_id = resumeId;


    console.log("\n");
    console.log("==========================================");
    console.log("TRUSTHIRE AI REPORT GENERATION");
    console.log("==========================================");

    console.log(
        "Resume ID:",
        resumeId
    );


    // ========================================================
    // VALIDATE RESUME ID
    // ========================================================

    if (!resumeId) {

        return res.status(400).json({

            success: false,

            message: "Resume ID is required."

        });

    }


    try {

        // ====================================================
        // STEP 1
        // GET RESUME + CANDIDATE + JOB
        // ====================================================

        const resumeSql = `

            SELECT

                r.resume_id,

                r.candidate_id,

                r.job_id,

                r.resume_name,

                r.resume_file

            FROM resumes r

            WHERE r.resume_id = ?

            LIMIT 1

        `;


        const resumeResult = await new Promise(
            (resolve, reject) => {

                db.query(
                    resumeSql,
                    [resume_id],
                    (error, result) => {

                        if (error) {

                            reject(error);

                        } else {

                            resolve(result);

                        }

                    }
                );

            }
        );


        // ====================================================
        // RESUME NOT FOUND
        // ====================================================

        if (
            !resumeResult ||
            resumeResult.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message: "Resume not found."

            });

        }


        const resume = resumeResult[0];


        console.log(
            "Candidate ID:",
            resume.candidate_id
        );

        console.log(
            "Job ID:",
            resume.job_id
        );


        // ====================================================
        // STEP 2
        // GET JOB INFORMATION
        // ====================================================

        const jobSql = `

            SELECT

                job_id,

                job_title,

                company_name,

                job_description

            FROM job_postS

            WHERE job_id = ?

            LIMIT 1

        `;


        const jobResult = await new Promise(
            (resolve, reject) => {

                db.query(
                    jobSql,
                    [resume.job_id],
                    (error, result) => {

                        if (error) {

                            reject(error);

                        } else {

                            resolve(result);

                        }

                    }
                );

            }
        );


        // ====================================================
        // JOB NOT FOUND
        // ====================================================

        if (
            !jobResult ||
            jobResult.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message: "Job post not found."

            });

        }


        const job = jobResult[0];


        console.log(
            "Job Title:",
            job.job_title
        );

        console.log(
            "Company:",
            job.company_name
        );


        // ====================================================
        // STEP 3
        // GET TECHNICAL QUESTIONS + ANSWERS
        // ====================================================

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


        const questions = await new Promise(
            (resolve, reject) => {

                db.query(
                    questionSql,
                    [resume_id],
                    (error, result) => {

                        if (error) {

                            reject(error);

                        } else {

                            resolve(result || []);

                        }

                    }
                );

            }
        );


        console.log(
            "Technical Questions:",
            questions.length
        );


        // ====================================================
        // STEP 4
        // CHECK RESUME FILE
        // ====================================================

        if (!resume.resume_file) {

            return res.status(400).json({

                success: false,

                message:
                    "Resume file is not available."

            });

        }


        // ====================================================
        // IMPORTANT
        //
        // FastAPI currently expects a FILE PATH.
        //
        // Therefore save the BLOB temporarily.
        // ====================================================

        const fs = require("fs");
        const path = require("path");


        const tempDirectory = path.join(
            __dirname,
            "..",
            "temp"
        );


        // Create temp directory if needed

        if (!fs.existsSync(tempDirectory)) {

            fs.mkdirSync(
                tempDirectory,
                {
                    recursive: true
                }
            );

        }


        const pdfPath = path.join(

            tempDirectory,

            `${resume.resume_id}_ai_evaluation.pdf`

        );


        fs.writeFileSync(

            pdfPath,

            resume.resume_file

        );


        console.log(
            "Temporary PDF:",
            pdfPath
        );


        // ====================================================
        // STEP 5
        // SEND DATA TO FASTAPI
        // ====================================================

        console.log("\n");
        console.log(
            "Sending candidate data to FastAPI..."
        );

        console.log(
            "FastAPI URL:",
            AI_API_URL
        );


        let aiResponse;


        try {

        aiResponse = await axios.post(
    AI_API_URL,
    {
        resume_path: pdfPath,
        job_description: job.job_description || "",
        questions: questions.map(item => ({
            question: item.question || "",
            answer: item.answer || ""
        })),
        reference_text: ""
    }
);

console.log("==================================");
console.log("FLASK RESPONSE");
console.log(aiResponse.data);
console.log("==================================");

        } catch (aiError) {

            console.error("\n");
            console.error(
                "=========================================="
            );

            console.error(
                "FASTAPI ERROR"
            );

            console.error(
                "Message:",
                aiError.message
            );

            console.error(
                "Status:",
                aiError.response?.status
            );

            console.error(
                "Response:",
                aiError.response?.data
            );

            console.error(
                "=========================================="
            );


            // Delete temporary file

            if (fs.existsSync(pdfPath)) {

                fs.unlinkSync(pdfPath);

            }


            return res.status(503).json({

                success: false,

                message:
                    "AI evaluation service is unavailable.",

                error:
                    aiError.response?.data ||
                    aiError.message

            });

        }


        // ====================================================
        // DELETE TEMPORARY PDF
        // ====================================================

        if (fs.existsSync(pdfPath)) {

            fs.unlinkSync(pdfPath);

        }


        // ====================================================
        // STEP 6
        // GET AI RESULT
        // ====================================================

       const result = aiResponse.data;

if (!result || !result.success) {

    return res.status(500).json({

        success: false,

        message: result?.message || "AI service returned an error."

    });

}


        console.log("\n");
        console.log(
            "=========================================="
        );

        console.log(
            "AI RESULT"
        );

        console.log(
            "ATS Score:",
            result.ats_score
        );

        console.log(
            "Trust Score:",
            result.trust_score
        );

        console.log(
            "Fraud Score:",
            result.fraud_score
        );

        console.log(
            "Plagiarism Score:",
            result.plagiarism_score
        );

        console.log(
            "Recommendation:",
            result.recommendation
        );

        console.log(
            "=========================================="
        );


        // ====================================================
        // STEP 7
        // SAVE REPORT TO MYSQL
        // ====================================================

        const insertReportSql = `

            INSERT INTO trust_reports (

                candidate_id,

                resume_id,

                ats_score,

                trust_score,

                fraud_score,

                plagiarism_score,

                recommendation

            )

            VALUES (?, ?, ?, ?, ?, ?, ?)

        `;


        const reportResult = await new Promise(
            (resolve, reject) => {

                db.query(

                    insertReportSql,

                    [

                        resume.candidate_id,

                        resume.resume_id,

                        result.ats_score,

                        result.trust_score,

                        result.fraud_score,

                        result.plagiarism_score,

                        result.recommendation

                    ],

                    (error, dbResult) => {

                        if (error) {

                            reject(error);

                        } else {

                            resolve(dbResult);

                        }

                    }

                );

            }
        );


        // ====================================================
        // STEP 8
        // FINAL RESPONSE
        // ====================================================

        console.log("\n");
        console.log(
            "=========================================="
        );

        console.log(
            "TRUST REPORT SAVED"
        );

        console.log(
            "Report ID:",
            reportResult.insertId
        );

        console.log(
            "=========================================="
        );


        return res.status(201).json({

            success: true,

            message:
                "AI evaluation completed and trust report generated.",

            report_id:
                reportResult.insertId,

            candidate_id:
                resume.candidate_id,

            resume_id:
                resume.resume_id,

            job_id:
                resume.job_id,

            job_title:
                job.job_title,

            company_name:
                job.company_name,

            ats_score:
                result.ats_score,

            trust_score:
                result.trust_score,

            fraud_score:
                result.fraud_score,

            plagiarism_score:
                result.plagiarism_score,

            recommendation:
                result.recommendation,

            technical_score:
                result.technical_score,

            matched_skills:
                result.matched_skills,

            missing_skills:
                result.missing_skills,

            ats_details:
                result.ats_details,

            plagiarism_details:
                result.plagiarism_details,

            fraud_details:
                result.fraud_details

        });

    } catch (error) {

        console.error("\n");
        console.error(
            "=========================================="
        );

        console.error(
            "TRUST REPORT ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "=========================================="
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to generate trust report.",

            error:
                error.message

        });

    }

};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    generateTrustReport

};