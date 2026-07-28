import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');

    // TODO: Connect this to your FastAPI backend or Firebase Firestore here.
    // Example: await axios.post('/api/contact', formData);
    
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after a few seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 p-6 md:p-12 lg:p-20 font-sans selection:bg-cyan-900 selection:text-cyan-100 flex justify-center items-center">
      <div className="max-w-6xl w-full space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Contact Us
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have questions about your algorithmic backtests, billing, or API integration? Our support team is here to help you navigate the markets.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10 bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          
          {/* Left Side: Contact Information */}
          <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 p-8 md:p-10 border-r border-gray-800 flex flex-col justify-between relative overflow-hidden">
            {/* Cyberpunk background glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-cyan-900/10 blur-[80px] pointer-events-none" />
            
            <div className="space-y-10 relative z-10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Get in Touch</h3>
                <p className="text-gray-500">We usually respond within 24 hours.</p>
              </div>

              <div className="space-y-6">
                {/* Email Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/50 flex items-center justify-center border border-cyan-500/30 text-cyan-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-semibold mb-1">Email Support</h4>
                    <a href="mailto:support@algosay.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">support@algosay.com</a>
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-950/50 flex items-center justify-center border border-purple-500/30 text-purple-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-semibold mb-1">Office Location</h4>
                    <p className="text-gray-500 text-sm">AlgoSay Tech Hub<br/>Cyberabad, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="md:col-span-3 p-8 md:p-10 relative">
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600"
                    placeholder="John Doe"
                  />
                </div>
                
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600"
                  placeholder="e.g. Billing Issue, API Question"
                />
              </div>

              {/* Message Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600 resize-none"
                  placeholder="Describe your issue or inquiry here..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all duration-300 flex justify-center items-center gap-2
                  ${status === 'submitting' 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : status === 'success'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  }`}
              >
                {status === 'submitting' ? (
                  <span className="animate-pulse">Sending...</span>
                ) : status === 'success' ? (
                  <span>Message Sent Successfully!</span>
                ) : (
                  <>
                    Send Message
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;