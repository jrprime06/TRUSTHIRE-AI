import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../assets/logo.png";

function Register() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",    
    mobile: "",

   

    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const nextStep = () => {

    if (step === 1) {

        if (!/^[A-Za-z]{2,30}$/.test(form.firstName.trim())) {
            alert("Enter a valid First Name.");
            return;
        }

        if (
            form.middleName &&
            !/^[A-Za-z]{2,30}$/.test(form.middleName.trim())
        ) {
            alert("Middle Name should contain only alphabets.");
            return;
        }

        if (!/^[A-Za-z]{2,30}$/.test(form.lastName.trim())) {
            alert("Enter a valid Last Name.");
            return;
        }

        if (!form.dob) {
            alert("Please select Date of Birth.");
            return;
        }

        // Gender
        if (form.gender === "") {
        alert("Please select your Gender.");
        return ;
        }

        const today = new Date();
        const dob = new Date(form.dob);

        if (dob > today) {
            alert("DOB cannot be in future.");
            return;
        }

        let age = today.getFullYear() - dob.getFullYear();

        const month = today.getMonth() - dob.getMonth();

        if (
            month < 0 ||
            (month === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        if (age < 18) {
            alert("Candidate must be at least 18 years old.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(form.mobile)) {
            alert("Enter a valid 10-digit Mobile Number.");
            return;
        }
        

    }

   

    setStep(step + 1);

};

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateForm = () => {

    // First Name
    if (!/^[A-Za-z]{2,30}$/.test(form.firstName.trim())) {
        alert("First Name should contain only alphabets (2-30 characters).");
        return false;
    }

    // Middle Name (Optional)
    if (
        form.middleName &&
        !/^[A-Za-z]{2,30}$/.test(form.middleName.trim())
    ) {
        alert("Middle Name should contain only alphabets.");
        return false;
    }

    // Last Name
    if (!/^[A-Za-z]{2,30}$/.test(form.lastName.trim())) {
        alert("Last Name should contain only alphabets.");
        return false;
    }

    // Date of Birth
    const today = new Date();
    const dob = new Date(form.dob);

    if (dob > today) {
        alert("Date of Birth cannot be in the future.");
        return false;
    }

    let age = today.getFullYear() - dob.getFullYear();

    const month = today.getMonth() - dob.getMonth();

    if (
        month < 0 ||
        (month === 0 && today.getDate() < dob.getDate())
    ) {
        age--;
    }

    if (age < 18) {
        alert("Candidate must be at least 18 years old.");
        return false;
    }

   // Gender
if (form.gender === "") {
    alert("Please select your Gender.");
    return false;
}

 
   

    // Email
    const emailRegex =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(form.email)) {
        alert("Enter a valid Email Address.");
        return false;
    }

    // Password
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
        alert(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
        );
        return false;
    }

    // Confirm Password
    if (form.password !== form.confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    return true;
};

const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {

        const res = await fetch(
            "http://localhost:5000/api/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            }
        );

        let data = {};
        try {
            data = await res.json();
        } catch {
            data = {};
        }

        if (!res.ok) {
    console.log("Response:", data);
    alert(data.message || JSON.stringify(data));
    return;
}

        // Success — the account was created, so route to Login like a normal web app
        alert(data.message || "Account created successfully!");
        navigate("/");

    } catch (err) {

        alert("Could not reach the server. Please try again.");

    }

};

  return (

<div className="register-container">

<div className="register-card">

<div className="logo-wrapper">
<img
src={logo}
alt="TrustHire AI"
className="register-logo"
/>
</div>

<h2>Create Account</h2>

<p>Join TrustHire AI Recruitment Platform</p>

<div className="progressbar">

<div className={step>=1?"active step":"step"}>
1
</div>

<div className={step>=2?"active step":"step"}>
2
</div>



</div>

<div className="step-title">

{step===1 && <h4>Personal Information</h4>}

{step===2 && <h4>Academic Information</h4>}

{step===3 && <h4>Account Information</h4>}

</div>

<form onSubmit={handleSubmit}>

{step===1 && (

<>
<div className="input-group">

  <label className="input-label">
    Enter Firstname <span className="required">*</span>
  </label>
<input
type="text"
name="firstName"
placeholder="First Name"

value={form.firstName}
onChange={handleChange}
required
className="register-input"
/>
</div>
<div className="input-group">

  <label className="input-label">
    Enter Lastname <span className="required">*</span>
  </label>

<input
type="text"
name="lastName"
placeholder="Last Name"
value={form.lastName}
onChange={handleChange}
required
className="register-input"
/>
</div>
<div className="input-group">

  <label className="input-label">
    Please Select Gender <span className="required">*</span>
  </label>
<select
    name="gender"
    value={form.gender}
    onChange={handleChange}
    required
    className="register-input"
>
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
</select>
</div>
<div className="input-group">

  <label className="input-label">
    Date of Birth <span className="required">*</span>
  </label>

  <input
    type="date"
    name="dob"
    value={form.dob}
    onChange={handleChange}
    required
    className="register-input"
  />

</div>
<div className="input-group">

  <label className="input-label">
   Enter Mobile Number <span className="required">*</span>
  </label>
<input
type="tel"
name="mobile"
placeholder="Mobile Number"
value={form.mobile}
onChange={handleChange}
required
maxLength="10"
className="register-input"
/>
</div>
<div className="button-group">

<button
type="button"
className="next-btn"
onClick={nextStep}
>

Next →

</button>

</div>

</>

)}
{/* ================= STEP 2 ================= */}



{/* ================= STEP 3 ================= */}

{step === 2 && (

<>
<div className="input-group">

  <label className="input-label">
    Enter Email <span className="required">*</span>
  </label>
<input
type="email"
name="email"
placeholder="Email Address"
value={form.email}
onChange={handleChange}
required
className="register-input"
/>
</div>
<div className="input-group">

  <label className="input-label">
    Enter Password <span className="required">*</span>
  </label>
<input
type="password"
name="password"
placeholder="Password"
value={form.password}
onChange={handleChange}
required
className="register-input"
/>
</div>

<div className="input-group">

  <label className="input-label">
    Re-Enter Password <span className="required">*</span>
  </label>
<input
type="password"
name="confirmPassword"
placeholder="Confirm Password"
value={form.confirmPassword}
onChange={handleChange}
required
className="register-input"
/>
</div>

<div className="button-group">

<button
type="button"
className="back-btn"
onClick={prevStep}
>

← Back

</button>



<button
type="submit"
className="register-button"
>

Create Account

</button>

</div>

</>

)}

</form>

<div className="register-footer">
  Already have an account?{" "}
  <Link to="/" className="login-link">
    Login
  </Link>
</div>

</div>

</div>

);


}



export default Register;