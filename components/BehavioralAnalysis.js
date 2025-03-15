// components/BehavioralAnalysis.js
import React from "react";
import { analyzeBehavioralResults } from "../src/app/data/behavioralAnalysis";
import questionsBank from "../src/app/data/index";

const BehavioralAnalysis = ({ examState }) => {
  // Extract behavioral answers and questions
  const behavioralPhase = examState.phases["behavioral"] || {};
  const behavioralAnswers = behavioralPhase.answers || {};
  const behavioralQuestions = questionsBank.mail.behavioral || [];

  // Analyze results
  const analysis = analyzeBehavioralResults(
    behavioralAnswers,
    behavioralQuestions
  );

  // If no behavioral questions were answered, don't show the component
  if (Object.keys(behavioralAnswers).length === 0) {
    return null;
  }

  // Map trait keys to Arabic display names
  const traitNames = {
    leadership: "القيادة",
    teamwork: "العمل الجماعي",
    communication: "التواصل الفعال",
    timeManagement: "إدارة الوقت",
    problemSolving: "حل المشكلات",
    creativity: "الإبداع",
    responsibility: "تحمل المسؤولية",
    stressManagement: "إدارة الضغط",
    positiveAttitude: "الإيجابية",
    ethics: "الأخلاقيات",
    selfDevelopment: "التطوير الذاتي",
  };

  // Define color scheme for trait scores
  const getTraitColor = (score) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">تحليل الشخصية</h3>

      {/* Traits Analysis */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-700 mb-3">السمات الشخصية</h4>
        <div className="space-y-4">
          {Object.entries(analysis.traits).map(([trait, score]) => (
            <div key={trait} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {traitNames[trait] || trait}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {score}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getTraitColor(score)}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="mb-6">
          <h4 className="font-bold text-gray-700 mb-3">نقاط القوة</h4>
          <div className="space-y-3">
            {analysis.strengths.map((item, index) => (
              <div
                key={index}
                className="bg-green-50 rounded-lg p-3 border border-green-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-bold text-green-800">
                    {traitNames[item.trait] || item.trait} ({item.score}%)
                  </span>
                </div>
                <p className="text-sm text-gray-700 pr-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas for Improvement */}
      {analysis.areasForImprovement.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-700 mb-3">فرص التحسين</h4>
          <div className="space-y-3">
            {analysis.areasForImprovement.map((item, index) => (
              <div
                key={index}
                className="bg-amber-50 rounded-lg p-3 border border-amber-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M12 6a7 7 0 110 14 7 7 0 010-14z"
                    />
                  </svg>
                  <span className="font-bold text-amber-800">
                    {traitNames[item.trait] || item.trait} ({item.score}%)
                  </span>
                </div>
                <p className="text-sm text-gray-700 pr-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BehavioralAnalysis;
