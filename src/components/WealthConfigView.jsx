import React, { useState } from 'react';
import axios from 'axios';
import { translations } from './translations';
import { QuizStep } from './QuizStep';
import { ConfigSteps } from './ConfigSteps';
import { AllocationAndReports } from './AllocationAndReports';

const WealthConfigView = ({ onPlanCalculated, onError }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState('en');
  const [quizAnswers, setQuizAnswers] = useState({ ageGroup: '', marketCrashReaction: '', investmentGoal: '', timeHorizon: '', primaryIncome: '' });
  
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [inferredProfile, setInferredProfile] = useState(null);

  const [investmentMode, setInvestmentMode] = useState('lumpsum');
  const [capital, setCapital] = useState(100000);
  const [targetReturn, setTargetReturn] = useState(18);
  const [loading, setLoading] = useState(false);
  const [wealthData, setWealthData] = useState(null);
  const [expandedSegment, setExpandedSegment] = useState(null);
  const [activeDonutSegment, setActiveDonutSegment] = useState(null);
  const [selectedSegmentAssets, setSelectedSegmentAssets] = useState({});

  const presetLumpsum = [50000, 100000, 250000, 500000, 1000000];
  const presetSip = [2000, 5000, 10000, 25000, 50000];

  const targetProfiles = [
    { label: 'Conservative (10-12%)', value: 12, tag: 'Safe Buffer', color: 'border-green-500/40 text-green-400 bg-green-950/20' },
    { label: 'Balanced (15-20%)', value: 18, tag: 'Moderate Growth', color: 'border-blue-500/40 text-blue-400 bg-blue-950/20' },
    { label: 'Aggressive (30-50%)', value: 35, tag: 'High Alpha', color: 'border-orange-500/40 text-orange-400 bg-orange-950/20' },
    { label: 'Extreme High (100%+)', value: 85, tag: 'High Beta / Risk', color: 'border-red-500/40 text-red-400 bg-red-950/20' },
  ];

  const currentDict = translations[selectedLang] || translations.en;
  const currentQuestion = currentDict.questions[currentQuizIndex];

  const handleOptionSelect = (questionId, value) => setQuizAnswers(prev => ({ ...prev, [questionId]: value }));

  const handleNextQuestion = () => {
    if (currentQuizIndex < currentDict.questions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      calculateQuizProfile();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuizIndex > 0) setCurrentQuizIndex(prev => prev - 1);
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

    let profile = { name: 'Balanced Growth', returnVal: 18, desc: 'Ideal for steady wealth compounding.' };
    if (totalScore <= 7) profile = { name: 'Conservative Preservation', returnVal: 12, desc: 'Focuses on capital safety.' };
    else if (totalScore >= 12) profile = { name: 'Aggressive High Alpha', returnVal: 35, desc: 'Designed for aggressive growth.' };

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
        setCurrentStep(5);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("Backend fetch failed, using fallback:", err);
      const mockWeightedReturn = targetReturn;
      const projVal = investmentMode === 'sip' ? Number(capital) * 65 * 1.25 : Number(capital) * Math.pow(1 + mockWeightedReturn / 100, 5.0);

      setWealthData({
        initial_capital: Number(capital),
        is_sip: investmentMode === 'sip',
        projected_weighted_cagr: mockWeightedReturn,
        projected_5yr_value: Math.round(projVal),
        portfolio_breakdown: [
          { segment: "Large Cap", weight_percentage: 40, allocated_capital: Number(capital) * 0.4, description: "Top 50 stable bluechip", avg_5yr_cagr: 14, assets: [{ name: "Nifty 50 Index Fund", type: "Index Fund" }, { name: "Mirae Asset Large Cap", type: "Mutual Fund" }] },
          { segment: "Mid Cap", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "High growth mid-sized", avg_5yr_cagr: 16, assets: [{ name: "Nifty Midcap 150 ETF", type: "ETF" }, { name: "Axis Midcap Fund", type: "Mutual Fund" }] },
          { segment: "Gold & Debt", weight_percentage: 30, allocated_capital: Number(capital) * 0.3, description: "Safe haven buffer", avg_5yr_cagr: 12, assets: [{ name: "Sovereign Gold Bond", type: "Commodity" }, { name: "Liquid Direct Fund", type: "Debt" }] }
        ]
      });
      setCurrentStep(5);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetToggle = (segmentName, assetName) => {
    setSelectedSegmentAssets(prev => {
      const currentSelected = prev[segmentName] || [];
      if (currentSelected.includes(assetName)) {
        return { ...prev, [segmentName]: currentSelected.filter(n => n !== assetName) };
      } else {
        return { ...prev, [segmentName]: [...currentSelected, assetName] };
      }
    });
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

  return (
    <div className="w-full min-h-screen p-4 md:p-8 lg:p-10 bg-[#070710] border-t-0 border-x border-b border-[#1e1e30] rounded-b-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] mt-0 pt-2 relative overflow-hidden text-white">
      
      {/* Header & Language Bar */}
      <div className="mb-4 border-b border-[#1e1e30] pb-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#020205] border border-[#1e1e30] px-3 py-1.5 rounded-xl">
          <span className="text-xs text-gray-400 font-mono">🌐 Lang:</span>
          {[{ code: 'en', label: 'English' }, { code: 'ta', label: 'தமிழ்' }, { code: 'hi', label: 'हिंदी' }, { code: 'ml', label: 'മലയാളം' }, { code: 'te', label: 'తెలుగు' }].map((lang) => (
            <button key={lang.code} onClick={() => setSelectedLang(lang.code)} className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer font-bold ${selectedLang === lang.code ? 'bg-cyan-600 text-white' : 'text-gray-400'}`}>
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-[#020205] border border-[#1e1e30] px-5 py-2 rounded-xl">
          <span className="text-sm font-mono text-cyan-400 font-bold">Step {currentStep} of 8</span>
          <div className="w-32 bg-gray-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300" style={{ width: `${(currentStep / 8) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Component Step Renderers */}
      <QuizStep 
        currentStep={currentStep}
        currentQuizIndex={currentQuizIndex}
        currentDict={currentDict}
        currentQuestion={currentQuestion}
        quizAnswers={quizAnswers}
        inferredProfile={inferredProfile}
        onOptionSelect={handleOptionSelect}
        onNextQuestion={handleNextQuestion}
        onPrevQuestion={handlePrevQuestion}
        onRetakeQuiz={() => { setCurrentStep(1); setCurrentQuizIndex(0); }}
        onProceedToCapital={() => setCurrentStep(3)}
      />

      <ConfigSteps 
        currentStep={currentStep}
        investmentMode={investmentMode}
        setInvestmentMode={setInvestmentMode}
        capital={capital}
        setCapital={setCapital}
        targetReturn={targetReturn}
        setTargetReturn={setTargetReturn}
        loading={loading}
        wealthData={wealthData}
        activeDonutSegment={activeDonutSegment}
        setActiveDonutSegment={setActiveDonutSegment}
        presetLumpsum={presetLumpsum}
        presetSip={presetSip}
        targetProfiles={targetProfiles}
        formatCurrency={formatCurrency}
        onFetchWealthPlan={fetchWealthPlan}
        onStepChange={setCurrentStep}
      />

      <AllocationAndReports 
        currentStep={currentStep}
        wealthData={wealthData}
        expandedSegment={expandedSegment}
        setExpandedSegment={setExpandedSegment}
        selectedSegmentAssets={selectedSegmentAssets}
        onAssetToggle={handleAssetToggle}
        capital={capital}
        formatCurrency={formatCurrency}
        onStepChange={setCurrentStep}
        onPlanCalculated={onPlanCalculated}
      />

    </div>
  );
};

export default WealthConfigView;