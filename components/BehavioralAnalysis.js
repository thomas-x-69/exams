// components/BehavioralAnalysis.js - Simplified without trait categorization
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

  // Function to get color class based on score
  const getScoreColorClass = (score) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        تحليل المهارات السلوكية والشخصية
      </h3>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-gray-700">الدرجة الكلية</h4>
          <span className="text-lg font-bold text-gray-900">
            {analysis.overallScore}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreColorClass(
              analysis.overallScore
            )}`}
            style={{ width: `${analysis.overallScore}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          تم الإجابة على {analysis.questionCount} سؤال من أسئلة المهارات
          السلوكية والشخصية
        </p>
      </div>

      {/* Performance Summary */}
      <div className="px-4 py-3 bg-blue-50 text-blue-800 rounded-lg mb-6">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">
            يتم تقييم المهارات السلوكية والشخصية بناءً على اختيارك للإجابات
            الأنسب في المواقف المختلفة. تعكس الدرجة قدرتك على التعامل مع المواقف
            المهنية بفعالية.
          </p>
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
                  <span className="font-bold text-green-800">نقطة قوة</span>
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
                  <span className="font-bold text-amber-800">مجال للتحسين</span>
                </div>
                <p className="text-sm text-gray-700 pr-6">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Tips */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="font-bold text-gray-700 mb-3">نصائح عامة</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              ركز على تطوير مهاراتك في حل المشكلات والتواصل والعمل الجماعي.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>تعلم كيفية إدارة الوقت والضغوط بشكل فعال في بيئة العمل.</span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>اعمل على تطوير مهارات القيادة والمبادرة واتخاذ القرار.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BehavioralAnalysis;
