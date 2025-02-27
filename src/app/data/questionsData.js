// src/data/questionsData.js

const questionsBank = {
  mail: {
    behavioral: [
      {
        id: "beh1",
        text: "عند مواجهة موقف صعب في العمل، ما هو أول إجراء تتخذه؟",
        options: [
          "gfdsgfsdg مع المشرف المباشر",
          "محاولة حل المشكلة بشكل مستقل",
          "طلب المساعدة من الزملاء",
          "تجنب الموقف وتأجيله",
        ],
        correctAnswer: 0,
      },
      {
        id: "beh2",
        text: "كيف تتعامل مع العميل الغاضب؟",
        options: [
          "الاستماع بهدوء وتفهم مشكلته",
          "تحويله لمشرف آخر مباشرة",
          "الرد بنفس الأسلوب الغاضب",
          "تجاهل غضبه والتركيز على الحل فقط",
        ],
        correctAnswer: 0,
      },
      {
        id: "beh3",
        text: "في حالة تراكم العمل، كيف تنظم أولوياتك؟",
        options: [
          "ترتيب المهام حسب الأهمية والوقت",
          "العمل على المهام بشكل عشوائي",
          "تأجيل جميع المهام لليوم التالي",
          "طلب تمديد موعد التسليم دائماً",
        ],
        correctAnswer: 0,
      },
      {
        id: "beh4",
        text: "ما هو تصرفك عند اكتشاف خطأ في عملك؟",
        options: [
          "الإبلاغ عن الخطأ فوراً ومحاولة تصحيحه",
          "تجاهل الخطأ إذا كان بسيطاً",
          "إخفاء الخطأ خوفاً من العقاب",
          "إلقاء اللوم على الآخرين",
        ],
        correctAnswer: 0,
      },
      {
        id: "beh5",
        text: "كيف تتعامل مع fdg في العمل؟",
        options: [
          "تقبل النقد بإيجابية والعمل على التحسين",
          "الدفاع عن النفس وتبرير الأخطاء",
          "تجاهل النقد تماماً",
          "الرد بانتقادات مضادة",
        ],
        correctAnswer: 0,
      },
    ],
    language: {
      arabic: [
        {
          id: "ar1",
          text: "اختر الجملة الصحيحة نحوياً:",
          options: [
            "ذهب الطلابُ إلى المدرسةِ",
            "ذهب الطلابُ إلى المدرسةُ",
            "ذهب الطلابَ إلى المدرسةِ",
            "ذهب الطلابِ إلى المدرسةِ",
          ],
          correctAnswer: 0,
        },
        {
          id: "ar2",
          text: "ما هو جمع كلمة 'قلم'؟",
          options: ["أقلام", "قلمون", "قلمات", "قلوم"],
          correctAnswer: 0,
        },
        {
          id: "ar3",
          text: "ما هو إعراب كلمة 'الكتابَ' في جملة 'قرأتُ الكتابَ'؟",
          options: ["مفعول به منصوب", "فاعل مرفوع", "مبتدأ مرفوع", "خبر مرفوع"],
          correctAnswer: 0,
        },
        {
          id: "ar4",
          text: "ما نوع 'لا' في جملة 'لا تؤجل عمل اليوم إلى الغد'؟",
          options: ["ناهية", "نافية", "عاطفة", "زائدة"],
          correctAnswer: 0,
        },
        {
          id: "ar5",
          text: "اختر الجملة الصحيحة:",
          options: [
            "إن المعلمَ متميزٌ",
            "إن المعلمُ متميزٌ",
            "إن المعلمِ متميزٌ",
            "إن المعلمَ متميزٍ",
          ],
          correctAnswer: 0,
        },
      ],
      english: [
        {
          id: "en1",
          text: "Choose the correct sentence:",
          options: [
            "I have been working here since three years",
            "I have been working here for three years",
            "I am working here since three years",
            "I am working here for three years",
          ],
          correctAnswer: 1,
        },
        {
          id: "en2",
          text: "Select the correct form of the verb:",
          options: [
            "If I was rich, I will buy a house",
            "If I were rich, I would buy a house",
            "If I am rich, I would buy a house",
            "If I were rich, I will buy a house",
          ],
          correctAnswer: 1,
        },
        {
          id: "en3",
          text: "Choose the correct preposition:",
          options: [
            "He is afraid from dogs",
            "He is afraid at dogs",
            "He is afraid of dogs",
            "He is afraid by dogs",
          ],
          correctAnswer: 2,
        },
        {
          id: "en4",
          text: "Select the correct article:",
          options: [
            "I saw an university",
            "I saw a university",
            "I saw the university",
            "I saw university",
          ],
          correctAnswer: 1,
        },
        {
          id: "en5",
          text: "Choose the correct tense:",
          options: [
            "I am living here since 2010",
            "I have been living here since 2010",
            "I live here since 2010",
            "I was living here since 2010",
          ],
          correctAnswer: 1,
        },
      ],
    },
    knowledge: {
      iq: [
        {
          id: "iq1",
          text: "أكمل النمط: 2, 4, 8, 16, ...",
          options: ["24", "32", "30", "28"],
          correctAnswer: 1,
        },
        {
          id: "iq2",
          text: "إذا كان اليوم الثلاثاء، فما هو اليوم بعد 100 يوم؟",
          options: ["الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
          correctAnswer: 2,
        },
        {
          id: "iq3",
          text: "أي رقم يكمل المتسلسلة: 3, 6, 12, 24, ...",
          options: ["36", "48", "42", "30"],
          correctAnswer: 0,
        },
        {
          id: "iq4",
          text: "اختر الكلمة المختلفة:",
          options: ["تفاح", "برتقال", "خيار", "موز"],
          correctAnswer: 2,
        },
        {
          id: "iq5",
          text: "إذا كان A = 1, B = 2, C = 3، فما هو ناتج ABC؟",
          options: ["123", "321", "213", "132"],
          correctAnswer: 0,
        },
      ],
      general: [
        {
          id: "gen1",
          text: "ما هي عاصمة جمهورية مصر العربية؟",
          options: ["القاهرة", "الإسكندرية", "الجيزة", "الأقصر"],
          correctAnswer: 0,
        },
        {
          id: "gen2",
          text: "ما هو أطول نهر في العالم؟",
          options: ["النيل", "الأمازون", "المسيسيبي", "اليانجتسي"],
          correctAnswer: 0,
        },
        {
          id: "gen3",
          text: "في أي عام تم افتتاح قناة السويس؟",
          options: ["1869", "1859", "1879", "1889"],
          correctAnswer: 0,
        },
        {
          id: "gen4",
          text: "من هو مخترع المصباح الكهربائي؟",
          options: [
            "توماس إديسون",
            "ألبرت أينشتاين",
            "نيكولا تسلا",
            "جراهام بيل",
          ],
          correctAnswer: 0,
        },
        {
          id: "gen5",
          text: "كم عدد محافظات مصر؟",
          options: ["27", "28", "29", "26"],
          correctAnswer: 0,
        },
      ],
      it: [
        {
          id: "it1",
          text: "أي من التالي ليس متصفح إنترنت؟",
          options: ["Chrome", "Firefox", "Excel", "Safari"],
          correctAnswer: 2,
        },
        {
          id: "it2",
          text: "ما هو امتداد ملفات الوورد؟",
          options: [".docx", ".xlsx", ".pptx", ".pdf"],
          correctAnswer: 0,
        },
        {
          id: "it3",
          text: "ما هي وظيفة RAM في الكمبيوتر؟",
          options: [
            "الذاكرة العشوائية",
            "تخزين البيانات دائم",
            "معالجة الرسومات",
            "تشغيل النظام",
          ],
          correctAnswer: 0,
        },
        {
          id: "it4",
          text: "ما هو البرنامج المستخدم لمكافحة الفيروسات؟",
          options: ["Norton", "PowerPoint", "Calculator", "Notepad"],
          correctAnswer: 0,
        },
        {
          id: "it5",
          text: "ما هو مفتاح الاختصار للنسخ في Windows؟",
          options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"],
          correctAnswer: 0,
        },
      ],
    },
    specialization: [
      {
        id: "sp1",
        text: "ما هو البروتوكول المستخدم في نقل البريد الإلكتروني؟",
        options: ["HTTP", "SMTP", "FTP", "TCP"],
        correctAnswer: 1,
      },
      {
        id: "sp2",
        text: "ما هي أفضل طريقة لتنظيم الطوابع البريدية؟",
        options: ["حسب التاريخ", "حسب القيمة", "حسب اللون", "حسب الحجم"],
        correctAnswer: 0,
      },
      {
        id: "sp3",
        text: "ما هي وحدة قياس الوزن المستخدمة في البريد؟",
        options: ["الجرام", "الكيلوجرام", "الطن", "الأونصة"],
        correctAnswer: 0,
      },
      {
        id: "sp4",
        text: "كيف يتم تحديد تكلفة إرسال البريد الدولي؟",
        options: [
          "حسب الوزن والوجهة",
          "حسب الحجم فقط",
          "حسب المسافة فقط",
          "حسب نوع البريد فقط",
        ],
        correctAnswer: 0,
      },
      {
        id: "sp5",
        text: "ما هو نظام الترقيم البريدي في مصر؟",
        options: ["خمسة أرقام", "ستة أرقام", "أربعة أرقام", "سبعة أرقام"],
        correctAnswer: 0,
      },
    ],
  },
  education: {
    behavioral: [
      {
        id: "edu_beh1",
        text: "كيف تتعامل مع طالب يعاني من صعوبات في التعلم؟",
        options: [
          "تكييف طريقة التدريس حسب احتياجاته",
          "تجاهل الأمر",
          "إحالته مباشرة للإدارة",
          "الطلب منه الاجتهاد أكثر",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_beh2",
        text: "ما هو أفضل أسلوب للتعامل مع الطالب المشاغب؟",
        options: [
          "التحدث معه بشكل فردي لفهم سبب سلوكه",
          "معاقبته أمام زملائه",
          "تجاهل سلوكه تماماً",
          "إخراجه من الفصل مباشرة",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_beh3",
        text: "كيف تحفز الطلاب على المشاركة في الفصل؟",
        options: [
          "خلق بيئة تعليمية تفاعلية وممتعة",
          "إجبارهم على المشاركة",
          "تقديم مكافآت مادية دائماً",
          "التهديد بخصم درجات",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_beh4",
        text: "ما هو تصرفك عند اكتشاف حالة غش في الامتحان؟",
        options: [
          "اتباع إجراءات المدرسة وتوثيق الحالة",
          "تجاهل الموقف",
          "معاقبة الطالب فوراً",
          "إخبار جميع المدرسين",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_beh5",
        text: "كيف تتعامل مع شكوى من ولي أمر؟",
        options: [
          "الاستماع بعناية وحل المشكلة بمهنية",
          "تحويل الشكوى للإدارة مباشرة",
          "تجاهل الشكوى",
          "الدفاع عن نفسك بحدة",
        ],
        correctAnswer: 0,
      },
    ],
    language: {
      arabic: [
        {
          id: "edu_ar1",
          text: "ما هي أفضل طريقة لتدريس قواعد النحو؟",
          options: [
            "الربط بين القواعد والتطبيق العملي",
            "الحفظ والتلقين",
            "قراءة القواعد من الكتاب",
            "تجاهل القواعد تماماً",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_ar2",
          text: "كيف تنمي مهارات القراءة لدى الطلاب؟",
          options: [
            "تشجيع القراءة المتنوعة والمناقشة",
            "التركيز على الحفظ فقط",
            "قراءة الكتب المدرسية فقط",
            "تجنب القراءة الجهرية",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_ar3",
          text: "ما هي أفضل طريقة لتصحيح الأخطاء اللغوية للطلاب؟",
          options: [
            "التصحيح البناء مع الشرح",
            "تجاهل الأخطاء",
            "التوبيخ المباشر",
            "الإشارة للخطأ دون شرح",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_ar4",
          text: "كيف تشجع الطلاب على الكتابة الإبداعية؟",
          options: [
            "توفير مواضيع متنوعة وحرية التعبير",
            "فرض مواضيع محددة",
            "التركيز على الإملاء فقط",
            "تجنب الكتابة الإبداعية",
          ],
          correctAnswer: 0,
        },
      ],
      english: [
        {
          id: "edu_en1",
          text: "What is the best method to teach vocabulary?",
          options: [
            "Using context and real-life examples",
            "Memorization only",
            "Translation only",
            "Skipping vocabulary lessons",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_en2",
          text: "How do you encourage speaking in class?",
          options: [
            "Creating interactive activities",
            "Forcing students to speak",
            "Using written exercises only",
            "Avoiding speaking activities",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_en3",
          text: "What's the best approach to teaching grammar?",
          options: [
            "Combining rules with practical use",
            "Teaching rules only",
            "Avoiding grammar completely",
            "Using translation only",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_en4",
          text: "How do you handle different levels in one class?",
          options: [
            "Differentiated instruction and activities",
            "Teaching to the highest level",
            "Teaching to the lowest level",
            "Ignoring level differences",
          ],
          correctAnswer: 0,
        },
      ],
    },
    knowledge: {
      iq: [
        {
          id: "edu_iq1",
          text: "أكمل المتسلسلة: ١، ٣، ٦، ١٠، ١٥، ...",
          options: ["21", "20", "22", "19"],
          correctAnswer: 0,
        },
        {
          id: "edu_iq2",
          text: "إذا كان عمر أحمد ضعف عمر محمد، وعمر محمد ١٥ سنة، فكم عمر أحمد؟",
          options: ["30", "25", "35", "20"],
          correctAnswer: 0,
        },
        {
          id: "edu_iq3",
          text: "أي رقم يكمل المتسلسلة: ٢، ٤، ٨، ١٦، ...؟",
          options: ["32", "24", "28", "30"],
          correctAnswer: 0,
        },
        {
          id: "edu_iq4",
          text: "ما هو الرقم المختلف: ٢، ٤، ٨، ١٤، ١٦، ٣٢؟",
          options: ["14", "16", "8", "4"],
          correctAnswer: 0,
        },
      ],
      general: [
        {
          id: "edu_gen1",
          text: "ما هو علم التربية؟",
          options: [
            "دراسة نظريات وأساليب التعليم",
            "دراسة علم النفس فقط",
            "دراسة المناهج فقط",
            "دراسة الإدارة المدرسية",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_gen2",
          text: "ما هي نظرية بياجيه؟",
          options: [
            "نظرية النمو المعرفي",
            "نظرية السلوك",
            "نظرية التعلم",
            "نظرية الذكاء",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_gen3",
          text: "ما هو التعلم النشط؟",
          options: [
            "مشاركة الطلاب في عملية التعلم",
            "التعلم من الكتب فقط",
            "التعلم عن بعد",
            "التعلم التقليدي",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_gen4",
          text: "ما هو التقويم التكويني؟",
          options: [
            "تقييم مستمر أثناء التعلم",
            "تقييم نهاية العام",
            "تقييم شهري",
            "تقييم يومي",
          ],
          correctAnswer: 0,
        },
      ],
      it: [
        {
          id: "edu_it1",
          text: "ما هو التعليم الإلكتروني؟",
          options: [
            "استخدام التكنولوجيا في التعليم",
            "استخدام الحاسوب فقط",
            "استخدام الإنترنت فقط",
            "استخدام الهواتف فقط",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_it2",
          text: "ما هي منصة Moodle؟",
          options: [
            "نظام إدارة التعلم",
            "برنامج عرض تقديمي",
            "برنامج محادثة",
            "برنامج تصميم",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_it3",
          text: "ما هو Google Classroom؟",
          options: [
            "منصة تعليمية إلكترونية",
            "برنامج محادثة",
            "موقع بحث",
            "برنامج تحرير",
          ],
          correctAnswer: 0,
        },
        {
          id: "edu_it4",
          text: "ما هي أهمية السبورة الذكية في التعليم؟",
          options: [
            "تفاعل أفضل مع المحتوى",
            "عرض المحتوى فقط",
            "كتابة الملاحظات فقط",
            "توفير الوقت فقط",
          ],
          correctAnswer: 0,
        },
      ],
    },
    pedagogical: [
      {
        id: "edu_ped1",
        text: "ما هي أفضل طريقة لتقييم فهم الطلاب؟",
        options: [
          "التقييم المستمر والمتنوع",
          "الاختبارات فقط",
          "الواجبات المنزلية فقط",
          "المشاركة الصفية فقط",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_ped2",
        text: "كيف تخطط للدرس بشكل فعال؟",
        options: [
          "تحديد الأهداف والأنشطة والتقييم",
          "اتباع الكتاب فقط",
          "التخطيط اليومي فقط",
          "عدم التخطيط",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_ped3",
        text: "ما هي أفضل طريقة لإدارة الفصل؟",
        options: [
          "وضع قواعد واضحة وتطبيقها بعدل",
          "الصرامة الشديدة",
          "المرونة الزائدة",
          "عدم وجود قواعد",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_ped4",
        text: "كيف تتعامل مع الفروق الفردية؟",
        options: [
          "تنويع أساليب التدريس والتقييم",
          "تجاهل الفروق",
          "التركيز على المتفوقين",
          "التركيز على الضعاف",
        ],
        correctAnswer: 0,
      },
    ],
    specialization: [
      {
        id: "edu_sp1",
        text: "ما هي مهارات المعلم الأساسية؟",
        options: [
          "التخطيط والتنفيذ والتقييم",
          "الشرح فقط",
          "حفظ المحتوى",
          "إدارة الوقت فقط",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_sp2",
        text: "ما هي أهمية التطوير المهني للمعلم؟",
        options: [
          "تحسين المهارات ومواكبة التطور",
          "الحصول على شهادات",
          "زيادة الراتب",
          "الترقية فقط",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_sp3",
        text: "كيف تطور من أدائك كمعلم؟",
        options: [
          "التعلم المستمر والتقييم الذاتي",
          "انتظار التوجيه",
          "تقليد الزملاء",
          "الاعتماد على الخبرة فقط",
        ],
        correctAnswer: 0,
      },
      {
        id: "edu_sp4",
        text: "ما هو دور المعلم في تطوير المنهج؟",
        options: [
          "المشاركة في التطوير والتقييم",
          "تنفيذ المنهج فقط",
          "انتقاد المنهج",
          "تجاهل المنهج",
        ],
        correctAnswer: 0,
      },
    ],
  },
};

export default questionsBank;
