
const db = require("../config/db");

/*
===========================================================
 TRUSTHIRE AI
 HR REPORTS CONTROLLER
===========================================================

 Database tables used:

 candidates
 job_posts
 resumes
 resume_evaluation

 Main report endpoint:

 GET /api/reports

 Optional query parameters:

 ?range=all
 ?range=today
 ?range=week
 ?range=month
 ?range=3months
 ?range=year

 ?job_id=5

 Examples:

 /api/reports
 /api/reports?range=month
 /api/reports?range=3months&job_id=5
===========================================================
*/


// ==========================================================
// HELPER: MYSQL QUERY
// ==========================================================

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(results);
    });
  });
};


// ==========================================================
// HELPER: DATE FILTER
// ==========================================================

const getDateFilter = (range) => {

  switch (range) {

    case "today":
      return `
        DATE(re.created_at) = CURDATE()
      `;

    case "week":
      return `
        re.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `;

    case "month":
      return `
        re.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `;

    case "3months":
      return `
        re.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      `;

    case "year":
      return `
        re.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
      `;

    case "all":
    default:
      return "1 = 1";
  }
};


// ==========================================================
// HELPER: RESUME DATE FILTER
// ==========================================================

const getResumeDateFilter = (range) => {

  switch (range) {

    case "today":
      return `
        DATE(r.upload_date) = CURDATE()
      `;

    case "week":
      return `
        r.upload_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `;

    case "month":
      return `
        r.upload_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `;

    case "3months":
      return `
        r.upload_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      `;

    case "year":
      return `
        r.upload_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
      `;

    case "all":
    default:
      return "1 = 1";
  }
};


// ==========================================================
// HELPER: SAFE NUMBER
// ==========================================================

const number = (value) => {

  const n = Number(value);

  if (Number.isNaN(n)) {
    return 0;
  }

  return Number(n.toFixed(2));
};


// ==========================================================
// HELPER: PARSE JSON SKILLS
// ==========================================================

const parseSkills = (value) => {

  if (!value) {
    return [];
  }

  try {

    const parsed =
      typeof value === "string"
        ? JSON.parse(value)
        : value;

    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [];

  } catch (error) {

    console.log(
      "Skill JSON parse error:",
      error.message
    );

    return [];
  }
};


// ==========================================================
// HELPER: NORMALIZE SKILL
// ==========================================================

const normalizeSkill = (skill) => {

  return String(skill || "")
    .trim()
    .toLowerCase();
};


// ==========================================================
// MAIN REPORT CONTROLLER
// ==========================================================

const getReports = async (req, res) => {

  try {

    console.log(
      "=========================================="
    );

    console.log(
      "TRUSTHIRE AI REPORTS REQUEST"
    );

    console.log(
      "=========================================="
    );


    // ======================================================
    // QUERY PARAMETERS
    // ======================================================

    const range =
      req.query.range || "all";

    const jobId =
      req.query.job_id || null;


    console.log(
      "Report Range:",
      range
    );

    console.log(
      "Job ID:",
      jobId || "ALL"
    );


    // ======================================================
    // DATE FILTERS
    // ======================================================

    const evaluationDateFilter =
      getDateFilter(range);

    const resumeDateFilter =
      getResumeDateFilter(range);


    // ======================================================
    // JOB FILTER
    // ======================================================

    let jobFilterEvaluation = "";
    let jobFilterResume = "";

    const evaluationParams = [];
    const resumeParams = [];

    if (jobId) {

      jobFilterEvaluation =
        " AND r.job_id = ? ";

      evaluationParams.push(jobId);

      jobFilterResume =
        " AND r.job_id = ? ";

      resumeParams.push(jobId);
    }


    // ======================================================
    // 1. SUMMARY
    // ======================================================

    const candidateResult = await query(`
      SELECT COUNT(*) AS total
      FROM candidates
    `);


    const jobResult = await query(`
      SELECT COUNT(*) AS total
      FROM job_posts
    `);


    const applicationResult = await query(
      `
      SELECT COUNT(*) AS total
      FROM resumes r
      WHERE ${resumeDateFilter}
      ${jobFilterResume}
      `,
      resumeParams
    );


    const evaluationResult = await query(
      `
      SELECT COUNT(*) AS total
      FROM resume_evaluation re
      INNER JOIN resumes r
        ON r.resume_id = re.resume_id
      WHERE ${evaluationDateFilter}
      ${jobFilterEvaluation}
      `,
      evaluationParams
    );


    const averageResult = await query(
      `
      SELECT
        AVG(re.ats_score) AS avg_ats,
        AVG(re.skill_score) AS avg_skill,
        AVG(re.trust_score) AS avg_trust,
        AVG(re.fraud_score) AS avg_fraud,
        AVG(re.plagiarism_score) AS avg_plagiarism

      FROM resume_evaluation re

      INNER JOIN resumes r
        ON r.resume_id = re.resume_id

      WHERE ${evaluationDateFilter}
      ${jobFilterEvaluation}
      `,
      evaluationParams
    );


    // ======================================================
    // 2. JOB STATUS
    // ======================================================

    const jobStatusResult = await query(`
      SELECT
        SUM(
          CASE
            WHEN status = 'Open'
            THEN 1
            ELSE 0
          END
        ) AS open_jobs,

        SUM(
          CASE
            WHEN status = 'Closed'
            THEN 1
            ELSE 0
          END
        ) AS closed_jobs

      FROM job_posts
    `);


    // ======================================================
    // 3. APPLICATIONS BY MONTH
    // ======================================================

    const applicationsByMonthResult =
      await query(
        `
        SELECT

          DATE_FORMAT(
            r.upload_date,
            '%b %Y'
          ) AS month,

          DATE_FORMAT(
            r.upload_date,
            '%Y-%m'
          ) AS month_key,

          COUNT(*) AS applications

        FROM resumes r

        WHERE ${resumeDateFilter}
        ${jobFilterResume}

        GROUP BY
          DATE_FORMAT(
            r.upload_date,
            '%Y-%m'
          )

        ORDER BY month_key ASC
        `,
        resumeParams
      );


    // ======================================================
    // 4. JOB PERFORMANCE
    // ======================================================

    const jobPerformanceParams = [];

    let jobPerformanceFilter = "";

    if (jobId) {

      jobPerformanceFilter =
        " WHERE jp.job_id = ? ";

      jobPerformanceParams.push(jobId);
    }


    const jobPerformanceResult =
      await query(
        `
        SELECT

          jp.job_id,

          jp.job_title,

          jp.company_name,

          jp.status,

          jp.last_date,

          COUNT(
            DISTINCT r.resume_id
          ) AS applications,

          COUNT(
            DISTINCT re.evaluation_id
          ) AS evaluations,

          COALESCE(
            AVG(re.ats_score),
            0
          ) AS avg_ats,

          COALESCE(
            AVG(re.trust_score),
            0
          ) AS avg_trust,

          COALESCE(
            AVG(re.skill_score),
            0
          ) AS avg_skill,

          COALESCE(
            AVG(re.fraud_score),
            0
          ) AS avg_fraud,

          COALESCE(
            AVG(re.plagiarism_score),
            0
          ) AS avg_plagiarism,

          SUM(
            CASE
              WHEN re.recommendation IN (
                'Strongly Recommended',
                'Recommended'
              )
              THEN 1
              ELSE 0
            END
          ) AS recommended

        FROM job_posts jp

        LEFT JOIN resumes r
          ON r.job_id = jp.job_id

        LEFT JOIN resume_evaluation re
          ON re.resume_id = r.resume_id

        ${jobPerformanceFilter}

        GROUP BY
          jp.job_id,
          jp.job_title,
          jp.company_name,
          jp.status,
          jp.last_date

        ORDER BY applications DESC
        `,
        jobPerformanceParams
      );


    // ======================================================
    // 5. AI RECOMMENDATIONS
    // ======================================================

    const recommendationResult =
      await query(
        `
        SELECT

          SUM(
            CASE
              WHEN re.recommendation IN (
                'Strongly Recommended',
                'Recommended'
              )
              THEN 1
              ELSE 0
            END
          ) AS recommended,

          SUM(
            CASE
              WHEN re.recommendation = 'Consider'
              THEN 1
              ELSE 0
            END
          ) AS review,

          SUM(
            CASE
              WHEN re.recommendation = 'Rejected'
              THEN 1
              ELSE 0
            END
          ) AS rejected

        FROM resume_evaluation re

        INNER JOIN resumes r
          ON r.resume_id = re.resume_id

        WHERE ${evaluationDateFilter}
        ${jobFilterEvaluation}
        `,
        evaluationParams
      );


    // ======================================================
    // 6. CANDIDATE AI EVALUATIONS
    // ======================================================

    const candidateEvaluationParams = [];

    let candidateEvaluationFilter =
      ` WHERE ${evaluationDateFilter} `;

    if (jobId) {

      candidateEvaluationFilter +=
        " AND r.job_id = ? ";

      candidateEvaluationParams.push(
        jobId
      );
    }


    const candidateEvaluationResult =
      await query(
        `
        SELECT

          re.evaluation_id,

          re.candidate_id,

          re.resume_id,

          CONCAT(
            c.first_name,
            ' ',
            c.last_name
          ) AS full_name,

          c.email,

          jp.job_title,

          jp.company_name,

          re.ats_score,

          re.skill_score,

          re.trust_score,

          re.fraud_score,

          re.plagiarism_score,

          re.plagiarism_prediction,

          re.plagiarism_confidence,

          re.recommendation,

          re.created_at

        FROM resume_evaluation re

        INNER JOIN candidates c
          ON c.candidate_id =
             re.candidate_id

        INNER JOIN resumes r
          ON r.resume_id =
             re.resume_id

        INNER JOIN job_posts jp
          ON jp.job_id =
             r.job_id

        ${candidateEvaluationFilter}

        ORDER BY
          re.created_at DESC
        `,
        candidateEvaluationParams
      );


    // ======================================================
    // 7. SKILL DATA
    // ======================================================

    const skillParams = [];

    let skillFilter =
      ` WHERE ${evaluationDateFilter} `;

    if (jobId) {

      skillFilter +=
        " AND r.job_id = ? ";

      skillParams.push(jobId);
    }


    const skillResult =
      await query(
        `
        SELECT

          re.matched_skills,

          re.missing_skills,

          re.resume_skills

        FROM resume_evaluation re

        INNER JOIN resumes r
          ON r.resume_id =
             re.resume_id

        ${skillFilter}
        `,
        skillParams
      );


    // ======================================================
    // 8. PROCESS MATCHED SKILLS
    // ======================================================

    const matchedSkillCounts = {};


    const missingSkillCounts = {};


    skillResult.forEach((row) => {

      const matched =
        parseSkills(
          row.matched_skills
        );


      const missing =
        parseSkills(
          row.missing_skills
        );


      // -----------------------------------------------
      // MATCHED
      // -----------------------------------------------

      matched.forEach((skill) => {

        const normalized =
          normalizeSkill(skill);

        if (!normalized) {
          return;
        }

        matchedSkillCounts[normalized] =
          (matchedSkillCounts[normalized] || 0) +
          1;
      });


      // -----------------------------------------------
      // MISSING
      // -----------------------------------------------

      missing.forEach((skill) => {

        const normalized =
          normalizeSkill(skill);

        if (!normalized) {
          return;
        }

        missingSkillCounts[normalized] =
          (missingSkillCounts[normalized] || 0) +
          1;
      });

    });


    // ======================================================
    // 9. CONVERT SKILLS TO SORTED ARRAYS
    // ======================================================

    const matchedSkills =
      Object.entries(
        matchedSkillCounts
      )
        .map(
          ([skill, count]) => ({
            skill,
            count,
          })
        )
        .sort(
          (a, b) =>
            b.count - a.count
        )
        .slice(0, 10);


    const missingSkills =
      Object.entries(
        missingSkillCounts
      )
        .map(
          ([skill, count]) => ({
            skill,
            count,
          })
        )
        .sort(
          (a, b) =>
            b.count - a.count
        )
        .slice(0, 10);


    // ======================================================
    // 10. CLEAN SUMMARY
    // ======================================================

    const averages =
      averageResult[0] || {};


    const jobStatus =
      jobStatusResult[0] || {};


    const recommendations =
      recommendationResult[0] || {};


    const summary = {

      candidates:
        Number(
          candidateResult[0]?.total || 0
        ),

      jobs:
        Number(
          jobResult[0]?.total || 0
        ),

      applications:
        Number(
          applicationResult[0]?.total || 0
        ),

      evaluations:
        Number(
          evaluationResult[0]?.total || 0
        ),

      avgTrust:
        number(
          averages.avg_trust
        ),

    };


    // ======================================================
    // 11. AI SCORES
    // ======================================================

    const aiScores = {

      ats:
        number(
          averages.avg_ats
        ),

      skill:
        number(
          averages.avg_skill
        ),

      trust:
        number(
          averages.avg_trust
        ),

      fraud:
        number(
          averages.avg_fraud
        ),

      plagiarism:
        number(
          averages.avg_plagiarism
        ),

    };


    // ======================================================
    // 12. JOB STATUS
    // ======================================================

    const jobStatusData = {

      open:
        Number(
          jobStatus.open_jobs || 0
        ),

      closed:
        Number(
          jobStatus.closed_jobs || 0
        ),

    };


    // ======================================================
    // 13. RECOMMENDATIONS
    // ======================================================

    const recommendationData = {

      recommended:
        Number(
          recommendations.recommended || 0
        ),

      consider:
        Number(
          recommendations.review || 0
        ),

      review:
        Number(
          recommendations.review || 0
        ),

      rejected:
        Number(
          recommendations.rejected || 0
        ),

    };


    /*
      IMPORTANT:

      Your database has:

      Strongly Recommended
      Recommended
      Consider
      Rejected

      The existing Reports frontend was designed around:

      Recommended
      Consider
      Review
      Rejected

      Therefore:

      Strongly Recommended + Recommended
        → recommended

      Consider
        → consider/review
    */


    // ======================================================
    // 14. FORMAT JOB PERFORMANCE
    // ======================================================

    const jobPerformance =
      jobPerformanceResult.map(
        (job) => ({

          job_id:
            job.job_id,

          job_title:
            job.job_title,

          company_name:
            job.company_name,

          status:
            job.status,

          last_date:
            job.last_date,

          applications:
            Number(
              job.applications || 0
            ),

          evaluations:
            Number(
              job.evaluations || 0
            ),

          avg_ats:
            number(
              job.avg_ats
            ),

          avg_skill:
            number(
              job.avg_skill
            ),

          avg_trust:
            number(
              job.avg_trust
            ),

          avg_fraud:
            number(
              job.avg_fraud
            ),

          avg_plagiarism:
            number(
              job.avg_plagiarism
            ),

          recommended:
            Number(
              job.recommended || 0
            ),

        })
      );


    // ======================================================
    // 15. FORMAT CANDIDATE EVALUATIONS
    // ======================================================

    const candidateEvaluations =
      candidateEvaluationResult.map(
        (candidate) => ({

          evaluation_id:
            candidate.evaluation_id,

          candidate_id:
            candidate.candidate_id,

          resume_id:
            candidate.resume_id,

          full_name:
            candidate.full_name,

          email:
            candidate.email,

          job_title:
            candidate.job_title,

          company_name:
            candidate.company_name,

          ats_score:
            number(
              candidate.ats_score
            ),

          skill_score:
            number(
              candidate.skill_score
            ),

          trust_score:
            number(
              candidate.trust_score
            ),

          fraud_score:
            number(
              candidate.fraud_score
            ),

          plagiarism_score:
            number(
              candidate.plagiarism_score
            ),

          plagiarism_prediction:
            candidate.plagiarism_prediction,

          plagiarism_confidence:
            number(
              candidate.plagiarism_confidence
            ),

          recommendation:
            candidate.recommendation,

          created_at:
            candidate.created_at,

        })
      );


    // ======================================================
    // 16. FINAL RESPONSE
    // ======================================================

    const response = {

      success: true,

      filters: {
        range,
        job_id: jobId,
      },

      summary,

      applicationsByMonth:
        applicationsByMonthResult.map(
          (item) => ({

            month:
              item.month,

            month_key:
              item.month_key,

            applications:
              Number(
                item.applications || 0
              ),

          })
        ),

      jobStatus:
        jobStatusData,

      aiScores,

      recommendations:
        recommendationData,

      jobPerformance,

      candidateEvaluations,

      matchedSkills,

      missingSkills,

    };


    console.log(
      "Reports generated successfully"
    );


    return res.status(200).json(
      response
    );


  } catch (error) {

    console.error(
      "=========================================="
    );

    console.error(
      "REPORTS CONTROLLER ERROR"
    );

    console.error(
      error
    );

    console.error(
      "=========================================="
    );


    return res.status(500).json({

      success: false,

      message:
        "Failed to generate HR reports",

      error:
        error.message,

    });

  }

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {
  getReports,
};

