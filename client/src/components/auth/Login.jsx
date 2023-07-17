import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import Header from "../header";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    const data = { name: usernameOrEmail.toLowerCase(), password: password };

    axios
      .post("http://localhost:4000/login", data)
      .then((response) => {
        console.log(response.data);
        const { id } = response.data.data;

        dispatch(
          login({
            id: id,
            name: usernameOrEmail,
            loggedIn: true,
          })
        );

        navigate("/forms");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Invalid password");
        } else if (error.response && error.response.status === 404) {
          setErrorMessage("User not found");
        } else {
          setErrorMessage("Server error. Please try again later.");
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <>
      <Header />
      <form className="login" onSubmit={(e) => handleSubmit(e)}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <div className="error">{errorMessage}</div>}
        <button onClick={handleLogin}>Login</button>
      </form>
    </>
  );
};

export default Login;
