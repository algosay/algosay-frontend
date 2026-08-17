import React from 'react';
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

// 🌟 Import Company Pages (Footer public pages kulla handle panalam)
import AboutUs from './components/AboutUs';
import TermsConditions from './components/TermsConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import ContactUs from './components/ContactUs';
import Careers from './components/Careers';

// 🛠️ FIX: ProtectedDashboard component-ah App function-ku VELIYA move pannitom.
// Ithanaala type pannum pothu component re-mount aagi focus lose aagathu!
const ProtectedDashboard = ({ logic }) => {
  if (logic.loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white">
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
        // ⚡ NEW: Fyers Login & Connection Props injected ⚡
        isFyersConnected={logic.isFyersConnected}
        handleFyersLogin={logic.handleFyersLogin}
      />

      <Header />

      <div className="w-full max-w-[96%] xl:max-w-[98%] mx-auto p-4 md:p-6 lg:p-8">
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
          <div className="animate-fade-in w-full">
            <h2 className="text-lg font-bold text-white mb-4 mt-8">Strategy Configuration</h2>
            
            <StrategyConfig 
              ticker={logic.ticker} setTicker={logic.setTicker}
              timeframe={logic.timeframe} setTimeframe={logic.setTimeframe}
              underlyingFrom={logic.underlyingFrom} setUnderlyingFrom={logic.setUnderlyingFrom}
              qty={logic.qty} setQty={logic.setQty}
              transactionType={logic.transactionType} setTransactionType={logic.setTransactionType}
              fromDate={logic.fromDate} setFromDate={logic.setFromDate}
              toDate={logic.toDate} setToDate={logic.setToDate} /* 🛠️ FIXED: setToData -> setToDate */
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
              // ⚡ NEW: Data Source S3 vs Fyers Toggle Props injected ⚡
              dataSource={logic.dataSource}
              setDataSource={logic.setDataSource}
              
              // 🟢 COMBINED PREMIUM TARGET & SL (VALUES)
              combinedPremiumTarget={logic.combinedPremiumTarget}
              setCombinedPremiumTarget={logic.setCombinedPremiumTarget}
              combinedPremiumSL={logic.combinedPremiumSL}
              setCombinedPremiumSL={logic.setCombinedPremiumSL}

              // 🚀 PUDHUSA INGA UNITS-A ADD PANNUNGA 👇
              combinedPremiumTargetUnit={logic.combinedPremiumTargetUnit}
              setCombinedPremiumTargetUnit={logic.setCombinedPremiumTargetUnit}
              combinedPremiumSLUnit={logic.combinedPremiumSLUnit}
              setCombinedPremiumSLUnit={logic.setCombinedPremiumSLUnit}
            />

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <button
                onClick={logic.handleSaveStrategy}
                disabled={!logic.isConfirmed}
                className={`w-full md:w-1/3 py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-3 ${
                  !logic.isConfirmed 
                  ? 'bg-[#1a1a1a] text-gray-700 border border-[#2d2d2d] cursor-not-allowed' 
                  : 'bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-300 hover:text-white border border-[#3d3d3d] shadow-lg'
                }`}
              >
                💾 Save Strategy
              </button>

              <button
                onClick={logic.logic?.runBacktest || logic.runBacktest}
                disabled={logic.loading || !logic.isConfirmed}
                className={`w-full md:w-2/3 py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all flex justify-center items-center gap-3 ${
                  logic.loading || !logic.isConfirmed 
                  ? 'bg-[#1e1e1e] text-gray-600 border border-[#2d2d2d] cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'
                }`}
              >
                {logic.loading ? (
                  <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Running Backtest...</>
                ) : !logic.isConfirmed ? 'Lock Parameters to Execute' : (logic.isSubscribed ? `Run Backtest (Free - ${logic.subscriptionPlan})` : 'Run Backtest (Cost: 1 Credit)')}
              </button>
            </div>

            {logic.error && <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 mb-8 text-sm font-semibold">{logic.error}</div>}

            <ResultsDashboard 
              result={logic.result} 
              withTax={logic.withTax} 
              setWithTax={logic.setWithTax} /* 🛠️ FIXED: setWithTest removed */
            />
            
          </div>
        )}
      </div>
    </>
  );
};

function App() {
  const logic = useAppLogic();

  return (
    <Router>
      <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500/30 relative flex flex-col justify-between">
        
        {/* Main Content Area */}
        <div className="flex-grow">
          {/* 🚦 ROUTING SYSTEM rt 🚦 */}
          <Routes>
            
            {/* PUBLIC PAGES */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/careers" element={<Careers />} />

            {/* PRIVATE APP DASHBOARD */}
            {/* 🛠️ FIX: logic object-ah props-ah anuppi irukken */}
            <Route path="/" element={<ProtectedDashboard logic={logic} />} />
            
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;