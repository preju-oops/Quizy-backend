const QuestionSet = require("../model/QuestionSetModel");

async function createQuestionSetController(req, res) {
  const data = req.body;
  const { id, role } = req.user;

  const finalData = {
    ...data,
    createdBy: id,
  };

  const createSet = new QuestionSet(finalData);
  await createSet.save();

  res.status(201).json({
    message: "Question Set Created Successfully",
  });
}

module.exports = {
  createQuestionSetController,
};
