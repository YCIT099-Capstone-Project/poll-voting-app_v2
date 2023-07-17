import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "./SignUp.css";
import Header from "../header";

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Use the useNavigate hook

  const handleSignUp = () => {
    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password should be at least 8 characters");
      return;
    }

    const data = { name: username, password: password, email: email };

    axios
      .post("http://localhost:4000/signup", data)
      .then((response) => {
        console.log(response.data);
        alert("Sign up successful");
        localStorage.setItem("token", response.data.token);

        navigate("/"); // Navigate to the home page
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrorMessage("Email already exists");
        } else {
          setErrorMessage("Server error. Please try again later.");
        }
      });
  };

  return (
    <>
      <Header />
      <div className="signup">
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <div className="error">{errorMessage}</div>}
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </>
  );
};

export default SignUp;
