import React from "react";
import { FaLinkedin } from "react-icons/fa";

import "./Thank.css";
const Thank = () => {
  const photo =
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";
  return (
    <div className="topdiv">
      <div className="wrapper">
        <h1>Special Thanks to</h1>
        <div className="our_team">
          <div className="team_member">
            <div className="member_img">
              <img src={photo} alt="our_team" />
              <div className="social_media">
                <div className="linkedin item">
                  <FaLinkedin className="fab" />
                </div>
              </div>
            </div>
            <h3>Ridwan Ali</h3>
            <span>Leader</span>
            <p>
              A big thank you to Ridwan for his outstanding leadership as our
              team leader. His guidance and management skills have been crucial
              to the success of our project. Additionally, Ridwan's strong
              understanding of ReactJS has significantly contributed to our
              development process.
            </p>
          </div>
          <div className="team_member">
            <div className="member_img">
              <img src={photo} alt="our_team" />
              <div className="social_media">
                <div className="linkedin item">
                  <FaLinkedin className="fab" />
                </div>
              </div>
            </div>
            <h3>Suhail Parry</h3>
            <span>Front-End</span>
            <p>
              We extend our sincere gratitude to Suhail for his exceptional
              skills in ReactJS development. His dedication and attention to
              detail have greatly enhanced the functionality and user experience
              of our project. Suhail's expertise in front-end development has
              been invaluable to our team.
            </p>
          </div>
          <div className="team_member">
            <div className="member_img">
              <img src={photo} alt="our_team" />
              <div className="social_media">
                <div className="linkedin item">
                  <FaLinkedin className="fab" />
                </div>
              </div>
            </div>
            <h3>Shankar Pandey</h3>
            <span>database designer</span>
            <p>
              We would like to express our sincere appreciation to Shankar for
              his invaluable contributions as our database designer. His
              expertise in ReactJS and database design has been instrumental in
              implementing complex features and optimizing the performance of
              our project.
            </p>
          </div>
          <div className="team_member">
            <div className="member_img">
              <img src={photo} alt="our_team" />
              <div className="social_media">
                <div className="linkedin item">
                  <FaLinkedin className="fab" />
                </div>
              </div>
            </div>
            <h3>Abdulrahman</h3>
            <span>Back-End</span>
            <p>
              We are extremely grateful for Abdulrahman's contributions to this
              project. His skills in ReactJS development and collaborative
              approach have been invaluable in achieving our project goals.
              Abdulrahman's expertise in back-end development has greatly
              contributed to the success of our project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thank;
