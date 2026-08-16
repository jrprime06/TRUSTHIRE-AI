import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import logo2 from "../assets/logo2.png";
import { Link, useNavigate } from "react-router-dom";


import {
  FaSearch,
  FaBriefcase,
  FaUsers,
  FaRobot,
  FaBell,
  FaUserCircle,
  FaBuilding,
  FaEye,
  FaTimes
} from "react-icons/fa";

import "./HRApplications.css";


function HRApplications() {

const [showAIReport, setShowAIReport] = useState(false);

const [selectedReport, setSelectedReport] = useState(null);

const [showTechnicalModal, setShowTechnicalModal] = useState(false);
const [technicalQuestions, setTechnicalQuestions] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [filteredJobs, setFilteredJobs] = useState([]);


  const [applications, setApplications] = useState([]);

  const [filteredApplications, setFilteredApplications] = useState([]);


  const [selectedJob, setSelectedJob] = useState(null);


  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
const [selectedStatuses, setSelectedStatuses] = useState({});
const [updatingStatus, setUpdatingStatus] = useState(null);

  // Applicant popup search
  const [applicantSearch, setApplicantSearch] = useState("");


  const [showModal, setShowModal] = useState(false);



  const [stats, setStats] = useState({

    totalJobs:0,

    totalApplicants:0,

    reports:0,

    shortlisted:0,

  });



  useEffect(()=>{

    fetchJobs();

  },[]);


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



  // ==============================
  // JOB SEARCH
  // ==============================


  useEffect(()=>{


    const result = jobs.filter((job)=>{


      return (

        job.job_title
        ?.toLowerCase()
        .includes(search.toLowerCase())


        ||

        job.company_name
        ?.toLowerCase()
        .includes(search.toLowerCase())


      );


    });


    setFilteredJobs(result);


  },[search,jobs]);





  // ==============================
  // APPLICANT SEARCH
  // ==============================


  useEffect(()=>{


    const result = applications.filter((app)=>{


      return (

        app.full_name
        ?.toLowerCase()
        .includes(applicantSearch.toLowerCase())


        ||

        app.email
        ?.toLowerCase()
        .includes(applicantSearch.toLowerCase())


        ||

        app.mobile
        ?.toString()
        .includes(applicantSearch)


      );


    });



    setFilteredApplications(result);



  },[applicantSearch,applications]);





const viewTechnicalInterview = async (resumeId) => {

    try {

        const res = await axios.get(
            `http://localhost:5000/api/hr/technical/${resumeId}`
        );

        setTechnicalQuestions(res.data);
        setShowTechnicalModal(true);

    } catch (err) {

        console.log(err);

    }

};

  // ==============================
  // FETCH JOBS
  // ==============================


  const fetchJobs = async()=>{


    try{


      const res = await axios.get(

        "http://localhost:5000/api/hr/jobs"

      );



      setJobs(res.data);


      setFilteredJobs(res.data);



      setStats(prev=>({

        ...prev,

        totalJobs:res.data.length

      }));



    }

    catch(err){


      console.log(err);


    }


    finally{


      setLoading(false);


    }


  };






  // ==============================
  // FETCH APPLICATIONS
  // ==============================


  const fetchApplications = async(job)=>{


    try{


      const res = await axios.get(

        `http://localhost:5000/api/hr/jobs/${job.job_id}/applications`

      );



      setApplications(res.data);


      setFilteredApplications(res.data);



      setSelectedJob(job);


      setShowModal(true);



      setStats(prev=>({

        ...prev,

        totalApplicants:res.data.length


      }));


    }


    catch(err){


      console.log(err);


    }


  };


  // ==============================
// UPDATE APPLICATION STATUS
// ==============================
const updateApplicationStatus = async (resumeId) => {

  const newStatus =
    selectedStatuses[resumeId] ||
    applications.find(app => app.resume_id === resumeId)?.status;

if (!newStatus) {
    alert("Please select a status first.");
    return;
}

    try {

        setUpdatingStatus(resumeId);

        const response = await axios.put(
            `http://localhost:5000/api/hr/applications/${resumeId}/status`,
            {
                status: newStatus
            }
        );

        if (response.data.success) {

            setApplications(prev =>
                prev.map(app =>
                    app.resume_id === resumeId
                        ? {
                            ...app,
                            status: newStatus
                        }
                        : app
                )
            );

            setFilteredApplications(prev =>
                prev.map(app =>
                    app.resume_id === resumeId
                        ? {
                            ...app,
                            status: newStatus
                        }
                        : app
                )
            );

            alert("Application status updated successfully.");

        }

    } catch (error) {

        console.error(
            "STATUS UPDATE ERROR:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Failed to update application status."
        );

    } finally {

        setUpdatingStatus(null);

    }
};






  // ==============================
  // CLOSE MODAL
  // ==============================


  const closeModal = ()=>{


    setShowModal(false);


    setApplications([]);


    setFilteredApplications([]);


    setSelectedJob(null);


    setApplicantSearch("");


  };






  const generateReport=(resumeId)=>{


    alert(

      "Generate Report : "+resumeId

    );


  };






  if(loading){


    return(

      <div className="loading">

        Loading Dashboard...

      </div>

    );


  }






  return(


    <div className="dashboard">


      {/* NAVBAR */}

      <nav className="navbar">


        <div className="logo">


         


          <div>


           <img
            src={logo}
            alt="TrustHire AI"
            className="navLogo"
        />


          </div>


        </div>




        <div className="navbarRight">


          <div className="searchBar">


            <FaSearch/>


            <input

              type="text"

              placeholder="Search Job..."

              value={search}

              onChange={(e)=>
                setSearch(e.target.value)
              }

            />


          </div>



          <FaBell className="notifyIcon"/>




          <div className="profile">


            <FaUserCircle className="profileIcon"/>


            <div>


              <h4>HR Manager</h4>


            <span>
  {user ? user.username : "Administrator"}
</span>


            </div>


          </div>


        </div>


      </nav>
            {/* ================= HERO ================= */}

      <section className="hero">

        <div>

          <h1>
            HR Recruitment Decision Dashboard
          </h1>

        </div>

      </section>





    








      {/* ================= JOB POSTS ================= */}


      <div className="sectionTitle">


        <h2>
          Available Job Posts
        </h2>


        <span>
          {filteredJobs.length} Jobs
        </span>


      </div>





      <div className="jobGrid">


        {
          filteredJobs.map((job)=>(


            <div
              className="jobCard"
              key={job.job_id}
            >


              <div className="jobHeader">


                <span className="jobStatus">

                  {job.status}

                </span>


              </div>




              <h2>
                {job.job_title}
              </h2>



              <h3>
                {job.company_name}
              </h3>



              




              <button

                className="viewBtn"

                onClick={()=>fetchApplications(job)}

              >


                <FaEye/>

                View Applications


              </button>



            </div>


          ))

        }


      </div>










      {/* ================= APPLICATION MODAL ================= */}


      {showModal && (


        <div className="modalOverlay">


          <div className="applicationModal">



            {/* HEADER */}


            <div className="modalHeader">


              <div>


                <h2>
                  {selectedJob?.job_title}
                </h2>


                <p>
                  {selectedJob?.company_name}
                </p>


              </div>





              <button

                className="closeBtn"

                onClick={closeModal}

              >

                <FaTimes/>

              </button>



            </div>







            {/* APPLICANT SEARCH BAR */}



            <div className="applicantSearchBox">


              <FaSearch/>


              <input


                type="text"


                placeholder=
                "Search applicant by name, email or mobile..."



                value={applicantSearch}



                onChange={(e)=>
                  setApplicantSearch(e.target.value)
                }



              />


            </div>









            {/* COUNT */}


            <div className="modalInfo">


              <div className="infoCard">


                <FaUsers/>


                <div>


                  <h3>
                    {filteredApplications.length}
                  </h3>


                  <span>
                    Applicants Found
                  </span>


                </div>


              </div>


            </div>









            {/* APPLICANTS */}


            <div className="applicantList">



            {

              filteredApplications.length===0 ? (


                <div className="noApplications">


                  <h2>
                    No Applications Found
                  </h2>


                  <p>
                    No candidate matches your search.
                  </p>


                </div>



              )



              :



              filteredApplications.map((app)=>(



              <div

                className="applicantCard"

                key={app.resume_id}

              >





                {/* Candidate Information */}


                <div className="candidateInfo">



                  





                  <div>


                    <h2>
                      {app.full_name}
                    </h2>




                    <p>

                      <strong>
                        Email :
                      </strong>

                      {" "}

                      {app.email}

                    </p>




                    <p>

                      <strong>
                        Mobile :
                      </strong>

                      {" "}

                      {app.mobile}

                    </p>




<div className="candidateStatusSection">

    <label>Application Status</label>

    <div className="statusUpdateRow">

       <select
    className="applicationStatusSelect"
    value={
        selectedStatuses[app.resume_id] ??
        app.status ??
        ""
    }
    onChange={(e) => {

        setSelectedStatuses(prev => ({
            ...prev,
            [app.resume_id]: e.target.value
        }));

    }}
>

    <option value="" >
        Select Status
    </option>

    <option value="Downloaded">
        Downloaded
    </option>

    <option value="Under Review">
        Under Review
    </option>

    <option value="Reviewed - Will Get a Mail">
        Reviewed - Will Get a Mail
    </option>

</select>


        <button
            type="button"
            className="updateStatusBtn"
            onClick={() =>
                updateApplicationStatus(app.resume_id)
            }
            disabled={
                updatingStatus === app.resume_id
            }
        >

            {updatingStatus === app.resume_id
                ? "Updating..."
                : "Update Status"}

        </button>

    </div>

</div>




                  </div>



                </div>





{/* ACTION BUTTONS */}

<div className="candidateActions">


              



                <a
  href={`http://localhost:5000/api/hr/${app.resume_id}/pdf`}
  target="_blank"
  rel="noreferrer"
  className="resumeBtn"
>
  Resume PDF
</a>





                  <a


                    href=
                    {
                      `http://localhost:5000/api/jobs/pdf/${selectedJob.job_id}/`
                    }


                    target="_blank"


                    rel="noreferrer"


                    className="jobBtn"


                  >


                    Job PDF


                  </a>







                  <button
    className="reportBtn"
    onClick={() => {
        setSelectedReport(app);
        setShowAIReport(true);
    }}
>
    View AI Report
</button>
<button
    className="reportBtn"
    onClick={() => viewTechnicalInterview(app.resume_id)}
>
    View Technical Interview
</button>


                </div>





              </div>



              ))




            }



            </div>

            

{showAIReport && selectedReport && (

<div className="modalOverlay">

    <div className="aiReportModal">

        <div className="modalHeader">

            <div>

                <h2>AI Resume Evaluation</h2>

                <p>{selectedReport.full_name}</p>

            </div>

            <button
                className="closeBtn"
                onClick={()=>{
                    setShowAIReport(false);
                    setSelectedReport(null);
                }}
            >
                <FaTimes/>
            </button>

        </div>

        <div className="scoreGrid">

           <div
  className="scoreCard"
  style={{
    border: "2px solid #ef4444",
    background: "linear-gradient(135deg, #fff5f5, #ffffff)",
    boxShadow: "0 0 20px rgba(239, 68, 68, 0.25)",
    borderRadius: "12px",
    padding: "20px",
    position: "relative"
  }}
>
  <span style={{
    color: "#b91c1c",
    fontWeight: "700"
  }}>
    ⚠ Fraud Score
  </span>

  <h3 style={{
    color: "#dc2626",
    fontSize: "32px",
    fontWeight: "800",
    marginTop: "8px"
  }}>
    {selectedReport.fraud_score}%
  </h3>
</div>
            

            <div className="scoreCard">
                <span>TrustHire ATS Score</span>
                <h3>{selectedReport.ats_score}%</h3>
            </div>

            <div className="scoreCard">
                <span>Skill Score</span>
                <h3>{selectedReport.skill_score}%</h3>
            </div>

            <div className="scoreCard">
                <span>Trust Score</span>
                <h3>{selectedReport.trust_score}%</h3>
            </div>

           

            <div className="scoreCard">
                <span>Plagiarism</span>
                <h3>{selectedReport.plagiarism_score}%</h3>
            </div>

        </div>

        <div className="recommendationBox">

            <h1>AI Hiring Decision</h1>

            <h2>{selectedReport.recommendation}</h2>

        </div>

        <div className="skillSection">
<hr></hr><br></br>
            <h3>Matched Skills</h3>

            <div className="skillList">

                {
                    selectedReport.matched_skills &&
                    JSON.parse(selectedReport.matched_skills).map((skill,index)=>(

                        <span
                            key={index}
                            className="matchedSkill"
                        >
                            {skill}
                        </span>

                    ))
                }

            </div>

        </div>

        <div className="skillSection">
<hr></hr><br></br>
            <h3>Missing Skills</h3>

            <div className="skillList">

                {
                    selectedReport.missing_skills &&
                    JSON.parse(selectedReport.missing_skills).map((skill,index)=>(

                        <span
                            key={index}
                            className="missingSkill"
                        >
                            {skill}
                        </span>

                    ))
                }

            </div>

        </div>

        <div className="skillSection">
<hr></hr><br></br>
            <h3>Resume Skills</h3>

            <div className="skillList">

                {
                    selectedReport.resume_skills &&
                    JSON.parse(selectedReport.resume_skills).map((skill,index)=>(

                        <span
                            key={index}
                            className="resumeSkill"
                        >
                            {skill}
                        </span>

                    ))
                }

            </div>

        </div>

        <div className="skillSection">
<hr></hr><br></br>
            <h3>AI REPORT EXPLANIBILITY</h3>

            <pre
  style={{
    whiteSpace: "pre-wrap",
    fontFamily: "Arial",
    lineHeight: "1.8"
  }}
>
  {selectedReport.shap_json}
</pre>

        </div>

    </div>

</div>

)
}
          </div>


        </div>


        )

      }



      

{showTechnicalModal && (

<div className="modalOverlay">

    <div className="technicalModal">

        <div className="modalHeader">

            <h2>Technical Interview Questions</h2>

            <button
                className="closeBtn"
                onClick={() => setShowTechnicalModal(false)}
            >
                <FaTimes/>
            </button>

        </div>

        {
            technicalQuestions.length === 0 ?

            (
                <div className="noApplications">
                    <h3>No Technical Interview Found</h3>
                </div>
            )

            :

            technicalQuestions.map((item,index)=>(

                <div
                    className="questionCard"
                    key={index}
                >

                    <h3>
                        Q{index+1}. {item.question}
                    </h3>

                    <p>
                        <strong>Answer :</strong>
                    </p>

                    <div className="answerBox">

                        {item.answer}

                    </div>

                </div>

            ))
        }

    </div>

</div>

)
}






    </div>


  );


}


export default HRApplications;