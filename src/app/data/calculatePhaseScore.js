// src/app/data/calculatePhaseScore.js
import questionsBank from "./index";

/**
 * Calculate the score for a phase based on user answers
 * Modified to support points-based scoring for behavioral questions
 */
export function calculatePhaseScore(subject, phase, answers) {
  try {
    const results = {
      total: Object.keys(answers).length,
      correct: 0,
      percentage: 0,
      totalPoints: 0,
      maxPossiblePoints: 0,
    };

    // Skip calculation if no answers
    if (results.total === 0) {
      return results;
    }

    // Normalize subject - default to 'mail' if not found
    const normalizedSubject =
      subject && questionsBank[subject] ? subject : "mail";

    // Check if this is a behavioral phase - special points-based scoring
    const isBehavioralPhase = phase === "behavioral";

    Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
      let question;

      // Handle fallback and dummy questions
      // Handle fallback and dummy questions
      if (questionId.startsWith("dummy") || questionId.startsWith("fallback")) {
        // Extract the numeric part and use it to get the correct answer
        const lastDigit = parseInt(questionId.slice(-1));
        const correctAnswer = lastDigit - 1;

        if (selectedAnswer === correctAnswer) {
          results.correct += 1;
        }
        return;
      }

      // Look for the question in the questions bank
      if (phase.includes("_")) {
        const [mainPhase, subPhase] = phase.split("_");
        if (questionsBank[normalizedSubject]?.[mainPhase]?.[subPhase]) {
          question = questionsBank[normalizedSubject][mainPhase][subPhase].find(
            (q) => q.id === questionId
          );
        }

        // Fallback to mail subject if question not found
        if (!question && questionsBank["mail"]?.[mainPhase]?.[subPhase]) {
          question = questionsBank["mail"][mainPhase][subPhase].find(
            (q) => q.id === questionId
          );
        }
      }
      // Handle educational subjects
      else if (
        ["math", "english", "science", "social", "arabic"].includes(
          normalizedSubject
        ) &&
        phase === "education"
      ) {
        question = questionsBank[normalizedSubject].education.find(
          (q) => q.id === questionId
        );
      }
      // Handle specialization for educational subjects
      else if (
        ["math", "english", "science", "social", "arabic"].includes(
          normalizedSubject
        ) &&
        phase === "specialization"
      ) {
        question = questionsBank[normalizedSubject].specialization.find(
          (q) => q.id === questionId
        );
      } else if (questionsBank[normalizedSubject]?.[phase]) {
        question = questionsBank[normalizedSubject][phase].find(
          (q) => q.id === questionId
        );

        // Fallback to mail subject if question not found
        if (!question && questionsBank["mail"]?.[phase]) {
          question = questionsBank["mail"][phase].find(
            (q) => q.id === questionId
          );
        }
      }

      // For behavioral questions, use points-based scoring
      // More robust points handling for behavioral questions
      if (isBehavioralPhase && question && question.points) {
        // Make sure we have valid points data
        if (Array.isArray(question.points)) {
          // Make sure selectedAnswer is within bounds
          if (selectedAnswer >= 0 && selectedAnswer < question.points.length) {
            const pointValue = question.points[selectedAnswer];
            // Make sure the point value is a number
            results.totalPoints +=
              typeof pointValue === "number" ? pointValue : 0;
          }

          // Calculate max points correctly
          try {
            const validPoints = question.points.filter(
              (p) => typeof p === "number"
            );
            results.maxPossiblePoints +=
              validPoints.length > 0 ? Math.max(...validPoints) : 0;
          } catch (err) {
            console.error(
              "Error calculating max points:",
              err,
              question.points
            );
          }
        }

        // For backward compatibility, also count as "correct" if selecting the best answer
        if (selectedAnswer === question.correctAnswer) {
          results.correct += 1;
        }
      }
      // For other question types, continue using the binary right/wrong system
      else if (question?.correctAnswer === selectedAnswer) {
        results.correct += 1;
      }
    });

    // Calculate percentage based on the scoring method used
    // FIXED VERSION - Ensure percentage is a number:
    if (isBehavioralPhase && results.maxPossiblePoints > 0) {
      results.percentage = Number(
        ((results.totalPoints / results.maxPossiblePoints) * 100).toFixed(1)
      );
    } else {
      results.percentage =
        results.total > 0
          ? Number(((results.correct / results.total) * 100).toFixed(1))
          : 0;
    }

    return results;
  } catch (error) {
    console.error("Error calculating phase score:", error);
    return {
      total: 0,
      correct: 0,
      percentage: 0,
      totalPoints: 0,
      maxPossiblePoints: 0,
    };
  }
}
