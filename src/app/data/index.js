// Import individual question files
import behavioral from "./behavioral";
import language_arabic from "./language_arabic";
import language_english from "./language_english";
import knowledge_iq from "./knowledge_iq";
import knowledge_general from "./knowledge_general";
import knowledge_it from "./knowledge_it";
import education_math from "./education_math";
import education_english from "./education_english";
import education_science from "./education_science";
import education_social from "./education_social";
import education_arabic from "./education_arabic";
import specialization_mail from "./specialization_mail";
import specialization_math from "./specialization_math";
import specialization_english from "./specialization_english";
import specialization_science from "./specialization_science";
import specialization_social from "./specialization_social";
import specialization_arabic from "./specialization_arabic";

// Organize questions into the structure expected by the existing utility functions
const questionsBank = {
  mail: {
    behavioral,
    language: {
      arabic: language_arabic,
      english: language_english,
    },
    knowledge: {
      iq: knowledge_iq,
      general: knowledge_general,
      it: knowledge_it,
    },
    specialization: specialization_mail,
  },
  math: {
    education: education_math,
    specialization: specialization_math,
  },
  english: {
    education: education_english,
    specialization: specialization_english,
  },
  science: {
    education: education_science,
    specialization: specialization_science,
  },
  social: {
    education: education_social,
    specialization: specialization_social,
  },
  arabic: {
    education: education_arabic,
    specialization: specialization_arabic,
  },
};

export default questionsBank;
