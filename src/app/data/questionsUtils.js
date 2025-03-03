// src/app/data/questionsUtils.js
import questionsBank from "./index";

export function getRandomQuestions(subject, phase, count) {
  try {
    let questions = [];

    // Normalize subject - default to 'mail' if not found
    const normalizedSubject =
      subject && questionsBank[subject] ? subject : "mail";

    // Handle nested categories (language and knowledge)
    if (phase.includes("_")) {
      const [mainPhase, subPhase] = phase.split("_");

      if (questionsBank[normalizedSubject]?.[mainPhase]?.[subPhase]) {
        questions = questionsBank[normalizedSubject][mainPhase][subPhase];
      } else {
        // Fallback to mail questions for the same phase if available
        if (questionsBank["mail"]?.[mainPhase]?.[subPhase]) {
          console.warn(
            `Using fallback questions from mail for ${subject}, ${phase}`
          );
          questions = questionsBank["mail"][mainPhase][subPhase];
        }
      }
    }
    // Handle educational subjects (math, english, science, social, arabic)
    else if (
      ["math", "english", "science", "social", "arabic"].includes(
        normalizedSubject
      ) &&
      phase === "education"
    ) {
      questions = questionsBank[normalizedSubject].education;
    }
    // Handle specialization for educational subjects
    else if (
      ["math", "english", "science", "social", "arabic"].includes(
        normalizedSubject
      ) &&
      phase === "specialization"
    ) {
      questions = questionsBank[normalizedSubject].specialization;
    }
    // Handle direct categories (behavioral, specialization)
    else if (questionsBank[normalizedSubject]?.[phase]) {
      questions = questionsBank[normalizedSubject][phase];
    } else {
      // Fallback to mail questions for the same phase if available
      if (questionsBank["mail"]?.[phase]) {
        console.warn(
          `Using fallback questions from mail for ${subject}, ${phase}`
        );
        questions = questionsBank["mail"][phase];
      }
    }

    if (!questions || !questions.length) {
      console.warn(
        `No questions found for subject: ${subject}, phase: ${phase}, using dummy questions`
      );

      // Return dummy questions as fallback
      return [
        {
          id: "dummy1",
          text: "سؤال اختبار رقم 1",
          options: [
            "الخيار الأول",
            "الخيار الثاني",
            "الخيار الثالث",
            "الخيار الرابع",
          ],
          correctAnswer: 0,
        },
        {
          id: "dummy2",
          text: "سؤال اختبار رقم 2",
          options: [
            "الخيار الأول",
            "الخيار الثاني",
            "الخيار الثالث",
            "الخيار الرابع",
          ],
          correctAnswer: 1,
        },
        {
          id: "dummy3",
          text: "سؤال اختبار رقم 3",
          options: [
            "الخيار الأول",
            "الخيار الثاني",
            "الخيار الثالث",
            "الخيار الرابع",
          ],
          correctAnswer: 2,
        },
      ];
    }

    // Shuffle questions and get requested count
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  } catch (error) {
    console.error("Error getting random questions:", error);
    // Return dummy questions as fallback
    return [
      {
        id: "fallback1",
        text: "سؤال بديل 1",
        options: [
          "الخيار الأول",
          "الخيار الثاني",
          "الخيار الثالث",
          "الخيار الرابع",
        ],
        correctAnswer: 0,
      },
      {
        id: "fallback2",
        text: "سؤال بديل 2",
        options: [
          "الخيار الأول",
          "الخيار الثاني",
          "الخيار الثالث",
          "الخيار الرابع",
        ],
        correctAnswer: 1,
      },
      {
        id: "fallback3",
        text: "سؤال بديل 3",
        options: [
          "الخيار الأول",
          "الخيار الثاني",
          "الخيار الثالث",
          "الخيار الرابع",
        ],
        correctAnswer: 2,
      },
    ];
  }
}

export function calculatePhaseScore(subject, phase, answers) {
  try {
    const results = {
      total: Object.keys(answers).length,
      correct: 0,
      percentage: 0,
    };

    // Skip calculation if no answers
    if (results.total === 0) {
      return results;
    }

    // Normalize subject - default to 'mail' if not found
    const normalizedSubject =
      subject && questionsBank[subject] ? subject : "mail";

    Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
      let question;

      // Handle fallback and dummy questions
      if (questionId.startsWith("dummy") || questionId.startsWith("fallback")) {
        // For dummy questions, just count every first option as correct (for demonstration)
        if (selectedAnswer === 0) {
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

      if (question?.correctAnswer === selectedAnswer) {
        results.correct += 1;
      }
    });

    results.percentage =
      results.total > 0
        ? ((results.correct / results.total) * 100).toFixed(1)
        : "0.0";

    return results;
  } catch (error) {
    console.error("Error calculating phase score:", error);
    return { total: 0, correct: 0, percentage: 0 };
  }
}
