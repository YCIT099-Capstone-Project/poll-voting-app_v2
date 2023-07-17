import React from "react";
import FormHeader from "./formheader/FormHeader";
import Template from "./template/Template";
import MainFormBody from "./mainformbody/MainFormBody";
import { Routes, Route } from "react-router-dom";
import FormBuilder from "./createform/FormBuilder";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/userSlice";
import { SurveyProvider } from "./SurveyProvider";
import EditFormPage from "./ResponseEdit/EditFormPage";
import ViewResponsesPage from "./ResponseEdit/ViewResponsesPage";

const FormPage = () => {
  const user = useSelector(selectUser);

  return (
    <>
      {user ? (
        <>
          <FormHeader />
          <Routes>
            <Route
              path="/create/:id"
              element={
                <>
                  <SurveyProvider>
                    <FormBuilder />
                  </SurveyProvider>
                </>
              }
            />
            <Route
              path="/:formId/edit"
              element={
                <>
                  <SurveyProvider>
                    <EditFormPage />
                  </SurveyProvider>
                </>
              }
            />

            <Route
              path="/:pollId/responses"
              element={
                <>
                  <SurveyProvider>
                    <ViewResponsesPage />
                  </SurveyProvider>
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <SurveyProvider>
                    <Template />
                  </SurveyProvider>
                  <MainFormBody />
                </>
              }
            />
          </Routes>
        </>
      ) : (
        <p>You are not authorized</p>
      )}
    </>
  );
};

export default FormPage;
