import React, { useState } from 'react';
import axios from 'axios';

const WealthConfigView = ({ onPlanCalculated, onError }) => {
  // Wizard Steps: 1: Multi-Lang Quiz, 2: AI Recommendation & Profile Review, 3: Capital/SIP, 4: Return, 5: Allocation, 6: Specific Funds & Selection, 7: Backtest Report, 8: Final
  const [currentStep, setCurrentStep] = useState(1);
  
  // 🌐 Multi-Language State & Dictionary
  const [selectedLang, setSelectedLang] = useState('en');
  const [quizAnswers, setQuizAnswers] = useState({
    ageGroup: '',
    marketCrashReaction: '',
    investmentGoal: '',
    timeHorizon: '',
    primaryIncome: ''
  });
  
  // 🌟 Step-by-Step Quiz Index State (0 to 4 for 5 questions)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [inferredProfile, setInferredProfile] = useState(null);

  // 🌟 Investment Mode State ('lumpsum' or 'sip')
  const [investmentMode, setInvestmentMode] = useState('lumpsum');
  const [capital, setCapital] = useState(100000);
  const [targetReturn, setTargetReturn] = useState(18); // Default Balanced
  const [loading, setLoading] = useState(false);
  const [wealthData, setWealthData] = useState(null);
  const [expandedSegment, setExpandedSegment] = useState(null);

  // 🌟 3D Interactive Donut Slice State
  const [activeDonutSegment, setActiveDonutSegment] = useState(null);

  // Default-ஆக எந்தவொரு ஃபண்டும் டிக் ஆகியிருக்காது (Empty object)
  const [selectedSegmentAssets, setSelectedSegmentAssets] = useState({});

  const presetLumpsum = [50000, 100000, 250000, 500000, 1000000];
  const presetSip = [2000, 5000, 10000, 25000, 50000];

  const targetProfiles = [
    { label: 'Conservative (10-12%)', value: 12, tag: 'Safe Buffer', color: 'border-green-500/40 text-green-400 bg-green-950/20' },
    { label: 'Balanced (15-20%)', value: 18, tag: 'Moderate Growth', color: 'border-blue-500/40 text-blue-400 bg-blue-950/20' },
    { label: 'Aggressive (30-50%)', value: 35, tag: 'High Alpha', color: 'border-orange-500/40 text-orange-400 bg-orange-950/20' },
    { label: 'Extreme High (100%+)', value: 85, tag: 'High Beta / Risk', color: 'border-red-500/40 text-red-400 bg-red-950/20' },
  ];

  // 🌐 Multi-Language Dictionary for Quiz
  const translations = {
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
            { label: 'దీర్ఘకాలికం (5+ సంవత్సరాలు / వెల్త్ క్రియేషన్)', value: 'long', score: 3 }
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

  const currentDict = translations[selectedLang] || translations.en;
  const currentQuestion = currentDict.questions[currentQuizIndex];

  const handleOptionSelect = (questionId, value) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < currentDict.questions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      calculateQuizProfile();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(prev => prev - 1);
    }
  };

  const calculateQuizProfile = () => {
    let totalScore = 0;
    if (quizAnswers.ageGroup === '20s') totalScore += 3;
    else if (quizAnswers.ageGroup === '30s_40s') totalScore += 2;
    else totalScore += 1;

    if (quizAnswers.marketCrashReaction === 'buy_more') totalScore += 3;
    else if (quizAnswers.marketCrashReaction === 'stay_calm') totalScore += 2;
    else totalScore += 1;

    if (quizAnswers.investmentGoal === 'aggressive') totalScore += 3;
    else if (quizAnswers.investmentGoal === 'balanced') totalScore += 2;
    else totalScore += 1;

    if (quizAnswers.timeHorizon === 'long') totalScore += 3;
    else if (quizAnswers.timeHorizon === 'medium') totalScore += 2;
    else totalScore += 1;

    if (quizAnswers.primaryIncome === 'multiple') totalScore += 3;
    else if (quizAnswers.primaryIncome === 'stable') totalScore += 2;
    else totalScore += 1;

    let profile = { name: 'Balanced Growth', returnVal: 18, desc: 'Ideal for steady wealth compounding with moderate volatility tolerance.' };
    if (totalScore <= 7) {
      profile = { name: 'Conservative Preservation', returnVal: 12, desc: 'Focuses on capital safety, low-risk debt instruments, and steady returns.' };
    } else if (totalScore >= 12) {
      profile = { name: 'Aggressive High Alpha', returnVal: 35, desc: 'Designed for high-beta equities, mid/small caps, and aggressive capital growth.' };
    }

    setInferredProfile(profile);
    setTargetReturn(profile.returnVal);
    setCurrentStep(2); // Move to Step 2: AI Recommendation View
  };

  // Fetch data from FastAPI backend with Fallback Safety
  const fetchWealthPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://algosay-backend.onrender.com/api/wealth/calculate-plan', {
        capital: Number(capital),
        target_return: Number(targetReturn),
        mode: investmentMode
      });

      if (response.data && response.data.status === 'success') {
        const data = response.data.data;
        
        if (investmentMode === 'sip') {
          data.is_sip = true;
          data.monthly_investment = Number(capital);
          data.projected_5yr_value = Number(capital) * 65 * 1.25; 
        } else {
          data.is_sip = false;
        }

        // Ensure every segment has valid assets array for Step 6 & Donut view
        if (data.portfolio_breakdown) {
          data.portfolio_breakdown = data.portfolio_breakdown.map(item => ({
            ...item,
            allocated_capital: item.allocated_capital || (Number(capital) * (item.weight_percentage / 100)),
            assets: (item.assets && item.assets.length > 0) ? item.assets : [
              { name: `${item.segment} Prime Fund`, type: "Index/ETF", return: item.avg_5yr_cagr || 15 },
              { name: `${item.segment} Alpha Growth`, type: "Active Fund", return: (item.avg_5yr_cagr || 15) + 2 }
            ]
          }));
        }

        setWealthData(data);
        setSelectedSegmentAssets({});
        setCurrentStep(5); // Move to Allocation view
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Backend fetch failed, using robust fallback wealth blueprint:", err);
      const mockWeightedReturn = targetReturn;
      const t = 5.0;
      let projVal = 0;
      if (investmentMode === 'sip') {
        const monthlyRate = (mockWeightedReturn / 100) / 12;
        const months = t * 12;
        projVal = Number(capital) * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        projVal = Number(capital) * Math.pow(1 + mockWeightedReturn / 100, t);
      }

      setWealthData({
        initial_capital: Number(capital),
        is_sip: investmentMode === 'sip',
        projected_weighted_cagr: mockWeightedReturn,
        projected_5yr_value: Math.round(projVal),
        estimated_max_drawdown: -14.5,
        portfolio_breakdown: [
          { segment: "Large Cap", weight_percentage: 40, allocated_capital: Number(capital) * 0.4, description: "Top 50 stable bluechip companies", avg_5yr_cagr: 14, assets: [{ name: "Nifty 50 Index Fund", type: "Index Fund", return: 14 }, { name: "Mirae Asset Large Cap", type: "Mutual Fund", return: 15 }] },
          { segment: "Mid Cap", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "High growth mid-sized companies", avg_5yr_cagr: 16, assets: [{ name: "Nifty Midcap 150 ETF", type: "ETF", return: 16 }, { name: "Axis Midcap Fund", type: "Mutual Fund", return: 18 }] },
          { segment: "Gold & Debt", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "Safe haven asset & debt buffer", avg_5yr_cagr: 12, assets: [{ name: "Sovereign Gold Bond", type: "Commodity", return: 12 }, { name: "Liquid Direct Fund", type: "Debt", return: 7 }] }
        ]
      });
      setCurrentStep(5);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetToggle = (segmentName, assetName) => {
    setSelectedSegmentAssets((prev) => {
      const currentSelected = prev[segmentName] || [];
      if (currentSelected.includes(assetName)) {
        return { ...prev, [segmentName]: currentSelected.filter((name) => name !== assetName) };
      } else {
        return { ...prev, [segmentName]: [...currentSelected, assetName] };
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 lg:p-10 bg-[#070710] border-t-0 border-x border-b border-[#1e1e30] rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] mt-0 pt-2 relative overflow-hidden text-white">
      
      {/* Background Neon Glow Effects */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Progress Bar Header with Language Selector */}
      <div className="mb-4 border-b border-[#1e1e30] pb-3 flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-[#020205] border border-[#1e1e30] px-3 py-1.5 rounded-xl">
          <span className="text-xs text-gray-400 font-mono">🌐 Lang:</span>
          {[
            { code: 'en', label: 'English' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'hi', label: 'हिंदी' },
            { code: 'ml', label: 'മലയാളം' },
            { code: 'te', label: 'తెలుగు' }
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer font-bold ${
                selectedLang === lang.code 
                  ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-[#020205] border border-[#1e1e30] px-5 py-2 rounded-xl">
          <span className="text-sm font-mono text-cyan-400 font-bold">Step {currentStep} of 8</span>
          <div className="w-32 bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STEP 1: STEP-BY-STEP INTERACTIVE QUIZ WITH SMOOTH ANIMATIONS */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 1 && (
        <div className="space-y-8 max-w-2xl mx-auto py-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">
              {currentDict.stepIndicator} • Question {currentQuizIndex + 1} of 5
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold">{currentDict.title}</h3>
            <p className="text-gray-300 text-sm">{currentDict.subtitle}</p>
          </div>

          {/* Single Question Animated Card */}
          <div className="bg-[#020205] p-6 md:p-8 rounded-3xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] space-y-5 transition-all transform duration-300">
            <div>
              <h4 className="text-lg md:text-xl font-bold text-white">{currentQuestion.title}</h4>
              <p className="text-xs text-cyan-400 font-mono mt-1">{currentQuestion.subtitle}</p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = quizAnswers[currentQuestion.id] === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleOptionSelect(currentQuestion.id, opt.value)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between transform hover:scale-[1.01] ${
                      isSelected 
                        ? 'bg-purple-900/40 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                        : 'bg-[#070710] border-[#1a1a2e] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-sm md:text-base font-medium">{opt.label}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'border-gray-600'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls for Quiz */}
          <div className="flex justify-between items-center pt-4">
            {currentQuizIndex > 0 ? (
              <button
                onClick={handlePrevQuestion}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                ← Previous
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNextQuestion}
              disabled={!quizAnswers[currentQuestion.id]}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm md:text-base rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{currentQuizIndex === currentDict.questions.length - 1 ? currentDict.analyzeBtn : currentDict.nextBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 2: AI RECOMMENDATION DASHBOARD */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 2 && inferredProfile && (
        <div className="space-y-8 max-w-3xl mx-auto py-10 text-center animate-fadeIn">
          <div className="space-y-3">
            <span className="px-4 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">🤖 AI Investor Personality Match</span>
            <h3 className="text-3xl md:text-4xl font-extrabold">Your Profile: <span className="text-purple-400">{inferredProfile.name}</span></h3>
            <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">{inferredProfile.desc}</p>
          </div>

          <div className="bg-[#020205] border border-[#1e1e30] p-8 rounded-3xl space-y-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">AI Recommended Target Return</div>
            <div className="text-5xl font-extrabold text-cyan-400 font-mono">{inferredProfile.returnVal}% <span className="text-lg text-gray-400 font-sans">p.a.</span></div>
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-2xl text-xs md:text-sm text-purple-300 font-mono">
              💡 <strong>AI Suggestion:</strong> Based on your quiz answers, we have automatically set your target return to <strong>{inferredProfile.returnVal}%</strong>. You can proceed with this or customize it in the next steps.
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => { setCurrentStep(1); setCurrentQuizIndex(0); }}
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              {currentDict.retakeBtn}
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Proceed with AI Recommendation</span> <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 3: CAPITAL / SIP MODE INPUT */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 3 && (
        <div className="space-y-8 max-w-4xl mx-auto py-6">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">Step 3 of 8</span>
            <h3 className="text-2xl md:text-3xl font-extrabold">Choose Investment Mode & Amount</h3>
            <p className="text-gray-300 text-sm md:text-base">Select whether you want to invest a lumpsum amount or set up a monthly SIP.</p>
          </div>

          <div className="flex justify-center bg-[#020205] p-2 rounded-2xl border border-[#1e1e30] max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => { setInvestmentMode('lumpsum'); setCapital(100000); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                investmentMode === 'lumpsum' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              💼 Lumpsum Investment
            </button>
            <button
              type="button"
              onClick={() => { setInvestmentMode('sip'); setCapital(5000); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                investmentMode === 'sip' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              🔄 Monthly SIP Mode
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div className="text-center text-sm font-mono text-cyan-400 font-bold">
              {investmentMode === 'sip' ? 'Enter Monthly SIP Contribution (₹)' : 'Enter Total Initial Capital (₹)'}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-6 flex items-center text-cyan-400 font-bold text-2xl">₹</span>
              <input
                type="number"
                min="500"
                step="500"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-[#020205] border border-[#2a2a40] focus:border-cyan-500 rounded-2xl text-white text-2xl font-mono tracking-wide focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              {(investmentMode === 'sip' ? presetSip : presetLumpsum).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCapital(amt)}
                  className={`px-5 py-2.5 text-sm font-mono rounded-xl border transition-all cursor-pointer ${
                    Number(capital) === amt ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300' : 'bg-[#020205] border-[#1e1e30] text-gray-300'
                  }`}
                >
                  {investmentMode === 'sip' ? `₹${amt.toLocaleString('en-IN')} / mo` : `₹${amt / 1000 >= 100 ? `${amt / 100000}L` : `${amt / 1000}K`}`}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer"
            >
              Next: Select Target Return →
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 4: TARGET RETURN SELECTION */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 4 && (
        <div className="space-y-8 max-w-5xl mx-auto py-6">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">Step 4 of 8</span>
            <h3 className="text-2xl md:text-3xl font-extrabold">Review & Adjust Target Return (%)</h3>
            <p className="text-gray-300 text-sm md:text-base">AI recommended {targetReturn}% based on your quiz. You can tweak it below.</p>
          </div>

          <div className="flex justify-between items-center bg-[#020205] p-5 rounded-2xl border border-[#1e1e30]">
            <span className="text-base font-bold text-gray-200">Selected Target Return:</span>
            <span className="px-5 py-2 bg-purple-950/40 border border-purple-500/50 rounded-xl text-purple-300 font-mono font-extrabold text-xl">
              {targetReturn}% p.a.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {targetProfiles.map((profile) => (
              <div
                key={profile.value}
                onClick={() => setTargetReturn(profile.value)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  Number(targetReturn) === profile.value ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)]' : 'bg-[#020205] border-[#1e1e30]'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-base font-bold text-white">{profile.label.split(' ')[0]}</span>
                  <span className={`text-xs px-2.5 py-1 rounded border font-semibold ${profile.color}`}>{profile.tag}</span>
                </div>
                <div className="text-lg font-mono font-bold text-purple-300 pt-2">Target: {profile.value}%</div>
              </div>
            ))}
          </div>

          <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-3">
            <input
              type="range"
              min="8"
              max="120"
              step="1"
              value={targetReturn}
              onChange={(e) => setTargetReturn(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-3 bg-gray-800 rounded-lg"
            />
          </div>

          <div className="pt-6 flex justify-between">
            <button onClick={() => setCurrentStep(3)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm">← Back</button>
            <button onClick={fetchWealthPlan} disabled={loading} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer">
              {loading ? 'Generating...' : 'Next: View Asset Allocation →'}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 5: ASSET ALLOCATION BREAKDOWN WITH 3D POP-OUT DONUT INTERACTION */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 5 && wealthData && (
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center bg-[#020205] p-6 rounded-2xl border border-[#1e1e30]">
            <div>
              <span className="px-3.5 py-1.5 bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-mono rounded-full font-bold">Step 5 of 8</span>
              <h3 className="text-2xl font-extrabold mt-2">Multi-Segment Asset Allocation & 3D Interactive Insights</h3>
            </div>
            <div className="text-right font-mono bg-[#070710] p-4 rounded-xl border border-[#1e1e30]">
              <div className="text-xs text-gray-400">Projected 5Y CAGR</div>
              <div className="text-xl font-extrabold text-green-400">{wealthData.projected_weighted_cagr}% p.a.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {wealthData.portfolio_breakdown.map((item) => {
              const isActive = activeDonutSegment === item.segment;
              return (
                <div 
                  key={item.segment} 
                  onClick={() => setActiveDonutSegment(isActive ? null : item.segment)}
                  className={`bg-[#020205] border p-6 rounded-2xl space-y-4 cursor-pointer transition-all duration-300 transform ${
                    isActive 
                      ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] -translate-y-2 bg-[#0b0b18]' 
                      : 'border-[#1e1e30] hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-base font-bold text-white flex items-center gap-2">
                      <span>{isActive ? '🌟' : '📊'}</span> {item.segment}
                    </span>
                    <span className="px-3 py-1 bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-sm rounded-lg font-bold">
                      {item.weight_percentage}%
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-cyan-400">{formatCurrency(item.allocated_capital)}</div>
                  <p className="text-sm text-gray-300">{item.description}</p>
                  
                  {/* 3D Pop-out Interactive Info Box */}
                  {isActive && (
                    <div className="mt-4 p-4 bg-[#070710] border border-cyan-500/50 rounded-xl space-y-2 animate-fadeIn">
                      <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">💡 3D Segment Insights:</div>
                      <div className="text-xs text-gray-300 font-mono">
                        Included Instruments: {item.assets?.length ? item.assets.map(a => a.name).join(', ') : 'Direct Index & ETFs'}
                      </div>
                      <div className="text-[10px] text-green-400 font-mono">Historical CAGR: ~{item.avg_5yr_cagr || 15}% p.a.</div>
                    </div>
                  )}
                  <div className="text-[11px] text-purple-400 font-mono italic pt-2">
                    {isActive ? '▲ Click to minimize 3D view' : '✨ Click for 3D Pop-out details'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex justify-between">
            <button onClick={() => setCurrentStep(4)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm">← Back</button>
            <button onClick={() => setCurrentStep(6)} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl">Next: Select Funds →</button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 6: SPECIFIC FUND RECOMMENDATIONS */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 6 && wealthData && (
        <div className="space-y-6 py-4">
          <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-2">
            <span className="px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">Step 6 of 8</span>
            <h3 className="text-2xl font-extrabold mt-2">Select Specific Instruments & Funds</h3>
          </div>

          <div className="space-y-4">
            {wealthData.portfolio_breakdown.map((item) => {
              const isExpanded = expandedSegment === item.segment;
              const selectedCount = (selectedSegmentAssets[item.segment] || []).length;

              return (
                <div key={item.segment} className="bg-[#020205] border border-[#1e1e30] rounded-2xl overflow-hidden">
                  <div onClick={() => setExpandedSegment(isExpanded ? null : item.segment)} className="p-5 flex justify-between items-center cursor-pointer">
                    <span className="text-base font-bold text-white">{item.segment} ({item.weight_percentage}%)</span>
                    <span className="text-cyan-400 text-sm font-bold">{selectedCount} Selected</span>
                  </div>
                  {isExpanded && (
                    <div className="p-5 border-t border-[#1e1e30] bg-[#05050a] grid grid-cols-1 md:grid-cols-3 gap-3">
                      {item.assets.map((asset, idx) => {
                        const isChecked = (selectedSegmentAssets[item.segment] || []).includes(asset.name);
                        return (
                          <div key={asset.ticker || idx} onClick={() => handleAssetToggle(item.segment, asset.name)} className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer ${isChecked ? 'bg-purple-950/25 border-purple-500' : 'bg-[#070710] border-[#1a1a2e]'}`}>
                            <span className="text-sm font-bold text-white">{asset.name}</span>
                            <input type="checkbox" checked={isChecked} onChange={() => {}} className="accent-purple-500 h-5 w-5" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex justify-between">
            <button onClick={() => setCurrentStep(5)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm">← Back</button>
            <button onClick={() => setCurrentStep(7)} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl">Next: Backtest Report →</button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 7: BACKTEST REPORT */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 7 && wealthData && (
        <div className="space-y-6 py-4 max-w-6xl mx-auto">
          <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] space-y-2">
            <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">Step 7 of 8</span>
            <h3 className="text-2xl font-extrabold mt-2">5-Year Historical Backtest Report</h3>
          </div>

          <div className="pt-6 flex justify-between">
            <button onClick={() => setCurrentStep(6)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm">← Back</button>
            <button onClick={() => { setCurrentStep(8); if (onPlanCalculated) onPlanCalculated({ ...wealthData, selectedSegmentAssets }); }} className="px-9 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-bold rounded-2xl">View Final Results 🚀</button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP 8: FINAL RESULTS DASHBOARD HANDOFF */}
      {/* ------------------------------------------------------------------ */}
      {currentStep === 8 && wealthData && (
        <div className="text-center space-y-8 py-12">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mx-auto text-green-400 text-3xl">✓</div>
          <h3 className="text-3xl font-extrabold">Wealth Blueprint Generated Successfully!</h3>
          <div className="flex justify-center gap-5 pt-4">
            <button onClick={() => setCurrentStep(1)} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm">Retake Quiz & New Plan</button>
            <button onClick={() => window.print()} className="px-8 py-3.5 bg-cyan-600 text-white font-bold rounded-xl text-sm">📥 Download PDF Report</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default WealthConfigView;