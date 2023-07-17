import React, { useState } from "react";
import uuid from "react-uuid";
import { SurveyContext } from "../../context/SurveyContext";

export const SurveyProvider = ({ children }) => {
  // make sure this is exported
  const [id, setId] = useState(uuid());

  const createSurvey = () => {
    const newId = uuid();
    setId(newId);
  };

  return (
    <SurveyContext.Provider value={{ id, createSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};
