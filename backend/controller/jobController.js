const db = require("../config/db");

// =========================
// CREATE JOB
// =========================

exports.createJob = (req, res) => {

    try {

        const {
            company_name,
            job_title,
            job_description,
             last_date,
            status
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload PDF"
            });
        }

        const sql = `
       INSERT INTO job_posts
(
    company_name,
    job_title,
    job_description,
    job_pdf,
    last_date,
    pdf_name,
    pdf_type,
    pdf_size,
    status
)
VALUES (?,?,?,?,?,?,?,?,?)`;

        db.query(
            sql,
           [
    company_name,
    job_title,
    job_description,
    req.file.buffer,
    last_date,
    req.file.originalname,
    req.file.mimetype,
    req.file.size,
    status
],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json(err);

                }

                res.json({

                    success: true,

                    message: "Job Created Successfully"

                });

            }
        );

    }

    catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

};

// =========================
// GET JOBS
// =========================

exports.getJobs = (req, res) => {

    console.log("GET JOBS CONTROLLER");

    db.query(
        `SELECT
            job_id,
            company_name,
            job_title,
            job_description,
            last_date,
            status,
            created_at
        FROM job_posts`,
        (err, result) => {

            console.log(result);

            res.json(result);
        }
    );
};
// =========================
// VIEW PDF
// =========================

exports.viewPDF = (req, res) => {

    const id = req.params.id;

    db.query(

        "SELECT job_pdf,pdf_type FROM job_posts WHERE job_id=?",

        [id],

        (err, result) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (result.length === 0) {

                return res.status(404).send("PDF Not Found");

            }

            res.setHeader(

                "Content-Type",

                result[0].pdf_type

            );

            res.send(result[0].job_pdf);

        }

    );

};

// =========================
// DELETE JOB
// =========================

exports.deleteJob = (req, res) => {

    const id = req.params.id;

    db.query(

        "DELETE FROM job_posts WHERE job_id=?",

        [id],

        (err) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({

                success: true,

                message: "Job Deleted"

            });

        }

    );

};

// =========================
// UPDATE JOB
// =========================

exports.updateJob = (req, res) => {

    const id = req.params.id;

    const {
        company_name,
        job_title,
        job_description,
         last_date,
        status
    } = req.body;

    // If new PDF uploaded

    if (req.file) {

        const sql = `
        UPDATE job_posts
        SET

        company_name=?,
        job_title=?,
        job_description=?,
        last_date = ?,
        job_pdf=?,
        pdf_name=?,
        pdf_type=?,
        pdf_size=?,
        status=?

        WHERE job_id=?
        `;

        db.query(

            sql,

           [
    company_name,
    job_title,
    job_description,
    last_date,
    req.file.buffer,
    req.file.originalname,
    req.file.mimetype,
    req.file.size,
    status,
    id
],

            (err) => {

                if (err) {

                    return res.status(500).json(err);

                }

                res.json({

                    success: true,

                    message: "Job Updated"

                });

            }

        );

    }

    // Without PDF

    else {

        const sql = `
      UPDATE job_posts
SET
company_name=?,
job_title=?,
job_description=?,
last_date=?,
status=?
WHERE job_id=?`;

        db.query(

            sql,

           [
    company_name,
    job_title,
    job_description,
    last_date,
    status,
    id
],

            (err) => {

                if (err) {

                    return res.status(500).json(err);

                }

                res.json({

                    success: true,

                    message: "Job Updated"

                });

            }

        );

    }

};