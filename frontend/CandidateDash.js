import React, { useState, useEffect } from "react";
import "./CandidateDash.css";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";


import {
    FaHome,
    FaBriefcase,
    FaFileAlt,
    FaBookmark,
    FaRobot,
    FaUserGraduate,
    FaCalendarAlt,
    FaUserCircle,
    FaCog,
    FaSignOutAlt,
    FaBell,
    FaSearch,
    FaChartLine,
    FaCheckCircle,
    FaArrowUp,
    FaBars,
    FaTimes
} from "react-icons/fa";

function CandidateDash() {



    //logout

    const navigate = useNavigate();

const handleLogout = () => {

     sessionStorage.clear();   // or localStorage.clear() if you're using localStorage
    navigate("/login");

};


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


    const dashboardCards = [

        {
            title: "Trust Score",
            value: "91%",
            icon: <FaCheckCircle />,
            color: "#10B981",
            change: "+5%"
        },

        {
            title: "ATS Score",
            value: "88%",
            icon: <FaChartLine />,
            color: "#2563EB",
            change: "+3%"
        },

        {
            title: "Applications",
            value: "12",
            icon: <FaBriefcase />,
            color: "#F59E0B",
            change: "+2"
        },

        {
            title: "Interviews",
            value: "3",
            icon: <FaCalendarAlt />,
            color: "#EC4899",
            change: "+1"
        }

    ];

    return (

        <div className="candidateDashboard">

            {/* ================= Sidebar ================= */}

            

            {/* ================= Main Content ================= */}

            <div className="mainContent">

                {/* ================= Navbar ================= */}

  <nav className="topNavbar">

    <div className="navLeft">

        <img
            src={logo}
            alt="TrustHire AI"
            className="navLogo"
        />

      

    </div>

    <ul className="navMenu">

        <li>
            <Link to="/candidate/dashboard">Dashboard</Link>
        </li>

        <li>
            <Link to="/CandidateJobs">Jobs</Link>
        </li>

        <li>
            <Link to="/MyApplications">Applications</Link>
        </li>

       
        <li>
            <Link to="/CandidateProfile">Profile</Link>
        </li>

        <li  onClick={handleLogout}>
      
    

    Logout
     

        </li>

    </ul>

    <div className="navRight">

        <FaSearch className="navIcon" />

        <FaBell className="navIcon" />

       <img
    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.username || "User"
    )}&background=2563EB&color=fff`}
    alt="Profile"
    className="profileImg"
/>

    </div>

</nav>

                {/* ================= Welcome ================= */}

                <section className="welcomeCard">

                    <div>

                        <h1>

                            Welcome Back 👋

                        </h1>

                       <h2>

    {user?.username || "Candidate"}

</h2>

                        <p>

                           All your job applications and interview updates are in one place. Keep track of your progress and improve your Trust Score by updating your resume and skills.

                           

                        </p>
<a href="/MyApplications">
                        <button>

                           See My Applications

                        </button></a>

                    </div>

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt=""
                    />

                </section>

               

                {/* ================= Quick Actions ================= */}

              
                                {/* ================= Career Growth ================= */}

                <section className="careerSection">

                    <div className="careerBanner">

                        <div className="careerLeft">

                            <h2>

                                🚀 Accelerate Your Career with TrustHire AI

                            </h2>

                            <p>

                                Our AI continuously analyses your resume,
                                projects and skills to recommend better jobs,
                                improve your Trust Score and increase your
                                interview opportunities.

                            </p>

                            <div className="careerButtons">
<a href="/CandidateJobs">
                                 <button className="primaryBtn">

                                    Explore Jobs

                                </button></a>

                                

                            </div>

                        </div>

                        <div className="careerRight">

                            <div className="careerCircle">

                                <h1>

                                    90% +

                                </h1>

                                <span>

                                    Keep Trust Score

                                </span>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= Footer ================= */}

                <footer className="dashboardFooter">

                    <div>
                         <img
            src={logo2}
            alt="TrustHire AI"
            className="navLogo"
        />

                        <h3>

                            TrustHire AI

                        </h3>

                        <p>

                            AI Powered Recruitment & Candidate Verification Platform

                        </p>

                    </div>

                    <div className="footerLinks">

                        <a href="#">

                            Privacy Policy

                        </a>

                        <a href="#">

                            Terms

                        </a>

                        <a href="#">

                            Help

                        </a>

                        <a href="#">

                            Contact

                        </a>

                    </div>

                </footer>

            </div>

        </div>

    );

}

export default CandidateDash;