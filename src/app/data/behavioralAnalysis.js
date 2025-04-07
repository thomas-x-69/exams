// src/app/data/behavioralAnalysis.js - Complete rewrite
// Simple, reliable behavioral analysis function

export function analyzeBehavioralResults(answers, questions) {
  console.log("Starting behavioral analysis with:", {
    answersCount: Object.keys(answers || {}).length,
    questionsCount: (questions || []).length,
  });

  // Handle empty inputs
  if (!answers || !questions || Object.keys(answers).length === 0) {
    return {
      overallScore: 0,
      questionCount: 0,
      strengths: [],
      areasForImprovement: [],
    };
  }

  // Create a simple map of questions by ID for quick lookup
  const questionMap = {};
  questions.forEach((q) => {
    if (q.id) {
      questionMap[q.id] = q;
    }
  });

  // Variables to track scores
  let totalPoints = 0;
  let maxPossiblePoints = 0;
  let questionsProcessed = 0;

  // Process each answer
  Object.entries(answers).forEach(([questionId, selectedAnswerIndex]) => {
    const question = questionMap[questionId];

    // Skip if question not found or invalid answer
    if (
      !question ||
      selectedAnswerIndex === undefined ||
      selectedAnswerIndex === null
    ) {
      return;
    }

    // Make sure question has a points array
    if (!Array.isArray(question.points)) {
      question.points = [1, 2, 3, 4, 5]; // Default points array
    }

    // Validate answer index
    if (
      selectedAnswerIndex >= 0 &&
      selectedAnswerIndex < question.points.length
    ) {
      const pointValue = question.points[selectedAnswerIndex];

      // Use default point value if invalid
      const earnedPoints =
        typeof pointValue === "number" && !isNaN(pointValue) ? pointValue : 3; // Default to middle value

      // Get maximum points possible for this question
      const maxPoints = Math.max(
        ...question.points.filter((p) => typeof p === "number" && !isNaN(p))
      );

      // Use default max if invalid
      const validMaxPoints = maxPoints > 0 ? maxPoints : 5;

      // Add to totals
      totalPoints += earnedPoints;
      maxPossiblePoints += validMaxPoints;
      questionsProcessed++;
    }
  });

  // Calculate overall score (default to 50% if no valid calculation)
  const overallScore =
    maxPossiblePoints > 0 && questionsProcessed > 0
      ? Math.round((totalPoints / maxPossiblePoints) * 100)
      : questionsProcessed > 0
      ? 50
      : 0;

  console.log("Behavioral analysis results:", {
    totalPoints,
    maxPossiblePoints,
    questionsProcessed,
    overallScore,
  });

  // Generate feedback based on score
  const strengths = [];
  const areasForImprovement = [];

  // Add at least one strength
  if (overallScore >= 70) {
    strengths.push({
      description:
        "تظهر مهارات شخصية قوية بشكل عام وقدرة على التعامل مع المواقف المختلفة بفعالية.",
    });
  } else {
    strengths.push({
      description:
        "تمتلك القدرة على تطوير مهاراتك الشخصية والسلوكية بشكل مستمر.",
    });
  }

  // Add at least one improvement area
  if (overallScore < 70) {
    areasForImprovement.push({
      description:
        "تحتاج إلى تطوير مهاراتك في التعامل مع المواقف المهنية المختلفة.",
    });
  } else {
    areasForImprovement.push({
      description:
        "استمر في تعزيز مهاراتك الشخصية والسلوكية لتحقيق النجاح في بيئة العمل.",
    });
  }

  return {
    overallScore,
    questionCount: questionsProcessed,
    strengths,
    areasForImprovement,
  };
}
