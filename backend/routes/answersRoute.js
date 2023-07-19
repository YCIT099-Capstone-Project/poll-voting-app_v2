const express = require("express");
const router = express.Router();
const answersController = require("../controllers/answersController");

router.get("/getAnswers/:questionId", answersController.getAnswersByQuestionId);

module.exports = router;
