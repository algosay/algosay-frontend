import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AIParseSection from './components/AIParseSection';
import StrategyConfig from './components/StrategyConfig';
import ResultsDashboard from './components/ResultsDashboard';
import MyStrategiesModal from './MyStrategiesModal';
import PricingModal from './components/PricingModal'; 
import UserProfile from './components/UserProfile'; 
import Login from './Login';
import TopNavBar from './components/TopNavBar';
import { useAppLogic } from './useAppLogic'; 

// 🌟 NEW: Wealth Engine Components
import WealthConfigView from './components/WealthConfigView';
import WealthResultsDashboard from './components/WealthResultsDashboard';

// 🌟 Import Company Pages (Footer public pages kulla handle panalam)
import AboutUs from './components/AboutUs';
import TermsConditions from './components/TermsConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import ContactUs from './components/ContactUs';
import Careers from './components/Careers';

// 🎨 THEME SWITCH
// true  = light page background (matches the new Strategy Builder)
// false = old dark page background (Strategy Builder stays as a light sheet on it)
// Header / AIParseSection / TopNavBar / ResultsDashboard are separate files. Until they are
// converted to light colours, if any text looks invisible on the light page, set this to false.
const LIGHT_PAGE = true;

// 🛠️ FIX: ProtectedDashboard component-ah App function-ku VELIYA move pannitom.
// Ithanaala type pannum pothu component re-mount aagi focus lose aagathu!
const ProtectedDashboard = ({ logic }) => {
  // 💎 State for Wealth Engine View inside Dashboard
  const [wealthData, setWealthData] = useState(null);
  const [wealthError, setWealthError] = useState(null);
  const [activeTab, setActiveTab] = useState('trade'); // 'trade' or 'wealth'

  if (logic.loadingAuth) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${LIGHT_PAGE ? 'bg-[#E9ECF1] text-[#121A2B]' : 'bg-[#121212] text-white'}`}>
        <p className="text-lg animate-pulse font-semibold">Loading AlgoSay Environment...</p>
      </div>
    );
  }

  if (!logic.user) {
    return <Login onLoginSuccess={(loggedInUser) => logic.setUser(loggedInUser)} />;
  }

  return (
    <>
      {/* 🚨 Modals 🚨 */}
      <MyStrategiesModal 
        isOpen={logic.showStrategiesModal} 
        onClose={() => logic.setShowStrategiesModal(false)}
        isLoading={logic.isLoadingStrategies}
        strategies={logic.savedStrategies}
        onLoad={logic.loadStrategy}
        onDelete={logic.handleDeleteStrategy}
        initialTab={logic.modalTab} 
      />

      <PricingModal 
        isOpen={logic.showPricingModal}
        onClose={() => logic.setShowPricingModal(false)}
      />

      {logic.showProfileModal && (
        <UserProfile 
          onClose={() => logic.setShowProfileModal(false)} 
          userProfileData={logic.userProfileData} 
        />
      )}

      {/* 🌟 DASHBOARD NAVIGATION BAR 🌟 */}
      <TopNavBar 
        user={logic.user}
        userProfileData={logic.userProfileData} 
        isSubscribed={logic.isSubscribed}
        subscriptionPlan={logic.subscriptionPlan}
        userCredits={logic.userCredits}
        openStrategiesModal={logic.openStrategiesModal}
        setShowProfileModal={logic.setShowProfileModal}
        setShowPricingModal={logic.setShowPricingModal}
        // ⚡ Fyers Login & Connection Props ⚡
        isFyersConnected={logic.isFyersConnected}
        handleFyersLogin={logic.handleFyersLogin}
        // 💎 Mode Switcher Props ([⚡ Intraday Algo] & [💎 Wealth Allocator])
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="w-full max-w-[96%] xl:max-w-[98%] mx-auto p-3 md:p-4 lg:p-5">
        
        {/* CONDITIONAL RENDERING BASED ON ACTIVE TAB */}
        {activeTab === 'wealth' ? (
          /* 💎 WEALTH ALLOCATOR ENGINE VIEW (Trading Header is strictly removed here) */
          <div className="animate-fade-in pt-4">
            {wealthError && (
              <div className="max-w-4xl mx-auto mb-4 bg-[#FDECEC] text-[#B42F2F] p-4 rounded-xl border border-[#F5C2C2] text-sm font-semibold text-center">
                {wealthError}
              </div>
            )}
            {!wealthData ? (
              <WealthConfigView 
                onPlanCalculated={(data) => {
                  setWealthData(data);
                  setWealthError(null);
                }} 
                onError={(err) => setWealthError(err)} 
              />
            ) : (
              <WealthResultsDashboard 
                wealthData={wealthData} 
                onModifyPlan={() => setWealthData(null)} 
              />
            )}
          </div>
        ) : (
          /* ⚡ EXISTING INTRADAY ALGO TRADING VIEW (Trading Header appears ONLY here) */
          <>
            <Header />

            <AIParseSection 
              aiPrompt={logic.aiPrompt} setAiPrompt={logic.setAiPrompt} 
              isParsing={logic.isParsing} setIsParsing={logic.setIsParsing} 
              aiMessage={logic.aiMessage} setAiMessage={logic.setAiMessage}
              needsInfoQuestion={logic.needsInfoQuestion} setNeedsInfoQuestion={logic.setNeedsInfoQuestion}
              aiExplanation={logic.aiExplanation} setAiExplanation={logic.setAiExplanation}
              isConfirmed={logic.isConfirmed} setIsConfirmed={logic.setIsConfirmed} 
              onParsedDataSuccess={logic.handleParsedDataSuccess} 
            />

            {logic.aiExplanation && (
              <div className="animate-fade-in w-full mt-4">
                {/* (The "Strategy Configuration" heading now lives inside the builder's own header bar) */}
                
                <StrategyConfig 
                  ticker={logic.ticker} setTicker={logic.setTicker}
                  timeframe={logic.timeframe} setTimeframe={logic.setTimeframe}
                  underlyingFrom={logic.underlyingFrom} setUnderlyingFrom={logic.setUnderlyingFrom}
                  qty={logic.qty} setQty={logic.setQty}
                  transactionType={logic.transactionType} setTransactionType={logic.setTransactionType}
                  fromDate={logic.fromDate} setFromDate={logic.setFromDate}
                  toDate={logic.toDate} setToDate={logic.setToDate}
                  entryTime={logic.entryTime} setEntryTime={logic.setEntryTime}
                  exitTime={logic.exitTime} setExitTime={logic.setExitTime}
                  trailMoveX={logic.trailMoveX} setTrailMoveX={logic.setTrailMoveX}
                  trailPointY={logic.trailPointY} setTrailPointY={logic.setTrailPointY}
                  indicators={logic.indicators} 
                  addIndicator={logic.addIndicator} 
                  updateIndicator={logic.updateIndicator} 
                  removeIndicator={logic.removeIndicator}
                  legs={logic.legs} 
                  addLeg={logic.addLeg} 
                  updateLeg={logic.updateLeg} 
                  removeLeg={logic.removeLeg}
                  setIsConfirmed={logic.setIsConfirmed}
                  dataSource={logic.dataSource}
                  setDataSource={logic.setDataSource}

                  // 🚀 FIX: Max Loop Limit (was missing -> "setTimeLoopLimit is not a function")
                  timeLoopLimit={logic.timeLoopLimit}
                  setTimeLoopLimit={logic.setTimeLoopLimit}
                  
                  combinedPremiumTarget={logic.combinedPremiumTarget}
                  setCombinedPremiumTarget={logic.setCombinedPremiumTarget}
                  combinedPremiumSL={logic.combinedPremiumSL}
                  setCombinedPremiumSL={logic.setCombinedPremiumSL}

                  combinedPremiumTargetUnit={logic.combinedPremiumTargetUnit}
                  setCombinedPremiumTargetUnit={logic.setCombinedPremiumTargetUnit}
                  combinedPremiumSLUnit={logic.combinedPremiumSLUnit}
                  setCombinedPremiumSLUnit={logic.setCombinedPremiumSLUnit}

                  // 🚀 FIX: Overall Strategy Target & SL values (auto-fill from AI parse)
                  overallStrategyTarget={logic.overallStrategyTarget}
                  setOverallStrategyTarget={logic.setOverallStrategyTarget}
                  overallStrategySL={logic.overallStrategySL}
                  setOverallStrategySL={logic.setOverallStrategySL}

                  // 🚀 Overall Strategy Target & SL Units
                  overallStrategyTargetUnit={logic.overallStrategyTargetUnit}
                  setOverallStrategyTargetUnit={logic.setOverallStrategyTargetUnit}
                  overallStrategySLUnit={logic.overallStrategySLUnit}
                  setOverallStrategySLUnit={logic.setOverallStrategySLUnit}
                  riskExtra={logic.riskExtra}
                  setRiskExtra={logic.setRiskExtra}
                />

                {/* 🎬 ACTION BAR: Save + Run (same logic, new look) */}
                <div className="flex flex-col md:flex-row gap-2.5 my-3">
                  <button
                    onClick={logic.handleSaveStrategy}
                    disabled={!logic.isConfirmed}
                    className={`w-full md:w-1/3 h-11 rounded-lg font-semibold text-[13px] transition-all flex justify-center items-center gap-2 ${
                      !logic.isConfirmed 
                      ? 'bg-[#E9EDF2] text-[#9AA4B5] border border-[#DDE2E9] cursor-not-allowed' 
                      : 'bg-white hover:bg-[#F2F4F7] text-[#121A2B] border border-[#C3CAD6] cursor-pointer'
                    }`}
                  >
                    💾 Save strategy
                  </button>

                  <button
                    onClick={logic.runBacktest}
                    disabled={logic.loading || !logic.isConfirmed}
                    className={`w-full md:w-2/3 h-11 rounded-lg font-semibold text-[13px] transition-all flex justify-center items-center gap-2 ${
                      logic.loading || !logic.isConfirmed 
                      ? 'bg-[#E9EDF2] text-[#9AA4B5] border border-[#DDE2E9] cursor-not-allowed' 
                      : 'bg-[#1F9D6B] hover:bg-[#188458] text-white shadow-[0_4px_14px_rgba(31,157,107,0.35)] cursor-pointer'
                    }`}
                  >
                    {logic.loading ? (
                      <><svg className="animate-spin h-5 w-5 text-[#5B667A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Running backtest...</>
                    ) : !logic.isConfirmed ? 'Lock parameters to execute' : (logic.isSubscribed ? `Run backtest (Free - ${logic.subscriptionPlan})` : 'Run backtest (Cost: 1 Credit)')}
                  </button>
                </div>

                {logic.error && <div className="bg-[#FDECEC] text-[#B42F2F] p-3 rounded-lg border border-[#F5C2C2] mb-4 text-[13px] font-semibold">{logic.error}</div>}

                <ResultsDashboard 
                  result={logic.result} 
                  withTax={logic.withTax} 
                  setWithTax={logic.setWithTax} 
                />
                
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
};

function App() {
  const logic = useAppLogic();

  return (
    <Router>
      <div className={`min-h-screen font-ui selection:bg-blue-500/30 relative flex flex-col justify-between ${LIGHT_PAGE ? 'bg-[#E9ECF1] text-[#121A2B]' : 'bg-[#121212] text-gray-300'}`}>
        
        {/* Main Content Area */}
        <div className="flex-grow">
          {/* 🚦 ROUTING SYSTEM 🚦 */}
          <Routes>
            
            {/* PUBLIC PAGES */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/careers" element={<Careers />} />

            {/* PRIVATE APP DASHBOARD */}
            <Route path="/" element={<ProtectedDashboard logic={logic} />} />
            
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;