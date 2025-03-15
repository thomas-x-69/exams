// src/app/data/behavioralAnalysis.js

/**
 * Analyze behavioral test results to provide detailed insights
 * @param {Object} answers - User's answers to behavioral questions
 * @param {Array} questions - Array of behavioral questions with points
 * @returns {Object} - Analysis of the user's behavioral traits
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
      traits: {},
      strengths: [],
      areasForImprovement: [],
    };
  }

  // Categories for behavioral questions (can be expanded)
  const traitCategories = {
    leadership: [
      "beh52",
      "beh53",
      "beh54",
      "beh55",
      "beh56",
      "beh57",
      "beh58",
      "beh59",
      "beh60",
      "beh61",
      "beh161",
      "beh162",
      "beh164",
    ],
    teamwork: [
      "beh62",
      "beh63",
      "beh64",
      "beh65",
      "beh66",
      "beh67",
      "beh68",
      "beh69",
      "beh70",
      "beh71",
      "beh141",
      "beh142",
      "beh143",
      "beh144",
      "beh145",
      "beh146",
    ],
    communication: [
      "beh131",
      "beh132",
      "beh134",
      "beh135",
      "beh136",
      "beh137",
      "beh138",
      "beh139",
      "beh172",
      "beh173",
      "beh175",
      "beh176",
      "beh177",
      "beh178",
    ],
    timeManagement: [
      "beh42",
      "beh43",
      "beh44",
      "beh45",
      "beh46",
      "beh47",
      "beh48",
      "beh49",
      "beh50",
      "beh51",
      "beh102",
      "beh159",
    ],
    problemSolving: [
      "beh112",
      "beh113",
      "beh114",
      "beh115",
      "beh116",
      "beh117",
      "beh118",
      "beh119",
      "beh120",
    ],
    creativity: [
      "beh121",
      "beh122",
      "beh123",
      "beh124",
      "beh125",
      "beh126",
      "beh127",
      "beh128",
      "beh129",
      "beh130",
    ],
    responsibility: [
      "beh22",
      "beh23",
      "beh24",
      "beh25",
      "beh26",
      "beh27",
      "beh28",
      "beh29",
      "beh30",
      "beh31",
    ],
    stressManagement: [
      "beh72",
      "beh73",
      "beh74",
      "beh75",
      "beh76",
      "beh77",
      "beh78",
      "beh79",
      "beh80",
      "beh81",
    ],
    positiveAttitude: [
      "beh32",
      "beh33",
      "beh34",
      "beh35",
      "beh36",
      "beh37",
      "beh38",
      "beh39",
      "beh40",
      "beh41",
    ],
    ethics: [
      "beh92",
      "beh93",
      "beh94",
      "beh95",
      "beh96",
      "beh97",
      "beh98",
      "beh99",
      "beh100",
      "beh101",
      "beh166",
    ],
    selfDevelopment: [
      "beh82",
      "beh83",
      "beh84",
      "beh85",
      "beh86",
      "beh87",
      "beh88",
      "beh89",
      "beh90",
      "beh91",
    ],
  };

  // Calculate points for each trait
  const traitScores = {};
  const traitMaxScores = {};

  // Initialize trait scores
  Object.keys(traitCategories).forEach((trait) => {
    traitScores[trait] = 0;
    traitMaxScores[trait] = 0;
  });

  // Calculate total points earned and maximum possible
  let totalPoints = 0;
  let maxPossiblePoints = 0;

  // Process each answered question
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    // Find the question
    const question = questions.find((q) => q.id === questionId);

    if (question && question.points) {
      // Calculate points for this answer
      const pointsEarned = question.points[selectedAnswer] || 0;
      const maxPoints = Math.max(...question.points);

      totalPoints += pointsEarned;
      maxPossiblePoints += maxPoints;

      // Add points to appropriate trait categories
      Object.entries(traitCategories).forEach(([trait, questionIds]) => {
        if (questionIds.includes(questionId)) {
          traitScores[trait] += pointsEarned;
          traitMaxScores[trait] += maxPoints;
        }
      });
    }
  });

  // Calculate percentage scores for each trait
  const traitPercentages = {};
  Object.keys(traitScores).forEach((trait) => {
    if (traitMaxScores[trait] > 0) {
      traitPercentages[trait] = Math.round(
        (traitScores[trait] / traitMaxScores[trait]) * 100
      );
    } else {
      traitPercentages[trait] = 0;
    }
  });

  // Calculate overall score
  const overallScore =
    maxPossiblePoints > 0
      ? Math.round((totalPoints / maxPossiblePoints) * 100)
      : 0;

  // Identify strengths and areas for improvement
  const strengths = [];
  const areasForImprovement = [];

  Object.entries(traitPercentages).forEach(([trait, score]) => {
    // If enough questions were answered for this trait
    if (traitMaxScores[trait] > 0) {
      if (score >= 80) {
        strengths.push({
          trait,
          score,
          description: getTraitDescription(trait, true),
        });
      } else if (score <= 60) {
        areasForImprovement.push({
          trait,
          score,
          description: getTraitDescription(trait, false),
        });
      }
    }
  });

  // Sort strengths and areas for improvement by score
  strengths.sort((a, b) => b.score - a.score);
  areasForImprovement.sort((a, b) => a.score - b.score);

  return {
    overallScore,
    traits: traitPercentages,
    strengths: strengths.slice(0, 3), // Top 3 strengths
    areasForImprovement: areasForImprovement.slice(0, 3), // Top 3 areas for improvement
  };
}

/**
 * Get human-readable description for traits
 * @param {string} trait - The trait identifier
 * @param {boolean} isStrength - Whether this is a strength or area for improvement
 * @returns {string} - Human-readable description
 */
function getTraitDescription(trait, isStrength) {
  const descriptions = {
    leadership: {
      strength: "تتمتع بمهارات قيادية ممتازة وقدرة على توجيه الآخرين بفعالية",
      improvement:
        "يمكنك تطوير مهاراتك القيادية من خلال زيادة الثقة في اتخاذ القرارات وتحفيز الفريق",
    },
    teamwork: {
      strength:
        "لديك قدرة ممتازة على العمل ضمن فريق والمساهمة في نجاح المجموعة",
      improvement:
        "يمكنك تحسين تعاونك مع الفريق من خلال المشاركة الفعالة والاستماع لآراء الزملاء",
    },
    communication: {
      strength: "تتمتع بمهارات تواصل فعالة تساعدك على التعبير عن أفكارك بوضوح",
      improvement:
        "يمكنك تطوير مهارات التواصل لديك للتعبير عن أفكارك بشكل أكثر وضوحاً",
    },
    timeManagement: {
      strength: "لديك قدرة ممتازة على إدارة الوقت وتنظيم المهام بكفاءة",
      improvement:
        "يمكنك تحسين إدارتك للوقت من خلال تحديد الأولويات وتجنب التأجيل",
    },
    problemSolving: {
      strength: "تتمتع بقدرة عالية على حل المشكلات والتفكير التحليلي",
      improvement:
        "يمكنك تطوير مهارات حل المشكلات من خلال التفكير المنهجي والبحث عن حلول متعددة",
    },
    creativity: {
      strength: "لديك تفكير إبداعي وقدرة على ابتكار حلول جديدة",
      improvement:
        "يمكنك تعزيز تفكيرك الإبداعي من خلال التجريب والانفتاح على الأفكار الجديدة",
    },
    responsibility: {
      strength: "تتحمل المسؤولية بشكل ممتاز وتلتزم بإنجاز المهام الموكلة إليك",
      improvement:
        "يمكنك تطوير حس المسؤولية لديك من خلال الالتزام بالمواعيد وتحمل نتائج قراراتك",
    },
    stressManagement: {
      strength: "تتعامل مع الضغط بشكل فعال وتحافظ على هدوئك في المواقف الصعبة",
      improvement:
        "يمكنك تحسين قدرتك على إدارة الضغط من خلال تقنيات الاسترخاء والتركيز على الحلول",
    },
    positiveAttitude: {
      strength: "تتمتع بنظرة إيجابية وقدرة على خلق بيئة عمل إيجابية",
      improvement:
        "يمكنك تعزيز نظرتك الإيجابية من خلال التركيز على الحلول بدلاً من المشكلات",
    },
    ethics: {
      strength: "تتمتع بمستوى عالٍ من النزاهة والأخلاق في تعاملاتك",
      improvement:
        "يمكنك تطوير الجانب الأخلاقي في العمل من خلال الشفافية والالتزام بالقيم",
    },
    selfDevelopment: {
      strength: "لديك شغف للتعلم المستمر وتطوير مهاراتك الشخصية والمهنية",
      improvement:
        "يمكنك تعزيز تطويرك الذاتي من خلال وضع أهداف تعليمية واضحة ومتابعتها",
    },
  };

  return descriptions[trait]
    ? isStrength
      ? descriptions[trait].strength
      : descriptions[trait].improvement
    : "معلومات غير متوفرة";
}
