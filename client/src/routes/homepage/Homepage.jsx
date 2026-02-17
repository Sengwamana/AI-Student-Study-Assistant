import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("student");

  return (
    <div className="flex items-center justify-center gap-16 h-full bg-surface relative overflow-hidden transition-colors duration-300 lg:flex-col lg:gap-12 lg:p-12 lg:px-6">
      {/* Background Orbs */}
      <div className="absolute -top-1/2 -right-[20%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-[30%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none animate-pulse"></div>
      
      <img src="/orbital.png" alt="" className="absolute bottom-0 left-0 opacity-[0.015] -z-10 animate-rotate-orbital" aria-hidden="true" />
      
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center relative z-10 animate-fade-in-left">
        <h1 className="text-8xl font-extrabold italic tracking-tighter leading-[1.1] bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent inline-block -mt-10 animate-title-reveal xl:text-7xl xl:-mt-8 md:text-5xl md:tracking-normal md:-mt-5 px-2">
          Study Smart
        </h1>
        <h2 className="text-text-primary text-xl font-semibold tracking-tight animate-fade-in-up md:text-lg [animation-delay:0.35s]">
          AI Student Study Assistant
        </h2>
        <h3 className="font-normal max-w-[440px] text-text-secondary text-base leading-7 animate-fade-in-up lg:max-w-full [animation-delay:0.45s]">
          Your AI-powered study companion designed to help students learn more effectively. 
          Get instant explanations tailored to your education level, summarize complex notes 
          into key points, and generate practice quizzes to test your understanding.
        </h3>
        <Link to="/dashboard" className="py-3.5 px-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-full text-[15px] font-semibold mt-3 transition-all duration-300 shadow-lg shadow-indigo-500/35 relative overflow-hidden hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/50 hover:bg-gradient-to-br hover:from-violet-500 hover:to-purple-500 active:-translate-y-0.5 active:scale-100 animate-fade-in-up [animation-delay:0.55s] group">
          <span className="relative z-10">Get Started</span>
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500 ease-in-out group-hover:left-full"></div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center h-full relative z-10 animate-fade-in-right">
        <div className="flex items-center justify-center bg-surface rounded-[2rem] w-[80%] h-[50%] relative border border-gray-200 dark:border-gray-800 shadow-xl overflow-visible">
          <div className="w-full h-full overflow-hidden absolute top-0 left-0 rounded-[2rem]">
            <div className="bg-[url('/bg.png')] opacity-5 w-[200%] h-full bg-auto animate-slide-bg"></div>
          </div>
          <img src="/bot.png" alt="AI Study Assistant Bot" className="w-full h-full object-contain animate-bot-animate drop-shadow-xl relative z-10" />
          <div className="absolute -bottom-5 -right-8 flex items-center gap-3 py-3.5 px-5 bg-surface rounded-2xl text-text-primary shadow-md border border-gray-200 dark:border-gray-800 text-sm font-medium lg:hidden xl:right-0 animate-fade-in-up [animation-delay:0.5s]">
            <img
              src={
                typingStatus === "student"
                  ? "/human1.jpeg"
                  : "/bot.png"
              }
              alt="Chat avatar"
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
            <TypeAnimation
              sequence={[
                "Student: I don't understand photosynthesis...",
                2000,
                () => setTypingStatus("ai"),
                "AI: Here's a simple explanation! 🌱",
                2000,
                () => setTypingStatus("student"),
                "Student: Can you summarize this chapter?",
                2000,
                () => setTypingStatus("ai"),
                "AI: Here are 5 key points 📝",
                2000,
                () => setTypingStatus("student"),
                "Student: I have a test tomorrow!",
                2000,
                () => setTypingStatus("ai"),
                "AI: Let me create a practice quiz 📋",
                2000,
                () => setTypingStatus("student"),
                "Student: Explain at my level please",
                2000,
                () => setTypingStatus("ai"),
                "AI: Here's an easier explanation 🎓",
                2000,
                () => setTypingStatus("student"),
              ]}
              wrapper="span"
              speed={40}
              deletionSpeed={60}
              repeat={Infinity}
              cursor={true}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3.5 z-10">
        <img src="/logo.png" alt="" className="w-4 h-4 opacity-40 grayscale" aria-hidden="true" />
        <div className="flex gap-5 text-gray-400 text-xs font-medium">
          <Link to="/" className="hover:text-text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-accent after:transition-all hover:after:w-full">Terms of Service</Link>
          <span>|</span>
          <Link to="/" className="hover:text-text-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-accent after:transition-all hover:after:w-full">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
