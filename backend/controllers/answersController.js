const { pool } = require("../database/db");
exports.getAnswersByQuestionId = (req, res) => {
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
};
