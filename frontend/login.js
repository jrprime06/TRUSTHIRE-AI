
import React, { useState, useEffect } from "react";
import "./login.css";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowRight
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

function Login() {

    // Navigation
    const navigate = useNavigate();

    // States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    // =====================================================
    // CHECK IF USER IS ALREADY LOGGED IN
    // =====================================================

    useEffect(() => {

        const token = sessionStorage.getItem("token");
        const storedUser = sessionStorage.getItem("user");

        if (token && storedUser) {

            try {

                const user = JSON.parse(storedUser);

                switch (user.role) {

                    case "candidate":
                        navigate("/CandidateDash");
                        break;

                    case "hr":
                        navigate("/HRDashboard");
                        break;

                    case "admin":
                        navigate("/AdminDash");
                        break;

                    default:
                        break;
                }

            } catch (error) {

                console.error(
                    "Invalid stored user data:",
                    error
                );

                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
            }
        }

    }, [navigate]);


    // =====================================================
    // LOGIN FUNCTION
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email || !password) {

            alert(
                "Please enter email and password."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/login",
                {
                    email,
                    password
                }
            );

            const data = response.data;


            // =================================================
            // PASSWORD CORRECT
            // OTP REQUIRED
            // =================================================

            if (
                data.success &&
                data.otpRequired
            ) {

                // Remove any old authentication data
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");

                // Store email temporarily
                sessionStorage.setItem(
                    "otpEmail",
                    data.email || email
                );

                // Redirect to OTP page
                navigate("/verify-otp");

                return;
            }


            // =================================================
            // FALLBACK
            // =================================================

            if (data.success) {

                alert(
                    "OTP verification is required."
                );

                return;
            }


            // =================================================
            // LOGIN FAILED
            // =================================================

            alert(
                data.message ||
                "Login failed."
            );

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            if (error.response) {

                console.log(
                    error.response.data
                );

                alert(
                    error.response.data.message ||
                    "Server Error"
                );

            } else if (error.request) {

                alert(
                    "No response received from server."
                );

            } else {

                alert(
                    error.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="login-page">

            <div className="login-card">

                <img
                    src={logo}
                    alt="TrustHire AI"
                    className="login-logo"
                />

                <h1>
                    Sign In
                </h1>

                <p className="subtitle">
                    Enter your credentials to access your portal
                </p>


                <form onSubmit={handleLogin}>

                    {/* EMAIL */}

                    <label>
                        Email
                    </label>

                    <div className="input-box">

                        <FaEnvelope className="icon" />

                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <label>
                        Password
                    </label>

                    <div className="input-box">

                        <FaLock className="icon" />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />


                        <button
                            type="button"
                            className="eye-btn"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >

                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}

                        </button>

                    </div>


                    {/* FORGOT PASSWORD */}

                    <div className="forgot">

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Checking..."
                            : "Login"}

                        {!loading && (
                            <FaArrowRight />
                        )}

                    </button>

                </form>


                {/* REGISTER */}

                <div className="register">

                    New to TrustHire AI?

                    <Link to="/register">
                        Register Here
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;

