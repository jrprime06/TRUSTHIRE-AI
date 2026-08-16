import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HRProfile.css";


const HRProfile = () => {
    

    const navigate = useNavigate();
      // Check login
     useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    console.log("TOKEN:", token);
    console.log("USER DATA:", userData);

    if (!token || !userData) {
        navigate("/login");
        return;
    }

    try {
        const loggedInUser = JSON.parse(userData);

        console.log("PARSED USER:", loggedInUser);
        console.log("USER EMAIL:", loggedInUser.email);
        console.log("USER ID:", loggedInUser.user_id);

        setUser(loggedInUser);

    } catch (error) {
        console.error("USER JSON ERROR:", error);
        navigate("/login");
    }

}, [navigate]);


    // ==========================================
    // USER
    // ==========================================

    const [user, setUser] = useState(null);


    // ==========================================
    // HR PROFILE
    // ==========================================

    const [profile, setProfile] = useState(null);


    const [loading, setLoading] = useState(true);


    // ==========================================
    // PASSWORD
    // ==========================================

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [passwordLoading, setPasswordLoading] = useState(false);


    // ==========================================
    // MESSAGES
    // ==========================================

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    // ==========================================
    // CHECK LOGIN
    // ==========================================

    


    // ==========================================
    // FETCH HR PROFILE
    // ==========================================
useEffect(() => {

    if (!user) {
        return;
    }

    console.log("========== HR PROFILE ==========");
    console.log("USER OBJECT:", user);
    console.log("USER EMAIL:", user.email);
    console.log("USER ID:", user.user_id);
    console.log("================================");

    const fetchProfile = async () => {

        try {

            setLoading(true);

            const token = sessionStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/hr/profile",
                {
                    params: {
                        email: user.email
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "PROFILE RESPONSE:",
                response.data
            );

            if (response.data.success) {
                setProfile(response.data.hr);
            }

        } catch (error) {

            console.error(
                "PROFILE ERROR:",
                error.response?.data || error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load profile"
            );

        } finally {

            setLoading(false);

        }

    };

    fetchProfile();

}, [user]);


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    const handleChangePassword = async (e) => {

        e.preventDefault();


        setSuccessMessage("");
        setErrorMessage("");


        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setErrorMessage(
                "Please fill all password fields"
            );

            return;

        }


        if (newPassword.length < 6) {

            setErrorMessage(
                "New password must contain at least 6 characters"
            );

            return;

        }


        if (newPassword !== confirmPassword) {

            setErrorMessage(
                "New password and confirm password do not match"
            );

            return;

        }


        try {

            setPasswordLoading(true);


            const token =
                sessionStorage.getItem("token");


            const response = await axios.put(
                "http://localhost:5000/api/hr/profile/password",

                {
                    email: user.email,
                    currentPassword,
                    newPassword
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            if (response.data.success) {

                setSuccessMessage(
                    "Password changed successfully"
                );


                // Clear fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

            }

        } catch (error) {

            console.error(
                "PASSWORD ERROR:",
                error
            );


            setErrorMessage(
                error.response?.data?.message ||
                "Failed to change password"
            );

        } finally {

            setPasswordLoading(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="hr-profile-loading">
                Loading profile...
            </div>
        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="hr-profile-page">

            <div className="hr-profile-container">


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <div className="hr-profile-header">

                    <div>

                        <h1>My Profile</h1>

                        <p>
                            View your HR account details
                            and manage your password.
                        </p>

                    </div>

                </div>


                {/* =================================
                    ERROR
                ================================= */}

                {errorMessage && (

                    <div className="hr-error-message">
                        {errorMessage}
                    </div>

                )}


                {/* =================================
                    PROFILE CARD
                ================================= */}

                {profile && (

                    <div className="hr-profile-card">


                        {/* PROFILE ICON */}

                        <div className="hr-profile-avatar">

                            {profile.email
                                ?.charAt(0)
                                .toUpperCase()}

                        </div>


                        <div className="hr-profile-info">

                            <h2>
                                {profile.designation ||
                                    "HR"}
                            </h2>

                            <p className="hr-profile-email">
                                {profile.email}
                            </p>

                        </div>


                        {/* DETAILS */}

                        <div className="hr-details-grid">


                            <div className="hr-detail-item">

                                <label>
                                    HR ID
                                </label>

                                <div>
                                    {profile.hr_id}
                                </div>

                            </div>


                            <div className="hr-detail-item">

                                <label>
                                    Email
                                </label>

                                <div>
                                    {profile.email}
                                </div>

                            </div>


                            <div className="hr-detail-item">

                                <label>
                                    Company
                                </label>

                                <div>
                                    {profile.company_name ||
                                        "Not available"}
                                </div>

                            </div>


                            <div className="hr-detail-item">

                                <label>
                                    Designation
                                </label>

                                <div>
                                    {profile.designation ||
                                        "Not available"}
                                </div>

                            </div>


                        </div>

                    </div>

                )}


                {/* =================================
                    CHANGE PASSWORD
                ================================= */}

                <div className="hr-password-card">

                    <div className="password-header">

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Update your account password
                            to keep your account secure.
                        </p>

                    </div>


                    {successMessage && (

                        <div className="hr-success-message">
                            {successMessage}
                        </div>

                    )}


                    <form
                        onSubmit={handleChangePassword}
                        className="hr-password-form"
                    >


                        {/* CURRENT PASSWORD */}

                        <div className="hr-input-group">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter current password"
                            />

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="hr-input-group">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="hr-input-group">

                            <label>
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                            />

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="change-password-btn"
                            disabled={passwordLoading}
                        >

                            {passwordLoading
                                ? "Updating..."
                                : "Change Password"}

                        </button>


                    </form>

                </div>

            </div>

        </div>

    );

};


export default HRProfile;