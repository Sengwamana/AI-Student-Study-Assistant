import { Link } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { useState } from "react";

const LandingNavbar = () => {
  const { userId, isLoaded } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between py-3 px-4 sm:py-4 sm:px-8 max-w-[1400px] mx-auto w-full mt-2 sm:mt-4 rounded-full border border-white/20 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
          <span className="flex items-center gap-2 font-bold text-lg sm:text-2xl tracking-tight text-text-primary">
            <img src="/logo.png" alt="Smart Learn Today Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            <span className="hidden sm:inline">Smart Learn Today</span>
            <span className="sm:hidden">SLT</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-8 font-medium text-text-secondary">
          <Link to="/product" className="hover:text-text-primary transition-colors">Product</Link>
          <span className="text-gray-300">•</span>
          <Link to="/solutions" className="hover:text-text-primary transition-colors">Solutions</Link>
          <span className="text-gray-300">•</span>
          <Link to="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          <span className="text-gray-300">•</span>
          <Link to="/developers" className="hover:text-text-primary transition-colors">Developers</Link>
        </div>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center gap-6 font-semibold">
          {isLoaded && userId ? (
            <Link to="/dashboard" className="text-text-primary hover:text-indigo-600 transition-colors">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/sign-in" className="text-text-primary hover:text-indigo-600 transition-colors">
              Log in
            </Link>
          )}
          
          <Link 
            to={userId ? "/dashboard" : "/sign-up"} 
            className="px-6 py-2.5 rounded-full border border-gray-900 text-text-primary bg-transparent hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Get it Now — It's Free
          </Link>
        </div>

        {/* Hamburger Menu - Mobile */}
        <button 
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          {/* Close Button */}
          <button 
            className="self-end p-2 rounded-xl hover:bg-gray-100 transition-colors mb-6"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="text-2xl text-gray-600">✕</span>
          </button>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1">
            <Link 
              to="/product" 
              className="px-4 py-3.5 rounded-2xl text-gray-700 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
            </Link>
            <Link 
              to="/solutions" 
              className="px-4 py-3.5 rounded-2xl text-gray-700 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link 
              to="/pricing" 
              className="px-4 py-3.5 rounded-2xl text-gray-700 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/developers" 
              className="px-4 py-3.5 rounded-2xl text-gray-700 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Developers
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 my-6"></div>

          {/* Mobile Auth Actions */}
          <div className="flex flex-col gap-3">
            {isLoaded && userId ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-center hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/sign-in" 
                  className="px-4 py-3 border border-gray-200 rounded-2xl font-semibold text-center text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/sign-up" 
                  className="px-4 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-center hover:bg-gray-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started — Free
                </Link>
              </>
            )}
          </div>

          {/* Bottom Branding */}
          <div className="mt-auto flex items-center gap-3 pt-6">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-gray-900">Smart Learn Today</span>
              <span className="text-[11px] text-gray-400">AI-powered learning</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingNavbar;
