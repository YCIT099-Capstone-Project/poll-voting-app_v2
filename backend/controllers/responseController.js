const { pool } = require("../database/db");

exports.submitResponsesByPollId = async (req, res) => {
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
};

exports.getResponsesByPollId = async (req, res) => {
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
};
