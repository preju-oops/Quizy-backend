import AnswerModel from "../model/AnswerModel.js";
import QuestionSet from "../model/QuestionSetModel.js";

export async function listQuestionSetController(req, res) {
  const questionSet = await QuestionSet.aggregate([
    {
      $project: {
        title: 1,
        questionCount: { $size: { $ifNull: ["$questions", []] } },
      },
    },
  ]);

  res.json({ questionSet });
}

export async function getQuestionSetController(req, res) {
  const { id } = req.params;
  const questionSet = await QuestionSet.findById(id).select(
    "-questions.choices.correctAnswer"
  );

  if (!questionSet) {
    return res.status(404).json({ message: "Question set not found" });
  }

  res.json(questionSet);
}

export async function saveAttemptedQuestionController(req, res) {
  const { questionSet: questionSetId, responses } = req.body;
  const { id: userId } = req.user;

  const questionSet = await QuestionSet.findById(questionSetId).select(
    "questions._id questions.choices._id questions.choices.correctAnswer"
  );

  if (!questionSet) {
    return res.status(404).json({ message: "QuestionSet not found" });
  }

  const result = (responses || []).reduce(
    (acc, current) => {
      const questions = Array.isArray(questionSet?.questions)
        ? questionSet.questions
        : Array.isArray(questionSet)
        ? questionSet
        : [];

      // 1) find the question in this set
      const q = questions.find(
        (qn) => String(qn._id) === String(current.questionId)
      );
      if (!q) return acc; // skip unknown question ids

      // 2) build the list of correct choice ids
      const correctIds = (q.choices || []).reduce((ids, c) => {
        if (c?.correctAnswer) ids.push(String(c._id));
        return ids;
      }, []);

      // 3) count how many SELECTED are actually CORRECT
      const selected = current.selectedChoiceIds || [];
      const selectedAreCorrectCount = selected.reduce((cnt, selId) => {
        const hit = correctIds.includes(String(selId));
        return cnt + (hit ? 1 : 0);
      }, 0);

      // 4) count how many CORRECT were actually SELECTED
      const correctSelectedCount = correctIds.reduce((cnt, cid) => {
        const hit = selected.includes(String(cid));
        return cnt + (hit ? 1 : 0);
      }, 0);

      // exact match check
      const allSelectedAreCorrect = selectedAreCorrectCount === selected.length;
      const allCorrectWereSelected = correctSelectedCount === correctIds.length;
      const isCorrect = allSelectedAreCorrect && allCorrectWereSelected;

      acc.total += 1;
      if (isCorrect) acc.score += 1;

      acc.details.push({
        questionId: String(q._id),
        selectedChoiceIds: selected.map(String),
        isCorrect,
      });

      return acc;
    },
    { score: 0, total: 0, details: [] }
  );

  const saveAnswerQuestion = new AnswerModel({
    questionSet: questionSetId,
    user: userId,
    responses,
    score: result.score,
    total: result.total,
  });

  await saveAnswerQuestion.save();

  return res.status(201).json({
    message: "Graded",
    data: {
      score: result.score,
      total: result.total,
      details: result.details, // ⚡ changed from `responses` (bug in your old code)
    },
  });
}
