import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";

const navItems = [
  {
    label: "Product",
    children: [
      { to: "/product", label: "Features", desc: "AI tutor, quizzes, flashcards & more" },
      { to: "/pricing", label: "Pricing", desc: "Free & premium plans" },
      { to: "/developers", label: "Developers", desc: "API docs & integrations" },
    ],
  },
  {
    label: "Solutions",
    to: "/solutions",
  },
  {
    label: "Company",
    children: [
      { to: "/about", label: "About Us", desc: "Our story, team & values" },
      { to: "/careers", label: "Careers", desc: "Join our growing team" },
      { to: "/blog", label: "Blog", desc: "Tips, updates & insights" },
      { to: "/contact", label: "Contact", desc: "Get in touch with us" },
      { to: "/press", label: "Press Kit", desc: "Media assets & news" },
    ],
  },
  {
    label: "Resources",
    children: [
      { to: "/privacy", label: "Privacy Policy", desc: "How we handle your data" },
      { to: "/terms", label: "Terms of Service", desc: "Rules for using our platform" },
      { to: "/cookies", label: "Cookie Policy", desc: "How we use cookies" },
      { to: "/accessibility", label: "Accessibility", desc: "Our commitment to access" },
    ],
  },
];

/* Desktop Dropdown */
const DesktopDropdown = ({ item }) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef(null);

  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  if (!item.children) {
    return (
      <Link to={item.to} className="hover:text-text-primary transition-colors py-2">
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className="flex items-center gap-1 hover:text-text-primary transition-colors py-2"
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[260px]">
          {item.children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              className="flex flex-col px-4 py-3 rounded-xl hover:bg-indigo-50 transition-colors group"
              onClick={() => setOpen(false)}
            >
              <span className="font-semibold text-sm text-text-primary group-hover:text-indigo-600 transition-colors">{child.label}</span>
              <span className="text-xs text-text-muted mt-0.5">{child.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Mobile Accordion Section */
const MobileSection = ({ item, onClose }) => {
  const [expanded, setExpanded] = useState(false);

  if (!item.children) {
    return (
      <Link
        to={item.to}
        className="px-4 py-3.5 rounded-2xl text-gray-700 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all"
        onClick={onClose}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-gray-700 font-semibold text-base hover:bg-indigo-50 hover:text-indigo-600 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        {item.label}
        <svg className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="pl-4 space-y-0.5 pb-2">
          {item.children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              onClick={onClose}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingNavbar = () => {
  const { userId, isLoaded } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between py-3 px-4 sm:py-4 sm:px-8 max-w-[1400px] mx-auto w-full mt-2 sm:mt-4 rounded-full border border-white/20 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMobile}>
          <span className="flex items-center gap-2 font-bold text-lg sm:text-2xl tracking-tight text-text-primary">
            <img src="/logo.png" alt="Smart Learn Today Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            <span className="hidden sm:inline">Smart Learn Today</span>
            <span className="sm:hidden">SLT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 font-medium text-sm text-text-secondary">
          {navItems.map((item) => (
            <DesktopDropdown key={item.label} item={item} />
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5 font-semibold text-sm">
          {isLoaded && userId ? (
            <Link to="/dashboard" className="text-text-primary hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link to="/sign-in" className="text-text-primary hover:text-indigo-600 transition-colors">
              Log in
            </Link>
          )}
          <Link
            to={userId ? "/dashboard" : "/sign-up"}
            className="px-5 py-2.5 rounded-full border border-gray-900 text-text-primary bg-transparent hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Get Started Free
          </Link>
        </div>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden animate-fade-in" onClick={closeMobile}></div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className="font-bold text-lg text-gray-900">Menu</span>
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav Sections */}
          <div className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <MobileSection key={item.label} item={item} onClose={closeMobile} />
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mx-4"></div>

          {/* Auth Actions */}
          <div className="p-4 space-y-3">
            {isLoaded && userId ? (
              <Link
                to="/dashboard"
                className="block px-4 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-center hover:bg-gray-800 transition-colors"
                onClick={closeMobile}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="block px-4 py-3 border border-gray-200 rounded-2xl font-semibold text-center text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={closeMobile}
                >
                  Log in
                </Link>
                <Link
                  to="/sign-up"
                  className="block px-4 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-center hover:bg-gray-800 transition-colors"
                  onClick={closeMobile}
                >
                  Get Started — Free
                </Link>
              </>
            )}
          </div>

          {/* Bottom Branding */}
          <div className="flex items-center gap-3 p-4 border-t border-gray-100">
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
