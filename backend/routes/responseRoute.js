const express = require("express");
const router = express.Router();
const responseController = require("../controllers/responseController");

router.post(
  "/submitResponses/:pollId",
  responseController.submitResponsesByPollId
);
router.get("/getResponses/:pollId", responseController.getResponsesByPollId);

module.exports = router;
