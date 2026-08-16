import React, { useState, useEffect } from "react";
import { Link , useNavigate} from "react-router-dom";
import "./ManageHR.css";
import logo from "../assets/logo.png";

import {
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaTimes,
} from "react-icons/fa";

function ManageHR() {

  // ----------------------------
  // States
  // ----------------------------

  
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

  const [editingHR, setEditingHR] = useState(null);

const [editData, setEditData] = useState({

    username: "",
    email: "",
    company_name: "",
    designation: "",
    status: "active"

});

  const [hrList, setHrList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [view, setView] = useState("cards");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    company_name: "",
    designation: "",
  });

  // ----------------------------
  // Fetch HR List
  // ----------------------------

  const fetchHR = async () => {
    try {

      const response = await fetch(
        "http://localhost:5000/api/hr/all"
      );

      const data = await response.json();

      if (data.success) {
        setHrList(data.data);
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchHR();
  }, []);

  // ----------------------------
  // Input Change
  // ----------------------------

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  // ----------------------------
  // Add HR
  // ----------------------------

  const addHR = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/hr/add",
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify(formData),

        }
      );

      const data = await response.json();

      alert(data.message);

      if (data.success) {

        fetchHR();

        setFormData({

          username: "",
          email: "",
          company_name: "",
          designation: "",

        });

        setShowModal(false);

      }

    } catch (error) {

      console.log(error);

      alert("Server Error");

    }

  };


  // edit hr

  const openEdit = (hr) => {

    setEditingHR(hr);

    setEditData({

        username: hr.username,
        email: hr.email,
        company_name: hr.company_name,
        designation: hr.designation,
        status: hr.status

    });

};
// update hr

const updateHR = async () => {

    const response = await fetch(

        `http://localhost:5000/api/hr/update/${editingHR.hr_id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(editData)

        }

    );

    const data = await response.json();

    alert(data.message);

    if (data.success) {

        fetchHR();

        setEditingHR(null);

    }

};

// delete hr

const deleteHR = async (id) => {

    if (!window.confirm("Delete this HR?"))
        return;

    const response = await fetch(

        `http://localhost:5000/api/hr/delete/${id}`,

        {

            method: "DELETE"

        }

    );

    const data = await response.json();

    alert(data.message);

    if (data.success) {

        fetchHR();

    }

};

  // ----------------------------
  // Search
  // ----------------------------

  const filteredHR = hrList.filter((hr) =>

    hr.username.toLowerCase().includes(search.toLowerCase()) ||

    hr.email.toLowerCase().includes(search.toLowerCase()) ||

    hr.company_name.toLowerCase().includes(search.toLowerCase())

  );

  // ----------------------------
  // Statistics
  // ----------------------------

  const totalHR = hrList.length;

  const activeHR = hrList.filter(
    (hr) => hr.status === "active"
  ).length;

  const inactiveHR = hrList.filter(
    (hr) => hr.status === "inactive"
  ).length;
    return (
    <div className="manage-hr-container">

      {/* ========================= NAVBAR ========================= */}

      <header className="hr-top-nav">

        <div className="hr-logo">
          <img
            src={logo}
            alt="TrustHire AI"
            className="hr-brand-logo"
          />
        </div>

        <nav className="hr-nav-links">
         <Link to="/AdminDash">
                    Dashboard
                  </Link>
                  <Link to="/ManageHR" className="active">
                    Manage HR
                  </Link>
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

      {/* ========================= PAGE HEADER ========================= */}

      <div className="manage-header">

        <div>

          <h1>Manage HR</h1>

          <p>

            {totalHR} Total HR • {activeHR} Active

          </p>

        </div>

      </div>

      {/* ========================= STATS ========================= */}

      <div className="stats-container">

        <div className="stat-card">

          <div className="stat-icon blue">

            <FaUsers />

          </div>

          <div>

            <h2>{totalHR}</h2>

            <span>Total HR</span>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">

            <FaUserCheck />

          </div>

          <div>

            <h2>{activeHR}</h2>

            <span>Active HR</span>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon gray">

            <FaUserTimes />

          </div>

          <div>

            <h2>{inactiveHR}</h2>

            <span>Inactive HR</span>

          </div>

        </div>

      </div>

      {/* ========================= TOOLBAR ========================= */}

      <div className="toolbar">

        <div className="search-box">

          <FaSearch />

          <input

            type="text"

            placeholder="Search HR..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

          />

        </div>

        <div className="view-buttons">

          <button

            className={
              view === "cards"
                ? "active-view"
                : ""
            }

            onClick={() =>
              setView("cards")
            }

          >

            Cards

          </button>

          <button

            className={
              view === "table"
                ? "active-view"
                : ""
            }

            onClick={() =>
              setView("table")
            }

          >

            Table

          </button>

        </div>

        <button

          className="add-btn"

          onClick={() =>
            setShowModal(true)
          }

        >

          <FaUserPlus />

          Add HR

        </button>

      </div>

      {/* ========================= LOADING ========================= */}

      {loading ? (

        <h2
          style={{
            textAlign: "center",
            marginTop: 40,
          }}
        >

          Loading HR...

        </h2>

      ) : view === "cards" ? (

        <div className="hr-grid">

          {filteredHR.length === 0 ? (

            <h2>No HR Found</h2>

          ) : (

            filteredHR.map((hr) => (

              <div
                className="hr-card"
                key={hr.hr_id}
              >

                <div className="hr-avatar">

                  {hr.username
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <h3>{hr.username}</h3>

                <p className="username">

                  {hr.designation}

                </p>

                <p className="email">

                  {hr.email}

                </p>

                <p
                  style={{
                    color: "#64748B",
                    marginTop: 6,
                  }}
                >

                  {hr.company_name}

                </p>

                <span

                  className={`status ${hr.status}`}

                >

                  {hr.status}

                </span>

                <div
                  className="joined"
                  style={{
                    marginTop: 15,
                  }}
                >

                  Joined :

                  {" "}

                  {new Date(
                    hr.created_at
                  ).toLocaleDateString()}

                </div>

                <div
                  className="card-buttons"
                >

                 <button
    className="edit-btn"
    onClick={() => openEdit(hr)}
>
    Edit
</button>

<button
    className="delete-btn"
    onClick={() => deleteHR(hr.hr_id)}
>
    Delete
</button>

                </div>

              </div>

            ))

          )}

        </div>

      ) : (
                <div className="hr-table-wrapper">
                <table className="hr-table">

          <thead>

            <tr>

              <th>Username</th>

              <th>Email</th>

              <th>Company</th>

              <th>Designation</th>

              <th>Status</th>

              <th>Created</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredHR.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >

                  No HR Found

                </td>

              </tr>

            ) : (

              filteredHR.map((hr) => (

                <tr key={hr.hr_id}>

                  <td>{hr.username}</td>

                  <td>{hr.email}</td>

                  <td>{hr.company_name}</td>

                  <td>{hr.designation}</td>

                  <td>

                    <span
                      className={`status ${hr.status}`}
                    >

                      {hr.status}

                    </span>

                  </td>

                  <td>

                    {new Date(
                      hr.created_at
                    ).toLocaleDateString()}

                  </td>

                  <td>

                  <button
    className="table-edit"
    onClick={() => openEdit(hr)}
>
    Edit
</button>

<button
    className="table-delete"
    onClick={() => deleteHR(hr.hr_id)}
>
    Delete
</button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>
        </div>

      )}

      {/* ========================= ADD HR MODAL ========================= */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Add HR</h2>

              <FaTimes
                className="close-icon"
                onClick={() =>
                  setShowModal(false)
                }
              />

            </div>

            <div className="modal-body">

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
              />

              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
              />

            </div>

            <div className="modal-footer">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >

                Cancel

              </button>

              <button
                className="create-btn"
                onClick={addHR}
              >

                Add HR

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================= EDIT HR MODAL ========================= */}

      {editingHR && (
<div className="modal-overlay">

<div className="modal">

<h2>Edit HR</h2>

<input
name="username"
value={editData.username}
onChange={(e)=>setEditData({...editData,username:e.target.value})}
/>

<input
name="email"
value={editData.email}
onChange={(e)=>setEditData({...editData,email:e.target.value})}
/>

<input
name="company_name"
value={editData.company_name}
onChange={(e)=>setEditData({...editData,company_name:e.target.value})}
/>

<input
name="designation"
value={editData.designation}
onChange={(e)=>setEditData({...editData,designation:e.target.value})}
/>

<select
value={editData.status}
onChange={(e)=>setEditData({...editData,status:e.target.value})}
>

<option value="active">Active</option>

<option value="inactive">Inactive</option>

</select>

<div className="modal-footer">

<button
className="cancel-btn"
onClick={()=>setEditingHR(null)}
>

Cancel

</button>

<button
className="create-btn"
onClick={updateHR}
>

Update HR

</button>

</div>

</div>

</div>
)}
            {/* ========================= END PAGE ========================= */}

    </div>
  );

  
}

export default ManageHR;
