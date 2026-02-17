const features = [
  { img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop", title: "Keyboard Navigation", desc: "All interactive elements are accessible via keyboard" },
  { img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop", title: "Screen Reader Support", desc: "Semantic HTML and ARIA labels throughout" },
  { img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop", title: "Color Contrast", desc: "Text meets WCAG AA contrast ratios" },
  { img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop", title: "Responsive Design", desc: "Works on all screen sizes and orientations" },
  { img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop", title: "Form Labels", desc: "All form inputs have clear, descriptive labels" },
  { img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop", title: "Focus Indicators", desc: "Visible focus states for keyboard users" },
  { img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop", title: "Resizable Text", desc: "Content remains usable at 200% zoom" },
  { img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop", title: "Reduced Motion", desc: "Animations respect prefers-reduced-motion" },
];

const AccessibilityPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero */}
      <section className="relative text-center py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1400&h=600&fit=crop" 
          alt="Diverse people using technology" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-text-primary mb-4">Accessibility</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">Our commitment to making learning accessible to everyone.</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-[800px] mx-auto">
        <div className="space-y-8">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <p className="text-text-primary leading-relaxed">
              At Smart Learn Today, we believe education should be accessible to all students, regardless of ability. We are committed to ensuring our platform meets the needs of learners with diverse abilities and follows established accessibility standards.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">Our Standards</h2>
            <p className="text-text-secondary leading-relaxed">
              We strive to conform to the <strong className="text-text-primary">Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. Our team regularly audits the platform and works to address accessibility barriers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">What We've Implemented</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-28 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-text-primary text-sm">{item.title}</h3>
                    <p className="text-xs text-text-secondary mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">Known Limitations</h2>
            <p className="text-text-secondary leading-relaxed">
              We are continuously improving accessibility. Some areas we are actively working on include:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-text-secondary mt-3">
              <li>Enhanced screen reader support for AI-generated content with complex formatting</li>
              <li>Improved keyboard shortcuts for the quiz and flashcard interfaces</li>
              <li>Better alternative text for dynamically generated visual content</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">Assistive Technologies</h2>
            <p className="text-text-secondary leading-relaxed">
              Our platform is tested with the following assistive technologies:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-text-secondary mt-3">
              <li>NVDA and JAWS screen readers on Windows</li>
              <li>VoiceOver on macOS and iOS</li>
              <li>TalkBack on Android</li>
              <li>Browser zoom up to 200%</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">Feedback & Contact</h2>
            <p className="text-text-secondary leading-relaxed">
              If you encounter any accessibility barriers or have suggestions for improvement, we want to hear from you. Please contact our accessibility team at{" "}
              <a href="mailto:accessibility@smartlearntoday.com" className="text-indigo-600 hover:underline font-medium">accessibility@smartlearntoday.com</a>.
            </p>
            <p className="text-text-secondary leading-relaxed mt-3">
              We aim to respond to accessibility feedback within 5 business days and to resolve identified barriers within 30 days.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AccessibilityPage;
