import React, { useState, useEffect } from "react";
import "./AdminDash.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";




import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function AdminDash() {
  // State to track flip (false = Candidate [Front], true = HR [Back])
  const [isFlipped, setIsFlipped] = useState(false);

  const [dashboard, setDashboard] = useState(null);

const [recentHR, setRecentHR] = useState([]);

const [loading, setLoading] = useState(true);



// api



const fetchDashboard = async () => {

    try {

        const response = await fetch("http://localhost:5000/api/admin/dashboard");

        const data = await response.json();

        if(data.success){

            setDashboard(data);

        }

    }

    catch(err){

        console.log(err);

    }

};

// recent hr fetch

const fetchRecentHR = async () => {

    try{

        const response = await fetch("http://localhost:5000/api/hr/recent");

        const data = await response.json();

        if(data.success){

            setRecentHR(data.data);

        }

    }

    catch(err){

        console.log(err);

    }

};

//logout
  
      const navigate = useNavigate();
  
  const handleLogout = () => {
  
       sessionStorage.clear();   // or localStorage.clear() if you're using localStorage
    navigate("/login");
  };

// useEffect to fetch dashboard data on component mount

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




useEffect(()=>{

    const loadData = async()=>{

        setLoading(true);

        await Promise.all([

            fetchDashboard(),

            fetchRecentHR()

        ]);

        setLoading(false);

    };

    loadData();

},[]);



  /* ================= Statistics Data ================= */
 const totalHR = dashboard?.totalHR || 0;

const totalCandidates = dashboard?.totalCandidates || 0;

const totalJobs = dashboard?.totalJobs || 0;

const verifiedCandidates = dashboard?.verifiedCandidates || 0;

  const adminStats = [
    {
      id: 1,
      title: "Total HR",
      value: totalHR,
      color: "#2563EB",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Candidates",
      value: totalCandidates,
      color: "#16A34A",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Job Posts",
      value: totalJobs,
      color: "#CA8A04",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Verified Candidates",
      value: verifiedCandidates,
      color: "#DC2626",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      ),
    },
  ];

  /* ================= Candidate Pie Chart ================= */
const candidateChartData = [
    {
        name: "Verified",
        value: Number(dashboard?.candidateChart?.verified || 0)
    },
    {
        name: "Pending",
        value: Number(dashboard?.candidateChart?.pending || 0)
    },
    {
        name: "Rejected",
        value: Number(dashboard?.candidateChart?.rejected || 0)
    }
];

  /* ================= HR Pie Chart ================= */
 const hrChartData = [
    {
        name: "Active",
        value: Number(dashboard?.hrChart?.active || 0)
    },
    {
        name: "Inactive",
        value: Number(dashboard?.hrChart?.inactive || 0)
    }
];

if(loading){

    return(

        <div
        style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            height:"100vh",
            fontSize:"24px",
            fontWeight:"600"
        }}
        >

            Loading Dashboard...

        </div>

    );

}

  const COLORS = ["#22C55E", "#F59E0B", "#EF4444"];
  const HR_COLORS = ["#2563EB", "#94A3B8"];

  return (
    <div className="hr-dashboard-layout">
      {/* Top Navigation Bar */}
      <header className="hr-top-nav">
        <div className="hr-logo">
          <img src={logo} alt="TrustHire AI Logo" className="hr-brand-logo" />
        </div>

        <nav className="hr-nav-links">
          <Link to="/AdminDash" className="active">
            Dashboard
          </Link>
          <Link to="/ManageHR">Manage HR</Link>
          <Link to="/AdminJobPost">Job Posts</Link>
          <Link to="/AdminReports">Reports</Link>
            <Link
    to="/login"
    onClick={handleLogout}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    Logout
  </Link>
        </nav>

        <div className="hr-profile">
          <div className="hr-avatar">A</div>
          <div className="hr-profile-info">
           
            <span className="hr-name">
              Admin
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="hr-main-content">
        {/* TOP ROW */}
        <div className="hr-top-row">
          {/* Left Column */}
          <div className="hr-left-col">
            <div className="hr-welcome-header">
              <div>
                <h1>Welcome Back, Admin 👋</h1>
                <p>
                  Monitor HR activities, candidates and job postings from one place.
                </p>
              </div>
            </div>

            {/* 2x2 Stats Grid */}
            <div className="hr-stats-grid">
              {adminStats.map((stat) => (
                <div className="hr-stat-card" key={stat.id}>
                  <div
                    className="hr-stat-icon"
                    style={{
                      backgroundColor: `${stat.color}15`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div className="hr-stat-info">
                    <h2>{stat.value}</h2>
                    <p>{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Flip Card Container) */}
          <div className="hr-right-col">
            <div
              className={`flip-card ${isFlipped ? "flipped" : ""}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flip-card-inner">
                {/* FRONT: Candidate Analysis */}
                <div className="flip-card-front hr-chart-card">
                  <div className="flip-card-header">
                    <h3>Candidate Analysis</h3>
                    <span className="flip-hint">Click to flip 🔄</span>
                  </div>

                  <div className="hr-pie-container">
                   <div className="hr-pie-container">
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={candidateChartData}
        cx="50%"
        cy="50%"
        innerRadius={50}
        outerRadius={80}
        paddingAngle={4}
        dataKey="value"
      >
        {candidateChartData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index]}
          />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>

                    <div className="hr-legend">
  {candidateChartData.map((item, index) => (
    <div className="hr-legend-item" key={index}>
      <div className="hr-legend-name">
        <span
          className="hr-legend-dot"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        ></span>
        {item.name}
      </div>
      <div className="hr-legend-value">{item.value}</div>
    </div>
  ))}
</div>
                  </div>
                </div>

                {/* BACK: HR Analysis */}
                <div className="flip-card-back hr-chart-card">
                  <div className="flip-card-header">
                    <h3>HR Analysis</h3>
                    <span className="flip-hint">Click to flip 🔄</span>
                  </div>

                  <div className="hr-pie-container">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={hrChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {hrChartData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={HR_COLORS[index % HR_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="hr-legend">
                      {hrChartData.map((item, index) => (
                        <div className="hr-legend-item" key={index}>
                          <div className="hr-legend-name">
                            <span
                              className="hr-legend-dot"
                              style={{
                                backgroundColor: HR_COLORS[index % HR_COLORS.length],
                              }}
                            ></span>
                            {item.name}
                          </div>
                          <div className="hr-legend-value">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="hr-bottom-row">
          <div className="hr-table-card">
            <div className="hr-table-header">
              <div>
                <h3>Recent HR Accounts</h3>
                <p style={{ fontSize: "13px", color: "#64748B", marginTop: "2px" }}>
                  Recently added HR members
                </p>
              </div>
              <Link to="/ManageHR" className="hr-view-all-link">
                <button className="hr-view-all">View All &rarr;</button>
              </Link>
            </div>

            <div className="hr-table-wrapper">
              <table className="hr-table">
                <thead>
                  <tr>
                    <th>HR Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Reviewed</th>
                    <th>Joined</th>
                  </tr>
                </thead>
               <tbody>
  {recentHR.length > 0 ? (
    recentHR.map((hr) => (
      <tr key={hr.hr_id}>
        <td>
          <div className="hr-candidate-cell">
            <div className="admin-avatar">
              {hr.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h4>{hr.username}</h4>
            </div>
          </div>
        </td>

        <td>{hr.email}</td>

        <td>
          <span
            className={`hr-status hr-${
              hr.status === "active" ? "verified" : "rejected"
            }`}
          >
            {hr.status === "active" ? "Active" : "Inactive"}
          </span>
        </td>

        <td>--</td>

        <td>
          {new Date(hr.created_at).toLocaleDateString()}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        No HR Found
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDash;