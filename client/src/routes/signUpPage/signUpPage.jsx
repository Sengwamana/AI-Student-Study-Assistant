import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white relative overflow-hidden">
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 items-center justify-center p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[15%] right-[10%] w-64 h-64 rounded-full border-2 border-white/30 animate-float-orb"></div>
          <div className="absolute bottom-[15%] left-[15%] w-48 h-48 rounded-full border-2 border-white/20 animate-float-orb-reverse"></div>
          <div className="absolute top-[55%] right-[55%] w-32 h-32 rounded-full border border-white/20 animate-float-orb"></div>
        </div>

        <div className="relative z-10 max-w-md text-white">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain brightness-200" />
            <span className="text-2xl font-bold tracking-tight">Smart Learn Today</span>
          </Link>
          
          <h2 className="text-4xl font-serif font-bold leading-tight mb-6">
            Start your AI-powered learning today
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-10">
            Join millions of students who are learning smarter, not harder. Get instant access to your personal AI tutor.
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-white/80">Personal AI Tutor available 24/7</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-white/80">Smart quizzes from your own notes</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-white/80">Track your progress and stay on top</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold tracking-tight text-gray-900">Smart Learn Today</span>
        </div>

        {/* Background orbs for mobile */}
        <div className="absolute -top-[20%] -right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)] rounded-full pointer-events-none animate-float-orb lg:hidden"></div>
        <div className="absolute -bottom-[15%] -left-[10%] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_70%)] rounded-full pointer-events-none animate-float-orb-reverse lg:hidden"></div>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-500">Get started for free — no credit card required</p>
          </div>
          
          <SignUp
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0 w-full",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
