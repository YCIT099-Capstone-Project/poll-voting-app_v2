const dotenv = require("dotenv");
dotenv.config();
const pg = require("pg");
const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      UNIQUE (username),
      UNIQUE (email)
    );
    
    CREATE TABLE IF NOT EXISTS Polls (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES Users(id),
      title VARCHAR(255) NOT NULL,
      description TEXT,
      start_date TIMESTAMPTZ,
      end_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ
    );
    
    CREATE TABLE IF NOT EXISTS Questions (
      id SERIAL PRIMARY KEY,
      poll_id INTEGER REFERENCES Polls(id),
      question_text TEXT NOT NULL,
      question_type VARCHAR(50),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ
    );
    
    CREATE TABLE IF NOT EXISTS Answers (
      id SERIAL PRIMARY KEY,
      question_id INTEGER REFERENCES Questions(id),
      answer_text TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ
    );
    
    CREATE TABLE IF NOT EXISTS Participants (
      id SERIAL PRIMARY KEY,
      participation_token VARCHAR(255),
      started_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ
    );
    
    CREATE TABLE IF NOT EXISTS Participants_Polls (
      participant_id INTEGER REFERENCES Participants(id),
      poll_id INTEGER REFERENCES Polls(id),
      PRIMARY KEY (participant_id, poll_id)
    );
    
    CREATE TABLE IF NOT EXISTS Responses (
      id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES Participants(id),
      question_id INTEGER REFERENCES Questions(id),
      answer_id INTEGER REFERENCES Answers(id),
      response_value TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ
    );
    
    CREATE TABLE IF NOT EXISTS poll_token (
      id SERIAL PRIMARY KEY,
      poll_id INTEGER REFERENCES Polls(id),
      token VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_participants_polls_participant_id ON Participants_Polls (participant_id);
    CREATE INDEX IF NOT EXISTS idx_participants_polls_poll_id ON Participants_Polls (poll_id);
    CREATE INDEX IF NOT EXISTS idx_responses_participant_id ON Responses (participant_id);
    CREATE INDEX IF NOT EXISTS idx_responses_question_id ON Responses (question_id);
    CREATE INDEX IF NOT EXISTS idx_responses_answer_id ON Responses (answer_id);
    

    ALTER TABLE poll_token
    DROP CONSTRAINT IF EXISTS poll_token_poll_id_fkey;

    ALTER TABLE poll_token
    ADD CONSTRAINT  poll_token_poll_id_fkey FOREIGN KEY (poll_id)
    REFERENCES Polls (id) ON DELETE CASCADE;

        
    `);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Failed to create tables:", err);
  }
};

module.exports = { createTables, pool };

// ALTER TABLE poll_token
// DROP CONSTRAINT poll_token_poll_id_fkey;

// ALTER TABLE poll_token
// ADD CONSTRAINT poll_token_poll_id_fkey FOREIGN KEY (poll_id)
// REFERENCES Polls (id) ON DELETE CASCADE;
