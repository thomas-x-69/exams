import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PaymentStatusModal from "./PaymentStatusModal";

const PremiumSubscription = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("cashPayment"); // 'cashPayment' or 'cardPayment'
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced pricing plan with better marketing copy
  const plan = {
    id: "lifetime",
    name: "العضوية الذهبية",
    price: 99,
    originalPrice: 150,
    features: [
      "وصول حصري لأكثر من 100 امتحان واقعي من الاختبارات السابقة",
      "نماذج امتحانات بنفس مستوى صعوبة الاختبارات الرسمية",
      "تحليل مفصل لأدائك مع تحديد نقاط القوة والضعف",
      "شهادات إتمام بتصميم احترافي قابلة للتحميل والمشاركة",
      "دعم فني متخصص على مدار الساعة طوال أيام الأسبوع",
      "تحديثات مستمرة بأحدث الامتحانات والنماذج",
      "اشتراك لمرة واحدة فقط - بدون رسوم متكررة أو تجديد تلقائي",
      "وصول VIP للمحتوى الحصري والإضافات المستقبلية",
    ],
    testimonials: [
      {
        name: "أحمد م.",
        text: "اختبارات حقيقية ساعدتني في النجاح بمعدل 89% في اختبار البريد",
        rating: 5,
      },
      {
        name: "سارة ع.",
        text: "أفضل استثمار قدمته لمستقبلي المهني. تدريب واقعي ودقيق",
        rating: 5,
      },
      {
        name: "محمد خ.",
        text: "وفر علي وقت وجهد كبير في التحضير وساعدني للتركيز على نقاط ضعفي",
        rating: 4,
      },
    ],
    guarantee: "ضمان استرداد كامل المبلغ خلال 7 أيام إذا لم تكن راضيًا تمامًا",
  };

  // Enhanced payment methods with better descriptions
  const paymentMethods = [
    {
      id: "fawry",
      name: "فوري",
      description: "الدفع من خلال أي فرع فوري في جميع أنحاء مصر",
      icon: "fawry.png",
      integrationId: process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID_FAWRY,
      type: "cashPayment",
      steps: [
        "توجه لأقرب منفذ فوري (متوفر في جميع أنحاء مصر)",
        "اطلب دفع فاتورة Accept واذكر رقم الهاتف المستخدم",
        "أدخل رقم الفاتورة الذي سيظهر لك بعد تأكيد الطلب",
        "ادفع المبلغ (99 جنيه) واحتفظ بالإيصال",
      ],
    },
    {
      id: "wallet",
      name: "محفظة إلكترونية",
      description: "فودافون كاش، اتصالات كاش، أورانج كاش، وي باي",
      icon: "wallet.png",
      integrationId: process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID_WALLET,
      type: "cashPayment",
      steps: [
        "اختر محفظتك الإلكترونية المفضلة (فودافون كاش، اتصالات كاش، إلخ)",
        "أكد موافقتك على الدفع وستصلك رسالة للتأكيد على هاتفك",
        "أدخل رقم PIN الخاص بمحفظتك لتأكيد العملية",
        "بعد إتمام العملية، ستتم ترقية حسابك تلقائيًا للعضوية الذهبية",
      ],
    },
    {
      id: "credit",
      name: "بطاقة ائتمان",
      description: "فيزا، ماستركارد، ميزة - تشفير كامل للبيانات",
      icon: "credit.png",
      integrationId: process.env.NEXT_PUBLIC_PAYMOB_INTEGRATION_ID_CARD,
      type: "cardPayment",
      steps: [
        "أدخل بيانات البطاقة في صفحة الدفع الآمنة",
        "تأكد من صحة البيانات واضغط على تأكيد الدفع",
        "سيتم تحويلك لصفحة البنك للتأكيد إذا كان حسابك يدعم 3D Secure",
        "بعد إتمام العملية، ستتم ترقية حسابك فورًا للعضوية الذهبية",
      ],
    },
  ];

  const handleSelectPaymentMethod = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePaymentInitiation = async () => {
    if (!selectedPaymentMethod) {
      alert("برجاء اختيار وسيلة الدفع");
      return;
    }

    setIsLoading(true);

    try {
      // Get selected payment method details
      const paymentMethod = paymentMethods.find(
        (method) => method.id === selectedPaymentMethod
      );

      // Call the API to create a payment
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plan.price * 100, // In piasters
          planId: plan.id,
          integrationId: paymentMethod.integrationId,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show pending payment modal
        setPaymentStatus({
          status: "pending",
          message: "جاري تحويلك إلى صفحة الدفع...",
        });
        setShowPaymentModal(true);

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = data.paymentUrl;
        }, 1500);
      } else {
        throw new Error(data.message || "حدث خطأ أثناء إنشاء عملية الدفع");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentStatus({
        status: "error",
        message: error.message || "حدث خطأ أثناء الدفع، يرجى المحاولة مرة أخرى",
      });
      setShowPaymentModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus(null);
  };

  // Check for payment status on component mount (for handling callbacks)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status === "success") {
      setPaymentStatus({
        status: "success",
        message: "تم الدفع بنجاح! جاري تفعيل اشتراكك.",
      });
      setShowPaymentModal(true);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === "error") {
      setPaymentStatus({
        status: "error",
        message: "فشلت عملية الدفع. يرجى المحاولة مرة أخرى.",
      });
      setShowPaymentModal(true);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Generate star rating
  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-gray-400"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  return (
    <div className="max-w-6xl mx-auto ">
      {/* Premium Package Display - Enhanced with modern design */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        {/* Left Column - Package Info */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-xl p-6 h-full relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-full h-full bg-grid-pattern"></div>
              <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full bg-yellow-500/30 filter blur-3xl animate-float"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-500/20 filter blur-3xl animate-float"
                style={{ animationDelay: "-5s" }}
              ></div>
            </div>

            {/* Package Content */}
            <div className="relative">
              {/* Limited Offer Badge */}
              <div className="absolute -top-10 -right-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-ping opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-red-500 to-red-600 px-4 py-1 rounded-full transform rotate-12">
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      عرض لفترة محدودة
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-white/70 text-sm">
                  الوصول الكامل لجميع الامتحانات الحقيقية والميزات الحصرية
                </p>
              </div>

              {/* Price Section - Enhanced with better animation */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/10 mb-6 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-end gap-2">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                    {plan.price}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-amber-400/70 line-through text-lg">
                      {plan.originalPrice}
                    </span>
                    <span className="text-white/80 text-sm">جنيه مصري</span>
                  </div>
                  <div className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-lg border border-green-500/30 mr-2 animate-pulse">
                    خصم{" "}
                    {Math.round(
                      ((plan.originalPrice - plan.price) / plan.originalPrice) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>

              {/* Lifetime Badge */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-2 rounded-lg border border-amber-500/30 mb-6 transform hover:translate-y-1 hover:shadow-lg transition-all duration-300">
                <svg
                  className="w-5 h-5 text-amber-400 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-amber-300 font-bold">
                  اشتراك لمرة واحدة - وصول مدى الحياة
                </span>
              </div>

              {/* Features List - Enhanced design */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg inline-block">
                  <svg
                    className="w-5 h-5 text-amber-400"
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
                  <span>المميزات الحصرية</span>
                </h4>
                <ul className="space-y-3 mt-4">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-default"
                      onMouseEnter={() => setIsHovered(idx)}
                      onMouseLeave={() => setIsHovered(null)}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isHovered === idx
                            ? "bg-gradient-to-br from-amber-500 to-yellow-500 scale-110"
                            : "bg-gradient-to-br from-amber-500/20 to-yellow-500/20"
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 ${
                            isHovered === idx ? "text-white" : "text-amber-400"
                          } transition-colors duration-300`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-white/90 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Satisfaction Guarantee */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30 mb-6 flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-green-500 flex-shrink-0"
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
                <span className="text-white/90 text-sm">{plan.guarantee}</span>
              </div>

              {/* Testimonials Section - Improved with ratings */}
              <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden hover:border-amber-500/30 transition-all duration-300">
                <div className="absolute -top-4 -right-4 text-amber-500/20 text-6xl font-serif">
                  "
                </div>
                <h4 className="text-white font-semibold mb-3 text-sm relative z-10">
                  آراء المشتركين
                </h4>
                <div className="space-y-3 relative z-10">
                  {plan.testimonials.map((testimonial, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 rounded-full flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0 font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white/90 text-xs">
                          {testimonial.text}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-amber-400 text-xs">
                            {testimonial.name}
                          </div>
                          <div className="flex">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Methods */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-xl p-6 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-full h-full bg-grid-pattern"></div>
              <div
                className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/20 filter blur-3xl animate-float"
                style={{ animationDelay: "-3s" }}
              ></div>
              <div
                className="absolute top-0 left-0 w-64 h-64 rounded-full bg-purple-500/20 filter blur-3xl animate-float"
                style={{ animationDelay: "-8s" }}
              ></div>
            </div>

            {/* Content */}
            <div className="relative">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>اختر طريقة الدفع المفضلة</span>
              </h3>

              {/* Payment Methods Tabs - Improved UI */}
              <div className="flex mb-6 border-b border-white/10">
                <button
                  className={`pb-3 px-6 text-sm font-medium relative transition-all duration-300 ${
                    activeTab === "cashPayment"
                      ? "text-amber-400"
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("cashPayment")}
                >
                  <div className="flex items-center gap-2">
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
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>دفع نقدي / محافظ إلكترونية</span>
                  </div>
                  {activeTab === "cashPayment" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500"></span>
                  )}
                </button>
                <button
                  className={`pb-3 px-6 text-sm font-medium relative transition-all duration-300 ${
                    activeTab === "cardPayment"
                      ? "text-amber-400"
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("cardPayment")}
                >
                  <div className="flex items-center gap-2">
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span>بطاقات ائتمان</span>
                  </div>
                  {activeTab === "cardPayment" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500"></span>
                  )}
                </button>
              </div>

              {/* Payment Methods Grid - Enhanced visual appeal */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {paymentMethods
                  .filter((method) => method.type === activeTab)
                  .map((method) => (
                    <div
                      key={method.id}
                      onClick={() => handleSelectPaymentMethod(method.id)}
                      className={`
                        relative p-4 rounded-xl border transition-all duration-300 cursor-pointer transform hover:translate-y-[-2px]
                        ${
                          selectedPaymentMethod === method.id
                            ? "bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border-amber-500/50 shadow-lg shadow-amber-500/10"
                            : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        {/* Payment Method Icon */}
                        <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center shadow-md flex-shrink-0 hover:shadow-lg transition-shadow">
                          {method.id === "fawry" && (
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/ar/d/db/%D9%81%D9%88%D8%B1%D9%8A.png"
                              alt="فوري"
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          )}
                          {method.id === "wallet" && (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                            </div>
                          )}
                          {method.id === "credit" && (
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Payment Method Details */}
                        <div className="flex-1">
                          <h4 className="font-bold text-white mb-1 flex items-center justify-between">
                            {method.name}

                            {selectedPaymentMethod === method.id && (
                              <div className="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </h4>
                          <p className="text-white/70 text-sm mb-3">
                            {method.description}
                          </p>

                          {/* Payment Steps */}
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-colors">
                            <h5 className="text-xs font-medium text-white/90 mb-2 flex items-center gap-1">
                              <svg
                                className="w-4 h-4 text-amber-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                              </svg>
                              <span>خطوات الدفع:</span>
                            </h5>
                            <ol className="space-y-1 pr-2">
                              {method.steps.map((step, idx) => (
                                <li
                                  key={idx}
                                  className="text-white/70 text-xs flex items-start gap-2 group"
                                >
                                  <span className="inline-block w-5 h-5 bg-white/10 group-hover:bg-amber-500/30 rounded-full text-center flex-shrink-0 text-[10px] leading-5 transition-colors">
                                    {idx + 1}
                                  </span>
                                  <span className="group-hover:text-white/90 transition-colors">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Order Summary - Enhanced design */}
              <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-5 mb-6 border border-white/10 shadow-inner">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>ملخص الطلب</span>
                </h4>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">العضوية الذهبية</span>
                    <span className="text-white">
                      {plan.originalPrice} جنيه
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/70">الخصم</span>
                    <span className="text-green-400">
                      {plan.originalPrice - plan.price} جنيه
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">الإجمالي</span>
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                      {plan.price} جنيه
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/20 to-yellow-600/20 p-3 rounded-lg border border-amber-500/30 text-sm text-white/90 mb-4">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
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
                    <div>
                      <span className="block font-medium text-amber-300 mb-1">
                        دفع آمن ومضمون
                      </span>
                      <span>
                        اشتراك لمرة واحدة فقط بدون رسوم متكررة أو تجديد تلقائي.
                        وصول مدى الحياة لجميع المميزات.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button - Enhanced with better animation */}
                <button
                  onClick={handlePaymentInitiation}
                  disabled={isLoading || !selectedPaymentMethod}
                  className={`
                    w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-500 relative overflow-hidden
                    ${
                      isLoading || !selectedPaymentMethod
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-lg hover:shadow-xl hover:shadow-amber-500/20 transform hover:scale-[1.01]"
                    }
                  `}
                >
                  {/* Animated Shine Effect */}
                  <div className="absolute inset-0 w-1/3 bg-white opacity-20 blur-xl transform -skew-x-12 -translate-x-full animate-shimmer pointer-events-none"></div>

                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>جاري التحميل...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>إتمام الدفع الآن</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Security Badges - Enhanced with better visuals */}
              <div className="flex justify-center items-center gap-8 mt-4">
                <div className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 group-hover:from-amber-500/20 group-hover:to-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-1 transition-all duration-300 border border-amber-500/10 group-hover:border-amber-500/30">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <span className="text-white/60 text-xs group-hover:text-white/80 transition-colors">
                    دفع آمن ومشفر
                  </span>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 group-hover:from-amber-500/20 group-hover:to-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-1 transition-all duration-300 border border-amber-500/10 group-hover:border-amber-500/30">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="text-white/60 text-xs group-hover:text-white/80 transition-colors">
                    ضمان استرداد 7 أيام
                  </span>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 group-hover:from-amber-500/20 group-hover:to-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-1 transition-all duration-300 border border-amber-500/10 group-hover:border-amber-500/30">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-white/60 text-xs group-hover:text-white/80 transition-colors">
                    دعم فني على مدار الساعة
                  </span>
                </div>
              </div>

              {/* Payment logos */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <div className="bg-white rounded-lg p-2 h-8 flex items-center">
                  <img
                    src="/images/payment/visa.png"
                    alt="Visa"
                    className="h-full"
                  />
                </div>
                <div className="bg-white rounded-lg p-2 h-8 flex items-center">
                  <img
                    src="/images/payment/mastercard.png"
                    alt="Mastercard"
                    className="h-full"
                  />
                </div>
                <div className="bg-white rounded-lg p-2 h-8 flex items-center">
                  <img
                    src="/images/payment/meeza.png"
                    alt="Meeza"
                    className="h-full"
                  />
                </div>
                <div className="bg-white rounded-lg p-2 h-8 flex items-center">
                  <img
                    src="/images/payment/fawry.png"
                    alt="Fawry"
                    className="h-full"
                  />
                </div>
                <div className="bg-white rounded-lg p-2 h-8 flex items-center">
                  <img
                    src="/images/payment/vodafone.png"
                    alt="Vodafone Cash"
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showPaymentModal}
        status={paymentStatus}
        onClose={closePaymentModal}
      />

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) skewX(-15deg);
          }
          100% {
            transform: translateX(150%) skewX(-15deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px
            );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default PremiumSubscription;
