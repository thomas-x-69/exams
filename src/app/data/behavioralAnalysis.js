// src/app/data/behavioralAnalysis.js - Fixed version with improved question lookup

/**
 * Analyze behavioral test results - simplified version without trait categorization
 * @param {Object} answers - User's answers to behavioral questions
 * @param {Array} questions - Array of behavioral questions with points
 * @returns {Object} - Analysis of the user's behavioral performance
 */
export function analyzeBehavioralResults(answers, questions) {
  console.log("======= BEHAVIORAL ANALYSIS START =======");
  console.log("Inputs:", {
    answersProvided: !!answers,
    questionsProvided: !!questions,
    answersCount: answers ? Object.keys(answers).length : 0,
    questionsCount: questions ? questions.length : 0,
  });

  // Early check for empty inputs
  if (
    !answers ||
    !questions ||
    Object.keys(answers).length === 0 ||
    questions.length === 0
  ) {
    console.log("No valid inputs provided, returning default empty result");
    return {
      overallScore: 0,
      questionCount: 0,
      maxScore: 0,
      earnedScore: 0,
      strengths: [],
      areasForImprovement: [],
    };
  }

  // Create a question lookup map for faster access and to avoid find() failures
  const questionMap = {};

  // First populate the map with the standard ID format
  questions.forEach((question) => {
    if (question.id) {
      questionMap[question.id] = question;
    }
  });

  // Log available question IDs for debugging
  console.log(
    "Available question IDs in questions array:",
    Object.keys(questionMap)
  );
  console.log("Answer IDs we need to look up:", Object.keys(answers));

  // Calculate total points earned and maximum possible
  let totalPoints = 0;
  let maxPossiblePoints = 0;
  let questionCount = 0;

  // Track high and low scoring questions for feedback
  const highScoreQuestions = [];
  const lowScoreQuestions = [];

  // Process each answered question
  console.log("Processing individual questions...");
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    // Get the question from our map
    let question = questionMap[questionId];

    // If question not found, try alternative lookup approaches
    if (!question) {
      // Log and try to find a fallback question
      console.log(
        `Question ID ${questionId} not found directly. Attempting alternative lookup.`
      );

      // Approach 1: Try finding by string comparison (case insensitive)
      question = questions.find(
        (q) =>
          q.id &&
          String(q.id).toLowerCase() === String(questionId).toLowerCase()
      );

      // Approach 2: If we still don't have a question, try a default fallback
      if (!question && questions.length > 0) {
        // Create a fallback question with default structure using first question as template
        // This ensures we can still process the answer even if specific question not found
        const templateQuestion = questions[0];
        question = {
          id: questionId,
          text: `Question ${questionId}`,
          points: Array.isArray(templateQuestion.points)
            ? [...templateQuestion.points]
            : [1, 2, 3, 4, 5],
        };
        console.log(`Created fallback question for ID ${questionId}`);
      }
    }

    if (!question) {
      console.log(
        `WARNING: Could not process question ID ${questionId}, no viable fallback found`
      );
      return;
    }

    console.log(`Processing question:`, {
      id: question.id,
      text: question.text?.substring(0, 30) + "...", // Log truncated text
      hasPoints: !!question.points,
      pointsIsArray: Array.isArray(question.points),
    });

    // Ensure question.points is an array
    if (!Array.isArray(question.points)) {
      console.log(`Converting points to array for question ${questionId}`);
      // Convert to array if it's an object with numeric indices as keys
      if (typeof question.points === "object" && question.points !== null) {
        const pointsArray = [];
        for (let i = 0; i < 10; i++) {
          // Assuming max 10 options
          if (question.points[i] !== undefined) {
            pointsArray[i] = question.points[i];
          }
        }
        question.points =
          pointsArray.length > 0 ? pointsArray : [1, 2, 3, 4, 5];
      } else {
        // Default points array if nothing valid exists
        question.points = [1, 2, 3, 4, 5];
      }
    }

    // Validate the selected answer is within points array bounds
    if (selectedAnswer >= 0 && selectedAnswer < question.points.length) {
      const pointValues = question.points.filter(
        (p) => typeof p === "number" && !isNaN(p)
      );

      if (pointValues.length > 0) {
        const pointsEarned = question.points[selectedAnswer] || 0;
        const maxPoints = Math.max(...pointValues);

        console.log(
          `Question ${questionId}: Points earned: ${pointsEarned}, Max points: ${maxPoints}`
        );

        if (maxPoints <= 0) {
          console.log(
            `WARNING: Question ${questionId} has maxPoints <= 0, using default 5`
          );
          maxPossiblePoints += 5; // Default to 5 points if invalid
          totalPoints += Math.min(pointsEarned, 5);
        } else {
          totalPoints += pointsEarned;
          maxPossiblePoints += maxPoints;
        }

        questionCount++;

        // Track performance on specific questions
        const percentageScore =
          maxPoints > 0 ? (pointsEarned / maxPoints) * 100 : 0;

        if (percentageScore >= 75) {
          highScoreQuestions.push({
            text: question.text || `Question ${questionId}`,
            score: percentageScore,
          });
        } else if (percentageScore <= 50) {
          lowScoreQuestions.push({
            text: question.text || `Question ${questionId}`,
            score: percentageScore,
          });
        }
      } else {
        console.log(
          `WARNING: No valid point values for question ${questionId}, using defaults`
        );
        // Use default values if no valid points
        totalPoints += 3; // Middle value as default
        maxPossiblePoints += 5;
        questionCount++;
      }
    } else {
      console.log(
        `WARNING: Selected answer ${selectedAnswer} is out of bounds for question ${questionId}`
      );
      // Use default middle values if selection is invalid
      totalPoints += 3; // Middle value as default
      maxPossiblePoints += 5;
      questionCount++;
    }
  });

  // Safety check for zero division
  if (maxPossiblePoints === 0 && questionCount > 0) {
    console.log(
      "WARNING: maxPossiblePoints is 0 despite having questions, setting default value"
    );
    maxPossiblePoints = questionCount * 5; // Default 5 points per question
  }

  // Calculate overall score
  const overallScore =
    maxPossiblePoints > 0
      ? Math.round((totalPoints / maxPossiblePoints) * 100)
      : 0;

  console.log(
    `Overall score calculation: (${totalPoints} / ${maxPossiblePoints}) * 100 = ${overallScore}%`
  );

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

  // Ensure at least one strength and one area for improvement
  if (strengths.length === 0) {
    strengths.push({
      description:
        "تمتلك القدرة على التطور والتحسن المستمر في المهارات الشخصية.",
    });
  }

  if (areasForImprovement.length === 0) {
    areasForImprovement.push({
      description:
        "استمر في تطوير مهاراتك من خلال التدريب المستمر والتعلم الذاتي.",
    });
  }

  // Final result
  const result = {
    overallScore,
    questionCount,
    maxScore: maxPossiblePoints,
    earnedScore: totalPoints,
    strengths,
    areasForImprovement,
  };

  console.log("Final result:", result);
  console.log("======= BEHAVIORAL ANALYSIS END =======");

  return result;
}
