const db = require("../config/db");

exports.getDashboard = (req, res) => {

    const dashboard = {};

    // ===========================
    // Total HR
    // ===========================

    db.query(
        "SELECT COUNT(*) AS totalHR FROM hr",
        (err, hrResult) => {

            if (err)
                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            dashboard.totalHR = hrResult[0].totalHR;

            // ===========================
            // Total Candidates
            // ===========================

            db.query(
                "SELECT COUNT(*) AS totalCandidates FROM candidates",
                (err, candidateResult) => {

                    if (err)
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });

                    dashboard.totalCandidates =
                        candidateResult[0].totalCandidates;

                    // ===========================
                    // Verified Candidates
                    // ===========================

                    db.query(
                        "SELECT COUNT(*) AS verifiedCandidates FROM candidates WHERE status='Verified'",
                        (err, verifiedResult) => {

                            if (err)
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });

                            dashboard.verifiedCandidates =
                                verifiedResult[0].verifiedCandidates;

                            // ===========================
                            // Total Job Posts
                            // ===========================

                            db.query(
                                "SELECT COUNT(*) AS totalJobs FROM job_posts",
                                (err, jobResult) => {

                                    if (err)
                                        return res.status(500).json({
                                            success: false,
                                            message: err.message
                                        });

                                    dashboard.totalJobs =
                                        jobResult[0].totalJobs;

                                    // ===========================
                                    // HR Chart
                                    // ===========================

                                    db.query(
                                        `
                                        SELECT
                                        SUM(status='active') AS activeHR,
                                        SUM(status='inactive') AS inactiveHR
                                        FROM users
                                        WHERE role='hr'
                                        `,
                                        (err, hrChart) => {

                                            if (err)
                                                return res.status(500).json({
                                                    success: false,
                                                    message: err.message
                                                });

                                            dashboard.hrChart = {

                                                active:
                                                    hrChart[0].activeHR || 0,

                                                inactive:
                                                    hrChart[0].inactiveHR || 0

                                            };

                                            // ===========================
                                            // Candidate Chart
                                            // ===========================

                                            db.query(
                                                `
                                                SELECT
                                                SUM(status='Verified') AS verified,
                                                SUM(status='Pending') AS pending,
                                                SUM(status='Rejected') AS rejected
                                                FROM candidates
                                                `,
                                                (err, candidateChart) => {

                                                    if (err)
                                                        return res.status(500).json({
                                                            success: false,
                                                            message: err.message
                                                        });

                                                    dashboard.candidateChart = {

                                                        verified:
                                                            candidateChart[0].verified || 0,

                                                        pending:
                                                            candidateChart[0].pending || 0,

                                                        rejected:
                                                            candidateChart[0].rejected || 0

                                                    };

                                                    res.json({

                                                        success: true,

                                                        ...dashboard

                                                    });

                                                }

                                            );

                                        }

                                    );

                                }

                            );

                        }

                    );

                }

            );

        }

    );

};