
const ProductPage = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in-up">
      <h1 className="text-5xl font-serif font-medium mb-4">Product</h1>
      <p className="text-xl text-text-secondary max-w-2xl">
        Explore the features that make Smart Learn Today the ultimate AI study companion.
      </p>
      
      <div className="flex flex-col gap-24 mt-16 max-w-7xl w-full">
         {/* AI Tutor Section */}
         <div className="flex flex-col md:flex-row gap-12 items-center text-left">
            <div className="flex-1">
               <div className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">24/7 Assistance</div>
               <h2 className="text-4xl font-bold mb-6 text-text-primary">Your Personal AI Tutor</h2>
               <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  Stuck on a tough problem? Our advanced AI tutor is always ready to help. 
                  Get step-by-step explanations, clarify complex concepts, and receive instant feedback on your work. 
                  It's like having a professor in your pocket, available whenever you need them.
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Instant answers to any question
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Step-by-step problem solving
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Customized explanations for your level
                  </li>
               </ul>
            </div>
            <div className="flex-1 h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/50">
               <img src="/product_ai_tutor.jpg" alt="AI Tutor Interface" className="w-full h-full object-cover" />
            </div>
         </div>

         {/* Study Plans Section */}
         <div className="flex flex-col md:flex-row-reverse gap-12 items-center text-left">
            <div className="flex-1">
               <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-4">Smart Planning</div>
               <h2 className="text-4xl font-bold mb-6 text-text-primary">Adaptive Study Schedules</h2>
               <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  Stop worrying about what to study next. Smart Learn Today analyzes your exams, deadlines, and learning pace 
                  to create the perfect study schedule. Stay organized, minimize stress, and ensure you're always prepared.
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Dynamic adjustments based on progress
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Integration with your calendar
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Reminders and motivation
                  </li>
               </ul>
            </div>
            <div className="flex-1 h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/50">
               <img src="/product_study_plans.jpg" alt="Study Plan Interface" className="w-full h-full object-cover" />
            </div>
         </div>

         {/* Smart Quizzes Section */}
         <div className="flex flex-col md:flex-row gap-12 items-center text-left">
            <div className="flex-1">
               <div className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-4">Active Recall</div>
               <h2 className="text-4xl font-bold mb-6 text-text-primary">Auto-Generated Quizzes</h2>
               <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  Transform your notes into interactive quizzes in seconds. Use active recall and spaced repetition 
                  to lock information into your long-term memory. Identify your weak spots and turn them into strengths.
               </p>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Quizzes created instantly from any content
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Detailed performance analytics
                  </li>
                  <li className="flex items-center gap-3 text-text-primary font-medium">
                     <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">✓</span>
                     Gamified learning experience
                  </li>
               </ul>
            </div>
            <div className="flex-1 h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-xl shadow-gray-200/50">
               <img src="/product_quizzes.jpg" alt="Quiz Interface" className="w-full h-full object-cover" />
            </div>
         </div>
      </div>
    </main>
  );
};

export default ProductPage;
