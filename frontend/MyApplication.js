import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";

import {
    FaFileAlt,
    FaBriefcase,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaChevronDown,
    FaChevronUp,
    FaEye,
    FaCheckCircle,
    FaClock,
    FaUser,
    FaBuilding,
    FaQuestionCircle,
    FaClipboardCheck,
    FaArrowLeft
} from "react-icons/fa";

import "./MyApplication.css";


function MyApplication() {

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================
    const [searchTerm, setSearchTerm] = useState("");

    const [user, setUser] = useState(null);

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [expandedApplication, setExpandedApplication] =
        useState(null);


    // =====================================================
    // FETCH APPLICATIONS
    // =====================================================

    const fetchApplications = async (candidateId) => {

        try {

            setLoading(true);

            setError("");


            console.log(
                "===================================="
            );

            console.log(
                "Fetching applications..."
            );

            console.log(
                "Candidate ID:",
                candidateId
            );


            // =================================================
            // API REQUEST
            // =================================================

            const response = await fetch(
                `http://localhost:5000/api/my-applications/${candidateId}`
            );


            console.log(
                "API STATUS:",
                response.status
            );


            // =================================================
            // GET RESPONSE
            // =================================================

            const data = await response.json();


            console.log(
                "MY APPLICATIONS RESPONSE:",
                data
            );


            // =================================================
            // HANDLE API ERROR
            // =================================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load applications."
                );

            }


            // =================================================
            // SET APPLICATIONS
            // =================================================

            setApplications(
                Array.isArray(data.applications)
                    ? data.applications
                    : []
            );


            console.log(
                "Applications loaded:",
                data.applications
            );


        } catch (err) {

            console.error(
                "MY APPLICATIONS ERROR:",
                err
            );


            setError(
                err.message ||
                "Unable to load applications."
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // AUTHENTICATION + GET USER + FETCH APPLICATIONS
    // =====================================================

    useEffect(() => {

        const token =
            sessionStorage.getItem("token");


        const userData =
            sessionStorage.getItem("user");


        console.log(
            "===================================="
        );

        console.log(
            "SESSION STORAGE"
        );

        console.log(
            "TOKEN:",
            token
        );

        console.log(
            "USER STRING:",
            userData
        );


        // =================================================
        // CHECK TOKEN
        // =================================================

        if (!token) {

            console.log(
                "No token found."
            );

            navigate("/login");

            return;

        }


        // =================================================
        // CHECK USER
        // =================================================

        if (!userData) {

            console.log(
                "No user found in session storage."
            );

            navigate("/login");

            return;

        }


        // =================================================
        // PARSE USER
        // =================================================

        let loggedInUser;


        try {

            loggedInUser =
                JSON.parse(userData);

        } catch (parseError) {

            console.error(
                "Invalid user data:",
                parseError
            );


            sessionStorage.removeItem("user");

            navigate("/login");

            return;

        }


        console.log(
            "LOGGED IN USER:",
            loggedInUser
        );


        // =================================================
        // SET USER
        // =================================================

        setUser(loggedInUser);


        // =================================================
        // FIND CANDIDATE ID
        // =================================================

        const candidateId =
            loggedInUser.candidate_id ??
            loggedInUser.candidateId ??
            loggedInUser.user_id ??
            loggedInUser.userId ??
            loggedInUser.id;


        console.log(
            "===================================="
        );

        console.log(
            "CANDIDATE ID:",
            candidateId
        );


        // =================================================
        // IF CANDIDATE ID NOT FOUND
        // =================================================

        if (
            candidateId === undefined ||
            candidateId === null ||
            candidateId === ""
        ) {

            console.error(
                "Candidate ID was not found inside user object."
            );


            console.error(
                "User object:",
                loggedInUser
            );


            setError(
                "Candidate ID not found. Please login again."
            );


            setLoading(false);

            return;

        }


        // =================================================
        // FETCH APPLICATIONS
        // =================================================

        fetchApplications(candidateId);


    }, [navigate]);


    // =====================================================
    // TOGGLE APPLICATION
    // =====================================================

    const toggleApplication = (resumeId) => {

        if (
            expandedApplication === resumeId
        ) {

            setExpandedApplication(null);

        } else {

            setExpandedApplication(resumeId);

        }

    };


    // =====================================================
    // VIEW RESUME
    // =====================================================

    const viewResume = (resumeId) => {

        if (!resumeId) {

            console.error(
                "Resume ID missing."
            );

            return;

        }


        const resumeUrl =
            `http://localhost:5000/api/my-applications/resume/${resumeId}`;


        console.log(
            "Opening resume:",
            resumeUrl
        );


        window.open(
            resumeUrl,
            "_blank",
            "noopener,noreferrer"
        );

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "N/A";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return date;

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // FORMAT FILE SIZE
    // =====================================================

    const formatFileSize = (bytes) => {

        if (
            bytes === undefined ||
            bytes === null ||
            bytes === 0
        ) {

            return "0 KB";

        }


        const kb =
            Number(bytes) / 1024;


        if (kb < 1024) {

            return `${Math.round(kb)} KB`;

        }


        const mb =
            kb / 1024;


        return `${mb.toFixed(2)} MB`;

    };


    // =====================================================
    // GET STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {

        if (!status) {

            return "status-uploaded";

        }


        const normalized =
            String(status).toLowerCase();


        if (
            normalized.includes("complete") ||
            normalized.includes("approved") ||
            normalized.includes("selected") ||
            normalized.includes("success")
        ) {

            return "status-success";

        }


        if (
            normalized.includes("reject") ||
            normalized.includes("failed") ||
            normalized.includes("error")
        ) {

            return "status-danger";

        }


        return "status-uploaded";

    };


    // =====================================================
    // GET STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {

        if (!status) {

            return <FaClock />;

        }


        const normalized =
            String(status).toLowerCase();


        if (
            normalized.includes("complete") ||
            normalized.includes("approved") ||
            normalized.includes("selected") ||
            normalized.includes("success")
        ) {

            return <FaCheckCircle />;

        }


        return <FaClock />;

    };




    // =====================================================
// FILTER APPLICATIONS
// =====================================================

const filteredApplications = applications.filter(
    (application) => {

        const search = searchTerm
            .trim()
            .toLowerCase();

        // Show all applications when search is empty
        if (!search) {
            return true;
        }

        const searchableText = [

            application.job_title,

            application.company_name,

            application.status,

            application.full_name,

            application.email,

            application.mobile,

            application.location,

            application.resume_name,

            application.experience,

            application.job_id,

            application.resume_id

        ]
            .filter(
                value =>
                    value !== undefined &&
                    value !== null
            )
            .join(" ")
            .toLowerCase();


        return searchableText.includes(search);

    }
);

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="myApplicationLoading">

                <div className="loadingCircle"></div>


                <h2>
                    Loading Your Applications
                </h2>


                <p>
                    Please wait while we fetch your application details...
                </p>

            </div>

        );

    }


    // =====================================================
    // ERROR SCREEN
    // =====================================================

    if (error) {

        return (

            <div className="myApplicationErrorPage">

                <div className="errorCard">

                    <div className="errorIcon">
                        !
                    </div>


                    <h2>
                        Unable to Load Applications
                    </h2>


                    <p>
                        {error}
                    </p>


                    <div className="errorActions">

                        <button
                            className="retryButton"
                            onClick={() => {

                                if (user) {

                                    const candidateId =
                                        user.candidate_id ??
                                        user.candidateId ??
                                        user.user_id ??
                                        user.userId ??
                                        user.id;


                                    if (candidateId) {

                                        fetchApplications(
                                            candidateId
                                        );

                                    }

                                }

                            }}
                        >
                            Try Again
                        </button>


                        <button
                            className="backButton"
                            onClick={() =>
                                navigate("/CandidateDash")
                            }
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="myApplicationPage">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav className="myApplicationNavbar">


                {/* LOGO */}

                <div
                    className="myApplicationLogo"
                    onClick={() =>
                        navigate("/CandidateDash")
                    }
                >

                    


                    <div>

                        <img
                                 src={logo}
                                 alt="TrustHire AI"
                                 style={{
                                   height: "180px",
                                   width: "auto",
                                   objectFit: "contain"
                                 }}
                               />

                    </div>

                </div>


                {/* NAV LINKS */}

                <div className="myApplicationNavLinks">

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Home
                    </button>


                    <button
                        onClick={() =>
                            navigate("/CandidateJobs")
                        }
                    >
                        Jobs
                    </button>


                    <button
                        className="active"
                    >
                        My Applications
                    </button>


                    <button
                        onClick={() =>
                            navigate("/CandidateProfile")
                        }
                    >
                        Profile
                    </button>

                </div>


                {/* BACK BUTTON */}

                <button
                    className="navbarBackButton"
                    onClick={() =>
                        navigate(-1)
                    }
                >

                    <FaArrowLeft />

                    Back

                </button>

            </nav>


            {/* =================================================
                HERO
            ================================================= */}

            <section className="myApplicationHero">


                <div className="heroContent">

                    <div className="heroBadge">

                        <FaClipboardCheck />

                        Application Center

                    </div>


                    <h1>
                        My Applications
                    </h1>


                    <p>
                        View your submitted applications,
                        resume details and technical interview
                        responses in one place.
                    </p>

                </div>


                {/* APPLICATION COUNT */}

                <div className="applicationCounter">

                    <div className="counterNumber">
                        {applications.length}
                    </div>


                    <div className="counterText">

                        <span>
                            Total
                        </span>


                        <strong>
                            Applications
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                CONTENT
            ================================================= */}

            <main className="myApplicationContent">


                {/* =================================================
    SEARCH APPLICATIONS
================================================= */}

{applications.length > 0 && (

    <div className="applicationSearchSection">

        <div className="applicationSearchBox">

            <FaFileAlt className="applicationSearchIcon" />

            <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                    setSearchTerm(e.target.value)
                }
                placeholder="Search applications by job, company, status, location..."
                aria-label="Search applications"
            />

            {searchTerm && (

                <button
                    type="button"
                    className="clearSearchButton"
                    onClick={() =>
                        setSearchTerm("")
                    }
                    aria-label="Clear search"
                >
                    ×
                </button>

            )}

        </div>


        <div className="searchResultInfo">

            {searchTerm ? (

                <>
                    Showing{" "}
                    <strong>
                        {filteredApplications.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {applications.length}
                    </strong>{" "}
                    applications
                </>

            ) : (

                <>
                    <strong>
                        {applications.length}
                    </strong>{" "}
                    applications
                </>

            )}

        </div>

    </div>

)}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {applications.length === 0 ? (

                    <div className="emptyApplication">

                        <div className="emptyApplicationIcon">

                            <FaFileAlt />

                        </div>


                        <h2>
                            No Applications Yet
                        </h2>


                        <p>
                            You haven't applied for any jobs yet.
                            Start exploring available opportunities
                            and submit your first application.
                        </p>


                        <button
                            onClick={() =>
                                navigate("/")
                            }
                        >

                            <FaBriefcase />

                            Browse Jobs

                        </button>

                    </div>

                ) : (


                    /* =================================================
                        APPLICATION LIST
                    ================================================= */

                   <div className="applicationList">

    {filteredApplications.length === 0 ? (

        <div className="noSearchResults">

            <div className="noSearchResultsIcon">
                <FaFileAlt />
            </div>

            <h2>
                No Matching Applications
            </h2>

            <p>
                No applications match{" "}
                <strong>
                    "{searchTerm}"
                </strong>.
                Try searching for a different job title,
                company, status, or location.
            </p>

            <button
                type="button"
                onClick={() => setSearchTerm("")}
            >
                Clear Search
            </button>

        </div>

    ) : (

        filteredApplications.map(
            (application, index) => {


                                const isExpanded =
                                    expandedApplication ===
                                    application.resume_id;


                                const questions =
                                    Array.isArray(
                                        application.questions
                                    )
                                        ? application.questions
                                        : [];


                                return (

                                    <article
                                        className="applicationCard"
                                        key={
                                            application.resume_id ||
                                            index
                                        }
                                    >


                                        {/* =================================================
                                            APPLICATION TOP
                                        ================================================= */}

                                        <div className="applicationCardTop">


                                            {/* JOB INFORMATION */}

                                            <div className="applicationJobInfo">


                                                <div className="applicationJobIcon">

                                                    <FaBriefcase />

                                                </div>


                                                <div>

                                                    <span className="applicationNumber">

                                                        Application #
                                                        {index + 1}

                                                    </span>


                                                   <h2>
    {application.job_title || "Job Title Not Available"}
</h2>

<p>
    <FaBuilding />
    {application.company_name || "Company Not Available"}
</p>

                                                </div>

                                            </div>


                                            {/* STATUS */}

                                            <div
                                                className={`applicationStatus ${getStatusClass(
                                                    application.status
                                                )}`}
                                            >

                                                {
                                                    getStatusIcon(
                                                        application.status
                                                    )
                                                }


                                                <span>

                                                    {
                                                        application.status ||
                                                        "Uploaded"
                                                    }

                                                </span>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            APPLICATION DETAILS
                                        ================================================= */}

                                        <div className="applicationDetails">


                                            <div className="sectionTitle">

                                                <FaUser />

                                                <h3>
                                                    Candidate Information
                                                </h3>

                                            </div>


                                            <div className="detailsGrid">


                                                {/* NAME */}

                                                <div className="detailBox">

                                                    <span>
                                                        Full Name
                                                    </span>


                                                    <strong>

                                                        {
                                                            application.full_name ||
                                                            "N/A"
                                                        }

                                                    </strong>

                                                </div>


                                                {/* EMAIL */}

                                                <div className="detailBox">

                                                    <span>
                                                        Email
                                                    </span>


                                                    <strong>

                                                        <FaEnvelope />

                                                        {
                                                            application.email ||
                                                            "N/A"
                                                        }

                                                    </strong>

                                                </div>


                                                {/* MOBILE */}

                                                <div className="detailBox">

                                                    <span>
                                                        Mobile
                                                    </span>


                                                    <strong>

                                                        <FaPhone />

                                                        {
                                                            application.mobile ||
                                                            "N/A"
                                                        }

                                                    </strong>

                                                </div>


                                                {/* EXPERIENCE */}

                                                <div className="detailBox">

                                                    <span>
                                                        Experience
                                                    </span>


                                                    <strong>

                                                        <FaBriefcase />

                                                        {
                                                            application.experience ||
                                                            "Not specified"
                                                        }

                                                    </strong>

                                                </div>


                                                {/* LOCATION */}

                                                <div className="detailBox">

                                                    <span>
                                                        Location
                                                    </span>


                                                    <strong>

                                                        <FaMapMarkerAlt />

                                                        {
                                                            application.location ||
                                                            "Not specified"
                                                        }

                                                    </strong>

                                                </div>


                                                {/* DATE */}

                                                <div className="detailBox">

                                                    <span>
                                                        Applied On
                                                    </span>


                                                    <strong>

                                                        <FaCalendarAlt />

                                                        {
                                                            formatDate(
                                                                application.upload_date
                                                            )
                                                        }

                                                    </strong>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                RESUME
                                            ================================================= */}

                                            <div className="resumeSection">


                                                <div className="resumeFileIcon">

                                                    <FaFileAlt />

                                                </div>


                                                <div className="resumeFileInfo">

                                                    <span>
                                                        Submitted Resume
                                                    </span>


                                                    <strong>

                                                        {
                                                            application.resume_name ||
                                                            "Resume"
                                                        }

                                                    </strong>


                                                    <small>

                                                        {
                                                            application.file_type ||
                                                            "application/pdf"
                                                        }

                                                        {" • "}

                                                        {
                                                            formatFileSize(
                                                                application.file_size
                                                            )
                                                        }

                                                    </small>

                                                </div>


                                                <button
                                                    className="viewResumeButton"
                                                    onClick={() =>
                                                        viewResume(
                                                            application.resume_id
                                                        )
                                                    }
                                                >

                                                    <FaEye />

                                                    View Resume

                                                </button>

                                            </div>


                                            {/* =================================================
                                                TECHNICAL INTERVIEW HEADER
                                            ================================================= */}

                                            <button
                                                type="button"
                                                className={`interviewHeader ${
                                                    isExpanded
                                                        ? "expanded"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    toggleApplication(
                                                        application.resume_id
                                                    )
                                                }
                                            >

                                                <div className="interviewTitle">

                                                    <div className="interviewIcon">

                                                        <FaQuestionCircle />

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            Technical Interview
                                                        </strong>


                                                        <span>

                                                            {questions.length}

                                                            {" "}

                                                            {
                                                                questions.length ===
                                                                1
                                                                    ? "Question"
                                                                    : "Questions"
                                                            }

                                                            {" & "}

                                                            Answers

                                                        </span>

                                                    </div>

                                                </div>


                                                <div className="expandIcon">

                                                    {
                                                        isExpanded
                                                            ?
                                                            <FaChevronUp />
                                                            :
                                                            <FaChevronDown />
                                                    }

                                                </div>

                                            </button>


                                            {/* =================================================
                                                QUESTIONS + ANSWERS
                                            ================================================= */}

                                            {isExpanded && (

                                                <div className="questionsContainer">


                                                    {questions.length === 0 ? (

                                                        <div className="noQuestions">

                                                            <FaQuestionCircle />


                                                            <h3>
                                                                No Interview Questions
                                                            </h3>


                                                            <p>
                                                                Technical questions
                                                                have not been generated
                                                                for this application yet.
                                                            </p>

                                                        </div>

                                                    ) : (

                                                        questions.map(
                                                            (
                                                                item,
                                                                questionIndex
                                                            ) => (

                                                                <div
                                                                    className="questionCard"
                                                                    key={
                                                                        item.question_id ||
                                                                        questionIndex
                                                                    }
                                                                >


                                                                    {/* QUESTION NUMBER */}

                                                                    <div className="questionNumber">

                                                                        Q
                                                                        {questionIndex + 1}

                                                                    </div>


                                                                    {/* QUESTION CONTENT */}

                                                                    <div className="questionContent">


                                                                        <div className="questionLabel">

                                                                            Technical Question

                                                                        </div>


                                                                        <h4>

                                                                            {
                                                                                item.question ||
                                                                                "Question not available"
                                                                            }

                                                                        </h4>


                                                                        {/* ANSWER */}

                                                                        <div className="answerContainer">

                                                                            <div className="answerLabel">

                                                                                <FaCheckCircle />

                                                                                Candidate Answer

                                                                            </div>


                                                                            <p>

                                                                                {
                                                                                    item.answer
                                                                                        ?
                                                                                        item.answer
                                                                                        :
                                                                                        "No answer provided."
                                                                                }

                                                                            </p>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            )
                                                        )

                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    </article>

                                );

                                  }
    )

    )}

</div>

                )}

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="myApplicationFooter">

                <p>

                    © {new Date().getFullYear()} TrustHire AI.

                    {" "}

                    Intelligent Recruitment Platform.

                </p>

            </footer>

        </div>

    );

}


export default MyApplication;