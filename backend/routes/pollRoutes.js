const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");

router.post("/createsurvey", pollController.createsurvey);
router.get("/getPolls/:userId", pollController.getPollsByUerId);
router.get("/notificationPoll/:userId", pollController.getPollsByUerIdForNoti);
router.delete("/deletePoll/:pollId", pollController.deletePoll);
router.get("/getPoll/:pollId", pollController.getPollById);
router.put("/updatePoll/:formId", pollController.updatePollByFormId);
router.get("/polltoken/:token", pollController.polltokenBytoken);
router.get("/tokenfromid/:pollId", pollController.tokenfromidBypollId);

module.exports = router;
