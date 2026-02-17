import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative mt-16 sm:mt-24 border-t border-gray-200/60 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="py-12 sm:py-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 mb-4 lg:mb-0">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight text-text-primary">Smart Learn Today</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs mb-6">
              Your personal AI study assistant that helps you understand concepts, ace exams, and learn smarter — not harder.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-bold text-sm text-text-primary mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/product" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link to="/product" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">AI Tutor</Link></li>
              <li><Link to="/product" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Quizzes</Link></li>
              <li><Link to="/product" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Flashcards</Link></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="font-bold text-sm text-text-primary mb-4 uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-3">
              <li><Link to="/solutions" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">For Students</Link></li>
              <li><Link to="/solutions" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">For Educators</Link></li>
              <li><Link to="/solutions" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">For Institutions</Link></li>
              <li><Link to="/developers" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">API & Developers</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-sm text-text-primary mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><Link to="/press" className="text-sm text-text-secondary hover:text-indigo-600 transition-colors">Press Kit</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Bar */}
        <div className="py-8 border-t border-gray-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-sm text-text-primary mb-1">Stay in the loop</h4>
            <p className="text-xs text-text-muted">Get study tips, product updates, and learning insights — zero spam.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="you@university.edu" 
              className="flex-1 md:w-64 px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400"
            />
            <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all hover:-translate-y-px hover:shadow-lg shrink-0">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} Smart Learn Today. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link>
            <Link to="/accessibility" className="hover:text-indigo-600 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
