import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import "./CandidateProfile.css";
import logo from "../assets/logo.png";


function CandidateProfile() {

    // =====================================================
    // STATES
    // =====================================================

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [passwordSaving, setPasswordSaving] =
        useState(false);

    const [showPasswordSection, setShowPasswordSection] =
        useState(false);


    // Password states

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    // =====================================================
    // GET SESSION DATA
    // =====================================================

    const getLoggedInUser = () => {

        const token =
            sessionStorage.getItem("token");

        const userString =
            sessionStorage.getItem("user");


        if (!token || !userString) {

            return null;

        }


        try {

            const user =
                JSON.parse(userString);

            return {
                token,
                user
            };

        } catch (error) {

            console.error(
                "SESSION PARSE ERROR:",
                error
            );

            return null;

        }

    };


    // =====================================================
    // FETCH PROFILE
    // =====================================================

    const fetchProfile = async () => {

        try {

            setLoading(true);


            // ---------------------------------------------
            // Get session
            // ---------------------------------------------

            const session =
                getLoggedInUser();


            if (!session) {

                alert(
                    "Session expired. Please login again."
                );

                window.location.href =
                    "/login";

                return;

            }


            const {
                token,
                user
            } = session;


            // ---------------------------------------------
            // Get email from session
            // ---------------------------------------------

            const email =
                user?.email;


            console.log(
                "EMAIL FROM SESSION:",
                email
            );


            if (!email) {

                alert(
                    "Email not found in session. Please login again."
                );

                window.location.href =
                    "/login";

                return;

            }


            // ---------------------------------------------
            // Fetch candidate profile
            // ---------------------------------------------

            const response =
                await axios.get(

                    "http://localhost:5000/api/candidate/profile",

                    {
                        params: {
                            email: email
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );


            console.log(
                "PROFILE RESPONSE:",
                response.data
            );


            if (
                response.data.success
            ) {

                setProfile(
                    response.data.candidate
                );

            }

        } catch (error) {

            console.error(
                "PROFILE FETCH ERROR:",
                error
            );


            if (
                error.response
            ) {

                console.error(
                    error.response.data
                );

                alert(
                    error.response.data.message ||
                    "Unable to load profile"
                );

            } else {

                alert(
                    "Unable to connect to server"
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        fetchProfile();

    }, []);


    // =====================================================
    // HANDLE PROFILE INPUT
    // =====================================================

    const handleProfileChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfile(
            previous => ({

                ...previous,

                [name]: value

            })
        );

    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleUpdateProfile =
        async (e) => {

            e.preventDefault();


            const session =
                getLoggedInUser();


            if (!session) {

                alert(
                    "Session expired. Please login again."
                );

                window.location.href =
                    "/login";

                return;

            }


            const {
                token,
                user
            } = session;


            const email =
                user?.email;


            if (!email) {

                alert(
                    "Email not found in session."
                );

                return;

            }


            try {

                setSaving(true);


                const response =
                    await axios.put(

                        "http://localhost:5000/api/candidate/profile",

                        {

                            email: email,

                            first_name:
                                profile.first_name,

                            last_name:
                                profile.last_name,

                            mobile:
                                profile.mobile,

                            dob:
                                profile.dob,

                            gender:
                                profile.gender,

                            job_role:
                                profile.job_role

                        },

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    );


                if (
                    response.data.success
                ) {

                    alert(
                        "Profile updated successfully!"
                    );


                    // Fetch updated data
                    await fetchProfile();

                }

            } catch (error) {

                console.error(
                    "UPDATE PROFILE ERROR:",
                    error
                );


                alert(

                    error.response?.data?.message ||

                    "Unable to update profile"

                );

            } finally {

                setSaving(false);

            }

        };


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handleChangePassword =
        async (e) => {

            e.preventDefault();


            // ---------------------------------------------
            // Validation
            // ---------------------------------------------

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {

                alert(
                    "Please fill all password fields."
                );

                return;

            }


            if (
                newPassword.length < 8
            ) {

                alert(
                    "New password must be at least 8 characters."
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                alert(
                    "New passwords do not match."
                );

                return;

            }


            // ---------------------------------------------
            // Get session
            // ---------------------------------------------

            const session =
                getLoggedInUser();


            if (!session) {

                alert(
                    "Session expired. Please login again."
                );

                window.location.href =
                    "/login";

                return;

            }


            const {
                token,
                user
            } = session;


            const email =
                user?.email;


            if (!email) {

                alert(
                    "Email not found in session."
                );

                return;

            }


            try {

                setPasswordSaving(true);


                const response =
                    await axios.put(

                        "http://localhost:5000/api/candidate/profile/change-password",

                        {

                            email: email,

                            currentPassword:
                                currentPassword,

                            newPassword:
                                newPassword

                        },

                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }

                    );


                if (
                    response.data.success
                ) {

                    alert(
                        "Password changed successfully!"
                    );


                    // Clear password fields

                    setCurrentPassword("");

                    setNewPassword("");

                    setConfirmPassword("");


                    setShowPasswordSection(
                        false
                    );

                }

            } catch (error) {

                console.error(
                    "CHANGE PASSWORD ERROR:",
                    error
                );


                alert(

                    error.response?.data?.message ||

                    "Unable to change password"

                );

            } finally {

                setPasswordSaving(false);

            }

        };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="profile-loading">

                <div>

                    Loading profile...

                </div>

            </div>

        );

    }


    // =====================================================
    // PROFILE NOT FOUND
    // =====================================================

    if (!profile) {

        return (

            <div className="profile-loading">

                <div>

                    Candidate profile not found.

                </div>

            </div>

        );

    }


    // =====================================================
    // FORMAT DOB
    // =====================================================

    const formattedDOB =
        profile.dob
            ? String(
                profile.dob
            ).substring(0, 10)
            : "";


    // =====================================================
    // UI
    // =====================================================

    return (

        

        <div className="candidate-profile-page">

            

            <div className="profile-card">
                 <img
                                src={logo}
                                alt="TrustHire AI"
                                className="navLogo"
                                style={{
                                    display: "block"
                                }}
                            />


                {/* =========================================
                    PROFILE HEADER
                ========================================= */}

                <div className="profile-header">


                    <div className="profile-avatar">

                        {
                            profile.first_name
                                ?.charAt(0)
                                ?.toUpperCase()
                        }

                    </div>


                    <div>

                        

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your personal information
                        </p>

                    </div>


                </div>


                {/* =========================================
                    PROFILE FORM
                ========================================= */}

                <form
                    onSubmit={
                        handleUpdateProfile
                    }
                >


                    <div className="form-grid">


                        {/* FIRST NAME */}

                        <div className="form-group">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                name="first_name"
                                value={
                                    profile.first_name || ""
                                }
                                onChange={
                                    handleProfileChange
                                }
                            />

                        </div>


                        {/* LAST NAME */}

                        <div className="form-group">

                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="last_name"
                                value={
                                    profile.last_name || ""
                                }
                                onChange={
                                    handleProfileChange
                                }
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={
                                    profile.email || ""
                                }
                                disabled
                            />

                            <small>
                                Email cannot be changed.
                            </small>

                        </div>


                        {/* MOBILE */}

                        <div className="form-group">

                            <label>
                                Mobile
                            </label>

                            <input
                                type="text"
                                name="mobile"
                                value={
                                    profile.mobile || ""
                                }
                                onChange={
                                    handleProfileChange
                                }
                            />

                        </div>


                        {/* DOB */}

                        <div className="form-group">

                            <label>
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="dob"
                                value={
                                    formattedDOB
                                }
                                onChange={
                                    handleProfileChange
                                }
                            />

                        </div>


                        {/* GENDER */}

                        <div className="form-group">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={
                                    profile.gender || ""
                                }
                                onChange={
                                    handleProfileChange
                                }
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* JOB ROLE */}

                        <div className="form-group full-width">

                            <label>
                                Job Role
                            </label>

                            <input
                                type="text"
                                name="job_role"
                                value={
                                    profile.job_role || ""
                                }
                                onChange={
                                    handleProfileChange
                                }
                            />

                        </div>


                        {/* STATUS */}

                        <div className="form-group">

                            <label>
                                Account Status
                            </label>

                            <input
                                type="text"
                                value={
                                    profile.status || ""
                                }
                                disabled
                            />

                        </div>


                    </div>


                    {/* SAVE BUTTON */}

                    <div className="profile-actions">

                        <button
                            type="submit"
                            disabled={saving}
                        >

                            {
                                saving
                                    ? "Saving..."
                                    : "Save Changes"
                            }

                        </button>

                    </div>


                </form>


                {/* =========================================
                    CHANGE PASSWORD
                ========================================= */}

                <div className="password-section">


                    <div className="password-header">


                        <div>

                            <h2>
                                Change Password
                            </h2>

                            <p>
                                Update your account password
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setShowPasswordSection(
                                    !showPasswordSection
                                )
                            }
                        >

                            {
                                showPasswordSection
                                    ? "Cancel"
                                    : "Change Password"
                            }

                        </button>


                    </div>


                    {
                        showPasswordSection && (

                            <form
                                onSubmit={
                                    handleChangePassword
                                }
                                className="password-form"
                            >


                                {/* CURRENT PASSWORD */}

                                <div className="form-group">

                                    <label>
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        value={
                                            currentPassword
                                        }
                                        onChange={
                                            (e) =>
                                                setCurrentPassword(
                                                    e.target.value
                                                )
                                        }
                                        placeholder="Enter current password"
                                    />

                                </div>


                                {/* NEW PASSWORD */}

                                <div className="form-group">

                                    <label>
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        value={
                                            newPassword
                                        }
                                        onChange={
                                            (e) =>
                                                setNewPassword(
                                                    e.target.value
                                                )
                                        }
                                        placeholder="Enter new password"
                                    />

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="form-group">

                                    <label>
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={
                                            (e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                        }
                                        placeholder="Confirm new password"
                                    />

                                </div>


                                <div className="password-note">

                                    Password must contain
                                    at least 8 characters.

                                </div>


                                <button
                                    type="submit"
                                    disabled={
                                        passwordSaving
                                    }
                                >

                                    {
                                        passwordSaving
                                            ? "Updating..."
                                            : "Update Password"
                                    }

                                </button>


                            </form>

                        )
                    }


                </div>


            </div>

        </div>

    );

}


export default CandidateProfile;