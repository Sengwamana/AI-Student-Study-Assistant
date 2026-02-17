import { Link } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";

const LandingNavbar = () => {
  const { userId, isLoaded } = useAuth();
  
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between py-4 px-8 max-w-[1400px] mx-auto w-full mt-4 rounded-full border border-white/20 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="flex items-center gap-2 font-bold text-2xl tracking-tight text-text-primary">
          <img src="/logo.png" alt="Smart Learn Today Logo" className="w-8 h-8 object-contain" />
          Smart Learn Today
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 font-medium text-text-secondary">
        <Link to="/product" className="hover:text-text-primary transition-colors">Product</Link>
        <span className="text-gray-300">•</span>
        <Link to="/solutions" className="hover:text-text-primary transition-colors">Solutions</Link>
        <span className="text-gray-300">•</span>
        <Link to="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
        <span className="text-gray-300">•</span>
        <Link to="/developers" className="hover:text-text-primary transition-colors">Developers</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 font-semibold">
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
    </nav>
  );
};

export default LandingNavbar;
