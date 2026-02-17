import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden">
        
        {/* Background Gradient Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-[100px] animate-float-orb"></div>
          <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-200/30 blur-[120px] animate-float-orb-reverse"></div>
          <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-200/20 blur-[80px] animate-float-orb"></div>
        </div>

        {/* Trust Badge */}
        <div className="animate-fade-in-up mb-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 bg-white/70 backdrop-blur-md rounded-full border border-gray-200/60 shadow-soft">
            <div className="flex -space-x-2">
              <img src="/human1.jpeg" alt="User" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover" />
              <img src="/human2.jpeg" alt="User" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover" />
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold">+20M</div>
            </div>
            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
            <span className="text-xs sm:text-sm font-semibold text-text-primary">Trusted by 20M+ students</span>
            <span className="text-xs sm:text-sm font-bold text-amber-500">★ 4.9</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto animate-title-reveal">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold tracking-tight leading-[0.95] text-text-primary mb-4 sm:mb-6">
            Learn Smarter
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
              with AI
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal animate-fade-in-up px-2" style={{ animationDelay: '0.3s' }}>
            Your personal AI study assistant that helps you understand concepts, 
            ace exams, and learn up to <strong className="text-text-primary">50× faster</strong>.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 sm:mt-10 animate-fade-in-up w-full sm:w-auto px-4 sm:px-0" style={{ animationDelay: '0.5s' }}>
          <Link to="/sign-up" className="group relative w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gray-900 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
            Get Started — It's Free
            <span className="absolute inset-0 rounded-full border border-white/20"></span>
          </Link>
          <Link to="/product" className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white/60 backdrop-blur-sm text-text-primary rounded-full font-semibold text-base sm:text-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            See How It Works
          </Link>
        </div>

        {/* Hero Visual Composition */}
        <div className="relative mt-10 sm:mt-16 w-full max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          
          {/* Main Image Container */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/40 aspect-[16/9]">
            <img src="/feature_ai_tutor.jpg" alt="Smart Learn Today Platform" className="w-full h-full object-cover" />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* Bottom Bar - Inside Image */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-lg">
                <div className="w-10 h-10 rounded-xl overflow-hidden">
                  <img src="/bot.png" alt="AI Bot" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">AI Tutor is ready</p>
                  <p className="text-xs text-gray-500">Ask me anything about your studies</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">Online now</span>
              </div>
            </div>
          </div>

          {/* Floating Card - Stats (Top Left) */}
          <div className="absolute -top-4 -left-2 sm:-top-6 sm:-left-6 md:-left-12 bg-white/80 backdrop-blur-xl border border-white/50 p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-glass animate-bounce-slow z-10">
            <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Grades Improved</p>
            <p className="text-2xl sm:text-4xl font-bold text-indigo-600">+60%</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">This semester</p>
          </div>

          {/* Floating Card - Quiz Score (Top Right) */}
          <div className="absolute -top-3 -right-1 sm:-top-4 sm:-right-4 md:-right-10 bg-white/80 backdrop-blur-xl border border-white/50 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-glass animate-bounce-slower z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm sm:text-lg">A+</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">Quiz Complete!</p>
                <p className="text-[10px] sm:text-xs text-gray-400">98% accuracy</p>
              </div>
            </div>
          </div>

          {/* Floating Card - Study Streak (Bottom Left) */}
          <div className="hidden md:block absolute -bottom-6 left-[15%] bg-white/80 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-glass animate-bounce-slower z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-orange-500 text-xl">🔥</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">12 Day Streak!</p>
                <p className="text-xs text-gray-400">Keep it going</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-10 sm:py-20 px-4 sm:px-6 max-w-[1400px] mx-auto w-full animate-fade-in-up">
        <h2 className="text-2xl sm:text-4xl font-serif font-medium mb-8 sm:mb-16 text-center">Why Smart Learn Today?</h2>
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
      <section className="py-10 sm:py-20 px-4 sm:px-6 max-w-[1400px] mx-auto w-full bg-surface-secondary rounded-2xl sm:rounded-[3rem] mx-2 sm:mx-auto my-6 sm:my-12 animate-fade-in-up">
        <h2 className="text-2xl sm:text-4xl font-serif font-medium mb-8 sm:mb-16 text-center">How It Works</h2>
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
      <section className="py-10 sm:py-20 px-4 sm:px-6 max-w-[1400px] mx-auto w-full animate-fade-in-up">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
          <div className="flex-1">
             <h2 className="text-2xl sm:text-4xl font-serif font-medium mb-4 sm:mb-6">About Smart Learn Today</h2>
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
          <div className="flex-1 relative h-[250px] sm:h-[400px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100">
             <img src="/about_learning.jpg" alt="Students learning together" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
