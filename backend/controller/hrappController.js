const db = require("../config/db");


// ===============================
// Get All Job Posts
// ===============================
const getAllJobs = (req, res) => {

    const sql = `
        SELECT
            job_id,
            company_name,
            job_title,
            status,
            created_at
        FROM job_posts
        ORDER BY created_at DESC
    `;


    db.query(sql, (err, results) => {


        if (err) {

            console.error("Database Error:", err);

            return res.status(500).json({

                success: false,

                message: "Failed to fetch job posts"

            });

        }


        res.status(200).json(results);


    });

};




// ===============================
// Get Applications By Job ID
// ===============================
const getJobApplications = (req, res) => {


    const { jobId } = req.params;



   const sql = `

SELECT

    r.resume_id,
    r.candidate_id,
    r.job_id,
    r.full_name,
    r.email,
    r.mobile,
    r.experience,
    r.location,
    r.resume_name,
    r.resume_file,
    r.status,
    r.upload_date,

    j.company_name,
    j.job_title,
    j.pdf_name,

    e.ats_score,
    e.skill_score,
    e.trust_score,
    e.fraud_score,
    e.plagiarism_score,
    e.plagiarism_prediction,
    e.plagiarism_confidence,
    e.recommendation,
    e.matched_skills,
    e.missing_skills,
    e.resume_skills,
    e.shap_json

FROM resumes r

INNER JOIN job_posts j
ON r.job_id = j.job_id

LEFT JOIN resume_evaluation e
ON r.resume_id = e.resume_id

WHERE r.job_id = ?

ORDER BY r.upload_date DESC

`;



    db.query(sql, [jobId], (err, results) => {



        if (err) {


            console.error("Database Error:", err);



            return res.status(500).json({

                success:false,

                message:"Failed to fetch applications"

            });


        }



        res.status(200).json(results);



    });


};



// ===============================
// Update Application Status
// ===============================
const updateApplicationStatus = (req, res) => {

    const { resumeId } = req.params;
    const { status } = req.body;

    console.log("UPDATE STATUS");
    console.log("Resume ID:", resumeId);
    console.log("New Status:", status);

    const allowedStatuses = [
        "Downloaded",
        "Under Review",
        "Reviewed - Will Get a Mail"
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid application status"
        });

    }

    const sql = `
        UPDATE resumes
        SET status = ?
        WHERE resume_id = ?
    `;

    db.query(
        sql,
        [status, resumeId],
        (err, result) => {

            if (err) {

                console.error(
                    "UPDATE APPLICATION STATUS ERROR:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to update application status",
                    error: err.message
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Application not found"
                });

            }

            console.log(
                `Resume ${resumeId} status updated to ${status}`
            );

            return res.status(200).json({
                success: true,
                message: "Application status updated successfully",
                status: status
            });

        }
    );
};



// ===============================
// View Resume PDF
// ===============================
// ===============================
// View Resume PDF
// ===============================
const viewResumePDF = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            resume_file,
            resume_name
        FROM resumes
        WHERE resume_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Resume not found"
            });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="${result[0].resume_name || "resume.pdf"}"`
        );

        res.send(result[0].resume_file);

    });

};


// ===============================
// Get Technical Interview
// ===============================
const getTechnicalInterview = (req, res) => {

    const { resumeId } = req.params;

    const sql = `
        SELECT
            question,
            answer
        FROM technical_questions
        WHERE resume_id = ?
        
    `;

    db.query(sql, [resumeId], (err, results) => {

        if (err) {

            console.error("Database Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch technical interview"
            });

        }

        res.status(200).json(results);

    });

};






module.exports = {

    getAllJobs,

    getJobApplications,

    viewResumePDF,

    getTechnicalInterview,

    updateApplicationStatus

};