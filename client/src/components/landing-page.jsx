import React from "react";
import Header from "./header";
import Footer from "./footer";
import { Link } from "react-router-dom";
import { selectUser } from "../redux/features/userSlice";
import { useSelector } from "react-redux";

const LandingPage = ({ loggedIn }) => {
  const user = useSelector(selectUser);
  const buttonStyle = {
    backgroundColor: "#5457e9",
    color: "#fcfcfc",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    marginRight: "10px",
    cursor: "pointer",
  };
  return (
    <div>
      <Header />

      {/* Content section */}
      <section>
        <h1>Welcome to Our Survey App</h1>
        {user ? (
          <Link to="/forms">
            <button style={buttonStyle}>Go to Forms</button>
          </Link>
        ) : (
          <Link to="/signUp" style={buttonStyle}>
            Sign Up
          </Link>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
