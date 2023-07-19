const { pool } = require("../database/db");

exports.getQuestionsByFormId = (req, res) => {
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
};

exports.updateQuestionByQuestionId = async (req, res) => {
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
};

exports.addQuestionByPollId = async (req, res) => {
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
};
