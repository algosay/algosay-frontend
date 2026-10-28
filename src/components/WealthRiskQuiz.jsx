import React, { useState } from 'react';
import axios from 'axios';

const WealthRiskQuiz = ({ onPlanCalculated, onError }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Language State ('en', 'ta', 'hi', 'ml', 'te')
  const [selectedLang, setSelectedLang] = useState('en');

  // Quiz Answers State
  const [quizAnswers, setQuizAnswers] = useState({
    ageGroup: '',
    marketCrashReaction: '',
    investmentGoal: '',
    timeHorizon: '',
    primaryIncome: ''
  });

  const [inferredProfile, setInferredProfile] = useState(null);
  const [investmentMode, setInvestmentMode] = useState('lumpsum');
  const [capital, setCapital] = useState(100000);
  const [targetReturn, setTargetReturn] = useState(18);
  const [loading, setLoading] = useState(false);
  const [wealthData, setWealthData] = useState(null);
  const [selectedSegmentAssets, setSelectedSegmentAssets] = useState({});

  // Multi-Language Dictionary
  const translations = {
    en: {
      selectLangTitle: 'Choose Your Preferred Language',
      stepIndicator: 'Risk Assessment Quiz',
      title: 'Discover Your Investor Personality',
      subtitle: 'Answer 5 quick questions so our AI can design your ideal multi-segment wealth blueprint.',
      nextBtn: 'Analyze & Generate Ideal Blueprint 🚀',
      retakeBtn: '← Retake Quiz',
      proceedBtn: 'Next: View Multi-Asset Allocation →',
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
      selectLangTitle: 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
      stepIndicator: 'முதலீட்டு மனநிலை வினாடி வினா',
      title: 'உங்கள் முதலீட்டு ஆளுமையை கண்டறியுங்கள்',
      subtitle: '5 எளிமையான கேள்விகளுக்குப் பதிலளியுங்கள், உங்கள் வெல்த் பிளான் தயாராகும்.',
      nextBtn: 'பகுப்பாய்வு செய்து பிளான் உருவாக்கு 🚀',
      retakeBtn: '← மீண்டும் கேள்விகளுக்குச் செல்',
      proceedBtn: 'அடுத்து: அசெட் அலகேஷன் காண்க →',
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
      selectLangTitle: 'अपनी पसंदीदा भाषा चुनें',
      stepIndicator: 'जोखिम आकलन क्विज़',
      title: 'अपने निवेशक व्यक्तित्व की खोज करें',
      subtitle: '5 त्वरित प्रश्नों के उत्तर दें ताकि हमारा AI आपका वेल्थ ब्लूप्रिंट तैयार कर सके।',
      nextBtn: 'विश्लेषण करें और ब्लूप्रिंट बनाएं 🚀',
      retakeBtn: '← क्विज़ दोहराएं',
      proceedBtn: 'अगला: एसेट आवंटन देखें →',
      questions: [
        {
          id: 'ageGroup',
          title: 'प्रश्ना 1: आपकी आयु वर्ग क्या है?',
          subtitle: 'आपके निवेश क्षितिज को निर्धारित करने में मदद करता है।',
          options: [
            { label: '20s (युवा - उच्च जोखिम क्षमता)', value: '20s', score: 3 },
            { label: '30s - 40s (संतुलित विकास)', value: '30s_40s', score: 2 },
            { label: '50s+ (सेवानिवृत्ति के करीब - पूंजी सुरक्षा)', value: '50s_plus', score: 1 }
          ]
        },
        {
          id: 'marketCrashReaction',
          title: 'प्रश्ना 2: यदि शेयर बाजार अचानक 20% गिर जाए, तो आप क्या करेंगे?',
          subtitle: 'आपकी सहनशीलता का परीक्षण करता है।',
          options: [
            { label: 'घबराकर सब बेच दूंगा', value: 'panic_sell', score: 1 },
            { label: 'शांत रहूंगा और होल्ड रखूंगा', value: 'stay_calm', score: 2 },
            { label: 'और खरीदूंगा! यह एक शानदार अवसर है', value: 'buy_more', score: 3 }
          ]
        },
        {
          id: 'investmentGoal',
          title: 'प्रश्ना 3: आपका मुख्य निवेश उद्देश्य क्या है?',
          subtitle: 'आपके रिटर्न की उम्मीदों से मेल खाता है।',
          options: [
            { label: 'पूंजी सुरक्षा और स्थिर मध्यम रिटर्न', value: 'conservative', score: 1 },
            { label: 'मुद्रास्फीति को मात देना और संतुलित विकास', value: 'balanced', score: 2 },
            { label: 'आक्रामक संपत्ति सृजन और उच्च अल्फा', value: 'aggressive', score: 3 }
          ]
        },
        {
          id: 'timeHorizon',
          title: 'प्रश्ना 4: आप कितने समय तक निवेशित रहने की योजना बना रहे हैं?',
          subtitle: 'लंबी अवधि चक्रवृद्धि का लाभ देती है।',
          options: [
            { label: 'अल्पकालिक (1 से 2 वर्ष)', value: 'short', score: 1 },
            { label: 'मध्यम अवधि (3 से 5 वर्ष)', value: 'medium', score: 2 },
            { label: 'दीर्घकालिक (5+ वर्ष / संपदा सृजन)', value: 'long', score: 3 }
          ]
        },
        {
          id: 'primaryIncome',
          title: 'प्रश्ना 5: आपकी आय की स्थिरता कैसी है?',
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
      selectLangTitle: 'നിങ്ങളുടെ ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക',
      stepIndicator: 'റിസ്ക് അസസ്മെന്റ് ക്വിസ്',
      title: 'നിങ്ങളുടെ നിക്ഷേപക വ്യക്തിത്വം കണ്ടെത്തുക',
      subtitle: '5 ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകി നിങ്ങളുടെ വെൽത്ത് ബ്ലൂപ്രിന്റ് തയ്യാറാക്കൂ.',
      nextBtn: 'ബ്ലൂപ്രിന്റ് തയ്യാറാക്കുക 🚀',
      retakeBtn: '← ക്വിസ് വീണ്ടും ചെയ്യുക',
      proceedBtn: 'അടുത്തത്: അസറ്റ് അലോക്കേഷൻ കാണുക →',
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
      selectLangTitle: 'మీకు ఇష్టమైన భాషను ఎంచుకోండి',
      stepIndicator: 'రిస్క్ అసెస్‌మెంట్ క్విజ్',
      title: 'మీ ఇన్వెస్టర్ పర్సనాలిటీని కనుగొనండి',
      subtitle: '5 సాధారణ ప్రశ్నలకు సమాధానం ఇవ్వండి, మీ వెల్త్ బ్లూప్రింట్ సిద్ధమవుతుంది.',
      nextBtn: 'విశ్లేషించి బ్లూప్రింట్ సృష్టించండి 🚀',
      retakeBtn: '← క్విజ్ తిరిగి చేయండి',
      proceedBtn: 'తదుపరి: అసెట్ కేటాయింపును చూడండి →',
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

  const handleOptionSelect = (questionId, value) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: value }));
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

    let profile = { name: 'Balanced', returnVal: 18 };
    if (totalScore <= 7) {
      profile = { name: 'Conservative', returnVal: 12 };
    } else if (totalScore >= 12) {
      profile = { name: 'Aggressive / High Alpha', returnVal: 35 };
    }

    setInferredProfile(profile);
    setTargetReturn(profile.returnVal);
    setCurrentStep(2); 
  };

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
        setWealthData(data);
        setSelectedSegmentAssets({});
        setCurrentStep(3); 
      } else {
        if (onError) onError("Failed to fetch wealth plan from backend.");
      }
    } catch (err) {
      console.error("Wealth calculation error:", err);
      const mockWeightedReturn = targetReturn;
      const t = 5.0;
      let projVal = Number(capital) * Math.pow(1 + mockWeightedReturn / 100, t);

      setWealthData({
        initial_capital: Number(capital),
        is_sip: investmentMode === 'sip',
        projected_weighted_cagr: mockWeightedReturn,
        projected_5yr_value: Math.round(projVal),
        estimated_max_drawdown: -16.5,
        portfolio_breakdown: [
          { segment: "Large Cap", weight_percentage: 40, allocated_capital: Number(capital) * 0.4, description: "Top 50 stable companies", avg_5yr_cagr: 14, assets: [] },
          { segment: "Mid Cap", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "High growth mid-sized companies", avg_5yr_cagr: 16, assets: [] },
          { segment: "Gold", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "Safe haven asset", avg_5yr_cagr: 12, assets: [] }
        ]
      });
      setCurrentStep(3);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 lg:p-10 bg-[#070710] border-t-0 border-x border-b border-[#1e1e30] rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] mt-0 pt-2 relative overflow-hidden text-white">
      
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-4 border-b border-[#1e1e30] pb-3 flex flex-col md:flex-row justify-between items-center gap-3">
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
          <span className="text-sm font-mono text-cyan-400 font-bold">Step {currentStep} of 3</span>
          <div className="w-32 bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-8 max-w-3xl mx-auto py-6">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">{currentDict.stepIndicator}</span>
            <h3 className="text-2xl md:text-3xl font-extrabold">{currentDict.title}</h3>
            <p className="text-gray-300 text-sm">{currentDict.subtitle}</p>
          </div>

          <div className="space-y-6">
            {currentDict.questions.map((q) => (
              <div key={q.id} className="bg-[#020205] p-5 rounded-2xl border border-[#1e1e30] space-y-3">
                <div>
                  <h4 className="text-base font-bold text-white">{q.title}</h4>
                  <p className="text-xs text-gray-400">{q.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = quizAnswers[q.id] === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => handleOptionSelect(q.id, opt.value)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-purple-900/30 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]' 
                            : 'bg-[#070710] border-[#1a1a2e] text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <span className="text-xs md:text-sm font-medium">{opt.label}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-purple-400 bg-purple-500' : 'border-gray-600'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={calculateQuizProfile}
              disabled={!quizAnswers.ageGroup || !quizAnswers.marketCrashReaction || !quizAnswers.investmentGoal || !quizAnswers.timeHorizon || !quizAnswers.primaryIncome}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm md:text-base rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{currentDict.nextBtn}</span>
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-8 max-w-4xl mx-auto py-6">
          <div className="text-center space-y-3">
            <span className="px-3.5 py-1.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded-full font-bold">AI Profile Matched</span>
            <h3 className="text-2xl md:text-3xl font-extrabold">Your Profile: <span className="text-purple-400">{inferredProfile?.name}</span></h3>
            <p className="text-gray-300 text-sm">Recommended Target Return: <strong className="text-cyan-400">{targetReturn}% p.a.</strong> Enter your investment amount below.</p>
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
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-7 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              {currentDict.retakeBtn}
            </button>
            <button
              onClick={fetchWealthPlan}
              disabled={loading}
              className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-base rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer flex items-center gap-2"
            >
              {loading ? <span>Processing AI Engine...</span> : <span>{currentDict.proceedBtn}</span>}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && wealthData && (
        <div className="space-y-6 py-4">
          <div className="bg-[#020205] p-6 rounded-2xl border border-[#1e1e30] flex justify-between items-center">
            <div>
              <span className="px-3 py-1 bg-blue-950/40 border border-blue-500/40 text-blue-300 text-xs font-mono rounded-full font-bold">AI Recommended Portfolio</span>
              <h3 className="text-2xl font-extrabold mt-1">Multi-Segment Wealth Allocation</h3>
              <p className="text-xs text-gray-300">Customized for your {inferredProfile?.name} personality profile ({targetReturn}% target).</p>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-gray-400">Projected 5Y CAGR</div>
              <div className="text-lg font-bold text-green-400">{wealthData.projected_weighted_cagr}% p.a.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wealthData.portfolio_breakdown.map((item) => (
              <div key={item.segment} className="bg-[#020205] border border-[#1e1e30] p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold text-white">{item.segment}</span>
                  <span className="px-2.5 py-0.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-xs rounded-lg">
                    {item.weight_percentage}%
                  </span>
                </div>
                <div className="text-xl font-mono font-extrabold text-cyan-400">{formatCurrency(item.allocated_capital)}</div>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 bg-gray-800 text-gray-300 font-bold rounded-xl text-xs"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (onPlanCalculated) onPlanCalculated({ ...wealthData, selectedSegmentAssets });
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              View Detailed Dashboard & Select Funds 🚀
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default WealthRiskQuiz;