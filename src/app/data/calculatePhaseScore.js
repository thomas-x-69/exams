// src/app/data/calculatePhaseScore.js - Complete rewrite
// Simple, reliable phase score calculator

import questionsBank from "./index";

export function calculatePhaseScore(subject, phase, answers) {
  console.log(
    `Calculating score for phase: ${phase} with ${
      Object.keys(answers).length
    } answers`
  );

  // Initialize result structure
  const results = {
    total: Object.keys(answers).length,
    correct: 0,
    percentage: 0,
    totalPoints: 0,
    maxPossiblePoints: 0,
  };

  // Handle no answers case
  if (results.total === 0) {
    return results;
  }

  // Determine if this is a behavioral phase (needs special handling)
  const isBehavioralPhase = phase === "behavioral";

  // Normalize subject - default to 'mail' if not found
  const normalizedSubject =
    subject && questionsBank[subject] ? subject : "mail";

  // Get questions for this phase
  let phaseQuestions = [];

  // Look up the questions based on phase structure
  if (phase.includes("_")) {
    // This is a subphase (like language_arabic)
    const [mainPhase, subPhase] = phase.split("_");

    // Try to get questions from specified subject
    if (questionsBank[normalizedSubject]?.[mainPhase]?.[subPhase]) {
      phaseQuestions = questionsBank[normalizedSubject][mainPhase][subPhase];
    }
    // Fall back to mail if needed
    else if (questionsBank["mail"]?.[mainPhase]?.[subPhase]) {
      phaseQuestions = questionsBank["mail"][mainPhase][subPhase];
    }
  }
  // Special handling for educational subjects
  else if (
    ["math", "english", "science", "social", "arabic"].includes(
      normalizedSubject
    ) &&
    (phase === "education" || phase === "specialization")
  ) {
    phaseQuestions = questionsBank[normalizedSubject][phase] || [];
  }
  // Regular main phase
  else if (questionsBank[normalizedSubject]?.[phase]) {
    phaseQuestions = questionsBank[normalizedSubject][phase];
  }
  // Fall back to mail if needed
  else if (questionsBank["mail"]?.[phase]) {
    phaseQuestions = questionsBank["mail"][phase];
  }

  // Build a question lookup map for efficiency
  const questionMap = {};
  phaseQuestions.forEach((q) => {
    if (q.id) {
      questionMap[q.id] = q;
    }
  });

  // Process each answer
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    const question = questionMap[questionId];

    // Handle dummy/fallback questions
    if (questionId.startsWith("dummy") || questionId.startsWith("fallback")) {
      const lastDigit = parseInt(questionId.slice(-1));
      const correctAnswer = lastDigit - 1;

      if (selectedAnswer === correctAnswer) {
        results.correct += 1;
      }

      // For behavioral, add default points
      if (isBehavioralPhase) {
        results.totalPoints += 3; // Default middle value
        results.maxPossiblePoints += 5; // Default max value
      }
      return;
    }

    // Skip if question not found
    if (!question) {
      if (isBehavioralPhase) {
        // For behavioral, still count with default points
        results.totalPoints += 3;
        results.maxPossiblePoints += 5;
      }
      return;
    }

    // Handle behavioral questions with point values
    if (isBehavioralPhase) {
      // Ensure we have a points array
      const pointsArray = Array.isArray(question.points)
        ? question.points
        : [1, 2, 3, 4, 5]; // Default points

      // Validate selected answer
      if (selectedAnswer >= 0 && selectedAnswer < pointsArray.length) {
        const pointValue = pointsArray[selectedAnswer];

        // Add points to total
        results.totalPoints +=
          typeof pointValue === "number" && !isNaN(pointValue) ? pointValue : 3; // Default to middle value

        // Get max possible points for this question
        const maxPoint = Math.max(
          ...pointsArray.filter((p) => typeof p === "number" && !isNaN(p))
        );
        results.maxPossiblePoints += maxPoint > 0 ? maxPoint : 5;
      } else {
        // Out of bounds answer, use defaults
        results.totalPoints += 3;
        results.maxPossiblePoints += 5;
      }
    }
    // For regular questions, use binary scoring
    else if (question.correctAnswer === selectedAnswer) {
      results.correct += 1;
    }
  });

  // Calculate final percentage score
  if (isBehavioralPhase && results.maxPossiblePoints > 0) {
    // For behavioral, use points-based scoring
    results.percentage = Math.round(
      (results.totalPoints / results.maxPossiblePoints) * 100
    );

    // Safety check - don't return 0 for behavioral if we have answers
    if (results.percentage === 0 && results.total > 0) {
      results.percentage = 50; // Default to middle score
    }
  } else {
    // For other phases, use correct/total scoring
    results.percentage =
      results.total > 0
        ? Math.round((results.correct / results.total) * 100)
        : 0;
  }

  console.log(`Phase ${phase} score calculation:`, {
    total: results.total,
    correct: results.correct,
    totalPoints: results.totalPoints,
    maxPossiblePoints: results.maxPossiblePoints,
    percentage: results.percentage,
  });

  return results;
}
