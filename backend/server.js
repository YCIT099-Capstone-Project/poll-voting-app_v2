const pg = require("pg");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.json({ error: "Error hashing password" });
    }
    const sql =
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *";
    const values = [req.body.name, hash, req.body.email.toLowerCase()];
    pool
      .query(sql, values)
      .then((data) => {
        res.json({ data: data.rows[0] });
      })
      .catch((err) => {
        if (err.constraint === "users_email_key") {
          res.status(400).json({ error: "Email already exists" });
        } else {
          res.status(700).json({ error: "Server error" });
        }
      });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT id, * FROM users WHERE username = $1 OR email = $1"; // Include id in the SELECT statement
  const values = [req.body.name];
  pool
    .query(sql, values)
    .then((data) => {
      if (data.rows.length > 0) {
        const user = data.rows[0];
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            res.json({ data: { id: user.id } }); // Return the ID only in the response
          } else {
            res.status(401).json({ error: "Invalid password" });
          }
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
});

app.post("/createsurvey", (req, res) => {
  const { title, description, userId, questions, start_date, end_date, token } =
    req.body;
  const sqlPoll =
    "INSERT INTO Polls (title, description, user_id, start_date, end_date) VALUES ($1, $2, $3 ,$4 ,$5) RETURNING *";
  const valuesPoll = [title, description, userId, start_date, end_date];

  pool.query(sqlPoll, valuesPoll).then((data) => {
    const pollId = data.rows[0].id;
    // Insert the token linked with the pollId
    const sqlToken = "INSERT INTO poll_token (poll_id, token) VALUES ($1, $2)";
    const valuesToken = [pollId, token];

    pool
      .query(sqlToken, valuesToken)
      .then(() => {
        Promise.all(
          questions.map((question) => {
            const sqlQuestion =
              "INSERT INTO Questions (question_text, question_type, poll_id) VALUES ($1, $2, $3) RETURNING *";
            const valuesQuestion = [question.value, question.type, pollId];
            return pool.query(sqlQuestion, valuesQuestion);
          })
        )
          .then((questionsData) => {
            Promise.all(
              questionsData.map((questionData, i) => {
                const questionId = questionData.rows[0].id;
                if (questions[i].type === "radio") {
                  return Promise.all(
                    questions[i].options.map((option) => {
                      const sqlAnswer =
                        "INSERT INTO Answers (answer_text, question_id) VALUES ($1, $2)";
                      const valuesAnswer = [option.value, questionId];
                      return pool.query(sqlAnswer, valuesAnswer);
                    })
                  ).catch((err) =>
                    res.status(500).json({ error: err.message })
                  );
                }
              })
            )
              .then(() => {
                res.status(200).json({ message: "Survey saved successfully." });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
          })
          .catch((err) => res.status(500).json({ error: err.message }));
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });
});

app.get("/getPolls/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM Polls WHERE user_id = $1 ORDER BY created_at DESC";
  const values = [userId];

  pool
    .query(sql, values)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
});

app.delete("/deletePoll/:pollId", (req, res) => {
  const { pollId } = req.params;
  const sql = "DELETE FROM Polls WHERE id = $1";
  const values = [pollId];

  pool
    .query(sql, values)
    .then((data) => {
      if (data.rowCount > 0) {
        res.json({ message: "Poll deleted successfully." });
      } else {
        res.status(404).json({ error: "Poll not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
});

app.get("/getPoll/:pollId", (req, res) => {
  const { pollId } = req.params;
  const sql = "SELECT * FROM Polls WHERE id = $1";
  const values = [pollId];

  pool
    .query(sql, values)
    .then((data) => {
      if (data.rows.length > 0) {
        res.json(data.rows[0]);
      } else {
        res.status(404).json({ error: "Poll not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
});

// Update a specific poll by id
app.put("/updatePoll/:formId", async (req, res) => {
  const { formId } = req.params;
  const { title, description, start_date, end_date, questions } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const pollUpdateSql =
      "UPDATE Polls SET title = $1, description = $2, start_date = $3, end_date = $4 WHERE id = $5 RETURNING *";
    const pollUpdateValues = [title, description, start_date, end_date, formId];
    const pollUpdateResult = await client.query(
      pollUpdateSql,
      pollUpdateValues
    );

    if (pollUpdateResult.rows.length === 0) {
      throw new Error("Poll not found");
    }

    const questionUpdateSql =
      "UPDATE Questions SET question_text = $1 WHERE id = $2 AND poll_id = $3 RETURNING *";
    const answerUpdateSql =
      "UPDATE Answers SET answer_text = $1 WHERE id = $2 AND question_id = $3 RETURNING *";

    for (let i = 0; i < questions.length; i++) {
      const questionUpdateValues = [
        questions[i].question_text,
        questions[i].id,
        formId,
      ];
      const questionUpdateResult = await client.query(
        questionUpdateSql,
        questionUpdateValues
      );

      if (questionUpdateResult.rows.length === 0) {
        throw new Error(`Question id ${questions[i].id} not found`);
      }

      // Now iterate over answers for each question
      for (let j = 0; j < questions[i].answers.length; j++) {
        const answerUpdateValues = [
          questions[i].answers[j].answer_text,
          questions[i].answers[j].id,
          questions[i].id,
        ];
        const answerUpdateResult = await client.query(
          answerUpdateSql,
          answerUpdateValues
        );
        if (answerUpdateResult.rows.length === 0) {
          throw new Error(`Answer id ${questions[i].answers[j].id} not found`);
        }
      }
    }

    await client.query("COMMIT");
    res.json(pollUpdateResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.get("/getQuestions/:formId", (req, res) => {
  const { formId } = req.params;
  const sql = "SELECT * FROM Questions WHERE poll_id = $1";
  const values = [formId];

  pool
    .query(sql, values)
    .then((data) => {
      const questions = data.rows;
      let counter = 0;

      // If no questions are found, return an empty array.
      if (questions.length === 0) {
        res.json([]);
      } else {
        // For each question, get related answers from the Answers table.
        questions.forEach((question, index) => {
          const sqlAnswers = "SELECT * FROM Answers WHERE question_id = $1";
          const valuesAnswers = [question.id];

          pool
            .query(sqlAnswers, valuesAnswers)
            .then((data) => {
              // Append the related answers to the question object.
              questions[index].answers = data.rows;
              counter++;

              // When all questions have been processed, send the response.
              if (counter === questions.length) {
                res.json(questions);
              }
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: "Server error" });
            });
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    });
});

app.put("/updateQuestion/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { question_text } = req.body;

  try {
    const sql =
      "UPDATE Questions SET question_text = $1 WHERE id = $2 RETURNING *";
    const values = [question_text, questionId];

    const result = await pool.query(sql, values);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update question" });
  }
});
app.post("/submitResponses/:pollId", async (req, res) => {
  const { pollId } = req.params;
  const { participantToken, responses } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Check if the participant has already responded to the poll
    const participantSql =
      "SELECT * FROM Participants WHERE participation_token = $1";
    const participantValues = [participantToken];
    const participantResult = await client.query(
      participantSql,
      participantValues
    );
    let participantId;
    if (participantResult.rows.length > 0) {
      participantId = participantResult.rows[0].id;
      const participatedSql =
        "SELECT * FROM Participants_Polls WHERE participant_id = $1 AND poll_id = $2";
      const participatedValues = [participantId, pollId];
      const participatedResult = await client.query(
        participatedSql,
        participatedValues
      );
      if (participatedResult.rows.length > 0) {
        throw new Error("Participant has already responded to this poll");
      }
    } else {
      // 2. If they haven't, insert a new row in the Participants table and in the Participants_Polls table
      const newParticipantSql =
        "INSERT INTO Participants (participation_token, started_at, completed_at) VALUES ($1, NOW(), NOW()) RETURNING id";
      const newParticipantValues = [participantToken];
      const newParticipantResult = await client.query(
        newParticipantSql,
        newParticipantValues
      );
      participantId = newParticipantResult.rows[0].id;

      const newParticipationSql =
        "INSERT INTO Participants_Polls (participant_id, poll_id) VALUES ($1, $2)";
      const newParticipationValues = [participantId, pollId];
      await client.query(newParticipationSql, newParticipationValues);
    }

    // 3. Insert rows in the Responses table for each answer the participant provided
    for (let i = 0; i < responses.length; i++) {
      const { questionId, answerId, responseValue } = responses[i];
      const responseSql =
        "INSERT INTO Responses (participant_id, question_id, answer_id, response_value) VALUES ($1, $2, $3, $4)";
      const responseValues = [
        participantId,
        questionId,
        answerId,
        responseValue,
      ];
      await client.query(responseSql, responseValues);
    }

    await client.query("COMMIT");
    res.json({ message: "Responses submitted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.message === "Participant has already responded to this poll") {
      res.status(409).json({ error: error.message }); // Use 409 Conflict status code for this error
    } else {
      res.status(500).json({ error: error.message });
    }
  } finally {
    client.release();
  }
});
app.get("/getAnswers/:questionId", (req, res) => {
  const { questionId } = req.params;
  const sql = "SELECT * FROM Answers WHERE question_id = $1";
  const values = [questionId];

  pool
    .query(sql, values)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
});
app.post("/addQuestion/:pollId", async (req, res) => {
  const { pollId } = req.params;
  const { question_text } = req.body;

  try {
    const sql =
      "INSERT INTO Questions (question_text, poll_id) VALUES ($1, $2) RETURNING *";
    const values = [question_text, pollId];

    const result = await pool.query(sql, values);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(500).json({ error: "Failed to add question" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add question" });
  }
});

app.get("/getResponses/:pollId", async (req, res) => {
  const { pollId } = req.params;

  try {
    const responses = await pool.query(
      `SELECT r.id, q.question_text, 
        CASE
          WHEN r.answer_id IS NULL THEN r.response_value
          ELSE a.answer_text
        END AS response,
        r.created_at
      FROM Responses r 
      LEFT JOIN Questions q ON r.question_id = q.id 
      LEFT JOIN Answers a ON r.answer_id = a.id
      WHERE q.poll_id = $1`,
      [pollId]
    );

    res.json(responses.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/polltoken/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const result = await pool.query(
      "SELECT poll_id FROM poll_token WHERE token = $1",
      [token]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Token not found" });
    }
  } catch (error) {
    console.error("Error getting token:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/tokenfromid/:pollId", async (req, res) => {
  const { pollId } = req.params;

  try {
    const result = await pool.query(
      "SELECT token FROM poll_token WHERE poll_id = $1",
      [pollId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Token not found" });
    }
  } catch (error) {
    console.error("Error getting token:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
