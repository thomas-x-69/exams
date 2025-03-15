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
      if (questionId.startsWith("dummy") || questionId.startsWith("fallback")) {
        // For dummy questions, compare with stored correct answer
        const correctAnswer =
          parseInt(questionId.charAt(questionId.length - 1)) % 3;
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
      if (isBehavioralPhase && question && question.points) {
        // Add the points for the selected answer
        const pointsForAnswer = question.points[selectedAnswer] || 0;
        results.totalPoints += pointsForAnswer;

        // Find the maximum possible points for this question
        const maxPoints = Math.max(...question.points);
        results.maxPossiblePoints += maxPoints;

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
    if (isBehavioralPhase && results.maxPossiblePoints > 0) {
      // For behavioral questions, use points-based percentage
      results.percentage = (
        (results.totalPoints / results.maxPossiblePoints) *
        100
      ).toFixed(1);
    } else {
      // For other questions, use the traditional correct/total calculation
      results.percentage =
        results.total > 0
          ? ((results.correct / results.total) * 100).toFixed(1)
          : "0.0";
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
