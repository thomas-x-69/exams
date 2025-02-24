// src/data/questionsUtils.js
import questionsBank from "./questionsData.js";

export function getRandomQuestions(subject, phase, count) {
  try {
    let questions = [];

    // Handle nested categories (language and knowledge)
    if (phase.includes("_")) {
      const [mainPhase, subPhase] = phase.split("_");
      if (questionsBank[subject]?.[mainPhase]?.[subPhase]) {
        questions = questionsBank[subject][mainPhase][subPhase];
      }
    }
    // Handle direct categories (behavioral, specialization, pedagogical)
    else if (questionsBank[subject]?.[phase]) {
      questions = questionsBank[subject][phase];
    }

    if (!questions.length) {
      console.error(
        `No questions found for subject: ${subject}, phase: ${phase}`
      );
      return [];
    }

    // Shuffle questions and get requested count
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  } catch (error) {
    console.error("Error getting random questions:", error);
    return [];
  }
}

export function calculatePhaseScore(subject, phase, answers) {
  try {
    const results = {
      total: Object.keys(answers).length,
      correct: 0,
      percentage: 0,
    };

    Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
      let question;
      if (phase.includes("_")) {
        const [mainPhase, subPhase] = phase.split("_");
        if (questionsBank[subject]?.[mainPhase]?.[subPhase]) {
          question = questionsBank[subject][mainPhase][subPhase].find(
            (q) => q.id === questionId
          );
        }
      } else if (questionsBank[subject]?.[phase]) {
        question = questionsBank[subject][phase].find(
          (q) => q.id === questionId
        );
      }

      if (question?.correctAnswer === selectedAnswer) {
        results.correct += 1;
      }
    });

    results.percentage = ((results.correct / results.total) * 100).toFixed(1);
    return results;
  } catch (error) {
    console.error("Error calculating phase score:", error);
    return { total: 0, correct: 0, percentage: 0 };
  }
}
