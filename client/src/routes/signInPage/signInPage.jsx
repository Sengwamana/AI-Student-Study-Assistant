import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white relative overflow-x-hidden">
      
      {/* Left Side - Branding (Desktop only) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 items-center justify-center p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full border-2 border-white/30 animate-float-orb"></div>
          <div className="absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full border-2 border-white/20 animate-float-orb-reverse"></div>
          <div className="absolute top-[50%] left-[60%] w-32 h-32 rounded-full border border-white/20 animate-float-orb"></div>
        </div>

        <div className="relative z-10 max-w-md text-white">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain brightness-200" />
            <span className="text-2xl font-bold tracking-tight">Smart Learn Today</span>
          </Link>
          
          <h2 className="text-4xl font-serif font-bold leading-tight mb-6">
            Welcome back to your learning journey
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-10">
            Continue where you left off. Your AI tutor is ready to help you ace your studies.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold">20M+</p>
              <p className="text-sm text-white/50">Active students</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.9★</p>
              <p className="text-sm text-white/50">User rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold">60%</p>
              <p className="text-sm text-white/50">Better grades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center px-4 sm:px-8 md:px-12 py-6 sm:py-8 lg:py-12 relative overflow-y-auto">
        
        {/* Mobile Top Bar with Logo & Back Link */}
        <div className="lg:hidden flex items-center justify-between w-full max-w-md mb-6 sm:mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900">Smart Learn Today</span>
          </Link>
          <Link to="/" className="text-xs sm:text-sm text-gray-400 hover:text-indigo-600 transition-colors font-medium">
            ← Home
          </Link>
        </div>

        {/* Background orbs for mobile */}
        <div className="absolute -top-[20%] -right-[10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] rounded-full pointer-events-none animate-float-orb lg:hidden"></div>
        <div className="absolute -bottom-[15%] -left-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,transparent_70%)] rounded-full pointer-events-none animate-float-orb-reverse lg:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-5 sm:mb-8 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Sign in</h1>
            <p className="text-sm sm:text-base text-gray-500">Enter your credentials to access your account</p>
          </div>
          
          <SignIn
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0 w-full",
              }
            }}
          />
        </div>

        {/* Mobile bottom spacing */}
        <div className="h-6 sm:h-8 lg:hidden shrink-0"></div>
      </div>
    </div>
  );
};

export default SignInPage;
