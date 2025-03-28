// الكفايات السلوكيه والنفسيه
const behavioral = [
  // Original question
  {
    id: "beh1",
    text: "عند مواجهة موقف صعب في العمل، ما هو أول إجراء تتخذه؟",
    options: [
      "التواصل مع المشرف المباشر",
      "محاولة حل المشكلة بشكل مستقل",
      "طلب المساعدة من الزملاء",
      "تجنب الموقف وتأجيله",
    ],
    correctAnswer: 1,
    points: [1, 3, 2, 0], // Points for each option
  },

  // Personal traits questions
  {
    id: "beh2",
    text: "أحب تولي المسئولية وتوزيع مهام العمل علي الغير",
    options: ["أوافق بشدة", "أوافق", "محايد", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh3",
    text: "أحب أن أكون محاطا بالناس",
    options: ["أوافق بشدة", "أوافق", "محايد", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 1,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh4",
    text: "من المثير للاهتمام أن يكون المرء كاتبا",
    options: ["أوافق بشدة", "أوافق", "محايد", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 1,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh5",
    text: "من السهل إقناع الناس بوجهة نظري",
    options: ["أوافق بشدة", "أوافق", "محايد", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 1,
    points: [5, 4, 3, 2, 1], // Points for each option
  },

  // Social interaction questions
  {
    id: "beh6",
    text: "أنا عادة أكون أكثر نشاطا عندما:",
    options: ["أكون مع الآخرين", "أفكر مع نفسي"],
    correctAnswer: 0,
    points: [2, 1], // Points for each option
  },
  {
    id: "beh7",
    text: "حينما تقودني الصدفة إلى لقاءات اجتماعية، فإن نشاطي وحيويتي تزداد:",
    options: [
      "في نهاية اللقاءات، وقد أكون آخر شخص يغادر",
      "في بداية اللقاء ثم أشعر بالضجر والملل سريعا وأرغب بشدة للعودة إلى المنزل",
    ],
    correctAnswer: 0,
    points: [2, 1], // Points for each option
  },
  {
    id: "beh8",
    text: "أي الاختيارين الآتيين، ترتاح معه أكثر:",
    options: [
      "الذهاب مع الأصدقاء إلى مكان به الكثير من الأشخاص في وجود فرصة للتفاعل معهم مثل الأندية أو الحفلات",
      "الجلوس في البيت مع الأصدقاء والقيام بعمل شيء خاص لوحدنا مثل مشاهدة فيديو أو التلفاز أو تناول وجبة عشاء معًا",
    ],
    correctAnswer: 0,
    points: [2, 1], // Points for each option
  },
  {
    id: "beh9",
    text: "عندما أكون مع أصدقائي فإنني:",
    options: [
      "أتكلم كثيرًا",
      "أكون منصتا ومتحفظا حتى أشعر بالراحة معهم، وعندها قد أبدأ بالحديث معهم",
    ],
    correctAnswer: 0,
    points: [2, 1], // Points for each option
  },
  {
    id: "beh10",
    text: "الطريقة التي تعرفت بها على غالبية أصدقائي:",
    options: [
      "في الخارج عندما كنت أقوم بإنجاز بعض الأعمال، مثل الحفلات أو الأندية أو العمل والنشاطات الترويحية وغيرها",
      "من خلال أصدقاء مشتركين",
    ],
    correctAnswer: 0,
    points: [2, 1], // Points for each option
  },
  {
    id: "beh11",
    text: "عادة ما يشاع عني أنني:",
    options: [
      "كثير الكلام وقليلاً ما أجلس صامتًا",
      "قليل الكلام وأميل للاستماع أكثر",
    ],
    correctAnswer: 1,
    points: [1, 2], // Points for each option
  },

  // Interaction and activity questions
  {
    id: "beh12",
    text: "أشعر بالحماس عند بدء يومي الدراسي/العملي",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh13",
    text: "أستمتع بالتفاعل مع زملائي وأشعر بالطاقة الإيجابية",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh14",
    text: "أبدأ يومي بالتخطيط لما سأقوم به من مهام",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh15",
    text: "أجد متعة في حضور الاجتماعات والمناقشات الجماعية",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 1,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh16",
    text: "أشارك في الأنشطة الإضافية بحماس ودون تردد",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 1,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh17",
    text: "أشعر بالإلهام عند رؤية الآخرين ينجحون",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh18",
    text: "أتحمس لتعلم مهارات جديدة في بيئة العمل أو الدراسة",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh19",
    text: "أقدم المساعدة لزملائي عندما يحتاجون إليها",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh20",
    text: "أشعر بالرضا عند تحقيق أهدافي اليومية",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh21",
    text: "أعتبر التحديات فرصة للنمو الشخصي",
    options: ["أوافق بشدة", "أوافق", "لا أوافق", "لا أوافق بشدة"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },

  // Responsibility and handling results questions
  {
    id: "beh22",
    text: "أتحمل مسؤولية أخطائي وأتعلم منها",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh23",
    text: "أحرص على الوفاء بوعودي والتزاماتي",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh24",
    text: "أتحمل نتائج قراراتي دون إلقاء اللوم على الآخرين",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 3,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh25",
    text: "أتصرف بمسؤولية حتى في غياب المشرفين",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh26",
    text: "ألتزم بالمواعيد النهائية لإنجاز المهام",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 3,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh27",
    text: "أتعامل مع الموارد المتاحة بحكمة دون إهدار",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh28",
    text: "أواجه المشكلات بروح إيجابية بدلاً من التهرب منها",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 3,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh29",
    text: "ألتزم بالقواعد والتعليمات دون الحاجة إلى تذكير",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 3,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh30",
    text: "أحافظ على ممتلكات المؤسسة وأتعامل معها بعناية",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh31",
    text: "أتحمل مسؤولية تطوير نفسي مهنيًا وشخصيًا",
    options: ["نعم", "احيانا", "نادراً", "غالباً"],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },

  // Feeling happiness and satisfaction questions
  {
    id: "beh32",
    text: "أشعر بالإنجاز عند الانتهاء من المهام المطلوبة مني",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh33",
    text: "أجد متعة في إنجاز عملي حتى لو كان صعبًا",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh34",
    text: "أبحث عن الإيجابيات في كل موقف أواجهه",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh35",
    text: "أحتفل بنجاحي وأكافئ نفسي على تحقيق الأهداف",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 1,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh36",
    text: "أشعر بالسعادة عندما أساعد الآخرين",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh37",
    text: "أتحلى بروح الدعابة وأحاول نشر الإيجابية بين زملائي",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh38",
    text: "أقدر الجهود التي يبذلها الآخرون من حولي",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh39",
    text: "أمارس الامتنان وأحاول التركيز على ما أملكه بدلاً من ما ينقصني",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh40",
    text: "أتعامل مع الضغط بطريقة إيجابية ولا أدع القلق يسيطر علي",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh41",
    text: "أبحث عن طرق لجعل عملي أكثر متعة وإبداعًا",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },

  // Time management and planning questions
  {
    id: "beh42",
    text: "أخصص وقتًا محددًا لكل مهمة أقوم بها",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh43",
    text: "أستخدم أدوات تنظيم الوقت مثل الجداول والتطبيقات الرقمية",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 1,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh44",
    text: "أضع قائمة مهام يومية وألتزم بتنفيذها",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh45",
    text: "أتعامل مع المشتتات وأحاول التركيز على الأولويات",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh46",
    text: "أحرص على إنجاز المهام الصعبة أولاً قبل السهلة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh47",
    text: "أراجع خططي بانتظام وأعدلها حسب الحاجة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh48",
    text: "أوازن بين العمل والراحة لأحقق إنتاجية أفضل",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh49",
    text: "أستخدم تقنيات إدارة الوقت مثل تقنية بومودورو",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 1,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh50",
    text: "أحاول تجنب التأجيل والمماطلة في إنجاز الأعمال",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh51",
    text: "أحدد الأهداف بعيدة المدى وأضع خطة لتحقيقها",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },

  // Leadership and decision-making questions
  {
    id: "beh52",
    text: "أتحمل مسؤولية توجيه الآخرين عند الحاجة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh53",
    text: "أستطيع اتخاذ قرارات بسرعة بناءً على المعطيات المتاحة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh54",
    text: "أستمع لآراء الآخرين قبل اتخاذ قراراتي",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh55",
    text: "أتحلى بالحزم والمرونة في الوقت نفسه عند القيادة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh56",
    text: "أشجع زملائي على تقديم أفكارهم ومشاركتها",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh57",
    text: "أتعلم من القادة الناجحين وأحاول تطبيق أساليبهم",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh58",
    text: "أتحمل مسؤولية قراراتي حتى لو كانت خاطئة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh59",
    text: "أعمل على تطوير مهاراتي القيادية باستمرار",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh60",
    text: "أتعامل مع النزاعات بحكمة وأحاول حلها بطرق ودية",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh61",
    text: "أضع مصلحة الفريق فوق المصالح الشخصية عند اتخاذ القرارات",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },

  // Teamwork and collaboration questions
  {
    id: "beh62",
    text: "أستمتع بالعمل مع الفريق وأشعر بالراحة بينهم",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh63",
    text: "أحرص على تحقيق الانسجام بين أفراد الفريق",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh64",
    text: "أستمع لآراء زملائي وأحترم وجهات نظرهم",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh65",
    text: "أساهم في إنجاح العمل الجماعي دون انتظار المكافآت",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh66",
    text: "أتواصل مع زملائي بوضوح عند تنفيذ المهام المشتركة",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh67",
    text: "أتحلى بالمرونة عند التعامل مع أنماط الشخصيات المختلفة",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh68",
    text: "أقدم المساعدة لزملائي عندما يحتاجونها دون تردد",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh69",
    text: "أقبل النقد البناء وأحاول الاستفادة منه في تطوير أدائي",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh70",
    text: "أحرص على تعزيز روح الفريق وتحفيز زملائي",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh71",
    text: "أبحث عن الحلول بدلاً من التركيز على المشكلات أثناء العمل الجماعي",
    options: ["موافق بشدة", "موافق", "محايد", "غير موافق", "غير موافق بشدة"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1], // Points for each option
  },

  // Handling pressure and stress management
  {
    id: "beh72",
    text: "أتعامل مع المواقف الصعبة دون فقدان أعصابي",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh73",
    text: "أستخدم تقنيات الاسترخاء عند الشعور بالضغط",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 1,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh74",
    text: "أبحث عن طرق لتحويل التوتر إلى دافع للإنتاجية",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh75",
    text: "أوازن بين العمل والحياة الشخصية لتقليل الضغط",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh76",
    text: "أطلب المساعدة عند مواجهة ضغوط كبيرة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 1,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh77",
    text: "أضع حدودًا واضحة لوقت العمل ووقت الراحة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh78",
    text: "أتعامل مع الأزمات بحكمة وهدوء",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh79",
    text: "أبحث عن أنشطة تساعدني في تخفيف التوتر مثل الرياضة أو التأمل",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh80",
    text: "أركز على الحلول بدلاً من القلق بشأن المشكلات",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh81",
    text: "أحتفظ بإيجابيتي حتى في الأوقات الصعبة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "لا"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },

  // Self-development and continuous learning
  {
    id: "beh82",
    text: "أحرص على اكتساب مهارات جديدة باستمرار",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh83",
    text: "أبحث عن دورات تدريبية تناسب تطلعاتي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh84",
    text: "أطلب التغذية الراجعة من الآخرين لتحسين أدائي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh85",
    text: "أخصص وقتًا للقراءة والتعلم الذاتي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh86",
    text: "أسعى لاكتشاف نقاط قوتي وتطويرها",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh87",
    text: "أضع أهدافًا شخصية ومهنية واضحة لذاتي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh88",
    text: "أتعلم من أخطائي وأسعى لعدم تكرارها",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh89",
    text: "أحرص على متابعة المستجدات في مجالي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh90",
    text: "أجرب طرقًا مختلفة لتحسين أدائي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh91",
    text: "أبحث عن مرشدين يساعدونني في النمو والتطور",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 1,
    points: [4, 3, 2, 1], // Points for each option
  },

  // Values and ethics
  {
    id: "beh92",
    text: "أتصرف بنزاهة حتى عندما لا يكون هناك رقابة",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh93",
    text: "أحرص على قول الحقيقة دائمًا",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh94",
    text: "ألتزم بالقوانين والأنظمة في أي مؤسسة أعمل بها",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh95",
    text: "أتعامل مع الجميع بعدالة وإنصاف",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh96",
    text: "أرفض الغش والتلاعب في أي موقف",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh97",
    text: "أتصرف بأمانة في التعامل مع المال والممتلكات العامة",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh98",
    text: "أحترم خصوصية الآخرين ولا أتدخل في شؤونهم الشخصية",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh99",
    text: "أتحمل مسؤولية أفعالي وأعترف بأخطائي",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh100",
    text: "أتمسك بمبادئي حتى لو كان من الأسهل التنازل عنها",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh101",
    text: "أحرص على التصرف بطريقة تلهم الآخرين بالأخلاق الحميدة",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },

  // Productivity and discipline
  {
    id: "beh102",
    text: "أبدأ يومي بوضع خطة واضحة لأعمالي",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh103",
    text: "أحرص على إنهاء المهام قبل الموعد المحدد",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 3,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh104",
    text: "ألتزم بالمواعيد ولا أتأخر في تسليم الأعمال",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh105",
    text: "أضع أهدافًا واقعية يمكن تحقيقها",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh106",
    text: "أتابع تقدمي بشكل دوري وأعدل خططي عند الحاجة",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh107",
    text: "أتجنب إضاعة الوقت في أنشطة غير مفيدة",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 3,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh108",
    text: "أستخدم أدوات تساعدني على تحسين الإنتاجية",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 1,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh109",
    text: "أعمل بتركيز عالٍ حتى في بيئات مزدحمة",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 3,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh110",
    text: "أتجنب التسويف وأفضل الإنجاز الفوري",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 3,
    points: [5, 4, 2, 1, 0], // Points for each option
  },
  {
    id: "beh111",
    text: "أبحث دائمًا عن طرق لتحسين كفاءتي",
    options: ["دائماً", "أحياناً", "نادراً", "مطلقاً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [5, 4, 2, 1, 0], // Points for each option
  },

  // Problem solving and decision making
  {
    id: "beh112",
    text: "أواجه التحديات بثقة وأبحث عن حلول مبتكرة",
    options: ["اواجه", "اتعامل بثقة", "اجد صعوبة", "اشعر بالتوتر"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh113",
    text: "أتعامل مع المشكلات بهدوء دون توتر",
    options: ["اواجه", "اتعامل بثقة", "اجد صعوبة", "اشعر بالتوتر"],
    correctAnswer: 1,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh114",
    text: "أبحث عن الأسباب الجذرية للمشكلة قبل محاولة حلها",
    options: ["دائماً", "أحاول", "نادراً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh115",
    text: "أستخدم التحليل المنطقي في اتخاذ قراراتي",
    options: ["دائماً", "أحاول", "نادراً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh116",
    text: "أستشير زملائي والمشرفين عند مواجهة مشكلة معقدة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 1,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh117",
    text: "أحرص على التعلم من المشكلات السابقة لتجنب تكرارها",
    options: ["دائماً", "أحاول", "نادراً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh118",
    text: "أبحث عن أكثر من حل قبل اختيار الحل النهائي",
    options: ["دائماً", "أحاول", "نادراً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh119",
    text: "أتحمل مسؤولية تنفيذ الحلول التي أقترحها",
    options: ["دائماً", "أحاول", "نادراً", "لا اري اهمية"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh120",
    text: "أتعامل مع المواقف الطارئة دون ارتباك",
    options: ["دائماً", "أحاول", "نادراً", "لا اري اهمية"],
    correctAnswer: 1,
    points: [4, 3, 2, 1], // Points for each option
  },

  // Creative thinking and innovation
  {
    id: "beh121",
    text: "أبحث عن طرق جديدة لإنجاز المهام بطريقة أفضل",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh122",
    text: "أستمتع بالتفكير خارج الصندوق لإيجاد حلول مبتكرة",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh123",
    text: "أرحب بالأفكار الجديدة حتى لو كانت غير مألوفة",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh124",
    text: "أشارك في الأنشطة التي تعزز الإبداع مثل العصف الذهني",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh125",
    text: "أبحث عن مصادر إلهام لتطوير أفكاري وأعمالي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh126",
    text: "أجرب أساليب عمل مختلفة لتحديد الأكثر كفاءة",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh127",
    text: "أتعامل مع الفشل كفرصة للتعلم والتجربة",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh128",
    text: "أطرح أسئلة تساعد على التفكير العميق والإبداعي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh129",
    text: "أبحث عن وجهات نظر جديدة عند تحليل المشكلات",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh130",
    text: "أبتكر حلولًا عملية عند مواجهة التحديات في عملي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },

  // Emotional intelligence and communication
  {
    id: "beh131",
    text: "أتعامل مع الآخرين بلطف واحترام دائمًا",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh132",
    text: "أحرص على فهم مشاعر الآخرين والتفاعل معها بوعي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh133",
    text: "أسيطر على مشاعري في المواقف الصعبة",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh134",
    text: "أستطيع التعبير عن أفكاري بوضوح وثقة",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh135",
    text: "أستمع للآخرين دون مقاطعتهم",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh136",
    text: "أستخدم لغة الجسد الإيجابية عند التحدث مع الآخرين",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh137",
    text: "أحرص على تقديم ردود فعل بناءة بدلاً من النقد الجارح",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh138",
    text: "أتعاطف مع زملائي عند مرورهم بمواقف صعبة",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh139",
    text: "أتعامل مع النزاعات بذكاء عاطفي وأحاول تهدئة الأجواء",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },
  {
    id: "beh140",
    text: "أحرص على بناء علاقات إيجابية مع من حولي",
    options: ["دائماً", "أحياناً", "نادراً", "لا اهتم"],
    correctAnswer: 0,
    points: [4, 3, 2, 1], // Points for each option
  },

  // Additional teamwork and collaboration
  {
    id: "beh141",
    text: "أشارك الأفكار والمعلومات بحرية مع فريقي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh142",
    text: "أؤمن بأن النجاح الجماعي أهم من الإنجاز الفردي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh143",
    text: "أساهم في حل الخلافات بين أعضاء الفريق",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh144",
    text: "أقدر مساهمات الجميع في إنجاح العمل",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh145",
    text: "أعمل بانسجام مع مختلف الشخصيات والأنماط",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh146",
    text: "أتقبل اختلاف وجهات النظر وأحترم آراء الآخرين حتى لو لم أتفق معها",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh147",
    text: "أتحمل مسؤولية أخطائي وأعمل على تصحيحها دون تبرير",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh148",
    text: "أعمل بفعالية ضمن فريق وأسهم في تحقيق الأهداف",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },

  // Innovation and entrepreneurship
  {
    id: "beh149",
    text: "أبحث عن أفكار جديدة لإضافة قيمة لما أقوم به",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh150",
    text: "أستمتع بابتكار طرق جديدة لحل المشكلات",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh151",
    text: "أؤمن بأن الإبداع يمكن أن يكون في أي مجال",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh152",
    text: "أتعامل مع المخاطر بحكمة عند تنفيذ الأفكار الجديدة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh153",
    text: "أبحث عن فرص لتطوير أفكار إبداعية وتحويلها لمشاريع",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh154",
    text: "أؤمن بأن الفشل هو جزء من الابتكار والتجربة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh155",
    text: "أتعلم من الأخطاء وأستخدمها لتحسين أفكاري",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh156",
    text: "أبحث عن فرص لتطبيق حلول جديدة في عملي",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh157",
    text: "أستفيد من تجارب الآخرين في تطوير مشاريعي",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh158",
    text: "أؤمن بأن الابتكار يحتاج إلى مثابرة وتجربة مستمرة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 0,
    points: [5, 3, 1, 4, 0], // Points for each option
  },

  // More self-assessment style questions
  {
    id: "beh159",
    text: "أراجع أولوياتي بانتظام وأعدلها حسب الحاجة",
    options: ["دائماً", "احيانا", "نادراً", "غالباً", "مطلقاً"],
    correctAnswer: 3,
    points: [5, 3, 1, 4, 0], // Points for each option
  },
  {
    id: "beh160",
    text: "أتعامل مع النزاعات بطريقة هادئة وعقلانية",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },

  // Additional questions from the PDF documents
  {
    id: "beh161",
    text: "أحرص على أن أكون قدوة حسنة لمن حولي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh162",
    text: "أتحمل مسؤولية توجيه الفرق عندما يكون ذلك ضرورياً",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh163",
    text: "أساعد الآخرين في تطوير مهاراتهم وتحقيق أهدافهم",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh164",
    text: "أشجع زملائي على التعاون والعمل الجماعي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh165",
    text: "أبحث عن فرص للتأثير الإيجابي في مجتمعي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh166",
    text: "أتصرف بنزاهة وشفافية في جميع تعاملاتي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh167",
    text: "أساهم في خلق بيئة عمل إيجابية وداعمة",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh168",
    text: "أتحمل مسؤولية نجاح الفريق وليس نجاحي الفردي فقط",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh169",
    text: "أبحث عن طرق لمساعدة زملائي عند الحاجة",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh170",
    text: "أعمل على نشر ثقافة الاحترام والقبول بين الجميع",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },

  // Questions about social intelligence and effective communication
  {
    id: "beh171",
    text: "أستطيع بناء علاقات قوية مع الآخرين بسهولة",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh172",
    text: "أستخدم لغة واضحة ومفهومة عند التواصل",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh173",
    text: "أحرص على فهم مشاعر الآخرين والتفاعل معها بإيجابية",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh174",
    text: "أتعامل مع النزاعات بطريقة هادئة وعقلانية",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh175",
    text: "أطرح الأسئلة المناسبة لفهم وجهات نظر الآخرين",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh176",
    text: "أستمع بإنصات قبل الرد في النقاشات",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh177",
    text: "أحرص على اختيار كلماتي بعناية عند التحدث",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh178",
    text: "أستخدم نبرة صوت ولغة جسد مناسبة عند التواصل",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh179",
    text: "أبحث عن فرص لتحسين مهاراتي في التواصل الفعّال",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh180",
    text: "أتعامل مع النقد بتقبل وأستخدمه كفرصة للنمو",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },

  // Questions about teamwork and cooperation
  {
    id: "beh181",
    text: "أستمتع بالعمل ضمن فريق لتحقيق الأهداف المشتركة",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh182",
    text: "أحرص على الاستماع لآراء جميع أعضاء الفريق",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh183",
    text: "أبحث عن طرق لدعم زملائي وتحفيزهم",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh184",
    text: "أعمل على تعزيز الروح الإيجابية داخل الفريق",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh185",
    text: "أتعامل مع الاختلافات بروح متفتحة ومنصفة",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh186",
    text: "أشارك الأفكار والمعلومات بحرية مع فريقي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh187",
    text: "أؤمن بأن النجاح الجماعي أهم من الإنجاز الفردي",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh188",
    text: "أساهم في حل الخلافات بين أعضاء الفريق",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh189",
    text: "أقدر مساهمات الجميع في إنجاح العمل",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },
  {
    id: "beh190",
    text: "أعمل بانسجام مع مختلف الشخصيات والأنماط",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 2, 1, 3], // Points for each option
  },

  {
    id: "beh191",
    text: "أستمتع بالعمل ضمن فريق لتحقيق الأهداف المشتركة",
    options: [
      "هذا يتحدث عني بشدة",
      "احياناً ما يتحدث عني",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
    ],
    correctAnswer: 0,
    points: [4, 3, 2, 1],
  },
  {
    id: "beh192",
    text: "أحرص على الاستماع لآراء جميع أعضاء الفريق",
    options: [
      "نادراً ما يتحدث عني",
      "هذا يتحدث عني بشدة",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 1,
    points: [2, 4, 1, 3],
  },
  {
    id: "beh193",
    text: "أبحث عن طرق لدعم زملائي وتحفيزهم",
    options: [
      "احياناً ما يتحدث عني",
      "نادراً ما يتحدث عني",
      "هذا يتحدث عني بشدة",
      "لا يتحدث عني مطلقاً",
    ],
    correctAnswer: 2,
    points: [3, 2, 4, 1],
  },
  {
    id: "beh194",
    text: "أعمل على تعزيز الروح الإيجابية داخل الفريق",
    options: [
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
      "هذا يتحدث عني بشدة",
    ],
    correctAnswer: 3,
    points: [2, 1, 3, 4],
  },
  {
    id: "beh195",
    text: "أتعامل مع الاختلافات بروح متفتحة ومنصفة",
    options: [
      "لا يتحدث عني مطلقاً",
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 1,
    points: [1, 4, 2, 3],
  },

  // Additional questions about creativity in problem solving
  {
    id: "beh196",
    text: "أبحث عن طرق جديدة ومبتكرة لحل المشكلات",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "احياناً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
    ],
    correctAnswer: 0,
    points: [4, 2, 3, 1],
  },
  {
    id: "beh197",
    text: "أحرص على التفكير النقدي قبل اتخاذ أي قرار",
    options: [
      "احياناً ما يتحدث عني",
      "نادراً ما يتحدث عني",
      "هذا يتحدث عني بشدة",
      "لا يتحدث عني مطلقاً",
    ],
    correctAnswer: 2,
    points: [3, 2, 4, 1],
  },
  {
    id: "beh198",
    text: "أتعامل مع المواقف غير المتوقعة بعقلية منفتحة",
    options: [
      "نادراً ما يتحدث عني",
      "احياناً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "هذا يتحدث عني بشدة",
    ],
    correctAnswer: 3,
    points: [2, 3, 1, 4],
  },
  {
    id: "beh199",
    text: "أبحث عن مصادر جديدة للأفكار والإلهام",
    options: [
      "نادراً ما يتحدث عني",
      "هذا يتحدث عني بشدة",
      "احياناً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
    ],
    correctAnswer: 1,
    points: [2, 4, 3, 1],
  },
  {
    id: "beh200",
    text: "أستخدم التفكير التحليلي عند تقييم الخيارات المتاحة",
    options: [
      "احياناً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
    ],
    correctAnswer: 2,
    points: [3, 1, 4, 2],
  },

  // Questions about integrity and commitment to responsibilities
  {
    id: "beh201",
    text: "أحرص على التصرف بأمانة في جميع المواقف",
    options: [
      "نادراً ما يتحدث عني",
      "احياناً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
      "هذا يتحدث عني بشدة",
    ],
    correctAnswer: 3,
    points: [2, 3, 1, 4],
  },
  {
    id: "beh202",
    text: "أتحمل مسؤولية قراراتي وأفعال نفسي",
    options: [
      "هذا يتحدث عني بشدة",
      "لا يتحدث عني مطلقاً",
      "احياناً ما يتحدث عني",
      "نادراً ما يتحدث عني",
    ],
    correctAnswer: 0,
    points: [4, 1, 3, 2],
  },
  {
    id: "beh203",
    text: "ألتزم بالقواعد حتى لو لم يكن هناك رقابة مباشرة",
    options: [
      "احياناً ما يتحدث عني",
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
    ],
    correctAnswer: 1,
    points: [3, 4, 2, 1],
  },
  {
    id: "beh204",
    text: "أحرص على معاملة الجميع بعدل واحترام",
    options: [
      "هذا يتحدث عني بشدة",
      "نادراً ما يتحدث عني",
      "احياناً ما يتحدث عني",
      "لا يتحدث عني مطلقاً",
    ],
    correctAnswer: 0,
    points: [4, 2, 3, 1],
  },
  {
    id: "beh205",
    text: "أتصرف بأخلاق عالية في المواقف الصعبة",
    options: [
      "لا يتحدث عني مطلقاً",
      "نادراً ما يتحدث عني",
      "هذا يتحدث عني بشدة",
      "احياناً ما يتحدث عني",
    ],
    correctAnswer: 2,
    points: [1, 2, 4, 3],
  },

  // Questions about ambition and goal achievement
  {
    id: "beh206",
    text: "أضع لنفسي أهدافاً واضحة وأسعى لتحقيقها",
    options: ["غالباً", "دائماً", "نادراً", "احيانا", "مُطلقاً"],
    correctAnswer: 1,
    points: [4, 5, 2, 3, 1],
  },
  {
    id: "beh207",
    text: "أبحث دائماً عن فرص للتطوير والتعلم",
    options: ["دائماً", "غالباً", "احيانا", "نادراً", "مُطلقاً"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1],
  },
  {
    id: "beh208",
    text: "أحرص على تحقيق أهدافي حتى عند مواجهة الصعوبات",
    options: ["احيانا", "نادراً", "دائماً", "غالباً", "مُطلقاً"],
    correctAnswer: 2,
    points: [3, 2, 5, 4, 1],
  },
  {
    id: "beh209",
    text: "أتحلى بالصبر عند السعي نحو تحقيق أهدافي",
    options: ["نادراً", "مُطلقاً", "غالباً", "احيانا", "دائماً"],
    correctAnswer: 4,
    points: [2, 1, 4, 3, 5],
  },
  {
    id: "beh210",
    text: "أتابع تقدمي وأجري تعديلات على خططي عند الحاجة",
    options: ["غالباً", "مُطلقاً", "نادراً", "دائماً", "احيانا"],
    correctAnswer: 3,
    points: [4, 1, 2, 5, 3],
  },

  // Questions about time management and productivity
  {
    id: "beh211",
    text: "أبدأ يومي بتحديد أولوياتي",
    options: ["غالباً", "احيانا", "دائماً", "نادراً", "مُطلقاً"],
    correctAnswer: 2,
    points: [4, 3, 5, 2, 1],
  },
  {
    id: "beh212",
    text: "أخصص وقتاً لكل مهمة وألتزم به",
    options: ["دائماً", "نادراً", "مُطلقاً", "غالباً", "احيانا"],
    correctAnswer: 0,
    points: [5, 2, 1, 4, 3],
  },
  {
    id: "beh213",
    text: "أستخدم طرقاً فعالة لتنظيم وقتي وإنجاز مهامي",
    options: ["احيانا", "دائماً", "نادراً", "مُطلقاً", "غالباً"],
    correctAnswer: 1,
    points: [3, 5, 2, 1, 4],
  },
  {
    id: "beh214",
    text: "أتجنب إضاعة الوقت في مهام غير ضرورية",
    options: ["نادراً", "غالباً", "مُطلقاً", "احيانا", "دائماً"],
    correctAnswer: 4,
    points: [2, 4, 1, 3, 5],
  },
  {
    id: "beh215",
    text: "أضع جدولاً واضحاً لتحقيق أهدافي اليومية",
    options: ["غالباً", "دائماً", "احيانا", "نادراً", "مُطلقاً"],
    correctAnswer: 1,
    points: [4, 5, 3, 2, 1],
  },

  // Questions about innovation and entrepreneurship
  {
    id: "beh216",
    text: "أبحث عن أفكار جديدة لإضافة قيمة لما أقوم به",
    options: ["نادراً", "احيانا", "دائماً", "غالباً", "مُطلقاً"],
    correctAnswer: 2,
    points: [2, 3, 5, 4, 1],
  },
  {
    id: "beh217",
    text: "أستمتع بابتكار طرق جديدة لحل المشكلات",
    options: ["دائماً", "غالباً", "احيانا", "نادراً", "مُطلقاً"],
    correctAnswer: 0,
    points: [5, 4, 3, 2, 1],
  },
  {
    id: "beh218",
    text: "أؤمن بأن الإبداع يمكن أن يكون في أي مجال",
    options: ["مُطلقاً", "نادراً", "غالباً", "احيانا", "دائماً"],
    correctAnswer: 4,
    points: [1, 2, 4, 3, 5],
  },
  {
    id: "beh219",
    text: "أتعامل مع المخاطر بحكمة عند تنفيذ الأفكار الجديدة",
    options: ["مُطلقاً", "غالباً", "دائماً", "نادراً", "احيانا"],
    correctAnswer: 2,
    points: [1, 4, 5, 2, 3],
  },
  {
    id: "beh220",
    text: "أبحث عن فرص لتطوير أفكار إبداعية وتحويلها لمشاريع",
    options: ["غالباً", "دائماً", "احيانا", "نادراً", "مُطلقاً"],
    correctAnswer: 1,
    points: [4, 5, 3, 2, 1],
  },
];

export default behavioral;
