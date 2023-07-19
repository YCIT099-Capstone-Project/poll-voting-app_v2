const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router.get("/getQuestions/:formId", questionController.getQuestionsByFormId);
router.put(
  "/updateQuestion/:questionId",
  questionController.updateQuestionByQuestionId
);
router.put("/addQuestion/:pollId", questionController.addQuestionByPollId);

module.exports = router;
