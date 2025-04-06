// src/app/data/behavioralAnalysis.js - Simplified without traits

/**
 * Analyze behavioral test results - simplified version without trait categorization
 * @param {Object} answers - User's answers to behavioral questions
 * @param {Array} questions - Array of behavioral questions with points
 * @returns {Object} - Analysis of the user's behavioral performance
 */
export function analyzeBehavioralResults(answers, questions) {
  // Skip if no answers or questions
  if (
    !answers ||
    !questions ||
    Object.keys(answers).length === 0 ||
    questions.length === 0
  ) {
    return {
      overallScore: 0,
      questionCount: 0,
      maxScore: 0,
      earnedScore: 0,
      strengths: [],
      areasForImprovement: [],
    };
  }

  // Calculate total points earned and maximum possible
  let totalPoints = 0;
  let maxPossiblePoints = 0;
  let questionCount = 0;

  // Track high and low scoring questions for feedback
  const highScoreQuestions = [];
  const lowScoreQuestions = [];

  // Process each answered question
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    // Find the question
    const question = questions.find((q) => q.id === questionId);

    if (question && Array.isArray(question.points)) {
      // Validate the selected answer is within points array bounds
      if (selectedAnswer >= 0 && selectedAnswer < question.points.length) {
        const pointValues = question.points.filter(
          (p) => typeof p === "number" && !isNaN(p)
        );

        if (pointValues.length > 0) {
          const pointsEarned = question.points[selectedAnswer] || 0;
          const maxPoints = Math.max(...pointValues);

          if (maxPoints <= 0) return; // Skip invalid questions

          totalPoints += pointsEarned;
          maxPossiblePoints += maxPoints;
          questionCount++;

          // Track performance on specific questions
          const percentageScore = (pointsEarned / maxPoints) * 100;

          if (percentageScore >= 75) {
            highScoreQuestions.push({
              text: question.text,
              score: percentageScore,
            });
          } else if (percentageScore <= 50) {
            lowScoreQuestions.push({
              text: question.text,
              score: percentageScore,
            });
          }
        }
      }
    }
  });

  // Calculate overall score
  const overallScore =
    maxPossiblePoints > 0
      ? Math.round((totalPoints / maxPossiblePoints) * 100)
      : 0;

  // Generate general feedback based on overall score
  let strengths = [];
  let areasForImprovement = [];

  // Sort high and low scoring questions
  highScoreQuestions.sort((a, b) => b.score - a.score);
  lowScoreQuestions.sort((a, b) => a.score - b.score);

  // Take top 3 strengths and weaknesses
  const topStrengths = highScoreQuestions.slice(0, 3);
  const topWeaknesses = lowScoreQuestions.slice(0, 3);

  // Generate general feedback based on overall score
  if (overallScore >= 80) {
    strengths.push({
      description:
        "تظهر مهارات شخصية قوية بشكل عام وقدرة على التعامل مع المواقف المختلفة بفعالية.",
    });
  } else if (overallScore >= 60) {
    strengths.push({
      description:
        "تمتلك مهارات جيدة في التعامل مع المواقف المختلفة مع وجود مجال للتحسين.",
    });
  } else {
    areasForImprovement.push({
      description: "تحتاج إلى تطوير مهاراتك الشخصية والسلوكية بشكل عام.",
    });
  }

  // Add specific question-based feedback
  if (topStrengths.length > 0) {
    strengths.push({
      description:
        "أظهرت أداءً ممتازاً في اختيار الإجابات المناسبة للمواقف المهنية المختلفة.",
    });
  }

  if (topWeaknesses.length > 0) {
    areasForImprovement.push({
      description:
        "هناك مجال لتحسين مهاراتك في التعامل مع المواقف المهنية المختلفة.",
    });
  }

  // Add general professional development advice
  if (overallScore < 70) {
    areasForImprovement.push({
      description:
        "ننصح بالاطلاع على المزيد من الموارد حول المهارات الشخصية والسلوكية في بيئة العمل.",
    });
  }

  return {
    overallScore,
    questionCount,
    maxScore: maxPossiblePoints,
    earnedScore: totalPoints,
    strengths,
    areasForImprovement,
  };
}
