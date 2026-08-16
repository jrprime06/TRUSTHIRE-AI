import React, { useEffect, useMemo, useState } from "react";
import "./HRJobpost.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

function HRJobpost() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    job_description: "",
    last_date: "",
    status: "Open",
    pdf: null
  });

  
  // ===============================
  // States
  // ===============================

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


const formatJobDate = (date) => {
  if (!date) return "--";

  const dateString = String(date);

  // If backend sends only YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  // If backend sends ISO timestamp
  const parsedDate = new Date(dateString);

  if (isNaN(parsedDate.getTime())) return "--";

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

  // =============================
  // Fetch Jobs
  // =============================

  const fetchJobs = async () => {

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/jobs"
      );

      const data = await response.json();
      const jobsData =
        Array.isArray(data) ? data :
        Array.isArray(data?.jobs) ? data.jobs :
        [];

      setJobs(jobsData);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchJobs();

  }, []);

  // =============================
  // Search
  // =============================

  const filteredJobs = useMemo(() => {

    return Array.isArray(jobs) ? jobs.filter((job) => {

      const company =
        (job.company_name || "").toLowerCase();

      const title =
        (job.job_title || "").toLowerCase();

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        company.includes(search) ||
        title.includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;

    }) : [];

  }, [jobs, searchTerm, statusFilter]);

  // =============================
  // Pagination
  // =============================

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  const indexOfLastJob =
    currentPage * jobsPerPage;

  const indexOfFirstJob =
    indexOfLastJob - jobsPerPage;

  const currentJobs =
    filteredJobs.slice(
      indexOfFirstJob,
      indexOfLastJob
    );

  // =============================
  // Input Change
  // =============================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  // =============================
  // PDF Change
  // =============================

  const handleFile = (e) => {

    setFormData((prev) => ({

      ...prev,

      pdf: e.target.files[0]

    }));

  };

  // =============================
  // Open Create Popup
  // =============================

  const openCreatePopup = () => {

    setIsEdit(false);

    setSelectedJob(null);

    setFormData({

      company_name: "",

      job_title: "",

      job_description: "",
      last_date: "",

      status: "Open",

      pdf: null

    });

    setShowPopup(true);

  };

  // =============================
  // Open Edit Popup
  // =============================

  const openEditPopup = (job) => {

    setIsEdit(true);

    setSelectedJob(job);

    setFormData({

      company_name: job.company_name,

      job_title: job.job_title,

      job_description: job.job_description,

      status: job.status,
      last_date: job.last_date
  ? (() => {
      const dateString = String(job.last_date);

      // Already YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      // ISO timestamp → local date
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return "";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    })()
  : "",
      pdf: null

    });

    setShowPopup(true);

  };

    // =============================
  // Create / Update Job
  // =============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append("company_name", formData.company_name);
      data.append("job_title", formData.job_title);
      data.append("job_description", formData.job_description);
      data.append("last_date", formData.last_date);
      data.append("status", formData.status);

      if (formData.pdf) {
        data.append("pdf", formData.pdf);
      }

      let url = "http://localhost:5000/api/jobs";
      let method = "POST";

      if (isEdit) {

        url = `http://localhost:5000/api/jobs/${selectedJob.job_id}`;
        method = "PUT";

      }

      const response = await fetch(url, {

        method,
        body: data

      });

      const result = await response.json();

      if (!response.ok) {

        alert(result.message || "Something went wrong");
        return;

      }

      alert(result.message);

      setShowPopup(false);

      fetchJobs();

    }

    catch (err) {

      console.log(err);

      alert("Unable to connect to server.");

    }

  };

  // =============================
  // Delete Job
  // =============================

  const deleteJob = async (id) => {

    if (!window.confirm("Delete this job?")) return;

    try {

      await fetch(

        `http://localhost:5000/api/jobs/${id}`,

        {

          method: "DELETE"

        }

      );

      fetchJobs();

    }

    catch (err) {

      console.log(err);

    }

  };

  // =============================
  // View PDF
  // =============================

  const viewPDF = (id) => {

    window.open(

      `http://localhost:5000/api/jobs/pdf/${id}`,

      "_blank"

    );

  };

  // =============================
  // JSX
  // =============================

  return (

    <div className="hr-dashboard-layout">

      {/* ================= Top Navigation ================= */}

      <header className="hr-top-nav">

        <div className="hr-logo">

          <img

            src={logo}

            alt="TrustHire AI"

            className="hr-brand-logo"

          />

        </div>

        <nav className="hr-nav-links">

          <Link to="/HRDashboard" >Dashboard</Link>
                   <Link to="/HRCandidate">Candidates</Link>
                   <Link to="/HRJobpost" className="active">Job Posts</Link>
                   <Link to="/HRApplications">Applications</Link>
         
                   <Link to="/HRReport">Reports</Link>
                      <Link to="/hrprofile">
                             Profile</Link>
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

            R

          </div>

          <div className="hr-profile-info">

            <span className="hr-name">

              HR Manager

            </span>

            <span>
  {user ? user.username : "Administrator"}
</span>

          </div>

        </div>

      </header>

      {/* ================= Main ================= */}

      <main className="hr-main-content">

        <div className="job-header">

          <div>

            <h1>

              Job Posts

            </h1>

            <p>

              Manage all company job openings

            </p>

          </div>

          <button

            className="create-job-btn"

            onClick={openCreatePopup}

          >

            + Create Job

          </button>

        </div>

        {/* ================= Search ================= */}

        <div className="job-toolbar">

          <input

            type="text"

            placeholder="🔍 Search company or job title..."

            value={searchTerm}

            onChange={(e) => {

              setSearchTerm(e.target.value);

              setCurrentPage(1);

            }}

          />

          <select

            value={statusFilter}

            onChange={(e) => {

              setStatusFilter(e.target.value);

              setCurrentPage(1);

            }}

          >

            <option>All</option>

            <option>Open</option>

            <option>Closed</option>

          </select>

        </div>
                {/* ================= Loading ================= */}

        {

          loading ?

          (

            <div className="loading">

              Loading Jobs...

            </div>

          )

          :

          (

            <>

              {/* ================= Job Cards ================= */}

              <div className="job-grid">

                {

                  currentJobs.length === 0 ?

                  (

                    <div className="no-jobs">

                      No Job Posts Found

                    </div>

                  )

                  :

                  currentJobs.map((job) => (

                    <div

                      className="job-card"

                      key={job.job_id}

                    >

                      <div className="job-card-header">

                        <h3>

                          {job.company_name}

                        </h3>

                        <span

                          className={`job-status ${

                            job.status === "Open"

                              ? "open"

                              : "closed"

                          }`}

                        >

                          {job.status}

                        </span>

                      </div>

                      <h2>

                        {job.job_title}

                      </h2>

                      <p className="job-description">

                        {

                          job.job_description &&

                          job.job_description.length > 120

                          ?

                          job.job_description.substring(0,120) + "..."

                          :

                          job.job_description

                        }

                      </p>

                      <div className="job-date">

                        <span>

                          📅 Posted

                        </span>

                        <span>

                          {

                            job.created_at

                            ?

                            new Date(job.created_at)

                            .toLocaleDateString()

                            :

                            "--"

                          }

                        </span>

                      </div>

                      <div
  style={{
    marginTop: "8px",
    color: "red",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <span>⏰ Last Date</span>
 <span>
  {formatJobDate(job.last_date)}
</span>
</div>

                      <div className="job-actions">

                        <button

                          className="pdf-btn"

                          onClick={() =>

                            viewPDF(job.job_id)

                          }

                        >

                          📄 View PDF

                        </button>

                        <button

                          className="edit-btn"

                          onClick={() =>

                            openEditPopup(job)

                          }

                        >

                          Edit

                        </button>

                        <button

                          className="delete-btn"

                          onClick={() =>

                            deleteJob(job.job_id)

                          }

                        >

                          Delete

                        </button>

                      </div>

                    </div>

                  ))

                }

              </div>

              {/* ================= Create / Edit Popup ================= */}

              {

                showPopup &&

                (

                  <div className="popup-overlay">

                    <div className="popup">

                      <div className="popup-header">

                        <h2>

                          {

                            isEdit

                            ?

                            "Edit Job"

                            :

                            "Create Job"

                          }

                        </h2>

                        <button

                          className="popup-close"

                          onClick={() =>

                            setShowPopup(false)

                          }

                        >

                          ✕

                        </button>

                      </div>

                      <form

                        className="job-form"

                        onSubmit={handleSubmit}

                      >

                        <div className="form-group">

                          <label>

                            Company Name

                          </label>

                          <input

                            type="text"

                            name="company_name"

                            value={formData.company_name}

                            onChange={handleChange}

                            required

                          />

                        </div>

                        <div className="form-group">

                          <label>

                            Job Title

                          </label>

                          <input

                            type="text"

                            name="job_title"

                            value={formData.job_title}

                            onChange={handleChange}

                            required

                          />

                        </div>

                        <div className="form-group">

                          <label>

                            Job Description

                          </label>

                          <textarea

                            rows="6"

                            name="job_description"

                            value={formData.job_description}

                            onChange={handleChange}

                            required

                          />

                        </div>



                        <div className="form-group">
  <label>Last Date to Apply</label>
  <input
    type="date"
    name="last_date"
    value={formData.last_date}
    onChange={handleChange}
    required
  />
</div>



                        <div className="form-group">

                          <label>

                            Status

                          </label>

                          <select

                            name="status"

                            value={formData.status}

                            onChange={handleChange}

                          >

                            <option value="Open">

                              Open

                            </option>

                            <option value="Closed">

                              Closed

                            </option>

                          </select>

                        </div>

                        <div className="form-group">

                          <label>

                            Upload PDF

                          </label>

                          <input

                            type="file"

                            accept=".pdf"

                            onChange={handleFile}

                            required={!isEdit}

                          />

                          {

                            isEdit &&

                            <small>

                              Leave empty to keep the existing PDF.

                            </small>

                          }

                        </div>

                        <div className="popup-buttons">

                          <button

                            type="button"

                            className="cancel-btn"

                            onClick={() =>

                              setShowPopup(false)

                            }

                          >

                            Cancel

                          </button>

                          <button

                            type="submit"

                            className="save-btn"

                          >

                            {

                              isEdit

                              ?

                              "Update Job"

                              :

                              "Create Job"

                            }

                          </button>

                        </div>

                      </form>

                    </div>

                  </div>

                )

              }

            </>

          )

        }
                {/* ================= Pagination ================= */}

        <div className="candidate-footer">

          <p>

            Showing

            <strong>

              {filteredJobs.length === 0
                ? 0
                : indexOfFirstJob + 1}

            </strong>

            {" - "}

            <strong>

              {Math.min(
                indexOfLastJob,
                filteredJobs.length
              )}

            </strong>

            {" of "}

            <strong>

              {filteredJobs.length}

            </strong>

            {" Job Posts"}

          </p>

          <div className="pagination">

            <button

              disabled={currentPage === 1}

              onClick={() =>

                setCurrentPage(currentPage - 1)

              }

            >

              Previous

            </button>

            {

              [...Array(totalPages)].map((_, index) => (

                <button

                  key={index}

                  className={

                    currentPage === index + 1

                      ? "active-page"

                      : ""

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

              disabled={

                currentPage === totalPages ||

                totalPages === 0

              }

              onClick={() =>

                setCurrentPage(currentPage + 1)

              }

            >

              Next

            </button>

          </div>

        </div>

      </main>

    </div>

  );

}

export default HRJobpost;