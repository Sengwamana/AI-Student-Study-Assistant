const CookiePolicyPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero */}
      <section className="text-center py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-text-primary mb-4">Cookie Policy</h1>
        <p className="text-text-secondary">Last updated: February 18, 2026</p>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-[800px] mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">1. What Are Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, keep you signed in, and understand how you use the platform. Smart Learn Today uses cookies to provide you with a better, more personalized learning experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">2. Types of Cookies We Use</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Purpose</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">Essential</td>
                    <td className="py-3 px-4 text-text-secondary">Authentication, security, and core functionality</td>
                    <td className="py-3 px-4 text-text-muted">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">Functional</td>
                    <td className="py-3 px-4 text-text-secondary">Remember preferences like theme, language, and education level</td>
                    <td className="py-3 px-4 text-text-muted">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">Analytics</td>
                    <td className="py-3 px-4 text-text-secondary">Understand usage patterns to improve the Service</td>
                    <td className="py-3 px-4 text-text-muted">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">Performance</td>
                    <td className="py-3 px-4 text-text-secondary">Monitor page load times and Service reliability</td>
                    <td className="py-3 px-4 text-text-muted">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">3. Third-Party Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              We use services from trusted third parties that may set their own cookies, including:
            </p>
            <ul className="list-disc list-outside ml-6 space-y-2 text-text-secondary mt-3">
              <li><strong className="text-text-primary">Clerk:</strong> Authentication and user session management</li>
              <li><strong className="text-text-primary">Google Analytics:</strong> Anonymized usage statistics</li>
              <li><strong className="text-text-primary">Sentry:</strong> Error tracking and performance monitoring</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">4. Managing Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, disabling essential cookies may prevent you from using certain features of the Service, such as staying logged in.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">5. Updates to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Cookie Policy periodically. Changes will be posted on this page with an updated "Last updated" date.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-text-primary mb-3">6. Contact Us</h2>
            <p className="text-text-secondary leading-relaxed">
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:privacy@smartlearntoday.com" className="text-indigo-600 hover:underline font-medium">privacy@smartlearntoday.com</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CookiePolicyPage;
