import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-[1400px] mx-auto w-full px-6 py-10 lg:py-0 overflow-hidden">
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-8 z-10 lg:pr-10 animate-fade-in-left">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 flex items-center justify-center">
               <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
             </div>
             <div>
               <p className="font-bold text-lg leading-tight">20M+ Students</p>
               <Link to="/" className="text-sm underline font-medium text-gray-600 hover:text-black">Read Our Success Stories</Link>
             </div>
          </div>
          
          <h2 className="text-text-primary text-xl font-semibold tracking-tight animate-fade-in-up md:text-lg [animation-delay:0.35s]">
            Smart Learn Today
          </h2>
          <h1 className="text-[6rem] leading-[0.9] font-serif font-medium tracking-tighter text-text-primary">
            Smart Learn<sup className="text-4xl align-super">+</sup>
          </h1>
          
          <div className="h-[1px] w-2/3 bg-gray-200"></div>
          
          <h2 className="text-2xl text-text-secondary max-w-[500px] font-normal leading-relaxed">
            Harness AI-Powered Learning Tools — Up To 50× Faster.
          </h2>
          
          <div className="flex items-center gap-4 mt-2">
             <div className="relative">
                <img src="/human1.jpeg" alt="User review" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                <div className="absolute -top-1 -right-1">
                   <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                </div>
             </div>
             <div>
                <p className="text-sm font-medium">Loved the performance <span className="mx-2 text-gray-300">/</span> <span className="font-bold">★ 4.9</span></p>
                <p className="text-xs text-text-muted">100% Satisfied</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6 mt-4">
            <Link to="/sign-up" className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg">
              Download — It's Free
            </Link>
            <Link to="/pricing" className="text-sm font-semibold underline decoration-2 underline-offset-4 hover:text-indigo-600 transition-colors flex items-center gap-1">
              Our Pricing 
              <span className="text-lg">↗</span>
            </Link>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="flex-1 relative h-[600px] w-full flex items-center justify-center mt-10 lg:mt-0 animate-fade-in-right">
           {/* Orange Background Shape */}
           <div className="absolute top-10 right-10 w-[80%] h-[90%] bg-[#FF6B00] rounded-[3rem] -z-10 transform rotate-[-2deg]"></div>
           
           {/* Student Image */}
           <div className="relative z-10 h-[550px] overflow-visible">
              <img src="/human1.jpeg" alt="Student using app" className="h-full object-cover rounded-2xl relative z-10 mask-image-gradient" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} />
              
              {/* Floating Element 1 - Quiz */}
              <div className="absolute top-[20%] -left-[20%] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/40 animate-bounce-slow flex items-center gap-3">
                 <div className="w-6 h-6 bg-orange-500 rounded text-white flex items-center justify-center text-xs">✓</div>
                 <span className="text-sm font-medium text-gray-800">How is the quiz?</span>
              </div>
              
              {/* Floating Element 2 - Design */}
              <div className="absolute top-[35%] -left-[30%] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/40 animate-bounce-slower flex items-center gap-3">
                 <div className="w-6 h-6 bg-blue-500 rounded text-white flex items-center justify-center text-xs">✓</div>
                 <span className="text-sm font-medium text-gray-800">Do you understand?</span>
              </div>
              
              {/* Floating Element 3 - Play Button */}
              <div className="absolute top-[45%] left-[20%] w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                 <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
              </div>
              
              {/* Floating Card - Stats (Top Right) */}
              <div className="absolute top-[10%] -right-[10%] bg-white/40 backdrop-blur-xl border border-white/30 p-5 rounded-3xl w-48 shadow-glass">
                 <p className="text-xs text-black/60 font-semibold mb-1">— UP TO</p>
                 <p className="text-4xl font-bold text-black mb-1">60%</p>
                 <p className="text-xs text-black/70 leading-tight">More grades this week</p>
              </div>

               {/* Floating Card - Product (Bottom Right) */}
              <div className="absolute bottom-[10%] -right-[15%] bg-white/60 backdrop-blur-xl border border-white/40 p-4 rounded-3xl w-56 shadow-glass flex items-center gap-4">
                 <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                    <img src="/bot.png" alt="Bot" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="font-semibold text-sm">AI Tutor Bot</p>
                    <p className="text-sm text-gray-500">Premium</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold bg-black text-white px-1.5 py-0.5 rounded">★ 4.6</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto w-full animate-fade-in-up">
        <h2 className="text-4xl font-serif font-medium mb-16 text-center">Why Smart Learn Today?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-surface-secondary p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="h-48 w-full rounded-2xl mb-6 overflow-hidden">
                 <img src="/feature_ai_tutor.jpg" alt="AI Tutor" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personal AI Tutor</h3>
              <p className="text-text-secondary">Get help with any subject, anytime. Detailed explanations and step-by-step guidance.</p>
           </div>
           <div className="bg-surface-secondary p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="h-48 w-full rounded-2xl mb-6 overflow-hidden">
                 <img src="/feature_study_plans.jpg" alt="Study Plans" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Study Plans</h3>
              <p className="text-text-secondary">Stay organized with adaptive schedules that update based on your progress and deadlines.</p>
           </div>
           <div className="bg-surface-secondary p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
              <div className="h-48 w-full rounded-2xl mb-6 overflow-hidden">
                 <img src="/feature_quizzes.jpg" alt="Quizzes" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Quizzes</h3>
              <p className="text-text-secondary">Turn your notes into quizzes instantly. Master topics faster with active recall.</p>
           </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto w-full bg-surface-secondary rounded-[3rem] my-12 animate-fade-in-up">
        <h2 className="text-4xl font-serif font-medium mb-16 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-between relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 hidden md:block"></div>
             
             <div className="flex flex-col items-center text-center bg-surface-secondary z-10 p-4">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
                <h3 className="text-xl font-bold mb-2">Upload Material</h3>
                <p className="text-text-secondary text-sm max-w-xs">Upload your notes, PDFs, or Paste text.</p>
             </div>
             
             <div className="flex flex-col items-center text-center bg-surface-secondary z-10 p-4">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
                <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                <p className="text-text-secondary text-sm max-w-xs">Our AI analyzes and organizes your content.</p>
             </div>
             
             <div className="flex flex-col items-center text-center bg-surface-secondary z-10 p-4">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
                <h3 className="text-xl font-bold mb-2">Start Learning</h3>
                <p className="text-text-secondary text-sm max-w-xs">Chat, quiz, and study smarter.</p>
             </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 max-w-[1400px] mx-auto w-full animate-fade-in-up">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
             <h2 className="text-4xl font-serif font-medium mb-6">About Smart Learn Today</h2>
             <p className="text-lg text-text-secondary leading-relaxed mb-6">
               Smart Learn Today is more than just a study tool; it's your personal AI-powered tutor available 24/7. 
               We believe that every student deserves access to world-class education assistance, tailored to their unique learning style.
             </p>
             <p className="text-lg text-text-secondary leading-relaxed">
               Our mission is to democratize education through technology. By leveraging advanced artificial intelligence, 
               Smart Learn Today helps you understand complex concepts, retain information longer, and achieve your academic goals faster than ever before.
               Join millions of students who are already learning smarter, not harder.
             </p>
          </div>
          <div className="flex-1 relative h-[400px] w-full rounded-3xl overflow-hidden border border-gray-100">
             <img src="/about_learning.jpg" alt="Students learning together" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
