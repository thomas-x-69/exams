// src/app/exams/results/page.js
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetExam, initExam } from "../../../../store/examSlice";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { calculatePhaseScore } from "@/app/data/questionsUtils";
import LOGO from "../../../../public/logo.png";
import BehavioralAnalysis from "../../../../components/BehavioralAnalysis";

// Memoized components for better performance

// Score circle component with animation
const ScoreCircle = memo(
  ({ score, animateScore, resultLevel, formatPercentage = false }) => {
    const displayScore = formatPercentage
      ? `${animateScore ? score : 0}%`
      : animateScore
      ? score
      : 0;

    return (
      <div className="relative inline-flex">
        {/* Score Circle */}
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full bg-gray-100"></div>

          {/* Progress Circle - Animated */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={
                animateScore ? 251.2 - (251.2 * score) / 100 : 251.2
              }
              transform="rotate(-90 50 50)"
              style={{
                transition: "stroke-dashoffset 1.5s ease-in-out",
              }}
            />
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={extractColor(resultLevel.gradient, 0)}
                />
                <stop
                  offset="100%"
                  stopColor={extractColor(resultLevel.gradient, 1)}
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-gray-800">
              {displayScore}
            </div>
          </div>
        </div>

        {/* Level Badge */}
        <div
          className={`absolute -top-2 -right-2 px-4 py-1 rounded-full text-sm font-bold ${resultLevel.bg} ${resultLevel.color} border ${resultLevel.borderColor} shadow-sm`}
        >
          {resultLevel.text}
        </div>
      </div>
    );
  }
);

// Category Card component
const CategoryCard = memo(
  ({ category, index, expanded, animateChart, toggleSection }) => {
    return (
      <div
        key={index}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Category Header - Clickable */}
        <div
          className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection(`category-${index}`)}
        >
          <div className="flex justify-between items-center">
            <h4
              className="text-lg font-bold text-gray-800 border-right-4 pr-3"
              style={{
                borderRightWidth: "4px",
                borderRightColor: getBarColor(category.color),
              }}
            >
              {category.title}
            </h4>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expanded[`category-${index}`] ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Main category score preview */}
          {category.mainScore !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700">
                  الدرجة الكلية
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ color: getBarColor(category.color) }}
                >
                  {category.mainScore}%
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: animateChart ? `${category.mainScore}%` : "0%",
                    backgroundColor: getBarColor(category.color),
                    transition: "width 1s ease-out",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Expandable Content */}
        {expanded[`category-${index}`] && (
          <CategoryDetail
            category={category}
            animateChart={animateChart}
            expanded={expanded}
            toggleSection={toggleSection}
          />
        )}
      </div>
    );
  }
);

// Category Detail component
const CategoryDetail = memo(
  ({ category, animateChart, expanded, toggleSection }) => {
    return (
      <div className="p-4 bg-gray-50">
        {/* Sub-category scores */}
        <div className="space-y-3">
          {category.scores.map((score, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700">
                  {score.title}
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ color: getBarColor(category.color) }}
                >
                  {score.score}%
                </div>
              </div>
              <div className="w-full bg-white rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: animateChart ? `${score.score}%` : "0%",
                    backgroundColor: getBarColor(category.color),
                    transition: `width 1s ease-out ${0.2 + idx * 0.1}s`,
                  }}
                ></div>
              </div>

              {/* Question Performance Details */}
              <div className="mt-2 mb-4"></div>
            </div>
          ))}
        </div>

        {/* Performance Analysis */}
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <h5 className="font-bold text-sm text-gray-700 mb-2">
            تحليل الأداء:
          </h5>
          <p className="text-sm text-gray-600">
            {category.mainScore >= 80
              ? "أظهرت أداءًا متميزًا في هذه الكفاية. استمر في الحفاظ على هذا المستوى."
              : category.mainScore >= 60
              ? "أداؤك جيد ولكن يمكن تحسينه. ركز على النقاط الضعيفة في هذه الكفاية."
              : "تحتاج إلى مزيد من التدريب في هذه الكفاية. ركز على فهم المفاهيم الأساسية."}
          </p>
        </div>
      </div>
    );
  }
);

// Share Options component
const ShareOptions = memo(({ isVisible, onShare, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 w-48">
      <button
        onClick={() => onShare("whatsapp")}
        className="w-full text-right px-3 py-2 hover:bg-green-50 text-green-700 rounded-md flex items-center gap-2 mb-1"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-sm">واتساب</span>
      </button>
      <button
        onClick={() => onShare("facebook")}
        className="w-full text-right px-3 py-2 hover:bg-blue-50 text-blue-700 rounded-md flex items-center gap-2 mb-1"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="text-sm">فيسبوك</span>
      </button>
      <button
        onClick={() => onShare("twitter")}
        className="w-full text-right px-3 py-2 hover:bg-blue-50 text-blue-500 rounded-md flex items-center gap-2 mb-1"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
        <span className="text-sm">تويتر</span>
      </button>
      <button
        onClick={() => onShare("copy")}
        className="w-full text-right px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-md flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
        <span className="text-sm">نسخ الرابط</span>
      </button>
    </div>
  );
});

// Certificate component that preserves desktop layout but improves mobile display
const Certificate = memo(
  ({
    currentSubject,
    activeExam,
    formatDate,
    resultLevel,
    totalScore,
    categories,
    certificateRef,
    currentResult,
  }) => (
    <div
      id="certificateContainer"
      ref={certificateRef}
      className="bg-white rounded-xl shadow-xl overflow-hidden border-4 border-blue-200 mb-8 p-4 md:p-10"
    >
      {/* Certificate Header with Logo */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 md:pb-6 mb-4 md:mb-8">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-100 shadow-lg">
            <Image
              src={LOGO}
              alt="logo"
              className="p-2"
              width={80}
              height={80}
              quality={90}
              priority
            />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              منصة الاختبارات المصرية
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              شهادة رسمية معتمدة
            </p>
          </div>
        </div>

        {/* Certificate Type & ID */}
        <div className="text-left">
          <h2
            className={`text-xs md:text-base font-bold py-1 px-2 md:px-4 rounded-full inline-block ${resultLevel.bg} ${resultLevel.color} border ${resultLevel.borderColor}`}
          >
            {getCertificateType(totalScore)}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            رقم: {activeExam.organizationCode}
          </p>
        </div>
      </div>

      {/* Certificate Body - Horizontal Layout on Desktop, Vertical on Mobile */}
      <div className="flex flex-col md:flex-row md:gap-10 mb-6 md:mb-10">
        {/* Left Side - User Info */}
        <div className="flex-1 text-right md:border-l border-gray-100 md:pl-10 mb-6 md:mb-0">
          <div className="mb-6 md:mb-8">
            <p className="text-base md:text-lg text-gray-700 mb-2">
              تشهد منصة الاختبارات المصرية أن
            </p>

            <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              {activeExam.userName}
            </h3>

            <p className="text-base md:text-lg text-gray-700">
              قد أكمل بنجاح اختبار {currentSubject}
              <br />
              بتاريخ {formatDate(currentResult?.completedAt)}
            </p>
          </div>

          <div className="p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-3 text-sm md:text-base">
              الكفايات المقيمة:
            </h4>
            <ul className="space-y-1 md:space-y-2 text-gray-700 text-xs md:text-sm">
              {categories.map((category, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0"
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
                  {category.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Score Display */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Score Circle */}
          <div className="relative w-36 h-36 md:w-52 md:h-52">
            <div className="absolute inset-0 rounded-full border-8 border-gray-100 shadow-inner"></div>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={`url(#certificateGradient)`}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="238.76"
                strokeDashoffset={238.76 - (238.76 * totalScore) / 100}
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient
                  id="certificateGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor={extractColor(resultLevel.gradient, 0)}
                  />
                  <stop
                    offset="100%"
                    stopColor={extractColor(resultLevel.gradient, 1)}
                  />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl md:text-5xl font-bold text-gray-800">
                {totalScore}%
              </div>
            </div>

            {/* Level Badge */}
            <div
              className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-3 md:px-6 py-1 rounded-full text-sm md:text-lg font-bold ${resultLevel.bg} ${resultLevel.color} border ${resultLevel.borderColor} shadow-md`}
            >
              {resultLevel.text}
            </div>
          </div>

          <div className="mt-4 md:mt-8 text-center">
            <p className="text-xs md:text-sm text-gray-600 mb-2">
              نتمنى لك التوفيق الدائم والنجاح في مسيرتك المهنية
            </p>
            <div className="text-xs md:text-sm text-blue-600 font-bold">
              https://www.egyptianexams.com
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

// Main component for results page
const ResultsPage = () => {
  // Always call hooks at the top level, in the same order
  const router = useRouter();
  const dispatch = useDispatch();
  const examState = useSelector((state) => state.exam || {});

  // Add mounting state ref
  const [mounted, setMounted] = useState(false);
  const certificateRef = useRef(null);
  const resultsRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [animateChart, setAnimateChart] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [viewMode, setViewMode] = useState("summary"); // 'summary' or 'certificate'

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe access to examState properties only when mounted
  const activeExam = mounted ? examState.activeExam : null;
  const currentResult = mounted ? examState.currentResult : null;
  const examCompleted = mounted ? examState.examCompleted : null;
  const completedPhases = mounted ? examState.completedPhases : [];

  // IMPORTANT: Create safe versions of all variables we need, using default values
  const totalScore = currentResult?.totalScore || 0;
  const phaseScores = currentResult?.phaseScores || {};

  // ALL useMemo hooks must be here at the top level
  // Consistently called on EVERY render, before any conditionals
  const resultLevel = useMemo(() => getResultLevel(totalScore), [totalScore]);
  const categories = useMemo(
    () => organizePhaseScores(phaseScores, activeExam?.subject || ""),
    [phaseScores, activeExam?.subject]
  );
  const currentSubject = useMemo(
    () => (activeExam?.subject === "mail" ? "البريد المصري" : "التربية"),
    [activeExam?.subject]
  );
  const learningResources = useMemo(
    () => generateLearningResources(categories, activeExam?.subject || ""),
    [categories, activeExam?.subject]
  );
  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "غير محدد";

    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Submit results to backend - memoized to prevent unnecessary re-creations
  const submitExamResults = useCallback(async () => {
    if (!activeExam || !currentResult) return;

    try {
      console.log("Preparing to submit exam results");

      // Use the organization code as a unique identifier for this exam
      const submissionKey = `exam_submitted_${activeExam.organizationCode}`;

      // Check if we've already submitted results for this organization code
      if (localStorage.getItem(submissionKey)) {
        console.log(
          "Results already submitted for this exam",
          activeExam.organizationCode
        );
        return; // Skip submission
      }

      // Create well-formed data object
      const submitData = {
        name: activeExam.userName || "Unknown User",
        subjectName:
          activeExam.subject === "mail" ? "البريد المصري" : "التربية",
        totalScore: currentResult.totalScore || 0,
        phaseScores: {
          behavioral: currentResult.phaseScores?.behavioral || 0,
          language_arabic: currentResult.phaseScores?.language_arabic || 0,
          knowledge_iq: currentResult.phaseScores?.knowledge_iq || 0,
          specialization: currentResult.phaseScores?.specialization || 0,
        },
        // Also include the organizationCode to track uniqueness server-side if needed
        organizationCode: activeExam.organizationCode,
      };

      console.log("Sending data to Google Script:", submitData);

      // Make the API request
      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
        cache: "no-store",
        next: { revalidate: 0 },
      });

      console.log("Response status:", response.status);
      const resultText = await response.text();

      try {
        const result = JSON.parse(resultText);
        console.log("Parsed response:", result);

        if (result.status === "success") {
          // Mark this organization code as submitted in localStorage
          localStorage.setItem(submissionKey, "true");
          console.log("Results successfully submitted and marked as completed");
        }
      } catch (error) {
        console.error("Failed to parse response as JSON:", error);
      }
    } catch (error) {
      console.error("Failed to submit exam results:", error);
    }
  }, [activeExam, currentResult]);
  // Submit results effect
  useEffect(() => {
    if (mounted && !loading && currentResult && activeExam) {
      submitExamResults();
    }
  }, [mounted, loading, currentResult, activeExam, submitExamResults]);

  // Initialize data and redirect if needed
  useEffect(() => {
    // Only run this effect when mounted
    if (!mounted) return;

    // Redirect if no active exam or not completed
    if (!activeExam || !examCompleted) {
      router.push("/");
      return;
    }

    // Simulate loading results
    const timer = setTimeout(() => {
      setLoading(false);

      // Trigger animations after loading
      setTimeout(() => {
        setAnimateScore(true);

        // Trigger chart animation after score animation
        setTimeout(() => {
          setAnimateChart(true);
        }, 800);
      }, 400);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeExam, examCompleted, router, mounted]);

  // Handle restart exam
  const handleRestartExam = useCallback(() => {
    if (!mounted) return;

    // Generate a new organization code
    const newOrgCode = "A" + Math.random().toString().slice(2, 8);
    const currentSubjectValue = activeExam?.subject;

    // Reset the exam state
    dispatch(resetExam());

    // Initialize a new exam with the same subject and name but new code
    if (activeExam) {
      dispatch(
        initExam({
          subject: activeExam.subject,
          userName: activeExam.userName,
          organizationCode: newOrgCode,
        })
      );

      // Navigate back to phases page with the same subject
      router.push(`/exams/phases?subject=${currentSubjectValue}`);
    } else {
      router.push("/");
    }
  }, [activeExam, dispatch, mounted, router]);

  // Direct Print Approach - Simple and reliable
  const printCertificate = useCallback(() => {
    if (!certificateRef.current) return;

    try {
      setPdfGenerating(true);

      // Create a print-specific stylesheet
      const style = document.createElement("style");
      style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #certificateContainer, #certificateContainer * {
          visibility: visible;
        }
        #certificateContainer {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
      document.head.appendChild(style);

      // Add an ID to the certificate container for the print stylesheet
      certificateRef.current.id = "certificateContainer";

      // Show a brief instruction alert
      alert(
        "سيتم فتح نافذة الطباعة. اختر 'حفظ كـ PDF' من قائمة الطابعات لحفظ الشهادة."
      );

      // Trigger print
      window.print();

      // Clean up
      document.head.removeChild(style);
    } catch (error) {
      console.error("Error printing certificate:", error);
      alert("حدث خطأ أثناء طباعة الشهادة. يرجى المحاولة مرة أخرى.");
    } finally {
      setPdfGenerating(false);
    }
  }, []);

  // Alias functions for backward compatibility
  const downloadCertificate = useCallback(
    () => printCertificate(),
    [printCertificate]
  );
  const downloadPDF = useCallback(() => printCertificate(), [printCertificate]);

  // Share results
  const shareResults = useCallback(
    async (platform) => {
      if (!mounted || !currentResult || !activeExam) return;

      const text = `لقد حصلت على ${currentResult.totalScore}% في اختبار ${
        activeExam.subject === "mail" ? "البريد المصري" : "التربية"
      }. جرب الاختبار الآن!`;

      const url = window.location.origin;

      switch (platform) {
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
            "_blank"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}&quote=${encodeURIComponent(text)}`,
            "_blank"
          );
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              text
            )}&url=${encodeURIComponent(url)}`,
            "_blank"
          );
          break;
        case "copy":
          try {
            await navigator.clipboard.writeText(text + " " + url);
            alert("تم نسخ الرابط بنجاح!");
          } catch (err) {
            console.error("Failed to copy text: ", err);
          }
          break;
      }

      setShowShareOptions(false);
    },
    [activeExam, currentResult, mounted]
  );

  // Toggle detailed section
  const toggleSection = useCallback((sectionId) => {
    setExpanded((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // If not mounted or still loading data, show loading UI
  if (!mounted || loading || !currentResult || !activeExam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 text-xl font-bold">
            %
          </div>
        </div>
        <p className="text-gray-600 mt-6 font-medium">
          جاري تحليل النتائج وإعداد التقرير...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-xl overflow-hidden shadow flex">
          <button
            onClick={() => setViewMode("summary")}
            className={`px-6 py-2 font-medium text-sm ${
              viewMode === "summary"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            الملخص
          </button>
          <button
            onClick={() => setViewMode("certificate")}
            className={`px-6 py-2 font-medium text-sm ${
              viewMode === "certificate"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            الشهادة
          </button>
        </div>
      </div>

      {viewMode === "certificate" ? (
        /* Certificate View - Horizontal Professional Design */
        <div className="max-w-full h-fit">
          <Certificate
            currentSubject={currentSubject}
            activeExam={activeExam}
            formatDate={formatDate}
            resultLevel={resultLevel}
            totalScore={totalScore}
            categories={categories}
            certificateRef={certificateRef}
            currentResult={currentResult}
          />

          {/* Download Button - Outside Certificate */}
          {/* Download Button - Outside Certificate */}
          <div className="flex justify-center mb-6 md:mb-10 px-4">
            <button
              onClick={downloadPDF}
              disabled={pdfGenerating}
              className={`px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base ${
                pdfGenerating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {pdfGenerating ? (
                <>
                  <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تحميل الشهادة...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>تحميل الشهادة</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Summary View */
        <div ref={resultsRef}>
          {/* Certificate Card */}
          <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8">
            <div className="relative py-8 px-8 border-b border-gray-100">
              {/* Certificate Watermark */}
              <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
                <div className="text-gray-900 text-9xl font-bold rotate-10">
                  {currentSubject}
                </div>
              </div>

              <div className="relative flex justify-between items-center">
                {/* Left Side - Certificate Type */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                    {activeExam.subject === "mail" ? "📬" : "📚"}
                  </div>
                  <div className="mr-4">
                    <h3 className={`text-lg ${resultLevel.color} font-bold`}>
                      {getCertificateType(totalScore)}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {formatDate(currentResult.completedAt)}
                    </p>
                  </div>
                </div>

                {/* Right Side - User Info */}
                <div className="text-left">
                  <h2 className="text-xl font-bold text-gray-800">
                    {activeExam.userName}
                  </h2>
                  <p className="text-gray-500">
                    كود {activeExam.subject === "mail" ? "البريد" : "التربية"}:{" "}
                    {activeExam.organizationCode}
                  </p>
                </div>
              </div>

              {/* Main Title */}
              <div className="text-center mt-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
                  نتيجة اختبار {currentSubject}
                </h1>
              </div>
            </div>

            {/* Score Display */}
            <div className="p-8 text-center">
              <ScoreCircle
                score={totalScore}
                animateScore={animateScore}
                resultLevel={resultLevel}
                formatPercentage={true}
              />

              {/* Score Description */}
              <div className="mt-6 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  تقييم الأداء
                </h3>
                <p className="text-gray-600">
                  لقد أكملت الاختبار بنجاح. يظهر تقييمك مستوى {resultLevel.text}{" "}
                  في مهارات{" "}
                  {activeExam.subject === "mail" ? "البريد" : "التربية"}{" "}
                  الأساسية.
                </p>
              </div>

              {/* Share and Download Buttons */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {/* Share Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span>مشاركة النتيجة</span>
                  </button>

                  <ShareOptions
                    isVisible={showShareOptions}
                    onShare={shareResults}
                    onClose={() => setShowShareOptions(false)}
                  />
                </div>

                {/* Download Certificate Button */}
                <button
                  onClick={() => setViewMode("certificate")}
                  disabled={pdfGenerating}
                  className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    pdfGenerating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {pdfGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري التحميل...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>تحميل الشهادة</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                تفاصيل الأداء حسب المهارات
              </h3>

              <div className="space-y-4">
                {categories.map((category, index) => (
                  <CategoryCard
                    key={index}
                    category={category}
                    index={index}
                    expanded={expanded}
                    animateChart={animateChart}
                    toggleSection={toggleSection}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="p-6 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200">
              <button
                onClick={handleRestartExam}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-md shadow-green-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>اختبار جديد</span>
              </button>

              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-blue-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>العودة للرئيسية</span>
              </button>
            </div>
          </div>

          {/* Behavioral Analysis - Only shown if behavioral phase was completed */}
          {examState.phases &&
            examState.phases.behavioral &&
            examState.phases.behavioral.completed && (
              <BehavioralAnalysis examState={examState} />
            )}

          {/* Recommendations Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              توصيات وملاحظات
            </h3>

            <div className="space-y-4">
              {/* Strengths */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">نقاط القوة</h4>
                    <p className="text-gray-600 text-sm">
                      أظهرت أداءً ممتازًا في {getTopCategory(categories)} مما
                      يدل على تمكنك من المفاهيم الأساسية في هذا المجال.
                    </p>

                    {/* Top Categories Details */}
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-50">
                      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        {getTopCategoriesDetails(categories).map(
                          (item, idx) => (
                            <li key={idx}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">فرص التحسين</h4>
                    <p className="text-gray-600 text-sm">
                      يمكنك التركيز على تطوير مهاراتك في{" "}
                      {getLowestCategory(categories)} لتحسين أدائك العام في
                      الاختبارات القادمة.
                    </p>

                    {/* Improvement Areas Details */}
                    <div className="mt-3 p-3 bg-white rounded-lg border border-amber-50">
                      <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                        {getImprovementAreasDetails(categories).map(
                          (item, idx) => (
                            <li key={idx}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg
                      className="w-5 h-5"
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
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">الخطوات التالية</h4>
                    <p className="text-gray-600 text-sm">
                      ننصحك بمراجعة المواد التعليمية المتعلقة بالمجالات التي
                      حصلت فيها على درجات أقل، والتدرب على المزيد من الاختبارات
                      التجريبية.
                    </p>

                    {/* Study Resources Button */}
                    <button
                      onClick={() => router.push("/pdfs")}
                      className="mt-3 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs flex items-center gap-2 transition-colors w-auto"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span>تصفح مكتبة الامتحانات</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources - Rendered with memoized data */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              موارد تعليمية مقترحة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningResources.map((resource, idx) => (
                <div
                  key={idx}
                  className="bg-indigo-50 rounded-lg p-4 border border-indigo-100"
                >
                  <h4 className="font-bold text-gray-800 mb-2">
                    {resource.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {resource.description}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => router.push("/pdfs")}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>تصفح</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to organize phase scores with proper subject handling
function organizePhaseScores(phaseScores, examSubject) {
  console.log("Organizing phase scores for subject:", examSubject);

  // Define the standard structure for all categories
  const categories = {
    behavioral: {
      id: "behavioral",
      title: "الكفايات السلوكية والنفسية",
      scores: [],
      color: "blue",
      mainScore: 0,
    },
    language: {
      id: "language",
      title: "الكفايات اللغوية",
      scores: [],
      color: "green",
      mainScore: 0,
    },
    knowledge: {
      id: "knowledge",
      title: "الكفايات المعرفية والتكنولوجية",
      scores: [],
      color: "purple",
      mainScore: 0,
    },
    specialization: {
      id: "specialization",
      title: "كفايات التخصص",
      scores: [],
      color: "amber",
      mainScore: 0,
    },
  };

  // Add education category only for non-mail subjects
  if (examSubject !== "mail") {
    categories.education = {
      id: "education",
      title: "الكفايات التربوية",
      scores: [],
      color: "rose",
      mainScore: 0,
    };
  }

  // Process all phase scores
  Object.entries(phaseScores).forEach(([phaseId, score]) => {
    // Skip education scores for mail exams
    if (phaseId === "education" && examSubject === "mail") {
      return;
    }

    // Handle main phases directly
    if (!phaseId.includes("_") && categories[phaseId]) {
      categories[phaseId].mainScore = score;
    }
    // Process subphases
    else if (phaseId.includes("_")) {
      const [mainPhase, subPhase] = phaseId.split("_");

      // Skip education subphases for mail exams
      if (mainPhase === "education" && examSubject === "mail") {
        return;
      }

      // Add score to the appropriate category if it exists
      if (categories[mainPhase]) {
        categories[mainPhase].scores.push({
          id: phaseId,
          title: getSubPhaseTitle(subPhase),
          score: score,
          questions: getStandardQuestionCount(mainPhase, subPhase),
        });
      }
    }
  });

  // Calculate main scores for categories with subphases
  Object.keys(categories).forEach((categoryKey) => {
    const category = categories[categoryKey];

    // Calculate average score if we have subphases but no main score
    if (category.scores.length > 0 && category.mainScore === undefined) {
      const totalScore = category.scores.reduce(
        (sum, item) => sum + item.score,
        0
      );
      category.mainScore = Math.round(totalScore / category.scores.length);
    }
  });

  // Convert to array and sort in a logical order
  const result = Object.values(categories);

  // Sort categories in a logical order
  result.sort((a, b) => {
    const order = [
      "behavioral",
      "language",
      "knowledge",
      "education",
      "specialization",
    ];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  console.log(
    "Organized categories:",
    result.map((c) => c.id)
  );
  return result;
}

// Helper function to get result level based on score
function getResultLevel(score) {
  if (score >= 90)
    return {
      text: "ممتاز",
      color: "text-green-600",
      bg: "bg-green-100",
      borderColor: "border-green-300",
      gradient: "from-green-500 to-emerald-600",
    };
  if (score >= 80)
    return {
      text: "جيد جداً",
      color: "text-blue-600",
      bg: "bg-blue-100",
      borderColor: "border-blue-300",
      gradient: "from-blue-500 to-indigo-600",
    };
  if (score >= 70)
    return {
      text: "جيد",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      borderColor: "border-indigo-300",
      gradient: "from-indigo-500 to-purple-600",
    };
  if (score >= 60)
    return {
      text: "مقبول",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      borderColor: "border-yellow-300",
      gradient: "from-yellow-500 to-amber-600",
    };
  return {
    text: "ضعيف",
    color: "text-red-600",
    bg: "bg-red-100",
    borderColor: "border-red-300",
    gradient: "from-red-500 to-rose-600",
  };
}

// Function to get certificate type based on score
function getCertificateType(score) {
  if (score >= 90) return "شهادة امتياز";
  if (score >= 80) return "شهادة تقدير";
  if (score >= 70) return "شهادة اجتياز";
  if (score >= 60) return "شهادة حضور";
  return "شهادة مشاركة";
}

// Function to get question counts for each phase/subphase
function getQuestionCount(mainPhase, subPhase) {
  const questionCounts = {
    behavioral: 30,
    language: {
      arabic: 20,
      english: 20,
    },
    knowledge: {
      iq: 15,
      general: 15,
      it: 10,
    },
    specialization: 30,
    education: 30,
  };

  if (subPhase) {
    return questionCounts[mainPhase]?.[subPhase] || 10;
  }

  return questionCounts[mainPhase] || 10;
}

// Helper function to get subphase title
function getSubPhaseTitle(subPhaseId) {
  const titles = {
    arabic: "اللغة العربية",
    english: "اللغة الإنجليزية",
    iq: "اختبار الذكاء",
    general: "معلومات عامة",
    it: "تكنولوجيا المعلومات",
  };

  return titles[subPhaseId] || subPhaseId;
}

// Helper function to get standard question counts
function getStandardQuestionCount(mainPhase, subPhase) {
  const questionCounts = {
    behavioral: 30,
    language: {
      arabic: 20,
      english: 20,
    },
    knowledge: {
      iq: 15,
      general: 15,
      it: 10,
    },
    specialization: 30,
    education: 30,
  };

  if (subPhase && questionCounts[mainPhase]?.[subPhase]) {
    return questionCounts[mainPhase][subPhase];
  }

  return questionCounts[mainPhase] || 10;
}

// Helper function to get top scoring category
function getTopCategory(categories) {
  if (!categories || !categories.length) return "";

  // Find highest scoring category
  let highestScore = 0;
  let topCategory = "";

  categories.forEach((category) => {
    const score = category.mainScore || getAverageScore(category.scores);
    if (score > highestScore) {
      highestScore = score;
      topCategory = category.title;
    }
  });

  return topCategory;
}

// Helper function to get lowest scoring category
function getLowestCategory(categories) {
  if (!categories || !categories.length) return "";

  // Find lowest scoring category
  let lowestScore = 100;
  let lowestCategory = "";

  categories.forEach((category) => {
    const score = category.mainScore || getAverageScore(category.scores);
    if (score < lowestScore) {
      lowestScore = score;
      lowestCategory = category.title;
    }
  });

  return lowestCategory;
}

// Helper function to get average score from sub-scores
function getAverageScore(scores) {
  if (!scores || !scores.length) return 0;

  const total = scores.reduce((sum, item) => sum + (item.score || 0), 0);
  return total / scores.length;
}

// Helper function to get bar color
function getBarColor(color) {
  const colorMap = {
    blue: "#2563eb",
    green: "#16a34a",
    purple: "#9333ea",
    amber: "#d97706",
    rose: "#e11d48",
    cyan: "#0891b2",
    teal: "#0d9488",
  };

  return colorMap[color] || "#2563eb";
}

// Helper function to get top categories with details
function getTopCategoriesDetails(categories) {
  if (!categories || !categories.length) return [];

  // Sort categories by score in descending order
  const sortedCategories = [...categories].sort((a, b) => {
    const scoreA = a.mainScore || getAverageScore(a.scores);
    const scoreB = b.mainScore || getAverageScore(b.scores);
    return scoreB - scoreA;
  });

  // Take top 2 categories
  return sortedCategories.slice(0, 2).map((category) => {
    const score = category.mainScore || getAverageScore(category.scores);
    return `أداؤك متميز في ${category.title} (${score}%)`;
  });
}

// Helper function to get improvement areas with details
function getImprovementAreasDetails(categories) {
  if (!categories || !categories.length) return [];

  // Sort categories by score in ascending order
  const sortedCategories = [...categories].sort((a, b) => {
    const scoreA = a.mainScore || getAverageScore(a.scores);
    const scoreB = b.mainScore || getAverageScore(b.scores);
    return scoreA - scoreB;
  });

  // Take bottom 2 categories
  return sortedCategories.slice(0, 2).map((category) => {
    const score = category.mainScore || getAverageScore(category.scores);
    return `تحتاج لتطوير مهاراتك في ${category.title} (${score}%)`;
  });
}

// Helper function to extract color from gradient string
function extractColor(gradient, position) {
  // Parse the gradient string to extract colors
  const parts = gradient.split(" ");

  // Extract the first color (position 0)
  if (position === 0) {
    // Look for "from-" prefix
    const fromColor = parts.find((part) => part.startsWith("from-"));
    if (fromColor) {
      // Return color without opacity suffix (like "/20")
      return fromColor.includes("green")
        ? "#10b981"
        : fromColor.includes("blue")
        ? "#3b82f6"
        : fromColor.includes("indigo")
        ? "#6366f1"
        : fromColor.includes("yellow")
        ? "#f59e0b"
        : fromColor.includes("red")
        ? "#ef4444"
        : "#3b82f6";
    }
  }

  // Extract the second color (position 1)
  if (position === 1) {
    // Look for "to-" prefix
    const toColor = parts.find((part) => part.startsWith("to-"));
    if (toColor) {
      // Return color without opacity suffix
      return toColor.includes("emerald")
        ? "#059669"
        : toColor.includes("indigo")
        ? "#4f46e5"
        : toColor.includes("purple")
        ? "#9333ea"
        : toColor.includes("amber")
        ? "#d97706"
        : toColor.includes("rose")
        ? "#e11d48"
        : "#4f46e5";
    }
  }

  // Fallback colors if we can't parse the gradient properly
  return position === 0 ? "#3b82f6" : "#4f46e5";
}

// Helper function to generate learning resources
function generateLearningResources(categories, subject) {
  // Get the weakest category
  const sortedCategories = [...categories].sort((a, b) => {
    const scoreA = a.mainScore || getAverageScore(a.scores);
    const scoreB = b.mainScore || getAverageScore(b.scores);
    return scoreA - scoreB;
  });

  const weakestCategory = sortedCategories[0];

  // Generate resources based on subject and weakest category
  const resources = [
    {
      title: `نماذج امتحانات ${
        subject === "mail" ? "البريد المصري" : "التربية"
      }`,
      description: "مجموعة متنوعة من نماذج الامتحانات السابقة للتدرب عليها",
    },
    {
      title: `تدريبات ${weakestCategory ? weakestCategory.title : "متنوعة"}`,
      description: "تمارين مكثفة على المجالات التي تحتاج لتحسين",
    },
    {
      title: "مراجعة شاملة",
      description: "ملخصات تغطي جميع المجالات المطلوبة في الاختبار",
    },
    {
      title: "اختبارات تفاعلية",
      description: "اختبارات قصيرة ومركزة لتقييم مستواك بشكل دوري",
    },
  ];

  return resources;
}

export default ResultsPage;
