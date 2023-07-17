import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./PollPage.css";

const PollPage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState({});
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollResponse = await axios.get(
          `http://localhost:4000/getPoll/${pollId}`
        );
        setPoll(pollResponse.data);

        const questionsResponse = await axios.get(
          `http://localhost:4000/getQuestions/${pollId}`
        );
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [pollId]);

  const handleResponseChange = (
    questionId,
    optionId,
    value,
    isText = false
  ) => {
    setResponses((prevResponses) => {
      if (isText) {
        const otherResponses = prevResponses.filter(
          (response) => response.questionId !== questionId
        );
        return [...otherResponses, { questionId, responseValue: value }];
      } else {
        const otherResponses = prevResponses.filter(
          (response) => response.questionId !== questionId
        );
        if (value) {
          return [
            ...otherResponses,
            { questionId, answerId: optionId, responseValue: optionId },
          ];
        } else {
          return otherResponses;
        }
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let participantToken = localStorage.getItem("participantToken");

    if (!participantToken) {
      participantToken =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("participantToken", participantToken);
    }

    try {
      await axios.post(`http://localhost:4000/submitResponses/${pollId}`, {
        participantToken,
        responses,
      });
      alert("Thank you for your submission!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{poll.title}</h1>
      <p>{poll.description}</p>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <h2>{question.question_text}</h2>
            {question.question_type === "text" && (
              <input
                type="text"
                value={
                  responses.find(
                    (response) => response.questionId === question.id
                  )?.responseValue || ""
                }
                onChange={(e) =>
                  handleResponseChange(question.id, null, e.target.value, true)
                }
              />
            )}
            {question.question_type === "textarea" && (
              <input
                type="text"
                value={
                  responses.find(
                    (response) => response.questionId === question.id
                  )?.responseValue || ""
                }
                onChange={(e) =>
                  handleResponseChange(question.id, null, e.target.value, true)
                }
              />
            )}
            {question.question_type === "radio" &&
              question.answers.map((answer) => (
                <div key={answer.id}>
                  <input
                    type="radio"
                    name={question.id}
                    value={answer.id}
                    onChange={(e) =>
                      handleResponseChange(
                        question.id,
                        answer.id,
                        e.target.checked,
                        false
                      )
                    }
                  />
                  <label>{answer.answer_text}</label>
                </div>
              ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PollPage;
