var express = require("express");
const {
  listQuestionSetController,
  getQuestionSetController,
  saveAttemptedQuestionController,
} = require("../controller/questionController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
var router = express.Router();

router.get("/set/list", validateTokenMiddleware, listQuestionSetController);
router.get("/set/:id", validateTokenMiddleware, getQuestionSetController);
router.post(
  "/answer/attempt",
  validateTokenMiddleware,
  saveAttemptedQuestionController
);

module.exports = router;