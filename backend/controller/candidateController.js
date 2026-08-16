const db = require("../config/db");


// =======================================
// GET CANDIDATE ID BY EMAIL
// =======================================

const getCandidateId = (req, res) => {

    const { email } = req.params;

    const sql = `
        SELECT candidate_id
        FROM candidates
        WHERE email = ?
    `;

    db.query(sql, [email], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Candidate not found"
            });

        }

        return res.json({
            candidate_id: result[0].candidate_id
        });

    });

};


// Export function correctly
exports.getCandidateId = getCandidateId;



// =======================================
// GET ALL CANDIDATES
// =======================================

exports.getCandidates = (req, res) => {

    const sql = `
    SELECT
        candidate_id,
        user_id,
        first_name,
        last_name,
        email,
        mobile,
        dob,
        gender,
       
        created_at,
        job_role,
       
        status
    FROM candidates
    ORDER BY candidate_id DESC
    `;


    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }


        res.json(result);

    });

};



// =======================================
// GET SINGLE CANDIDATE
// =======================================

exports.getCandidate = (req, res) => {

    const id = req.params.id;


    const sql = `
    SELECT
        candidate_id,
        user_id,
        first_name,
        last_name,
        email,
        mobile,
        dob,
        gender,
        created_at,
        job_role,
        status
    FROM candidates
    WHERE candidate_id=?
    `;


    db.query(sql, [id], (err, result) => {


        if (err) {

            console.log(err);

            return res.status(500).json({
                message:"Database Error"
            });

        }


        if (result.length === 0) {

            return res.status(404).json({
                message:"Candidate not found"
            });

        }


        res.json(result[0]);

    });

};






// =======================================
// DELETE CANDIDATE
// =======================================

exports.deleteCandidate = (req,res)=>{


    const id = req.params.id;


    db.query(
        "DELETE FROM candidates WHERE candidate_id=?",
        [id],
        (err)=>{


            if(err){

                console.log(err);

                return res.status(500).json({
                    message:"Database Error"
                });

            }


            res.json({

                success:true,

                message:"Candidate Deleted"

            });


        }
    );


};