import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./CandidateJobs.css";

import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaClock,
  FaBookmark,
  FaRegBookmark,
  FaBuilding,
  FaUsers,
  FaArrowRight,
  FaTimes,
  FaUpload,
  FaFileAlt,
  FaSpinner
} from "react-icons/fa";

function CandidateJobs() {












  

  const navigate = useNavigate();

  /* ==========================================
      USER
  ========================================== */


const [user, setUser] = useState(null);

useEffect(() => {

    const token = sessionStorage.getItem("token");
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    // User not logged in
    if (!token || !loggedInUser) {
        navigate("/login");
        return;
    }

    // User logged in
    setUser(loggedInUser);

}, [navigate]);

  /* ==========================================
      JOBS
  ========================================== */
const [processingAI, setProcessingAI] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [savedJobs, setSavedJobs] = useState([]);

  const [pasteDetected, setPasteDetected] = useState({});
const [analyzingAnswer, setAnalyzingAnswer] = useState({});
const [answerAnalysis, setAnswerAnalysis] = useState({});

  /* ==========================================
      APPLY MODAL
  ========================================== */

  const [showApplyModal, setShowApplyModal] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [resume, setResume] = useState(null);

  const [uploadingResume, setUploadingResume] = useState(false);

  const [application, setApplication] = useState({

    fullName: "",

    email: "",

    mobile: "",

    experience: "",

    location: ""

  });

  /* ==========================================
      AI INTERVIEW
  ========================================== */

  const [resumeId, setResumeId] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState({});

  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const [submittingAnswers, setSubmittingAnswers] = useState(false);



  

  /* ==========================================
      PAGINATION
  ========================================== */

  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;

  /* ==========================================
      COMPANY COLORS
  ========================================== */

  const companies = [];

  const colors = [
    "#4285F4",
    "#00A4EF",
    "#FF9900",
    "#E50914",
    "#FF0000",
    "#F80000",
    "#006699",
    "#007CC3",
    "#2956A3",
    "#A100FF",
    "#1877F2",
    "#555555"
  ];

  /* ==========================================
      LOAD JOBS
  ========================================== */

  useEffect(() => {

    fetchJobs();

  }, []);
    const fetchJobs = async () => {

    try {

      setLoading(true);

     const response = await fetch(
  "http://localhost:5000/api/candidate/jobs"
);

      const data = await response.json();
      console.log(data);
console.log(data[0].last_date);
console.log(typeof data[0].last_date);

      const updated = data.map((job, index) => ({

        ...job,

        company: companies[index % companies.length],

        color: colors[index % colors.length],

        salary: `₹${6 + index}-${12 + index} LPA`,

        location: [
          "Ahmedabad",
          "Bangalore",
          "Pune",
          "Mumbai",
          "Hyderabad",
          "Remote"
        ][index % 6],

        experience: [
          "Fresher",
          "1-3 Years",
          "2-5 Years",
          "5+ Years"
        ][index % 4],

        type: [
          "Full Time",
          "Hybrid",
          "Remote",
          "Internship"
        ][index % 4],

        applicants:
          Math.floor(Math.random() * 300) + 25

      }));

      setJobs(updated);
      setFilteredJobs(updated);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };


  /* ==========================================
      JOBS Expiration Check
  ========================================== */

  /* ==========================================
JOB EXPIRATION CHECK
========================================== */

const isJobExpired = (lastDate) => {
  if (!lastDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(lastDate);
  expiry.setHours(23, 59, 59, 999);

  return today > expiry;
};

  /* ==========================================
      SEARCH JOBS
  ========================================== */

  const handleSearch = (e) => {

    const value = e.target.value.toLowerCase();

    setSearch(e.target.value);

    const result = jobs.filter((job) =>

      (job.job_title || "")
        .toLowerCase()
        .includes(value)

      ||

      (job.company_name || "")
        .toLowerCase()
        .includes(value)

      ||

      (job.location || "")
        .toLowerCase()
        .includes(value)

    );

    setFilteredJobs(result);

    setCurrentPage(1);

  };

  /* ==========================================
      SAVE JOB
  ========================================== */

  const toggleSave = (id) => {

    if (savedJobs.includes(id)) {

      setSavedJobs(
        savedJobs.filter(job => job !== id)
      );

    } else {

      setSavedJobs(
        [...savedJobs, id]
      );

    }

  };

  /* ==========================================
      DATE FORMAT
  ========================================== */

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString();

  };

  /* ==========================================
      VIEW DETAILS
  ========================================== */

  const viewDetails = (job) => {

    alert(job.job_description);

  };

  /* ==========================================
      OPEN APPLY MODAL
  ========================================== */

  const openApplyModal = (job) => {

    setSelectedJob(job);

    setResume(null);

    setApplication({

      fullName:
        `${user?.first_name || ""} ${user?.last_name || ""}`,

      email:
        user?.email || "",

      mobile:
        user?.mobile || "",

      experience: "",

      location: ""

    });

    setShowApplyModal(true);

  };

  /* ==========================================
      CLOSE APPLY MODAL
  ========================================== */

  const closeApplyModal = () => {

    setShowApplyModal(false);

    setResume(null);

    setSelectedJob(null);

  };
  /* ==========================================
    UPLOAD RESUME
========================================== */

const handleResumeUpload = async () => {

  if (!resume) {
    alert("Please upload your resume.");
    return;
  }

  try {

    setUploadingResume(true);

    const formData = new FormData();

    formData.append("candidate_id", user.user_id);

    formData.append("job_id", selectedJob.job_id);

    formData.append("fullName", application.fullName);

    formData.append("email", application.email);

    formData.append("mobile", application.mobile);

    formData.append("experience", application.experience);

    formData.append("location", application.location);

    formData.append("resume", resume);

    const response = await fetch(

      "http://localhost:5000/api/apply",

      {

        method: "POST",

        body: formData

      }

    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(data.message);

    }

    setResumeId(data.resume_id);

    setShowApplyModal(false);
    setProcessingAI(true);

    await generateQuestions(data.resume_id);

  }

  catch (err) {

    console.log(err);

    alert(err.message || "Resume Upload Failed");

  }

  finally {

    setUploadingResume(false);

  }

};


/* ==========================================
    not refresh page
========================================== */

useEffect(() => {

  const handleBeforeUnload = (e) => {

    if (processingAI) {

      e.preventDefault();

      e.returnValue = "";

      return "";

    }

  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {

    window.removeEventListener("beforeunload", handleBeforeUnload);

  };

}, [processingAI]);








useEffect(() => {

  const handleKeyDown = (e) => {

    if (!processingAI) return;

    // F5
    if (e.key === "F5") {
      e.preventDefault();
    }

    // Ctrl + R
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
      e.preventDefault();
    }

  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {

    window.removeEventListener("keydown", handleKeyDown);

  };

}, [processingAI]);



/* ==========================================
    GENERATE QUESTIONS
========================================== */
/* ==========================================
    GENERATE QUESTIONS
========================================== */

const generateQuestions = async (resume_id) => {

  try {

    setLoadingQuestions(true);

    const response = await fetch(
      "http://localhost:5000/api/generate-questions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          resume_id: resume_id
        })
      }
    );

    const data = await response.json();

    console.log("QUESTION API RESPONSE:", data);

    if (!response.ok) {

      throw new Error(
        data.message || "Question generation failed"
      );

    }

    if (
      !data.questions ||
      !Array.isArray(data.questions)
    ) {

      throw new Error(
        "Invalid questions received from server"
      );

    }

    /*
      Backend returns:

      [
        { question: "What is React?" },
        { question: "Explain JWT." }
      ]
    */

    setQuestions(data.questions);

    setAnswers({});

    setResumeId(resume_id);

    setProcessingAI(false);

    // OPEN QUESTION POPUP
    setShowQuestionModal(true);

  }

  catch (err) {

    console.error(
      "Question generation error:",
      err
    );

    alert(
      err.message ||
      "Unable to Generate Questions"
    );

  }

  finally {
setProcessingAI(false);
    setLoadingQuestions(false);

  }

};


/* ==========================================
    HANDLE ANSWERS
========================================== */

const handleAnswerChange = (index, value) => {

  setAnswers((prev) => ({

    ...prev,

    [index]: value

  }));

};


/* ==========================================
    SUBMIT ANSWERS
========================================== */
/* ==========================================
    SUBMIT ANSWERS
========================================== */

const submitAnswers = async () => {

  // Check if all questions are answered
  for (let i = 0; i < questions.length; i++) {

    if (!answers[i] || answers[i].trim() === "") {

      alert(`Please answer Question ${i + 1} before submitting.`);

      return;

    }

  }

  try {

    setSubmittingAnswers(true);

    const payload = questions.map((question, index) => ({

      question,

      answer: answers[index]

    }));

    const response = await fetch(

      "http://localhost:5000/api/submit-answers",

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          resume_id: resumeId,

          candidate_id: user.candidate_id,

          job_id: selectedJob.job_id,

          questions: payload

        })

      }

    );

    // Rest of your existing code...



    const data = await response.json();

    console.log(
      "SUBMIT RESPONSE:",
      data
    );

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to submit answers"
      );

    }

    alert(
      "Application Submitted Successfully!"
    );

    // RESET

    setQuestions([]);

    setAnswers({});

    setResume(null);

    setResumeId(null);

    setSelectedJob(null);

    setShowQuestionModal(false);

  }

  catch (err) {

    console.error(
      "Submit answers error:",
      err
    );

    alert(
      err.message ||
      "Failed to Submit Answers"
    );

  }

  finally {

    setSubmittingAnswers(false);

  }

};
/* ==========================================
    PAGINATION
========================================== */

const indexOfLastJob = currentPage * jobsPerPage;

const indexOfFirstJob = indexOfLastJob - jobsPerPage;

const currentJobs = filteredJobs.slice(

  indexOfFirstJob,

  indexOfLastJob

);

const totalPages = Math.ceil(

  filteredJobs.length / jobsPerPage

);

if (loading) {

  return (

    <div className="loadingPage">

      <div className="loader"></div>

      <h2>Loading Jobs...</h2>

    </div>

  );

}
return (
  <div className="candidateJobs">

    {/* ================= NAVBAR ================= */}

    <nav className="navbar">

      <h2
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <img
          src={logo}
          alt="TrustHire AI"
          style={{
            height: "180px",
            width: "auto",
            objectFit: "contain"
          }}
        />
      </h2>

      <div className="navLinks">

        <a href="/CandidateDash">
          Home
        </a>

        <a href="/">
          Jobs
        </a>

        <a href="/MyApplications">
          My Applications
        </a>

        <a href="/CandidateProfile">
          Profile
        </a>

      </div>

      <button
        className="profileBtn"
        onClick={() => navigate("/CandidateProfile")}
      >
        My Profile
      </button>

    </nav>

    {/* ================= HERO ================= */}

    <section className="hero">

      <div className="heroContent">

        <h1>

          Find Your Dream Job

        </h1>

        <p>

          Discover thousands of verified opportunities from top companies
          across India.

        </p>

        <div className="searchBox">

          <FaSearch className="searchIcon" />

          <input

            type="text"

            placeholder="Search jobs, companies or locations..."

            value={search}

            onChange={handleSearch}

          />

        </div>

      </div>

    </section>

    {/* ================= JOB LIST ================= */}

    <div className="jobContainer">

      {

        currentJobs.length === 0

        ?

        (

          <div className="emptyJobs">

            <h2>

              No Jobs Found

            </h2>

            <p>

              Try searching another keyword.

            </p>

          </div>

        )

        :

        (

          currentJobs.map((job) => (

            <div

              className="jobCard"

              key={job.job_id}

            >

              {/* ================= HEADER ================= */}

              <div className="jobHeader">

                <div className="companyInfo">

                  <div

                    className="companyLogo"

                    style={{

                      background: job.color

                    }}

                  >

                    {job.company_name.charAt(0)}

                  </div>

                  <div>

                    <h2>

                      {job.job_title}

                    </h2>

                    <h4>

                      <FaBuilding />

                      {" "}

                      {job.company_name}

                    </h4>

                  </div>

                </div>

                <button

                  className="saveBtn"

                  onClick={() => toggleSave(job.job_id)}

                >

                  {

                    savedJobs.includes(job.job_id)

                    ?

                    <FaBookmark />

                    :

                    <FaRegBookmark />

                  }

                </button>

              </div>

              {/* ================= DESCRIPTION ================= */}

              <p className="description">

                {

                  job.job_description.length > 180

                  ?

                  job.job_description.substring(0, 180) + "..."

                  :

                  job.job_description

                }

              </p>
                            {/* ================= PDF BUTTON ================= */}

              <div className="pdfSection">

                <button
                  className="pdfBtn"
                  onClick={() =>
                    window.open(
      `http://localhost:5000/api/candidate/jobs/${job.job_id}/pdf`,
      "_blank"
    )
                  }
                >
                  <FaFileAlt />
                  &nbsp; View PDF
                </button>

              </div>

              {/* ================= JOB FOOTER ================= */}

<div className="jobFooter">

    <div className="leftFooter">
        <small
            style={{
                display: "block",
                marginTop: "6px",
                color: "#dc2626",
                fontWeight: "600"
            }}
        >
            ⏰ Last Date: {formatDate(job.last_date)}
        </small>
    </div>

    <div className="rightFooter">

        <button
            className="detailsBtn"
            onClick={() => viewDetails(job)}
        >
            Details
        </button>

        {isJobExpired(job.last_date) ? (
            <button className="expiredBtn" disabled>
                Application Closed
            </button>
        ) : (
            <button
                className="applyBtn"
                onClick={() => openApplyModal(job)}
            >
                <span>Apply Now</span>
                <FaArrowRight />
            </button>
        )}

    </div>

</div>

            </div>

          ))

        )

      }

    </div>

    {/* ================= PAGINATION ================= */}

    {

      totalPages > 1 && (

        <div className="pagination">

          <button

            className="pageBtn"

            disabled={currentPage === 1}

            onClick={() =>
              setCurrentPage(currentPage - 1)
            }

          >

            ← Previous

          </button>

          {

            [...Array(totalPages)].map((_, index) => (

              <button

                key={index}

                className={
                  currentPage === index + 1
                    ? "pageBtn active"
                    : "pageBtn"
                }

                onClick={() =>
                  setCurrentPage(index + 1)
                }

              >

                {index + 1}

              </button>

            ))

          }

          <button

            className="pageBtn"

            disabled={currentPage === totalPages}

            onClick={() =>
              setCurrentPage(currentPage + 1)
            }

          >

            Next →

          </button>

        </div>

      )

    }

    {/* ================= APPLY MODAL START ================= */}
        {showApplyModal && (

      <div className="modalOverlay">

        <div className="applyModal">

          <div className="modalHeader">

            <h2>

              Apply for

              <span style={{ color: "#010816" }}>
                {" "}
                {selectedJob?.job_title}
              </span>

            </h2>

            <button

              className="closeModalBtn"

              onClick={closeApplyModal}

            >

              <FaTimes />

            </button>

          </div>

          <div className="modalBody">

            <div className="inputGroup">

              <label>Full Name</label>

              <input

                type="text"

                value={application.fullName}

                onChange={(e) =>
                  setApplication({
                    ...application,
                    fullName: e.target.value
                  })
                }

              />

            </div>

            <div className="inputGroup">

              <label>Email</label>

              <input

                type="email"

                value={application.email}

                onChange={(e) =>
                  setApplication({
                    ...application,
                    email: e.target.value
                  })
                }

              />

            </div>

            <div className="inputGroup">

              <label>Mobile</label>

              <input

                type="text"

                value={application.mobile}

                onChange={(e) =>
                  setApplication({
                    ...application,
                    mobile: e.target.value
                  })
                }

              />

            </div>

            <div className="inputGroup">

              <label>Experience</label>

              <input

                type="text"

                placeholder="Example : Fresher / 2 Years"

                value={application.experience}

                onChange={(e) =>
                  setApplication({
                    ...application,
                    experience: e.target.value
                  })
                }

              />

            </div>

            <div className="inputGroup">

              <label>Current Location</label>

              <input

                type="text"

                placeholder="Ahmedabad"

                value={application.location}

                onChange={(e) =>
                  setApplication({
                    ...application,
                    location: e.target.value
                  })
                }

              />

            </div>

            <div className="inputGroup">

              <label>

                Upload Resume

              </label>

              <input

                type="file"

                accept=".pdf,.doc,.docx"

                onChange={(e) =>

                  setResume(e.target.files[0])

                }

              />

              {

                resume && (

                  <div className="resumePreview">

                    <FaFileAlt />

                    <span>

                      {resume.name}

                    </span>

                  </div>

                )

              }

            </div>

          </div>

          <div className="modalFooter">

            <button

              className="cancelBtn"

              onClick={closeApplyModal}

            >

              Cancel

            </button>

            <button

              className="uploadBtn"

              disabled={uploadingResume}

              onClick={handleResumeUpload}

            >

              {

                uploadingResume

                ?

                <>

                  <FaSpinner className="spinIcon" />

                  Uploading...

                </>

                :

                <>

                  <FaUpload />

                  {" "}

                  Upload & Continue

                </>

              }

            </button>

          </div>

        </div>

      </div>

    )}
{/*================= Loading screen ================= */}



{processingAI && (

  <div className="aiLoadingOverlay">

    <div className="aiLoadingBox">

      <div className="aiLoader"></div>

      <h2>Analyzing Your Resume...</h2>

      <p>
        Our AI is reading your resume and generating
        personalized technical interview questions.
      </p>

      <div className="loadingSteps">

        <p>📄 Uploading Resume...</p>

        <p>🧠 Extracting Skills...</p>

        <p>🤖 Generating  Questions...</p>

        <p>⏳ Please wait...</p>

        <p>⏳ Don't Refresh Page...</p>

      </div>

    </div>

  </div>

)}


    {/* ================= AI INTERVIEW MODAL ================= */}
      {/* ================= AI INTERVIEW MODAL ================= */}

{showQuestionModal && (

  <div className="question-modal-overlay">

    <div className="question-modal">

      {/* ================= HEADER ================= */}

      <div className="question-modal-header">

        <div>

          <h2>
            Technical Interview
          </h2>

          <p>
            Answer the questions based on your
            technical experience.
          </p>

        </div>

        

      </div>


      {/* ================= QUESTIONS ================= */}

      <div className="question-modal-body">

        {questions.length === 0 ? (

          <div className="no-questions">

            <p>
              No questions available.
            </p>

          </div>

        ) : (

          questions.map((q, index) => (

            <div
              className="question-card"
              key={index}
            >

              {/* QUESTION NUMBER */}

              <div className="question-number">

                Question {index + 1}

              </div>


              {/* QUESTION TEXT */}

              <h3>

                {q.question}

              </h3>


              {/* ANSWER */}
<textarea
  value={answers[index] || ""}
  onChange={(e) => {
    const value = e.target.value;

    handleAnswerChange(index, value);

    // Remove warning if answer is completely deleted
    if (!value.trim()) {
      setPasteDetected((prev) => ({
        ...prev,
        [index]: false
      }));
    }
  }}
  onPaste={() => {
    setPasteDetected((prev) => ({
      ...prev,
      [index]: true
    }));
  }}
  placeholder="Type your answer..."
  rows="5"
  required
/>

{pasteDetected[index] && (
  <div
    style={{
      marginTop: "8px",
      padding: "10px 14px",
      borderRadius: "8px",
      background: "#fff7ed",
      border: "1px solid #fdba74",
      color: "#c2410c",
      fontSize: "13px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }}
  >
    ⚠ External content detected

    <span
      style={{
        fontWeight: "400",
        color: "#7c2d12"
      }}
    >
      This answer will be analyzed for AI-generated content.
    </span>
  </div>
)}

            </div>

          ))

        )}

      </div>


      {/* ================= FOOTER ================= */}

      <div className="question-modal-footer">

   


        <button
          className="uploadBtn"
          onClick={submitAnswers}
          disabled={
            submittingAnswers ||
            questions.length === 0
          }
        >

          {submittingAnswers ? (

            <>

              <FaSpinner className="spinIcon" />

              Submitting...

            </>

          ) : (

            <>
              Submit Interview
              <FaArrowRight />
            </>

          )}

        </button>

      </div>

    </div>

  </div>

)}
    {/* ================= CAREER SECTION ================= */}
        {/* ================= CAREER SECTION ================= */}

    <section className="careerSection">

      <div className="careerContent">

        <h2>

          Your Next Career Move Starts Here

        </h2>

        <p>

          Explore thousands of verified opportunities from top companies
          and get hired faster with TrustHire AI.

        </p>

        <button
          className="careerBtn"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: "smooth"
          })}
        >

          Browse All Jobs

          <FaArrowRight />

        </button>

      </div>

    </section>

    {/* ================= FOOTER ================= */}

    <footer className="footer">

      <div className="footerTop">

        <div className="footerBrand">

          <img
            src={logo2}
            alt="TrustHire AI"
            style={{
              height: "180px",
              width: "auto",
              objectFit: "contain"
            }}
          />

          <p>

            AI Powered Recruitment Platform
            for smarter hiring and better careers.

          </p>

        </div>

        <div className="footerLinks">

          <h4>

            Quick Links

          </h4>

          <a href="/CandidateDash">

            Home

          </a>

          <a href="/">

            Jobs

          </a>

          <a href="/">

            Companies

          </a>

          <a href="/">

            About

          </a>

        </div>

        <div className="footerLinks">

          <h4>

            Resources

          </h4>

          <a href="/">

            Help Center

          </a>

          <a href="/">

            Privacy Policy

          </a>

          <a href="/">

            Terms & Conditions

          </a>

          <a href="/">

            Contact

          </a>

        </div>

      </div>

      <div className="footerBottom">

        © 2026 TrustHire AI.
        All Rights Reserved.

      </div>

    </footer>

  </div>

);

}

export default CandidateJobs;