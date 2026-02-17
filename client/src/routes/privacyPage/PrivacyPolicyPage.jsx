const PrivacyPolicyPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero */}
      <section className="text-center py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-text-primary mb-4">Privacy Policy</h1>
        <p className="text-text-secondary">Last updated: February 18, 2026</p>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-[800px] mx-auto">
        <div className="prose-custom space-y-8">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">1. Introduction</h2>
            <p className="text-text-secondary leading-relaxed">
              Smart Learn Today ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website, mobile applications, and AI-powered study tools (collectively, the "Service").
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">2. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed mb-3">We collect the following types of information:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-text-secondary">
              <li><strong className="text-text-primary">Account Information:</strong> Name, email address, and profile details when you create an account.</li>
              <li><strong className="text-text-primary">Study Content:</strong> Notes, uploaded documents, and questions you submit to our AI tutor.</li>
              <li><strong className="text-text-primary">Usage Data:</strong> How you interact with the Service, including session duration, features used, and learning progress.</li>
              <li><strong className="text-text-primary">Device Information:</strong> Browser type, operating system, and device identifiers.</li>
              <li><strong className="text-text-primary">Cookies:</strong> Small files stored on your device to improve your experience (see our Cookie Policy).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-outside ml-6 space-y-2 text-text-secondary">
              <li>Provide, maintain, and improve the Service</li>
              <li>Personalize your learning experience with our AI tutor</li>
              <li>Generate quizzes, flashcards, and summaries from your content</li>
              <li>Track your study progress and streaks</li>
              <li>Send you product updates and educational content (with your consent)</li>
              <li>Detect and prevent fraud or misuse</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">4. Data Sharing</h2>
            <p className="text-text-secondary leading-relaxed">
              We do <strong className="text-text-primary">not</strong> sell your personal information. We may share data with trusted service providers who help us operate the Service (e.g., hosting, analytics, authentication), and only as required by law or to protect our rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">5. Data Security</h2>
            <p className="text-text-secondary leading-relaxed">
              We use industry-standard encryption (TLS/SSL) and security measures to protect your data. Your study notes and AI conversations are encrypted at rest and in transit. We conduct regular security audits and penetration testing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">6. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-text-secondary">
              <li>Access, correct, or delete your personal data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">7. Data Retention</h2>
            <p className="text-text-secondary leading-relaxed">
              We retain your data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where we're required by law to retain it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">8. Children's Privacy</h2>
            <p className="text-text-secondary leading-relaxed">
              Our Service is not directed to children under 13. If we learn we have collected data from a child under 13 without parental consent, we will delete it promptly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">9. Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              For privacy-related questions or requests, please contact us at{" "}
              <a href="mailto:privacy@smartlearntoday.com" className="text-indigo-600 hover:underline font-medium">privacy@smartlearntoday.com</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
