import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-10 sm:mt-20 border-t border-white/20 bg-white/40 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-primary">Smart Learn Today</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium text-text-secondary">
          <Link to="/product" className="hover:text-indigo-600 transition-colors">Product</Link>
          <Link to="/solutions" className="hover:text-indigo-600 transition-colors">Solutions</Link>
          <Link to="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link to="/developers" className="hover:text-indigo-600 transition-colors">Developers</Link>
        </div>

        {/* Social / Copyright */}
        <div className="text-sm text-text-muted">
          © {new Date().getFullYear()} Smart Learn Today. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
