// src/app/training/page.js
"use client";

import { useState, useEffect, memo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";

// Memoized phase card component for better performance
const PhaseCard = memo(({ phase, isEnabled, onClick }) => (
  <button
    onClick={() => onClick(phase)}
    disabled={!isEnabled}
    className={`glass-card p-4 border hover:border-white/30 transition-all duration-300 rounded-xl w-full text-right shadow-sm ${
      isEnabled
        ? `${phase.gradient} cursor-pointer hover:shadow-md hover:scale-[1.02]`
        : "opacity-60 cursor-not-allowed bg-slate-900/50"
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
          isEnabled ? "bg-white/10" : "bg-white/5"
        }`}
      >
        <span className="text-2xl">{phase.icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1">{phase.title}</h3>
        <p className="text-white/90 text-xs">{phase.desc}</p>
      </div>
    </div>
  </button>
));

// Memoized subphase card for better performance
const SubPhaseCard = memo(({ subphase, onClick }) => (
  <button
    onClick={() => onClick(subphase)}
    className={`bg-white/10 p-4 border border-white/30 hover:border-white/50 transition-all duration-300 rounded-xl text-right hover:shadow-md hover:scale-[1.01] ${subphase.gradient}`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/30">
        <span className="text-xl">{subphase.icon}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-md font-bold text-white">{subphase.title}</h3>
        <p className="text-white/90 text-xs mt-1">{subphase.desc}</p>
      </div>
    </div>
  </button>
));

// Main Training Page Component
export default function TrainingPage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [showSubphases, setShowSubphases] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [selectedSubphase, setSelectedSubphase] = useState(null);
  useEffect(() => {
    // Block popups and new window creation attempts
    const originalOpen = window.open;
    window.open = function (url, name, params) {
      console.log("Popup attempt blocked:", url);
      return null;
    };

    // Prevent scripts from creating new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.tagName === "SCRIPT" &&
              node.src &&
              node.src.includes("resolvedinsaneox.com")
            ) {
              node.parentNode.removeChild(node);
              console.log("Blocked script:", node.src);
            }
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.open = originalOpen;
      observer.disconnect();
    };
  }, []);
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);

    // Pre-fill name from localStorage if available
    const savedName = localStorage.getItem("training_user_name");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedPhase(null);
    setShowSubphases(false);
    setSelectedSubphase(null);
  };

  // Handle phase selection
  const handlePhaseSelect = (phase) => {
    setSelectedPhase(phase);

    // If this phase has subphases, show them
    if (phase.hasSubphases) {
      setShowSubphases(true);
      setSelectedSubphase(null);
    } else {
      // Otherwise, show name input
      setShowSubphases(false);
      setShowNameInput(true);
    }
  };

  // Handle subphase selection
  const handleSubphaseSelect = (subphase) => {
    setSelectedSubphase(subphase);
    setShowNameInput(true);
  };

  // Handle start training
  const handleStartTraining = () => {
    if (!userName.trim()) {
      alert("من فضلك أدخل اسمك");
      return;
    }

    // Save name to localStorage
    localStorage.setItem("training_user_name", userName);

    // Determine what to pass to the questions page
    const phaseId = selectedSubphase
      ? `${selectedPhase.id}_${selectedSubphase.id}`
      : selectedPhase.id;

    // Navigate to questions page with query params
    router.push(
      `/training/questions?subject=${
        selectedSubject.id
      }&phase=${phaseId}&name=${encodeURIComponent(userName)}`
    );
  };

  // Subject definitions
  const subjects = [
    {
      id: "mail",
      title: "البريد",
      icon: "📬",
      desc: "تدريب على اختبارات البريد المصري",
      gradient: "from-blue-600/40 to-indigo-600/40",
    },
    {
      id: "math",
      title: "تربية رياضيات",
      icon: "➗",
      desc: "تدريب على اختبارات الرياضيات",
      gradient: "from-green-600/40 to-emerald-600/40",
    },
    {
      id: "english",
      title: "تربية انجليزي",
      icon: "🌎",
      desc: "تدريب على اختبارات اللغة الإنجليزية",
      gradient: "from-purple-600/40 to-violet-600/40",
    },
    {
      id: "science",
      title: "تربية علوم",
      icon: "🔬",
      desc: "تدريب على اختبارات العلوم العامة",
      gradient: "from-rose-600/40 to-pink-600/40",
    },
    {
      id: "social",
      title: "تربية دراسات",
      icon: "📚",
      desc: "تدريب على اختبارات الدراسات الاجتماعية",
      gradient: "from-amber-600/40 to-yellow-600/40",
    },
    {
      id: "arabic",
      title: "تربية لغة عربية",
      icon: "📖",
      desc: "تدريب على اختبارات اللغة العربية",
      gradient: "from-cyan-600/40 to-sky-600/40",
    },
  ];

  // Define phases based on selected subject
  const getPhases = () => {
    const commonPhases = [
      {
        id: "behavioral",
        title: "الكفايات السلوكية والنفسية",
        icon: "🧠",
        desc: "تدريب على أسئلة المهارات السلوكية والشخصية",
        gradient: "from-blue-600/40 to-indigo-600/40",
        hasSubphases: false,
      },
      {
        id: "language",
        title: "الكفايات اللغوية",
        icon: "🔤",
        desc: "تدريب على أسئلة اللغة العربية والإنجليزية",
        gradient: "from-green-600/40 to-emerald-600/40",
        hasSubphases: true,
      },
      {
        id: "knowledge",
        title: "الكفايات المعرفية والتكنولوجية",
        icon: "💡",
        desc: "تدريب على أسئلة المعرفة العامة والتكنولوجيا",
        gradient: "from-purple-600/40 to-violet-600/40",
        hasSubphases: true,
      },
    ];

    // Add subject-specific phases
    if (selectedSubject?.id === "mail") {
      return [
        ...commonPhases,
        {
          id: "specialization",
          title: "كفايات التخصص",
          icon: "📬",
          desc: "تدريب على أسئلة تخصص البريد",
          gradient: "from-amber-600/40 to-yellow-600/40",
          hasSubphases: false,
        },
      ];
    } else if (
      ["math", "english", "science", "social", "arabic"].includes(
        selectedSubject?.id
      )
    ) {
      return [
        ...commonPhases,
        {
          id: "education",
          title: "الكفايات التربوية",
          icon: "📚",
          desc: "تدريب على أسئلة مجال التربية",
          gradient: "from-rose-600/40 to-pink-600/40",
          hasSubphases: false,
        },
        {
          id: "specialization",
          title: "كفايات التخصص",
          icon: "🎯",
          desc: `تدريب على أسئلة تخصص ${selectedSubject.title}`,
          gradient: "from-amber-600/40 to-yellow-600/40",
          hasSubphases: false,
        },
      ];
    }

    return commonPhases;
  };

  // Get subphases based on selected phase
  const getSubphases = () => {
    if (!selectedPhase) return [];

    if (selectedPhase.id === "language") {
      return [
        {
          id: "arabic",
          title: "اللغة العربية",
          icon: "🇪🇬",
          desc: "تدريب على أسئلة اللغة العربية",
          gradient: "from-green-600/40 to-teal-600/40",
        },
        {
          id: "english",
          title: "اللغة الإنجليزية",
          icon: "🇬🇧",
          desc: "تدريب على أسئلة اللغة الإنجليزية",
          gradient: "from-blue-600/40 to-sky-600/40",
        },
      ];
    } else if (selectedPhase.id === "knowledge") {
      return [
        {
          id: "iq",
          title: "اختبار الذكاء",
          icon: "🧩",
          desc: "تدريب على أسئلة اختبار الذكاء",
          gradient: "from-purple-600/40 to-fuchsia-600/40",
        },
        {
          id: "general",
          title: "معلومات عامة",
          icon: "🌍",
          desc: "تدريب على أسئلة المعلومات العامة",
          gradient: "from-indigo-600/40 to-violet-600/40",
        },
        {
          id: "it",
          title: "تكنولوجيا المعلومات",
          icon: "💻",
          desc: "تدريب على أسئلة تكنولوجيا المعلومات",
          gradient: "from-blue-600/40 to-indigo-600/40",
        },
      ];
    }

    return [];
  };

  // Get current step title
  const getCurrentStepTitle = () => {
    if (!selectedSubject) return "اختر المادة للتدريب";
    if (!selectedPhase) return "اختر المرحلة المراد التدريب عليها";
    if (selectedPhase.hasSubphases && !selectedSubphase)
      return "اختر الفئة الفرعية للتدريب";
    if (showNameInput) return "أدخل اسمك للبدء";
    return "";
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 lg:mx-40">
        {/* Header with gradient background */}
        <div className="glass-card overflow-hidden mb-8 border border-white/20">
          <div className="p-6 bg-gradient-to-r from-blue-900/60 to-indigo-900/60">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                <span className="text-2xl text-white">🏋️‍♂️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">وضع التدريب</h1>
                <p className="text-white/90">
                  تدرب على أسئلة مختلفة واختبر مهاراتك مع نتائج فورية
                </p>
              </div>
            </div>

            {/* Showing breadcrumbs for selected options */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                href="/training"
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm hover:bg-white/15 transition-colors border border-white/30"
              >
                التدريب
              </Link>

              {selectedSubject && (
                <button
                  onClick={() => {
                    setSelectedPhase(null);
                    setShowSubphases(false);
                    setShowNameInput(false);
                    setSelectedSubphase(null);
                  }}
                  className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm hover:bg-white/30 transition-colors flex items-center gap-1 border border-white/30"
                >
                  <span>{selectedSubject.title}</span>
                  <span className="text-xs">✕</span>
                </button>
              )}

              {selectedPhase && (
                <button
                  onClick={() => {
                    setSelectedPhase(null);
                    setShowSubphases(false);
                    setShowNameInput(false);
                    setSelectedSubphase(null);
                  }}
                  className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm hover:bg-white/30 transition-colors flex items-center gap-1 border border-white/30"
                >
                  <span>{selectedPhase.title}</span>
                  <span className="text-xs">✕</span>
                </button>
              )}

              {selectedSubphase && (
                <button
                  onClick={() => {
                    setSelectedSubphase(null);
                    setShowNameInput(false);
                  }}
                  className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm hover:bg-white/30 transition-colors flex items-center gap-1 border border-white/30"
                >
                  <span>{selectedSubphase.title}</span>
                  <span className="text-xs">✕</span>
                </button>
              )}
            </div>
          </div>

          {/* Step indicator */}
          <div className="px-6 py-3 border-t border-white/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-medium">
                {getCurrentStepTitle()}
              </h2>

              {/* Progress indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    !selectedSubject ? "bg-blue-400" : "bg-white/40"
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedSubject && !selectedPhase
                      ? "bg-blue-400"
                      : "bg-white/40"
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedPhase &&
                    (selectedPhase.hasSubphases
                      ? !selectedSubphase
                      : !showNameInput)
                      ? "bg-blue-400"
                      : "bg-white/40"
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    showNameInput ? "bg-blue-400" : "bg-white/40"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="glass-card p-6 border border-white/30">
          {/* Subject Selection */}
          {!selectedSubject && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">
                اختر المادة المراد التدريب عليها
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <PhaseCard
                    key={subject.id}
                    phase={subject}
                    isEnabled={true}
                    onClick={handleSubjectSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Phase Selection */}
          {selectedSubject && !selectedPhase && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  اختر مرحلة التدريب
                </h3>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors border border-white/30"
                >
                  تغيير المادة
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getPhases().map((phase) => (
                  <PhaseCard
                    key={phase.id}
                    phase={phase}
                    isEnabled={true}
                    onClick={handlePhaseSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Subphase Selection */}
          {selectedPhase && showSubphases && !selectedSubphase && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  اختر الفئة الفرعية
                </h3>
                <button
                  onClick={() => {
                    setSelectedPhase(null);
                    setShowSubphases(false);
                  }}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors border border-white/30"
                >
                  العودة للمراحل
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSubphases().map((subphase) => (
                  <SubPhaseCard
                    key={subphase.id}
                    subphase={subphase}
                    onClick={handleSubphaseSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Name Input */}
          {showNameInput && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  أدخل اسمك للبدء
                </h3>
                <button
                  onClick={() => {
                    if (selectedSubphase) {
                      setSelectedSubphase(null);
                      setShowNameInput(false);
                    } else {
                      setSelectedPhase(null);
                      setShowNameInput(false);
                    }
                  }}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-colors border border-white/30"
                >
                  العودة للخلف
                </button>
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/30">
                <div className="mb-4">
                  <label className="block text-white mb-2">الاسم</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-4 mt-8">
                  <div className="flex-1 text-white/90 text-sm">
                    <p>
                      سيتم عرض نتائج الإجابات الصحيحة مباشرة بعد كل سؤال في وضع
                      التدريب
                    </p>
                  </div>
                  <button
                    onClick={handleStartTraining}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl border border-blue-500/50"
                  >
                    ابدأ التدريب
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Information and tips */}
        <div className="glass-card p-6 mt-6 border border-white/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center border border-amber-400/50">
              <span className="text-xl text-amber-300">💡</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              معلومات عن وضع التدريب
            </h3>
          </div>

          <ul className="space-y-3 text-white/90 mr-4">
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
              <span>سيتم عرض نتيجة كل سؤال فوريًا بعد اختيار الإجابة</span>
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
              <span>لا يوجد وقت محدد للإجابة في وضع التدريب</span>
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
                يمكنك التدرب على مراحل محددة لتحسين مستواك قبل خوض الامتحان
                الكامل
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
