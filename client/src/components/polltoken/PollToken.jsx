import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, CircularProgress } from "@mui/material";
import styled from "styled-components";
import Header from "../header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 20px;
  }
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 20px;
  }
`;

const PollToken = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BACKEND}/polltoken/${token}`
      );

      if (response.data) {
        const { poll_id } = response.data;
        navigate(`/poll/${poll_id}`);
      } else {
        alert("Invalid token");
      }
    } catch (error) {
      console.error("Error fetching token", error);
      alert("Error fetching token");
    }
    setIsLoading(false);
  };

  return (
    <>
      <Container>
        <Card>
          <Title>Enter Survey Token</Title>
          <StyledTextField
            label="Enter Token"
            variant="outlined"
            fullWidth
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Go to Survey"}
          </StyledButton>
        </Card>
      </Container>
    </>
  );
};

export default PollToken;
