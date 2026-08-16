const db = require("../config/db");

exports.getAllJobs = (req, res) => {

    const sql = `
        SELECT
            job_id,
            company_name,
            job_title,
            job_description,
            job_pdf,
            last_date,
            pdf_name,
            status,
            created_at
        FROM job_posts
        WHERE status='Open'
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }

        res.status(200).json(result);

    });

};

exports.getJobById = (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT * FROM job_posts WHERE job_id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Job Not Found"
                });
            }

            res.json(result[0]);

        }
    );

};

exports.generateJobPDF = (req, res) => {
    const { id } = req.params;

    db.query(
        "SELECT job_pdf, pdf_name FROM job_posts WHERE job_id = ?",
        [id],
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
                    message: "PDF not found"
                });
            }

            const pdf = result[0].job_pdf;
            const pdfName = result[0].pdf_name || "JobDescription.pdf";

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${pdfName}"`
            );

            res.send(pdf);
        }
    );
};

