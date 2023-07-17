import { Fragment } from "react";
import "./App.css";
import FormPage from "./components/formpage/FormPage";
import LandingPage from "./components/landing-page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import PollPage from "./components/PollPage";

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forms/*" element={<FormPage />} />
          <Route path="/poll/:pollId" element={<PollPage />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
