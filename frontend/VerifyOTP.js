import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VerifyOTP.css";
import logo from "../assets/logo.png";

function VerifyOTP() {

    const navigate = useNavigate();

    const [otp, setOtp] = useState("");

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [resendLoading, setResendLoading] =
        useState(false);

    const [timer, setTimer] = useState(30);

    useEffect(() => {

        const storedEmail =
            sessionStorage.getItem("otpEmail");

        if (!storedEmail) {
            navigate("/login");
            return;
        }

        setEmail(storedEmail);

    }, [navigate]);


    // ============================================
    // 30 SECOND TIMER
    // ============================================

    useEffect(() => {

        if (timer <= 0) {
            return;
        }

        const interval = setInterval(() => {

            setTimer((previous) => {

                if (previous <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return previous - 1;
            });

        }, 1000);

        return () => clearInterval(interval);

    }, [timer]);


    // ============================================
    // VERIFY OTP
    // ============================================

    const handleVerifyOTP = async (e) => {

        e.preventDefault();

        if (!otp || otp.length !== 6) {

            alert(
                "Please enter the 6-digit OTP."
            );

            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/verify-otp",
                {
                    email,
                    otp
                }
            );

            const data = response.data;

            if (data.success) {

                // Save JWT only AFTER OTP verification
                sessionStorage.setItem(
                    "token",
                    data.token
                );

                sessionStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                // Remove temporary email
                sessionStorage.removeItem(
                    "otpEmail"
                );

                // Role-based dashboard
                switch (data.user.role) {

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
                        alert("Invalid User Role");
                }

            } else {

                alert(
                    data.message ||
                    "Invalid OTP"
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "OTP verification failed"
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================
    // RESEND OTP
    // ============================================

    const handleResendOTP = async () => {

        if (timer > 0) {
            return;
        }

        try {

            setResendLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/resend-otp",
                {
                    email
                }
            );

            const data = response.data;

            if (data.success) {

                alert(
                    "A new OTP has been sent to your email."
                );

                // Restart 30-second countdown
                setTimer(30);

                // Clear old OTP
                setOtp("");

            } else {

                alert(
                    data.message ||
                    "Unable to resend OTP"
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to resend OTP"
            );

        } finally {

            setResendLoading(false);
        }
    };


    return (

        <div className="otp-page">

            <div className="otp-card">

                <div style={{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}}>
    <img
        src={logo}
        alt="TrustHire AI"
        className="navLogo"
        style={{
            display: "block"
        }}
    />
</div>

                <h1>
                    Verify Your Email
                </h1>

                <p className="otp-description">

                    We have sent a 6-digit OTP to

                    <br />

                    <strong>
                        {email}
                    </strong>

                </p>


                <form
                    onSubmit={handleVerifyOTP}
                >

                    <label>
                        Enter OTP
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {

                            const value =
                                e.target.value
                                .replace(/\D/g, "");

                            setOtp(value);
                        }}
                    />


                    <button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}

                    </button>

                </form>


                <div className="resend-section">

                    {timer > 0 ? (

                        <p>
                            Resend OTP in{" "}
                            <strong>
                                {timer}s
                            </strong>
                        </p>

                    ) : (

                        <button
                            type="button"
                            className="resend-btn"
                            onClick={handleResendOTP}
                            disabled={resendLoading}
                        >

                            {resendLoading
                                ? "Sending..."
                                : "Resend OTP"}

                        </button>

                    )}

                </div>


                <button
                    type="button"
                    className="back-login"
                    onClick={() => {

                        sessionStorage.removeItem(
                            "otpEmail"
                        );

                        navigate("/login");
                    }}
                >
                    Back to Login
                </button>

            </div>

        </div>
    );
}

export default VerifyOTP;