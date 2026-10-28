import React from 'react';

export const QuizStep = ({ 
  currentStep, 
  currentQuizIndex, 
  currentDict, 
  currentQuestion, 
  quizAnswers, 
  inferredProfile, 
  onOptionSelect, 
  onNextQuestion, 
  onPrevQuestion, 
  onRetakeQuiz, 
  onProceedToCapital 
}) => {
  if (currentStep === 1) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto py-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1.5 bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-mono rounded-full font-bold">
            {currentDict.stepIndicator} • Question {currentQuizIndex + 1} of 5
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold">{currentDict.title}</h3>
          <p className="text-gray-300 text-sm">{currentDict.subtitle}</p>
        </div>

        <div className="bg-[#020205] p-6 md:p-8 rounded-3xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] space-y-5">
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
                  onClick={() => onOptionSelect(currentQuestion.id, opt.value)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-purple-900/40 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                      : 'bg-[#070710] border-[#1a1a2e] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <span className="text-sm md:text-base font-medium">{opt.label}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-gray-600'}`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          {currentQuizIndex > 0 ? (
            <button onClick={onPrevQuestion} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">
              ← Previous
            </button>
          ) : <div />}

          <button
            onClick={onNextQuestion}
            disabled={!quizAnswers[currentQuestion.id]}
            className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer disabled:opacity-40"
          >
            {currentQuizIndex === currentDict.questions.length - 1 ? currentDict.analyzeBtn : currentDict.nextBtn}
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 2 && inferredProfile) {
    return (
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
            💡 <strong>AI Suggestion:</strong> Target return set to <strong>{inferredProfile.returnVal}%</strong> based on your quiz.
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button onClick={onRetakeQuiz} className="px-7 py-3.5 bg-gray-800 text-gray-200 font-bold rounded-xl text-sm cursor-pointer">
            {currentDict.retakeBtn}
          </button>
          <button onClick={onProceedToCapital} className="px-9 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl cursor-pointer">
            Proceed with AI Recommendation →
          </button>
        </div>
      </div>
    );
  }

  return null;
};