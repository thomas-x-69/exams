// src/app/data/questionsUtils.js
import questionsBank from "./index";
import { analyzeBehavioralResults } from "./behavioralAnalysis";
import { calculatePhaseScore } from "./calculatePhaseScore";

/**
 * Advanced Fisher-Yates shuffle with seed support for consistent randomization when needed
 * @param {Array} array - The array to shuffle
 * @param {number|null} seed - Optional seed for reproducible shuffling
 * @returns {Array} - The shuffled array
 */
export function advancedShuffle(array, seed = null) {
  const shuffled = [...array];

  // Use a seeded random number generator if seed is provided
  let getRandom;
  if (seed !== null) {
    // Simple seeded random function
    const seededRandom = (() => {
      let s = seed;
      return () => {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
      };
    })();
    getRandom = seededRandom;
  } else {
    // Use standard Math.random() if no seed
    getRandom = Math.random;
  }

  // Fisher-Yates shuffle with the chosen random function
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(getRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Generates a unique session ID for question tracking
 * @returns {string} - A unique session ID
 */
function generateSessionId() {
  return "qs_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}

/**
 * Get a cached session ID or create a new one for tracking question history
 * @returns {string} - Session ID
 */
function getSessionId() {
  if (typeof window === "undefined") return generateSessionId();

  let sessionId = localStorage.getItem("question_session_id");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("question_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Gets question history for the current session to avoid repetition
 * @returns {Object} - Map of previously shown questions
 */
function getQuestionHistory() {
  if (typeof window === "undefined") return {};

  try {
    const history = localStorage.getItem("question_history");
    return history ? JSON.parse(history) : {};
  } catch (e) {
    console.error("Error retrieving question history:", e);
    return {};
  }
}

/**
 * Updates question history with newly shown questions
 * @param {Array} questionIds - IDs of questions shown in the current session
 */
function updateQuestionHistory(questionIds) {
  if (typeof window === "undefined") return;

  try {
    const history = getQuestionHistory();
    const sessionId = getSessionId();

    if (!history[sessionId]) {
      history[sessionId] = [];
    }

    // Add new questions to history
    history[sessionId] = [...new Set([...history[sessionId], ...questionIds])];

    // Limit history size per session
    if (history[sessionId].length > 200) {
      history[sessionId] = history[sessionId].slice(-200);
    }

    // Limit number of sessions stored
    const sessions = Object.keys(history);
    if (sessions.length > 5) {
      const oldestSession = sessions.sort()[0];
      delete history[oldestSession];
    }

    localStorage.setItem("question_history", JSON.stringify(history));
  } catch (e) {
    console.error("Error updating question history:", e);
  }
}

/**
 * Select questions with minimal repetition based on history
 * @param {Array} availableQuestions - All available questions
 * @param {number} count - Number of questions to select
 * @returns {Array} - Selected questions with minimal repetition
 */
function selectQuestionsWithMinimalRepetition(availableQuestions, count) {
  if (availableQuestions.length <= count) {
    return [...availableQuestions]; // Return all if we don't have enough
  }

  // Get question history
  const history = getQuestionHistory();
  const sessionId = getSessionId();
  const recentlyShown = history[sessionId] || [];

  // Separate questions into those shown recently and those not shown
  const notRecentlyShown = availableQuestions.filter(
    (q) => !recentlyShown.includes(q.id)
  );
  const recentlyShownQuestions = availableQuestions.filter((q) =>
    recentlyShown.includes(q.id)
  );

  // Shuffle both arrays
  const shuffledNew = advancedShuffle(notRecentlyShown);
  const shuffledRecent = advancedShuffle(recentlyShownQuestions);

  // If we have enough new questions, use those
  if (shuffledNew.length >= count) {
    return shuffledNew.slice(0, count);
  }

  // Otherwise, use all new questions and fill with old ones
  return [
    ...shuffledNew,
    ...shuffledRecent.slice(0, count - shuffledNew.length),
  ];
}

/**
 * Selects a random subset of questions with category balancing
 * @param {Array} questions - All available questions
 * @param {number} count - Number of questions to select
 * @param {Object} options - Additional options for question selection
 * @returns {Array} - Selected questions
 */
export function getRandomizedQuestions(questions, count, options = {}) {
  if (!questions || !questions.length) {
    console.warn("No questions available to randomize");
    return [];
  }

  // Ensure count is not greater than available questions
  const actualCount = Math.min(count, questions.length);

  // Select questions with minimal repetition
  const selectedQuestions = selectQuestionsWithMinimalRepetition(
    questions,
    actualCount
  );

  // Category balancing if categories are available
  if (options.balanceCategories && questions.some((q) => q.category)) {
    const categoryCounts = {};

    // Count questions per category
    questions.forEach((q) => {
      if (q.category) {
        categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
      }
    });

    // Calculate ideal distribution
    const categories = Object.keys(categoryCounts);
    const idealCountPerCategory = Math.ceil(actualCount / categories.length);

    // Rebalance selection if possible
    if (categories.length > 1) {
      const balancedQuestions = [];
      const remainingByCategory = {};

      // Group questions by category
      questions.forEach((q) => {
        if (q.category) {
          if (!remainingByCategory[q.category]) {
            remainingByCategory[q.category] = [];
          }
          remainingByCategory[q.category].push(q);
        }
      });

      // Shuffle each category
      Object.keys(remainingByCategory).forEach((category) => {
        remainingByCategory[category] = advancedShuffle(
          remainingByCategory[category]
        );
      });

      // Select questions from each category
      let remainingCount = actualCount;

      // First round: get at least one from each category if possible
      categories.forEach((category) => {
        if (remainingByCategory[category].length > 0 && remainingCount > 0) {
          balancedQuestions.push(remainingByCategory[category].shift());
          remainingCount--;
        }
      });

      // Second round: distribute remaining slots proportionally
      while (remainingCount > 0) {
        for (const category of categories) {
          if (remainingByCategory[category].length > 0 && remainingCount > 0) {
            balancedQuestions.push(remainingByCategory[category].shift());
            remainingCount--;
          }

          if (remainingCount === 0) break;
        }

        // If we can't get any more questions, break the loop
        if (
          Object.values(remainingByCategory).every((arr) => arr.length === 0)
        ) {
          break;
        }
      }

      // If we managed to balance categories, use this selection
      if (balancedQuestions.length === actualCount) {
        selectedQuestions.length = 0;
        selectedQuestions.push(...balancedQuestions);
      }
    }
  }

  // Shuffle the final selection again
  const finalSelection = advancedShuffle(selectedQuestions);

  // Track the question IDs for history
  updateQuestionHistory(finalSelection.map((q) => q.id));

  // Return the questions without randomizing options
  return finalSelection;
}

/**
 * Gets a random set of questions for a specific subject and phase
 * @param {string} subject - The subject (e.g., "mail", "math", etc.)
 * @param {string} phase - The phase or category of questions
 * @param {number} count - The number of questions to return
 * @returns {Array} - Array of randomized questions
 */
export function getRandomQuestions(subject, phase, count) {
  try {
    let questions = [];
    let categoryInfo = {};

    // Normalize subject - default to 'mail' if not found
    const normalizedSubject =
      subject && questionsBank[subject] ? subject : "mail";

    // Handle nested categories (language and knowledge)
    if (phase.includes("_")) {
      const [mainPhase, subPhase] = phase.split("_");

      if (questionsBank[normalizedSubject]?.[mainPhase]?.[subPhase]) {
        questions = questionsBank[normalizedSubject][mainPhase][subPhase];
        categoryInfo.mainPhase = mainPhase;
        categoryInfo.subPhase = subPhase;
      } else {
        // Fallback to mail questions for the same phase if available
        if (questionsBank["mail"]?.[mainPhase]?.[subPhase]) {
          console.warn(
            `Using fallback questions from mail for ${subject}, ${phase}`
          );
          questions = questionsBank["mail"][mainPhase][subPhase];
          categoryInfo.mainPhase = mainPhase;
          categoryInfo.subPhase = subPhase;
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
      categoryInfo.phase = "education";
    }
    // Handle specialization for educational subjects
    else if (
      ["math", "english", "science", "social", "arabic"].includes(
        normalizedSubject
      ) &&
      phase === "specialization"
    ) {
      questions = questionsBank[normalizedSubject].specialization;
      categoryInfo.phase = "specialization";
    }
    // Handle direct categories (behavioral, specialization)
    else if (questionsBank[normalizedSubject]?.[phase]) {
      questions = questionsBank[normalizedSubject][phase];
      categoryInfo.phase = phase;
    } else {
      // Fallback to mail questions for the same phase if available
      if (questionsBank["mail"]?.[phase]) {
        console.warn(
          `Using fallback questions from mail for ${subject}, ${phase}`
        );
        questions = questionsBank["mail"][phase];
        categoryInfo.phase = phase;
      }
    }

    // Add category metadata to each question
    questions = questions.map((q) => ({
      ...q,
      category: q.category || categoryInfo.subPhase || categoryInfo.phase,
      subject: normalizedSubject,
    }));

    if (!questions || !questions.length) {
      console.warn(
        `No questions found for subject: ${subject}, phase: ${phase}, using dummy questions`
      );

      // Create dummy questions with metadata
      const dummyQuestions = [
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
          category: "dummy",
          subject: normalizedSubject,
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
          category: "dummy",
          subject: normalizedSubject,
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
          category: "dummy",
          subject: normalizedSubject,
        },
      ];

      return getRandomizedQuestions(dummyQuestions, Math.min(count, 3), {
        balanceCategories: false,
      });
    }

    // Return a random selection of questions without randomizing options
    return getRandomizedQuestions(questions, count, {
      balanceCategories: true,
    });
  } catch (error) {
    console.error("Error getting random questions:", error);
    // Return dummy questions as fallback
    const fallbackQuestions = [
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
        category: "fallback",
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
        category: "fallback",
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
        category: "fallback",
      },
    ];

    return getRandomizedQuestions(fallbackQuestions, Math.min(count, 3), {
      balanceCategories: false,
    });
  }
}

// Export the enhanced calculatePhaseScore function
export { calculatePhaseScore };

// Export the behavioral analysis function
export { analyzeBehavioralResults };
