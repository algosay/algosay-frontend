export const translations = {
  en: {
    stepIndicator: 'Risk Assessment Quiz',
    title: 'Discover Your Investor Personality',
    subtitle: 'Answer quick questions one by one so our AI can design your ideal wealth blueprint.',
    nextBtn: 'Next Question →',
    analyzeBtn: 'Analyze & Get AI Recommendation 🚀',
    retakeBtn: '← Retake Quiz',
    questions: [
      {
        id: 'ageGroup',
        title: 'Q1: What is your age group?',
        subtitle: 'Helps determine your investment horizon and risk capacity.',
        options: [
          { label: '20s (Younger - Higher Risk Capacity)', value: '20s', score: 3 },
          { label: '30s - 40s (Mid-career - Balanced Growth)', value: '30s_40s', score: 2 },
          { label: '50s+ (Near Retirement - Capital Safety)', value: '50s_plus', score: 1 }
        ]
      },
      {
        id: 'marketCrashReaction',
        title: 'Q2: If the stock market suddenly drops by 20%, what will you do?',
        subtitle: 'Tests your mental fortitude and volatility tolerance.',
        options: [
          { label: 'Panic and sell everything immediately', value: 'panic_sell', score: 1 },
          { label: 'Stay calm and hold my investments', value: 'stay_calm', score: 2 },
          { label: 'Buy more! This is a discounted opportunity', value: 'buy_more', score: 3 }
        ]
      },
      {
        id: 'investmentGoal',
        title: 'Q3: What is your primary investment objective?',
        subtitle: 'Matches your return expectations with asset classes.',
        options: [
          { label: 'Capital preservation with steady modest returns', value: 'conservative', score: 1 },
          { label: 'Beat inflation and achieve balanced growth', value: 'balanced', score: 2 },
          { label: 'Aggressive wealth creation and high alpha', value: 'aggressive', score: 3 }
        ]
      },
      {
        id: 'timeHorizon',
        title: 'Q4: How long do you plan to stay invested?',
        subtitle: 'Longer periods allow compounding and high-alpha asset exposure.',
        options: [
          { label: 'Short Term (1 to 2 Years)', value: 'short', score: 1 },
          { label: 'Medium Term (3 to 5 Years)', value: 'medium', score: 2 },
          { label: 'Long Term (5+ Years / Wealth Compounder)', value: 'long', score: 3 }
        ]
      },
      {
        id: 'primaryIncome',
        title: 'Q5: How would you describe your income stability?',
        subtitle: 'Assesses your emergency buffer and risk appetite.',
        options: [
          { label: 'Variable / Freelance / High Fluctuation', value: 'variable', score: 1 },
          { label: 'Stable Salaried / Professional', value: 'stable', score: 2 },
          { label: 'Multiple Income Streams / Business Owner', value: 'multiple', score: 3 }
        ]
      }
    ]
  },
  ta: {
    stepIndicator: 'முதலீட்டு மனநிலை வினாடி வினா',
    title: 'உங்கள் முதலீட்டு ஆளுமையை கண்டறியுங்கள்',
    subtitle: 'ஒவ்வொரு கேள்வியாகப் பதிலளியுங்கள், AI உங்களுக்கான சரியான பிளானைப் பரிந்துரைக்கும்.',
    nextBtn: 'அடுத்த கேள்வி →',
    analyzeBtn: 'பகுப்பாய்வு செய்து AI பரிந்துரையைப் பெறு 🚀',
    retakeBtn: '← மீண்டும் வினாடி வினா',
    questions: [
      {
        id: 'ageGroup',
        title: 'கேள்வி 1: உங்களது வயது பிரிவு என்ன?',
        subtitle: 'உங்கள் முதலீட்டு கால அளவைத் தீர்மானிக்க உதவுகிறது.',
        options: [
          { label: '20கள் (இளம் வயது - அதிக ரிஸ்க் எடுக்கலாம்)', value: '20s', score: 3 },
          { label: '30கள் - 40கள் (நடுத்தர வயது - சீரான வளர்ச்சி)', value: '30s_40s', score: 2 },
          { label: '50கள்+ (பாதுகாப்பான முதலீடு அவசியம்)', value: '50s_plus', score: 1 }
        ]
      },
      {
        id: 'marketCrashReaction',
        title: 'கேள்வி 2: திடீரென மார்க்கெட் 20% கீழே விழுந்தால் என்ன செய்வீர்கள்?',
        subtitle: 'உங்கள் மன உறுதியைப் பரிசோதிக்கிறது.',
        options: [
          { label: 'பயந்து போய் உடனே விற்றுவிடுவேன்', value: 'panic_sell', score: 1 },
          { label: 'கவலைப்படாமல் அமைதியாக இருப்பேன் (Hold)', value: 'stay_calm', score: 2 },
          { label: 'இது ஒரு வாய்ப்பு, மேலும் வாங்குவேன் (Buy More)', value: 'buy_more', score: 3 }
        ]
      },
      {
        id: 'investmentGoal',
        title: 'கேள்வி 3: உங்களது முதலீட்டின் முக்கிய நோக்கம் என்ன?',
        subtitle: 'உங்கள் இலக்குக்கு ஏற்ற வருமானத்தைத் தேர்ந்தெடுக்கிறது.',
        options: [
          { label: 'இருப்பதைக் காப்பாற்றி மிதமான வருமானம்', value: 'conservative', score: 1 },
          { label: 'பணவீக்கத்தை மீறி சீரான வளர்ச்சி (Balanced)', value: 'balanced', score: 2 },
          { label: 'அதிக லாபம், மல்டிபேக்கர் வளர்ச்சி (High Alpha)', value: 'aggressive', score: 3 }
        ]
      },
      {
        id: 'timeHorizon',
        title: 'கேள்வி 4: எவ்வளவு காலம் முதலீடு செய்யத் திட்டமிட்டுள்ளீர்கள்?',
        subtitle: 'நீண்ட காலம் கூட்டு வட்டி பலனைத் தரும்.',
        options: [
          { label: 'குறுகிய காலம் (1 முதல் 2 ஆண்டுகள்)', value: 'short', score: 1 },
          { label: 'நடுத்தர காலம் (3 முதல் 5 ஆண்டுகள்)', value: 'medium', score: 2 },
          { label: 'நீண்ட காலம் (5+ ஆண்டுகள் / வெல்த் கிரியேஷன்)', value: 'long', score: 3 }
        ]
      },
      {
        id: 'primaryIncome',
        title: 'கேள்வி 5: உங்கள் வருமானத்தின் நிலைத்தன்மை எப்படிப்பட்டது?',
        subtitle: 'உங்கள் சேமிப்புத் திறனை மதிப்பிடுகிறது.',
        options: [
          { label: 'மாறும் வருமானம் / ஃப்ரீலான்ஸ் / பிசினஸ்', value: 'variable', score: 1 },
          { label: 'நிலையான சம்பளம் / முறையான வேலை', value: 'stable', score: 2 },
          { label: 'பல வருமான ஆதாரங்கள் / தொழில் முனைவோர்', value: 'multiple', score: 3 }
        ]
      }
    ]
  },
  hi: {
    stepIndicator: 'जोखिम आकलन क्विज़',
    title: 'अपने निवेशक व्यक्तित्व की खोज करें',
    subtitle: 'एक-एक करके प्रश्नों के उत्तर दें ताकि AI आपके लिए सही योजना सुझा सके।',
    nextBtn: 'अगला प्रश्न →',
    analyzeBtn: 'विश्लेषण करें और AI सुझाव देखें 🚀',
    retakeBtn: '← क्विज़ दोहराएं',
    questions: [
      {
        id: 'ageGroup',
        title: 'प्रश्न 1: आपकी आयु वर्ग क्या है?',
        subtitle: 'आपके निवेश क्षितिज को निर्धारित करने में मदद करता है।',
        options: [
          { label: '20s (युवा - उच्च जोखिम क्षमता)', value: '20s', score: 3 },
          { label: '30s - 40s (संतुलित विकास)', value: '30s_40s', score: 2 },
          { label: '50s+ (सेवानिवृत्ति के करीब - पूंजी सुरक्षा)', value: '50s_plus', score: 1 }
        ]
      },
      {
        id: 'marketCrashReaction',
        title: 'प्रश्न 2: यदि शेयर बाजार अचानक 20% गिर जाए, तो आप क्या करेंगे?',
        subtitle: 'आपकी सहनशीलता का परीक्षण करता है।',
        options: [
          { label: 'घबराकर सब बेच दूंगा', value: 'panic_sell', score: 1 },
          { label: 'शांत रहूंगा और होल्ड रखूंगा', value: 'stay_calm', score: 2 },
          { label: 'और खरीदूंगा! यह एक शानदार अवसर है', value: 'buy_more', score: 3 }
        ]
      },
      {
        id: 'investmentGoal',
        title: 'प्रश्न 3: आपका मुख्य निवेश उद्देश्य क्या है?',
        subtitle: 'आपके रिटर्न की उम्मीदों से मेल खाता है।',
        options: [
          { label: 'पूंजी सुरक्षा और स्थिर मध्यम रिटर्न', value: 'conservative', score: 1 },
          { label: 'मुद्रास्फीति को मात देना और संतुलित विकास', value: 'balanced', score: 2 },
          { label: 'आक्रामक संपत्ति सृजन और उच्च अल्फा', value: 'aggressive', score: 3 }
        ]
      },
      {
        id: 'timeHorizon',
        title: 'प्रश्न 4: आप कितने समय तक निवेशित रहने की योजना बना रहे हैं?',
        subtitle: 'लंबी अवधि चक्रवृद्धि का लाभ देती है।',
        options: [
          { label: 'अल्पकालिक (1 से 2 वर्ष)', value: 'short', score: 1 },
          { label: 'मध्यम अवधि (3 से 5 वर्ष)', value: 'medium', score: 2 },
          { label: 'दीर्घकालिक (5+ वर्ष / संपदा सृजन)', value: 'long', score: 3 }
        ]
      },
      {
        id: 'primaryIncome',
        title: 'प्रश्न 5: आपकी आय की स्थिरता कैसी है?',
        subtitle: 'आपकी जोखिम क्षमता का आकलन करता है।',
        options: [
          { label: 'परिवर्तनशील / फ्रीलांस / उतार-चढ़ाव', value: 'variable', score: 1 },
          { label: 'स्थिर वेतन / नौकरी', value: 'stable', score: 2 },
          { label: 'आय के कई स्रोत / व्यावसायिक मालिक', value: 'multiple', score: 3 }
        ]
      }
    ]
  },
  ml: {
    stepIndicator: 'റിസ്ക് അസസ്മെന്റ് ക്വിസ്',
    title: 'നിങ്ങളുടെ നിക്ഷേപക വ്യക്തിത്വം കണ്ടെത്തുക',
    subtitle: 'ഓരോ ചോദ്യങ്ങളായി ഉത്തരം നൽകി AI ശുപാർശ ചെയ്യുന്ന പ്ലാൻ കണ്ടെത്തൂ.',
    nextBtn: 'അടുത്ത ചോദ്യം →',
    analyzeBtn: 'AI ശുപാർശ കാണുക 🚀',
    retakeBtn: '← ക്വിസ് വീണ്ടും ചെയ്യുക',
    questions: [
      {
        id: 'ageGroup',
        title: 'ചോദ്യം 1: നിങ്ങളുടെ വയസ്സ് എത്രയാണ്?',
        subtitle: 'നിങ്ങളുടെ നിക്ഷേപ കാലാവധി നിർണ്ണയിക്കാൻ സഹായിക്കുന്നു.',
        options: [
          { label: '20-കളിൽ (യൂത്ത് - ഉയർന്ന റിസ്ക് എടുക്കാം)', value: '20s', score: 3 },
          { label: '30s - 40s (സമതുലിതമായ വളർച്ച)', value: '30s_40s', score: 2 },
          { label: '50s+ (മൂലധന സുരക്ഷ)', value: '50s_plus', score: 1 }
        ]
      },
      {
        id: 'marketCrashReaction',
        title: 'ചോദ്യം 2: വിപണി പെട്ടെന്ന് 20% ഇടിഞ്ഞാൽ നിങ്ങൾ എന്ത് ചെയ്യും?',
        subtitle: 'നിങ്ങളുടെ മാനസിക ശേഷി പരിശോധിക്കുന്നു.',
        options: [
          { label: 'ഭയന്ന് ഉടൻ വിൽക്കും', value: 'panic_sell', score: 1 },
          { label: 'ശാന്തനായി കൈവശം വെക്കും (Hold)', value: 'stay_calm', score: 2 },
          { label: 'കൂടുതൽ ഓഹരികൾ വാങ്ങും (Buy More)', value: 'buy_more', score: 3 }
        ]
      },
      {
        id: 'investmentGoal',
        title: 'ചോദ്യം 3: നിങ്ങളുടെ പ്രധാന നിക്ഷേപ ലക്ഷ്യമെന്താണ്?',
        subtitle: 'നിങ്ങളുടെ റിട്ടേൺ പ്രതീക്ഷകളുമായി പൊരുത്തപ്പെടുന്നു.',
        options: [
          { label: 'മൂലധന സംരക്ഷണവും സ്ഥിരമായ വരുമാനവും', value: 'conservative', score: 1 },
          { label: 'പണപ്പെരുപ്പത്തെ തോൽപ്പിച്ച് സമതുലിതമായ വളർച്ച', value: 'balanced', score: 2 },
          { label: 'വലിയ സമ്പത്ത് സൃഷ്ടി (High Alpha)', value: 'aggressive', score: 3 }
        ]
      },
      {
        id: 'timeHorizon',
        title: 'ചോദ്യം 4: എത്ര കാലത്തേക്ക് നിക്ഷേപിക്കാൻ പദ്ധതിയിടുന്നു?',
        subtitle: 'ദീർഘകാല നിക്ഷേപം സംയുക്ത വളർച്ച നൽകും.',
        options: [
          { label: 'ഹ്രസ്വകാലം (1 മുതൽ 2 വർഷം)', value: 'short', score: 1 },
          { label: 'ഇടത്തരം (3 മുതൽ 5 വർഷം)', value: 'medium', score: 2 },
          { label: 'ദീർഘകാലം (5+ വർഷം / വെൽത്ത് ക്രിയേഷൻ)', value: 'long', score: 3 }
        ]
      },
      {
        id: 'primaryIncome',
        title: 'ചോദ്യം 5: നിങ്ങളുടെ വരുമാന സ്ഥിരത എങ്ങനെയുള്ളതാണ്?',
        subtitle: 'നിങ്ങളുടെ റിസ്ക് എടുക്കാനുള്ള ശേഷി വിലയിരുത്തുന്നു.',
        options: [
          { label: 'മാറിക്കൊണ്ടിരിക്കുന്ന വരുമാനം / ഫ്രീലാൻസ്', value: 'variable', score: 1 },
          { label: 'സ്ഥിരമായ ശമ്പളം / ജോലി', value: 'stable', score: 2 },
          { label: 'ഒന്നിലധികം വരുമാന സ്രോതസ്സുകൾ / ബിസിനസ്സ്', value: 'multiple', score: 3 }
        ]
      }
    ]
  },
  te: {
    stepIndicator: 'రిస్క్ అసెస్‌మెంట్ క్విజ్',
    title: 'మీ ఇన్వెస్టర్ పర్సనాలిటీని కనుగొనండి',
    subtitle: 'ఒక్కొక్క ప్రశ్నగా సమాధానం ఇవ్వండి, AI మీకు సరైన ప్లాన్‌ను సూచిస్తుంది.',
    nextBtn: 'తదుపరి ప్రశ్న →',
    analyzeBtn: 'AI సిఫార్సును చూడండి 🚀',
    retakeBtn: '← క్విజ్ తిరిగి చేయండి',
    questions: [
      {
        id: 'ageGroup',
        title: 'ప్రశ్న 1: మీ వయస్సు ఎంత?',
        subtitle: 'మీ పెట్టుబడి కాలపరిమితిని నిర్ణయించడంలో సహాయపడుతుంది.',
        options: [
          { label: '20లు (యువకులు - ఎక్కువ రిస్క్ భరించగలరు)', value: '20s', score: 3 },
          { label: '30లు - 40లు (సమతుల్య వృద్ధి)', value: '30s_40s', score: 2 },
          { label: '50లు+ (పెట్టుబడి భద్రత ముఖ్యం)', value: '50s_plus', score: 1 }
        ]
      },
      {
        id: 'marketCrashReaction',
        title: 'ప్రశ్న 2: మార్కెట్ ఒక్కసారిగా 20% పడిపోతే మీరు ఏం చేస్తారు?',
        subtitle: 'మీ మానసిక దృఢత్వాన్ని పరీక్షిస్తుంది.',
        options: [
          { label: 'భయపడి వెంటనే అన్నీ అమ్మేస్తాను', value: 'panic_sell', score: 1 },
          { label: 'ప్రశాంతంగా ఉండి హోల్డ్ చేస్తాను', value: 'stay_calm', score: 2 },
          { label: 'మరిన్ని కొనుగోలు చేస్తాను! ఇది మంచి అవకాశం', value: 'buy_more', score: 3 }
        ]
      },
      {
        id: 'investmentGoal',
        title: 'ప్రశ్న 3: మీ ప్రధాన పెట్టుబడి లక్ష్యం ఏమిటి?',
        subtitle: 'మీ రాబడి అంచనాలకు సరిపోతుంది.',
        options: [
          { label: 'పెట్టుబడి భద్రత మరియు స్థిరమైన రాబడి', value: 'conservative', score: 1 },
          { label: 'ద్రవ్యోల్బణాన్ని అధిగమించి సమతుల్య వృద్ధి', value: 'balanced', score: 2 },
          { label: 'అగ్రెసివ్ వెల్త్ క్రియేషన్ మరియు హై ఆల్ఫా', value: 'aggressive', score: 3 }
        ]
      },
      {
        id: 'timeHorizon',
        title: 'ప్రశ్న 4: మీరు ఎంతకాలం పెట్టుబడి పెట్టాలని ప్లాన్ చేస్తున్నారు?',
        subtitle: 'దీర్ఘకాలిక పెట్టుబడి చక్రవడ్డీ లాభాన్ని ఇస్తుంది.',
        options: [
          { label: 'స్వల్పకాలికం (1 నుండి 2 సంవత్సరాలు)', value: 'short', score: 1 },
          { label: 'మధ్యస్థ కాలం (3 నుండి 5 సంవత్సరాలు)', value: 'medium', score: 2 },
          { label: 'దీర్ഘకాలికం (5+ సంవత్సరాలు / వెల్త్ క్రియేషన్)', value: 'long', score: 3 }
        ]
      },
      {
        id: 'primaryIncome',
        title: 'ప్రశ్న 5: మీ ఆదాయ స్థిరత్వం ఎలా ఉంది?',
        subtitle: 'మీ రిస్క్ సామర్థ్యాన్ని అంచనా వేస్తుంది.',
        options: [
          { label: 'మారుతున్న ఆదాయం / ఫ్రీలాన్స్ / హెచ్చుతగ్గులు', value: 'variable', score: 1 },
          { label: 'స్థిరమైన జీతం / ఉద్యోగం', value: 'stable', score: 2 },
          { label: 'బహుళ ఆదాయ వనరులు / వ్యాపార యజమాని', value: 'multiple', score: 3 }
        ]
      }
    ]
  }
};