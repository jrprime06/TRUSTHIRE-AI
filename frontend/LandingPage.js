import React from "react";
import "./Landingpage.css";

import logo from "../assets/logo3.png";
import heroDashboard from "../assets/hero-dashboard.png";
import candidate from "../assets/image.png";

import {
  FaArrowRight,
  FaCheckCircle,
  FaRobot,
  FaShieldAlt,
  FaFileAlt,
  FaChartLine,
  FaSearch,
  FaUserCheck,
  FaExclamationTriangle,
  FaClock,
  FaUserTimes,
} from "react-icons/fa";

function LandingPage() {
  return (
    <div className="lp-landingPage">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="lp-landingnavbar">
        <div className="lp-logoArea">
          <img
            src={logo}
            alt="TrustHire AI"
            className="lp-logo"
          />
        </div>

        <ul className="lp-lannavLinks">
          <li>
            <a href="#home">Home</a>
          </li>

          <li>
            <a href="#problem">Problem</a>
          </li>

          <li>
            <a href="#solution">Solution</a>
          </li>

          <li>
            <a href="#features">Features</a>
          </li>

          <li>
            <a href="#workflow">Workflow</a>
          </li>

          <li>
            <a href="#faq">FAQs</a>
          </li>

          <li>
            <a href="/login">
              <button className="lp-lanprimaryBtn">
                Login <FaArrowRight />
              </button>
            </a>
          </li>
        </ul>
      </nav>

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="lp-lanhero" id="home">

        <div className="lp-heroLeft">

          <span className="lp-heroBadge">
            AI Powered Recruitment Platform
          </span>

          <h1>
            Recruiting Made <br />
            <span>Simple, Smart</span> <br />
            and Trusted
          </h1>

          <p>
            Revolutionize hiring with AI Resume Screening,
            Resume Fraud Detection, Trust Score, Live Skill
            Verification, and Intelligent ATS.
          </p>

          <div className="lp-heroButtons">

            <a href="/register">
              <button className="lp-primaryBtn">
                Sign Up Now <FaArrowRight />
              </button>
            </a>

            <a href="/login">
              <button className="lp-secondaryBtn lp-heroLoginBtn">
                Login
              </button>
            </a>

          </div>
        </div>

        <div className="lp-heroRight">

          <div className="lp-dashboardCard">
            <img
              src={heroDashboard}
              alt="Dashboard Preview"
              className="lp-dashboardImage"
            />
          </div>

          <div className="lp-floatingCard lp-profileCard">

            <img
              src={candidate}
              alt="Candidate Profile"
              className="lp-candidateImage"
            />

            <div>
              <h4>Rahul Sharma</h4>
              <p>Software Engineer</p>
            </div>

          </div>

        </div>

      </section>

      {/* =========================
          PROBLEM SECTION
      ========================= */}
      <section
        className="lp-problemSection"
        id="problem"
      >

        <div className="lp-sectionTitle">

          <span className="lp-badgeRed">
            PROBLEM
          </span>

          <h2>
            Modern Hiring Is Broken
          </h2>

          <p>
            The recruitment industry is facing an
            unprecedented trust crisis. Here's what
            recruiters deal with every day.
          </p>

        </div>

        <div className="lp-problemGrid">

          <div className="lp-problemCard">
            <div className="lp-iconBoxRed">
              <FaFileAlt />
            </div>

            <h3>Fake Resumes</h3>

            <p>
              Candidates may exaggerate qualifications,
              certifications, or work experience, making
              it difficult for recruiters to verify
              authenticity through manual screening.
            </p>
          </div>

          <div className="lp-problemCard">
            <div className="lp-iconBoxRed">
              <FaChartLine />
            </div>

            <h3>Exaggerated Experience</h3>

            <p>
              Applicants often overstate their
              responsibilities, seniority, or project
              impact, increasing the risk of hiring
              based on inaccurate information.
            </p>
          </div>

          <div className="lp-problemCard">
            <div className="lp-iconBoxRed">
              <FaRobot />
            </div>

            <h3>AI-Generated Applications</h3>

            <p>
              AI tools can generate polished,
              keyword-optimized resumes that pass ATS
              screening while not accurately reflecting
              a candidate's real skills.
            </p>
          </div>

          <div className="lp-problemCard">
            <div className="lp-iconBoxRed">
              <FaExclamationTriangle />
            </div>

            <h3>Unverified Technical Skills</h3>

            <p>
              Claimed proficiency in programming
              languages, frameworks, and tools often
              remains unverified until technical
              interviews.
            </p>
          </div>

          <div className="lp-problemCard">
            <div className="lp-iconBoxRed">
              <FaClock />
            </div>

            <h3>Manual Screening Overhead</h3>

            <p>
              Recruiters spend significant time
              manually reviewing resumes, slowing
              the hiring process and increasing
              workload.
            </p>
          </div>

          <div className="lp-problemCard">
            <div className="lp-iconBoxRed">
              <FaUserTimes />
            </div>

            <h3>High Mis-hire Costs</h3>

            <p>
              Poor hiring decisions can lead to
              increased recruitment costs, lower
              productivity, additional training,
              and higher employee turnover.
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          SOLUTION SECTION
      ========================= */}
      <section
        className="lp-solutionSection"
        id="solution"
      >

        <div className="lp-sectionTitle">

          <span className="lp-badgeBlue">
            OUR SOLUTION
          </span>

          <h2>
            AI That Works As Hard As You Do
          </h2>

          <p>
            Analyze resumes to identify inconsistencies,
            suspicious patterns, and potential fraud
            using AI-powered verification techniques.
          </p>

        </div>

        <div className="lp-solutionGrid">

          <div className="lp-solutionCard">
            <div className="lp-iconBoxBlue">
              <FaShieldAlt />
            </div>

            <h3>Resume Fraud Detection</h3>

            <p>
              AI cross-references every claim against
              public professional data, flagging
              inconsistencies with surgical precision.
            </p>
          </div>

          <div className="lp-solutionCard">
            <div className="lp-iconBoxBlue">
              <FaCheckCircle />
            </div>

            <h3>AI Resume Detection</h3>

            <p>
              Detect AI-generated or heavily AI-assisted
              resumes to help recruiters assess
              authenticity.
            </p>
          </div>

          <div className="lp-solutionCard">
            <div className="lp-iconBoxBlue">
              <FaSearch />
            </div>

            <h3>HR Dashboard & Analytics</h3>

            <p>
              Monitor candidates, review Trust Scores,
              and access hiring insights through an
              intuitive dashboard.
            </p>
          </div>

          <div className="lp-solutionCard">
            <div className="lp-iconBoxBlue">
              <FaUserCheck />
            </div>

            <h3>Trust Score Generation</h3>

            <p>
              Generate an AI-powered Trust Score that
              combines multiple verification signals
              into a clear candidate reliability
              indicator.
            </p>
          </div>

          <div className="lp-solutionCard">
            <div className="lp-iconBoxBlue">
              <FaRobot />
            </div>

            <h3>AI Hiring Insights</h3>

            <p>
              Provide actionable insights and analytics
              to help recruiters evaluate candidates
              and make confident hiring decisions.
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          FEATURES
      ========================= */}
      <section
        className="lp-features"
        id="features"
      >

        <div className="lp-sectionTitle">

          <span>
            FEATURES
          </span>

          <h2>
            Everything You Need For Smart Hiring
          </h2>

          <p>
            AI-powered recruitment tools designed
            to reduce hiring time and improve
            hiring quality.
          </p>

        </div>

        <div className="lp-featureGrid">

          <div className="lp-featureCard">
            <div className="lp-featureIcon">🤖</div>

            <h3>AI Resume Screening</h3>

            <p>
              Automatically shortlist the most
              suitable candidates using advanced
              AI algorithms.
            </p>
          </div>

          <div className="lp-featureCard">
            <div className="lp-featureIcon">🛡️</div>

            <h3>Fraud Detection</h3>

            <p>
              Detect fake resumes, duplicated
              projects, and AI-generated content
              instantly.
            </p>
          </div>

          <div className="lp-featureCard">
            <div className="lp-featureIcon">📊</div>

            <h3>Trust Score</h3>

            <p>
              Generate an intelligent trust score
              for every candidate before hiring.
            </p>
          </div>

          <div className="lp-featureCard">
            <div className="lp-featureIcon">💬</div>

            <h3>Live AI Interview</h3>

            <p>
              Conduct automated technical interviews
              with AI-generated questions.
            </p>
          </div>

          <div className="lp-featureCard">
            <div className="lp-featureIcon">📄</div>

            <h3>Resume Parser</h3>

            <p>
              Extract candidate skills, education,
              certifications, and projects
              automatically.
            </p>
          </div>

          <div className="lp-featureCard">
            <div className="lp-featureIcon">📈</div>

            <h3>HR Analytics</h3>

            <p>
              Visual dashboards for hiring trends,
              recruitment analytics, and performance.
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          DASHBOARD PREVIEW
      ========================= */}
      <section
        className="lp-dashboardSection"
        id="dashboard"
      >

        <div className="lp-sectionTitle">

          <span className="lp-badgeBlue">
            PRODUCT PREVIEW
          </span>

          <h2>
            Experience the TrustHire Control Center
          </h2>

          <p>
            Get a bird's-eye view of your entire
            talent acquisition pipeline in real time.
          </p>

        </div>

        <div className="lp-dashboardPreviewWrapper">

          <img
            src={candidate}
            alt="Full HR Dashboard Preview"
            className="lp-fullDashboardImage"
          />

        </div>

      </section>

      {/* =========================
          WORKFLOW
      ========================= */}
      <section
        className="lp-workflow"
        id="workflow"
      >

        <div className="lp-sectionTitle">

          <span className="lp-badgeBlue">
            HOW IT WORKS
          </span>

          <h2>
            From Resume to Trust Report in Minutes
          </h2>

          <p>
            Four steps. Zero manual effort.
            Complete hiring confidence.
          </p>

        </div>

        <div className="lp-workflowSteps">

          <div className="lp-stepCard">

            <div className="lp-stepNum">
              01
            </div>

            <h3>
              Upload Resume
            </h3>

            <p>
              Drag and drop a resume PDF or connect
              your ATS. We accept any format.
            </p>

          </div>

          <div className="lp-stepCard">

            <div className="lp-stepNum">
              02
            </div>

            <h3>
              AI Analyzes Candidate
            </h3>

            <p>
              Our models cross-reference claims
              across multiple data sources in
              real time.
            </p>

          </div>

          <div className="lp-stepCard">

            <div className="lp-stepNum">
              03
            </div>

            <h3>
              Verify Skills & Experience
            </h3>

            <p>
              Live assessments and portfolio
              evaluation produce ground-truth
              skill scores.
            </p>

          </div>

          <div className="lp-stepCard">

            <div className="lp-stepNum">
              04
            </div>

            <h3>
              Generate Trust Score
            </h3>

            <p>
              A comprehensive Trust Score,
              insights, and risk flags is ready
              to share.
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          WHY TRUSTHIRE
      ========================= */}
      <section className="lp-whyChoose">

        <div className="lp-sectionTitle">

          <span className="lp-badgeGreen">
            WHY TRUSTHIRE AI
          </span>

          <h2>
            Built for Modern Recruiting Teams
          </h2>

          <p>
            Every feature designed to reduce friction,
            surface insight, and give your team an
            unfair advantage.
          </p>

        </div>

        <div className="lp-whyGrid">

          <div className="lp-whyCard">
            <h3>10× Faster Decisions</h3>

            <p>
              Automated analysis replaces hours of
              manual screening with instant, reliable
              Trust Reports.
            </p>
          </div>

          <div className="lp-whyCard">
            <h3>Fraud Prevention</h3>

            <p>
              Industry-leading detection eliminates
              mis-hire risk before it becomes a
              costly HR incident.
            </p>
          </div>

          <div className="lp-whyCard">
            <h3>Higher Hiring Confidence</h3>

            <p>
              Go into every offer conversation with
              evidence-backed data, not gut instinct.
            </p>
          </div>

          <div className="lp-whyCard">
            <h3>Smarter Screening</h3>

            <p>
              Surface the right candidates faster
              with AI that learns your team's
              hiring patterns.
            </p>
          </div>

          <div className="lp-whyCard">
            <h3>Recruiter Productivity</h3>

            <p>
              Give your team superpowers. Handle
              5× more roles without adding headcount.
            </p>
          </div>

          <div className="lp-whyCard">
            <h3>Actionable Insights</h3>

            <p>
              Pipeline analytics and fraud trend
              reports that improve your process
              week over week.
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          TESTIMONIALS
      ========================= */}
      <section className="lp-testimonials">

        <div className="lp-sectionTitle">

          <span>
            Testimonials
          </span>

          <h2>
            What Our Clients Say
          </h2>

          <p>
            Companies are hiring smarter and faster
            using TrustHire AI.
          </p>

        </div>

        <div className="lp-testimonialGrid">

          <div className="lp-testimonialCard">

            <div className="lp-stars">
              ⭐⭐⭐⭐⭐
            </div>

            <p>
              TrustHire AI reduced our hiring time
              by nearly 70%. The AI Trust Score helps
              us identify genuine candidates instantly.
            </p>

            <div className="lp-client">

              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="HR"
              />

              <div>
                <h4>
                  Rahul Shah
                </h4>

                <span>
                  HR Manager, Infosys
                </span>
              </div>

            </div>

          </div>

          <div className="lp-testimonialCard">

            <div className="lp-stars">
              ⭐⭐⭐⭐⭐
            </div>

            <p>
              Resume fraud detection and AI interview
              completely changed our recruitment process.
            </p>

            <div className="lp-client">

              <img
                src="https://randomuser.me/api/portraits/women/63.jpg"
                alt="HR"
              />

              <div>
                <h4>
                  Priya Patel
                </h4>

                <span>
                  Talent Acquisition Lead
                </span>
              </div>

            </div>

          </div>

          <div className="lp-testimonialCard">

            <div className="lp-stars">
              ⭐⭐⭐⭐⭐
            </div>

            <p>
              Beautiful dashboard, accurate candidate
              ranking and excellent analytics.
            </p>

            <div className="lp-client">

              <img
                src="https://randomuser.me/api/portraits/men/22.jpg"
                alt="HR"
              />

              <div>
                <h4>
                  Amit Kumar
                </h4>

                <span>
                  Technical Recruiter
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          FAQ
      ========================= */}
      <section
        className="lp-faq"
        id="faq"
      >

        <div className="lp-sectionTitle">

          <span>
            FREQUENTLY ASKED QUESTIONS
          </span>

          <h2>
            Have Questions?
          </h2>

        </div>

        <div className="lp-faqContainer">

          <div className="lp-faqItem">

            <h3>
              How does AI detect fake resumes?
            </h3>

            <p>
              Our AI analyzes resume content,
              projects, skills, consistency,
              duplicate information, and patterns
              to identify suspicious resumes.
            </p>

          </div>

          <div className="lp-faqItem">

            <h3>
              Can candidates upload PDF resumes?
            </h3>

            <p>
              Yes. Candidates can upload PDF resumes
              which are automatically analyzed by
              the AI engine.
            </p>

          </div>

          <div className="lp-faqItem">

            <h3>
              What is Trust Score?
            </h3>

            <p>
              Trust Score is an AI-generated confidence
              score that evaluates authenticity, skills,
              resume quality, and interview performance.
            </p>

          </div>

          <div className="lp-faqItem">

            <h3>
              Is candidate data secure?
            </h3>

            <p>
              Absolutely. All information is securely
              stored and protected using modern
              security standards.
            </p>

          </div>

        </div>

      </section>

      {/* =========================
          CTA
      ========================= */}
      <section className="lp-CTA">

        <section className="lp-ctaBanner">

          <h2>
            Hire Smarter. Hire Faster.
            Hire with Confidence.
          </h2>

          <p>
            Let AI help you identify genuine talent,
            reduce hiring risks, and simplify recruitment.
          </p>

          <a href="/register">
            <button className="lp-ctaBtn">
              Get Started Free
            </button>
          </a>

          <span className="lp-ctaSpacer">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>

          <a href="/login">
            <button className="lp-ctaBtn lp-secondaryBtn">
              Login
            </button>
          </a>

        </section>

      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="lp-footer">

        <div className="lp-footerTop">

          <div className="lp-footerBrand">

            <img
              src={logo}
              alt="TrustHire AI Logo"
              className="lp-footerLogo"
            />

            <p>
              AI-powered recruitment platform that
              helps organizations hire smarter through
              Resume Screening, Fraud Detection,
              Trust Score, AI Interviews and
              Intelligent ATS.
            </p>

          </div>

          <div className="lp-footerCol">

            <h4>
              Quick links
            </h4>

            <a href="#home">
              About Us
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#solution">
              Solutions
            </a>

            <a href="#workflow">
              Workflow
            </a>

          </div>

          <div className="lp-footerCol">

            <h4>
              Resources
            </h4>

            <a href="#problem">
              Problem
            </a>

            <a href="#faq">
              FAQs
            </a>

          </div>

          <div className="lp-footerCol">

            <h4>
              Contact
            </h4>

            <p>
              Marwadi university, Rajkot,
              Gujarat, India
            </p>

            <p>
              trusthire.ai.official@gmail.com
            </p>

          </div>

        </div>

        <div className="lp-footerBottom">

          <p>
            © 2026 TrustHire AI. All Rights Reserved.
          </p>

          <p>
            Built with ❤️ by Team Tech Titans |
            Intellify 4.0 Hackathon
          </p>

        </div>

      </footer>

    </div>
  );
}

export default LandingPage;