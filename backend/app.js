const express = require("express");
const cors = require("cors");
const { createTables } = require("./database/db");

const userRoutes = require("./routes/userRoutes");
const pollRoutes = require("./routes/pollRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answersRoute = require("./routes/answersRoute");
const responseRoute = require("./routes/responseRoute");

//TODO: add the api key to routes that need it
const API_SECRET_KEY = process.env.API_SECRET_KEY;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", pollRoutes);
app.use("/", questionRoutes);
app.use("/", answersRoute);
app.use("/", responseRoute);

createTables().then(() => {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
