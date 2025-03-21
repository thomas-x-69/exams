// كفايات التخصص - البريد
const specialization_mail = [
  {
    id: "sp_mail1",
    text: "ما هو البروتوكول المستخدم في نقل البريد الإلكتروني؟",
    options: ["SMTP", "HTTP", "FTP", "TCP"],
    correctAnswer: 0,
  },
  {
    id: "sp_mail2",
    text: "ما هو المقصود بخدمة التوصيل السريع للبريد؟",
    options: [
      "توصيل البريد في نفس اليوم",
      "توصيل البريد خلال 24 ساعة",
      "خدمة مميزة لتوصيل البريد والطرود بسرعة محددة ومضمونة",
      "توصيل البريد بالطائرات فقط",
    ],
    correctAnswer: 2,
  },
  {
    id: "sp_mail3",
    text: "ما هو الرمز البريدي؟",
    options: [
      "رمز سري للمراسلات",
      "رقم أو مجموعة أرقام وحروف تدل على منطقة جغرافية لتسهيل فرز وتوزيع البريد",
      "رقم المنزل أو العقار",
      "رمز يستخدم فقط للطرود الدولية",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail4",
    text: "أي مما يلي يعتبر من خدمات البريد المصري؟",
    options: [
      "خدمة الفاكس فقط",
      "التوصيل السريع للوثائق والطرود",
      "نقل الركاب بين المدن",
      "تصنيع معدات الاتصالات",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail5",
    text: "ما هو نظام التتبع البريدي؟",
    options: [
      "نظام لمراقبة سائقي سيارات البريد",
      "نظام يتيح للعملاء معرفة موقع وحالة شحناتهم البريدية",
      "نظام لتتبع العاملين بالبريد",
      "نظام لتتبع المراسلات الحكومية فقط",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail6",
    text: "ما هي بطاقة الرقم القومي؟",
    options: [
      "بطاقة تستخدم للسفر خارج البلاد",
      "وثيقة رسمية تثبت الهوية الشخصية للمواطنين وتحتوي على رقم قومي فريد",
      "بطاقة عضوية النقابات المهنية",
      "بطاقة خاصة بالعاملين في البريد فقط",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail7",
    text: "ما هي خدمة الحوالات البريدية؟",
    options: [
      "إرسال الرسائل عبر البريد",
      "تحويل الأموال عبر شبكة مكاتب البريد",
      "توصيل الطرود المسجلة",
      "حفظ المستندات الهامة",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail8",
    text: "ما هو المقصود بالبريد المسجل؟",
    options: [
      "البريد العادي",
      "خدمة بريدية تتيح تسجيل الرسائل والطرود ومتابعتها وتأكيد استلامها",
      "البريد الإلكتروني",
      "البريد المرسل للجهات الحكومية فقط",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail9",
    text: "ما هي خدمة البريد العاجل الدولي؟",
    options: [
      "خدمة شحن بحري دولي",
      "خدمة توصيل سريعة للمستندات والطرود على المستوى الدولي",
      "خدمة البرقيات",
      "خدمة تسجيل الهجرة للخارج",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail10",
    text: "ما هو الفرق بين البريد العادي والبريد المسجل؟",
    options: [
      "البريد العادي أسرع من المسجل",
      "البريد المسجل يتيح تتبع المرسلات وتأكيد الاستلام بينما العادي لا يوفر هذه الميزة",
      "لا يوجد فرق بينهما",
      "البريد العادي للمستندات فقط والمسجل للطرود فقط",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail11",
    text: "ما هي خدمة صندوق البريد؟",
    options: [
      "صندوق حفظ الرسائل في المنازل",
      "مساحة مخصصة في مكتب البريد لتلقي المراسلات بدلاً من التوصيل للعنوان",
      "صندوق نقل البريد بين المدن",
      "صندوق لجمع التبرعات في مكاتب البريد",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail12",
    text: "ما هي المستندات المطلوبة لاستخراج بطاقة الرقم القومي لأول مرة؟",
    options: [
      "شهادة الميلاد فقط",
      "شهادة الميلاد المميكنة وصور شخصية وإيصال مرافق حديث",
      "جواز السفر فقط",
      "بطاقة العمل فقط",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail13",
    text: "ما هو البريد الإلكتروني الآمن؟",
    options: [
      "البريد المستخدم داخل الشركات فقط",
      "البريد الإلكتروني المشفر الذي يحمي خصوصية المراسلات",
      "البريد الذي يستخدم في البنوك فقط",
      "البريد الذي يمكن قراءته فقط من جهاز معين",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail14",
    text: "ما هي أوقات العمل الرسمية في مكاتب البريد المصري عموماً؟",
    options: [
      "6 صباحاً إلى 2 ظهراً",
      "8 صباحاً إلى 3 عصراً",
      "من 9 صباحاً إلى 5 مساءً",
      "24 ساعة يومياً",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail15",
    text: "أي مما يلي ليس من الخدمات المالية التي يقدمها البريد المصري؟",
    options: [
      "فتح حسابات التوفير",
      "صرف المعاشات",
      "الحوالات المالية",
      "إصدار تأشيرات السفر",
    ],
    correctAnswer: 3,
  },
  {
    id: "sp_mail16",
    text: "ما هي خدمة التخليص الجمركي في البريد؟",
    options: [
      "خدمة تنظيف مكاتب البريد",
      "خدمة فحص وتخليص الطرود والبضائع الواردة من الخارج مع دفع الرسوم الجمركية",
      "خدمة توصيل البريد للمناطق النائية",
      "خدمة فرز البريد حسب المنطقة",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail17",
    text: "ما هو العنوان البريدي المنظم؟",
    options: [
      "العنوان المسجل في سجلات الشهر العقاري",
      "نظام موحد لكتابة العناوين بطريقة معيارية تسهل عملية فرز وتوصيل البريد",
      "العنوان المسجل لدى المحليات فقط",
      "العنوان المكتوب باللغة الإنجليزية فقط",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail18",
    text: "ما هي البطاقات ذكية الخدمات؟",
    options: [
      "بطاقات هوية العاملين بالبريد",
      "بطاقات إلكترونية متعددة الأغراض للخدمات المالية والحكومية",
      "بطاقات تذاكر وسائل النقل العام",
      "بطاقات العضوية في النوادي",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail19",
    text: "ما هو المقصود بالمناطق البريدية؟",
    options: [
      "المناطق التي توجد بها مكاتب البريد فقط",
      "تقسيم جغرافي للمناطق مع تخصيص رموز محددة لتسهيل فرز وتوزيع البريد",
      "مناطق تخزين البريد في المطارات",
      "المناطق التي لا يصلها البريد",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail20",
    text: "ما هو نظام كشك الخدمات البريدية؟",
    options: [
      "كشك لبيع طوابع البريد فقط",
      "محطة خدمة ذاتية توفر خدمات بريدية متنوعة إلكترونياً على مدار الساعة",
      "كشك لاستلام الشكاوى",
      "مكتب بريد صغير في القرى النائية",
    ],
    correctAnswer: 1,
  },
  {
    id: "sp_mail21",
    text: "ما هي خدمة إي-بارسل (e-Parcel) التي يقدمها البريد المصري؟",
    options: [
      "خدمة البريد الإلكتروني",
      "خدمة التجارة الإلكترونية لنقل وتوصيل المنتجات المشتراة عبر الإنترنت",
      "خدمة فحص الطرود إلكترونياً",
      "خدمة إرسال الفاكس",
    ],
    correctAnswer: 1,
  },
];

export default specialization_mail;
