import React, { useContext } from "react";
import "./Template.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { Blank } from "../../../assets/img";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { SurveyContext } from "../../../context/SurveyContext";

const Template = () => {
  const { id, createSurvey } = useContext(SurveyContext);

  const navigateTo = useNavigate();

  const handleSurveyCreation = () => {
    createSurvey();
    navigateTo(`/forms/create/${id}`);
  };
  return (
    <div className="template_section">
      <div className="template_top">
        <div className="template_left">
          <span
            style={{
              fontSize: "16px",
              color: "#202124",
            }}
          >
            Start New Survey
          </span>
        </div>
        <div className="template_right">
          <div className="galary_btn">
            Template Gallery
            <UnfoldMoreIcon />
          </div>
          <IconButton>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      <div className="template_body">
        <div className="card" onClick={handleSurveyCreation}>
          <img src={Blank} alt="Blank Card" className="card_img" />
          <p className="card_title">Blank</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
