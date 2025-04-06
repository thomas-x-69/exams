// src/app/data/calculatePhaseScore.js
import questionsBank from "./index";

export function calculatePhaseScore(subject, phase, answers) {
  try {
    console.log(`Calculating score for phase: ${phase}`); // Debug log

    const results = {
      total: Object.keys(answers).length,
      correct: 0,
      percentage: 0,
      totalPoints: 0,
      maxPossiblePoints: 0,
    };

    // Skip calculation if no answers
    if (results.total === 0) {
      console.log("No answers found, returning zeros");
      return results;
    }

    // Normalize subject - default to 'mail' if not found
    const normalizedSubject =
      subject && questionsBank[subject] ? subject : "mail";

    // Check if this is a behavioral phase - special points-based scoring
    const isBehavioralPhase = phase === "behavioral";

    if (isBehavioralPhase) {
      console.log("Processing behavioral phase with points-based scoring");
    }

    // Count how many questions we actually found and processed
    let foundQuestionCount = 0;

    Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
      // Debug info
      console.log(
        `Processing questionId: ${questionId}, selectedAnswer: ${selectedAnswer}`
      );

      let question = null;

      // Handle fallback and dummy questions
      if (questionId.startsWith("dummy") || questionId.startsWith("fallback")) {
        console.log("Processing dummy/fallback question");
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
      } else if (
        ["math", "english", "science", "social", "arabic"].includes(
          normalizedSubject
        ) &&
        phase === "education"
      ) {
        question = questionsBank[normalizedSubject].education.find(
          (q) => q.id === questionId
        );
      } else if (
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

      // If question was found, increment counter
      if (question) {
        foundQuestionCount++;
        console.log(`Found question: ${question.text}`);
      } else {
        console.log(`Question not found for ID: ${questionId}`);
        return; // Skip this question
      }

      // For behavioral questions, use points-based scoring
      if (isBehavioralPhase && question && Array.isArray(question.points)) {
        // Log the points array for debugging
        console.log(
          `Points array for question ${questionId}:`,
          question.points
        );

        // Validate the selected answer is within bounds
        if (selectedAnswer >= 0 && selectedAnswer < question.points.length) {
          // Get the points earned for this answer
          const pointValue = question.points[selectedAnswer];

          // Log points earned
          console.log(
            `Selected answer: ${selectedAnswer}, Points earned: ${pointValue}`
          );

          // Add points to total if it's a valid number
          if (typeof pointValue === "number" && !isNaN(pointValue)) {
            results.totalPoints += pointValue;
          } else {
            console.log(`Invalid point value: ${pointValue}`);
          }

          // Calculate max points by finding the highest point value
          const validPoints = question.points.filter(
            (p) => typeof p === "number" && !isNaN(p)
          );

          if (validPoints.length > 0) {
            const maxPoint = Math.max(...validPoints);
            results.maxPossiblePoints += maxPoint;
            console.log(`Max possible points for this question: ${maxPoint}`);
          } else {
            console.log("No valid points found in points array");
          }
        } else {
          console.log(`Selected answer out of bounds: ${selectedAnswer}`);
        }
      }
      // For other question types, continue using the binary right/wrong system
      else if (question?.correctAnswer === selectedAnswer) {
        results.correct += 1;
      }
    });

    // Log the results of our calculation
    console.log(
      `Questions found and processed: ${foundQuestionCount} out of ${results.total}`
    );
    console.log(`Total points earned: ${results.totalPoints}`);
    console.log(`Max possible points: ${results.maxPossiblePoints}`);

    // Calculate percentage based on the scoring method used
    if (isBehavioralPhase && results.maxPossiblePoints > 0) {
      // For behavioral questions, use points-based scoring
      const rawPercentage =
        (results.totalPoints / results.maxPossiblePoints) * 100;
      results.percentage = Math.round(rawPercentage);

      console.log(
        `Raw percentage: ${rawPercentage}, Rounded: ${results.percentage}`
      );

      // IMPORTANT: Make sure we're not applying any minimum score here
    } else {
      // For other question types, use standard correct/total calculation
      results.percentage =
        results.total > 0
          ? Math.round((results.correct / results.total) * 100)
          : 0;
    }

    console.log(`Final calculated percentage: ${results.percentage}`);
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
