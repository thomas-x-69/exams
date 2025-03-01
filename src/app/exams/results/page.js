// src/app/exams/results/page.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { resetExam, initExam } from "../../../../store/examSlice";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { calculatePhaseScore } from "@/app/data/questionsUtils";
import LOGO from "../../../../public/logo.png";

const ResultsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const examState = useSelector((state) => state.exam);
  const { activeExam, currentResult, examCompleted } = examState;

  const certificateRef = useRef(null);
  const resultsRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [animateChart, setAnimateChart] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [viewMode, setViewMode] = useState("summary"); // 'summary' or 'certificate'

  useEffect(() => {
    if (!loading && currentResult && activeExam) {
      submitExamResults();
    }
  }, [loading, currentResult, activeExam]);

  useEffect(() => {
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
  }, [activeExam, examCompleted, router]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";

    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle restart exam
  const handleRestartExam = () => {
    // Generate a new organization code
    const newOrgCode = "A" + Math.random().toString().slice(2, 8);

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
      router.push(`/exams/phases?subject=${activeExam.subject}`);
    } else {
      router.push("/");
    }
  };

  // Generate and download PDF

  // Replace your entire downloadPDF function with this
  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    try {
      setPdfGenerating(true);

      // Simple capture with maximum quality
      const canvas = await html2canvas(certificateRef.current, {
        scale: 4,
        backgroundColor: "#ffffff",
      });

      // Get image as data URL
      const imgData = canvas.toDataURL("image/png");

      // Create PDF with landscape orientation
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Place image on the entire page (with small margins)
      pdf.addImage(imgData, "PNG", 5, 5, pdfWidth - 10, pdfHeight - 10);

      // Save PDF
      pdf.save(`certificate.pdf`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setPdfGenerating(false);
    }
  };

  // Share results
  const shareResults = async (platform) => {
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
  };

  if (loading || !currentResult || !activeExam) {
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

  const { totalScore, phaseScores = {} } = currentResult;

  // Determine result level based on score
  const getResultLevel = (score) => {
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
  };

  const resultLevel = getResultLevel(totalScore);

  // Function to get certificate type based on score
  const getCertificateType = (score) => {
    if (score >= 90) return "شهادة امتياز";
    if (score >= 80) return "شهادة تقدير";
    if (score >= 70) return "شهادة اجتياز";
    if (score >= 60) return "شهادة حضور";
    return "شهادة مشاركة";
  };

  // Organize phases into categories
  const organizePhaseScores = () => {
    const categories = {
      behavioral: {
        title: "الكفايات السلوكية والنفسية",
        scores: [],
        color: "blue",
      },
      language: { title: "الكفايات اللغوية", scores: [], color: "green" },
      knowledge: {
        title: "الكفايات المعرفية والتكنولوجية",
        scores: [],
        color: "purple",
      },
      specialization: { title: "كفايات التخصص", scores: [], color: "amber" },
      education: { title: "الكفايات التربوية", scores: [], color: "rose" },
    };

    // Sort scores into categories
    Object.entries(phaseScores).forEach(([phaseId, score]) => {
      if (phaseId.includes("_")) {
        const [mainPhase, subPhase] = phaseId.split("_");
        if (categories[mainPhase]) {
          categories[mainPhase].scores.push({
            id: phaseId,
            title: getSubPhaseTitle(subPhase),
            score,
          });
        }
      } else {
        if (categories[phaseId]) {
          categories[phaseId].mainScore = score;
        }
      }
    });

    // Filter out empty categories
    return Object.values(categories).filter(
      (category) => category.scores.length > 0 || category.mainScore
    );
  };

  const categories = organizePhaseScores();

  const submitExamResults = async () => {
    if (!activeExam || !currentResult) return;

    try {
      console.log("Preparing to submit exam results");

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
      };

      console.log("Submitting data:", submitData);

      // Make the API request
      const response = await fetch("/api/submit-exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      console.log("Response received, status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.status !== "success") {
        console.error("Error submitting results:", data.message);
        // Optionally show an error notification to the user
      } else {
        console.log("Results submitted successfully");
        // Optionally show a success notification to the user
      }
    } catch (error) {
      console.error("Failed to submit exam results:", error);
      // Optionally show an error notification to the user
    }
  };
  // Toggle detailed section
  const toggleSection = (sectionId) => {
    setExpanded((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

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
        <div className="max-w-5xl mx-auto">
          <div
            id="certificateContainer"
            ref={certificateRef}
            className="bg-white rounded-xl shadow-xl overflow-hidden border-4 border-blue-200 mb-8 p-10"
            style={{ aspectRatio: "1.414" }}
          >
            {/* Certificate Header with Logo */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
              {/* Logo & Title */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-blue-100 shadow-lg">
                  <Image src={LOGO} alt="logo" className="p-2" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                    منصة الاختبارات المصرية
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    شهادة رسمية معتمدة
                  </p>
                </div>
              </div>

              {/* Certificate Type & ID */}
              <div className="text-left">
                <h2
                  className={`font-bold py-1 px-4 rounded-full inline-block ${resultLevel.bg} ${resultLevel.color} border ${resultLevel.borderColor}`}
                >
                  {getCertificateType(totalScore)}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  رقم: {activeExam.organizationCode}
                </p>
              </div>
            </div>

            {/* Certificate Body - Horizontal Layout */}
            <div className="flex gap-10 mb-10">
              {/* Left Side - User Info */}
              <div className="flex-1 text-right border-l border-gray-100 pl-10">
                <div className="mb-8">
                  <p className="text-lg text-gray-700 mb-2">
                    تشهد منصة الاختبارات المصرية أن
                  </p>

                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {activeExam.userName}
                  </h3>

                  <p className="text-lg text-gray-700">
                    قد أكمل بنجاح اختبار{" "}
                    {activeExam.subject === "mail"
                      ? "البريد المصري"
                      : "التربية"}
                    <br />
                    بتاريخ {formatDate(currentResult.completedAt)}
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-3">
                    الكفايات المقيمة:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {categories.map((category, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                <div className="relative w-52 h-52">
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
                    <div className="text-5xl font-bold text-gray-800">
                      {totalScore}%
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div
                    className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-6 py-1 rounded-full text-lg font-bold ${resultLevel.bg} ${resultLevel.color} border ${resultLevel.borderColor} shadow-md`}
                  >
                    {resultLevel.text}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-2">
                    نتمنى لك التوفيق الدائم والنجاح في مسيرتك المهنية
                  </p>
                  <div className="text-sm text-blue-600 font-bold">
                    www.egyptian-exams.com
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm text-gray-500 mt-auto">
              <div>تاريخ الإصدار: {formatDate(currentResult.completedAt)}</div>

              {/* Official Stamp */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-blue-600 flex items-center justify-center opacity-70">
                  <div className="w-14 h-14 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className="text-blue-800 text-xs font-bold">
                      ختم رسمي
                    </div>
                  </div>
                </div>
                <div className="border-b-2 border-gray-400 w-32 h-8">
                  <div className="text-right text-xs">مدير المنصة</div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button - Outside Certificate */}
          <div className="flex justify-center mb-10">
            <button
              onClick={downloadPDF}
              disabled={pdfGenerating}
              className={`px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                pdfGenerating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {pdfGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تحميل الشهادة...</span>
                </>
              ) : (
                <>
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
                  {activeExam.subject === "mail" ? "البريد" : "التربية"}
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
                  نتيجة اختبار{" "}
                  {activeExam.subject === "mail" ? "البريد المصري" : "التربية"}
                </h1>
              </div>
            </div>

            {/* Score Display */}
            <div className="p-8 text-center">
              <div className="relative inline-flex">
                {/* Score Circle */}
                <div className="relative w-48 h-48">
                  {/* Background Circle */}
                  <div className="absolute inset-0 rounded-full bg-gray-100"></div>

                  {/* Progress Circle - Animated */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                  >
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
                        animateScore
                          ? 251.2 - (251.2 * totalScore) / 100
                          : 251.2
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
                      {animateScore ? totalScore : 0}%
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
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-all"
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

                  {/* Share Options Popup */}
                  {showShareOptions && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 w-48">
                      <button
                        onClick={() => shareResults("whatsapp")}
                        className="w-full text-right px-3 py-2 hover:bg-green-50 text-green-700 rounded-md flex items-center gap-2 mb-1"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="text-sm">واتساب</span>
                      </button>
                      <button
                        onClick={() => shareResults("facebook")}
                        className="w-full text-right px-3 py-2 hover:bg-blue-50 text-blue-700 rounded-md flex items-center gap-2 mb-1"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="text-sm">فيسبوك</span>
                      </button>
                      <button
                        onClick={() => shareResults("twitter")}
                        className="w-full text-right px-3 py-2 hover:bg-blue-50 text-blue-500 rounded-md flex items-center gap-2 mb-1"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        <span className="text-sm">تويتر</span>
                      </button>
                      <button
                        onClick={() => shareResults("copy")}
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
                  )}
                </div>

                {/* Download Certificate Button */}
                <button
                  onClick={() => setViewMode("certificate")}
                  disabled={pdfGenerating}
                  className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all ${
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
                      {category.mainScore && (
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
                                width: animateChart
                                  ? `${category.mainScore}%`
                                  : "0%",
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
                                    width: animateChart
                                      ? `${score.score}%`
                                      : "0%",
                                    backgroundColor: getBarColor(
                                      category.color
                                    ),
                                    transition: `width 1s ease-out ${
                                      0.2 + idx * 0.1
                                    }s`,
                                  }}
                                ></div>
                              </div>

                              {/* Question Performance Details */}
                              <div className="mt-2 mb-4">
                                <button
                                  onClick={() =>
                                    toggleSection(
                                      `score-details-${category.id}-${score.id}`
                                    )
                                  }
                                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                >
                                  <svg
                                    className={`w-3 h-3 transition-transform ${
                                      expanded[
                                        `score-details-${category.id}-${score.id}`
                                      ]
                                        ? "rotate-180"
                                        : ""
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
                                  تفاصيل الأسئلة
                                </button>

                                {expanded[
                                  `score-details-${category.id}-${score.id}`
                                ] && (
                                  <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 text-xs">
                                    <div className="flex justify-between text-gray-600 mb-2 pb-1 border-b border-gray-100">
                                      <span>
                                        عدد الأسئلة الكلي:{" "}
                                        {Math.round(
                                          (100 / score.score) *
                                            (score.score / 100) *
                                            10
                                        )}
                                      </span>
                                      <span>
                                        الإجابات الصحيحة:{" "}
                                        {Math.round((score.score / 100) * 10)}
                                      </span>
                                    </div>

                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                                        <span>
                                          الإجابات الصحيحة: {score.score}%
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                                        <span>
                                          الإجابات الخاطئة: {100 - score.score}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
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
                    )}
                  </div>
                ))}
              </div>

              {/* Percentile Ranking */}
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

          {/* Additional Resources */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              موارد تعليمية مقترحة
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generateLearningResources(categories, activeExam.subject).map(
                (resource, idx) => (
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
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

// Helper function to get phase title
const getPhaseTitle = (phaseId) => {
  const phaseTitles = {
    behavioral: "الكفايات السلوكية والنفسية",
    language: "الكفايات اللغوية",
    knowledge: "الكفايات المعرفية والتكنولوجية",
    specialization: "كفايات التخصص",
    education: "الكفايات التربوية",
  };

  return phaseTitles[phaseId] || phaseId;
};

// Helper function to get subphase title
const getSubPhaseTitle = (subPhaseId) => {
  const subPhaseTitles = {
    arabic: "اللغة العربية",
    english: "اللغة الإنجليزية",
    iq: "اختبار الذكاء",
    general: "معلومات عامة",
    it: "تكنولوجيا المعلومات",
  };

  return subPhaseTitles[subPhaseId] || subPhaseId;
};

// Helper function to get bar color
const getBarColor = (color) => {
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
};

// Helper function to get percentile rank
function getPercentileRank(score) {
  // Simulate percentile - in a real app, this would be calculated from actual data
  return Math.min(99, Math.max(1, Math.round(score * 0.95)));
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
      return fromColor.replace("from-", "").replace(/\/\d+$/, "");
    }
  }

  // Extract the second color (position 1)
  if (position === 1) {
    // Look for "to-" prefix
    const toColor = parts.find((part) => part.startsWith("to-"));
    if (toColor) {
      // Return color without opacity suffix
      return toColor.replace("to-", "").replace(/\/\d+$/, "");
    }
  }

  // Fallback colors if we can't parse the gradient properly
  return position === 0 ? "blue-600" : "indigo-600";
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
