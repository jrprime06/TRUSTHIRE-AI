import React, { useState, useMemo, useEffect } from "react";import "./HRCandidate.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";


function HRCandidate() {

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


  

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const candidatesPerPage = 10;

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // ===============================
  // Fetch Candidates
  // ===============================

  const fetchCandidates = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/candidates"
      );

      const data = await response.json();

      setCandidates(data);

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCandidates();

  }, []);

  // ===============================
  // Search & Filter
  // ===============================

  const filteredCandidates = useMemo(() => {

    return candidates.filter((candidate) => {

      const fullName =
        `${candidate.first_name} ${candidate.last_name}`.toLowerCase();

      const email =
        (candidate.email || "").toLowerCase();

      const matchesSearch =

        fullName.includes(searchTerm.toLowerCase()) ||

        email.includes(searchTerm.toLowerCase());

      const matchesStatus =

        statusFilter === "All" ||

        candidate.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [candidates, searchTerm, statusFilter]);

  // ===============================
  // Pagination
  // ===============================

  const totalPages = Math.ceil(

    filteredCandidates.length /

    candidatesPerPage

  );

  const indexOfLastCandidate =

    currentPage * candidatesPerPage;

  const indexOfFirstCandidate =

    indexOfLastCandidate -

    candidatesPerPage;

  const currentCandidates =

    filteredCandidates.slice(

      indexOfFirstCandidate,

      indexOfLastCandidate

    );

  // ===============================
  // View Candidate
  // ===============================

  const viewCandidate = (candidate) => {

    setSelectedCandidate(candidate);

    setShowModal(true);

  };
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
          <Link to="/HRCandidate" className="active">Candidates</Link>
          <Link to="/HRJobpost">Job Posts</Link>
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
          J
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

      <div className="candidate-header">

        <div>

          <h1>
            Candidate Management
          </h1>

          <p>
            View and manage all registered candidates.
          </p>

        </div>

      </div>

      {/* ================= Toolbar ================= */}

      <div className="candidate-toolbar">

        <input

          type="text"

          placeholder="🔍 Search by Name or Email..."

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

          <option value="All">
            All
          </option>

          <option value="Verified">
            Verified
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Rejected">
            Rejected
          </option>

        </select>

      </div>

      {/* ================= Table ================= */}

      <div className="hr-table-card">

        <div className="hr-table-header">

          <h3>

            Candidate List

          </h3>

          <span>

            {filteredCandidates.length}

            {" "}Candidates

          </span>

        </div>

        {

          loading ?

          (

            <div className="loading">

              Loading Candidates...

            </div>

          )

          :

          (

            <div className="hr-table-wrapper">

              <table className="hr-table">

                <thead>

                  <tr>

                    <th>Candidate</th>

                    <th>Email</th>

                    <th>Mobile</th>

                    <th>Gender</th>

                    <th>DOB</th>

                    <th>Created</th>

                   

                    <th>Status</th>

                    <th>Action</th>

                    

                  </tr>

                </thead>

                <tbody>
                    {currentCandidates.length === 0 ? (

  <tr>

    <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
      No Candidates Found
    </td>

  </tr>

) : (

  currentCandidates.map((candidate) => (

    <tr key={candidate.candidate_id}>

      <td>

        <div className="hr-candidate-cell">

          <img

            src={`http://localhost:5000/api/candidates/photo/${candidate.candidate_id}`}

            alt="Candidate"

            className="candidate-photo"

            onError={(e) => {

              e.target.src =
                "https://ui-avatars.com/api/?name=" +
                candidate.first_name +
                "+" +
                candidate.last_name;

            }}

          />

          <div>

            <h4>

              {candidate.first_name} {candidate.last_name}

            </h4>

            <span>

              ID : {candidate.candidate_id}

            </span>

          </div>

        </div>

      </td>

      <td>{candidate.email}</td>

      <td>{candidate.mobile}</td>

      <td>{candidate.gender}</td>

      <td>

        {

          candidate.dob

          ?

          new Date(candidate.dob)

            .toLocaleDateString()

          :

          "-"

        }

      </td>

      <td>

        {

          new Date(candidate.created_at)

          .toLocaleDateString()

        }

      </td>

    
        <td>{candidate.status}</td>

      <td>

        <button

          className="hr-btn-view"

          onClick={() =>

            viewCandidate(candidate)

          }

        >

          View

        </button>

      </td>

    </tr>

  ))

)}

</tbody>

</table>

</div>

)}

{/* ================= Candidate Details Popup ================= */}

{

showModal && selectedCandidate && (

<div className="popup-overlay">

<div className="popup">

<div className="popup-header">

<h2>

Candidate Details

</h2>

<button

className="popup-close"

onClick={() => setShowModal(false)}

>

✕

</button>

</div>

<div className="candidate-details">

<div className="candidate-image">

<img

src={`http://localhost:5000/api/candidates/photo/${selectedCandidate.candidate_id}`}

alt="Candidate"

onError={(e)=>{

e.target.src="https://ui-avatars.com/api/?name="+selectedCandidate.first_name;

}}

 />

</div>

<div className="candidate-info">

<p>

<strong>Name :</strong>{" "}

{selectedCandidate.first_name}{" "}

{selectedCandidate.last_name}

</p>

<p>

<strong>Email :</strong>{" "}

{selectedCandidate.email}

</p>

<p>

<strong>Mobile :</strong>{" "}

{selectedCandidate.mobile}

</p>

<p>

<strong>Gender :</strong>{" "}

{selectedCandidate.gender}

</p>

<p>

<strong>DOB :</strong>{" "}

{

selectedCandidate.dob

?

new Date(selectedCandidate.dob)

.toLocaleDateString()

:

"-"

}

</p>

<p>

<strong>User ID :</strong>{" "}

{selectedCandidate.user_id}

</p>

<p>

<strong>Created :</strong>{" "}

{

new Date(selectedCandidate.created_at)

.toLocaleDateString()

}

</p>

</div>

</div>

</div>

</div>

)

}
      {/* ================= Footer ================= */}

      <div className="candidate-footer">

        <p>

          Showing{" "}

          <strong>

            {

              filteredCandidates.length === 0

                ? 0

                : indexOfFirstCandidate + 1

            }

          </strong>

          {" - "}

          <strong>

            {

              Math.min(

                indexOfLastCandidate,

                filteredCandidates.length

              )

            }

          </strong>

          {" of "}

          <strong>

            {filteredCandidates.length}

          </strong>

          {" Candidates"}

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

    </div>

  </main>

</div>

);

}

export default HRCandidate;