import React, { useEffect, useMemo, useState } from "react";
import "./HRReport.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Reports() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reportData, setReportData] = useState({
    summary: {
      candidates: 0,
      jobs: 0,
      applications: 0,
      evaluations: 0,
      avgTrust: 0,
    },

    applicationsByMonth: [],

    jobStatus: {
      open: 0,
      closed: 0,
    },

    aiScores: {
      ats: 0,
      skill: 0,
      trust: 0,
      fraud: 0,
      plagiarism: 0,
    },

    recommendations: {
      recommended: 0,
      consider: 0,
      review: 0,
      rejected: 0,
    },

    jobPerformance: [],

    candidateEvaluations: [],

    matchedSkills: [],

    missingSkills: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [recommendationFilter, setRecommendationFilter] = useState("All");

  const [dateFilter, setDateFilter] = useState("All Time");
  const [jobFilter, setJobFilter] = useState("All Jobs");

  // ============================================================
  // AUTH
  // ============================================================

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const loggedInUser = JSON.parse(
      sessionStorage.getItem("user")
    );

    if (!token || !loggedInUser) {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);
  }, [navigate]);

  // ============================================================
  // FETCH REPORT DATA
  // ============================================================

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/reports"
      );

      if (!response.ok) {
        throw new Error("Unable to load reports");
      }

      const data = await response.json();

      setReportData({
        summary: {
          candidates: data.summary?.candidates || 0,
          jobs: data.summary?.jobs || 0,
          applications: data.summary?.applications || 0,
          evaluations: data.summary?.evaluations || 0,
          avgTrust: data.summary?.avgTrust || 0,
        },

        applicationsByMonth:
          data.applicationsByMonth || [],

        jobStatus: {
          open: data.jobStatus?.open || 0,
          closed: data.jobStatus?.closed || 0,
        },

        aiScores: {
          ats: data.aiScores?.ats || 0,
          skill: data.aiScores?.skill || 0,
          trust: data.aiScores?.trust || 0,
          fraud: data.aiScores?.fraud || 0,
          plagiarism:
            data.aiScores?.plagiarism || 0,
        },

        recommendations: {
          recommended:
            data.recommendations?.recommended || 0,

          consider:
            data.recommendations?.consider || 0,

          review:
            data.recommendations?.review || 0,

          rejected:
            data.recommendations?.rejected || 0,
        },

        jobPerformance:
          data.jobPerformance || [],

        candidateEvaluations:
          data.candidateEvaluations || [],

        matchedSkills:
          data.matchedSkills || [],

        missingSkills:
          data.missingSkills || [],
      });
    } catch (error) {
      console.error("Reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // ============================================================
  // FILTER CANDIDATES
  // ============================================================

  const filteredCandidates = useMemo(() => {
    return reportData.candidateEvaluations.filter(
      (candidate) => {
        const name =
          candidate.full_name ||
          candidate.candidate_name ||
          "";

        const job =
          candidate.job_title || "";

        const recommendation =
          candidate.recommendation || "";

        const search =
          searchTerm.toLowerCase();

        const matchesSearch =
          name.toLowerCase().includes(search) ||
          job.toLowerCase().includes(search);

        const matchesRecommendation =
          recommendationFilter === "All" ||
          recommendation === recommendationFilter;

        return (
          matchesSearch &&
          matchesRecommendation
        );
      }
    );
  }, [
    reportData.candidateEvaluations,
    searchTerm,
    recommendationFilter,
  ]);

  // ============================================================
  // TOTAL JOBS
  // ============================================================

  const totalJobs =
    reportData.jobStatus.open +
    reportData.jobStatus.closed;

  // ============================================================
  // RECOMMENDATION TOTAL
  // ============================================================

  const recommendationTotal =
    reportData.recommendations.recommended +
    reportData.recommendations.consider +
    reportData.recommendations.review +
    reportData.recommendations.rejected;

  // ============================================================
  // SIMPLE BAR WIDTH
  // ============================================================

  const getBarWidth = (value, max) => {
    if (!max || !value) return "0%";

    return `${Math.min(
      (Number(value) / Number(max)) * 100,
      100
    )}%`;
  };

  const maxMatchedSkill =
    Math.max(
      ...reportData.matchedSkills.map(
        (skill) => Number(skill.count || 0)
      ),
      1
    );

  const maxMissingSkill =
    Math.max(
      ...reportData.missingSkills.map(
        (skill) => Number(skill.count || 0)
      ),
      1
    );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="reports-layout">

      {/* ======================================================
          TOP NAVIGATION
      ====================================================== */}

     <header className="hr-top-nav">
    
            <div className="hr-logo">
    
              <img
    
                src={logo}
    
                alt="TrustHire AI"
    
                className="hr-brand-logo"
    
              />
    
            </div>
    
            <nav className="hr-nav-links">
    
             <Link to="/AdminDash" >
                        Dashboard
                      </Link>
                      <Link to="/ManageHR">Manage HR</Link>
                      <Link to="/AdminJobPost" >
                        Job Posts
                      </Link>
                      <Link to="/AdminReports" className="active">Reports</Link>
                        <Link
                to="/login"
                onClick={handleLogout}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Logout
              </Link>
    
            </nav>
    
            <div className="hr-profile">
    
              <div className="hr-avatar">
    
                A
    
              </div>
    
              <div className="hr-profile-info">
    
                <span className="hr-name">
                  Admin
                </span>
    
              </div>
    
            </div>
    
          </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="reports-main">

        {/* HEADER */}
<br></br><br></br><br></br>
        <section className="reports-header">

          <div>
            <h1>
              Reports & Analytics
            </h1>

            <p>
              Complete recruitment and
              AI evaluation overview
            </p>
          </div>

          <div className="reports-controls">

            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
            >
              <option>All Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>

            <select
              value={jobFilter}
              onChange={(e) =>
                setJobFilter(e.target.value)
              }
            >
              <option>All Jobs</option>

              {reportData.jobPerformance.map(
                (job, index) => (
                  <option
                    key={index}
                    value={job.job_title}
                  >
                    {job.job_title}
                  </option>
                )
              )}
            </select>

           

          </div>

        </section>

        {/* ======================================================
            KPI CARDS
        ====================================================== */}

        <section className="kpi-grid">

          <div className="kpi-card">

            <div className="kpi-icon">
              👥
            </div>

            <div>
              <span>Total Candidates</span>

              <h2>
                {reportData.summary.candidates}
              </h2>

              <small>
                Candidates registered
              </small>
            </div>

          </div>

          <div className="kpi-card">

            <div className="kpi-icon">
              💼
            </div>

            <div>
              <span>Total Jobs</span>

              <h2>
                {reportData.summary.jobs}
              </h2>

              <small>
                {reportData.jobStatus.open} currently open
              </small>
            </div>

          </div>

          <div className="kpi-card">

            <div className="kpi-icon">
              📄
            </div>

            <div>
              <span>Applications</span>

              <h2>
                {reportData.summary.applications}
              </h2>

              <small>
                Total applications
              </small>
            </div>

          </div>

          <div className="kpi-card">

            <div className="kpi-icon">
              🤖
            </div>

            <div>
              <span>AI Evaluations</span>

              <h2>
                {reportData.summary.evaluations}
              </h2>

              <small>
                Resumes evaluated
              </small>
            </div>

          </div>

          <div className="kpi-card">

            <div className="kpi-icon">
              🛡️
            </div>

            <div>
              <span>Average Trust</span>

              <h2>
                {Number(
                  reportData.summary.avgTrust
                ).toFixed(1)}
                %
              </h2>

              <small>
                Candidate credibility
              </small>
            </div>

          </div>

        </section>

        {/* ======================================================
            RECRUITMENT + JOB STATUS
        ====================================================== */}

        <section className="two-column">

          {/* APPLICATION CHART */}

          <div className="report-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Recruitment Overview
                </h2>

                <p>
                  Applications over time
                </p>
              </div>

            </div>

            <div className="application-chart">

              {reportData.applicationsByMonth
                .length === 0 ? (

                <div className="empty-chart">
                  No application data
                </div>

              ) : (

                reportData.applicationsByMonth.map(
                  (item, index) => {

                    const max =
                      Math.max(
                        ...reportData
                          .applicationsByMonth
                          .map(
                            (x) =>
                              Number(
                                x.applications ||
                                x.count ||
                                0
                              )
                          ),
                        1
                      );

                    const value =
                      Number(
                        item.applications ||
                        item.count ||
                        0
                      );

                    return (
                      <div
                        className="chart-column"
                        key={index}
                      >

                        <div
                          className="chart-bar"
                          style={{
                            height: `${Math.max(
                              (value / max) *
                                180,
                              5
                            )}px`,
                          }}
                        >
                          <span>
                            {value}
                          </span>
                        </div>

                        <label>
                          {item.month}
                        </label>

                      </div>
                    );
                  }
                )

              )}

            </div>

          </div>

          {/* JOB STATUS */}

          <div className="report-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Job Status
                </h2>

                <p>
                  Current job availability
                </p>
              </div>

            </div>

            <div className="job-status-chart">

              <div
                className="donut"
                style={{
                  background: `conic-gradient(
                    #2563eb 0 ${
                      totalJobs
                        ? (reportData.jobStatus.open /
                            totalJobs) *
                          360
                        : 0
                    }deg,
                    #e5e7eb 0 360deg
                  )`,
                }}
              >
                <div className="donut-inner">
                  <strong>
                    {totalJobs}
                  </strong>

                  <span>
                    Jobs
                  </span>
                </div>
              </div>

              <div className="status-legend">

                <div>
                  <span className="legend-dot open-dot" />
                  <span>Open Jobs</span>
                  <strong>
                    {reportData.jobStatus.open}
                  </strong>
                </div>

                <div>
                  <span className="legend-dot closed-dot" />
                  <span>Closed Jobs</span>
                  <strong>
                    {reportData.jobStatus.closed}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            AI SCORES + RECOMMENDATIONS
        ====================================================== */}

        <section className="two-column">

          {/* AI SCORES */}

          <div className="report-panel">

            <div className="panel-header">

              <div>
                <h2>
                  AI Evaluation Scores
                </h2>

                <p>
                  Average candidate evaluation
                </p>
              </div>

            </div>

            <div className="score-list">

              <div className="score-row">

                <div className="score-title">
                  ATS Score
                </div>

                <div className="score-progress">
                  <div
                    style={{
                      width: `${reportData.aiScores.ats}%`,
                    }}
                  />
                </div>

                <strong>
                  {Number(
                    reportData.aiScores.ats
                  ).toFixed(1)}
                  %
                </strong>

              </div>

              <div className="score-row">

                <div className="score-title">
                  Skill Score
                </div>

                <div className="score-progress">
                  <div
                    style={{
                      width: `${reportData.aiScores.skill}%`,
                    }}
                  />
                </div>

                <strong>
                  {Number(
                    reportData.aiScores.skill
                  ).toFixed(1)}
                  %
                </strong>

              </div>

              <div className="score-row">

                <div className="score-title">
                  Trust Score
                </div>

                <div className="score-progress">
                  <div
                    style={{
                      width: `${reportData.aiScores.trust}%`,
                    }}
                  />
                </div>

                <strong>
                  {Number(
                    reportData.aiScores.trust
                  ).toFixed(1)}
                  %
                </strong>

              </div>

              <div className="score-row">

                <div className="score-title">
                  Fraud Score
                </div>

                <div className="score-progress fraud">
                  <div
                    style={{
                      width: `${reportData.aiScores.fraud}%`,
                    }}
                  />
                </div>

                <strong>
                  {Number(
                    reportData.aiScores.fraud
                  ).toFixed(1)}
                  %
                </strong>

              </div>

              <div className="score-row">

                <div className="score-title">
                  Plagiarism
                </div>

                <div className="score-progress plagiarism">
                  <div
                    style={{
                      width: `${reportData.aiScores.plagiarism}%`,
                    }}
                  />
                </div>

                <strong>
                  {Number(
                    reportData.aiScores.plagiarism
                  ).toFixed(1)}
                  %
                </strong>

              </div>

            </div>

          </div>

          {/* RECOMMENDATIONS */}

          <div className="report-panel">

            <div className="panel-header">

              <div>
                <h2>
                  AI Recommendations
                </h2>

                <p>
                  Candidate recommendation distribution
                </p>
              </div>

            </div>

            <div className="recommendation-content">

              <div
                className="recommendation-donut"
                style={{
                  background: `conic-gradient(
                    #16a34a 0 ${
                      recommendationTotal
                        ? (reportData.recommendations.recommended /
                            recommendationTotal) *
                          360
                        : 0
                    }deg,
                    #2563eb 0 ${
                      recommendationTotal
                        ? ((reportData.recommendations.recommended +
                            reportData.recommendations.consider) /
                            recommendationTotal) *
                          360
                        : 0
                    }deg,
                    #f59e0b 0 ${
                      recommendationTotal
                        ? ((reportData.recommendations.recommended +
                            reportData.recommendations.consider +
                            reportData.recommendations.review) /
                            recommendationTotal) *
                          360
                        : 0
                    }deg,
                    #dc2626 0 360deg
                  )`,
                }}
              >
                <div className="donut-inner">
                  <strong>
                    {recommendationTotal}
                  </strong>

                  <span>
                    Evaluated
                  </span>
                </div>
              </div>

              <div className="recommendation-list">

                <div>
                  <span className="rec-dot recommended" />
                  <span>Recommended</span>
                  <strong>
                    {reportData.recommendations.recommended}
                  </strong>
                </div>

                <div>
                  <span className="rec-dot consider" />
                  <span>Consider</span>
                  <strong>
                    {reportData.recommendations.consider}
                  </strong>
                </div>

                <div>
                  <span className="rec-dot review" />
                  <span>Review</span>
                  <strong>
                    {reportData.recommendations.review}
                  </strong>
                </div>

                <div>
                  <span className="rec-dot rejected" />
                  <span>Rejected</span>
                  <strong>
                    {reportData.recommendations.rejected}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================================
            JOB PERFORMANCE
        ====================================================== */}

        <section className="report-panel full-panel">

          <div className="panel-header">

            <div>
              <h2>
                Job Performance
              </h2>

              <p>
                Application and AI evaluation performance
                by job
              </p>
            </div>

          </div>

          <div className="table-wrapper">

            <table className="reports-table">

              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Applications</th>
                  <th>Evaluations</th>
                  <th>Avg ATS</th>
                  <th>Avg Trust</th>
                  <th>Recommended</th>
                </tr>
              </thead>

              <tbody>

                {reportData.jobPerformance.length ===
                0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="empty-table"
                    >
                      No job performance data
                    </td>
                  </tr>

                ) : (

                  reportData.jobPerformance
                    .filter((job) =>
                      jobFilter === "All Jobs"
                        ? true
                        : job.job_title === jobFilter
                    )
                    .map((job, index) => (

                      <tr key={index}>

                        <td>
                          <strong>
                            {job.job_title}
                          </strong>
                        </td>

                        <td>
                          {job.applications || 0}
                        </td>

                        <td>
                          {job.evaluations || 0}
                        </td>

                        <td>
                          <span className="score-badge">
                            {Number(
                              job.avg_ats || 0
                            ).toFixed(1)}
                          </span>
                        </td>

                        <td>
                          <span className="trust-badge">
                            {Number(
                              job.avg_trust || 0
                            ).toFixed(1)}
                          </span>
                        </td>

                        <td>
                          {job.recommended || 0}
                        </td>

                      </tr>

                    ))

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ======================================================
            CANDIDATE AI EVALUATIONS
        ====================================================== */}

        <section className="report-panel full-panel">

          <div className="panel-header candidate-report-header">

            <div>
              <h2>
                Candidate AI Evaluation Report
              </h2>

              <p>
                AI-based candidate evaluation summary
              </p>
            </div>

            <div className="candidate-filters">

              <input
                type="text"
                placeholder="🔍 Search candidate..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

              <select
                value={recommendationFilter}
                onChange={(e) =>
                  setRecommendationFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Recommendations
                </option>

                <option value="Recommended">
                  Recommended
                </option>

                <option value="Consider">
                  Consider
                </option>

                <option value="Review">
                  Review
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>

            </div>

          </div>

          <div className="table-wrapper">

            <table className="reports-table candidate-table">

              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>ATS</th>
                  <th>Skill</th>
                  <th>Trust</th>
                  <th>Fraud</th>
                  <th>Plagiarism</th>
                  <th>Recommendation</th>
                </tr>
              </thead>

              <tbody>

                {filteredCandidates.length ===
                0 ? (

                  <tr>
                    <td
                      colSpan="8"
                      className="empty-table"
                    >
                      No candidate evaluations found
                    </td>
                  </tr>

                ) : (

                  filteredCandidates.map(
                    (candidate, index) => {

                      const recommendation =
                        candidate.recommendation ||
                        "Review";

                      return (
                        <tr key={index}>

                          <td>
                            <strong>
                              {candidate.full_name ||
                                candidate.candidate_name ||
                                "Unknown"}
                            </strong>
                          </td>

                          <td>
                            {candidate.job_title ||
                              "--"}
                          </td>

                          <td>
                            {Number(
                              candidate.ats_score || 0
                            ).toFixed(0)}
                          </td>

                          <td>
                            {Number(
                              candidate.skill_score || 0
                            ).toFixed(0)}
                          </td>

                          <td>
                            <span className="trust-number">
                              {Number(
                                candidate.trust_score ||
                                  0
                              ).toFixed(0)}
                            </span>
                          </td>

                          <td>
                            <span
                              className={
                                Number(
                                  candidate.fraud_score ||
                                    0
                                ) >= 50
                                  ? "risk-high"
                                  : "risk-low"
                              }
                            >
                              {Number(
                                candidate.fraud_score ||
                                  0
                              ).toFixed(0)}
                            </span>
                          </td>

                          <td>
                            {Number(
                              candidate.plagiarism_score ||
                                0
                            ).toFixed(0)}
                          </td>

                          <td>

                            <span
                              className={`recommendation-badge ${recommendation
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {recommendation}
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ======================================================
            SKILL ANALYSIS
        ====================================================== */}

        <section className="two-column">

          {/* MATCHED SKILLS */}

          <div className="report-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Most Matched Skills
                </h2>

                <p>
                  Skills commonly found in candidates
                </p>
              </div>

            </div>

            <div className="skill-list">

              {reportData.matchedSkills.length ===
              0 ? (

                <div className="empty-state">
                  No skill data available
                </div>

              ) : (

                reportData.matchedSkills.map(
                  (skill, index) => (

                    <div
                      className="skill-row"
                      key={index}
                    >

                      <div className="skill-name">
                        {skill.skill}
                      </div>

                      <div className="skill-progress">
                        <div
                          style={{
                            width:
                              getBarWidth(
                                skill.count,
                                maxMatchedSkill
                              ),
                          }}
                        />
                      </div>

                      <strong>
                        {skill.count}
                      </strong>

                    </div>

                  )
                )

              )}

            </div>

          </div>

          {/* MISSING SKILLS */}

          <div className="report-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Most Missing Skills
                </h2>

                <p>
                  Common candidate skill gaps
                </p>
              </div>

            </div>

            <div className="skill-list">

              {reportData.missingSkills.length ===
              0 ? (

                <div className="empty-state">
                  No skill data available
                </div>

              ) : (

                reportData.missingSkills.map(
                  (skill, index) => (

                    <div
                      className="skill-row"
                      key={index}
                    >

                      <div className="skill-name">
                        {skill.skill}
                      </div>

                      <div className="skill-progress missing">
                        <div
                          style={{
                            width:
                              getBarWidth(
                                skill.count,
                                maxMissingSkill
                              ),
                          }}
                        />
                      </div>

                      <strong>
                        {skill.count}
                      </strong>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </section>

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="reports-footer">

          <span>
            TrustHire AI • HR Analytics
          </span>

          <span>
            Generated from current system data
          </span>

        </div>

      </main>

      {/* LOADING */}

      {loading && (
        <div className="reports-loading">
          Loading Reports...
        </div>
      )}

    </div>
  );
}

export default Reports;