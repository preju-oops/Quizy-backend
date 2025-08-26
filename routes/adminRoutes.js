var express = require("express");
const {
  createQuestionSetController,
} = require("../controller/adminController");
const { validateTokenMiddleware } = require("../middleware/AuthMiddleware");
const { adminOnlyMiddleware } = require("../middleware/RoleMiddleware");
var router = express.Router();

router.post(
  "/questionset/create",
  validateTokenMiddleware,
  adminOnlyMiddleware,
  createQuestionSetController
);

module.exports = router;