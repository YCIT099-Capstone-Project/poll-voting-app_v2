import React from "react";
import Header from "./header";
import Footer from "./footer";

const LandingPage = () => {
  return (
    <div>
      <Header />

      {/* Content section */}
      <section>
        <h1>Welcome to Our Survey App</h1>
        <p>Fill in the app</p>
        {/* Add more content as needed */}
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
