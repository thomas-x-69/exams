// src/app/training/results/page.js
"use client";

import { useState, useEffect, memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
// import Header from "../../../components/Header";

// Memoized score card component
const ScoreCard = memo(({ score, label, icon, gradient }) => (
  <div className={`rounded-xl p-4 ${gradient} border border-white/30`}>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center border border-white/30">
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-white/90">{label}</h3>
        <p className="text-2xl font-bold text-white">{score}%</p>
      </div>
    </div>
  </div>
));

// Memoized performance bar component with info tooltip
const PerformanceBar = memo(
  ({ percentage, label, color = "bg-blue-500", infoText }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{label}</span>
          {infoText && (
            <div className="group relative">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center cursor-help">
                <span className="text-xs text-white">?</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 rounded-lg text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/20 z-10">
                {infoText}
              </div>
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-white/90">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-white/20 rounded-full">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
);

// Suggestion card for training recommendations
const SuggestionCard = memo(({ title, description, icon, gradient }) => (
  <div
    className={`glass-card rounded-xl p-4 border border-white/30 ${gradient}`}
  >
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
        <span className="text-xl text-white">{icon}</span>
      </div>
      <div>
        <h3 className="font-bold text-white mb-1">{title}</h3>
        <p className="text-white/90 text-sm">{description}</p>
      </div>
    </div>
  </div>
));

// Main training results component
export default function TrainingResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedView, setSelectedView] = useState("summary");

  // Get parameters from URL
  const subject = searchParams.get("subject");
  const phase = searchParams.get("phase");
  const name = searchParams.get("name");
  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const correct = parseInt(searchParams.get("correct") || "0");
  const incorrect = total - correct;

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If parameters are missing, redirect to training page
  if (!subject || !phase || !name) {
    return (
      <>
        {/* <Header /> */}
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] pt-24 lg:mx-40">
          <div className="text-white mb-4">بيانات نتائج التدريب غير مكتملة</div>
          <Link
            href="/training"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg border border-blue-500/50"
          >
            العودة لصفحة التدريب
          </Link>
        </div>
      </>
    );
  }

  // Get phase name for display
  const getPhaseName = () => {
    if (phase === "behavioral") return "الكفايات السلوكية والنفسية";
    if (phase === "language_arabic") return "الكفايات اللغوية - اللغة العربية";
    if (phase === "language_english")
      return "الكفايات اللغوية - اللغة الإنجليزية";
    if (phase === "knowledge_iq") return "الكفايات المعرفية - اختبار الذكاء";
    if (phase === "knowledge_general")
      return "الكفايات المعرفية - معلومات عامة";
    if (phase === "knowledge_it")
      return "الكفايات المعرفية - تكنولوجيا المعلومات";
    if (phase === "education") return "الكفايات التربوية";
    if (phase === "specialization") return "كفايات التخصص";
    return phase;
  };

  // Get subject name for display
  const getSubjectName = () => {
    if (subject === "mail") return "البريد";
    if (subject === "math") return "تربية رياضيات";
    if (subject === "english") return "تربية انجليزي";
    if (subject === "science") return "تربية علوم";
    if (subject === "social") return "تربية دراسات";
    if (subject === "arabic") return "تربية لغة عربية";
    return subject;
  };

  // Generate performance feedback based on score
  const getPerformanceFeedback = () => {
    if (score >= 90) {
      return {
        title: "أداء ممتاز!",
        description:
          "لقد أظهرت مستوى عالياً جداً من الفهم والمعرفة في هذا المجال.",
        icon: "🏆",
      };
    } else if (score >= 75) {
      return {
        title: "أداء جيد جداً",
        description:
          "أداؤك جيد جداً وتمتلك فهماً واضحاً لمعظم جوانب هذا المجال.",
        icon: "🥇",
      };
    } else if (score >= 60) {
      return {
        title: "أداء جيد",
        description: "أداؤك جيد، مع وجود بعض المجالات التي تحتاج للتحسين.",
        icon: "👍",
      };
    } else if (score >= 40) {
      return {
        title: "بحاجة للتحسين",
        description:
          "أداؤك متوسط، ننصح بمزيد من التدريب لرفع مستواك في هذا المجال.",
        icon: "📈",
      };
    } else {
      return {
        title: "بحاجة لتدريب مكثف",
        description:
          "أداؤك يحتاج إلى تطوير كبير، تدرب أكثر على هذا النوع من الأسئلة.",
        icon: "📚",
      };
    }
  };

  // Generate recommendations based on score and phase
  const getRecommendations = () => {
    const recommendations = [];

    // General recommendation based on score
    if (score < 60) {
      recommendations.push({
        title: "تدرب بشكل متكرر",
        description:
          "قم بمزيد من التدريب على هذه المرحلة حتى تتمكن من تحقيق درجة أعلى من 60%",
        icon: "🔄",
        gradient: "from-blue-600/40 to-indigo-600/40",
      });
    }

    // Phase specific recommendations
    if (phase === "behavioral") {
      recommendations.push({
        title: "تطوير المهارات السلوكية",
        description:
          "ركز على تعلم كيفية التعامل مع المواقف المختلفة بشكل مهني ومناسب",
        icon: "🧠",
        gradient: "from-purple-600/40 to-violet-600/40",
      });
    } else if (phase.startsWith("language_")) {
      recommendations.push({
        title: "تحسين المهارات اللغوية",
        description: phase.includes("arabic")
          ? "قراءة المزيد من النصوص العربية وممارسة القواعد النحوية والإملائية"
          : "ممارسة القراءة والكتابة باللغة الإنجليزية والتركيز على المفردات والقواعد",
        icon: "📝",
        gradient: "from-green-600/40 to-emerald-600/40",
      });
    } else if (phase.startsWith("knowledge_")) {
      if (phase.includes("iq")) {
        recommendations.push({
          title: "تطوير مهارات حل المشكلات",
          description:
            "تدرب على أنماط مختلفة من ألغاز المنطق وأسئلة الذكاء لتحسين مهاراتك",
          icon: "🧩",
          gradient: "from-amber-600/40 to-yellow-600/40",
        });
      } else if (phase.includes("general")) {
        recommendations.push({
          title: "توسيع معرفتك العامة",
          description:
            "اقرأ أكثر عن الأحداث الجارية والتاريخ والعلوم والثقافة العامة",
          icon: "🌍",
          gradient: "from-cyan-600/40 to-sky-600/40",
        });
      } else if (phase.includes("it")) {
        recommendations.push({
          title: "تعزيز معرفتك التقنية",
          description: "تعلم المزيد عن أساسيات التكنولوجيا وتطبيقاتها المختلفة",
          icon: "💻",
          gradient: "from-blue-600/40 to-indigo-600/40",
        });
      }
    } else if (phase === "education") {
      recommendations.push({
        title: "تعزيز مهاراتك التربوية",
        description:
          "اطلع على النظريات التربوية الحديثة وأساليب التدريس المختلفة",
        icon: "📚",
        gradient: "from-rose-600/40 to-pink-600/40",
      });
    } else if (phase === "specialization") {
      recommendations.push({
        title: `تطوير معرفتك في مجال ${getSubjectName()}`,
        description: "ركز على دراسة المفاهيم الأساسية والمتقدمة في مجال تخصصك",
        icon: "🎯",
        gradient: "from-amber-600/40 to-orange-600/40",
      });
    }

    // Add general recommendation for all
    recommendations.push({
      title: "حاول الاختبار الكامل",
      description:
        "بعد التدريب على المراحل المختلفة، جرب خوض اختبار كامل لقياس أدائك الشامل",
      icon: "📋",
      gradient: "from-purple-600/40 to-indigo-600/40",
    });

    return recommendations;
  };

  const feedback = getPerformanceFeedback();
  const recommendations = getRecommendations();

  // Badge color based on score
  const getBadgeColor = () => {
    if (score >= 90) return "bg-gradient-to-r from-amber-500 to-yellow-500";
    if (score >= 75) return "bg-gradient-to-r from-blue-500 to-indigo-500";
    if (score >= 60) return "bg-gradient-to-r from-green-500 to-teal-500";
    if (score >= 40) return "bg-gradient-to-r from-orange-500 to-amber-500";
    return "bg-gradient-to-r from-red-500 to-rose-500";
  };

  return (
    <>
      {/* <Header /> */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 lg:mx-40">
        {/* Header with overall result */}
        <div className="glass-card overflow-hidden mb-8 border border-white/30">
          <div className="p-6 bg-gradient-to-r from-blue-900/60 to-indigo-900/60">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                <span className="text-2xl text-white">🏋️‍♂️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">نتائج التدريب</h1>
                <p className="text-white/90">
                  {getSubjectName()} - {getPhaseName()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-4 mt-6">
              {/* Score badge */}
              <div className="w-full md:w-1/3">
                <div className="bg-white/10 rounded-xl p-4 border border-white/30 text-center">
                  <div className="mb-2 text-white/90 text-sm">
                    النتيجة النهائية
                  </div>
                  <div
                    className={`inline-block ${getBadgeColor()} text-white text-4xl font-bold px-4 py-2 rounded-lg border border-white/30`}
                  >
                    {score}%
                  </div>
                  <div className="mt-2 text-white/90 text-sm">
                    {correct} صحيحة من {total} سؤال
                  </div>
                </div>
              </div>

              {/* User info and feedback */}
              <div className="w-full md:w-2/3">
                <div className="bg-white/10 rounded-xl p-4 border border-white/30 h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl border border-white/30">
                      {feedback.icon}
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1">{name}</div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {feedback.title}
                      </h3>
                      <p className="text-white/90">{feedback.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View tabs */}
          <div className="flex border-t border-white/20">
            <button
              onClick={() => setSelectedView("summary")}
              className={`flex-1 py-3 text-center transition-colors ${
                selectedView === "summary"
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              ملخص النتائج
            </button>
            <button
              onClick={() => setSelectedView("recommendations")}
              className={`flex-1 py-3 text-center transition-colors ${
                selectedView === "recommendations"
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              التوصيات والنصائح
            </button>
          </div>
        </div>

        {/* Main content based on selected view */}
        {selectedView === "summary" ? (
          <div className="glass-card p-6 border border-white/30">
            <h2 className="text-xl font-bold text-white mb-6">
              تفاصيل نتائج التدريب
            </h2>

            {/* Score metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <ScoreCard
                score={score}
                label="الدرجة الكلية"
                icon="🎯"
                gradient="bg-gradient-to-br from-blue-600/40 to-indigo-600/40"
              />
              <ScoreCard
                score={Math.round((correct / total) * 100)}
                label="الإجابات الصحيحة"
                icon="✅"
                gradient="bg-gradient-to-br from-green-600/40 to-emerald-600/40"
              />
              <ScoreCard
                score={Math.round((incorrect / total) * 100)}
                label="الإجابات الخاطئة"
                icon="❌"
                gradient="bg-gradient-to-br from-red-600/40 to-rose-600/40"
              />
            </div>

            {/* Performance bars */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/30 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">
                تحليل الأداء
              </h3>
              <PerformanceBar
                percentage={Math.round((correct / total) * 100)}
                label="نسبة الإجابات الصحيحة"
                color="bg-green-500"
              />
            </div>

            {/* Quick tips */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/30">
              <h3 className="text-lg font-bold text-white mb-4">
                نصائح سريعة للتحسين
              </h3>
              <ul className="space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>تدرب على أسئلة مشابهة بشكل منتظم لتحسين مستواك</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>راجع المفاهيم الأساسية المتعلقة بهذه المرحلة</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    جرب الاختبار الكامل لقياس مستواك العام في كافة المراحل
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 border border-white/30">
            <h2 className="text-xl font-bold text-white mb-6">
              التوصيات والنصائح
            </h2>

            {/* Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {recommendations.map((recommendation, index) => (
                <SuggestionCard
                  key={index}
                  title={recommendation.title}
                  description={recommendation.description}
                  icon={recommendation.icon}
                  gradient={recommendation.gradient}
                />
              ))}
            </div>

            {/* Additional resources */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/30">
              <h3 className="text-lg font-bold text-white mb-4">
                موارد إضافية للتحسين
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 border border-white/30">
                  <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-blue-400/50">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <Link
                      href="/pdfs"
                      className="font-bold text-white hover:text-blue-300 transition-colors"
                    >
                      تحميل نماذج أسئلة
                    </Link>
                    <p className="text-white/90 text-sm">
                      نماذج اختبارات سابقة للتدريب
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 flex items-center gap-3 border border-white/30">
                  <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center border border-green-400/50">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <Link
                      href="/"
                      className="font-bold text-white hover:text-green-300 transition-colors"
                    >
                      اختبار كامل
                    </Link>
                    <p className="text-white/90 text-sm">
                      خوض اختبار كامل بجميع المراحل
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link
            href={`/training/questions?subject=${subject}&phase=${phase}&name=${encodeURIComponent(
              name
            )}`}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl border border-blue-500/50"
          >
            إعادة التدريب
          </Link>
          <Link
            href="/training"
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg transition-colors"
          >
            العودة لصفحة التدريب
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 rounded-lg transition-colors"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </>
  );
}
