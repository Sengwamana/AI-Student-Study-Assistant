
const PricingPage = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in-up">
      <h1 className="text-5xl font-serif font-medium mb-4">Pricing</h1>
      <p className="text-xl text-text-secondary max-w-2xl">
        Simple, transparent pricing. Start for free, upgrade for more.
      </p>
      
      <div className="flex flex-col gap-24 mt-16 max-w-7xl w-full">
         
         {/* Pricing Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
             {/* Free Plan */}
             <div className="p-8 rounded-3xl border border-gray-200 bg-surface flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-text-secondary text-sm mb-6">Essential study tools for everyone.</p>
                <div className="mb-6"><span className="text-4xl font-bold">$0</span><span className="text-text-secondary">/mo</span></div>
                <button className="w-full py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-colors mb-8">Get Started</button>
                <ul className="space-y-4 text-sm text-left text-text-secondary flex-1">
                   <li className="flex gap-3">✓ Basic AI Chat (GPT-3.5)</li>
                   <li className="flex gap-3">✓ 5 Flashcard sets</li>
                   <li className="flex gap-3">✓ Limited Note Summaries</li>
                   <li className="flex gap-3">✓ Community Support</li>
                </ul>
             </div>
             
             {/* Pro Plan */}
             <div className="p-8 rounded-3xl border border-indigo-500 bg-surface relative shadow-xl shadow-indigo-100 transform md:-translate-y-4 flex flex-col h-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <p className="text-text-secondary text-sm mb-6">Advanced power for serious students.</p>
                <div className="mb-6"><span className="text-4xl font-bold">$9</span><span className="text-text-secondary">/mo</span></div>
                <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mb-8">Upgrade to Pro</button>
                <ul className="space-y-4 text-sm text-left text-text-secondary flex-1">
                   <li className="flex gap-3 items-center"><span className="text-indigo-600 font-bold">✓</span> Unlimited AI Chat (GPT-4)</li>
                   <li className="flex gap-3 items-center"><span className="text-indigo-600 font-bold">✓</span> Advanced Study Plans</li>
                   <li className="flex gap-3 items-center"><span className="text-indigo-600 font-bold">✓</span> Unlimited Quizzes</li>
                   <li className="flex gap-3 items-center"><span className="text-indigo-600 font-bold">✓</span> Priority Support</li>
                   <li className="flex gap-3 items-center"><span className="text-indigo-600 font-bold">✓</span> Offline Mode</li>
                </ul>
             </div>
             
             {/* Team Plan */}
             <div className="p-8 rounded-3xl border border-gray-200 bg-surface flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">Team</h3>
                <p className="text-text-secondary text-sm mb-6">For study groups and classrooms.</p>
                <div className="mb-6"><span className="text-4xl font-bold">$19</span><span className="text-text-secondary">/mo</span></div>
                <button className="w-full py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-colors mb-8">Contact Sales</button>
                <ul className="space-y-4 text-sm text-left text-text-secondary flex-1">
                   <li className="flex gap-3">✓ Everything in Pro</li>
                   <li className="flex gap-3">✓ Collaborative workspaces</li>
                   <li className="flex gap-3">✓ Admin analytics dashboard</li>
                   <li className="flex gap-3">✓ Bulk billing management</li>
                   <li className="flex gap-3">✓ Dedicated Account Manager</li>
                </ul>
             </div>
          </div>

          {/* Compare Plans Table */}
          <div className="text-left">
             <h2 className="text-3xl font-bold mb-8 text-center">Compare Plans</h2>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-gray-200">
                         <th className="py-4 px-6 text-sm font-semibold text-text-secondary w-1/3">Feature</th>
                         <th className="py-4 px-6 text-sm font-semibold text-center w-1/6">Free</th>
                         <th className="py-4 px-6 text-sm font-semibold text-center text-indigo-600 w-1/6">Pro</th>
                         <th className="py-4 px-6 text-sm font-semibold text-center w-1/6">Team</th>
                      </tr>
                   </thead>
                   <tbody className="text-sm">
                      <tr className="border-b border-gray-100">
                         <td className="py-4 px-6 font-medium">AI Model</td>
                         <td className="py-4 px-6 text-center text-text-secondary">Basic</td>
                         <td className="py-4 px-6 text-center font-bold text-indigo-600">Advanced</td>
                         <td className="py-4 px-6 text-center text-text-primary">Advanced</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                         <td className="py-4 px-6 font-medium">Flashcards</td>
                         <td className="py-4 px-6 text-center text-text-secondary">5 Sets</td>
                         <td className="py-4 px-6 text-center font-bold text-indigo-600">Unlimited</td>
                         <td className="py-4 px-6 text-center text-text-primary">Unlimited</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                         <td className="py-4 px-6 font-medium">Study Plans</td>
                         <td className="py-4 px-6 text-center text-text-secondary">Basic</td>
                         <td className="py-4 px-6 text-center font-bold text-indigo-600">Adaptive</td>
                         <td className="py-4 px-6 text-center text-text-primary">Adaptive + Shared</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                         <td className="py-4 px-6 font-medium">Analytics</td>
                         <td className="py-4 px-6 text-center text-text-secondary">None</td>
                         <td className="py-4 px-6 text-center font-bold text-indigo-600">Personal</td>
                         <td className="py-4 px-6 text-center text-text-primary">Group + Admin</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto w-full text-left">
             <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
             <div className="space-y-6">
                <div className="bg-surface-secondary p-6 rounded-2xl">
                   <h4 className="font-bold mb-2">Can I switch plans later?</h4>
                   <p className="text-text-secondary text-sm">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
                </div>
                <div className="bg-surface-secondary p-6 rounded-2xl">
                   <h4 className="font-bold mb-2">Is there a student discount?</h4>
                   <p className="text-text-secondary text-sm">The Pro plan is already discounted for students. However, we offer additional discounts for annual billing.</p>
                </div>
                <div className="bg-surface-secondary p-6 rounded-2xl">
                   <h4 className="font-bold mb-2">What payment methods do you accept?</h4>
                   <p className="text-text-secondary text-sm">We accept all major credit cards, PayPal, and Apple Pay.</p>
                </div>
             </div>
          </div>

      </div>
    </main>
  );
};

export default PricingPage;
