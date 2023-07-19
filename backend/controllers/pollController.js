const { pool } = require("../database/db");

exports.createsurvey = (req, res) => {
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
};

exports.getPollsByUerId = (req, res) => {
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
};
exports.getPollsByUerIdForNoti = (req, res) => {
  const { userId } = req.params;
  const sql = `
  SELECT * 
  FROM Polls 
  WHERE user_id = $1 
  AND DATE(end_date) = DATE(NOW() + INTERVAL '1 day')
  ORDER BY created_at DESC
`;

  const values = [userId];

  pool
    .query(sql, values)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
};

exports.deletePoll = (req, res) => {
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
      console.error(err);
      res.status(500).json({ error: `Server error: ${err.message}` });
    });
};

exports.getPollById = (req, res) => {
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
};

exports.updatePollByFormId = async (req, res) => {
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
};

exports.polltokenBytoken = async (req, res) => {
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
};

exports.tokenfromidBypollId = async (req, res) => {
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
};
