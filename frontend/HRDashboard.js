import React, { useEffect, useState } from "react";
import "./HRDashboard.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

function HRDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // Check login
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

  return (
    <div className="hr-dashboard">

      {/* =========================
          TOP NAVIGATION
      ========================== */}
      <header className="hr-top-nav">

        {/* Logo */}
        <div className="hr-logo">
          <img
            src={logo}
            alt="TrustHire AI Logo"
            className="hr-brand-logo"
          />
        </div>

        {/* Navigation */}
        <nav className="hr-nav-links">
          <Link
            to="/HRDashboard"
            className="active"
          >
            Dashboard
          </Link>

          <Link to="/HRCandidate">
            Candidates
          </Link>

          <Link to="/HRJobpost">
            Job Posts
          </Link>

          <Link to="/HRApplications">
            Applications
          </Link>

          <Link to="/HRReport">
            Reports
          </Link>

          <Link to="/hrprofile">
          Profile</Link>

          <Link
            to="/login"
            onClick={handleLogout}
            className="hr-logout-link"
          >
            Logout
          </Link>
        </nav>

        {/* Profile */}
        <div className="hr-profile">

          <div className="hr-avatar">
            {user?.username
              ? user.username.charAt(0).toUpperCase()
              : "R"}
          </div>

          <div className="hr-profile-info">
            <span className="hr-name">
              HR Manager
            </span>

            <span className="hr-username">
              {user
                ? user.username
                : "Administrator"}
            </span>
          </div>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="hr-main-content">

        {/* =========================
            WELCOME SECTION
        ========================== */}
        <section className="hr-welcome-card">
          <br></br><br></br><br></br>

          <div className="hr-welcome-content">

            <h1>
              Welcome Back
              <span className="hr-wave">👋</span>
            </h1>

            <h2>
              {user?.username || "Jay Ramani"}
            </h2>

            <p>
              All your job applications and interview
              updates are in one place. Keep track of
              your progress and improve your Trust Score
              by updating your resume and skills.
            </p>

            <Link
              to="/HRApplications"
              className="hr-primary-button"
            >
              See My Applications
            </Link>

          </div>

          {/* Right Illustration */}
          <div className="hr-welcome-image">

            <div className="hr-profile-circle">

              <div className="hr-person">

                <div className="hr-hair"></div>

                <div className="hr-face"></div>

                <div className="hr-body">
                  <div className="hr-shirt"></div>
                  <div className="hr-tie"></div>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            TRUSTHIRE AI PROMOTION
        ========================== */}
        <section className="hr-career-section">

          <div className="hr-career-card">

            {/* Decorative circles */}
            <div className="hr-decoration-top"></div>
            <div className="hr-decoration-bottom"></div>

            <div className="hr-career-content">

<h2>
  🚀 Smarter Hiring with
  <br />
  TrustHire AI
</h2>

<p>
  Our AI continuously analyses candidate resumes,
  skills and interview responses to help you identify
  the most suitable candidates, evaluate trust and
  fraud signals, and make faster hiring decisions.
</p>

              <Link
                to="/HRJobpost"
                className="hr-career-button"
              >
                Explore Jobs
              </Link>

            </div>


            {/* Trust Score Circle */}
           

          </div>

        </section>

      </main>

    </div>
  );
}

export default HRDashboard;